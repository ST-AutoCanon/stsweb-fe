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
  // server-provided friendly message for empty previews or error responses
  const [previewMessage, setPreviewMessage] = useState("");

  const employeeId = localStorage.getItem("dashboardData");

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

  const showAlert = (message, title = "") => {
    setPreviewOpen(false);
    setTimeout(() => {
      setAlertModal({ isVisible: true, title: title || "", message });
    }, 80);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  // Helper: read a message from various axios error shapes (Blob/string/object)
  const getErrorMessageFromAxiosError = useCallback(async (err) => {
    try {
      if (!err || !err.response) {
        if (err && err.message) return err.message;
        return "Unknown error from server";
      }
      const { status, data } = err.response;

      // If server returned no body
      if (data === null || typeof data === "undefined") {
        return `Server responded with status ${status}`;
      }

      // If axios already parsed JSON (object)
      if (typeof data === "object" && !(data instanceof Blob)) {
        // Common fields to check
        const candidate =
          data.message || data.error || data.msg || data.detail || null;
        if (candidate && typeof candidate === "string" && candidate.trim())
          return candidate;
        // fallback to JSON string (shortened)
        try {
          const s = JSON.stringify(data);
          return s.length > 0 ? s : `Server responded with status ${status}`;
        } catch (e) {
          return `Server responded with status ${status}`;
        }
      }

      // If server returned text or blob (e.g. responseType: 'blob' used)
      // data could be a Blob or string
      let text = null;
      if (data instanceof Blob && typeof data.text === "function") {
        text = await data.text();
      } else if (typeof data === "string") {
        text = data;
      }

      if (!text || !text.trim()) {
        return `Server responded with status ${status}`;
      }

      // If text looks like JSON, parse it
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
        // not JSON — return raw text (trimmed, but limit length)
        const t = text.trim();
        return t.length > 500 ? t.slice(0, 500) + "..." : t;
      }

      return `Server responded with status ${status}`;
    } catch (e) {
      // fallback
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
  }, [employeeId]);

  useEffect(() => {
    // When component changes we reset component-specific state.
    // Also reset employee/department selection so changing component clears those filters.
    if (!component || component === "select") {
      setStatusOptions([]);
      setStatus("All");
      setAvailableFields([]);
      setSelectedFields([]);
      setPreviewOpen(false);
      setPreviewRows([]);
      setPreviewError("");
      setPreviewMessage("");

      // Reset employee/department/typeahead state when no component is selected
      setFilterEmployeeId(null);
      setFilterEmployeeName("");
      setFilterDepartmentId(null);
      setIsTypingSearch(false);
      return;
    }

    // When a real component is selected, populate fields/status and reset employee/department
    setStatusOptions(STATUS_OPTIONS[component] || ["All"]);
    setStatus("All");
    const subs = SUB_OPTIONS[component] || [];
    setAvailableFields(subs);
    setSelectedFields(subs.map((s) => s.key));
    setPreviewOpen(false);
    setPreviewRows([]);
    setPreviewError("");
    setPreviewMessage("");

    // IMPORTANT: reset employee and department selection whenever component changes
    // This ensures the component-specific filters do not leak across components.
    setFilterEmployeeId(null);
    setFilterEmployeeName("");
    setFilterDepartmentId(null);
    setIsTypingSearch(false);
  }, [component]);

  const presetRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
  };
  const thisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(end.toISOString().slice(0, 10));
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

  const buildParams = ({ includeFormat = false, preview = false } = {}) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const st =
      status === undefined || status === null ? "" : String(status).trim();
    params.append("status", st);
    if (selectedFields && selectedFields.length > 0)
      params.append("fields", selectedFields.join(","));
    if (filterEmployeeId) params.append("employee_id", filterEmployeeId);
    if (filterDepartmentId) params.append("department_id", filterDepartmentId);
    if (preview) params.append("preview", "true");
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
      const paramString = buildParams({ includeFormat: false, preview: false });
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
        // server returned a JSON error instead of a file — read and show it
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
      // Extract useful message from server (handles blob/json/text)
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
      const url = `${base}/api/report/${endpoint}?${buildParams({
        preview: true,
      })}`;

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

      // prefer server-provided preview message when rows empty
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

      // Try to get server message and show it inside the preview panel (not alert)
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

  // Typeahead callbacks
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
            <option value="leaves">Leaves</option>
            <option value="reimbursements">Reimbursements</option>
            <option value="employees">Employees</option>
            <option value="vendors">Vendors</option>
            <option value="assets">Assets</option>
            <option value="attendance">Attendance</option>
            <option value="tasks_employee">Tasks (Employee Driven)</option>
            <option value="tasks_supervisor">Tasks (Supervisor Driven)</option>
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

          <div className="rp-date-field rp-typeahead-field">
            <label className="rp-label">Employee Name</label>
            <EmployeeTypeahead
              onSelect={onEmployeeSelect}
              onTyping={onTypeStart}
              onClear={onEmployeeClear}
              departmentId={filterDepartmentId}
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
                <div className="rp-typeahead-subtext">Loading departments…</div>
              )}
            </div>
          </div>
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
