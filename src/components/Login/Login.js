import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const errorRef = useRef(null);

  useEffect(() => {
    if (location.state?.loginError) {
      setErrorMessage(location.state.loginError);
    }
  }, [location.state]);

  // focus the inline error for accessibility when it appears
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      sessionStorage.setItem(
        "EMBED_LOGIN",
        JSON.stringify({ username, password, orgId: 1 }),
      );
    } catch (err) {
      console.warn("sessionStorage write failed", err);
    }

    // Just open dashboard route — do NOT close modal yet
    navigate("/dashboard", { replace: true });
  };

  if (!isModalOpen) return null;

  return (
    <div className="login-page">
      <div
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="login-container">
          <button
            className="login-close-button"
            onClick={closeModal}
            aria-label="Close login"
          >
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

              <div className="form-group">
                <label htmlFor="username">User Name</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <span
                    className="toggle-password-icon"
                    onClick={toggleShowPassword}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {errorMessage && (
                <div
                  className="login-error"
                  role="alert"
                  tabIndex={-1}
                  ref={errorRef}
                >
                  {errorMessage}
                </div>
              )}
              <div className="form-options">
                <button type="submit" className="btn-login">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
