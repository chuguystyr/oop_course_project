import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';

const Header = ({ currentPage }) => {
  const navigate = useNavigate();
  const navigateMain = () => {
    navigate('/main');
  }
  const navigateCourses = () => {
    navigate('/courses');
  }
  const navigateTasks = () => {
    navigate('/assignments');
  }
   const navigateGrades = () => {
    navigate('/grades');
   }
   const navigateAccount = () => {
    navigate('/account');
   }
  return (
    <header className={styles.MainHeader}>
      <h1 className={styles.MainLogo}>Scripti</h1>
      <button className={currentPage === "main" ? styles.active : null} onClick={navigateMain}>Головна</button>
      <button className={currentPage === "courses" ? styles.active : null} onClick={navigateCourses}>Курси</button>
      <button className={currentPage === "tasks" ? styles.active : null} onClick={navigateTasks}>Завдання</button>
      <button className={currentPage === "grades" ? styles.active : null} onClick={navigateGrades}>Оцінки</button>
      <button className={currentPage === "account" ? styles.active : null} onClick={navigateAccount}>Акаунт</button>
    </header>
  );
};

export default Header;