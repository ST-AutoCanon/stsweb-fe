import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Manage modal state
  const navigate = useNavigate();

  useEffect(() => {
    const sessionTimeout = 20 * 60 * 1000; // 20 minutes in milliseconds
    const sessionStart = localStorage.getItem('sessionStart');

    if (sessionStart && Date.now() - parseInt(sessionStart, 10) > sessionTimeout) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  }, [navigate]);

  // Function to close the modal and call the onClose function passed from parent
  const closeModal = () => {
    setIsModalOpen(false); // Update modal state
    if (onClose) {
      onClose(); // Call the onClose function if provided
    }
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

      if (response.ok) {
        alert('Password reset email sent successfully!');
      } else {
        setErrorMessage(data.message || 'Unable to process request');
      }
    } catch (error) {
      console.error('Error sending forgot password request:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
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
      console.log("data",data)

      if (!response.ok) {
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
        return;
      }

      // Store necessary data in local storage
      localStorage.setItem('authToken', data.message.token);
      localStorage.setItem('userRole', data.message.role);
      localStorage.setItem('dashboardData', JSON.stringify(data.message.dashboard));
      localStorage.setItem('sessionStart', Date.now());

      // Dynamically check role and redirect
      const roleToRouteMap = {
        Admin: '/AdminDashboard',
        Employee: '/EmployeeDashboard',
      };

      const redirectRoute = roleToRouteMap[data.message.role] || '/EmployeeDashboard';
      closeModal(); // Close the modal after login
      navigate(redirectRoute); // Redirect the user
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    isModalOpen && ( // Render modal only if it's open
      <div className="login-page">
        <div className="login-modal">
          <div className="login-container">
            <button className="login-close-button" onClick={closeModal}>
              ×
            </button>
            <div className="login-image">
              <img
                src="./images/ITService.png" // Replace with your actual image URL
                alt="Login illustration"
              />
            </div>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="login-logo">
                  <img
                    src="./images/Loginlogo.png" // Replace with the path to your logo image
                    alt="Logo"
                    className="login-logo-img"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="username">User Name</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="form-options">
                  <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" className="btn-login">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
