import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";
import Header from "./Header";

const Account = () => {
  const [accountInfo, setAccountInfo] = useState({});
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refreshAccount, setRefreshAccount] = useState(true);
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/api/account', {
        method: "GET",
          headers: {
            "authentication": token
          }
        });
        const data = await response.json();
        setAccountInfo(data[0]);
        setPassword(data[0].user_password);
        setRefreshAccount(false);
    }
    fetchData();
  }, [refreshAccount])

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSaveChanges = async () => {
    // setNewUsername(newUsername);
    // setNewEmail(newEmail);
    const response = await fetch('http://localhost:3001/api/account/update', {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authentication": token
        },
        body: JSON.stringify({username: newUsername ? newUsername : accountInfo.user_name, 
          email: newEmail ? newEmail : accountInfo.user_email, password: password ? password : accountInfo.password}),
    });
    setRefreshAccount(true);
    return response.json();
  };

  const handleDeleteAccount = async () => {
    handleLogout();
    const response = await fetch('http://localhost:3001/api/account/delete', {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authentication": token
        }
    });
    return response.json();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={styles.container}>
    <Header currentPage={"account"}/>
    <div className={styles.account_settings_container}>
      <div className={styles.form_container}>
        <div className={styles.form_group}>
          <label htmlFor="username-input" className={styles.form_label}>
            Ім'я користувача
          </label>
          <input
            type="text"
            id="username-input"
            className={styles.form_input}
            value={newUsername ? newUsername :  accountInfo.user_name}
            onChange={handleUsernameChange}
            placeholder={accountInfo.user_name}
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="email-input" className={styles.form_label}>
            Email
          </label>
          <input
            type="email"
            id="email-input"
            className={styles.form_input}
            value={newEmail ? newEmail : accountInfo.user_email}
            onChange={handleEmailChange}
            placeholder={accountInfo.user_email}
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="password-input" className={styles.form_label}>
            Новий пароль
          </label>
          <input
            type="password"
            id="password-input"
            className={styles.form_input}
            value={password}
            onChange={handlePasswordChange}
            placeholder=""
          />
        </div>
        <div className={styles.form_actions}>
          <button className={styles.form_button} onClick={handleSaveChanges}>
            Зберегти зміни
          </button>
          <button className={styles.form_button_special} onClick={handleDeleteAccount}>
            Видалити акаунт
          </button>
          <button className={styles.form_button} onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Account;