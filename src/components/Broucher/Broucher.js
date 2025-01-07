import React from "react";
import "./Broucher.css";

const Broucher = () => {
  const brochures = [
    {
      name: "COMPANY PROFILE",
      url: "/Broucherpdfs/Artboard 1 copy 2.pdf",
      image: "./images/Broucher3.jpg",
      topDescription: "Learn about our company\nvision and mission.",
      bottomDescription: "Detailed insights\n into our company\n values.",
    },
    {
      name: "PRODUCT CATLOG",
      url: "/Broucherpdfs/SK-General Profile.pdf",
      image: "./images/Broucher1.jpg",
      topDescription: "Explore our wide range\nof products.",
      bottomDescription: "Get detailed \nspecifications\nand features.",
    },
    {
      name: "OUR CUSTOMERS",
      url: "/Broucherpdfs/STS_Contents.pdf",
      image: "./images/Broucher2.jpg",
      topDescription: "we serve principles driving \n toward excellence.",
      bottomDescription: "Innovative solutions,\n reliability, and customer\n satisfaction.",
    },
  ];

  const backgroundColors = ["#0F6679", "#AC5C00", "#0091C6"]; // Define your card colors

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
            style={{ backgroundColor: backgroundColors[index % backgroundColors.length] }} // Dynamic background color
          >
            {/* Top Description */}
            <div className="card-top-description">
              {brochure.topDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {/* Hexagon with Image */}
            <div className="hexagon">
              <img src={brochure.image} alt={brochure.name} />
            </div>
            {/* Brochure Info */}
            <div className="broucher-info">
              <h2>{brochure.name}</h2>
            </div>
            {/* Bottom Description */}
            <div className="card-bottom-description">
              {brochure.bottomDescription.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {/* Download Button */}
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
