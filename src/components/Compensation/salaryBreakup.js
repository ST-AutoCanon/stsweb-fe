// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Modal from "../Modal/Modal";
// // import "./salaryBreakup.css";
// // import { calculateSalaryDetails, calculateTotals, getMonthlySalary, calculateAdvancePerIteration, parseApplicableMonth, parseWorkDate } from "../../utils/SalaryCalculations.js";

// // const SalaryBreakup = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [allEmployees, setAllEmployees] = useState([]);
// //   const [advances, setAdvances] = useState([]);
// //   const [overtimeRecords, setOvertimeRecords] = useState([]);
// //   const [bonusRecords, setBonusRecords] = useState([]);
// //   const [lopDetails, setLopDetails] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [bonusModal, setBonusModal] = useState({
// //     isVisible: false,
// //     percentageCtc: "",
// //     monthlySalaryCount: "",
// //     fixedAmount: "",
// //     selectedMonth: "",
// //     selectedYear: new Date().getFullYear().toString(),
// //     selectedOption: "",
// //     error: "",
// //   });
// //   const [advanceModal, setAdvanceModal] = useState({
// //     isVisible: false,
// //     employeeId: null,
// //     fullName: "",
// //     advanceAmount: "",
// //     recoveryMonths: "",
// //     applicableMonth: "",
// //     error: "",
// //   });
// //   const [messageModal, setMessageModal] = useState({
// //     isVisible: false,
// //     title: "",
// //     message: "",
// //     isError: false,
// //   });
// //   const [viewMode, setViewMode] = useState("main");
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);

// //   const API_KEY = process.env.REACT_APP_API_KEY;
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// //   const openBonusModal = () => {
// //     console.log("Opening Bonus Modal");
// //     setBonusModal({
// //       isVisible: true,
// //       percentageCtc: "",
// //       monthlySalaryCount: "",
// //       fixedAmount: "",
// //       selectedMonth: "",
// //       selectedYear: new Date().getFullYear().toString(),
// //       selectedOption: "",
// //       error: "",
// //     });
// //   };

// //   const closeBonusModal = () => {
// //     console.log("Closing Bonus Modal");
// //     setBonusModal({
// //       isVisible: false,
// //       percentageCtc: "",
// //       monthlySalaryCount: "",
// //       fixedAmount: "",
// //       selectedMonth: "",
// //       selectedYear: "",
// //       selectedOption: "",
// //       error: "",
// //     });
// //   };

// //   const openAdvanceModal = (employeeId, fullName) => {
// //     console.log(`Opening Advance Modal for employee ${employeeId}: ${fullName}`);
// //     setAdvanceModal({
// //       isVisible: true,
// //       employeeId,
// //       fullName,
// //       advanceAmount: "",
// //       recoveryMonths: "",
// //       applicableMonth: "",
// //       error: "",
// //     });
// //   };

// //   const closeAdvanceModal = () => {
// //     console.log("Closing Advance Modal");
// //     setAdvanceModal({
// //       isVisible: false,
// //       employeeId: null,
// //       fullName: "",
// //       advanceAmount: "",
// //       recoveryMonths: "",
// //       applicableMonth: "",
// //       error: "",
// //     });
// //   };

// //   const openNoPlanModal = () => {
// //     console.log("Opening No Plan Details View");
// //     setViewMode("noPlanDetails");
// //   };

// //   const openMessageModal = (title, message, isError = false) => {
// //     console.log(`Opening Message Modal: ${title} - ${message} (isError: ${isError})`);
// //     setMessageModal({
// //       isVisible: true,
// //       title,
// //       message,
// //       isError,
// //     });
// //   };

// //   const closeMessageModal = () => {
// //     console.log("Closing Message Modal");
// //     setMessageModal({
// //       isVisible: false,
// //       title: "",
// //       message: "",
// //       isError: false,
// //     });
// //   };

// //   const handleViewAllDetails = () => {
// //     console.log("Switching to All Details View");
// //     setViewMode("allDetails");
// //   };

// //   const handleViewSingleEmployee = (employee) => {
// //     console.log(`Viewing details for employee ${employee.employee_id}: ${employee.full_name}`);
// //     setSelectedEmployee(employee);
// //     setViewMode("singleEmployee");
// //   };

// //   const handleBackToMain = () => {
// //     console.log("Returning to Main View");
// //     setViewMode("main");
// //     setSelectedEmployee(null);
// //   };

// //   const handleBonusSubmit = async () => {
// //     console.log("Submitting Bonus Form", bonusModal);
// //     const { percentageCtc, monthlySalaryCount, fixedAmount, selectedMonth, selectedYear, selectedOption } = bonusModal;

// //     if (!selectedOption) {
// //       setBonusModal({ ...bonusModal, error: "Please select one bonus option." });
// //       return;
// //     }

// //     if (selectedOption === "percentageCtc" && (!percentageCtc || parseFloat(percentageCtc) <= 0 || parseFloat(percentageCtc) > 100)) {
// //       setBonusModal({ ...bonusModal, error: "Please enter a valid CTC percentage (0-100)." });
// //       return;
// //     }
// //     if (selectedOption === "monthlySalaryCount" && (!monthlySalaryCount || parseInt(monthlySalaryCount) < 1 || parseInt(monthlySalaryCount) > 10)) {
// //       setBonusModal({ ...bonusModal, error: "Please select a valid number of monthly salaries (1-10)." });
// //       return;
// //     }
// //     if (selectedOption === "fixedAmount" && (!fixedAmount || parseFloat(fixedAmount) <= 0)) {
// //       setBonusModal({ ...bonusModal, error: "Please enter a valid fixed amount greater than 0." });
// //       return;
// //     }
// //     if (!selectedMonth || !months.includes(selectedMonth)) {
// //       setBonusModal({ ...bonusModal, error: "Please select a valid month." });
// //       return;
// //     }
// //     if (!selectedYear || !/^\d{4}$/.test(selectedYear)) {
// //       setBonusModal({ ...bonusModal, error: "Please enter a valid year." });
// //       return;
// //     }

// //     const applicableMonth = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
// //     const payload = {
// //       percentageCtc: selectedOption === "percentageCtc" ? parseFloat(percentageCtc) : null,
// //       percentageMonthlySalary: selectedOption === "monthlySalaryCount" ? parseFloat(monthlySalaryCount) * 100 : null,
// //       fixedAmount: selectedOption === "fixedAmount" ? parseFloat(fixedAmount) : null,
// //       applicableMonth,
// //     };

// //     try {
// //       setIsLoading(true);
// //       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/add-bonus-bulk`;
// //       const response = await axios.post(url, payload, {
// //         headers: { "x-api-key": API_KEY, "x-employee-id": meId },
// //       });

// //       if (response.data.success) {
// //         openMessageModal("Success", `Bonus successfully added for ${selectedMonth} ${selectedYear}.`);
// //         const bonusResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/bonus-list`, {
// //           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
// //         });
// //         if (bonusResponse.data.success) {
// //           console.log("Updated bonusRecords after submit:", bonusResponse.data.data);
// //           setBonusRecords(bonusResponse.data.data || []);
// //         }
// //         closeBonusModal();
// //       } else {
// //         setBonusModal({ ...bonusModal, error: response.data.error || "Failed to add bonus" });
// //       }
// //     } catch (error) {
// //       console.error("Error adding bonus:", error);
// //       setBonusModal({
// //         ...bonusModal,
// //         error: error.response?.data?.error || error.message || "Network error",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleAdvanceSubmit = async () => {
// //     console.log("Submitting Advance Form", advanceModal);
// //     const { advanceAmount, recoveryMonths, employeeId, applicableMonth } = advanceModal;

// //     if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
// //       setAdvanceModal({ ...advanceModal, error: "Please enter a valid advance amount greater than 0." });
// //       return;
// //     }
// //     if (!recoveryMonths || parseInt(recoveryMonths) <= 0) {
// //       setAdvanceModal({ ...advanceModal, error: "Please enter a valid number of iterations (greater than 0)." });
// //       return;
// //     }
// //     if (!applicableMonth) {
// //       setAdvanceModal({ ...advanceModal, error: "Please select an applicable month." });
// //       return;
// //     }

// //     const monthlySalary = getMonthlySalary(employeeId, employees);
// //     if (parseFloat(advanceAmount) > monthlySalary) {
// //       setAdvanceModal({
// //         ...advanceModal,
// //         error: `Advance amount (₹${parseFloat(advanceAmount).toLocaleString()}) cannot exceed the employee's monthly salary (₹${monthlySalary.toLocaleString()}).`,
// //       });
// //       return;
// //     }

// //     const [year, month] = applicableMonth.split('-').map(Number);
// //     const existingAdvances = advances.filter((adv) => {
// //       if (!adv.applicable_months) return false;
// //       const advDate = parseApplicableMonth(adv.applicable_months);
// //       if (!advDate) return false;
// //       const advYear = advDate.getFullYear();
// //       const advMonth = advDate.getMonth() + 1;
// //       const recoveryMonths = parseInt(adv.recovery_months);
// //       const startMonth = advMonth;
// //       const startYear = advYear;
// //       let endYear = startYear;
// //       let endMonth = startMonth + recoveryMonths - 1;
// //       if (endMonth > 12) {
// //         endYear += Math.floor((endMonth - 1) / 12);
// //         endMonth = ((endMonth - 1) % 12) + 1;
// //       }
// //       const inputDate = new Date(year, month - 1);
// //       const startDate = new Date(startYear, startMonth - 1);
// //       const endDate = new Date(endYear, endMonth - 1);
// //       return (
// //         adv.employee_id === employeeId &&
// //         (adv.applicable_months === applicableMonth || (inputDate >= startDate && inputDate <= endDate))
// //       );
// //     });

// //     if (existingAdvances.length > 0) {
// //       const activeAdvance = existingAdvances[0];
// //       const advDate = parseApplicableMonth(activeAdvance.applicable_months);
// //       const recoveryMonths = parseInt(activeAdvance.recovery_months);
// //       const startMonth = advDate.getMonth() + 1;
// //       const startYear = advDate.getFullYear();
// //       let endMonth = startMonth + recoveryMonths - 1;
// //       let endYear = startYear;
// //       if (endMonth > 12) {
// //         endYear += Math.floor((endMonth - 1) / 12);
// //         endMonth = ((endMonth - 1) % 12) + 1;
// //       }
// //       const monthsLeft = (endYear - year) * 12 + (endMonth - month) + 1;
// //       setAdvanceModal({
// //         ...advanceModal,
// //         error: `An active advance of ₹${parseFloat(activeAdvance.advance_amount).toLocaleString()} is already in progress for this employee starting ${activeAdvance.applicable_months}, with ${monthsLeft} iteration(s) left until ${new Date(endYear, endMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}. No new advance can be added until the current one is fully recovered.`,
// //       });
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
// //       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance`;
// //       const response = await axios.post(
// //         url,
// //         {
// //           employeeId,
// //           advanceAmount: parseFloat(advanceAmount),
// //           recoveryMonths: parseInt(recoveryMonths),
// //           applicableMonth,
// //         },
// //         {
// //           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
// //         }
// //       );

// //       if (response.data.success) {
// //         openMessageModal("Success", `Advance of ₹${parseFloat(advanceAmount).toLocaleString()} added successfully for ${advanceModal.fullName}.`);
// //         const advancesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance-details`, {
// //           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
// //         });
// //         if (advancesResponse.data.success) {
// //           setAdvances(advancesResponse.data.data || []);
// //         }
// //         closeAdvanceModal();
// //       } else {
// //         setAdvanceModal({ ...advanceModal, error: response.data.message || "Failed to add advance" });
// //       }
// //     } catch (error) {
// //       console.error("Error adding advance:", error);
// //       setAdvanceModal({
// //         ...advanceModal,
// //         error: error.response?.data?.message || error.message || "Network error",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchSalaryBreakupData = async () => {
// //       try {
// //         setIsLoading(true);
// //         setBonusRecords([]);
// //         console.log("Reset bonusRecords before fetch");

// //         const baseUrl = process.env.REACT_APP_BACKEND_URL;
// //         const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

// //         const employeesResponse = await axios.get(`${baseUrl}/api/compensation/assigned`, { headers });
// //         if (employeesResponse.data.success) {
// //           setEmployees(employeesResponse.data.data || []);
// //         } else {
// //           throw new Error(employeesResponse.data.message || "Failed to fetch salary breakup data");
// //         }

// //         const allEmployeesResponse = await axios.get(`${baseUrl}/api/employees/names`, { headers });
// //         if (allEmployeesResponse.data.success) {
// //           setAllEmployees(allEmployeesResponse.data.data || []);
// //         } else {
// //           throw new Error(allEmployeesResponse.data.message || "Failed to fetch employee names");
// //         }

// //         const advancesResponse = await axios.get(`${baseUrl}/api/compensation/advance-details`, { headers });
// //         if (advancesResponse.data.success) {
// //           setAdvances(advancesResponse.data.data || []);
// //         } else {
// //           throw new Error(advancesResponse.data.message || "Failed to fetch advance details");
// //         }

// //         const overtimeResponse = await axios.get(`${baseUrl}/api/compensation/overtime-status-summary`, { headers });
// //         if (overtimeResponse.data.success) {
// //           setOvertimeRecords(overtimeResponse.data.data || []);
// //         } else {
// //           throw new Error(overtimeResponse.data.message || "Failed to fetch overtime details");
// //         }

// //         const bonusResponse = await axios.get(`${baseUrl}/api/compensation/bonus-list`, { headers });
// //         if (bonusResponse.data.success) {
// //           console.log("Fetched bonusRecords:", bonusResponse.data.data);
// //           setBonusRecords(bonusResponse.data.data || []);
// //         } else {
// //           throw new Error(bonusResponse.data.message || "Failed to fetch bonus details");
// //         }

// //         const lopResponse = await axios.get(`${baseUrl}/api/compensation/lop-details`, { headers });
// //         if (lopResponse.data.success) {
// //           console.log("Fetched lopDetails:", lopResponse.data.data);
// //           setLopDetails(lopResponse.data.data || []);
// //         } else {
// //           throw new Error(lopResponse.data.message || "Failed to fetch LOP details");
// //         }
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //         openMessageModal("Error", `Failed to fetch data: ${error.response?.data?.message || error.message || "Network error"}`, true);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (API_KEY && meId) {
// //       fetchSalaryBreakupData();
// //     } else {
// //       openMessageModal("Error", "Authentication credentials are missing.", true);
// //       setIsLoading(false);
// //     }
// //   }, [API_KEY, meId]);

// //   const getAvailableMonths = () => {
// //     const now = new Date();
// //     const currentYear = now.getFullYear();
// //     const currentMonth = now.getMonth() + 1;
// //     const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
// //     const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

// //     return [
// //       {
// //         value: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
// //         label: new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
// //       },
// //       {
// //         value: `${nextYear}-${nextMonth.toString().padStart(2, '0')}`,
// //         label: new Date(nextYear, nextMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
// //       },
// //     ];
// //   };

// //   const months = [
// //     "01", "02", "03", "04", "05", "06",
// //     "07", "08", "09", "10", "11", "12"
// //   ];

// //   const monthlySalaryOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

// //   const employeesWithoutPlans = allEmployees.filter(
// //     (emp) => !employees.some((assignedEmp) => assignedEmp.employee_id === emp.employee_id)
// //   );

// //   const totals = employees.length > 0 ? calculateTotals(employees, overtimeRecords, bonusRecords, advances, lopDetails) : null;

// //   return (
// //     <div className="sb-sb-container">
// //       {viewMode === "main" && (
// //         <>
// //           <div className="sb-sb-header-title">Salary Breakup</div>
// //           {isLoading ? (
// //             <div className="sb-sb-loading">Loading...</div>
// //           ) : employees.length > 0 || allEmployees.length > 0 ? (
// //             <div className="sb-sb-table-container">
// //               <div className="sb-sb-button-container">
// //                 <button className="sb-sb-no-plan-button" onClick={openNoPlanModal}>
// //                   View Employees Without Plans
// //                 </button>
// //                 <button className="sb-sb-add-bonus-button" onClick={openBonusModal}>
// //                   Add Bonus
// //                 </button>
// //                 <button className="sb-sb-view-all-button" onClick={handleViewAllDetails}>
// //                   View All Details
// //                 </button>
// //               </div>
// //               {totals && (
// //                 <div className="sb-sb-totals">
// //                   <h2 className="sb-sb-total-payroll">Total Payroll: ₹{totals.totalPayable.toLocaleString()}</h2>
// //                   <div className="sb-sb-totals-details">
// //                     <span>
// //                       <span className="sb-dot sb-payable"></span>Total Payable: ₹{totals.totalPayable.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-gross"></span>Total Gross: ₹{totals.totalGross.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-tds"></span>Total TDS: ₹{totals.totalTDS.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-advance"></span>Total Advance: ₹{totals.totalAdvance.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-overtime"></span>Total Overtime: ₹{totals.totalOvertime.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-bonus"></span>Total Bonus: ₹{totals.totalBonus.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-pf-employee"></span>Total PF Employee: ₹{totals.totalEmployeePF.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-pf-employer"></span>Total PF Employer: ₹{totals.totalEmployerPF.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-insurance"></span>Total Insurance: ₹{totals.totalInsurance.toLocaleString()}
// //                     </span>
// //                     <span>
// //                       <span className="sb-dot sb-lop"></span>Total LOP Deduction: ₹{totals.totalLopDeduction.toLocaleString()}
// //                     </span>
// //                   </div>
// //                 </div>
// //               )}
// //               <table className="sb-sb-table">
// //                 <thead>
// //                   <tr>
// //                     <th className="sb-sb-table-header sb-sb-align-left">Employee ID</th>
// //                     <th className="sb-sb-table-header sb-sb-align-left">Full Name</th>
// //                     <th className="sb-sb-table-header sb-sb-align-left">Compensation Plan</th>
// //                     <th className="sb-sb-table-header sb-sb-align-center">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="sb-sb-table-body-wrapper">
// //                   {employees.map((emp) => (
// //                     <tr key={emp.employee_id}>
// //                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.employee_id}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.full_name}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.compensation_plan_name || "No Plan Assigned"}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-center">
// //                         <button
// //                           className="sb-sb-view-button"
// //                           onClick={() => handleViewSingleEmployee(emp)}
// //                         >
// //                           Annexure
// //                         </button>
// //                         <button
// //                           className="sb-sb-advance-button"
// //                           onClick={() => openAdvanceModal(emp.employee_id, emp.full_name)}
// //                         >
// //                           Add Advance
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <p>No employee data available</p>
// //           )}
// //         </>
// //       )}

