// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./OvertimeDetails.css";

// // const OvertimeDetails = () => {
// //   const [overtimeData, setOvertimeData] = useState([]);
// //   const [employeeProjectData, setEmployeeProjectData] = useState([]);
// //   const [selectedMonth, setSelectedMonth] = useState("current");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   const [selectAll, setSelectAll] = useState(false);
// //   const [assignedCompensationData, setAssignedCompensationData] = useState({});

// //   const fetchAssignedCompensation = async () => {
// //     try {
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
// //         {
// //           headers: {
// //             "x-api-key": API_KEY,
// //             "x-employee-id": meId,
// //           },
// //         }
// //       );

// //       const compensationMap = {};
// //       response.data.data.forEach((plan) => {
// //         plan.assigned_data.forEach((emp) => {
// //           compensationMap[emp.employee_id] = plan.plan_data?.overtimePayAmount || 0;
// //         });
// //       });

// //       setAssignedCompensationData(compensationMap);
// //     } catch (error) {
// //       console.error("Error fetching assigned compensation:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAssignedCompensation();
// //   }, []);

// //   const [aprilPendingPopup, setAprilPendingPopup] = useState({
// //     isVisible: false,
// //     pendingCount: 0,
// //     showDetails: false,
// //     data: [],
// //   });
// //   const [monthOptions, setMonthOptions] = useState([]);
// //   const [alertModal, setAlertModal] = useState({
// //     isVisible: false,
// //     title: "",
// //     message: "",
// //   });

// //   const API_KEY = process.env.REACT_APP_API_KEY;
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// //   const showAlert = (message, title = "Alert") => {
// //     setAlertModal({ isVisible: true, title, message });
// //   };

// //   const closeAlert = () => {
// //     setAlertModal({ isVisible: false, title: "", message: "" });
// //   };

// //   const getDateRange = (type) => {
// //     const today = new Date();
// //     const currentMonth = today.getMonth();
// //     const currentYear = today.getFullYear();

// //     let startDate, endDate;

// //     if (type === "current") {
// //       startDate = new Date(currentYear, currentMonth - 1, 25);
// //       endDate = new Date(currentYear, currentMonth, 25);
// //     } else if (type === "last") {
// //       startDate = new Date(currentYear, currentMonth - 2, 25);
// //       endDate = new Date(currentYear, currentMonth - 1, 25);
// //     } else if (type === "twoMonthsAgo") {
// //       startDate = new Date(currentYear, currentMonth - 3, 25);
// //       endDate = new Date(currentYear, currentMonth - 2, 25);
// //     } else if (type === "april") {
// //       startDate = new Date(currentYear, currentMonth - 4, 25);
// //       endDate = new Date(currentYear, currentMonth - 3, 25);
// //     }

// //     const range = {
// //       startDate: startDate.toISOString().split("T")[0],
// //       endDate: endDate.toISOString().split("T")[0],
// //     };
// //     console.log(`getDateRange(${type}): ${range.startDate} to ${range.endDate}`);
// //     return range;
// //   };

// //   const getMonthName = (offset) => {
// //     const date = new Date();
// //     const targetMonth = date.getMonth() - offset;
// //     date.setMonth(targetMonth);
// //     const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
// //     console.log(`getMonthName(offset: ${offset}, targetMonth: ${targetMonth}): ${monthName}`);
// //     return monthName;
// //   };

