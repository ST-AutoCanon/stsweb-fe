

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
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
//   const [workingDays, setWorkingDays] = useState(null); // New state for working days
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search
//   const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Track selected employee IDs
//   const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state
//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
//   const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
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
//       console.log("Fetching data with headers:", headers);
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
//           axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
//             console.error("Error fetching compensations/list:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
//             console.error("Error fetching compensation/assigned:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
//             console.error("Error fetching compensation/advance-details:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
//             console.error("Error fetching compensation/overtime-status-summary:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
//             console.error("Error fetching compensation/bonus-list:", err);
//             throw err;
//           }),
//           axios.get(`${BASE_URL}/api/compensation/working-days`, { headers }).catch(err => {
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
//   // Get selected employees data
//   const getSelectedEmployees = () => filteredEmployees.filter(emp => selectedEmployees.has(emp.employee_id));
//   // Handle proceed: show preview if selected, else alert
//   const handleProceed = () => {
//     if (selectedEmployees.size === 0) {
//       alert("Please select at least one employee.");
//       return;
//     }
//     setShowPreviewModal(true);
//   };
//   // Close modal
//   const handleCloseModal = () => {
//     setShowPreviewModal(false);
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
//       'Income Tax',
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
//       { wch: 10 }, // Income Tax
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
//   // Download for selected in preview
//   const handleDownloadSelected = () => {
//     const selectedData = getSelectedEmployees();
//     downloadExcel(selectedData);
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
//   // Render preview table rows (similar to main, but no checkboxes) - No sticky needed in preview modal as it's separate
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
//               <td className="sd-preview-table-cell sd-align-right">
//                 {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {basicSalary > 0 ? `₹${basicSalary.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {hra > 0 ? `₹${hra.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {ltaAllowance > 0 ? `₹${ltaAllowance.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {otherAllowances > 0 ? `₹${otherAllowances.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {totalOvertimePay > 0 ? `₹${totalOvertimePay.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {statutoryBonus > 0 ? `₹${statutoryBonus.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {recordBonusPay > 0 ? `₹${recordBonusPay.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {advanceRecovery > 0 ? `₹${advanceRecovery.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {employeePF > 0 ? `₹${employeePF.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {esic > 0 ? `₹${esic.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {gratuity > 0 ? `₹${gratuity.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {professionalTax > 0 ? `₹${professionalTax.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {tds > 0 ? `₹${tds.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {insurance > 0 ? `₹${insurance.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {lopDays}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right sd-deduction">
//                 {lopDeduction > 0 ? `₹${lopDeduction.toLocaleString()}` : 'N/A'}
//               </td>
//               <td className="sd-preview-table-cell sd-align-right">
//                 {grossSalary > 0 ? `₹${grossSalary.toLocaleString()}` : 'N/A'}
//               </td>
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
//             Proceed
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
//                     <th className="sd-table-header sd-align-right sd-deduction">Income Tax</th>
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
//                     <th className="sd-align-right">Annual CTC</th>
//                     <th className="sd-align-right">Basic Salary</th>
//                     <th className="sd-align-right">HRA</th>
//                     <th className="sd-align-right">LTA</th>
//                     <th className="sd-align-right">Other Allowances</th>
//                     <th className="sd-align-right">Incentives</th>
//                     <th className="sd-align-right">Overtime</th>
//                     <th className="sd-align-right">Statutory Bonus</th>
//                     <th className="sd-align-right">Bonus</th>
//                     <th className="sd-align-right sd-deduction">Advance Recovery</th>
//                     <th className="sd-align-right sd-deduction">Employee PF</th>
//                     <th className="sd-align-right sd-deduction">Employer PF</th>
//                     <th className="sd-align-right sd-deduction">ESIC</th>
//                     <th className="sd-align-right sd-deduction">Gratuity</th>
//                     <th className="sd-align-right sd-deduction">Professional Tax</th>
//                     <th className="sd-align-right sd-deduction">Income Tax</th>
//                     <th className="sd-align-right sd-deduction">Insurance</th>
//                     <th className="sd-align-right sd-deduction">LOP Days</th>
//                     <th className="sd-align-right sd-deduction">LOP Deduction</th>
//                     <th className="sd-align-right">Gross Salary</th>
//                     <th className="sd-align-right">Net Salary</th>
//                   </tr>
//                 </thead>
//                 {renderPreviewTableRows(selectedData)}
//               </table>
//             </div>
//             <div className="sd-preview-footer">
//               <button className="sd-download-button" onClick={handleDownloadSelected}>
//                 Generate Excel Sheet
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
  const [workingDays, setWorkingDays] = useState(null); // New state for working days
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Internal state for search
  const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Track selected employee IDs
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

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
      console.log("Fetching data with headers:", headers);
      try {
        setIsLoading(true);
        const [
          compensationsRes,
          employeesRes,
          advancesRes,
          overtimeRes,
          bonusRes,
          workingDaysRes, // New API call
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
            console.error("Error fetching compensations/list:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
            console.error("Error fetching compensation/assigned:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
            console.error("Error fetching compensation/advance-details:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
            console.error("Error fetching compensation/overtime-status-summary:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
            console.error("Error fetching compensation/bonus-list:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/working-days`, { headers }).catch(err => {
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
        // Set working days - extract from response.data.data.totalWorkingDays
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

  // Handle individual row selection
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

  // Handle select all
  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.employee_id)));
    }
  };

  // Check if all filtered are selected
  const isAllSelected = selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0;

  // Get selected employees data
  const getSelectedEmployees = () => filteredEmployees.filter(emp => selectedEmployees.has(emp.employee_id));

  // Handle proceed: show preview if selected, else alert
  const handleProceed = () => {
    if (selectedEmployees.size === 0) {
      alert("Please select at least one employee.");
      return;
    }
    setShowPreviewModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowPreviewModal(false);
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
      'Income Tax',
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
      // Calculate incentive for this employee
      const empId = String(emp.employee_id).toUpperCase();
      const incentiveObj = employeeIncentiveData[empId];
      let incentiveValue = 0;
      if (incentiveObj && incentiveObj.incentives) {
        const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
        incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
      }
      // Calculate overtime for this employee
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
              rate = 500; // Fallback default rate
            }
          }
          return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
        }, 0);
      }
      // Compute gross and net
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
    // Optional: Adjust column widths
    const colWidths = [
      { wch: 8 }, // ID
      { wch: 15 }, // Name
      { wch: 12 }, // Annual CTC
      { wch: 12 }, // Basic Salary
      { wch: 10 }, // HRA
      { wch: 8 }, // LTA
      { wch: 12 }, // Other Allowances
      { wch: 10 }, // Incentives
      { wch: 10 }, // Overtime
      { wch: 8 }, // Statutory Bonus
      { wch: 8 }, // Bonus
      { wch: 12 }, // Advance Recovery
      { wch: 10 }, // Employee PF
      { wch: 12 }, // Employer PF
      { wch: 8 }, // ESIC
      { wch: 10 }, // Gratuity
      { wch: 12 }, // Professional Tax
      { wch: 10 }, // Income Tax
      { wch: 10 }, // Insurance
      { wch: 8 }, // LOP Days
      { wch: 10 }, // LOP Deduction
      { wch: 12 }, // Gross Salary
      { wch: 12 }, // Net Salary
    ];
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Details");
    XLSX.writeFile(wb, 'salary-details.xlsx');
  };

  // Download for selected in preview
  const handleDownloadSelected = () => {
    const selectedData = getSelectedEmployees();
    downloadExcel(selectedData);
    setShowPreviewModal(false);
  };

  // Save data to backend
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
        // Calculate incentive for this employee
        const empId = String(emp.employee_id).toUpperCase();
        const incentiveObj = employeeIncentiveData[empId];
        let incentiveValue = 0;
        if (incentiveObj && incentiveObj.incentives) {
          const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
          incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
        }
        // Calculate overtime for this employee
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
                rate = 500; // Fallback default rate
              }
            }
            return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
          }, 0);
        }
        // Compute gross and net
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
          income_tax: tds,
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
        { headers }
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

  // Placeholder for PDF generation
  const handleGeneratePDF = () => {
    alert("PDF generation TBD - Implement with jsPDF or similar library");
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
          // Calculate incentive for this employee
          const empId = String(emp.employee_id).toUpperCase();
          const incentiveObj = employeeIncentiveData[empId];
          let incentiveValue = 0;
          if (incentiveObj && incentiveObj.incentives) {
            const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
            incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
          }
          // Calculate overtime for this employee
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
                  rate = 500; // Fallback default rate
                }
              }
              return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
            }, 0);
          }
          // Compute gross and net
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

  // Render preview table rows (only ID, Name, Net Payable) - No sticky needed in preview modal as it's separate
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
          // Calculate incentive for this employee
          const empId = String(emp.employee_id).toUpperCase();
          const incentiveObj = employeeIncentiveData[empId];
          let incentiveValue = 0;
          if (incentiveObj && incentiveObj.incentives) {
            const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
            incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
          }
          // Calculate overtime for this employee
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
                  rate = 500; // Fallback default rate
                }
              }
              return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
            }, 0);
          }
          // Compute gross and net
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
    return <div className="sd-loading">Loading...</div>; // Simple loading state
  }

  const selectedData = getSelectedEmployees();
  return (
    <div className="sd-container">
      <div className="sd-header">
        <div className="sd-header-title">Employee Salary Overview</div>
      </div>
      {/* New Info Bar: Working Days (left) and Search + Proceed (right) */}
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
                    <th className="sd-table-header sd-align-right sd-deduction">Income Tax</th>
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
      {/* Preview Modal */}
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
              <button className="sd-pdf-button" onClick={handleGeneratePDF}>
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryDetails;