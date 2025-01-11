// import React, { useState } from "react";
//  import "./Services.css";

// const Services = () => {

  
//   const services = [
//     {
//       id: 1,
//       image: "./images/Itservice1.png",
     
//     },
//     {
//       id: 2,
//       image: "./images/Engineeringservice1.png",
      
//     },
//     {
//       id: 3,
//       image: "./images/otherservice1.png",
      
//     },
//     {
//       id: 4,
//       image: "./images/serviceFour.png",
     
//     },
//   ];
  

//   const [selectedService, setSelectedService] = useState(null);

//   const handleLearnMore = (service) => {
//     setSelectedService(service);
//   };

//   const handleBack = () => {
//     setSelectedService(null);
//   };

//   return (
//     <section className="service123">
//     <div className="services-container">
//       {selectedService ? (
//         <div className="service-detail">
//           <button className="back-button" onClick={handleBack}>
//             ← Back
//           </button>
//           <img
//             className="service-detail-image"
//             src={selectedService.image}
//             alt={selectedService.title}
//           />
//           <h2 className="service-detail-title">{selectedService.title}</h2>
//           <p className="service-detail-description">
//             {selectedService.details}
//           </p>
//         </div>
//       ) : (
//         <>
//           <h2 className="services-header">Our Services</h2>
//           <div className="services-grid">
//             {services.map((service) => (
//               <div key={service.id} className="service-card">
//                 <img
//                   className="service-image"
//                   src={service.image}
//                   alt={service.title}
//                 />
//                 <div className="service-content">
//                   <span className="service-subtitle">{service.subtitle}</span>
//                   <h3 className="service-title">{service.title}</h3>
//                   <p className="service-description">{service.description}</p>
//                   {/* Divider */}
//                   <div className="service-divider"></div>
//                   {/* Button */}
//                   <button
//                     className="service-button"
//                     onClick={() => handleLearnMore(service)}
//                   >
//                     Learn More
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//     </section>
//   );
// };

// export default Services;
import React from "react";
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import "./Services.css";

const Services = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Reordered services array
  const services = [
    { id: 4, image: "./images/serviceFour.png", path: "/service-four" },  // Service Four comes first
    { id: 1, image: "./images/Itservice1.png", path: "/ITNetworkFirst" },  // IT Networking service comes second
    { id: 2, image: "./images/Engineeringservice1.png", path: "/EngineeringServiceFirst" },  // Engineering service third
    { id: 3, image: "./images/otherservice1.png", path: "/OtherServiceFirst" },  // Other service comes last
  ];

  const handleLearnMore = (service) => {
    navigate(service.path);  // Navigate directly to the service page based on path
  };

  return (
    <section className="service123">
      <div className="services-container">
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
                  onClick={() => handleLearnMore(service)} // Trigger navigation on button click
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
