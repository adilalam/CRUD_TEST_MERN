import React from 'react';
import './Header.css';
import { useAuth } from '../authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout =async  () => {
    try {
      const response = await axios.post('http://localhost:4000/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data) {
        alert(response.data.message);
        logout();
        navigate('/login');
      } 
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || 'Logout failed. Please try again.');
      }
    }
  };

  return (
    <header className="header">
      <div className="logo">Raw Engg Test</div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
