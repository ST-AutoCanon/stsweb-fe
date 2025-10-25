import React, { useState, useEffect } from "react";
import "jspdf-autotable"; // Import autoTable plugin for tables
import "./PayrollSummary.css"; // Ensure proper CSS
import generatePayslipPDF from "../../utils/generatePayslipPDF";

const PayrollSummary = () => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentMonthYear());
  const [payrollData, setPayrollData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null); // New state for employee details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const employeeData = JSON.parse(localStorage.getItem("dashboardData"));
  const employeeId = employeeData?.employeeId;

  const handleDateChange = (event) => {
    const [month, year] = event.target.value.split("-");
    setSelectedDate({ month: parseInt(month), year: parseInt(year) });
  };

  useEffect(() => {
    if (!employeeId) return;

    // Fetch Payroll Data
    const fetchPayrollData = async () => {
      setLoading(true);
      setError(null);
      setPayrollData(null);
      setBankDetails(null); // Reset bank details when payroll is not available
      setAttendance(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/salary-slip?employee_id=${employeeId}&month=${selectedDate.month}&year=${selectedDate.year}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();
        if (response.ok && result) {
          setPayrollData(result);
          fetchBankDetails(); // Fetch bank details only if payroll exists
          fetchEmployeeDetails(); // Fetch employee details
        } else {
          setPayrollData(null);
          setBankDetails(null); // Ensure bank details are not shown
          setEmployeeDetails(null); // Reset employee details
        }
      } catch (error) {
        setError("Failed to fetch payroll data.");
      }
      setLoading(false);
    };

    // Fetch Bank Details (Only if payroll data exists)
    const fetchBankDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/bank-details/${employeeId}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();
        if (response.ok && result) {
          setBankDetails(result);
        } else {
          setBankDetails(null);
        }
      } catch (error) {
        console.error("Failed to fetch bank details:", error);
      }
    };

    // Fetch Employee Details (PAN and Gender)
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/employee-details/${employeeId}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();
        if (response.ok && result) {
          setEmployeeDetails(result);
        } else {
          setEmployeeDetails(null);
        }
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      }
    };

    // Fetch Attendance Data
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/attendance/${employeeId}`,
          {
            method: "GET",
            headers,
          }
        );

        const result = await response.json();
        if (response.ok && result.attendanceStats) {
          setAttendance(result.attendanceStats);
        } else {
          setAttendance(null);
        }
      } catch (error) {
        console.error("Failed to fetch attendance details:", error);
      }
    };

    fetchPayrollData();
    fetchAttendanceData();
  }, [selectedDate, employeeId, BACKEND_URL, API_KEY]);

  if (loading) {
    return <p>Loading payroll data...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!payrollData) {
    return <p>No payroll data available for this month.</p>;
  }

  const grossEarnings = parseFloat(payrollData.gross_salary) || 0;
  const netSalary = parseFloat(payrollData.net_salary) || 0;
  const totalDeductions = grossEarnings - netSalary;

  return (
    <div className="payroll-container">
      <h1 className="payroll-title">Employee Payslip</h1>

      {/* Dropdown for selecting month & year */}
      <div className="payroll-controls">
        <label className="payroll-label">Select Month & Year:</label>
        <select
          value={`${selectedDate.month}-${selectedDate.year}`}
          onChange={handleDateChange}
          className="payroll-select"
        >
          {[...Array(6)].map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return (
              <option
                key={i}
                value={`${date.getMonth() + 1}-${date.getFullYear()}`}
              >
                {date.toLocaleString("default", { month: "long" })}{" "}
                {date.getFullYear()}
              </option>
            );
          })}
        </select>
      </div>

      {/* Show Bank Details Only If Payroll Exists */}
      {bankDetails && (
        <div className="bank-details">
          <p>
            <strong>Bank Name:</strong> {bankDetails.bank_name}
          </p>
          <p>
            <strong>Account Number:</strong>{" "}
            {bankDetails.account_number}
          </p>
        </div>
      )}

      <div className="payslip">
        <h2>
          Payslip for{" "}
          {new Date(
            selectedDate.year,
            selectedDate.month - 1
          ).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {/* Payroll Table */}
        <table className="payslip-table">
          <thead>
            <tr>
              <th>Earnings</th>
              <th>Amount</th>
              <th>Deductions</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td>₹{(parseFloat(payrollData.basic_salary) || 0).toLocaleString()}</td>
              <td>Employee PF</td>
              <td>₹{(parseFloat(payrollData.employee_pf) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>₹{(parseFloat(payrollData.hra) || 0).toLocaleString()}</td>
              <td>ESIC</td>
              <td>₹{(parseFloat(payrollData.esic) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>LTA</td>
              <td>₹{(parseFloat(payrollData.lta) || 0).toLocaleString()}</td>
              <td>Gratuity</td>
              <td>₹{(parseFloat(payrollData.gratuity) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Other Allowances</td>
              <td>₹{(parseFloat(payrollData.other_allowances) || 0).toLocaleString()}</td>
              <td>Professional Tax</td>
              <td>₹{(parseFloat(payrollData.professional_tax) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Incentives</td>
              <td>₹{(parseFloat(payrollData.incentives) || 0).toLocaleString()}</td>
              <td>TDS</td>
              <td>₹{(parseFloat(payrollData.tds) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Overtime</td>
              <td>₹{(parseFloat(payrollData.overtime) || 0).toLocaleString()}</td>
              <td>Insurance</td>
              <td>₹{(parseFloat(payrollData.insurance) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Statutory Bonus</td>
              <td>₹{(parseFloat(payrollData.statutory_bonus) || 0).toLocaleString()}</td>
              <td>LOP Days: {(payrollData.lop_days || 0)}</td>
              <td>₹{(parseFloat(payrollData.lop_deduction) || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Bonus</td>
              <td>₹{(parseFloat(payrollData.bonus) || 0).toLocaleString()}</td>
              <td>Advance Recovery</td>
              <td>₹{(parseFloat(payrollData.advance_recovery) || 0).toLocaleString()}</td>
            </tr>
            <tr className="total-row">
              <td>
                <strong>Gross Earnings</strong>
              </td>
              <td>
                <strong>₹{grossEarnings.toLocaleString()}</strong>
              </td>
              <td>
                <strong>Total Deductions</strong>
              </td>
              <td>
                <strong>₹{totalDeductions.toLocaleString()}</strong>
              </td>
            </tr>
            <tr className="net-salary-row">
              <td colSpan="2">
                <strong>Net Salary</strong>
              </td>
              <td colSpan="2">
                <strong>₹{Math.floor(netSalary).toLocaleString()}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Download Button */}
        <button
          onClick={() =>
            generatePayslipPDF(
              payrollData,
              selectedDate,
              bankDetails,
              attendance,
              employeeDetails
            )
          }
          className="payroll-download-btn"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PayrollSummary;