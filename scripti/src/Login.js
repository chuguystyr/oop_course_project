import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import style from './Login.module.css';

const  Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [signUpClicked, setSignUpClicked] = useState(false);
  const [showError, setError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        // Login was successful, redirect the user to their dashboard
        navigate('/main');
      } else {
        // Login was unsuccessful, display an error message to the user
        setError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (signUpClicked) {
      navigate('/signup');
    }
  }, [signUpClicked, navigate]);

  const handleSignUpClick = () => {
    setSignUpClicked(true);
  };

  return (
    <div className={style.LoginWrapper}>
      <div className={style.LoginContainer}>
      {showError && <div className={style.error}>Неправильний пароль або ім'я користувача</div>}
        <h1 className={style.LoginHeading}>Scripti | Вхід</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className={style.label}>Користувач:</label>
          <input
            className={style.inputField}
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="password" className={style.label}>Пароль:</label>
          <input
            className={style.inputField}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className={style.submitButton}>Увійти</button>
        </form>
        <div className={style.SignUpDiv}>
          <p>Не маєте акаунта ?</p>
          <button type="button" className={style.submitButton} onClick={handleSignUpClick}>Новий акаунт</button>
        </div>
      </div>
      </div>
  );
}

export default Login;