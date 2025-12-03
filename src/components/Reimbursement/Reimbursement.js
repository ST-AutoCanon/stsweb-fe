import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineCancel,
  MdOutlineRemoveRedEye,
  MdEmojiTransportation,
  MdOutlinePhoneAndroid,
} from "react-icons/md";
import { GiKnifeFork, GiPencilBrush } from "react-icons/gi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import "./Reimbursement.css";
import "./ParticipantSelection.css";
import Modal from "../Modal/Modal";
import ParticipantSelection from "./ParticipantSelection";
import AttachmentsModal from "./AttachmentModal";
import ReimbursementForm from "./ReimbursementForm";

const claimTypes = [
  {
    icon: <MdEmojiTransportation className="claim-icons" />,
    label: "Transportation",
  },
  { icon: <GiKnifeFork className="claim-icons" />, label: "Meals" },
  {
    icon: <MdOutlinePhoneAndroid className="claim-icons" />,
    label: "Telecommunication",
  },
  { icon: <GiPencilBrush className="claim-icons" />, label: "Stationary" },
  {
    icon: <TbTriangleSquareCircle className="claim-icons" />,
    label: "Miscellaneous",
  },
];

const role = localStorage.getItem("userRole") || "";

const Reimbursement = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [filteredReimbursements, setFilteredReimbursements] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const employeeData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const employeeId =
    employeeData?.employeeId || employeeData?.employee_id || "";
  const departmentId = employeeData?.department_id || "";

  const [attachments, setAttachments] = useState({});
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [attachmentViewerFiles, setAttachmentViewerFiles] = useState([]);
  const [attachmentViewerTitle, setAttachmentViewerTitle] = useState("");

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState(
    role === "Admin" ? "approved" : "pending"
  );

  const [participantMode, setParticipantMode] = useState("single"); // 'single'|'group'
  const [participants, setParticipants] = useState(
    employeeId ? [employeeId] : []
  );
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const showAlert = (message, title = "") =>
    setAlertModal({ isVisible: true, title, message });
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    id: null,
    title: "Confirm",
    message: "",
    claim: null,
  });
  const openConfirmDelete = (id, claim = null) =>
    setConfirmModal({
      isVisible: true,
      id,
      title: "Delete Reimbursement",
      message: "Are you sure you want to delete this reimbursement?",
      claim,
    });
  const closeConfirmDelete = () =>
    setConfirmModal({
      isVisible: false,
      id: null,
      title: "",
      message: "",
      claim: null,
    });

  const [formData, setFormData] = useState({
    employeeId,
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
    invoices: [],
  });

  const RAW_BACKEND =
    process.env.REACT_APP_BACKEND_URL || localStorage.getItem("backend") || "";
  const BACKEND = (() => {
    if (!RAW_BACKEND) return "";
    if (!/^https?:\/\//i.test(RAW_BACKEND))
      return `http://${RAW_BACKEND}`.replace(/\/$/, "");
    return RAW_BACKEND.replace(/\/$/, "");
  })();

  const buildHeaders = () => {
    const h = {};
    const apiKey =
      process.env.REACT_APP_API_KEY ||
      localStorage.getItem("apiKey") ||
      localStorage.getItem("x-api-key");
    if (apiKey) h["x-api-key"] = apiKey;
    if (authToken) h["Authorization"] = `Bearer ${authToken}`;
    return h;
  };

  const extractErrorMessage = (
    err,
    fallback = "An unexpected error occurred."
  ) => {
    const data = err?.response?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (data.error) return data.error;
      if (data.message) return data.message;
      if (data.errors) {
        if (Array.isArray(data.errors)) return data.errors.join(", ");
        if (typeof data.errors === "object") return JSON.stringify(data.errors);
      }
    }
    if (err?.message) return err.message;
    return fallback;
  };

  const fetchReimbursements = useCallback(async () => {
    try {
      const url = `${
        BACKEND || process.env.REACT_APP_BACKEND_URL
      }/reimbursement/${employeeId}`;

      const config = { withCredentials: true, headers: buildHeaders() };
      if (String(url).includes("/uploads/")) {
        config.withCredentials = true;
        config.responseType = "blob";
      }

      const res = await axios.get(url, config);
      const data = Array.isArray(res.data) ? res.data : res.data || [];
      setReimbursements(data);

      const attachmentsData = {};
      await Promise.all(
        data.map(async (claim) => {
          try {
            const attachRes = await axios.get(
              `${BACKEND || process.env.REACT_APP_BACKEND_URL}/reimbursement/${
                claim.id
              }/attachments`,
              { withCredentials: true, headers: buildHeaders() }
            );
            attachmentsData[claim.id] = attachRes.data.attachments || [];
          } catch {
            attachmentsData[claim.id] = [];
          }
        })
      );
      setAttachments(attachmentsData);
    } catch (err) {
      console.error("Error fetching reimbursements:", err);
      setErrorMessage(
        extractErrorMessage(err, "Error fetching reimbursements")
      );
    }
  }, [employeeId]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND || process.env.REACT_APP_BACKEND_URL}/projectdrop`,
        { withCredentials: true, headers: buildHeaders() }
      );
      setProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const url = `${
        BACKEND || process.env.REACT_APP_BACKEND_URL
      }/reimbursement/employees`;
      const res = await axios.get(url, {
        withCredentials: true,
        headers: buildHeaders(),
      });
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
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
        "Could not fetch /reimbursement/employees — falling back to demo list"
      );
      setEmployeeOptions([
        { employee_id: employeeId || "E000", name: "You", position: "" },
        { employee_id: "E1001", name: "Priya Sharma", position: "Developer" },
        { employee_id: "E1002", name: "Rahul Verma", position: "Analyst" },
        { employee_id: "E1003", name: "Amit Patel", position: "Sales" },
      ]);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchReimbursements();
    fetchProjects();
    fetchEmployees();
  }, []);

  const tryParseDate = (s) => {
    if (!s && s !== 0) return null;
    if (s instanceof Date && !isNaN(s)) return s;
    const d = new Date(s);
    return isNaN(d) ? null : d;
  };
  const normalizeStartOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const normalizeEndOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const parseClaimRange = (claim) => {
    let start = null,
      end = null;
    if (claim.date_range && typeof claim.date_range === "string") {
      const unified = claim.date_range
        .replace(/\s+to\s+/i, " - ")
        .replace(/\u2013|\u2014/g, " - ");
      const parts = unified.split(" - ").map((p) => p.trim());
      if (parts.length >= 2) {
        start = tryParseDate(parts[0]);
        end = tryParseDate(parts[1]);
      }
    }
    if (!start && (claim.from_date || claim.fromDate))
      start = tryParseDate(claim.from_date || claim.fromDate);
    if (!end && (claim.to_date || claim.toDate))
      end = tryParseDate(claim.to_date || claim.toDate);
    if (!start && claim.date) start = tryParseDate(claim.date);
    if (!start && claim.created_at) start = tryParseDate(claim.created_at);
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
      )
        return false;
      if (!fStart && !tEnd) return true;
      const { start, end } = parseClaimRange(claim);
      if (!start || !end) return !fStart && !tEnd;
      if (fStart && !tEnd) return end.getTime() >= fStart.getTime();
      if (!fStart && tEnd) return start.getTime() <= tEnd.getTime();
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

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleClaimTypeChange = (value) => {
    setParticipantMode("single");
    setParticipants(employeeId ? [employeeId] : []);
    setFormData((p) => ({
      ...p,
      claim_type: value,
      transport_type: "",
      no_of_days: "",
    }));
    setSelectedFiles([]);
  };

  const handleTransportSubTypeChange = (type) => {
    setFormData((p) => ({ ...p, transport_type: type }));
    if (type === "Outstation") setFormData((p) => ({ ...p, no_of_days: "" }));
  };

  const handleNoOfDaysChange = (e) =>
    setFormData((p) => ({ ...p, no_of_days: e.target.value }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files.map((f) => f.name));
    setFormData((p) => ({ ...p, attachments: files }));
  };

  const handleEdit = (claim) => {
    setEditingId(claim.id);
    setShowForm(true);
    const attach = attachments[claim.id] || [];
    const existingParticipants =
      claim.participants || claim.participant_ids || [];
    const ids =
      Array.isArray(existingParticipants) && existingParticipants.length
        ? existingParticipants.map((x) =>
            typeof x === "object" ? x.employee_id || x.id : x
          )
        : [employeeId];
    setParticipants(ids);
    setParticipantMode(ids.length > 1 ? "group" : "single");

    let existingInvoices =
      claim.invoices || claim.invoice_numbers || claim.invoice_no || [];
    try {
      if (typeof existingInvoices === "string" && existingInvoices.trim())
        existingInvoices = JSON.parse(existingInvoices);
    } catch (e) {
      if (typeof existingInvoices === "string") {
        existingInvoices = existingInvoices
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else
        existingInvoices = Array.isArray(existingInvoices)
          ? existingInvoices
          : [];
    }
    if (!Array.isArray(existingInvoices))
      existingInvoices = existingInvoices ? [String(existingInvoices)] : [];

    setFormData({
      employeeId: claim.employeeId || claim.employee_id || employeeId,
      department_id: claim.department_id || departmentId,
      claim_type: claim.claim_type || "",
      transport_type: claim.transport_type || "",
      transport_amount: claim.transport_amount || "",
      da: claim.da || "",
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
      no_of_days: claim.no_of_days || "",
      total_amount: claim.total_amount || "",
      meal_type: claim.meal_type || "",
      stationary: claim.stationary || "",
      service_provider: claim.service_provider || "",
      project: claim.project || "",
      attachments: attach,
      invoices: existingInvoices,
    });
    setSelectedFiles(
      (attach || []).map((a) => a.file_name || a.name).filter(Boolean)
    );
  };

  const getParticipantNamesForClaim = (claim = {}) => {
    const part = claim.participants || claim.participant_ids || [];
    if (!part || (Array.isArray(part) && part.length === 0)) {
      if (
        String(claim.employee_id) === String(employeeId) ||
        String(claim.employeeId) === String(employeeId)
      )
        return "You";
      return "-";
    }
    const ids = part.map((p) =>
      typeof p === "object" ? p.employee_id || p.id || p.employeeId : p
    );
    const names = ids.map((id) => {
      const found = employeeOptions.find(
        (e) =>
          String(e.employee_id) === String(id) || String(e.id) === String(id)
      );
      if (found) return found.name;
      if (String(id) === String(employeeId)) return "You";
      return String(id);
    });
    return names.join(", ");
  };

  const normalizeFilename = (fileName) =>
    fileName ? encodeURIComponent(fileName) : null;

  const tryExtractYearMonthFromPath = (filePath) => {
    if (!filePath) return {};
    const p = filePath.replace(/\\/g, "/");
    const m = p.match(/\/reimbursement\/(\d{4})\/(\d{2})\/([^/]+)\/([^/]+)$/);
    if (m) return { year: m[1], month: m[2], empId: m[3], filename: m[4] };
    const parts = p.split("/").filter(Boolean);
    if (parts.length >= 4) {
      const filename = parts[parts.length - 1];
      const empId = parts[parts.length - 2];
      const month = parts[parts.length - 3];
      const year = parts[parts.length - 4];
      const okYear = year && /^\d{4}$/.test(year) ? year : null;
      const okMonth = month && /^\d{2}$/.test(month) ? month : null;
      return { year: okYear, month: okMonth, empId: empId || null, filename };
    }
    return {};
  };

  const buildBackendAttachmentUrl = (year, month, empId, filename) => {
    if (!BACKEND) return null;
    if (!year || !month || !empId || !filename) return null;
    return `${BACKEND}/reimbursement/${year}/${month}/${empId}/${normalizeFilename(
      filename
    )}`;
  };

  const handleOpenAttachments = async (files = [], claim = {}) => {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        showAlert("No attachments available for this claim.");
        return;
      }

      const possible = await Promise.all(
        files.map(async (f) => {
          try {
            const fileName = f.file_name || f.filename || f.name;
            let year, month, empId, filename;
            if (f.file_path) {
              const meta = tryExtractYearMonthFromPath(f.file_path);
              year = meta.year;
              month = meta.month;
              empId = meta.empId;
              filename = meta.filename || fileName;
            }
            empId = empId || claim.employee_id || claim.employeeId || "";
            if (!year || !month) {
              const m2 = fileName && fileName.match(/^(\d{4})[-_](\d{2})/);
              if (m2) {
                year = year || m2[1];
                month = month || m2[2];
                filename = filename || fileName;
              }
            }
            filename = filename || fileName;
            let urlToFetch = null;
            if (year && month && empId && filename)
              urlToFetch = buildBackendAttachmentUrl(
                year,
                month,
                empId,
                filename
              );
            else if (f.url) urlToFetch = f.url;
            else if (filename && empId)
              urlToFetch = `${BACKEND}/reimbursement/${empId}/${normalizeFilename(
                filename
              )}`;
            if (!urlToFetch) return null;
            const resp = await axios.get(urlToFetch, {
              responseType: "blob",
              withCredentials: true,
              headers: buildHeaders(),
            });
            const blob = new Blob([resp.data], {
              type: resp.headers["content-type"] || undefined,
            });
            return { name: filename, url: URL.createObjectURL(blob) };
          } catch (err) {
            console.warn("attachment fetch failed for", f, err?.message || err);
            return null;
          }
        })
      );

      const mapped = possible.filter(Boolean);
      if (!mapped.length) {
        showAlert(
          "No attachments could be loaded (files may be missing on server)."
        );
        return;
      }
      setAttachmentViewerFiles(mapped);
      setAttachmentViewerTitle(`${claim.claim_type || "Claim"} Bills`);
      setIsAttachmentsOpen(true);
    } catch (err) {
      console.error("Error opening attachments:", err);
      showAlert("Could not load attachments. Please try again.");
    }
  };

  const parseInvoicesFromClaim = (claim) => {
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
    if (!Array.isArray(invs)) invs = invs ? [String(invs)] : [];
    return invs.map((i) => (i || "").toString().trim()).filter(Boolean);
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

    const rawInvoices =
      formData.invoices && Array.isArray(formData.invoices)
        ? formData.invoices
        : formData.invoices
        ? [formData.invoices]
        : [];
    const cleanedInvoices = (rawInvoices || [])
      .map((i) => (i || "").toString().trim())
      .filter(Boolean);

    if (!cleanedInvoices.length) {
      showAlert(
        "Invoice / Bill Number is required. Please add at least one invoice (marked *)."
      );
      setSubmitErrorMessage("Invoice number required.");
      return;
    }

    const dupeLocal = cleanedInvoices.find(
      (v, idx) => cleanedInvoices.indexOf(v) !== idx
    );
    if (dupeLocal) {
      showAlert(`Duplicate invoice number in form: "${dupeLocal}"`);
      setSubmitErrorMessage(`Duplicate invoice "${dupeLocal}" in the form.`);
      return;
    }

    const existingMap = {};
    (reimbursements || []).forEach((claim) => {
      if (!claim || !claim.id) return;
      if (editingId && String(claim.id) === String(editingId)) return;
      const invs = parseInvoicesFromClaim(claim);
      invs.forEach((inv) => {
        const key = inv.toLowerCase();
        if (!existingMap[key]) existingMap[key] = claim.id;
      });
    });

    for (const inv of cleanedInvoices) {
      const key = inv.toLowerCase();
      if (existingMap[key]) {
        showAlert(
          `Duplicate invoice detected: "${inv}" is already used in reimbursement ID ${existingMap[key]}. Please verify and use a unique invoice number.`
        );
        setSubmitErrorMessage(
          `Duplicate invoice "${inv}" found in claim ${existingMap[key]}.`
        );
        return;
      }
    }

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((k) => {
        if (k === "attachments") return;
        const val = formData[k];
        if (val !== undefined && val !== null && k !== "invoices")
          fd.append(k, val);
      });

      if (cleanedInvoices && cleanedInvoices.length) {
        fd.append("invoices", JSON.stringify(cleanedInvoices));
      }

      if (participants && participants.length)
        fd.append("participants", JSON.stringify(participants));
      fd.append("role", role || "Employee");
      if (formData.attachments && formData.attachments.length)
        formData.attachments.forEach((file) => fd.append("attachments", file));

      const cfg = {
        withCredentials: true,
        headers: { ...buildHeaders(), "Content-Type": "multipart/form-data" },
      };
      let res;
      if (editingId) {
        res = await axios.put(
          `${
            BACKEND || process.env.REACT_APP_BACKEND_URL
          }/reimbursement/${editingId}`,
          fd,
          cfg
        );
      } else {
        res = await axios.post(
          `${BACKEND || process.env.REACT_APP_BACKEND_URL}/reimbursement`,
          fd,
          cfg
        );
      }

      showAlert(res?.data?.message || "Reimbursement submitted successfully!");
      setShowForm(false);
      setEditingId(null);
      setParticipants(employeeId ? [employeeId] : []);
      setParticipantMode("single");
      setFormData((p) => ({
        ...p,
        claim_type: "",
        transport_type: "",
        purpose: "",
        attachments: null,
        total_amount: "",
        invoices: [],
      }));
      setSelectedFiles([]);
      fetchReimbursements();
    } catch (err) {
      console.error("Error submitting:", err);
      const msg = extractErrorMessage(err);
      setSubmitErrorMessage(msg);
      showAlert(msg);
    }
  };

  const deleteReimbursement = async (id) => {
    if (!id) return;
    try {
      const res = await axios.delete(
        `${BACKEND || process.env.REACT_APP_BACKEND_URL}/reimbursement/${id}`,
        { withCredentials: true, headers: buildHeaders() }
      );
      showAlert(res.data.message || "Deleted");
      fetchReimbursements();
    } catch (err) {
      console.error("Delete error:", err);
      const msg = extractErrorMessage(err, "Unable to delete reimbursement.");
      showAlert(msg);
    }
  };

  const handleConfirmDelete = async () => {
    const id = confirmModal.id;
    closeConfirmDelete();
    if (!id) return;
    await deleteReimbursement(id);
  };

  const onParticipantSelectionChange = (value) => {
    if (participantMode === "single") {
      if (!value) setParticipants([]);
      else {
        const id =
          value.employee_id || value.id || value.employeeId || value.empId;
        setParticipants(id ? [id] : []);
      }
    } else {
      if (!Array.isArray(value)) setParticipants([]);
      else {
        const ids = value
          .map((v) => v.employee_id || v.id || v.employeeId || v.empId)
          .filter(Boolean);
        setParticipants(ids);
      }
    }
  };

  const renderSingleTile = () => {
    const selfOpt = employeeOptions.find(
      (e) =>
        String(e.employee_id) === String(employeeId) ||
        String(e.id) === String(employeeId)
    );
    const displayName = selfOpt ? selfOpt.name : "You";
    const isSelected =
      participants &&
      participants.length &&
      String(participants[0]) === String(employeeId);
    return (
      <div
        className={`ps-item ${isSelected ? "selected" : ""}`}
        role="option"
        aria-selected={isSelected}
        onClick={() => {
          setParticipants([employeeId]);
        }}
      >
        <div className="ps-item-top">
          <div className="ps-item-name">{displayName}</div>
          <div className="ps-item-id">{employeeId}</div>
        </div>
        <div className={`ps-item-action ${isSelected ? "sel" : ""}`}>
          {isSelected ? "Selected" : "Click to select (Self)"}
        </div>
      </div>
    );
  };

  const formatDisplayDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw instanceof Date ? raw : new Date(raw);
    if (isNaN(d)) return raw;
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filterClaims = filteredReimbursements || [];
  const totalAmount = (filteredReimbursements || []).reduce(
    (s, c) => s + (parseFloat(c.total_amount) || 0),
    0
  );
  const approvedAmount = (filteredReimbursements || [])
    .filter((c) => (c.status || "").toLowerCase() === "approved")
    .reduce((s, c) => s + (parseFloat(c.total_amount) || 0), 0);
  const rejectedAmount = (filteredReimbursements || [])
    .filter((c) => (c.status || "").toLowerCase() === "rejected")
    .reduce((s, c) => s + (parseFloat(c.total_amount) || 0), 0);

  const shouldShowParticipantControls = () => {
    if (!formData.claim_type) return false;
    if (formData.claim_type === "Transportation")
      return !!formData.transport_type;
    if (
      formData.claim_type === "Meals" ||
      formData.claim_type === "Miscellaneous"
    )
      return true;
    return false;
  };

  return (
    <div className="reimbursement-container">
      <div className="rb-form-header">
        {role !== "Manager" && role !== "Admin" && (
          <h2>Reimbursement Requests</h2>
        )}
      </div>

      <div className="filter-container">
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

        <button className="search-btn" onClick={applyFilters}>
          <FaSearch /> Search
        </button>

        <button
          className="apply-btn"
          onClick={() => {
            setSubmitErrorMessage("");
            setUpdateErrorMessage("");
            setSelectedFiles([]);
            setShowForm(true);
            setEditingId(null);
            setParticipantMode("single");
            setParticipants(employeeId ? [employeeId] : []);
            setFormData({
              employeeId,
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
              invoices: [],
            });
          }}
        >
          Apply Claim
        </button>
      </div>

      {errorMessage && <p className="rb-error-message">{errorMessage}</p>}

      <div className="reimbursement-table-scroll">
        <table className="reimbursement-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Claim Type</th>
              <th>Participants</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Invoice(s)</th>
              <th>Amount</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterClaims.map((claim, index) => {
              let invs =
                claim.invoices ||
                claim.invoice_numbers ||
                claim.invoice_no ||
                [];
              try {
                if (typeof invs === "string" && invs.trim())
                  invs = JSON.parse(invs);
              } catch (e) {
                if (typeof invs === "string")
                  invs = invs
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                else invs = Array.isArray(invs) ? invs : [];
              }
              const invDisplay =
                Array.isArray(invs) && invs.length ? invs.join(", ") : "-";

              const isPending =
                (claim.status || "").toLowerCase() === "pending";

              const canEdit = isPending;
              const canDelete = isPending;

              return (
                <tr key={claim.id}>
                  <td>{index + 1}</td>
                  <td>{claim.claim_type}</td>
                  <td
                    className="participants-cell"
                    title={getParticipantNamesForClaim(claim)}
                  >
                    {getParticipantNamesForClaim(claim)}
                  </td>
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
                    <div className="rbadmin-comments">{claim.purpose}</div>
                  </td>
                  <td className="invoice-cell" title={invDisplay}>
                    {invDisplay}
                  </td>
                  <td>{claim.total_amount}</td>
                  <td>
                    {attachments[claim.id]?.length > 0 ? (
                      <button
                        className="attachments-btn"
                        onClick={() =>
                          handleOpenAttachments(attachments[claim.id], claim)
                        }
                      >
                        <MdOutlineRemoveRedEye className="eye-icon" /> View
                      </button>
                    ) : (
                      "Not Attached"
                    )}
                  </td>
                  <td>
                    <span
                      className={`rb-status-label ${
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
                    <div className="rbadmin-comments">
                      {claim.approver_comments || "No comments"}
                    </div>
                  </td>
                  <td>{claim.payment_status}</td>
                  <td className="rb-actions-column">
                    <button
                      className={`icons-btn ${!canEdit ? "disabled-icon" : ""}`}
                      aria-disabled={!canEdit}
                      disabled={!canEdit}
                      onClick={() => {
                        if (!canEdit) return;
                        handleEdit(claim);
                        setShowForm(true);
                      }}
                      title={canEdit ? "Edit" : "Cannot edit"}
                      aria-label={`Edit reimbursement ${claim.id}`}
                    >
                      <MdOutlineEdit className="md-edit" />
                    </button>

                    <button
                      className={`icons-btn ${
                        !canDelete ? "disabled-icon" : ""
                      }`}
                      aria-disabled={!canDelete}
                      disabled={!canDelete}
                      onClick={() => {
                        if (!canDelete) return;
                        openConfirmDelete(claim.id, claim);
                      }}
                      title={canDelete ? "Delete" : "Cannot delete"}
                      aria-label={`Delete reimbursement ${claim.id}`}
                    >
                      <MdDeleteOutline className="md-delete" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="5" className="total-left">
                Total Amount Claiming:{" "}
                <span className="total-amount">Rs {totalAmount}</span>
              </td>
              <td colSpan="3" className="total-right">
                Amount Approved: Rs{" "}
                <span className="total-amount">{approvedAmount}</span>
              </td>
              <td colSpan="3" className="total-right">
                Amount Rejected: Rs{" "}
                <span className="total-amount">{rejectedAmount}</span>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="rb-reimbursement-cards">
          {filterClaims.map((claim, idx) => {
            let invs =
              claim.invoices || claim.invoice_numbers || claim.invoice_no || [];
            try {
              if (typeof invs === "string" && invs.trim())
                invs = JSON.parse(invs);
            } catch (e) {
              if (typeof invs === "string")
                invs = invs
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
              else invs = Array.isArray(invs) ? invs : [];
            }
            const invDisplay =
              Array.isArray(invs) && invs.length ? invs.join(", ") : "-";

            const isPending = (claim.status || "").toLowerCase() === "pending";

            const canEdit = isPending;
            const canDelete = isPending;

            return (
              <div className="rb-reimbursement-card" key={claim.id}>
                <div className="rb-card-header">
                  <span className={`rb-status ${claim.status?.toLowerCase()}`}>
                    {claim.status}
                  </span>
                </div>
                <div className="rb-card-body">
                  <p>
                    <strong>Sl No:</strong> {idx + 1}
                  </p>
                  <p>
                    <strong>Claim Type:</strong> {claim.claim_type}
                  </p>
                  <p>
                    <strong>Participants:</strong>{" "}
                    {getParticipantNamesForClaim(claim)}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {claim.date ? formatDisplayDate(claim.date) : "N/A"}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {claim.purpose}
                  </p>
                  <p>
                    <strong>Invoice(s):</strong> {invDisplay}
                  </p>
                  <p>
                    <strong>Amount:</strong> Rs {claim.total_amount}
                  </p>
                </div>
                <div className="rb-card-footer">
                  {attachments[claim.id]?.length > 0 ? (
                    <button
                      className="rb-attachments-btn"
                      onClick={() =>
                        handleOpenAttachments(attachments[claim.id], claim)
                      }
                    >
                      <MdOutlineRemoveRedEye className="rb-eye-icon" /> View
                    </button>
                  ) : (
                    <span className="rb-no-attachment">No Attachment</span>
                  )}

                  <div className="rb-card-actions">
                    <button
                      className={`rb-icons-btn ${
                        !canEdit ? "disabled-icon" : ""
                      }`}
                      disabled={!canEdit}
                      aria-disabled={!canEdit}
                      onClick={() => {
                        if (!canEdit) return;
                        handleEdit(claim);
                        setShowForm(true);
                      }}
                      title={canEdit ? "Edit" : "Cannot edit"}
                      aria-label={`Edit reimbursement ${claim.id}`}
                    >
                      <MdOutlineEdit className="rb-edit-icon md-edit" />
                    </button>

                    <button
                      className={`rb-icons-btn ${
                        !canDelete ? "disabled-icon" : ""
                      }`}
                      disabled={!canDelete}
                      aria-disabled={!canDelete}
                      onClick={() => {
                        if (!canDelete) return;
                        openConfirmDelete(claim.id, claim);
                      }}
                      title={canDelete ? "Delete" : "Cannot delete"}
                      aria-label={`Delete reimbursement ${claim.id}`}
                    >
                      <MdDeleteOutline className="rb-delete-icon md-delete" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <ReimbursementForm
          projects={projects}
          claimTypes={claimTypes}
          handleClaimTypeChange={handleClaimTypeChange}
          formData={formData}
          handleChange={handleChange}
          shouldShowParticipantControls={shouldShowParticipantControls}
          participantMode={participantMode}
          setParticipantMode={setParticipantMode}
          renderSingleTile={renderSingleTile}
          onParticipantSelectionChange={onParticipantSelectionChange}
          employeeOptions={employeeOptions}
          handleFileUpload={handleFileUpload}
          handleTransportSubTypeChange={handleTransportSubTypeChange}
          handleNoOfDaysChange={handleNoOfDaysChange}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleSubmit={handleSubmit}
          editingId={editingId}
          setEditingId={setEditingId}
          setShowForm={setShowForm}
          setParticipants={setParticipants}
          setFormData={setFormData}
        />
      )}

      <AttachmentsModal
        isOpen={isAttachmentsOpen}
        title={attachmentViewerTitle}
        files={attachmentViewerFiles}
        onClose={() => setIsAttachmentsOpen(false)}
      />

      <Modal
        isVisible={confirmModal.isVisible}
        onClose={closeConfirmDelete}
        buttons={[
          { label: "Cancel", onClick: closeConfirmDelete },
          { label: "Yes, Delete", onClick: handleConfirmDelete },
        ]}
      >
        <h3>{confirmModal.title}</h3>
        <p>{confirmModal.message}</p>
      </Modal>

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <h3>{alertModal.title}</h3>
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default Reimbursement;
