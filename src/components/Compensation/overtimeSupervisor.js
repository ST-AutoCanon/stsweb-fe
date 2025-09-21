

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./overtimeSupervisor.css";
import { FaEye } from "react-icons/fa";
import Modal from "../Modal/Modal";

const API_KEY = process.env.REACT_APP_API_KEY;

const OvertimeSupervisor = () => {
  const [employees, setEmployees] = useState([]);
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [compensationData, setCompensationData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [showEmployeeDetailsPopup, setShowEmployeeDetailsPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [monthOptions, setMonthOptions] = useState([]);

  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  console.log("Supervisor ID (meId):", meId);

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const getMonthName = (offset) => {
    const date = new Date();
    const targetMonth = date.getMonth() - offset;
    date.setMonth(targetMonth);
    const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
    console.log(`getMonthName(offset: ${offset}, targetMonth: ${targetMonth}): ${monthName}`);
    return monthName;
  };

  const getDateRange = (type) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let startDate, endDate;

    if (type === "current") {
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0);
    } else if (type === "last") {
      startDate = new Date(currentYear, currentMonth - 1, 1);
      endDate = new Date(currentYear, currentMonth, 0);
    } else if (type === "twoMonthsAgo") {
      startDate = new Date(currentYear, currentMonth - 2, 1);
      endDate = new Date(currentYear, currentMonth - 1, 0);
    }

    const range = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
    console.log(`getDateRange(${type}): ${range.startDate} to ${range.endDate}`);
    return range;
  };

  useEffect(() => {
    console.log("Setting monthOptions");
    setMonthOptions([
      { type: "current", offset: 0, label: getMonthName(0) },
      { type: "last", offset: 1, label: getMonthName(1) },
      { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
    ]);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/overtime-summary/${meId}`,
        { headers }
      );
      console.log("Employee List API Response:", JSON.stringify(response.data, null, 2));
      if (response.data.success) {
        setEmployees(response.data.data);
        console.log("Employees set:", JSON.stringify(response.data.data, null, 2));
        if (response.data.data.length === 0) {
          setError("No employees found for this supervisor.");
          console.warn("No employees found for supervisor:", meId);
        }
      } else {
        setError("Failed to fetch employee data: Invalid response");
        showAlert("Failed to fetch employee data");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(`Failed to fetch employee data: ${error.message}`);
      showAlert(`Failed to fetch employee data: ${error.message}`);
    }
  };

  const fetchCompensationData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
        { headers }
      );
      console.log("Compensation Data API Response:", JSON.stringify(response.data, null, 2));
      if (response.data.success) {
        // Validate and parse plan_data for each compensation record
        const validatedData = response.data.data.map(comp => {
          let planData = {};
          if (comp.plan_data) {
            try {
              planData = typeof comp.plan_data === 'string' ? JSON.parse(comp.plan_data) : comp.plan_data;
            } catch (e) {
              console.warn(`Invalid JSON in plan_data for employee_id ${comp.employee_id}:`, comp.plan_data);
              planData = {};
            }
          }
          return { ...comp, plan_data: planData };
        });
        setCompensationData(validatedData);
        console.log("Compensation data set:", JSON.stringify(validatedData, null, 2));
      } else {
        setError("Failed to fetch compensation data: Invalid response");
        showAlert("Failed to fetch compensation data");
      }
    } catch (error) {
      console.error("Error fetching compensation data:", error);
      setError(`Failed to fetch compensation data: ${error.message}`);
      showAlert(`Failed to fetch compensation data: ${error.message}`);
    }
  };

  const fetchOvertimeData = async () => {
    const selectedMonthOption = monthOptions.find(
      (option) => option.type === selectedMonth
    );
    if (!selectedMonthOption) {
      console.warn("No selected month option found for:", selectedMonth);
      return;
    }

    const { startDate, endDate } = getDateRange(selectedMonth);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours?startDate=${startDate}&endDate=${endDate}`,
        { headers }
      );
      console.log("Overtime Data API Response:", response.data);
      if (typeof response.data === 'string') {
        console.error("Received string instead of JSON:", response.data);
        throw new Error("Invalid response format: Expected JSON object");
      }
      if (response.data.success) {
        const employeeIds = employees.map(emp => emp.employee_id);
        console.log("Employee IDs under supervisor:", employeeIds);
        const filteredRecords = response.data.data
          .filter(item => {
            const hoursWorked = parseFloat(item.hours_worked) || 0;
            const isValidEmployee = employeeIds.includes(item.employee_id);
            const isOver8Hours = hoursWorked > 8;
            if (!isValidEmployee) {
              console.warn(`Filtered out record for employee_id ${item.employee_id} not in employee list:`, item);
            }
            if (!isOver8Hours) {
              console.warn(`Filtered out record for employee_id ${item.employee_id} with hours_worked <= 8:`, item);
            }
            return isValidEmployee && isOver8Hours;
          })
          .map(item => {
            const hours = parseFloat(item.extra_hours) || 0;
            const comp = compensationData.find(c => c.employee_id === item.employee_id);
            let rate = parseFloat(item.rate) || 0; // Fallback rate
            if (comp && comp.plan_data && comp.plan_data.overtimePayAmount) {
              rate = parseFloat(comp.plan_data.overtimePayAmount) || 0;
            } else if (comp) {
              console.warn(`No overtimePayAmount for employee_id ${item.employee_id}`);
            } else {
              console.warn(`No compensation data for employee_id ${item.employee_id}, using fallback rate`);
            }
            if (hours > 24) {
              console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
            }
            return {
              id: item.punch_id || `temp-${Math.random().toString(36).substr(2, 9)}`,
              date: item.work_date ? new Date(item.work_date).toISOString().split("T")[0] : item.punch_in_time ? new Date(item.punch_in_time).toISOString().split("T")[0] : "Unknown",
              employee_id: item.employee_id || "Unknown",
              hours: Math.min(hours, 24),
              hours_worked: parseFloat(item.hours_worked) || 0,
              rate,
              project: item.project || "",
              supervisor: item.supervisor || employees.find(emp => emp.employee_id === item.employee_id)?.supervisor_name || "Unknown",
              comments: item.comments || "",
              status: item.status || "Pending",
            };
          });
        const uniqueRecords = Array.from(
          new Map(filteredRecords.map(item => [item.id, item])).values()
        );
        setOvertimeRecords(uniqueRecords);
        console.log("Overtime records set:", JSON.stringify(uniqueRecords, null, 2));
        if (uniqueRecords.length === 0) {
          console.warn("No overtime records returned for employees with hours_worked > 8 in this date range");
          setError("No overtime records found for employees with more than 8 hours worked in this period.");
        } else {
          setError("");
        }
      } else {
        setError(`Failed to fetch overtime data: ${response.data.error || "Invalid response"}`);
        showAlert(`Failed to fetch overtime data: ${response.data.error || "Invalid response"}`);
      }
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      const errorMessage = error.response?.data?.error || error.message || "Network error";
      setError(`Failed to fetch overtime data: ${errorMessage}`);
      showAlert(`Failed to fetch overtime data: ${errorMessage}`);
    }
  };

  const handleInputChange = (id, field, value) => {
    if (field !== "rate") return;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      showAlert("Rate must be a positive number", "Error");
      return;
    }
    setOvertimeRecords((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    console.log(`Updated ${field} for record ${id}: ${value}`);
  };

  const handleStatusChange = async (punchId, status) => {
    try {
      setLoading(true);
      const row = overtimeRecords.find((row) => row.id === punchId);
      if (!row) {
        throw new Error("Row not found for punchId: " + punchId);
      }
      if (row.status !== "Pending") {
        throw new Error(`Cannot change status of row with status: ${row.status}`);
      }

      const payload = {
        data: [{
          punch_id: row.id,
          work_date: row.date,
          employee_id: row.employee_id,
          extra_hours: row.hours,
          rate: parseFloat(row.rate) || 0,
          project: row.project || "",
          supervisor: row.supervisor || "",
          comments: row.comments || "",
          status: status,
        }],
      };

      console.log("Sending status update payload:", JSON.stringify(payload, null, 2));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
        payload,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Status update response:", JSON.stringify(response.data, null, 2));

      showAlert(`Overtime record ${status.toLowerCase()} successfully`, "Success");

      setOvertimeRecords((prevData) =>
        prevData.map((row) =>
          row.id === punchId ? { ...row, status } : row
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showAlert(
        error.response?.data?.error || error.message || "Network error",
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meId) {
      setLoading(true);
      Promise.all([fetchEmployees(), fetchCompensationData()])
        .then(() => fetchOvertimeData())
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error in fetching data:", error);
          setError(`Failed to fetch data: ${error.message}`);
          showAlert(`Failed to fetch data: ${error.message}`);
          setLoading(false);
        });
    } else {
      setError("Supervisor ID not found in localStorage.");
      setLoading(false);
      console.error("No meId found in localStorage");
    }
  }, [meId, selectedMonth]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Search term:", e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setError("");
    console.log("Selected month:", e.target.value);
  };

  const handleShowEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetailsPopup(true);
    console.log("Selected employee:", JSON.stringify(employee, null, 2));
  };

  const filteredRecords = overtimeRecords.filter((record) => {
    const employee = employees.find(emp => emp.employee_id === record.employee_id);
    const matchesSearch = employee && employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch && employee) {
      console.log(`Record for ${employee.employee_name} (${record.employee_id}) filtered out due to search term: ${searchTerm}`);
    }
    return matchesSearch || !searchTerm;
  });
  console.log("Filtered records:", JSON.stringify(filteredRecords, null, 2));

  return (
    <div className="employees-container">
      <h1>Employee Overtime Summary</h1>
      <div className="header-container">
        <div className="employee-search-container">
          <input
            type="text"
            placeholder="Search by Employee Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <div className="month-selector-container">
          <label htmlFor="monthSelector">Select Month: </label>
          <select
            id="monthSelector"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-selector"
          >
            {monthOptions.map((option) => (
              <option key={option.type} value={option.type}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading overtime records...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredRecords.length === 0 ? (
        <div>No overtime records found for employees with more than 8 hours worked.</div>
      ) : (
        <div className="table-scroll-wrapper">
          <table className="employee-table">
            <thead>
              <tr className="header-row">
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Supervisor</th>
                <th>Date</th>
                <th>Overtime Hours</th>
                <th>Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const employee = employees.find(emp => emp.employee_id === record.employee_id);
                return (
                  <tr key={record.id}>
                    <td>{record.employee_id}</td>
                    <td>{employee ? employee.employee_name : record.employee_id}</td>
                    <td>{record.supervisor}</td>
                    <td>{record.date}</td>
                    <td>{record.hours} hours</td>
                    <td>
                      <input
                        type="number"
                        value={record.rate}
                        onChange={(e) => handleInputChange(record.id, "rate", e.target.value)}
                        className="rate-input"
                        disabled={record.status === "Approved" || record.status === "Rejected" || loading}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className={`status-${record.status.toLowerCase()}`}>{record.status}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleStatusChange(record.id, "Approved")}
                          className="approve-button"
                          disabled={record.status !== "Pending" || loading}
                        >
                          <svg className="action-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(record.id, "Rejected")}
                          className="reject-button"
                          disabled={record.status !== "Pending" || loading}
                        >
                          <svg className="action-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                            />
                          </svg>
                          Reject
                        </button>
                        <button
                          className="employee-view-btn"
                          onClick={() => handleShowEmployeeDetails(employee)}
                          title="View Details"
                        >
                          <FaEye size={16} style={{ marginRight: "5px" }} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showEmployeeDetailsPopup && selectedEmployee && (
        <div className="employee-popup-overlay">
          <div className="employee-popup-box">
            <button
              className="employee-popup-close-btn"
              onClick={() => setShowEmployeeDetailsPopup(false)}
            >
              ×
            </button>
            <h2 className="employee-popup-title">Employee Details</h2>
            <div className="employee-details-container">
              <table className="details-table">
                <tbody>
                  <tr>
                    <td className="details-label">Employee ID</td>
                    <td className="details-value">{selectedEmployee.employee_id}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Employee Name</td>
                    <td className="details-value">{selectedEmployee.employee_name}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Project Names</td>
                    <td className="details-value">{selectedEmployee.project_names || "-"}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Supervisor ID</td>
                    <td className="details-value">{selectedEmployee.supervisor_id}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Supervisor Name</td>
                    <td className="details-value">{selectedEmployee.supervisor_name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default OvertimeSupervisor;
