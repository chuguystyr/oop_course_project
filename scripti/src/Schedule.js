import React from 'react';
import style from './Schedule.module.css';

let key = 1;

const Schedule = ({data}) => {
    return (
      <div className={style.container}>
      <h1>Розклад</h1>
      <table>
  <thead>
    <tr key="schedule1Header">
      <th>Час</th>
      <th>Предмет</th>
      {data.some(item => item.conference_link !== null) && <th>Посилання</th>}
      {data.some(item => item.cabinet !== null) && <th>Кабінет</th>}
    </tr>
  </thead>
  <tbody>
    {data.map((item, index) => {
      const showStartTime = index === 0 || item.start_time !== data[index - 1].start_time;
      return (
        <tr key={key++}>
          {showStartTime ? <td>{item.start_time}</td> : <td></td>}
          <td>{item.course_title}</td>
          {item.conference_link ? <td><button type="button" onClick={() => window.open(item.conference_link, '_blank')}>Zoom</button></td> : <td></td>}
          {item.cabinet ? <td>{item.cabinet}</td> : <td></td>}
        </tr>
      );
    })}
  </tbody>
</table>
      </div>
    );
    
  };
  
  export default Schedule;