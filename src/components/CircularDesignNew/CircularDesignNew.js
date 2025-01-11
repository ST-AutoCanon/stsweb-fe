// import React, { useState, useEffect, useRef } from "react";
// import ChatbotApplication from "../ChatbotApplication/ChatbotApplication";
// import ITConsulting from "../ITConsulting/ITConsulting";
// import SoftwareDevelopment from "../SoftwareDevelopment/SoftwareDevelopment";
// import ThreeDModeling from "../ThreeDModeling/ThreeDModeling";
// import WebsiteDesign from "../WebsiteDesign/WebsiteDesign";
// import TestingAndQA from "../TestingAndQA/TestingAndQA";
// import "./CircularDesignNew.css";

// const CircularDesignNew = () => {
//   const [activeSection, setActiveSection] = useState("chatbot-application");
//   const sectionRef = useRef(null);

//   const items = [
//     {
//       text: "Chat Bot Application",
//       link: "chatbot-application",
//       content: <ChatbotApplication />,
//       degree: -50,
//       reverse: false,
//       offsetX: 380,
//       offsetY: 90,
//       lineClass: "line-1-new",
//     },
//     {
//       text: "IT Consulting",
//       link: "it-consulting",
//       content: <ITConsulting />,
//       degree: 30,
//       reverse: false,
//       offsetX: 380,
//       offsetY: 200,
//       lineClass: "line-2-new",
//     },
//     {
//       text: "Software Development",
//       link: "software-development",
//       content: <SoftwareDevelopment />,
//       degree: 90,
//       reverse: false,
//       offsetX: 370,
//       offsetY: 290,
//       lineClass: "line-3-new",
//     },
//     {
//       text: "3D Modelling",
//       link: "three-d-modelling",
//       content: <ThreeDModeling />,
//       degree: 150,
//       reverse: true,
//       offsetX: 70,
//       offsetY: 200,
//       lineClass: "line-4-new",
//     },
//     {
//       text: "Website Design",
//       link: "website-design",
//       content: <WebsiteDesign />,
//       degree: 210,
//       reverse: true,
//       offsetX: 140,
//       offsetY: 170,
//       lineClass: "line-5-new",
//     },
//     {
//       text: "Testing & QA",
//       link: "testing-and-qa",
//       content: <TestingAndQA />,
//       degree: 270,
//       reverse: true,
//       offsetX: 30,
//       offsetY: 590,
//       lineClass: "line-6-new",
//     },
//   ];

//   const handleButtonClick = (section) => {
//     setActiveSection(section);
//     if (sectionRef.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   return (
//     <section className="circular123-new">
//       <div className="circular-container-new">
//         <div className="central-wrapper-new">
//           <div className="central-image-new">
//             <img src="/images/SL.png" alt="Central Logo" />
//           </div>
//         </div>
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="circular-item-new"
//             style={{
//               transform: `rotate(${item.degree}deg) translate(150px) rotate(-${item.degree}deg)`,
//               left: `${item.offsetX}px`,
//               top: `${item.offsetY}px`,
//             }}
//           >
//             <div className={`line-new ${item.lineClass}`}></div>
//             <button
//               className={`circular-button-new ${activeSection === item.link ? "active-button-new" : ""}`}
//               onClick={() => handleButtonClick(item.link)}
//             >
//               {!item.reverse && <img src="/images/GreenCircle.png" alt={item.text} />}
//               <p>{item.text}</p>
//               {item.reverse && <img src="/images/GreenCircle.png" alt={item.text} />}
//             </button>
//           </div>
//         ))}
//       </div>
//       <section ref={sectionRef} className="page-section-new">
//         {items.find((item) => item.link === activeSection)?.content}
//       </section>
//     </section>
//   );
// };

// export default CircularDesignNew;


import React, { useState, useEffect, useRef } from "react";
import ChatbotApplication from "../ChatbotApplication/ChatbotApplication";
import ITConsulting from "../ITConsulting/ITConsulting";
import SoftwareDevelopment from "../SoftwareDevelopment/SoftwareDevelopment";
import ThreeDModeling from "../ThreeDModeling/ThreeDModeling";
import WebsiteDesign from "../WebsiteDesign/WebsiteDesign";
import TestingAndQA from "../TestingAndQA/TestingAndQA";
import "./CircularDesignNew.css";

const CircularDesignNew = () => {
  const [activeSection, setActiveSection] = useState("chatbot-application");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
    {
      text: "Chat Bot Application",
      link: "chatbot-application",
      content: <ChatbotApplication />,
      degree: isMobile ? 0 : -250,
      reverse: false,
      offsetX: isMobile ? 50: 370,
      offsetY: isMobile ? 90 : 90,
      lineClass: "line-1-new",
    },
    {
      text: "IT Consulting",
      link: "it-consulting",
      content: <ITConsulting />,
      degree: isMobile ? 300 : 30,
      reverse: false,
      offsetX: isMobile ? 175 : 380,
      offsetY: isMobile ? 320 : 200,
      lineClass: "line-2-new",
    },
    {
      text: "Software Development",
      link: "software-development",
      content: <SoftwareDevelopment />,
      degree: isMobile ? 60 : 90,
      reverse: false,
      offsetX: isMobile ? 120 : 370,
      offsetY: isMobile ? 150 : 290,
      lineClass: "line-3-new",
    },
    {
      text: "3D Modelling",
      link: "three-d-modelling",
      content: <ThreeDModeling />,
      degree: isMobile ? 180 : 150,
      reverse: true,
      offsetX: isMobile ? 170 : 70,
      offsetY: isMobile ? 190 : 200,
      lineClass: "line-4-new",
    },
    {
      text: "Website Design",
      link: "website-design",
      content: <WebsiteDesign />,
      degree: isMobile ? 240 : 210,
      reverse: true,
      offsetX: isMobile ? 100 : 140,
      offsetY: isMobile ? 220 : 170,
      lineClass: "line-5-new",
    },
    {
      text: "Testing & QA",
      link: "testing-and-qa",
      content: <TestingAndQA />,
      degree: isMobile ? 175 : 270,
      reverse: true,
      offsetX: isMobile ? 190 : 30,
      offsetY: isMobile ? 270 : 590,
      lineClass: "line-6-new",
    },
  ];

  const handleButtonClick = (section) => {
    setActiveSection(section);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="circular123-new">
      <div className="circular-container-new">
        <div className="central-wrapper-new">
          <div className="central-image-new">
            <img src="/images/CircularimageLogo.png" alt="Central Logo" />
          </div>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="circular-item-new"
            style={{
              transform: `rotate(${item.degree}deg) translate(150px) rotate(-${item.degree}deg)`,
              left: `${item.offsetX}px`,
              top: `${item.offsetY}px`,
            }}
          >
            <div className={`line-new ${item.lineClass}`}></div>
            <button
              className={`circular-button-new ${
                activeSection === item.link ? "active-button-new" : ""
              } ${item.reverse ? "reverse" : ""}`}
              onClick={() => handleButtonClick(item.link)}
            >
              {!item.reverse && (
                <img src="/images/GreenCircle.png" alt={item.text} />
              )}
              <p>{item.text}</p>
              {item.reverse && (
                <img src="/images/GreenCircle.png" alt={item.text} />
              )}
            </button>
          </div>
        ))}
      </div>
      <section ref={sectionRef} className="page-section-new">
        {items.find((item) => item.link === activeSection)?.content}
      </section>
    </section>
  );
};

export default CircularDesignNew;
