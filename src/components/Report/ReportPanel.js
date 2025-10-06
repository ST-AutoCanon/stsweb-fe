import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdFileDownload,
  MdPictureAsPdf,
  MdDateRange,
  MdOutlineAssessment,
} from "react-icons/md";
import "./ReportPanel.css";
import Modal from "../Modal/Modal";

const STATUS_OPTIONS = {
  leaves: ["All", "Pending", "Approved", "Rejected"],
  reimbursements: [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Approved/Pending",
    "Approved/paid",
  ],
  employees: ["All", "Active", "Inactive"],
  assets: ["All", "In Use", "Assigned", "Returned", "Decommissioned"],
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
    { key: "dob", label: "DOB" },
    { key: "created_at", label: "Created At" },
  ],
  vendors: [
    { key: "vendor_id", label: "vendor_id" },
    { key: "company_name", label: "company_name" },
    { key: "registered_address", label: "registered_address" },
    { key: "city", label: "city" },
    { key: "gst_number", label: "gst_number" },
    { key: "pan_number", label: "pan_number" },
    { key: "company_type", label: "company_type" },
    { key: "contact1_mobile", label: "contact_mobile" },
    { key: "contact1_email", label: "contact_email" },
    { key: "bank_name", label: "bank_name" },
    { key: "account_number", label: "account_number" },
    { key: "product_category", label: "product_category" },
    { key: "created_at", label: "created_at" },
  ],
  assets: [
    { key: "asset_id", label: "asset_id" },
    { key: "asset_code", label: "asset_code" },
    { key: "asset_name", label: "asset_name" },
    { key: "configuration", label: "configuration" },
    { key: "category", label: "category" },
    { key: "sub_category", label: "sub_category" },
    { key: "assigned_to", label: "assigned_to" },
    { key: "document_path", label: "document_path" },
    { key: "valuation_date", label: "valuation_date" },
    { key: "status", label: "status" },
    { key: "count", label: "count" },
    { key: "created_at", label: "created_at" },
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
  // separate flags so buttons don't block each other
  const [downloadingXlsx, setDownloadingXlsx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [previewTotalRows, setPreviewTotalRows] = useState(null);
  const employeeId = localStorage.getItem("dashboardData");

  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  // --- new constant: max allowed range in days (must match backend)
  const MAX_RANGE_DAYS = 62; // roughly 2 months

  // centralized alert modal state (shared/common modal like Admin)
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") => {
    // ensure preview closed when showing some alerts that might overlap (optional)
    setPreviewOpen(false);
    setTimeout(() => {
      setAlertModal({ isVisible: true, title: title || "", message });
    }, 80);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

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
    // If both empty, allow (backend will default to last 2 months)
    if (!startDate && !endDate) return true;

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (s > e) {
        showAlert("Start date cannot be after End date.");
        return false;
      }
      // compute inclusive days
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

    // If only one provided, require both (or clear both to default)
    showAlert(
      "Please provide both Start Date and End Date, or leave both empty to use the default last 2 months range."
    );
    return false;
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
      showAlert("Please select a component first.");
      return false;
    }
    if (!selectedFields || selectedFields.length === 0) {
      showAlert("Please select at least one field to proceed.");
      return false;
    }
    return true;
  };

  // unified download helper but uses separate flags
  const download = async (format) => {
    if (!validateDates()) return;
    if (!validateSelection()) return;

    const isPdf = format === "pdf";
    // set only the relevant flag
    if (isPdf) setDownloadingPdf(true);
    else setDownloadingXlsx(true);

    try {
      const base = process.env.REACT_APP_BACKEND_URL || "";
      const paramString = buildParams({ includeFormat: false, preview: false });
      const url = `${base}/api/report/${component}?${paramString}${
        paramString ? "&" : ""
      }format=${encodeURIComponent(format)}`;

      console.log("[ReportPanel] download URL:", url);

      let acceptHeader = "*/*";
      if (isPdf) acceptHeader = "application/pdf";
      else
        acceptHeader =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const res = await axios.get(url, {
        responseType: "blob",
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "x-employee-id": employeeId,
          Accept: acceptHeader,
        },
        timeout: 2 * 60 * 1000,
      });

      const contentType = res.headers["content-type"] || "";
      const isJson =
        contentType.includes("application/json") ||
        contentType.includes("text/plain");
      if (isJson) {
        // Blob.text() is supported in modern browsers and simpler than FileReader
        let text = "";
        try {
          text = await res.data.text();
        } catch (e) {
          text = "(unable to read response body)";
        }
        console.error("Server returned JSON/text instead of file:", text);
        showAlert(
          "Server returned an error instead of the file. Check console for details."
        );
        return;
      }

      // determine filename (fallback to component_report.<ext>)
      let filename = `${component}_report.${isPdf ? "pdf" : "xlsx"}`;
      const disposition = res.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename="?([^\"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // create download link
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
      if (err.response) {
        const msg =
          (err.response.data && err.response.data.message) ||
          `Server responded with status ${err.response.status}`;
        console.error(
          "Response status:",
          err.response.status,
          err.response.data
        );
        showAlert(msg);
      } else if (err.request) {
        console.error(
          "No response received (possible network/CORS issue):",
          err.request
        );
        showAlert(
          "No response from server. Check network / CORS or backend availability."
        );
      } else {
        console.error("Download setup error:", err.message);
        showAlert("Failed to download report: " + err.message);
      }
    } finally {
      // always clear only the relevant flag
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

      if (rows.length === 0) {
        showAlert(
          "No data available for the selected date range (max 2 months). Please change filters."
        );
      }

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
      // Also show a modal alert for preview-level failures
      showAlert("Failed to fetch preview. Check console for details.");
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

      {/* Common alert modal (re-uses the project's Modal component) */}
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