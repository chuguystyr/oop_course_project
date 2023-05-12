import React, { useState, useEffect } from "react";
import style from "./Courses.module.css";
import Header from "./Header";
import {AiFillCloseCircle} from "react-icons/ai";
import {AiFillDelete} from "react-icons/ai";

const Courses = () => {
  const token = sessionStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddCourse, setShowAddCourse]  = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const [form, setForm] = useState({
    schedule: "",
    name: "",
    teacher: "",
    assistant: "",
    form_of_control:"",
    notes:"",
    link:""
  })

  const setScheduleId = (value) => {
    setForm({...form, schedule: value});
  }

  const setName = (value) => {
    setForm({...form, name: value});
  }

  const setTeacher = (value) => {
    setForm({...form, teacher: value});
  }

  const setAssistant = (value) => {
    setForm({...form, assistant: value});
  }

  const setControlForm = (value) => {
    setForm({...form, form_of_control: value});
  }

  const setNotes = (value) => {
    setForm({...form, notes: value});
  }

  const setLink = (value) => {
    setForm({...form, link: value});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    formClose();
    const response = await fetch("http://localhost:3001/api/courses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      setRefresh(true);
      return response.json();
  }

  const handleDelete = async (id) => {
    const response = await fetch("http://localhost:3001/api/courses/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id}),
      });
      setRefresh(true);
      return response.json();
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/api/courses", {
        method: "GET",
        headers: {
          "authentication": token,
        }
      });
      const data = await response.json();
      setCourses(data);
      setSearchResults(data);
      setRefresh(false);
    };
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("http://localhost:3001/api/schedule", {
          method: "GET",
          headers: {
            "authentication": token,
          }
        });
        const data = await response.json();
        setSchedule(data);
      };
      fetchData();
  }, [])

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = () => {
    const filteredCourses = courses.filter(
      (course) =>
        course.course_title.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.form_of_final_control.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.assistant.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchResults(filteredCourses);
  };

  const formClose = () => setShowAddCourse(false);
  let key = 1;


  return (
    <div className={style.container}>
      <Header currentPage={"courses"}/>
      <div className={style.searchBar}>
        <input
          type="text"
          placeholder="Пошук..."
          value={searchInput}
          onChange={handleSearch}
        />
        <button onClick={handleSearchClick}>Пошук</button>
        <button onClick={() => setShowAddCourse(!showAddCourse)}>Додати курс</button>
      </div>
      <table>
        <thead className={style.tablehead}>
          <tr key={key++}>
            <th></th>
            <th>Назва</th>
            <th>Лекції читає</th>
            <th>Лабоарторні проводить</th>
            <th>Форма контролю</th>
            <th>Нотатки</th>
            <th>Посилання</th>
          </tr>
        </thead>
        <tbody className={style.scrollable}>
          {searchResults.map((item) => (
            <tr key={key++} className={style.row}>
              <td><AiFillDelete onClick={() => handleDelete(item.course_id)}/></td>
              <td>{item.course_title}</td>
              <td>{item.teacher}</td>
              <td>{item.assistant}</td>
              <td>{item.form_of_final_control}</td>
              {item.course_notes ? (
                <td><div className={style.scrollable}>{item.course_notes}</div></td>
              ) : (
                <td></td>
              )}
              {item.conference_link ? (
                <td>
                  <button
                    onClick={() =>
                      window.open(item.conference_link, "_blank")
                    }
                  >
                    Посилання
                  </button>
                </td>
              ) : (
                <td></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showAddCourse && (
        <form onSubmit={(event) => handleSubmit(event)} className={style.form}>
        <button type="button" onClick={formClose} className={style.close}> <AiFillCloseCircle size="25px"></AiFillCloseCircle></button>
        <label className={style.label} htmlFor="schedule">Розклад: </label>
        <select id="schedule" onChange={(e) => setScheduleId(e.target.value)}>
        <option value=""></option>
            {schedule.map(item => {
                return (
            <option value={item.id} key={key++}>{item.schedule_name}</option>
            )})}
        </select>
        <label className={style.label} htmlFor="name">Назва:</label>
        <input
        type="text"
        className={style.inputField}
        id="name"
        onChange={(e) => setName(e.target.value)}/>
        <label className={style.label} htmlFor="teacher">Викладач лекцій:</label>
        <input
        type="text"
        className={style.inputField}
        id="teacher"
        onChange={(e) => setTeacher(e.target.value)}/>
        <label className={style.label} htmlFor="assistant">Викладач практичних:</label>
        <input
        type="text"
        className={style.inputField}
        id="assistant"
        onChange={(e) => setAssistant(e.target.value)}/>
        <label className={style.label} htmlFor="formOfControl">Форма контролю:</label>
        <input
        type="text"
        className={style.inputField}
        id="formOfControl"
        onChange={(e) => setControlForm(e.target.value)}/>
        <label className={style.label} htmlFor="notes">Нотатки:</label>
        <textarea
        style={{marginLeft: "10px", marginRight:"10px", border:"none", borderRadius:"5px", padding:"10px"}}
        className={style.inputField}
        id="notes"
        onChange={(e) => setNotes(e.target.value)}/>
        <label className={style.label} htmlFor="link">Посилання:</label>
        <input
        type="text"
        className={style.inputField}
        id="link"
        onChange={(e) => setLink(e.target.value)}/>
        <button type="submit">Додати</button>
        </form>
      )}
    </div>
  );
};

export default Courses;