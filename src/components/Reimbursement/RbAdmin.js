import React, { useEffect, useState } from "react";
import "./RbAdmin.css";
import { MdOutlineRemoveRedEye, MdOutlineCancel } from "react-icons/md";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import axios from "axios";
import Reimbursement from "./Reimbursement";
import Modal from "../Modal/Modal";
import ParticipantSelection from "./ParticipantSelection";
import RbAdminOld from "./RbAdminOld";

const RbAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedClaims, setExpandedClaims] = useState({});
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
  const employeeData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const employeeId = employeeData?.employeeId;
 
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();
  const isHR = userRole === "hr";

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentClaim, setSelectedPaymentClaim] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [view, setView] = useState("all");
  const [projects, setProjects] = useState([]);
  const [projectSelections, setProjectSelections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsForEdit, setParticipantsForEdit] = useState([]);
  const [participantsSaving, setParticipantsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("new"); // Track the selected tab

  const formatDisplayDate = (raw) => {
    if (!raw) return " ";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${mon}-${year}`;
  };

  const formatRange = (from, to) => {
    const f = formatDisplayDate(from);
    const t = formatDisplayDate(to);
    if ((!f || f === " ") && (!t || t === " ")) return " ";
    if (f && t && f !== t) return `${f} - ${t}`;
    return f || t || " ";
  };

  const resolveDateDisplay = (payload = {}, claim = {}) => {
    try {
      if (payload) {
        if (typeof payload === "string" && payload.trim()) {
          const parts = payload
            .replace(/\u2013|\u2014/g, "-")
            .split(/\s*[-–—]\s*/);
          if (parts.length >= 2)
            return `${formatDisplayDate(parts[0])} - ${formatDisplayDate(
              parts[1]
            )}`;
        } else if (
          typeof payload.date_range === "string" &&
          payload.date_range.trim()
        ) {
          const parts = payload.date_range
            .replace(/\u2013|\u2014/g, "-")
            .split(/\s*[-–—]\s*/);
          if (parts.length >= 2)
            return `${formatDisplayDate(parts[0])} - ${formatDisplayDate(
              parts[1]
            )}`;
        }

        if (payload.from_date || payload.to_date) {
          return formatRange(payload.from_date, payload.to_date);
        }

        if (Array.isArray(payload.dates) && payload.dates.length) {
          return payload.dates.map(formatDisplayDate).join(", ");
        }

        if (payload.date) return formatDisplayDate(payload.date);
      }

      if (claim) {
        if (typeof claim.date_range === "string" && claim.date_range.trim()) {
          const parts = claim.date_range
            .replace(/\u2013|\u2014/g, "-")
            .split(/\s*[-–—]\s*/);
          if (parts.length >= 2)
            return `${formatDisplayDate(parts[0])} - ${formatDisplayDate(
              parts[1]
            )}`;
        }

        if (claim.from_date || claim.to_date) {
          return formatRange(claim.from_date, claim.to_date);
        }

        if (claim.date) return formatDisplayDate(claim.date);
      }

      return " ";
    } catch (e) {
      return " ";
    }
  };

  const parseInvoicesFromClaim = (claimOrInv) => {
    let invs = claimOrInv || [];
    try {
      if (typeof invs === "object" && Array.isArray(invs))
        return invs.map((i) => String(i).trim()).filter(Boolean);
      if (typeof invs === "string" && invs.trim()) {
        try {
          const parsed = JSON.parse(invs);
          if (Array.isArray(parsed))
            return parsed.map((i) => String(i).trim()).filter(Boolean);
        } catch (_) {
          return invs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      return Array.isArray(invs)
        ? invs.map((i) => String(i).trim()).filter(Boolean)
        : [];
    } catch (e) {
      return [];
    }
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
            withCredentials: true,
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
    fetchEmployeeOptions();
  }, []);

  const fetchEmployeeOptions = async () => {
    try {
      const endpoint =
        activeTab === "old"
          ? `${process.env.REACT_APP_BACKEND_URL}/reimbursement-old/employees`
          : `${process.env.REACT_APP_BACKEND_URL}/reimbursement/employees`;

      const resp = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const list = Array.isArray(resp.data)
        ? resp.data
        : resp.data?.data || resp.data || [];
      const mapped = (list || []).map((r) => {
        const id = r.employee_id || r.id || r.employeeId || r.empId;
        const name =
          r.name ||
          r.employee_name ||
          `${r.first_name || ""} ${r.last_name || ""}`.trim();
        return {
          employee_id: id,
          name,
          position: r.position || r.designation || "",
          department_name: r.department_name || "",
        };
      });
      setEmployeeOptions(mapped);
    } catch (err) {
      console.warn(
        "Could not fetch employees for participant selection. Falling back to demo list."
      );
      setEmployeeOptions([
        { employee_id: employeeId || "E000", name: "You", position: "" },
        { employee_id: "E1001", name: "Priya Sharma", position: "Developer" },
        { employee_id: "E1002", name: "Rahul Verma", position: "Analyst" },
      ]);
    }
  };

  const getParticipantNamesForClaim = (claim = {}) => {
    const partRaw =
      claim.participants ||
      claim.participant_ids ||
      claim.participant_names ||
      [];
    let part = [];
    try {
      if (typeof partRaw === "string" && partRaw.trim()) {
        part = JSON.parse(partRaw);
      } else part = Array.isArray(partRaw) ? partRaw : [];
    } catch (e) {
      if (partRaw && typeof partRaw === "string")
        part = partRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else part = Array.isArray(partRaw) ? partRaw : [];
    }
    if (!part || part.length === 0) {
      if (claim.employee_name) return claim.employee_name;
      return "You";
    }

    const names = part.map((p) => {
      if (typeof p === "object")
        return p.name || p.employee_name || p.employee_id || JSON.stringify(p);
      const found = employeeOptions.find(
        (e) => String(e.employee_id) === String(p) || String(e.id) === String(p)
      );
      if (found) return found.name;
      return String(p);
    });

    return names.join(", ");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const getClaimAmount = (claim = {}) => {
    const raw =
      claim?.aggregated_total ??
      claim?.total_amount ??
      claim?.totalAmount ??
      claim?.total ??
      0;
    const n = parseFloat(
      String(raw || "")
        .toString()
        .replace(/,/g, "")
        .trim()
    );
    return Number.isFinite(n) ? n : 0;
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursements`,
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          params: {
            submittedFrom: submittedFrom || null,
            submittedTo: submittedTo || null,
          },
        }
      );
      const data = response.data || [];
      setEmployees(data);

      const attachmentsMap = {};
      (data || []).forEach((employee) => {
        (employee.claims || []).forEach((claim) => {
          attachmentsMap[claim.id] = claim.attachments || [];
        });
      });
      setAttachments(attachmentsMap);

      const initialProjects = {};
      (data || []).forEach((emp) =>
        (emp.claims || []).forEach((claim) => {
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
    setExpandedRows((prev) => ({ ...prev, [employeeId]: !prev[employeeId] }));
  };

  const toggleClaimExpand = (claimId) => {
    setExpandedClaims((prev) => ({ ...prev, [claimId]: !prev[claimId] }));
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
          const candidateFilename =
            file.filename || file.file_name || file.name;
          if (!candidateFilename) return null;
          let match = candidateFilename.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (!match) {
            const match2 = candidateFilename.match(
              /^(\d{4})[-_](\d{2})[-_](\d{2})/
            );
            if (!match2) return null;
            match = match2;
          }
          const year = match[1];
          const month = match[2];
          const empId = claim.employee_id;
          const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${year}/${month}/${empId}/${candidateFilename}`;
          try {
            const response = await axios.get(fileUrl, {
              withCredentials: true,
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                Authorization: authToken ? `Bearer ${authToken}` : undefined,
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
    } catch (error) {
      console.error("Error fetching attachments:", error);
      showAlert("No attachments found for this screen.");
    }
  };

  const totalAmount = employees.reduce(
    (sum, employee) =>
      sum +
      (Array.isArray(employee.claims)
        ? employee.claims.reduce(
            (claimSum, claim) => claimSum + getClaimAmount(claim),
            0
          )
        : 0),
    0
  );

  const approvedAmount = employees.reduce(
    (sum, employee) =>
      sum +
      (Array.isArray(employee.claims)
        ? employee.claims
            .filter(
              (claim) => String(claim.status).toLowerCase() === "approved"
            )
            .reduce((claimSum, claim) => claimSum + getClaimAmount(claim), 0)
        : 0),
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
    const employeeIdLocal = employeeData?.employeeId;

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/status/${id}`,
        {
          status: updatedStatus,
          approver_comments: approverComment,
          approver_id: employeeIdLocal,
          project,
        },
        {
          withCredentials: true,
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
      console.error("Error updating reimbursement status:", error);
      showAlert("Status update was not successful. Try again later.");
    }
  };

  const updatePaymentStatus = async (id) => {
    if (!paymentStatusUpdates[id]) {
      showAlert("Please select a payment status.");
      return;
    }
    const updatedPaymentStatus = paymentStatusUpdates[id];
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${id}`,
        {
          payment_status: updatedPaymentStatus,
          user_role: "admin",
        },
        {
          withCredentials: true,
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      showAlert("Payment status updated successfully.");
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => ({
          ...emp,
          claims: emp.claims.map((claim) =>
            claim.id === id
              ? { ...claim, payment_status: updatedPaymentStatus }
              : claim
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      showAlert("Payment status couldn't be updated at the moment.");
    }
  };

  const sanitizeFileName = (name) => {
    if (!name) return "";
    return name
      .replace(/[\u0000-\u001F<>:\"/\\|?*]+/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .substring(0, 160);
  };

  const handleDownloadPDF = async (claim) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/download/${claim.id}`,
        {
          withCredentials: true,
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          responseType: "blob",
        }
      );

      let filename = "";
      const empName = claim.employee_name || claim.employeeName || claim.name;
      if (empName) {
        const base = sanitizeFileName(empName) || `Reimbursement_${claim.id}`;
        filename = `${base}_Reimbursement_${claim.id}.pdf`;
      }

      if (!filename) {
        const cd = response.headers["content-disposition"];
        const filenameRegex = /filename[^;=\n]*=(['"]?)([^;\n]*)\1/;
        const matches = filenameRegex.exec(cd || "");
        if (matches != null && matches[2]) {
          filename = matches[2];
        }
      }

      if (!filename) {
        filename = `Reimbursement_${claim.id}.pdf`;
      }

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

  const openParticipantsModal = (claim) => {
    let existing = claim.participants || claim.participant_ids || [];
    try {
      if (typeof existing === "string" && existing.trim()) {
        existing = JSON.parse(existing);
      }
    } catch (e) {
      if (typeof existing === "string") {
        existing = existing
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else existing = Array.isArray(existing) ? existing : [];
    }
    const ids = (existing || []).map((p) => {
      if (typeof p === "object")
        return p.employee_id || p.id || p.employeeId || String(p);
      return String(p);
    });
    setParticipantsForEdit(ids);
    setSelectedClaim(claim);
    setIsParticipantsModalOpen(true);
  };

  const saveParticipants = async () => {
    if (!selectedClaim) return;
    setParticipantsSaving(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${selectedClaim.id}/participants`,
        { participants: participantsForEdit },
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );
      showAlert("Participants updated.");
      setIsParticipantsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error("Error saving participants:", err);
      showAlert("Failed to save participants.");
    } finally {
      setParticipantsSaving(false);
    }
  };

  const handleParticipantSelectionChange = (value) => {
    if (!value) {
      setParticipantsForEdit([]);
      return;
    }
    if (Array.isArray(value)) {
      const ids = value
        .map((v) => v.employee_id || v.id || v.empId || String(v))
        .filter(Boolean)
        .map(String);
      setParticipantsForEdit(ids);
    } else {
      const id = value.employee_id || value.id || value.empId || String(value);
      setParticipantsForEdit(id ? [String(id)] : []);
    }
  };

  const handleToggleChange = (e) => {
    setView(e.target.checked ? "self" : "all");
  };

  const downloadExcel = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursements/export`,
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          params: {
            submittedFrom: submittedFrom || null,
            submittedTo: submittedTo || null,
          },
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
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showAlert("Failed to download Excel. Please try again.");
    }
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

  const openPaymentModal = (claim) => {
    if (!claim) return;
    setSelectedPaymentClaim(claim);
    const current = (claim.payment_status || "").toLowerCase().trim();
    setSelectedPaymentOption(current || "pending");
    setIsPaymentModalOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "old") {
      fetchEmployeeOptions(); 
    }
  };

  return (
    <div className="rb-admin">
      <h2>Reimbursement Requests</h2>
      <div className="tabs-container">
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
        <button
          className={`tab ${view === "old" ? "active" : ""}`}
          onClick={() => setView("old")}
        >
          Old
        </button>
      </div>

     
      {view === "all" ? (
        <>
          <div className="rb-filters">
            <div className="rb-filter-group">
              <input
                type="text"
                placeholder="Search by Name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="rb-filter-group">
              <label>Status By</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
                <option value="approved_pending">Approved/Pending</option>
                <option value="approved_paid">Approved/Paid</option>
              </select>
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
              <label>To:</label>
              <input
                type="date"
                value={submittedTo}
                onChange={(e) => setSubmittedTo(e.target.value)}
              />
            </div>
            <button className="rb-search" onClick={fetchEmployees}>
              <FaSearch /> Search
            </button>
            <button
              className="rb-search"
              onClick={downloadExcel}
              style={{ marginLeft: "8px" }}
            >
              <FiDownload /> Export
            </button>
          </div>

          <div className="rb-atable-container">
            {filteredEmployees.map((employee) => {
              const filteredClaims = employee.claims;
              if (!filteredClaims.length) return null;
              return (
                <div key={employee.employee_id} className="employee-section">
                  <div
                    className="employee-row"
                    onClick={() => toggleRow(employee.employee_id)}
                  >
                    <div className="empId-rows">
                      <span>
                        {employee.claims[0]?.employee_name} - [
                        {employee.employee_id}]
                      </span>
                    </div>
                    <div className="emp-rows">
                      <span>
                        Total Amount Claiming: Rs{" "}
                        {filteredClaims
                          .reduce(
                            (sum, claim) => sum + getClaimAmount(claim),
                            0
                          )
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="emp-rows">
                      <span>
                        Amount Approved: Rs{" "}
                        {filteredClaims
                          .filter(
                            (claim) =>
                              String(claim.status).toLowerCase() === "approved"
                          )
                          .reduce(
                            (sum, claim) => sum + getClaimAmount(claim),
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
                              <th>Participants</th>
                              <th>Invoice(s)</th>
                              <th>Attachments</th>
                              <th>Status</th>
                              <th>Projects</th>
                              <th>Approver Comments</th>
                              <th>Payment Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredClaims.map((claim, index) => {
                              const lines = Array.isArray(claim.lines)
                                ? claim.lines
                                    .slice()
                                    .sort(
                                      (a, b) =>
                                        (a.line_index || 0) -
                                        (b.line_index || 0)
                                    )
                                : [];

                              const firstLinePayload =
                                lines && lines.length
                                  ? lines[0].payload || {}
                                  : {};
                              const firstLineDate =
                                firstLinePayload.date ||
                                firstLinePayload.from_date ||
                                firstLinePayload.to_date ||
                                null;

                              let claimInvs = parseInvoicesFromClaim(
                                claim.invoices ||
                                  claim.invoice_numbers ||
                                  claim.invoice_no
                              );
                              const invSet = new Set(
                                (claimInvs || []).map((i) => String(i).trim())
                              );
                              (lines || []).forEach((ln) => {
                                const linv =
                                  ln?.payload?.invoices ||
                                  ln?.payload?.invoice ||
                                  [];
                                parseInvoicesFromClaim(linv).forEach((i) => {
                                  if (i) invSet.add(String(i).trim());
                                });
                              });
                              const claimInvDisplay = Array.from(invSet).length
                                ? Array.from(invSet).join(", ")
                                : "-";

                              return (
                                <React.Fragment
                                  key={
                                    claim.id ||
                                    `${employee.employee_id}-${index}`
                                  }
                                >
                                  <tr className="claim-main-row">
                                    <td>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleClaimExpand(claim.id)
                                        }
                                        aria-expanded={
                                          !!expandedClaims[claim.id]
                                        }
                                        title={
                                          expandedClaims[claim.id]
                                            ? "Collapse"
                                            : "Expand"
                                        }
                                        style={{ minWidth: 36 }}
                                      >
                                        {expandedClaims[claim.id] ? "−" : "+"}
                                      </button>{" "}
                                      {index + 1}
                                    </td>

                                    <td>{claim.claim_type || "-"}</td>

                                    <td>
                                      {resolveDateDisplay(
                                        firstLinePayload,
                                        claim
                                      )}
                                    </td>

                                    <td>₹{claim.aggregated_total}</td>

                                    <td
                                      className="participants-cell-col"
                                      title={claim.purpose}
                                    >
                                      <div className="rbadmin-comments">
                                        {claim.purpose || claim.comments || "-"}
                                      </div>
                                    </td>

                                    <td
                                      className="participants-cell-col"
                                      title={getParticipantNamesForClaim(claim)}
                                    >
                                      <div className="rbadmin-comments">
                                        {getParticipantNamesForClaim(claim)}
                                      </div>
                                    </td>

                                    <td
                                      className="invoice-cell"
                                      title={claimInvDisplay}
                                    >
                                      {claimInvDisplay}
                                    </td>

                                    <td>
                                      {attachments[claim.id] &&
                                      attachments[claim.id].length > 0 ? (
                                        <button
                                          className="attachments-btn"
                                          onClick={() =>
                                            handleOpenAttachments(
                                              attachments[claim.id],
                                              claim
                                            )
                                          }
                                        >
                                          <MdOutlineRemoveRedEye className="eye-icon" />{" "}
                                          View
                                        </button>
                                      ) : claim.line_attachments_map &&
                                        Object.keys(claim.line_attachments_map)
                                          .length > 0 ? (
                                        <button
                                          className="attachments-btn"
                                          onClick={() =>
                                            handleOpenAttachments(
                                              Object.values(
                                                claim.line_attachments_map
                                              ).flat(),
                                              claim
                                            )
                                          }
                                        >
                                          <MdOutlineRemoveRedEye className="eye-icon" />{" "}
                                          View Line Attachments
                                        </button>
                                      ) : (
                                        "No Attachments"
                                      )}
                                    </td>

                                    <td>
                                      {claim.status === "approved" ||
                                      claim.status === "rejected" ? (
                                        <span
                                          className={`status-label ${claim.status}`}
                                        >
                                          <span className="status-dot"></span>
                                          {claim.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            claim.status.slice(1)}
                                        </span>
                                      ) : (
                                        <select
                                          className="rb-status-dropdown"
                                          value={
                                            statusUpdates[claim.id] ||
                                            claim.status ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            !isHR &&
                                            handleStatusChange(
                                              claim.id,
                                              e.target.value
                                            )
                                          }
                                          disabled={isHR}
                                        >
                                          <option value="">Pending</option>
                                          <option value="approved">
                                            Approve
                                          </option>
                                          <option value="rejected">
                                            Reject
                                          </option>
                                        </select>
                                      )}
                                    </td>

                                    <td>
                                      {claim.status === "approved" ||
                                      claim.status === "rejected" ? (
                                        <div className="rbadmin-comments">
                                          {projectSelections[claim.id] ||
                                            claim.project}
                                        </div>
                                      ) : (
                                        <select
                                          className="rb-status-dropdown"
                                          value={
                                            projectSelections[claim.id] || ""
                                          }
                                          onChange={(e) =>
                                            !isHR &&
                                            setProjectSelections((prev) => ({
                                              ...prev,
                                              [claim.id]: e.target.value,
                                            }))
                                          }
                                          disabled={isHR}
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
                                      {claim.status === "approved" ||
                                      claim.status === "rejected" ? (
                                        <div className="rbadmin-comments">
                                          {claim.approver_comments ||
                                            "No comments"}
                                        </div>
                                      ) : (
                                        <input
                                          type="text"
                                          placeholder={
                                            isHR
                                              ? "View only"
                                              : "Enter comments"
                                          }
                                          value={comments[claim.id] || ""}
                                          onChange={(e) =>
                                            !isHR &&
                                            setComments((prev) => ({
                                              ...prev,
                                              [claim.id]: e.target.value,
                                            }))
                                          }
                                          disabled={isHR}
                                        />
                                      )}
                                    </td>

                                    <td>
                                      {claim.status?.toLowerCase().trim() ===
                                      "approved" ? (
                                        !claim.payment_status ||
                                        claim.payment_status
                                          ?.toLowerCase()
                                          .trim() === "pending" ? (
                                          <button
                                            className={`pending-payment-btn ${
                                              isHR ? "disabled" : ""
                                            }`}
                                            onClick={() => {
                                              if (!isHR)
                                                openPaymentModal(claim);
                                            }}
                                            disabled={isHR}
                                            style={{
                                              pointerEvents: isHR
                                                ? "none"
                                                : "auto",
                                              opacity: isHR ? 0.4 : 1,
                                              cursor: isHR
                                                ? "not-allowed"
                                                : "pointer",
                                            }}
                                          >
                                            Pending
                                          </button>
                                        ) : (
                                          <span>
                                            {claim.payment_status
                                              ? claim.payment_status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                claim.payment_status.slice(1)
                                              : " "}
                                            {claim.paid_date
                                              ? ` (${formatDisplayDate(
                                                  claim.paid_date
                                                )})`
                                              : ""}
                                          </span>
                                        )
                                      ) : (
                                        <span>
                                          {claim.payment_status || "-"}
                                        </span>
                                      )}
                                    </td>

                                    <td>
                                      <FaFileInvoice
                                        size={24}
                                        className={`update-btn ${
                                          isHR ? "disabled" : ""
                                        }`}
                                        onClick={() => {
                                          if (!isHR) updateStatus(claim.id);
                                        }}
                                        style={{
                                          pointerEvents: isHR ? "none" : "auto",
                                          opacity: isHR ? 0.4 : 1,
                                          cursor: isHR
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      />

                                      <FiDownload
                                        size={24}
                                        className="download-btn"
                                        onClick={() => handleDownloadPDF(claim)}
                                      />
                                    </td>
                                  </tr>

                                  {expandedClaims[claim.id] &&
                                    (lines.length
                                      ? lines
                                      : [{ id: null, payload: claim }]
                                    ).map((line, li) => {
                                      const payload = line.payload || {};

                                      const lineInvs = parseInvoicesFromClaim(
                                        payload.invoices ||
                                          payload.invoice ||
                                          []
                                      );
                                      const lnInvDisplay =
                                        Array.isArray(lineInvs) &&
                                        lineInvs.length
                                          ? lineInvs.join(", ")
                                          : claimInvDisplay;

                                      const lineAttachMap =
                                        claim.line_attachments_map || {};
                                      const attachmentsForThis =
                                        (line &&
                                          (lineAttachMap[String(line.id)] ||
                                            lineAttachMap[line.id])) ||
                                        [];

                                      const amount = line
                                        ? line.total_amount ||
                                          payload.total_amount ||
                                          0
                                        : 0;
                                      const dateDisplay =
                                        payload.date ||
                                        payload.from_date ||
                                        payload.to_date ||
                                        null;

                                      return (
                                        <tr
                                          key={`line-${claim.id}-${
                                            line.id ?? li
                                          }`}
                                          className="claim-line-row"
                                        >
                                          <td></td>

                                          <td></td>

                                          <td>
                                            {resolveDateDisplay(payload, claim)}
                                          </td>

                                          <td>
                                            {Number(amount || 0).toFixed(2)}
                                          </td>

                                          <td style={{ paddingLeft: 12 }}>
                                            {payload.purpose || "-"}
                                          </td>

                                          <td
                                            className="participants-cell-col"
                                            title={getParticipantNamesForClaim(
                                              claim
                                            )}
                                          >
                                            <div className="rbadmin-comments">
                                              {getParticipantNamesForClaim(
                                                claim
                                              )}
                                            </div>
                                          </td>

                                          <td
                                            className="invoice-cell"
                                            title={lnInvDisplay}
                                          >
                                            {lnInvDisplay}
                                          </td>

                                          <td>
                                            {attachmentsForThis &&
                                            attachmentsForThis.length > 0 ? (
                                              <button
                                                className="attachments-btn"
                                                onClick={() =>
                                                  handleOpenAttachments(
                                                    attachmentsForThis.map(
                                                      (a) => ({
                                                        filename:
                                                          a.file_name ||
                                                          a.filename ||
                                                          a.fileName,
                                                        file_name:
                                                          a.file_name ||
                                                          a.filename,
                                                      })
                                                    ),
                                                    claim
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

                                          <td></td>

                                          <td></td>

                                          <td></td>

                                          <td></td>

                                          <td></td>
                                        </tr>
                                      );
                                    })}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="total-row">
                              <td
                                colSpan="7"
                                style={{
                                  textAlign: "right",
                                  color: "#949494",
                                  fontWeight: "bold",
                                }}
                              >
                                Total Amount Claiming:{" "}
                                <span
                                  style={{ fontWeight: "bold", color: "black" }}
                                >
                                  Rs {totalAmount}
                                </span>
                              </td>
                              <td colSpan="6" style={{ textAlign: "right" }}>
                                Amount Approved: Rs{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  {approvedAmount}
                                </span>
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
      ) : view === "self" ? (
        <Reimbursement />
      ) : view === "old" ? (
        <RbAdminOld />
      ) : null}

      {isParticipantsModalOpen && (
        <Modal
          isVisible={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          buttons={[
            {
              label: "Cancel",
              onClick: () => setIsParticipantsModalOpen(false),
            },
            {
              label: participantsSaving ? "Saving..." : "Save",
              onClick: saveParticipants,
              disabled: participantsSaving,
            },
          ]}
        >
          <h3>Manage Participants</h3>
          <p style={{ marginTop: 0 }}>
            Select employees to be saved as participants for this claim.
          </p>

          <ParticipantSelection
            departmentId={employeeData?.department_id || ""}
            selectionMode="group"
            onSelectionChange={handleParticipantSelectionChange}
            initialSelection={
              participantsForEdit && participantsForEdit.length
                ? employeeOptions.filter((eo) =>
                    participantsForEdit.includes(String(eo.employee_id))
                  )
                : []
            }
            limit={500}
          />

          <div className="participants-modal-selected">
            <div className="selected-title">Selected:</div>
            <div className="selected-list">
              {participantsForEdit && participantsForEdit.length ? (
                participantsForEdit.map((pid) => {
                  const found = employeeOptions.find(
                    (e) => String(e.employee_id) === String(pid)
                  );
                  return (
                    <div key={pid} className="selected-item">
                      {found ? `${found.name} [${pid}]` : pid}
                    </div>
                  );
                })
              ) : (
                <div className="selected-none">No participants selected.</div>
              )}
            </div>
          </div>
        </Modal>
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
              <label style={{ marginLeft: "20px" }}>
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
              className="submit-payment-btn"
              onClick={async () => {
                if (!selectedPaymentOption) {
                  showAlert("Please select an option.");
                  return;
                }
                if (!selectedPaymentClaim) {
                  showAlert("No claim selected.");
                  return;
                }
                try {
                  await axios.put(
                    `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
                    {
                      payment_status: selectedPaymentOption,
                      user_role: "admin",
                    },
                    {
                      withCredentials: true,
                      headers: { "x-api-key": process.env.REACT_APP_API_KEY },
                    }
                  );
                  showAlert("Payment status updated successfully.");
                  setIsPaymentModalOpen(false);
                  fetchEmployees();
                } catch (error) {
                  console.error("Error updating payment status:", error);
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

export default RbAdmin;
