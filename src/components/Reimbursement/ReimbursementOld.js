import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineCancel,
  MdEmojiTransportation,
  MdOutlinePhoneAndroid,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { GiKnifeFork, GiPencilBrush } from "react-icons/gi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import "./ReimbursementOld.css";
import Modal from "../Modal/Modal"; // Alert modal component
import Reimbursement from "./Reimbursement";

const claimTypes = [
  {
    icon: <MdEmojiTransportation className="claim-icons-old" />,
    label: "Transportation",
  },
  { icon: <GiKnifeFork className="claim-icons-old" />, label: "Meals" },
  {
    icon: <MdOutlinePhoneAndroid className="claim-icons-old" />,
    label: "Telecommunication",
  },
  { icon: <GiPencilBrush className="claim-icons-old" />, label: "Stationary" },
  {
    icon: <TbTriangleSquareCircle className="claim-icons-old" />,
    label: "Miscellaneous",
  },
];

const role = (localStorage.getItem("userRole") || "").trim();

const ReimbursementOld = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [filteredReimbursements, setFilteredReimbursements] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [transportType, setTransportType] = useState("");
  const [noOfDaysType, setNoOfDaysType] = useState("");
  const [attachments, setAttachments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState(
    role === "Admin" ? "approved" : "pending"
  );
  const [selectedSubType, setSelectedSubType] = useState("");

  // Base URL and credential fallbacks
  const BASE = process.env.REACT_APP_BACKEND_URL || "";
  const API_KEY =
    process.env.REACT_APP_API_KEY || localStorage.getItem("apiKey") || "";
  const authToken =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  const authHeaders = () => {
    const headers = {};
    if (API_KEY) headers["x-api-key"] = API_KEY;
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    return headers;
  };

  // robust employeeId extraction from several possible localStorage shapes
  const getStoredEmployeeId = () => {
    try {
      const candidateKeys = [
        "dashboardData",
        "user",
        "userData",
        "profile",
        "employee",
        "employeeData",
      ];
      for (const k of candidateKeys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (!parsed) continue;
          const id =
            parsed.employeeId ||
            parsed.employee_id ||
            parsed.empId ||
            parsed.emp_id;
          if (id) return String(id);
        } catch {
          // raw string (maybe just an id)
          if (k.toLowerCase().includes("employee") && raw) return raw;
        }
      }
      // also try direct keys
      const direct =
        localStorage.getItem("employeeId") ||
        localStorage.getItem("employee_id") ||
        localStorage.getItem("empId") ||
        localStorage.getItem("emp_id");
      if (direct) return String(direct);
      return null;
    } catch (e) {
      console.warn("Error reading employeeId from storage", e);
      return null;
    }
  };

  const employeeId = getStoredEmployeeId();
  const departmentId = (() => {
    try {
      const dd = JSON.parse(localStorage.getItem("dashboardData") || "{}");
      return dd?.department_id || dd?.departmentId || null;
    } catch {
      return null;
    }
  })();

  const formatDisplayDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Confirm / Alert modals
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    message: "",
    onConfirm: null,
  });
  const showConfirm = (message, onConfirm) =>
    setConfirmModal({ isVisible: true, message, onConfirm });
  const closeConfirm = () =>
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const showAlert = (message, title = "") =>
    setAlertModal({ isVisible: true, title, message });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  // ---------------- Fetching ----------------
  const fetchProjects = useCallback(async () => {
    if (!BASE) {
      console.warn("REACT_APP_BACKEND_URL not set — skipping projects fetch.");
      return;
    }
    try {
      const res = await axios.get(`${BASE}/old/projectdrop`, {
        withCredentials: true,
        headers: authHeaders(),
      });
      const list = res.data?.projects || res.data || [];
      setProjects(Array.isArray(list) ? list : []);
      console.debug(
        "[ReimbursementOld] projects loaded",
        Array.isArray(list) ? list.length : 0
      );
    } catch (err) {
      console.warn(
        "[ReimbursementOld] fetchProjects failed",
        err?.response?.data || err.message || err
      );
    }
  }, [BASE, API_KEY, authToken]);

  /**
   * Try several endpoints to get "self" reimbursements:
   * 1. /old/reimbursement/:employeeId (preferred)
   * 2. /old/reimbursement/me
   * 3. /old/reimbursement/self
   * 4. /old/reimbursements/me
   * 5. /old/reimbursements/self
   * 6. /old/reimbursement (as last resort)
   *
   * Only show the "missing authentication" message if server returns 401/403.
   */
  const fetchReimbursements = useCallback(async () => {
    if (!BASE) {
      showAlert("Server URL not configured (REACT_APP_BACKEND_URL).");
      return;
    }

    const endpoints = [];
    if (employeeId)
      endpoints.push(
        `${BASE}/old/reimbursement/${encodeURIComponent(employeeId)}`
      );
    endpoints.push(
      `${BASE}/old/reimbursement/me`,
      `${BASE}/old/reimbursement/self`,
      `${BASE}/old/reimbursements/me`,
      `${BASE}/old/reimbursements/self`,
      `${BASE}/old/reimbursement`
    );

    let lastErr = null;
    for (const url of endpoints) {
      try {
        console.debug(`[ReimbursementOld] attempting fetch: ${url}`);
        const resp = await axios.get(url, {
          withCredentials: true,
          headers: authHeaders(),
        });

        // treat several server shapes: array, {data: [...]}, {reimbursements: [...]}
        let reimbursementsData = [];
        if (Array.isArray(resp.data)) reimbursementsData = resp.data;
        else if (Array.isArray(resp.data.data))
          reimbursementsData = resp.data.data;
        else if (Array.isArray(resp.data.reimbursements))
          reimbursementsData = resp.data.reimbursements;
        else if (resp.data && typeof resp.data === "object") {
          // if response looks like a single object with id -> wrap
          if (resp.data.id || resp.data.employee_id)
            reimbursementsData = [resp.data];
          else
            reimbursementsData = Object.values(resp.data)
              .flat()
              .filter(Boolean);
        }

        // use it (even if empty array — that's a valid response)
        if (reimbursementsData && reimbursementsData.length >= 0) {
          console.debug(
            `[ReimbursementOld] success from ${url} — items:`,
            reimbursementsData.length
          );
          setReimbursements(reimbursementsData);

          // fetch attachments for claims (non-blocking)
          const attachmentsMap = {};
          await Promise.all(
            (reimbursementsData || []).map(async (claim) => {
              try {
                const attachResp = await axios.get(
                  `${BASE}/old/reimbursement/${claim.id}/attachments`,
                  {
                    withCredentials: true,
                    headers: authHeaders(),
                  }
                );
                const list =
                  attachResp.data?.attachments || attachResp.data || [];
                attachmentsMap[claim.id] = (list || []).map((file) => {
                  const filePath = file.file_path || file.filePath || "";
                  const pathParts = String(filePath).split("/").filter(Boolean);
                  const year = pathParts[pathParts.length - 4] || "";
                  const month = pathParts[pathParts.length - 3] || "";
                  const empId =
                    pathParts[pathParts.length - 2] ||
                    claim.employee_id ||
                    claim.employeeId ||
                    employeeId ||
                    "";
                  return { ...file, year, month, employeeId: empId };
                });
              } catch (e) {
                attachmentsMap[claim.id] = [];
              }
            })
          );
          setAttachments(attachmentsMap);
          return; // success — stop trying endpoints
        }
      } catch (err) {
        lastErr = err;
        const status = err?.response?.status;
        console.warn(
          `[ReimbursementOld] fetch failed for ${url}`,
          status || err.message
        );
        if (status === 401 || status === 403) {
          // only show missing-auth message when server explicitly says so
          showAlert("Missing authentication credentials. Please log in again.");
          return;
        }
        // otherwise try next endpoint
      }
    }

    // If we get here, nothing worked
    const fallbackMsg =
      (lastErr && (lastErr.response?.data?.message || lastErr.message)) ||
      "We ran into a problem fetching reimbursements.";
    setErrorMessage(fallbackMsg);
    showAlert(fallbackMsg);
  }, [BASE, employeeId]);

  useEffect(() => {
    fetchReimbursements();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------ Date handling/filtering logic ------------
  const tryParseDate = (s) => {
    if (!s && s !== 0) return null;
    if (s instanceof Date && !isNaN(s)) return s;
    if (typeof s === "number") {
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }
    let str = String(s).trim();
    if (!str) return null;
    str = str.replace(/\s+to\s+/i, " - ");
    str = str.replace(/\u2013|\u2014/g, " - ");
    str = str.replace(/\//g, "-");
    let d = new Date(str);
    if (!isNaN(d)) return d;
    if (str.includes("T")) {
      const [dateOnly] = str.split("T");
      d = new Date(dateOnly);
      if (!isNaN(d)) return d;
    }
    const ddmmyyyy = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      d = new Date(`${yyyy}-${mm}-${dd}`);
      if (!isNaN(d)) return d;
    }
    return null;
  };

  const normalizeStartOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const normalizeEndOfDay = (date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    );

  const parseClaimRange = (claim) => {
    let start = null;
    let end = null;

    if (
      claim.date_range &&
      typeof claim.date_range === "string" &&
      (claim.date_range.includes(" - ") ||
        claim.date_range.toLowerCase().includes(" to ") ||
        claim.date_range.includes("–") ||
        claim.date_range.includes("—"))
    ) {
      const unified = claim.date_range
        .replace(/\s+to\s+/gi, " - ")
        .replace(/\u2013|\u2014/g, " - ");
      const parts = unified.split(" - ").map((p) => p.trim());
      if (parts.length >= 2) {
        const p0 = tryParseDate(parts[0]);
        const p1 = tryParseDate(parts[1]);
        start = p0 || null;
        end = p1 || null;
      }
    }

    if (!start && (claim.from_date || claim.fromDate)) {
      start = tryParseDate(claim.from_date || claim.fromDate);
    }
    if (!end && (claim.to_date || claim.toDate)) {
      end = tryParseDate(claim.to_date || claim.toDate);
    }

    if (!start && claim.date) {
      start = tryParseDate(claim.date);
      end = start;
    }

    if (!start && claim.created_at) {
      const t = tryParseDate(claim.created_at);
      start = t;
      end = t;
    }

    if (start && !end) end = start;

    if (start && end) {
      start = normalizeStartOfDay(start);
      end = normalizeEndOfDay(end);
    }
    return { start, end };
  };

  const applyFilters = useCallback(() => {
    const fRaw = fromDate ? tryParseDate(fromDate) : null;
    const tRaw = toDate ? tryParseDate(toDate) : null;
    const fStart = fRaw ? normalizeStartOfDay(fRaw) : null;
    const tEnd = tRaw ? normalizeEndOfDay(tRaw) : null;

    const filtered = reimbursements.filter((claim) => {
      if (
        statusFilter &&
        claim.status &&
        claim.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      if (!fStart && !tEnd) return true;

      const { start, end } = parseClaimRange(claim);

      if (!start || !end) {
        return !fStart && !tEnd;
      }

      if (fStart && !tEnd) {
        return end.getTime() >= fStart.getTime();
      }
      if (!fStart && tEnd) {
        return start.getTime() <= tEnd.getTime();
      }
      if (fStart && tEnd) {
        if (end.getTime() < fStart.getTime()) return false;
        if (start.getTime() > tEnd.getTime()) return false;
        return true;
      }

      return true;
    });

    setFilteredReimbursements(filtered);
  }, [reimbursements, fromDate, toDate, statusFilter]);

  useEffect(() => {
    applyFilters();
  }, [reimbursements, fromDate, toDate, statusFilter, applyFilters]);

  // --------------- Form handlers & helpers ---------------
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const [formData, setFormData] = useState({
    employeeId: employeeId,
    department_id: departmentId,
    claim_type: "",
    transport_type: "",
    transport_amount: "",
    da: "",
    fromDate: "",
    toDate: "",
    date: "",
    travel_from: "",
    travel_to: "",
    meals_objective: "",
    purpose: "",
    purchasing_item: "",
    accommodation_fees: "",
    no_of_days: "",
    total_amount: "",
    meal_type: "",
    stationary: "",
    service_provider: "",
    project: "",
    attachments: null,
  });

  const handleClaimTypeChange = (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, claim_type: value }));
    setSelectedFiles([]);
    setSelectedClaim(null);
    setSelectedSubType("");
  };

  const handleTransportSubTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, transport_type: type }));
    setSelectedSubType(type);
    if (type === "Outstation") {
      setFormData((prev) => ({ ...prev, no_of_days: "" }));
    }
  };

  const handleNoOfDaysChange = (event) =>
    setFormData((prev) => ({ ...prev, no_of_days: event.target.value }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files.map((file) => file.name));
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const renderDateFields = () => {
    if (formData.transport_type === "Outstation") {
      return (
        <>
          <div className="rb-groups-old">
            <label>
              From Date<span className="asterisk-old">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
          <div className="rb-groups-old">
            <label>
              To Date<span className="asterisk-old">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
        </>
      );
    } else if (formData.no_of_days === "single") {
      return (
        <div className="rb-groups-old">
          <label>
            Date<span className="asterisk-old">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
          />
        </div>
      );
    } else if (formData.no_of_days === "multiple") {
      return (
        <>
          <div className="rb-groups-old">
            <label>
              From Date<span className="asterisk-old">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
          <div className="rb-groups-old">
            <label>
              To Date<span className="asterisk-old">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
        </>
      );
    }
    return null;
  };

  const handleEdit = (claim) => {
    setEditingId(claim.id);
    setShowForm(true);
    const existingAttachments = attachments[claim.id] || [];
    setFormData({
      employeeId: claim.employeeId || claim.employee_id || employeeId,
      department_id: claim.department_id || departmentId,
      claim_type: claim.claim_type || "",
      transport_type: claim.transport_type || "",
      fromDate: claim.from_date
        ? claim.from_date.substring(0, 10)
        : claim.fromDate || "",
      toDate: claim.to_date
        ? claim.to_date.substring(0, 10)
        : claim.toDate || "",
      date: claim.date ? claim.date.substring(0, 10) : claim.date || "",
      travel_from: claim.travel_from || "",
      travel_to: claim.travel_to || "",
      meals_objective: claim.meals_objective || "",
      purpose: claim.purpose || "",
      purchasing_item: claim.purchasing_item || "",
      accommodation_fees: claim.accommodation_fees || "",
      transport_amount: claim.transport_amount || "",
      da: claim.da || "",
      no_of_days: claim.no_of_days || "",
      total_amount: claim.total_amount || "",
      meal_type: claim.meal_type || "",
      stationary: claim.stationary || "",
      comments: claim.comments || "",
      service_provider: claim.service_provider || "",
      project: claim.project || "",
      attachments: existingAttachments,
    });
    setSelectedFiles(
      existingAttachments.map((file) => file.file_name || file.name)
    );
    setSelectedSubType(claim.transport_type || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitErrorMessage("");
    const wordCount = formData.purpose
      ? formData.purpose.trim().split(/\s+/).filter(Boolean).length
      : 0;
    if (wordCount < 10) {
      showAlert(
        `Purpose Details / Comments must be at least 10 words. You have ${wordCount}.`
      );
      return;
    }
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => {
        if (k === "attachments") return; // handled separately
        const val = formData[k];
        if (val !== null && val !== undefined) fd.append(k, val);
      });
      fd.append("role", role);
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((file) => fd.append("attachments", file));
      }

      if (!BASE)
        throw new Error("Server not configured (REACT_APP_BACKEND_URL).");

      let response;
      if (editingId) {
        response = await axios.put(
          `${BASE}/old/reimbursement/${editingId}`,
          fd,
          {
            withCredentials: true,
            headers: authHeaders(),
          }
        );
      } else {
        response = await axios.post(`${BASE}/old/reimbursement`, fd, {
          withCredentials: true,
          headers: authHeaders(),
        });
      }

      showAlert(
        response?.data?.message || "Reimbursement submitted successfully!"
      );
      // reset form
      setFormData({
        employeeId: employeeId,
        department_id: departmentId,
        claim_type: "",
        transport_type: "",
        fromDate: "",
        toDate: "",
        date: "",
        travel_from: "",
        travel_to: "",
        meals_objective: "",
        purpose: "",
        purchasing_item: "",
        accommodation_fees: "",
        no_of_days: "",
        total_amount: "",
        meal_type: "",
        stationary: "",
        service_provider: "",
        project: "",
        attachments: null,
      });
      setShowForm(false);
      setEditingId(null);
      setSelectedFiles([]);
      fetchReimbursements();
    } catch (error) {
      console.error("Error submitting reimbursement:", error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setSubmitErrorMessage(msg);
      showAlert(msg);
    }
  };

  const updateReimbursement = async (reimbursementId, updateData) => {
    try {
      if (!BASE) throw new Error("Server not configured.");
      const resp = await axios.put(
        `${BASE}/old/reimbursement/${reimbursementId}`,
        updateData,
        {
          withCredentials: true,
          headers: authHeaders(),
        }
      );
      fetchReimbursements();
      return resp.data;
    } catch (error) {
      console.error("Error updating reimbursement:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.";
      setUpdateErrorMessage(msg);
      showAlert(msg);
      throw error;
    }
  };

  const deleteReimbursement = async (id) => {
    if (!id) {
      console.error("Error: Reimbursement ID is missing.");
      return;
    }
    showConfirm(
      "Are you sure you want to delete this reimbursement claim?",
      async () => {
        try {
          await axios.delete(`${BASE}/old/reimbursement/${id}`, {
            headers: authHeaders(),
            withCredentials: true,
          });
          showAlert("Reimbursement deleted successfully!");
          fetchReimbursements();
        } catch (error) {
          console.error("Error deleting reimbursement:", error);
          showAlert("There was an issue deleting the reimbursement.");
        } finally {
          closeConfirm();
        }
      }
    );
  };

  const handleOpenAttachments = async (files = [], claim = {}) => {
    try {
      if (!files || files.length === 0) {
        showAlert("No attachments available.");
        return;
      }

      const fetchedFiles = await Promise.all(
        (files || []).map(async (file) => {
          const candidateFilename =
            file.file_name || file.filename || file.name;
          if (!candidateFilename) return null;
          const match = candidateFilename.match(/^(\d{4})[-_](\d{2})/);
          if (!match) return null;
          const [, year, month] = match;
          const empId =
            claim.employee_id || claim.employeeId || employeeId || "";
          const fileUrl = `${BASE}/old/reimbursement/${year}/${month}/${empId}/${candidateFilename}`;
          try {
            const resp = await axios.get(fileUrl, {
              withCredentials: true,
              headers: authHeaders(),
              responseType: "blob",
            });
            return {
              name: candidateFilename,
              url: URL.createObjectURL(
                new Blob([resp.data], { type: resp.headers["content-type"] })
              ),
            };
          } catch (err) {
            console.warn(
              "attachment fetch failed for",
              candidateFilename,
              err?.message || err
            );
            return null;
          }
        })
      );

      const valid = (fetchedFiles || []).filter(Boolean);
      if (!valid.length) {
        showAlert("No valid attachments could be loaded.");
        return;
      }
      setSelectedFiles(valid);
      setSelectedClaim(claim);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      showAlert("Could not load attachments. Please try again.");
    }
  };

  // Use filteredReimbursements (NOT reimbursements) for display and totals
  const filterClaims = filteredReimbursements || [];

  const totalAmount = (filteredReimbursements || []).reduce((sum, claim) => {
    const val = parseFloat(claim.total_amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  const approvedAmount = (filteredReimbursements || [])
    .filter((c) => (c.status || "").toLowerCase() === "approved")
    .reduce((sum, claim) => {
      const val = parseFloat(claim.total_amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  const rejectedAmount = (filteredReimbursements || [])
    .filter((c) => (c.status || "").toLowerCase() === "rejected")
    .reduce((sum, claim) => {
      const val = parseFloat(claim.total_amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

  const renderClaimSpecificFields = () => {
    switch (formData.claim_type) {
      case "Transportation":
        return (
          <>
            <div className="sub-tabs-old">
              {["Outstation", "Intercity", "Fuel"].map((type) => (
                <div
                  key={type}
                  className={`sub-tab-old ${
                    formData.transport_type === type ? "active" : ""
                  }`}
                  onClick={() => handleTransportSubTypeChange(type)}
                >
                  {type}
                </div>
              ))}
            </div>

            {(formData.transport_type === "Intercity" ||
              formData.transport_type === "Fuel") && (
              <div className="rb-radio-old">
                <label>Select no of days</label>
                <div className="rb-radio-options-old">
                  <label>
                    <input
                      type="radio"
                      name="no_of_days"
                      value="single"
                      checked={formData.no_of_days === "single"}
                      onChange={handleNoOfDaysChange}
                    />
                    Single
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="no_of_days"
                      value="multiple"
                      checked={formData.no_of_days === "multiple"}
                      onChange={handleNoOfDaysChange}
                    />
                    Multiple
                  </label>
                </div>
              </div>
            )}

            {formData.transport_type && (
              <div className="rb-main-form-old">
                <div className="rb-form-grid-old">
                  {renderDateFields()}

                  <div className="rb-groups">
                    <label>
                      Travel From<span className="asterisk-old">*</span>
                    </label>
                    <input
                      type="text"
                      name="travel_from"
                      value={formData.travel_from}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="rb-groups-old">
                    <label>
                      Travel To<span className="asterisk-old">*</span>
                    </label>
                    <input
                      type="text"
                      name="travel_to"
                      value={formData.travel_to}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups-old">
                      <label>Transport Amount</label>
                      <input
                        type="number"
                        name="transport_amount"
                        value={formData.transport_amount}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups-old">
                      <label>Accommodation Fees</label>
                      <input
                        type="number"
                        name="accommodation_fees"
                        value={formData.accommodation_fees}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups-old">
                      <label>DA</label>
                      <input
                        type="number"
                        name="da"
                        value={formData.da}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="rb-groups-old">
                    <label>
                      Total Amount<span className="asterisk-old">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_amount"
                      value={formData.total_amount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="purpose-attachment-old">
                  <div className="pa-groups-old">
                    <label>
                      Purpose Details / Comments
                      <span className="asterisk-old">*</span>
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="pa-groups-old">
                    <label>Attachment</label>
                    <div className="attachment-wrapper-old">
                      <div className="file-links-old">
                        {selectedFiles.length > 0 ? (
                          selectedFiles.map((fileName, index) => (
                            <p key={index} className="file-name-old">
                              {fileName}
                            </p>
                          ))
                        ) : (
                          <p>No files selected</p>
                        )}
                      </div>

                      <div className="attachment-upload-old">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          id="fileInput"
                          className="hidden-file-input-old"
                        />
                        <label
                          htmlFor="fileInput"
                          className="custom-file-upload-old"
                        >
                          Browse
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "Meals":
        return (
          <div className="rb-main-form-old">
            <div className="rb-form1-grid-old">
              <div className="rb-groups-old">
                <label>
                  Date<span className="asterisk-old">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups-old">
                <label>Meal Type</label>
                <select
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="breakfast">Break Fast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>
              <div className="rb-groups-old">
                <label>Meal's objective</label>
                <select
                  name="meals_objective"
                  value={formData.meals_objective}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="client_visit">Client Visit</option>
                  <option value="team_outing">Team Outing</option>
                  <option value="extended_work">Extended</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="rb-groups-old">
                <label>
                  Total Amount<span className="asterisk-old">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="purpose-attachment-old">
              <div className="pa-groups-old">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk-old">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>

              <div className="pa-groups-old">
                <label>Attachment</label>
                <div className="attachment-wrapper-old">
                  <div className="file-links-old">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name-old">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  <div className="attachment-upload-old">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input-old"
                    />
                    <label
                      htmlFor="fileInput"
                      className="custom-file-upload-old"
                    >
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Telecommunication":
        return (
          <div className="rb-main-form-old">
            <div className="rb-form2-grid-old">
              <div className="rb-groups-old">
                <label>
                  Date<span className="asterisk-old">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups-old">
                <label>Service Provider</label>
                <input
                  type="text"
                  name="service_provider"
                  value={formData.service_provider}
                  onChange={handleChange}
                />
              </div>
              <div className="rb-groups-old">
                <label>
                  Total Amount<span className="asterisk-old">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="purpose-attachment-old">
              <div className="pa-groups-old">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk-old">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>

              <div className="pa-groups-old">
                <label>Attachment</label>
                <div className="attachment-wrapper-old">
                  <div className="file-links-old">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name-old">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  <div className="attachment-upload-old">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input-old"
                    />
                    <label
                      htmlFor="fileInput"
                      className="custom-file-upload-old"
                    >
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Stationary":
        return (
          <div className="rb-main-form-old">
            <div className="rb-form1-grid-old">
              <div className="rb-groups-old">
                <label>
                  Date<span className="asterisk-old">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups-old">
                <label>Stationary</label>
                <select
                  name="stationary"
                  value={formData.stationary}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="office equipments">Office Equipments</option>
                  <option value="general stationary">General Stationary</option>
                </select>
              </div>
              <div className="rb-groups-old">
                <label>Purchasing Items</label>
                <input
                  type="text"
                  name="purchasing_item"
                  value={formData.purchasing_item}
                  onChange={handleChange}
                />
              </div>

              <div className="rb-groups-old">
                <label>
                  Total Amount<span className="asterisk-old">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="purpose-attachment-old">
              <div className="pa-groups-old">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk-old">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>

              <div className="pa-groups-old">
                <label>Attachment</label>
                <div className="attachment-wrapper-old">
                  <div className="file-links-old">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name-old">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  <div className="attachment-upload-old">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input-old"
                    />
                    <label
                      htmlFor="fileInput"
                      className="custom-file-upload-old"
                    >
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Miscellaneous":
        return (
          <div className="rb-main-form-old">
            <div className="rb-form1-grid-old">
              <div className="rb-groups-old">
                <label>
                  Date<span className="asterisk-old">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups-old">
                <label>
                  Total Amount<span className="asterisk-old">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="purpose-attachment-old">
              <div className="pa-groups-old">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk-old">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>

              <div className="pa-groups-old">
                <label>Attachment</label>
                <div className="attachment-wrapper-old">
                  <div className="file-links-old">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name-old">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  <div className="attachment-upload-old">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input-old"
                    />
                    <label
                      htmlFor="fileInput"
                      className="custom-file-upload-old"
                    >
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ------------ Render ------------
  return (
    <div className="reimbursement-container-old">
      <div className="rb-form-header-old">
        {role !== "Manager" && role !== "Admin" && (
          <h2>Reimbursement Requests</h2>
        )}
      </div>

      <div className="filter-container-old">
        <label>Status By</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <label>Date From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <label>To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button className="search-btn-old" onClick={applyFilters}>
          <FaSearch /> Search
        </button>
      </div>

      {errorMessage && <p className="rb-error-message-old">{errorMessage}</p>}

      <div className="reimbursement-table-scroll-old">
        <table className="reimbursement-table-old">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Claim Type</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Amount</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterClaims.map((claim, index) => (
              <tr key={claim.id}>
                <td>{index + 1}</td>
                <td>{claim.claim_type}</td>
                <td>
                  {claim.date_range
                    ? claim.date_range
                        .split(" - ")
                        .map(formatDisplayDate)
                        .join(" - ")
                    : claim.date
                    ? formatDisplayDate(claim.date)
                    : claim.from_date && claim.to_date
                    ? `${formatDisplayDate(
                        claim.from_date
                      )} - ${formatDisplayDate(claim.to_date)}`
                    : "N/A"}
                </td>
                <td>
                  <div className="rbadmin-comments-old">{claim.purpose}</div>
                </td>
                <td>{claim.total_amount}</td>
                <td>
                  {attachments[claim.id]?.length > 0 ? (
                    <button
                      className="attachments-btn-old"
                      onClick={() =>
                        handleOpenAttachments(attachments[claim.id], claim)
                      }
                    >
                      <MdOutlineRemoveRedEye className="eye-icon-old" /> View
                    </button>
                  ) : (
                    "Not Attached"
                  )}
                </td>
                <td>
                  <span
                    className={`rb-status-label-old ${
                      claim.status === "approved"
                        ? "rb-approved"
                        : claim.status === "rejected"
                        ? "rb-rejected"
                        : ""
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td>
                  <div className="rbadmin-comments-old">
                    {claim.approver_comments || "No comments"}
                  </div>
                </td>
                <td>{claim.payment_status}</td>
                <td className="actions-column-old">
                  <MdOutlineEdit
                    className={`edit-icon-old ${
                      claim.status && claim.status.toLowerCase() !== "pending"
                        ? "disabled-icon"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        claim.status &&
                        claim.status.toLowerCase() === "pending"
                      ) {
                        handleEdit(claim);
                        setShowForm(true);
                      }
                    }}
                  />
                  <MdDeleteOutline
                    className={`delete-icon-old ${
                      claim.status && claim.status.toLowerCase() !== "pending"
                        ? "disabled-icon"
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        claim.status &&
                        claim.status.toLowerCase() === "pending"
                      )
                        deleteReimbursement(claim.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row-old">
              <td
                colSpan="4"
                style={{
                  textAlign: "right",
                  color: "#949494",
                  fontWeight: "bold",
                }}
              >
                Total Amount Claiming:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Rs {totalAmount}
                </span>
              </td>
              <td colSpan="3" style={{ textAlign: "right" }}>
                Amount Approved: Rs{" "}
                <span style={{ fontWeight: "bold" }}>{approvedAmount}</span>
              </td>
              <td colSpan="3" style={{ textAlign: "right" }}>
                Amount Rejected: Rs{" "}
                <span style={{ fontWeight: "bold" }}>{rejectedAmount}</span>
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Mobile cards */}
        <div className="rb-reimbursement-cards-old">
          {filterClaims.map((claim, index) => (
            <div className="rb-reimbursement-card-old" key={claim.id}>
              <div className="rb-card-header-old">
                <span
                  className={`rb-status-old ${claim.status?.toLowerCase()}`}
                >
                  {claim.status}
                </span>
              </div>
              <div className="rb-card-body-old">
                <p>
                  <strong>Sl No:</strong> {index + 1}
                </p>
                <p>
                  <strong>Claim Type:</strong> {claim.claim_type}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {claim.date ? formatDisplayDate(claim.date) : "N/A"}
                </p>
                <p>
                  <strong>Purpose:</strong> {claim.purpose}
                </p>
                <p>
                  <strong>Amount:</strong> Rs {claim.total_amount}
                </p>
                <p>
                  <strong>Comments:</strong>{" "}
                  {claim.approver_comments || "No comments"}
                </p>
              </div>
              <div className="rb-card-footer-old">
                {attachments[claim.id]?.length > 0 ? (
                  <button
                    className="rb-attachments-btn-old"
                    onClick={() =>
                      handleOpenAttachments(attachments[claim.id], claim)
                    }
                  >
                    <MdOutlineRemoveRedEye className="rb-eye-icon-old" /> View
                  </button>
                ) : (
                  <span className="rb-no-attachment-old">No Attachment</span>
                )}
                {claim.status && claim.status.toLowerCase() === "pending" && (
                  <div className="rb-card-actions-old">
                    <MdOutlineEdit
                      className="rb-edit-icon-old"
                      onClick={() => {
                        handleEdit(claim);
                        setShowForm(true);
                      }}
                    />
                    <MdDeleteOutline
                      className="rb-delete-icon-old"
                      onClick={() => deleteReimbursement(claim.id)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="rb-modal-old">
          <div className="rb-modal-content-old">
            <div className="claim-form-header-old">
              <h2 className="claim-form-title-old">
                {editingId ? "Edit Reimbursement" : "New Reimbursement"}
              </h2>
              <MdOutlineCancel
                className="claim-form-close-old"
                onClick={() => setShowForm(false)}
              />
            </div>
            {submitErrorMessage && (
              <p className="rb-error-message-old">{submitErrorMessage}</p>
            )}
            {updateErrorMessage && (
              <p className="rb-error-message-old">{updateErrorMessage}</p>
            )}
            <form className="reimbursement-form-old" onSubmit={handleSubmit}>
              <div className="claim-type-old">
                <label>
                  Project<span className="asterisk-old">*</span>
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select project</option>
                  <option value="STS CLAIM">STS CLAIM</option>
                  {projects.map((proj, i) => (
                    <option key={i} value={proj}>
                      {proj}
                    </option>
                  ))}
                </select>

                <div className="rb-tabs-old">
                  {claimTypes.map(({ icon, label }) => (
                    <div
                      key={label}
                      className={`rb-tab-old ${
                        formData.claim_type === label ? "active" : ""
                      }`}
                      onClick={() => handleClaimTypeChange(label)}
                    >
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>

              {renderClaimSpecificFields()}

              <div className="reimbursement-form-button-old">
                <button
                  type="button"
                  className="rb-close-old"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rb-submit-old">
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
              selectedFiles.map((file, idx) => (
                <div className="att-files-old" key={idx}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
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
        isVisible={confirmModal.isVisible}
        onClose={closeConfirm}
        buttons={[
          { label: "Cancel", onClick: closeConfirm },
          { label: "Confirm", onClick: confirmModal.onConfirm },
        ]}
      >
        <p>{confirmModal.message}</p>
      </Modal>

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

export default ReimbursementOld;
