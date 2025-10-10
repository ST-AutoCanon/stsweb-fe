// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';
// // // // import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
// // // // import {
// // // //   calculateSalaryDetails,
// // // // } from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
// // // // import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
// // // // import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

// // // // const SalaryDetails = () => {
// // // //   const [employees, setEmployees] = useState([]);
// // // //   const [advances, setAdvances] = useState([]);
// // // //   const [overtimeRecords, setOvertimeRecords] = useState([]);
// // // //   const [bonusRecords, setBonusRecords] = useState([]);
// // // //   const [employeeLopData, setEmployeeLopData] = useState({});
// // // //   const [employeeIncentiveData, setEmployeeIncentiveData] = useState({});
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search

// // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // //   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
// // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // //   useEffect(() => {
// // // //     const fetchSalaryBreakupData = async () => {
// // // //       console.log("Environment Variables:", {
// // // //         API_KEY: process.env.REACT_APP_API_KEY,
// // // //         BASE_URL: process.env.REACT_APP_BACKEND_URL,
// // // //         meId,
// // // //       });

// // // //       if (!process.env.REACT_APP_API_KEY || !meId) {
// // // //         console.error("Missing credentials: API_KEY or meId");
// // // //         setIsLoading(false);
// // // //         return;
// // // //       }

// // // //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
// // // //       console.log("Fetching data with headers:", headers);

// // // //       try {
// // // //         setIsLoading(true);
// // // //         const [
// // // //           compensationsRes,
// // // //           employeesRes,
// // // //           advancesRes,
// // // //           overtimeRes,
// // // //           bonusRes,
// // // //         ] = await Promise.all([
// // // //           axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
// // // //             console.error("Error fetching compensations/list:", err);
// // // //             throw err;
// // // //           }),
// // // //           axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
// // // //             console.error("Error fetching compensation/assigned:", err);
// // // //             throw err;
// // // //           }),
// // // //           axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
// // // //             console.error("Error fetching compensation/advance-details:", err);
// // // //             throw err;
// // // //           }),
// // // //           axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
// // // //             console.error("Error fetching compensation/overtime-status-summary:", err);
// // // //             throw err;
// // // //           }),
// // // //           axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
// // // //             console.error("Error fetching compensation/bonus-list:", err);
// // // //             throw err;
// // // //           }),
// // // //         ]);

// // // //         console.log("API Responses:", {
// // // //           compensations: compensationsRes.data,
// // // //           employees: employeesRes.data,
// // // //           advances: advancesRes.data,
// // // //           overtime: overtimeRes.data,
// // // //           bonus: bonusRes.data,
// // // //         });

// // // //         const compensationMap = new Map();
// // // //         (compensationsRes.data.data || []).forEach((comp) => {
// // // //           compensationMap.set(comp.compensation_plan_name, comp.plan_data);
// // // //         });

// // // //         const enrichedEmployeesMap = new Map();
// // // //         (employeesRes.data.data || []).forEach((emp) => {
// // // //           if (!enrichedEmployeesMap.has(emp.employee_id)) {
// // // //             enrichedEmployeesMap.set(emp.employee_id, {
// // // //               ...emp,
// // // //               plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
// // // //             });
// // // //           } else {
// // // //             console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
// // // //           }
// // // //         });
// // // //         const enrichedEmployees = Array.from(enrichedEmployeesMap.values());
// // // //         setEmployees(enrichedEmployees);
// // // //         setAdvances(advancesRes.data.data || []);
// // // //         setOvertimeRecords(overtimeRes.data.data || []);
// // // //         setBonusRecords(bonusRes.data.data || []);

// // // //         const lopDataPromises = enrichedEmployees.map((emp) =>
// // // //           calculateLOPEffect(emp.employee_id)
// // // //             .then((result) => ({
// // // //               employeeId: emp.employee_id,
// // // //               lopData: result,
// // // //             }))
// // // //             .catch((err) => {
// // // //               console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
// // // //               return {
// // // //                 employeeId: emp.employee_id,
// // // //                 lopData: {
// // // //                   currentMonth: { days: 0, value: "0.00", currency: "INR" },
// // // //                   deferred: { days: 0, value: "0.00", currency: "INR" },
// // // //                   nextMonth: { days: 0, value: "0.00", currency: "INR" },
// // // //                   yearly: { days: 0, value: "0.00", currency: "INR" },
// // // //                 },
// // // //               };
// // // //             })
// // // //         );

// // // //         const lopDataResults = await Promise.all(lopDataPromises);
// // // //         const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
// // // //           acc[employeeId] = lopData;
// // // //           return acc;
// // // //         }, {});
// // // //         setEmployeeLopData(lopDataMap);

// // // //         const incentiveDataPromises = enrichedEmployees.map((emp) =>
// // // //           calculateIncentives(emp.employee_id)
// // // //             .then((result) => ({
// // // //               employeeId: emp.employee_id,
// // // //               incentiveData: result,
// // // //             }))
// // // //             .catch((err) => {
// // // //               console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
// // // //               return {
// // // //                 employeeId: emp.employee_id,
// // // //                 incentiveData: {
// // // //                   ctcIncentive: { value: "0.00", currency: "INR" },
// // // //                   salesIncentive: { value: "0.00", currency: "INR" },
// // // //                   totalIncentive: { value: "0.00", currency: "INR" },
// // // //                 },
// // // //               };
// // // //             })
// // // //         );

// // // //         const incentiveDataResults = await Promise.all(incentiveDataPromises);
// // // //         const incentiveDataMap = incentiveDataResults.reduce(
// // // //           (acc, { employeeId, incentiveData }) => {
// // // //             if (!acc[employeeId] || parseFloat(incentiveData.totalIncentive.value) > 0) {
// // // //               acc[employeeId] = incentiveData;
// // // //             }
// // // //             return acc;
// // // //           },
// // // //           {}
// // // //         );
// // // //         setEmployeeIncentiveData(incentiveDataMap);

// // // //       } catch (error) {
// // // //         console.error("Fetch error:", error);
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     };

// // // //     fetchSalaryBreakupData();
// // // //   }, []);

// // // //   const filteredEmployees = (employees || []).filter(
// // // //     (emp) =>
// // // //       emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
// // // //       emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
// // // //   );

// // // //   if (isLoading) {
// // // //     return <div className="sd-loading">Loading...</div>; // Simple loading state
// // // //   }