// //   const fetchEmployeeProjectData = async () => {
// //     try {
// //       console.log("Fetching employee project data");
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/employee-projects`,
// //         {
// //           headers: {
// //             "x-api-key": API_KEY,
// //             "x-employee-id": meId,
// //           },
// //         }
// //       );
// //       console.log("Employee Project API Response:", response.data);
// //       setEmployeeProjectData(Array.isArray(response.data.data) ? response.data.data : []);
// //     } catch (error) {
// //       console.error("Employee project fetch error:", error);
// //       showAlert("Failed to fetch employee projects", "Error");
// //     }
// //   };

// //   const fetchData = async (startDate, endDate) => {
// //     try {
// //       setIsLoading(true);
// //       console.log(`Fetching overtime data for ${startDate} to ${endDate}`);
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// //         {
// //           headers: {
// //             "x-api-key": API_KEY,
// //             "x-employee-id": meId,
// //           },
// //           params: {
// //             startDate,
// //             endDate,
// //           },
// //         }
// //       );

// //       console.log("Overtime API Response:", response.data);

// //       const data = Array.isArray(response.data.data) ? response.data.data : [];
// //       console.log("Overtime Raw API Data:", data);

// //       if (data.length === 0) {
// //         console.warn("No overtime records returned from API for the given date range");
// //       }

// //       const formattedData = data.map((item) => {
// //         const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
// //         const totalHours = parseFloat(item.total_hours_worked) || 0;
// //         const extraHours = parseFloat(item.extra_hours) || 0;
// //         if (extraHours > 14) {
// //           console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
// //         }
// //         return {
// //           key: `${item.employee_id}-${item.work_date}`,
// //           employee_id: item.employee_id,
// //           date: item.work_date,
// //           name: employeeInfo.employee_name || item.employee_id,
// //           total_hours: totalHours,
// //           hours: extraHours,
// //           rate: parseFloat(item.rate) || 0,
// //           project: employeeInfo.project_names || item.projects || "",
// //           supervisor: employeeInfo.supervisor_name || item.supervisors || "",
// //           comments: item.comments || "",
// //           status: item.status || "Pending",
// //           sessions: item.sessions || [],
// //         };
// //       });

// //       console.log("Overtime Formatted Data:", formattedData);
// //       setOvertimeData(formattedData);
// //       setSelectedRows([]);
// //       setSelectAll(false);
// //     } catch (error) {
// //       console.error("Overtime fetch error:", error);
// //       showAlert(
// //         error.response?.data?.error || error.message || "Network error",
// //         "Error"
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const checkAprilPending = async () => {
// //     const { startDate, endDate } = getDateRange("april");
// //     try {
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// //         {
// //           headers: {
// //             "x-api-key": API_KEY,
// //             "x-employee-id": meId,
// //           },
// //           params: {
// //             startDate,
// //             endDate,
// //           },
// //         }
// //       );

// //       const data = Array.isArray(response.data.data) ? response.data.data : [];
// //       // Filter pending days with extra > 0
// //       const pendingData = data.filter((item) => (item.status === "Pending" || !item.status) && item.extra_hours > 0);
// //       console.log(`April pending records: ${pendingData.length}`);

// //       const formattedData = pendingData.map((item) => {
// //         const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
// //         const totalHours = parseFloat(item.total_hours_worked) || 0;
// //         const extraHours = parseFloat(item.extra_hours) || 0;
// //         if (extraHours > 14) {
// //           console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
// //         }
// //         return {
// //           key: `${item.employee_id}-${item.work_date}`,
// //           employee_id: item.employee_id,
// //           date: item.work_date,
// //           name: employeeInfo.employee_name || item.employee_id,
// //           total_hours: totalHours,
// //           hours: extraHours,
// //           rate: parseFloat(item.rate) || 0,
// //           project: employeeInfo.project_names || item.projects || "",
// //           supervisor: employeeInfo.supervisor_name || item.supervisors || "",
// //           comments: item.comments || "",
// //           status: item.status || "Pending",
// //           sessions: item.sessions || [],
// //         };
// //       });

// //       if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
// //         setAprilPendingPopup({
// //           isVisible: true,
// //           pendingCount: pendingData.length,
// //           showDetails: false,
// //           data: formattedData,
// //         });
// //         sessionStorage.setItem("aprilPopupShown", "true");
// //       }
// //     } catch (error) {
// //       console.error("Error checking April pending records:", error);
// //     }
// //   };

// //   const handleInputChange = (key, field, value, isAprilPopup = false) => {
// //     if (field !== "comments" && field !== "rate") return;
// //     const updateFn = (prev) =>
// //       prev.map((row) => (row.key === key ? { ...row, [field]: field === "rate" ? parseFloat(value) : value } : row));
    
// //     if (isAprilPopup) {
// //       setAprilPendingPopup((prev) => ({ ...prev, data: updateFn(prev.data) }));
// //     } else {
// //       setOvertimeData(updateFn);
// //     }
// //   };

// //   const handleCheckboxChange = (key) => {
// //     setSelectedRows((prevSelected) => {
// //       const newSelected = prevSelected.includes(key)
// //         ? prevSelected.filter((rowKey) => rowKey !== key)
// //         : [...prevSelected, key];
// //       const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
// //       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.key));
// //       setSelectAll(allPendingSelected);
// //       return newSelected;
// //     });
// //   };

// //   const handleSelectAllChange = () => {
// //     if (selectAll) {
// //       setSelectedRows([]);
// //       setSelectAll(false);
// //     } else {
// //       const pendingRowKeys = overtimeData
// //         .filter((row) => row.status === "Pending" && row.hours > 0)
// //         .map((row) => row.key);
// //       setSelectedRows(pendingRowKeys);
// //       setSelectAll(true);
// //     }
// //   };

// //   const handleStatusChange = async (rowKey, status, isBulk = false, isApril = false) => {
// //     try {
// //       setIsLoading(true);
// //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

// //       let selectedData;
// //       if (isBulk || isApril) {
// //         let rows;
// //         if (isApril) {
// //           rows = aprilPendingPopup.data
// //             .filter((row) => selectedRows.includes(row.key))
// //             .filter((row) => row.status === "Pending" && row.hours > 0);
// //         } else {
// //           rows = overtimeData
// //             .filter((row) => selectedRows.includes(row.key))
// //             .filter((row) => row.status === "Pending" && row.hours > 0);
// //         }

// //         selectedData = [];
// //         rows.forEach((row) => {
// //           row.sessions.forEach((session) => {
// //             selectedData.push({
// //               punch_id: session.punch_id,
// //               work_date: row.date,
// //               employee_id: row.employee_id,
// //               extra_hours: session.extra_hours,
// //               rate: parseFloat(row.rate) || 0,
// //               project: row.project || "",
// //               supervisor: row.supervisor || "",
// //               comments: row.comments || "",
// //               status: status,
// //             });
// //           });
// //         });

// //         if (selectedData.length === 0 || selectedData.every((d) => d.extra_hours === 0)) {
// //           throw new Error("No overtime hours to approve/reject.");
// //         }
// //       } else {
// //         let rows;
// //         if (isApril) {
// //           rows = [aprilPendingPopup.data.find((row) => row.key === rowKey)];
// //         } else {
// //           rows = [overtimeData.find((row) => row.key === rowKey)];
// //         }
// //         const row = rows[0];
// //         if (!row) {
// //           throw new Error("Row not found for key: " + rowKey);
// //         }
// //         if (row.status !== "Pending" || row.hours === 0) {
// //           throw new Error(`Cannot change status: ${row.status} or no extra hours.`);
// //         }

// //         selectedData = row.sessions.map((session) => ({
// //           punch_id: session.punch_id,
// //           work_date: row.date,
// //           employee_id: row.employee_id,
// //           extra_hours: session.extra_hours,
// //           rate: parseFloat(row.rate) || 0,
// //           project: row.project || "",
// //           supervisor: row.supervisor || "",
// //           comments: row.comments || "",
// //           status: status,
// //         }));

// //         if (selectedData.every((d) => d.extra_hours === 0)) {
// //           throw new Error("No overtime hours to approve/reject.");
// //         }
// //       }

// //       const payload = { data: selectedData };

// //       await axios.post(fullUrl, payload, {
// //         headers: {
// //           "x-api-key": API_KEY,
// //           "x-employee-id": meId,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");

// //       if (isApril) {
// //         setAprilPendingPopup((prev) => ({
// //           ...prev,
// //           data: prev.data.map((row) =>
// //             (isBulk ? selectedRows.includes(row.key) : row.key === rowKey) && row.status === "Pending"
// //               ? { ...row, status }
// //               : row
// //           ),
// //           pendingCount: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length,
// //           isVisible: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length > 0,
// //         }));
// //         setSelectedRows([]);
// //       } else {
// //         setOvertimeData((prevData) =>
// //           prevData.map((row) =>
// //             (isBulk && selectedRows.includes(row.key) && row.status === "Pending")
// //               ? { ...row, status }
// //               : row.key === rowKey && row.status === "Pending"
// //               ? { ...row, status }
// //               : row
// //           )
// //         );
// //         setSelectedRows([]);
// //         setSelectAll(false);
// //         const { startDate, endDate } = getDateRange(selectedMonth);
// //         await fetchData(startDate, endDate);
// //       }
// //     } catch (error) {
// //       console.error("Error updating overtime status:", error);
// //       showAlert(
// //         error.response?.data?.error || error.response?.data?.message || error.message || "Network error",
// //         "Error"
// //       );
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);
// //   const handleAprilApprove = () => handleStatusChange(null, "Approved", true, true);
// //   const handleAprilReject = () => handleStatusChange(null, "Rejected", true, true);
// //   const handleViewDetails = () => {
// //     setAprilPendingPopup((prev) => ({ ...prev, showDetails: true }));
// //   };

// //   useEffect(() => {
// //     console.log("Setting monthOptions");
// //     setMonthOptions([
// //       { type: "current", offset: 0, label: getMonthName(0) },
// //       { type: "last", offset: 1, label: getMonthName(1) },
// //       { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
// //     ]);
// //   }, []);

// //   useEffect(() => {
// //     fetchEmployeeProjectData();
// //   }, []);

// //   useEffect(() => {
// //     const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
// //     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.key));
// //     setSelectAll(allPendingSelected);
// //   }, [overtimeData, selectedRows]);

// //   useEffect(() => {
// //     const { startDate, endDate } = getDateRange(selectedMonth);
// //     fetchData(startDate, endDate);
// //   }, [selectedMonth, employeeProjectData]);

// //   useEffect(() => {
// //     checkAprilPending();
// //   }, [employeeProjectData]);

// //   const hasExtraHours = (row) => row.hours > 0;
// //   const pendingWithExtra = (data) => data.filter((row) => row.status === "Pending" && hasExtraHours(row)).length;

// //   return (
// //     <div className="otd-overtime-container">
// //       <h2 className="otd-title">Overtime Details</h2>
// //       <div className="otd-month-selector">
// //         {monthOptions.map(({ type, label }) => (
// //           <span
// //             key={type}
// //             data-testid={`month-option-${type}`}
// //             className={`otd-month-option ${selectedMonth === type ? "otd-active" : ""}`}
// //             onClick={() => setSelectedMonth(type)}
// //             title={label}
// //           >
// //             {label}
// //           </span>
// //         ))}
// //       </div>
// //       <div className="otd-action-buttons-container">
// //         <button
// //           onClick={handleApproveSelected}
// //           className="otd-approve-button"
// //           disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
// //         >
// //           Approve All
// //         </button>
// //         <button
// //           onClick={handleRejectSelected}
// //           className="otd-reject-button"
// //           disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
// //         >
// //           Reject All
// //         </button>
// //       </div>
// //       {isLoading ? (
// //         <div className="otd-loading">Loading...</div>
// //       ) : (
// //         <div className="otd-table-container">
// //           <table className="otd-overtime-table">
// //             <thead>
// //               <tr>
// //                 <th className="otd-table-header">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectAll}
// //                     onChange={handleSelectAllChange}
// //                     className="otd-checkbox"
// //                     disabled={pendingWithExtra(overtimeData) === 0}
// //                   />
// //                 </th>
// //                 <th className="otd-table-header">Date</th>
// //                 <th className="otd-table-header">Employee Name</th>
// //                 <th className="otd-table-header">Total Hours</th>
// //                 <th className="otd-table-header">Extra Hours</th>
// //                 <th className="otd-table-header">Rate</th>
// //                 <th className="otd-table-header">Project</th>
// //                 <th className="otd-table-header">Supervisor</th>
// //                 <th className="otd-table-header">Comments</th>
// //                 <th className="otd-table-header">Status</th>
// //                 <th className="otd-table-header">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {overtimeData.length > 0 ? (
// //                 overtimeData.map((row) => (
// //                   <tr key={row.key} className={`otd-table-row ${selectedRows.includes(row.key) ? "otd-selected-row" : ""}`}>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedRows.includes(row.key)}
// //                         onChange={() => handleCheckboxChange(row.key)}
// //                         className="otd-checkbox"
// //                         disabled={row.status !== "Pending" || !hasExtraHours(row)}
// //                       />
// //                     </td>
// //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// //                     <td className="otd-table-cell">{row.name}</td>
// //                     <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
// //                     <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
// //                     <td className="otd-table-cell">
// //                       {row.status === "Pending" && hasExtraHours(row) ? (
// //                         <input
// //                           type="number"
// //                           value={row.rate || assignedCompensationData[row.employee_id] || 0}
// //                           onChange={(e) => handleInputChange(row.key, "rate", e.target.value)}
// //                           className="otd-input"
// //                         />
// //                       ) : (
// //                         row.rate.toFixed(2)
// //                       )}
// //                     </td>
// //                     <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
// //                       <span className="otd-text-ellipsis">{row.project}</span>
// //                     </td>
// //                     <td className="otd-table-cell">{row.supervisor}</td>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="text"
// //                         value={row.comments}
// //                         onChange={(e) => handleInputChange(row.key, "comments", e.target.value)}
// //                         className="otd-input"
// //                         disabled={row.status === "Approved" || row.status === "Rejected" || !hasExtraHours(row)}
// //                       />
// //                     </td>
// //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// //                     <td className="otd-table-cell">
// //                       <div className="otd-action-buttons">
// //                         <button
// //                           onClick={() => handleStatusChange(row.key, "Approved")}
// //                           className="otd-approve"
// //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
// //                         >
// //                           <svg className="otd-icon" viewBox="0 0 24 24">
// //                             <path
// //                               fill="currentColor"
// //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// //                             />
// //                           </svg>
// //                         </button>
// //                         <button
// //                           onClick={() => handleStatusChange(row.key, "Rejected")}
// //                           className="otd-reject"
// //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
// //                         >
// //                           <svg className="otd-icon" viewBox="0 0 24 24">
// //                             <path
// //                               fill="currentColor"
// //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// //                             />
// //                           </svg>
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="11" className="otd-table-cell otd-no-records">
// //                     No overtime records found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //       {alertModal.isVisible && (
// //         <div className="otd-modal-overlay">
// //           <div className="otd-modal-content">
// //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// //             <p className="otd-modal-error">{alertModal.message}</p>
// //             <button onClick={closeAlert} className="otd-modal-button">
// //               Close
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //       {aprilPendingPopup.isVisible && (
// //         <div className="otd-april-popup-overlay">
// //           <div className="otd-april-popup-content">
// //             <h3 className="otd-april-popup-title">Pending April 2025 Records</h3>
// //             <p className="otd-april-popup-message">
// //               There are {aprilPendingPopup.pendingCount} pending overtime records for April 2025. Please approve or reject them.
// //             </p>
// //             {aprilPendingPopup.showDetails && (
// //               <div className="otd-table-container">
// //                 <table className="otd-overtime-table">
// //                   <thead>
// //                     <tr>
// //                       <th className="otd-table-header">Date</th>
// //                       <th className="otd-table-header">Employee Name</th>
// //                       <th className="otd-table-header">Total Hours</th>
// //                       <th className="otd-table-header">Extra Hours</th>
// //                       <th className="otd-table-header">Rate</th>
// //                       <th className="otd-table-header">Project</th>
// //                       <th className="otd-table-header">Supervisor</th>
// //                       <th className="otd-table-header">Comments</th>
// //                       <th className="otd-table-header">Status</th>
// //                       <th className="otd-table-header">Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {aprilPendingPopup.data.length > 0 ? (
// //                       aprilPendingPopup.data.map((row) => (
// //                         <tr key={row.key} className="otd-table-row">
// //                           <td className="otd-table-cell otd-date-cell">{row.date}</td>
// //                           <td className="otd-table-cell">{row.name}</td>
// //                           <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
// //                           <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
// //                           <td className="otd-table-cell">
// //                             {/* Add editable rate for popup if needed; current display only */}
// //                             <input
// //                               type="number"
// //                               value={row.rate || assignedCompensationData[row.employee_id] || 0}
// //                               onChange={(e) => handleInputChange(row.key, "rate", e.target.value, true)}
// //                               className="otd-input"
// //                             />
// //                           </td>
// //                           <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
// //                             <span className="otd-text-ellipsis">{row.project}</span>
// //                           </td>
// //                           <td className="otd-table-cell">{row.supervisor}</td>
// //                           <td className="otd-table-cell">
// //                             <input
// //                               type="text"
// //                               value={row.comments}
// //                               onChange={(e) => handleInputChange(row.key, "comments", e.target.value, true)}
// //                               className="otd-input"
// //                               disabled={row.status === "Approved" || row.status === "Rejected"}
// //                             />
// //                           </td>
// //                           <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// //                           <td className="otd-table-cell">
// //                             <div className="otd-action-buttons">
// //                               <button
// //                                 onClick={() => handleStatusChange(row.key, "Approved", false, true)}
// //                                 className="otd-approve"
// //                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
// //                               >
// //                                 <svg className="otd-icon" viewBox="0 0 24 24">
// //                                   <path
// //                                     fill="currentColor"
// //                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// //                                   />
// //                                 </svg>
// //                               </button>
// //                               <button
// //                                 onClick={() => handleStatusChange(row.key, "Rejected", false, true)}
// //                                 className="otd-reject"
// //                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
// //                               >
// //                                 <svg className="otd-icon" viewBox="0 0 24 24">
// //                                   <path
// //                                     fill="currentColor"
// //                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// //                                   />
// //                                 </svg>
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))
// //                     ) : (
// //                       <tr>
// //                         <td colSpan="10" className="otd-table-cell otd-no-records">
// //                           No pending records found.
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //             <div className="otd-april-popup-buttons">
// //               <button
// //                 onClick={handleAprilApprove}
// //                 className="otd-april-approve-button"
// //                 disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
// //               >
// //                 Approve All
// //               </button>
// //               <button
// //                 onClick={handleAprilReject}
// //                 className="otd-april-reject-button"
// //                 disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
// //               >
// //                 Reject All
// //               </button>
// //               <button
// //                 onClick={handleViewDetails}
// //                 className="otd-april-view-details-button"
// //                 disabled={isLoading}
// //               >
// //                 View All Details
// //               </button>
// //               <button
// //                 onClick={() => setAprilPendingPopup({ isVisible: false, pendingCount: 0, showDetails: false, data: [] })}
// //                 className="otd-april-close-button"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OvertimeDetails;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./OvertimeDetails.css";

// const OvertimeDetails = () => {
//   const [overtimeData, setOvertimeData] = useState([]);
//   const [employeeProjectData, setEmployeeProjectData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState("current");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [assignedCompensationData, setAssignedCompensationData] = useState({});
//   const [defaultHoursMap, setDefaultHoursMap] = useState({});

//   const fetchAssignedCompensation = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//             "x-employee-id": meId,
//           },
//         }
//       );

//       const compensationMap = {};
//       const defaultHoursMapLocal = {};
//       response.data.data.forEach((plan) => {
//         plan.assigned_data.forEach((emp) => {
//           compensationMap[emp.employee_id] = plan.plan_data?.overtimePayAmount || 0;
//           defaultHoursMapLocal[emp.employee_id] = parseFloat(plan.plan_data?.defaultWorkingHours) || 8;
//         });
//       });

//       setAssignedCompensationData(compensationMap);
//       setDefaultHoursMap(defaultHoursMapLocal);
//     } catch (error) {
//       console.error("Error fetching assigned compensation:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAssignedCompensation();
//   }, []);

//   const [aprilPendingPopup, setAprilPendingPopup] = useState({
//     isVisible: false,
//     pendingCount: 0,
//     showDetails: false,
//     data: [],
//   });
//   const [monthOptions, setMonthOptions] = useState([]);
//   const [alertModal, setAlertModal] = useState({
//     isVisible: false,
//     title: "",
//     message: "",
//   });

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

//   const showAlert = (message, title = "Alert") => {
//     setAlertModal({ isVisible: true, title, message });
//   };

//   const closeAlert = () => {
//     setAlertModal({ isVisible: false, title: "", message: "" });
//   };

//   const getDateRange = (type) => {
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();

//     let startDate, endDate;

//     if (type === "current") {
//       startDate = new Date(currentYear, currentMonth - 1, 25);
//       endDate = new Date(currentYear, currentMonth, 25);
//     } else if (type === "last") {
//       startDate = new Date(currentYear, currentMonth - 2, 25);
//       endDate = new Date(currentYear, currentMonth - 1, 25);
//     } else if (type === "twoMonthsAgo") {
//       startDate = new Date(currentYear, currentMonth - 3, 25);
//       endDate = new Date(currentYear, currentMonth - 2, 25);
//     } else if (type === "april") {
//       startDate = new Date(currentYear, currentMonth - 4, 25);
//       endDate = new Date(currentYear, currentMonth - 3, 25);
//     }

//     const range = {
//       startDate: startDate.toISOString().split("T")[0],
//       endDate: endDate.toISOString().split("T")[0],
//     };
//     console.log(`getDateRange(${type}): ${range.startDate} to ${range.endDate}`);
//     return range;
//   };

//   const getMonthName = (offset) => {
//     const date = new Date();
//     const targetMonth = date.getMonth() - offset;
//     date.setMonth(targetMonth);
//     const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
//     console.log(`getMonthName(offset: ${offset}, targetMonth: ${targetMonth}): ${monthName}`);
//     return monthName;
//   };

//   const fetchEmployeeProjectData = async () => {
//     try {
//       console.log("Fetching employee project data");
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/employee-projects`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//             "x-employee-id": meId,
//           },
//         }
//       );
//       console.log("Employee Project API Response:", response.data);
//       setEmployeeProjectData(Array.isArray(response.data.data) ? response.data.data : []);
//     } catch (error) {
//       console.error("Employee project fetch error:", error);
//       showAlert("Failed to fetch employee projects", "Error");
//     }
//   };

