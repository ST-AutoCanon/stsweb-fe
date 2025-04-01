import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import Reimbursement from "./Reimbursement"; // Self reimbursement component
import "./RbTeamLead.css"; // Keep the same CSS file
import Modal from "../Modal/Modal"; // Custom alert modal

const RbTeamLead = () => {
  // "team" for team view; "self" for self view.
  const [view, setView] = useState("team");

  // States for team view
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [attachments, setAttachments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [comments, setComments] = useState({});
  const [statusFilter, setStatusFilter] = useState("pending");
  // (No longer using paymentStatusUpdates from a dropdown)
  // New states for payment modal functionality:
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectSelections, setProjectSelections] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/projectdrop`,
          {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

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

  // Get team lead data from localStorage (assumed stored under "dashboardData")
  const teamLeadData = JSON.parse(localStorage.getItem("dashboardData"));
  const teamLeadId = teamLeadData?.employeeId;
  const departmentId = teamLeadData?.department_id || null;

  // Only fetch team reimbursements when "team" view is active.
  useEffect(() => {
    if (view === "team") {
      fetchEmployees();
    }
  }, [fromDate, toDate, view]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/team/${teamLeadId}/reimbursements`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          params: { departmentId, fromDate, toDate },
        }
      );

      console.log("API Response:", response.data);

      const grouped = response.data.reduce((acc, claim) => {
        const empId = claim.employee_id;
        if (!acc[empId]) {
          acc[empId] = { employee_id: empId, claims: [] };
        }
        acc[empId].claims.push(claim);
        return acc;
      }, {});

      setEmployees(Object.values(grouped));

      // Build attachments mapping
      const attachmentsMap = {};
      response.data.forEach((claim) => {
        if (claim.attachments) {
          attachmentsMap[claim.id] = claim.attachments;
        }
      });

      console.log("Attachments Map:", attachmentsMap);
      setAttachments(attachmentsMap);
    } catch (error) {
      console.error("Error fetching team reimbursements:", error);
      showAlert("Error fetching team reimbursements.");
    }
  };

  const toggleRow = (employeeId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const handleOpenAttachments = async (files, claim) => {
    try {
      if (!files || files.length === 0) {
        showAlert("No attachments available.");
        return;
      }

      const authToken = localStorage.getItem("token");

      const fetchedFiles = await Promise.all(
        files.map(async (file) => {
          if (!file?.filename) return null;
          const match = file.filename.match(/^(\d{4})-(\d{2})-\d{2}/);
          if (!match) return null;
          const year = match[1];
          const month = match[2];
          const empId = claim.employee_id;
          const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${year}/${month}/${empId}/${file.filename}`;

          const response = await axios.get(fileUrl, {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
              Authorization: `Bearer ${authToken}`,
            },
            responseType: "blob",
          });

          return {
            name: file.filename,
            url: URL.createObjectURL(
              new Blob([response.data], {
                type: response.headers["content-type"],
              })
            ),
          };
        })
      );

      setSelectedFiles(fetchedFiles.filter(Boolean));
      setSelectedClaim(claim);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      showAlert("Failed to load attachments.");
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (id) => {
    if (!statusUpdates[id]) {
      showAlert("Please select a status.");
      return;
    }

    // Retrieve the selected project for this claim from projectSelections
    const project = projectSelections[id] || "";
    if (!project) {
      showAlert("Please select a project.");
      return;
    }

    const updatedStatus = statusUpdates[id];
    const approverComment = comments?.[id] || "";

    const teamLeadData = JSON.parse(localStorage.getItem("dashboardData"));
    const approverId = teamLeadData?.employeeId;

    console.log("Sending Payload:", {
      status: updatedStatus,
      approver_comments: approverComment,
      approver_id: approverId,
      project,
    });

    if (!approverId) {
      showAlert("Approver ID is missing!");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/status/${id}`,
        {
          status: updatedStatus,
          approver_comments: approverComment,
          approver_id: approverId,
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      showAlert(`Reimbursement ${updatedStatus} successfully.`);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => ({
          ...emp,
          claims: emp.claims.map((claim) =>
            claim.id === id
              ? {
                  ...claim,
                  status: updatedStatus,
                  approver_comments: approverComment,
                }
              : claim
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Failed to update status.");
    }
  };

  // Updated payment status function is now triggered via the modal
  const updatePaymentStatus = async () => {
    if (!selectedPaymentOption) {
      showAlert("Please select an option.");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
        {
          payment_status: selectedPaymentOption === "paid" ? "paid" : "pending",
          user_role: "Manager", // Sent as team lead
        },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      showAlert("Payment status updated successfully.");
      setIsPaymentModalOpen(false);
      fetchEmployees(); // Refresh data
    } catch (error) {
      console.error("Error updating payment status:", error);
      showAlert("Failed to update payment status.");
    }
  };

  const handleDownloadPDF = async (claim) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/download/${claim.id}`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reimbursement_${claim.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showAlert("Failed to download file.");
    }
  };

  // Handler for slider toggle change
  const handleToggleChange = (e) => {
    setView(e.target.checked ? "self" : "team");
  };

  return (
    <div className="rb-admin">
      <h2>Reimbursement Requests</h2>

      <div className="tabs-container">
        <button
          className={`tab ${view === "team" ? "active" : ""}`}
          onClick={() => setView("team")}
        >
          Team
        </button>
        <button
          className={`tab ${view === "self" ? "active" : ""}`}
          onClick={() => setView("self")}
        >
          Self
        </button>
      </div>
      {view === "team" ? (
        <div className="rb-main">
          <div className="rb-filters">
            <div className="rb-filter-group">
              <label>Status By</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="rb-filter-group">
              <label>From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="rb-filter-group">
              <label>To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button className="rb-search" onClick={fetchEmployees}>
              <FaSearch /> Search
            </button>
          </div>

          
          <div className="rb-atable-container">
            {employees.map((employee) => {
              const filteredClaims = employee.claims.filter(
                (rb) =>
                  (rb.status || "").toLowerCase() === statusFilter.toLowerCase()
              );
              if (filteredClaims.length === 0) return null;
              return (
                <div key={employee.employee_id} className="employee-section">
                  <div
                    className="employee-row"
                    onClick={() => toggleRow(employee.employee_id)}
                  >
                    <div className="empId-rows">
                      Employee ID - <span>{employee.employee_id}</span>
                    </div>
                    <div className="emp-rows">
                      Total Amount Claiming: Rs{" "}
                      <span>
                        {filteredClaims
                          .reduce(
                            (sum, claim) =>
                              sum + parseFloat(claim.total_amount || 0),
                            0
                          )
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="emp-rows">
                      Amount Approved: Rs{" "}
                      <span>
                        {filteredClaims
                          .filter((claim) => claim.status === "approved")
                          .reduce(
                            (sum, claim) =>
                              sum + parseFloat(claim.total_amount || 0),
                            0
                          )
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="toggle-btn">
                      {expandedRows[employee.employee_id] ? (
                        <FaChevronUp className="drop-icon" />
                      ) : (
                        <FaChevronDown className="drop-icon" />
                      )}
                    </div>
                  </div>
                  {expandedRows[employee.employee_id] && (
                    <div className="reimbursement-table-scroll">
                      <div className="rb-sub-container">
                        <table className="rb-sub-table">
                          <thead>
                            <tr>
                              <th>Sl No</th>
                              <th>Claim Type</th>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Attachments</th>
                              <th>Status</th>
                              <th>Projects</th>
                              <th>Approver Comments</th>
                              <th>Payment Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredClaims.map((rb, index) => (
                              <tr key={rb.id}>
                                <td>{index + 1}</td>
                                <td>{rb.claim_type}</td>
                                <td>
                                  {rb.date_range
                                    ? rb.date_range
                                        .split(" - ")
                                        .map((date) =>
                                          new Date(date).toLocaleDateString(
                                            "en-GB",
                                            {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            }
                                          )
                                        )
                                        .join(" - ")
                                    : rb.date
                                    ? new Date(rb.date).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )
                                    : "N/A"}
                                </td>
                                <td>₹{rb.total_amount}</td>
                                <td>
                                  {attachments[rb.id] &&
                                  attachments[rb.id].length > 0 ? (
                                    <button
                                      className="attachments-btn"
                                      onClick={() =>
                                        handleOpenAttachments(
                                          attachments[rb.id],
                                          rb
                                        )
                                      }
                                    >
                                      <MdOutlineRemoveRedEye className="eye-icon" />{" "}
                                      View
                                    </button>
                                  ) : (
                                    "Not Attached"
                                  )}
                                </td>
                                <td>
                                  {rb.status === "approved" ||
                                  rb.status === "rejected" ? (
                                    <span
                                      className={`status-label ${rb.status}`}
                                    >
                                      <span className="status-dot"></span>
                                      {rb.status.charAt(0).toUpperCase() +
                                        rb.status.slice(1)}
                                    </span>
                                  ) : (
                                    <select
                                      className="rb-status-dropdown"
                                      value={statusUpdates[rb.id] || rb.status}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          rb.id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Pending</option>
                                      <option value="approved">Approve</option>
                                      <option value="rejected">Reject</option>
                                    </select>
                                  )}
                                </td>
                                <td>
                                  {rb.status === "approved" ||
                                  rb.status === "rejected" ? (
                                    <div className="rbadmin-comments">
                                      {projectSelections[rb.id] || rb.project}
                                    </div>
                                  ) : (
                                    // When status is pending, render the dropdown
                                    <select
                                      className="rb-status-dropdown"
                                      value={projectSelections[rb.id] || ""}
                                      onChange={(e) =>
                                        setProjectSelections((prev) => ({
                                          ...prev,
                                          [rb.id]: e.target.value,
                                        }))
                                      }
                                    >
                                      <option value="">Select</option>
                                      {projects.map((project, index) => (
                                        <option key={index} value={project}>
                                          {project}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </td>
                                <td>
                                  {rb.status === "approved" ||
                                  rb.status === "rejected" ? (
                                    <div className="rbadmin-comments">
                                      {rb.approver_comments || "No comments"}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="Enter comments"
                                      value={comments[rb.id] || ""}
                                      onChange={(e) =>
                                        setComments((prev) => ({
                                          ...prev,
                                          [rb.id]: e.target.value,
                                        }))
                                      }
                                    />
                                  )}
                                </td>
                                <td>
                                  {rb.status === "approved" ? (
                                    rb.payment_status === "pending" ? (
                                      <button
                                        className="pending-payment-btn"
                                        onClick={() => {
                                          setSelectedPaymentClaim(rb);
                                          setSelectedPaymentOption(""); // Reset selection
                                          setIsPaymentModalOpen(true);
                                        }}
                                      >
                                        Pending
                                      </button>
                                    ) : (
                                      <span>
                                        {rb.payment_status
                                          .charAt(0)
                                          .toUpperCase() +
                                          rb.payment_status.slice(1)}
                                        {rb.paid_date
                                          ? ` (${new Date(
                                              rb.paid_date
                                            ).toLocaleDateString("en-GB")})`
                                          : ""}
                                      </span>
                                    )
                                  ) : (
                                    <span>{rb.payment_status}</span>
                                  )}
                                </td>
                                <td>
                                  <FaFileInvoice
                                    size={24}
                                    className="update-btn"
                                    onClick={() => updateStatus(rb.id)}
                                    disabled={
                                      rb.status === "approved" ||
                                      rb.status === "rejected"
                                    }
                                  />
                                  <FiDownload
                                    size={24}
                                    className="download-btn"
                                    onClick={() => handleDownloadPDF(rb)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Reimbursement />
      )}
      {/* Modal for Attachments */}
      {isModalOpen && (
        <div className="att-modal-overlay">
          <div className="att-modal-content">
            <div className="att-header">
              <h2>Attachments</h2>
              <MdOutlineCancel
                className="att-close"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <h4 className="att-files">
              {selectedClaim?.claim_type
                ? `${selectedClaim.claim_type} Bills`
                : "Bills"}
            </h4>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => (
                <div className="att-files" key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </div>
              ))
            ) : (
              <p>No attachments available</p>
            )}
            <button
              className="att-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <Modal
          isVisible={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          buttons={[]}
        >
          <div className="payment-modal-content">
            <div className="payment-header">
              <h3>Update Payment Status</h3>
              <button
                className="modal-cross-btn"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                ✖
              </button>
            </div>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="paid"
                  checked={selectedPaymentOption === "paid"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />
                Payable
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="pending"
                  checked={selectedPaymentOption === "pending"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />
                Pending
              </label>
            </div>
            <p>I'll make sure to process the payment today</p>
            <button
              className="submit-payment-btn"
              onClick={async () => {
                if (!selectedPaymentOption) {
                  showAlert("Please select an option.");
                  return;
                }
                try {
                  await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
                    {
                      payment_status:
                        selectedPaymentOption === "paid" ? "paid" : "pending",
                      user_role: "admin", // adjust role as needed
                    },
                    {
                      headers: {
                        "x-api-key": process.env.REACT_APP_API_KEY,
                      },
                    }
                  );
                  showAlert("Payment status updated successfully.");
                  setIsPaymentModalOpen(false);
                  fetchEmployees(); // Refresh data
                } catch (error) {
                  console.error("Error updating payment status:", error);
                  showAlert("Failed to update payment status.");
                }
              }}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
      {/* Alert Modal */}
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default RbTeamLead;
