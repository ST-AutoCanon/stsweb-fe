import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OvertimeDetails.css";

const OvertimeDetails = () => {
  const [overtimeData, setOvertimeData] = useState([]);
  const [employeeProjectData, setEmployeeProjectData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [aprilPendingPopup, setAprilPendingPopup] = useState({
    isVisible: false,
    pendingCount: 0,
    showDetails: false,
    data: [],
  });
  const [monthOptions, setMonthOptions] = useState([]);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  const showAlert = (message, title = "Alert") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const getDateRange = (type) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let startDate, endDate;

    if (type === "current") {
      startDate = new Date(currentYear, currentMonth - 1, 25);
      endDate = new Date(currentYear, currentMonth, 25);
    } else if (type === "last") {
      startDate = new Date(currentYear, currentMonth - 2, 25);
      endDate = new Date(currentYear, currentMonth - 1, 25);
    } else if (type === "twoMonthsAgo") {
      startDate = new Date(currentYear, currentMonth - 3, 25);
      endDate = new Date(currentYear, currentMonth - 2, 25);
    } else if (type === "april") {
      startDate = new Date(currentYear, currentMonth - 4, 25);
      endDate = new Date(currentYear, currentMonth - 3, 25);
    }

    const range = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
    console.log(`getDateRange(${type}): ${range.startDate} to ${range.endDate}`);
    return range;
  };

  const getMonthName = (offset) => {
    const date = new Date();
    const targetMonth = date.getMonth() - offset;
    date.setMonth(targetMonth);
    const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
    console.log(`getMonthName(offset: ${offset}, targetMonth: ${targetMonth}): ${monthName}`);
    return monthName;
  };

  const fetchEmployeeProjectData = async () => {
    try {
      console.log("Fetching employee project data");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/employee-projects`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
        }
      );
      console.log("Employee Project API Response:", response.data);
      setEmployeeProjectData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Employee project fetch error:", error);
      showAlert("Failed to fetch employee projects", "Error");
    }
  };

  const fetchData = async (startDate, endDate) => {
    try {
      setIsLoading(true);
      console.log(`Fetching overtime data for ${startDate} to ${endDate}`);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
          params: {
            startDate,
            endDate,
          },
        }
      );

      console.log("Overtime API Response:", response.data);

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Overtime Raw API Data:", data);

      if (data.length === 0) {
        console.warn("No overtime records returned from API for the given date range");
      }

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.punch_id, item])).values()
      );

      const formattedData = uniqueData.map((item) => {
        const hours = parseFloat(item.extra_hours) || 0;
        const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
        if (hours > 24) {
          console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
        }
        return {
          id: item.punch_id,
          date: new Date(item.work_date).toISOString().split("T")[0],
          name: employeeInfo.employee_name || item.employee_id,
          hours: Math.min(hours, 24),
          rate: parseFloat(item.rate) || 0,
          project: employeeInfo.project_names || item.project || "",
          supervisor: employeeInfo.supervisor_name || item.supervisor || "",
          comments: item.comments || "",
          status: item.status || "Pending",
        };
      });

      console.log("Overtime Formatted Data:", formattedData);
      setOvertimeData(formattedData);
      setSelectedRows([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Overtime fetch error:", error);
      showAlert(
        error.response?.data?.error || error.message || "Network error",
        "Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkAprilPending = async () => {
    const { startDate, endDate } = getDateRange("april");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
          params: {
            startDate,
            endDate,
          },
        }
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const pendingData = data.filter((item) => item.status === "Pending" || !item.status);
      console.log(`April pending records: ${pendingData.length}`);

      const formattedData = pendingData.map((item) => {
        const hours = parseFloat(item.extra_hours) || 0;
        const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
        if (hours > 24) {
          console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
        }
        return {
          id: item.punch_id,
          date: new Date(item.work_date).toISOString().split("T")[0],
          name: employeeInfo.employee_name || item.employee_id,
          hours: Math.min(hours, 24),
          rate: parseFloat(item.rate) || 0,
          project: employeeInfo.project_names || item.project || "",
          supervisor: employeeInfo.supervisor_name || item.supervisor || "",
          comments: item.comments || "",
          status: item.status || "Pending",
        };
      });

      if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
        setAprilPendingPopup({
          isVisible: true,
          pendingCount: pendingData.length,
          showDetails: false,
          data: formattedData,
        });
        sessionStorage.setItem("aprilPopupShown", "true");
      }
    } catch (error) {
      console.error("Error checking April pending records:", error);
    }
  };

  const handleInputChange = (id, field, value, isAprilPopup = false) => {
    if (field !== "comments") return; // Only allow comments to be edited
    if (isAprilPopup) {
      setAprilPendingPopup((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        ),
      }));
    } else {
      setOvertimeData((prevData) =>
        prevData.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        )
      );
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];
      const pendingRows = overtimeData.filter((row) => row.status === "Pending");
      const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
      setSelectAll(allPendingSelected);
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const pendingRowIds = overtimeData
        .filter((row) => row.status === "Pending")
        .map((row) => row.id);
      setSelectedRows(pendingRowIds);
      setSelectAll(true);
    }
  };

  const handleStatusChange = async (punchId, status, isBulk = false, isApril = false) => {
    try {
      setIsLoading(true);
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

      let payload;
      if (isBulk || isApril) {
        let selectedData;
        if (isApril) {
          selectedData = aprilPendingPopup.data
            .filter((row) => (isBulk ? selectedRows.includes(row.id) : row.id === punchId))
            .filter((row) => row.status === "Pending")
            .map((row) => ({
              punch_id: row.id,
              work_date: row.date,
              employee_id: row.name,
              extra_hours: row.hours,
              rate: parseFloat(row.rate) || 0,
              project: row.project || "",
              supervisor: row.supervisor || "",
              comments: row.comments || "",
              status: status,
            }));
        } else {
          selectedData = overtimeData
            .filter((row) => selectedRows.includes(row.id))
            .filter((row) => row.status === "Pending")
            .map((row) => ({
              punch_id: row.id,
              work_date: row.date,
              employee_id: row.name,
              extra_hours: row.hours,
              rate: parseFloat(row.rate) || 0,
              project: row.project || "",
              supervisor: row.supervisor || "",
              comments: row.comments || "",
              status: status,
            }));
        }

        if (selectedData.length === 0) {
          throw new Error("No pending rows selected for approval/rejection.");
        }

        payload = { data: selectedData };
      } else {
        const row = overtimeData.find((row) => row.id === punchId);
        if (!row) {
          throw new Error("Row not found for punchId: " + punchId);
        }
        if (row.status !== "Pending") {
          throw new Error(`Cannot change status of row with status: ${row.status}`);
        }

        payload = {
          data: [{
            punch_id: row.id,
            work_date: row.date,
            employee_id: row.name,
            extra_hours: row.hours,
            rate: parseFloat(row.rate) || 0,
            project: row.project || "",
            supervisor: row.supervisor || "",
            comments: row.comments || "",
            status: status,
          }],
        };
      }

      await axios.post(fullUrl, payload, {
        headers: {
          "x-api-key": API_KEY,
          "x-employee-id": meId,
          "Content-Type": "application/json",
        },
      });

      showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");

      if (isApril) {
        setAprilPendingPopup((prev) => ({
          ...prev,
          data: prev.data.map((row) =>
            (isBulk ? selectedRows.includes(row.id) : row.id === punchId) && row.status === "Pending"
              ? { ...row, status }
              : row
          ),
          pendingCount: prev.data.filter((row) => row.status === "Pending").length,
          isVisible: prev.data.filter((row) => row.status === "Pending").length > 0,
        }));
        setSelectedRows([]);
      } else {
        setOvertimeData((prevData) =>
          prevData.map((row) =>
            isBulk && selectedRows.includes(row.id) && row.status === "Pending"
              ? { ...row, status }
              : row.id === punchId && row.status === "Pending"
              ? { ...row, status }
              : row
          )
        );
        setSelectedRows([]);
        setSelectAll(false);
        const { startDate, endDate } = getDateRange(selectedMonth);
        await fetchData(startDate, endDate);
      }
    } catch (error) {
      showAlert(
        error.response?.data?.error || error.response?.data?.message || error.message || "Network error",
        "Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
  const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);
  const handleAprilApprove = () => handleStatusChange(null, "Approved", true, true);
  const handleAprilReject = () => handleStatusChange(null, "Rejected", true, true);
  const handleViewDetails = () => {
    setAprilPendingPopup((prev) => ({ ...prev, showDetails: true }));
  };

  useEffect(() => {
    console.log("Setting monthOptions");
    setMonthOptions([
      { type: "current", offset: 0, label: getMonthName(0) },
      { type: "last", offset: 1, label: getMonthName(1) },
      { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
    ]);
  }, []);

  useEffect(() => {
    fetchEmployeeProjectData();
  }, []);

  useEffect(() => {
    const pendingRows = overtimeData.filter((row) => row.status === "Pending");
    const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
    setSelectAll(allPendingSelected);
  }, [overtimeData, selectedRows]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(selectedMonth);
    fetchData(startDate, endDate);
  }, [selectedMonth, employeeProjectData]);

  useEffect(() => {
    checkAprilPending();
  }, [employeeProjectData]);

  return (
    <div className="otd-overtime-container">
      <h2 className="otd-title">Overtime Details</h2>
      <div className="otd-month-selector">
        {monthOptions.map(({ type, label }) => (
          <span
            key={type}
            data-testid={`month-option-${type}`}
            className={`otd-month-option ${selectedMonth === type ? "otd-active" : ""}`}
            onClick={() => setSelectedMonth(type)}
            title={label}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="otd-action-buttons-container">
        <button
          onClick={handleApproveSelected}
          className="otd-approve-button"
          disabled={selectedRows.length === 0 || isLoading}
        >
          Approve All
        </button>
        <button
          onClick={handleRejectSelected}
          className="otd-reject-button"
          disabled={selectedRows.length === 0 || isLoading}
        >
          Reject All
        </button>
      </div>
      {isLoading ? (
        <div className="otd-loading">Loading...</div>
      ) : (
        <div className="otd-table-container">
          <table className="otd-overtime-table">
            <thead>
              <tr>
                <th className="otd-table-header">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    className="otd-checkbox"
                    disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
                  />
                </th>
                <th className="otd-table-header">Date</th>
                <th className="otd-table-header">Employee Name</th>
                <th className="otd-table-header">Extra Hours</th>
                <th className="otd-table-header">Rate</th>
                <th className="otd-table-header">Project</th>
                <th className="otd-table-header">Supervisor</th>
                <th className="otd-table-header">Comments</th>
                <th className="otd-table-header">Status</th>
                <th className="otd-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overtimeData.length > 0 ? (
                overtimeData.map((row) => (
                  <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
                    <td className="otd-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                        className="otd-checkbox"
                        disabled={row.status !== "Pending"}
                      />
                    </td>
                    <td className="otd-table-cell otd-date-cell">{row.date}</td>
                    <td className="otd-table-cell">{row.name}</td>
                    <td className="otd-table-cell">{row.hours}</td>
                    <td className="otd-table-cell">{row.rate.toFixed(2)}</td>
                    <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
                      <span className="otd-text-ellipsis">{row.project}</span>
                    </td>
                    <td className="otd-table-cell">{row.supervisor}</td>
                    <td className="otd-table-cell">
                      <input
                        type="text"
                        value={row.comments}
                        onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
                        className="otd-input"
                        disabled={row.status === "Approved" || row.status === "Rejected"}
                      />
                    </td>
                    <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                    <td className="otd-table-cell">
                      <div className="otd-action-buttons">
                        <button
                          onClick={() => handleStatusChange(row.id, "Approved")}
                          className="otd-approve"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                        >
                          <svg className="otd-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusChange(row.id, "Rejected")}
                          className="otd-reject"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                        >
                          <svg className="otd-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="otd-table-cell otd-no-records">
                    No overtime records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {alertModal.isVisible && (
        <div className="otd-modal-overlay">
          <div className="otd-modal-content">
            <h3 className="otd-modal-title">{alertModal.title}</h3>
            <p className="otd-modal-message">{alertModal.message}</p>
            <button onClick={closeAlert} className="otd-modal-button">
              Close
            </button>
          </div>
        </div>
      )}
      {aprilPendingPopup.isVisible && (
        <div className="otd-april-popup-overlay">
          <div className="otd-april-popup-content">
            <h3 className="otd-april-popup-title">Pending April 2025 Records</h3>
            <p className="otd-april-popup-message">
              There are {aprilPendingPopup.pendingCount} pending overtime records for April 2025. Please approve or reject them.
            </p>
            {aprilPendingPopup.showDetails && (
              <div className="otd-table-container">
                <table className="otd-overtime-table">
                  <thead>
                    <tr>
                      <th className="otd-table-header">Date</th>
                      <th className="otd-table-header">Employee Name</th>
                      <th className="otd-table-header">Extra Hours</th>
                      <th className="otd-table-header">Rate</th>
                      <th className="otd-table-header">Project</th>
                      <th className="otd-table-header">Supervisor</th>
                      <th className="otd-table-header">Comments</th>
                      <th className="otd-table-header">Status</th>
                      <th className="otd-table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aprilPendingPopup.data.length > 0 ? (
                      aprilPendingPopup.data.map((row) => (
                        <tr key={row.id} className="otd-table-row">
                          <td className="otd-table-cell otd-date-cell">{row.date}</td>
                          <td className="otd-table-cell">{row.name}</td>
                          <td className="otd-table-cell">{row.hours}</td>
                          <td className="otd-table-cell">{row.rate.toFixed(2)}</td>
                          <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
                            <span className="otd-text-ellipsis">{row.project}</span>
                          </td>
                          <td className="otd-table-cell">{row.supervisor}</td>
                          <td className="otd-table-cell">
                            <input
                              type="text"
                              value={row.comments}
                              onChange={(e) => handleInputChange(row.id, "comments", e.target.value, true)}
                              className="otd-input"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                          <td className="otd-table-cell">
                            <div className="otd-action-buttons">
                              <button
                                onClick={() => handleStatusChange(row.id, "Approved", false, true)}
                                className="otd-approve"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                              >
                                <svg className="otd-icon" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleStatusChange(row.id, "Rejected", false, true)}
                                className="otd-reject"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                              >
                                <svg className="otd-icon" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="otd-table-cell otd-no-records">
                          No pending records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="otd-april-popup-buttons">
              <button
                onClick={handleAprilApprove}
                className="otd-april-approve-button"
                disabled={isLoading}
              >
                Approve All
              </button>
              <button
                onClick={handleAprilReject}
                className="otd-april-reject-button"
                disabled={isLoading}
              >
                Reject All
              </button>
              <button
                onClick={handleViewDetails}
                className="otd-april-view-details-button"
                disabled={isLoading}
              >
                View All Details
              </button>
              <button
                onClick={() => setAprilPendingPopup({ isVisible: false, pendingCount: 0, showDetails: false, data: [] })}
                className="otd-april-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OvertimeDetails;