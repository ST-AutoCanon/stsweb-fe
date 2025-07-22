import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdOutlineCalendarToday,
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineCancel,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../Modal/Modal";
import EmployeeForm from "./EmployeeForm";
import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: "",
  });
  const [docsModal, setDocsModal] = useState({
    visible: false,
    docs: [],
    employeeName: "",
  });

  // Add/Edit form state
  const [formMode, setFormMode] = useState(null); // 'add' | 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/departments`, { headers: { "x-api-key": API_KEY } })
      .then((res) => setDepartments(res.data.departments))
      .catch((err) => console.error(err));
    axios
      .get(`${BASE_URL}/supervisors`, { headers: { "x-api-key": API_KEY } })
      .then((res) => {
        // assuming your handler returns { data: [ { employee_id, name }, … ] }
        setSupervisors(res.data.data || []);
      })
      .catch((err) => console.error("Failed to load supervisors", err));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      let url = `${BASE_URL}/admin/employees`;
      const params = [];
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      if (fromDate) params.push(`fromDate=${format(fromDate, "yyyy-MM-dd")}`);
      if (toDate) params.push(`toDate=${format(toDate, "yyyy-MM-dd")}`);
      if (params.length) url += `?${params.join("&")}`;
      const res = await axios.get(url, { headers: { "x-api-key": API_KEY } });
      setEmployees(res.data.message.data || []);
    } catch (err) {
      setError("Failed to fetch employees.");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message) => setAlertModal({ isVisible: true, message });
  const closeAlert = () => setAlertModal({ isVisible: false, message: "" });

  const handleViewDocs = async (empId, empName) => {
    console.log("🔍 handleViewDocs starting for", empId);
    try {
      const res = await axios.get(`${BASE_URL}/full/${empId}`, {
        headers: { "x-api-key": API_KEY },
      });
      const data = res.data.data;

      const docs = [];

      // Static fields
      if (data.aadhaar_doc_url)
        docs.push({ label: "Aadhaar Copy", url: data.aadhaar_doc_url });
      if (data.pan_doc_url)
        docs.push({ label: "PAN Copy", url: data.pan_doc_url });
      if (data.passport_doc_url)
        docs.push({ label: "Passport Copy", url: data.passport_doc_url });
      if (data.photo_url) docs.push({ label: "Photo", url: data.photo_url });
      if (data.resume_url) docs.push({ label: "Resume", url: data.resume_url });

      // Education documents
      if (data.tenth_cert_url)
        docs.push({ label: "10th Certificate", url: data.tenth_cert_url });
      if (data.twelfth_cert_url)
        docs.push({ label: "12th Certificate", url: data.twelfth_cert_url });
      if (data.ug_cert_url)
        docs.push({ label: "UG Certificate", url: data.ug_cert_url });
      if (data.pg_cert_url)
        docs.push({ label: "PG Certificate", url: data.pg_cert_url });
      if (data.additional_cert_url)
        docs.push({
          label: "Additional Certificate",
          url: data.additional_cert_url,
        });

      // Experience documents
      if (Array.isArray(data.experience)) {
        data.experience.forEach((exp, idx) => {
          if (exp.doc_url) {
            docs.push({
              label: `Experience Document #${idx + 1} (${exp.company})`,
              url: exp.doc_url,
            });
          }
        });
      }

      // Other documents
      if (Array.isArray(data.other_docs_urls)) {
        data.other_docs_urls.forEach((url, idx) => {
          if (url) {
            docs.push({ label: `Other Document #${idx + 1}`, url });
          }
        });
      }

      console.log("📑 final docs list:", docs);
      setDocsModal({ visible: true, docs, employeeName: empName });
    } catch (err) {
      console.error("❌ handleViewDocs CATCHED:", err);
      showAlert("Unable to fetch documents.");
    }
  };

  const handleAdd = async (data) => {
    try {
      await axios.post(`${BASE_URL}/full`, data, {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
      showAlert("Employee added successfully.");
      closeForm();
      fetchEmployees();
    } catch (err) {
      // Grab the server’s error message (400 / 500 response)
      const msg =
        err.response?.data?.message ||
        "Failed to add employee. Please try again.";
      // re‐throw so the form component can show it
      throw new Error(msg);
    }
  };

  // AFTER
  const handleUpdate = async (id, formData) => {
    await axios.put(`${BASE_URL}/full/${id}`, formData, {
      headers: {
        "x-api-key": API_KEY,
        "x-employee-id": employeeId,
        "Content-Type": "multipart/form-data",
      },
    });
    showAlert("Employee updated successfully.");
    closeForm();
    fetchEmployees();
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/full/${id}`, {
        headers: { "x-api-key": API_KEY },
      });
      setSelectedEmployee(res.data.data);
      setFormMode("edit");
    } catch {
      showAlert("Failed to load employee data.");
    }
  };

  const handleDeactivateEmployee = async () => {
    if (!deleteEmployeeId) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/employees/${deleteEmployeeId}/deactivate`,
        {}, // Empty request body
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      setDeleteEmployeeId(null);
      showAlert("Employee Deactivated successfully.");

      fetchEmployees();
    } catch (err) {
      console.log("Failed to deactivate employee", err);
      setError("Failed to deactivate employee");
    } finally {
      setModalVisible(false);
    }
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedEmployee(null);
  };

  const handleSearchClick = () => {
    fetchEmployees();
  };

  const handleDownloadDoc = async (doc) => {
    try {
      const response = await axios.get(`${BASE_URL}/docs${doc.url}`, {
        headers: { "x-api-key": API_KEY, "x-employee-id": employeeId },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobUrl = window.URL.createObjectURL(blob);

      // Open in new tab
      const newTab = window.open(blobUrl, "_blank");
      if (!newTab) {
        showAlert("Popup blocked! Please allow popups for this site.");
      }

      // Optional: revoke the blob URL after some time
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error("Failed to fetch document:", error);
      showAlert("Unable to download document.");
    }
  };

  return (
    <div className="employee-details-container">
      <h2 class="header-title">Employee Details</h2>
      <div class="header-container">
        {/* Search Employee */}
        <div className="search-container">
          <label>Search by</label>
          <div className="search-box">
            <input
              type="text"
              className="ed-search-input"
              placeholder="Name, EmpID, Email, Dept"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Date From Input Group */}
        <div className="calendar-input-group">
          <label className="calendar-label">Date From</label>
          <div className="calendar-input-wrapper">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              customInput={
                <div className="custom-calendar-input">
                  <input
                    type="text"
                    value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
                    readOnly
                    placeholder="Select Date"
                  />
                  <MdOutlineCalendarToday className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

        {/* Date To Input Group */}
        <div className="calendar-input-group">
          <label className="calendar-label">To</label>
          <div className="calendar-input-wrapper">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)} // Set the toDate
              dateFormat="yyyy-MM-dd"
              isClearable
              customInput={
                <div className="custom-calendar-input">
                  <input
                    type="text"
                    value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
                    readOnly
                    placeholder="Select Date"
                  />
                  <MdOutlineCalendarToday className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

        <div className="button-search">
          <button className="emp-search-text" onClick={handleSearchClick}>
            <i className="fas fa-search ed-search-icon"></i> Search
          </button>
        </div>

        <button
          onClick={() => setFormMode("add")}
          className="add-employee-button"
        >
          + Add Employee
        </button>
      </div>

      {formMode && (
        <div className="emp-form-overlay">
          <div className="emp-form-modal">
            <div className="emp-form-title">
              <h3>
                {formMode === "add" ? "Add New Employee" : "Update Employee"}
              </h3>
              <MdOutlineCancel
                onClick={closeForm}
                className="emp-form-close-icon"
              />
            </div>
            {formMode && (
              <EmployeeForm
                initialData={formMode === "edit" ? selectedEmployee : {}}
                onSubmit={
                  formMode === "edit"
                    ? (fd) => handleUpdate(selectedEmployee.employee_id, fd)
                    : handleAdd
                }
                onCancel={closeForm}
                departments={departments}
                supervisors={supervisors}
              />
            )}
          </div>
        </div>
      )}

      {/* Employee Table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>DOJ</th>
                <th>Status</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Docs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="9">No employees found</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.name}</td>
                    <td>{format(new Date(emp.joining_date), "dd MMM yyyy")}</td>
                    <td
                      className={
                        emp.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {emp.status}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone_number}</td>
                    <td>{emp.position}</td>
                    <td>{emp.salary}</td>
                    <td>
                      <MdOutlineRemoveRedEye
                        className="view-docs-icon"
                        onClick={() =>
                          handleViewDocs(emp.employee_id, emp.name)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>
                      <MdOutlineEdit
                        className={`edit${
                          emp.status === "Inactive" ? " disabled" : ""
                        }`}
                        onClick={() => handleEditClick(emp.employee_id)}
                      />

                      <MdDeleteOutline
                        className={`deactivate${
                          emp.status === "Inactive" ? " disabled" : ""
                        }`}
                        onClick={() => {
                          setDeleteEmployeeId(emp.employee_id);
                          setModalVisible(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {docsModal.visible && (
        <Modal
          isVisible
          onClose={() => setDocsModal((m) => ({ ...m, visible: false }))}
          buttons={[
            {
              label: "Close",
              onClick: () => setDocsModal((m) => ({ ...m, visible: false })),
            },
          ]}
        >
          <ul className="docs-list">
            {docsModal.docs.map((doc, idx) => (
              <div key={idx}>
                <button
                  className="doc-link"
                  onClick={() => handleDownloadDoc(doc)}
                >
                  {doc.label}
                </button>
              </div>
            ))}
          </ul>
        </Modal>
      )}

      {modalVisible && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Confirm Deactivation</h2>
            <p>Are you sure you want to deactivate this employee?</p>
            <div className="delete-buttons">
              <button
                onClick={() => setModalVisible(false)}
                className="delete-modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateEmployee}
                className="delete-modal-delete"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isVisible && (
        <Modal
          isVisible
          onClose={closeAlert}
          buttons={[{ label: "OK", onClick: closeAlert }]}
        >
          <p>{alertModal.message}</p>
        </Modal>
      )}
    </div>
  );
}
