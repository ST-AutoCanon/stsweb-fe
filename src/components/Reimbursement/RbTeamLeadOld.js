import React, { useEffect, useState } from "react";
import "./RbTeamLeadOld.css";
import "./RbAdminOld.css";
import { FaSearch } from "react-icons/fa";
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

  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const teamLeadId = dashboardData?.employeeId;
  const departmentId = dashboardData?.department_id;

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

      const attMap = {};
      const projMap = {};
      (rows || []).forEach((r) => {
        attMap[r.id] = r.attachments || r.files || [];
        if (r.project) projMap[r.id] = r.project;
      });
      setAttachments(attMap);
      setProjectSelections(projMap);

      return empList;
    } catch (err) {
      console.error(err);
      showAlert("Error fetching team reimbursements");
      throw err;
    }
  };

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


  const filteredEmployees = (employees || [])
    .map((emp) => ({
      ...emp,
      claims: (emp.claims || []).filter((claim) => {
        const status = (claim.status || "").toLowerCase().trim();
       
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
           
            return status === "approved" && (pay === "pending" || pay === "");
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

  const handleStatusChange = (id, val) =>
    setStatusUpdates((p) => ({ ...p, [id]: val }));

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
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating status (old):", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Status update failed.";
      showAlert(msg);
    }
  };

 
  const openPaymentModal = async (claim) => {
    if (!claim) return showAlert("No claim selected");

    try {
      const employeeId = claim.employee_id || claim.employeeId;
      let serverClaim = null;

      if (employeeId) {
        const resp = await axios.get(
          `${BASE}/old/reimbursement/${employeeId}`,
          {
            withCredentials: true,
            headers: getAuthHeaders(),
          }
        );
        const rows = resp.data || [];
        serverClaim = rows.find((c) => Number(c.id) === Number(claim.id));
      } else {
       
        await fetchEmployees();
        const flat = (employees || []).flatMap((e) => e.claims || []);
        serverClaim = flat.find((c) => Number(c.id) === Number(claim.id));
      }

      if (!serverClaim) {
        console.warn("openPaymentModal: claim not found on server", {
          claim,
          serverClaim,
        });
        return showAlert("Claim not found on server. Refresh and try again.");
      }

      console.info("openPaymentModal: serverClaim:", serverClaim);

      if (String(serverClaim.status).toLowerCase() !== "approved") {
       
        return showAlert(
          `Payment status can only be updated for approved reimbursements. Server status: "${serverClaim.status}".`
        );
      }

      setSelectedPaymentClaim(serverClaim);
      setSelectedPaymentOption("");
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error("Error opening payment modal:", err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message;
      showAlert(
        serverMsg ||
          "Unable to open payment modal. Try refreshing and try again."
      );
    }
  };

 
  const updatePaymentStatus = async () => {
    if (!selectedPaymentOption)
      return showAlert("Please select a payment status.");
    if (!selectedPaymentClaim) return showAlert("No claim selected.");

    try {
   
      const employeeId =
        selectedPaymentClaim.employee_id || selectedPaymentClaim.employeeId;
      let serverClaim = null;
      if (employeeId) {
        const resp = await axios.get(
          `${BASE}/old/reimbursement/${employeeId}`,
          {
            withCredentials: true,
            headers: getAuthHeaders(),
          }
        );
        const rows = resp.data || [];
        serverClaim = rows.find(
          (c) => Number(c.id) === Number(selectedPaymentClaim.id)
        );
      } else {
        await fetchEmployees();
        const flat = (employees || []).flatMap((e) => e.claims || []);
        serverClaim = flat.find(
          (c) => Number(c.id) === Number(selectedPaymentClaim.id)
        );
      }

      if (!serverClaim)
        return showAlert("Claim not found. Refresh and try again.");

      console.info("updatePaymentStatus: serverClaim before PUT:", serverClaim);

      if (String(serverClaim.status).toLowerCase() !== "approved") {
        return showAlert(
          `Payment status can only be updated for approved reimbursements. Server status: "${serverClaim.status}".`
        );
      }

      const payload = {
        payment_status: selectedPaymentOption,
        user_role: "Manager",
      }; 
      console.info(
        "updatePaymentStatus: PUT payload ->",
        payload,
        "claimId:",
        serverClaim.id
      );

      const putResp = await axios.put(
        `${BASE}/old/reimbursement/payment-status/${serverClaim.id}`,
        payload,
        { withCredentials: true, headers: getAuthHeaders() }
      );

      console.info("updatePaymentStatus: PUT response:", putResp?.data);
      showAlert("Payment status updated successfully.");
      setIsPaymentModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating payment status (client):", err);
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
      const res = await axios.get(`${BASE}/old/download/${claim.id}`, {
        withCredentials: true,
        headers: getAuthHeaders(),
        responseType: "blob",
      });

      
      const cd = res.headers["content-disposition"];
      let filename = `Reimbursement_${claim.id}.pdf`;
      if (cd) {
        const m = cd.match(/filename[^;=\n]*=(['"]?)([^;\n]*)\1/);
        if (m?.[2]) filename = m[2];
      } else {
      
        const ct = (res.headers["content-type"] || "").toLowerCase();
        if (ct.includes("pdf")) filename = `Reimbursement_${claim.id}.pdf`;
        else if (ct.includes("officedocument") || ct.includes("word")) {
          filename = `Reimbursement_${claim.id}.docx`;
        }
      }

      const contentType = (res.headers["content-type"] || "").toLowerCase();
      const isPdf =
        contentType.includes("pdf") || filename.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
     
        showAlert(
          "Server could not convert to PDF. A DOCX file was downloaded instead; open it with Word or convert to PDF locally."
        );
      }

      const mime =
        contentType ||
        (isPdf
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

      const blob = new Blob([res.data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading old PDF:", err);
      showAlert("There was an issue downloading the file.");
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
          claim.project || "",
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

 
  const renderInvoices = (claim) => {
    if (!claim) return "—";
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
      return String(raw);
    }
  };

  return (
    <div className="rb-admin-old">
      <h3>Reimbursement Requests (Old) — Team</h3>

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
            <option value="approved_pending">Approved/Pending</option>
            <option value="approved_paid">Approved/Paid</option>
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

        <button className="rb-search-old" onClick={() => fetchEmployees()}>
          <FaSearch /> Search
        </button>
        <button
          className="rb-search-old"
          onClick={exportToCSV}
          style={{ marginLeft: 8 }}
          title="Export visible rows to CSV"
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

                     
                          <td>{rb.claim_type}</td>

                        
                          <td>{formatDisplayDate(rb.date || rb.from_date)}</td>

                         
                          <td>₹{rb.total_amount}</td>

                        
                          <td title={rb.purpose}>{rb.purpose}</td>

                          <td>
                            {attachments[rb.id]?.length ? (
                              <button
                                onClick={() =>
                                  handleOpenAttachments(attachments[rb.id], rb)
                                }
                              >
                                <MdOutlineRemoveRedEye /> View
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </td>

                         
                          <td>{renderInvoices(rb)}</td>

                         
                          <td style={{ maxWidth: 200 }}>
                            {(rb.participants || "—").length > 0
                              ? rb.participants
                              : "—"}
                          </td>

                         
                          <td>₹{rb.total_amount}</td>

                         
                          <td title="Meals objective">
                            {rb.meals_objective || "-"}
                          </td>

                        
                          <td>
                            {String(rb.status).toLowerCase() === "approved" ||
                            String(rb.status).toLowerCase() === "rejected" ? (
                              <span className={`status-label-old ${rb.status}`}>
                                {rb.status}
                              </span>
                            ) : (
                              <select
                                className="rb-status-dropdown-old"
                                value={statusUpdates[rb.id] || rb.status || ""}
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

                         
                          <td>
                            {String(rb.status).toLowerCase() === "approved" ||
                            String(rb.status).toLowerCase() === "rejected" ? (
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

                       
                          <td>
                            {String(rb.status).toLowerCase() === "approved" ? (
                              !rb.payment_status ||
                              rb.payment_status.toLowerCase() === "pending" ? (
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

                        
                          <td>
                            {rb.paid_date
                              ? formatDisplayDate(rb.paid_date)
                              : "-"}
                          </td>

                          
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
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

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
              onClick={async () => await updatePaymentStatus()}
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

export default RbTeamLeadOld;
