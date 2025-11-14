// src/components/ReportPanel.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MdFileDownload,
  MdPictureAsPdf,
  MdDateRange,
  MdOutlineAssessment,
} from "react-icons/md";
import "./ReportPanel.css";
import Modal from "../Modal/Modal";
import EmployeeTypeahead from "./EmployeeTypeahead";
import FieldsGrid from "./FieldsGrid";
import Pagination from "./Pagination";
import { getApiBase } from "./ReportUtils";
import {
  STATUS_OPTIONS,
  SUB_OPTIONS,
  MAX_DOWNLOAD_FIELDS,
  PREVIEW_PAGE_SIZE,
  MAX_RANGE_DAYS,
} from "./ReportConstants";

/**
 * Try to extract a plain employee id from localStorage dashboardData.
 * Handles cases where dashboardData is a JSON string or a plain id or contains an STSxxx id.
 */
function extractEmployeeIdFromLocalStorage() {
  try {
    const raw = localStorage.getItem("dashboardData");
    if (!raw) return null;
    const trimmed = String(raw).trim();

    // If it looks like JSON, parse and extract common keys
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const obj = JSON.parse(trimmed);
        return (
          obj.employeeId ||
          obj.employee_id ||
          obj.employee ||
          obj.id ||
          // some payloads use camelCase or different keys
          obj.employeeId ||
          null
        );
      } catch (e) {
        // fall through to pattern match
      }
    }

    // Try to parse even if not starting with { (defensive)
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        return (
          parsed.employeeId ||
          parsed.employee_id ||
          parsed.employee ||
          parsed.id ||
          null
        );
      }
    } catch (e) {
      // ignore
    }

    // If the string contains an STS-style id, extract it
    const m = trimmed.match(/(STS[0-9A-Za-z-_]+)/);
    if (m) return m[1];

    // Otherwise assume the stored value is the id itself
    return trimmed;
  } catch (e) {
    // fallback to raw value if anything goes wrong
    return localStorage.getItem("dashboardData") || null;
  }
}

const inferUserRoleAndDepartment = () => {
  try {
    const tryKeys = (keys) => {
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (!v) continue;
        // If it looks like JSON, parse it and try to extract fields
        if (v.trim().startsWith("{")) {
          try {
            const obj = JSON.parse(v);
            if (!obj) continue;
            // Common fields
            const role =
              obj.role ||
              obj.userRole ||
              obj.roleName ||
              obj.employee_role ||
              obj.accessLevel ||
              obj.type;
            const dept =
              obj.department_id ||
              obj.departmentId ||
              obj.deptId ||
              obj.department ||
              obj.department_id;
            if (role || dept) return { role, departmentId: dept ?? null };
          } catch (e) {
            // ignore parse error
          }
        } else {
          // Plain string keys
          // e.g. "Manager", "Supervisor", "dept_12", "12"
          if (
            ["manager", "supervisor", "team lead", "teamlead", "lead"].some(
              (s) => v.toLowerCase().includes(s)
            )
          ) {
            return { role: v, departmentId: null };
          }
          // numeric department id?
          if (/^\d+$/.test(v.trim())) {
            // ambiguous: treat as department id only
            return { role: null, departmentId: v.trim() };
          }
        }
      }
    };

    const singleKeys = [
      "dashboardRole",
      "dashboard_role",
      "role",
      "userRole",
      "employee_role",
      "roleName",
      "userProfile",
      "profile",
      "user",
      "dashboardDataRole",
    ];
    const singleTry = tryKeys(singleKeys);
    if (singleTry) {
      return singleTry;
    }

    const multiKeys = [
      "userProfile",
      "profile",
      "user",
      "dashboardData",
      "dashboardUser",
      "authUser",
    ];
    const multiTry = tryKeys(multiKeys);
    if (multiTry) return multiTry;
  } catch (e) {}
  return { role: null, departmentId: null };
};

