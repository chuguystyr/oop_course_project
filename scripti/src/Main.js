import React, { useEffect, useState } from 'react';
import { GrScheduleNew } from 'react-icons/gr';
import { MdAddTask } from 'react-icons/md';
import styles from './Main.module.css';
import Header from './Header';
import AssignmentCard from './AssignmentCard';
import Schedule from './Schedule';
import NewAssignmentForm from './AssignmentForm';
import ScheduleForm from './newScheduleForm';


const Main = () => {

const [schedule, setSchedule] = useState([]);
const [assignments, setAssignments] = useState([]);
const [time, setTime] = useState("");
const [statistics, setStatistics] = useState([
  {status: "нове", num_assignments: 0},
  {status: "виконується", num_assignments: 0},
  {status: "зроблено", num_assignments: 0}
]
);
const [showAssignmentForm, setshowAssignmentsForm] = useState(false);
const [refreshAssignments, setrefreshAssignmts] = useState(true);
const [showScheduleForm, setshowScheduleForm] = useState(false);
const [refreshSchedule, setRefreshSchedule] = useState(true);
const token = sessionStorage.getItem('token');

useEffect(() => {
  const fetchData = async () => {
  const response = await fetch('http://localhost:3001/api/schedules', {
    method: "GET",
    headers: {
      "authentication": token
    }
  });
  let data = await response.json();
  if (!data.message) {
  data = data.sort((a, b) => {
    const timeA = parseInt(a.start_time.replace(':', ''));
    const timeB = parseInt(b.start_time.replace(':', ''));
    return timeA - timeB;
  });
  setSchedule(data);
  setRefreshSchedule(false);
}
  };
  fetchData();
}, [refreshSchedule]);
useEffect(() => {
  if (refreshAssignments) {
  const fetchData = async () => {
    const response = await fetch('http://localhost:3001/api/assignments', {
      method: "GET",
      headers: {
        "authentication": token
      }
    });
    const data = await response.json();
    setAssignments(data);
    setrefreshAssignmts(false);
  }
  fetchData();
}
}, [refreshAssignments]);

useEffect( () => {
  const myInterval = setInterval(() => {
    const date = new Date();
    const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthNames[date.getMonth()];

    const hours = date.getHours();
    const minutes = ( (date.getMinutes()<10?'0':'') + date.getMinutes() );
    const timeString = `${dayOfWeek}, ${dayOfMonth} ${month} | ${hours}:${minutes}`;
    setTime(timeString);
  }, 100);
    return () => {
      clearInterval(myInterval);
    }
}, [])
useEffect(() => {
  const fetchData = async () => {
      const response = await fetch('http://localhost:3001/api/statistics', {
        method: "GET",
        headers: {
          "authentication": token
        }
      });
      const data = await response.json();
      const stat = [];
      stat.push(data.find(obj => obj.status === 'нове') || 0);
      stat.push(data.find(obj => obj.status === 'виконується') || 0);
      stat.push(data.find(obj => obj.status === 'зроблено') || 0);
      setStatistics(stat);
    }
  fetchData();
}, [refreshAssignments]);
const formClose = () => {
  setshowAssignmentsForm(false);
  setshowScheduleForm(false);
  setRefreshSchedule(true);
}
const updateAssignments = () => {
  setrefreshAssignmts(true);
}
  let key = 1;
  return (
    <div className={styles.MainContainer}>
      <Header currentPage={"main"}></Header>
      <div className={styles.content}>
        <div className={styles.firstSection}>
          <div className={styles.time}>
            <h2>Сьогодні</h2>
            <p>{time}</p>
          </div>
          <button onClick={() => setshowAssignmentsForm(!showAssignmentForm)}><MdAddTask /> Нове завдання</button>
          <button onClick={() => setshowScheduleForm(!showScheduleForm)}><GrScheduleNew /> Новий розклад</button>
        </div>
        <div className={styles.statistics}>
        <div className={styles.statisticsInside}>
            <p>Нові завдання:</p>
            <p className={styles.unstarted}>{statistics[0].num_assignments}</p>
        </div>
        <div className={styles.statisticsInside}>
            <p>Виконуються:</p>
            <p className={styles.inProgress}>{statistics[1].num_assignments}</p>
        </div>
        <div className={styles.statisticsInside}>
            <p>Виконаних завдань:</p>
            <p className={styles.done}>{statistics[2].num_assignments}</p>
        </div>
        </div>
        <Schedule data={schedule}></Schedule>
        <div className={styles.AssignmentsContainer}>
        {assignments.map(item => <AssignmentCard data={item} rerender={updateAssignments} key={key++}></AssignmentCard>)}
        </div>
        {showAssignmentForm && (
            <NewAssignmentForm  hideForm={formClose} data={updateAssignments}/>
        )}
        {
          showScheduleForm && (
            <ScheduleForm hideForm={formClose}></ScheduleForm>
          )
        }
      </div>
    </div>
  );
};
export default Main;