// //       {viewMode === "allDetails" && (
// //         <div className="sb-sb-details-container">
// //           <div className="sb-sb-details-header">
// //             <button className="sb-sb-back-button" onClick={handleBackToMain}>
// //               Back to Main
// //             </button>
// //             <div className="sb-sb-header-title">All Employees Salary Details</div>
// //           </div>
// //           {employees.length > 0 ? (
// //             <div className="sb-sb-all-details-table-container">
// //               <table className="sb-sb-table sb-sb-all-details-table">
// //                 <thead>
// //                   <tr>
// //                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Employee ID</th>
// //                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Full Name</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">CTC (Annual)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Basic Salary (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">HRA (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">LTA Allowance (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Other Allowances (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Overtime Pay (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Bonus (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Advance Recovery (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Employee PF (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Employer PF (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">ESIC (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Gratuity (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Professional Tax (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Income Tax (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Insurance (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">LOP Deduction (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Gross Salary (Monthly)</th>
// //                     <th className="sb-sb-table-header sb-sb-align-right">Net Salary (Monthly)</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="sb-sb-table-body-wrapper">
// //                   {employees.map((emp) => {
// //                     const salaryDetails = calculateSalaryDetails(emp.ctc, emp.plan_data, emp.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
// //                     return (
// //                       <tr key={emp.employee_id}>
// //                         <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.employee_id}</td>
// //                         <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.full_name}</td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.basicSalary.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.hra.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.ltaAllowance.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.otherAllowances.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.overtimePay.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.bonusPay.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.advanceRecovery.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.employeePF.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.employerPF.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.esic.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.gratuity.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.professionalTax.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.incomeTax.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.insurance.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.lopDeduction.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.grossSalary.toLocaleString()}` : "N/A"}
// //                         </td>
// //                         <td className="sb-sb-table-cell sb-sb-align-right">
// //                           {salaryDetails ? `₹${salaryDetails.netSalary.toLocaleString()}` : "N/A"}
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <p>No employee data available.</p>
// //           )}
// //         </div>
// //       )}

// //       {viewMode === "singleEmployee" && selectedEmployee && (
// //         <div className="sb-sb-details-container">
// //           <div className="sb-sb-details-header">
// //             <button className="sb-sb-back-button" onClick={handleBackToMain}>
// //               Back to Main
// //             </button>
// //             <h1 className="sb-sb-header-title">Salary Details for {selectedEmployee.full_name}</h1>
// //           </div>
// //           <div className="sb-sb-single-details-table-container">
// //             <table className="sb-sb-table sb-sb-single-details-table">
// //               <thead>
// //                 <tr>
// //                   <th className="sb-sb-table-header sb-sb-align-left">Component</th>
// //                   <th className="sb-sb-table-header sb-sb-align-right">Amount</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="sb-sb-table-body-wrapper">
// //                 {(() => {
// //                   const salaryDetails = calculateSalaryDetails(selectedEmployee.ctc, selectedEmployee.plan_data, selectedEmployee.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
// //                   if (!salaryDetails) {
// //                     return (
// //                       <tr>
// //                         <td className="sb-sb-table-cell sb-sb-align-left" colSpan="2">
// //                           No valid CTC or plan data provided
// //                         </td>
// //                       </tr>
// //                     );
// //                   }
// //                   return [
// //                     { label: "CTC (Annual)", value: selectedEmployee.ctc ? `₹${parseFloat(selectedEmployee.ctc).toLocaleString()}` : "N/A" },
// //                     { label: "Basic Salary (Monthly)", value: `₹${salaryDetails.basicSalary.toLocaleString()}` },
// //                     { label: "HRA (Monthly)", value: `₹${salaryDetails.hra.toLocaleString()}` },
// //                     { label: "LTA Allowance (Monthly)", value: `₹${salaryDetails.ltaAllowance.toLocaleString()}` },
// //                     { label: "Other Allowances (Monthly)", value: `₹${salaryDetails.otherAllowances.toLocaleString()}` },
// //                     { label: "Overtime Pay (Monthly)", value: `₹${salaryDetails.overtimePay.toLocaleString()}` },
// //                     { label: "Bonus (Monthly)", value: `₹${salaryDetails.bonusPay.toLocaleString()}` },
// //                     { label: "Advance Recovery (Monthly)", value: `₹${salaryDetails.advanceRecovery.toLocaleString()}` },
// //                     { label: "Employee PF (Monthly)", value: `₹${salaryDetails.employeePF.toLocaleString()}` },
// //                     { label: "Employer PF (Monthly)", value: `₹${salaryDetails.employerPF.toLocaleString()}` },
// //                     { label: "ESIC (Monthly)", value: `₹${salaryDetails.esic.toLocaleString()}` },
// //                     { label: "Gratuity (Monthly)", value: `₹${salaryDetails.gratuity.toLocaleString()}` },
// //                     { label: "Professional Tax (Monthly)", value: `₹${salaryDetails.professionalTax.toLocaleString()}` },
// //                     { label: "Income Tax (Monthly)", value: `₹${salaryDetails.incomeTax.toLocaleString()}` },
// //                     { label: "Insurance (Monthly)", value: `₹${salaryDetails.insurance.toLocaleString()}` },
// //                     { label: "LOP Deduction (Monthly)", value: `₹${salaryDetails.lopDeduction.toLocaleString()}` },
// //                     { label: "Gross Salary (Monthly)", value: `₹${salaryDetails.grossSalary.toLocaleString()}` },
// //                     { label: "Net Salary (Monthly)", value: `₹${salaryDetails.netSalary.toLocaleString()}` },
// //                   ].map((item, index) => (
// //                     <tr key={index}>
// //                       <td className="sb-sb-table-cell sb-sb-align-left">{item.label}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-right">{item.value}</td>
// //                     </tr>
// //                   ));
// //                 })()}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}

// //       {viewMode === "noPlanDetails" && (
// //         <div className="sb-sb-details-container">
// //           <div className="sb-sb-details-header">
// //             <button className="sb-sb-back-button" onClick={handleBackToMain}>
// //               Back to Main
// //             </button>
// //             <div className="sb-sb-header-title">Employees Without Compensation Plans</div>
// //           </div>
// //           {employeesWithoutPlans.length > 0 ? (
// //             <div className="sb-sb-all-details-table-container">
// //               <table className="sb-sb-table sb-sb-all-details-table">
// //                 <thead>
// //                   <tr>
// //                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Employee ID</th>
// //                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Full Name</th>
// //                     <th className="sb-sb-table-header sb-sb-align-center">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="sb-sb-table-body-wrapper">
// //                   {employeesWithoutPlans.map((emp) => (
// //                     <tr key={emp.employee_id}>
// //                       <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.employee_id}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.full_name}</td>
// //                       <td className="sb-sb-table-cell sb-sb-align-center">
// //                         <button
// //                           className="sb-sb-view-details-button"
// //                           onClick={() => handleViewSingleEmployee({ ...emp, ctc: null, plan_data: null, compensation_plan_name: null })}
// //                         >
// //                           View Details
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <p>No employees without compensation plans found.</p>
// //           )}
// //         </div>
// //       )}

// //       <Modal
// //         isVisible={bonusModal.isVisible}
// //         onClose={closeBonusModal}
// //         title="Add Bonus"
// //         headerClassName="sb-sb-modal-header"
// //         buttons={[
// //           { label: "Cancel", onClick: closeBonusModal, className: "sb-sb-cancel-button" },
// //           { label: "Submit", onClick: handleBonusSubmit, className: "sb-sb-submit-button" },
// //         ]}
// //       >
// //         <div className="sb-sb-bonus-form">
// //           <p className="sb-sb-bonus-info">
// //             The specified bonus details will be recorded for the selected month and year. Select one option below:
// //           </p>
// //           {bonusModal.error && <p className="sb-sb-error-message">{bonusModal.error}</p>}
// //           <div className="sb-sb-bonus-field">
// //             <input
// //               type="radio"
// //               id="percentageCtcOption"
// //               name="bonusOption"
// //               value="percentageCtc"
// //               checked={bonusModal.selectedOption === "percentageCtc"}
// //               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
// //             />
// //             <label htmlFor="percentageCtc">CTC Percentage (%):</label>
// //             <input
// //               type="number"
// //               id="percentageCtc"
// //               value={bonusModal.percentageCtc}
// //               onChange={(e) => setBonusModal({ ...bonusModal, percentageCtc: e.target.value, error: "" })}
// //               placeholder="Enter CTC percentage"
// //               min="0"
// //               max="100"
// //               step="0.01"
// //               className="sb-sb-bonus-input"
// //               disabled={bonusModal.selectedOption !== "percentageCtc"}
// //             />
// //           </div>
// //           <div className="sb-sb-bonus-field">
// //             <input
// //               type="radio"
// //               id="monthlySalaryCountOption"
// //               name="bonusOption"
// //               value="monthlySalaryCount"
// //               checked={bonusModal.selectedOption === "monthlySalaryCount"}
// //               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
// //             />
// //             <label htmlFor="monthlySalaryCount">No of Monthly Salary:</label>
// //             <div className="sb-sb-monthly-salary-container">
// //               <select
// //                 id="monthlySalaryCount"
// //                 value={bonusModal.monthlySalaryCount}
// //                 onChange={(e) => setBonusModal({ ...bonusModal, monthlySalaryCount: e.target.value, error: "" })}
// //                 className="sb-sb-bonus-input"
// //                 disabled={bonusModal.selectedOption !== "monthlySalaryCount"}
// //               >
// //                 <option value="">Select Number</option>
// //                 {monthlySalaryOptions.map((option) => (
// //                   <option key={option} value={option}>
// //                     {option}
// //                   </option>
// //                 ))}
// //               </select>
// //               <span className="sb-sb-month-label">Month(s)</span>
// //             </div>
// //           </div>
// //           <div className="sb-sb-bonus-field">
// //             <input
// //               type="radio"
// //               id="fixedAmountOption"
// //               name="bonusOption"
// //               value="fixedAmount"
// //               checked={bonusModal.selectedOption === "fixedAmount"}
// //               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
// //             />
// //             <label htmlFor="fixedAmount">Fixed Amount (₹):</label>
// //             <input
// //               type="number"
// //               id="fixedAmount"
// //               value={bonusModal.fixedAmount}
// //               onChange={(e) => setBonusModal({ ...bonusModal, fixedAmount: e.target.value, error: "" })}
// //               placeholder="Enter fixed amount"
// //               min="0"
// //               step="1"
// //               className="sb-sb-bonus-input"
// //               disabled={bonusModal.selectedOption !== "fixedAmount"}
// //             />
// //           </div>
// //           <div className="sb-sb-month-select">
// //             <label htmlFor="bonusMonth">Month:</label>
// //             <select
// //               id="bonusMonth"
// //               value={bonusModal.selectedMonth}
// //               onChange={(e) => setBonusModal({ ...bonusModal, selectedMonth: e.target.value, error: "" })}
// //               className="sb-sb-bonus-input"
// //             >
// //               <option value="">Select Month</option>
// //               {months.map((month) => (
// //                 <option key={month} value={month}>
// //                   {new Date(0, parseInt(month) - 1).toLocaleString('en-US', { month: 'long' })}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="sb-sb-month-select">
// //             <label htmlFor="bonusYear">Year:</label>
// //             <input
// //               type="number"
// //               id="bonusYear"
// //               value={bonusModal.selectedYear}
// //               onChange={(e) => setBonusModal({ ...bonusModal, selectedYear: e.target.value, error: "" })}
// //               placeholder="Enter year (e.g., 2025)"
// //               min="2000"
// //               max="2100"
// //               step="1"
// //               className="sb-sb-bonus-input"
// //             />
// //           </div>
// //         </div>
// //       </Modal>
// //       <Modal
// //         isVisible={advanceModal.isVisible}
// //         onClose={closeAdvanceModal}
// //         title={`Add Advance for ${advanceModal.fullName}`}
// //         headerClassName="sb-sb-modal-header"
// //         buttons={[
// //           { label: "Cancel", onClick: closeAdvanceModal, className: "sb-sb-cancel-button" },
// //           { label: "Submit", onClick: handleAdvanceSubmit, className: "sb-sb-submit-button" },
// //         ]}
// //       >
// //         <div className="sb-sb-advance-form">
// //           <p className="sb-sb-advance-info">
// //             Note: Do not exceed the employee's monthly salary of ₹{getMonthlySalary(advanceModal.employeeId, employees).toLocaleString()}.
// //           </p>
// //           {advanceModal.error && <p className="sb-sb-error-message">{advanceModal.error}</p>}
// //           <div className="sb-sb-advance-field">
// //             <label htmlFor="advanceAmount">Advance Amount (₹):</label>
// //             <input
// //               type="number"
// //               id="advanceAmount"
// //               value={advanceModal.advanceAmount}
// //               onChange={(e) => setAdvanceModal({ ...advanceModal, advanceAmount: e.target.value, error: "" })}
// //               placeholder="Enter advance amount"
// //               min="0"
// //               step="1"
// //               className="sb-sb-advance-input"
// //             />
// //           </div>
// //           <div className="sb-sb-advance-field">
// //             <label htmlFor="recoveryMonths">No of Iterations:</label>
// //             <input
// //               type="number"
// //               id="recoveryMonths"
// //               value={advanceModal.recoveryMonths}
// //               onChange={(e) => setAdvanceModal({ ...advanceModal, recoveryMonths: e.target.value, error: "" })}
// //               placeholder="Enter number of iterations"
// //               min="1"
// //               step="1"
// //               className="sb-sb-advance-input"
// //             />
// //           </div>
// //           {advanceModal.advanceAmount && advanceModal.recoveryMonths && (
// //             <div className="sb-sb-advance-field">
// //               <p>Advance per iteration: ₹{calculateAdvancePerIteration(advanceModal)}</p>
// //             </div>
// //           )}
// //           <div className="sb-sb-advance-field">
// //             <label htmlFor="applicableMonth">Applicable From:</label>
// //             <select
// //               id="applicableMonth"
// //               value={advanceModal.applicableMonth}
// //               onChange={(e) => setAdvanceModal({ ...advanceModal, applicableMonth: e.target.value, error: "" })}
// //               className="sb-sb-advance-input"
// //             >
// //               <option value="">Select Month</option>
// //               {getAvailableMonths().map((month) => (
// //                 <option key={month.value} value={month.value}>
// //                   {month.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>
// //       </Modal>
// //       <Modal
// //         isVisible={messageModal.isVisible}
// //         onClose={closeMessageModal}
// //         title={messageModal.title}
// //         headerClassName="sb-sb-modal-header"
// //         buttons={[{ label: "Close", onClick: closeMessageModal, className: "sb-sb-cancel-button" }]}
// //       >
// //         <div className="sb-sb-message-container">
// //           <p className={messageModal.isError ? "sb-sb-error-message" : "sb-sb-success-message"}>
// //             {messageModal.message}
// //           </p>
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default SalaryBreakup;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Modal from "../Modal/Modal";
// import "./salaryBreakup.css";
// import { calculateSalaryDetails, calculateTotals, getMonthlySalary, calculateAdvancePerIteration, parseApplicableMonth, parseWorkDate } from "../../utils/SalaryCalculations.js";

// const SalaryBreakup = () => {
//   const [employees, setEmployees] = useState([]);
//   const [allEmployees, setAllEmployees] = useState([]);
//   const [advances, setAdvances] = useState([]);
//   const [overtimeRecords, setOvertimeRecords] = useState([]);
//   const [bonusRecords, setBonusRecords] = useState([]);
//   const [lopDetails, setLopDetails] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [bonusModal, setBonusModal] = useState({
//     isVisible: false,
//     percentageCtc: "",
//     monthlySalaryCount: "",
//     fixedAmount: "",
//     selectedMonth: "",
//     selectedYear: new Date().getFullYear().toString(),
//     selectedOption: "",
//     error: "",
//   });
//   const [advanceModal, setAdvanceModal] = useState({
//     isVisible: false,
//     employeeId: null,
//     fullName: "",
//     advanceAmount: "",
//     recoveryMonths: "",
//     applicableMonth: "",
//     error: "",
//   });
//   const [messageModal, setMessageModal] = useState({
//     isVisible: false,
//     title: "",
//     message: "",
//     isError: false,
//   });
//   const [assignModal, setAssignModal] = useState({
//     isVisible: false,
//     employeeId: null,
//     fullName: "",
//     compensationList: [],
//     selectedCompensation: "",
//     error: "",
//   });
//   const [viewMode, setViewMode] = useState("main");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

//   const openBonusModal = () => {
//     console.log("Opening Bonus Modal");
//     setBonusModal({
//       isVisible: true,
//       percentageCtc: "",
//       monthlySalaryCount: "",
//       fixedAmount: "",
//       selectedMonth: "",
//       selectedYear: new Date().getFullYear().toString(),
//       selectedOption: "",
//       error: "",
//     });
//   };

//   const closeBonusModal = () => {
//     console.log("Closing Bonus Modal");
//     setBonusModal({
//       isVisible: false,
//       percentageCtc: "",
//       monthlySalaryCount: "",
//       fixedAmount: "",
//       selectedMonth: "",
//       selectedYear: "",
//       selectedOption: "",
//       error: "",
//     });
//   };

//   const openAdvanceModal = (employeeId, fullName) => {
//     console.log(`Opening Advance Modal for employee ${employeeId}: ${fullName}`);
//     setAdvanceModal({
//       isVisible: true,
//       employeeId,
//       fullName,
//       advanceAmount: "",
//       recoveryMonths: "",
//       applicableMonth: "",
//       error: "",
//     });
//   };

