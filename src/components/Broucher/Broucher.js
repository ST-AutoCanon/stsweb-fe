import React from "react";
import "./Broucher.css";

const Broucher = () => {
  const brochures = [
    {
      name: "Company Profile",
      url: "/Broucherpdfs/STS Contents (1).pdf",
      image: "./images/g1.jpg", // Replace with actual image URL
      topDescription: "Learn about our company      vision and mission.", // Top description
      bottomDescription: ["Detailed insights into","our company values."], // Bottom description
    },
    {
      name: "Product Catalog",
      url: "/pdfs/product-catalog.pdf",
      image: "./images/g1.jpg", // Replace with actual image URL
      topDescription: "Explore our wide range of products.", // Top description
      bottomDescription: "Get detailed specifications and features.", // Bottom description
    },
    {
      name: "Pricing Details",
      url: "/pdfs/pricing-details.pdf",
      image: "./images/g1.jpg", // Replace with actual image URL
      topDescription: "Find our competitive pricing options.", // Top description
      bottomDescription: "Transparent and flexible pricing plans.", // Bottom description
    },
  ];

  return (
    <div className="broucher-container">
      <div className="broucher-header">
        <h1>Our Brochures</h1>
      </div>
      <div className="broucher-cards">
        {brochures.map((brochure, index) => (
          <div key={index} className="broucher-card">
            {/* Top Description */}
            <div className="card-top-description">
              {brochure.topDescription}
            </div>
            {/* Hexagon with Image */}
            <div className="hexagon">
              <img src={brochure.image} alt={brochure.name} />
              <a
    href="./Broucherpdfs/STS_Contents.pdf" /* Replace with the actual path to your PDF file */
    className="broucherfirstpage-download-text"
    download="STSContents.pdf" /* Optional: Set a default file name */
  >
    Download Here
  </a>
            </div>
            {/* Brochure Info */}
            <div className="broucher-info">
              <h2>{brochure.name}</h2>
            </div>
            {/* Bottom Description */}
            <div className="card-bottom-description">
              {brochure.bottomDescription}
            </div>
            

            
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Broucher;
