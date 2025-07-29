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

function CustomPopup({ title, children, onClose }) {
  return (
    <div className="ed-popup-overlay">
      <div className="ed-popup-content">
        <header className="ed-popup-header">
          <h3>{title}</h3>
          <button className="ed-popup-close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="ed-popup-body">{children}</div>
      </div>
    </div>
  );
}

export default function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState(null);
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

  const openPopup = (title, content) => {
    setPopupTitle(title);
    setPopupContent(content);
    setPopupVisible(true);
  };
  const closePopup = () => setPopupVisible(false);

  const showAlert = (message) => setAlertModal({ isVisible: true, message });
  const closeAlert = () => setAlertModal({ isVisible: false, message: "" });

  // Updated handleViewDocs with 3-column categorization (Personal, Educational, Professional)
  // Updated handleViewDocs with Resume moved to Professional section
  const handleViewDocs = async (empId) => {
    try {
      const res = await axios.get(`${BASE_URL}/full/${empId}`, {
        headers: { "x-api-key": API_KEY },
      });
      const data = res.data.data;

      // Categorize documents
      const personalDocs = [
        ["Aadhaar Copy", data.aadhaar_doc_url],
        ["PAN Copy", data.pan_doc_url],
        ["Passport Copy", data.passport_doc_url],
        ["Photo", data.photo_url],
      ]
        .filter(([, url]) => url)
        .map(([label, url]) => ({ label, url }));

      const educationalDocs = [
        ["10th Certificate", data.tenth_cert_url],
        ["12th Certificate", data.twelfth_cert_url],
        ["UG Certificate", data.ug_cert_url],
        ["PG Certificate", data.pg_cert_url],
        ["Additional Certificate", data.additional_cert_url],
      ]
        .filter(([, url]) => url)
        .map(([label, url]) => ({ label, url }));

      const professionalDocs = [];
      // Resume moved to Professional section
      if (data.resume_url) {
        professionalDocs.push({ label: "Resume", url: data.resume_url });
      }
      // Experience documents
      if (Array.isArray(data.experience)) {
        data.experience.forEach((exp, idx) => {
          if (exp.doc_url) {
            professionalDocs.push({
              label: `Experience #${idx + 1} (${exp.company})`,
              url: exp.doc_url,
            });
          }
        });
      }
      // Other docs
      if (Array.isArray(data.other_docs_urls)) {
        data.other_docs_urls.forEach((url, idx) => {
          if (url) {
            professionalDocs.push({ label: `Other #${idx + 1}`, url });
          }
        });
      }

      // Prepare sections for rendering
      const sections = [
        { title: "Personal", docs: personalDocs },
        { title: "Educational", docs: educationalDocs },
        { title: "Professional", docs: professionalDocs },
      ];

      // Render in popup as 3-column grid
      openPopup(
        "Documents",
        <div className="doc-table">
          {sections.map(({ title, docs }) => (
            <div key={title} className="docs-section">
              <label>
                <strong>{title}</strong>
              </label>
              {docs.length > 0 ? (
                <div className="space-y-1">
                  {docs.map((doc, i) => (
                    <div key={i}>
                      <button
                        className="doc-link"
                        onClick={() => downloadDoc(doc.url)}
                      >
                        {doc.label}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents.</p>
              )}
            </div>
          ))}
        </div>
      );
    } catch (err) {
      console.error(err);
      openPopup("Documents", <p>Unable to load documents.</p>);
    }
  };

  const downloadDoc = async (url) => {
    try {
      const response = await axios.get(`${BASE_URL}/docs${url}`, {
        headers: {
          "x-api-key": API_KEY,
          "x-employee-id": employeeId,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("downloadDoc error:", err);
      setPopupVisible(false);
      showAlert("Failed to download document");
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

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>
      <div class="header-container">
        {/* Search Employee */}
        <div className="search-container">
          <label>
            <strong>Search by</strong>
          </label>
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
          <label className="calendar-label">
            <strong>Date From:</strong>
          </label>
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
          <label className="calendar-label">
            <strong>To:</strong>
          </label>
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
                <th>Emp ID</th>
                <th>Emp Name</th>
                <th>DOJ</th>
                <th>Status</th>
                <th>Personal</th>
                <th>Education</th>
                <th>Professional</th>
                <th>Bank</th>
                <th>Docs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="10">No employees found</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>
                      <strong>{emp.employee_id}</strong>
                    </td>
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
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          openPopup(
                            "Personal Details",
                            <dl className="detail-list">
                              <dt>Name:</dt>
                              <dd>{emp.name}</dd>
                              <dt>Email:</dt>
                              <dd>{emp.email}</dd>
                              <dt>Mobile:</dt>
                              <dd>{emp.phone_number}</dd>
                              <dt>Address:</dt>
                              <dd>{emp.address}</dd>
                              <dt>DOB:</dt>
                              <dd>
                                {format(new Date(emp.dob), "dd MMM yyyy")}
                              </dd>
                              <dt>Gender:</dt>
                              <dd>{emp.gender}</dd>
                              <dt>Marital Status:</dt>
                              <dd>{emp.marital_status}</dd>
                              <dt>Father's Name:</dt>
                              <dd>{emp.father_name}</dd>
                              <dt>Mother's Name:</dt>
                              <dd>{emp.mother_name}</dd>
                              <dt>Aadhaar No:</dt>
                              <dd>{emp.aadhaar_number}</dd>
                              <dt>Pan No:</dt>
                              <dd>{emp.pan_number}</dd>
                              <dt>Passport No:</dt>
                              <dd>{emp.passport_number}</dd>
                              <dt>Voter ID:</dt>
                              <dd>{emp.voter_id}</dd>
                            </dl>
                          )
                        }
                      >
                        <MdOutlineRemoveRedEye className="view-btn-icon" />
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          openPopup(
                            "Education Details",
                            <dl className="detail-list">
                              <dt>10th:</dt>
                              <dd>
                                {emp.tenth_board} ({emp.tenth_year}) -{" "}
                                {emp.tenth_score}%
                              </dd>
                              <dt>12th:</dt>
                              <dd>
                                {emp.twelfth_board} ({emp.twelfth_year}) -{" "}
                                {emp.twelfth_score}%
                              </dd>
                              <dt>UG:</dt>
                              <dd>
                                {emp.ug_board} ({emp.ug_year}) - {emp.ug_score}%
                              </dd>
                              <dt>PG:</dt>
                              <dd>
                                {emp.pg_board} ({emp.pg_year}) - {emp.pg_score}%
                              </dd>
                              <dt>Additional Certification:</dt>
                              <dd>{emp.additional_cert_name}</dd>
                            </dl>
                          )
                        }
                      >
                        <MdOutlineRemoveRedEye className="view-btn-icon" />
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          openPopup(
                            "Professional Details",
                            <dl className="detail-list">
                              <dt>Employee Type:</dt>
                              <dd>{emp.employee_type}</dd>
                              <dt>Department:</dt>
                              <dd>{emp.department}</dd>
                              <dt>Position:</dt>
                              <dd>{emp.position}</dd>
                              <dt>Role:</dt>
                              <dd>{emp.role}</dd>
                              <dt>Supervisor ID:</dt>
                              <dd>{emp.supervisor_id}</dd>
                              <dt>Salary:</dt>
                              <dd>{emp.salary}</dd>
                              <dt>Experience:</dt>
                              <dl>
                                {(emp.experience || []).map((exp, i) => (
                                  <dd key={i}>
                                    {exp.company}:{" "}
                                    {format(
                                      new Date(exp.start_date),
                                      "MM/yyyy"
                                    )}{" "}
                                    -{" "}
                                    {format(new Date(exp.end_date), "MM/yyyy")}{" "}
                                    ({exp.designation})
                                  </dd>
                                ))}
                              </dl>
                            </dl>
                          )
                        }
                      >
                        <MdOutlineRemoveRedEye className="view-btn-icon" />
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          openPopup(
                            "Bank Details",
                            <dl className="detail-list">
                              <dt>Bank:</dt>
                              <dd>{emp.bank_name}</dd>
                              <dt>Account No:</dt>
                              <dd>{emp.account_number}</dd>
                              <dt>IFSC:</dt>
                              <dd>{emp.ifsc_code}</dd>
                              <dt>Branch:</dt>
                              <dd>{emp.branch_name}</dd>
                            </dl>
                          )
                        }
                      >
                        <MdOutlineRemoveRedEye className="view-btn-icon" />
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDocs(emp.employee_id)}
                      >
                        <MdOutlineRemoveRedEye className="view-btn-icon" />
                        View
                      </button>
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

      {popupVisible && (
        <CustomPopup title={popupTitle} onClose={closePopup}>
          {popupContent}
        </CustomPopup>
      )}

      {modalVisible && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Confirm Deactivation</h2>
            <p>
              Deactivating this employee will immediately freeze their account:
              they will no longer be able to log in, access company resources,
              or receive system notifications.
            </p>
            <p>Do you really want to proceed?</p>
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