//   const closeAdvanceModal = () => {
//     console.log("Closing Advance Modal");
//     setAdvanceModal({
//       isVisible: false,
//       employeeId: null,
//       fullName: "",
//       advanceAmount: "",
//       recoveryMonths: "",
//       applicableMonth: "",
//       error: "",
//     });
//   };

//   const openNoPlanModal = () => {
//     console.log("Opening No Plan Details View");
//     setViewMode("noPlanDetails");
//   };

//   const openMessageModal = (title, message, isError = false) => {
//     console.log(`Opening Message Modal: ${title} - ${message} (isError: ${isError})`);
//     setMessageModal({
//       isVisible: true,
//       title,
//       message,
//       isError,
//     });
//   };

//   const closeMessageModal = () => {
//     console.log("Closing Message Modal");
//     setMessageModal({
//       isVisible: false,
//       title: "",
//       message: "",
//       isError: false,
//     });
//   };

//   const openAssignModal = async (employeeId, fullName) => {
//     console.log(`Opening Assign Modal for employee ${employeeId}: ${fullName}`);
//     setIsLoading(true);
//     try {
//       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`;
//       const response = await axios.get(url, {
//         headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//       });
//       if (response.data.success) {
//         const validCompensations = Array.isArray(response.data.data)
//           ? response.data.data.filter(
//               (comp) =>
//                 comp &&
//                 typeof comp.compensation_plan_name === "string" &&
//                 comp.id &&
//                 !isNaN(parseInt(comp.id))
//             )
//           : [];
//         console.log("Fetched compensations:", validCompensations);
//         setAssignModal({
//           isVisible: true,
//           employeeId,
//           fullName,
//           compensationList: validCompensations,
//           selectedCompensation: "",
//           error: "",
//         });
//       } else {
//         throw new Error(response.data.message || "Failed to fetch compensations");
//       }
//     } catch (error) {
//       console.error("Error fetching compensations:", error);
//       openMessageModal("Error", `Failed to fetch compensations: ${error.message || "Network error"}`, true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const closeAssignModal = () => {
//     console.log("Closing Assign Modal");
//     setAssignModal({
//       isVisible: false,
//       employeeId: null,
//       fullName: "",
//       compensationList: [],
//       selectedCompensation: "",
//       error: "",
//     });
//   };

//   const handleViewAllDetails = () => {
//     console.log("Switching to All Details View");
//     setViewMode("allDetails");
//     setSearchQuery("");
//   };

//   const handleViewSingleEmployee = (employee) => {
//     console.log(`Viewing details for employee ${employee.employee_id}: ${employee.full_name}`);
//     setSelectedEmployee(employee);
//     setViewMode("singleEmployee");
//   };

//   const handleBackToMain = () => {
//     console.log("Returning to Main View");
//     setViewMode("main");
//     setSelectedEmployee(null);
//     setSearchQuery("");
//   };

//   const handleBonusSubmit = async () => {
//     console.log("Submitting Bonus Form", bonusModal);
//     const { percentageCtc, monthlySalaryCount, fixedAmount, selectedMonth, selectedYear, selectedOption } = bonusModal;

//     if (!selectedOption) {
//       setBonusModal({ ...bonusModal, error: "Please select one bonus option." });
//       return;
//     }

//     if (selectedOption === "percentageCtc" && (!percentageCtc || parseFloat(percentageCtc) <= 0 || parseFloat(percentageCtc) > 100)) {
//       setBonusModal({ ...bonusModal, error: "Please enter a valid CTC percentage (0-100)." });
//       return;
//     }
//     if (selectedOption === "monthlySalaryCount" && (!monthlySalaryCount || parseInt(monthlySalaryCount) < 1 || parseInt(monthlySalaryCount) > 10)) {
//       setBonusModal({ ...bonusModal, error: "Please select a valid number of monthly salaries (1-10)." });
//       return;
//     }
//     if (selectedOption === "fixedAmount" && (!fixedAmount || parseFloat(fixedAmount) <= 0)) {
//       setBonusModal({ ...bonusModal, error: "Please enter a valid fixed amount greater than 0." });
//       return;
//     }
//     if (!selectedMonth || !months.includes(selectedMonth)) {
//       setBonusModal({ ...bonusModal, error: "Please select a valid month." });
//       return;
//     }
//     if (!selectedYear || !/^\d{4}$/.test(selectedYear)) {
//       setBonusModal({ ...bonusModal, error: "Please enter a valid year." });
//       return;
//     }

//     const applicableMonth = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;
//     const payload = {
//       percentageCtc: selectedOption === "percentageCtc" ? parseFloat(percentageCtc) : null,
//       percentageMonthlySalary: selectedOption === "monthlySalaryCount" ? parseFloat(monthlySalaryCount) * 100 : null,
//       fixedAmount: selectedOption === "fixedAmount" ? parseFloat(fixedAmount) : null,
//       applicableMonth,
//     };

//     try {
//       setIsLoading(true);
//       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/add-bonus-bulk`;
//       const response = await axios.post(url, payload, {
//         headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//       });

//       if (response.data.success) {
//         openMessageModal("Success", `Bonus successfully added for ${selectedMonth} ${selectedYear}.`);
//         const bonusResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/bonus-list`, {
//           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//         });
//         if (bonusResponse.data.success) {
//           console.log("Updated bonusRecords after submit:", bonusResponse.data.data);
//           setBonusRecords(bonusResponse.data.data || []);
//         }
//         closeBonusModal();
//       } else {
//         setBonusModal({ ...bonusModal, error: response.data.error || "Failed to add bonus" });
//       }
//     } catch (error) {
//       console.error("Error adding bonus:", error);
//       setBonusModal({
//         ...bonusModal,
//         error: error.response?.data?.error || error.message || "Network error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAdvanceSubmit = async () => {
//     console.log("Submitting Advance Form", advanceModal);
//     const { advanceAmount, recoveryMonths, employeeId, applicableMonth } = advanceModal;

//     if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
//       setAdvanceModal({ ...advanceModal, error: "Please enter a valid advance amount greater than 0." });
//       return;
//     }
//     if (!recoveryMonths || parseInt(recoveryMonths) <= 0) {
//       setAdvanceModal({ ...advanceModal, error: "Please enter a valid number of iterations (greater than 0)." });
//       return;
//     }
//     if (!applicableMonth) {
//       setAdvanceModal({ ...advanceModal, error: "Please select an applicable month." });
//       return;
//     }

//     const monthlySalary = getMonthlySalary(employeeId, employees);
//     const threeMonthsSalary = monthlySalary * 3;
//     if (parseFloat(advanceAmount) > threeMonthsSalary) {
//       setAdvanceModal({
//         ...advanceModal,
//         error: `Advance amount (₹${parseFloat(advanceAmount).toLocaleString()}) cannot exceed three months' salary (₹${threeMonthsSalary.toLocaleString()}).`,
//       });
//       return;
//     }

//     const [year, month] = applicableMonth.split('-').map(Number);
//     const existingAdvances = advances.filter((adv) => {
//       if (!adv.applicable_months) return false;
//       const advDate = parseApplicableMonth(adv.applicable_months);
//       if (!advDate) return false;
//       const advYear = advDate.getFullYear();
//       const advMonth = advDate.getMonth() + 1;
//       const recoveryMonths = parseInt(adv.recovery_months);
//       const startMonth = advMonth;
//       const startYear = advYear;
//       let endYear = startYear;
//       let endMonth = startMonth + recoveryMonths - 1;
//       if (endMonth > 12) {
//         endYear += Math.floor((endMonth - 1) / 12);
//         endMonth = ((endMonth - 1) % 12) + 1;
//       }
//       const inputDate = new Date(year, month - 1);
//       const startDate = new Date(startYear, startMonth - 1);
//       const endDate = new Date(endYear, endMonth - 1);
//       return (
//         adv.employee_id === employeeId &&
//         (adv.applicable_months === applicableMonth || (inputDate >= startDate && inputDate <= endDate))
//       );
//     });

