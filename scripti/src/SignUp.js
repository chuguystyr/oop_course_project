import style from './Login.module.css';
import {BsFillCheckCircleFill} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [showModal, setShowModal] = useState(false);
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
      const response = await fetch('http://localhost:3001/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.message === 'Sign Up successful') {
        // Sign up was successful, redirect the user to login page
        setShowModal(true);
      } else {
        // Login was unsuccessful, display an error message to the user
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };
  return (
    <div className={style.LoginWrapper}>
      <div className={style.LoginContainer}>
        <h1 className={style.LoginHeading}>Scripti | Реєстрація</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className={style.label}>Email:</label>
          <input
            className={style.inputField}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="username" className={style.label}>Ім'я користувача:</label>
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
          <button type="submit" className={style.submitButton}>Зареєструватись</button>
        </form>
        {showModal && (
          <div className="modal">
            <div className={style.modal}>
              <p><BsFillCheckCircleFill></BsFillCheckCircleFill> Реєстрація успішна.
              <button type="button" className={style.submitButton} onClick={handleCloseModal}>Увійти</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;