import React, { useState, useEffect } from "react";
import "./ProjectsDashboard.css";
import ProjectForm from "./ProjectForm";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const ProjectCard = ({ projectData, onClick }) => {
  const { company, project, startDate, endDate, clientPOC, stsPOC, milestone } = projectData;
  return (
    <div className="add-project-card" onClick={() => onClick(projectData)} style={{ cursor: "pointer" }}>
      <div className="status-dot"></div>
      <h3>{company}</h3>
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
      <p className="project-value">{milestone}</p>
    </div>
  );
};

const ProjectsDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Current");

  // Get the user role from localStorage
  const userRole = localStorage.getItem("userRole") || "Admin";
  // Retrieve the dashboard data and extract employeeId
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
  const employeeId = dashboardData.employeeId;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use general API for Admin & Finance Manager; otherwise, use employee-specific endpoint.
        let url = `${process.env.REACT_APP_BACKEND_URL}/projects`;
        if (userRole === "Employee" || userRole === "Team Lead") {
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

  // Filter projects based on active tab:
  // - "Completed": show only projects with status "Completed"
  // - "Pending": show only projects with status "Pending"
  // - "Current": show projects with status "Active", "Yet to start", or "On Hold"
  const filteredProjects = projects.filter((proj) => {
    if (activeTab === "Completed") return proj.status === "Completed";
    if (activeTab === "Pending") return proj.status === "Pending";
    if (activeTab === "Current") {
      const currentStatuses = ["Active", "Yet to start", "On Hold"];
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
        <span className={activeTab === "Current" ? "active-tab" : ""} onClick={() => setActiveTab("Current")}>
          Current
        </span>
        <span className={activeTab === "Completed" ? "active-tab" : ""} onClick={() => setActiveTab("Completed")}>
          Completed
        </span>
        <span className={activeTab === "Pending" ? "active-tab" : ""} onClick={() => setActiveTab("Pending")}>
          Pending
        </span>
      </div>

      {/* Project Cards Display */}
      <div className="project-cards-container">
        {filteredProjects.length > 0 ? (
          [...filteredProjects]
            .sort((a, b) => b.id - a.id) // Sort descending by project id
            .map((proj) => <ProjectCard key={proj.id} projectData={proj} onClick={openForm} />)
        ) : (
          <p>No projects available.</p>
        )}
        {userRole === "Admin" && activeTab === "Current" && (
  <div className="add-project-card">
    <button className="add-card-button" onClick={() => openForm()}>
      + Add New Project
      </button>
      </div>
        )}
      </div>
      
      {showForm && (
        <div className="pj-modal">
          <div className="pj-modal-content">
            <ProjectForm projectData={selectedProject} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;
