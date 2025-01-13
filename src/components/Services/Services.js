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
// import React from "react";
// import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
// import "./Services.css";

// const Services = () => {
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Reordered services array
//   const services = [
//     { id: 4, image: "./images/serviceFour.png", path: "/service-four" },  // Service Four comes first
//     { id: 1, image: "./images/Itservice1.png", path: "/ITNetworkFirst" },  // IT Networking service comes second
//     { id: 2, image: "./images/Engineeringservice1.png", path: "/EngineeringServiceFirst" },  // Engineering service third
//     { id: 3, image: "./images/otherservice1.png", path: "/OtherServiceFirst" },  // Other service comes last
//   ];

//   const handleLearnMore = (service) => {
//     navigate(service.path);  // Navigate directly to the service page based on path
//   };

//   return (
//     <section className="service123">
//       <div className="services-container">
//         <h2 className="services-header">Our Services</h2>
//         <div className="services-grid">
//           {services.map((service) => (
//             <div key={service.id} className="service-card">
//               <img
//                 className="service-image"
//                 src={service.image}
//                 alt={service.title}
//               />
//               <div className="service-content">
//                 <span className="service-subtitle">{service.subtitle}</span>
//                 <h3 className="service-title">{service.title}</h3>
//                 <p className="service-description">{service.description}</p>
//                 {/* Divider */}
//                 <div className="service-divider"></div>
//                 {/* Button */}
//                 <button
//                   className="service-button"
//                   onClick={() => handleLearnMore(service)} // Trigger navigation on button click
//                 >
//                   Learn More
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Services;
//  import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
// import "./Services.css";
// import Service_BG8 from "../../assets/images/Service_BG8.png";
// import card2image from "../../assets/images/card2image.png";
// import engineeringService from "../../assets/images/Engineeringservice1.png";
// import otherService from "../../assets/images/Otherservice1.png";

// const Services = () => {
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Reordered services array
  
//   const services = [
//     { id: 4, image: Service_BG8, path: "/service-four", className: "sticky-image" },
//     { id: 1, image: card2image, path: "/ITNetworkFirst", className: "it-image" },
//     { id: 2, image: engineeringService, path: "/EngineeringServiceFirst", className: "engineering-image" },
//     { id: 3, image: otherService, path: "/OtherServiceFirst", className: "other-image" },
//   ];                                                                                                                                                                                                


//   const handleLearnMore = (service) => {
//     navigate(service.path);  // Navigate directly to the service page based on path
//   };

//   // State to manage the moving images
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const images = [
//     "./images/car.png", 
//     "./images/auto.png", 
//     "./images/bikebike.png",
//     "./images/bus.png",
    
//     "./images/autoauto.png",
    
//     "./images/lorry.png"

//   ];  // Add more images as needed

//   // Change the image every 6 seconds after the current image moves out of view
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     },8500); // Adjust interval to match the image movement duration (6 seconds)
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="service123">
//       <div className="services-container">
//         <h2 className="services-header">Our Services</h2>
//         <div className="services-grid">
//           {services.map((service) => (
//             <div key={service.id} className={`service-card ${service.id === 4 ? 'sticky-card' : ''}`}>
//               <div className="service-image-container">
//                 {service.id === 4 ? (
//                   // Sticky image in the first card
//                   <img
//                     className="service-image sticky-image"
//                     src={service.image}
//                     alt="Sticky Image"
//                   />
//                 ) : (
//                   <img
//                     className="service-image"
//                     src={service.image}
//                     alt={service.title}
//                   />
//                 )}

//                 {service.id === 4 && (
//                   // Overlay moving images (car, auto, bus)
//                   <div className="moving-images">
//                     <img
//                       className="moving-image"
//                       src={images[currentImageIndex]}
//                       alt="Moving Image"
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <div className="service-content"> */}
//                 {/* <span className="service-subtitle">{service.subtitle}</span> */}
//                 {/* <h3 className="service-title">{service.title}</h3>
//                 <p className="service-description">{service.description}</p> */}
//                 {/* Divider */}
//                 {/* <div className="service-divider"></div> */}
//                 {/* Button */}
//                 {/* <button
//                   className="service-button"
//                   onClick={() => handleLearnMore(service)} // Trigger navigation on button click
//                 >
//                   Learn More
//                 </button> */}
//                  {service.id !== 4 && (
//         <button
//           className="service-button"
//           onClick={() => handleLearnMore(service)} // Trigger navigation on button click
//         >
//           Learn More
//         </button>
//       )}
//               </div>
//             // </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Services;



import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import "./Services.css";
import Service_BG8 from "../../assets/images/Service_BG8.png";
import card2image from "../../assets/images/card2image.png";
import engineeringService from "../../assets/images/Engineeringservice1.png";
import otherService from "../../assets/images/Otherservice1.png";

const Services = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Reordered services array
  
  const services = [
    { id: 4, image: Service_BG8, path: "/service-four", className: "sticky-image" },
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
    { src: "/images/car.png", duration: 5000,gap:2900 },
    { src: "/images/auto.png", duration: 5000,gap:2900 },
    { src: "/images/bus.png", duration: 5000,gap:2900 },
    { src: "/images/autoauto.png", duration: 5000,gap:2900  },
    { src: "/images/bikebike.png", duration: 5000,gap:2900  },
    { src: "/images/lorry.png", duration: 5000,gap:2900  },
    { src: "/images/car.png", duration: 5000,gap:2900 },
    { src: "/images/auto.png", duration: 5000,gap:2900 },
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