// // // //   return (
// // // //     <div className="sd-container">
// // // //       <div className="sd-header">
// // // //         <div className="sd-header-title">Employee Salary Overview</div> {/* No back button, as per request */}
// // // //       </div>
// // // //       <div className="sd-search-container">
// // // //         <input
// // // //           type="text"
// // // //           className="sd-search-input"
// // // //           placeholder="Search by ID or Name"
// // // //           value={searchQuery}
// // // //           onChange={(e) => setSearchQuery(e.target.value)}
// // // //         />
// // // //       </div>
// // // //       {filteredEmployees.length > 0 ? (
// // // //         <div className="sd-table-container">
// // // //           <div className="sd-table-wrapper">
// // // //             <table className="sd-table">
// // // //               <thead>
// // // //                 <tr>
// // // //                   <th className="sd-table-header sd-align-left sd-id-column">ID</th>
// // // //                   <th className="sd-table-header sd-align-left sd-name-column">Name</th>
// // // //                   <th className="sd-table-header sd-align-right">Annual CTC</th>
// // // //                   <th className="sd-table-header sd-align-right">Basic Salary</th>
// // // //                   <th className="sd-table-header sd-align-right">HRA</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">LTA</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Other Allow.</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Incentives</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Overtime</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Bonus</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Advance Rec.</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Emp. PF</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Employer PF</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">ESIC</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Gratuity</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Prof. Tax</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Income Tax</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Insurance</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Days</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Ded.</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Gross Salary</th>
// // // //                   <th className="sd-table-header sd-align-right sd-scrollable">Net Salary</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="sd-table-body">
// // // //                 {filteredEmployees.map((emp) => {
// // // //                   const salaryDetails = calculateSalaryDetails(
// // // //                     emp.ctc,
// // // //                     emp.plan_data,
// // // //                     emp.employee_id,
// // // //                     overtimeRecords || [],
// // // //                     bonusRecords || [],
// // // //                     advances || [],
// // // //                     employeeIncentiveData || {}
// // // //                   );
// // // //                   const lopData =
// // // //                     employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
// // // //                       currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       deferred: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       yearly: { days: 0, value: '0.00', currency: 'INR' },
// // // //                     } : {
// // // //                       currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       deferred: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // // //                       yearly: { days: 0, value: '0.00', currency: 'INR' },
// // // //                     };

// // // //                   // Calculate incentive for this employee
// // // //                   const empId = String(emp.employee_id).toUpperCase();
// // // //                   const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
// // // //                   const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
// // // //                   const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

// // // //                   const netSalary = salaryDetails
// // // //                     ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
// // // //                     : 0;
// // // //                   return (
// // // //                     <tr key={emp.employee_id}>
// // // //                       <td className="sd-table-cell sd-align-left sd-id-column">{emp.employee_id}</td>
// // // //                       <td className="sd-table-cell sd-align-left sd-name-column">{emp.full_name}</td>
// // // //                       <td className="sd-table-cell sd-align-right">
// // // //                         {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {lopData ? lopData.currentMonth.days : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // // //                         {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                       <td className="sd-table-cell sd-align-right sd-scrollable">
// // // //                         {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
// // // //                       </td>
// // // //                     </tr>
// // // //                   );
// // // //                 })}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>
// // // //       ) : (
// // // //         <p className="sd-no-data">No employees found</p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SalaryDetails;
// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import * as XLSX from 'xlsx';
// // // import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
// // // import {
// // //   calculateSalaryDetails,
// // // } from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
// // // import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
// // // import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

// // // const SalaryDetails = () => {
// // //   const [employees, setEmployees] = useState([]);
// // //   const [advances, setAdvances] = useState([]);
// // //   const [overtimeRecords, setOvertimeRecords] = useState([]);
// // //   const [bonusRecords, setBonusRecords] = useState([]);
// // //   const [employeeLopData, setEmployeeLopData] = useState({});
// // //   const [employeeIncentiveData, setEmployeeIncentiveData] = useState({});
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search

// // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // //   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
// // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // //   useEffect(() => {
// // //     const fetchSalaryBreakupData = async () => {
// // //       console.log("Environment Variables:", {
// // //         API_KEY: process.env.REACT_APP_API_KEY,
// // //         BASE_URL: process.env.REACT_APP_BACKEND_URL,
// // //         meId,
// // //       });

// // //       if (!process.env.REACT_APP_API_KEY || !meId) {
// // //         console.error("Missing credentials: API_KEY or meId");
// // //         setIsLoading(false);
// // //         return;
// // //       }

// // //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
// // //       console.log("Fetching data with headers:", headers);

// // //       try {
// // //         setIsLoading(true);
// // //         const [
// // //           compensationsRes,
// // //           employeesRes,
// // //           advancesRes,
// // //           overtimeRes,
// // //           bonusRes,
// // //         ] = await Promise.all([
// // //           axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
// // //             console.error("Error fetching compensations/list:", err);
// // //             throw err;
// // //           }),
// // //           axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
// // //             console.error("Error fetching compensation/assigned:", err);
// // //             throw err;
// // //           }),
// // //           axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
// // //             console.error("Error fetching compensation/advance-details:", err);
// // //             throw err;
// // //           }),
// // //           axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
// // //             console.error("Error fetching compensation/overtime-status-summary:", err);
// // //             throw err;
// // //           }),
// // //           axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
// // //             console.error("Error fetching compensation/bonus-list:", err);
// // //             throw err;
// // //           }),
// // //         ]);

// // //         console.log("API Responses:", {
// // //           compensations: compensationsRes.data,
// // //           employees: employeesRes.data,
// // //           advances: advancesRes.data,
// // //           overtime: overtimeRes.data,
// // //           bonus: bonusRes.data,
// // //         });

// // //         const compensationMap = new Map();
// // //         (compensationsRes.data.data || []).forEach((comp) => {
// // //           compensationMap.set(comp.compensation_plan_name, comp.plan_data);
// // //         });

// // //         const enrichedEmployeesMap = new Map();
// // //         (employeesRes.data.data || []).forEach((emp) => {
// // //           if (!enrichedEmployeesMap.has(emp.employee_id)) {
// // //             enrichedEmployeesMap.set(emp.employee_id, {
// // //               ...emp,
// // //               plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
// // //             });
// // //           } else {
// // //             console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
// // //           }
// // //         });
// // //         const enrichedEmployees = Array.from(enrichedEmployeesMap.values());
// // //         setEmployees(enrichedEmployees);
// // //         setAdvances(advancesRes.data.data || []);
// // //         setOvertimeRecords(overtimeRes.data.data || []);
// // //         setBonusRecords(bonusRes.data.data || []);

