import React, { useState } from "react";
import "./Services.css";

const Services = () => {
  const services = [
    {
      id: 1,
      image: "./images/service1.png",
      subtitle: "Service 1",
      title: "Engineering and R & D Outsourcing",
      description:
        "Sukalpa Tech abides by its meaning by utilising advanced technologies & well-qualified experienced staff.",
      details:
        "Engineering and R&D outsourcing services include comprehensive solutions such as concept design, prototyping, testing, and production support. Our team is dedicated to delivering high-quality results, leveraging cutting-edge technologies and industry expertise to accelerate innovation.",
    },
    {
      id: 2,
      image: "./images/service2.png",
      subtitle: "Service 2",
      title: "IT & Networking Services",
      description:
        "We ensure seamless integration of IT infrastructure and networking solutions for your business.",
      details:
        "Our IT and Networking Services provide reliable and scalable solutions for businesses, including system integration, cloud services, network security, and IT infrastructure management, ensuring optimal performance and security.",
    },
    {
      id: 3,
      image: "./images/service3.png",
      subtitle: "Service 3",
      title: "E-Mobility Services",
      description:
        "Revolutionizing mobility through advanced e-mobility services and support.",
      details:
        "E-Mobility Services include support for electric vehicles, charging infrastructure, and sustainable mobility solutions, contributing to a greener future with efficient and eco-friendly technologies.",
    },
    {
      id: 4,
      image: "./images/service4.png",
      subtitle: "Service 4",
      title: "Homologation Support",
      description:
        "Revolutionizing mobility through advanced e-mobility services and support.",
      details:
        "Our Homologation Support Services ensure compliance with regulatory standards for automotive products, guiding businesses through certification processes with expert assistance.",
    },
  ];

  const [selectedService, setSelectedService] = useState(null);

  const handleLearnMore = (service) => {
    setSelectedService(service);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <section className="service123">
    <div className="services-container">
      {selectedService ? (
        <div className="service-detail">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <img
            className="service-detail-image"
            src={selectedService.image}
            alt={selectedService.title}
          />
          <h2 className="service-detail-title">{selectedService.title}</h2>
          <p className="service-detail-description">
            {selectedService.details}
          </p>
        </div>
      ) : (
        <>
          <h2 className="services-header">Our Services</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <img
                  className="service-image"
                  src={service.image}
                  alt={service.title}
                />
                <div className="service-content">
                  <span className="service-subtitle">{service.subtitle}</span>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  {/* Divider */}
                  <div className="service-divider"></div>
                  {/* Button */}
                  <button
                    className="service-button"
                    onClick={() => handleLearnMore(service)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </section>
  );
};

export default Services;
