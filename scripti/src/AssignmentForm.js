import { useState, useEffect } from 'react';
import {AiFillCloseCircle} from "react-icons/ai";
import style from './AssignmentForm.module.css';

const NewAssignmentForm = (props) => {
    const [title, setTitle] = useState("");
    const [deadline, setDeadline] = useState("");
    const [course, setCourse] = useState("");
    const [details, setDetails] = useState("");
    const [status, setStatus] = useState("");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/subjects', {
          method: "GET",
          headers: {
            "authentication": token,
          }
        });
        const data = await response.json();
        setSubjects(data);
      }
      fetchData();
    }, [])

    const handleNewAssignmentSubmit = async (newAssignment) => {
      const response = await fetch("http://localhost:3001/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });
      return response.json();
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      formClose();
      await handleNewAssignmentSubmit({ title, deadline, course, details, status }).then(() => updateAssignments())
      .catch((error) => console.error(error));
    };

    const formClose = () => {
      props.hideForm();
    }

    const updateAssignments = () => {
      props.data();
    }
  
    return (
      <form onSubmit={(event) => handleSubmit(event)} className={style.assignment}>
        <button type="button" onClick={formClose} className={style.close}> <AiFillCloseCircle size="25px"></AiFillCloseCircle></button>
        <label htmlFor="title">Назва</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
  
        <label htmlFor="deadline">Дедлайн</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
  
        <label htmlFor="course">Предмет</label>
        <select id="course" value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value=""></option>
          {
            subjects.map((item => <option value={item.course_id} key={item.course_id}>{item.course_title}</option>))
          }
        </select>
  
        <label htmlFor="details">Деталі</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        ></textarea>
  
        <label htmlFor="status">Статус</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value=""></option>
          <option value="нове">Нове</option>
          <option value="виконується">Виконується</option>
          <option value="зроблено">Виконане</option>
        </select>
  
        <button type="submit">Додати</button>
      </form>
    );
  }

  export default NewAssignmentForm;