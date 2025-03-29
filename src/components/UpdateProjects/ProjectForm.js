import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ProjectForm.css";
import { MdOutlineCancel, MdSearch } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import Modal from "../Modal/Modal";

const userRole = localStorage.getItem("userRole") || "Employee";
const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
const userPosition = dashboardData.position || null;

const rolePermissions = {
  Admin: {
    allowedSteps: [1, 2, 3, 4],
    editable: { 1: true, 2: true, 3: true, 4: true },
  },
  Employee: {
    allowedSteps: [1, 2, 3],
    editable: { 1: false, 2: false, 3: false },
  },
  Manager: {
    allowedSteps: [1, 2, 3],
    editable: { 1: false, 2: false, 3: true },
  },
};

// Special case for Finance Manager (if role is "Manager" and position is "Finance Manager")
if (userRole === "Manager" && userPosition === "Finance Manager") {
  rolePermissions.Manager = {
    allowedSteps: [1, 2, 3, 4],
    editable: { 1: false, 2: false, 3: false, 4: true },
  };
}

const { allowedSteps, editable } =
  rolePermissions[userRole] || rolePermissions.Employee;

const getStatusBgColor = (status) => {
  switch (status) {
    case "Active":
      return "#d1ecf1";
    case "Pending":
      return "#fff3cd";
    case "Completed":
      return "#d4edda";
    default:
      return "transparent";
  }
};

const getFinanceStatusColor = (status) => {
  switch (status) {
    case "not Initiated":
      return "#d1ecf1";
    case "Pending":
      return "#fff3cd";
    case "Received":
      return "#d4edda";
    default:
      return "#f7f7f7";
  }
};

