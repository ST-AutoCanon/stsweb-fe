import React, { useState, useEffect } from "react";
import "./ProjectsDashboard.css";
import ProjectForm from "./ProjectForm";
import { MdUpdate } from "react-icons/md";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const ProjectCard = ({ projectData, onUpdate, userRole, userPosition }) => {
  const { company, project, startDate, endDate, clientPOC, stsPOC, milestone } =
    projectData;

  // Check if the user can raise invoices (Admin or Finance Manager)
  const canRaiseInvoice =
    userRole === "Admin" ||
    (userRole === "Manager" && userPosition === "Finance Manager");

  return (
    <div className="add-project-card" style={{ cursor: "pointer" }}>
      <h3 className="company">
        {company}{" "}
        {userRole !== "Employee" && (
          <MdUpdate
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(projectData);
            }}
            className="pj-update-icon"
          />
        )}
      </h3>
      <p className="project-label">Project Name</p>
      <p className="project-value">{project}</p>
      <p className="project-label">Project Start Date</p>
      <p className="project-value">{formatDate(startDate)}</p>
      <p className="project-label">Project End Date</p>
      <p className="project-value">{formatDate(endDate)}</p>
      <p className="project-label">Client POC</p>
      <p className="project-value">{clientPOC}</p>
      <p className="project-label">STS POC</p>
      <p className="project-value">{stsPOC}</p>
      <p className="project-label">Milestone Status</p>
      <p className="project-value">Phase {milestone}</p>
      <p className="project-value">
        {canRaiseInvoice && (
          <button className="add-project-button">+ Raise Invoice</button>
        )}
      </p>
    </div>
  );
};

const ProjectsDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Current");

  const userRole = localStorage.getItem("userRole") || "Employee";
  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const employeeId = dashboardData.employeeId;
  const userPosition = dashboardData.position;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use general API for Admin and Finance Manager; otherwise, use employee-specific endpoint
        let url = `${process.env.REACT_APP_BACKEND_URL}/projects`;
        if (
          userRole === "Employee" ||
          (userRole === "Manager" && userPosition !== "Finance Manager")
        ) {
          url = `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects?employeeId=${employeeId}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [userRole, employeeId]);

  const openForm = (project = null) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const filteredProjects = projects.filter((proj) => {
    if (activeTab === "Completed") return proj.status === "Completed";
    if (activeTab === "Pending") return proj.status === "Pending";
    if (activeTab === "Current") {
      const currentStatuses = ["Active", "Yet to Start", "On Hold"];
      return currentStatuses.includes(proj.status);
    }
    return false;
  });

  return (
    <div className="project-dashboard">
      <div className="project-header">
        <h2>Update Projects</h2>
        {userRole === "Admin" && (
          <button className="add-project-button" onClick={() => openForm()}>
            + Add New Project
          </button>
        )}
      </div>

      {/* Project Tabs */}
      <div className="project-tabs">
        <span
          className={activeTab === "Current" ? "active-tab" : ""}
          onClick={() => setActiveTab("Current")}
        >
          Current
        </span>
        <span
          className={activeTab === "Completed" ? "active-tab" : ""}
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </span>
        <span
          className={activeTab === "Pending" ? "active-tab" : ""}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
        </span>
      </div>

      {/* Project Cards Display */}
      <div className="project-cards-container">
        {filteredProjects.length > 0 ? (
          [...filteredProjects]
            .sort((a, b) => b.id - a.id)
            .map((proj) => (
              <ProjectCard
                key={proj.id}
                projectData={proj}
                onUpdate={openForm}
                userRole={userRole}
                userPosition={userPosition}
              />
            ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>

      {showForm && (
        <div className="pj-modal">
          <div className="pj-modal-content">
            <ProjectForm
              projectData={selectedProject}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;
