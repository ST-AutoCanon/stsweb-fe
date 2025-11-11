// src/components/RbTeamLead.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineCancel, MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";

import Reimbursement from "./Reimbursement";
import "./RbTeamLead.css";
import Modal from "../Modal/Modal";

const RbTeamLead = () => {
  const [view, setView] = useState("team");
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [submittedFrom, setSubmittedFrom] = useState("");
  const [submittedTo, setSubmittedTo] = useState("");
  const [attachments, setAttachments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [comments, setComments] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectSelections, setProjectSelections] = useState({});

  // parse local storage robustly
  const teamLeadData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  // Convert to string/number consistently to avoid type mismatch
  const teamLeadId = teamLeadData?.employeeId
    ? String(teamLeadData.employeeId)
    : null;
  const departmentId = teamLeadData?.department_id || null;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/projectdrop`,
          {
            headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (view === "team") fetchEmployees();
  }, [view]);

  const formatDisplayDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const dd = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const yy = d.getFullYear();
    return `${dd}-${mon}-${yy}`;
  };

  const fetchEmployees = async () => {
    try {
      if (!teamLeadId) {
        showAlert("Team lead not found in local storage.");
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/team/${teamLeadId}/reimbursements`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          params: {
            departmentId,
            submittedFrom: submittedFrom || null,
            submittedTo: submittedTo || null,
          },
        }
      );

      const flatClaims = response.data || [];

      // Defensive client-side filter: ensure manager's own claims are excluded from team view
      // Use string comparison to avoid number/string mismatches
      const filteredFlatClaims = flatClaims.filter(
        (c) => String(c.employee_id) !== String(teamLeadId)
      );

      // Group by employee (use filtered list)
      const grouped = filteredFlatClaims.reduce((acc, claim) => {
        const empId = claim.employee_id;
        if (!acc[empId]) acc[empId] = { employee_id: empId, claims: [] };
        acc[empId].claims.push(claim);
        return acc;
      }, {});
      setEmployees(Object.values(grouped));

      // build attachments map based on filtered claims (so attachments match visible claims)
      const attachmentsMap = {};
      filteredFlatClaims.forEach((claim) => {
        attachmentsMap[claim.id] = claim.attachments || [];
      });
      setAttachments(attachmentsMap);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showAlert("Error fetching employees.");
    }
  };

  const toggleRow = (employeeId) => {
    setExpandedRows((prev) => ({ ...prev, [employeeId]: !prev[employeeId] }));
  };

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

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
      showAlert("No attachments found for this screen.");
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
    const project = projectSelections[id] || "";
    if (!project) {
      showAlert("Please select a project.");
      return;
    }

    const updatedStatus = statusUpdates[id];
    const approverComment = comments?.[id] || "";
    const approverId = teamLeadId;
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
          project,
        },
        { headers: { "x-api-key": process.env.REACT_APP_API_KEY } }
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
      showAlert("Status update was not successful. Try again later.");
    }
  };
  const updatePaymentStatus = async () => {
    if (!selectedPaymentOption) {
      showAlert("Please select an option.");
      return;
    }

    try {
      // send the actual selected value (paid / pending / rejected)
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
        {
          payment_status: selectedPaymentOption, // <-- send exactly what user selected
          user_role: "Manager",
        },
        { headers: { "x-api-key": process.env.REACT_APP_API_KEY } }
      );

      showAlert("Payment status updated successfully.");
      setIsPaymentModalOpen(false);
      // Refresh the list so UI shows updated status from server
      fetchEmployees();
    } catch (error) {
      console.error("Error updating payment status:", error);
      // show backend message if available
      const msg =
        error?.response?.data?.error ||
        "Could not update payment status. Please try again.";
      showAlert(msg);
    }
  };

  const handleDownloadPDF = async (claim) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/download/${claim.id}`,
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          responseType: "blob",
        }
      );

      const cd = response.headers["content-disposition"];
      let filename = "";
      if (cd) {
        const filenameRegex = /filename[^;=\n]*=(['"]?)([^;\n]*)\1/;
        const matches = filenameRegex.exec(cd);
        if (matches != null && matches[2]) filename = matches[2];
      }
      if (!filename) filename = `Reimbursement_${claim.id}.pdf`;
      if (!filename.toLowerCase().endsWith(".pdf")) filename += ".pdf";

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading reimbursement PDF:", error);
      showAlert("There was an issue downloading the file.");
    }
  };

  const handleToggleChange = (e) => {
    setView(e.target.checked ? "self" : "team");
  };

  // Filtered employees for rendering (applies statusFilter and search)
  const filteredEmployees = employees
    .map((emp) => ({
      ...emp,
      claims: emp.claims.filter((claim) => {
        const status = (claim.status || "").toLowerCase().trim();
        const pay = (claim.payment_status || "").toLowerCase().trim();
        switch (statusFilter) {
          case "approved":
            return status === "approved";
          case "rejected":
            return status === "rejected";
          case "pending":
            return status === "pending";
          case "approved_pending":
            return status === "approved" && pay === "pending";
          case "approved_paid":
            return status === "approved" && pay === "paid";
          case "all":
          default:
            return true;
        }
      }),
    }))
    .filter((emp) => emp.claims.length > 0)
    .filter((emp) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = (emp.claims[0]?.employee_name || "").toLowerCase();
      const idStr = String(emp.employee_id).toLowerCase();
      return name.includes(q) || idStr.includes(q);
    });

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
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="approved_pending">Approved - Pending</option>
                <option value="approved_paid">Approved - Paid</option>
              </select>
            </div>

            <div className="rb-filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="rb-filter-group">
              <label>Submitted From:</label>
              <input
                type="date"
                value={submittedFrom}
                onChange={(e) => setSubmittedFrom(e.target.value)}
              />
            </div>
            <div className="rb-filter-group">
              <label>Submitted To</label>
              <input
                type="date"
                value={submittedTo}
                onChange={(e) => setSubmittedTo(e.target.value)}
              />
            </div>
            <button className="rb-search" onClick={fetchEmployees}>
              <FaSearch /> Search
            </button>
          </div>

          <div className="rb-atable-container">
            {filteredEmployees.map((employee) => {
              const filteredClaims = employee.claims;
              if (filteredClaims.length === 0) return null;
              return (
                <div key={employee.employee_id} className="employee-section">
                  <div
                    className="employee-row"
                    onClick={() => toggleRow(employee.employee_id)}
                  >
                    <div className="empId-rows">
                      <span>{employee.claims[0]?.employee_name}</span>
                      <span>{employee.employee_id}</span>
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
                          .filter((c) => c.status === "approved")
                          .reduce(
                            (sum, c) => sum + parseFloat(c.total_amount || 0),
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
                              <th>Purpose</th>
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
                                        .map(formatDisplayDate)
                                        .join(" - ")
                                    : rb.date
                                    ? formatDisplayDate(rb.date)
                                    : "N/A"}
                                </td>
                                <td>₹{rb.total_amount}</td>
                                <td className="purpose-cell" title={rb.purpose}>
                                  {rb.purpose}
                                </td>
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
                                      <option value="STS CLAIM">
                                        STS CLAIM
                                      </option>
                                      {projects.map((project, idx) => (
                                        <option key={idx} value={project}>
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
                                  {rb.status?.toLowerCase().trim() ===
                                  "approved" ? (
                                    !rb.payment_status ||
                                    rb.payment_status?.toLowerCase().trim() ===
                                      "pending" ? (
                                      <button
                                        className="pending-payment-btn"
                                        onClick={() => {
                                          setSelectedPaymentClaim(rb);
                                          // Prefill the modal with the current payment_status (or 'pending' fallback)
                                          const current = rb.payment_status
                                            ? String(rb.payment_status)
                                                .toLowerCase()
                                                .trim()
                                            : "pending";
                                          setSelectedPaymentOption(current);
                                          setIsPaymentModalOpen(true);
                                        }}
                                      >
                                        Pending
                                      </button>
                                    ) : (
                                      <span>
                                        {rb.payment_status
                                          ? rb.payment_status
                                              .charAt(0)
                                              .toUpperCase() +
                                            rb.payment_status.slice(1)
                                          : "N/A"}
                                        {rb.paid_date
                                          ? ` (${formatDisplayDate(
                                              rb.paid_date
                                            )})`
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
                  value="rejected"
                  checked={selectedPaymentOption === "rejected"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />{" "}
                Reject
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="paid"
                  checked={selectedPaymentOption === "paid"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />{" "}
                Payable
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="pending"
                  checked={selectedPaymentOption === "pending"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />{" "}
                Pending
              </label>
            </div>
            <p>I'll make sure to process the payment today</p>
            <button
              className="submit-payment-btn"
              onClick={updatePaymentStatus}
              disabled={!selectedPaymentOption}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

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
