import React from 'react';
import FavoriteQueries from './FavoriteQueries';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';


function ProfilePage() {

  const [navigate, setNavigate] = useState(false);
  const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user', {
                    withCredentials: true,  // Передача cookie
                });
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      setNavigate(true);
    } catch (error) {
      console.error("Logout failed:", error.response.data.error);
    }
  };

  if (navigate) {
    return <Navigate to="/"/>;
  }

  return (
    <div className="profile-page">
        <div className="header">
        <img src={require('./assets/image2.png')} alt="Логотип компании" className="logo" />
      <Link to="/parsing" className="home-link">Парсинг</Link>
      </div>
      <div className='profile-page-content'>
      <h2 className="content">ЛИЧНЫЙ КАБИНЕТ</h2>
      <div className="profile-fields">
        <div className="field">
          <p><strong>Имя:</strong> {data && (data.first_name)}</p>
        </div>
        <div className="field">
          <p><strong>Фамилия:</strong> {data && (data.last_name)}</p>
        </div>
        <div className="field">
          <p><strong>Должность:</strong> {data && (data.position)}</p>
        </div>
        <div className="field">
          <p><strong>Телефон:</strong> {data && (data.phone)}</p>
        </div>
        <div className="field">
        <p><strong>Почта:</strong> {data && (data.email)}</p>
        </div>
        <button className="save-button" onClick={handleLogout}>Выйти из аккаунта</button>
      </div>
    </div>
    </div>
  );
}

export default ProfilePage;