// // //         const lopDataPromises = enrichedEmployees.map((emp) =>
// // //           calculateLOPEffect(emp.employee_id)
// // //             .then((result) => ({
// // //               employeeId: emp.employee_id,
// // //               lopData: result,
// // //             }))
// // //             .catch((err) => {
// // //               console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
// // //               return {
// // //                 employeeId: emp.employee_id,
// // //                 lopData: {
// // //                   currentMonth: { days: 0, value: "0.00", currency: "INR" },
// // //                   deferred: { days: 0, value: "0.00", currency: "INR" },
// // //                   nextMonth: { days: 0, value: "0.00", currency: "INR" },
// // //                   yearly: { days: 0, value: "0.00", currency: "INR" },
// // //                 },
// // //               };
// // //             })
// // //         );

// // //         const lopDataResults = await Promise.all(lopDataPromises);
// // //         const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
// // //           acc[employeeId] = lopData;
// // //           return acc;
// // //         }, {});
// // //         setEmployeeLopData(lopDataMap);

// // //         const incentiveDataPromises = enrichedEmployees.map((emp) =>
// // //           calculateIncentives(emp.employee_id)
// // //             .then((result) => ({
// // //               employeeId: emp.employee_id,
// // //               incentiveData: result,
// // //             }))
// // //             .catch((err) => {
// // //               console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
// // //               return {
// // //                 employeeId: emp.employee_id,
// // //                 incentiveData: {
// // //                   ctcIncentive: { value: "0.00", currency: "INR" },
// // //                   salesIncentive: { value: "0.00", currency: "INR" },
// // //                   totalIncentive: { value: "0.00", currency: "INR" },
// // //                 },
// // //               };
// // //             })
// // //         );

// // //         const incentiveDataResults = await Promise.all(incentiveDataPromises);
// // //         const incentiveDataMap = incentiveDataResults.reduce(
// // //           (acc, { employeeId, incentiveData }) => {
// // //             if (!acc[employeeId] || parseFloat(incentiveData.totalIncentive.value) > 0) {
// // //               acc[employeeId] = incentiveData;
// // //             }
// // //             return acc;
// // //           },
// // //           {}
// // //         );
// // //         setEmployeeIncentiveData(incentiveDataMap);

// // //       } catch (error) {
// // //         console.error("Fetch error:", error);
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     fetchSalaryBreakupData();
// // //   }, []);

// // //   const filteredEmployees = (employees || []).filter(
// // //     (emp) =>
// // //       emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //       emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
// // //   );

// // //   const downloadExcel = () => {
// // //     if (filteredEmployees.length === 0) return;

// // //     const headers = [
// // //       'ID',
// // //       'Name',
// // //       'Annual CTC',
// // //       'Basic Salary',
// // //       'HRA',
// // //       'LTA',
// // //       'Other Allow.',
// // //       'Incentives',
// // //       'Overtime',
// // //       'Bonus',
// // //       'Advance Rec.',
// // //       'Emp. PF',
// // //       'Employer PF',
// // //       'ESIC',
// // //       'Gratuity',
// // //       'Prof. Tax',
// // //       'Income Tax',
// // //       'Insurance',
// // //       'LOP Days',
// // //       'LOP Ded.',
// // //       'Gross Salary',
// // //       'Net Salary'
// // //     ];

// // //     const rows = filteredEmployees.map((emp) => {
// // //       const salaryDetails = calculateSalaryDetails(
// // //         emp.ctc,
// // //         emp.plan_data,
// // //         emp.employee_id,
// // //         overtimeRecords || [],
// // //         bonusRecords || [],
// // //         advances || [],
// // //         employeeIncentiveData || {}
// // //       );
// // //       const lopData =
// // //         employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
// // //           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //           deferred: { days: 0, value: '0.00', currency: 'INR' },
// // //           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //           yearly: { days: 0, value: '0.00', currency: 'INR' },
// // //         } : {
// // //           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //           deferred: { days: 0, value: '0.00', currency: 'INR' },
// // //           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //           yearly: { days: 0, value: '0.00', currency: 'INR' },
// // //         };

// // //       // Calculate incentive for this employee
// // //       const empId = String(emp.employee_id).toUpperCase();
// // //       const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
// // //       const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
// // //       const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

// // //       const netSalary = salaryDetails
// // //         ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
// // //         : 0;

// // //       return [
// // //         emp.employee_id,
// // //         emp.full_name,
// // //         emp.ctc ? parseFloat(emp.ctc) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.hra) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0,
// // //         incentiveValue,
// // //         salaryDetails ? parseFloat(salaryDetails.overtimePay) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.bonusPay) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.employeePF) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.esic) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.gratuity) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.tds) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.insurance) : 0,
// // //         lopData ? lopData.currentMonth.days : 0,
// // //         lopData ? parseFloat(lopData.currentMonth.value || 0) : 0,
// // //         salaryDetails ? parseFloat(salaryDetails.grossSalary) : 0,
// // //         netSalary > 0 ? netSalary : 0
// // //       ];
// // //     });

// // //     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

// // //     // Optional: Adjust column widths
// // //     const colWidths = [
// // //       { wch: 8 }, // ID
// // //       { wch: 15 }, // Name
// // //       { wch: 12 }, // Annual CTC
// // //       { wch: 12 }, // Basic Salary
// // //       { wch: 10 }, // HRA
// // //       { wch: 8 }, // LTA
// // //       { wch: 12 }, // Other Allow.
// // //       { wch: 10 }, // Incentives
// // //       { wch: 10 }, // Overtime
// // //       { wch: 8 }, // Bonus
// // //       { wch: 12 }, // Advance Rec.
// // //       { wch: 10 }, // Emp. PF
// // //       { wch: 12 }, // Employer PF
// // //       { wch: 8 }, // ESIC
// // //       { wch: 10 }, // Gratuity
// // //       { wch: 12 }, // Prof. Tax
// // //       { wch: 10 }, // Income Tax
// // //       { wch: 10 }, // Insurance
// // //       { wch: 8 }, // LOP Days
// // //       { wch: 10 }, // LOP Ded.
// // //       { wch: 12 }, // Gross Salary
// // //       { wch: 12 }, // Net Salary
// // //     ];
// // //     ws['!cols'] = colWidths;

// // //     const wb = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(wb, ws, "Salary Details");

// // //     XLSX.writeFile(wb, 'salary-details.xlsx');
// // //   };

// // //   const renderTableRows = (employeesToRender) => (
// // //     <tbody className="sd-table-body">
// // //       {employeesToRender.map((emp) => {
// // //         const salaryDetails = calculateSalaryDetails(
// // //           emp.ctc,
// // //           emp.plan_data,
// // //           emp.employee_id,
// // //           overtimeRecords || [],
// // //           bonusRecords || [],
// // //           advances || [],
// // //           employeeIncentiveData || {}
// // //         );
// // //         const lopData =
// // //           employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
// // //             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //             deferred: { days: 0, value: '0.00', currency: 'INR' },
// // //             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //             yearly: { days: 0, value: '0.00', currency: 'INR' },
// // //           } : {
// // //             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //             deferred: { days: 0, value: '0.00', currency: 'INR' },
// // //             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// // //             yearly: { days: 0, value: '0.00', currency: 'INR' },
// // //           };

