import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import {
  MdOutlineCancel,
  MdOutlineRemoveRedEye,
  MdOutlineEdit,
  MdDeleteOutline,
} from "react-icons/md";
import axios from "axios";

import Reimbursement from "./Reimbursement";
import "./RbTeamLead.css";
import RbTeamLeadOld from "./RbTeamLeadOld";

import Modal from "../Modal/Modal";
import ParticipantSelection from "./ParticipantSelection";

const RbTeamLead = () => {
  const [view, setView] = useState("team");
  const [employees, setEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedClaims, setExpandedClaims] = useState({});
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

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsForEdit, setParticipantsForEdit] = useState([]);
  const [participantsSaving, setParticipantsSaving] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [claimToEdit, setClaimToEdit] = useState(null);

  const teamLeadData = JSON.parse(localStorage.getItem("dashboardData")) || {};
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
            withCredentials: true,
            headers: { "x-api-key": process.env.REACT_APP_API_KEY },
          }
        );
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
    fetchEmployeeOptions();
  }, []);

  const fetchEmployeeOptions = async () => {
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/employees`,
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );
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
        { employee_id: teamLeadId || "E000", name: "You", position: "" },
        { employee_id: "E1001", name: "Priya Sharma", position: "Developer" },
        { employee_id: "E1002", name: "Rahul Verma", position: "Analyst" },
      ]);
    }
  };

  useEffect(() => {
    if (view === "team") fetchEmployees();
  }, [view]);

  const formatDisplayDate = (raw) => {
    if (!raw) return " ";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const dd = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const yy = d.getFullYear();
    return `${dd}-${mon}-${yy}`;
  };

  const formatRange = (from, to) => {
    const f = formatDisplayDate(from);
    const t = formatDisplayDate(to);
    if (!f && !t) return " ";
    if (f && t && f !== t) return `${f} - ${t}`;
    return f || t;
  };

  const resolveDateDisplay = (payload = {}, claim = {}) => {
    if (payload.date_range) {
      const parts = payload.date_range.split(/\s*-\s*/);
      if (parts.length >= 2) return formatRange(parts[0], parts[1]);
    }

    if (payload.from_date || payload.to_date) {
      return formatRange(payload.from_date, payload.to_date);
    }

    if (Array.isArray(payload.dates) && payload.dates.length) {
      return payload.dates.map(formatDisplayDate).join(", ");
    }

    if (payload.date) return formatDisplayDate(payload.date);

    if (claim.date_range) {
      const parts = claim.date_range.split(/\s*-\s*/);
      if (parts.length >= 2) return formatRange(parts[0], parts[1]);
    }

    if (claim.date) return formatDisplayDate(claim.date);

    return " ";
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
          withCredentials: true,
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

      const filteredFlatClaims = flatClaims.filter(
        (c) => String(c.employee_id) !== String(teamLeadId)
      );

      const grouped = filteredFlatClaims.reduce((acc, claim) => {
        const empId = claim.employee_id;
        if (!acc[empId]) acc[empId] = { employee_id: empId, claims: [] };
        acc[empId].claims.push(claim);
        return acc;
      }, {});
      setEmployees(Object.values(grouped));

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
          try {
            if (!file?.filename && !file?.file_name) return null;
            const filename = file.filename || file.file_name;
            const match = filename.match(/^(\d{4})-(\d{2})-\d{2}/);
            if (!match) return null;
            const year = match[1];
            const month = match[2];
            const empId = claim.employee_id;
            const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${year}/${month}/${empId}/${filename}`;

            const response = await axios.get(fileUrl, {
              withCredentials: true,
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                Authorization: authToken ? `Bearer ${authToken}` : undefined,
              },
              responseType: "blob",
            });

            return {
              name: filename,
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
    const updatedStatus = statusUpdates[id] || "";
    if (!updatedStatus) {
      showAlert("Please select a status.");
      return;
    }

    let claim = null;
    for (const emp of employees) {
      if (!emp || !Array.isArray(emp.claims)) continue;
      const found = emp.claims.find((c) => String(c.id) === String(id));
      if (found) {
        claim = found;
        break;
      }
    }

    const existingProject = claim?.project || "";

    const manualSelection = Object.prototype.hasOwnProperty.call(
      projectSelections,
      id
    )
      ? projectSelections[id]
      : undefined;

    const projectToSend =
      typeof manualSelection !== "undefined" && manualSelection !== ""
        ? manualSelection
        : existingProject;

    if (!projectToSend) {
      showAlert("Please select a project.");
      return;
    }

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
          project: projectToSend,
        },
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );

      showAlert(`Reimbursement ${updatedStatus} successfully.`);

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => ({
          ...emp,
          claims: emp.claims.map((c) =>
            String(c.id) === String(id)
              ? {
                  ...c,
                  status: updatedStatus,
                  approver_comments: approverComment,
                  project: projectToSend,
                }
              : c
          ),
        }))
      );

      setProjectSelections((prev) => {
        if (!Object.prototype.hasOwnProperty.call(prev, id)) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setStatusUpdates((prev) => {
        if (!Object.prototype.hasOwnProperty.call(prev, id)) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
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
    if (!selectedPaymentClaim) {
      showAlert("No claim selected.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/payment-status/${selectedPaymentClaim.id}`,
        {
          payment_status: selectedPaymentOption,
          user_role: "Manager",
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
      const msg =
        error?.response?.data?.error ||
        "Could not update payment status. Please try again.";
      showAlert(msg);
    }
  };

  const sanitizeFileName = (name) => {
    if (!name) return "";
    return name
      .replace(/[\u0000-\u001F<>:"/\\|?*]+/g, "")
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
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
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

  const handleToggleChange = (e) => {
    setView(e.target.checked ? "self" : "team");
  };

  const deleteClaim = async (id) => {
    if (!id) return;
    const ok = window.confirm("Delete this reimbursement?");
    if (!ok) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${id}`,
        {
          withCredentials: true,
          headers: { "x-api-key": process.env.REACT_APP_API_KEY },
        }
      );
      showAlert("Reimbursement deleted.");
      fetchEmployees();
    } catch (err) {
      console.error("Delete error:", err);
      showAlert("Unable to delete reimbursement.");
    }
  };

  const parseInvoicesForClaim = (claim) => {
    let invs =
      claim.invoices || claim.invoice_numbers || claim.invoice_no || [];
    try {
      if (typeof invs === "string" && invs.trim()) invs = JSON.parse(invs);
    } catch (e) {
      if (typeof invs === "string")
        invs = invs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else invs = Array.isArray(invs) ? invs : [];
    }
    return Array.isArray(invs) && invs.length ? invs : [];
  };

  const getParticipantNamesForClaim = (claim = {}) => {
    const partRaw =
      claim.participants ||
      claim.participant_ids ||
      claim.participant_names ||
      [];
    let part = [];
    try {
      if (typeof partRaw === "string" && partRaw.trim())
        part = JSON.parse(partRaw);
      else part = Array.isArray(partRaw) ? partRaw : [];
    } catch (e) {
      if (typeof partRaw === "string")
        part = partRaw ? partRaw.split(",").map((s) => s.trim()) : [];
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

  const parseAmount = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const s = String(v)
      .replace(/,/g, "")
      .replace(/[^0-9.\-]/g, "")
      .trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const getClaimAmount = (claim = {}) => {
    if (!claim) return 0;
    const candidates = [
      claim.aggregated_total,
      claim.aggregatedTotal,
      claim.total_amount,
      claim.totalAmount,
      claim.total,
    ];
    for (const c of candidates) {
      const n = parseAmount(c);
      if (n !== 0) return n;
    }

    if (Array.isArray(claim.lines) && claim.lines.length) {
      return claim.lines.reduce((s, ln) => {
        if (!ln) return s;
        const lnCandidates = [
          ln.total_amount,
          ln.totalAmount,
          ln.payload && ln.payload.total_amount,
          ln.payload && ln.payload.totalAmount,
        ];
        for (const lc of lnCandidates) {
          const lnVal = parseAmount(lc);
          if (lnVal !== 0) {
            s += lnVal;
            return s;
          }
        }
        s += parseAmount(ln.total_amount ?? ln.payload?.total_amount ?? 0);
        return s;
      }, 0);
    }

    return 0;
  };

  const openParticipantsModal = (claim) => {
    let existing = claim.participants || claim.participant_ids || [];
    try {
      if (typeof existing === "string" && existing.trim())
        existing = JSON.parse(existing);
    } catch (e) {
      if (typeof existing === "string")
        existing = existing
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else existing = Array.isArray(existing) ? existing : [];
    }
    const ids = (existing || [])
      .map((p) =>
        typeof p === "object"
          ? p.employee_id || p.id || p.employeeId
          : String(p)
      )
      .filter(Boolean)
      .map(String);
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

  const openEditModal = (claim) => {
    setClaimToEdit(claim);
    setIsEditModalOpen(true);
  };

  const confirmOpenInSelfView = (claim) => {
    try {
      localStorage.setItem("reimbursementEditId", String(claim.id));
    } catch (e) {
      console.warn("Could not set reimbursementEditId in localStorage", e);
    }
    setIsEditModalOpen(false);
    setView("self");
    showAlert(
      "Opened Self view for editing. If Reimbursement UI supports prefill, it will detect the claim to edit."
    );
  };

  const toggleClaimExpand = (claimId) => {
    setExpandedClaims((prev) => ({ ...prev, [claimId]: !prev[claimId] }));
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
        <button
          className={`tab ${view === "old" ? "active" : ""}`}
          onClick={() => setView("old")}
        >
          Old
        </button>
      </div>

      {view === "team" && (
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
                          .toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </div>
                    <div className="emp-rows">
                      <span>
                        Amount Approved: Rs{" "}
                        {filteredClaims
                          .filter(
                            (claim) =>
                              String(claim.status || "").toLowerCase() ===
                              "approved"
                          )
                          .reduce(
                            (sum, claim) => sum + getClaimAmount(claim),
                            0
                          )
                          .toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                            {filteredClaims.map((rb, index) => {
                              const lines = Array.isArray(rb.lines)
                                ? rb.lines
                                    .slice()
                                    .sort(
                                      (a, b) =>
                                        (a.line_index || 0) -
                                        (b.line_index || 0)
                                    )
                                : [];

                              const claimLevelInvs = parseInvoicesForClaim(rb);
                              const invSet = new Set(
                                (claimLevelInvs || []).map((i) =>
                                  String(i).trim()
                                )
                              );

                              lines.forEach((ln) => {
                                const lnInvRaw =
                                  ln?.payload?.invoices ||
                                  ln?.payload?.invoice ||
                                  [];
                                let parsed = lnInvRaw;
                                try {
                                  if (
                                    typeof parsed === "string" &&
                                    parsed.trim()
                                  )
                                    parsed = JSON.parse(parsed);
                                } catch (e) {}
                                if (typeof parsed === "string") {
                                  parsed = parsed
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean);
                                }
                                if (Array.isArray(parsed)) {
                                  parsed.forEach((i) => {
                                    if (i) invSet.add(String(i).trim());
                                  });
                                }
                              });

                              const claimInvDisplay = invSet.size
                                ? Array.from(invSet).join(", ")
                                : "-";

                              const firstLinePayload =
                                lines && lines.length
                                  ? lines[0].payload || {}
                                  : {};
                              const firstLineDate =
                                firstLinePayload.date ||
                                firstLinePayload.from_date ||
                                firstLinePayload.to_date ||
                                null;

                              const mainDate = rb.date_range
                                ? rb.date_range
                                : rb.date
                                ? rb.date
                                : firstLineDate;

                              const amountDisplayNumber = getClaimAmount(rb);

                              return (
                                <React.Fragment
                                  key={
                                    rb.id || `${employee.employee_id}-${index}`
                                  }
                                >
                                  <tr className="claim-main-row">
                                    <td>
                                      <button
                                        type="button"
                                        onClick={() => toggleClaimExpand(rb.id)}
                                        aria-expanded={!!expandedClaims[rb.id]}
                                        title={
                                          expandedClaims[rb.id]
                                            ? "Collapse"
                                            : "Expand"
                                        }
                                        style={{ minWidth: 36 }}
                                      >
                                        {expandedClaims[rb.id] ? "−" : "+"}
                                      </button>{" "}
                                      {index + 1}
                                    </td>

                                    <td>{rb.claim_type || "-"}</td>

                                    <td>
                                      {resolveDateDisplay(
                                        lines && lines.length
                                          ? lines[0].payload
                                          : {},
                                        rb
                                      )}
                                    </td>

                                    <td>
                                      ₹
                                      {amountDisplayNumber.toLocaleString(
                                        "en-IN",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                    </td>

                                    <td
                                      className="participants-cell-col"
                                      title={rb.purpose}
                                    >
                                      <div className="rbadmin-comments">
                                        {rb.purpose || rb.comments || "-"}
                                      </div>
                                    </td>

                                    <td
                                      className="participants-cell-col"
                                      title={getParticipantNamesForClaim(rb)}
                                    >
                                      <div className="rbadmin-comments">
                                        {getParticipantNamesForClaim(rb)}
                                      </div>
                                    </td>

                                    <td
                                      className="invoice-cell"
                                      title={claimInvDisplay}
                                      style={{
                                        maxWidth: 180,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {claimInvDisplay}
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
                                      ) : rb.line_attachments_map &&
                                        Object.keys(rb.line_attachments_map)
                                          .length > 0 ? (
                                        <button
                                          className="attachments-btn"
                                          onClick={() =>
                                            handleOpenAttachments(
                                              Object.values(
                                                rb.line_attachments_map
                                              ).flat(),
                                              rb
                                            )
                                          }
                                        >
                                          <MdOutlineRemoveRedEye className="eye-icon" />{" "}
                                          View Line Attachments
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
                                          value={
                                            statusUpdates[rb.id] ||
                                            rb.status ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleStatusChange(
                                              rb.id,
                                              e.target.value
                                            )
                                          }
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
                                      {rb.status === "approved" ||
                                      rb.status === "rejected" ? (
                                        <div className="rbadmin-comments">
                                          {projectSelections[rb.id] ||
                                            rb.project}
                                        </div>
                                      ) : (
                                        <select
                                          className="rb-status-dropdown"
                                          value={
                                            projectSelections[rb.id] !==
                                            undefined
                                              ? projectSelections[rb.id]
                                              : rb.project || ""
                                          }
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

                                          {rb.project &&
                                            !projects.includes(rb.project) && (
                                              <option
                                                key={`current-${rb.id}`}
                                                value={rb.project}
                                              >
                                                {rb.project}
                                              </option>
                                            )}

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
                                          {rb.approver_comments ||
                                            "No comments"}
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
                                        rb.payment_status
                                          ?.toLowerCase()
                                          .trim() === "pending" ? (
                                          <button
                                            className="pending-payment-btn"
                                            onClick={() => {
                                              setSelectedPaymentClaim(rb);
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
                                        <span>{rb.payment_status || "-"}</span>
                                      )}
                                    </td>

                                    <td>
                                      <FaFileInvoice
                                        size={24}
                                        className="update-btn"
                                        onClick={() => {
                                          if (
                                            rb.status === "approved" ||
                                            rb.status === "rejected"
                                          )
                                            return;
                                          updateStatus(rb.id);
                                        }}
                                        title="Update status"
                                      />
                                      <FiDownload
                                        size={24}
                                        className="download-btn"
                                        onClick={() => handleDownloadPDF(rb)}
                                        title="Download PDF"
                                      />
                                    </td>
                                  </tr>

                                  {expandedClaims[rb.id] &&
                                    (lines.length
                                      ? lines
                                      : [{ id: null, payload: rb }]
                                    ).map((line, li) => {
                                      const payload = line.payload || {};
                                      const lineInvsRaw =
                                        payload.invoices ||
                                        payload.invoice ||
                                        [];
                                      let lineInvs = [];
                                      try {
                                        if (
                                          typeof lineInvsRaw === "string" &&
                                          lineInvsRaw.trim()
                                        ) {
                                          lineInvs = JSON.parse(lineInvsRaw);
                                        } else if (Array.isArray(lineInvsRaw)) {
                                          lineInvs = lineInvsRaw;
                                        }
                                      } catch (e) {
                                        if (typeof lineInvsRaw === "string") {
                                          lineInvs = lineInvsRaw
                                            .split(",")
                                            .map((s) => s.trim())
                                            .filter(Boolean);
                                        }
                                      }
                                      const lnInvDisplay =
                                        Array.isArray(lineInvs) &&
                                        lineInvs.length
                                          ? lineInvs.join(", ")
                                          : claimInvDisplay;

                                      const lineAttachMap =
                                        rb.line_attachments_map || {};
                                      const attachmentsForThis =
                                        (line &&
                                          (lineAttachMap[String(line.id)] ||
                                            lineAttachMap[line.id])) ||
                                        [];

                                      const lineAmount = line
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
                                          key={`line-${rb.id}-${line.id ?? li}`}
                                          className="claim-line-row"
                                        >
                                          <td></td>
                                          <td></td>
                                          <td>
                                            {resolveDateDisplay(payload, rb)}
                                          </td>

                                          <td>
                                            {Number(lineAmount || 0).toFixed(2)}
                                          </td>
                                          <td style={{ paddingLeft: 12 }}>
                                            {payload.purpose || "-"}
                                          </td>
                                          <td
                                            className="participants-cell-col"
                                            title={getParticipantNamesForClaim(
                                              rb
                                            )}
                                          >
                                            <div className="rbadmin-comments">
                                              {getParticipantNamesForClaim(rb)}
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
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELF (NEW) */}
      {view === "self" && <Reimbursement />}

      {/* OLD (OLD DATA) */}
      {view === "old" && <RbTeamLeadOld />}

      {isEditModalOpen && claimToEdit && (
        <Modal
          isVisible={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          buttons={[
            { label: "Close", onClick: () => setIsEditModalOpen(false) },
            {
              label: "Open in Self View",
              onClick: () => confirmOpenInSelfView(claimToEdit),
            },
          ]}
        >
          <h3>Edit Claim</h3>
          <p>
            <strong>Claim ID:</strong> {claimToEdit.id}
          </p>
          <p>
            <strong>Employee:</strong> {claimToEdit.employee_name} (
            {claimToEdit.employee_id})
          </p>
          <p>
            <strong>Type:</strong> {claimToEdit.claim_type}
          </p>
          <p>
            <strong>Amount:</strong> ₹{claimToEdit.total_amount}
          </p>
          <p>
            <strong>Purpose:</strong> {claimToEdit.purpose || "—"}
          </p>
          <p style={{ color: "#555", marginTop: 8 }}>
            Clicking "Open in Self View" will switch to the Self tab and store a
            temporary edit id in localStorage (`reimbursementEditId`). The
            Reimbursement UI can read that value to prefill the form for
            editing.
          </p>
        </Modal>
      )}

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
          <ParticipantSelection
            departmentId={departmentId}
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
