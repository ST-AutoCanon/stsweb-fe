import React, { useEffect, useState } from "react";
import "./RbTeamLeadOld.css";
import "./RbAdminOld.css"; // use the same CSS as admin old so UI matches
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineCancel, MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";
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

const RbTeamLeadOld = () => {
  // Always team view — removed 'self' option
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
  const [searchQuery, setSearchQuery] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectSelections, setProjectSelections] = useState({});

  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const teamLeadId = dashboardData?.employeeId;
  const departmentId = dashboardData?.department_id;

  /* ------------------ DATE FORMAT ------------------ */
  const formatDisplayDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${mon}-${year}`;
  };

  /* ------------------ ALERT MODAL ------------------ */
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") =>
    setAlertModal({ isVisible: true, title, message });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  /* ------------------ FETCH PROJECTS + TEAM ON MOUNT ------------------ */
  useEffect(() => {
    fetchProjects();
    fetchEmployees(); // fetch team data immediately on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      const resp = await axios.get(`${BASE}/old/projectdrop`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      const projList = resp?.data?.projects || resp?.data || [];
      setProjects(projList);
    } catch (err) {
      console.warn("Could not fetch projects for team lead", err);
    }
  };

  /* ------------------ FETCH TEAM OLD CLAIMS ------------------ */
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${BASE}/old/team/${teamLeadId}/reimbursements`,
        {
          withCredentials: true,
          headers: getAuthHeaders(),
          params: {
            teamLeadId,
            departmentId,
            submittedFrom: submittedFrom || null,
            submittedTo: submittedTo || null,
          },
        }
      );

      // backend might return array of rows (flat). Group by employee_id into the same shape as admin-old
      const rows = res.data || [];
      const grouped = rows.reduce((acc, r) => {
        if (!acc[r.employee_id]) {
          acc[r.employee_id] = {
            employee_id: r.employee_id,
            employee_name: r.employee_name,
            claims: [],
          };
        }
        acc[r.employee_id].claims.push(r);
        return acc;
      }, {});

      const empList = Object.values(grouped);
      setEmployees(empList);

      // build attachments map and initial project selections if any
      const attMap = {};
      const projMap = {};
      (rows || []).forEach((r) => {
        attMap[r.id] = r.attachments || r.files || [];
        if (r.project) projMap[r.id] = r.project;
      });
      setAttachments(attMap);
      setProjectSelections(projMap);
    } catch (err) {
      console.error(err);
      showAlert("Error fetching team reimbursements");
    }
  };

  /* ------------------ ATTACHMENTS ------------------ */
  const handleOpenAttachments = async (files, claim) => {
    if (!files || !files.length) {
      showAlert("No attachments available");
      return;
    }

    try {
      const fetched = await Promise.all(
        files.map(async (f) => {
          const path =
            f.file_path || f.filePath || f.path || f.file_path_with_prefix;
          const candidateFilename = f.file_name || f.filename || f.name;

          if (path) {
            try {
              const res = await axios.get(`${BASE}${path}`, {
                withCredentials: true,
                headers: getAuthHeaders(),
                responseType: "blob",
              });
              return {
                name: candidateFilename || path.split("/").pop(),
                url: URL.createObjectURL(res.data),
              };
            } catch (err) {
              console.warn("attachment fetch by path failed", path, err);
            }
          }

          if (
            candidateFilename &&
            claim &&
            (claim.employee_id || claim.employeeId)
          ) {
            const m = candidateFilename.match(/^(\d{4})[-_](\d{2})/);
            if (m) {
              const year = m[1];
              const month = m[2];
              const empId = claim.employee_id || claim.employeeId || "";
              const fileUrl = `${BASE}/old/reimbursement/${year}/${month}/${empId}/${candidateFilename}`;
              try {
                const resp = await axios.get(fileUrl, {
                  withCredentials: true,
                  headers: getAuthHeaders(),
                  responseType: "blob",
                });
                return {
                  name: candidateFilename,
                  url: URL.createObjectURL(resp.data),
                };
              } catch (err) {
                console.warn("fallback attachment fetch failed", fileUrl, err);
              }
            }
          }

          return null;
        })
      );

      setSelectedFiles((fetched || []).filter(Boolean));
      setSelectedClaim(claim);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching attachments:", err);
      showAlert("Unable to load attachments");
    }
  };

  /* ------------------ AMOUNTS ------------------ */
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

  /* ------------------ FILTERS + SEARCH ------------------ */
  const filteredEmployees = (employees || [])
    .map((emp) => ({
      ...emp,
      claims: (emp.claims || []).filter((claim) => {
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
          default:
            return true;
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

  /* ------------------ UPDATES ------------------ */
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
          approver_id: teamLeadId,
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

  const updatePaymentStatus = async (id) => {
    if (!paymentStatusUpdates[id])
      return showAlert("Please select a payment status.");
    try {
      await axios.put(
        `${BASE}/old/reimbursement/payment-status/${id}`,
        { payment_status: paymentStatusUpdates[id], user_role: "Manager" },
        { withCredentials: true, headers: getAuthHeaders() }
      );
      showAlert("Payment status updated successfully.");
      fetchEmployees();
    } catch (err) {
      console.error("Error updating payment status (old):", err);
      showAlert("Payment status update failed.");
    }
  };

  /* ------------------ DOWNLOAD PDF ------------------ */
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

  /* ------------------ RENDER ------------------ */
  return (
    <div className="rb-admin-old">
      <h3>Reimbursement Requests (Old) — Team</h3>

      {/* Only Team view (Self removed) */}
      <>
        <div className="rb-filters-old">
          <div className="rb-filter-group-old">
            <input
              placeholder="Search by Name or ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            onClick={() => {}}
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
                onClick={() =>
                  setExpandedRows((p) => ({
                    ...p,
                    [emp.employee_id]: !p[emp.employee_id],
                  }))
                }
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
                          <th>Status</th>
                          <th>Projects</th>
                          <th>Approver Comments</th>
                          <th>Payment Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emp.claims.map((claim, idx) => (
                          <tr key={claim.id}>
                            <td>{idx + 1}</td>
                            <td>{claim.claim_type || "-"}</td>
                            <td>
                              {claim.date
                                ? formatDisplayDate(claim.date)
                                : claim.date_range || claim.from_date || "N/A"}
                            </td>
                            <td>₹{claim.total_amount}</td>
                            <td title={claim.purpose}>{claim.purpose}</td>
                            <td>
                              {attachments[claim.id] &&
                              attachments[claim.id].length > 0 ? (
                                <button
                                  className="attachments-btn-old"
                                  onClick={() =>
                                    handleOpenAttachments(
                                      attachments[claim.id],
                                      claim
                                    )
                                  }
                                >
                                  <MdOutlineRemoveRedEye className="eye-icon-old" />{" "}
                                  View
                                </button>
                              ) : (
                                "No Attachments"
                              )}
                            </td>
                            <td>
                              {String(claim.status).toLowerCase() ===
                                "approved" ||
                              String(claim.status).toLowerCase() ===
                                "rejected" ? (
                                <span
                                  className={`status-label-old ${claim.status}`}
                                >
                                  {claim.status}
                                </span>
                              ) : (
                                <select
                                  className="rb-status-dropdown-old"
                                  value={
                                    statusUpdates[claim.id] ||
                                    claim.status ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleStatusChange(claim.id, e.target.value)
                                  }
                                >
                                  <option value="">Pending</option>
                                  <option value="approved">Approve</option>
                                  <option value="rejected">Reject</option>
                                </select>
                              )}
                            </td>
                            <td>
                              {String(claim.status).toLowerCase() ===
                                "approved" ||
                              String(claim.status).toLowerCase() ===
                                "rejected" ? (
                                projectSelections[claim.id] || claim.project
                              ) : (
                                <select
                                  className="rb-status-dropdown-old"
                                  value={projectSelections[claim.id] || ""}
                                  onChange={(e) =>
                                    setProjectSelections((p) => ({
                                      ...p,
                                      [claim.id]: e.target.value,
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
                            <td>
                              {claim.approver_comments ||
                                (claim.status === "approved" ||
                                claim.status === "rejected" ? (
                                  "No comments"
                                ) : (
                                  <input
                                    value={comments[claim.id] || ""}
                                    onChange={(e) =>
                                      setComments((p) => ({
                                        ...p,
                                        [claim.id]: e.target.value,
                                      }))
                                    }
                                  />
                                ))}
                            </td>
                            <td>
                              {String(claim.status).toLowerCase() ===
                              "approved" ? (
                                !claim.payment_status ||
                                claim.payment_status.toLowerCase() ===
                                  "pending" ? (
                                  <button
                                    className="pending-payment-btn-old"
                                    onClick={() => {
                                      setSelectedPaymentClaim(claim);
                                      setSelectedPaymentOption("");
                                      setIsPaymentModalOpen(true);
                                    }}
                                  >
                                    Pending
                                  </button>
                                ) : (
                                  <span>{claim.payment_status}</span>
                                )
                              ) : (
                                <span>{claim.payment_status || "-"}</span>
                              )}
                            </td>
                            <td>
                              <FaFileInvoice
                                size={20}
                                className="update-btn-old"
                                onClick={() => updateStatus(claim.id)}
                              />
                              <FiDownload
                                size={20}
                                className="download-btn-old"
                                onClick={() => handleDownloadPDF(claim)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="total-row-old">
                          <td colSpan="5" style={{ textAlign: "right" }}>
                            Total Amount Claiming: <b>Rs {totalAmount}</b>
                          </td>
                          <td colSpan="6" style={{ textAlign: "right" }}>
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
                      user_role: "Manager",
                    },
                    { withCredentials: true, headers: getAuthHeaders() }
                  );
                  showAlert("Payment status updated successfully.");
                  setIsPaymentModalOpen(false);
                  fetchEmployees();
                } catch (err) {
                  console.error("Error updating payment status (old):", err);
                  showAlert(
                    "Could not update payment status. Please try again."
                  );
                }
              }}
            >
              Submit
            </button>
          </div>
        </Modal>
      )}

      {/* Attachments modal */}
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

export default RbTeamLeadOld;
