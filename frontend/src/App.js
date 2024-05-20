// import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm.js';
import LoginPage from './components/LoginPage';
import ParsingPage from './components/ParsingPage';
import ProfilePage from './components/ProfilePage';


import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/parsing" element={<ParsingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>      
      </Router>
    </div>
  );
}

export default App;
