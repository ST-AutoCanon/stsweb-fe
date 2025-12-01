import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./ProjectsDashboard.css";
import ProjectForm from "./ProjectForm";
import InvoiceTemplate from "./InvoiceTemplate";
import DownloadForm from "./DownloadForm";
import Invoice from "./Invoice";
import { MdUpdate } from "react-icons/md";
import { FiDownload, FiEye } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DownloadDetailsList from "./DownloadDetailsList";

const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";

  const options = { day: "2-digit", month: "short", year: "numeric" };

  if (dateInput instanceof Date && !isNaN(dateInput)) {
    return dateInput.toLocaleDateString("en-GB", options);
  }

  if (typeof dateInput === "number") {
    const dt = new Date(dateInput);
    return isNaN(dt) ? "N/A" : dt.toLocaleDateString("en-GB", options);
  }

  if (typeof dateInput === "string") {
    const s = dateInput.trim();

    const dateOnlyMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return dt.toLocaleDateString("en-GB", options);
    }

    const isoMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      const [ymd] = isoMatch;
      const [y, m, d] = ymd.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString("en-GB", options);
    }

    const fallback = new Date(s);
    return isNaN(fallback)
      ? "N/A"
      : fallback.toLocaleDateString("en-GB", options);
  }

  return "N/A";
};

const getInvoiceTypeKey = (type) => {
  switch (type) {
    case "Tax Invoice":
      return "tax";
    case "Proforma Invoice":
      return "proforma";
    case "Quotation":
      return "quotation";
    default:
      return "tax";
  }
};

const getFormattedInvoiceNumber = (typeKey, sequence) => {
  const padded = sequence.toString().padStart(4, "0");
  switch (typeKey) {
    case "tax":
      return `STS/25-26/${padded}`;
    case "proforma":
      return `STS/25-26/PI/${padded}`;
    case "quotation":
      return `STS-Q-${padded}`;
    default:
      return `STS/25-26/${padded}`;
  }
};

const ProjectCard = ({
  projectData,
  onUpdate,
  onViewInvoices,
  userRole,
  userDepartment,
  canRaiseInvoice,
}) => {
  const { company, project, startDate, endDate, clientPOC, stsPOC, milestone } =
    projectData;

  return (
    <div className="add-project-card" style={{ cursor: "pointer" }}>
      <div className="company">
        <h3>{company}</h3>
        {userRole !== "Employee" ? (
          <MdUpdate
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(projectData);
            }}
            className="pj-update-icon"
          />
        ) : null}
      </div>
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
        {canRaiseInvoice ? (
          <button
            className="add-project-button"
            onClick={() => onViewInvoices(projectData)}
          >
            + Raise Invoice
          </button>
        ) : null}
      </p>
    </div>
  );
};

