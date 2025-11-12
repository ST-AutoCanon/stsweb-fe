

import React, { useEffect, useState } from "react";
import "./ReimbursementHR.css"; // or HRRbAdmin.css
import { MdOutlineRemoveRedEye, MdOutlineCancel } from "react-icons/md";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import axios from "axios";
import Reimbursement from "./Reimbursement";
import Modal from "../Modal/Modal";

const ReimbursementHR = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [submittedFrom, setSubmittedFrom] = useState("");
  const [submittedTo, setSubmittedTo] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [paymentStatusUpdates, setPaymentStatusUpdates] = useState({});
  const [comments, setComments] = useState({});
  const [statusFilter, setStatusFilter] = useState("pending");
  const employeeData = JSON.parse(localStorage.getItem("dashboardData"));
  const employeeId = employeeData?.employeeId;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [view, setView] = useState("all");
  const [projects, setProjects] = useState([]);
  const [projectSelections, setProjectSelections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const formatDisplayDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${mon}-${year}`;
  };

  const filteredEmployees = employees
    .map((emp) => ({
      ...emp,
      claims: emp.claims.filter((claim) => {
        const status = claim.status?.toLowerCase().trim();
        const pay = claim.payment_status?.toLowerCase().trim();

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
          default:
            return false;
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

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursements`,
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          params: {
            submittedFrom: submittedFrom || null,
            submittedTo: submittedTo || null,
          },
        }
      );
      setEmployees(response.data);

      const attachmentsMap = {};
      response.data.forEach((employee) => {
        employee.claims.forEach((claim) => {
          attachmentsMap[claim.id] = claim.attachments || [];
        });
      });
      setAttachments(attachmentsMap);

      const initialProjects = {};
      response.data.forEach((emp) =>
        emp.claims.forEach((claim) => {
          if (claim.project) {
            initialProjects[claim.id] = claim.project;
          }
        })
      );
      setProjectSelections(initialProjects);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showAlert("Error fetching employees.");
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
      showAlert("No attachments found for this screen.");
    }
  };

  const totalAmount = employees.reduce(
    (sum, employee) =>
      sum +
      employee.claims.reduce(
        (claimSum, claim) => claimSum + parseFloat(claim.total_amount || 0),
        0
      ),
    0
  );

  const approvedAmount = employees.reduce(
    (sum, employee) =>
      sum +
      employee.claims
        .filter((claim) => claim.status === "approved")
        .reduce(
          (claimSum, claim) => claimSum + parseFloat(claim.total_amount || 0),
          0
        ),
    0
  );

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
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/status/${id}`,
        {
          status: updatedStatus,
          approver_comments: approverComment,
          approver_id: employeeId,
          project,
        },
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );
      showAlert(`Reimbursement ${updatedStatus} successfully.`);
      setEmployees((prev) =>
        prev.map((emp) => ({
          ...emp,
          claims: emp.claims.map((claim) =>
            claim.id === id
              ? { ...claim, status: updatedStatus, approver_comments: approverComment }
              : claim
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert("Status update failed.");
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
      let filename = `Reimbursement_${claim.id}.pdf`;
      if (cd) {
        const match = cd.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showAlert("Download failed.");
    }
  };

  const downloadExcel = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursements/export`,
        {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          params: { submittedFrom: submittedFrom || null, submittedTo: submittedTo || null },
          responseType: "blob",
        }
      );
      const cd = resp.headers["content-disposition"];
      let filename = "reimbursements.xlsx";
      if (cd) {
        const match = cd.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }
      const blob = new Blob([resp.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showAlert("Excel export failed.");
    }
  };

  return (
    <div className="HR-rb-admin">
      <h2>Reimbursement Requests</h2>

      <div className="HR-rb-admin-tabs-container">
        <button
          className={`HR-rb-admin-tab ${view === "all" ? "HR-rb-admin-active" : ""}`}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          className={`HR-rb-admin-tab ${view === "self" ? "HR-rb-admin-active" : ""}`}
          onClick={() => setView("self")}
        >
          Self
        </button>
      </div>

      {view === "all" ? (
        <>
          <div className="HR-rb-admin-filters">
            <div className="HR-rb-admin-filter-group">
              <input
                type="text"
                placeholder="Search by Name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="HR-rb-admin-filter-group">
              <label>Status By</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="approved_pending">Approved/Pending</option>
                <option value="approved_paid">Approved/Paid</option>
              </select>
            </div>
            <div className="HR-rb-admin-filter-group">
              <label>Submitted From:</label>
              <input type="date" value={submittedFrom} onChange={(e) => setSubmittedFrom(e.target.value)} />
            </div>
            <div className="HR-rb-admin-filter-group">
              <label>To:</label>
              <input type="date" value={submittedTo} onChange={(e) => setSubmittedTo(e.target.value)} />
            </div>
            <button className="HR-rb-admin-search" onClick={fetchEmployees}>
              <FaSearch /> Search
            </button>
            <button className="HR-rb-admin-search" onClick={downloadExcel} style={{ marginLeft: "8px" }}>
              <FiDownload /> Export
            </button>
          </div>

          <div className="HR-rb-admin-atable-container">
            {filteredEmployees.map((employee) => {
              const filteredClaims = employee.claims;
              if (!filteredClaims.length) return null;

              return (
                <div key={employee.employee_id} className="HR-rb-admin-employee-section">
                  <div className="HR-rb-admin-employee-row" onClick={() => toggleRow(employee.employee_id)}>
                    <div className="HR-rb-admin-empId-rows">
                      <span className="HR-rb-admin-employee-name">{employee.claims[0]?.employee_name} -</span>
                      <span className="HR-rb-admin-employee-id">[{employee.employee_id}]</span>
                    </div>
                    <div className="HR-rb-admin-emp-rows">
                      Total Amount Claiming: Rs{" "}
                      <span>
                        {filteredClaims.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="HR-rb-admin-emp-rows">
                      Amount Approved: Rs{" "}
                      <span>
                        {filteredClaims.filter((c) => c.status === "approved")
                          .reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="HR-rb-admin-toggle-btn">
                      {expandedRows[employee.employee_id] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>

                  {expandedRows[employee.employee_id] && (
                    <div className="HR-rb-admin-reimbursement-table-scroll">
                      <div className="HR-rb-admin-rb-sub-container">
                        <table className="HR-rb-admin-rb-sub-table">
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
                            {filteredClaims.map((claim, index) => (
                              <tr key={claim.id}>
                                <td>{index + 1}</td>
                                <td>{claim.claim_type}</td>
                                <td>
                                  {claim.date_range
                                    ? claim.date_range.split(" - ").map(formatDisplayDate).join(" - ")
                                    : formatDisplayDate(claim.date)}
                                </td>
                                <td>₹{claim.total_amount}</td>
                                <td className="HR-rb-admin-purpose-cell" title={claim.purpose}>
                                  {claim.purpose}
                                </td>
                                <td>
                                  {attachments[claim.id]?.length > 0 ? (
                                    <button
                                      className="HR-rb-admin-attachments-btn"
                                      onClick={() => handleOpenAttachments(attachments[claim.id], claim)}
                                    >
                                      <MdOutlineRemoveRedEye /> View
                                    </button>
                                  ) : (
                                    "No Attachments"
                                  )}
                                </td>
                                <td>
                                  {claim.status === "approved" || claim.status === "rejected" ? (
                                    <span className={`HR-rb-admin-status-label ${claim.status}`}>
                                      <span className="HR-rb-admin-status-dot"></span>
                                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                    </span>
                                  ) : (
                                    <select
                                      className="HR-rb-admin-rb-status-dropdown"
                                      value={statusUpdates[claim.id] || claim.status}
                                      onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                                    >
                                      <option value="">Pending</option>
                                      <option value="approved">Approve</option>
                                      <option value="rejected">Reject</option>
                                    </select>
                                  )}
                                </td>
                                <td>
                                  {claim.status === "approved" || claim.status === "rejected" ? (
                                    <div className="HR-rb-admin-rbadmin-comments">
                                      {claim.project || "N/A"}
                                    </div>
                                  ) : (
                                    <select
                                      className="HR-rb-admin-rb-status-dropdown"
                                      value={projectSelections[claim.id] || ""}
                                      onChange={(e) =>
                                        setProjectSelections((prev) => ({
                                          ...prev,
                                          [claim.id]: e.target.value,
                                        }))
                                      }
                                    >
                                      <option value="">Select</option>
                                      <option value="STS CLAIM">STS CLAIM</option>
                                      {projects.map((p, i) => (
                                        <option key={i} value={p}>{p}</option>
                                      ))}
                                    </select>
                                  )}
                                </td>
                                <td>
                                  {claim.status === "approved" || claim.status === "rejected" ? (
                                    <div className="HR-rb-admin-rbadmin-comments">
                                      {claim.approver_comments || "No comments"}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="Enter comments"
                                      value={comments[claim.id] || ""}
                                      onChange={(e) =>
                                        setComments((prev) => ({ ...prev, [claim.id]: e.target.value }))
                                      }
                                    />
                                  )}
                                </td>
                                <td>
                                {claim.status?.toLowerCase() === "approved" ? (
  !claim.payment_status || claim.payment_status?.toLowerCase() === "pending" ? (
    <button
      className="HR-rb-admin-pending-payment-btn HR-rb-admin-pending-payment-btn-frozen"
      disabled
    >
      Pending
    </button>
  ) : (
    <span>
      {claim.payment_status.charAt(0).toUpperCase() + claim.payment_status.slice(1)}
      {claim.paid_date ? ` (${formatDisplayDate(claim.paid_date)})` : ""}
    </span>
  )
) : (
  <span>{claim.payment_status}</span>
)}

                                </td>

                                {/* ONLY UPDATE BUTTON IS FROZEN + DISABLED */}
                                <td className="HR-rb-admin-actions-sticky">
                                  <FaFileInvoice
                                    size={24}
                                    className="HR-rb-admin-update-btn HR-rb-admin-update-btn-frozen"
                                    disabled={claim.status === "approved" || claim.status === "rejected"}
                                  />
                                  <FiDownload
                                    size={24}
                                    className="HR-rb-admin-download-btn"
                                    onClick={() => handleDownloadPDF(claim)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="HR-rb-admin-total-row">
                              <td colSpan="5" style={{ textAlign: "right", color: "#949494", fontWeight: "bold" }}>
                                Total Amount Claiming: <span style={{ color: "black", fontWeight: "bold" }}>Rs {totalAmount}</span>
                              </td>
                              <td colSpan="6" style={{ textAlign: "right" }}>
                                Amount Approved: Rs <span style={{ fontWeight: "bold" }}>{approvedAmount}</span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <Reimbursement />
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <Modal isVisible={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} buttons={[]}>
          <div className="HR-rb-admin-payment-modal-content">
            <div className="HR-rb-admin-payment-header">
              <h3>Update Payment Status</h3>
              <button className="HR-rb-admin-modal-cross-btn" onClick={() => setIsPaymentModalOpen(false)}>
                X
              </button>
            </div>
            <div className="HR-rb-admin-payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentOption"
                  value="rejected"
                  checked={selectedPaymentOption === "rejected"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />
                Reject
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
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="paid"
                  checked={selectedPaymentOption === "paid"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />
                Payable
              </label>
            </div>
            <p>I'll make sure to process the payment today</p>
            <button
              className="HR-rb-admin-submit-payment-btn"
              onClick={async () => {
                if (!selectedPaymentOption) return showAlert("Please select an option.");
                try {
                  await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
                    { payment_status: selectedPaymentOption, user_role: "admin" },
                    { headers: { "x-api-key": process.env.REACT_APP_API_KEY } }
                  );
                  showAlert("Payment status updated.");
                  setIsPaymentModalOpen(false);
                  fetchEmployees();
                } catch (error) {
                  showAlert("Update failed.");
                }
              }}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      {/* Attachments Modal */}
      {isModalOpen && (
        <div className="HR-rb-admin-att-modal-overlay">
          <div className="HR-rb-admin-att-modal-content">
            <div className="HR-rb-admin-att-header">
              <h2>Attachments</h2>
              <MdOutlineCancel className="HR-rb-admin-att-close" onClick={() => setIsModalOpen(false)} />
            </div>
            <h4 className="HR-rb-admin-att-files">
              {selectedClaim?.claim_type ? `${selectedClaim.claim_type} Bills` : "Bills"}
            </h4>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, i) => (
                <div className="HR-rb-admin-att-files" key={i}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </div>
              ))
            ) : (
              <p>No attachments available</p>
            )}
            <button className="HR-rb-admin-att-close-btn" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <Modal isVisible={alertModal.isVisible} onClose={closeAlert} buttons={[{ label: "OK", onClick: closeAlert }]}>
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default ReimbursementHR;