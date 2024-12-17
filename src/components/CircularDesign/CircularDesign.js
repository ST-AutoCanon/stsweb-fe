import React from "react";
import "./CircularDesign.css";

const CircularDesign = () => {
  const items = [
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
    "Styling, Product Design & Development",
  ];

  return (
    <div className="circular-design-container">
      <div className="center-logo">
        <img src="./images/SukalpaLogo.png" alt="Sukalpa Tech Logo" />
        <p>Let us join to support you deserve</p>
      </div>
      <div className="circular-items">
        {items.map((item, index) => (
          <div key={index} className={`circular-item item-${index + 1}`}>
            <div className="item-content">
              <h3>{item}</h3>
              <p>
                Transform your ideas into market-ready products with our
                cutting-edge design and development services. From concept
                styling to complete product development, we bring creativity and
                technical expertise.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularDesign;