const ProjectsDashboard = () => {
  const [currentScreen, setCurrentScreen] = useState("projects");
  const [showForm, setShowForm] = useState(false);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Current");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("Tax Invoice");
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [invoiceNumberDirect, setInvoiceNumberDirect] = useState("");
  const [invoiceSequence, setInvoiceSequence] = useState(1);
  const [downloadDetails, setDownloadDetails] = useState({});

  const userRole = localStorage.getItem("userRole") || "Employee";
  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const userDepartment = dashboardData.department || null;
  const employeeId = dashboardData.employeeId;

  const normalizedRole = (userRole || "").trim();
  const normalizedDept = (userDepartment || "").trim().toLowerCase();

  const isAdmin = normalizedRole === "Admin";
  const isFinanceDept = normalizedDept === "finance";
  const isFinanceManager =
    isFinanceDept &&
    (normalizedRole === "Manager" || normalizedRole === "Financial Manager");

  const canAccessGeneralTemplates = isAdmin || isFinanceManager;

  const fetchProjects = async () => {
    try {
      let url = `${process.env.REACT_APP_BACKEND_URL}/projects`;
      if (userRole === "Employee" || userRole === "Manager") {
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

  useEffect(() => {
    fetchProjects();
  }, [userRole, employeeId]);

  const handleProjectAdded = () => {
    fetchProjects();
  };

  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const printRef = useRef(null);
  const invoiceTypeKey = getInvoiceTypeKey(selectedInvoiceType);
  const invoiceNumber = getFormattedInvoiceNumber(
    invoiceTypeKey,
    invoiceSequence
  );

  useLayoutEffect(() => {
    if (currentScreen !== "invoices") return;
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const prevOverflow = contentEl.style.overflow;
    contentEl.style.overflow = "hidden";

    contentEl.scrollTop = 0;
    void contentEl.offsetHeight;

    requestAnimationFrame(() => {
      contentEl.style.overflow = prevOverflow || "auto";

      const invoiceEl = document.getElementById("invoiceScreen");
      if (invoiceEl) {
        const target = invoiceEl.offsetTop || 0;
        contentEl.scrollTo({ top: Math.max(0, target), behavior: "auto" });
      } else {
        contentEl.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }, [currentScreen]);

  useEffect(() => {
    const adjustHeight = () => {
      const navbar =
        document.querySelector("nav") ||
        document.querySelector(".navbar") ||
        document.querySelector("#navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      if (contentRef.current) {
        contentRef.current.style.height = `${
          window.innerHeight - navbarHeight
        }px`;
      }
    };
    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, []);

  useEffect(() => {
    fetchInvoiceSequence();
  }, [selectedInvoiceType]);

  const fetchInvoiceSequence = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/invoice/template-number?invoiceType=${invoiceTypeKey}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch invoice number");
      const data = await response.json();
      if (data && data.invoiceNo) {
        setInvoiceNumberDirect(data.invoiceNo);
      }
    } catch (error) {
      console.error("Error fetching invoice number:", error);
    }
  };

  const updateInvoiceNumber = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/invoice/sequence/${invoiceTypeKey}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data && data.updatedSequence) {
        setInvoiceSequence(data.updatedSequence);
      }
    } catch (error) {
      console.error("Error updating invoice number:", error);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!printRef.current) return;
    try {
      await fetchInvoiceSequence();
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename = `${invoiceNumberDirect}.pdf`;
      pdf.save(filename);
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/download-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
          invoiceType: invoiceTypeKey,
          invoiceNumber: invoiceNumberDirect,
          downloadDetails,
        }),
      });
      await updateInvoiceNumber();
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const openForm = (project = null) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const openInvoiceScreen = (project) => {
    setTimeout(() => {
      try {
        const active = document.activeElement;
        if (active && typeof active.blur === "function") {
          active.blur();
        }
      } catch (e) {}
    }, 0);

    setSelectedProject(project);
    setCurrentScreen("invoices");
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

  const handleDownloadFormSubmit = (formData) => {
    setDownloadDetails(formData);
    setShowDownloadForm(false);
  };

  return (
    <div className="project-dashboard">
      <div className="project-content" ref={contentRef}>
        {currentScreen === "projects" && (
          <>
            <div className="project-header" ref={headerRef}>
              <h2>Update Projects</h2>
              {userRole === "Admin" ? (
                <button
                  className="add-project-button"
                  onClick={() => openForm()}
                >
                  + Add New Project
                </button>
              ) : null}
            </div>

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
              {canAccessGeneralTemplates ? (
                <span
                  className={
                    activeTab === "General Templates" ? "active-tab" : ""
                  }
                  onClick={() => setActiveTab("General Templates")}
                >
                  General Templates
                </span>
              ) : null}
            </div>

            {activeTab !== "General Templates" && (
              <div className="project-cards-container">
                {filteredProjects.length > 0 ? (
                  [...filteredProjects]
                    .sort((a, b) => b.id - a.id)
                    .map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        projectData={proj}
                        onUpdate={openForm}
                        onViewInvoices={openInvoiceScreen}
                        userRole={userRole}
                        userDepartment={userDepartment}
                        canRaiseInvoice={canAccessGeneralTemplates}
                      />
                    ))
                ) : (
                  <p>No projects available.</p>
                )}
              </div>
            )}

            {activeTab === "General Templates" && canAccessGeneralTemplates ? (
              <div className="general-templates-section">
                <div className="template-controls">
                  <label htmlFor="invoiceTypeSelect">Invoice Type: </label>
                  <select
                    id="invoiceTypeSelect"
                    value={selectedInvoiceType}
                    onChange={(e) => setSelectedInvoiceType(e.target.value)}
                  >
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Proforma Invoice">Proforma Invoice</option>
                    <option value="Quotation">Quotation</option>
                  </select>
                  <button
                    className="download-form-button"
                    onClick={() => {
                      setShowTemplatePreview(false);
                      setShowDownloadForm(true);
                    }}
                  >
                    Add Details
                  </button>
                  <button
                    className="view-template-button"
                    onClick={() => {
                      setShowTemplatePreview((prev) => !prev);
                      setShowDownloadForm(false);
                    }}
                  >
                    {showTemplatePreview ? "Hide" : "View"}{" "}
                    <FiEye className="template-icons" />
                  </button>
                  <button
                    className="download-template-button"
                    onClick={handleDownloadTemplate}
                  >
                    Download <FiDownload className="template-icons" />
                  </button>
                </div>
                {showTemplatePreview ? (
                  <div className="template-preview">
                    <InvoiceTemplate
                      invoiceType={selectedInvoiceType}
                      invoiceNumber={invoiceNumberDirect}
                      downloadDetails={downloadDetails}
                    />
                  </div>
                ) : null}
                <DownloadDetailsList />
              </div>
            ) : null}
          </>
        )}

        {showForm ? (
          <div className="pj-modal">
            <div className="pj-modal-content">
              <ProjectForm
                projectData={selectedProject}
                onClose={() => setShowForm(false)}
                onProjectAdded={handleProjectAdded}
              />
            </div>
          </div>
        ) : null}

        {currentScreen === "invoices" ? (
          <Invoice
            project={selectedProject}
            onBack={() => setCurrentScreen("projects")}
          />
        ) : null}

        {currentScreen === "projects" &&
        showDownloadForm &&
        activeTab === "General Templates" ? (
          <DownloadForm
            onSubmit={handleDownloadFormSubmit}
            onCancel={() => setShowDownloadForm(false)}
          />
        ) : null}

        <div
          style={{ position: "absolute", top: "-10000px", left: "-10000px" }}
        >
          <div ref={printRef}>
            <InvoiceTemplate
              invoiceType={selectedInvoiceType}
              invoiceNumber={invoiceNumberDirect}
              downloadDetails={downloadDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