//   const computeExtraHours = (totalHours, employeeId, sessions) => {
//     const defaultHours = defaultHoursMap[employeeId] || 8;
//     const extraHours = Math.max(0, totalHours - defaultHours);

//     // Apportion extra pro-rata to sessions
//     if (sessions && sessions.length > 0) {
//       const totalApportioned = sessions.reduce((sum, s) => sum + s.apportioned_hours, 0);
//       sessions.forEach((s) => {
//         s.extra_hours = totalApportioned > 0 ? (s.apportioned_hours / totalApportioned) * extraHours : 0;
//       });
//     }

//     return { extraHours, defaultHours };
//   };

//   const fetchData = async (startDate, endDate) => {
//     try {
//       setIsLoading(true);
//       console.log(`Fetching overtime data for ${startDate} to ${endDate}`);
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//             "x-employee-id": meId,
//           },
//           params: {
//             startDate,
//             endDate,
//           },
//         }
//       );

//       console.log("Overtime API Response:", response.data);

//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       console.log("Overtime Raw API Data:", data);

//       if (data.length === 0) {
//         console.warn("No overtime records returned from API for the given date range");
//       }

//       const formattedData = data
//         .map((item) => {
//           const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
//           const totalHours = parseFloat(item.total_hours_worked) || 0;
//           const { extraHours } = computeExtraHours(totalHours, item.employee_id, item.sessions);
//           if (extraHours > 14) {
//             console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
//           }
//           return {
//             key: `${item.employee_id}-${item.work_date}`,
//             employee_id: item.employee_id,
//             date: item.work_date,
//             name: employeeInfo.employee_name || item.employee_id,
//             total_hours: totalHours,
//             hours: extraHours,
//             rate: parseFloat(item.rate) || 0,
//             project: employeeInfo.project_names || item.projects || "",
//             supervisor: employeeInfo.supervisor_name || item.supervisors || "",
//             comments: item.comments || "",
//             status: item.status || "Pending",
//             sessions: item.sessions || [],
//           };
//         })
//         .filter((row) => row.hours > 0); // Filter: Only show if extra > 0

