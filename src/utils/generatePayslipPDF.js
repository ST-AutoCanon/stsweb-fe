
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

function generatePayslipPDF(payrollData, selectedDate, bankDetails, attendance, employeeDetails, save = true) {
  if (!payrollData) {
    alert("No payroll data available.");
    return null;
  }

  // Format net salary
  const formattedNetSalary = parseFloat(payrollData.net_salary).toFixed(0);
  const [integerPart] = formattedNetSalary.split(".");
  let netSalaryWords = convertNumberToWords(parseInt(integerPart));

  const doc = new jsPDF();
  const pan = employeeDetails?.pan_number || "N/A";
  const gender = employeeDetails?.gender || "N/A";

  doc.setFontSize(12);

  // Draw a smaller rectangular box for the header
  doc.setFillColor(15, 102, 121); // Converted from hex #0F6679
  doc.rect(10, 10, 192, 25, "F"); // Reduced height from 40 to 25

  // Add company logo inside a smaller square on the left
  doc.setFillColor(255, 255, 255); // White background for the logo square
  doc.rect(10.5, 10.5, 25, 24, "F"); // White square aligned with header edges (top and left)
  const logoUrl = "/images/LoginLogo.png";
  try {
    doc.addImage(logoUrl, "PNG", 11, 11, 23, 23); // Logo slightly smaller to leave 1mm border on all sides
  } catch (e) {
    console.warn("Failed to load logo:", e);
  }

  // Header text on the right side
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16).setFont("helvetica", "bold");
  doc.text("Sukalpa Tech Solutions Pvt Ltd", 200, 20, { align: "right" });
  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text("#71, Sarathy Nagar, Near Sahyadri Nagar, Belagavi - 591108", 200, 27, { align: "right" });
  doc.text("Phone no.: 9686465612  Email: om@sukalpatechsolutions.com", 200, 34, { align: "right" });

  // Reset text color to black for other content
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14).setFont("helvetica", "bold");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const formattedMonthYear = `${monthNames[selectedDate.month - 1]} ${selectedDate.year}`;

  doc.text(" ", 85, 55);
  doc.text(`Payslip for ${formattedMonthYear}`, 85, 60);

  // Employee Details
  doc.setFontSize(10).setFont("helvetica", "bold");

  // Left side details
  doc.text("Employee Name:", 20, 75);
  doc.setFont("helvetica", "normal").text(`${payrollData.employee_name.toUpperCase()}`, 60, 75);
  doc.setFont("helvetica", "bold").text("Gender:", 20, 82);
  doc.setFont("helvetica", "normal").text(`${employeeDetails?.gender?.toUpperCase() || "N/A"}`, 60, 82);
  doc.setFont("helvetica", "bold").text("Date of Joining:", 20, 89);
  doc.setFont("helvetica", "normal").text(`${payrollData.joining_date}`, 60, 89);
  doc.setFont("helvetica", "bold").text("No. of Working Days:", 20, 96);
  doc.setFont("helvetica", "normal").text(`${attendance?.total_working_days || "N/A"}`, 60, 96);
  doc.setFont("helvetica", "bold").text("UIN No:", 20, 103);
  doc.setFont("helvetica", "normal").text(`${payrollData.uin_number || "N/A"}`, 60, 103);
  doc.setFont("helvetica", "bold").text("ESI Number:", 20, 110);
  doc.setFont("helvetica", "normal").text(`${bankDetails.esi_number || "N/A"}`, 60, 110);

  // Right side details
  doc.setFont("helvetica", "bold").text("Employee ID:", 100, 75);
  doc.setFont("helvetica", "normal").text(`${payrollData.employee_id}`, 130, 75);
  doc.setFont("helvetica", "bold").text("Designation:", 100, 82);
  doc.setFont("helvetica", "normal").text(`${payrollData.designation.toUpperCase()}`, 130, 82);
  doc.setFont("helvetica", "bold").text("Account No:", 100, 89);
  doc.setFont("helvetica", "normal").text(`${bankDetails.account_number} (${bankDetails.bank_name})`, 130, 89);
  doc.setFont("helvetica", "bold").text("Leaves Taken:", 100, 96);
  doc.setFont("helvetica", "normal").text(`${attendance?.leave_count}`, 130, 96);
  doc.setFont("helvetica", "bold").text("PAN Number:", 100, 103);
  doc.setFont("helvetica", "normal").text(`${employeeDetails.pan_number || "N/A"}`, 130, 103);
  doc.setFont("helvetica", "bold").text("PF Number:", 100, 110);
  doc.setFont("helvetica", "normal").text(`${bankDetails.pf_number || "N/A"}`, 130, 110);

  autoTable(doc, { startY: 110, styles: { fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.3 }, theme: "grid" });

  const earningsRows = [
    ["Basic", `${payrollData.basic_salary}`, "PF", `${payrollData.pf || 0}`],
    ["HRA", `${payrollData.hra || 0}`, "ESI/INSURANCE", `${payrollData.insurance || 0}`],
    ["Other Allowance", `${payrollData.allowance || 0}`, "Professional Tax", `${payrollData.pt || 0}`]
  ];

  // Conditionally add Special Allowance
  if (payrollData.special_allowance && payrollData.special_allowance != 0) {
    earningsRows.push(["Bonus", `${payrollData.special_allowance}`, "", ""]);
  }

  if (payrollData.rnrbonus && payrollData.rnrbonus != 0) {
    earningsRows.push(["Rewards And Recognition", `${payrollData.rnrbonus}`, "", ""]);
  }

  // Conditionally add Advance Taken
  if (payrollData.advance_taken && payrollData.advance_taken != 0) {
    earningsRows.push(["", "", "Advance Taken", `${payrollData.advance_taken}`]);
  }

  // Conditionally add Advance Recovery
  if (payrollData.advance_recovery && payrollData.advance_recovery != 0) {
    earningsRows.push(["", "", "Advance Recovery", `${payrollData.advance_recovery}`]);
  }

  // Add gross and total rows at the end
  earningsRows.push(
    ["", "", "TDS", `${payrollData.tds}`],
    ["Gross Earnings", `${Math.floor(payrollData.total_earnings)}`, "Total Deductions", `${payrollData.total_deductions}`]
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Earnings", "Amount", "Deductions", "Amount"]],
    body: earningsRows,
    styles: { fontSize: 10, lineColor: [0, 0, 0], lineWidth: 0.3 },
    theme: "grid",
    headStyles: { fillColor: [15, 102, 121], textColor: [255, 255, 255] }
  });

  // Check if Advance Taken or Advance Recovery exists
  if (payrollData.advance_taken || payrollData.advance_recovery) {
    const advanceRows = [
      ["Advance Taken", `${payrollData.salary_advance || 0}`],
      ["Advance Recovery", `${payrollData.advance_recovery || 0}`]
    ];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 4,
      body: advanceRows,
      styles: { fontSize: 10, fontStyle: "bold", lineColor: [0, 0, 0], lineWidth: 0.3 },
      columnStyles: {
        0: { cellWidth: 58 },
        1: { cellWidth: 124 },
      },
      margin: { left: 14 },
      theme: "grid",
    });
  }

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 4,
    body: [
      ["Net Salary", formattedNetSalary],
      ["Net Salary (in words)", netSalaryWords],
    ],
    styles: { fontSize: 10, fontStyle: "bold", lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { cellWidth: 58 },
      1: { cellWidth: 124 },
    },
    theme: "grid",
  });

  doc.setFontSize(10).text("This is a system-generated payslip, no signature required.", 50, doc.lastAutoTable.finalY + 10);

  if (save) {
    doc.save(`Payslip_${payrollData.employee_id}.pdf`);
    return null;
  } else {
    return doc.output('blob'); // Return PDF blob for preview
  }
}

export default generatePayslipPDF;