// // //         // Calculate incentive for this employee
// // //         const empId = String(emp.employee_id).toUpperCase();
// // //         const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
// // //         const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
// // //         const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

// // //         const netSalary = salaryDetails
// // //           ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
// // //           : 0;
// // //         return (
// // //           <tr key={emp.employee_id}>
// // //             <td 
// // //               className="sd-table-cell sd-align-left sd-id-column" 
// // //               style={{ 
// // //                 position: 'sticky', 
// // //                 left: 0, 
// // //                 backgroundColor: 'white', 
// // //                 zIndex: 2,
// // //                 minWidth: '60px'
// // //               }}
// // //             >
// // //               {emp.employee_id}
// // //             </td>
// // //             <td 
// // //               className="sd-table-cell sd-align-left sd-name-column" 
// // //               style={{ 
// // //                 position: 'sticky', 
// // //                 left: '60px', 
// // //                 backgroundColor: 'white', 
// // //                 zIndex: 2,
// // //                 minWidth: '150px'
// // //               }}
// // //             >
// // //               {emp.full_name}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right">
// // //               {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {lopData ? lopData.currentMonth.days : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// // //               {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //             <td className="sd-table-cell sd-align-right sd-scrollable">
// // //               {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
// // //             </td>
// // //           </tr>
// // //         );
// // //       })}
// // //     </tbody>
// // //   );

// // //   if (isLoading) {
// // //     return <div className="sd-loading">Loading...</div>; // Simple loading state
// // //   }

// // //   return (
// // //     <div className="sd-container">
// // //       <div className="sd-header">
// // //         <div className="sd-header-title">Employee Salary Overview</div> {/* No back button, as per request */}
// // //         <button className="sd-proceed-button" onClick={downloadExcel}>
// // //           Proceed
// // //         </button>
// // //       </div>
// // //       <div className="sd-search-container">
// // //         <input
// // //           type="text"
// // //           className="sd-search-input"
// // //           placeholder="Search by ID or Name"
// // //           value={searchQuery}
// // //           onChange={(e) => setSearchQuery(e.target.value)}
// // //         />
// // //       </div>
// // //       {filteredEmployees.length > 0 ? (
// // //         <div className="sd-table-container">
// // //           <div className="sd-table-wrapper" style={{ overflowX: 'auto' }}>
// // //             <table className="sd-table" style={{ minWidth: '2000px' }}>
// // //               <thead>
// // //                 <tr>
// // //                   <th 
// // //                     className="sd-table-header sd-align-left sd-id-column" 
// // //                     style={{ 
// // //                       position: 'sticky', 
// // //                       left: 0, 
// // //                       backgroundColor: '#f8f9fa', 
// // //                       zIndex: 3,
// // //                       minWidth: '60px'
// // //                     }}
// // //                   >
// // //                     ID
// // //                   </th>
// // //                   <th 
// // //                     className="sd-table-header sd-align-left sd-name-column" 
// // //                     style={{ 
// // //                       position: 'sticky', 
// // //                       left: '60px', 
// // //                       backgroundColor: '#f8f9fa', 
// // //                       zIndex: 3,
// // //                       minWidth: '150px'
// // //                     }}
// // //                   >
// // //                     Name
// // //                   </th>
// // //                   <th className="sd-table-header sd-align-right">Annual CTC</th>
// // //                   <th className="sd-table-header sd-align-right">Basic Salary</th>
// // //                   <th className="sd-table-header sd-align-right">HRA</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">LTA</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Other Allow.</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Incentives</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Overtime</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Bonus</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Advance Rec.</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Emp. PF</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Employer PF</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">ESIC</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Gratuity</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Prof. Tax</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Income Tax</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Insurance</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Days</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Ded.</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Gross Salary</th>
// // //                   <th className="sd-table-header sd-align-right sd-scrollable">Net Salary</th>
// // //                 </tr>
// // //               </thead>
// // //               {renderTableRows(filteredEmployees)}
// // //             </table>
// // //           </div>
// // //         </div>
// // //       ) : (
// // //         <p className="sd-no-data">No employees found</p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default SalaryDetails;
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import * as XLSX from 'xlsx';
// // import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
// // import {
// //   calculateSalaryDetails,
// // } from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
// // import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
// // import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

// // const SalaryDetails = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [advances, setAdvances] = useState([]);
// //   const [overtimeRecords, setOvertimeRecords] = useState([]);
// //   const [bonusRecords, setBonusRecords] = useState([]);
// //   const [employeeLopData, setEmployeeLopData] = useState({});
// //   const [employeeIncentiveData, setEmployeeIncentiveData] = useState({});
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search

// //   const API_KEY = process.env.REACT_APP_API_KEY;
// //   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// //   useEffect(() => {
// //     const fetchSalaryBreakupData = async () => {
// //       console.log("Environment Variables:", {
// //         API_KEY: process.env.REACT_APP_API_KEY,
// //         BASE_URL: process.env.REACT_APP_BACKEND_URL,
// //         meId,
// //       });

// //       if (!process.env.REACT_APP_API_KEY || !meId) {
// //         console.error("Missing credentials: API_KEY or meId");
// //         setIsLoading(false);
// //         return;
// //       }

// //       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
// //       console.log("Fetching data with headers:", headers);

// //       try {
// //         setIsLoading(true);
// //         const [
// //           compensationsRes,
// //           employeesRes,
// //           advancesRes,
// //           overtimeRes,
// //           bonusRes,
// //         ] = await Promise.all([
// //           axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
// //             console.error("Error fetching compensations/list:", err);
// //             throw err;
// //           }),
// //           axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
// //             console.error("Error fetching compensation/assigned:", err);
// //             throw err;
// //           }),
// //           axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
// //             console.error("Error fetching compensation/advance-details:", err);
// //             throw err;
// //           }),
// //           axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
// //             console.error("Error fetching compensation/overtime-status-summary:", err);
// //             throw err;
// //           }),
// //           axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
// //             console.error("Error fetching compensation/bonus-list:", err);
// //             throw err;
// //           }),
// //         ]);

// //         console.log("API Responses:", {
// //           compensations: compensationsRes.data,
// //           employees: employeesRes.data,
// //           advances: advancesRes.data,
// //           overtime: overtimeRes.data,
// //           bonus: bonusRes.data,
// //         });

