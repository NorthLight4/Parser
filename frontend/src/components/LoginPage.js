import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function LoginPage() {

  const [navigate, setNavigate] = useState(false);

  const [post, setPost] = useState({
    "email": "",
    "password": "",
  })

  const handleInput = (event) => {
    setPost({...post, [event.target.name]: event.target.value})
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', post, { withCredentials: true })
      const token = response.data.token;
      localStorage.setItem('token', token);
      setNavigate(true);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  }

  if (navigate) {
    return <Navigate to="/parsing"/>;
  }

  return (
    <div className="login-page">
      <div className="header">
      <img src={require('./assets/image2.png')} alt="Логотип компании" className="logo" />
      </div>
      <div className="content">
        <div className='bigger-text'>
        <p>Войдите в аккаунт, чтобы продолжить</p>
        <p>Нет аккаунта? <Link to="/registration">Регистрация</Link></p>
        </div>
        <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
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

export default LoginPage;
