

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
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
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok && result) {
          setPayrollData(result);
          fetchBankDetails(); // Fetch bank details only if payroll exists
        } else {
          setPayrollData(null);
          setBankDetails(null); // Ensure bank details are not shown
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
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
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
	//attendance details
	const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/attendance/${employeeId}`, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

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
  }, [selectedDate, employeeId]);


  

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
              <option key={i} value={`${date.getMonth() + 1}-${date.getFullYear()}`}>
                {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
              </option>
            );
          })}
        </select>
      </div>

      {/* Data Rendering */}
      {loading ? (
        <p>Loading payroll data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : payrollData ? (
        <>
          {/* Show Bank Details Only If Payroll Exists */}
          {bankDetails && (
            <div className="bank-details">
              <p><strong>Bank Name:</strong> {bankDetails.bank_name}</p>
              <p><strong>Account Number:</strong> {bankDetails.account_number}</p>
            </div>
          )}
		  

          <div className="payslip">
            <h2>
              Payslip for{" "}
              {new Date(selectedDate.year, selectedDate.month - 1).toLocaleString("default", {
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
                  <td>₹{payrollData.basic_salary}</td>
                  <td>Provident Fund (PF)</td>
                  <td>₹{payrollData.provident_fund_pf || 0}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>₹{payrollData.house_rent_allowance_hra || 0}</td>
                  <td>ESI / Insurance</td>
                  <td>₹{payrollData.esi || 0}</td>
                </tr>
                <tr>
                  <td>Other Allowances</td>
                  <td>₹{payrollData.other_allowances || 0}</td>
                  <td>Professional Tax</td>
                  <td>₹{payrollData.tax_deduction || 0}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>TDS</td>
                  <td>₹{payrollData.tds || 0}</td>
                </tr>
                <tr className="total-row">
                  <td><strong>Gross Earnings</strong></td>
                  <td><strong>₹{payrollData.total_earnings}</strong></td>
                  <td><strong>Total Deductions</strong></td>
                  <td><strong>₹{payrollData.total_deductions}</strong></td>
                </tr>
                <tr className="net-salary-row">
                  <td colSpan="2"><strong>Net Salary</strong></td>
                  <td colSpan="2"><strong>₹{Math.floor(payrollData.net_salary)}</strong></td>
                  </tr>
              </tbody>
            </table>

            {/* Download Button */}
            <button onClick={() => generatePayslipPDF(payrollData, selectedDate,bankDetails,attendance)} className="payroll-download-btn">
              Download PDF
            </button>
          </div>
        </>
      ) : (
        <p>No payroll data available for this month.</p>
      )}
    </div>
  );
};

export default PayrollSummary;
