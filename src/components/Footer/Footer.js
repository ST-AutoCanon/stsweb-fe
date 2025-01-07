import React from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation
import "./Footer.css";
import { FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa'; // LinkedIn and Email icons

const Footer = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleFeedbackClick = () => {
    navigate("/Feedbackform"); // Navigate to Feedback form route
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* QR Code Section */}
        <div className="footer-logo">
          <img src="/images/scanner.png" alt="QR Code" />
        </div>

        {/* Social Icons Section */}
        <div className="social-icons">
          <a href="mailto:info@sukalpatech.com" className="social-icon">
            <FaEnvelope size={21} />
          </a>
          <a href="tel:9742134584" className="social-icon">
            <FaPhone size={21} />
          </a>
          <a href="https://www.linkedin.com/company/sukalpa-tech/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin size={21} />
          </a>
        </div>
        <div className="social-icons2">
          <a href="mailto:info@sukalpatech.com" className="social-icon2">
            <FaEnvelope size={21} />
          </a>
          <a href="tel:9742134584" className="social-icon2">
            <FaPhone size={21} />
          </a>
          <a href="https://www.linkedin.com/company/sukalpa-tech/" target="_blank" rel="noopener noreferrer" className="social-icon2">
            <FaLinkedin size={23} />
          </a>
        </div>


        

        {/* Tagline Section */}
        <div className="footer-slogan">
          <p>Your tagline goes here in two lines.</p>
          <p>Making your experience better!</p>
        </div>

        {/* Feedback Section */}
        <div className="footer-feedback">
          
          <p>We Focus On Making </p>
          <p>The Best In All Sectors</p>
          <button className="feedback-button" onClick={handleFeedbackClick}>
            send your queries
          </button>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/ReachUs">Reach Us</a>
          <a href="/KnowMore">KnowMore</a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>Copyright © 2022 Sukalpa Tech. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
