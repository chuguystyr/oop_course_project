const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(morgan('combined'));
const port = 3001;

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'server',
  password: '65537',
  database: 'scripti_db',
  authPlugins: ['mysql_native_password']
});

function generateToken(user) {
  const payload = { userId: user.user_id };
  const token = jwt.sign(payload, '8Ddw595dd2b31n1frt6u410d1f', { expiresIn: '6h' });
  return token;
}

function authenticateToken(req, res) {
  const token = req.headers.authentication;
  if (token == null) return res.sendStatus(401);
  return new Promise((resolve, reject) => {
    jwt.verify(token, '8Ddw595dd2b31n1frt6u410d1f', (err, user) => {
      if (err) return reject(new Error('Failed to authenticate token'));
      resolve(user.userId);
    });
  });
}

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Query the database to check if the user's login credentials are valid
  const sql = 'SELECT user_id FROM users WHERE user_name = ? AND user_password = ?';
  const values = [username, password];
  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length > 0) {
      const user = results[0];
      const token = generateToken(user);
      res.json({ message: 'Login successful', token: token });
    } else {
      res.status(401).json({ message: 'Incorrect email or password' });
    }
  });
});
// Handle signup request
app.post('/signup', (req, res) => {
  const { email, username, password } = req.body;
  // Query the database to check if the user's login credentials are valid
  const sql = 'INSERT INTO users (user_email, user_name, user_password) VALUES (?, ?, ?);';
  const values = [email, username, password];
  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Sign Up successful' });
    }
  });
});
// Handle request for schedules
const { Router } = require('express');
const router = Router();
const { promisify } = require('util');
const query = promisify(connection.query).bind(connection);

