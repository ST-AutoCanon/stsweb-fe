
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import "./Services.css";
import oursrvc from "../../assets/images/oursrvc.png";
import card2image from "../../assets/images/card2image.png";
import engineeringService from "../../assets/images/Engineeringservice1.png";

import otherService from "../../assets/images/Otherservice1.png";
const Services = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Reordered services array
  
  const services = [
    { id: 4, image: oursrvc, path: "/service-four", className: "sticky-image" },
    { id: 1, image: card2image, path: "/ITNetworkFirst", className: "it-image" },
    { id: 2, image: engineeringService, path: "/EngineeringServiceFirst", className: "engineering-image" },
    { id: 3, image: otherService, path: "/OtherServiceFirst", className: "other-image" },
  ];                                                                                                                                                                                                


  const handleLearnMore = (service) => {
    navigate(service.path);  // Navigate directly to the service page based on path
  };

  // State to manage the moving images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    { src: "/images/car.png", duration: 5000,gap:3100 },
    { src: "/images/auto.png", duration: 5000,gap:3100 },
    { src: "/images/bus.png", duration: 80000,gap:100 },
    { src: "/images/autoauto.png", duration: 5000,gap:3100  },
    { src: "/images/bikebike.png", duration: 2500,gap:3100  },
    { src: "/images/lorry.png", duration: 5000,gap:3100  },
    { src: "/images/car.png", duration: 5000,gap:3100 },
    { src: "/images/auto.png", duration: 5000,gap:3100 },
    { src: "/images/bikebike.png", duration: 5000,gap:100  },
  ];

  
 

  useEffect(() => {
    const { duration } = images[currentImageIndex];

    const timeout = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentImageIndex, images]);

  



  return (
    <section className="service123">
      <div className="services-container">
        <h2 className="services-header">Our Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className={`service-card ${service.id === 4 ? 'sticky-card' : ''}`}>
              <div className="service-image-container">
                {service.id === 4 ? (
                  // Sticky image in the first card
                  <img
                    className="service-image sticky-image"
                    src={service.image}
                    alt="Sticky Image"
                  />
                ) : (
                  <img
                    className="service-image"
                    src={service.image}
                    alt={service.title}
                  />
                )}

{service.id === 4 && (
                  <div className="moving-images">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        className={`moving-image ${index === currentImageIndex ? "active" : ""}`}
                        src={process.env.PUBLIC_URL + image.src}
                        alt={`Vehicle ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* <div className="service-content"> */}
                {/* <span className="service-subtitle">{service.subtitle}</span> */}
                {/* <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p> */}
                {/* Divider */}
                {/* <div className="service-divider"></div> */}
                {/* Button */}
                {/* <button
                  className="service-button"
                  onClick={() => handleLearnMore(service)} // Trigger navigation on button click
                >
                  Learn More
                </button> */}
                 {service.id !== 4 && (
        <button
          className="service-button"
          onClick={() => handleLearnMore(service)} // Trigger navigation on button click
        >
          Learn More
        </button>
      )}
              </div>
            // </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
