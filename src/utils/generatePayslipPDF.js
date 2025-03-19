


import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Function to convert number to words
const convertNumberToWords = (num) => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  let words = "";

  const getWords = (n, index) => {
    if (n > 0) {
      if (n < 10) words += ones[n] + " ";
      else if (n < 20) words += teens[n - 11] + " ";
      else words += tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
      words += thousands[index] + " ";
    }
  };

  getWords(Math.floor(num / 10000000), 3); // Crore
  getWords(Math.floor((num % 10000000) / 100000), 2); // Lakh
  getWords(Math.floor((num % 100000) / 1000), 1); // Thousand
  getWords(Math.floor((num % 1000) / 100), 0); // Hundreds

  if (num % 100 > 0) getWords(num % 100, 0);

  return words.trim() + " only.";
};

const generatePayslipPDF = (payrollData, selectedDate, bankDetails, attendance) => {
  if (!payrollData) {
    alert("No payroll data available.");
    return;
  }

  // Format net salary
  const formattedNetSalary = parseFloat(payrollData.net_salary).toFixed(0);
  const [integerPart] = formattedNetSalary.split(".");
  let netSalaryWords = convertNumberToWords(parseInt(integerPart));

  const doc = new jsPDF();

  // Header
  doc.setFontSize(16).setFont("times", "bold");
  doc.text("SUKALPA TECH SOLUTIONS Pvt.Ltd", 65, 25);
  doc.setFontSize(12).setFont("times", "normal");
  doc.text("Sahyadri Nagar Belagavi ", 90, 35);

  doc.setFontSize(14).setFont("times", "bold");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedMonthYear = `${monthNames[selectedDate.month - 1]} ${selectedDate.year}`;

  doc.text(" ", 85, 50);
  doc.setFont("times", "bold").text(`Payslip for ${formattedMonthYear}`, 85, 55);

  // Employee Details
  doc.setFontSize(10).setFont("times", "bold");
  
  // Left side details
  doc.text("Employee Name:", 20, 70);
  doc.setFont("times", "normal").text(`${payrollData.employee_name.toUpperCase()}`, 60, 70);

  doc.setFont("times", "bold").text("Department:", 20, 77);
  doc.setFont("times", "normal").text(`${payrollData.department.toUpperCase()}`, 60, 77);

  doc.setFont("times", "bold").text("Date of Joining:", 20, 84);
  doc.setFont("times", "normal").text(`${payrollData.joining_date}`, 60, 84);

  doc.setFont("times", "bold").text("No. of Working Days:", 20, 91);
  doc.setFont("times", "normal").text(`${attendance?.total_working_days || "N/A"}`, 60, 91);

  doc.setFont("times", "bold").text("UIN No:", 20, 98); // Added UIN No
  doc.setFont("times", "normal").text(`${payrollData.uin_number || "N/A"}`, 60, 98);

  // Right side details
  doc.setFont("times", "bold").text("Employee ID:", 120, 70);
  doc.setFont("times", "normal").text(`${payrollData.employee_id}`, 160, 70);

  doc.setFont("times", "bold").text("Designation:", 120, 77);
  doc.setFont("times", "normal").text(`${payrollData.designation.toUpperCase()}`, 160, 77);

  doc.setFont("times", "bold").text("Account No:", 120, 84);
  doc.setFont("times", "normal").text(`${bankDetails.account_number} (${bankDetails.bank_name})`, 160, 84);

  doc.setFont("times", "bold").text("Leaves Taken:", 120, 91);
  doc.setFont("times", "normal").text(`${attendance?.leave_count}`, 160, 91);

  doc.setFont("times", "bold").text("Branch Name:", 120, 98); // Added Branch Name
  doc.setFont("times", "normal").text(`${bankDetails.branch_name || "N/A"}`, 160, 98);

  // Tables
  autoTable(doc, { startY: 105, styles: { fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.3 }, theme: "grid" });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Earnings", "Amount", "Deductions", "Amount"]],
    body: [
      ["Basic", `${payrollData.basic_salary}`, "PF", `${payrollData.provident_fund_pf || 0}`],
      ["HRA", `${payrollData.house_rent_allowance_hra || 0}`, "ESI/INSURANCE", `${payrollData.esi || 0}`],
      ["Other Allowance", `${payrollData.other_allowances || 0}`, "Professional Tax", `${payrollData.tax_deduction || 0}`],
      ["", "", "TDS", `${payrollData.tds}`],
      ["Gross Earnings", `${Math.floor(payrollData.total_earnings)}`, "Total Deductions", `${payrollData.total_deductions}`],
    ],
    styles: { fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.3 },
    theme: "grid",
    headStyles: { fillColor: [0, 29, 74], textColor: [255, 255, 255] }
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 4,
    body: [
      ["Net Salary", formattedNetSalary],
      ["Net Salary (in words)", netSalaryWords],
    ],
    styles: { fontSize: 10, fontStyle: "bold", lineColor: [0, 0, 0], lineWidth: 0.3 },
    theme: "grid",
  });

  doc.setFontSize(10).text("This is a system-generated payslip, no signature required.", 50, doc.lastAutoTable.finalY + 10);
  doc.save(`Payslip_${payrollData.employee_id}.pdf`);
};

export default generatePayslipPDF;