async function getUserSchedules(req, res) {
  const userId = await authenticateToken(req, res);
  const today = new Date().getDay();
  try {
    const results = await query('SELECT d.id FROM days d JOIN schedules s ON d.schedule_id = s.id JOIN users u ON s.user_id = u.user_id WHERE u.user_id = ? AND d.day_of_week = ? AND CURRENT_DATE BETWEEN s.start_date AND s.end_date;', [userId, today]);
    const dayId = [results[0].id, results[1].id];
    const courses1 = await getCoursesForDay(dayId[0]);
    const courses2 = await getCoursesForDay(dayId[1]);
    const courses = courses1.concat(courses2);
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getCoursesForDay(dayId) {
  const results = await query('SELECT * FROM courses_per_day WHERE day_id = ?', [dayId]);
  const courses = await Promise.all(results.map((result) => {
    const { course_id, start_time } = result;
    return getCourse(course_id, dayId, start_time);
  }));
  return courses;
}

async function getCourse(courseId, dayId, start_time) {
  const results = await query('SELECT c.*, cpd.start_time, cpd.cabinet FROM courses_per_day cpd JOIN courses c ON cpd.course_id = c.course_id WHERE c.course_id = ? AND cpd.day_id = ? AND cpd.start_time = ?;', [courseId, dayId, start_time]);
  return results[0];
}

async function getUserAssignments(req, res) {
  const userId = await authenticateToken(req, res);
  const flag = req.header("Flag");
  if (flag) {
    try {
      const assignments = await query('SELECT a.id, a.title, a.details, date_format(a.deadline, \'%d.%m.%y\') as deadline, a.status, a.course_id, c.course_title, s.id as schedule_id FROM assignments a JOIN courses c ON a.course_id = c.course_id JOIN schedules s ON s.id = c.schedule_id JOIN users u ON u.user_id = s.user_id WHERE u.user_id = ? ORDER BY deadline;', userId);
      res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  } } else {
    try {
      const assignments = await query('SELECT a.id, a.title, a.details, date_format(a.deadline, \'%d.%m.%y\') as deadline, a.status, a.course_id, c.course_title, s.id as schedule_id FROM assignments a JOIN courses c ON a.course_id = c.course_id JOIN schedules s ON s.id = c.schedule_id JOIN users u ON u.user_id = s.user_id WHERE u.user_id = ? AND ( a.status = \'виконується\' OR a.status = \'нове\') ORDER BY deadline ASC LIMIT 6;', userId);
      res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

async function getStatistics(req, res) {
  const userId = await authenticateToken(req, res);
  try {
    const statistics = await query('SELECT a.status, COUNT(*) as num_assignments FROM assignments a JOIN courses c ON a.course_id = c.course_id JOIN schedules s ON c.schedule_id = s.id JOIN users u ON u.user_id = s.user_id WHERE u.user_id = ? GROUP BY a.status;', userId);
    res.json(statistics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getSubjects(req, res) {
  const userId = await authenticateToken(req, res);
  try {
    const subjects = await query('SELECT course_id, course_title, schedule_id FROM courses WHERE schedule_id IN (SELECT schedule_id FROM schedules WHERE user_id = ?)', userId);
    res.json(subjects);
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function addAssignment(req, res) {
  const {title, deadline, course, details, status} = req.body;
  try {
    await query('INSERT INTO assignments (title, details, deadline, status, course_id) VALUES (?, ?, ?, ?, ?);', [title, details, deadline, status, course]);
    res.status(201).json({message: "assignment created successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function addNewSchedule(req, res) {
  const userId = await authenticateToken(req, res);
  const {schedule, startDate, endDate, days} = req.body;
  try {
    let schedule_result = await query('INSERT INTO schedules (user_id, schedule_name, start_date, end_date) VALUES (?, ?, ?, ?);',[userId, schedule, startDate, endDate]);
    schedule_result = JSON.parse(JSON.stringify(schedule_result));
    const insertedIds = [];
    for (const day of days) {
    let result =  await query('INSERT INTO days (schedule_id, day_of_week) VALUES (?, ?);',[schedule_result.insertId, day.name]);
    result = JSON.parse(JSON.stringify(result));
    insertedIds.push(result.insertId);
    }
      days.map((day, index) => {
        day.courses.map(course => {
          query('INSERT INTO courses_per_day (day_id, course_id, start_time, cabinet) VALUES (?, ?, ?, ?);', [insertedIds[index], course.name, course.time, course.cabinet ])
          .catch((err) => {
            throw err;
          });
        }
        )
      })
      res.status(201).json({message: "schedule added successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkAssignment(req, res) {
  const {id} = req.body;
  query('UPDATE assignments SET `status` = \'зроблено\' WHERE id = ?;', id).catch(err => console.log(err))
  .then(res.status(200).json({message: "Successfuly checked;"}));
}
async function editAssignment(req, res) {
  const flag = req.header("Flag");
  if (flag) {
    const {name, value, id} = req.body;
    if (name === 'deadline') {
    query(`UPDATE assignments SET ${name} = STR_TO_DATE(?, \'%d.%m.%y\') WHERE id = ?;`, [value, id])
    .catch(er => console.log(er))
    .then(res.status(200).json({message: "Successfuly edited"}));
    } else {
    query(`UPDATE assignments SET ${name} = ? WHERE id = ?;`, [value, id])
    .catch(er => console.log(er))
    .then(res.status(200).json({message: "Successfuly edited"}));
    }
  } else {
  const {course_id, course_title, deadline, details, id, schedule_id, status, title} = req.body;
  query('UPDATE assignments SET `details` = ?, `deadline` = STR_TO_DATE(?, \'%d.%m.%y\'), `status` = ? WHERE id = ?;',[details, deadline, status, id]).catch(err => console.log(err))
  .then(res.status(200).json({message: "Successfuly checked;"}));
  }
}
async function deleteAssignment(req, res) {
  const {id} = req.body;
  query('DELETE FROM assignments WHERE id = ?;', id).catch(err => console.log(err))
  .then(res.status(200).json({message: "Successfuly deleted;"}));
}

async function getCourses(req, res) {
  const userId = await authenticateToken(req, res);
  const result = await query('SELECT DISTINCT course_id, course_title, teacher, assistant, form_of_final_control, course_notes, conference_link FROM courses JOIN schedules ON user_id = schedules.user_id where user_id = ?;', userId);
  res.json(result);
}

async function getSchedule(req, res) {
  const result = await query('SELECT id, schedule_name FROM schedules WHERE user_id = 1');
  res.json(result);
}

async function addCourse(req, res) {
  const {schedule, name, teacher, assistant, form_of_control, notes, link} = req.body;
  const result = await query('INSERT INTO courses (schedule_id, course_title, teacher, assistant, form_of_final_control, course_notes, conference_link) VALUES (?, ?, ?, ?, ?, ?, ?);', [schedule, name, teacher, assistant, form_of_control, notes, link]);
  res.json(result);
}

async function deleteCourse(req, res) {
  const {id} = req.body;
  const result = await query('DELETE FROM courses WHERE course_id = ?', [id]);
  res.json(result);
}

async function getGrades(req, res) {
  const userId = await authenticateToken(req, res);
  const result = await query('SELECT grades.id, grades.grade, grades.assignment_id FROM grades JOIN assignments ON grades.assignment_id = assignments.id JOIN courses ON assignments.course_id = courses.course_id JOIN schedules ON courses.schedule_id = schedules.id WHERE schedules.user_id = ?;', [userId]);
  res.json(result);
}

async function getAccountInfo(req, res) {
  const userId = await authenticateToken(req, res);
  const result = await query('SELECT user_name, user_email, user_password FROM users WHERE user_id = ?', userId);
  res.json(result);
}

async function updateAccount(req, res) {
  const userId = await authenticateToken(req, res);
  const {username, email, password} = req.body;
  const result = await query('UPDATE users SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?;', [username, email, password, userId]);
  res.json(result);
}

async function deleteAccount(req, res) {
  const userId = await authenticateToken(req, res);
  const result = await query('DELETE FROM users WHERE user_id = ?', [userId]);
  res.status(200);
}

router.get('/schedules', getUserSchedules);
router.get('/assignments', getUserAssignments);
router.get('/statistics', getStatistics);
router.get('/subjects', getSubjects);
router.post('/assignments', addAssignment);
router.post('/newSchedule', addNewSchedule);
router.post('/assignment/check', checkAssignment);
router.post('/assignment/edit', editAssignment);
router.post('/assignment/delete', deleteAssignment);
router.get('/courses', getCourses);
router.get('/schedule', getSchedule);
router.post('/courses/add', addCourse);
router.post('/courses/delete', deleteCourse);
router.get('/grades', getGrades);
router.get('/account', getAccountInfo);
router.post('/account/update', updateAccount);
router.post('/account/delete', deleteAccount);
app.use('/api', router);
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});