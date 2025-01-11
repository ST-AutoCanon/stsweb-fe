import React, { useState } from "react";
import "./Feedbackform.css";

const Feedbackform = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Feedback submitted:", { name, email, message });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setMessage("");
    // Hide the form when the close button is clicked
    const formOverlay = document.querySelector('.feedback-form-overlay');
    formOverlay.style.display = 'none';
  };

  return (
    <div className="feedback-form-overlay">
      <div className="feedback-form-container">
        <button onClick={handleClose} className="close-button">
          &#10005;
        </button>
        {submitted ? (
          <div className="feedback-success">
            <h2>Thank you for your feedback!</h2>
            <button onClick={handleClose} className="close-button">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <h2>Provide Feedback</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter your feedback"
            ></textarea>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedbackform;
