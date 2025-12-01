import React from "react";
import "./Drafting.css";

const Drafting = () => {
  return (
    <div className="drafting-container">
      <div className="drafting-image">
        <img
          src="./images/2D&3DDrafting.png"
          alt="2D & 3D Drafting"
          className="drafting-image"
        />
      </div>

      <div className="drafting-text">
        <h1>2D & 3D Drafting</h1>
        <p>Our 2D & 3D Drafting Services Include:</p>
        <ul className="drafting-list">
          <li>Mechanical Drafting</li>
          <li>Architectural Drafting</li>
          <li>Electrical Drafting</li>
          <li>Civil Drafting</li>
          <li>Structural Drafting</li>
          <li>Product Design Drafting</li>
          <li>Assembly Drawings</li>
          <li>Technical Illustrations</li>
        </ul>
      </div>
    </div>
  );
};

export default Drafting;
