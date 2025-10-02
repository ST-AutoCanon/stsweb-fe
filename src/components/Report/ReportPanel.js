// src/components/Report/ReportPanel.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdFileDownload,
  MdPictureAsPdf,
  MdDateRange,
  MdOutlineAssessment,
} from "react-icons/md";
import "./ReportPanel.css";

const STATUS_OPTIONS = {
  leaves: ["All", "Pending", "Approved", "Rejected", "Cancelled"],
  reimbursements: ["All", "Pending", "Approved", "Paid", "Unpaid", "Rejected"],
  employees: ["All", "Active", "Inactive", "Probation"],
  vendors: ["All", "Active", "Inactive"],
  assets: ["All", "In Use", "Available", "Disposed", "Under Repair"],
  attendance: ["All", "Punch In", "Punch Out"],
};

const SUB_OPTIONS = {
  leaves: [
    { key: "leave_id", label: "Leave ID" },
    { key: "employee_id", label: "Employee ID" },
    { key: "employee_name", label: "Employee Name" },
    { key: "department_name", label: "Department" },
    { key: "leave_type", label: "Leave Type" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
    { key: "comments", label: "Comments" },
    { key: "created_at", label: "Created At" },
  ],
  reimbursements: [
    { key: "id", label: "Reimbursement ID" },
    { key: "employee_id", label: "Employee ID" },
    { key: "employee_name", label: "Employee Name" },
    { key: "department_name", label: "Department" },
    { key: "claim_title", label: "Title" },
    { key: "claim_type", label: "Description / Purpose" },
    { key: "date_range", label: "Date / Range" },
    { key: "total_amount", label: "Total Amount" },
    { key: "approval_status", label: "Approval Status" },
    { key: "payment_status", label: "Payment Status" },
    { key: "attachments", label: "Attachments" },
    { key: "created_at", label: "Created At" },
  ],
  employees: [
    { key: "employee_id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "department_name", label: "Department" },
    { key: "role", label: "Role" },
    { key: "position", label: "Position" },
    { key: "joining_date", label: "Joining Date" },
    { key: "salary", label: "Salary" },
    { key: "bank_name", label: "Bank Name" },
    { key: "account_number", label: "Account Number" },
    { key: "ifsc_code", label: "IFSC" },
    { key: "bank_branch", label: "Bank Branch" },
    { key: "address", label: "Address" },
    { key: "father_name", label: "Father Name" },
    { key: "mother_name", label: "Mother Name" },
    { key: "dob", label: "DOB" },
    { key: "created_at", label: "Created At" },
  ],
  vendors: [
    { key: "vendor_id", label: "Vendor ID" },
    { key: "vendor_name", label: "Vendor Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "gst_number", label: "GST Number" },
    { key: "pan_number", label: "PAN Number" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
  ],
  assets: [
    { key: "asset_id", label: "Asset ID" },
    { key: "asset_tag", label: "Asset Tag" },
    { key: "asset_name", label: "Asset Name" },
    { key: "category", label: "Category" },
    { key: "sub_category", label: "Sub Category" },
    { key: "configuration", label: "Configuration" },
    { key: "assigned_to_employee_id", label: "Assigned To (Employee ID)" },
    { key: "assigned_to_name", label: "Assigned To (Name)" },
    { key: "valuation_date", label: "Valuation Date" },
    { key: "value", label: "Value" },
    { key: "status", label: "Status" },
    { key: "document_path", label: "Document Path" },
  ],
  attendance: [
    { key: "punch_id", label: "Punch ID" },
    { key: "employee_id", label: "Employee ID" },
    { key: "punch_status", label: "Status" },
    { key: "punchin_time", label: "Punch In Time" },
    { key: "punchin_device", label: "Punch In Device" },
    { key: "punchin_location", label: "Punch In Location" },
    { key: "punchout_time", label: "Punch Out Time" },
    { key: "punchout_device", label: "Punch Out Device" },
    { key: "punchout_location", label: "Punch Out Location" },
    { key: "punchmode", label: "Punch Mode" },
  ],
};

export default function Reportpanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [component, setComponent] = useState("select");
  const [status, setStatus] = useState("All");
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [previewTotalRows, setPreviewTotalRows] = useState(null);
  const employeeId = localStorage.getItem("dashboardData");

  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    if (!component || component === "select") {
      setStatusOptions([]);
      setStatus("All");
      setAvailableFields([]);
      setSelectedFields([]);
      setPreviewOpen(false);
      setPreviewData([]);
      setPreviewError("");
      return;
    }

    setStatusOptions(STATUS_OPTIONS[component] || ["All"]);
    setStatus("All");

    const subs = SUB_OPTIONS[component] || [];
    setAvailableFields(subs);
    setSelectedFields(subs.map((s) => s.key));
    setPreviewOpen(false);
    setPreviewData([]);
    setPreviewError("");
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
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (s > e) {
        alert("Start date cannot be after End date.");
        return false;
      }
    }
    return true;
  };

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const selectAllFields = () => {
    if (!availableFields || availableFields.length === 0) return;
    setSelectedFields(availableFields.map((s) => s.key));
  };

  const clearAllFields = () => {
    setSelectedFields([]);
  };

  const allSelected =
    availableFields.length > 0 &&
    selectedFields.length === availableFields.length;
  const someSelected =
    selectedFields.length > 0 && selectedFields.length < availableFields.length;

  const buildParams = ({ includeFormat = false, preview = false } = {}) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    // ALWAYS include status (send empty string for "All")
    const st =
      status === undefined || status === null ? "" : String(status).trim();
    params.append("status", st);

    if (selectedFields && selectedFields.length > 0) {
      params.append("fields", selectedFields.join(","));
    }
    if (preview) params.append("preview", "true");
    if (includeFormat) params.append("format", "xlsx");
    return params.toString();
  };

  const validateSelection = () => {
    if (!component || component === "select") {
      alert("Please select a component first.");
      return false;
    }
    if (!selectedFields || selectedFields.length === 0) {
      alert("Please select at least one field to proceed.");
      return false;
    }
    return true;
  };

  const download = async (format) => {
    try {
      if (!validateDates()) return;
      if (!validateSelection()) return;
      setLoading(true);

      const base = process.env.REACT_APP_BACKEND_URL || "";
      // build params WITHOUT adding format, then append format once
      const paramString = buildParams({ includeFormat: false, preview: false });
      const url = `${base}/api/report/${component}?${paramString}${
        paramString ? "&" : ""
      }format=${encodeURIComponent(format)}`;

      console.log("[ReportPanel] download URL:", url);

      // set Accept header to the expected binary mime type (important)
      let acceptHeader = "*/*";
      if (format === "pdf") {
        acceptHeader = "application/pdf";
      } else if (format === "xlsx") {
        acceptHeader =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }

      const res = await axios.get(url, {
        responseType: "blob",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "x-employee-id": employeeId,
          Accept: acceptHeader,
        },
        // increase timeout for large reports if needed
        timeout: 2 * 60 * 1000,
      });

      // if server returned JSON with an error (text), detect and show message
      const contentType = res.headers["content-type"] || "";
      const isJson = contentType.includes("application/json");
      if (isJson) {
        // server returned JSON instead of binary (likely an error or preview)
        const text = await res.data.text();
        console.error(
          "Expected binary file but server returned JSON/text:",
          text
        );
        alert(
          "Server returned an error or preview instead of a file. Check console for details."
        );
        return;
      }

      let filename = `${component}_report.${format === "pdf" ? "pdf" : "xlsx"}`;
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
      alert("Failed to download report. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    try {
      if (!validateDates()) return;
      if (!validateSelection()) return;

      setPreviewError("");
      setPreviewLoading(true);
      setPreviewData([]);
      setPreviewTotalRows(null);
      setPreviewOpen(true);

      const base = process.env.REACT_APP_BACKEND_URL || "";
      const url = `${base}/api/report/${component}?${buildParams({
        preview: true,
      })}`;

      console.log("[ReportPanel] preview URL:", url);

      const res = await axios.get(url, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "x-employee-id": employeeId,
          Accept: "application/json",
        },
      });

      let rows = [];
      if (Array.isArray(res.data)) {
        rows = res.data;
      } else if (res.data && Array.isArray(res.data.rows)) {
        rows = res.data.rows;
        if (typeof res.data.totalRows === "number")
          setPreviewTotalRows(res.data.totalRows);
      } else {
        throw new Error(
          "Preview endpoint did not return an array (expected JSON array or { rows: [...] })."
        );
      }

      const MAX_PREVIEW_ROWS = 200;
      setPreviewData(rows.slice(0, MAX_PREVIEW_ROWS));
      setPreviewTotalRows((prev) => prev ?? rows.length);
      if (rows.length > MAX_PREVIEW_ROWS) {
        setPreviewError(
          `Preview shows first ${MAX_PREVIEW_ROWS} rows. Server returned ${rows.length} rows.`
        );
      }
    } catch (err) {
      console.error("Preview error:", err);
      setPreviewError(
        "Unable to fetch preview. Ensure your backend supports a JSON preview endpoint: " +
          "`GET /api/report/{component}?...&preview=true` returning JSON (array or { rows: [...] }). " +
          (err?.message || "")
      );
      setPreviewData([]);
    } finally {
      setPreviewLoading(false);
    }
  };

  const keyToLabel = {};
  availableFields.forEach((f) => (keyToLabel[f.key] = f.label));

  const componentIsSelected = component && component !== "select";

  return (
    <div className="rp-container">
      <header className="rp-header">
        <div className="rp-title">
          <MdOutlineAssessment size={28} />
          <div>
            <h2>Reports</h2>
            <p className="rp-sub">
              Export Leaves, Reimbursements, Employees, Vendors, Assets,
              Attendance — Excel and PDF
            </p>
          </div>
        </div>
      </header>

      <section className="rp-card">
        <div className="rp-row">
          <label className="rp-label">Component</label>
          <select
            className="rp-select"
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
            </div>

            <div
              className="rp-fields-grid"
              aria-disabled={!componentIsSelected}
            >
              {availableFields.map((f) => {
                const selected = selectedFields.includes(f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    className={`rp-field-chip ${selected ? "selected" : ""}`}
                    onClick={() => toggleField(f.key)}
                    role="checkbox"
                    aria-checked={selected}
                    title={f.label}
                    disabled={!componentIsSelected}
                  >
                    <span className="rp-field-chip-label">{f.label}</span>
                    {selected && <span className="rp-field-chip-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rp-row">
          <label className="rp-label">Status</label>
          <select
            className="rp-select"
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

        <div className="rp-row rp-dates">
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
        </div>

        <div className="rp-presets">
          <button className="rp-chip" onClick={() => presetRange(7)}>
            Last 7 days
          </button>
          <button className="rp-chip" onClick={() => presetRange(30)}>
            Last 30 days
          </button>
          <button className="rp-chip" onClick={thisMonth}>
            This month
          </button>
          <button
            className="rp-chip"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setStatus("All");
              setSelectedFields([]);
              setPreviewOpen(false);
              setPreviewData([]);
              setPreviewError("");
            }}
          >
            Clear
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
            disabled={loading || !componentIsSelected}
            title={
              componentIsSelected
                ? "Download Excel"
                : "Select a component first"
            }
          >
            {loading ? <span className="rp-spinner" /> : <MdFileDownload />}
            <span>Download Excel</span>
          </button>

          <button
            className="rp-btn pdf"
            onClick={() => download("pdf")}
            disabled={loading || !componentIsSelected}
            title={
              componentIsSelected ? "Download PDF" : "Select a component first"
            }
          >
            {loading ? <span className="rp-spinner" /> : <MdPictureAsPdf />}
            <span>Download PDF</span>
          </button>

          {previewOpen && (
            <button
              className="rp-btn"
              onClick={() => {
                setPreviewOpen(false);
                setPreviewData([]);
                setPreviewError("");
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
                    Showing {previewData.length}
                    {previewTotalRows && previewTotalRows > previewData.length
                      ? ` of ${previewTotalRows}`
                      : ""}{" "}
                    rows
                  </span>
                )}
              </div>
            </div>

            {previewError && (
              <div className="rp-preview-error" role="alert">
                {previewError}
              </div>
            )}

            {!previewLoading && !previewError && previewData.length === 0 && (
              <div className="rp-preview-empty rp-small-muted">
                No rows to preview with selected filters.
              </div>
            )}

            {!previewLoading && previewData.length > 0 && (
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
                    {previewData.map((row, idx) => (
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
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