//       console.log("Overtime Formatted Data:", formattedData);
//       setOvertimeData(formattedData);
//       setSelectedRows([]);
//       setSelectAll(false);
//     } catch (error) {
//       console.error("Overtime fetch error:", error);
//       showAlert(
//         error.response?.data?.error || error.message || "Network error",
//         "Error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const checkAprilPending = async () => {
//     const { startDate, endDate } = getDateRange("april");
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//             "x-employee-id": meId,
//           },
//           params: {
//             startDate,
//             endDate,
//           },
//         }
//       );

//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       // Filter pending days with total_hours > 0, then compute and filter extra > 0
//       const pendingData = data.filter((item) => (item.status === "Pending" || !item.status) && parseFloat(item.total_hours_worked) > 0);
//       console.log(`April pending records before extra filter: ${pendingData.length}`);

//       const formattedData = pendingData
//         .map((item) => {
//           const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
//           const totalHours = parseFloat(item.total_hours_worked) || 0;
//           const { extraHours } = computeExtraHours(totalHours, item.employee_id, item.sessions);
//           if (extraHours > 14) {
//             console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
//           }
//           return {
//             key: `${item.employee_id}-${item.work_date}`,
//             employee_id: item.employee_id,
//             date: item.work_date,
//             name: employeeInfo.employee_name || item.employee_id,
//             total_hours: totalHours,
//             hours: extraHours,
//             rate: parseFloat(item.rate) || 0,
//             project: employeeInfo.project_names || item.projects || "",
//             supervisor: employeeInfo.supervisor_name || item.supervisors || "",
//             comments: item.comments || "",
//             status: item.status || "Pending",
//             sessions: item.sessions || [],
//           };
//         })
//         .filter((row) => row.hours > 0); // Filter: Only show if extra > 0

//       console.log(`April pending records after extra filter: ${formattedData.length}`);

//       if (formattedData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
//         setAprilPendingPopup({
//           isVisible: true,
//           pendingCount: formattedData.length,
//           showDetails: false,
//           data: formattedData,
//         });
//         sessionStorage.setItem("aprilPopupShown", "true");
//       }
//     } catch (error) {
//       console.error("Error checking April pending records:", error);
//     }
//   };

//   const handleInputChange = (key, field, value, isAprilPopup = false) => {
//     if (field !== "comments" && field !== "rate") return;
//     const updateFn = (prev) =>
//       prev.map((row) => (row.key === key ? { ...row, [field]: field === "rate" ? parseFloat(value) : value } : row));
    
