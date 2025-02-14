


import React, { useState } from "react";
import "./Homologation.css";
import homologationnew from "../../assets/images/Homologationnew.png";
const Homologation = () => {
  const cards = [
    {
      imgSrc: "Homologationnew.png",
      title: "",
      description: "",
    },
    {
      title: "What is Homologation?",
      description:
        "Homologation Documentation Pre homologation Testing and validation certification",
      details:
        "Learn more about the importance and steps involved in Homologation.",
    },
    {
      title: "Pre-Homologation Process",
      description:
        "Pre-Homologation is nothing but the performance of all critical tests as per the applicable regulations, similar to actual tests performed by the testing agency during the approval process.",
      details:
        "Learn more about simulation testing, prototype evaluations, and regulatory alignment.",
    },
    {
      title: "Type Approval Process",
      description:
        "Expert Advice:\n- Documentation Process\n- Product Data Table Preparation\n- Certification Initiation\n- Execution of Approval Process\n- Certification Grant",
      details:
        "Learn more about obtaining official certification and managing approval workflows.",
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
                  {index === 0 && (
                    <>
                      <img
                        src={card.imgSrc}
                        alt={card.title}
                        className="card-image fill-image"
                      />
                      <div className="image-overlay">
                        <span>Do You Know Homologation?</span>
                      </div>
                    </>
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

export default Homologation;

