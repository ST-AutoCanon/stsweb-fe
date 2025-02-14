import React, { useRef } from "react";
import "./MajorProjects.css";

const MajorProjects = () => {
  const scrollContainerRef = useRef(null);

  const projects = [
    {
      title: "E-Bus",
      description:
        "Product Design & Development, Sourcing, CAE Analysis, Testing & Validation & Certification",
      imageUrl: "./images/majorproj1.png",
    },
    {
      title: "Two Wheeler",
      description: "Product design & development & CAE Analysis",
      imageUrl: "./images/majorproj2.png",
    },
    {
      title: "Electric Tractor",
      description:
        "Product design & development, Sourcing, CAE Analysis, Testing & Validation Homologation",
      imageUrl: "./images/majorproj3.png",
    },
    {
      title: "Three Wheeler",
      description:
        "Styling/Product Design & Development, Sourcing, Proto Development, Coordination with testing agencies, Vehicle Testing & Validation, CMVR Certification",
      imageUrl: "./images/majorservice6.png",
    },
    {
      title: "Truk",
      description:
        "AI-powered drones with advanced navigation and obstacle avoidance technology.",
      imageUrl: "./images/truck.png",
    },
  ];

  const handleLastCardHover = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300; // Adjust scroll amount based on card width
    }
  };

  return (
    <div className="projects-container">
      <h2>Major Projects Executed</h2>
      <div className="projects-grid" ref={scrollContainerRef}>
        {projects.map((project, index) => (
          <div
            key={index}
            className={`project-card ${
              index === projects.length - 1 ? "last-card" : ""
            }`}
            onMouseEnter={index === projects.length - 1 ? handleLastCardHover : null} // Trigger scroll on last card hover
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="project-image"
            />
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MajorProjects;