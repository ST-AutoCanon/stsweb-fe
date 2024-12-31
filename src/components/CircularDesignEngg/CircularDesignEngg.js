import React, { useState, useEffect, useRef } from "react";
import StylingProductDesign from "../StylingProductDesign/StylingProductDesign";
import CAEAnalysis from "../CAEAnalysis/CAEAnalysis";
import Tooling from "../Tooling/Tooling";
import ConsultingExpertise from "../ConsultingExpertise/ConsultingExpertise ";
import ExportHomologation from "../ExportHomologation/ExportHomologation";
import DomesticTypeApproval from "../DomesticTypeApproval/DomesticTypeApproval";
import "./CircularDesignEngg.css";

const CircularDesignEngg = () => {
  const [activeSection, setActiveSection] = useState("styling-product-design");
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
      text: "Styling Product Design",
      link: "styling-product-design",
      content: <StylingProductDesign />,
      degree: isMobile ? 0 : -350,
      reverse: false, // Image first, then text
      offsetX: isMobile ? 70 : 370,
      offsetY: isMobile ? 40 : 90,
      lineClass: "line-1-engg",
    },
    {
      text: "CAE Analysis",
      link: "cae-analysis",
      content: <CAEAnalysis />,
      degree: isMobile ? 300 : 30,
      reverse: false, // Image first, then text
      offsetX: isMobile ? 220 : 380,
      offsetY: isMobile ? 310 : 200,
      lineClass: "line-2-engg",
    },
    {
      text: "Tooling,jigs & Fixtures",
      link: "tooling",
      content: <Tooling />,
      degree: isMobile ? 60 : 90,
      reverse: false, // Image first, then text
      offsetX: isMobile ? 150 : 390,
      offsetY: isMobile ? 180 : 290,
      lineClass: "line-3-engg",
    },
    {
      text: "Consulting",
      link: "consulting-expertise",
      content: <ConsultingExpertise />,
      degree: isMobile ? 180 : 150,
      reverse: true, // Text first, then image
      offsetX: isMobile ? 120 : 70,
      offsetY: isMobile ? 180 : 200,
      lineClass: "line-4-engg",
    },
    {
      text: "Export Homologation",
      link: "export-homologation",
      content: <ExportHomologation />,
      degree: isMobile ? 240 : 210,
      reverse: true, // Text first, then image
      offsetX: isMobile ? 80 : 80,
      offsetY: isMobile ? 170 : 170,
      lineClass: "line-5-engg",
    },
    {
      text: "Domestic Type Approval",
      link: "domestic-type-approval",
      content: <DomesticTypeApproval />,
      degree: isMobile ? 175
       : 270,
      reverse: true, // Text first, then image
      offsetX: isMobile ? 140 : -30,
      offsetY: isMobile ? 300 : 590,
      lineClass: "line-6-engg",
    },
  ];
  

  const handleButtonClick = (section) => {
    setActiveSection(section);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="circular123-engg">
      <div className="circular-container-engg">
        <div className="central-wrapper-engg">
          <div className="central-image-engg">
            <img src="/images/CircularimageLogo.png" alt="Central Logo" />
          </div>
        </div>
        {items.map((item, index) => (
          <div
            key={index}
            className="circular-item-engg"
            style={{
              transform: `rotate(${item.degree}deg) translate(150px) rotate(-${item.degree}deg)`,
              left: `${item.offsetX}px`,
              top: `${item.offsetY}px`,
            }}
          >
            <div className={`line-engg ${item.lineClass}`}></div>
            <button
  className={`circular-button-engg ${
    activeSection === item.link ? "active-button-engg" : ""
  } ${item.reverse ? "reverse" : ""}`}
  onClick={() => handleButtonClick(item.link)}
>
  {item.reverse ? (
    <>
      <p>{item.text}</p>
      <img src="/images/GreenCircle.png" alt={item.text} />
    </>
  ) : (
    <>
      <img src="/images/GreenCircle.png" alt={item.text} />
      <p>{item.text}</p>
    </>
  )}
</button>
          </div>
        ))}
      </div>
      <section ref={sectionRef} className="page-section-engg">
        {items.find((item) => item.link === activeSection)?.content}
      </section>
    </section>
  );
};

export default CircularDesignEngg;