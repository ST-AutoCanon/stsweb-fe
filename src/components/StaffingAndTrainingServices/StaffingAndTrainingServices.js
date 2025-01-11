import React from "react";
import "./StaffingAndTrainingServices.css";

const StaffingAndTrainingServices = () => {
  return (
    <div className="staffing-and-training-container">
      {/* Left Section - Image */}
      <div className="staffing-and-training-image">
        <img
          src="./images/staff2.png"
          alt="Staffing and Training Services"
          className="services-image"
        />
      </div>

      {/* Right Section - Content */}
      <div className="staffing-and-training-text">
        <h1>Staffing and Training Services</h1>
        <p>
          Empowering Talent, Enabling Growth. In today’s fast-paced tech landscape, having the right people
          with the right skills is key to success.
        </p>
        <ul className="services-list">
          <li>
            <strong>1. Talent Acquisition:</strong> Identifying and recruiting top talent for your organization.
          </li>
          <li>
            <strong>2. Skill Development:</strong> Training programs tailored to bridge skills gaps.
          </li>
          <li>
            <strong>3. Workforce Management:</strong> Strategic solutions to optimize team performance.
          </li>
          <li>
            <strong>4. Leadership Training:</strong> Building future-ready leaders through targeted training.
          </li>
          <li>
            <strong>5. Career Pathing:</strong> Helping employees align personal goals with organizational objectives.
          </li>
        </ul>
        <h2>Dynamic Training: Bridging Skills Gaps, Boosting Performance</h2>
        <p>
          Empower your workforce with Sukalpa Tech’s Staffing and Training Services, where talent meets opportunity.
        </p>
      </div>
    </div>
  );
};

export default StaffingAndTrainingServices;
