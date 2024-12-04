import React, { useState } from "react";
import "./Homologation.css";

const HomologationPage = () => {
  const cards = [
    {
      imgSrc: "./images/homologation1.png",
      title: "",
      description: "",
    },
    {
      title: "What is Homologation?",
      description:
        "Explore our comprehensive range of homologation services tailored for all your approval needs.",
      details:
        "Homologation is the process of certifying that a particular product meets the required standards and specifications. It ensures compliance with government and international regulations. Our services include guidance on certifications, documentation preparation, and testing procedures.",
      imgSrc: "./images/homologation2.png",
    },
    {
      title: "Pre-Homologation Process",
      description:
        "Pre-Homologation is the performance of critical tests as per applicable regulations, similar to actual tests performed by the testing agency during the approval process.",
      details:
        "The Pre-Homologation process involves extensive testing and validation to ensure products meet compliance standards before formal certification. Our expertise includes simulation testing, prototype evaluations, and regulatory alignment.",
      imgSrc: "./images/homologation3.png",
    },
    {
      title: "Type Approval Process",
      description:
        "Expert Advice:\n- Documentation Process\n- Product Data Table Preparation\n- Certification Initiation\n- Execution of Approval Process\n- Certification Grant",
      details:
        "The Type Approval Process involves obtaining official certification for a product. We assist in preparing the required documents, managing approval workflows, and ensuring the smooth execution of certification procedures.",
      imgSrc: "./images/homologation4.png",
    },
  ];

  const [selectedCard, setSelectedCard] = useState(null);

  const handleLearnMore = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  return (
    <section className="homologation123">
    <div className="homologation-container">
      {selectedCard ? (
        <div className="homologation-detail">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <img
            src={selectedCard.imgSrc}
            alt={selectedCard.title}
            className="detail-image"
          />
          <h2 className="detail-title">{selectedCard.title}</h2>
          <p className="detail-description">{selectedCard.details}</p>
        </div>
      ) : (
        <div className="homologation-cards">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`homologation-card ${index === 0 ? "first-card" : ""}`}
            >
              <div className="image-wrapper">
                <img
                  src={card.imgSrc}
                  alt={card.title}
                  className={`card-image ${
                    index === 0 ? "fill-image" : "resizable-image"
                  }`}
                />
                {index === 0 && (
                  <div className="image-overlay">
                    <span>Do You Know Homologation?</span>
                  </div>
                )}
              </div>
              {index !== 0 && (
                <>
                  <h2 className="card-title">{card.title}</h2>
                  <p className="card-description">{card.description}</p>
                  <div className="learn-more-wrapper">
                    <div className="learn-more-line"></div>
                    <button
                      className="learn-more-btn"
                      onClick={() => handleLearnMore(card)}
                    >
                      Learn More
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </section>
  );
};

export default HomologationPage;

