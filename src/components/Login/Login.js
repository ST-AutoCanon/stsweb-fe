
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const Login = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to close the modal and call the onClose function passed from parent
  const closeModal = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
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
  );
};

export default Login;