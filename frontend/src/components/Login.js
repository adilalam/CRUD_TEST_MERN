import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../authContext/AuthContext';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/users/login', {
        email: form.email,
        password: form.password,
      });

      if (response.data && response.data.token) {
        login(response.data.token); 
        navigate('/home');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data || 'Login failed. Please try again.');
      }
    }
  };


  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
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
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleRegisterClick} style={{ marginTop: '10px' }}>
          Register Instead
        </button>
      </div>
    </div>
  );

};

export default Login;
