import React, { useState, useEffect } from 'react';
import style from './newScheduleForm.module.css'
import {AiFillCloseCircle} from "react-icons/ai";

const ScheduleForm = ({hideForm}) => {
    const token = sessionStorage.getItem('token');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [schedule, setSchedule] = useState("");
    const [days, setDays] = useState([
    {      name: "1",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" },
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    },
    {
      name: "2",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" },
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    },
    {
      name: "3",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" , cabinet: ""},
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    },
    {
      name: "4",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" },
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    },
    {
      name: "5",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" },
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    },
    {
      name: "6",
      courses: [
        { name: "", time: "8:30", cabinet: "" },
        { name: "", time: "10:00", cabinet: "" },
        { name: "", time: "11:50", cabinet: "" },
        { name: "", time: "13:20", cabinet: "" },
        { name: "", time: "14:45", cabinet: "" },
        { name: "", time: "16:15", cabinet: "" },
        { name: "", time: "17:45", cabinet: "" },
      ],
    }
  ]);

  const [subjects, setSubjects] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('http://localhost:3001/api/subjects' , {
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

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  }

  const handleDayCourseChange = (event, dayIndex, courseIndex) => {
    const newDays = [...days];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      courses: newDays[dayIndex].courses.map((course, index) => {
        if (index === courseIndex) {
          return { name: event.target.value, time: course.time };
        }
        return course;
      })
    };
    setDays(newDays);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let filteredDays = days.map((day) => {
      return {
        ...day,
        courses: day.courses.filter((course) => course.name !== ""),
      };
    });
    filteredDays = filteredDays.filter(day => day.courses.length !==0);
    const formData = {
      schedule,
      startDate,
      endDate,
      days: filteredDays
    }
    try {
        const response = await fetch('http://localhost:3001/api/newSchedule', {
        method: "POST",
        headers: { "Content-Type": "application/json", "authentication": token },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    };
    hideForm();
  };

  const handleCabinetChange = (event, dayIndex, courseIndex) => {
    const newDays = [...days];
    newDays[dayIndex] = {
      ...newDays[dayIndex],
      courses: newDays[dayIndex].courses.map((course, index) => {
        if (index === courseIndex) {
          return {name: course.name, cabinet: event.target.value, time:course.time};
        }
        return course;
      })
    };
    setDays(newDays);
  };

  const startTimes = [    "8:30",    "10:00",    "11:50",    "13:20",    "14:45",    "16:15",    "17:45",  ];
  const names = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]

  return (
    <form onSubmit={handleSubmit} className={style.schedule}>
    <button type="button" onClick={hideForm} className={style.close}><AiFillCloseCircle size="25px"></AiFillCloseCircle></button>
    <div className={style.dates}>
    <label>
        Діє з:
        <input type="date" value={startDate} onChange={handleStartDateChange} />
      </label>
      <label>
        Діє до:
        <input type="date" value={endDate} onChange={handleEndDateChange} />
      </label>
      <label>
      Назва розкладу:
      <input type="text" value={schedule} onChange={handleScheduleChange}></input>
      </label>
    </div>
      <table>
        <thead>
          <tr>
            <th></th>
            {names.map((name, index) => (
              <th key={index}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {startTimes.map((time, courseIndex) => (
    <tr key={time}>
      <td>{time}</td>
      {days.map((day, dayIndex) => (
        <td key={dayIndex}>
          <div className={style.data}>
            <select onChange={(event) => handleDayCourseChange(event, dayIndex, courseIndex)}>
              <option value=""></option>
              {subjects.map((item) => (
                <option value={item.course_id} key={item.course_id}>
                  {item.course_title}
                </option>
              ))}
            </select>
            <input type='text' style={{width: "30px", height: "11px"}} onChange={(event) => handleCabinetChange(event, dayIndex, courseIndex)}></input>
          </div>
        </td>
      ))}
    </tr>
  ))}
</tbody>
  </table>
  <button type="submit">Додати</button>
</form>
);
}
export default ScheduleForm;