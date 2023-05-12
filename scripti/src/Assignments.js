import { useState, useEffect } from "react";
import style from "./Courses.module.css"
import Header from "./Header";
import AssignmentForm from "./AssignmentForm"
import {AiFillDelete} from "react-icons/ai";
import {AiFillEdit} from "react-icons/ai";
const Assignments = () => {
    const token = sessionStorage.getItem('token');
    const [assignments, setAssignments] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [editable, setEditable] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const results = await fetch('http://localhost:3001/api/assignments', {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Flag":"true",
                  "authentication": token
                }
              });
            const data = await results.json();
            setSearchResults(data);
            setAssignments(data);
        }
        fetchData();
        setRefresh(false);
    }, [refresh]);
    const handleSearchClick = () => {
      const filteredAssignments = assignments.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.deadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (assignment.details && assignment.details.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredAssignments);
    };
    const handleDelete = async (id) => {
      const response = await fetch("http://localhost:3001/api/assignment/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id: id}),
        });
        setRefresh(true);
        return response.json();
    }
    const formClose = () => {
      setShowAddAssignment(false);
    }
    const updateAssignments = () => {
      setRefresh(true);
    }
    const handleEdit = async (event) => {
      setEditable(false);
      const property = event.target.getAttribute("name");
      const value = event.target.textContent;
      const id = event.target.getAttribute("id");
      const data = {name: property, value: value, id: id};
      await fetch('http://localhost:3001/api/assignment/edit', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Flag": "true"},
      body: JSON.stringify(data),
    }).catch(err => console.log(err)).then(setRefresh(true));
    } 
    let key = 0;

    return (
        <div className={style.container}>
        <Header currentPage={"tasks"}/>
        <div className={style.searchBar}>
          <input
            type="text"
            placeholder="Пошук..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearchClick}>Пошук</button>
          <button onClick={() => setShowAddAssignment(!showAddAssignment)}>Додати завдання</button>
        </div>
        <table style={{width:"91%"}}>
          <thead>
            <tr key={key++}>
              <th></th>
              <th></th>
              <th>Дедлайн</th>
              <th>Статус</th>
              <th>Предмет</th>
              <th>Назва</th>
              <th>Деталі</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((item) => (
              <tr key={key++} className={style.row}>
                <td><AiFillEdit onClick={() => setEditable(true)}/></td>
                <td><AiFillDelete onClick={() => handleDelete(item.id)} /></td>
                {editable ? <td><div onBlur={(event) => handleEdit(event)} contentEditable={true} dangerouslySetInnerHTML={{ __html: item.deadline}} name="deadline" id={item.id}/></td>
                :
                <td>{item.deadline}</td>}
                {editable ? <td><div onBlur={(event) => handleEdit(event)} contentEditable={true} dangerouslySetInnerHTML={{ __html: item.status}} name="status" id={item.id}/></td>
                :
                <td>{item.status}</td>}
                <td>{item.course_title}</td>
                {editable ? <td><div onBlur={(event) => handleEdit(event)} contentEditable={true} dangerouslySetInnerHTML={{ __html: item.title}} name="title" id={item.id}/></td>
                :
                <td>{item.title}</td>}
                {item.details ? (
                  <td><div>{item.details}</div></td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {showAddAssignment && <AssignmentForm hideForm={formClose} data={updateAssignments}/>}
      </div>
    )
}

export default Assignments;