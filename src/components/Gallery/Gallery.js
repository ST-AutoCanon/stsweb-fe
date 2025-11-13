import React, { useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); // To track which section the image is from

  const images = [
    "./images/gallery2.jpg",
    "./images/gallery4.jpg",
    "./images/Atc2.png",
    "./images/gallery9.jpg",
  ];

  const secondSectionImages = [
    "./images/pic3.jpg",
    "./images/pic1.jpg",
    "./images/pic2.jpg",
    "./images/pic14.jpeg",
    "./images/pic7.jpeg",
  ];

  const thirdSectionImages = [
    "./images/pic8.jpeg",
    "./images/pic9.jpeg",
    "./images/pic5.jpeg",
    "./images/pic13.jpg",
    "./images/pic11.jpg",
  ];

  const handleImageClick = (index, section) => {
    setSelectedImage(index);
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedSection("");
  };

  return (
    <div>
      {/* First Page: Image Stack and Info Section */}
      <div className="gallery-container">
        <div className="image-stack">
          {images.map((src, index) => (
            <div
              className={`image-item ${selectedImage === index && selectedSection === "first" ? "active" : ""}`}
              key={index}
              onClick={() => handleImageClick(index, "first")}
            >
              <img src={src} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="info-section">
          <h2>{selectedImage !== null ? "Selected Idea" : "Our Creative Vision and Innovation"}</h2>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                selectedSection === "first"
                  ? images[selectedImage]
                  : selectedSection === "second"
                  ? secondSectionImages[selectedImage]
                  : thirdSectionImages[selectedImage]
              }
              alt={`Enlarged Image ${selectedImage + 1}`}
              className="modal-image"
            />
            <button className="modal-close" onClick={closeModal}>
              X
            </button>
          </div>
        </div>
      )}

      {/* Second Page Section: Team Celebration Event */}
      <div className="second-gallery-container">
        <div className="second-gallery-content">
          <div className="second-left-info">
            <h2>A Glimpse Of Our Team</h2>
            <p>
              Employees gather for a joyous team event, stronger connections, Happier Faces and lasting memories.
            </p>
          </div>
          <div className="second-right-images">
            {secondSectionImages.map((src, index) => (
              <div
                key={index}
                className="second-side-image-container"
                onClick={() => handleImageClick(index, "second")}
              >
                <img src={src} alt={`Idea ${index + 1}`} className="second-side-image" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Page Section: Another Team Event */}
      <div className="third-gallery-container">
        <div className="third-gallery-content">
          <div className="third-left-images">
            {thirdSectionImages.map((src, index) => (
              <div
                key={index}
                className="third-side-image-container"
                onClick={() => handleImageClick(index, "third")}
              >
                <img src={src} alt={`Idea ${index + 1}`} className="third-side-image" />
              </div>
            ))}
          </div>
          <div className="third-right-info">
            <h2> Team Event</h2>
            <p>
              Join us in celebrating another milestone with our team, filled with joy, collaboration, and memorable moments that strengthen our bond and commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;