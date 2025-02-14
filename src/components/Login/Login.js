import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionTimeout = 20 * 60 * 1000;
    const sessionStart = localStorage.getItem('sessionStart');

    if (sessionStart && Date.now() - parseInt(sessionStart, 10) > sessionTimeout) {
      alert('Your session has expired. Please log in again.');
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const handleForgotPassword = async () => {
    if (!username) {
      alert('Email ID is required to reset the password.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ email: username }),
      });
      const data = await response.json();
      response.ok ? alert('Password reset email sent!') : setErrorMessage(data.message || 'Request failed');
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Invalid credentials.');
        return;
      }

      localStorage.setItem('authToken', data.message.token);
      localStorage.setItem('userRole', data.message.role);
      localStorage.setItem('userName', data.message.name);
      localStorage.setItem('userGender', data.message.gender);
      localStorage.setItem('dashboardData', JSON.stringify(data.message.dashboard));
      localStorage.setItem('sidebarMenu', JSON.stringify(data.message.sidebarMenu));
      localStorage.setItem('sessionStart', Date.now());

      closeModal();
      navigate('/dashboard'); // Redirect all users to a common dashboard
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    isModalOpen && (
      <div className="login-page">
        <div className="login-modal">
          <div className="login-container">
            <button className="login-close-button" onClick={closeModal}>×</button>
            <div className="login-image">
              <img src="./images/ITService.png" alt="Login illustration" />
            </div>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="login-logo">
                  <img src="./images/Loginlogo.png" alt="Logo" className="login-logo-img" />
                </div>
                <div className="form-group">
                  <label htmlFor="username">User Name</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>
                <div className="form-options">
                  <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                </div>
                <button type="submit" className="btn-login">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
