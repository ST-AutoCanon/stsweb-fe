import React from "react";
import "./ChatbotApplication.css";

const ChatbotApplication = () => {
  return (
    <div className="chatbot-application-container">
      {/* Left Section - Image */}
      <div className="chatbot-application-image">
        <img
          src="./images/chat.png"
          alt="Chatbot Application Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="chatbot-application-text">
        <h1>Chatbot Application Services</h1>
        <p className="intro-text">
          Sukalpa Tech Solutions offers rule-based and AI-driven chatbots to meet client needs, 
          enhancing customer support, sales, and automation.
        </p>
        <p>Our chatbot services deliver the following key benefits:</p>
        <ul className="services-list">
          <li>
            <strong> 24/7 Availability</strong>
            Always accessible, ensuring round-the-clock customer support.
          </li>
          <li>
            <strong> Instant Responses</strong>
            Quick answers for faster issue resolution and better user experience.
          </li>
          <li>
            <strong> Scalability</strong>
            Handles multiple conversations simultaneously without extra resources.
          </li>
          <li>
            <strong> Cost Efficiency</strong>
            Reduces operational costs by automating repetitive tasks.
          </li>
          <li>
            <strong> Lead Generation</strong>
            Qualifies leads and guides prospects through the sales funnel.
          </li>
          <li>
            <strong> Seamless Integration</strong>
            Easily integrates with CRMs and business systems for enhanced functionality.
          </li>
  

        </ul>
      </div>
    </div>
  );
};

export default ChatbotApplication;