// //         const compensationMap = new Map();
// //         (compensationsRes.data.data || []).forEach((comp) => {
// //           compensationMap.set(comp.compensation_plan_name, comp.plan_data);
// //         });

// //         const enrichedEmployeesMap = new Map();
// //         (employeesRes.data.data || []).forEach((emp) => {
// //           if (!enrichedEmployeesMap.has(emp.employee_id)) {
// //             enrichedEmployeesMap.set(emp.employee_id, {
// //               ...emp,
// //               plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
// //             });
// //           } else {
// //             console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
// //           }
// //         });
// //         const enrichedEmployees = Array.from(enrichedEmployeesMap.values());
// //         setEmployees(enrichedEmployees);
// //         setAdvances(advancesRes.data.data || []);
// //         setOvertimeRecords(overtimeRes.data.data || []);
// //         setBonusRecords(bonusRes.data.data || []);

// //         const lopDataPromises = enrichedEmployees.map((emp) =>
// //           calculateLOPEffect(emp.employee_id)
// //             .then((result) => ({
// //               employeeId: emp.employee_id,
// //               lopData: result,
// //             }))
// //             .catch((err) => {
// //               console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
// //               return {
// //                 employeeId: emp.employee_id,
// //                 lopData: {
// //                   currentMonth: { days: 0, value: "0.00", currency: "INR" },
// //                   deferred: { days: 0, value: "0.00", currency: "INR" },
// //                   nextMonth: { days: 0, value: "0.00", currency: "INR" },
// //                   yearly: { days: 0, value: "0.00", currency: "INR" },
// //                 },
// //               };
// //             })
// //         );

// //         const lopDataResults = await Promise.all(lopDataPromises);
// //         const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
// //           acc[employeeId] = lopData;
// //           return acc;
// //         }, {});
// //         setEmployeeLopData(lopDataMap);

// //         const incentiveDataPromises = enrichedEmployees.map((emp) =>
// //           calculateIncentives(emp.employee_id)
// //             .then((result) => ({
// //               employeeId: emp.employee_id,
// //               incentiveData: result,
// //             }))
// //             .catch((err) => {
// //               console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
// //               return {
// //                 employeeId: emp.employee_id,
// //                 incentiveData: {
// //                   ctcIncentive: { value: "0.00", currency: "INR" },
// //                   salesIncentive: { value: "0.00", currency: "INR" },
// //                   totalIncentive: { value: "0.00", currency: "INR" },
// //                 },
// //               };
// //             })
// //         );

// //         const incentiveDataResults = await Promise.all(incentiveDataPromises);
// //         const incentiveDataMap = incentiveDataResults.reduce(
// //           (acc, { employeeId, incentiveData }) => {
// //             if (!acc[employeeId] || parseFloat(incentiveData.totalIncentive.value) > 0) {
// //               acc[employeeId] = incentiveData;
// //             }
// //             return acc;
// //           },
// //           {}
// //         );
// //         setEmployeeIncentiveData(incentiveDataMap);

// //       } catch (error) {
// //         console.error("Fetch error:", error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchSalaryBreakupData();
// //   }, []);

// //   const filteredEmployees = (employees || []).filter(
// //     (emp) =>
// //       emp.employee_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       emp.full_name.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   const downloadExcel = () => {
// //     if (filteredEmployees.length === 0) return;

// //     const headers = [
// //       'ID',
// //       'Name',
// //       'Annual CTC',
// //       'Basic Salary',
// //       'HRA',
// //       'LTA',
// //       'Other Allow.',
// //       'Incentives',
// //       'Overtime',
// //       'Bonus',
// //       'Advance Rec.',
// //       'Emp. PF',
// //       'Employer PF',
// //       'ESIC',
// //       'Gratuity',
// //       'Prof. Tax',
// //       'Income Tax',
// //       'Insurance',
// //       'LOP Days',
// //       'LOP Ded.',
// //       'Gross Salary',
// //       'Net Salary'
// //     ];

// //     const rows = filteredEmployees.map((emp) => {
// //       const salaryDetails = calculateSalaryDetails(
// //         emp.ctc,
// //         emp.plan_data,
// //         emp.employee_id,
// //         overtimeRecords || [],
// //         bonusRecords || [],
// //         advances || [],
// //         employeeIncentiveData || {}
// //       );
// //       const lopData =
// //         employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
// //           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// //           deferred: { days: 0, value: '0.00', currency: 'INR' },
// //           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// //           yearly: { days: 0, value: '0.00', currency: 'INR' },
// //         } : {
// //           currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// //           deferred: { days: 0, value: '0.00', currency: 'INR' },
// //           nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// //           yearly: { days: 0, value: '0.00', currency: 'INR' },
// //         };

// //       // Calculate incentive for this employee
// //       const empId = String(emp.employee_id).toUpperCase();
// //       const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
// //       const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
// //       const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

// //       const netSalary = salaryDetails
// //         ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
// //         : 0;

// //       return [
// //         emp.employee_id,
// //         emp.full_name,
// //         emp.ctc ? parseFloat(emp.ctc) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.hra) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0,
// //         incentiveValue,
// //         salaryDetails ? parseFloat(salaryDetails.overtimePay) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.bonusPay) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.employeePF) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.esic) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.gratuity) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.tds) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.insurance) : 0,
// //         lopData ? lopData.currentMonth.days : 0,
// //         lopData ? parseFloat(lopData.currentMonth.value || 0) : 0,
// //         salaryDetails ? parseFloat(salaryDetails.grossSalary) : 0,
// //         netSalary > 0 ? netSalary : 0
// //       ];
// //     });

// //     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

// //     // Optional: Adjust column widths
// //     const colWidths = [
// //       { wch: 8 }, // ID
// //       { wch: 15 }, // Name
// //       { wch: 12 }, // Annual CTC
// //       { wch: 12 }, // Basic Salary
// //       { wch: 10 }, // HRA
// //       { wch: 8 }, // LTA
// //       { wch: 12 }, // Other Allow.
// //       { wch: 10 }, // Incentives
// //       { wch: 10 }, // Overtime
// //       { wch: 8 }, // Bonus
// //       { wch: 12 }, // Advance Rec.
// //       { wch: 10 }, // Emp. PF
// //       { wch: 12 }, // Employer PF
// //       { wch: 8 }, // ESIC
// //       { wch: 10 }, // Gratuity
// //       { wch: 12 }, // Prof. Tax
// //       { wch: 10 }, // Income Tax
// //       { wch: 10 }, // Insurance
// //       { wch: 8 }, // LOP Days
// //       { wch: 10 }, // LOP Ded.
// //       { wch: 12 }, // Gross Salary
// //       { wch: 12 }, // Net Salary
// //     ];
// //     ws['!cols'] = colWidths;

// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Salary Details");

// //     XLSX.writeFile(wb, 'salary-details.xlsx');
// //   };

// //   const renderTableRows = (employeesToRender) => (
// //     <tbody className="sd-table-body">
// //       {employeesToRender.map((emp) => {
// //         const salaryDetails = calculateSalaryDetails(
// //           emp.ctc,
// //           emp.plan_data,
// //           emp.employee_id,
// //           overtimeRecords || [],
// //           bonusRecords || [],
// //           advances || [],
// //           employeeIncentiveData || {}
// //         );
// //         const lopData =
// //           employeeLopData && emp.employee_id ? employeeLopData[emp.employee_id] || {
// //             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// //             deferred: { days: 0, value: '0.00', currency: 'INR' },
// //             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// //             yearly: { days: 0, value: '0.00', currency: 'INR' },
// //           } : {
// //             currentMonth: { days: 0, value: '0.00', currency: 'INR' },
// //             deferred: { days: 0, value: '0.00', currency: 'INR' },
// //             nextMonth: { days: 0, value: '0.00', currency: 'INR' },
// //             yearly: { days: 0, value: '0.00', currency: 'INR' },
// //           };

// //         // Calculate incentive for this employee
// //         const empId = String(emp.employee_id).toUpperCase();
// //         const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
// //         const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
// //         const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

// //         const netSalary = salaryDetails
// //           ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
// //           : 0;
// //         return (
// //           <tr key={emp.employee_id}>
// //             <td className="sd-table-cell sd-align-left sd-id-column">{emp.employee_id}</td>
// //             <td className="sd-table-cell sd-align-left sd-name-column">{emp.full_name}</td>
// //             <td className="sd-table-cell sd-align-right">
// //               {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {lopData ? lopData.currentMonth.days : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
// //               {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
// //             </td>
// //             <td className="sd-table-cell sd-align-right sd-scrollable">
// //               {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
// //             </td>
// //           </tr>
// //         );
// //       })}
// //     </tbody>
// //   );

// //   if (isLoading) {
// //     return <div className="sd-loading">Loading...</div>; // Simple loading state
// //   }

// //   return (
// //     <div className="sd-container">
// //       <div className="sd-header">
// //         <div className="sd-header-title">Employee Salary Overview</div> {/* No back button, as per request */}
// //         <button className="sd-proceed-button" onClick={downloadExcel}>
// //           Proceed
// //         </button>
// //       </div>
// //       <div className="sd-search-container">
// //         <input
// //           type="text"
// //           className="sd-search-input"
// //           placeholder="Search by ID or Name"
// //           value={searchQuery}
// //           onChange={(e) => setSearchQuery(e.target.value)}
// //         />
// //       </div>
// //       {filteredEmployees.length > 0 ? (
// //         <div className="sd-table-section">
// //           <div className="sd-table-container">
// //             <div className="sd-table-wrapper">
// //               <table className="sd-table" style={{ minWidth: '1800px', tableLayout: 'auto' }}>
// //                 <thead>
// //                   <tr>
// //                     <th className="sd-table-header sd-align-left sd-id-column">ID</th>
// //                     <th className="sd-table-header sd-align-left sd-name-column">Name</th>
// //                     <th className="sd-table-header sd-align-right">Annual CTC</th>
// //                     <th className="sd-table-header sd-align-right">Basic Salary</th>
// //                     <th className="sd-table-header sd-align-right">HRA</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">LTA</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Other Allow.</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Incentives</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Overtime</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Bonus</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Advance Rec.</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Emp. PF</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Employer PF</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">ESIC</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Gratuity</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Prof. Tax</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Income Tax</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Insurance</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Days</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Ded.</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Gross Salary</th>
// //                     <th className="sd-table-header sd-align-right sd-scrollable">Net Salary</th>
// //                   </tr>
// //                 </thead>
// //                 {renderTableRows(filteredEmployees)}
// //               </table>
// //             </div>
// //           </div>
// //           <div className="sd-footer">
// //             <button className="sd-proceed-button" onClick={downloadExcel}>
// //               Proceed
// //             </button>
// //           </div>
// //         </div>
// //       ) : (
// //         <p className="sd-no-data">No employees found</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default SalaryDetails;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
// import {
//   calculateSalaryDetails,
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
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState(""); // Internal state for search

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

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

//       const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
//       console.log("Fetching data with headers:", headers);

//       try {
//         setIsLoading(true);
//         const [
//           compensationsRes,
//           employeesRes,
//           advancesRes,
//           overtimeRes,
//           bonusRes,
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
//         ]);

//         console.log("API Responses:", {
//           compensations: compensationsRes.data,
//           employees: employeesRes.data,
//           advances: advancesRes.data,
//           overtime: overtimeRes.data,
//           bonus: bonusRes.data,
//         });

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
//             if (!acc[employeeId] || parseFloat(incentiveData.totalIncentive.value) > 0) {
//               acc[employeeId] = incentiveData;
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

//   const downloadExcel = () => {
//     if (filteredEmployees.length === 0) return;

//     const headers = [
//       'ID',
//       'Name',
//       'Annual CTC',
//       'Basic Salary',
//       'HRA',
//       'LTA',
//       'Other Allow.',
//       'Incentives',
//       'Overtime',
//       'Bonus',
//       'Advance Rec.',
//       'Emp. PF',
//       'Employer PF',
//       'ESIC',
//       'Gratuity',
//       'Prof. Tax',
//       'Income Tax',
//       'Insurance',
//       'LOP Days',
//       'LOP Ded.',
//       'Gross Salary',
//       'Net Salary'
//     ];

//     const rows = filteredEmployees.map((emp) => {
//       const salaryDetails = calculateSalaryDetails(
//         emp.ctc,
//         emp.plan_data,
//         emp.employee_id,
//         overtimeRecords || [],
//         bonusRecords || [],
//         advances || [],
//         employeeIncentiveData || {}
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

//       // Calculate incentive for this employee
//       const empId = String(emp.employee_id).toUpperCase();
//       const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
//       const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
//       const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

//       const netSalary = salaryDetails
//         ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
//         : 0;

