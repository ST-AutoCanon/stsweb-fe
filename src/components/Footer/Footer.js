import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
       {/* <div className="footer-logo">
          <img src="/images/image 108.png" alt="Sukalpal Tech Logo" />
        </div>*/}
       

        {/* Social Media Links */}
        <div className="scanner">
         <img src="/images/scanner.png" alt="Logo" />
       </div>
       <div className="footer-social">
              <a href="tel:+9742134584" className="social-icon">
        <i className="fas fa-phone-alt"></i>  9742134584
      </a>
      
      <a href="mailto:info@sukalpatech.com" className="social-icon">
        <i className="fas fa-envelope"></i> mailto: info@sukalpatech.com
      </a>  
          <a href="https://www.linkedin.com/company/sukalpa-tech/" className="social-icon"><i className="fab fa-linkedin-in"></i>  Linkedin</a>
        </div>
        <div className="footer-feedback">
          <p>Were you able to find what you needed?</p>
          <p>Help us make Sukalpa Tech website a better experience for users like you!</p>
          <button className="feedback-button">Provide Feedback</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
