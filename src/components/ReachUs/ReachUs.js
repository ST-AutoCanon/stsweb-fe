import React, { useState } from "react";
import "./ReachUs.css";

const ReachUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "phone_number") setPhoneNumber(value);
    if (name === "message") setMessage(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "eeb8ddcfdf985823f17b55554844d972eb67eb6c4606a631e9372ac77d9f24d3",
        },
        body: JSON.stringify({
          name,
          email,
          phone_number: phoneNumber,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      const data = await response.json();
      setSuccess(data.message || "Message sent successfully!");
      setError("");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
    } catch (error) {
      setError(error.message || "Failed to send the message.");
      setSuccess("");
    }
  };

  return (
    <div className="reachus-container">
      

      <div className="content-section">
        <div className="map-box">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d959.3564869283788!2d74.48317102534428!3d15.886740550840509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf63e7aeb36afd%3A0x7d0244f3a88cdcd2!2sShree%20Annapurneshwari%20General%20Store&#39;s%20%26%20Home%20Products!5e0!3m2!1sen!2sin!4v1737139686819!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            title="Office Location"
          ></iframe>
        </div>

        <div className="form-box">
          <form className="contact-form" onSubmit={handleSubmit}>
            <p>If you have any query, <br /> please feel free to contact us.</p>

            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={name}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              value={email}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="phone_number">Mobile No</label>
            <input
              type="text"
              name="phone_number"
              className="input-field"
              value={phoneNumber}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="message">Comments</label>
            <textarea
              name="message"
              className="textarea-field"
              rows="5"
              value={message}
              onChange={handleInputChange}
              required
            ></textarea>

            <button type="submit" className="send-button">Send your queries</button>
          </form>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReachUs;
