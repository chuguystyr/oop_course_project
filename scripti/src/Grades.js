import React from "react";
import Header from "./Header";
import style from "./Courses.module.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
const Grades = () => {
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [courses1, setCourses1] = useState([]);
    const [courses2, setCourses2] = useState([]);
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/api/subjects', {
                method: "GET",
                headers: {
                  "authentication": token,
                }
              });
            let data = await response.json();
            data = data.reduce((acc, obj) => {
                const value = obj.schedule_id;
                if (!acc[value]) {
                  acc[value] = [];
                }
                acc[value].push(obj);
                return acc;
              }, {});
              const first = data[1];
              const second = data[2];
            setCourses1(first);
            setCourses2(second);
        }
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/api/assignments' , {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Flag":"true",
                  "authentication": token
                }
            });
            const data = await response.json();
            setAssignments(data);
        }
        fetchData();
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/api/grades', {
                method: "GET",
                headers: {
                  "authentication": token,
                }
              });
            const data = await response.json();
            setGrades(data);
        }
        fetchData();
    }, [])
    return (
        <div className={style.container}>
        <Header currentPage={"grades"}/>
        <div style={{display: "flex", flexDirection: "row"}}>
        <table key={uuidv4()} style={{ width: '42%'}}>
            <thead>
            <tr key={uuidv4()}>
            <th style={{textAlign: "left"}}>Предмет</th>
            </tr>
            </thead>
            <tbody>
            {courses1 && courses1.map(item => (
                <tr key={uuidv4()}>
                    <td key={uuidv4()} style={{width: "15px"}}>{item.course_title}</td>
                    {assignments.map(task => {
                        if (task.course_id === item.course_id) {
                        const grade = grades.filter(grade => grade.assignment_id === task.id);
                        return <td key={uuidv4()}>{grade.length > 0 ? grade[0].grade : ""}</td>
                        }
                    })}
                </tr>
            ))}
            </tbody>
        </table>
        <table key={uuidv4()} style={{ width: '42%'}}>
            <thead>
            <tr key={uuidv4()}>
            <th style={{textAlign: "left"}}>Предмет</th>
            </tr>
            </thead>
            <tbody>
            {courses2 && courses2.map(item => (
                <tr key={uuidv4()}>
                    <td key={uuidv4()} style={{width: "15px"}}>{item.course_title}</td>
                    {assignments.map(task => {
                        if (task.course_id === item.course_id) {
                        const grade = grades.filter(grade => grade.assignment_id === task.id);
                        return <td key={uuidv4()}>{grade.length > 0 ? grade[0].grade : ""}</td>
                        }
                    })}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        
        </div>
    )
}

export default Grades;