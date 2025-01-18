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
    "./images/gallery3.jpg",
    "./images/s1.jpeg",
    "./images/grp2.jpeg",
    "./images/grp3.jpeg",
    "./images/gallery8.jpg",
  ];

  const descriptions = [
    "Description for Image 1",
    "Description for Image 2",
    "Description for Image 3",
    "Description for Image 4",
  ];

  const secondSectionDescriptions = [
    "Description for Idea 1",
    "Description for Idea 2",
    "Description for Idea 3",
    "Description for Idea 4",
    "Description for Idea 5",
  ];

  const handleImageClick = (index, section) => {
    setSelectedImage(index);
    setSelectedSection(section); // Track which section the image came from
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null);
    setSelectedSection(""); // Reset the section tracking
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
          <p>
            {selectedImage !== null
              ? descriptions[selectedImage]
              : "Explore Our collection of designs that represent our identity,and commitment to excellence.This represents the foundation of journey towards success."}
          </p>
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
                  : secondSectionImages[selectedImage]
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

      {/* Second Page Section */}
      <div className="second-gallery-container">
        <div className="second-gallery-content">
          <div className="second-left-info">
            <h2>Team Celebration Event</h2>
            <p>
            Employees gather for a joyous team event, where gifts are distributed as tokens of appreciation for their hard work and dedication throughout the year.          </p>
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
    </div>
  );
};

export default Gallery;
