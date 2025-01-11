import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [isModalOpen, setIsModalOpen] = useState(true);
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

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(true);
    navigate('/About');
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

<<<<<<< HEAD
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
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
        return;
=======
    try {
      // Fetch all users from the JSON Server
      const response = await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'eeb8ddcfdf985823f17b55554844d972eb67eb6c4606a631e9372ac77d9f24d3', // Add the required API key
        },
        body: JSON.stringify({
            email: username,
            password,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error:", errorDetails);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      

      // Assuming response.json() returns a user object
      const user = await response.json();

      // Check the user role and navigate accordingly
      if (user) {
        if (user.role === "employee") {
          navigate("/EmployeePage"); // Redirect to employee page
        } else if (user.role === "admin") {
          navigate("/AdminPage"); // Redirect to admin page
        }
      } else {
        alert("Invalid username or password");
>>>>>>> murge
      }

      localStorage.setItem('authToken', data.code.token);
      localStorage.setItem('userRole', data.code.role);
      localStorage.setItem('dashboardData', JSON.stringify(data.code.dashboard));
      localStorage.setItem('sessionStart', Date.now());

      // Dynamically check role and redirect
      const roleToRouteMap = {
        Admin: '/AdminDashboard',
        Employee: '/EmployeeDashboard',
      };

      const redirectRoute = roleToRouteMap[data.code.role] || 'EmployeeDashboard';

      navigate(redirectRoute);
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };
  
  return (
    isModalOpen && (
      // Render only if the modal is open
      <div className="login-page">
        <div className="login-modal">
          <div className="login-container">
            <button className="login-close-button" onClick={closeModal}>
              ×
            </button>
            <div className="login-image">
              <img
                src="./images/home2.png" // Replace with your actual image URL
                alt="Login illustration"
              />
            </div>
            <div className="login-form">
<<<<<<< HEAD
              <form onSubmit={handleSubmit}>
                <h2>Login</h2>
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
                <button
                    type="button"
                    className="forgot-password-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="btn-login">
                  Login
                </button>
              </form>
=======
  <form onSubmit={handleSubmit}>
    {/* Replace the text header with a logo */}
    <div className="login-logo">
      <img
        src="./images/Loginlogo.png" // Replace with the path to your logo image
        alt="Logo"
        className="login-logo-img" // Optional: Add a CSS class for styling the logo
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

>>>>>>> murge
            </div>
          </div>
        </div>
      </div>
    )
    
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;

>>>>>>> murge