//     if (isAprilPopup) {
//       setAprilPendingPopup((prev) => ({ ...prev, data: updateFn(prev.data) }));
//     } else {
//       setOvertimeData(updateFn);
//     }
//   };

//   const handleCheckboxChange = (key) => {
//     setSelectedRows((prevSelected) => {
//       const newSelected = prevSelected.includes(key)
//         ? prevSelected.filter((rowKey) => rowKey !== key)
//         : [...prevSelected, key];
//       const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
//       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.key));
//       setSelectAll(allPendingSelected);
//       return newSelected;
//     });
//   };

//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       setSelectedRows([]);
//       setSelectAll(false);
//     } else {
//       const pendingRowKeys = overtimeData
//         .filter((row) => row.status === "Pending" && row.hours > 0)
//         .map((row) => row.key);
//       setSelectedRows(pendingRowKeys);
//       setSelectAll(true);
//     }
//   };

//   const handleStatusChange = async (rowKey, status, isBulk = false, isApril = false) => {
//     try {
//       setIsLoading(true);
//       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

//       let selectedData;
//       if (isBulk || isApril) {
//         let rows;
//         if (isApril) {
//           rows = aprilPendingPopup.data
//             .filter((row) => selectedRows.includes(row.key))
//             .filter((row) => row.status === "Pending" && row.hours > 0);
//         } else {
//           rows = overtimeData
//             .filter((row) => selectedRows.includes(row.key))
//             .filter((row) => row.status === "Pending" && row.hours > 0);
//         }

//         selectedData = [];
//         rows.forEach((row) => {
//           row.sessions.forEach((session) => {
//             selectedData.push({
//               punch_id: session.punch_id,
//               work_date: row.date,
//               employee_id: row.employee_id,
//               extra_hours: session.extra_hours,
//               rate: parseFloat(row.rate) || 0,
//               project: row.project || "",
//               supervisor: row.supervisor || "",
//               comments: row.comments || "",
//               status: status,
//             });
//           });
//         });

//         if (selectedData.length === 0 || selectedData.every((d) => d.extra_hours === 0)) {
//           throw new Error("No overtime hours to approve/reject.");
//         }
//       } else {
//         let rows;
//         if (isApril) {
//           rows = [aprilPendingPopup.data.find((row) => row.key === rowKey)];
//         } else {
//           rows = [overtimeData.find((row) => row.key === rowKey)];
//         }
//         const row = rows[0];
//         if (!row) {
//           throw new Error("Row not found for key: " + rowKey);
//         }
//         if (row.status !== "Pending" || row.hours === 0) {
//           throw new Error(`Cannot change status: ${row.status} or no extra hours.`);
//         }

//         selectedData = row.sessions.map((session) => ({
//           punch_id: session.punch_id,
//           work_date: row.date,
//           employee_id: row.employee_id,
//           extra_hours: session.extra_hours,
//           rate: parseFloat(row.rate) || 0,
//           project: row.project || "",
//           supervisor: row.supervisor || "",
//           comments: row.comments || "",
//           status: status,
//         }));

//         if (selectedData.every((d) => d.extra_hours === 0)) {
//           throw new Error("No overtime hours to approve/reject.");
//         }
//       }

//       const payload = { data: selectedData };

//       await axios.post(fullUrl, payload, {
//         headers: {
//           "x-api-key": API_KEY,
//           "x-employee-id": meId,
//           "Content-Type": "application/json",
//         },
//       });

//       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");

//       if (isApril) {
//         setAprilPendingPopup((prev) => ({
//           ...prev,
//           data: prev.data.map((row) =>
//             (isBulk ? selectedRows.includes(row.key) : row.key === rowKey) && row.status === "Pending"
//               ? { ...row, status }
//               : row
//           ),
//           pendingCount: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length,
//           isVisible: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length > 0,
//         }));
//         setSelectedRows([]);
//       } else {
//         setOvertimeData((prevData) =>
//           prevData.map((row) =>
//             (isBulk && selectedRows.includes(row.key) && row.status === "Pending")
//               ? { ...row, status }
//               : row.key === rowKey && row.status === "Pending"
//               ? { ...row, status }
//               : row
//           )
//         );
//         setSelectedRows([]);
//         setSelectAll(false);
//         const { startDate, endDate } = getDateRange(selectedMonth);
//         await fetchData(startDate, endDate);
//       }
//     } catch (error) {
//       console.error("Error updating overtime status:", error);
//       showAlert(
//         error.response?.data?.error || error.response?.data?.message || error.message || "Network error",
//         "Error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
//   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);
//   const handleAprilApprove = () => handleStatusChange(null, "Approved", true, true);
//   const handleAprilReject = () => handleStatusChange(null, "Rejected", true, true);
//   const handleViewDetails = () => {
//     setAprilPendingPopup((prev) => ({ ...prev, showDetails: true }));
//   };

//   useEffect(() => {
//     console.log("Setting monthOptions");
//     setMonthOptions([
//       { type: "current", offset: 0, label: getMonthName(0) },
//       { type: "last", offset: 1, label: getMonthName(1) },
//       { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
//     ]);
//   }, []);

//   useEffect(() => {
//     fetchEmployeeProjectData();
//   }, []);

//   useEffect(() => {
//     const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
//     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.key));
//     setSelectAll(allPendingSelected);
//   }, [overtimeData, selectedRows]);

//   useEffect(() => {
//     const { startDate, endDate } = getDateRange(selectedMonth);
//     fetchData(startDate, endDate);
//   }, [selectedMonth, employeeProjectData, defaultHoursMap]);

//   useEffect(() => {
//     checkAprilPending();
//   }, [employeeProjectData, defaultHoursMap]);

//   const hasExtraHours = (row) => row.hours > 0;
//   const pendingWithExtra = (data) => data.filter((row) => row.status === "Pending" && hasExtraHours(row)).length;

