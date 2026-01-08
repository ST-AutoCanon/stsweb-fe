import React, { useEffect, useState } from "react";
import "./RbAdminOld.css";
import { MdOutlineRemoveRedEye, MdOutlineCancel } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import axios from "axios";
import ReimbursementOld from "./ReimbursementOld";
import Modal from "../Modal/Modal";

const BASE = process.env.REACT_APP_BACKEND_URL || "";

const getAuthHeaders = () => {
  const apiKey =
    process.env.REACT_APP_API_KEY ||
    localStorage.getItem("apiKey") ||
    localStorage.getItem("x-api-key");
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  const headers = {};
  if (apiKey) headers["x-api-key"] = apiKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const RbAdminOld = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [submittedFrom, setSubmittedFrom] = useState("");
  const [submittedTo, setSubmittedTo] = useState("");
  const [attachments, setAttachments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [paymentStatusUpdates, setPaymentStatusUpdates] = useState({});
  const [comments, setComments] = useState({});
  const [statusFilter, setStatusFilter] = useState("pending");
  const employeeData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const employeeId = employeeData?.employeeId;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [view, setView] = useState("all"); // "all" or "self"
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

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const showAlert = (message, title = "") =>
    setAlertModal({ isVisible: true, title, message });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${BASE}/old/projectdrop`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      const projList = response?.data?.projects || response?.data || [];
      setProjects(projList);
    } catch (err) {
      console.warn(
        "Could not fetch projects for old admin",
        err?.response?.data || err
      );
    }
  };

  // IMPORTANT: this fetches old reimbursements (reimbursement_old table via API)
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE}/old/reimbursements`, {
        withCredentials: true,
        headers: getAuthHeaders(),
        params: {
          submittedFrom: submittedFrom || null,
          submittedTo: submittedTo || null,
          status: statusFilter && statusFilter !== "all" ? statusFilter : null,
        },
      });

      const data = response.data || [];
      setEmployees(data);

      // build attachments map
      const attachmentsMap = {};
      (data || []).forEach((emp) => {
        (emp.claims || []).forEach((claim) => {
          attachmentsMap[claim.id] = claim.attachments || [];
        });
      });
      setAttachments(attachmentsMap);

      const initialProjects = {};
      (data || []).forEach((emp) =>
        (emp.claims || []).forEach((claim) => {
          if (claim.project) initialProjects[claim.id] = claim.project;
        })
      );
      setProjectSelections(initialProjects);
    } catch (err) {
      console.error("Error fetching old employees:", err);
      const msg =
        err?.response?.data?.message || "Error fetching old reimbursements.";
      showAlert(msg);
    }
  };

  const toggleRow = (employeeId) => {
    setExpandedRows((prev) => ({ ...prev, [employeeId]: !prev[employeeId] }));
  };

  const handleOpenAttachments = async (files, claim) => {
    try {
      if (!files || files.length === 0) {
        showAlert("No attachments available.");
        return;
      }
      const authToken =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      const fetchedFiles = await Promise.all(
        files.map(async (file) => {
          const candidateFilename =
            file.filename || file.file_name || file.name;
          if (!candidateFilename) return null;
          const match =
            candidateFilename.match(/^\d{4}[-_]\d{2}[-_]\d{2}/) ||
            candidateFilename.match(/^(\d{4})[-_](\d{2})/);
          // try to extract year/month
          let year, month;
          if (match && match.length >= 3) {
            year = match[1];
            month = match[2];
          } else {
            // fallback: attempt ISO prefix like 2024-12-01
            const m2 = candidateFilename.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (m2) {
              year = m2[1];
              month = m2[2];
            }
          }

          if (!year || !month) return null;

          const empId = claim.employee_id || claim.employeeId || "";
          const fileUrl = `${BASE}/old/reimbursement/${year}/${month}/${empId}/${candidateFilename}`;
          try {
            const response = await axios.get(fileUrl, {
              withCredentials: true,
              headers: {
                ...getAuthHeaders(),
                // keep Authorization only if token available
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
              },
              responseType: "blob",
            });
            return {
              name: candidateFilename,
              url: URL.createObjectURL(
                new Blob([response.data], {
                  type: response.headers["content-type"],
                })
              ),
            };
          } catch (err) {
            console.warn(
              "attachment fetch failed for",
              file,
              err?.message || err
            );
            return null;
          }
        })
      );
      setSelectedFiles((fetchedFiles || []).filter(Boolean));
      setSelectedClaim(claim);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching attachments:", err);
      showAlert("No attachments found for this screen.");
    }
  };

  const getClaimAmount = (claim = {}) => {
    const raw =
      claim?.total_amount ?? claim?.aggregated_total ?? claim?.total ?? 0;
    const n = parseFloat(
      String(raw || "")
        .replace(/,/g, "")
        .trim()
    );
    return Number.isFinite(n) ? n : 0;
  };

  const totalAmount = employees.reduce(
    (sum, e) =>
      sum +
      (Array.isArray(e.claims)
        ? e.claims.reduce((s, c) => s + getClaimAmount(c), 0)
        : 0),
    0
  );

  const approvedAmount = employees.reduce(
    (sum, e) =>
      sum +
      (Array.isArray(e.claims)
        ? e.claims
            .filter((c) => String(c.status).toLowerCase() === "approved")
            .reduce((s, c) => s + getClaimAmount(c), 0)
        : 0),
    0
  );

  const handleStatusChange = (id, val) =>
    setStatusUpdates((p) => ({ ...p, [id]: val }));
  const handlePaymentStatusChange = (id, val) =>
    setPaymentStatusUpdates((p) => ({ ...p, [id]: val }));

  const updateStatus = async (id) => {
    if (!statusUpdates[id]) return showAlert("Please select a status.");
    const project = projectSelections[id] || "";
    if (!project) return showAlert("Please select a project.");
    const updatedStatus = statusUpdates[id];
    const approverComment = comments[id] || "";
    try {
      await axios.put(
        `${BASE}/old/reimbursement/status/${id}`,
        {
          status: updatedStatus,
          approver_comments: approverComment,
          approver_id: employeeId,
          project,
        },
        { withCredentials: true, headers: getAuthHeaders() }
      );
      showAlert(`Reimbursement ${updatedStatus} successfully.`);
      fetchEmployees();
    } catch (err) {
      console.error("Error updating status (old):", err);
      showAlert("Status update failed.");
    }
  };

  const openPaymentModal = async (claim) => {
    if (!claim) return showAlert("No claim selected");
    try {
      await fetchEmployees();
      const flat = (employees || []).flatMap((e) => e.claims || []);
      const fresh = flat.find((c) => Number(c.id) === Number(claim.id));
      if (!fresh) return showAlert("Claim not found. Refresh and try again.");
      if (String(fresh.status).toLowerCase() !== "approved") {
        return showAlert(
          "Payment status can only be updated for approved reimbursements."
        );
      }
      setSelectedPaymentClaim(fresh);
      setSelectedPaymentOption("");
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error("Error opening payment modal (admin):", err);
      showAlert("Unable to open payment modal. Try refreshing.");
    }
  };

  const updatePaymentStatus = async () => {
    if (!selectedPaymentOption)
      return showAlert("Please select a payment status.");
    if (!selectedPaymentClaim) return showAlert("No claim selected.");

    try {
      await fetchEmployees();
      const flat = (employees || []).flatMap((e) => e.claims || []);
      const fresh = flat.find(
        (c) => Number(c.id) === Number(selectedPaymentClaim.id)
      );
      if (!fresh) return showAlert("Claim not found. Refresh and try again.");

      if (String(fresh.status).toLowerCase() !== "approved") {
        return showAlert(
          "Payment status can only be updated for approved reimbursements."
        );
      }

      const payload = {
        payment_status: selectedPaymentOption,
        user_role: "admin",
      };

      const resp = await axios.put(
        `${BASE}/old/reimbursement/payment-status/${fresh.id}`,
        payload,
        { withCredentials: true, headers: getAuthHeaders() }
      );

      showAlert("Payment status updated successfully.");
      setIsPaymentModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error("Error updating payment status (admin):", err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        err.message;
      showAlert(serverMsg);
    }
  };

  const handleDownloadPDF = async (claim) => {
    try {
      const resp = await axios.get(`${BASE}/old/download/${claim.id}`, {
        withCredentials: true,
        headers: getAuthHeaders(),
        responseType: "blob",
      });

      let filename = `Reimbursement_old_${claim.id}.pdf`;
      const cd = resp.headers["content-disposition"];
      if (cd) {
        const m = cd.match(/filename[^;=\n]*=(['"]?)([^;\n]*)\1/);
        if (m?.[2]) filename = m[2];
      }
      if (!filename.toLowerCase().endsWith(".pdf")) filename += ".pdf";
      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading old PDF:", err);
      showAlert("There was an issue downloading the file.");
    }
  };
  // search + filter (client-side filter as fallback)
  const filteredEmployees = (employees || [])
    .map((emp) => ({
      ...emp,
      claims: (emp.claims || []).filter((claim) => {
        const status = (claim.status || "").toLowerCase().trim();
        // normalize payment status: treat empty/null as 'pending'
        const payRaw = claim.payment_status || "";
        const pay = String(payRaw).toLowerCase().trim();

        switch (statusFilter) {
          case "approved":
            return status === "approved";
          case "rejected":
            return status === "rejected";
          case "pending":
            return status === "pending";
          case "approved_pending":
            // treat missing/empty payment_status as pending
            return status === "approved" && (pay === "pending" || pay === "");
          case "approved_paid":
            return status === "approved" && pay === "paid";
          default:
            return true; // "all" or unknown -> don't filter out
        }
      }),
    }))
    .filter((e) => e.claims && e.claims.length > 0)
    .filter((e) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const name = (e.claims[0]?.employee_name || "").toLowerCase();
      return (
        name.includes(q) || String(e.employee_id).toLowerCase().includes(q)
      );
    });

  // helper to render invoices (may be JSON or plain string)
  const renderInvoices = (claim) => {
    if (!claim) return null;
    const raw = claim.invoices;
    if (!raw) return "—";
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed)) {
        return parsed.length ? parsed.join(", ") : "—";
      }
      if (typeof parsed === "object") {
        return Object.values(parsed).join(", ");
      }
      return String(parsed);
    } catch {
      // not JSON — just return as-is
      return String(raw);
    }
  };

  const exportToCSV = () => {
    const rows = [
      [
        "Employee Name",
        "Employee ID",
        "Claim ID",
        "Claim Type",
        "Date",
        "Amount",
        "Purpose",
        "Status",
        "invoices",
        "Total Amount",
        "Payment Status",
        "Project",
      ],
    ];

    filteredEmployees.forEach((emp) => {
      emp.claims.forEach((claim) => {
        rows.push([
          emp.claims[0]?.employee_name || "",
          emp.employee_id || "",
          claim.id || "",
          claim.claim_type || "",
          claim.date ? formatDisplayDate(claim.date) : claim.date_range || "",
          claim.total_amount ?? "",
          (claim.purpose || "").replace(/\r?\n|\r/g, " "),
          claim.status || "",
          claim.payment_status || "",
          claim.paid_date ? formatDisplayDate(claim.paid_date) : "",
          claim.approved_date ? formatDisplayDate(claim.approved_date) : "",
          [claim.approver_name, claim.approver_designation]
            .filter(Boolean)
            .join(" / "),
          claim.project || "",
          claim.da ?? "",
          claim.transport_amount ?? "",
          (claim.participants || "").replace(/\r?\n|\r/g, " "),
          claim.meals_objective || "",
          renderInvoices(claim),
        ]);
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Reimbursements_old_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // render
  return (
    <div className="rb-admin-old">
      <h3>Old Reimbursement Requests</h3>

      <div style={{ marginBottom: 12 }}>
        <button
          className={`tab ${view === "all" ? "active" : ""}`}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          className={`tab ${view === "self" ? "active" : ""}`}
          onClick={() => setView("self")}
        >
          Self
        </button>
      </div>

      {view === "all" ? (
        <>
          <div className="rb-filters-old">
            <div className="rb-filter-group-old">
              <input
                placeholder="Search by Name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <label>Status By</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="approved_pending">Approved / Pending</option>
                <option value="approved_paid">Approved / Paid</option>
              </select>
            </div>

            <div className="rb-filter-group-old">
              <label>Submitted From:</label>
              <input
                type="date"
                value={submittedFrom}
                onChange={(e) => setSubmittedFrom(e.target.value)}
              />
            </div>
            <div className="rb-filter-group-old">
              <label>To:</label>
              <input
                type="date"
                value={submittedTo}
                onChange={(e) => setSubmittedTo(e.target.value)}
              />
            </div>

            <button className="rb-search-old" onClick={fetchEmployees}>
              <FaSearch /> Search
            </button>
            <button
              className="rb-search-old"
              onClick={exportToCSV}
              style={{ marginLeft: 8 }}
            >
              <FiDownload /> Export
            </button>
          </div>

          <div className="rb-atable-container-old">
            {filteredEmployees.map((emp) => (
              <div key={emp.employee_id} className="employee-section-old">
                <div
                  className="employee-row-old"
                  onClick={() => toggleRow(emp.employee_id)}
                >
                  <div className="empId-rows-old">
                    <span className="employee-name-old">
                      {emp.claims[0]?.employee_name}
                    </span>
                    <span className="employee-id-old">[{emp.employee_id}]</span>
                  </div>
                  <div className="emp-rows-old">
                    Total: Rs{" "}
                    {emp.claims
                      .reduce((s, c) => s + getClaimAmount(c), 0)
                      .toLocaleString("en-IN")}
                  </div>
                </div>

                {expandedRows[emp.employee_id] && (
                  <div className="reimbursement-table-scroll-old">
                    <div className="rb-sub-container-old">
                      <table className="rb-sub-table-old">
                        <thead>
                          <tr>
                            <th>Sl No</th>
                            <th>Claim Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Purpose</th>
                            <th>Attachments</th>
                            <th>Invoices</th>
                            <th>Participants</th>
                            <th>Total Amount</th>
                            <th>Meals Obj.</th>
                            <th>Status</th>
                            <th>Projects</th>
                            <th>Payment Status</th>
                            <th>Paid Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emp.claims.map((rb) => (
                            <tr key={rb.id}>
                              <td>{emp.claims.indexOf(rb) + 1}</td>

                              {/* Claim Type */}
                              <td>{rb.claim_type}</td>

                              {/* Date */}
                              <td>
                                {formatDisplayDate(rb.date || rb.from_date)}
                              </td>

                              {/* Amount (kept as total_amount) */}
                              <td>₹{rb.total_amount}</td>

                              {/* Purpose */}
                              <td title={rb.purpose}>{rb.purpose}</td>

                              {/* Attachments */}
                              <td>
                                {attachments[rb.id]?.length ? (
                                  <button
                                    onClick={() =>
                                      handleOpenAttachments(
                                        attachments[rb.id],
                                        rb
                                      )
                                    }
                                  >
                                    <MdOutlineRemoveRedEye /> View
                                  </button>
                                ) : (
                                  "N/A"
                                )}
                              </td>

                              {/* Invoices */}
                              <td>{renderInvoices(rb)}</td>

                              {/* Participants */}
                              <td style={{ maxWidth: 200 }}>
                                {(rb.participants || "—").length > 0
                                  ? rb.participants
                                  : "—"}
                              </td>

                              {/* Total Amount (duplicate of Amount if that's what you want) */}
                              <td>₹{rb.total_amount}</td>

                              {/* Meals Objective */}
                              <td title="Meals objective">
                                {rb.meals_objective || "-"}
                              </td>

                              {/* Status (approve/reject select or label) */}
                              <td>
                                {String(rb.status).toLowerCase() ===
                                  "approved" ||
                                String(rb.status).toLowerCase() ===
                                  "rejected" ? (
                                  <span
                                    className={`status-label-old ${rb.status}`}
                                  >
                                    {rb.status}
                                  </span>
                                ) : (
                                  <select
                                    className="rb-status-dropdown-old"
                                    value={
                                      statusUpdates[rb.id] || rb.status || ""
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(rb.id, e.target.value)
                                    }
                                  >
                                    <option value="">Pending</option>
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>
                                  </select>
                                )}
                              </td>

                              {/* Projects */}
                              <td>
                                {String(rb.status).toLowerCase() ===
                                  "approved" ||
                                String(rb.status).toLowerCase() ===
                                  "rejected" ? (
                                  projectSelections[rb.id] || rb.project
                                ) : (
                                  <select
                                    className="rb-status-dropdown-old"
                                    value={projectSelections[rb.id] || ""}
                                    onChange={(e) =>
                                      setProjectSelections((p) => ({
                                        ...p,
                                        [rb.id]: e.target.value,
                                      }))
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="STS CLAIM">STS CLAIM</option>
                                    {projects.map((pr, i) => (
                                      <option key={i} value={pr}>
                                        {pr}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>

                              {/* Payment Status */}
                              <td>
                                {String(rb.status).toLowerCase() ===
                                "approved" ? (
                                  !rb.payment_status ||
                                  rb.payment_status.toLowerCase() ===
                                    "pending" ? (
                                    <button
                                      className="pending-payment-btn-old"
                                      onClick={() => openPaymentModal(rb)}
                                    >
                                      Pending
                                    </button>
                                  ) : (
                                    <span>{rb.payment_status}</span>
                                  )
                                ) : (
                                  <span>{rb.payment_status || "-"}</span>
                                )}
                              </td>

                              {/* Paid Date */}
                              <td>
                                {rb.paid_date
                                  ? formatDisplayDate(rb.paid_date)
                                  : "-"}
                              </td>

                              {/* Actions */}
                              <td>
                                <FaFileInvoice
                                  size={20}
                                  className="update-btn-old"
                                  onClick={() => updateStatus(rb.id)}
                                />
                                <FiDownload
                                  size={20}
                                  className="download-btn-old"
                                  onClick={() => handleDownloadPDF(rb)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="total-row-old">
                            {/* 18 columns total, split for display */}
                            <td colSpan="10" style={{ textAlign: "right" }}>
                              Total Amount Claiming: <b>Rs {totalAmount}</b>
                            </td>
                            <td colSpan="8" style={{ textAlign: "right" }}>
                              Amount Approved: <b>Rs {approvedAmount}</b>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <ReimbursementOld />
      )}

      {/* Payment modal */}
      {isPaymentModalOpen && (
        <Modal
          isVisible={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          buttons={[]}
        >
          <div className="payment-modal-content-old">
            <div className="payment-header-old">
              <h3>Update Payment Status</h3>
              <button
                className="modal-cross-btn-old"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                ✖
              </button>
            </div>
            <div className="payment-options-old">
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
              <label style={{ marginLeft: 20 }}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="pending"
                  checked={selectedPaymentOption === "pending"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />{" "}
                Pending
              </label>
              <label style={{ marginLeft: 20 }}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="paid"
                  checked={selectedPaymentOption === "paid"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                />{" "}
                Payable
              </label>
            </div>
            <p>I'll make sure to process the payment today</p>
            <button
              className="submit-payment-btn-old"
              onClick={async () => {
                if (!selectedPaymentOption)
                  return showAlert("Please select an option.");
                if (!selectedPaymentClaim)
                  return showAlert("No claim selected.");
                try {
                  await axios.put(
                    `${BASE}/old/reimbursement/payment-status/${selectedPaymentClaim.id}`,
                    {
                      payment_status: selectedPaymentOption,
                      user_role: "admin",
                    },
                    { withCredentials: true, headers: getAuthHeaders() }
                  );
                  showAlert("Payment status updated successfully.");
                  setIsPaymentModalOpen(false);
                  fetchEmployees();
                } catch (err) {
                  console.error("Error updating payment status (old):", err);
                  const serverMsg =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    JSON.stringify(err?.response?.data) ||
                    err.message;
                  showAlert(serverMsg);
                }
              }}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      {isModalOpen && (
        <div className="att-modal-overlay-old">
          <div className="att-modal-content-old">
            <div className="att-header-old">
              <h2>Attachments</h2>
              <MdOutlineCancel
                className="att-close-old"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <h4 className="att-files-old">
              {selectedClaim?.claim_type
                ? `${selectedClaim.claim_type} Bills`
                : "Bills"}
            </h4>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((f, i) => (
                <div key={i} className="att-files-old">
                  <a href={f.url} target="_blank" rel="noreferrer">
                    {f.name}
                  </a>
                </div>
              ))
            ) : (
              <p>No attachments available</p>
            )}
            <button
              className="att-close-btn-old"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
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

export default RbAdminOld;