//     if (existingAdvances.length > 0) {
//       const activeAdvance = existingAdvances[0];
//       const advDate = parseApplicableMonth(activeAdvance.applicable_months);
//       const recoveryMonths = parseInt(activeAdvance.recovery_months);
//       const startMonth = advDate.getMonth() + 1;
//       const startYear = advDate.getFullYear();
//       let endMonth = startMonth + recoveryMonths - 1;
//       let endYear = startYear;
//       if (endMonth > 12) {
//         endYear += Math.floor((endMonth - 1) / 12);
//         endMonth = ((endMonth - 1) % 12) + 1;
//       }
//       const monthsLeft = (endYear - year) * 12 + (endMonth - month) + 1;
//       setAdvanceModal({
//         ...advanceModal,
//         error: `An active advance of ₹${parseFloat(activeAdvance.advance_amount).toLocaleString()} is already in progress for this employee starting ${activeAdvance.applicable_months}, with ${monthsLeft} iteration(s) left until ${new Date(endYear, endMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}. No new advance can be added until the current one is fully recovered.`,
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance`;
//       const response = await axios.post(
//         url,
//         {
//           employeeId,
//           advanceAmount: parseFloat(advanceAmount),
//           recoveryMonths: parseInt(recoveryMonths),
//           applicableMonth,
//         },
//         {
//           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//         }
//       );

//       if (response.data.success) {
//         openMessageModal("Success", `Advance of ₹${parseFloat(advanceAmount).toLocaleString()} added successfully for ${advanceModal.fullName}.`);
//         const advancesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance-details`, {
//           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//         });
//         if (advancesResponse.data.success) {
//           setAdvances(advancesResponse.data.data || []);
//         }
//         closeAdvanceModal();
//       } else {
//         setAdvanceModal({ ...advanceModal, error: response.data.message || "Failed to add advance" });
//       }
//     } catch (error) {
//       console.error("Error adding advance:", error);
//       setAdvanceModal({
//         ...advanceModal,
//         error: error.response?.data?.message || error.message || "Network error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAssignSubmit = async () => {
//     console.log("Submitting Assign Form", assignModal);
//     const { selectedCompensation, employeeId, fullName } = assignModal;

//     if (!selectedCompensation) {
//       setAssignModal({ ...assignModal, error: "Please select a compensation plan." });
//       return;
//     }

//     const compensation = assignModal.compensationList.find((comp) => String(comp.id) === selectedCompensation);
//     if (!compensation || isNaN(parseInt(selectedCompensation))) {
//       setAssignModal({ ...assignModal, error: "Invalid compensation plan selected. Please select a valid plan." });
//       return;
//     }

//     try {
//       setIsLoading(true);

//       // Check if the employee already has a plan
//       const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`;
//       console.log(`Requesting assigned employees: ${url}`);
//       const response = await axios.get(url, {
//         headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//       });
//       console.log("Assigned employees response:", response.data);

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to fetch assigned employees");
//       }

//       const assignedEmployees = Array.isArray(response.data.data) ? response.data.data : [];
//       const assignedEmployee = assignedEmployees.find((emp) => emp.employee_id === employeeId);
//       if (assignedEmployee) {
//         setAssignModal({
//           ...assignModal,
//           error: `${fullName} already has a compensation plan assigned: ${assignedEmployee.compensation_plan_name}`,
//         });
//         return;
//       }

//       console.log("No existing plans found. Proceeding with assignment.");
//       const assignUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assign`;
//       const payload = {
//         compensationId: parseInt(selectedCompensation),
//         compensationPlanName: compensation.compensation_plan_name,
//         employeeId: [employeeId],
//         assignedBy: meId,
//         assignedDate: new Date().toISOString().split("T")[0],
//         departmentIds: [],
//       };

//       console.log("Sending payload:", payload);
//       const assignResponse = await axios.post(assignUrl, payload, {
//         headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//       });

//       console.log("Assignment response:", assignResponse.data);
//       if (assignResponse.data.success) {
//         openMessageModal("Success", `Compensation assigned successfully to ${fullName}!`);
//         // Refresh employee data to reflect the new assignment
//         const employeesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`, {
//           headers: { "x-api-key": API_KEY, "x-employee-id": meId },
//         });
//         if (employeesResponse.data.success) {
//           setEmployees(employeesResponse.data.data || []);
//         }
//         closeAssignModal();
//       } else {
//         throw new Error(assignResponse.data.message || "Assignment unsuccessful");
//       }
//     } catch (error) {
//       console.error("Error assigning compensation:", error);
//       setAssignModal({
//         ...assignModal,
//         error: `Failed to assign compensation: ${error.response?.data?.message || error.message || "Network error"}`,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//   const fetchSalaryBreakupData = async () => {
//     try {
//       setIsLoading(true);
//       setBonusRecords([]);
//       console.log("Reset bonusRecords before fetch");

//       const baseUrl = process.env.REACT_APP_BACKEND_URL;
//       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

//       // Fetch compensation plans
//       const compensationsResponse = await axios.get(`${baseUrl}/api/compensations/list`, { headers });
//       console.log('Compensations Response:', JSON.stringify(compensationsResponse.data, null, 2));
//       const compensationMap = new Map();
//       if (compensationsResponse.data.success) {
//         compensationsResponse.data.data.forEach(comp => {
//           compensationMap.set(comp.compensation_plan_name, comp.plan_data);
//         });
//       } else {
//         throw new Error(compensationsResponse.data.message || "Failed to fetch compensations");
//       }

//       // Fetch assigned employees
//       const employeesResponse = await axios.get(`${baseUrl}/api/compensation/assigned`, { headers });
//       console.log('Employees Response:', JSON.stringify(employeesResponse.data, null, 2));
//       if (employeesResponse.data.success) {
//         // Merge plan_data into employees
//         const enrichedEmployees = employeesResponse.data.data.map(emp => ({
//           ...emp,
//           plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data
//         }));
//         setEmployees(enrichedEmployees || []);
//       } else {
//         throw new Error(employeesResponse.data.message || "Failed to fetch salary breakup data");
//       }

//       const allEmployeesResponse = await axios.get(`${baseUrl}/api/employees/names`, { headers });
//       console.log('All Employees Response:', JSON.stringify(allEmployeesResponse.data, null, 2));
//       if (allEmployeesResponse.data.success) {
//         setAllEmployees(allEmployeesResponse.data.data || []);
//       }

//       const advancesResponse = await axios.get(`${baseUrl}/api/compensation/advance-details`, { headers });
//       console.log('Advances Response:', JSON.stringify(advancesResponse.data, null, 2));
//       if (advancesResponse.data.success) {
//         setAdvances(advancesResponse.data.data || []);
//       }

//       const overtimeResponse = await axios.get(`${baseUrl}/api/compensation/overtime-status-summary`, { headers });
//       console.log('Overtime Response:', JSON.stringify(overtimeResponse.data, null, 2));
//       if (overtimeResponse.data.success) {
//         setOvertimeRecords(overtimeResponse.data.data || []);
//       }

//       const bonusResponse = await axios.get(`${baseUrl}/api/compensation/bonus-list`, { headers });
//       console.log('Bonus Response:', JSON.stringify(bonusResponse.data, null, 2));
//       if (bonusResponse.data.success) {
//         setBonusRecords(bonusResponse.data.data || []);
//       }

//       const lopResponse = await axios.get(`${baseUrl}/api/compensation/lop-details`, { headers });
//       console.log('LOP Response:', JSON.stringify(lopResponse.data, null, 2));
//       if (lopResponse.data.success) {
//         setLopDetails(lopResponse.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       openMessageModal("Error", `Failed to fetch data: ${error.response?.data?.message || error.message || "Network error"}`, true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (API_KEY && meId) {
//     fetchSalaryBreakupData();
//   } else {
//     openMessageModal("Error", "Authentication credentials are missing.", true);
//     setIsLoading(false);
//   }
// }, [API_KEY, meId]);

//   const getAvailableMonths = () => {
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const currentMonth = now.getMonth() + 1;
//     const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
//     const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

//     return [
//       {
//         value: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
//         label: new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
//       },
//       {
//         value: `${nextYear}-${nextMonth.toString().padStart(2, '0')}`,
//         label: new Date(nextYear, nextMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
//       },
//     ];
//   };

//   const months = [
//     "01", "02", "03", "04", "05", "06",
//     "07", "08", "09", "10", "11", "12"
//   ];

//   const monthlySalaryOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

//   const employeesWithoutPlans = allEmployees.filter(
//     (emp) => !employees.some((assignedEmp) => assignedEmp.employee_id === emp.employee_id)
//   );

//   const totals = employees.length > 0 ? calculateTotals(employees, overtimeRecords, bonusRecords, advances, lopDetails) : null;

//   const getCompensationPlanDetail = (component, planData) => {
//     if (!planData) return "N/A";

//     const componentMap = {
//       "Basic Salary": {
//         isApplicable: "isBasicSalary",
//         type: "basicSalaryType",
//         percentage: "basicSalary",
//         amount: "basicSalaryAmount",
//       },
//       "HRA": {
//         isApplicable: "isHouseRentAllowance",
//         type: "houseRentAllowanceType",
//         percentage: "houseRentAllowance",
//         amount: "houseRentAllowanceAmount",
//       },
//       "LTA Allowance": {
//         isApplicable: "isLtaAllowance",
//         type: "ltaAllowanceType",
//         percentage: "ltaAllowance",
//         amount: "ltaAllowanceAmount",
//       },
//       "Other Allowances": {
//         isApplicable: "isOtherAllowance",
//         type: "otherAllowanceType",
//         percentage: "otherAllowance",
//         amount: "otherAllowanceAmount",
//       },
//       "Overtime Pay": {
//         isApplicable: "isOvertimePay",
//         type: null,
//         percentage: null,
//         amount: "overtimePayAmount",
//       },
//       "Bonus": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "Advance Recovery": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "Employee PF": {
//         isApplicable: "isPFApplicable",
//         type: "pfType",
//         percentage: "pfPercentage",
//         amount: "pfAmount",
//       },
//       "Employer PF": {
//         isApplicable: "isPfEmployer",
//         type: "pfEmployerType",
//         percentage: "pfEmployerCeilingPercentage",
//         amount: "pfEmployerAmount",
//       },
//       "ESIC": {
//         isApplicable: "isESICApplicable",
//         type: "esicType",
//         percentage: "esicPercentage",
//         amount: "esicAmount",
//       },
//       "Gratuity": {
//         isApplicable: "isGratuityApplicable",
//         type: "gratuityType",
//         percentage: "gratuityPercentage",
//         amount: "gratuityAmount",
//       },
//       "Professional Tax": {
//         isApplicable: "isProfessionalTax",
//         type: "professionalTaxType",
//         percentage: "professionalTax",
//         amount: "professionalTaxAmount",
//       },
//       "Income Tax": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "Insurance": {
//         isApplicable: "isInsuranceApplicable",
//         type: "insuranceType",
//         percentage: "insurancePercentage",
//         amount: "insuranceAmount",
//       },
//       "LOP Deduction": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "Gross Salary": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "Net Salary": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//       "CTC": {
//         isApplicable: null,
//         type: null,
//         percentage: null,
//         amount: null,
//       },
//     };

//     const config = componentMap[component];
//     if (!config || !config.isApplicable || planData[config.isApplicable]) {
//       if (config.type && planData[config.type] === "percentage" && planData[config.percentage]) {
//         return `${parseFloat(planData[config.percentage]).toLocaleString()}%`;
//       } else if (config.amount && planData[config.amount]) {
//         return `₹${parseFloat(planData[config.amount]).toLocaleString()}`;
//       }
//     }
//     return "N/A";
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     searchQuery
//       ? emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
//       : true
//   );

//   return (
//     <div className="sb-sb-container">
//       {viewMode === "main" && (
//         <>
//           <div className="sb-sb-header-title">Salary Breakup</div>
//           {isLoading ? (
//             <div className="sb-sb-loading">Loading...</div>
//           ) : employees.length > 0 || allEmployees.length > 0 ? (
//             <div className="sb-sb-table-container">
//               <div className="sb-sb-button-container">
//                 <button className="sb-sb-no-plan-button" onClick={openNoPlanModal}>
//                   View Employees Without Plans
//                 </button>
//                 <button className="sb-sb-add-bonus-button" onClick={openBonusModal}>
//                   Add Bonus
//                 </button>
//                 <button className="sb-sb-view-all-button" onClick={handleViewAllDetails}>
//                   View All Details
//                 </button>
//               </div>
//               {totals && (
//                 <div className="sb-sb-totals">
//                   <h2 className="sb-sb-total-payroll">Total Payroll: ₹{totals.totalPayable.toLocaleString()}</h2>
//                   <div className="sb-sb-totals-details">
//                     <span>
//                       <span className="sb-dot sb-payable"></span>Total Payable: ₹{totals.totalPayable.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-gross"></span>Total Gross: ₹{totals.totalGross.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-tds"></span>Total TDS: ₹{totals.totalTDS.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-advance"></span>Total Advance: ₹{totals.totalAdvance.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-overtime"></span>Total Overtime: ₹{totals.totalOvertime.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-bonus"></span>Total Bonus: ₹{totals.totalBonus.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-pf-employee"></span>Total PF Employee: ₹{totals.totalEmployeePF.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-pf-employer"></span>Total PF Employer: ₹{totals.totalEmployerPF.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-insurance"></span>Total Insurance: ₹{totals.totalInsurance.toLocaleString()}
//                     </span>
//                     <span>
//                       <span className="sb-dot sb-lop"></span>Total LOP Deduction: ₹{totals.totalLopDeduction.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               )}
//               <div className="sb-sb-search-container">
//                 <input
//                   type="text"
//                   className="sb-sb-search-input"
//                   placeholder="Search by Employee ID or Full Name"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <table className="sb-sb-table">
//                 <thead>
//                   <tr>
//                     <th className="sb-sb-table-header sb-sb-align-left">Employee ID</th>
//                     <th className="sb-sb-table-header sb-sb-align-left">Full Name</th>
//                     <th className="sb-sb-table-header sb-sb-align-left">Compensation Plan</th>
//                     <th className="sb-sb-table-header sb-sb-align-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="sb-sb-table-body-wrapper">
//                   {filteredEmployees.map((emp) => (
//                     <tr key={emp.employee_id}>
//                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.employee_id}</td>
//                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.full_name}</td>
//                       <td className="sb-sb-table-cell sb-sb-align-left">{emp.compensation_plan_name || "No Plan Assigned"}</td>
//                       <td className="sb-sb-table-cell sb-sb-align-center">
//                         <button
//                           className="sb-sb-view-button"
//                           onClick={() => handleViewSingleEmployee(emp)}
//                         >
//                           Annexure
//                         </button>
//                         <button
//                           className="sb-sb-advance-button"
//                           onClick={() => openAdvanceModal(emp.employee_id, emp.full_name)}
//                         >
//                           Add Advance
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No employee data available</p>
//           )}
//         </>
//       )}

//       {viewMode === "allDetails" && (
//         <div className="sb-sb-details-container">
//           <div className="sb-sb-details-header">
//             <button className="sb-sb-back-button" onClick={handleBackToMain}>
//               Back to Main
//             </button>
//             <div className="sb-sb-header-title">All Employees Salary Details</div>
//           </div>
//           {employees.length > 0 ? (
//             <div className="sb-sb-all-details-table-container">
//               <div className="sb-sb-search-container">
//                 <input
//                   type="text"
//                   className="sb-sb-search-input"
//                   placeholder="Search by Employee ID or Full Name"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <table className="sb-sb-table sb-sb-all-details-table">
//                 <thead>
//                   <tr>
//                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Employee ID</th>
//                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Full Name</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">CTC (Annual)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Basic Salary (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">HRA (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">LTA Allowance (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Other Allowances (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Overtime Pay (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Bonus (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Advance Recovery (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Employee PF (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Employer PF (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">ESIC (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Gratuity (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Professional Tax (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Income Tax (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Insurance (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">LOP Deduction (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Gross Salary (Monthly)</th>
//                     <th className="sb-sb-table-header sb-sb-align-right">Net Salary (Monthly)</th>
//                   </tr>
//                 </thead>
//                 <tbody className="sb-sb-table-body-wrapper">
//                   {filteredEmployees.map((emp) => {
//                     const salaryDetails = calculateSalaryDetails(emp.ctc, emp.plan_data, emp.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
//                     return (
//                       <tr key={emp.employee_id}>
//                         <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.employee_id}</td>
//                         <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.full_name}</td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.basicSalary.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.hra.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.ltaAllowance.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.otherAllowances.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.overtimePay.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.bonusPay.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.advanceRecovery.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.employeePF.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.employerPF.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.esic.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.gratuity.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.professionalTax.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.incomeTax.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.insurance.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.lopDeduction.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.grossSalary.toLocaleString()}` : "N/A"}
//                         </td>
//                         <td className="sb-sb-table-cell sb-sb-align-right">
//                           {salaryDetails ? `₹${salaryDetails.netSalary.toLocaleString()}` : "N/A"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No employee data available.</p>
//           )}
//         </div>
//       )}

//    {viewMode === "singleEmployee" && selectedEmployee && (
//   <div className="sb-sb-details-container">
//     <div className="sb-sb-details-header">
//       <button className="sb-sb-back-button" onClick={handleBackToMain}>
//         Back to Main
//       </button>
//       <h1 className="sb-sb-header-title">Salary Details for {selectedEmployee.full_name}</h1>
//     </div>
//     <div className="sb-sb-single-details-table-container">
//       <table className="sb-sb-table sb-sb-single-details-table">
//         <thead>
//           <tr>
//             <th className="sb-sb-table-header sb-sb-align-left">Component</th>
//             <th className="sb-sb-table-header sb-sb-align-left">Compensation Plan</th>
//             <th className="sb-sb-table-header sb-sb-align-right">Monthly Amount</th>
//             <th className="sb-sb-table-header sb-sb-align-right">Yearly Amount</th>
//           </tr>
//         </thead>
//         <tbody className="sb-sb-table-body-wrapper">
//           {(() => {
//             console.log('Selected Employee for Annexure:', JSON.stringify(selectedEmployee, null, 2));
//             const salaryDetails = calculateSalaryDetails(
//               selectedEmployee.ctc,
//               selectedEmployee.plan_data,
//               selectedEmployee.employee_id,
//               overtimeRecords,
//               bonusRecords,
//               advances,
//               lopDetails
//             );
//             if (!salaryDetails || !selectedEmployee.employee_id) {
//               return (
//                 <tr>
//                   <td className="sb-sb-table-cell sb-sb-align-left" colSpan="4">
//                     No valid employee data provided
//                   </td>
//                 </tr>
//               );
//             }
//             if (!selectedEmployee.ctc || selectedEmployee.ctc <= 0) {
//               return (
//                 <tr>
//                   <td className="sb-sb-table-cell sb-sb-align-left" colSpan="4">
//                     No valid CTC provided for this employee
//                   </td>
//                 </tr>
//               );
//             }

//             const components = [
//               { label: "CTC", monthly: selectedEmployee.ctc ? parseFloat(selectedEmployee.ctc) / 12 : 0, yearly: selectedEmployee.ctc ? parseFloat(selectedEmployee.ctc) : 0 },
//               { label: "Basic Salary", monthly: salaryDetails.basicSalary, yearly: salaryDetails.basicSalary * 12 },
//               { label: "HRA", monthly: salaryDetails.hra, yearly: salaryDetails.hra * 12 },
//               { label: "LTA Allowance", monthly: salaryDetails.ltaAllowance, yearly: salaryDetails.ltaAllowance * 12 },
//               { label: "Other Allowances", monthly: salaryDetails.otherAllowances, yearly: salaryDetails.otherAllowances * 12 },
//               { label: "Overtime Pay", monthly: salaryDetails.overtimePay, yearly: salaryDetails.overtimePay * 12 },
//               { label: "Bonus", monthly: salaryDetails.bonusPay, yearly: salaryDetails.bonusPay * 12 },
//               { label: "Advance Recovery", monthly: salaryDetails.advanceRecovery, yearly: salaryDetails.advanceRecovery * 12, isDeduction: true },
//               { label: "Employee PF", monthly: salaryDetails.employeePF, yearly: salaryDetails.employeePF * 12, isDeduction: true },
//               { label: "Employer PF", monthly: salaryDetails.employerPF, yearly: salaryDetails.employerPF * 12 },
//               { label: "ESIC", monthly: salaryDetails.esic, yearly: salaryDetails.esic * 12, isDeduction: true },
//               { label: "Gratuity", monthly: salaryDetails.gratuity, yearly: salaryDetails.gratuity * 12 },
//               { label: "Professional Tax", monthly: salaryDetails.professionalTax, yearly: salaryDetails.professionalTax * 12, isDeduction: true },
//               { label: "Income Tax", monthly: salaryDetails.incomeTax, yearly: salaryDetails.incomeTax * 12, isDeduction: true },
//               { label: "Insurance", monthly: salaryDetails.insurance, yearly: salaryDetails.insurance * 12, isDeduction: true },
//               { label: "LOP Deduction", monthly: salaryDetails.lopDeduction, yearly: salaryDetails.lopDeduction * 12, isDeduction: true },
//             ];

//             const totalEarningsMonthly = components
//               .filter(comp => !comp.isDeduction)
//               .reduce((sum, comp) => sum + comp.monthly, 0);
//             const totalEarningsYearly = components
//               .filter(comp => !comp.isDeduction)
//               .reduce((sum, comp) => sum + comp.yearly, 0);
//             const totalDeductionsMonthly = components
//               .filter(comp => comp.isDeduction)
//               .reduce((sum, comp) => sum + comp.monthly, 0);
//             const totalDeductionsYearly = components
//               .filter(comp => comp.isDeduction)
//               .reduce((sum, comp) => sum + comp.yearly, 0);

//             return [
//               ...components.map((item, index) => (
//                 <tr key={index}>
//                   <td className="sb-sb-table-cell sb-sb-align-left">{item.label}</td>
//                   <td className="sb-sb-table-cell sb-sb-align-left">{getCompensationPlanDetail(item.label, selectedEmployee.plan_data)}</td>
//                   <td className="sb-sb-table-cell sb-sb-align-right">{item.monthly ? `₹${item.monthly.toLocaleString()}` : "N/A"}</td>
//                   <td className="sb-sb-table-cell sb-sb-align-right">{item.yearly ? `₹${item.yearly.toLocaleString()}` : "N/A"}</td>
//                 </tr>
//               )),
//               <tr key="total-earnings" className="sb-sb-total-row">
//                 <td className="sb-sb-table-cell sb-sb-align-left"><strong>Total Earnings</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{totalEarningsMonthly.toLocaleString()}</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{totalEarningsYearly.toLocaleString()}</strong></td>
//               </tr>,
//               <tr key="total-deductions" className="sb-sb-total-row">
//                 <td className="sb-sb-table-cell sb-sb-align-left"><strong>Total Deductions</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{totalDeductionsMonthly.toLocaleString()}</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{totalDeductionsYearly.toLocaleString()}</strong></td>
//               </tr>,
//               <tr key="gross-salary" className="sb-sb-total-row">
//                 <td className="sb-sb-table-cell sb-sb-align-left"><strong>Gross Salary</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{salaryDetails.grossSalary.toLocaleString()}</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{(salaryDetails.grossSalary * 12).toLocaleString()}</strong></td>
//               </tr>,
//               <tr key="net-salary" className="sb-sb-total-row">
//                 <td className="sb-sb-table-cell sb-sb-align-left"><strong>Net Salary</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{salaryDetails.netSalary.toLocaleString()}</strong></td>
//                 <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{(salaryDetails.netSalary * 12).toLocaleString()}</strong></td>
//               </tr>,
//             ];
//           })()}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}

//       {viewMode === "noPlanDetails" && (
//         <div className="sb-sb-details-container">
//           <div className="sb-sb-details-header">
//             <button className="sb-sb-back-button" onClick={handleBackToMain}>
//               Back to Main
//             </button>
//             <div className="sb-sb-header-title">Employees Without Compensation Plans</div>
//           </div>
//           {employeesWithoutPlans.length > 0 ? (
//             <div className="sb-sb-all-details-table-container">
//               <table className="sb-sb-table sb-sb-all-details-table">
//                 <thead>
//                   <tr>
//                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Employee ID</th>
//                     <th className="sb-sb-table-header sb-sb-align-left sb-sb-sticky-column">Full Name</th>
//                     <th className="sb-sb-table-header sb-sb-align-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="sb-sb-table-body-wrapper">
//                   {employeesWithoutPlans.map((emp) => (
//                     <tr key={emp.employee_id}>
//                       <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.employee_id}</td>
//                       <td className="sb-sb-table-cell sb-sb-align-left sb-sb-sticky-column">{emp.full_name}</td>
//                       <td className="sb-sb-table-cell sb-sb-align-center">
//                         <button
//                           className="sb-sb-view-details-button"
//                           onClick={() => openAssignModal(emp.employee_id, emp.full_name)}
//                         >
//                           Assign
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No employees without compensation plans found.</p>
//           )}
//         </div>
//       )}

//       <Modal
//         isVisible={bonusModal.isVisible}
//         onClose={closeBonusModal}
//         title="Add Bonus"
//         headerClassName="sb-sb-modal-header"
//         buttons={[
//           { label: "Cancel", onClick: closeBonusModal, className: "sb-sb-cancel-button" },
//           { label: "Submit", onClick: handleBonusSubmit, className: "sb-sb-submit-button" },
//         ]}
//       >
//         <div className="sb-sb-bonus-form">
//           <p className="sb-sb-bonus-info">
//             The specified bonus details will be recorded for the selected month and year. Select one option below:
//           </p>
//           {bonusModal.error && <p className="sb-sb-error-message">{bonusModal.error}</p>}
//           <div className="sb-sb-bonus-field">
//             <input
//               type="radio"
//               id="percentageCtcOption"
//               name="bonusOption"
//               value="percentageCtc"
//               checked={bonusModal.selectedOption === "percentageCtc"}
//               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
//             />
//             <label htmlFor="percentageCtc">CTC Percentage (%):</label>
//             <input
//               type="number"
//               id="percentageCtc"
//               value={bonusModal.percentageCtc}
//               onChange={(e) => setBonusModal({ ...bonusModal, percentageCtc: e.target.value, error: "" })}
//               placeholder="Enter CTC percentage"
//               min="0"
//               max="100"
//               step="0.01"
//               className="sb-sb-bonus-input"
//               disabled={bonusModal.selectedOption !== "percentageCtc"}
//             />
//           </div>
//           <div className="sb-sb-bonus-field">
//             <input
//               type="radio"
//               id="monthlySalaryCountOption"
//               name="bonusOption"
//               value="monthlySalaryCount"
//               checked={bonusModal.selectedOption === "monthlySalaryCount"}
//               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
//             />
//             <label htmlFor="monthlySalaryCount">No of Monthly Salary:</label>
//             <div className="sb-sb-monthly-salary-container">
//               <select
//                 id="monthlySalaryCount"
//                 value={bonusModal.monthlySalaryCount}
//                 onChange={(e) => setBonusModal({ ...bonusModal, monthlySalaryCount: e.target.value, error: "" })}
//                 className="sb-sb-bonus-input"
//                 disabled={bonusModal.selectedOption !== "monthlySalaryCount"}
//               >
//                 <option value="">Select Number</option>
//                 {monthlySalaryOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//               <span className="sb-sb-month-label">Month(s)</span>
//             </div>
//           </div>
//           <div className="sb-sb-bonus-field">
//             <input
//               type="radio"
//               id="fixedAmountOption"
//               name="bonusOption"
//               value="fixedAmount"
//               checked={bonusModal.selectedOption === "fixedAmount"}
//               onChange={(e) => setBonusModal({ ...bonusModal, selectedOption: e.target.value, error: "" })}
//             />
//             <label htmlFor="fixedAmount">Fixed Amount (₹):</label>
//             <input
//               type="number"
//               id="fixedAmount"
//               value={bonusModal.fixedAmount}
//               onChange={(e) => setBonusModal({ ...bonusModal, fixedAmount: e.target.value, error: "" })}
//               placeholder="Enter fixed amount"
//               min="0"
//               step="1"
//               className="sb-sb-bonus-input"
//               disabled={bonusModal.selectedOption !== "fixedAmount"}
//             />
//           </div>
//           <div className="sb-sb-month-select">
//             <label htmlFor="bonusMonth">Month:</label>
//             <select
//               id="bonusMonth"
//               value={bonusModal.selectedMonth}
//               onChange={(e) => setBonusModal({ ...bonusModal, selectedMonth: e.target.value, error: "" })}
//               className="sb-sb-bonus-input"
//             >
//               <option value="">Select Month</option>
//               {months.map((month) => (
//                 <option key={month} value={month}>
//                   {new Date(0, parseInt(month) - 1).toLocaleString('en-US', { month: 'long' })}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="sb-sb-month-select">
//             <label htmlFor="bonusYear">Year:</label>
//             <input
//               type="number"
//               id="bonusYear"
//               value={bonusModal.selectedYear}
//               onChange={(e) => setBonusModal({ ...bonusModal, selectedYear: e.target.value, error: "" })}
//               placeholder="Enter year (e.g., 2025)"
//               min="2000"
//               max="2100"
//               step="1"
//               className="sb-sb-bonus-input"
//             />
//           </div>
//         </div>
//       </Modal>
//       <Modal
//         isVisible={advanceModal.isVisible}
//         onClose={closeAdvanceModal}
//         title={`Add Advance for ${advanceModal.fullName}`}
//         headerClassName="sb-sb-modal-header"
//         buttons={[
//           { label: "Cancel", onClick: closeAdvanceModal, className: "sb-sb-cancel-button" },
//           { label: "Submit", onClick: handleAdvanceSubmit, className: "sb-sb-submit-button" },
//         ]}
//       >
//         <div className="sb-sb-advance-form">
//           <p className="sb-sb-advance-info">
//             Note: Do not exceed three months' salary of ₹{(getMonthlySalary(advanceModal.employeeId, employees) * 3).toLocaleString()}.
//           </p>
//           {advanceModal.error && <p className="sb-sb-error-message">{advanceModal.error}</p>}
//           <div className="sb-sb-advance-field">
//             <label htmlFor="advanceAmount">Advance Amount (₹):</label>
//             <input
//               type="number"
//               id="advanceAmount"
//               value={advanceModal.advanceAmount}
//               onChange={(e) => setAdvanceModal({ ...advanceModal, advanceAmount: e.target.value, error: "" })}
//               placeholder="Enter advance amount"
//               min="0"
//               step="1"
//               className="sb-sb-advance-input"
//             />
//           </div>
//           <div className="sb-sb-advance-field">
//             <label htmlFor="recoveryMonths">No of Iterations:</label>
//             <input
//               type="number"
//               id="recoveryMonths"
//               value={advanceModal.recoveryMonths}
//               onChange={(e) => setAdvanceModal({ ...advanceModal, recoveryMonths: e.target.value, error: "" })}
//               placeholder="Enter number of iterations"
//               min="1"
//               step="1"
//               className="sb-sb-advance-input"
//             />
//           </div>
//           {advanceModal.advanceAmount && advanceModal.recoveryMonths && (
//             <div className="sb-sb-advance-field">
//               <p>Advance per iteration: ₹{calculateAdvancePerIteration(advanceModal)}</p>
//             </div>
//           )}
//           <div className="sb-sb-advance-field">
//             <label htmlFor="applicableMonth">Applicable From:</label>
//             <select
//               id="applicableMonth"
//               value={advanceModal.applicableMonth}
//               onChange={(e) => setAdvanceModal({ ...advanceModal, applicableMonth: e.target.value, error: "" })}
//               className="sb-sb-advance-input"
//             >
//               <option value="">Select Month</option>
//               {getAvailableMonths().map((month) => (
//                 <option key={month.value} value={month.value}>
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Modal>
//       <Modal
//         isVisible={messageModal.isVisible}
//         onClose={closeMessageModal}
//         title={messageModal.title}
//         headerClassName="sb-sb-modal-header"
//         buttons={[{ label: "Close", onClick: closeMessageModal, className: "sb-sb-cancel-button" }]}
//       >
//         <div className="sb-sb-message-container">
//           <p className={messageModal.isError ? "sb-sb-error-message" : "sb-sb-success-message"}>
//             {messageModal.message}
//           </p>
//         </div>
//       </Modal>
//       <Modal
//         isVisible={assignModal.isVisible}
//         onClose={closeAssignModal}
//         title={`Assign Compensation for ${assignModal.fullName}`}
//         headerClassName="sb-sb-modal-header"
//         buttons={[
//           { label: "Cancel", onClick: closeAssignModal, className: "sb-sb-cancel-button" },
//           { label: "Assign", onClick: handleAssignSubmit, className: "sb-sb-submit-button" },
//         ]}
//       >
//         <div className="sb-sb-assign-form">
//           {assignModal.error && <p className="sb-sb-error-message">{assignModal.error}</p>}
//           <div className="sb-sb-assign-field">
//             <label htmlFor="compensationSelect">Compensation Plan:</label>
//             <select
//               id="compensationSelect"
//               value={assignModal.selectedCompensation}
//               onChange={(e) => setAssignModal({ ...assignModal, selectedCompensation: e.target.value, error: "" })}
//               className="sb-sb-assign-input"
//             >
//               <option value="">Select Compensation Plan</option>
//               {assignModal.compensationList.map((comp) => (
//                 <option key={comp.id} value={comp.id}>
//                   {comp.compensation_plan_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SalaryBreakup;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import "./salaryBreakup.css";
import { calculateSalaryDetails, calculateTotals, getMonthlySalary, calculateAdvancePerIteration, parseApplicableMonth, parseWorkDate } from "../../utils/SalaryCalculations.js";
import { FaMoneyBillWave, FaChartLine, FaMoneyCheckAlt, FaHandHoldingUsd, FaClock, FaGift, FaShieldAlt, FaBriefcase, FaStethoscope, FaExclamationTriangle, FaSearch } from 'react-icons/fa';


const SalaryBreakup = () => {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [bonusRecords, setBonusRecords] = useState([]);
  const [lopDetails, setLopDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('yearly');
  const [menuOpen, setMenuOpen] = useState(false); // Add this near top of your component

const toggleMenu = () => setMenuOpen(!menuOpen); // Add this function too

  const [bonusModal, setBonusModal] = useState({
    isVisible: false,
    percentageCtc: "",
    monthlySalaryCount: "",
    fixedAmount: "",
    selectedMonth: "",
    selectedYear: new Date().getFullYear().toString(),
    selectedOption: "",
    error: "",
  });
  const [advanceModal, setAdvanceModal] = useState({
    isVisible: false,
    employeeId: null,
    fullName: "",
    advanceAmount: "",
    recoveryMonths: "",
    applicableMonth: "",
    error: "",
  });
  const [messageModal, setMessageModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    isError: false,
  });
  const [assignModal, setAssignModal] = useState({
    isVisible: false,
    employeeId: null,
    fullName: "",
    compensationList: [],
    selectedCompensation: "",
    error: "",
  });
  const [viewMode, setViewMode] = useState("main");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsTab, setShowDetailsTab] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef(null);
  const rowsPerPage = 7;

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  const openBonusModal = () => {
    setBonusModal({
      isVisible: true,
      percentageCtc: "",
      monthlySalaryCount: "",
      fixedAmount: "",
      selectedMonth: "",
      selectedYear: new Date().getFullYear().toString(),
      selectedOption: "",
      error: "",
    });
  };

  const closeBonusModal = () => {
    setBonusModal({
      isVisible: false,
      percentageCtc: "",
      monthlySalaryCount: "",
      fixedAmount: "",
      selectedMonth: "",
      selectedYear: "",
      selectedOption: "",
      error: "",
    });
  };

  const openAdvanceModal = (employeeId, fullName) => {
    setAdvanceModal({
      isVisible: true,
      employeeId,
      fullName,
      advanceAmount: "",
      recoveryMonths: "",
      applicableMonth: "",
      error: "",
    });
  };

  const closeAdvanceModal = () => {
    setAdvanceModal({
      isVisible: false,
      employeeId: null,
      fullName: "",
      advanceAmount: "",
      recoveryMonths: "",
      applicableMonth: "",
      error: "",
    });
  };

  const openNoPlanModal = () => {
    setViewMode("noPlanDetails");
  };

  const openMessageModal = (title, message, isError = false) => {
    setMessageModal({
      isVisible: true,
      title,
      message,
      isError,
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isVisible: false,
      title: "",
      message: "",
      isError: false,
    });
  };

  const openAssignModal = async (employeeId, fullName) => {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`;
      const response = await axios.get(url, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      });
      if (response.data.success) {
        const validCompensations = Array.isArray(response.data.data)
          ? response.data.data.filter(
              (comp) =>
                comp &&
                typeof comp.compensation_plan_name === "string" &&
                comp.id &&
                !isNaN(parseInt(comp.id))
            )
          : [];
        setAssignModal({
          isVisible: true,
          employeeId,
          fullName,
          compensationList: validCompensations,
          selectedCompensation: "",
          error: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch compensations");
      }
    } catch (error) {
      openMessageModal("Error", `Failed to fetch compensations: ${error.message || "Network error"}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAssignModal = () => {
    setAssignModal({
      isVisible: false,
      employeeId: null,
      fullName: "",
      compensationList: [],
      selectedCompensation: "",
      error: "",
    });
  };

  const handleViewAllDetails = () => {
    setViewMode("allDetails");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewSingleEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsTab(true);
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  };

  const handleCloseDetailsTab = () => {
    setShowDetailsTab(false);
    setSelectedEmployee(null);
  };

  const handleBackToMain = () => {
    setViewMode("main");
    setSelectedEmployee(null);
    setSearchQuery("");
    setCurrentPage(1);
    setShowDetailsTab(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
  };

  const handleBonusSubmit = async () => {
  const {
    percentageCtc,
    monthlySalaryCount,
    fixedAmount,
    selectedMonth,
    selectedYear,
    selectedOption,
  } = bonusModal;

  // 1. Validate selected option
  if (!selectedOption) {
    setBonusModal({ ...bonusModal, error: "Please select one bonus option." });
    return;
  }

  // 2. Validate input only for selected option
  if (
    selectedOption === "percentageCtc" &&
    (!percentageCtc || parseFloat(percentageCtc) <= 0 || parseFloat(percentageCtc) > 100)
  ) {
    setBonusModal({ ...bonusModal, error: "Please enter a valid CTC percentage (0-100)." });
    return;
  }

  if (
    selectedOption === "monthlySalaryCount" &&
    (!monthlySalaryCount || parseInt(monthlySalaryCount) < 1 || parseInt(monthlySalaryCount) > 10)
  ) {
    setBonusModal({
      ...bonusModal,
      error: "Please select a valid number of monthly salaries (1-10).",
    });
    return;
  }

  if (
    selectedOption === "fixedAmount" &&
    (!fixedAmount || parseFloat(fixedAmount) <= 0)
  ) {
    setBonusModal({
      ...bonusModal,
      error: "Please enter a valid fixed amount greater than 0.",
    });
    return;
  }

  // 3. Validate month and year
  if (!selectedMonth || !months.includes(selectedMonth)) {
    setBonusModal({ ...bonusModal, error: "Please select a valid month." });
    return;
  }

  if (!selectedYear || !/^\d{4}$/.test(selectedYear)) {
    setBonusModal({ ...bonusModal, error: "Please enter a valid year." });
    return;
  }

  // 4. Prepare payload with only the selected bonus option
  const applicableMonth = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
  const payload = {
  percentageCtc: selectedOption === "percentageCtc" ? parseFloat(percentageCtc) : null,
  percentageMonthlySalary: selectedOption === "monthlySalaryCount" ? parseFloat(monthlySalaryCount) * 100 : null,
  fixedAmount: selectedOption === "fixedAmount" ? parseFloat(fixedAmount) : null,
  applicableMonth,
};


  try {
    setIsLoading(true);

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/add-bonus-bulk`;
    const response = await axios.post(url, payload, {
      headers: {
        "x-api-key": API_KEY,
        "x-employee-id": meId,
      },
    });

    if (response.data.success) {
      openMessageModal(
        "Success",
        `Bonus successfully added for ${selectedMonth} ${selectedYear}.`
      );

      const bonusResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/bonus-list`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
        }
      );

      if (bonusResponse.data.success) {
        setBonusRecords(bonusResponse.data.data || []);
      }

      closeBonusModal();
    } else {
      setBonusModal({
        ...bonusModal,
        error: response.data.error || "Failed to add bonus",
      });
    }
  } catch (error) {
    setBonusModal({
      ...bonusModal,
      error: error.response?.data?.error || error.message || "Network error",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handleAdvanceSubmit = async () => {
    const { advanceAmount, recoveryMonths, employeeId, applicableMonth } = advanceModal;

    if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
      setAdvanceModal({ ...advanceModal, error: "Please enter a valid advance amount greater than 0." });
      return;
    }
    if (!recoveryMonths || parseInt(recoveryMonths) <= 0) {
      setAdvanceModal({ ...advanceModal, error: "Please enter a valid number of iterations (greater than 0)." });
      return;
    }
    if (!applicableMonth) {
      setAdvanceModal({ ...advanceModal, error: "Please select an applicable month." });
      return;
    }

    const monthlySalary = getMonthlySalary(employeeId, employees);
    const threeMonthsSalary = monthlySalary * 3;
    if (parseFloat(advanceAmount) > threeMonthsSalary) {
      setAdvanceModal({
        ...advanceModal,
        error: `Advance amount (₹${parseFloat(advanceAmount).toLocaleString()}) cannot exceed three months' salary (₹${threeMonthsSalary.toLocaleString()}).`,
      });
      return;
    }

    const [year, month] = applicableMonth.split('-').map(Number);
    const existingAdvances = advances.filter((adv) => {
      if (!adv.applicable_months) return false;
      const advDate = parseApplicableMonth(adv.applicable_months);
      if (!advDate) return false;
      const advYear = advDate.getFullYear();
      const advMonth = advDate.getMonth() + 1;
      const recoveryMonths = parseInt(adv.recovery_months);
      const startMonth = advMonth;
      const startYear = advYear;
      let endYear = startYear;
      let endMonth = startMonth + recoveryMonths - 1;
      if (endMonth > 12) {
        endYear += Math.floor((endMonth - 1) / 12);
        endMonth = ((endMonth - 1) % 12) + 1;
      }
      const inputDate = new Date(year, month - 1);
      const startDate = new Date(startYear, startMonth - 1);
      const endDate = new Date(endYear, endMonth - 1);
      return (
        adv.employee_id === employeeId &&
        (adv.applicable_months === applicableMonth || (inputDate >= startDate && inputDate <= endDate))
      );
    });

    if (existingAdvances.length > 0) {
      const activeAdvance = existingAdvances[0];
      const advDate = parseApplicableMonth(activeAdvance.applicable_months);
      const recoveryMonths = parseInt(activeAdvance.recovery_months);
      const startMonth = advDate.getMonth() + 1;
      const startYear = advDate.getFullYear();
      let endMonth = startMonth + recoveryMonths - 1;
      let endYear = startYear;
      if (endMonth > 12) {
        endYear += Math.floor((endMonth - 1) / 12);
        endMonth = ((endMonth - 1) % 12) + 1;
      }
      const monthsLeft = (endYear - year) * 12 + (endMonth - month) + 1;
      setAdvanceModal({
        ...advanceModal,
        error: `An active advance of ₹${parseFloat(activeAdvance.advance_amount).toLocaleString()} is already in progress for this employee starting ${activeAdvance.applicable_months}, with ${monthsLeft} iteration(s) left until ${new Date(endYear, endMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}. No new advance can be added until the current one is fully recovered.`,
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance`;
      const response = await axios.post(
        url,
        {
          employeeId,
          advanceAmount: parseFloat(advanceAmount),
          recoveryMonths: parseInt(recoveryMonths),
          applicableMonth,
        },
        {
          headers: { "x-api-key": API_KEY, "x-employee-id": meId },
        }
      );

      if (response.data.success) {
        openMessageModal("Success", `Advance of ₹${parseFloat(advanceAmount).toLocaleString()} added successfully for ${advanceModal.fullName}.`);
        const advancesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance-details`, {
          headers: { "x-api-key": API_KEY, "x-employee-id": meId },
        });
        if (advancesResponse.data.success) {
          setAdvances(advancesResponse.data.data || []);
        }
        closeAdvanceModal();
      } else {
        setAdvanceModal({ ...advanceModal, error: response.data.message || "Failed to add advance" });
      }
    } catch (error) {
      setAdvanceModal({
        ...advanceModal,
        error: error.response?.data?.message || error.message || "Network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSubmit = async () => {
    const { selectedCompensation, employeeId, fullName } = assignModal;

    if (!selectedCompensation) {
      setAssignModal({ ...assignModal, error: "Please select a compensation plan." });
      return;
    }

    const compensation = assignModal.compensationList.find((comp) => String(comp.id) === selectedCompensation);
    if (!compensation || isNaN(parseInt(selectedCompensation))) {
      setAssignModal({ ...assignModal, error: "Invalid compensation plan selected. Please select a valid plan." });
      return;
    }

    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`;
      const response = await axios.get(url, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch assigned employees");
      }

      const assignedEmployees = Array.isArray(response.data.data) ? response.data.data : [];
      const assignedEmployee = assignedEmployees.find((emp) => emp.employee_id === employeeId);
      if (assignedEmployee) {
        setAssignModal({
          ...assignModal,
          error: `${fullName} already has a compensation plan assigned: ${assignedEmployee.compensation_plan_name}`,
        });
        return;
      }

      const assignUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assign`;
      const payload = {
        compensationId: parseInt(selectedCompensation),
        compensationPlanName: compensation.compensation_plan_name,
        employeeId: [employeeId],
        assignedBy: meId,
        assignedDate: new Date().toISOString().split("T")[0],
        departmentIds: [],
      };

      const assignResponse = await axios.post(assignUrl, payload, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      });

      if (assignResponse.data.success) {
        openMessageModal("Success", `Compensation assigned successfully to ${fullName}!`);
        const employeesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`, {
          headers: { "x-api-key": API_KEY, "x-employee-id": meId },
        });
        if (employeesResponse.data.success) {
          setEmployees(employeesResponse.data.data || []);
        }
        closeAssignModal();
      } else {
        throw new Error(assignResponse.data.message || "Assignment unsuccessful");
      }
    } catch (error) {
      setAssignModal({
        ...assignModal,
        error: `Failed to assign compensation: ${error.response?.data?.message || error.message || "Network error"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSalaryBreakupData = async () => {
      try {
        setIsLoading(true);
        setBonusRecords([]);

        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

        const compensationsResponse = await axios.get(`${baseUrl}/api/compensations/list`, { headers });
        const compensationMap = new Map();
        if (compensationsResponse.data.success) {
          compensationsResponse.data.data.forEach(comp => {
            compensationMap.set(comp.compensation_plan_name, comp.plan_data);
          });
        } else {
          throw new Error(compensationsResponse.data.message || "Failed to fetch compensations");
        }

        const employeesResponse = await axios.get(`${baseUrl}/api/compensation/assigned`, { headers });
        if (employeesResponse.data.success) {
          const enrichedEmployees = employeesResponse.data.data.map(emp => ({
            ...emp,
            plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data
          }));
          setEmployees(enrichedEmployees || []);
        } else {
          throw new Error(employeesResponse.data.message || "Failed to fetch salary breakup data");
        }

        const allEmployeesResponse = await axios.get(`${baseUrl}/api/employees/names`, { headers });
        if (allEmployeesResponse.data.success) {
          setAllEmployees(allEmployeesResponse.data.data || []);
        }

        const advancesResponse = await axios.get(`${baseUrl}/api/compensation/advance-details`, { headers });
        if (advancesResponse.data.success) {
          setAdvances(advancesResponse.data.data || []);
        }

        const overtimeResponse = await axios.get(`${baseUrl}/api/compensation/overtime-status-summary`, { headers });
        if (overtimeResponse.data.success) {
          setOvertimeRecords(overtimeResponse.data.data || []);
        }

        const bonusResponse = await axios.get(`${baseUrl}/api/compensation/bonus-list`, { headers });
        if (bonusResponse.data.success) {
          setBonusRecords(bonusResponse.data.data || []);
        }

        const lopResponse = await axios.get(`${baseUrl}/api/compensation/lop-details`, { headers });
        if (lopResponse.data.success) {
          setLopDetails(lopResponse.data.data || []);
        }
      } catch (error) {
        openMessageModal("Error", `Failed to fetch data: ${error.response?.data?.message || error.message || "Network error"}`, true);
      } finally {
        setIsLoading(false);
      }
    };

    if (API_KEY && meId) {
      fetchSalaryBreakupData();
    } else {
      openMessageModal("Error", "Authentication credentials are missing.", true);
      setIsLoading(false);
    }
  }, [API_KEY, meId]);

  const getAvailableMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    return [
      {
        value: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
        label: new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      },
      {
        value: `${nextYear}-${nextMonth.toString().padStart(2, '0')}`,
        label: new Date(nextYear, nextMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      },
    ];
  };

  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];

  const monthlySalaryOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  const employeesWithoutPlans = allEmployees.filter(
    (emp) => !employees.some((assignedEmp) => assignedEmp.employee_id === emp.employee_id)
  );

  const totals = employees.length > 0 ? calculateTotals(employees, overtimeRecords, bonusRecords, advances, lopDetails) : null;

  const getCompensationPlanDetail = (component, planData) => {
    if (!planData) return "N/A";

    const componentMap = {
      "Basic Salary": {
        isApplicable: "isBasicSalary",
        type: "basicSalaryType",
        percentage: "basicSalary",
        amount: "basicSalaryAmount",
      },
      "HRA": {
        isApplicable: "isHouseRentAllowance",
        type: "houseRentAllowanceType",
        percentage: "houseRentAllowance",
        amount: "houseRentAllowanceAmount",
      },
      "LTA Allowance": {
        isApplicable: "isLtaAllowance",
        type: "ltaAllowanceType",
        percentage: "ltaAllowance",
        amount: "ltaAllowanceAmount",
      },
      "Other Allowances": {
        isApplicable: "isOtherAllowance",
        type: "otherAllowanceType",
        percentage: "otherAllowance",
        amount: "otherAllowanceAmount",
      },
      "Overtime Pay": {
        isApplicable: "isOvertimePay",
        type: null,
        percentage: null,
        amount: "overtimePayAmount",
      },
      "Bonus": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "Advance Recovery": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "Employee PF": {
        isApplicable: "isPFApplicable",
        type: "pfType",
        percentage: "pfPercentage",
        amount: "pfAmount",
      },
      "Employer PF": {
        isApplicable: "isPfEmployer",
        type: "pfEmployerType",
        percentage: "pfEmployerCeilingPercentage",
        amount: "pfEmployerAmount",
      },
      "ESIC": {
        isApplicable: "isESICApplicable",
        type: "esicType",
        percentage: "esicPercentage",
        amount: "esicAmount",
      },
      "Gratuity": {
        isApplicable: "isGratuityApplicable",
        type: "gratuityType",
        percentage: "gratuityPercentage",
        amount: "gratuityAmount",
      },
      "Professional Tax": {
        isApplicable: "isProfessionalTax",
        type: "professionalTaxType",
        percentage: "professionalTax",
        amount: "professionalTaxAmount",
      },
      "Income Tax": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "Insurance": {
        isApplicable: "isInsuranceApplicable",
        type: "insuranceType",
        percentage: "insurancePercentage",
        amount: "insuranceAmount",
      },
      "LOP Deduction": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "Gross Salary": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "Net Salary": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
      "CTC": {
        isApplicable: null,
        type: null,
        percentage: null,
        amount: null,
      },
    };

    const config = componentMap[component];
    if (!config || !config.isApplicable || planData[config.isApplicable]) {
      if (config.type && planData[config.type] === "percentage" && planData[config.percentage]) {
        return `${parseFloat(planData[config.percentage]).toLocaleString()}%`;
      } else if (config.amount && planData[config.amount]) {
        return `₹${parseFloat(planData[config.amount]).toLocaleString()}`;
      }
    }
    return "N/A";
  };
const [searchTerm, setSearchTerm] = useState("");
const filteredEmployees2 = employeesWithoutPlans.filter((emp) =>
  emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
);
 const filteredEmployees = employees.filter((emp) => {
  const query = searchQuery.toLowerCase().trim();
  return (
    emp.employee_id.toLowerCase().includes(query) ||
    emp.full_name.toLowerCase().includes(query)
  );
});
const filteredEmployees3 = employees.filter((emp) =>
    emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="sb-sb-container">
      {viewMode === "main" && (
        <>
          {isLoading ? (
            <div className="sb-sb-loading">Loading...</div>
          ) : employees.length > 0 || allEmployees.length > 0 ? (
            <div className="sb-sb-table-container">
                <div className="sb-sb-heading">Salary Breakup</div>

              <div className="sb-sb-button-container">
  <div className="menu-icon" onClick={toggleMenu}>
    &#9776; {/* Hamburger icon */}
  </div>

  {menuOpen && (
    <div className="sb-dropdown-menu">
      <button className="sb-dropdown-item" onClick={() => { toggleMenu(); openNoPlanModal(); }}>
        View Employees Without Plans
      </button>
      <button className="sb-dropdown-item" onClick={() => { toggleMenu(); openBonusModal(); }}>
        Add Bonus
      </button>
      <button className="sb-dropdown-item" onClick={() => { toggleMenu(); handleViewAllDetails(); }}>
        View All Details
      </button>
    </div>
  )}
</div>
              {totals && (
                <div className="sb-sb-totals-container">
                  <h2 className="sb-sb-total-payroll">Total Payroll: ₹{totals.totalPayable.toLocaleString()}</h2>
                  <div className="sb-sb-totals-grid">
                    <div className="sb-sb-total-card sb-payable">
                      <FaMoneyBillWave className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Payable</span>
                        <span className="sb-sb-card-value">₹{totals.totalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-gross">
                      <FaChartLine className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Gross</span>
                        <span className="sb-sb-card-value">₹{totals.totalGross.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-tds">
                      <FaMoneyCheckAlt className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total TDS</span>
                        <span className="sb-sb-card-value">₹{totals.totalTDS.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-advance">
                      <FaHandHoldingUsd className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Advance</span>
                        <span className="sb-sb-card-value">₹{totals.totalAdvance.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-overtime">
                      <FaClock className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Overtime</span>
                        <span className="sb-sb-card-value">₹{totals.totalOvertime.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-bonus">
                      <FaGift className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Bonus</span>
                        <span className="sb-sb-card-value">₹{totals.totalBonus.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-pf-employee">
                      <FaShieldAlt className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total PF Employee</span>
                        <span className="sb-sb-card-value">₹{totals.totalEmployeePF.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-pf-employer">
                      <FaBriefcase className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total PF Employer</span>
                        <span className="sb-sb-card-value">₹{totals.totalEmployerPF.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-insurance">
                      <FaStethoscope className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total Insurance</span>
                        <span className="sb-sb-card-value">₹{totals.totalInsurance.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="sb-sb-total-card sb-lop">
                      <FaExclamationTriangle className="sb-sb-card-icon" />
                      <div>
                        <span className="sb-sb-card-title">Total LOP Deduction</span>
                        <span className="sb-sb-card-value">₹{totals.totalLopDeduction.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="sb-sb-table-header-container">
  <h2 className="sb-sb-table-heading">Employee Payslip List</h2>

  <div className="sb-sb-search-wrapper">
    <input
      type="text"
      className="sb-sb-search-input"
      placeholder="Search by Employee ID or Full Name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <FaSearch className="sb-sb-search-icon" />
  </div>
</div>

              <div className="sb-sb-main-content">
                <div className={`sb-sb-table-wrapper ${showDetailsTab ? 'sb-sb-table-compressed' : ''}`} ref={tableRef}>
                  <table className="sb-sb-table">
  <thead>
    <tr>
      <th className="sb-sb-table-header sb-sb-align-left">Employee ID</th>
      <th className="sb-sb-table-header sb-sb-align-left">Full Name</th>
      <th className="sb-sb-table-header sb-sb-align-left">Compensation Plan</th>
      <th className="sb-sb-table-header sb-sb-align-left">Action</th> {/* Changed to sb-sb-align-left */}
    </tr>
  </thead>
  <tbody className="sb-sb-table-body-wrapper">
{filteredEmployees.map((emp, index) => (
      <tr key={emp.employee_id}>
        <td className="sb-sb-table-cell sb-sb-align-left">{emp.employee_id}</td>
        <td className="sb-sb-table-cell sb-sb-align-left">{emp.full_name}</td>
        <td className="sb-sb-table-cell sb-sb-align-left">{emp.compensation_plan_name || "No Plan Assigned"}</td>
        <td className="sb-sb-table-cell sb-sb-align-center">
          <div className="sb-sb-action-buttons">
            <button
              className="sb-sb-view-button"
              onClick={() => handleViewSingleEmployee(emp)}
            >
              Annexure
            </button>
            <button
              className="sb-sb-advance-button"
              onClick={() => openAdvanceModal(emp.employee_id, emp.full_name)}
            >
              Add Advance
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
                  <div className="sb-sb-pagination">
                    <button
                      className="sb-sb-pagination-button"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="sb-sb-pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="sb-sb-pagination-button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
  {showDetailsTab && selectedEmployee && (
  <div className="sb-sb-details-tab" style={{ height: `${tableHeight}px` }}>
    <div className="sb-sb-details-tab-header">
      <h2>Salary Details</h2>
      <button className="sb-sb-details-tab-close" onClick={handleCloseDetailsTab}>
        ×
      </button>
    </div>
    <div className="sb-sb-details-tab-content">
      <div className="sb-sb-employee-name">
        {selectedEmployee.full_name || 'N/A'}
      </div>
      <div className="sb-sb-ctc-info">
  <div><strong>Comp. Plan:</strong> {selectedEmployee.compensation_plan_name || 'N/A'}</div>
  <div><strong>CTC (Yearly):</strong> ₹{selectedEmployee.ctc ? parseFloat(selectedEmployee.ctc).toLocaleString() : 'N/A'}</div>
  <div><strong>CTC (Monthly):</strong> ₹{selectedEmployee.ctc ? (parseFloat(selectedEmployee.ctc) / 12).toLocaleString() : 'N/A'}</div>
</div>

      <div className="sb-sb-tab-buttons">
        <button
          className={`sb-sb-tab-button yearly ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          Yearly
        </button>
        <button
          className={`sb-sb-tab-button monthly ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </button>
      </div>
      <div className="sb-sb-tab-details">
        {(() => {
          const salaryDetails = calculateSalaryDetails(
            selectedEmployee.ctc,
            selectedEmployee.plan_data,
            selectedEmployee.employee_id,
            overtimeRecords,
            bonusRecords,
            advances,
            lopDetails
          );
          if (!salaryDetails || !selectedEmployee.employee_id) {
            return <p>No valid employee data provided</p>;
          }
          if (!selectedEmployee.ctc || selectedEmployee.ctc <= 0) {
            return <p>No valid CTC provided for this employee</p>;
          }
          const planData = selectedEmployee.plan_data || {};
          const basicSalary = salaryDetails.basicSalary || 0;
          const ctc = parseFloat(selectedEmployee.ctc) || 0;

          // Construct planDetail string based on enabled components
          const planDetailParts = [];
          // Basic Salary
          if (planData.isBasicSalary) {
            if (planData.basicSalaryType === 'percentage' && planData.basicSalary) {
              planDetailParts.push(`Basic: ${planData.basicSalary}% of CTC`);
            } else if (planData.basicSalaryType === 'amount' && planData.basicSalaryAmount) {
              planDetailParts.push(`Basic: ₹${parseFloat(planData.basicSalaryAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Basic: N/A`);
            }
          } else {
            planDetailParts.push(`Basic: N/A`);
          }
          // House Rent Allowance
          if (planData.isHouseRentAllowance) {
            if (planData.houseRentAllowanceType === 'percentage' && planData.houseRentAllowance) {
              planDetailParts.push(`HRA: ${planData.houseRentAllowance}% of Basic`);
            } else if (planData.houseRentAllowanceType === 'amount' && planData.houseRentAllowanceAmount) {
              planDetailParts.push(`HRA: ₹${parseFloat(planData.houseRentAllowanceAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`HRA: N/A`);
            }
          } else {
            planDetailParts.push(`HRA: N/A`);
          }
          // LTA Allowance
          if (planData.isLtaAllowance) {
            if (planData.ltaAllowanceType === 'percentage' && planData.ltaAllowance) {
              planDetailParts.push(`LTA: ${planData.ltaAllowance}% of Basic`);
            } else if (planData.ltaAllowanceType === 'amount' && planData.ltaAllowanceAmount) {
              planDetailParts.push(`LTA: ₹${parseFloat(planData.ltaAllowanceAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`LTA: N/A`);
            }
          } else {
            planDetailParts.push(`LTA: N/A`);
          }
          // Other Allowance
          if (planData.isOtherAllowance) {
            if (planData.otherAllowanceType === 'percentage' && planData.otherAllowance) {
              planDetailParts.push(`Other: ${planData.otherAllowance}% of CTC`);
            } else if (planData.otherAllowanceType === 'amount' && planData.otherAllowanceAmount) {
              planDetailParts.push(`Other: ₹${parseFloat(planData.otherAllowanceAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Other: N/A`);
            }
          } else {
            planDetailParts.push(`Other: N/A`);
          }
          // Variable Pay
          if (planData.isVariablePay) {
            if (planData.variablePayType === 'percentage' && planData.variablePay) {
              planDetailParts.push(`Variable Pay: ${planData.variablePay}% of CTC`);
            } else if (planData.variablePayType === 'amount' && planData.variablePayAmount) {
              planDetailParts.push(`Variable Pay: ₹${parseFloat(planData.variablePayAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Variable Pay: N/A`);
            }
          } else {
            planDetailParts.push(`Variable Pay: N/A`);
          }
          // Statutory Bonus
          if (planData.isStatutoryBonus) {
            if (planData.statutoryBonusType === 'percentage' && planData.statutoryBonusPercentage) {
              planDetailParts.push(`Bonus: ${planData.statutoryBonusPercentage}% of CTC`);
            } else if (planData.statutoryBonusType === 'amount' && planData.statutoryBonusAmount) {
              planDetailParts.push(`Bonus: ₹${parseFloat(planData.statutoryBonusAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Bonus: N/A`);
            }
          } else {
            planDetailParts.push(`Bonus: N/A`);
          }
          // Employee PF
          if (planData.isPFApplicable) {
            if (planData.pfType === 'percentage' && planData.pfPercentage) {
              planDetailParts.push(`Employee PF: ${planData.pfPercentage}% of Basic`);
            } else if (planData.pfType === 'amount' && planData.pfAmount) {
              planDetailParts.push(`Employee PF: ₹${parseFloat(planData.pfAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Employee PF: N/A`);
            }
          } else {
            planDetailParts.push(`Employee PF: N/A`);
          }
          // Employer PF
          if (planData.isPfEmployer) {
            if (planData.pfEmployerType === 'percentage' && planData.pfEmployer) {
              planDetailParts.push(`Employer PF: ${planData.pfEmployer}% of Basic`);
            } else if (planData.pfEmployerType === 'amount' && planData.pfEmployerAmount) {
              planDetailParts.push(`Employer PF: ₹${parseFloat(planData.pfEmployerAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Employer PF: N/A`);
            }
          } else {
            planDetailParts.push(`Employer PF: N/A`);
          }
          // ESIC
          if (planData.isESICApplicable) {
            if (planData.esicType === 'percentage' && planData.esicPercentage) {
              planDetailParts.push(`ESIC: ${planData.esicPercentage}% of Gross`);
            } else if (planData.esicType === 'amount' && planData.esicAmount) {
              planDetailParts.push(`ESIC: ₹${parseFloat(planData.esicAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`ESIC: N/A`);
            }
          } else {
            planDetailParts.push(`ESIC: N/A`);
          }
          // Gratuity
          if (planData.isGratuityApplicable) {
            if (planData.gratuityType === 'percentage' && planData.gratuityPercentage) {
              planDetailParts.push(`Gratuity: ${planData.gratuityPercentage}% of Basic`);
            } else if (planData.gratuityType === 'amount' && planData.gratuityAmount) {
              planDetailParts.push(`Gratuity: ₹${parseFloat(planData.gratuityAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Gratuity: N/A`);
            }
          } else {
            planDetailParts.push(`Gratuity: N/A`);
          }
          // Professional Tax
          if (planData.isProfessionalTax) {
            if (planData.professionalTaxType === 'percentage' && planData.professionalTax) {
              planDetailParts.push(`Prof. Tax: ${planData.professionalTax}% of CTC`);
            } else if (planData.professionalTaxType === 'amount' && planData.professionalTaxAmount) {
              planDetailParts.push(`Prof. Tax: ₹${parseFloat(planData.professionalTaxAmount).toLocaleString()}/month`);
            } else {
              planDetailParts.push(`Prof. Tax: N/A`);
            }
          } else {
            planDetailParts.push(`Prof. Tax: N/A`);
          }
          // Overtime Pay
          if (planData.isOvertimePay && planData.overtimePayAmount && planData.overtimePayType) {
            planDetailParts.push(`Overtime: ₹${parseFloat(planData.overtimePayAmount).toLocaleString()}/${planData.overtimePayType}`);
          } else {
            planDetailParts.push(`Overtime: N/A`);
          }

          const planDetail = `${selectedEmployee.compensation_plan_name || "N/A"} `;

          // const components = [
           
          //   {
          //     label: "Basic Salary",
          //     planDetail: planData.isBasicSalary
          //       ? (planData.basicSalaryType === 'percentage' && planData.basicSalary
          //           ? `${planData.basicSalary}% of CTC`
          //           : planData.basicSalaryType === 'amount' && planData.basicSalaryAmount
          //           ? `₹${parseFloat(planData.basicSalaryAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.basicSalary * 12,
          //     monthly: salaryDetails.basicSalary
          //   },
          //   {
          //     label: "HRA",
          //     planDetail: planData.isHouseRentAllowance
          //       ? (planData.houseRentAllowanceType === 'percentage' && planData.houseRentAllowance
          //           ? `${planData.houseRentAllowance}% of Basic`
          //           : planData.houseRentAllowanceType === 'amount' && planData.houseRentAllowanceAmount
          //           ? `₹${parseFloat(planData.houseRentAllowanceAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.hra * 12,
          //     monthly: salaryDetails.hra
          //   },
          //   {
          //     label: "LTA Allowance",
          //     planDetail: planData.isLtaAllowance
          //       ? (planData.ltaAllowanceType === 'percentage' && planData.ltaAllowance
          //           ? `${planData.ltaAllowance}% of Basic`
          //           : planData.ltaAllowanceType === 'amount' && planData.ltaAllowanceAmount
          //           ? `₹${parseFloat(planData.ltaAllowanceAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.ltaAllowance * 12,
          //     monthly: salaryDetails.ltaAllowance
          //   },
          //   {
          //     label: "Other Allowances",
          //     planDetail: planData.isOtherAllowance
          //       ? (planData.otherAllowanceType === 'percentage' && planData.otherAllowance
          //           ? `${planData.otherAllowance}% of CTC`
          //           : planData.otherAllowanceType === 'amount' && planData.otherAllowanceAmount
          //           ? `₹${parseFloat(planData.otherAllowanceAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.otherAllowances * 12,
          //     monthly: salaryDetails.otherAllowances
          //   },
          //   {
          //     label: "Overtime Pay",
          //     planDetail: planData.isOvertimePay && planData.overtimePayAmount && planData.overtimePayType
          //       ? `₹${parseFloat(planData.overtimePayAmount).toLocaleString()}/${planData.overtimePayType}`
          //       : 'N/A',
          //     yearly: salaryDetails.overtimePay * 12,
          //     monthly: salaryDetails.overtimePay
          //   },
          //   {
          //     label: "Bonus",
          //     planDetail: planData.isStatutoryBonus
          //       ? (planData.statutoryBonusType === 'percentage' && planData.statutoryBonusPercentage
          //           ? `${planData.statutoryBonusPercentage}% of CTC`
          //           : planData.statutoryBonusType === 'amount' && planData.statutoryBonusAmount
          //           ? `₹${parseFloat(planData.statutoryBonusAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.bonusPay * 12,
          //     monthly: salaryDetails.bonusPay
          //   },
          //   {
          //     label: "Adv. Recovery",
          //     planDetail: planData.advanceRecovery || salaryDetails.advanceRecovery
          //       ? `₹${parseFloat(planData.advanceRecovery || salaryDetails.advanceRecovery).toLocaleString()}/month`
          //       : 'N/A',
          //     yearly: salaryDetails.advanceRecovery * 12,
          //     monthly: salaryDetails.advanceRecovery,
          //     isDeduction: true
          //   },
          //   {
          //     label: "Employee PF",
          //     planDetail: planData.isPFApplicable
          //       ? (planData.pfType === 'percentage' && planData.pfPercentage
          //           ? `${planData.pfPercentage}% of Basic`
          //           : planData.pfType === 'amount' && planData.pfAmount
          //           ? `₹${parseFloat(planData.pfAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.employeePF * 12,
          //     monthly: salaryDetails.employeePF,
          //     isDeduction: true
          //   },
          //   {
          //     label: "Employer PF",
          //     planDetail: planData.isPfEmployer
          //       ? (planData.pfEmployerType === 'percentage' && planData.pfEmployer
          //           ? `${planData.pfEmployer}% of Basic`
          //           : planData.pfEmployerType === 'amount' && planData.pfEmployerAmount
          //           ? `₹${parseFloat(planData.pfEmployerAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.employerPF * 12,
          //     monthly: salaryDetails.employerPF
          //   },
          //   {
          //     label: "ESIC",
          //     planDetail: planData.isESICApplicable
          //       ? (planData.esicType === 'percentage' && planData.esicPercentage
          //           ? `${planData.esicPercentage}% of Gross`
          //           : planData.esicType === 'amount' && planData.esicAmount
          //           ? `₹${parseFloat(planData.esicAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.esic * 12,
          //     monthly: salaryDetails.esic,
          //     isDeduction: true
          //   },
          //   {
          //     label: "Gratuity",
          //     planDetail: planData.isGratuityApplicable
          //       ? (planData.gratuityType === 'percentage' && planData.gratuityPercentage
          //           ? `${planData.gratuityPercentage}% of Basic`
          //           : planData.gratuityType === 'amount' && planData.gratuityAmount
          //           ? `₹${parseFloat(planData.gratuityAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.gratuity * 12,
          //     monthly: salaryDetails.gratuity
          //   },
          //   {
          //     label: "Professional Tax",
          //     planDetail: planData.isProfessionalTax
          //       ? (planData.professionalTaxType === 'percentage' && planData.professionalTax
          //           ? `${planData.professionalTax}% of CTC`
          //           : planData.professionalTaxType === 'amount' && planData.professionalTaxAmount
          //           ? `₹${parseFloat(planData.professionalTaxAmount).toLocaleString()}/month`
          //           : 'N/A')
          //       : 'N/A',
          //     yearly: salaryDetails.professionalTax * 12,
          //     monthly: salaryDetails.professionalTax,
          //     isDeduction: true
          //   },
          //   {
          //     label: "Income Tax",
          //     planDetail: salaryDetails.incomeTax ? 'Based on tax slab' : 'N/A',
          //     yearly: salaryDetails.incomeTax * 12,
          //     monthly: salaryDetails.incomeTax,
          //     isDeduction: true
          //   },
          //   {
          //     label: "Insurance",
          //     planDetail: planData.insuranceAmount || salaryDetails.insurance
          //       ? `₹${parseFloat(planData.insuranceAmount || salaryDetails.insurance).toLocaleString()}/month`
          //       : 'N/A',
          //     yearly: salaryDetails.insurance * 12,
          //     monthly: salaryDetails.insurance,
          //     isDeduction: true
          //   },
          //   {
          //     label: "LOP Deduction",
          //     planDetail: salaryDetails.lopDeduction ? 'Based on attendance' : 'N/A',
          //     yearly: salaryDetails.lopDeduction * 12,
          //     monthly: salaryDetails.lopDeduction,
          //     isDeduction: true
          //   },
          // ];
          // const totalEarningsYearly = components
          //   .filter(comp => !comp.isDeduction)
          //   .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
          // const totalEarningsMonthly = components
          //   .filter(comp => !comp.isDeduction)
          //   .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
          // const totalDeductionsYearly = components
          //   .filter(comp => comp.isDeduction)
          //   .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
          // const totalDeductionsMonthly = components
          //   .filter(comp => comp.isDeduction)
          //   .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
          const components = [
  {
    label: "Basic Salary",
    planDetail: planData.isBasicSalary
      ? (planData.basicSalaryType === 'percentage' && planData.basicSalary
          ? `${planData.basicSalary}% of CTC`
          : planData.basicSalaryType === 'amount' && planData.basicSalaryAmount
          ? `₹${parseFloat(planData.basicSalaryAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.basicSalary * 12,
    monthly: salaryDetails.basicSalary
  },
  {
    label: "HRA",
    planDetail: planData.isHouseRentAllowance
      ? (planData.houseRentAllowanceType === 'percentage' && planData.houseRentAllowance
          ? `${planData.houseRentAllowance}% of Basic`
          : planData.houseRentAllowanceType === 'amount' && planData.houseRentAllowanceAmount
          ? `₹${parseFloat(planData.houseRentAllowanceAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.hra * 12,
    monthly: salaryDetails.hra
  },
  {
    label: "LTA Allowance",
    planDetail: planData.isLtaAllowance
      ? (planData.ltaAllowanceType === 'percentage' && planData.ltaAllowance
          ? `${planData.ltaAllowance}% of Basic`
          : planData.ltaAllowanceType === 'amount' && planData.ltaAllowanceAmount
          ? `₹${parseFloat(planData.ltaAllowanceAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.ltaAllowance * 12,
    monthly: salaryDetails.ltaAllowance
  },
  {
    label: "Other Allowances",
    planDetail: planData.isOtherAllowance
      ? (planData.otherAllowanceType === 'percentage' && planData.otherAllowance
          ? `${planData.otherAllowance}% of CTC`
          : planData.otherAllowanceType === 'amount' && planData.otherAllowanceAmount
          ? `₹${parseFloat(planData.otherAllowanceAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.otherAllowances * 12,
    monthly: salaryDetails.otherAllowances
  },
  {
    label: "Incentives",
    planDetail: planData.isIncentives
      ? (planData.incentivesType === 'percentage' && planData.incentives
          ? `${planData.incentives}% of CTC`
          : planData.incentivesType === 'amount' && planData.incentivesAmount
          ? `₹${parseFloat(planData.incentivesAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.incentives * 12,
    monthly: salaryDetails.incentives
  },
  {
    label: "Overtime Pay",
    planDetail: planData.isOvertimePay && planData.overtimePayAmount && planData.overtimePayType
      ? `₹${parseFloat(planData.overtimePayAmount).toLocaleString()}/${planData.overtimePayType}`
      : 'N/A',
    yearly: salaryDetails.overtimePay * 12,
    monthly: salaryDetails.overtimePay
  },
  {
    label: "Bonus",
    planDetail: planData.isStatutoryBonus
      ? (planData.statutoryBonusType === 'percentage' && planData.statutoryBonusPercentage
          ? `${planData.statutoryBonusPercentage}% of CTC`
          : planData.statutoryBonusType === 'amount' && planData.statutoryBonusAmount
          ? `₹${parseFloat(planData.statutoryBonusAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.bonusPay * 12,
    monthly: salaryDetails.bonusPay
  },
  {
    label: "Adv. Recovery",
    planDetail: planData.advanceRecovery || salaryDetails.advanceRecovery
      ? `₹${parseFloat(planData.advanceRecovery || salaryDetails.advanceRecovery).toLocaleString()}/month`
      : 'N/A',
    yearly: salaryDetails.advanceRecovery * 12,
    monthly: salaryDetails.advanceRecovery,
    isDeduction: true
  },
  {
    label: "Employee PF",
    planDetail: planData.isPFApplicable && planData.isPFEmployee
      ? (planData.pfEmployeeType === 'percentage' && planData.pfEmployeePercentage
          ? `${planData.pfEmployeePercentage}% of Basic`
          : planData.pfEmployeeType === 'amount' && planData.pfEmployeeAmount
          ? `₹${parseFloat(planData.pfEmployeeAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.employeePF * 12,
    monthly: salaryDetails.employeePF,
    isDeduction: true
  },
  {
    label: "Employer PF",
    planDetail: planData.isPFApplicable && planData.isPFEmployer
      ? (planData.pfEmployerType === 'percentage' && planData.pfEmployerPercentage
          ? `${planData.pfEmployerPercentage}% of Basic`
          : planData.pfEmployerType === 'amount' && planData.pfEmployerAmount
          ? `₹${parseFloat(planData.pfEmployerAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.employerPF * 12,
    monthly: salaryDetails.employerPF
  },
  {
    label: "ESIC",
    planDetail: planData.isMedicalApplicable && planData.isESICEmployee
      ? (planData.esicEmployeeType === 'percentage' && planData.esicEmployeePercentage
          ? `${planData.esicEmployeePercentage}% of Gross`
          : planData.esicEmployeeType === 'amount' && planData.esicEmployeeAmount
          ? `₹${parseFloat(planData.esicEmployeeAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.esic * 12,
    monthly: salaryDetails.esic,
    isDeduction: true
  },
  {
    label: "Gratuity",
    planDetail: planData.isGratuityApplicable
      ? (planData.gratuityType === 'percentage' && planData.gratuityPercentage
          ? `${planData.gratuityPercentage}% of Basic`
          : planData.gratuityType === 'amount' && planData.gratuityAmount
          ? `₹${parseFloat(planData.gratuityAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.gratuity * 12,
    monthly: salaryDetails.gratuity
  },
  {
    label: "Professional Tax",
    planDetail: planData.isProfessionalTax
      ? (planData.professionalTaxType === 'percentage' && planData.professionalTax
          ? `${planData.professionalTax}% of CTC`
          : planData.professionalTaxType === 'amount' && planData.professionalTaxAmount
          ? `₹${parseFloat(planData.professionalTaxAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.professionalTax * 12,
    monthly: salaryDetails.professionalTax,
    isDeduction: true
  },
  {
    label: "Income Tax",
    planDetail: salaryDetails.incomeTax ? 'Based on tax slab' : 'N/A',
    yearly: salaryDetails.incomeTax * 12,
    monthly: salaryDetails.incomeTax,
    isDeduction: true
  },
  {
    label: "Insurance",
    planDetail: planData.isMedicalApplicable && planData.isInsuranceEmployee
      ? (planData.insuranceEmployeeType === 'percentage' && planData.insuranceEmployeePercentage
          ? `${planData.insuranceEmployeePercentage}% of Gross`
          : planData.insuranceEmployeeType === 'amount' && planData.insuranceEmployeeAmount
          ? `₹${parseFloat(planData.insuranceEmployeeAmount).toLocaleString()}/month`
          : 'N/A')
      : 'N/A',
    yearly: salaryDetails.insurance * 12,
    monthly: salaryDetails.insurance,
    isDeduction: true
  },
  {
    label: "LOP Deduction",
    planDetail: salaryDetails.lopDeduction ? 'Based on attendance' : 'N/A',
    yearly: salaryDetails.lopDeduction * 12,
    monthly: salaryDetails.lopDeduction,
    isDeduction: true
  }
];

const totalEarningsYearly = components
  .filter(comp => !comp.isDeduction)
  .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
const totalEarningsMonthly = components
  .filter(comp => !comp.isDeduction)
  .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
const totalDeductionsYearly = components
  .filter(comp => comp.isDeduction)
  .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
const totalDeductionsMonthly = components
  .filter(comp => comp.isDeduction)
  .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
          return (
            <table className="sb-sb-table sb-sb-single-details-table">
              <thead>
                <tr>
                  <th className="sb-sb-table-header sb-sb-align-left">Component</th>
                  <th className="sb-sb-table-header sb-sb-align-left">Comp.Plan</th>
                  <th className="sb-sb-table-header sb-sb-align-right">{activeTab === 'yearly' ? 'Yearly Amount' : 'Monthly Amount'}</th>
                </tr>
              </thead>
              <tbody className="sb-sb-table-body-wrapper">
                {components.map((item, index) => (
                  <tr key={index}>
                    <td className="sb-sb-table-cell sb-sb-align-left">{item.label}</td>
                    <td className="sb-sb-table-cell sb-sb-align-left">{item.planDetail || "N/A"}</td>
                    <td className="sb-sb-table-cell sb-sb-align-right">
                      {typeof (activeTab === 'yearly' ? item.yearly : item.monthly) === "number"
                        ? `₹${parseFloat(activeTab === 'yearly' ? item.yearly : item.monthly).toLocaleString()}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
                <tr className="sb-sb-total-row">
                  <td className="sb-sb-table-cell sb-sb-align-left"><strong> Earnings</strong></td>
                  <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
                  <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{parseFloat(activeTab === 'yearly' ? totalEarningsYearly : totalEarningsMonthly).toLocaleString()}</strong></td>
                </tr>
                <tr className="sb-sb-total-row">
                  <td className="sb-sb-table-cell sb-sb-align-left"><strong> Deductions</strong></td>
                  <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
                  <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{parseFloat(activeTab === 'yearly' ? totalDeductionsYearly : totalDeductionsMonthly).toLocaleString()}</strong></td>
                </tr>
                <tr className="sb-sb-total-row">
                  <td className="sb-sb-table-cell sb-sb-align-left"><strong>Gross Salary</strong></td>
                  <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
                  <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{parseFloat(activeTab === 'yearly' ? salaryDetails.grossSalary * 12 : salaryDetails.grossSalary).toLocaleString()}</strong></td>
                </tr>
                <tr className="sb-sb-total-row">
                  <td className="sb-sb-table-cell sb-sb-align-left"><strong>Net Salary</strong></td>
                  <td className="sb-sb-table-cell sb-sb-align-left">N/A</td>
                  <td className="sb-sb-table-cell sb-sb-align-right"><strong>₹{parseFloat(activeTab === 'yearly' ? salaryDetails.netSalary * 12 : salaryDetails.netSalary).toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          );
        })()}
      </div>
    </div>
  </div>
)}
              </div>
            </div>
          ) : (
            <p>No employee data available</p>
          )}
        </>
      )}

      {viewMode === "allDetails" && (
      //       <div className="esd-container">
      //   <div className="esd-header">
      //     <button className="esd-back-button" onClick={handleBackToMain}>
      //       <svg className="esd-back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      //         <path d="M15 18l-6-6 6-6" />
      //       </svg>
            
      //     </button>
      //     <div className="esd-header-title">Employee Salary Overview</div>
      //   </div>
      //   <div className="esd-search-container">
      //     <input
      //       type="text"
      //       className="esd-search-input"
      //       placeholder="Search by ID or Name"
      //       value={searchQuery}
      //       onChange={(e) => setSearchQuery(e.target.value)}
      //     />
      //   </div>
      //   {employees.length > 0 ? (
      //     <div className="esd-table-container">
      //       <div className="esd-table-wrapper">
      //         <table className="esd-table">
      //           <thead>
      //             <tr>
      //               <th className="esd-table-header esd-align-left esd-sticky-column esd-id-column">ID</th>
      //               <th className="esd-table-header esd-align-left esd-sticky-column esd-name-column">Name</th>
      //               <th className="esd-table-header esd-align-right">Annual CTC</th>
      //               <th className="esd-table-header esd-align-right">Basic Salary</th>
      //               <th className="esd-table-header esd-align-right">HRA</th>
      //               <th className="esd-table-header esd-align-right">LTA</th>
      //               <th className="esd-table-header esd-align-right">Other Allow.</th>
      //               <th className="esd-table-header esd-align-right">Overtime</th>
      //               <th className="esd-table-header esd-align-right">Bonus</th>
      //               <th className="esd-table-header esd-align-right">Advance Rec.</th>
      //               <th className="esd-table-header esd-align-right">Emp. PF</th>
      //               <th className="esd-table-header esd-align-right">Employer PF</th>
      //               <th className="esd-table-header esd-align-right">ESIC</th>
      //               <th className="esd-table-header esd-align-right">Gratuity</th>
      //               <th className="esd-table-header esd-align-right">Prof. Tax</th>
      //               <th className="esd-table-header esd-align-right">Income Tax</th>
      //               <th className="esd-table-header esd-align-right">Insurance</th>
      //               <th className="esd-table-header esd-align-right">LOP Ded.</th>
      //               <th className="esd-table-header esd-align-right">Gross Salary</th>
      //               <th className="esd-table-header esd-align-right">Net Salary</th>
      //             </tr>
      //           </thead>
      //           <tbody className="esd-table-body">
      //             {employees.map((emp) => {
      //               const salaryDetails = calculateSalaryDetails(emp.ctc, emp.plan_data, emp.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
      //               return (
      //                 <tr key={emp.employee_id}>
      //                   <td className="esd-table-cell esd-align-left esd-sticky-column esd-id-column">{emp.employee_id}</td>
      //                   <td className="esd-table-cell esd-align-left esd-sticky-column esd-name-column">{emp.full_name}</td>
      //                   <td className="esd-table-cell esd-align-right">{emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.incomeTax).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.lopDeduction).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : "N/A"}</td>
      //                   <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.netSalary).toLocaleString()}` : "N/A"}</td>
      //                 </tr>
      //               );
      //             })}
      //           </tbody>
      //         </table>
      //       </div>
      //     </div>
      //   ) : (
      //     <p className="esd-no-data">No employee data available.</p>
      //   )}
      // </div>
    <div className="esd-container">
        <div className="esd-header">
          <button className="esd-back-button" onClick={handleBackToMain}>
            <svg className="esd-back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            
          </button>
          <div className="esd-header-title">Employee Salary Overview</div>
        </div>
        <div className="esd-search-container">
          <input
            type="text"
            className="esd-search-input"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredEmployees3.length > 0 ? (
          <div className="esd-table-container">
            <div className="esd-table-wrapper">
              <table className="esd-table">
                <thead>
                  <tr>
                    <th className="esd-table-header esd-align-left esd-id-column">ID</th>
                    <th className="esd-table-header esd-align-left esd-name-column">Name</th>
                    <th className="esd-table-header esd-align-right">Annual CTC</th>
                    <th className="esd-table-header esd-align-right">Basic Salary</th>
                    <th className="esd-table-header esd-align-right">HRA</th>
                    <th className="esd-table-header esd-align-right">LTA</th>
                    <th className="esd-table-header esd-align-right">Other Allow.</th>
                    <th className="esd-table-header esd-align-right">Overtime</th>
                    <th className="esd-table-header esd-align-right">Bonus</th>
                    <th className="esd-table-header esd-align-right">Advance Rec.</th>
                    <th className="esd-table-header esd-align-right">Emp. PF</th>
                    <th className="esd-table-header esd-align-right">Employer PF</th>
                    <th className="esd-table-header esd-align-right">ESIC</th>
                    <th className="esd-table-header esd-align-right">Gratuity</th>
                    <th className="esd-table-header esd-align-right">Prof. Tax</th>
                    <th className="esd-table-header esd-align-right">Income Tax</th>
                    <th className="esd-table-header esd-align-right">Insurance</th>
                    <th className="esd-table-header esd-align-right">LOP Ded.</th>
                    <th className="esd-table-header esd-align-right">Gross Salary</th>
                    <th className="esd-table-header esd-align-right">Net Salary</th>
                  </tr>
                </thead>
                <tbody className="esd-table-body">
                  {filteredEmployees.map((emp) => {
                    const salaryDetails = calculateSalaryDetails(emp.ctc, emp.plan_data, emp.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
                    return (
                      <tr key={emp.employee_id}>
                        <td className="esd-table-cell esd-align-left esd-id-column">{emp.employee_id}</td>
                        <td className="esd-table-cell esd-align-left esd-name-column">{emp.full_name}</td>
                        <td className="esd-table-cell esd-align-right">{emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.incomeTax).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.lopDeduction).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : "N/A"}</td>
                        <td className="esd-table-cell esd-align-right">{salaryDetails ? `₹${parseFloat(salaryDetails.netSalary).toLocaleString()}` : "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="esd-no-data">No employee data available.</p>
        )}
      </div>
      )}




      {viewMode === "noPlanDetails" && (
  <div className="sb-no-plan-details-container">
    <div className="sb-no-plan-details-header">
      
      <button className="sb-no-plan-back-button" onClick={handleBackToMain}>
  <svg
    className="sb-no-plan-back-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path fillRule="evenodd" d="M11 1.5a.5.5 0 0 1 0 .707L5.707 8 11 13.293a.5.5 0 0 1-.707.707l-6-6a.5.5 0 0 1 0-.707l6-6a.5.5 0 0 1 .707 0z"/>
  </svg>
  
</button>

      <div className="sb-no-plan-title">Employees Without Compensation Plans</div>
    </div>
<div className="sb-no-plan-search-container">
  <input
    type="text"
    className="sb-no-plan-search-input"
    placeholder="Search by name or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

    {employeesWithoutPlans.length > 0 ? (
      <div className="sb-no-plan-table-wrapper">
        <table className="sb-no-plan-table">
          <thead>
            <tr>
              <th className="sb-no-plan-align-left sb-no-plan-sticky-column">Employee ID</th>
              <th className="sb-no-plan-align-left sb-no-plan-sticky-column">Full Name</th>
              <th className="sb-no-plan-align-center">Action</th>
            </tr>
          </thead>
          <tbody>
{filteredEmployees2.map((emp) => (
              <tr key={emp.employee_id}>
                <td className="sb-no-plan-align-left sb-no-plan-sticky-column">{emp.employee_id}</td>
                <td className="sb-no-plan-align-left sb-no-plan-sticky-column">{emp.full_name}</td>
                <td className="sb-no-plan-align-center">
                  <button
                    className="sb-no-plan-assign-button"
                    onClick={() => openAssignModal(emp.employee_id, emp.full_name)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="sb-no-plan-message">No employees without compensation plans found.</p>
    )}
  </div>
)}

     {bonusModal.isVisible && (
  <div className="sb-sb-modal-overlay">
    <div className="sb-sb-modal">
      {/* Header */}
      <div className="sb-sb-modal-header">
        <h2>Add Bonus</h2>
        <button className="sb-sb-close-button" onClick={closeBonusModal}>
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="sb-sb-bonus-form">
        <p className="sb-sb-bonus-info">
          The specified bonus details will be recorded for the selected month
          and year. Select one option below:
        </p>

        {bonusModal.error && (
          <p className="sb-sb-error-message">{bonusModal.error}</p>
        )}

        {/* Percentage of CTC */}
        <div className="sb-sb-bonus-field">
          <input
            type="radio"
            id="percentageCtcOption"
            name="bonusOption"
            value="percentageCtc"
            checked={bonusModal.selectedOption === "percentageCtc"}
            onChange={(e) =>
              setBonusModal({
                ...bonusModal,
                selectedOption: e.target.value,
                error: "",
              })
            }
          />
          <label htmlFor="percentageCtc">CTC Percentage (%):</label>
          <input
            type="number"
            id="percentageCtc"
            value={bonusModal.percentageCtc}
            onChange={(e) =>
              setBonusModal({
                ...bonusModal,
                percentageCtc: e.target.value,
                error: "",
              })
            }
            placeholder="Enter CTC percentage"
            min="0"
            max="100"
            step="0.01"
            className="sb-sb-bonus-input"
            disabled={bonusModal.selectedOption !== "percentageCtc"}
          />
        </div>

        {/* Monthly salary count */}
        <div className="sb-sb-bonus-field">
          <input
            type="radio"
            id="monthlySalaryCountOption"
            name="bonusOption"
            value="monthlySalaryCount"
            checked={bonusModal.selectedOption === "monthlySalaryCount"}
            onChange={(e) =>
              setBonusModal({
                ...bonusModal,
                selectedOption: e.target.value,
                error: "",
              })
            }
          />
          <label htmlFor="monthlySalaryCount">No of Monthly Salary:</label>
          <div className="sb-sb-monthly-salary-container">
            <select
              id="monthlySalaryCount"
              value={bonusModal.monthlySalaryCount}
              onChange={(e) =>
                setBonusModal({
                  ...bonusModal,
                  monthlySalaryCount: e.target.value,
                  error: "",
                })
              }
              className="sb-sb-bonus-input"
              disabled={bonusModal.selectedOption !== "monthlySalaryCount"}
            >
              <option value="">Select Number</option>
              {monthlySalaryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="sb-sb-month-label">Month(s)</span>
          </div>
        </div>

        {/* Fixed Amount */}
        <div className="sb-sb-bonus-field">
          <input
            type="radio"
            id="fixedAmountOption"
            name="bonusOption"
            value="fixedAmount"
            checked={bonusModal.selectedOption === "fixedAmount"}
            onChange={(e) =>
              setBonusModal({
                ...bonusModal,
                selectedOption: e.target.value,
                error: "",
              })
            }
          />
          <label htmlFor="fixedAmount">Fixed Amount (₹):</label>
          <input
            type="number"
            id="fixedAmount"
            value={bonusModal.fixedAmount}
            onChange={(e) =>
              setBonusModal({
                ...bonusModal,
                fixedAmount: e.target.value,
                error: "",
              })
            }
            placeholder="Enter fixed amount"
            min="0"
            step="1"
            className="sb-sb-bonus-input"
            disabled={bonusModal.selectedOption !== "fixedAmount"}
          />
        </div>

        {/* Month & Year */}
        <div className="sb-sb-bonus-field-row">
  {/* Month */}
  <div className="sb-sb-bonus-half">
    <label htmlFor="bonusMonth" className="sb-sb-label">Month:</label>
    <select
      id="bonusMonth"
      value={bonusModal.selectedMonth}
      onChange={(e) =>
        setBonusModal({
          ...bonusModal,
          selectedMonth: e.target.value,
          error: "",
        })
      }
      className="sb-sb-bonus-input"
    >
      <option value="">Select Month</option>
      {months.map((month) => (
        <option key={month} value={month}>
          {new Date(0, parseInt(month) - 1).toLocaleString("en-US", {
            month: "long",
          })}
        </option>
      ))}
    </select>
  </div>

  {/* Year */}
  <div className="sb-sb-bonus-half">
    <label htmlFor="bonusYear" className="sb-sb-label">Year:</label>
    <input
      type="number"
      id="bonusYear"
      value={bonusModal.selectedYear}
      onChange={(e) =>
        setBonusModal({
          ...bonusModal,
          selectedYear: e.target.value,
          error: "",
        })
      }
      placeholder="Enter year (e.g., 2025)"
      min="2000"
      max="2100"
      step="1"
      className="sb-sb-bonus-input"
    />
  </div>
</div>

      </div>

      {/* Footer */}
      <div className="sb-sb-modal-footer">
        <button className="sb-sb-cancel-button" onClick={closeBonusModal}>
          Cancel
        </button>
        <button className="sb-sb-submit-button" onClick={handleBonusSubmit}>
          Submit
        </button>
      </div>
    </div>
  </div>
)}

      {advanceModal.isVisible && (
  <div className="sb-sb-modal-overlay">
    <div className="sb-sb-modal">
      {/* Modal Header */}
      <div className="sb-sb-modal-header">
        <h2>Add Advance for {advanceModal.fullName}</h2>
        <button className="sb-sb-close-button" onClick={closeAdvanceModal}>&times;</button>
      </div>

      {/* Modal Body */}
      <div className="sb-sb-advance-form">
        <p className="sb-sb-advance-info">
  Note: The allowed maximum advance is up to three months' salary — ₹{(getMonthlySalary(advanceModal.employeeId, employees) * 3).toLocaleString()}.
</p>


        {advanceModal.error && (
          <p className="sb-sb-error-message">{advanceModal.error}</p>
        )}

        <div className="sb-sb-advance-field">
          <label htmlFor="advanceAmount">Advance Amount (₹):</label>
          <input
            type="number"
            id="advanceAmount"
            value={advanceModal.advanceAmount}
            onChange={(e) =>
              setAdvanceModal({
                ...advanceModal,
                advanceAmount: e.target.value,
                error: "",
              })
            }
            placeholder="Enter advance amount"
            min="0"
            step="1"
            className="sb-sb-advance-input"
          />
        </div>

        <div className="sb-sb-advance-field">
          <label htmlFor="recoveryMonths">No of Iterations:</label>
          <input
            type="number"
            id="recoveryMonths"
            value={advanceModal.recoveryMonths}
            onChange={(e) =>
              setAdvanceModal({
                ...advanceModal,
                recoveryMonths: e.target.value,
                error: "",
              })
            }
            placeholder="Enter number of iterations"
            min="1"
            step="1"
            className="sb-sb-advance-input"
          />
        </div>

        {advanceModal.advanceAmount && advanceModal.recoveryMonths && (
          <div className="sb-sb-advance-field">
            <p>
              Advance per iteration: ₹
              {calculateAdvancePerIteration(advanceModal).toLocaleString()}
            </p>
          </div>
        )}

        <div className="sb-sb-advance-field">
          <label htmlFor="applicableMonth">Applicable From:</label>
          <select
            id="applicableMonth"
            value={advanceModal.applicableMonth}
            onChange={(e) =>
              setAdvanceModal({
                ...advanceModal,
                applicableMonth: e.target.value,
                error: "",
              })
            }
            className="sb-sb-advance-input"
          >
            <option value="">Select Month</option>
            {getAvailableMonths().map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="sb-sb-modal-footer">
        <button className="sb-sb-cancel-button" onClick={closeAdvanceModal}>
          Cancel
        </button>
        <button className="sb-sb-submit-button" onClick={handleAdvanceSubmit}>
          Submit
        </button>
      </div>
    </div>
  </div>
)}

      <Modal
        isVisible={messageModal.isVisible}
        onClose={closeMessageModal}
        title={messageModal.title}
        headerClassName="sb-sb-modal-header"
        buttons={[{ label: "Close", onClick: closeMessageModal, className: "sb-sb-cancel-button" }]}
      >
        <div className="sb-sb-message-container">
          <p className={messageModal.isError ? "sb-sb-error-message" : "sb-sb-success-message"}>
            {messageModal.message}
          </p>
        </div>
      </Modal>
      {assignModal.isVisible && (
  <div className="ac-modal-overlay">
    <div className="ac-modal-box">
      {/* Header */}
      <div className="ac-modal-header">
        <h2 className="ac-modal-title">Assign Compensation for {assignModal.fullName}</h2>
        <button className="ac-modal-close" onClick={closeAssignModal}>&times;</button>
      </div>

      {/* Body */}
      <div className="ac-modal-body">
        {assignModal.error && <p className="ac-modal-error">{assignModal.error}</p>}

        <div className="ac-modal-field">
          <label htmlFor="compensationSelect" className="ac-modal-label">Compensation Plan:</label>
          <select
            id="compensationSelect"
            value={assignModal.selectedCompensation}
            onChange={(e) =>
              setAssignModal({
                ...assignModal,
                selectedCompensation: e.target.value,
                error: "",
              })
            }
            className="ac-modal-select"
          >
            <option value="">Select Compensation Plan</option>
            {assignModal.compensationList.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.compensation_plan_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="ac-modal-footer">
        <button className="ac-btn-cancel" onClick={closeAssignModal}>Cancel</button>
        <button className="ac-btn-submit" onClick={handleAssignSubmit}>Assign</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SalaryBreakup;