//   return (
//     <div className="otd-overtime-container">
//       <h2 className="otd-title">Overtime Details</h2>
//       <div className="otd-month-selector">
//         {monthOptions.map(({ type, label }) => (
//           <span
//             key={type}
//             data-testid={`month-option-${type}`}
//             className={`otd-month-option ${selectedMonth === type ? "otd-active" : ""}`}
//             onClick={() => setSelectedMonth(type)}
//             title={label}
//           >
//             {label}
//           </span>
//         ))}
//       </div>
//       <div className="otd-action-buttons-container">
//         <button
//           onClick={handleApproveSelected}
//           className="otd-approve-button"
//           disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
//         >
//           Approve All
//         </button>
//         <button
//           onClick={handleRejectSelected}
//           className="otd-reject-button"
//           disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
//         >
//           Reject All
//         </button>
//       </div>
//       {isLoading ? (
//         <div className="otd-loading">Loading...</div>
//       ) : (
//         <div className="otd-table-container">
//           <table className="otd-overtime-table">
//             <thead>
//               <tr>
//                 <th className="otd-table-header">
//                   <input
//                     type="checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAllChange}
//                     className="otd-checkbox"
//                     disabled={pendingWithExtra(overtimeData) === 0}
//                   />
//                 </th>
//                 <th className="otd-table-header">Date</th>
//                 <th className="otd-table-header">Employee Name</th>
//                 <th className="otd-table-header">Total Hours</th>
//                 <th className="otd-table-header">Extra Hours</th>
//                 <th className="otd-table-header">Rate</th>
//                 <th className="otd-table-header">Project</th>
//                 <th className="otd-table-header">Supervisor</th>
//                 <th className="otd-table-header">Comments</th>
//                 <th className="otd-table-header">Status</th>
//                 <th className="otd-table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {overtimeData.length > 0 ? (
//                 overtimeData.map((row) => (
//                   <tr key={row.key} className={`otd-table-row ${selectedRows.includes(row.key) ? "otd-selected-row" : ""}`}>
//                     <td className="otd-table-cell">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(row.key)}
//                         onChange={() => handleCheckboxChange(row.key)}
//                         className="otd-checkbox"
//                         disabled={row.status !== "Pending" || !hasExtraHours(row)}
//                       />
//                     </td>
//                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
//                     <td className="otd-table-cell">{row.name}</td>
//                     <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
//                     <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
//                     <td className="otd-table-cell">
//                       {row.status === "Pending" && hasExtraHours(row) ? (
//                         <input
//                           type="number"
//                           value={row.rate || assignedCompensationData[row.employee_id] || 0}
//                           onChange={(e) => handleInputChange(row.key, "rate", e.target.value)}
//                           className="otd-input"
//                         />
//                       ) : (
//                         row.rate.toFixed(2)
//                       )}
//                     </td>
//                     <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
//                       <span className="otd-text-ellipsis">{row.project}</span>
//                     </td>
//                     <td className="otd-table-cell">{row.supervisor}</td>
//                     <td className="otd-table-cell">
//                       <input
//                         type="text"
//                         value={row.comments}
//                         onChange={(e) => handleInputChange(row.key, "comments", e.target.value)}
//                         className="otd-input"
//                         disabled={row.status === "Approved" || row.status === "Rejected" || !hasExtraHours(row)}
//                       />
//                     </td>
//                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
//                     <td className="otd-table-cell">
//                       <div className="otd-action-buttons">
//                         <button
//                           onClick={() => handleStatusChange(row.key, "Approved")}
//                           className="otd-approve"
//                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
//                         >
//                           <svg className="otd-icon" viewBox="0 0 24 24">
//                             <path
//                               fill="currentColor"
//                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(row.key, "Rejected")}
//                           className="otd-reject"
//                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
//                         >
//                           <svg className="otd-icon" viewBox="0 0 24 24">
//                             <path
//                               fill="currentColor"
//                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="11" className="otd-table-cell otd-no-records">
//                     No overtime records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {alertModal.isVisible && (
//         <div className="otd-modal-overlay">
//           <div className="otd-modal-content">
//             <h3 className="otd-modal-title">{alertModal.title}</h3>
//             <p className="otd-modal-error">{alertModal.message}</p>
//             <button onClick={closeAlert} className="otd-modal-button">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//       {aprilPendingPopup.isVisible && (
//         <div className="otd-april-popup-overlay">
//           <div className="otd-april-popup-content">
//             <h3 className="otd-april-popup-title">Pending April 2025 Records</h3>
//             <p className="otd-april-popup-message">
//               There are {aprilPendingPopup.pendingCount} pending overtime records for April 2025. Please approve or reject them.
//             </p>
//             {aprilPendingPopup.showDetails && (
//               <div className="otd-table-container">
//                 <table className="otd-overtime-table">
//                   <thead>
//                     <tr>
//                       <th className="otd-table-header">Date</th>
//                       <th className="otd-table-header">Employee Name</th>
//                       <th className="otd-table-header">Total Hours</th>
//                       <th className="otd-table-header">Extra Hours</th>
//                       <th className="otd-table-header">Rate</th>
//                       <th className="otd-table-header">Project</th>
//                       <th className="otd-table-header">Supervisor</th>
//                       <th className="otd-table-header">Comments</th>
//                       <th className="otd-table-header">Status</th>
//                       <th className="otd-table-header">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {aprilPendingPopup.data.length > 0 ? (
//                       aprilPendingPopup.data.map((row) => (
//                         <tr key={row.key} className="otd-table-row">
//                           <td className="otd-table-cell otd-date-cell">{row.date}</td>
//                           <td className="otd-table-cell">{row.name}</td>
//                           <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
//                           <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="number"
//                               value={row.rate || assignedCompensationData[row.employee_id] || 0}
//                               onChange={(e) => handleInputChange(row.key, "rate", e.target.value, true)}
//                               className="otd-input"
//                               disabled={!hasExtraHours(row)}
//                             />
//                           </td>
//                           <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
//                             <span className="otd-text-ellipsis">{row.project}</span>
//                           </td>
//                           <td className="otd-table-cell">{row.supervisor}</td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="text"
//                               value={row.comments}
//                               onChange={(e) => handleInputChange(row.key, "comments", e.target.value, true)}
//                               className="otd-input"
//                               disabled={row.status === "Approved" || row.status === "Rejected"}
//                             />
//                           </td>
//                           <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
//                           <td className="otd-table-cell">
//                             <div className="otd-action-buttons">
//                               <button
//                                 onClick={() => handleStatusChange(row.key, "Approved", false, true)}
//                                 className="otd-approve"
//                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
//                               >
//                                 <svg className="otd-icon" viewBox="0 0 24 24">
//                                   <path
//                                     fill="currentColor"
//                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
//                                   />
//                                 </svg>
//                               </button>
//                               <button
//                                 onClick={() => handleStatusChange(row.key, "Rejected", false, true)}
//                                 className="otd-reject"
//                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
//                               >
//                                 <svg className="otd-icon" viewBox="0 0 24 24">
//                                   <path
//                                     fill="currentColor"
//                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
//                                   />
//                                 </svg>
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="10" className="otd-table-cell otd-no-records">
//                           No pending records found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//             <div className="otd-april-popup-buttons">
//               <button
//                 onClick={handleAprilApprove}
//                 className="otd-april-approve-button"
//                 disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
//               >
//                 Approve All
//               </button>
//               <button
//                 onClick={handleAprilReject}
//                 className="otd-april-reject-button"
//                 disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
//               >
//                 Reject All
//               </button>
//               <button
//                 onClick={handleViewDetails}
//                 className="otd-april-view-details-button"
//                 disabled={isLoading}
//               >
//                 View All Details
//               </button>
//               <button
//                 onClick={() => setAprilPendingPopup({ isVisible: false, pendingCount: 0, showDetails: false, data: [] })}
//                 className="otd-april-close-button"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OvertimeDetails;
////////////////////////////////<---------------------------------->





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
  const [assignedCompensationData, setAssignedCompensationData] = useState({});
  const [defaultHoursMap, setDefaultHoursMap] = useState({});
  const [cutoffDate, setCutoffDate] = useState(30); // Default fallback

  const fetchAssignedCompensation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
        }
      );

      const compensationMap = {};
      const defaultHoursMapLocal = {};
      response.data.data.forEach((plan) => {
        plan.assigned_data.forEach((emp) => {
          compensationMap[emp.employee_id] = plan.plan_data?.overtimePayAmount || 0;
          defaultHoursMapLocal[emp.employee_id] = parseFloat(plan.plan_data?.defaultWorkingHours) || 8;
        });
      });

      setAssignedCompensationData(compensationMap);
      setDefaultHoursMap(defaultHoursMapLocal);
    } catch (error) {
      console.error("Error fetching assigned compensation:", error);
    }
  };

  const fetchCutoffDate = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/salaryCalculationperiods`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
        }
      );
      const fetchedCutoff = response.data.data[0]?.cutoff_date || 30;
      setCutoffDate(fetchedCutoff);
      console.log(`Fetched cutoff date: ${fetchedCutoff}`);
    } catch (error) {
      console.error("Error fetching cutoff date:", error);
      // Fallback to 30
    }
  };

  useEffect(() => {
    fetchAssignedCompensation();
    fetchCutoffDate();
  }, []);

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

  const getDateRange = (type, cutoff) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let startDate, endDate;

    if (type === "current") {
      startDate = new Date(currentYear, currentMonth - 1, cutoff);
      endDate = new Date(currentYear, currentMonth, cutoff);
    } else if (type === "last") {
      startDate = new Date(currentYear, currentMonth - 2, cutoff);
      endDate = new Date(currentYear, currentMonth - 1, cutoff);
    } else if (type === "twoMonthsAgo") {
      startDate = new Date(currentYear, currentMonth - 3, cutoff);
      endDate = new Date(currentYear, currentMonth - 2, cutoff);
    } else if (type === "april") {
      // Hardcoded for April 2025 period: March cutoff to April cutoff
      const aprilYear = 2025;
      startDate = new Date(aprilYear, 2, cutoff); // March (month 2)
      endDate = new Date(aprilYear, 3, cutoff); // April (month 3)
    }

    // Adjust endDate to next day 00:00:00 to include full end day in <= filter
    const nextDayEnd = new Date(endDate);
    nextDayEnd.setDate(nextDayEnd.getDate() + 1);

    const range = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: nextDayEnd.toISOString().split("T")[0],
    };
    console.log(`getDateRange(${type}, cutoff: ${cutoff}): ${range.startDate} to ${range.endDate} (includes full ${endDate.toISOString().split("T")[0]} via next-day end)`);
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

  const computeExtraHours = (totalHours, employeeId, sessions) => {
    const defaultHours = defaultHoursMap[employeeId] || 8;
    const extraHours = Math.max(0, totalHours - defaultHours);

    // Apportion extra pro-rata to sessions
    if (sessions && sessions.length > 0) {
      const totalApportioned = sessions.reduce((sum, s) => sum + s.apportioned_hours, 0);
      sessions.forEach((s) => {
        s.extra_hours = totalApportioned > 0 ? (s.apportioned_hours / totalApportioned) * extraHours : 0;
      });
    }

    return { extraHours, defaultHours };
  };

  // Helper to filter raw API data by date range (applied before mapping)
  const filterRawDataByDate = (rawData, startDateStr, originalEndStr) => {
    const startDate = new Date(startDateStr + 'T00:00:00');
    const endDate = new Date(originalEndStr + 'T00:00:00');
    const filtered = rawData.filter((item) => {
      const workDate = new Date(item.work_date + 'T00:00:00');
      return workDate >= startDate && workDate <= endDate;
    });
    console.log(`Raw data filter: Input ${rawData.length} items, Output ${filtered.length} items (range: ${startDateStr} to ${originalEndStr})`);
    return filtered;
  };

  const fetchData = async (startDate, endDateParam) => {
    try {
      setIsLoading(true);
      console.log(`Fetching overtime data for ${startDate} to ${endDateParam}`);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
          params: {
            startDate,
            endDate: endDateParam,
          },
        }
      );

      console.log("Overtime API Response:", response.data);

      let data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Overtime Raw API Data (pre-filter):", data.length, "items");

      if (data.length === 0) {
        console.warn("No overtime records returned from API for the given date range");
      }

      // Compute original end date for filtering (since endDateParam is next day)
      const paramEndDate = new Date(endDateParam + 'T00:00:00');
      paramEndDate.setDate(paramEndDate.getDate() - 1);
      const originalEndStr = paramEndDate.toISOString().split('T')[0];
      console.log(`Client-side filter range: ${startDate} to ${originalEndStr}`);

      // Filter raw data by date range FIRST (to exclude invalid dates like Sep 29)
      data = filterRawDataByDate(data, startDate, originalEndStr);

      const formattedData = data
        .map((item) => {
          const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
          const totalHours = parseFloat(item.total_hours_worked) || 0;
          const { extraHours } = computeExtraHours(totalHours, item.employee_id, item.sessions);
          if (extraHours > 14) {
            console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
          }
          return {
            key: `${item.employee_id}-${item.work_date}`,
            employee_id: item.employee_id,
            date: item.work_date,
            name: employeeInfo.employee_name || item.employee_id,
            total_hours: totalHours,
            hours: extraHours,
            rate: parseFloat(item.rate) || 0,
            project: employeeInfo.project_names || item.projects || "",
            supervisor: employeeInfo.supervisor_name || item.supervisors || "",
            comments: item.comments || "",
            status: item.status || "Pending",
            sessions: item.sessions || [],
          };
        })
        .filter((row) => row.hours > 0); // Filter: Only show if extra > 0

      console.log("Overtime Formatted Data (after extra hours filter):", formattedData.length, "items");
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
    const { startDate, endDate: endDateParam } = getDateRange("april", cutoffDate);
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
            endDate: endDateParam,
          },
        }
      );

      let data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("April Raw API Data (pre-filter):", data.length, "items");

      // Compute original end date for filtering
      const paramEndDate = new Date(endDateParam + 'T00:00:00');
      paramEndDate.setDate(paramEndDate.getDate() - 1);
      const originalEndStr = paramEndDate.toISOString().split('T')[0];
      console.log(`April client-side filter range: ${startDate} to ${originalEndStr}`);

      // Filter raw data by date range
      data = filterRawDataByDate(data, startDate, originalEndStr);

      // Filter pending days with total_hours > 0, then compute and filter extra > 0
      const pendingData = data.filter((item) => (item.status === "Pending" || !item.status) && parseFloat(item.total_hours_worked) > 0);
      console.log(`April pending records before extra filter: ${pendingData.length}`);

      const formattedData = pendingData
        .map((item) => {
          const employeeInfo = employeeProjectData.find((emp) => emp.employee_id === item.employee_id) || {};
          const totalHours = parseFloat(item.total_hours_worked) || 0;
          const { extraHours } = computeExtraHours(totalHours, item.employee_id, item.sessions);
          if (extraHours > 14) {
            console.warn(`Unusually high extra_hours for ${item.employee_id} on ${item.work_date}: ${extraHours}`);
          }
          return {
            key: `${item.employee_id}-${item.work_date}`,
            employee_id: item.employee_id,
            date: item.work_date,
            name: employeeInfo.employee_name || item.employee_id,
            total_hours: totalHours,
            hours: extraHours,
            rate: parseFloat(item.rate) || 0,
            project: employeeInfo.project_names || item.projects || "",
            supervisor: employeeInfo.supervisor_name || item.supervisors || "",
            comments: item.comments || "",
            status: item.status || "Pending",
            sessions: item.sessions || [],
          };
        })
        .filter((row) => row.hours > 0); // Filter: Only show if extra > 0

      console.log(`April pending records after extra filter: ${formattedData.length}`);

      if (formattedData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
        setAprilPendingPopup({
          isVisible: true,
          pendingCount: formattedData.length,
          showDetails: false,
          data: formattedData,
        });
        sessionStorage.setItem("aprilPopupShown", "true");
      }
    } catch (error) {
      console.error("Error checking April pending records:", error);
    }
  };

  const handleInputChange = (key, field, value, isAprilPopup = false) => {
    if (field !== "comments" && field !== "rate") return;
    const updateFn = (prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: field === "rate" ? parseFloat(value) : value } : row));
    
    if (isAprilPopup) {
      setAprilPendingPopup((prev) => ({ ...prev, data: updateFn(prev.data) }));
    } else {
      setOvertimeData(updateFn);
    }
  };

  const handleCheckboxChange = (key) => {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(key)
        ? prevSelected.filter((rowKey) => rowKey !== key)
        : [...prevSelected, key];
      const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
      const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.key));
      setSelectAll(allPendingSelected);
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const pendingRowKeys = overtimeData
        .filter((row) => row.status === "Pending" && row.hours > 0)
        .map((row) => row.key);
      setSelectedRows(pendingRowKeys);
      setSelectAll(true);
    }
  };

  const handleStatusChange = async (rowKey, status, isBulk = false, isApril = false) => {
    try {
      setIsLoading(true);
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

      let selectedData;
      if (isBulk || isApril) {
        let rows;
        if (isApril) {
          rows = aprilPendingPopup.data
            .filter((row) => selectedRows.includes(row.key))
            .filter((row) => row.status === "Pending" && row.hours > 0);
        } else {
          rows = overtimeData
            .filter((row) => selectedRows.includes(row.key))
            .filter((row) => row.status === "Pending" && row.hours > 0);
        }

        selectedData = [];
        rows.forEach((row) => {
          row.sessions.forEach((session) => {
            selectedData.push({
              punch_id: session.punch_id,
              work_date: row.date,
              employee_id: row.employee_id,
              extra_hours: session.extra_hours,
              rate: parseFloat(row.rate) || 0,
              project: row.project || "",
              supervisor: row.supervisor || "",
              comments: row.comments || "",
              status: status,
            });
          });
        });

        if (selectedData.length === 0 || selectedData.every((d) => d.extra_hours === 0)) {
          throw new Error("No overtime hours to approve/reject.");
        }
      } else {
        let rows;
        if (isApril) {
          rows = [aprilPendingPopup.data.find((row) => row.key === rowKey)];
        } else {
          rows = [overtimeData.find((row) => row.key === rowKey)];
        }
        const row = rows[0];
        if (!row) {
          throw new Error("Row not found for key: " + rowKey);
        }
        if (row.status !== "Pending" || row.hours === 0) {
          throw new Error(`Cannot change status: ${row.status} or no extra hours.`);
        }

        selectedData = row.sessions.map((session) => ({
          punch_id: session.punch_id,
          work_date: row.date,
          employee_id: row.employee_id,
          extra_hours: session.extra_hours,
          rate: parseFloat(row.rate) || 0,
          project: row.project || "",
          supervisor: row.supervisor || "",
          comments: row.comments || "",
          status: status,
        }));

        if (selectedData.every((d) => d.extra_hours === 0)) {
          throw new Error("No overtime hours to approve/reject.");
        }
      }

      const payload = { data: selectedData };

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
            (isBulk ? selectedRows.includes(row.key) : row.key === rowKey) && row.status === "Pending"
              ? { ...row, status }
              : row
          ),
          pendingCount: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length,
          isVisible: prev.data.filter((row) => row.status === "Pending" && row.hours > 0).length > 0,
        }));
        setSelectedRows([]);
      } else {
        setOvertimeData((prevData) =>
          prevData.map((row) =>
            (isBulk && selectedRows.includes(row.key) && row.status === "Pending")
              ? { ...row, status }
              : row.key === rowKey && row.status === "Pending"
              ? { ...row, status }
              : row
          )
        );
        setSelectedRows([]);
        setSelectAll(false);
        const { startDate: newStart, endDate: newEndParam } = getDateRange(selectedMonth, cutoffDate);
        await fetchData(newStart, newEndParam);
      }
    } catch (error) {
      console.error("Error updating overtime status:", error);
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
    const pendingRows = overtimeData.filter((row) => row.status === "Pending" && row.hours > 0);
    const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.key));
    setSelectAll(allPendingSelected);
  }, [overtimeData, selectedRows]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(selectedMonth, cutoffDate);
    fetchData(startDate, endDate);
  }, [selectedMonth, employeeProjectData, defaultHoursMap, cutoffDate]);

  useEffect(() => {
    checkAprilPending();
  }, [employeeProjectData, defaultHoursMap, cutoffDate]);

  const hasExtraHours = (row) => row.hours > 0;
  const pendingWithExtra = (data) => data.filter((row) => row.status === "Pending" && hasExtraHours(row)).length;

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
          disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
        >
          Approve All
        </button>
        <button
          onClick={handleRejectSelected}
          className="otd-reject-button"
          disabled={selectedRows.length === 0 || isLoading || pendingWithExtra(overtimeData) === 0}
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
                    disabled={pendingWithExtra(overtimeData) === 0}
                  />
                </th>
                <th className="otd-table-header">Date</th>
                <th className="otd-table-header">Employee Name</th>
                <th className="otd-table-header">Total Hours</th>
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
                  <tr key={row.key} className={`otd-table-row ${selectedRows.includes(row.key) ? "otd-selected-row" : ""}`}>
                    <td className="otd-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.key)}
                        onChange={() => handleCheckboxChange(row.key)}
                        className="otd-checkbox"
                        disabled={row.status !== "Pending" || !hasExtraHours(row)}
                      />
                    </td>
                    <td className="otd-table-cell otd-date-cell">{row.date}</td>
                    <td className="otd-table-cell">{row.name}</td>
                    <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
                    <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
                    <td className="otd-table-cell">
                      {row.status === "Pending" && hasExtraHours(row) ? (
                        <input
                          type="number"
                          value={row.rate || assignedCompensationData[row.employee_id] || 0}
                          onChange={(e) => handleInputChange(row.key, "rate", e.target.value)}
                          className="otd-input"
                        />
                      ) : (
                        row.rate.toFixed(2)
                      )}
                    </td>
                    <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
                      <span className="otd-text-ellipsis">{row.project}</span>
                    </td>
                    <td className="otd-table-cell">{row.supervisor}</td>
                    <td className="otd-table-cell">
                      <input
                        type="text"
                        value={row.comments}
                        onChange={(e) => handleInputChange(row.key, "comments", e.target.value)}
                        className="otd-input"
                        disabled={row.status === "Approved" || row.status === "Rejected" || !hasExtraHours(row)}
                      />
                    </td>
                    <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                    <td className="otd-table-cell">
                      <div className="otd-action-buttons">
                        <button
                          onClick={() => handleStatusChange(row.key, "Approved")}
                          className="otd-approve"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
                        >
                          <svg className="otd-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusChange(row.key, "Rejected")}
                          className="otd-reject"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
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
                  <td colSpan="11" className="otd-table-cell otd-no-records">
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
            <p className="otd-modal-error">{alertModal.message}</p>
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
                      <th className="otd-table-header">Total Hours</th>
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
                        <tr key={row.key} className="otd-table-row">
                          <td className="otd-table-cell otd-date-cell">{row.date}</td>
                          <td className="otd-table-cell">{row.name}</td>
                          <td className="otd-table-cell">{row.total_hours.toFixed(2)}</td>
                          <td className="otd-table-cell">{row.hours.toFixed(2)}</td>
                          <td className="otd-table-cell">
                            <input
                              type="number"
                              value={row.rate || assignedCompensationData[row.employee_id] || 0}
                              onChange={(e) => handleInputChange(row.key, "rate", e.target.value, true)}
                              className="otd-input"
                              disabled={!hasExtraHours(row)}
                            />
                          </td>
                          <td className="otd-table-cell" title={row.project?.length > 20 || row.project?.includes(",") ? row.project : ""}>
                            <span className="otd-text-ellipsis">{row.project}</span>
                          </td>
                          <td className="otd-table-cell">{row.supervisor}</td>
                          <td className="otd-table-cell">
                            <input
                              type="text"
                              value={row.comments}
                              onChange={(e) => handleInputChange(row.key, "comments", e.target.value, true)}
                              className="otd-input"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                          <td className="otd-table-cell">
                            <div className="otd-action-buttons">
                              <button
                                onClick={() => handleStatusChange(row.key, "Approved", false, true)}
                                className="otd-approve"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
                              >
                                <svg className="otd-icon" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleStatusChange(row.key, "Rejected", false, true)}
                                className="otd-reject"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading || !hasExtraHours(row)}
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
                disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
              >
                Approve All
              </button>
              <button
                onClick={handleAprilReject}
                className="otd-april-reject-button"
                disabled={isLoading || pendingWithExtra(aprilPendingPopup.data) === 0}
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