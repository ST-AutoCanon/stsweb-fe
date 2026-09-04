import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "./Footer.css";
import { FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import FeedBack from "../Feedbackform/Feedbackform.js";

const Footer = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const location = useLocation();
  const hiddenPages = ["/Login", "/dashboard", "/FacePunch"];

  const isHidden = hiddenPages.includes(location.pathname);

  const openModal = () => {
    setModalKey((prevKey) => prevKey + 1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <footer className={`footer ${isHidden ? "hide-footer-mobile" : ""}`}>
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/images/mapscanner1.jpeg" alt="QR Code" />
        </div>

        <div className="social-icons">
          <a href="mailto:info@sukalpatech.com" className="social-icon">
            <FaEnvelope size={23} />
          </a>
          <a href="tel:9742134584" className="social-icon">
            <FaPhone size={23} />
          </a>
          <a
            href="https://www.linkedin.com/company/sukalpa-tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaLinkedin size={23} />
          </a>
        </div>
        <div className="social-icons2">
          <a href="mailto:info@sukalpatech.com" className="social-icon2">
            <FaEnvelope size={30} />
          </a>
          <a href="tel: 9686465612" className="social-icon2">
            <FaPhone size={21} />
          </a>
          <a
            href="https://www.linkedin.com/company/sukalpa-tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon2"
          >
            <FaLinkedin size={23} />
          </a>
        </div>

        <div className="footer-slogan">
          <p>Your tagline goes here in two lines.</p>
          <p>Making your experience better!</p>
        </div>

        <div className="floginbtn">
          <p>We Focus On Making </p>
          <p>The Best In All Sectors</p>
          <button onClick={openModal}>Feedback</button>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>

          <a href="/KnowMore">Know More</a>
          <a href="/ReachUs">Reach Us</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2022 Sukalpa Tech. All Rights Reserved.</p>
      </div>
      {isModalOpen && <FeedBack onClose={closeModal} />}
    </footer>
  );
};

export default Footer;
