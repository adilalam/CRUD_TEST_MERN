import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';
import './Login.css';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
  const navigate = useNavigate();

  const { token } = useAuth();
  
    useEffect(() => {
      if (token) {
        navigate('/home');
      }
    }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/users/register', {
        email: form.email,
        password: form.password,
      });

      if (response.data) {
        navigate('/login');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if(err.status === 400) {
        setError(err.response.data.message)
      } else {
        setError(err.response.data || 'Login failed. Please try again.');
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLoginClick} style={{ marginTop: '10px' }}>
        Login Instead
      </button>
    </div>
  </div>
  )
};

export default Register;
