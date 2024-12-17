//Connected Network Page

//Header Files 
import React from "react";
import "./CardLayout.css";

//Details of Cards
const cardData = [
  { id: 1, title: "Software Development", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about2.png" },
  { id: 2, title: "Application Development", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about3.png" },
  { id: 3, title: "Website Design & Development", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about10.png" },
  { id: 4, title: "Mentainance & Enanhncement", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about4.png" },
  { id: 5, title: "Campus & Wireless", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about5.png" },
  { id: 6, title: "Cloud & Solutions", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about5.png" },
  { id: 7, title: "IT Consulting", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about6.png" },
  { id: 8, title: "Testing & QA", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about7.png" },
  { id: 9, title: "Cloud Solutions", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgPath: "./images/about8.png" },
];


// CardLayout
const CardLayout = () => {

  return (
    <div className="grid-container">
    <h2 className="card-header">connected network</h2>

      {cardData.map((card) => (
        <div className="card" key={card.id}>
          <img src={card.imgPath} alt={card.title} className="card-image" />
          <h3 className="card-title">{card.title}</h3>
          <p className="card-description">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CardLayout;