function formatDateLocal(d) {
  if (!d || !(d instanceof Date)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function inferManagerDeptFromDepartmentsArray(deptRows, employeeId) {
  if (!Array.isArray(deptRows) || !employeeId) return null;
  for (const d of deptRows) {
    const mgrCandidates = [
      d.manager_employee_id,
      d.managerId,
      d.manager_employeeid,
      d.manager_employee,
      d.manager_id,
      d.manager,
    ];
    for (const mgr of mgrCandidates) {
      if (!mgr) continue;
      const mgrId =
        typeof mgr === "object"
          ? mgr.employee_id || mgr.id || mgr.manager_employee_id || null
          : mgr;
      if (mgrId && String(mgrId) === String(employeeId)) {
        const id = d.department_id ?? d.id ?? d.departmentId ?? d._id ?? null;
        if (id) return String(id);
        break;
      }
    }

    if (Array.isArray(d.employees) && d.employees.length) {
      const foundMem = d.employees.find((m) => {
        const mid = m.employee_id ?? m.id ?? m._id ?? null;
        if (!mid) return false;
        return String(mid) === String(employeeId);
      });
      if (foundMem) {
        const id = d.department_id ?? d.id ?? d.departmentId ?? d._id ?? null;
        if (id) return String(id);
      }
    }

    // nested manager object
    if (d.manager && typeof d.manager === "object") {
      const nestedMgrId =
        d.manager.employee_id ||
        d.manager.id ||
        (d.manager.employee &&
          (d.manager.employee.id || d.manager.employee.employee_id));
      if (nestedMgrId && String(nestedMgrId) === String(employeeId)) {
        const id = d.department_id ?? d.id ?? d.departmentId ?? d._id ?? null;
        if (id) return String(id);
      }
    }
  }
  return null;
}

export default function ReportPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [component, setComponent] = useState("select");
  const [status, setStatus] = useState("All");
  const [statusOptions, setStatusOptions] = useState([]);
  const [downloadingXlsx, setDownloadingXlsx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewRows, setPreviewRows] = useState([]);
  const [previewTotalRows, setPreviewTotalRows] = useState(null);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewMessage, setPreviewMessage] = useState("");

  const employeeId = extractEmployeeIdFromLocalStorage();

  const inferred = inferUserRoleAndDepartment();
  const [userRole] = useState(
    (inferred.role && String(inferred.role).trim()) || null
  );
  const [managerDepartmentIdRaw] = useState(
    inferred.departmentId ? String(inferred.departmentId) : null
  );

  const isTeamRole = Boolean(
    userRole &&
      String(userRole).toLowerCase &&
      ["manager", "supervisor", "team lead", "teamlead", "lead"].some((s) =>
        String(userRole).toLowerCase().includes(s)
      )
  );

  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [filterEmployeeName, setFilterEmployeeName] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState(null);
  const [isTypingSearch, setIsTypingSearch] = useState(false);

  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (isTeamRole && managerDepartmentIdRaw) {
      setFilterDepartmentId(managerDepartmentIdRaw);
    }
  }, [isTeamRole, managerDepartmentIdRaw]);

  const showAlert = (message, title = "") => {
    setPreviewOpen(false);
    setTimeout(() => {
      setAlertModal({ isVisible: true, title: title || "", message });
    }, 80);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const getErrorMessageFromAxiosError = useCallback(async (err) => {
    try {
      if (!err || !err.response) {
        if (err && err.message) return err.message;
        return "Unknown error from server";
      }
      const { status, data } = err.response;
      if (data === null || typeof data === "undefined") {
        return `Server responded with status ${status}`;
      }
      if (typeof data === "object" && !(data instanceof Blob)) {
        const candidate =
          data.message || data.error || data.msg || data.detail || null;
        if (candidate && typeof candidate === "string" && candidate.trim())
          return candidate;
        try {
          const s = JSON.stringify(data);
          return s.length > 0 ? s : `Server responded with status ${status}`;
        } catch (e) {
          return `Server responded with status ${status}`;
        }
      }
      let text = null;
      if (data instanceof Blob && typeof data.text === "function") {
        text = await data.text();
      } else if (typeof data === "string") {
        text = data;
      }
      if (!text || !text.trim()) {
        return `Server responded with status ${status}`;
      }
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object") {
          return (
            parsed.message ||
            parsed.error ||
            parsed.msg ||
            parsed.detail ||
            JSON.stringify(parsed)
          );
        }
      } catch (e) {
        const t = text.trim();
        return t.length > 500 ? t.slice(0, 500) + "..." : t;
      }
      return `Server responded with status ${status}`;
    } catch (e) {
      return err && err.message ? err.message : "Server error";
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setDeptLoading(true);
    const base = getApiBase();
    axios
      .get(`${base}/api/report/departments`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY || "",
          "x-employee-id": employeeId || "",
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (!mounted) return;
        const data = res && res.data ? res.data : [];
        let rows = [];
        if (Array.isArray(data)) rows = data;
        else if (Array.isArray(data.departments)) rows = data.departments;
        else if (Array.isArray(data.results)) rows = data.results;
        else if (Array.isArray(data.data)) rows = data.data;
        else rows = [];
        setDepartments(rows);

        if (
          isTeamRole &&
          !managerDepartmentIdRaw &&
          employeeId &&
          rows.length
        ) {
          const inferredId = inferManagerDeptFromDepartmentsArray(
            rows,
            employeeId
          );
          if (inferredId) {
            setFilterDepartmentId(String(inferredId));
          } else {
            const found = rows.find((d) => {
              const mgr =
                d.manager_employee_id ??
                d.managerId ??
                d.manager_employeeid ??
                d.manager_employee;
              if (!mgr) return false;
              return String(mgr) === String(employeeId);
            });
            if (found) {
              const id =
                found.department_id ?? found.id ?? found.departmentId ?? null;
              if (id) setFilterDepartmentId(String(id));
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch departments:", err);
        setDepartments([]);
      })
      .finally(() => {
        if (mounted) setDeptLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [employeeId, isTeamRole, managerDepartmentIdRaw]);

  useEffect(() => {
    if (!component || component === "select") {
      setStatusOptions([]);
      setStatus("All");
      setAvailableFields([]);
      setSelectedFields([]);
      setPreviewOpen(false);
      setPreviewRows([]);
      setPreviewError("");
      setPreviewMessage("");
      setFilterEmployeeId(null);
      setFilterEmployeeName("");
      if (!isTeamRole) setFilterDepartmentId(null);
      setIsTypingSearch(false);
      return;
    }

    setStatusOptions(STATUS_OPTIONS[component] || ["All"]);
    setStatus("All");

    const subs = SUB_OPTIONS[component] || [];
    let subsFiltered = subs;
    if (component === "vendors") {
      subsFiltered = subs.filter(
        (s) =>
          s.key !== "employee_name" &&
          s.key !== "department_name" &&
          s.key !== "department_id"
      );
      setFilterEmployeeId(null);
      setFilterEmployeeName("");
      setFilterDepartmentId(null);
    }

    setAvailableFields(subsFiltered);
    setSelectedFields(subsFiltered.map((s) => s.key));
    setPreviewOpen(false);
    setPreviewRows([]);
    setPreviewError("");
    setPreviewMessage("");

    if (
      isTeamRole &&
      (component === "attendance" || component === "employees")
    ) {
      if (managerDepartmentIdRaw) {
        setFilterDepartmentId(managerDepartmentIdRaw);
      } else {
        const inferredId = inferManagerDeptFromDepartmentsArray(
          departments,
          employeeId
        );
        if (inferredId) setFilterDepartmentId(inferredId);
      }
    } else if (!isTeamRole) {
      setFilterDepartmentId(null);
    }

    if (component !== "vendors") {
      setFilterEmployeeId(null);
      setFilterEmployeeName("");
    }
    setIsTypingSearch(false);
  }, [component, isTeamRole, managerDepartmentIdRaw]);

  const presetRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    // use local formatter to avoid UTC shift
    setStartDate(formatDateLocal(start));
    setEndDate(formatDateLocal(end));
  };
  const thisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // use local formatter to avoid UTC shift
    setStartDate(formatDateLocal(start));
    setEndDate(formatDateLocal(end));
  };

  const validateDates = () => {
    if (!startDate && !endDate) return true;
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (s > e) {
        showAlert("Start date cannot be after End date.");
        return false;
      }
      const diffMs = e.getTime() - s.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      if (days > MAX_RANGE_DAYS) {
        showAlert(
          `Selected range is ${days} days. Maximum allowed is ${MAX_RANGE_DAYS} days (≈ 2 months).`
        );
        return false;
      }
      return true;
    }
    showAlert(
      "Please provide both Start Date and End Date, or leave both empty to use the default last 2 months range."
    );
    return false;
  };

  const toggleField = (key) =>
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  const selectAllFields = () => {
    if (!availableFields || availableFields.length === 0) return;
    setSelectedFields(availableFields.map((s) => s.key));
  };
  const clearAllFields = () => setSelectedFields([]);
  const allSelected =
    availableFields.length > 0 &&
    selectedFields.length === availableFields.length;
  const someSelected =
    selectedFields.length > 0 && selectedFields.length < availableFields.length;

  const getEndpointForComponent = (comp) => {
    if (!comp || comp === "select") return null;
    if (comp === "tasks_supervisor") return "tasks/supervisor";
    if (comp === "tasks_employee") return "tasks/employee";
    return comp;
  };

  // compute an effective manager dept id to use everywhere (typeahead + buildParams)
  const effectiveManagerDepartmentId = (() => {
    // priority: explicit user selection > filterDepartmentId state > managerDepartmentIdRaw > infer from departments
    if (!isTeamRole) return filterDepartmentId;
    return (
      filterDepartmentId ||
      managerDepartmentIdRaw ||
      inferManagerDeptFromDepartmentsArray(departments, employeeId) ||
      null
    );
  })();

  const onTypeStart = useCallback((typing) => setIsTypingSearch(typing), []);
  const onEmployeeSelect = useCallback((item) => {
    setFilterEmployeeId(item.employee_id || item.id || null);
    setFilterEmployeeName(item.employee_name || item.name || item.email || "");
    if (item.department_id) setFilterDepartmentId(item.department_id);
    setIsTypingSearch(false);
  }, []);
  const onEmployeeClear = useCallback(() => {
    setFilterEmployeeId(null);
    setFilterEmployeeName("");
  }, []);
  const onDepartmentChange = useCallback((ev) => {
    const val = ev.target.value;
    const v = val === "" ? null : val;
    setFilterDepartmentId(v);
    setFilterEmployeeId(null);
    setFilterEmployeeName("");
  }, []);
  const onDepartmentSelectFromDropdown = useCallback((dept) => {
    setFilterDepartmentId(dept ? String(dept.department_id) : null);
    setFilterEmployeeId(null);
    setFilterEmployeeName("");
  }, []);

  const buildParams = ({ includeFormat = false, preview = false } = {}) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const st =
      status === undefined || status === null ? "" : String(status).trim();
    params.append("status", st);

    // Add preview flag early (so server sees it's a preview)
    if (preview) params.append("preview", "true");

    // SAFETY: For preview requests we intentionally DO NOT send 'fields' to avoid huge query strings.
    // For downloads, we send fields but cap the number of fields included for transport.
    const MAX_CLIENT_FIELDS_SEND = 60; // change if you want to allow more fields to be sent
    if (!preview) {
      if (selectedFields && selectedFields.length > 0) {
        let fieldsToSend = selectedFields;
        if (selectedFields.length > MAX_CLIENT_FIELDS_SEND) {
          console.warn(
            `[ReportPanel] selectedFields length (${selectedFields.length}) exceeds MAX_CLIENT_FIELDS_SEND (${MAX_CLIENT_FIELDS_SEND}). Truncating for network transport.`
          );
          fieldsToSend = selectedFields.slice(0, MAX_CLIENT_FIELDS_SEND);
        }
        params.append("fields", fieldsToSend.join(","));
      }
    }

    // IMPORTANT: For vendors we must NOT send employee/department scoping.
    if (component !== "vendors") {
      if (filterEmployeeId) params.append("employee_id", filterEmployeeId);

      // Always try to include manager's department for team roles using the effective id
      if (isTeamRole) {
        const deptToSend = effectiveManagerDepartmentId || "";
        if (deptToSend) params.append("department_id", deptToSend);
      } else {
        if (filterDepartmentId)
          params.append("department_id", filterDepartmentId);
      }
    }

    if (includeFormat) params.append("format", "xlsx");
    return params.toString();
  };

  const validateSelection = () => {
    if (!component || component === "select") {
      showAlert("Please select a component first.");
      return false;
    }
    if (!selectedFields || selectedFields.length === 0) {
      showAlert("Please select at least one field to proceed.");
      return false;
    }
    return true;
  };

  const ensureClientDownloadFieldLimit = (format) => {
    if (!selectedFields || !Array.isArray(selectedFields)) return true;
    const fmt = (format || "").toLowerCase();
    if (
      (fmt === "pdf" || fmt === "xlsx") &&
      selectedFields.length > MAX_DOWNLOAD_FIELDS
    ) {
      showAlert(
        `You have selected ${selectedFields.length} fields. Downloads (PDF/XLSX) are limited to ${MAX_DOWNLOAD_FIELDS} fields. Please reduce your selection or use Preview.`
      );
      return false;
    }
    return true;
  };

  const download = async (format) => {
    if (!validateDates()) return;
    if (!validateSelection()) return;
    if (!ensureClientDownloadFieldLimit(format)) return;
    const isPdf = format === "pdf";
    if (isPdf) setDownloadingPdf(true);
    else setDownloadingXlsx(true);

    try {
      const base = getApiBase();
      const endpoint = getEndpointForComponent(component);
      if (!endpoint) {
        showAlert("Invalid component selected");
        return;
      }

      // build params for download — we include a capped fields list for transport
      const paramString = buildParams({ includeFormat: false, preview: false });

      // debug log to confirm department id sent
      console.debug(
        "[ReportPanel] download -> effectiveManagerDepartmentId:",
        effectiveManagerDepartmentId
      );
      console.debug("[ReportPanel] download -> paramString:", paramString);

      // attach format explicitly (keeps previous behavior)
      const url = `${base}/api/report/${endpoint}?${paramString}${
        paramString ? "&" : ""
      }format=${encodeURIComponent(format)}`;

      let acceptHeader = "*/*";
      if (isPdf) acceptHeader = "application/pdf";
      else
        acceptHeader =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const res = await axios.get(url, {
        responseType: "blob",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY || "",
          "x-employee-id": employeeId || "",
          Accept: acceptHeader,
        },
        timeout: 2 * 60 * 1000,
      });

      const contentType = res.headers["content-type"] || "";
      const isJson =
        contentType.includes("application/json") ||
        contentType.includes("text/plain");
      if (isJson) {
        let text = "";
        try {
          text = await res.data.text();
        } catch (e) {
          text = "(unable to read response body)";
        }
        let parsedMsg = null;
        try {
          const parsed = JSON.parse(text || "{}");
          parsedMsg = parsed.message || parsed.error || parsed.msg || text;
        } catch (e) {
          parsedMsg = text || `Server responded with status ${res.status}`;
        }
        console.error("Server returned JSON/text instead of file:", parsedMsg);
        showAlert(parsedMsg);
        return;
      }

      let filename = `${component}_report.${isPdf ? "pdf" : "xlsx"}`;
      const disposition = res.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Report download error:", err);
      const msg = await getErrorMessageFromAxiosError(err);
      showAlert(msg);
    } finally {
      if (isPdf) setDownloadingPdf(false);
      else setDownloadingXlsx(false);
    }
  };

  const fetchPreview = async () => {
    try {
      if (!validateDates()) return;
      if (!validateSelection()) return;

      setPreviewError("");
      setPreviewLoading(true);
      setPreviewRows([]);
      setPreviewTotalRows(null);
      setPreviewPage(1);
      setPreviewOpen(true);
      setPreviewMessage("");

      const base = getApiBase();
      const endpoint = getEndpointForComponent(component);
      if (!endpoint) {
        showAlert("Invalid component selected");
        return;
      }

      // build params for preview — NOTE: fields are intentionally NOT sent here
      const paramString = buildParams({ preview: true });
      // debug: show the final query string sent to backend
      console.debug(
        "[ReportPanel] preview -> effectiveManagerDepartmentId:",
        effectiveManagerDepartmentId
      );
      console.debug("[ReportPanel] preview -> paramString:", paramString);

      const url = `${base}/api/report/${endpoint}?${paramString}`;

      const res = await axios.get(url, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY || "",
          "x-employee-id": employeeId || "",
          Accept: "application/json",
        },
      });

      let rows = [];
      let total = null;

      if (res.data && Array.isArray(res.data.rows)) {
        rows = res.data.rows;
        total =
          typeof res.data.totalRows === "number"
            ? res.data.totalRows
            : rows.length;
      } else if (Array.isArray(res.data)) {
        rows = res.data;
        total = rows.length;
      } else if (Array.isArray(res.data.results)) {
        rows = res.data.results;
        total =
          typeof res.data.total === "number" ? res.data.total : rows.length;
      } else {
        throw new Error("Preview endpoint returned unexpected shape.");
      }

      const MAX_PREVIEW_ROWS = 200;
      setPreviewRows(rows.slice(0, MAX_PREVIEW_ROWS));
      setPreviewTotalRows((prev) => prev ?? total ?? rows.length);

      if (rows.length === 0) {
        const serverMsg =
          (res.data &&
            typeof res.data.message === "string" &&
            res.data.message) ||
          "No data available for the selected date range (max 2 months). Please change filters.";
        setPreviewMessage(serverMsg);
      } else {
        setPreviewMessage("");
      }

      if (rows.length > MAX_PREVIEW_ROWS) {
        setPreviewError(
          `Preview shows first ${MAX_PREVIEW_ROWS} rows. Server returned ${rows.length} rows.`
        );
      }
    } catch (err) {
      console.error("Preview error:", err);
      const msg = await getErrorMessageFromAxiosError(err);
      setPreviewRows([]);
      setPreviewTotalRows(0);
      setPreviewMessage(msg);
      setPreviewError("");
      setPreviewOpen(true);
    } finally {
      setPreviewLoading(false);
    }
  };

  const keyToLabel = {};
  availableFields.forEach((f) => (keyToLabel[f.key] = f.label));
  const componentIsSelected = component && component !== "select";

  // pagination helpers
  const totalPages = Math.max(
    1,
    Math.ceil((previewRows.length || 0) / PREVIEW_PAGE_SIZE)
  );
  const currentPage = Math.min(Math.max(1, previewPage), totalPages);
  const currentPageData = previewRows.slice(
    (currentPage - 1) * PREVIEW_PAGE_SIZE,
    currentPage * PREVIEW_PAGE_SIZE
  );
  const goToPage = (p) => setPreviewPage(Math.min(Math.max(1, p), totalPages));

  // Adjust component list for team roles: hide vendors and assets for non-admins? (existing behaviour preserved)
  const componentOptions = [
    { value: "leaves", label: "Leaves" },
    { value: "reimbursements", label: "Reimbursements" },
    { value: "employees", label: "Employees" },
    // vendors / assets hidden for team roles
    ...(isTeamRole ? [] : [{ value: "vendors", label: "Vendors" }]),
    ...(isTeamRole ? [] : [{ value: "assets", label: "Assets" }]),
    { value: "attendance", label: "Attendance" },
    { value: "tasks_employee", label: "Tasks (Employee Driven)" },
    { value: "tasks_supervisor", label: "Tasks (Supervisor Driven)" },
  ];

  return (
    <div className="rp-container">
      <header className="rp-header">
        <div className="rp-title">
          <MdOutlineAssessment size={28} />
          <div>
            <h2>Reports</h2>
            <p className="rp-sub">
              Export Leaves, Reimbursements, Employees, Vendors, Assets,
              Attendance, Tasks — Excel and PDF
            </p>
          </div>
        </div>
      </header>

      <section className="rp-card">
        <div className="rp-row">
          <label className="rp-label">Component</label>
          <select
            className="rep-select"
            value={component}
            onChange={(e) => setComponent(e.target.value)}
          >
            <option value="select" disabled>
              Select
            </option>
            {componentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rp-row rp-fields-row">
          <label className="rp-label">Fields</label>
          <div className="rp-fields-wrap">
            <div className="rp-fields-actions">
              <button
                type="button"
                className="rp-chip small"
                onClick={selectAllFields}
                aria-pressed={allSelected}
                title="Select all fields"
                disabled={!componentIsSelected || availableFields.length === 0}
              >
                {allSelected ? "All selected" : "Select all"}
              </button>

              <button
                type="button"
                className="rp-chip small"
                onClick={clearAllFields}
                title="Clear selection"
                disabled={!componentIsSelected || availableFields.length === 0}
              >
                Clear
              </button>

              {!componentIsSelected && (
                <span
                  className="rp-fields-selected-summary"
                  style={{ color: "#9aa4b2" }}
                >
                  Choose a component to see fields
                </span>
              )}
              {someSelected && componentIsSelected && (
                <span className="rp-fields-selected-summary">
                  {selectedFields.length} selected
                </span>
              )}
              {componentIsSelected && (
                <span
                  className="rp-fields-limit-summary"
                  style={{
                    marginLeft: 12,
                    color:
                      selectedFields.length > MAX_DOWNLOAD_FIELDS
                        ? "crimson"
                        : "#666",
                  }}
                >
                  {selectedFields.length} selected (max {MAX_DOWNLOAD_FIELDS}{" "}
                  for downloads)
                </span>
              )}
            </div>

            <FieldsGrid
              availableFields={availableFields}
              selectedFields={selectedFields}
              toggleField={toggleField}
              disabled={!componentIsSelected}
            />
          </div>
        </div>

        {/* Hide the Status control for vendors */}
        {component !== "vendors" && (
          <div className="rp-row">
            <label className="rp-label">Status</label>
            <select
              className="rep-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!componentIsSelected || !statusOptions.length}
            >
              {statusOptions.length === 0 ? (
                <option value="All">—</option>
              ) : (
                statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        <div className="rp-row rp-dates rp-dates-4">
          <div className="rp-date-field">
            <label className="rp-label">Start Date</label>
            <div className="rp-input-with-icon">
              <MdDateRange className="rp-icon" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="rp-date-field">
            <label className="rp-label">End Date</label>
            <div className="rp-input-with-icon">
              <MdDateRange className="rp-icon" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Hide employee typeahead for vendors (vendors should fetch all data) */}
          {component !== "vendors" ? (
            <div className="rp-date-field rp-typeahead-field">
              <label className="rp-label">Employee Name</label>
              <EmployeeTypeahead
                onSelect={onEmployeeSelect}
                onTyping={onTypeStart}
                onClear={onEmployeeClear}
                // Force department scoping for team roles using effectiveManagerDepartmentId
                departmentId={
                  isTeamRole ? effectiveManagerDepartmentId : filterDepartmentId
                }
                limit={10}
                selectedValue={filterEmployeeName}
                isTyping={isTypingSearch}
              />
              <div className="rp-typeahead-subtext">
                {filterEmployeeId ? (
                  <em>Filtering by employee id: {filterEmployeeId}</em>
                ) : (
                  <em>Search by name or email</em>
                )}
              </div>
            </div>
          ) : (
            <div
              className="rp-date-field rp-typeahead-field"
              style={{ alignSelf: "flex-end" }}
            />
          )}

          {/* Department dropdown: hide for Team roles and also hide for vendors */}
          {!isTeamRole && component !== "vendors" ? (
            <div className="rp-date-field rp-typeahead-field">
              <label className="rp-label">Department</label>
              <div>
                <select
                  className="rep-select"
                  value={filterDepartmentId || ""}
                  onChange={onDepartmentChange}
                  disabled={deptLoading}
                  aria-label="Select department"
                  style={{ width: "100%" }}
                >
                  <option value="">All departments</option>
                  {departments.map((d) => {
                    const id = d.department_id ?? d.id ?? d.departmentId ?? "";
                    const name =
                      d.department_name ?? d.name ?? d.departmentName ?? "";
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                {deptLoading && (
                  <div className="rp-typeahead-subtext">
                    Loading departments…
                  </div>
                )}
              </div>
            </div>
          ) : component !== "vendors" ? (
            // preserve layout when team role: empty placeholder (as before)
            <div
              className="rp-date-field rp-typeahead-field"
              style={{ alignSelf: "flex-end" }}
            ></div>
          ) : (
            // vendors: placeholder to keep layout tidy
            <div
              className="rp-date-field rp-typeahead-field"
              style={{ alignSelf: "flex-end" }}
            ></div>
          )}
        </div>

        <div className="rp-presets">
          <button className="rp-chip" onClick={() => presetRange(7)}>
            Last 7 days
          </button>
          <button className="rp-chip" onClick={thisMonth}>
            This month
          </button>
          <button
            className="rp-chip"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear Dates
          </button>
        </div>

        <div className="rp-actions">
          <button
            className="rp-btn preview"
            onClick={fetchPreview}
            disabled={previewLoading || !componentIsSelected}
            title={
              componentIsSelected
                ? "Preview table data"
                : "Select a component first"
            }
          >
            {previewLoading ? <span className="rp-spinner" /> : null}
            <span>{previewOpen ? "Refresh Preview" : "Preview"}</span>
          </button>

          <button
            className="rp-btn excel"
            onClick={() => download("xlsx")}
            disabled={downloadingXlsx || !componentIsSelected}
            title={
              componentIsSelected
                ? "Download Excel"
                : "Select a component first"
            }
          >
            {downloadingXlsx ? (
              <span className="rp-spinner" />
            ) : (
              <MdFileDownload />
            )}
            <span>Download Excel</span>
          </button>

          <button
            className="rp-btn pdf"
            onClick={() => download("pdf")}
            disabled={downloadingPdf || !componentIsSelected}
            title={
              componentIsSelected ? "Download PDF" : "Select a component first"
            }
          >
            {downloadingPdf ? (
              <span className="rp-spinner" />
            ) : (
              <MdPictureAsPdf />
            )}
            <span>Download PDF</span>
          </button>

          {previewOpen && (
            <button
              className="rp-btn"
              onClick={() => {
                setPreviewOpen(false);
                setPreviewRows([]);
                setPreviewError("");
                setPreviewMessage("");
              }}
            >
              Close Preview
            </button>
          )}
        </div>

        <div className="rp-note">
          <strong>Tip:</strong> Use the presets for quick ranges. For large
          exports, prefer Excel.
        </div>

        {previewOpen && (
          <div
            className="rp-preview-panel"
            role="region"
            aria-label="Report preview"
          >
            <div className="rp-preview-header">
              <strong>Preview</strong>
              <div className="rp-preview-meta">
                {previewLoading && (
                  <span className="rp-small-muted">Loading...</span>
                )}
                {!previewLoading && previewTotalRows != null && (
                  <span className="rp-small-muted">
                    Showing {currentPageData.length} of {previewTotalRows} rows
                    — page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>

            {previewError && (
              <div className="rp-preview-error" role="alert">
                {previewError}
              </div>
            )}

            {!previewLoading && !previewError && previewRows.length === 0 && (
              <div className="rp-preview-empty rp-small-muted">
                {previewMessage || "No rows to preview with selected filters."}
              </div>
            )}

            {!previewLoading && previewRows.length > 0 && (
              <div className="rp-preview-table-wrap">
                <table className="rp-preview-table">
                  <thead>
                    <tr>
                      {selectedFields.map((k) => (
                        <th key={k}>{keyToLabel[k] || k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((row, idx) => (
                      <tr key={idx}>
                        {selectedFields.map((k) => (
                          <td key={k + "-" + idx}>
                            {row && Object.prototype.hasOwnProperty.call(row, k)
                              ? row[k] === null || row[k] === undefined
                                ? ""
                                : String(row[k])
                              : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={goToPage}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        {alertModal.title && <h4>{alertModal.title}</h4>}
        <div style={{ whiteSpace: "pre-wrap" }}>{alertModal.message}</div>
      </Modal>
    </div>
  );
}
