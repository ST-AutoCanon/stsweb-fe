import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Modal from "../Modal/Modal";

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const idleTimeout = 5 * 60 * 1000;

  // Alert modal state (no title by default)
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Helper functions for the alert modal
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now());
    };

    const checkIdleTime = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (
        lastActivity &&
        Date.now() - parseInt(lastActivity, 10) > idleTimeout
      ) {
        showAlert("You have been logged out due to inactivity.");
        localStorage.clear();
        navigate("/login");
      }
    };

    // Set initial activity time
    localStorage.setItem("lastActivity", Date.now());

    // Event listeners to detect activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Check idle time every minute
    const interval = setInterval(checkIdleTime, 60000);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
    };
  }, [navigate]);

  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const handleForgotPassword = async () => {
    if (!username) {
      showAlert("Email ID is required to reset the password.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({ email: username }),
        }
      );
      const data = await response.json();
      response.ok
        ? showAlert("Password reset email sent!")
        : setErrorMessage(data.message || "Request failed");
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({ email: username, password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Invalid credentials.");
        return;
      }

      localStorage.setItem("userRole", data.message.role);
      localStorage.setItem("userName", data.message.name);
      localStorage.setItem("userGender", data.message.gender);
      localStorage.setItem(
        "dashboardData",
        JSON.stringify(data.message.dashboard)
      );
      localStorage.setItem(
        "sidebarMenu",
        JSON.stringify(data.message.sidebarMenu)
      );
      localStorage.setItem("lastActivity", Date.now()); // Set initial activity time

      closeModal();
      navigate("/dashboard"); // Redirect all users to a common dashboard
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    isModalOpen && (
      <div className="login-page">
        <div className="login-modal">
          <div className="login-container">
            <button className="login-close-button" onClick={closeModal}>
              ×
            </button>
            <div className="login-image">
              <img src="./images/ITService.png" alt="Login illustration" />
            </div>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="login-logo">
                  <img
                    src="./images/Loginlogo.png"
                    alt="Logo"
                    className="login-logo-img"
                  />
                </div>
                {/* Error Message Display */}
                {errorMessage && (
                  <div className="error-messages">{errorMessage}</div>
                )}
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
                  <a href="#" onClick={handleForgotPassword}>
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="btn-login">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Alert Modal for displaying messages */}
        <Modal
          isVisible={alertModal.isVisible}
          onClose={closeAlert}
          buttons={[{ label: "OK", onClick: closeAlert }]}
        >
          <p>{alertModal.message}</p>
        </Modal>
      </div>
    )
  );
};

export default Login;