//       return [
//         emp.employee_id,
//         emp.full_name,
//         emp.ctc ? parseFloat(emp.ctc) : 0,
//         salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0,
//         salaryDetails ? parseFloat(salaryDetails.hra) : 0,
//         salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0,
//         salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0,
//         incentiveValue,
//         salaryDetails ? parseFloat(salaryDetails.overtimePay) : 0,
//         salaryDetails ? parseFloat(salaryDetails.bonusPay) : 0,
//         salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0,
//         salaryDetails ? parseFloat(salaryDetails.employeePF) : 0,
//         salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
//         salaryDetails ? parseFloat(salaryDetails.esic) : 0,
//         salaryDetails ? parseFloat(salaryDetails.gratuity) : 0,
//         salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0,
//         salaryDetails ? parseFloat(salaryDetails.tds) : 0,
//         salaryDetails ? parseFloat(salaryDetails.insurance) : 0,
//         lopData ? lopData.currentMonth.days : 0,
//         lopData ? parseFloat(lopData.currentMonth.value || 0) : 0,
//         salaryDetails ? parseFloat(salaryDetails.grossSalary) : 0,
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
//       { wch: 12 }, // Other Allow.
//       { wch: 10 }, // Incentives
//       { wch: 10 }, // Overtime
//       { wch: 8 }, // Bonus
//       { wch: 12 }, // Advance Rec.
//       { wch: 10 }, // Emp. PF
//       { wch: 12 }, // Employer PF
//       { wch: 8 }, // ESIC
//       { wch: 10 }, // Gratuity
//       { wch: 12 }, // Prof. Tax
//       { wch: 10 }, // Income Tax
//       { wch: 10 }, // Insurance
//       { wch: 8 }, // LOP Days
//       { wch: 10 }, // LOP Ded.
//       { wch: 12 }, // Gross Salary
//       { wch: 12 }, // Net Salary
//     ];
//     ws['!cols'] = colWidths;

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Salary Details");

//     XLSX.writeFile(wb, 'salary-details.xlsx');
//   };

//   const renderTableRows = (employeesToRender) => (
//     <tbody className="sd-table-body">
//       {employeesToRender.map((emp) => {
//         const salaryDetails = calculateSalaryDetails(
//           emp.ctc,
//           emp.plan_data,
//           emp.employee_id,
//           overtimeRecords || [],
//           bonusRecords || [],
//           advances || [],
//           employeeIncentiveData || {}
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

//         // Calculate incentive for this employee
//         const empId = String(emp.employee_id).toUpperCase();
//         const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
//         const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
//         const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

//         const netSalary = salaryDetails
//           ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
//           : 0;
//         return (
//           <tr key={emp.employee_id}>
//             <td className="sd-table-cell sd-align-left sd-id-column">{emp.employee_id}</td>
//             <td className="sd-table-cell sd-align-left sd-name-column">{emp.full_name}</td>
//             <td className="sd-table-cell sd-align-right">
//               {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {lopData ? lopData.currentMonth.days : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable sd-deduction">
//               {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
//             </td>
//             <td className="sd-table-cell sd-align-right sd-scrollable">
//               {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   );

//   if (isLoading) {
//     return <div className="sd-loading">Loading...</div>; // Simple loading state
//   }

//   return (
//     <div className="sd-container">
//       <div className="sd-header">
//         <div className="sd-header-title">Employee Salary Overview</div> {/* No back button, as per request */}
//         <button className="sd-proceed-button" onClick={downloadExcel}>
//           Proceed
//         </button>
//       </div>
//       <div className="sd-search-container">
//         <input
//           type="text"
//           className="sd-search-input"
//           placeholder="Search by ID or Name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//       {filteredEmployees.length > 0 ? (
//         <div className="sd-table-section">
//           <div className="sd-table-container">
//             <div className="sd-table-wrapper">
//               <table className="sd-table" style={{ minWidth: '750px', tableLayout: 'fixed' }}>
//                 <thead>
//                   <tr>
//                     <th className="sd-table-header sd-align-left sd-id-column">ID</th>
//                     <th className="sd-table-header sd-align-left sd-name-column">Name</th>
//                     <th className="sd-table-header sd-align-right">Annual CTC</th>
//                     <th className="sd-table-header sd-align-right">Basic Salary</th>
//                     <th className="sd-table-header sd-align-right">HRA</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">LTA</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Other Allow.</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Incentives</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Overtime</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Bonus</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Advance Rec.</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Emp. PF</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Employer PF</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">ESIC</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Gratuity</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Prof. Tax</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Income Tax</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">Insurance</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Days</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable sd-deduction">LOP Ded.</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Gross Salary</th>
//                     <th className="sd-table-header sd-align-right sd-scrollable">Net Salary</th>
//                   </tr>
//                 </thead>
//                 {renderTableRows(filteredEmployees)}
//               </table>
//             </div>
//           </div>
//           <div className="sd-footer">
//             <button className="sd-proceed-button" onClick={downloadExcel}>
//               Proceed
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p className="sd-no-data">No employees found</p>
//       )}
//     </div>
//   );
// };

// export default SalaryDetails;


