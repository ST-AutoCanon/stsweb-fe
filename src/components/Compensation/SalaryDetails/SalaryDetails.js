

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
// import {
//   calculateSalaryDetails,
//   parseWorkDate,
// } from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
// import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
// import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

// const SalaryDetails = () => {
//   const [employees, setEmployees] = useState([]);
//   const [advances, setAdvances] = useState([]);
//   const [overtimeRecords, setOvertimeRecords] = useState([]);
//   const [bonusRecords, setBonusRecords] = useState([]);
//   const [employeeLopData, setEmployeeLopData] = useState({});
//   const [employeeIncentiveData, setEmployeeIncentiveData] = useState({});
//   const [personalMap, setPersonalMap] = useState({}); // New state for personal details
//   const [workingDays, setWorkingDays] = useState(null); // New state for working days
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search
//   const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Track selected employee IDs
//   const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state
//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
//   const requestHeaders = { "x-api-key": API_KEY, "x-employee-id": meId };

//   useEffect(() => {
//     const fetchSalaryBreakupData = async () => {
//       console.log("Environment Variables:", {
//         API_KEY: process.env.REACT_APP_API_KEY,
//         BASE_URL: process.env.REACT_APP_BACKEND_URL,
//         meId,
//       });
//       if (!process.env.REACT_APP_API_KEY || !meId) {
//         console.error("Missing credentials: API_KEY or meId");
//         setIsLoading(false);
//         return;
//       }
//       console.log("Fetching data with headers:", requestHeaders);
//       try {
//         setIsLoading(true);
//         const [
//           compensationsRes,
//           employeesRes,
//           advancesRes,
//           overtimeRes,
//           bonusRes,
//           workingDaysRes, // New API call
//         ] = await Promise.all([
//           axios.get(`${BASE_URL}/api/compensations/list`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching compensations/list:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/assigned`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching compensation/assigned:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching compensation/advance-details:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching compensation/overtime-status-summary:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching compensation/bonus-list:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/working-days`, { headers: requestHeaders }).catch(err => {
//             console.error("Error fetching working-days:", err);
//             return { data: { data: { totalWorkingDays: 'N/A' } } }; // Fallback
//           }),
//         ]);
//         console.log("API Responses:", {
//           compensations: compensationsRes.data,
//           employees: employeesRes.data,
//           advances: advancesRes.data,
//           overtime: overtimeRes.data,
//           bonus: bonusRes.data,
//           workingDays: workingDaysRes.data,
//         });
//         // Set working days - extract from response.data.data.totalWorkingDays
//         const wd = workingDaysRes.data?.data?.totalWorkingDays ?? 'N/A';
//         setWorkingDays(wd);
//         const compensationMap = new Map();
//         (compensationsRes.data.data || []).forEach((comp) => {
//           compensationMap.set(comp.compensation_plan_name, comp.plan_data);
//         });
//         const enrichedEmployeesMap = new Map();
//         (employeesRes.data.data || []).forEach((emp) => {
//           if (!enrichedEmployeesMap.has(emp.employee_id)) {
//             enrichedEmployeesMap.set(emp.employee_id, {
//               ...emp,
//               plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
//             });
//           } else {
//             console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
//           }
//         });
//         const enrichedEmployees = Array.from(enrichedEmployeesMap.values());
//         setEmployees(enrichedEmployees);
//         setAdvances(advancesRes.data.data || []);
//         setOvertimeRecords(overtimeRes.data.data || []);
//         setBonusRecords(bonusRes.data.data || []);
//         const lopDataPromises = enrichedEmployees.map((emp) =>
//           calculateLOPEffect(emp.employee_id)
//             .then((result) => ({
//               employeeId: emp.employee_id,
//               lopData: result,
//             }))
//             .catch((err) => {
//               console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
//               return {
//                 employeeId: emp.employee_id,
//                 lopData: {
//                   currentMonth: { days: 0, value: "0.00", currency: "INR" },
//                   deferred: { days: 0, value: "0.00", currency: "INR" },
//                   nextMonth: { days: 0, value: "0.00", currency: "INR" },
//                   yearly: { days: 0, value: "0.00", currency: "INR" },
//                 },
//               };
//             })
//         );
//         const lopDataResults = await Promise.all(lopDataPromises);
//         const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
//           acc[employeeId] = lopData;
//           return acc;
//         }, {});
//         setEmployeeLopData(lopDataMap);
//         const incentiveDataPromises = enrichedEmployees.map((emp) =>
//           calculateIncentives(emp.employee_id)
//             .then((result) => ({
//               employeeId: emp.employee_id,
//               incentiveData: result,
//             }))
//             .catch((err) => {
//               console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
//               return {
//                 employeeId: emp.employee_id,
//                 incentiveData: {
//                   ctcIncentive: { value: "0.00", currency: "INR" },
//                   salesIncentive: { value: "0.00", currency: "INR" },
//                   totalIncentive: { value: "0.00", currency: "INR" },
//                 },
//               };
//             })
//         );
//         const incentiveDataResults = await Promise.all(incentiveDataPromises);
//         const incentiveDataMap = incentiveDataResults.reduce(
//           (acc, { employeeId, incentiveData }) => {
//             const key = String(employeeId).toUpperCase();
//             if (!acc[key] || parseFloat(incentiveData.totalIncentive.value) > 0) {
//               acc[key] = incentiveData;
//             }
//             return acc;
//           },
//           {}
//         );
//         setEmployeeIncentiveData(incentiveDataMap);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSalaryBreakupData();
//   }, []);

//   const filteredEmployees = (employees || []).filter(
//     (emp) =>
//       emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
//       emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle individual row selection
//   const handleRowSelect = (employeeId) => {
//     setSelectedEmployees((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(employeeId)) {
//         newSet.delete(employeeId);
//       } else {
//         newSet.add(employeeId);
//       }
//       return newSet;
//     });
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectedEmployees.size === filteredEmployees.length) {
//       setSelectedEmployees(new Set());
//     } else {
//       setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.employee_id)));
//     }
//   };

//   // Check if all filtered are selected
//   const isAllSelected = selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0;

//   // Get selected employees data - use full employees list to avoid search filtering issues
//   const getSelectedEmployees = () => employees.filter(emp => selectedEmployees.has(emp.employee_id));

//   // Handle proceed: show preview if selected, else alert
//   const handleProceed = async () => {
//     if (selectedEmployees.size === 0) {
//       alert("Please select at least one employee.");
//       return;
//     }
//     try {
//       const employeeIds = Array.from(selectedEmployees);
//       const personalRes = await axios.post(
//         `${BASE_URL}/api/compensation/employee-personal-details`,
//         { employeeIds },
//         { headers: requestHeaders }
//       );
//       setPersonalMap(personalRes.data.data || {});
//       setShowPreviewModal(true);
//     } catch (error) {
//       console.error('Error fetching personal details for preview:', error);
//       alert('Failed to fetch employee details for preview');
//       setShowPreviewModal(true); // Still open modal
//     }
//   };

//   // Close modal
//   const handleCloseModal = () => {
//     setShowPreviewModal(false);
//     setPersonalMap({}); // Reset personal map
//   };

//   const downloadExcel = (employeesToExport = filteredEmployees) => {
//     if (employeesToExport.length === 0) return;
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthNum = currentDate.getMonth() + 1;
//     const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//     const currentYm = `${currentYear}-${currentMonthStr}`;
//     const lastMonthIndex = currentMonthNum - 2;
//     const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//     const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
//     const headers = [
//       'ID',
//       'Name',
//       'Annual CTC',
//       'Basic Salary',
//       'HRA',
//       'LTA',
//       'Other Allowances',
//       'Incentives',
//       'Overtime',
//       'Statutory Bonus',
//       'Bonus',
//       'Advance Recovery',
//       'Employee PF',
//       'Employer PF',
//       'ESIC',
//       'Gratuity',
//       'Professional Tax',
//       'TDS',
//       'Insurance',
//       'LOP Days',
//       'LOP Deduction',
//       'Gross Salary',
//       'Net Salary'
//     ];
//     const rows = employeesToExport.map((emp) => {
//       const salaryDetails = calculateSalaryDetails(
//         emp.ctc,
//         emp.plan_data,
//         emp.employee_id,
//         overtimeRecords || [],
//         bonusRecords || [],
//         advances || [],
//         employeeIncentiveData || {},
//         employeeLopData
//       );
//       const lopData =
//         employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//           deferred: { days: 0, value: '0.00', currency: 'INR' },
//           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//           yearly: { days: 0, value: '0.00', currency: 'INR' },
//         } : {
//           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//           deferred: { days: 0, value: '0.00', currency: 'INR' },
//           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//           yearly: { days: 0, value: '0.00', currency: 'INR' },
//         };
//       const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//       const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//       // Calculate incentive for this employee
//       const empId = String(emp.employee_id).toUpperCase();
//       const incentiveObj = employeeIncentiveData[empId];
//       let incentiveValue = 0;
//       if (incentiveObj && incentiveObj.incentives) {
//         const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//         incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//       }
//       // Calculate overtime for this employee
//       const employeeOvertime = overtimeRecords.filter((ot) => {
//         const workDate = parseWorkDate(ot.work_date);
//         const createdDate = parseWorkDate(ot.created_at);
//         return (
//           ot.employee_id === emp.employee_id &&
//           ot.status === 'Approved' &&
//           workDate &&
//           workDate >= startWorkDate &&
//           workDate <= endWorkDate &&
//           createdDate &&
//           createdDate.getFullYear() === currentYear &&
//           String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//         );
//       });
//       let totalOvertimePay = 0;
//       if (employeeOvertime.length > 0) {
//         totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//           const hours = parseFloat(ot.extra_hours);
//           let rate = parseFloat(ot.rate);
//           if (isNaN(rate) || rate <= 0) {
//             if (
//               emp.plan_data.isOvertimePay &&
//               emp.plan_data.overtimePayAmount &&
//               !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//             ) {
//               rate = parseFloat(emp.plan_data.overtimePayAmount);
//             } else {
//               rate = 500; // Fallback default rate
//             }
//           }
//           return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//         }, 0);
//       }
//       // Compute gross and net
//       const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//       const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//       const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//       const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//       const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//       const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//       const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//       const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//       const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//       const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//       const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//       const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//       const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//       const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//       const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//       const netSalary = grossSalary - totalDeductions;
//       return [
//         emp.employee_id,
//         emp.full_name,
//         emp.ctc ? parseFloat(emp.ctc) : 0,
//         basicSalary,
//         hra,
//         ltaAllowance,
//         otherAllowances,
//         incentiveValue,
//         totalOvertimePay,
//         statutoryBonus,
//         recordBonusPay,
//         advanceRecovery,
//         employeePF,
//         salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
//         esic,
//         gratuity,
//         professionalTax,
//         tds,
//         insurance,
//         lopDays,
//         lopDeduction,
//         grossSalary,
//         netSalary > 0 ? netSalary : 0
//       ];
//     });
//     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     // Optional: Adjust column widths
//     const colWidths = [
//       { wch: 8 }, // ID
//       { wch: 15 }, // Name
//       { wch: 12 }, // Annual CTC
//       { wch: 12 }, // Basic Salary
//       { wch: 10 }, // HRA
//       { wch: 8 }, // LTA
//       { wch: 12 }, // Other Allowances
//       { wch: 10 }, // Incentives
//       { wch: 10 }, // Overtime
//       { wch: 8 }, // Statutory Bonus
//       { wch: 8 }, // Bonus
//       { wch: 12 }, // Advance Recovery
//       { wch: 10 }, // Employee PF
//       { wch: 12 }, // Employer PF
//       { wch: 8 }, // ESIC
//       { wch: 10 }, // Gratuity
//       { wch: 12 }, // Professional Tax
//       { wch: 10 }, // TDS
//       { wch: 10 }, // Insurance
//       { wch: 8 }, // LOP Days
//       { wch: 10 }, // LOP Deduction
//       { wch: 12 }, // Gross Salary
//       { wch: 12 }, // Net Salary
//     ];
//     ws['!cols'] = colWidths;
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Salary Details");
//     XLSX.writeFile(wb, 'salary-details.xlsx');
//   };

//   // Download bank report for selected employees
//   const downloadBankReport = async () => {
//     const selectedData = getSelectedEmployees();
//     if (selectedData.length === 0) return;

//     try {
//       // Fetch personal details for selected employees
//       const employeeIds = selectedData.map(emp => emp.employee_id);
//       const personalRes = await axios.post(
//         `${BASE_URL}/api/compensation/employee-personal-details`,
//         { employeeIds },
//         { headers: requestHeaders }
//       );
//       const personalMapLocal = personalRes.data.data || {};

//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonthNum = currentDate.getMonth() + 1;
//       const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//       const currentYm = `${currentYear}-${currentMonthStr}`;
//       const lastMonthIndex = currentMonthNum - 2;
//       const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//       const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);

//       const headers = ['ID', 'Name', 'PAN Number', 'UAN Number', 'Net Payable'];
//       const rows = selectedData.map((emp) => {
//         const salaryDetails = calculateSalaryDetails(
//           emp.ctc,
//           emp.plan_data,
//           emp.employee_id,
//           overtimeRecords || [],
//           bonusRecords || [],
//           advances || [],
//           employeeIncentiveData || {},
//           employeeLopData
//         );
//         const lopData =
//           employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//             deferred: { days: 0, value: '0.00', currency: 'INR' },
//             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//             yearly: { days: 0, value: '0.00', currency: 'INR' },
//           } : {
//             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//             deferred: { days: 0, value: '0.00', currency: 'INR' },
//             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//             yearly: { days: 0, value: '0.00', currency: 'INR' },
//           };
//         const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//         const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//         // Calculate incentive for this employee
//         const empId = String(emp.employee_id).toUpperCase();
//         const incentiveObj = employeeIncentiveData[empId];
//         let incentiveValue = 0;
//         if (incentiveObj && incentiveObj.incentives) {
//           const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//           incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//         }
//         // Calculate overtime for this employee
//         const employeeOvertime = overtimeRecords.filter((ot) => {
//           const workDate = parseWorkDate(ot.work_date);
//           const createdDate = parseWorkDate(ot.created_at);
//           return (
//             ot.employee_id === emp.employee_id &&
//             ot.status === 'Approved' &&
//             workDate &&
//             workDate >= startWorkDate &&
//             workDate <= endWorkDate &&
//             createdDate &&
//             createdDate.getFullYear() === currentYear &&
//             String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//           );
//         });
//         let totalOvertimePay = 0;
//         if (employeeOvertime.length > 0) {
//           totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//             const hours = parseFloat(ot.extra_hours);
//             let rate = parseFloat(ot.rate);
//             if (isNaN(rate) || rate <= 0) {
//               if (
//                 emp.plan_data.isOvertimePay &&
//                 emp.plan_data.overtimePayAmount &&
//                 !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//               ) {
//                 rate = parseFloat(emp.plan_data.overtimePayAmount);
//               } else {
//                 rate = 500; // Fallback default rate
//               }
//             }
//             return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//           }, 0);
//         }
//         // Compute gross and net
//         const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//         const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//         const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//         const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//         const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//         const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//         const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//         const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//         const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//         const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//         const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//         const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//         const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//         const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//         const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//         const netSalary = grossSalary - totalDeductions;

//         const personalDetails = personalMapLocal[emp.employee_id] || { pan_number: 'N/A', uan_number: 'N/A' };

//         return [
//           emp.employee_id,
//           emp.full_name,
//           personalDetails.pan_number,
//           personalDetails.uan_number,
//           netSalary > 0 ? netSalary : 0
//         ];
//       });

//       const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//       // Adjust column widths
//       const colWidths = [
//         { wch: 8 }, // ID
//         { wch: 20 }, // Name
//         { wch: 12 }, // PAN Number
//         { wch: 15 }, // UAN Number
//         { wch: 15 }, // Net Payable
//       ];
//       ws['!cols'] = colWidths;
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Bank Report");
//       XLSX.writeFile(wb, 'bank-report.xlsx');
//     } catch (error) {
//       console.error('Error fetching personal details for bank report:', error);
//       alert('Failed to fetch employee details for bank report');
//     }
//   };

//   // Download for selected in preview
//   const handleDownloadSelected = () => {
//     const selectedData = getSelectedEmployees();
//     downloadExcel(selectedData);
//     setShowPreviewModal(false);
//   };

//   // Download bank report for selected
//   const handleDownloadBankReport = () => {
//     downloadBankReport();
//     setShowPreviewModal(false);
//   };

//   // Save data to backend
//   const handleSaveData = async () => {
//     try {
//       const selectedData = getSelectedEmployees();
//       const fullSalaryData = selectedData.map((emp) => {
//         const currentDate = new Date();
//         const currentYear = currentDate.getFullYear();
//         const currentMonthNum = currentDate.getMonth() + 1;
//         const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//         const currentYm = `${currentYear}-${currentMonthStr}`;
//         const lastMonthIndex = currentMonthNum - 2;
//         const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//         const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
//         const salaryDetails = calculateSalaryDetails(
//           emp.ctc,
//           emp.plan_data,
//           emp.employee_id,
//           overtimeRecords || [],
//           bonusRecords || [],
//           advances || [],
//           employeeIncentiveData || {},
//           employeeLopData
//         );
//         const lopData =
//           employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//             deferred: { days: 0, value: '0.00', currency: 'INR' },
//             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//             yearly: { days: 0, value: '0.00', currency: 'INR' },
//           } : {
//             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//             deferred: { days: 0, value: '0.00', currency: 'INR' },
//             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//             yearly: { days: 0, value: '0.00', currency: 'INR' },
//           };
//         const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//         const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//         // Calculate incentive for this employee
//         const empId = String(emp.employee_id).toUpperCase();
//         const incentiveObj = employeeIncentiveData[empId];
//         let incentiveValue = 0;
//         if (incentiveObj && incentiveObj.incentives) {
//           const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//           incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//         }
//         // Calculate overtime for this employee
//         const employeeOvertime = overtimeRecords.filter((ot) => {
//           const workDate = parseWorkDate(ot.work_date);
//           const createdDate = parseWorkDate(ot.created_at);
//           return (
//             ot.employee_id === emp.employee_id &&
//             ot.status === 'Approved' &&
//             workDate &&
//             workDate >= startWorkDate &&
//             workDate <= endWorkDate &&
//             createdDate &&
//             createdDate.getFullYear() === currentYear &&
//             String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//           );
//         });
//         let totalOvertimePay = 0;
//         if (employeeOvertime.length > 0) {
//           totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//             const hours = parseFloat(ot.extra_hours);
//             let rate = parseFloat(ot.rate);
//             if (isNaN(rate) || rate <= 0) {
//               if (
//                 emp.plan_data.isOvertimePay &&
//                 emp.plan_data.overtimePayAmount &&
//                 !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//               ) {
//                 rate = parseFloat(emp.plan_data.overtimePayAmount);
//               } else {
//                 rate = 500; // Fallback default rate
//               }
//             }
//             return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//           }, 0);
//         }
//         // Compute gross and net
//         const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//         const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//         const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//         const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//         const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//         const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//         const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//         const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//         const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//         const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//         const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//         const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//         const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//         const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//         const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//         const netSalary = grossSalary - totalDeductions;
//         return {
//           employee_id: emp.employee_id,
//           full_name: emp.full_name,
//           annual_ctc: emp.ctc,
//           basic_salary: basicSalary,
//           hra,
//           lta: ltaAllowance,
//           other_allowances: otherAllowances,
//           incentives: incentiveValue,
//           overtime: totalOvertimePay,
//           statutory_bonus: statutoryBonus,
//           bonus: recordBonusPay,
//           advance_recovery: advanceRecovery,
//           employee_pf: employeePF,
//           employer_pf: salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
//           esic,
//           gratuity,
//           professional_tax: professionalTax,
//           tds,
//           insurance,
//           lop_days: lopDays,
//           lop_deduction: lopDeduction,
//           gross_salary: grossSalary,
//           net_salary: netSalary > 0 ? netSalary : 0
//         };
//       });

//       const response = await axios.post(
//         `${BASE_URL}/api/salary-details/save`,
//         { salaryData: fullSalaryData },
//         { headers: requestHeaders }
//       );

//       if (response.data.success) {
//         alert(`Data saved successfully in table: ${response.data.tableName}`);
//       } else {
//         alert(`Error: ${response.data.error}`);
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       alert("Failed to save data");
//     }
//     setShowPreviewModal(false);
//   };

//   // Generate PDF for selected employees with full data
//   const handleGeneratePDF = () => {
//     const selectedData = getSelectedEmployees();
//     if (selectedData.length === 0) {
//       alert("No employees selected.");
//       return;
//     }

//     const doc = new jsPDF('landscape'); // Landscape to fit more columns
//     let y = 20;

//     // Title
//     doc.setFontSize(16);
//     doc.text('Selected Employees Salary Details', 105, y, { align: 'center' });
//     y += 10;

//     // Date and count
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, y);
//     doc.text(`Total Selected: ${selectedData.length}`, 190, y, { align: 'right' });
//     y += 15;

//     // Prepare table data
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthNum = currentDate.getMonth() + 1;
//     const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//     const currentYm = `${currentYear}-${currentMonthStr}`;
//     const lastMonthIndex = currentMonthNum - 2;
//     const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//     const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);

//     const tableData = selectedData.map((emp) => {
//       const salaryDetails = calculateSalaryDetails(
//         emp.ctc,
//         emp.plan_data,
//         emp.employee_id,
//         overtimeRecords || [],
//         bonusRecords || [],
//         advances || [],
//         employeeIncentiveData || {},
//         employeeLopData
//       );
//       const lopData =
//         employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//           deferred: { days: 0, value: '0.00', currency: 'INR' },
//           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//           yearly: { days: 0, value: '0.00', currency: 'INR' },
//         } : {
//           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//           deferred: { days: 0, value: '0.00', currency: 'INR' },
//           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//           yearly: { days: 0, value: '0.00', currency: 'INR' },
//         };
//       const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//       const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//       // Calculate incentive for this employee
//       const empId = String(emp.employee_id).toUpperCase();
//       const incentiveObj = employeeIncentiveData[empId];
//       let incentiveValue = 0;
//       if (incentiveObj && incentiveObj.incentives) {
//         const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//         incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//       }
//       // Calculate overtime for this employee
//       const employeeOvertime = overtimeRecords.filter((ot) => {
//         const workDate = parseWorkDate(ot.work_date);
//         const createdDate = parseWorkDate(ot.created_at);
//         return (
//           ot.employee_id === emp.employee_id &&
//           ot.status === 'Approved' &&
//           workDate &&
//           workDate >= startWorkDate &&
//           workDate <= endWorkDate &&
//           createdDate &&
//           createdDate.getFullYear() === currentYear &&
//           String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//         );
//       });
//       let totalOvertimePay = 0;
//       if (employeeOvertime.length > 0) {
//         totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//           const hours = parseFloat(ot.extra_hours);
//           let rate = parseFloat(ot.rate);
//           if (isNaN(rate) || rate <= 0) {
//             if (
//               emp.plan_data.isOvertimePay &&
//               emp.plan_data.overtimePayAmount &&
//               !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//             ) {
//               rate = parseFloat(emp.plan_data.overtimePayAmount);
//             } else {
//               rate = 500; // Fallback default rate
//             }
//           }
//           return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//         }, 0);
//       }
//       // Compute gross and net
//       const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//       const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//       const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//       const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//       const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//       const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//       const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//       const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//       const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//       const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//       const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//       const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//       const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//       const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//       const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//       const netSalary = grossSalary - totalDeductions;
//       return [
//         emp.employee_id,
//         emp.full_name,
//         emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A',
//         basicSalary > 0 ? `₹${basicSalary.toLocaleString()}` : 'N/A',
//         hra > 0 ? `₹${hra.toLocaleString()}` : 'N/A',
//         ltaAllowance > 0 ? `₹${ltaAllowance.toLocaleString()}` : 'N/A',
//         otherAllowances > 0 ? `₹${otherAllowances.toLocaleString()}` : 'N/A',
//         incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A',
//         totalOvertimePay > 0 ? `₹${totalOvertimePay.toLocaleString()}` : 'N/A',
//         statutoryBonus > 0 ? `₹${statutoryBonus.toLocaleString()}` : 'N/A',
//         recordBonusPay > 0 ? `₹${recordBonusPay.toLocaleString()}` : 'N/A',
//         advanceRecovery > 0 ? `₹${advanceRecovery.toLocaleString()}` : 'N/A',
//         employeePF > 0 ? `₹${employeePF.toLocaleString()}` : 'N/A',
//         salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A',
//         esic > 0 ? `₹${esic.toLocaleString()}` : 'N/A',
//         gratuity > 0 ? `₹${gratuity.toLocaleString()}` : 'N/A',
//         professionalTax > 0 ? `₹${professionalTax.toLocaleString()}` : 'N/A',
//         tds > 0 ? `₹${tds.toLocaleString()}` : 'N/A',
//         insurance > 0 ? `₹${insurance.toLocaleString()}` : 'N/A',
//         lopDays,
//         lopDeduction > 0 ? `₹${lopDeduction.toLocaleString()}` : 'N/A',
//         grossSalary > 0 ? `₹${grossSalary.toLocaleString()}` : 'N/A',
//         netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'
//       ];
//     });

//     const headers = [
//       'ID',
//       'Name',
//       'Annual CTC',
//       'Basic Salary',
//       'HRA',
//       'LTA',
//       'Other Allowances',
//       'Incentives',
//       'Overtime',
//       'Statutory Bonus',
//       'Bonus',
//       'Advance Recovery',
//       'Employee PF',
//       'Employer PF',
//       'ESIC',
//       'Gratuity',
//       'Professional Tax',
//       'TDS',
//       'Insurance',
//       'LOP Days',
//       'LOP Deduction',
//       'Gross Salary',
//       'Net Salary'
//     ];

//     // Generate table
//     autoTable(doc, {
//       head: [headers],
//       body: tableData,
//       startY: y,
//       theme: 'grid',
//       styles: {
//         fontSize: 7,
//         cellPadding: 2,
//         overflow: 'linebreak',
//         halign: 'center',
//         valign: 'middle',
//       },
//       headStyles: {
//         fillColor: [248, 249, 250],
//         textColor: [73, 80, 87],
//         fontStyle: 'bold',
//       },
//       columnStyles: {
//         0: { halign: 'center' }, // ID
//         1: { halign: 'left', cellWidth: 25 }, // Name - wider
//         21: { halign: 'right' }, // Net Salary - right align
//         // Right align for all monetary columns
//         2: { halign: 'right' },
//         3: { halign: 'right' },
//         4: { halign: 'right' },
//         5: { halign: 'right' },
//         6: { halign: 'right' },
//         7: { halign: 'right' },
//         8: { halign: 'right' },
//         9: { halign: 'right' },
//         10: { halign: 'right' },
//         11: { halign: 'right' },
//         12: { halign: 'right' },
//         13: { halign: 'right' },
//         14: { halign: 'right' },
//         15: { halign: 'right' },
//         16: { halign: 'right' },
//         17: { halign: 'right' },
//         18: { halign: 'right' },
//         19: { halign: 'center' }, // LOP Days
//         20: { halign: 'right' },
//         // Deductions in red
//         11: { textColor: [220, 53, 69] },
//         12: { textColor: [220, 53, 69] },
//         13: { textColor: [220, 53, 69] },
//         14: { textColor: [220, 53, 69] },
//         15: { textColor: [220, 53, 69] },
//         16: { textColor: [220, 53, 69] },
//         17: { textColor: [220, 53, 69] },
//         18: { textColor: [220, 53, 69] },
//         20: { textColor: [220, 53, 69] },
//       },
//       margin: { top: y },
//     });

//     doc.save(`salary-details-${new Date().toISOString().split('T')[0]}.pdf`);
//     setShowPreviewModal(false);
//   };

//   const renderTableRows = (employeesToRender) => {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthNum = currentDate.getMonth() + 1;
//     const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//     const currentYm = `${currentYear}-${currentMonthStr}`;
//     const lastMonthIndex = currentMonthNum - 2;
//     const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//     const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
//     return (
//       <tbody className="sd-table-body">
//         {employeesToRender.map((emp) => {
//           const salaryDetails = calculateSalaryDetails(
//             emp.ctc,
//             emp.plan_data,
//             emp.employee_id,
//             overtimeRecords || [],
//             bonusRecords || [],
//             advances || [],
//             employeeIncentiveData || {},
//             employeeLopData
//           );
//           const lopData =
//             employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//               currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//               deferred: { days: 0, value: '0.00', currency: 'INR' },
//               nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//               yearly: { days: 0, value: '0.00', currency: 'INR' },
//             } : {
//               currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//               deferred: { days: 0, value: '0.00', currency: 'INR' },
//               nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//               yearly: { days: 0, value: '0.00', currency: 'INR' },
//             };
//           const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//           const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//           // Calculate incentive for this employee
//           const empId = String(emp.employee_id).toUpperCase();
//           const incentiveObj = employeeIncentiveData[empId];
//           let incentiveValue = 0;
//           if (incentiveObj && incentiveObj.incentives) {
//             const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//             incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//           }
//           // Calculate overtime for this employee
//           const employeeOvertime = overtimeRecords.filter((ot) => {
//             const workDate = parseWorkDate(ot.work_date);
//             const createdDate = parseWorkDate(ot.created_at);
//             return (
//               ot.employee_id === emp.employee_id &&
//               ot.status === 'Approved' &&
//               workDate &&
//               workDate >= startWorkDate &&
//               workDate <= endWorkDate &&
//               createdDate &&
//               createdDate.getFullYear() === currentYear &&
//               String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//             );
//           });
//           let totalOvertimePay = 0;
//           if (employeeOvertime.length > 0) {
//             totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//               const hours = parseFloat(ot.extra_hours);
//               let rate = parseFloat(ot.rate);
//               if (isNaN(rate) || rate <= 0) {
//                 if (
//                   emp.plan_data.isOvertimePay &&
//                   emp.plan_data.overtimePayAmount &&
//                   !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//                 ) {
//                   rate = parseFloat(emp.plan_data.overtimePayAmount);
//                 } else {
//                   rate = 500; // Fallback default rate
//                 }
//               }
//               return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//             }, 0);
//           }
//           // Compute gross and net
//           const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//           const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//           const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//           const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//           const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//           const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//           const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//           const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//           const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//           const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//           const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//           const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//           const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//           const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//           const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//           const netSalary = grossSalary - totalDeductions;
//           const isSelected = selectedEmployees.has(emp.employee_id);
//           return (
//             <tr key={emp.employee_id}>
//               <td className="sd-table-cell sd-align-center sd-select-column sd-sticky-col sd-sticky-checkbox" style={{left: 0, borderRight: '1px solid #dee2e6', zIndex: 10}}>
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => handleRowSelect(emp.employee_id)}
//                 />
//               </td>
//               <td className="sd-table-cell sd-align-left sd-id-column sd-sticky-col sd-sticky-id" style={{left: '40px', borderRight: '1px solid #dee2e6', zIndex: 10}}>{emp.employee_id}</td>
//               <td className="sd-table-cell sd-align-left sd-name-column sd-sticky-col sd-sticky-name" style={{left: '110px', borderRight: '1px solid #dee2e6', zIndex: 10}}>{emp.full_name}</td>
//               <td className="sd-table-cell sd-align-right sd-sticky-col sd-sticky-ctc" style={{left: '260px', borderRight: '1px solid #dee2e6', zIndex: 10}}>
//                 {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {basicSalary > 0 ? `₹${basicSalary.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {hra > 0 ? `₹${hra.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {ltaAllowance > 0 ? `₹${ltaAllowance.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {otherAllowances > 0 ? `₹${otherAllowances.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {totalOvertimePay > 0 ? `₹${totalOvertimePay.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {statutoryBonus > 0 ? `₹${statutoryBonus.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {recordBonusPay > 0 ? `₹${recordBonusPay.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {advanceRecovery > 0 ? `₹${advanceRecovery.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {employeePF > 0 ? `₹${employeePF.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {esic > 0 ? `₹${esic.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {gratuity > 0 ? `₹${gratuity.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {professionalTax > 0 ? `₹${professionalTax.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {tds > 0 ? `₹${tds.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {insurance > 0 ? `₹${insurance.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {lopDays}
//               </td>
//               <td className="sd-table-cell sd-align-right sd-deduction">
//                 {lopDeduction > 0 ? `₹${lopDeduction.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {grossSalary > 0 ? `₹${grossSalary.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-table-cell sd-align-right">
//                 {netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     );
//   };

//   // Render preview table rows (only ID, Name, PAN, UAN, Net Payable) - No sticky needed in preview modal as it's separate
//   const renderPreviewTableRows = (employeesToRender) => {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthNum = currentDate.getMonth() + 1;
//     const currentMonthStr = String(currentMonthNum).padStart(2, '0');
//     const currentYm = `${currentYear}-${currentMonthStr}`;
//     const lastMonthIndex = currentMonthNum - 2;
//     const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
//     const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
//     return (
//       <tbody>
//         {employeesToRender.map((emp) => {
//           const salaryDetails = calculateSalaryDetails(
//             emp.ctc,
//             emp.plan_data,
//             emp.employee_id,
//             overtimeRecords || [],
//             bonusRecords || [],
//             advances || [],
//             employeeIncentiveData || {},
//             employeeLopData
//           );
//           const lopData =
//             employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
//               currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//               deferred: { days: 0, value: '0.00', currency: 'INR' },
//               nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//               yearly: { days: 0, value: '0.00', currency: 'INR' },
//             } : {
//               currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//               deferred: { days: 0, value: '0.00', currency: 'INR' },
//               nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//               yearly: { days: 0, value: '0.00', currency: 'INR' },
//             };
//           const lopDays = lopData.yearly ? lopData.yearly.days : 0;
//           const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
//           // Calculate incentive for this employee
//           const empId = String(emp.employee_id).toUpperCase();
//           const incentiveObj = employeeIncentiveData[empId];
//           let incentiveValue = 0;
//           if (incentiveObj && incentiveObj.incentives) {
//             const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
//             incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
//           }
//           // Calculate overtime for this employee
//           const employeeOvertime = overtimeRecords.filter((ot) => {
//             const workDate = parseWorkDate(ot.work_date);
//             const createdDate = parseWorkDate(ot.created_at);
//             return (
//               ot.employee_id === emp.employee_id &&
//               ot.status === 'Approved' &&
//               workDate &&
//               workDate >= startWorkDate &&
//               workDate <= endWorkDate &&
//               createdDate &&
//               createdDate.getFullYear() === currentYear &&
//               String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
//             );
//           });
//           let totalOvertimePay = 0;
//           if (employeeOvertime.length > 0) {
//             totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
//               const hours = parseFloat(ot.extra_hours);
//               let rate = parseFloat(ot.rate);
//               if (isNaN(rate) || rate <= 0) {
//                 if (
//                   emp.plan_data.isOvertimePay &&
//                   emp.plan_data.overtimePayAmount &&
//                   !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
//                 ) {
//                   rate = parseFloat(emp.plan_data.overtimePayAmount);
//                 } else {
//                   rate = 500; // Fallback default rate
//                 }
//               }
//               return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
//             }, 0);
//           }
//           // Compute gross and net
//           const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
//           const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
//           const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
//           const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
//           const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
//           const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
//           const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
//           const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
//           const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
//           const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
//           const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
//           const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
//           const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
//           const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
//           const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
//           const netSalary = grossSalary - totalDeductions;
//           return (
//             <tr key={emp.employee_id}>
//               <td className="sd-preview-table-cell">{emp.employee_id}</td>
//               <td className="sd-preview-table-cell">{emp.full_name}</td>
//               <td className="sd-preview-table-cell">{personalMap[emp.employee_id]?.pan_number || 'N/A'}</td>
//               <td className="sd-preview-table-cell">{personalMap[emp.employee_id]?.uan_number || 'N/A'}</td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     );
//   };

//   if (isLoading) {
//     return <div className="sd-loading">Loading...</div>; // Simple loading state
//   }

//   const selectedData = getSelectedEmployees();
//   return (
//     <div className="sd-container">
//       <div className="sd-header">
//         <div className="sd-header-title">Employee Salary Overview</div>
//       </div>
//       {/* New Info Bar: Working Days (left) and Search + Proceed (right) */}
//       <div className="sd-info-bar">
//         <div className="sd-working-days">
//           Total Working Days: {workingDays !== null ? workingDays : 'N/A'}
//         </div>
//         <div className="sd-controls-right">
//           <div className="sd-search-container">
//             <input
//               type="text"
//               className="sd-search-input"
//               placeholder="Search by ID or Name"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <button className="sd-proceed-button" onClick={handleProceed}>
//             Proceed to Report
//           </button>
//         </div>
//       </div>
//       {filteredEmployees.length > 0 ? (
//         <div className="sd-table-section">
//           <div className="sd-table-container">
//             <div className="sd-table-wrapper">
//               <table className="sd-table">
//                 <thead className="sd-table-head">
//                   <tr>
//                     <th className="sd-table-header sd-align-center sd-select-column sd-sticky-col sd-sticky-checkbox" style={{left: 0, borderRight: '1px solid #dee2e6', zIndex: 13}}>
//                       <input
//                         type="checkbox"
//                         checked={isAllSelected}
//                         onChange={handleSelectAll}
//                       />
//                     </th>
//                     <th className="sd-table-header sd-align-left sd-id-column sd-sticky-col sd-sticky-id" style={{left: '40px', borderRight: '1px solid #dee2e6', zIndex: 13}}>ID</th>
//                     <th className="sd-table-header sd-align-left sd-name-column sd-sticky-col sd-sticky-name" style={{left: '110px', borderRight: '1px solid #dee2e6', zIndex: 13}}>Name</th>
//                     <th className="sd-table-header sd-align-right sd-sticky-col sd-sticky-ctc" style={{left: '260px', borderRight: '1px solid #dee2e6', zIndex: 13}}>Annual CTC</th>
//                     <th className="sd-table-header sd-align-right">Basic Salary</th>
//                     <th className="sd-table-header sd-align-right">HRA</th>
//                     <th className="sd-table-header sd-align-right">LTA</th>
//                     <th className="sd-table-header sd-align-right">Other Allowances</th>
//                     <th className="sd-table-header sd-align-right">Incentives</th>
//                     <th className="sd-table-header sd-align-right">Overtime</th>
//                     <th className="sd-table-header sd-align-right">Statutory Bonus</th>
//                     <th className="sd-table-header sd-align-right">Bonus</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Advance Recovery</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Employee PF</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Employer PF</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">ESIC</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Gratuity</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Professional Tax</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">TDS</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">Insurance</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">LOP Days</th>
//                     <th className="sd-table-header sd-align-right sd-deduction">LOP Deduction</th>
//                     <th className="sd-table-header sd-align-right">Gross Salary</th>
//                     <th className="sd-table-header sd-align-right">Net Salary</th>
//                   </tr>
//                 </thead>
//                 {renderTableRows(filteredEmployees)}
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p className="sd-no-data">No employees found</p>
//       )}
//       {/* Preview Modal */}
//       {showPreviewModal && (
//         <div className="sd-preview-modal">
//           <div className="sd-preview-overlay" onClick={handleCloseModal}></div>
//           <div className="sd-preview-content">
//             <div className="sd-preview-header">
//               <h2>Selected Employees Salary Preview ({selectedData.length} selected)</h2>
//               <button className="sd-close-button" onClick={handleCloseModal}>×</button>
//             </div>
//             <div className="sd-preview-table-wrapper">
//               <table className="sd-preview-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>PAN Number</th>
//                     <th>UAN Number</th>
//                     <th className="sd-align-right">Net Payable</th>
//                   </tr>
//                 </thead>
//                 {renderPreviewTableRows(selectedData)}
//               </table>
//             </div>
//             <div className="sd-preview-footer">
//               <button className="sd-download-button" onClick={handleDownloadSelected}>
//                 Generate Excel Sheet
//               </button>
//               <button className="sd-save-button" onClick={handleSaveData}>
//                 Save Data
//               </button>
//               <button className="sd-pdf-button" onClick={handleGeneratePDF}>
//                 Generate PDF
//               </button>
//               <button className="sd-bank-button" onClick={handleDownloadBankReport}>
//                 Generate Bank Report
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalaryDetails;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
import {
  calculateSalaryDetails,
  parseWorkDate,
} from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

const SalaryDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [bonusRecords, setBonusRecords] = useState([]);
  const [employeeLopData, setEmployeeLopData] = useState({});
  const [employeeIncentiveData, setEmployeeIncentiveData] = useState({});
  const [personalMap, setPersonalMap] = useState({}); // New state for personal details
  const [workingDays, setWorkingDays] = useState(null); // New state for working days
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Internal state for search
  const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Track selected employee IDs
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state
  const [showBankReportOptions, setShowBankReportOptions] = useState(false); // New state for bank report options
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
  const requestHeaders = { "x-api-key": API_KEY, "x-employee-id": meId };

  useEffect(() => {
    const fetchSalaryBreakupData = async () => {
      console.log("Environment Variables:", {
        API_KEY: process.env.REACT_APP_API_KEY,
        BASE_URL: process.env.REACT_APP_BACKEND_URL,
        meId,
      });
      if (!process.env.REACT_APP_API_KEY || !meId) {
        console.error("Missing credentials: API_KEY or meId");
        setIsLoading(false);
        return;
      }
      console.log("Fetching data with headers:", requestHeaders);
      try {
        setIsLoading(true);
        const [
          compensationsRes,
          employeesRes,
          advancesRes,
          overtimeRes,
          bonusRes,
          workingDaysRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/compensations/list`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching compensations/list:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/assigned`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching compensation/assigned:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching compensation/advance-details:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching compensation/overtime-status-summary:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching compensation/bonus-list:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/working-days`, { headers: requestHeaders }).catch(err => {
            console.error("Error fetching working-days:", err);
            return { data: { data: { totalWorkingDays: 'N/A' } } }; // Fallback
          }),
        ]);
        console.log("API Responses:", {
          compensations: compensationsRes.data,
          employees: employeesRes.data,
          advances: advancesRes.data,
          overtime: overtimeRes.data,
          bonus: bonusRes.data,
          workingDays: workingDaysRes.data,
        });
        const wd = workingDaysRes.data?.data?.totalWorkingDays ?? 'N/A';
        setWorkingDays(wd);
        const compensationMap = new Map();
        (compensationsRes.data.data || []).forEach((comp) => {
          compensationMap.set(comp.compensation_plan_name, comp.plan_data);
        });
        const enrichedEmployeesMap = new Map();
        (employeesRes.data.data || []).forEach((emp) => {
          if (!enrichedEmployeesMap.has(emp.employee_id)) {
            enrichedEmployeesMap.set(emp.employee_id, {
              ...emp,
              plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
            });
          } else {
            console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
          }
        });
        const enrichedEmployees = Array.from(enrichedEmployeesMap.values());
        setEmployees(enrichedEmployees);
        setAdvances(advancesRes.data.data || []);
        setOvertimeRecords(overtimeRes.data.data || []);
        setBonusRecords(bonusRes.data.data || []);
        const lopDataPromises = enrichedEmployees.map((emp) =>
          calculateLOPEffect(emp.employee_id)
            .then((result) => ({
              employeeId: emp.employee_id,
              lopData: result,
            }))
            .catch((err) => {
              console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
              return {
                employeeId: emp.employee_id,
                lopData: {
                  currentMonth: { days: 0, value: "0.00", currency: "INR" },
                  deferred: { days: 0, value: "0.00", currency: "INR" },
                  nextMonth: { days: 0, value: "0.00", currency: "INR" },
                  yearly: { days: 0, value: "0.00", currency: "INR" },
                },
              };
            })
        );
        const lopDataResults = await Promise.all(lopDataPromises);
        const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
          acc[employeeId] = lopData;
          return acc;
        }, {});
        setEmployeeLopData(lopDataMap);
        const incentiveDataPromises = enrichedEmployees.map((emp) =>
          calculateIncentives(emp.employee_id)
            .then((result) => ({
              employeeId: emp.employee_id,
              incentiveData: result,
            }))
            .catch((err) => {
              console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
              return {
                employeeId: emp.employee_id,
                incentiveData: {
                  ctcIncentive: { value: "0.00", currency: "INR" },
                  salesIncentive: { value: "0.00", currency: "INR" },
                  totalIncentive: { value: "0.00", currency: "INR" },
                },
              };
            })
        );
        const incentiveDataResults = await Promise.all(incentiveDataPromises);
        const incentiveDataMap = incentiveDataResults.reduce(
          (acc, { employeeId, incentiveData }) => {
            const key = String(employeeId).toUpperCase();
            if (!acc[key] || parseFloat(incentiveData.totalIncentive.value) > 0) {
              acc[key] = incentiveData;
            }
            return acc;
          },
          {}
        );
        setEmployeeIncentiveData(incentiveDataMap);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalaryBreakupData();
  }, []);

  const filteredEmployees = (employees || []).filter(
    (emp) =>
      emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowSelect = (employeeId) => {
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.employee_id)));
    }
  };

  const isAllSelected = selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0;

  const getSelectedEmployees = () => employees.filter(emp => selectedEmployees.has(emp.employee_id));

  const handleProceed = async () => {
    if (selectedEmployees.size === 0) {
      alert("Please select at least one employee.");
      return;
    }
    try {
      const employeeIds = Array.from(selectedEmployees);
      const personalRes = await axios.post(
        `${BASE_URL}/api/compensation/employee-personal-details`,
        { employeeIds },
        { headers: requestHeaders }
      );
      setPersonalMap(personalRes.data.data || {});
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error fetching personal details for preview:', error);
      alert('Failed to fetch employee details for preview');
      setShowPreviewModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowPreviewModal(false);
    setPersonalMap({});
    setShowBankReportOptions(false); // Reset bank report options
  };

  const downloadExcel = (employeesToExport = filteredEmployees) => {
    if (employeesToExport.length === 0) return;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;
    const currentMonthStr = String(currentMonthNum).padStart(2, '0');
    const currentYm = `${currentYear}-${currentMonthStr}`;
    const lastMonthIndex = currentMonthNum - 2;
    const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
    const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
    const headers = [
      'ID',
      'Name',
      'Annual CTC',
      'Basic Salary',
      'HRA',
      'LTA',
      'Other Allowances',
      'Incentives',
      'Overtime',
      'Statutory Bonus',
      'Bonus',
      'Advance Recovery',
      'Employee PF',
      'Employer PF',
      'ESIC',
      'Gratuity',
      'Professional Tax',
      'TDS',
      'Insurance',
      'LOP Days',
      'LOP Deduction',
      'Gross Salary',
      'Net Salary'
    ];
    const rows = employeesToExport.map((emp) => {
      const salaryDetails = calculateSalaryDetails(
        emp.ctc,
        emp.plan_data,
        emp.employee_id,
        overtimeRecords || [],
        bonusRecords || [],
        advances || [],
        employeeIncentiveData || {},
        employeeLopData
      );
      const lopData =
        employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
          currentMonth: { days: 0, value: '0.00', currency: 'INR' },
          deferred: { days: 0, value: '0.00', currency: 'INR' },
          nextMonth: { days: 0, value: '0.00', currency: 'INR' },
          yearly: { days: 0, value: '0.00', currency: 'INR' },
        } : {
          currentMonth: { days: 0, value: '0.00', currency: 'INR' },
          deferred: { days: 0, value: '0.00', currency: 'INR' },
          nextMonth: { days: 0, value: '0.00', currency: 'INR' },
          yearly: { days: 0, value: '0.00', currency: 'INR' },
        };
      const lopDays = lopData.yearly ? lopData.yearly.days : 0;
      const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
      const empId = String(emp.employee_id).toUpperCase();
      const incentiveObj = employeeIncentiveData[empId];
      let incentiveValue = 0;
      if (incentiveObj && incentiveObj.incentives) {
        const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
        incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
      }
      const employeeOvertime = overtimeRecords.filter((ot) => {
        const workDate = parseWorkDate(ot.work_date);
        const createdDate = parseWorkDate(ot.created_at);
        return (
          ot.employee_id === emp.employee_id &&
          ot.status === 'Approved' &&
          workDate &&
          workDate >= startWorkDate &&
          workDate <= endWorkDate &&
          createdDate &&
          createdDate.getFullYear() === currentYear &&
          String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
        );
      });
      let totalOvertimePay = 0;
      if (employeeOvertime.length > 0) {
        totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
          const hours = parseFloat(ot.extra_hours);
          let rate = parseFloat(ot.rate);
          if (isNaN(rate) || rate <= 0) {
            if (
              emp.plan_data.isOvertimePay &&
              emp.plan_data.overtimePayAmount &&
              !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
            ) {
              rate = parseFloat(emp.plan_data.overtimePayAmount);
            } else {
              rate = 500;
            }
          }
          return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
        }, 0);
      }
      const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
      const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
      const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
      const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
      const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
      const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
      const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
      const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
      const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
      const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
      const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
      const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
      const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
      const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
      const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
      const netSalary = grossSalary - totalDeductions;
      return [
        emp.employee_id,
        emp.full_name,
        emp.ctc ? parseFloat(emp.ctc) : 0,
        basicSalary,
        hra,
        ltaAllowance,
        otherAllowances,
        incentiveValue,
        totalOvertimePay,
        statutoryBonus,
        recordBonusPay,
        advanceRecovery,
        employeePF,
        salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
        esic,
        gratuity,
        professionalTax,
        tds,
        insurance,
        lopDays,
        lopDeduction,
        grossSalary,
        netSalary > 0 ? netSalary : 0
      ];
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const colWidths = [
      { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 8 },
      { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
      { wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
      { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 }
    ];
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Details");
    XLSX.writeFile(wb, 'salary-details.xlsx');
  };

  const generateBankReportData = (selectedData) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;
    const currentMonthStr = String(currentMonthNum).padStart(2, '0');
    const currentYm = `${currentYear}-${currentMonthStr}`;
    const lastMonthIndex = currentMonthNum - 2;
    const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
    const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);

    const headers = ['ID', 'Name', 'PAN Number', 'UAN Number', 'Net Payable'];
    const rows = selectedData.map((emp) => {
      const salaryDetails = calculateSalaryDetails(
        emp.ctc,
        emp.plan_data,
        emp.employee_id,
        overtimeRecords || [],
        bonusRecords || [],
        advances || [],
        employeeIncentiveData || {},
        employeeLopData
      );
      const lopData =
        employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
          currentMonth: { days: 0, value: '0.00', currency: 'INR' },
          deferred: { days: 0, value: '0.00', currency: 'INR' },
          nextMonth: { days: 0, value: '0.00', currency: 'INR' },
          yearly: { days: 0, value: '0.00', currency: 'INR' },
        } : {
          currentMonth: { days: 0, value: '0.00', currency: 'INR' },
          deferred: { days: 0, value: '0.00', currency: 'INR' },
          nextMonth: { days: 0, value: '0.00', currency: 'INR' },
          yearly: { days: 0, value: '0.00', currency: 'INR' },
        };
      const lopDays = lopData.yearly ? lopData.yearly.days : 0;
      const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
      const empId = String(emp.employee_id).toUpperCase();
      const incentiveObj = employeeIncentiveData[empId];
      let incentiveValue = 0;
      if (incentiveObj && incentiveObj.incentives) {
        const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
        incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
      }
      const employeeOvertime = overtimeRecords.filter((ot) => {
        const workDate = parseWorkDate(ot.work_date);
        const createdDate = parseWorkDate(ot.created_at);
        return (
          ot.employee_id === emp.employee_id &&
          ot.status === 'Approved' &&
          workDate &&
          workDate >= startWorkDate &&
          workDate <= endWorkDate &&
          createdDate &&
          createdDate.getFullYear() === currentYear &&
          String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
        );
      });
      let totalOvertimePay = 0;
      if (employeeOvertime.length > 0) {
        totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
          const hours = parseFloat(ot.extra_hours);
          let rate = parseFloat(ot.rate);
          if (isNaN(rate) || rate <= 0) {
            if (
              emp.plan_data.isOvertimePay &&
              emp.plan_data.overtimePayAmount &&
              !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
            ) {
              rate = parseFloat(emp.plan_data.overtimePayAmount);
            } else {
              rate = 500;
            }
          }
          return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
        }, 0);
      }
      const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
      const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
      const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
      const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
      const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
      const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
      const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
      const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
      const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
      const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
      const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
      const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
      const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
      const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
      const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
      const netSalary = grossSalary - totalDeductions;
      const personalDetails = personalMap[emp.employee_id] || { pan_number: 'N/A', uan_number: 'N/A' };
      return {
        row: [
          emp.employee_id,
          emp.full_name,
          personalDetails.pan_number,
          personalDetails.uan_number,
          netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'
        ],
        netSalary
      };
    });
    return { headers, rows };
  };

  const downloadBankReportExcel = async () => {
    const selectedData = getSelectedEmployees();
    if (selectedData.length === 0) return;
    try {
      const { headers, rows } = generateBankReportData(selectedData);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows.map(r => r.row)]);
      const colWidths = [
        { wch: 8 }, { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 15 }
      ];
      ws['!cols'] = colWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bank Report");
      XLSX.writeFile(wb, 'bank-report.xlsx');
    } catch (error) {
      console.error('Error generating bank report Excel:', error);
      alert('Failed to generate bank report Excel');
    }
  };

  const downloadBankReportPDF = async () => {
    const selectedData = getSelectedEmployees();
    if (selectedData.length === 0) return;
    try {
      const { headers, rows } = generateBankReportData(selectedData);
      const doc = new jsPDF('portrait');
      let y = 20;
      doc.setFontSize(16);
      doc.text('Bank Report', 105, y, { align: 'center' });
      y += 10;
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, y);
      doc.text(`Total Selected: ${selectedData.length}`, 190, y, { align: 'right' });
      y += 15;
      autoTable(doc, {
        head: [headers],
        body: rows.map(r => r.row),
        startY: y,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [248, 249, 250],
          textColor: [73, 80, 87],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'left', cellWidth: 40 },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'right' },
        },
        margin: { top: y },
      });
      doc.save(`bank-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating bank report PDF:', error);
      alert('Failed to generate bank report PDF');
    }
  };

  const handleDownloadBankReport = async (format) => {
    const selectedData = getSelectedEmployees();
    if (selectedData.length === 0) {
      alert('No employees selected.');
      return;
    }
    try {
      const employeeIds = selectedData.map(emp => emp.employee_id);
      const personalRes = await axios.post(
        `${BASE_URL}/api/compensation/employee-personal-details`,
        { employeeIds },
        { headers: requestHeaders }
      );
      setPersonalMap(personalRes.data.data || {});
      if (format === 'excel') {
        await downloadBankReportExcel();
      } else if (format === 'pdf') {
        await downloadBankReportPDF();
      } else if (format === 'both') {
        await downloadBankReportExcel();
        await downloadBankReportPDF();
      }
      setShowBankReportOptions(false);
      setShowPreviewModal(false);
    } catch (error) {
      console.error('Error fetching personal details for bank report:', error);
      alert('Failed to fetch employee details for bank report');
    }
  };

  const handleDownloadSelected = () => {
    const selectedData = getSelectedEmployees();
    downloadExcel(selectedData);
    setShowPreviewModal(false);
  };

  const handleSaveData = async () => {
    try {
      const selectedData = getSelectedEmployees();
      const fullSalaryData = selectedData.map((emp) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthNum = currentDate.getMonth() + 1;
        const currentMonthStr = String(currentMonthNum).padStart(2, '0');
        const currentYm = `${currentYear}-${currentMonthStr}`;
        const lastMonthIndex = currentMonthNum - 2;
        const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
        const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
        const salaryDetails = calculateSalaryDetails(
          emp.ctc,
          emp.plan_data,
          emp.employee_id,
          overtimeRecords || [],
          bonusRecords || [],
          advances || [],
          employeeIncentiveData || {},
          employeeLopData
        );
        const lopData =
          employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
            currentMonth: { days: 0, value: '0.00', currency: 'INR' },
            deferred: { days: 0, value: '0.00', currency: 'INR' },
            nextMonth: { days: 0, value: '0.00', currency: 'INR' },
            yearly: { days: 0, value: '0.00', currency: 'INR' },
          } : {
            currentMonth: { days: 0, value: '0.00', currency: 'INR' },
            deferred: { days: 0, value: '0.00', currency: 'INR' },
            nextMonth: { days: 0, value: '0.00', currency: 'INR' },
            yearly: { days: 0, value: '0.00', currency: 'INR' },
          };
        const lopDays = lopData.yearly ? lopData.yearly.days : 0;
        const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
        const empId = String(emp.employee_id).toUpperCase();
        const incentiveObj = employeeIncentiveData[empId];
        let incentiveValue = 0;
        if (incentiveObj && incentiveObj.incentives) {
          const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
          incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
        }
        const employeeOvertime = overtimeRecords.filter((ot) => {
          const workDate = parseWorkDate(ot.work_date);
          const createdDate = parseWorkDate(ot.created_at);
          return (
            ot.employee_id === emp.employee_id &&
            ot.status === 'Approved' &&
            workDate &&
            workDate >= startWorkDate &&
            workDate <= endWorkDate &&
            createdDate &&
            createdDate.getFullYear() === currentYear &&
            String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
          );
        });
        let totalOvertimePay = 0;
        if (employeeOvertime.length > 0) {
          totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
            const hours = parseFloat(ot.extra_hours);
            let rate = parseFloat(ot.rate);
            if (isNaN(rate) || rate <= 0) {
              if (
                emp.plan_data.isOvertimePay &&
                emp.plan_data.overtimePayAmount &&
                !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
              ) {
                rate = parseFloat(emp.plan_data.overtimePayAmount);
              } else {
                rate = 500;
              }
            }
            return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
          }, 0);
        }
        const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
        const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
        const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
        const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
        const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
        const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
        const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
        const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
        const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
        const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
        const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
        const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
        const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
        const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
        const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
        const netSalary = grossSalary - totalDeductions;
        return {
          employee_id: emp.employee_id,
          full_name: emp.full_name,
          annual_ctc: emp.ctc,
          basic_salary: basicSalary,
          hra,
          lta: ltaAllowance,
          other_allowances: otherAllowances,
          incentives: incentiveValue,
          overtime: totalOvertimePay,
          statutory_bonus: statutoryBonus,
          bonus: recordBonusPay,
          advance_recovery: advanceRecovery,
          employee_pf: employeePF,
          employer_pf: salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
          esic,
          gratuity,
          professional_tax: professionalTax,
          tds,
          insurance,
          lop_days: lopDays,
          lop_deduction: lopDeduction,
          gross_salary: grossSalary,
          net_salary: netSalary > 0 ? netSalary : 0
        };
      });

      const response = await axios.post(
        `${BASE_URL}/api/salary-details/save`,
        { salaryData: fullSalaryData },
        { headers: requestHeaders }
      );

      if (response.data.success) {
        alert(`Data saved successfully in table: ${response.data.tableName}`);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save data");
    }
    setShowPreviewModal(false);
  };

  const renderTableRows = (employeesToRender) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;
    const currentMonthStr = String(currentMonthNum).padStart(2, '0');
    const currentYm = `${currentYear}-${currentMonthStr}`;
    const lastMonthIndex = currentMonthNum - 2;
    const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
    const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
    return (
      <tbody className="sd-table-body">
        {employeesToRender.map((emp) => {
          const salaryDetails = calculateSalaryDetails(
            emp.ctc,
            emp.plan_data,
            emp.employee_id,
            overtimeRecords || [],
            bonusRecords || [],
            advances || [],
            employeeIncentiveData || {},
            employeeLopData
          );
          const lopData =
            employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            } : {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            };
          const lopDays = lopData.yearly ? lopData.yearly.days : 0;
          const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
          const empId = String(emp.employee_id).toUpperCase();
          const incentiveObj = employeeIncentiveData[empId];
          let incentiveValue = 0;
          if (incentiveObj && incentiveObj.incentives) {
            const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
            incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
          }
          const employeeOvertime = overtimeRecords.filter((ot) => {
            const workDate = parseWorkDate(ot.work_date);
            const createdDate = parseWorkDate(ot.created_at);
            return (
              ot.employee_id === emp.employee_id &&
              ot.status === 'Approved' &&
              workDate &&
              workDate >= startWorkDate &&
              workDate <= endWorkDate &&
              createdDate &&
              createdDate.getFullYear() === currentYear &&
              String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
            );
          });
          let totalOvertimePay = 0;
          if (employeeOvertime.length > 0) {
            totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
              const hours = parseFloat(ot.extra_hours);
              let rate = parseFloat(ot.rate);
              if (isNaN(rate) || rate <= 0) {
                if (
                  emp.plan_data.isOvertimePay &&
                  emp.plan_data.overtimePayAmount &&
                  !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
                ) {
                  rate = parseFloat(emp.plan_data.overtimePayAmount);
                } else {
                  rate = 500;
                }
              }
              return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
            }, 0);
          }
          const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
          const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
          const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
          const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
          const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
          const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
          const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
          const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
          const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
          const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
          const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
          const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
          const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
          const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
          const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
          const netSalary = grossSalary - totalDeductions;
          const isSelected = selectedEmployees.has(emp.employee_id);
          return (
            <tr key={emp.employee_id}>
              <td className="sd-table-cell sd-align-center sd-select-column sd-sticky-col sd-sticky-checkbox" style={{left: 0, borderRight: '1px solid #dee2e6', zIndex: 10}}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleRowSelect(emp.employee_id)}
                />
              </td>
              <td className="sd-table-cell sd-align-left sd-id-column sd-sticky-col sd-sticky-id" style={{left: '40px', borderRight: '1px solid #dee2e6', zIndex: 10}}>{emp.employee_id}</td>
              <td className="sd-table-cell sd-align-left sd-name-column sd-sticky-col sd-sticky-name" style={{left: '110px', borderRight: '1px solid #dee2e6', zIndex: 10}}>{emp.full_name}</td>
              <td className="sd-table-cell sd-align-right sd-sticky-col sd-sticky-ctc" style={{left: '260px', borderRight: '1px solid #dee2e6', zIndex: 10}}>
                {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {basicSalary > 0 ? `₹${basicSalary.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {hra > 0 ? `₹${hra.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {ltaAllowance > 0 ? `₹${ltaAllowance.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {otherAllowances > 0 ? `₹${otherAllowances.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {totalOvertimePay > 0 ? `₹${totalOvertimePay.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {statutoryBonus > 0 ? `₹${statutoryBonus.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {recordBonusPay > 0 ? `₹${recordBonusPay.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {advanceRecovery > 0 ? `₹${advanceRecovery.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {employeePF > 0 ? `₹${employeePF.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {esic > 0 ? `₹${esic.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {gratuity > 0 ? `₹${gratuity.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {professionalTax > 0 ? `₹${professionalTax.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {tds > 0 ? `₹${tds.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {insurance > 0 ? `₹${insurance.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {lopDays}
              </td>
              <td className="sd-table-cell sd-align-right sd-deduction">
                {lopDeduction > 0 ? `₹${lopDeduction.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {grossSalary > 0 ? `₹${grossSalary.toLocaleString()}` : 'N/A'}
              </td>
              <td className="sd-table-cell sd-align-right">
                {netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderPreviewTableRows = (employeesToRender) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;
    const currentMonthStr = String(currentMonthNum).padStart(2, '0');
    const currentYm = `${currentYear}-${currentMonthStr}`;
    const lastMonthIndex = currentMonthNum - 2;
    const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
    const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);
    return (
      <tbody>
        {employeesToRender.map((emp) => {
          const salaryDetails = calculateSalaryDetails(
            emp.ctc,
            emp.plan_data,
            emp.employee_id,
            overtimeRecords || [],
            bonusRecords || [],
            advances || [],
            employeeIncentiveData || {},
            employeeLopData
          );
          const lopData =
            employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            } : {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            };
          const lopDays = lopData.yearly ? lopData.yearly.days : 0;
          const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');
          const empId = String(emp.employee_id).toUpperCase();
          const incentiveObj = employeeIncentiveData[empId];
          let incentiveValue = 0;
          if (incentiveObj && incentiveObj.incentives) {
            const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
            incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
          }
          const employeeOvertime = overtimeRecords.filter((ot) => {
            const workDate = parseWorkDate(ot.work_date);
            const createdDate = parseWorkDate(ot.created_at);
            return (
              ot.employee_id === emp.employee_id &&
              ot.status === 'Approved' &&
              workDate &&
              workDate >= startWorkDate &&
              workDate <= endWorkDate &&
              createdDate &&
              createdDate.getFullYear() === currentYear &&
              String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
            );
          });
          let totalOvertimePay = 0;
          if (employeeOvertime.length > 0) {
            totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
              const hours = parseFloat(ot.extra_hours);
              let rate = parseFloat(ot.rate);
              if (isNaN(rate) || rate <= 0) {
                if (
                  emp.plan_data.isOvertimePay &&
                  emp.plan_data.overtimePayAmount &&
                  !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
                ) {
                  rate = parseFloat(emp.plan_data.overtimePayAmount);
                } else {
                  rate = 500;
                }
              }
              return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
            }, 0);
          }
          const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
          const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
          const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
          const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
          const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
          const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
          const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;
          const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
          const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
          const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
          const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
          const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
          const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
          const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
          const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
          const netSalary = grossSalary - totalDeductions;
          return (
            <tr key={emp.employee_id}>
              <td className="sd-preview-table-cell">{emp.employee_id}</td>
              <td className="sd-preview-table-cell">{emp.full_name}</td>
              <td className="sd-preview-table-cell">{personalMap[emp.employee_id]?.pan_number || 'N/A'}</td>
              <td className="sd-preview-table-cell">{personalMap[emp.employee_id]?.uan_number || 'N/A'}</td>
              <td className="sd-preview-table-cell sd-align-right">
                {netSalary > 0 ? `₹${netSalary.toLocaleString()}` : 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  if (isLoading) {
    return <div className="sd-loading">Loading...</div>;
  }

  const selectedData = getSelectedEmployees();
  return (
    <div className="sd-container">
      <div className="sd-header">
        <div className="sd-header-title">Employee Salary Overview</div>
      </div>
      <div className="sd-info-bar">
        <div className="sd-working-days">
          Total Working Days: {workingDays !== null ? workingDays : 'N/A'}
        </div>
        <div className="sd-controls-right">
          <div className="sd-search-container">
            <input
              type="text"
              className="sd-search-input"
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="sd-proceed-button" onClick={handleProceed}>
            Proceed to Report
          </button>
        </div>
      </div>
      {filteredEmployees.length > 0 ? (
        <div className="sd-table-section">
          <div className="sd-table-container">
            <div className="sd-table-wrapper">
              <table className="sd-table">
                <thead className="sd-table-head">
                  <tr>
                    <th className="sd-table-header sd-align-center sd-select-column sd-sticky-col sd-sticky-checkbox" style={{left: 0, borderRight: '1px solid #dee2e6', zIndex: 13}}>
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="sd-table-header sd-align-left sd-id-column sd-sticky-col sd-sticky-id" style={{left: '40px', borderRight: '1px solid #dee2e6', zIndex: 13}}>ID</th>
                    <th className="sd-table-header sd-align-left sd-name-column sd-sticky-col sd-sticky-name" style={{left: '110px', borderRight: '1px solid #dee2e6', zIndex: 13}}>Name</th>
                    <th className="sd-table-header sd-align-right sd-sticky-col sd-sticky-ctc" style={{left: '260px', borderRight: '1px solid #dee2e6', zIndex: 13}}>Annual CTC</th>
                    <th className="sd-table-header sd-align-right">Basic Salary</th>
                    <th className="sd-table-header sd-align-right">HRA</th>
                    <th className="sd-table-header sd-align-right">LTA</th>
                    <th className="sd-table-header sd-align-right">Other Allowances</th>
                    <th className="sd-table-header sd-align-right">Incentives</th>
                    <th className="sd-table-header sd-align-right">Overtime</th>
                    <th className="sd-table-header sd-align-right">Statutory Bonus</th>
                    <th className="sd-table-header sd-align-right">Bonus</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Advance Recovery</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Employee PF</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Employer PF</th>
                    <th className="sd-table-header sd-align-right sd-deduction">ESIC</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Gratuity</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Professional Tax</th>
                    <th className="sd-table-header sd-align-right sd-deduction">TDS</th>
                    <th className="sd-table-header sd-align-right sd-deduction">Insurance</th>
                    <th className="sd-table-header sd-align-right sd-deduction">LOP Days</th>
                    <th className="sd-table-header sd-align-right sd-deduction">LOP Deduction</th>
                    <th className="sd-table-header sd-align-right">Gross Salary</th>
                    <th className="sd-table-header sd-align-right">Net Salary</th>
                  </tr>
                </thead>
                {renderTableRows(filteredEmployees)}
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p className="sd-no-data">No employees found</p>
      )}
      {showPreviewModal && (
        <div className="sd-preview-modal">
          <div className="sd-preview-overlay" onClick={handleCloseModal}></div>
          <div className="sd-preview-content">
            <div className="sd-preview-header">
              <h2>Selected Employees Salary Preview ({selectedData.length} selected)</h2>
              <button className="sd-close-button" onClick={handleCloseModal}>×</button>
            </div>
            <div className="sd-preview-table-wrapper">
              <table className="sd-preview-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>PAN Number</th>
                    <th>UAN Number</th>
                    <th className="sd-align-right">Net Payable</th>
                  </tr>
                </thead>
                {renderPreviewTableRows(selectedData)}
              </table>
            </div>
            <div className="sd-preview-footer">
              <button className="sd-download-button" onClick={handleDownloadSelected}>
                Generate Excel Sheet
              </button>
              <button className="sd-save-button" onClick={handleSaveData}>
                Save Data
              </button>
              <button
                className="sd-bank-button"
                onClick={() => setShowBankReportOptions(!showBankReportOptions)}
              >
                Generate Bank Report
              </button>
              {showBankReportOptions && (
                <div className="sd-bank-report-options">
                  <button onClick={() => handleDownloadBankReport('excel')}>
                    Excel Only
                  </button>
                  <button onClick={() => handleDownloadBankReport('pdf')}>
                    PDF Only
                  </button>
                  <button onClick={() => handleDownloadBankReport('both')}>
                    Both Excel & PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryDetails;