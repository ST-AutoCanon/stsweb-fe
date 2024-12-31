import React, { useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); // To track which section the image is from

  const images = [
    "./images/g10.jpg",
    "./images/g2.jpg",
    "./images/g3.jpg",
    "./images/g4.jpg",
  ];

  const secondSectionImages = [
    "./images/g1.jpg",
    "./images/g2.jpg",
    "./images/g3.jpg",
    "./images/g4.jpg",
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
          <h2>{selectedImage !== null ? "Selected Idea" : "Diwali Celebration at the Office"}</h2>
          <p>
            {selectedImage !== null
              ? descriptions[selectedImage]
              : "Join us as we celebrate the Festival of Lights with joy, unity, and festive spirit in the workplace!"}
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
            <h2>Cheers to a New Year: Office Celebration Awaits!</h2>
            <p>
            
Celebrate the arrival of the new year with us! Enjoy a festive atmosphere, fun activities, and a chance to unwind with colleagues. Let’s make this year’s office celebration one to remember!
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
    </div>
  );
};

export default Gallery;
