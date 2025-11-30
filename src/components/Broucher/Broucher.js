import React from "react";
import "./Broucher.css";

const Broucher = () => {
  const brochures = [
    {
      name: "COMPANY PROFILE",
      url: "/Broucherpdfs/SK-General Profile.pdf",
      image: require("../../assets/images/knowmore101.png"),
      topDescription: "Learn about our company\nvision and mission.",
      bottomDescription: "Detailed insights\n into our company\n values.",
    },
    {
      name: "2/3 WHEELER CAPABILITIES",
      url: "/Broucherpdfs/SK-2&3W Capabilities.pdf",
      image: "./images/service4.png",
      topDescription:
        "Innovate solutions for 2&3 wheeler\n Design and Manufacturing.",
      bottomDescription: "Get detailed \nspecifications\nand features.",
    },
    {
      name: "COMMERTIAL VEHICLE CATALOG",
      url: "/Broucherpdfs/SK-CV Capabilities.pdf",
      image: "./images/bro6.png",
      topDescription: "Understand commertial \n vehicle catalog.",
      bottomDescription:
        "Empovering \nInnovation in commertial\n Vehicle Solutions",
    },
  ];

  const backgroundColors = ["#0F6679", "#AC5C00", "#0091C6"];

  return (
    <div className="broucher-container">
      <div className="broucher-header">
        <h1>Our Brochures</h1>
      </div>
      <div className="broucher-cards">
        {brochures.map((brochure, index) => (
          <div
            key={index}
            className="broucher-card"
            style={{
              backgroundColor:
                backgroundColors[index % backgroundColors.length],
            }}
          >
            <div className="card-top-description">
              {brochure.topDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div className="hexagon">
              <img src={brochure.image} alt={brochure.name} />
            </div>
            <div className="broucher-info">
              <h2>{brochure.name}</h2>
            </div>
            <div className="card-bottom-description">
              {brochure.bottomDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <a
              href={brochure.url}
              className="download-icon"
              download={brochure.name + ".pdf"}
            >
              <i className="fas fa-download"></i>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Broucher;
