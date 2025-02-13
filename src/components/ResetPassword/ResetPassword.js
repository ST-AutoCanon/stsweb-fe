import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setError(''); // Clear any previous error
    } else {
      setError('Invalid or missing token');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/password-reset`,
        { resetToken: token, newPassword: password },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'eeb8ddcfdf985823f17b55554844d972eb67eb6c4606a631e9372ac77d9f24d3',
          }
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setError(''); // Clear the error state on success
        setTimeout(() => navigate('/login'), 2000); // Redirect after success
      }
    } catch (error) {
      console.error(error);
      setError('Failed to reset password. Please try again.');
      setSuccess(false);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="reset-password-container">
      <div className='reset-header'>
      <h2>Reset Your Password</h2>
      </div>
      {success ? (
        <div className="success-message">Password reset successfully! Redirecting to login...</div>
      ) : (
        error && <div className="error-message">{error}</div>
      )}
      <form className='reset-form' onSubmit={handleSubmit}>
        <div className='reset-group'>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        <div className='reset-group'>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        <div className='reset-button'>
        <button className='submit-reset' type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
