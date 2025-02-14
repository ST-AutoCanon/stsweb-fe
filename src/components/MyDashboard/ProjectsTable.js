// import React, { useEffect, useState } from "react";
// import "./ProjectsTable.css";

// const ProjectsTable = () => {
//     const [projects, setProjects] = useState([]);

//     useEffect(() => {
//         fetch("/projectsData.json")
//             .then((response) => response.json())
//             .then((data) => setProjects(data.projects))
//             .catch((error) => console.error("Error fetching data:", error));
//     }, []);

//     return (
//         <div className="projects-table">
//             <h3>Projects</h3>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Project Name</th>
//                         <th>Department</th>
//                         <th>Start Date</th>
//                         <th>End Date</th>
//                         <th>Comments</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {projects.map((project, index) => (
//                         <tr key={index}>
//                             <td>{project.projectName}</td>
//                             <td>{project.dept}</td>
//                             <td>{project.startDate}</td>
//                             <td>{project.endDate}</td>
//                             <td>{project.comments}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ProjectsTable;



// import React, { useEffect, useState } from "react";
// import "./ProjectsTable.css";

// const ProjectsTable = () => {
//     const [projects, setProjects] = useState([]);
//     const [activeTab, setActiveTab] = useState("current");

//     useEffect(() => {
//         fetch("/projectsData.json")
//             .then((response) => response.json())
//             .then((data) => setProjects(data.projects))
//             .catch((error) => console.error("Error fetching data:", error));
//     }, []);

//     const previousProjects = projects.filter(project => new Date(project.endDate) < new Date());
//     const currentProjects = projects.filter(project => new Date(project.endDate) >= new Date());

//     return (
//         <div className="projects-container">
//             <div className="tabs">
//                 <div 
//                     className={`tab ${activeTab === "previous" ? "active" : ""}`} 
//                     onClick={() => setActiveTab("previous")}
//                 >
//                     Previous Projects
//                 </div>
//                 <div 
//                     className={`tab ${activeTab === "current" ? "active" : ""}`} 
//                     onClick={() => setActiveTab("current")}
//                 >
//                     Current Projects
//                 </div>
//             </div>

//             <div className="projects-table">
//                 <h3 className="sub-heading">{activeTab === "previous" ? "Previous Projects" : "Current Projects"}</h3>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Project Name</th>
//                             <th>Department</th>
//                             <th>Start Date</th>
//                             <th>End Date</th>
//                             <th>Comments</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {(activeTab === "previous" ? previousProjects : currentProjects).map((project, index) => (
//                             <tr key={index}>
//                                 <td>{project.projectName}</td>
//                                 <td>{project.dept}</td>
//                                 <td>{project.startDate}</td>
//                                 <td>{project.endDate}</td>
//                                 <td>{project.comments}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ProjectsTable;


import React, { useEffect, useState } from "react";
import "./ProjectsTable.css";

const ProjectsTable = () => {
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
        <div className="projects-container">
            <div className="tabs">
                <div 
                    className={`tab ${activeTab === "previous" ? "active" : ""}`} 
                    onClick={() => setActiveTab("previous")}
                >
                    Previous Projects
                </div>
                <div 
                    className={`tab ${activeTab === "current" ? "active" : ""}`} 
                    onClick={() => setActiveTab("current")}
                >
                    Current Projects
                </div>
            </div>

            <div className="projects-table">
                <h3 className="sub-heading">{activeTab === "previous" ? "Previous Projects" : "Current Projects"}</h3>
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

export default ProjectsTable;
