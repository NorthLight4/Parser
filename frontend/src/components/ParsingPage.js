import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LeftColumn() {

  const [post, setPost] = useState({
    "user_search": "",
    "category": "",
  })

  const handleInput = (event) => {
    setPost({...post, [event.target.name]: event.target.value})
  }

  function handleSubmit(event) {
    event.preventDefault()
    axios.post('http://127.0.0.1:8000/api/parsing', post, { responseType: 'blob' })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xlsx');
      document.body.appendChild(link);
      link.click();
    })
    .catch(err => console.log(err))
  }
  
    return (
        <div className="left-column">
          <p className='biggest-text'>Парсинг</p>
          <form onSubmit={handleSubmit}>
            <div className="field border">
              <label htmlFor="query">Запрос</label>
              <input type="text" onChange={handleInput} name="user_search" required/>
            </div>
            <div className="field border">
              <label htmlFor="query">Критерии поиска</label>
              <input type="text" onChange={handleInput} name="category" required/>
            </div>
            <button className="start-parsing-button">Начать парсинг</button>
          </form>
        </div>
      );
  }

  function ParsingPage() {
    return (
      <div className="parsing-page">
        <div className="header">
        <img src={require('./assets/image2.png')} alt="Логотип компании" className="logo" />
      <Link to="/profile" className="home-link">Личный кабинет</Link>
      </div>
      <div className="parsing-page-content ">
        <LeftColumn/>
      </div>
      </div>
    );
  }
  
  export default ParsingPage;