import React, { useEffect, useState } from "react";
import "./EmpProjectTable.css";

const EmpProjectTable = () => {
    const [previousProjects, setPreviousProjects] = useState([]);
    const [currentProjects, setCurrentProjects] = useState([]);
    const [activeTab, setActiveTab] = useState("current");

    useEffect(() => {
        fetch("/currentProjectsData.json")
            .then((response) => response.json())
            .then((data) => setCurrentProjects(data.projects))
            .catch((error) => console.error("Error fetching current projects data:", error));
    }, []);

    useEffect(() => {
        fetch("/previousProjectsData.json")
            .then((response) => response.json())
            .then((data) => setPreviousProjects(data.projects))
            .catch((error) => console.error("Error fetching previous projects data:", error));
    }, []);

    return (
        <div className="emp-projects-container">
            <div className="emp-tabs">
                <div 
                    className={`emp-tab ${activeTab === "previous" ? "emp-active" : ""}`} 
                    onClick={() => setActiveTab("previous")}
                >
                    Previous Projects
                </div>
                <div 
                    className={`emp-tab ${activeTab === "current" ? "emp-active" : ""}`} 
                    onClick={() => setActiveTab("current")}
                >
                    Current Projects
                </div>
            </div>

            <div className="emp-projects-table">
                <h3 className="emp-sub-heading">{activeTab === "previous" ? "Previous Projects" : "Current Projects"}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Department</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(activeTab === "previous" ? previousProjects : currentProjects).map((project, index) => (
                            <tr key={index}>
                                <td>{project.projectName}</td>
                                <td>{project.dept}</td>
                                <td>{project.startDate}</td>
                                <td>{project.endDate}</td>
                                <td>{project.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmpProjectTable;
