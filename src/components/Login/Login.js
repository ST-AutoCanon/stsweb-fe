import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Modal from "../Modal/Modal";

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [idleModalVisible, setIdleModalVisible] = useState(false);
  const navigate = useNavigate();

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Check if user was logged out due to inactivity
  useEffect(() => {
    if (sessionStorage.getItem("loggedOutDueToInactivity")) {
      setIdleModalVisible(true);
      sessionStorage.removeItem("loggedOutDueToInactivity");
    }
  }, []);

  const handleIdleModalClose = () => {
    setIdleModalVisible(false);
  };

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

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
      // Set lastActivity only on login
      localStorage.setItem("lastActivity", Date.now());

      closeModal();
      navigate("/dashboard");
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
        {idleModalVisible && (
          <Modal
            isVisible={idleModalVisible}
            onClose={handleIdleModalClose}
            buttons={[{ label: "OK", onClick: handleIdleModalClose }]}
          >
            <p>You have been logged out due to inactivity.</p>
          </Modal>
        )}
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