const MultiStepForm = ({ onClose, projectData }) => {
  const dropdownRef = useRef(null);
  const [step, setStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [points, setPoints] = useState([""]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const userRole = localStorage.getItem("userRole");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAttachments, setNewAttachments] = useState([]);

  const [formData, setFormData] = useState({
    company_name: "",
    project_name: "",
    project_poc: "",
    company_gst: "",
    company_pan: "",
    company_address: "",
    project_category: [],
    start_date: "",
    end_date: "",
    service_mode: "",
    service_location: "",
    project_status: "",
    description: "",
    attachment_url: [],
    sts_owner_id: "",
    sts_owner: "",
    sts_contact: "",
    employee_list: [],
    key_considerations: [],
    milestones: [],
    project_amount: "",
    tds_percentage: "",
    tds_amount: "",
    gst_percentage: "",
    gst_amount: "",
    total_amount: "",
    financialDetails: [],
  });

  // Alert modal state (no title by default)
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Helper functions for the alert modal
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/employees`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        const employeesData = response.data.data
          ? response.data.data
          : response.data;

        setAllEmployees(employeesData);

        setFilteredEmployees(employeesData);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {
    if (filterType === "all") {
      if (!searchQuery.trim()) {
        setFilteredEmployees(allEmployees);
      } else {
        const lowerSearch = searchQuery.trim().toLowerCase();
        setFilteredEmployees(
          allEmployees.filter((emp) => {
            const name = emp.name || "";
            const employeeId = emp.employee_id || "";
            const deptName = emp.department_name || "";
            return (
              name.toLowerCase().includes(lowerSearch) ||
              employeeId.toLowerCase().includes(lowerSearch) ||
              deptName.toLowerCase().includes(lowerSearch)
            );
          })
        );
      }
    } else if (filterType === "dept") {
      const uniqueDepts = [
        ...new Set(
          allEmployees
            .filter(
              (emp) => emp.department_name && emp.department_name.trim() !== ""
            )
            .map((emp) => emp.department_name.trim())
        ),
      ];

      setFilteredEmployees(
        uniqueDepts.map((dept) => ({ name: dept, type: "department" }))
      );
    }
  }, [searchQuery, filterType, allEmployees]);

  const stsOwners = allEmployees.filter(
    (emp) => emp.role === "Admin" || emp.role === "Manager"
  );

  const filterEmployees = (employeesList, type) => {
    if (type === "dept" && projectData?.department) {
      const departmentEmployees = employeesList.filter(
        (emp) => emp.department_name === projectData.department
      );
      setFilteredEmployees(departmentEmployees);
    } else {
      setFilteredEmployees(employeesList);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files.map((file) => file.name)); // For display
    setNewAttachments(files); // Store the File objects for submission
    // Optionally, update formData too if needed:
    setFormData((prev) => ({ ...prev, attachment_url: files }));
  };

  // Handle checkbox change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    // No direct call to setFilteredEmployees here!
  };

  const handleDepartmentDoubleClick = (departmentName) => {
    if (!allEmployees || allEmployees.length === 0) return;
    const departmentEmployees = allEmployees.filter(
      (emp) => emp.department_name === departmentName
    );
    setSelectedEmployees((prev) => {
      const existingIds = new Set(prev.map((emp) => emp.employee_id));
      const newEmployees = departmentEmployees.filter(
        (emp) => !existingIds.has(emp.employee_id)
      );
      return [...prev, ...newEmployees];
    });
  };

  // Handle employee selection on double click
  const handleDoubleClick = (employee) => {
    if (!employee) return;

    const newEmployee = {
      employee_id: employee.employee_id,
      name: employee.name,
      department_id: employee.department_id,
      department_name: employee.department_name,
    };

    setSelectedEmployees((prev) => {
      if (prev.some((emp) => emp.employee_id === newEmployee.employee_id)) {
        return prev;
      }
      const updatedEmployees = [...prev, newEmployee];

      // ✅ Update formData inside the same function
      setFormData((prev) => ({
        ...prev,
        employee_list: updatedEmployees.map((emp) => emp.employee_id),
      }));

      return updatedEmployees;
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return ""; // Handle undefined/null values
    return new Date(isoString).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employee_list: selectedEmployees.map((emp) => emp.employee_id),
    }));
    console.log("Updated Employee List in Form:", selectedEmployees);
  }, [selectedEmployees]);

  useEffect(() => {
    if (addMilestone.length > 0 && projectData?.employee_list) {
      setSelectedEmployees(
        allEmployees.filter((emp) =>
          projectData.employee_list.includes(emp.employee_id)
        )
      );
    }
  }, [allEmployees, projectData]);

  useEffect(() => {
    if (projectData?.id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/projects/${projectData.id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.project) {
            setFormData((prev) => ({
              ...prev,
              ...data.project,
              employee_list: data.project.employee_list || [],
              key_considerations: Array.isArray(data.project.key_considerations)
                ? data.project.key_considerations
                : [],
            }));
            // Ensure selectedFiles is always an array
            setSelectedFiles(
              Array.isArray(data.project.attachment_url)
                ? data.project.attachment_url
                : data.project.attachment_url
                ? [data.project.attachment_url]
                : []
            );
            setSelectedEmployees(
              allEmployees.filter((emp) =>
                data.project.employee_list.includes(emp.employee_id)
              )
            );
          }
        })
        .catch((error) =>
          console.error("Error fetching project details:", error)
        );
    }
  }, [projectData, allEmployees]);

  // ✅ Prevent rendering if formData is still loading
  if (!formData || Object.keys(formData).length === 0) {
    return <p>Loading...</p>;
  }

  // ✅ Ensure formData.project_category is always an array
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedCategories = checked
        ? [...prev.project_category, value]
        : prev.project_category.filter((cat) => cat !== value);
      return { ...prev, project_category: updatedCategories };
    });
  };

  useEffect(() => {
    if (formData.key_considerations && formData.key_considerations.length > 0) {
      setPoints(formData.key_considerations);
    }
  }, [formData.key_considerations]);

  const handleInputChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);

    // ✅ Also update formData
    setFormData((prev) => ({
      ...prev,
      key_considerations: newPoints,
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newPoints = [...points, ""];
      setPoints(newPoints);

      // ✅ Sync with formData
      setFormData((prev) => ({
        ...prev,
        key_considerations: newPoints,
      }));
    } else if (
      e.key === "Backspace" &&
      points[index] === "" &&
      points.length > 1
    ) {
      e.preventDefault();
      const newPoints = points.slice(0, index).concat(points.slice(index + 1));
      setPoints(newPoints);

      // ✅ Sync with formData
      setFormData((prev) => ({
        ...prev,
        key_considerations: newPoints,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = projectData
      ? `${process.env.REACT_APP_BACKEND_URL}/projects/${projectData.id}`
      : `${process.env.REACT_APP_BACKEND_URL}/projects`;
    const method = projectData ? "PUT" : "POST";

    // Create a FormData object
    const submissionData = new FormData();

    // Append form fields (excluding attachments)
    for (const key in formData) {
      if (key !== "attachment_url") {
        let value = formData[key];
        // If value is an object (or array), stringify it
        if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        submissionData.append(key, value);
      }
    }

    // Append each file from attachment_url (if any)
    if (newAttachments && newAttachments.length > 0) {
      newAttachments.forEach((file) => {
        submissionData.append("attachment_url", file);
      });
    }

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: submissionData,
      });
      console.log("Submitting formData:", formData);

      if (!response.ok) {
        throw new Error("Failed to save project");
      }
      showAlert("Project saved successfully!");
      // Wait a moment (or you can remove this delay if you want the user to close the alert manually)
      setTimeout(() => {
        onClose();
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const steps = [
    "Project Details",
    "STS Owners",
    "Milestone",
    "Financial Details",
  ];
  const visibleSteps = steps.filter((_, index) =>
    allowedSteps.includes(index + 1)
  );
  const visibleCount = visibleSteps.length;

  let totalLineWidth = "68%";
  let lineLeft = "16%";
  if (visibleCount === 3) {
    totalLineWidth = "60%";
    lineLeft = "20%";
  }

  const maxIndex = visibleCount - 1;
  const currentStepName = steps[step - 1];
  const currentIndex = visibleSteps.indexOf(currentStepName);
  const progressValue =
    maxIndex > 0 ? (currentIndex / maxIndex) * parseFloat(totalLineWidth) : 0;
  const progressPercent = `${progressValue}%`;

  const categories = [
    "Website Design",
    "Chatbot Application",
    "3D Modeling",
    "IT consulting",
    "Software Development",
    "Testing and QA",
    "Styling Product design",
    "Export Homologation",
    "Consulting",
    "CAE",
    "Domestic Type Approval",
    "Tooling, jigs and fixtures",
    "Staffing and Training services",
  ];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => {
      let newData = { ...prevData };

      if (type === "file") {
        newData[name] = files[0];
        return newData;
      }

      let projectAmount = parseFloat(prevData.project_amount) || 0;
      let tdsPercentage = parseFloat(prevData.tds_percentage) || 0;
      let gstPercentage = parseFloat(prevData.gst_percentage) || 0;

      let tdsAmount = (tdsPercentage / 100) * projectAmount;
      let gstAmount = (gstPercentage / 100) * projectAmount;
      let totalAmount = projectAmount - tdsAmount + gstAmount;

      if (name === "project_amount") {
        projectAmount = parseFloat(value) || 0;
        tdsAmount = (tdsPercentage / 100) * projectAmount;
        gstAmount = (gstPercentage / 100) * projectAmount;
        totalAmount = projectAmount - tdsAmount + gstAmount;

        let updatedFinancialDetails = (prevData.financialDetails || []).map(
          (fd) => {
            if (fd.m_actual_percentage) {
              const mActualPercent = parseFloat(fd.m_actual_percentage) || 0;
              const newActualAmount = (mActualPercent / 100) * projectAmount;
              const mTdsPercentage = parseFloat(fd.m_tds_percentage) || 0;
              const mGstPercentage = parseFloat(fd.m_gst_percentage) || 0;
              const newTdsAmount = (mTdsPercentage / 100) * newActualAmount;
              const newGstAmount = (mGstPercentage / 100) * newActualAmount;
              const newTotalAmount =
                newActualAmount - newTdsAmount + newGstAmount;
              return {
                ...fd,
                m_actual_amount: newActualAmount,
                m_tds_amount: newTdsAmount,
                m_gst_amount: newGstAmount,
                m_total_amount: newTotalAmount.toFixed(2),
              };
            }
            return fd;
          }
        );

        return {
          ...newData,
          project_amount: projectAmount,
          tds_amount: tdsAmount.toFixed(2),
          gst_amount: gstAmount.toFixed(2),
          total_amount: totalAmount.toFixed(2),
          financialDetails: updatedFinancialDetails,
        };
      }

      if (name === "tds_percentage") {
        tdsPercentage = parseFloat(value) || 0;
        tdsAmount = (tdsPercentage / 100) * projectAmount;
        totalAmount = projectAmount - tdsAmount + gstAmount;

        return {
          ...newData,
          tds_percentage: value,
          tds_amount: tdsAmount.toFixed(2),
          total_amount: totalAmount.toFixed(2),
        };
      }

      if (name === "gst_percentage") {
        gstPercentage = parseFloat(value) || 0;
        gstAmount = (gstPercentage / 100) * projectAmount;
        totalAmount = projectAmount - tdsAmount + gstAmount;

        return {
          ...newData,
          gst_percentage: value,
          gst_amount: gstAmount.toFixed(2),
          total_amount: totalAmount.toFixed(2),
        };
      }

      return { ...newData, [name]: value };
    });
  };

  const handleMilestoneChange = (index, event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[index][name] = value;

      const updatedFinancialDetails = [...prev.financialDetails];
      if (name === "details") {
        updatedFinancialDetails[index].milestone_details = value;
      }

      return {
        ...prev,
        milestones: updatedMilestones,
        financialDetails: updatedFinancialDetails,
      };
    });
  };

  const handleFinanceChange = (index, e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newFinanceDetails = [...prevData.financialDetails];
      const projectAmount = parseFloat(prevData.project_amount) || 0;

      if (!newFinanceDetails[index]) {
        newFinanceDetails[index] = {};
      }

      if (name === "m_actual_percentage") {
        const percentValue = parseFloat(value) || 0;
        const newActualAmount = (percentValue / 100) * projectAmount;
        const mTdsPercentage =
          parseFloat(newFinanceDetails[index].m_tds_percentage) || 0;
        const mGstPercentage =
          parseFloat(newFinanceDetails[index].m_gst_percentage) || 0;
        const newTdsAmount = (mTdsPercentage / 100) * newActualAmount;
        const newGstAmount = (mGstPercentage / 100) * newActualAmount;
        newFinanceDetails[index] = {
          ...newFinanceDetails[index],
          m_actual_percentage: value,
          m_actual_amount: newActualAmount,
          m_tds_amount: newTdsAmount,
          m_gst_amount: newGstAmount,
        };
      }

      if (name === "m_actual_amount") {
        const newActualAmount = parseFloat(value) || 0;
        newFinanceDetails[index] = {
          ...newFinanceDetails[index],
          m_actual_amount: newActualAmount,
        };
        const mTdsPercentage =
          parseFloat(newFinanceDetails[index].m_tds_percentage) || 0;
        const mGstPercentage =
          parseFloat(newFinanceDetails[index].m_gst_percentage) || 0;
        const newTdsAmount = (mTdsPercentage / 100) * newActualAmount;
        const newGstAmount = (mGstPercentage / 100) * newActualAmount;
        newFinanceDetails[index] = {
          ...newFinanceDetails[index],
          m_tds_amount: newTdsAmount,
          m_gst_amount: newGstAmount,
        };
      }

      if (name === "m_tds_percentage") {
        const percentValue = parseFloat(value) || 0;
        const actual =
          parseFloat(newFinanceDetails[index].m_actual_amount) || 0;
        const newTdsAmount = (percentValue / 100) * actual;
        newFinanceDetails[index] = {
          ...newFinanceDetails[index],
          m_tds_percentage: value,
          m_tds_amount: newTdsAmount,
        };
      }

      if (name === "m_gst_percentage") {
        const percentValue = parseFloat(value) || 0;
        const actual =
          parseFloat(newFinanceDetails[index].m_actual_amount) || 0;
        const newGstAmount = (percentValue / 100) * actual;
        newFinanceDetails[index] = {
          ...newFinanceDetails[index],
          m_gst_percentage: value,
          m_gst_amount: newGstAmount,
        };
      }

      const actualAmount =
        parseFloat(newFinanceDetails[index].m_actual_amount) || 0;
      const tdsAmount = parseFloat(newFinanceDetails[index].m_tds_amount) || 0;
      const gstAmount = parseFloat(newFinanceDetails[index].m_gst_amount) || 0;
      newFinanceDetails[index].m_total_amount = (
        actualAmount -
        tdsAmount +
        gstAmount
      ).toFixed(2);

      return {
        ...prevData,
        financialDetails: newFinanceDetails,
      };
    });
  };

  const addMilestone = () => {
    const newMilestone = {
      details: "",
      start_date: "",
      end_date: "",
      status: "",
      dependency: "",
      assigned_to: "",
    };

    const newFinancialEntry = {
      milestone_details: "",
      m_actual_percentage: "",
      m_actual_amount: "",
      m_tds_percentage: "",
      m_tds_amount: "",
      m_gst_percentage: "",
      m_gst_amount: "",
      m_total_amount: "",
      status: "",
    };

    setFormData((prev) => ({
      ...prev,
      milestones: [...(prev.milestones || []), newMilestone],
      financialDetails: [...(prev.financialDetails || []), newFinancialEntry],
    }));
  };

  useEffect(() => {
    setFormData((prev) => {
      const milestones = Array.isArray(prev.milestones) ? prev.milestones : [];
      const financialDetails = Array.isArray(prev.financialDetails)
        ? prev.financialDetails
        : [];

      const updatedFinancialDetails = financialDetails.map((fd, index) => {
        if (milestones[index] && typeof milestones[index] === "object") {
          return {
            ...fd,
            milestone_id: milestones[index].id || fd.milestone_id,
            milestone_details:
              milestones[index].details || fd.milestone_details,
          };
        }
        return fd;
      });

      if (milestones.length > updatedFinancialDetails.length) {
        const diff = milestones.length - updatedFinancialDetails.length;
        for (let i = 0; i < diff; i++) {
          const milestone = milestones[updatedFinancialDetails.length + i];
          if (milestone && typeof milestone === "object") {
            updatedFinancialDetails.push({
              milestone_details: milestone.details || "",
              m_actual_percentage: "",
              m_actual_amount: "",
              m_tds_percentage: "",
              m_tds_amount: "",
              m_gst_percentage: "",
              m_gst_amount: "",
              m_total_amount: "",
              status: "",
              milestone_id: milestone.id || null,
            });
          }
        }
      }
      return { ...prev, financialDetails: updatedFinancialDetails };
    });
  }, [formData.milestones]);

  const handleRemoveEmployee = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.filter((emp) => emp.employee_id !== employeeId)
    );
  };

  const handleStatusChange = (index, newStatus) => {
    setFormData((prevData) => {
      const updatedFinancialDetails = [...prevData.financialDetails];
      updatedFinancialDetails[index] = {
        ...updatedFinancialDetails[index],
        status: newStatus,
        completed_date:
          newStatus === "Received" ? new Date().toLocaleDateString() : "",
      };
      return { ...prevData, financialDetails: updatedFinancialDetails };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const getStepClass = (index) => {
    if (index < step - 1) return "pj-step-item completed";
    if (index === step - 1) return "pj-step-item active";
    return "pj-step-item";
  };

  const downloadAllAttachments = async (projectId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}/attachments/download`,
        {
          method: "GET",
          credentials: "include", // to send session cookies if needed
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attachments");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${projectId}-attachments.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading attachments:", error);
    }
  };

  const openAttachment = async (fileName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/pjattachments/${fileName}`,
        {
          method: "GET",
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, // Include API key here
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the file.");
      }

      // Convert response to a Blob
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Open file in a new window
      window.open(blobUrl, "_blank");

      // Revoke the object URL after some time to free memory
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error("Error opening attachment:", error);
    }
  };

  return (
    <div className="pj-form-container">
      <div className="pj-form-header">
        <h2 className="pj-form-title">
          {projectData ? "Update Project" : "Add New Project"}
        </h2>
        <MdOutlineCancel className="pj-close-btn" onClick={onClose} />
      </div>
      {/* Step Navigation */}
      <div
        className="pj-step-navigation"
        style={{
          "--step-line-left": lineLeft,
          "--step-line-total-width": totalLineWidth,
          "--step-progress-width": progressPercent,
        }}
      >
        <div className="pj-step-bg"></div>
        <div className="pj-step-line"></div>
        {steps
          .filter((_, index) => allowedSteps.includes(index + 1))
          .map((stepName, index) => (
            <div key={index} className="pj-step-item">
              <div
                className={`pj-step-circle ${
                  allowedSteps[index] < step
                    ? "completed"
                    : allowedSteps[index] === step
                    ? "active"
                    : ""
                }`}
              ></div>
              {stepName}
            </div>
          ))}
      </div>
      {/* Form Steps */}
      <div className="pj-form-content">
        {allowedSteps.includes(1) && step === 1 && (
          <div className="pj-step-one">
            <div className="pj-form-grid">
              <div className="pj-form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Project POC</label>
                <input
                  type="text"
                  name="project_poc"
                  value={formData.project_poc}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Company GST</label>
                <input
                  type="text"
                  name="company_gst"
                  value={formData.company_gst}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Company PAN</label>
                <input
                  type="text"
                  name="company_pan"
                  value={formData.company_pan}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Company Address</label>
                <input
                  type="text"
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group1">
                <label className="project-category">Project Category</label>
                <div className="custom-dropdown" ref={dropdownRef}>
                  <div className="dropdown-header" onClick={toggleDropdown}>
                    {formData.project_category.length > 0
                      ? formData.project_category.join(", ")
                      : "Select Categories"}
                  </div>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      {categories.map((category) => (
                        <label key={category} className="dropdown-item">
                          <input
                            type="checkbox"
                            value={category}
                            checked={formData.project_category.includes(
                              category
                            )}
                            onChange={handleCategoryChange}
                            disabled={!editable[1]}
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="pj-form-group">
                <label>Tentative Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formatDate(formData.start_date)}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Tentative End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formatDate(formData.end_date)}
                  onChange={handleChange}
                  min={formData.start_date}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Mode of Service</label>
                <select
                  name="service_mode"
                  value={formData.service_mode}
                  onChange={handleChange}
                  disabled={!editable[1]}
                >
                  <option value=" ">Select Mode</option>
                  <option value="Online">Online</option>
                  <option value="Working at STS">Working at STS</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Working at client location">
                    Working at client location
                  </option>
                </select>
              </div>
              <div className="pj-form-group">
                <label>Service Location</label>
                <input
                  type="text"
                  name="service_location"
                  value={formData.service_location}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                />
              </div>
              <div className="pj-form-group">
                <label>Project Status</label>
                <select
                  name="project_status"
                  value={formData.project_status}
                  onChange={handleChange}
                  disabled={!editable[1]}
                >
                  <option value=" ">Select Status</option>
                  <option value="Yet to Start">Yet to Start</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="pj-form-row">
              <div className="pj-description">
                <label>Project Description</label>
                <textarea
                  placeholder="Describe project..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  readOnly={!editable[1]}
                ></textarea>
              </div>
              <div className="pj-attachment">
                <label>Attachment</label>
                <div className="pj-attachment-wrapper">
                  <div className="pj-file-links">
                    {Array.isArray(selectedFiles) &&
                    selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p
                          key={index}
                          className={`pj-file-name ${
                            !editable[1] ? "disabled" : ""
                          }`}
                          onClick={() =>
                            editable[1] && openAttachment(fileName)
                          }
                        >
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>
                  <div className="pj-attachment-upload">
                    <input
                      type="file"
                      multiple
                      id="fileInput"
                      className="pj-hidden-file-input"
                      name="attachment_url"
                      onChange={handleFileUpload}
                      disabled={!editable[1]} // Use disabled instead of readOnly
                    />
                    <label
                      htmlFor="fileInput"
                      className={`pj-custom-file-upload ${
                        !editable[1] ? "disabled" : ""
                      }`}
                    >
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {allowedSteps.includes(2) && step === 2 && (
          <div className="pj-step-two">
            <div className="step-two-grid">
              <div className="pj-form-group2">
                <label>STS Owner</label>
                <select
                  name="sts_owner_id"
                  value={formData.sts_owner_id || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    // Find the employee in the stsOwners list using the selected id
                    const selectedEmp = stsOwners.find(
                      (emp) => emp.employee_id === selectedId
                    );
                    setFormData((prev) => ({
                      ...prev,
                      // Set both the owner id and the owner's name/contact
                      sts_owner_id: selectedId,
                      sts_owner: selectedEmp ? selectedEmp.name : "",
                      sts_contact: selectedEmp ? selectedEmp.phone_number : "",
                    }));
                  }}
                  disabled={!editable[2]}
                >
                  <option value="">Select STS Owner</option>
                  {stsOwners.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="pj-form-group2">
                <label>STS Contact</label>
                <input
                  type="text"
                  name="sts_contact"
                  value={formData.sts_contact}
                  readOnly={!editable[2]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sts_contact: e.target.value,
                    }))
                  }
                />
              </div>
              {/* Employee Selection */}
              <div className="pj-form-group2">
                <label>
                  Add Employees{" "}
                  <div className="pj-search-box">
                    <MdSearch className="pj-search-icon" />
                    <input
                      type="text"
                      className="pj-search-input"
                      placeholder="Search by Name, EmpID or Dept"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="dept"
                      checked={filterType === "dept"}
                      onChange={handleFilterChange}
                      readOnly={!editable[2]}
                    />{" "}
                    Dept
                    <input
                      type="checkbox"
                      value="all"
                      checked={filterType === "all"}
                      onChange={handleFilterChange}
                      readOnly={!editable[2]}
                      style={{ marginLeft: "10px" }}
                    />{" "}
                    All
                  </div>
                </label>
                <div className="add-employee">
                  <div className="employee-list">
                    {filteredEmployees.map((item, index) =>
                      item.type === "department" ? (
                        <div
                          key={index}
                          className="employee-item"
                          onDoubleClick={
                            editable[2]
                              ? () => handleDepartmentDoubleClick(item.name)
                              : undefined
                          }
                        >
                          {item.name}
                        </div>
                      ) : (
                        <div
                          key={item.employee_id}
                          className="employee-item"
                          onDoubleClick={
                            editable[2]
                              ? () => handleDoubleClick(item)
                              : undefined
                          }
                        >
                          {item.name} ({item.department_name})
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* Selected Employees */}
              <div className="pj-form-group2">
                <label>Employee List</label>
                <div className="employee-list-box">
                  {selectedEmployees.length > 0 ? (
                    selectedEmployees.map((emp, index) => (
                      <div key={index} className="selected-employee">
                        {emp.name}
                        <span
                          className="remove-employee"
                          onClick={
                            editable[2]
                              ? () => handleRemoveEmployee(emp.employee_id)
                              : undefined
                          }
                        >
                          ❌
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="placeholder-text">
                      double tap on name/dept to add employee
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="key-input">
              <label>Key Considerations</label>
              <div className="key-considerations-box">
                {points.map((point, index) => (
                  <div key={index} className="key-point">
                    {index + 1}.{" "}
                    <input
                      type="text"
                      placeholder="write your points..."
                      value={point}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      readOnly={!editable[2]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {allowedSteps.includes(3) && step === 3 && (
          <div className="pj-step-three">
            <button
              className="add-milestone-btn"
              onClick={addMilestone}
              disabled={!editable[3]}
            >
              + Add New Milestone
            </button>
            <div className="milestone-table-container">
              <table className="milestone-table">
                <thead>
                  <tr>
                    <th>Sl no</th>
                    <th>Milestone Details</th>
                    <th>Start Date</th>
                    <th>Expected End Date</th>
                    <th>Current Status</th>
                    <th>Dependency</th>
                    <th>Responsible By</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.milestones.map((milestone, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: getStatusBgColor(milestone.status),
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          name="details"
                          value={milestone.details}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          readOnly={!editable[3]}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="start_date"
                          value={formatDate(milestone.start_date)}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          readOnly={!editable[3]}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="end_date"
                          value={formatDate(milestone.end_date)}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          min={milestone.start_date}
                          readOnly={!editable[3]}
                        />
                      </td>
                      <td>
                        <select
                          name="status"
                          value={milestone.status}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          disabled={!editable[3]}
                          style={{
                            backgroundColor: getStatusBgColor(milestone.status),
                          }}
                        >
                          <option value=" ">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="dependency"
                          value={milestone.dependency}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          readOnly={!editable[3]}
                        />
                      </td>
                      <td>
                        <select
                          name="assigned_to"
                          value={milestone.assigned_to || ""}
                          onChange={(e) => handleMilestoneChange(index, e)}
                          disabled={!editable[3]}
                        >
                          <option value="">Responsible By</option>
                          {stsOwners.map((emp) => (
                            <option
                              key={emp.employee_id}
                              value={emp.employee_id}
                            >
                              {emp.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {allowedSteps.includes(4) && step === 4 && (
          <div className="pj-step-four">
            <div className="project-finance-main">
              <div className="project-finance">
                <div className="project-finance-group">
                  <label>Project Amount</label>
                  <input
                    type="number"
                    name="project_amount"
                    value={formData?.project_amount || ""}
                    onChange={handleChange}
                    readOnly={!editable[4]}
                  />
                </div>
                <div className="project-finance-group">
                  <label>TDS</label>
                  <div className="step-four-group">
                    <div className="small-input">
                      <input
                        type="number"
                        name="tds_percentage"
                        value={formData?.tds_percentage || ""}
                        onChange={handleChange}
                        readOnly={!editable[4]}
                      />
                    </div>
                    <span>%</span>
                    <input
                      type="number"
                      name="tds_amount"
                      value={formData?.tds_amount || ""}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className="project-finance-group">
                  <label>GST</label>
                  <div className="step-four-group">
                    <div className="small-input">
                      <input
                        type="number"
                        name="gst_percentage"
                        value={formData?.gst_percentage || ""}
                        onChange={handleChange}
                        readOnly={!editable[4]}
                      />
                    </div>
                    <span>%</span>
                    <input
                      type="number"
                      name="gst_amount"
                      value={formData?.gst_amount || ""}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className="project-finance-group">
                  <label>Total Amount</label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData?.total_amount || ""}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="project-finance-group">
                  <label>Project Docs</label>
                  <FiDownload
                    className="pj-download"
                    onClick={() => downloadAllAttachments(projectData.id)}
                  />
                </div>
              </div>
            </div>
            <div className="main-finance">
              <h5 className="payout-details">Payout Details</h5>
              <div className="finance-table-container">
                <table className="finance-table">
                  <thead>
                    <tr>
                      <th>Sl no</th>
                      <th>Milestone Details</th>
                      <th>Amount (Incl tax)</th>
                      <th>TDS</th>
                      <th>GST</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Received Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.financialDetails.map((finance, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: getStatusBgColor(
                            formData.milestones[index]?.status
                          ),
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={finance.milestone_details}
                            onChange={(e) => handleFinanceChange(index, e)}
                            readOnly={!editable[4]}
                          />
                        </td>
                        <td>
                          <div className="step-four-group2">
                            <div className="small-input2">
                              <input
                                type="number"
                                name="m_actual_percentage"
                                value={finance.m_actual_percentage}
                                onChange={(e) => handleFinanceChange(index, e)}
                                readOnly={!editable[4]}
                              />
                            </div>
                            <span>%</span>
                            <input
                              type="number"
                              name="m_actual_amount"
                              value={finance.m_actual_amount}
                              onChange={(e) => handleFinanceChange(index, e)}
                              readOnly
                            />
                          </div>
                        </td>
                        <td>
                          <div className="step-four-group2">
                            <div className="small-input2">
                              <input
                                type="number"
                                name="m_tds_percentage"
                                value={finance.m_tds_percentage}
                                onChange={(e) => handleFinanceChange(index, e)}
                                readOnly={!editable[4]}
                              />
                            </div>
                            <span>%</span>
                            <input
                              type="number"
                              name="m_tds_amount"
                              value={finance.m_tds_amount}
                              onChange={(e) => handleFinanceChange(index, e)}
                              readOnly
                            />
                          </div>
                        </td>
                        <td>
                          <div className="step-four-group2">
                            <div className="small-input2">
                              <input
                                type="number"
                                name="m_gst_percentage"
                                value={finance.m_gst_percentage}
                                onChange={(e) => handleFinanceChange(index, e)}
                                readOnly={!editable[4]}
                              />
                            </div>
                            <span>%</span>
                            <input
                              type="number"
                              name="m_gst_amount"
                              value={finance.m_gst_amount}
                              onChange={(e) => handleFinanceChange(index, e)}
                              readOnly
                            />
                          </div>
                        </td>
                        <td>
                          <input
                            type="number"
                            name="m_total_amount"
                            value={finance.m_total_amount}
                            onChange={(e) => handleFinanceChange(index, e)}
                            readOnly={!editable[4]}
                          />
                        </td>
                        <td>
                          <select
                            value={finance.status}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                            disabled={!editable[4]}
                          >
                            <option value="not Initiated">not Initiated</option>
                            <option value="Pending">Pending</option>
                            <option value="Received">Received</option>
                          </select>
                        </td>
                        <td>
                          {finance.status === "Received" &&
                          finance.completed_date ? (
                            <span className="completed-date">
                              📅 {finance.completed_date}
                            </span>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="8" className="summary-row">
                        <span>
                          Total Amount Claiming:{" "}
                          <strong>₹{formData.project_amount || 0}</strong>
                        </span>{" "}
                        |
                        <span>
                          Amount Received:{" "}
                          <strong>
                            ₹
                            {formData.financialDetails.reduce(
                              (acc, finance) =>
                                finance.status === "Received"
                                  ? acc +
                                    parseFloat(finance.m_total_amount || 0)
                                  : acc,
                              0
                            )}
                          </strong>
                        </span>{" "}
                        |
                        <span>
                          Amount Pending:{" "}
                          <strong>
                            ₹
                            {(
                              parseFloat(formData.project_amount || 0) -
                              formData.financialDetails.reduce(
                                (acc, finance) =>
                                  finance.status === "Received"
                                    ? acc +
                                      parseFloat(finance.m_total_amount || 0)
                                    : acc,
                                0
                              )
                            ).toFixed(2)}
                          </strong>
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="pj-form-buttons">
        {step > 1 && (
          <button className="pj-cancel-btn" onClick={prevStep}>
            Previous
          </button>
        )}
        {step < visibleSteps.length ? (
          <button className="pj-next-btn" onClick={nextStep}>
            Next
          </button>
        ) : userRole === "Employee" ? null : (
          <button className="pj-next-btn" onClick={handleSubmit}>
            {projectData ? "Update" : "Submit"}
          </button>
        )}
      </div>
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert} // This closes the modal
        buttons={[
          {
            label: "OK",
            onClick: () => {
              closeAlert();
              onClose(); // Now close the form/modal after user acknowledges the alert
            },
          },
        ]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default MultiStepForm;
