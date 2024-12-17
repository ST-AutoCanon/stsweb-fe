//Major Projects Page

//Header Files
import React from "react";
import "./MajorProjects.css";



//Adding Details of Projects in a card
const MajorProjects = () => {

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
      title: "Electric 2&3 Wheelers",
      description:
        "Styling/Product Design & Development, Sourcing, Proto Development, Coordination with testing agencies, Vehicle Testing & Validation, CMVR Certification",
        imageUrl: "./images/majorproj4.png",
    },
  ];

  return (

    /*Project Container*/
    <div className="projects-container">
      <h2>Major Projects Executed</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (

          /*Division for Project card*/
          <div key={index} className="project-card">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="project-image"
            />
            {/*Division for Project card information*/}
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