/////////////<----------------------------->


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './SalaryDetails.css'; // Assuming a corresponding CSS file; adjust path if needed
import {
  calculateSalaryDetails,
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Internal state for search
  const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Track selected employee IDs
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Modal state

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

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

      const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
      console.log("Fetching data with headers:", headers);

      try {
        setIsLoading(true);
        const [
          compensationsRes,
          employeesRes,
          advancesRes,
          overtimeRes,
          bonusRes,
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
        ]);

        console.log("API Responses:", {
          compensations: compensationsRes.data,
          employees: employeesRes.data,
          advances: advancesRes.data,
          overtime: overtimeRes.data,
          bonus: bonusRes.data,
        });

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
            if (!acc[employeeId] || parseFloat(incentiveData.totalIncentive.value) > 0) {
              acc[employeeId] = incentiveData;
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
  const isAllSelected = selectedEmployees.size === filteredEmployees.length;

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
        employeeIncentiveData || {}
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

      // Calculate incentive for this employee
      const empId = String(emp.employee_id).toUpperCase();
      const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
      const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
      const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

      const netSalary = salaryDetails
        ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
        : 0;

      return [
        emp.employee_id,
        emp.full_name,
        emp.ctc ? parseFloat(emp.ctc) : 0,
        salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0,
        salaryDetails ? parseFloat(salaryDetails.hra) : 0,
        salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0,
        salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0,
        incentiveValue,
        salaryDetails ? parseFloat(salaryDetails.overtimePay) : 0,
        salaryDetails ? parseFloat(salaryDetails.bonusPay) : 0,
        salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0,
        salaryDetails ? parseFloat(salaryDetails.employeePF) : 0,
        salaryDetails ? parseFloat(salaryDetails.employerPF) : 0,
        salaryDetails ? parseFloat(salaryDetails.esic) : 0,
        salaryDetails ? parseFloat(salaryDetails.gratuity) : 0,
        salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0,
        salaryDetails ? parseFloat(salaryDetails.tds) : 0,
        salaryDetails ? parseFloat(salaryDetails.insurance) : 0,
        lopData ? lopData.currentMonth.days : 0,
        lopData ? parseFloat(lopData.currentMonth.value || 0) : 0,
        salaryDetails ? parseFloat(salaryDetails.grossSalary) : 0,
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

  const renderTableRows = (employeesToRender) => (
    <tbody className="sd-table-body">
      {employeesToRender.map((emp) => {
        const salaryDetails = calculateSalaryDetails(
          emp.ctc,
          emp.plan_data,
          emp.employee_id,
          overtimeRecords || [],
          bonusRecords || [],
          advances || [],
          employeeIncentiveData || {}
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

        // Calculate incentive for this employee
        const empId = String(emp.employee_id).toUpperCase();
        const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
        const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
        const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

        const netSalary = salaryDetails
          ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
          : 0;

        const isSelected = selectedEmployees.has(emp.employee_id);

        return (
          <tr key={emp.employee_id}>
            <td className="sd-table-cell sd-align-center sd-select-column">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleRowSelect(emp.employee_id)}
              />
            </td>
            <td className="sd-table-cell sd-align-left sd-id-column">{emp.employee_id}</td>
            <td className="sd-table-cell sd-align-left sd-name-column">{emp.full_name}</td>
            <td className="sd-table-cell sd-align-right">
              {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {lopData ? lopData.currentMonth.days : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right sd-deduction">
              {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-table-cell sd-align-right">
              {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  // Render preview table rows (similar to main, but no checkboxes)
  const renderPreviewTableRows = (employeesToRender) => (
    <tbody>
      {employeesToRender.map((emp) => {
        const salaryDetails = calculateSalaryDetails(
          emp.ctc,
          emp.plan_data,
          emp.employee_id,
          overtimeRecords || [],
          bonusRecords || [],
          advances || [],
          employeeIncentiveData || {}
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

        // Calculate incentive for this employee
        const empId = String(emp.employee_id).toUpperCase();
        const matchedKey = employeeIncentiveData ? Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId) : null;
        const incentiveObj = matchedKey ? employeeIncentiveData[matchedKey] : null;
        const incentiveValue = incentiveObj?.totalIncentive ? parseFloat(incentiveObj.totalIncentive.value) || 0 : 0;

        const netSalary = salaryDetails
          ? salaryDetails.netSalary + incentiveValue - (parseFloat(lopData.currentMonth.value || 0))
          : 0;

        return (
          <tr key={emp.employee_id}>
            <td className="sd-preview-table-cell">{emp.employee_id}</td>
            <td className="sd-preview-table-cell">{emp.full_name}</td>
            <td className="sd-preview-table-cell sd-align-right">
              {emp.ctc ? `₹${parseFloat(emp.ctc).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.basicSalary).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.hra).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.ltaAllowance).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.otherAllowances).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {incentiveValue > 0 ? `₹${incentiveValue.toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.overtimePay).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.bonusPay).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.advanceRecovery).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.employeePF).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.employerPF).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.esic).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.gratuity).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.professionalTax).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.tds).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {salaryDetails ? `₹${parseFloat(salaryDetails.insurance).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {lopData ? lopData.currentMonth.days : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right sd-deduction">
              {lopData ? `₹${parseFloat(lopData.currentMonth.value || 0).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {salaryDetails ? `₹${parseFloat(salaryDetails.grossSalary).toLocaleString()}` : 'N/A'}
            </td>
            <td className="sd-preview-table-cell sd-align-right">
              {netSalary > 0 ? `₹${parseFloat(netSalary).toLocaleString()}` : 'N/A'}
            </td>
          </tr>
        );
      })}
    </tbody>
  );

  if (isLoading) {
    return <div className="sd-loading">Loading...</div>; // Simple loading state
  }

  const selectedData = getSelectedEmployees();

  return (
    <div className="sd-container">
      <div className="sd-header">
        <div className="sd-header-title">Employee Salary Overview</div> {/* No back button, as per request */}
        <button className="sd-proceed-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
      <div className="sd-search-container">
        <input
          type="text"
          className="sd-search-input"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredEmployees.length > 0 ? (
        <div className="sd-table-section">
          <div className="sd-table-container">
            <div className="sd-table-wrapper">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th className="sd-table-header sd-align-center sd-select-column">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="sd-table-header sd-align-left sd-id-column">ID</th>
                    <th className="sd-table-header sd-align-left sd-name-column">Name</th>
                    <th className="sd-table-header sd-align-right">Annual CTC</th>
                    <th className="sd-table-header sd-align-right">Basic Salary</th>
                    <th className="sd-table-header sd-align-right">HRA</th>
                    <th className="sd-table-header sd-align-right">LTA</th>
                    <th className="sd-table-header sd-align-right">Other Allowances</th>
                    <th className="sd-table-header sd-align-right">Incentives</th>
                    <th className="sd-table-header sd-align-right">Overtime</th>
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
          <div className="sd-footer">
            <button className="sd-proceed-button" onClick={handleProceed}>
              Proceed
            </button>
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
                    <th className="sd-align-right">Annual CTC</th>
                    <th className="sd-align-right">Basic Salary</th>
                    <th className="sd-align-right">HRA</th>
                    <th className="sd-align-right">LTA</th>
                    <th className="sd-align-right">Other Allowances</th>
                    <th className="sd-align-right">Incentives</th>
                    <th className="sd-align-right">Overtime</th>
                    <th className="sd-align-right">Bonus</th>
                    <th className="sd-align-right sd-deduction">Advance Recovery</th>
                    <th className="sd-align-right sd-deduction">Employee PF</th>
                    <th className="sd-align-right sd-deduction">Employer PF</th>
                    <th className="sd-align-right sd-deduction">ESIC</th>
                    <th className="sd-align-right sd-deduction">Gratuity</th>
                    <th className="sd-align-right sd-deduction">Professional Tax</th>
                    <th className="sd-align-right sd-deduction">Income Tax</th>
                    <th className="sd-align-right sd-deduction">Insurance</th>
                    <th className="sd-align-right sd-deduction">LOP Days</th>
                    <th className="sd-align-right sd-deduction">LOP Deduction</th>
                    <th className="sd-align-right">Gross Salary</th>
                    <th className="sd-align-right">Net Salary</th>
                  </tr>
                </thead>
                {renderPreviewTableRows(selectedData)}
              </table>
            </div>
            <div className="sd-preview-footer">
              <button className="sd-download-button" onClick={handleDownloadSelected}>
                Generate Excel Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryDetails;