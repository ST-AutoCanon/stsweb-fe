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
            <p>Always accessible, ensuring round-the-clock customer support.</p>
          </li>
          <li>
            <strong> Instant Responses</strong>
            <p>Quick answers for faster issue resolution and better user experience.</p>
          </li>
          <li>
            <strong> Scalability</strong>
            <p>Handles multiple conversations simultaneously without extra resources.</p>
          </li>
          <li>
            <strong> Cost Efficiency</strong>
            <p>Reduces operational costs by automating repetitive tasks.</p>
          </li>
          <li>
            <strong> Lead Generation</strong>
            <p>Qualifies leads and guides prospects through the sales funnel.</p>
          </li>
          <li>
            <strong> Seamless Integration</strong>
            <p>Easily integrates with CRMs and business systems for enhanced functionality.</p>
          </li>
  

        </ul>
      </div>
    </div>
  );
};

export default ChatbotApplication;
