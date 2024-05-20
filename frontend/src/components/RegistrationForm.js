import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function RegistrationForm() {

  const [navigate, setNavigate] = useState(false);

  const [post, setPost] = useState({
    "email": "",
    "password": "",
    "first_name": "",
    "last_name": "",
    "phone": "",
    "position": ""
  })
  
  const handleInput = (event) => {
    setPost({...post, [event.target.name]: event.target.value})
  }

  function handleSubmit(event) {
    event.preventDefault()
    axios.post('http://127.0.0.1:8000/api/register', post)
    .then(responce => console.log(responce))
    .catch(err => console.log(err))

    setNavigate(true);
  }

  if (navigate) {
    return <Navigate to="/"/>;
  }

  return (
    <div className="registration-form">
      <div className="header">
      <img src={require('./assets/image2.png')} alt="Логотип компании" className="logo" />
        <Link to="/" className="home-link">Уже есть аккаунт? Войти</Link>
      </div>
      <div className="content">
        <p className='biggest-text'>РЕГИСТРАЦИЯ</p>
        <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input type="text" onChange={handleInput} placeholder="Имя" name="first_name" required/>
            </div>
            <div className="input-wrapper">
              <input type="text" onChange={handleInput} placeholder="Фамилия" name="last_name" required/>
            </div>
            <div className="input-wrapper">
              <input type="text" onChange={handleInput} placeholder="Должность" name="position" required/>
            </div>
            <div className="input-wrapper">
              <input type="tel" onChange={handleInput} placeholder="Телефон" name="phone" required/>
            </div>
            <div className="input-wrapper">
              <input type="email" onChange={handleInput} placeholder="Почта" name="email" required/>
            </div>
            <div className="input-wrapper">
              <input type="password" onChange={handleInput} placeholder="Пароль" name="password" required/>
            </div>
            <button className="register-button">Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;