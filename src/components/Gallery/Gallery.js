import React, { useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); // To track which section the image is from

  const images = [
    "./images/grp6.jpg",
    "./images/grp7.jpg",
    "./images/grp1.jpeg",
    "./images/grp5.jpg",
  ];

  const secondSectionImages = [
    "./images/grp8.jpeg",
    "./images/grp2.jpeg",
    "./images/grp4.jpeg",
    "./images/grp3.jpeg",
    "./images/g5.jpg",
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
          <h2>{selectedImage !== null ? "Selected Idea" : "Capturing Moments of Celebration"}</h2>
          <p>
            {selectedImage !== null
              ? descriptions[selectedImage]
              : "A glimpse of the joyous  celebrations at the office,showcasing the vibrant teamwork, unity, and festive cheer among colleagues."}
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
            <p className="modal-description">
              {selectedSection === "first"
                ? descriptions[selectedImage]
                : secondSectionDescriptions[selectedImage]}
            </p>
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
