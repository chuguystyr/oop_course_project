import React from 'react';
import { useState } from 'react';
import style from './AssignmentCard.module.css';
import {BsCheckCircleFill} from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import {AiFillDelete} from "react-icons/ai";

const handleCheck = async (data, rerender) => {
  fetch('http://localhost:3001/api/assignment/check', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id: data.id}),
  }).catch(err => console.log(err)).then(rerender());
}

const handleDelete = async (data, rerender) => {
  await fetch('http://localhost:3001/api/assignment/delete', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id: data.id}),
  }).catch(err => console.log(err)).then(rerender());
}

const AssignmentCard = (props) => {
  const [editable, setEditable] = useState(false);
  const [data, setData] = useState(props.data);
  const Edit = () => {
    setEditable(true);
  }
  const handleContentChange = (event) => {
    const newData = { ...data, details: event.target.innerHTML };
    setData(newData);
    return newData;
  }

  const handleChange = (event) => {
    const startdata = (event.target.innerHTML).split('|');
    const newDeadline = startdata[0];
    const newCourseTitle = startdata[1];
    const newStatus = startdata[2];
    const newData = {...data, deadline: newDeadline, course_title: newCourseTitle, status: newStatus};
    setData(newData);
    return newData;
  }
  
  const handleEdit = async (data, rerender) => {
    setEditable(false);
    await fetch('http://localhost:3001/api/assignment/edit', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(err => console.log(err)).then(rerender());
  }
  return (
    <div className={style.assignment}>
    <span className={style.span}>
    <h1 className={style.h1}>{props.data.title}</h1>
    <BsCheckCircleFill className={style.iconButton} size="20px" onClick={() => handleCheck(data, props.rerender)}></BsCheckCircleFill>
    <AiFillEdit className={style.iconButton} size="20px" onClick={() => Edit()}></AiFillEdit>
    <AiFillDelete className={style.iconButton} size="20px" onClick={() => handleDelete(data, props.rerender)}></AiFillDelete>
    </span>
    {editable ?
      <div className={style.deadline} contentEditable={true} onBlur={(event) => handleEdit(handleChange(event), props.rerender)} dangerouslySetInnerHTML={{ __html: props.data.deadline + '|' + props.data.course_title + '|' + props.data.status}} />
      :
      <p className={style.deadline}>{props.data.deadline} | {props.data.course_title} | {props.data.status}</p>}
      {editable ?
        <div className={style.details} contentEditable={true} onBlur={(event) => handleEdit(handleContentChange(event), props.rerender)} dangerouslySetInnerHTML={{ __html: props.data.details }} />
        :
        <p className={style.details}>{props.data.details}</p>
      }
    </div>
  );
};

export default AssignmentCard;