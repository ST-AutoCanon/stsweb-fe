import React from "react";
import "./StylingProductDesign.css";

const StylingProductDesign = () => {
  return (
    <div className="styling-product-design-container">
      {/* Right Section - Content */}
      <div className="styling-product-design-text">
        <h1>Styling, Product Design & Development</h1>
        <p>
          At Sukalpa Tech Solutions, we specialize in transforming your ideas into market-ready innovations. Our comprehensive design and development services bring your vision to life with unparalleled creativity and technical precision. Whether you need concept styling or full-scale product development, we meticulously craft every detail to meet your unique requirements.
        </p>
        <ul className="services-list">
          <li>
            <strong>Memorable Experiences:</strong> We craft products that focus on functionality while delivering memorable user experiences.
          </li>
          <li>
            <strong>Innovation with Precision:</strong> Combining creative styling with engineering expertise to exceed expectations.
          </li>
          <li>
            <strong>Seamless Journey:</strong> Guiding you from ideation to the final product launch with attention to every detail.
          </li>
          <li>
            <strong>Aesthetic & Functional:</strong> Emphasizing both form and performance to create market-dominating products.
          </li>
          <li>
            <strong>Target Audience Focus:</strong> Products designed to resonate with your audience and stand out in the market.
          </li>
        </ul>
      </div>

      {/* Left Section - Image */}
      <div className="styling-product-design-image">
        <img
          src="./images/CAEAnalysis.png"
          alt="Styling Product Design Services"
          className="services-image"
        />
      </div>
    </div>
  );
};

export default StylingProductDesign;
