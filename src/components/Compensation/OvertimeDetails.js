
// // // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // import "./OvertimeDetails.css";

// // // // // // // // // // // const OvertimeDetails = () => {
// // // // // // // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // // // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // // // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // // // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // // // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // // // // // // //     isVisible: false,
// // // // // // // // // // //     title: "",
// // // // // // // // // // //     message: "",
// // // // // // // // // // //   });

// // // // // // // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // // // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // // // // // // //   };

// // // // // // // // // // //   const closeAlert = () => {
// // // // // // // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // // // // // // //   };

// // // // // // // // // // //   const getDateRange = (type) => {
// // // // // // // // // // //     const today = new Date();
// // // // // // // // // // //     const currentMonth = today.getMonth();
// // // // // // // // // // //     const currentYear = today.getFullYear();

// // // // // // // // // // //     let startDate, endDate;

// // // // // // // // // // //     if (type === "current") {
// // // // // // // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // // // // // // //     } else {
// // // // // // // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // // // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // // // //     }

// // // // // // // // // // //     return {
// // // // // // // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // // // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // // // // // // //     };
// // // // // // // // // // //   };

// // // // // // // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       setIsLoading(true);
// // // // // // // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // // // // // // //         headers: {
// // // // // // // // // // //           "x-api-key": API_KEY,
// // // // // // // // // // //           "x-employee-id": meId,
// // // // // // // // // // //         },
// // // // // // // // // // //         params: {
// // // // // // // // // // //           startDate,
// // // // // // // // // // //           endDate,
// // // // // // // // // // //         },
// // // // // // // // // // //       });

// // // // // // // // // // //       const formattedData = response.data.map((item) => ({
// // // // // // // // // // //         id: item.punch_id,
// // // // // // // // // // //         date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // // // // // // //         name: item.employee_id,
// // // // // // // // // // //         hours: parseFloat(item.extra_hours),
// // // // // // // // // // //         rate: item.rate ,
// // // // // // // // // // //         project: item.project ,
// // // // // // // // // // //         supervisor: item.supervisor ,
// // // // // // // // // // //         comments: item.comments || "",
// // // // // // // // // // //         status: item.status || "Pending", // Add status field
// // // // // // // // // // //       }));

// // // // // // // // // // //       setOvertimeData(formattedData);
// // // // // // // // // // //       setSelectedRows([]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // // // // // // //       showAlert(error.response?.data?.message || error.message || "Network error", "Error");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleInputChange = (id, field, value) => {
// // // // // // // // // // //     setOvertimeData((prevData) =>
// // // // // // // // // // //       prevData.map((row) =>
// // // // // // // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // // // // // // //       )
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleCheckboxChange = (id) => {
// // // // // // // // // // //     setSelectedRows((prevSelected) =>
// // // // // // // // // // //       prevSelected.includes(id)
// // // // // // // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // // // // // // //         : [...prevSelected, id]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleSaveSelected = async () => {
// // // // // // // // // // //     if (selectedRows.length === 0) {
// // // // // // // // // // //       showAlert("Please select at least one row to save.", "Warning");
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     try {
// // // // // // // // // // //       setIsLoading(true);
// // // // // // // // // // //       const updates = overtimeData
// // // // // // // // // // //         .filter((row) => selectedRows.includes(row.id))
// // // // // // // // // // //         .map((row) => ({
// // // // // // // // // // //           punchId: row.id,
// // // // // // // // // // //           rate: parseFloat(row.rate),
// // // // // // // // // // //           project: row.project,
// // // // // // // // // // //           supervisor: row.supervisor,
// // // // // // // // // // //           comments: row.comments,
// // // // // // // // // // //         }));

// // // // // // // // // // //       await axios.put(
// // // // // // // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours/bulk`,
// // // // // // // // // // //         { updates },
// // // // // // // // // // //         {
// // // // // // // // // // //           headers: {
// // // // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // // // //             "x-employee-id": meId,
// // // // // // // // // // //           },
// // // // // // // // // // //         }
// // // // // // // // // // //       );

// // // // // // // // // // //       showAlert("Selected rows updated successfully", "Success");
// // // // // // // // // // //       setSelectedRows([]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Failed to update overtime data:", error);
// // // // // // // // // // //       showAlert(error.response?.data?.message || error.message || "Network error", "Error");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleStatusChange = async (punchId, status) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       setIsLoading(true);
// // // // // // // // // // //       await axios.put(
// // // // // // // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours/${punchId}/status`,
// // // // // // // // // // //         { status },
// // // // // // // // // // //         {
// // // // // // // // // // //           headers: {
// // // // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // // // //             "x-employee-id": meId,
// // // // // // // // // // //           },
// // // // // // // // // // //         }
// // // // // // // // // // //       );

// // // // // // // // // // //       setOvertimeData((prevData) =>
// // // // // // // // // // //         prevData.map((row) =>
// // // // // // // // // // //           row.id === punchId ? { ...row, status } : row
// // // // // // // // // // //         )
// // // // // // // // // // //       );
// // // // // // // // // // //       showAlert(`Overtime record ${status.toLowerCase()} successfully`, "Success");
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record:`, error);
// // // // // // // // // // //       showAlert(error.response?.data?.message || error.message || "Network error", "Error");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // // // //     fetchData(startDate, endDate);
// // // // // // // // // // //   }, [selectedMonth]);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="otd-overtime-container">
// // // // // // // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // // // // // // //       <div className="otd-month-selector">
// // // // // // // // // // //         <span
// // // // // // // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // // // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // // // // // // //         >
// // // // // // // // // // //           Current Month
// // // // // // // // // // //         </span>
// // // // // // // // // // //         <span
// // // // // // // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // // // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // // // // // // //         >
// // // // // // // // // // //           Last Month
// // // // // // // // // // //         </span>
// // // // // // // // // // //       </div>

// // // // // // // // // // //       <button
// // // // // // // // // // //         onClick={handleSaveSelected}
// // // // // // // // // // //         className="otd-save-button"
// // // // // // // // // // //         disabled={selectedRows.length === 0 || isLoading}
// // // // // // // // // // //       >
// // // // // // // // // // //         Save Selected
// // // // // // // // // // //       </button>

// // // // // // // // // // //       {isLoading ? (
// // // // // // // // // // //         <div className="otd-loading">Loading...</div>
// // // // // // // // // // //       ) : (
// // // // // // // // // // //         <div className="otd-table-container">
// // // // // // // // // // //           <table className="otd-overtime-table">
// // // // // // // // // // //             <thead>
// // // // // // // // // // //               <tr>
// // // // // // // // // // //                 <th className="otd-table-header">
// // // // // // // // // // //                   <input
// // // // // // // // // // //                     type="checkbox"
// // // // // // // // // // //                     checked={selectedRows.length === overtimeData.length && overtimeData.length > 0}
// // // // // // // // // // //                     onChange={() =>
// // // // // // // // // // //                       setSelectedRows(
// // // // // // // // // // //                         selectedRows.length === overtimeData.length
// // // // // // // // // // //                           ? []
// // // // // // // // // // //                           : overtimeData.map((row) => row.id)
// // // // // // // // // // //                       )
// // // // // // // // // // //                     }
// // // // // // // // // // //                     className="otd-checkbox"
// // // // // // // // // // //                   />
// // // // // // // // // // //                 </th>
// // // // // // // // // // //                 <th className="otd-table-header">Date</th>
// // // // // // // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // // // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // // // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // // // // // // //                 <th className="otd-table-header">Project</th>
// // // // // // // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // // // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // // // // // // //                 <th className="otd-table-header">Status</th>
// // // // // // // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // // // // // // //               </tr>
// // // // // // // // // // //             </thead>
// // // // // // // // // // //             <tbody>
// // // // // // // // // // //               {overtimeData.length > 0 ? (
// // // // // // // // // // //                 overtimeData.map((row) => (
// // // // // // // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <input
// // // // // // // // // // //                         type="checkbox"
// // // // // // // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // // // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // // // // // // //                         className="otd-checkbox"
// // // // // // // // // // //                       />
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                     <td className="otd-table-cell">{row.date}</td>
// // // // // // // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // // // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <input
// // // // // // // // // // //                         type="number"
// // // // // // // // // // //                         value={row.rate}
// // // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // // // // // // //                         className="otd-input"
// // // // // // // // // // //                         min="0"
// // // // // // // // // // //                         step="0.01"
// // // // // // // // // // //                       />
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <input
// // // // // // // // // // //                         type="text"
// // // // // // // // // // //                         value={row.project}
// // // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // // // // // // //                         className="otd-input"
// // // // // // // // // // //                       />
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <input
// // // // // // // // // // //                         type="text"
// // // // // // // // // // //                         value={row.supervisor}
// // // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // // // // // // //                         className="otd-input"
// // // // // // // // // // //                       />
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <input
// // // // // // // // // // //                         type="text"
// // // // // // // // // // //                         value={row.comments}
// // // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // // // // // // //                         className="otd-input"
// // // // // // // // // // //                       />
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                     <td className="otd-table-cell">{row.status}</td>
// // // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // // //                       <div className="otd-action-buttons">
// // // // // // // // // // //                         <button
// // // // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // // // // // // //                           className="otd-approve"
// // // // // // // // // // //                           disabled={row.status === "Approved" || isLoading}
// // // // // // // // // // //                         >
// // // // // // // // // // //                           Approve
// // // // // // // // // // //                         </button>
// // // // // // // // // // //                         <button
// // // // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // // // // // // //                           className="otd-reject"
// // // // // // // // // // //                           disabled={row.status === "Rejected" || isLoading}
// // // // // // // // // // //                         >
// // // // // // // // // // //                           Reject
// // // // // // // // // // //                         </button>
// // // // // // // // // // //                       </div>
// // // // // // // // // // //                     </td>
// // // // // // // // // // //                   </tr>
// // // // // // // // // // //                 ))
// // // // // // // // // // //               ) : (
// // // // // // // // // // //                 <tr>
// // // // // // // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // // // // // // //                     No overtime records found.
// // // // // // // // // // //                   </td>
// // // // // // // // // // //                 </tr>
// // // // // // // // // // //               )}
// // // // // // // // // // //             </tbody>
// // // // // // // // // // //           </table>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       )}

// // // // // // // // // // //       {alertModal.isVisible && (
// // // // // // // // // // //         <div className="otd-modal-overlay">
// // // // // // // // // // //           <div className="otd-modal-content">
// // // // // // // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // // // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={closeAlert}
// // // // // // // // // // //               className="otd-modal-button"
// // // // // // // // // // //             >
// // // // // // // // // // //               Close
// // // // // // // // // // //             </button>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       )}
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default OvertimeDetails;
// // // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // // import axios from "axios";
// // // // // // // // // // import "./OvertimeDetails.css";

// // // // // // // // // // const OvertimeDetails = () => {
// // // // // // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // // // // // //     isVisible: false,
// // // // // // // // // //     title: "",
// // // // // // // // // //     message: "",
// // // // // // // // // //   });

// // // // // // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // // // // // //   };

// // // // // // // // // //   const closeAlert = () => {
// // // // // // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // // // // // //   };

// // // // // // // // // //   const getDateRange = (type) => {
// // // // // // // // // //     const today = new Date();
// // // // // // // // // //     const currentMonth = today.getMonth();
// // // // // // // // // //     const currentYear = today.getFullYear();

// // // // // // // // // //     let startDate, endDate;

// // // // // // // // // //     if (type === "current") {
// // // // // // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // // // // // //     } else {
// // // // // // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // // //     }

// // // // // // // // // //     return {
// // // // // // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // // // // // //     };
// // // // // // // // // //   };

// // // // // // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // // // // // //     try {
// // // // // // // // // //       setIsLoading(true);
// // // // // // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // // // // // //         headers: {
// // // // // // // // // //           "x-api-key": API_KEY,
// // // // // // // // // //           "x-employee-id": meId,
// // // // // // // // // //         },
// // // // // // // // // //         params: {
// // // // // // // // // //           startDate,
// // // // // // // // // //           endDate,
// // // // // // // // // //         },
// // // // // // // // // //       });

// // // // // // // // // //       const formattedData = response.data.map((item) => ({
// // // // // // // // // //         id: item.punch_id,
// // // // // // // // // //         date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // // // // // //         name: item.employee_id,
// // // // // // // // // //         hours: parseFloat(item.extra_hours),
// // // // // // // // // //         rate: item.rate,
// // // // // // // // // //         project: item.project,
// // // // // // // // // //         supervisor: item.supervisor,
// // // // // // // // // //         comments: item.comments || "",
// // // // // // // // // //         status: item.status || "Pending",
// // // // // // // // // //       }));

// // // // // // // // // //       setOvertimeData(formattedData);
// // // // // // // // // //       setSelectedRows([]);
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setIsLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleInputChange = (id, field, value) => {
// // // // // // // // // //     setOvertimeData((prevData) =>
// // // // // // // // // //       prevData.map((row) =>
// // // // // // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // // // // // //       )
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   const handleCheckboxChange = (id) => {
// // // // // // // // // //     setSelectedRows((prevSelected) =>
// // // // // // // // // //       prevSelected.includes(id)
// // // // // // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // // // // // //         : [...prevSelected, id]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   const handleSaveSelected = async () => {
// // // // // // // // // //     if (selectedRows.length === 0) {
// // // // // // // // // //       showAlert("Please select at least one row to save.", "Warning");
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     try {
// // // // // // // // // //       setIsLoading(true);
// // // // // // // // // //       const data = overtimeData
// // // // // // // // // //         .filter((row) => selectedRows.includes(row.id))
// // // // // // // // // //         .map((row) => ({
// // // // // // // // // //           punch_id: row.id,
// // // // // // // // // //           work_date: row.date,
// // // // // // // // // //           employee_id: row.name,
// // // // // // // // // //           extra_hours: row.hours,
// // // // // // // // // //           rate: parseFloat(row.rate),
// // // // // // // // // //           project: row.project,
// // // // // // // // // //           supervisor: row.supervisor,
// // // // // // // // // //           comments: row.comments,
// // // // // // // // // //           status: row.status || "Pending",
// // // // // // // // // //         }));

// // // // // // // // // //       await axios.post(
// // // // // // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
// // // // // // // // // //         { data },
// // // // // // // // // //         {
// // // // // // // // // //           headers: {
// // // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // // //             "x-employee-id": meId,
// // // // // // // // // //           },
// // // // // // // // // //         }
// // // // // // // // // //       );

// // // // // // // // // //       showAlert("Selected rows saved successfully", "Success");
// // // // // // // // // //       setSelectedRows([]);
// // // // // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // // //       await fetchData(startDate, endDate);
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Failed to save overtime data:", error);
// // // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setIsLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleStatusChange = async (punchId, status) => {
// // // // // // // // // //     try {
// // // // // // // // // //       setIsLoading(true);
// // // // // // // // // //       const endpoint = status === "Approved" ? "/api/compensation/overtime/approve" : "/api/compensation/overtime/reject";
// // // // // // // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // // // // // // //       console.log(`Sending request to: ${fullUrl}`);
// // // // // // // // // //       await axios.post(
// // // // // // // // // //         fullUrl,
// // // // // // // // // //         { punchId },
// // // // // // // // // //         {
// // // // // // // // // //           headers: {
// // // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // // //             "x-employee-id": meId,
// // // // // // // // // //           },
// // // // // // // // // //         }
// // // // // // // // // //       );

// // // // // // // // // //       setOvertimeData((prevData) =>
// // // // // // // // // //         prevData.map((row) =>
// // // // // // // // // //           row.id === punchId ? { ...row, status } : row
// // // // // // // // // //         )
// // // // // // // // // //       );
// // // // // // // // // //       showAlert(`Overtime record ${status.toLowerCase()} successfully`, "Success");
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record:`, error);
// // // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setIsLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // // //     fetchData(startDate, endDate);
// // // // // // // // // //   }, [selectedMonth]);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="otd-overtime-container">
// // // // // // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // // // // // //       <div className="otd-month-selector">
// // // // // // // // // //         <span
// // // // // // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // // // // // //         >
// // // // // // // // // //           Current Month
// // // // // // // // // //         </span>
// // // // // // // // // //         <span
// // // // // // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // // // // // //         >
// // // // // // // // // //           Last Month
// // // // // // // // // //         </span>
// // // // // // // // // //       </div>

// // // // // // // // // //       <button
// // // // // // // // // //         onClick={handleSaveSelected}
// // // // // // // // // //         className="otd-save-button"
// // // // // // // // // //         disabled={selectedRows.length === 0 || isLoading}
// // // // // // // // // //       >
// // // // // // // // // //         Save Selected
// // // // // // // // // //       </button>

// // // // // // // // // //       {isLoading ? (
// // // // // // // // // //         <div className="otd-loading">Loading...</div>
// // // // // // // // // //       ) : (
// // // // // // // // // //         <div className="otd-table-container">
// // // // // // // // // //           <table className="otd-overtime-table">
// // // // // // // // // //             <thead>
// // // // // // // // // //               <tr>
// // // // // // // // // //                 <th className="otd-table-header">
// // // // // // // // // //                   <input
// // // // // // // // // //                     type="checkbox"
// // // // // // // // // //                     checked={selectedRows.length === overtimeData.length && overtimeData.length > 0}
// // // // // // // // // //                     onChange={() =>
// // // // // // // // // //                       setSelectedRows(
// // // // // // // // // //                         selectedRows.length === overtimeData.length
// // // // // // // // // //                           ? []
// // // // // // // // // //                           : overtimeData.map((row) => row.id)
// // // // // // // // // //                       )
// // // // // // // // // //                     }
// // // // // // // // // //                     className="otd-checkbox"
// // // // // // // // // //                   />
// // // // // // // // // //                 </th>
// // // // // // // // // //                 <th className="otd-table-header">Date</th>
// // // // // // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // // // // // //                 <th className="otd-table-header">Project</th>
// // // // // // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // // // // // //                 <th className="otd-table-header">Status</th>
// // // // // // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // // // // // //               </tr>
// // // // // // // // // //             </thead>
// // // // // // // // // //             <tbody>
// // // // // // // // // //               {overtimeData.length > 0 ? (
// // // // // // // // // //                 overtimeData.map((row) => (
// // // // // // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <input
// // // // // // // // // //                         type="checkbox"
// // // // // // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // // // // // //                         className="otd-checkbox"
// // // // // // // // // //                       />
// // // // // // // // // //                     </td>
// // // // // // // // // //                     <td className="otd-table-cell">{row.date}</td>
// // // // // // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <input
// // // // // // // // // //                         type="number"
// // // // // // // // // //                         value={row.rate}
// // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // // // // // //                         className="otd-input"
// // // // // // // // // //                         min="0"
// // // // // // // // // //                         step="0.01"
// // // // // // // // // //                       />
// // // // // // // // // //                     </td>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <input
// // // // // // // // // //                         type="text"
// // // // // // // // // //                         value={row.project}
// // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // // // // // //                         className="otd-input"
// // // // // // // // // //                       />
// // // // // // // // // //                     </td>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <input
// // // // // // // // // //                         type="text"
// // // // // // // // // //                         value={row.supervisor}
// // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // // // // // //                         className="otd-input"
// // // // // // // // // //                       />
// // // // // // // // // //                     </td>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <input
// // // // // // // // // //                         type="text"
// // // // // // // // // //                         value={row.comments}
// // // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // // // // // //                         className="otd-input"
// // // // // // // // // //                       />
// // // // // // // // // //                     </td>
// // // // // // // // // //                     <td className="otd-table-cell">{row.status}</td>
// // // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // // //                       <div className="otd-action-buttons">
// // // // // // // // // //                         <button
// // // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // // // // // //                           className="otd-approve"
// // // // // // // // // //                           disabled={row.status === "Approved" || isLoading}
// // // // // // // // // //                         >
// // // // // // // // // //                           Approve
// // // // // // // // // //                         </button>
// // // // // // // // // //                         <button
// // // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // // // // // //                           className="otd-reject"
// // // // // // // // // //                           disabled={row.status === "Rejected" || isLoading}
// // // // // // // // // //                         >
// // // // // // // // // //                           Reject
// // // // // // // // // //                         </button>
// // // // // // // // // //                       </div>
// // // // // // // // // //                     </td>
// // // // // // // // // //                   </tr>
// // // // // // // // // //                 ))
// // // // // // // // // //               ) : (
// // // // // // // // // //                 <tr>
// // // // // // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // // // // // //                     No overtime records found.
// // // // // // // // // //                   </td>
// // // // // // // // // //                 </tr>
// // // // // // // // // //               )}
// // // // // // // // // //             </tbody>
// // // // // // // // // //           </table>
// // // // // // // // // //         </div>
// // // // // // // // // //       )}

// // // // // // // // // //       {alertModal.isVisible && (
// // // // // // // // // //         <div className="otd-modal-overlay">
// // // // // // // // // //           <div className="otd-modal-content">
// // // // // // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={closeAlert}
// // // // // // // // // //               className="otd-modal-button"
// // // // // // // // // //             >
// // // // // // // // // //               Close
// // // // // // // // // //             </button>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       )}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default OvertimeDetails;
// // // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // // import axios from "axios";
// // // // // // // // // import "./OvertimeDetails.css";

// // // // // // // // // const OvertimeDetails = () => {
// // // // // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // // // // //     isVisible: false,
// // // // // // // // //     title: "",
// // // // // // // // //     message: "",
// // // // // // // // //   });

// // // // // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // // // // //   };

// // // // // // // // //   const closeAlert = () => {
// // // // // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // // // // //   };

// // // // // // // // //   const getDateRange = (type) => {
// // // // // // // // //     const today = new Date();
// // // // // // // // //     const currentMonth = today.getMonth();
// // // // // // // // //     const currentYear = today.getFullYear();

// // // // // // // // //     let startDate, endDate;

// // // // // // // // //     if (type === "current") {
// // // // // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // // // // //     } else {
// // // // // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // // //     }

// // // // // // // // //     return {
// // // // // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // // // // //     };
// // // // // // // // //   };

// // // // // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // // // // //     try {
// // // // // // // // //       setIsLoading(true);
// // // // // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // // // // //         headers: {
// // // // // // // // //           "x-api-key": API_KEY,
// // // // // // // // //           "x-employee-id": meId,
// // // // // // // // //         },
// // // // // // // // //         params: {
// // // // // // // // //           startDate,
// // // // // // // // //           endDate,
// // // // // // // // //         },
// // // // // // // // //       });

// // // // // // // // //       const formattedData = response.data.map((item) => ({
// // // // // // // // //         id: item.punch_id,
// // // // // // // // //         date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // // // // //         name: item.employee_id,
// // // // // // // // //         hours: parseFloat(item.extra_hours),
// // // // // // // // //         rate: item.rate,
// // // // // // // // //         project: item.project,
// // // // // // // // //         supervisor: item.supervisor,
// // // // // // // // //         comments: item.comments || "",
// // // // // // // // //         status: item.status || "Pending",
// // // // // // // // //       }));

// // // // // // // // //       setOvertimeData(formattedData);
// // // // // // // // //       setSelectedRows([]);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // //     } finally {
// // // // // // // // //       setIsLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleInputChange = (id, field, value) => {
// // // // // // // // //     setOvertimeData((prevData) =>
// // // // // // // // //       prevData.map((row) =>
// // // // // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // // // // //       )
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const handleCheckboxChange = (id) => {
// // // // // // // // //     setSelectedRows((prevSelected) =>
// // // // // // // // //       prevSelected.includes(id)
// // // // // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // // // // //         : [...prevSelected, id]
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const handleSaveSelected = async () => {
// // // // // // // // //     if (selectedRows.length === 0) {
// // // // // // // // //       showAlert("Please select at least one row to save.", "Warning");
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     try {
// // // // // // // // //       setIsLoading(true);
// // // // // // // // //       const data = overtimeData
// // // // // // // // //         .filter((row) => selectedRows.includes(row.id))
// // // // // // // // //         .map((row) => ({
// // // // // // // // //           punch_id: row.id,
// // // // // // // // //           work_date: row.date,
// // // // // // // // //           employee_id: row.name,
// // // // // // // // //           extra_hours: row.hours,
// // // // // // // // //           rate: parseFloat(row.rate) || 0,
// // // // // // // // //           project: row.project || "",
// // // // // // // // //           supervisor: row.supervisor || "",
// // // // // // // // //           comments: row.comments || "",
// // // // // // // // //           status: row.status || "Pending",
// // // // // // // // //         }));

// // // // // // // // //       await axios.post(
// // // // // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
// // // // // // // // //         { data },
// // // // // // // // //         {
// // // // // // // // //           headers: {
// // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // //             "x-employee-id": meId,
// // // // // // // // //           },
// // // // // // // // //         }
// // // // // // // // //       );

// // // // // // // // //       showAlert("Selected rows saved successfully", "Success");
// // // // // // // // //       setSelectedRows([]);
// // // // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // //       await fetchData(startDate, endDate);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Failed to save overtime data:", error);
// // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // //     } finally {
// // // // // // // // //       setIsLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleStatusChange = async (punchId, status) => {
// // // // // // // // //     try {
// // // // // // // // //       setIsLoading(true);
// // // // // // // // //       const endpoint = status === "Approved" ? "/api/compensation/overtime/approve" : "/api/compensation/overtime/reject";
// // // // // // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // // // // // //       console.log(`Sending request to: ${fullUrl}`);

// // // // // // // // //       // Find the row data for the given punchId
// // // // // // // // //       const row = overtimeData.find((row) => row.id === punchId);
// // // // // // // // //       if (!row) {
// // // // // // // // //         throw new Error("Row not found for punchId: " + punchId);
// // // // // // // // //       }

// // // // // // // // //       const rowData = {
// // // // // // // // //         punch_id: row.id,
// // // // // // // // //         work_date: row.date,
// // // // // // // // //         employee_id: row.name,
// // // // // // // // //         extra_hours: row.hours,
// // // // // // // // //         rate: parseFloat(row.rate) || 0,
// // // // // // // // //         project: row.project || "",
// // // // // // // // //         supervisor: row.supervisor || "",
// // // // // // // // //         comments: row.comments || "",
// // // // // // // // //         status: status,
// // // // // // // // //       };

// // // // // // // // //       await axios.post(
// // // // // // // // //         fullUrl,
// // // // // // // // //         rowData, // Send full row data instead of just punchId
// // // // // // // // //         {
// // // // // // // // //           headers: {
// // // // // // // // //             "x-api-key": API_KEY,
// // // // // // // // //             "x-employee-id": meId,
// // // // // // // // //           },
// // // // // // // // //         }
// // // // // // // // //       );

// // // // // // // // //       setOvertimeData((prevData) =>
// // // // // // // // //         prevData.map((row) =>
// // // // // // // // //           row.id === punchId ? { ...row, status } : row
// // // // // // // // //         )
// // // // // // // // //       );
// // // // // // // // //       showAlert(`Overtime record ${status.toLowerCase()} successfully`, "Success");

// // // // // // // // //       // Re-fetch data to reflect any changes
// // // // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // //       await fetchData(startDate, endDate);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record:`, error);
// // // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // // //     } finally {
// // // // // // // // //       setIsLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // // //     fetchData(startDate, endDate);
// // // // // // // // //   }, [selectedMonth]);

// // // // // // // // //   return (
// // // // // // // // //     <div className="otd-overtime-container">
// // // // // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // // // // //       <div className="otd-month-selector">
// // // // // // // // //         <span
// // // // // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // // // // //         >
// // // // // // // // //           Current Month
// // // // // // // // //         </span>
// // // // // // // // //         <span
// // // // // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // // // // //         >
// // // // // // // // //           Last Month
// // // // // // // // //         </span>
// // // // // // // // //       </div>

// // // // // // // // //       <button
// // // // // // // // //         onClick={handleSaveSelected}
// // // // // // // // //         className="otd-save-button"
// // // // // // // // //         disabled={selectedRows.length === 0 || isLoading}
// // // // // // // // //       >
// // // // // // // // //         Save Selected
// // // // // // // // //       </button>

// // // // // // // // //       {isLoading ? (
// // // // // // // // //         <div className="otd-loading">Loading...</div>
// // // // // // // // //       ) : (
// // // // // // // // //         <div className="otd-table-container">
// // // // // // // // //           <table className="otd-overtime-table">
// // // // // // // // //             <thead>
// // // // // // // // //               <tr>
// // // // // // // // //                 <th className="otd-table-header">
// // // // // // // // //                   <input
// // // // // // // // //                     type="checkbox"
// // // // // // // // //                     checked={selectedRows.length === overtimeData.length && overtimeData.length > 0}
// // // // // // // // //                     onChange={() =>
// // // // // // // // //                       setSelectedRows(
// // // // // // // // //                         selectedRows.length === overtimeData.length
// // // // // // // // //                           ? []
// // // // // // // // //                           : overtimeData.map((row) => row.id)
// // // // // // // // //                       )
// // // // // // // // //                     }
// // // // // // // // //                     className="otd-checkbox"
// // // // // // // // //                   />
// // // // // // // // //                 </th>
// // // // // // // // //                 <th className="otd-table-header">Date</th>
// // // // // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // // // // //                 <th className="otd-table-header">Project</th>
// // // // // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // // // // //                 <th className="otd-table-header">Status</th>
// // // // // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // // // // //               </tr>
// // // // // // // // //             </thead>
// // // // // // // // //             <tbody>
// // // // // // // // //               {overtimeData.length > 0 ? (
// // // // // // // // //                 overtimeData.map((row) => (
// // // // // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <input
// // // // // // // // //                         type="checkbox"
// // // // // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // // // // //                         className="otd-checkbox"
// // // // // // // // //                       />
// // // // // // // // //                     </td>
// // // // // // // // //                     <td className="otd-table-cell">{row.date}</td>
// // // // // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <input
// // // // // // // // //                         type="number"
// // // // // // // // //                         value={row.rate}
// // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // // // // //                         className="otd-input"
// // // // // // // // //                         min="0"
// // // // // // // // //                         step="0.01"
// // // // // // // // //                       />
// // // // // // // // //                     </td>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <input
// // // // // // // // //                         type="text"
// // // // // // // // //                         value={row.project}
// // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // // // // //                         className="otd-input"
// // // // // // // // //                       />
// // // // // // // // //                     </td>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <input
// // // // // // // // //                         type="text"
// // // // // // // // //                         value={row.supervisor}
// // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // // // // //                         className="otd-input"
// // // // // // // // //                       />
// // // // // // // // //                     </td>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <input
// // // // // // // // //                         type="text"
// // // // // // // // //                         value={row.comments}
// // // // // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // // // // //                         className="otd-input"
// // // // // // // // //                       />
// // // // // // // // //                     </td>
// // // // // // // // //                     <td className="otd-table-cell">{row.status}</td>
// // // // // // // // //                     <td className="otd-table-cell">
// // // // // // // // //                       <div className="otd-action-buttons">
// // // // // // // // //                         <button
// // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // // // // //                           className="otd-approve"
// // // // // // // // //                           disabled={row.status === "Approved" || isLoading}
// // // // // // // // //                         >
// // // // // // // // //                           Approve
// // // // // // // // //                         </button>
// // // // // // // // //                         <button
// // // // // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // // // // //                           className="otd-reject"
// // // // // // // // //                           disabled={row.status === "Rejected" || isLoading}
// // // // // // // // //                         >
// // // // // // // // //                           Reject
// // // // // // // // //                         </button>
// // // // // // // // //                       </div>
// // // // // // // // //                     </td>
// // // // // // // // //                   </tr>
// // // // // // // // //                 ))
// // // // // // // // //               ) : (
// // // // // // // // //                 <tr>
// // // // // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // // // // //                     No overtime records found.
// // // // // // // // //                   </td>
// // // // // // // // //                 </tr>
// // // // // // // // //               )}
// // // // // // // // //             </tbody>
// // // // // // // // //           </table>
// // // // // // // // //         </div>
// // // // // // // // //       )}

// // // // // // // // //       {alertModal.isVisible && (
// // // // // // // // //         <div className="otd-modal-overlay">
// // // // // // // // //           <div className="otd-modal-content">
// // // // // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // // // // //             <button
// // // // // // // // //               onClick={closeAlert}
// // // // // // // // //               className="otd-modal-button"
// // // // // // // // //             >
// // // // // // // // //               Close
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default OvertimeDetails;
// // // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // // import axios from "axios";
// // // // // // // // import "./OvertimeDetails.css";

// // // // // // // // const OvertimeDetails = () => {
// // // // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // // // //     isVisible: false,
// // // // // // // //     title: "",
// // // // // // // //     message: "",
// // // // // // // //   });

// // // // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // // // //   };

// // // // // // // //   const closeAlert = () => {
// // // // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // // // //   };

// // // // // // // //   const getDateRange = (type) => {
// // // // // // // //     const today = new Date();
// // // // // // // //     const currentMonth = today.getMonth();
// // // // // // // //     const currentYear = today.getFullYear();

// // // // // // // //     let startDate, endDate;

// // // // // // // //     if (type === "current") {
// // // // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // // // //     } else {
// // // // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // // //     }

// // // // // // // //     return {
// // // // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // // // //     };
// // // // // // // //   };

// // // // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // // // //     try {
// // // // // // // //       setIsLoading(true);
// // // // // // // //       console.log("Fetching data with startDate:", startDate, "endDate:", endDate);
// // // // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // // // //         headers: {
// // // // // // // //           "x-api-key": API_KEY,
// // // // // // // //           "x-employee-id": meId,
// // // // // // // //         },
// // // // // // // //         params: {
// // // // // // // //           startDate,
// // // // // // // //           endDate,
// // // // // // // //         },
// // // // // // // //       });

// // // // // // // //       const formattedData = response.data.map((item) => {
// // // // // // // //         console.log("Received item:", item); // Log each item for debugging
// // // // // // // //         return {
// // // // // // // //           id: item.punch_id,
// // // // // // // //           date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // // // //           name: item.employee_id,
// // // // // // // //           hours: parseFloat(item.extra_hours) || 0,
// // // // // // // //           rate: parseFloat(item.rate) || 0,
// // // // // // // //           project: item.project || "",
// // // // // // // //           supervisor: item.supervisor || "",
// // // // // // // //           comments: item.comments || "",
// // // // // // // //           status: item.status || "Pending",
// // // // // // // //         };
// // // // // // // //       });

// // // // // // // //       console.log("Formatted data:", formattedData); // Log formatted data
// // // // // // // //       setOvertimeData(formattedData);
// // // // // // // //       setSelectedRows([]);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // //     } finally {
// // // // // // // //       setIsLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleInputChange = (id, field, value) => {
// // // // // // // //     setOvertimeData((prevData) =>
// // // // // // // //       prevData.map((row) =>
// // // // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // // // //       )
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const handleCheckboxChange = (id) => {
// // // // // // // //     setSelectedRows((prevSelected) =>
// // // // // // // //       prevSelected.includes(id)
// // // // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // // // //         : [...prevSelected, id]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const handleSaveSelected = async () => {
// // // // // // // //     if (selectedRows.length === 0) {
// // // // // // // //       showAlert("Please select at least one row to save.", "Warning");
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     try {
// // // // // // // //       setIsLoading(true);
// // // // // // // //       const data = overtimeData
// // // // // // // //         .filter((row) => selectedRows.includes(row.id))
// // // // // // // //         .map((row) => ({
// // // // // // // //           punch_id: row.id,
// // // // // // // //           work_date: row.date,
// // // // // // // //           employee_id: row.name,
// // // // // // // //           extra_hours: row.hours,
// // // // // // // //           rate: parseFloat(row.rate) || 0,
// // // // // // // //           project: row.project || "",
// // // // // // // //           supervisor: row.supervisor || "",
// // // // // // // //           comments: row.comments || "",
// // // // // // // //           status: row.status || "Pending",
// // // // // // // //         }));

// // // // // // // //       console.log("Saving selected rows:", data); // Log payload for debugging
// // // // // // // //       await axios.post(
// // // // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
// // // // // // // //         { data },
// // // // // // // //         {
// // // // // // // //           headers: {
// // // // // // // //             "x-api-key": API_KEY,
// // // // // // // //             "x-employee-id": meId,
// // // // // // // //           },
// // // // // // // //         }
// // // // // // // //       );

// // // // // // // //       showAlert("Selected rows saved successfully", "Success");
// // // // // // // //       setSelectedRows([]);
// // // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // //       await fetchData(startDate, endDate);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Failed to save overtime data:", error);
// // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // //     } finally {
// // // // // // // //       setIsLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleStatusChange = async (punchId, status) => {
// // // // // // // //     try {
// // // // // // // //       setIsLoading(true);
// // // // // // // //       const endpoint = status === "Approved" ? "/api/compensation/overtime/approve" : "/api/compensation/overtime/reject";
// // // // // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // // // // //       console.log(`Sending request to: ${fullUrl}`);

// // // // // // // //       // Find the row data for the given punchId
// // // // // // // //       const row = overtimeData.find((row) => row.id === punchId);
// // // // // // // //       if (!row) {
// // // // // // // //         throw new Error("Row not found for punchId: " + punchId);
// // // // // // // //       }

// // // // // // // //       const rowData = {
// // // // // // // //         punch_id: row.id,
// // // // // // // //         work_date: row.date,
// // // // // // // //         employee_id: row.name,
// // // // // // // //         extra_hours: row.hours,
// // // // // // // //         rate: parseFloat(row.rate) || 0,
// // // // // // // //         project: row.project || "",
// // // // // // // //         supervisor: row.supervisor || "",
// // // // // // // //         comments: row.comments || "",
// // // // // // // //         status: status,
// // // // // // // //       };

// // // // // // // //       console.log("Sending row data:", rowData); // Log payload for debugging
// // // // // // // //       await axios.post(
// // // // // // // //         fullUrl,
// // // // // // // //         rowData,
// // // // // // // //         {
// // // // // // // //           headers: {
// // // // // // // //             "x-api-key": API_KEY,
// // // // // // // //             "x-employee-id": meId,
// // // // // // // //           },
// // // // // // // //         }
// // // // // // // //       );

// // // // // // // //       setOvertimeData((prevData) =>
// // // // // // // //         prevData.map((row) =>
// // // // // // // //           row.id === punchId ? { ...row, status } : row
// // // // // // // //         )
// // // // // // // //       );
// // // // // // // //       showAlert(`Overtime record ${status.toLowerCase()} successfully`, "Success");

// // // // // // // //       // Re-fetch data to reflect updated status
// // // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // //       await fetchData(startDate, endDate);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record:`, error);
// // // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // // //     } finally {
// // // // // // // //       setIsLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // // //     fetchData(startDate, endDate);
// // // // // // // //   }, [selectedMonth]);

// // // // // // // //   return (
// // // // // // // //     <div className="otd-overtime-container">
// // // // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // // // //       <div className="otd-month-selector">
// // // // // // // //         <span
// // // // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // // // //         >
// // // // // // // //           Current Month
// // // // // // // //         </span>
// // // // // // // //         <span
// // // // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // // // //         >
// // // // // // // //           Last Month
// // // // // // // //         </span>
// // // // // // // //       </div>

// // // // // // // //       <button
// // // // // // // //         onClick={handleSaveSelected}
// // // // // // // //         className="otd-save-button"
// // // // // // // //         disabled={selectedRows.length === 0 || isLoading}
// // // // // // // //       >
// // // // // // // //         Save Selected
// // // // // // // //       </button>

// // // // // // // //       {isLoading ? (
// // // // // // // //         <div className="otd-loading">Loading...</div>
// // // // // // // //       ) : (
// // // // // // // //         <div className="otd-table-container">
// // // // // // // //           <table className="otd-overtime-table">
// // // // // // // //             <thead>
// // // // // // // //               <tr>
// // // // // // // //                 <th className="otd-table-header">
// // // // // // // //                   <input
// // // // // // // //                     type="checkbox"
// // // // // // // //                     checked={selectedRows.length === overtimeData.length && overtimeData.length > 0}
// // // // // // // //                     onChange={() =>
// // // // // // // //                       setSelectedRows(
// // // // // // // //                         selectedRows.length === overtimeData.length
// // // // // // // //                           ? []
// // // // // // // //                           : overtimeData.map((row) => row.id)
// // // // // // // //                       )
// // // // // // // //                     }
// // // // // // // //                     className="otd-checkbox"
// // // // // // // //                   />
// // // // // // // //                 </th>
// // // // // // // //                 <th className="otd-table-header">Date</th>
// // // // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // // // //                 <th className="otd-table-header">Project</th>
// // // // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // // // //                 <th className="otd-table-header">Status</th>
// // // // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // // // //               </tr>
// // // // // // // //             </thead>
// // // // // // // //             <tbody>
// // // // // // // //               {overtimeData.length > 0 ? (
// // // // // // // //                 overtimeData.map((row) => (
// // // // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <input
// // // // // // // //                         type="checkbox"
// // // // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // // // //                         className="otd-checkbox"
// // // // // // // //                       />
// // // // // // // //                     </td>
// // // // // // // //                     <td className="otd-table-cell">{row.date}</td>
// // // // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={row.rate}
// // // // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // // // //                         className="otd-input"
// // // // // // // //                         min="0"
// // // // // // // //                         step="0.01"
// // // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"} // Disable input for finalized records
// // // // // // // //                       />
// // // // // // // //                     </td>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <input
// // // // // // // //                         type="text"
// // // // // // // //                         value={row.project}
// // // // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // // // //                         className="otd-input"
// // // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // // //                       />
// // // // // // // //                     </td>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <input
// // // // // // // //                         type="text"
// // // // // // // //                         value={row.supervisor}
// // // // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // // // //                         className="otd-input"
// // // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // // //                       />
// // // // // // // //                     </td>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <input
// // // // // // // //                         type="text"
// // // // // // // //                         value={row.comments}
// // // // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // // // //                         className="otd-input"
// // // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // // //                       />
// // // // // // // //                     </td>
// // // // // // // //                     <td className="otd-table-cell">{row.status}</td>
// // // // // // // //                     <td className="otd-table-cell">
// // // // // // // //                       <div className="otd-action-buttons">
// // // // // // // //                         <button
// // // // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // // // //                           className="otd-approve"
// // // // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // // // //                         >
// // // // // // // //                           Approve
// // // // // // // //                         </button>
// // // // // // // //                         <button
// // // // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // // // //                           className="otd-reject"
// // // // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // // // //                         >
// // // // // // // //                           Reject
// // // // // // // //                         </button>
// // // // // // // //                       </div>
// // // // // // // //                     </td>
// // // // // // // //                   </tr>
// // // // // // // //                 ))
// // // // // // // //               ) : (
// // // // // // // //                 <tr>
// // // // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // // // //                     No overtime records found.
// // // // // // // //                   </td>
// // // // // // // //                 </tr>
// // // // // // // //               )}
// // // // // // // //             </tbody>
// // // // // // // //           </table>
// // // // // // // //         </div>
// // // // // // // //       )}

// // // // // // // //       {alertModal.isVisible && (
// // // // // // // //         <div className="otd-modal-overlay">
// // // // // // // //           <div className="otd-modal-content">
// // // // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // // // //             <button
// // // // // // // //               onClick={closeAlert}
// // // // // // // //               className="otd-modal-button"
// // // // // // // //             >
// // // // // // // //               Close
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default OvertimeDetails;

// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import axios from "axios";
// // // // // // // import "./OvertimeDetails.css";

// // // // // // // const OvertimeDetails = () => {
// // // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // // //     isVisible: false,
// // // // // // //     title: "",
// // // // // // //     message: "",
// // // // // // //   });

// // // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // // //   };

// // // // // // //   const closeAlert = () => {
// // // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // // //   };

// // // // // // //   const getDateRange = (type) => {
// // // // // // //     const today = new Date();
// // // // // // //     const currentMonth = today.getMonth();
// // // // // // //     const currentYear = today.getFullYear();

// // // // // // //     let startDate, endDate;

// // // // // // //     if (type === "current") {
// // // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // // //     } else {
// // // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // // //     }

// // // // // // //     return {
// // // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // // //     };
// // // // // // //   };

// // // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // // //     try {
// // // // // // //       setIsLoading(true);
// // // // // // //       console.log("Fetching data with startDate:", startDate, "endDate:", endDate);
// // // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // // //         headers: {
// // // // // // //           "x-api-key": API_KEY,
// // // // // // //           "x-employee-id": meId,
// // // // // // //         },
// // // // // // //         params: {
// // // // // // //           startDate,
// // // // // // //           endDate,
// // // // // // //         },
// // // // // // //       });

// // // // // // //       const formattedData = response.data.map((item) => {
// // // // // // //         console.log("Received item:", item);
// // // // // // //         return {
// // // // // // //           id: item.punch_id,
// // // // // // //           date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // // //           name: item.employee_id,
// // // // // // //           hours: parseFloat(item.extra_hours) || 0,
// // // // // // //           rate: parseFloat(item.rate) || 0,
// // // // // // //           project: item.project || "",
// // // // // // //           supervisor: item.supervisor || "",
// // // // // // //           comments: item.comments || "",
// // // // // // //           status: item.status || "Pending",
// // // // // // //         };
// // // // // // //       });

// // // // // // //       console.log("Formatted data:", formattedData);
// // // // // // //       setOvertimeData(formattedData);
// // // // // // //       setSelectedRows([]);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // //     } finally {
// // // // // // //       setIsLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleInputChange = (id, field, value) => {
// // // // // // //     setOvertimeData((prevData) =>
// // // // // // //       prevData.map((row) =>
// // // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // // //       )
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const handleCheckboxChange = (id) => {
// // // // // // //     setSelectedRows((prevSelected) =>
// // // // // // //       prevSelected.includes(id)
// // // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // // //         : [...prevSelected, id]
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const handleSaveSelected = async () => {
// // // // // // //   if (selectedRows.length === 0) {
// // // // // // //     showAlert("Please select at least one row to save.", "Warning");
// // // // // // //     return;
// // // // // // //   }

// // // // // // //   try {
// // // // // // //     setIsLoading(true);
// // // // // // //     const data = overtimeData
// // // // // // //       .filter((row) => selectedRows.includes(row.id))
// // // // // // //       .map((row) => ({
// // // // // // //         punch_id: row.id,
// // // // // // //         work_date: row.date,
// // // // // // //         employee_id: row.name,
// // // // // // //         extra_hours: row.hours,
// // // // // // //         rate: parseFloat(row.rate) || 0,
// // // // // // //         project: row.project || "",
// // // // // // //         supervisor: row.supervisor || "",
// // // // // // //         comments: row.comments || "",
// // // // // // //         status: "Approved", // Explicitly set status to Approved
// // // // // // //       }));

// // // // // // //     console.log("Saving selected rows with Approved status:", data);
// // // // // // //     await axios.post(
// // // // // // //       `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
// // // // // // //       { data },
// // // // // // //       {
// // // // // // //         headers: {
// // // // // // //           "x-api-key": API_KEY,
// // // // // // //           "x-employee-id": meId,
// // // // // // //         },
// // // // // // //       }
// // // // // // //     );

// // // // // // //     // Update local state to reflect Approved status for selected rows
// // // // // // //     setOvertimeData((prevData) =>
// // // // // // //       prevData.map((row) =>
// // // // // // //         selectedRows.includes(row.id) ? { ...row, status: "Approved" } : row
// // // // // // //       )
// // // // // // //     );

// // // // // // //     showAlert("Selected rows saved and approved successfully", "Success");
// // // // // // //     setSelectedRows([]); // Clear selection after saving
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Failed to save overtime data:", error);
// // // // // // //     showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // //   } finally {
// // // // // // //     setIsLoading(false);
// // // // // // //   }
// // // // // // // };

// // // // // // //   const handleStatusChange = async (punchId, status, isBulk = false) => {
// // // // // // //     try {
// // // // // // //       setIsLoading(true);
// // // // // // //       const endpoint = status === "Approved" 
// // // // // // //         ? (isBulk ? "/api/compensation/overtime/approve-bulk" : "/api/compensation/overtime/approve")
// // // // // // //         : (isBulk ? "/api/compensation/overtime/reject-bulk" : "/api/compensation/overtime/reject");
// // // // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // // // //       console.log(`Sending request to: ${fullUrl}`);

// // // // // // //       let payload;
// // // // // // //       if (isBulk) {
// // // // // // //         // Bulk operation: Send data for all selected rows
// // // // // // //         const selectedData = overtimeData
// // // // // // //           .filter((row) => selectedRows.includes(row.id))
// // // // // // //           .filter((row) => row.status === "Pending") // Only process Pending rows
// // // // // // //           .map((row) => ({
// // // // // // //             punch_id: row.id,
// // // // // // //             work_date: row.date,
// // // // // // //             employee_id: row.name,
// // // // // // //             extra_hours: row.hours,
// // // // // // //             rate: parseFloat(row.rate) || 0,
// // // // // // //             project: row.project || "",
// // // // // // //             supervisor: row.supervisor || "",
// // // // // // //             comments: row.comments || "",
// // // // // // //             status: status,
// // // // // // //           }));

// // // // // // //         if (selectedData.length === 0) {
// // // // // // //           throw new Error("No pending rows selected for approval/rejection.");
// // // // // // //         }

// // // // // // //         payload = { data: selectedData };
// // // // // // //         console.log("Bulk status change payload:", payload);
// // // // // // //       } else {
// // // // // // //         // Single row operation
// // // // // // //         const row = overtimeData.find((row) => row.id === punchId);
// // // // // // //         if (!row) {
// // // // // // //           throw new Error("Row not found for punchId: " + punchId);
// // // // // // //         }
// // // // // // //         if (row.status !== "Pending") {
// // // // // // //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// // // // // // //         }

// // // // // // //         payload = {
// // // // // // //           punch_id: row.id,
// // // // // // //           work_date: row.date,
// // // // // // //           employee_id: row.name,
// // // // // // //           extra_hours: row.hours,
// // // // // // //           rate: parseFloat(row.rate) || 0,
// // // // // // //           project: row.project || "",
// // // // // // //           supervisor: row.supervisor || "",
// // // // // // //           comments: row.comments || "",
// // // // // // //           status: status,
// // // // // // //         };
// // // // // // //         console.log("Single row status change payload:", payload);
// // // // // // //       }

// // // // // // //       await axios.post(
// // // // // // //         fullUrl,
// // // // // // //         payload,
// // // // // // //         {
// // // // // // //           headers: {
// // // // // // //             "x-api-key": API_KEY,
// // // // // // //             "x-employee-id": meId,
// // // // // // //           },
// // // // // // //         }
// // // // // // //       );

// // // // // // //       // Update local state to reflect new status
// // // // // // //       setOvertimeData((prevData) =>
// // // // // // //         prevData.map((row) =>
// // // // // // //           isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // // // // // //             ? { ...row, status }
// // // // // // //             : row.id === punchId && row.status === "Pending"
// // // // // // //             ? { ...row, status }
// // // // // // //             : row
// // // // // // //         )
// // // // // // //       );

// // // // // // //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");
// // // // // // //       setSelectedRows([]); // Clear selection after bulk action

// // // // // // //       // Re-fetch data to ensure consistency
// // // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // //       await fetchData(startDate, endDate);
// // // // // // //     } catch (error) {
// // // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record(s):`, error);
// // // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // // //     } finally {
// // // // // // //       setIsLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// // // // // // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);

// // // // // // //   useEffect(() => {
// // // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // // //     fetchData(startDate, endDate);
// // // // // // //   }, [selectedMonth]);

// // // // // // //   return (
// // // // // // //     <div className="otd-overtime-container">
// // // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // // //       <div className="otd-month-selector">
// // // // // // //         <span
// // // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // // //         >
// // // // // // //           Current Month
// // // // // // //         </span>
// // // // // // //         <span
// // // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // // //         >
// // // // // // //           Last Month
// // // // // // //         </span>
// // // // // // //       </div>

// // // // // // //       <div className="otd-action-buttons-container">
// // // // // // //         <button
// // // // // // //           onClick={handleSaveSelected}
// // // // // // //           className="otd-save-button"
// // // // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // // // //         >
// // // // // // //           Save Selected
// // // // // // //         </button>
// // // // // // //         <button
// // // // // // //           onClick={handleApproveSelected}
// // // // // // //           className="otd-approve-button"
// // // // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // // // //         >
// // // // // // //           Approve Selected
// // // // // // //         </button>
// // // // // // //         <button
// // // // // // //           onClick={handleRejectSelected}
// // // // // // //           className="otd-reject-button"
// // // // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // // // //         >
// // // // // // //           Reject Selected
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {isLoading ? (
// // // // // // //         <div className="otd-loading">Loading...</div>
// // // // // // //       ) : (
// // // // // // //         <div className="otd-table-container">
// // // // // // //           <table className="otd-overtime-table">
// // // // // // //             <thead>
// // // // // // //               <tr>
// // // // // // //                 <th className="otd-table-header">
// // // // // // //                   <input
// // // // // // //                     type="checkbox"
// // // // // // //                     checked={selectedRows.length === overtimeData.length && overtimeData.length > 0}
// // // // // // //                     onChange={() =>
// // // // // // //                       setSelectedRows(
// // // // // // //                         selectedRows.length === overtimeData.length
// // // // // // //                           ? []
// // // // // // //                           : overtimeData.map((row) => row.id)
// // // // // // //                       )
// // // // // // //                     }
// // // // // // //                     className="otd-checkbox"
// // // // // // //                   />
// // // // // // //                 </th>
// // // // // // //                 <th className="otd-table-header">Date</th>
// // // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // // //                 <th className="otd-table-header">Project</th>
// // // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // // //                 <th className="otd-table-header">Status</th>
// // // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // // //               </tr>
// // // // // // //             </thead>
// // // // // // //             <tbody>
// // // // // // //               {overtimeData.length > 0 ? (
// // // // // // //                 overtimeData.map((row) => (
// // // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <input
// // // // // // //                         type="checkbox"
// // // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // // //                         className="otd-checkbox"
// // // // // // //                       />
// // // // // // //                     </td>
// // // // // // //                     <td className="otd-table-cell">{row.date}</td>
// // // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <input
// // // // // // //                         type="number"
// // // // // // //                         value={row.rate}
// // // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // // //                         className="otd-input"
// // // // // // //                         min="0"
// // // // // // //                         step="0.01"
// // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // //                       />
// // // // // // //                     </td>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <input
// // // // // // //                         type="text"
// // // // // // //                         value={row.project}
// // // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // // //                         className="otd-input"
// // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // //                       />
// // // // // // //                     </td>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <input
// // // // // // //                         type="text"
// // // // // // //                         value={row.supervisor}
// // // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // // //                         className="otd-input"
// // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // //                       />
// // // // // // //                     </td>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <input
// // // // // // //                         type="text"
// // // // // // //                         value={row.comments}
// // // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // // //                         className="otd-input"
// // // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // // //                       />
// // // // // // //                     </td>
// // // // // // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // // // // // //                     <td className="otd-table-cell">
// // // // // // //                       <div className="otd-action-buttons">
// // // // // // //                         <button
// // // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // // //                           className="otd-approve"
// // // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // // //                         >
// // // // // // //                           Approve
// // // // // // //                         </button>
// // // // // // //                         <button
// // // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // // //                           className="otd-reject"
// // // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // // //                         >
// // // // // // //                           Reject
// // // // // // //                         </button>
// // // // // // //                       </div>
// // // // // // //                     </td>
// // // // // // //                   </tr>
// // // // // // //                 ))
// // // // // // //               ) : (
// // // // // // //                 <tr>
// // // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // // //                     No overtime records found.
// // // // // // //                   </td>
// // // // // // //                 </tr>
// // // // // // //               )}
// // // // // // //             </tbody>
// // // // // // //           </table>
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {alertModal.isVisible && (
// // // // // // //         <div className="otd-modal-overlay">
// // // // // // //           <div className="otd-modal-content">
// // // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // // //             <button
// // // // // // //               onClick={closeAlert}
// // // // // // //               className="otd-modal-button"
// // // // // // //             >
// // // // // // //               Close
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default OvertimeDetails;
// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import axios from "axios";
// // // // // // import "./OvertimeDetails.css";

// // // // // // const OvertimeDetails = () => {
// // // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // // //   const [alertModal, setAlertModal] = useState({
// // // // // //     isVisible: false,
// // // // // //     title: "",
// // // // // //     message: "",
// // // // // //   });

// // // // // //   const showAlert = (message, title = "Alert") => {
// // // // // //     setAlertModal({ isVisible: true, title, message });
// // // // // //   };

// // // // // //   const closeAlert = () => {
// // // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // // //   };

// // // // // //   const getDateRange = (type) => {
// // // // // //     const today = new Date();
// // // // // //     const currentMonth = today.getMonth();
// // // // // //     const currentYear = today.getFullYear();

// // // // // //     let startDate, endDate;

// // // // // //     if (type === "current") {
// // // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // // //     } else {
// // // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // // //     }

// // // // // //     return {
// // // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // // //     };
// // // // // //   };

// // // // // //   const fetchData = async (startDate, endDate) => {
// // // // // //     try {
// // // // // //       setIsLoading(true);
// // // // // //       console.log("Fetching data with startDate:", startDate, "endDate:", endDate);
// // // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // // //         headers: {
// // // // // //           "x-api-key": API_KEY,
// // // // // //           "x-employee-id": meId,
// // // // // //         },
// // // // // //         params: {
// // // // // //           startDate,
// // // // // //           endDate,
// // // // // //         },
// // // // // //       });

// // // // // //       const formattedData = response.data.map((item) => {
// // // // // //         console.log("Received item:", item);
// // // // // //         return {
// // // // // //           id: item.punch_id,
// // // // // //           date: new Date(item.work_date).toISOString().split("T")[0],
// // // // // //           name: item.employee_id,
// // // // // //           hours: parseFloat(item.extra_hours) || 0,
// // // // // //           rate: parseFloat(item.rate) || 0,
// // // // // //           project: item.project || "",
// // // // // //           supervisor: item.supervisor || "",
// // // // // //           comments: item.comments || "",
// // // // // //           status: item.status || "Pending",
// // // // // //         };
// // // // // //       });

// // // // // //       console.log("Formatted data:", formattedData);
// // // // // //       setOvertimeData(formattedData);
// // // // // //       setSelectedRows([]);
// // // // // //     } catch (error) {
// // // // // //       console.error("Failed to fetch overtime data:", error);
// // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleInputChange = (id, field, value) => {
// // // // // //     setOvertimeData((prevData) =>
// // // // // //       prevData.map((row) =>
// // // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // // //       )
// // // // // //     );
// // // // // //   };

// // // // // //   const handleCheckboxChange = (id) => {
// // // // // //     setSelectedRows((prevSelected) =>
// // // // // //       prevSelected.includes(id)
// // // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // // //         : [...prevSelected, id]
// // // // // //     );
// // // // // //   };

// // // // // //   const handleApproveSelected = async () => {
// // // // // //     if (selectedRows.length === 0) {
// // // // // //       showAlert("Please select at least one row to approve.", "Warning");
// // // // // //       return;
// // // // // //     }

// // // // // //     try {
// // // // // //       setIsLoading(true);
// // // // // //       const data = overtimeData
// // // // // //         .filter((row) => selectedRows.includes(row.id))
// // // // // //         .map((row) => ({
// // // // // //           punch_id: row.id,
// // // // // //           work_date: row.date,
// // // // // //           employee_id: row.name,
// // // // // //           extra_hours: row.hours,
// // // // // //           rate: parseFloat(row.rate) || 0,
// // // // // //           project: row.project || "",
// // // // // //           supervisor: row.supervisor || "",
// // // // // //           comments: row.comments || "",
// // // // // //           status: "Approved",
// // // // // //         }));

// // // // // //       console.log("Approving selected rows:", data);
// // // // // //       await axios.post(
// // // // // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`,
// // // // // //         { data },
// // // // // //         {
// // // // // //           headers: {
// // // // // //             "x-api-key": API_KEY,
// // // // // //             "x-employee-id": meId,
// // // // // //           },
// // // // // //         }
// // // // // //       );

// // // // // //       setOvertimeData((prevData) =>
// // // // // //         prevData.map((row) =>
// // // // // //           selectedRows.includes(row.id) ? { ...row, status: "Approved" } : row
// // // // // //         )
// // // // // //       );

// // // // // //       showAlert("Selected rows approved successfully", "Success");
// // // // // //       setSelectedRows([]);
// // // // // //     } catch (error) {
// // // // // //       console.error("Failed to approve overtime data:", error);
// // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleStatusChange = async (punchId, status, isBulk = false) => {
// // // // // //     try {
// // // // // //       setIsLoading(true);
// // // // // //       const endpoint = status === "Approved" 
// // // // // //         ? (isBulk ? "/api/compensation/overtime/approve-bulk" : "/api/compensation/overtime/approve")
// // // // // //         : (isBulk ? "/api/compensation/overtime/reject-bulk" : "/api/compensation/overtime/reject");
// // // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // // //       console.log(`Sending request to: ${fullUrl}`);

// // // // // //       let payload;
// // // // // //       if (isBulk) {
// // // // // //         const selectedData = overtimeData
// // // // // //           .filter((row) => selectedRows.includes(row.id))
// // // // // //           .filter((row) => row.status === "Pending")
// // // // // //           .map((row) => ({
// // // // // //             punch_id: row.id,
// // // // // //             work_date: row.date,
// // // // // //             employee_id: row.name,
// // // // // //             extra_hours: row.hours,
// // // // // //             rate: parseFloat(row.rate) || 0,
// // // // // //             project: row.project || "",
// // // // // //             supervisor: row.supervisor || "",
// // // // // //             comments: row.comments || "",
// // // // // //             status: status,
// // // // // //           }));

// // // // // //         if (selectedData.length === 0) {
// // // // // //           throw new Error("No pending rows selected for approval/rejection.");
// // // // // //         }

// // // // // //         payload = { data: selectedData };
// // // // // //         console.log("Bulk status change payload:", payload);
// // // // // //       } else {
// // // // // //         const row = overtimeData.find((row) => row.id === punchId);
// // // // // //         if (!row) {
// // // // // //           throw new Error("Row not found for punchId: " + punchId);
// // // // // //         }
// // // // // //         if (row.status !== "Pending") {
// // // // // //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// // // // // //         }

// // // // // //         payload = {
// // // // // //           punch_id: row.id,
// // // // // //           work_date: row.date,
// // // // // //           employee_id: row.name,
// // // // // //           extra_hours: row.hours,
// // // // // //           rate: parseFloat(row.rate) || 0,
// // // // // //           project: row.project || "",
// // // // // //           supervisor: row.supervisor || "",
// // // // // //           comments: row.comments || "",
// // // // // //           status: status,
// // // // // //         };
// // // // // //         console.log("Single row status change payload:", payload);
// // // // // //       }

// // // // // //       await axios.post(
// // // // // //         fullUrl,
// // // // // //         payload,
// // // // // //         {
// // // // // //           headers: {
// // // // // //             "x-api-key": API_KEY,
// // // // // //             "x-employee-id": meId,
// // // // // //           },
// // // // // //         }
// // // // // //       );

// // // // // //       setOvertimeData((prevData) =>
// // // // // //         prevData.map((row) =>
// // // // // //           isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // // // // //             ? { ...row, status }
// // // // // //             : row.id === punchId && row.status === "Pending"
// // // // // //             ? { ...row, status }
// // // // // //             : row
// // // // // //         )
// // // // // //       );

// // // // // //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");
// // // // // //       setSelectedRows([]);

// // // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // //       await fetchData(startDate, endDate);
// // // // // //     } catch (error) {
// // // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record(s):`, error);
// // // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);

// // // // // //   useEffect(() => {
// // // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // // //     fetchData(startDate, endDate);
// // // // // //   }, [selectedMonth]);

// // // // // //   return (
// // // // // //     <div className="otd-overtime-container">
// // // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // // //       <div className="otd-month-selector">
// // // // // //         <span
// // // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // // //           onClick={() => setSelectedMonth("current")}
// // // // // //         >
// // // // // //           Current Month
// // // // // //         </span>
// // // // // //         <span
// // // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // // //           onClick={() => setSelectedMonth("last")}
// // // // // //         >
// // // // // //           Last Month
// // // // // //         </span>
// // // // // //       </div>

// // // // // //       <div className="otd-action-buttons-container">
// // // // // //         <button
// // // // // //           onClick={handleApproveSelected}
// // // // // //           className="otd-approve-button"
// // // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // // //         >
// // // // // //           Approve All
// // // // // //         </button>
// // // // // //         <button
// // // // // //           onClick={handleRejectSelected}
// // // // // //           className="otd-reject-button"
// // // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // // //         >
// // // // // //           Reject All
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {isLoading ? (
// // // // // //         <div className="otd-loading">Loading...</div>
// // // // // //       ) : (
// // // // // //         <div className="otd-table-container">
// // // // // //           <table className="otd-overtime-table">
// // // // // //             <thead>
// // // // // //               <tr>
// // // // // //                 <th className="otd-table-header"></th>
// // // // // //                 <th className="otd-table-header">Date</th>
// // // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // // //                 <th className="otd-table-header">Rate</th>
// // // // // //                 <th className="otd-table-header">Project</th>
// // // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // // //                 <th className="otd-table-header">Comments</th>
// // // // // //                 <th className="otd-table-header">Status</th>
// // // // // //                 <th className="otd-table-header">Actions</th>
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody>
// // // // // //               {overtimeData.length > 0 ? (
// // // // // //                 overtimeData.map((row) => (
// // // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <input
// // // // // //                         type="checkbox"
// // // // // //                         checked={selectedRows.includes(row.id)}
// // // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // // //                         className="otd-checkbox"
// // // // // //                       />
// // // // // //                     </td>
// // // // // //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// // // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <input
// // // // // //                         type="number"
// // // // // //                         value={row.rate}
// // // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // // //                         className="otd-input"
// // // // // //                         min="0"
// // // // // //                         step="0.01"
// // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // //                       />
// // // // // //                     </td>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <input
// // // // // //                         type="text"
// // // // // //                         value={row.project}
// // // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // // //                         className="otd-input"
// // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // //                       />
// // // // // //                     </td>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <input
// // // // // //                         type="text"
// // // // // //                         value={row.supervisor}
// // // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // // //                         className="otd-input"
// // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // //                       />
// // // // // //                     </td>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <input
// // // // // //                         type="text"
// // // // // //                         value={row.comments}
// // // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // // //                         className="otd-input"
// // // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // // //                       />
// // // // // //                     </td>
// // // // // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // // // // //                     <td className="otd-table-cell">
// // // // // //                       <div className="otd-action-buttons">
// // // // // //                         <button
// // // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // // //                           className="otd-approve"
// // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // //                         >
// // // // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // // // //                             <path
// // // // // //                               fill="currentColor"
// // // // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// // // // // //                             />
// // // // // //                           </svg>
// // // // // //                         </button>
// // // // // //                         <button
// // // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // // //                           className="otd-reject"
// // // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // // //                         >
// // // // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // // // //                             <path
// // // // // //                               fill="currentColor"
// // // // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// // // // // //                             />
// // // // // //                           </svg>
// // // // // //                         </button>
// // // // // //                       </div>
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ))
// // // // // //               ) : (
// // // // // //                 <tr>
// // // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // // //                     No overtime records found.
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {alertModal.isVisible && (
// // // // // //         <div className="otd-modal-overlay">
// // // // // //           <div className="otd-modal-content">
// // // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // // //             <button
// // // // // //               onClick={closeAlert}
// // // // // //               className="otd-modal-button"
// // // // // //             >
// // // // // //               Close
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default OvertimeDetails;
// // // // // import React, { useEffect, useState } from "react";
// // // // // import axios from "axios";
// // // // // import "./OvertimeDetails.css";

// // // // // const OvertimeDetails = () => {
// // // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // // //   const [alertModal, setAlertModal] = useState({
// // // // //     isVisible: false,
// // // // //     title: "",
// // // // //     message: "",
// // // // //   });

// // // // //   const showAlert = (message, title = "Alert") => {
// // // // //     setAlertModal({ isVisible: true, title, message });
// // // // //   };

// // // // //   const closeAlert = () => {
// // // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // // //   };

// // // // //   const getDateRange = (type) => {
// // // // //     const today = new Date();
// // // // //     const currentMonth = today.getMonth();
// // // // //     const currentYear = today.getFullYear();

// // // // //     let startDate, endDate;

// // // // //     if (type === "current") {
// // // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // // //     } else {
// // // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // // //     }

// // // // //     return {
// // // // //       startDate: startDate.toISOString().split("T")[0],
// // // // //       endDate: endDate.toISOString().split("T")[0],
// // // // //     };
// // // // //   };

// // // // //   const fetchData = async (startDate, endDate) => {
// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       console.log("Fetching data with startDate:", startDate, "endDate:", endDate);
// // // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // // //         headers: {
// // // // //           "x-api-key": API_KEY,
// // // // //           "x-employee-id": meId,
// // // // //         },
// // // // //         params: {
// // // // //           startDate,
// // // // //           endDate,
// // // // //         },
// // // // //       });

// // // // //       const formattedData = response.data.map((item) => {
// // // // //         console.log("Received item:", item);
// // // // //         return {
// // // // //           id: item.punch_id,
// // // // //           date: new Date(item.work_date).toISOString().split("T")[0],
// // // // //           name: item.employee_id,
// // // // //           hours: parseFloat(item.extra_hours) || 0,
// // // // //           rate: parseFloat(item.rate) || 0,
// // // // //           project: item.project || "",
// // // // //           supervisor: item.supervisor || "",
// // // // //           comments: item.comments || "",
// // // // //           status: item.status || "Pending",
// // // // //         };
// // // // //       });

// // // // //       console.log("Formatted data:", formattedData);
// // // // //       setOvertimeData(formattedData);
// // // // //       setSelectedRows([]);
// // // // //     } catch (error) {
// // // // //       console.error("Failed to fetch overtime data:", error);
// // // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleInputChange = (id, field, value) => {
// // // // //     setOvertimeData((prevData) =>
// // // // //       prevData.map((row) =>
// // // // //         row.id === id ? { ...row, [field]: value } : row
// // // // //       )
// // // // //     );
// // // // //   };

// // // // //   const handleCheckboxChange = (id) => {
// // // // //     setSelectedRows((prevSelected) =>
// // // // //       prevSelected.includes(id)
// // // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // // //         : [...prevSelected, id]
// // // // //     );
// // // // //   };

// // // // //   const handleStatusChange = async (punchId, status, isBulk = false) => {
// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       const endpoint = isBulk ? "/api/compensation/overtime-bulk" : `/api/compensation/overtime/${status.toLowerCase()}`;
// // // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // // //       console.log(`Sending request to: ${fullUrl}`);

// // // // //       let payload;
// // // // //       if (isBulk) {
// // // // //         const selectedData = overtimeData
// // // // //           .filter((row) => selectedRows.includes(row.id))
// // // // //           .filter((row) => row.status === "Pending")
// // // // //           .map((row) => ({
// // // // //             punch_id: row.id,
// // // // //             work_date: row.date,
// // // // //             employee_id: row.name,
// // // // //             extra_hours: row.hours,
// // // // //             rate: parseFloat(row.rate) || 0,
// // // // //             project: row.project || "",
// // // // //             supervisor: row.supervisor || "",
// // // // //             comments: row.comments || "",
// // // // //             status: status,
// // // // //           }));

// // // // //         if (selectedData.length === 0) {
// // // // //           throw new Error("No pending rows selected for approval/rejection.");
// // // // //         }

// // // // //         payload = { data: selectedData };
// // // // //         console.log("Bulk status change payload:", payload);
// // // // //       } else {
// // // // //         const row = overtimeData.find((row) => row.id === punchId);
// // // // //         if (!row) {
// // // // //           throw new Error("Row not found for punchId: " + punchId);
// // // // //         }
// // // // //         if (row.status !== "Pending") {
// // // // //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// // // // //         }

// // // // //         payload = {
// // // // //           punch_id: row.id,
// // // // //           work_date: row.date,
// // // // //           employee_id: row.name,
// // // // //           extra_hours: row.hours,
// // // // //           rate: parseFloat(row.rate) || 0,
// // // // //           project: row.project || "",
// // // // //           supervisor: row.supervisor || "",
// // // // //           comments: row.comments || "",
// // // // //           status: status,
// // // // //         };
// // // // //         console.log("Single row status change payload:", payload);
// // // // //       }

// // // // //       await axios.post(
// // // // //         fullUrl,
// // // // //         payload,
// // // // //         {
// // // // //           headers: {
// // // // //             "x-api-key": API_KEY,
// // // // //             "x-employee-id": meId,
// // // // //             "Content-Type": "application/json",
// // // // //           },
// // // // //         }
// // // // //       );

// // // // //       setOvertimeData((prevData) =>
// // // // //         prevData.map((row) =>
// // // // //           isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // // // //             ? { ...row, status }
// // // // //             : row.id === punchId && row.status === "Pending"
// // // // //             ? { ...row, status }
// // // // //             : row
// // // // //         )
// // // // //       );

// // // // //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");
// // // // //       setSelectedRows([]);

// // // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // // //       await fetchData(startDate, endDate);
// // // // //     } catch (error) {
// // // // //       console.error(`Failed to ${status.toLowerCase()} overtime record(s):`, {
// // // // //         message: error.message,
// // // // //         response: error.response?.data,
// // // // //         status: error.response?.status,
// // // // //         request: error.request,
// // // // //       });
// // // // //       showAlert(
// // // // //         error.response?.data?.error || error.message || "Network error",
// // // // //         "Error"
// // // // //       );
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// // // // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);

// // // // //   useEffect(() => {
// // // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // // //     fetchData(startDate, endDate);
// // // // //   }, [selectedMonth]);

// // // // //   return (
// // // // //     <div className="otd-overtime-container">
// // // // //       <h2 className="otd-title">Overtime Details</h2>

// // // // //       <div className="otd-month-selector">
// // // // //         <span
// // // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // // //           onClick={() => setSelectedMonth("current")}
// // // // //         >
// // // // //           Current Month
// // // // //         </span>
// // // // //         <span
// // // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // // //           onClick={() => setSelectedMonth("last")}
// // // // //         >
// // // // //           Last Month
// // // // //         </span>
// // // // //       </div>

// // // // //       <div className="otd-action-buttons-container">
// // // // //         <button
// // // // //           onClick={handleApproveSelected}
// // // // //           className="otd-approve-button"
// // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // //         >
// // // // //           Approve All
// // // // //         </button>
// // // // //         <button
// // // // //           onClick={handleRejectSelected}
// // // // //           className="otd-reject-button"
// // // // //           disabled={selectedRows.length === 0 || isLoading}
// // // // //         >
// // // // //           Reject All
// // // // //         </button>
// // // // //       </div>

// // // // //       {isLoading ? (
// // // // //         <div className="otd-loading">Loading...</div>
// // // // //       ) : (
// // // // //         <div className="otd-table-container">
// // // // //           <table className="otd-overtime-table">
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 <th className="otd-table-header"></th>
// // // // //                 <th className="otd-table-header">Date</th>
// // // // //                 <th className="otd-table-header">Employee ID</th>
// // // // //                 <th className="otd-table-header">Extra Hours</th>
// // // // //                 <th className="otd-table-header">Rate</th>
// // // // //                 <th className="otd-table-header">Project</th>
// // // // //                 <th className="otd-table-header">Supervisor</th>
// // // // //                 <th className="otd-table-header">Comments</th>
// // // // //                 <th className="otd-table-header">Status</th>
// // // // //                 <th className="otd-table-header">Actions</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {overtimeData.length > 0 ? (
// // // // //                 overtimeData.map((row) => (
// // // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <input
// // // // //                         type="checkbox"
// // // // //                         checked={selectedRows.includes(row.id)}
// // // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // // //                         className="otd-checkbox"
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// // // // //                     <td className="otd-table-cell">{row.name}</td>
// // // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <input
// // // // //                         type="number"
// // // // //                         value={row.rate}
// // // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // // //                         className="otd-input"
// // // // //                         min="0"
// // // // //                         step="0.01"
// // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <input
// // // // //                         type="text"
// // // // //                         value={row.project}
// // // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // // //                         className="otd-input"
// // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <input
// // // // //                         type="text"
// // // // //                         value={row.supervisor}
// // // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // // //                         className="otd-input"
// // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <input
// // // // //                         type="text"
// // // // //                         value={row.comments}
// // // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // // //                         className="otd-input"
// // // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // // // //                     <td className="otd-table-cell">
// // // // //                       <div className="otd-action-buttons">
// // // // //                         <button
// // // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // // //                           className="otd-approve"
// // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // //                         >
// // // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // // //                             <path
// // // // //                               fill="currentColor"
// // // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// // // // //                             />
// // // // //                           </svg>
// // // // //                         </button>
// // // // //                         <button
// // // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // // //                           className="otd-reject"
// // // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // // //                         >
// // // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // // //                             <path
// // // // //                               fill="currentColor"
// // // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// // // // //                             />
// // // // //                           </svg>
// // // // //                         </button>
// // // // //                       </div>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <tr>
// // // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // // //                     No overtime records found.
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       )}

// // // // //       {alertModal.isVisible && (
// // // // //         <div className="otd-modal-overlay">
// // // // //           <div className="otd-modal-content">
// // // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // // //             <button
// // // // //               onClick={closeAlert}
// // // // //               className="otd-modal-button"
// // // // //             >
// // // // //               Close
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default OvertimeDetails;
// // // // import React, { useEffect, useState } from "react";
// // // // import axios from "axios";
// // // // import "./OvertimeDetails.css";

// // // // const OvertimeDetails = () => {
// // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [selectedRows, setSelectedRows] = useState([]);

// // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // //   const [alertModal, setAlertModal] = useState({
// // // //     isVisible: false,
// // // //     title: "",
// // // //     message: "",
// // // //   });

// // // //   const showAlert = (message, title = "Alert") => {
// // // //     setAlertModal({ isVisible: true, title, message });
// // // //   };

// // // //   const closeAlert = () => {
// // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // //   };

// // // //   const getDateRange = (type) => {
// // // //     const today = new Date();
// // // //     const currentMonth = today.getMonth();
// // // //     const currentYear = today.getFullYear();

// // // //     let startDate, endDate;

// // // //     if (type === "current") {
// // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // //     } else {
// // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // //     }

// // // //     return {
// // // //       startDate: startDate.toISOString().split("T")[0],
// // // //       endDate: endDate.toISOString().split("T")[0],
// // // //     };
// // // //   };

// // // //   const fetchData = async (startDate, endDate) => {
// // // //     try {
// // // //       setIsLoading(true);
// // // //       console.log("Fetching data with startDate:", startDate, "endDate:", endDate);

// // // //       const [overtimeResponse, assignedResponse] = await Promise.all([
// // // //         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`, {
// // // //           headers: {
// // // //             "x-api-key": API_KEY,
// // // //             "x-employee-id": meId,
// // // //           },
// // // //           params: {
// // // //             startDate,
// // // //             endDate,
// // // //           },
// // // //         }),
// // // //         axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`, {
// // // //           headers: {
// // // //             "x-api-key": API_KEY,
// // // //             "x-employee-id": meId,
// // // //           },
// // // //         }),
// // // //       ]);

// // // //       const assignedPlans = assignedResponse.data.data.reduce((acc, item) => {
// // // //         acc[item.employee_id] = item.plan_data.overtimePayAmount;
// // // //         return acc;
// // // //       }, {});

// // // //       const formattedData = overtimeResponse.data.map((item) => {
// // // //         console.log("Received item:", item);
// // // //         return {
// // // //           id: item.punch_id,
// // // //           date: new Date(item.work_date).toISOString().split("T")[0],
// // // //           name: item.employee_id,
// // // //           hours: parseFloat(item.extra_hours) || 0,
// // // //           rate: parseFloat(assignedPlans[item.employee_id] || item.rate || 0),
// // // //           project: item.project || "",
// // // //           supervisor: item.supervisor || "",
// // // //           comments: item.comments || "",
// // // //           status: item.status || "Pending",
// // // //         };
// // // //       });

// // // //       console.log("Formatted data:", formattedData);
// // // //       setOvertimeData(formattedData);
// // // //       setSelectedRows([]);
// // // //     } catch (error) {
// // // //       console.error("Failed to fetch data:", {
// // // //         message: error.message,
// // // //         response: error.response?.data,
// // // //         status: error.response?.status,
// // // //         request: error.request,
// // // //       });
// // // //       showAlert(error.response?.data?.error || error.message || "Network error", "Error");
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   const handleInputChange = (id, field, value) => {
// // // //     setOvertimeData((prevData) =>
// // // //       prevData.map((row) =>
// // // //         row.id === id ? { ...row, [field]: value } : row
// // // //       )
// // // //     );
// // // //   };

// // // //   const handleCheckboxChange = (id) => {
// // // //     setSelectedRows((prevSelected) =>
// // // //       prevSelected.includes(id)
// // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // //         : [...prevSelected, id]
// // // //     );
// // // //   };

// // // //   const handleStatusChange = async (punchId, status, isBulk = false) => {
// // // //   try {
// // // //     setIsLoading(true);
// // // //     const endpoint = status === "Approved" 
// // // //       ? (isBulk ? "/api/compensation/overtime/approve-bulk" : "/api/compensation/overtime/approve")
// // // //       : (isBulk ? "/api/compensation/overtime/reject-bulk" : "/api/compensation/overtime/reject");
// // // //     const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`;
// // // //     console.log(`Sending request to: ${fullUrl}`);

// // // //     let payload;
// // // //     if (isBulk) {
// // // //       const selectedData = overtimeData
// // // //         .filter((row) => selectedRows.includes(row.id))
// // // //         .filter((row) => row.status === "Pending")
// // // //         .map((row) => ({
// // // //           punch_id: row.id,
// // // //           work_date: row.date,
// // // //           employee_id: row.name,
// // // //           extra_hours: row.hours,
// // // //           rate: parseFloat(row.rate) || 0,
// // // //           project: row.project || "",
// // // //           supervisor: row.supervisor || "",
// // // //           comments: row.comments || "",
// // // //           status: status,
// // // //         }));

// // // //       if (selectedData.length === 0) {
// // // //         throw new Error("No pending rows selected for approval/rejection.");
// // // //       }

// // // //       payload = { data: selectedData };
// // // //       console.log("Bulk status change payload:", payload);
// // // //     } else {
// // // //       const row = overtimeData.find((row) => row.id === punchId);
// // // //       if (!row) {
// // // //         throw new Error("Row not found for punchId: " + punchId);
// // // //       }
// // // //       if (row.status !== "Pending") {
// // // //         throw new Error(`Cannot change status of row with status: ${row.status}`);
// // // //       }

// // // //       payload = {
// // // //         punch_id: row.id,
// // // //         work_date: row.date,
// // // //         employee_id: row.name,
// // // //         extra_hours: row.hours,
// // // //         rate: parseFloat(row.rate) || 0,
// // // //         project: row.project || "",
// // // //         supervisor: row.supervisor || "",
// // // //         comments: row.comments || "",
// // // //         status: status,
// // // //       };
// // // //       console.log("Single row status change payload:", payload);
// // // //     }

// // // //     await axios.post(
// // // //       fullUrl,
// // // //       payload,
// // // //       {
// // // //         headers: {
// // // //           "x-api-key": API_KEY,
// // // //           "x-employee-id": meId,
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //       }
// // // //     );

// // // //     setOvertimeData((prevData) =>
// // // //       prevData.map((row) =>
// // // //         isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // // //           ? { ...row, status }
// // // //           : row.id === punchId && row.status === "Pending"
// // // //           ? { ...row, status }
// // // //           : row
// // // //       )
// // // //     );

// // // //     showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");
// // // //     setSelectedRows([]);

// // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // //     await fetchData(startDate, endDate);
// // // //   } catch (error) {
// // // //     console.error(`Failed to ${status.toLowerCase()} overtime record(s):`, {
// // // //       message: error.message,
// // // //       response: error.response?.data,
// // // //       status: error.response?.status,
// // // //       request: error.request,
// // // //     });
// // // //     showAlert(
// // // //       error.response?.data?.error || error.message || "Network error",
// // // //       "Error"
// // // //     );
// // // //   } finally {
// // // //     setIsLoading(false);
// // // //   }
// // // // };

// // // //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// // // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);

// // // //   useEffect(() => {
// // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // //     fetchData(startDate, endDate);
// // // //   }, [selectedMonth]);

// // // //   return (
// // // //     <div className="otd-overtime-container">
// // // //       <h2 className="otd-title">Overtime Details</h2>

// // // //       <div className="otd-month-selector">
// // // //         <span
// // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // //           onClick={() => setSelectedMonth("current")}
// // // //         >
// // // //           Current Month
// // // //         </span>
// // // //         <span
// // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // //           onClick={() => setSelectedMonth("last")}
// // // //         >
// // // //           Last Month
// // // //         </span>
// // // //       </div>

// // // //       <div className="otd-action-buttons-container">
// // // //         <button
// // // //           onClick={handleApproveSelected}
// // // //           className="otd-approve-button"
// // // //           disabled={selectedRows.length === 0 || isLoading}
// // // //         >
// // // //           Approve All
// // // //         </button>
// // // //         <button
// // // //           onClick={handleRejectSelected}
// // // //           className="otd-reject-button"
// // // //           disabled={selectedRows.length === 0 || isLoading}
// // // //         >
// // // //           Reject All
// // // //         </button>
// // // //       </div>

// // // //       {isLoading ? (
// // // //         <div className="otd-loading">Loading...</div>
// // // //       ) : (
// // // //         <div className="otd-table-container">
// // // //           <table className="otd-overtime-table">
// // // //             <thead>
// // // //               <tr>
// // // //                 <th className="otd-table-header"></th>
// // // //                 <th className="otd-table-header">Date</th>
// // // //                 <th className="otd-table-header">Employee ID</th>
// // // //                 <th className="otd-table-header">Extra Hours</th>
// // // //                 <th className="otd-table-header">Rate</th>
// // // //                 <th className="otd-table-header">Project</th>
// // // //                 <th className="otd-table-header">Supervisor</th>
// // // //                 <th className="otd-table-header">Comments</th>
// // // //                 <th className="otd-table-header">Status</th>
// // // //                 <th className="otd-table-header">Actions</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {overtimeData.length > 0 ? (
// // // //                 overtimeData.map((row) => (
// // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="checkbox"
// // // //                         checked={selectedRows.includes(row.id)}
// // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // //                         className="otd-checkbox"
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// // // //                     <td className="otd-table-cell">{row.name}</td>
// // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // //                     <td className="otd-table-cell">{row.rate}</td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.project}
// // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.supervisor}
// // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.comments}
// // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // // //                     <td className="otd-table-cell">
// // // //                       <div className="otd-action-buttons">
// // // //                         <button
// // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // //                           className="otd-approve"
// // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // //                         >
// // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // //                             <path
// // // //                               fill="currentColor"
// // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// // // //                             />
// // // //                           </svg>
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // //                           className="otd-reject"
// // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // //                         >
// // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // //                             <path
// // // //                               fill="currentColor"
// // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// // // //                             />
// // // //                           </svg>
// // // //                         </button>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))
// // // //               ) : (
// // // //                 <tr>
// // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // //                     No overtime records found.
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       )}

// // // //       {alertModal.isVisible && (
// // // //         <div className="otd-modal-overlay">
// // // //           <div className="otd-modal-content">
// // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // //             <button
// // // //               onClick={closeAlert}
// // // //               className="otd-modal-button"
// // // //             >
// // // //               Close
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default OvertimeDetails;

// // // // import React, { useEffect, useState } from "react";
// // // // import axios from "axios";
// // // // import "./OvertimeDetails.css";

// // // // const OvertimeDetails = () => {
// // // //   const [overtimeData, setOvertimeData] = useState([]);
// // // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [selectedRows, setSelectedRows] = useState([]);
// // // //   const [selectAll, setSelectAll] = useState(false);

// // // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // // //   const [alertModal, setAlertModal] = useState({
// // // //     isVisible: false,
// // // //     title: "",
// // // //     message: "",
// // // //   });

// // // //   const showAlert = (message, title = "Alert") => {
// // // //     setAlertModal({ isVisible: true, title, message });
// // // //   };

// // // //   const closeAlert = () => {
// // // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // // //   };

// // // //   const getDateRange = (type) => {
// // // //     const today = new Date();
// // // //     const currentMonth = today.getMonth();
// // // //     const currentYear = today.getFullYear();

// // // //     let startDate, endDate;

// // // //     if (type === "current") {
// // // //       startDate = new Date(currentYear, currentMonth - 1, 25);
// // // //       endDate = new Date(currentYear, currentMonth, 25);
// // // //     } else {
// // // //       startDate = new Date(currentYear, currentMonth - 2, 25);
// // // //       endDate = new Date(currentYear, currentMonth - 1, 25);
// // // //     }

// // // //     return {
// // // //       startDate: startDate.toISOString().split("T")[0],
// // // //       endDate: endDate.toISOString().split("T")[0],
// // // //     };
// // // //   };

// // // //   const fetchData = async (startDate, endDate) => {
// // // //   try {
// // // //     setIsLoading(true);
// // // //     const response = await axios.get(
// // // //       `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// // // //       {
// // // //         headers: {
// // // //           "x-api-key": API_KEY,
// // // //           "x-employee-id": meId,
// // // //         },
// // // //         params: {
// // // //           startDate,
// // // //           endDate,
// // // //         },
// // // //       }
// // // //     );

// // // //     // Ensure response.data.data is an array
// // // //     const data = Array.isArray(response.data.data) ? response.data.data : [];

// // // //     // Remove duplicates based on punch_id (if duplicates are not expected)
// // // //     const uniqueData = Array.from(
// // // //       new Map(data.map((item) => [item.punch_id, item])).values()
// // // //     );

// // // //     const formattedData = uniqueData.map((item) => ({
// // // //       id: item.punch_id,
// // // //       date: new Date(item.work_date).toISOString().split("T")[0],
// // // //       name: item.employee_id,
// // // //       hours: parseFloat(item.extra_hours) || 0,
// // // //       rate: parseFloat(item.rate) || 0, // Default to 0 if null
// // // //       project: item.project || "", // Default to empty string if null
// // // //       supervisor: item.supervisor || "", // Default to empty string if null
// // // //       comments: item.comments || "", // Default to empty string if null
// // // //       status: item.status || "Pending",
// // // //     }));

// // // //     setOvertimeData(formattedData);
// // // //     setSelectedRows([]);
// // // //     setSelectAll(false);
// // // //   } catch (error) {
// // // //     showAlert(
// // // //       error.response?.data?.error || error.message || "Network error",
// // // //       "Error"
// // // //     );
// // // //   } finally {
// // // //     setIsLoading(false);
// // // //   }
// // // // };

// // // //   const handleInputChange = (id, field, value) => {
// // // //     setOvertimeData((prevData) =>
// // // //       prevData.map((row) =>
// // // //         row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
// // // //       )
// // // //     );
// // // //   };

// // // //   const handleCheckboxChange = (id) => {
// // // //     setSelectedRows((prevSelected) => {
// // // //       const newSelected = prevSelected.includes(id)
// // // //         ? prevSelected.filter((rowId) => rowId !== id)
// // // //         : [...prevSelected, id];
// // // //       const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// // // //       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
// // // //       setSelectAll(allPendingSelected);
// // // //       return newSelected;
// // // //     });
// // // //   };

// // // //   const handleSelectAllChange = () => {
// // // //     if (selectAll) {
// // // //       setSelectedRows([]);
// // // //       setSelectAll(false);
// // // //     } else {
// // // //       const pendingRowIds = overtimeData
// // // //         .filter((row) => row.status === "Pending")
// // // //         .map((row) => row.id);
// // // //       setSelectedRows(pendingRowIds);
// // // //       setSelectAll(true);
// // // //     }
// // // //   };

// // // //   const handleStatusChange = async (punchId, status, isBulk = false) => {
// // // //     try {
// // // //       setIsLoading(true);
// // // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

// // // //       let payload;
// // // //       if (isBulk) {
// // // //         const selectedData = overtimeData
// // // //           .filter((row) => selectedRows.includes(row.id))
// // // //           .filter((row) => row.status === "Pending")
// // // //           .map((row) => ({
// // // //             punch_id: row.id,
// // // //             work_date: row.date,
// // // //             employee_id: row.name,
// // // //             extra_hours: row.hours,
// // // //             rate: parseFloat(row.rate) || 0,
// // // //             project: row.project || "",
// // // //             supervisor: row.supervisor || "",
// // // //             comments: row.comments || "",
// // // //             status: status,
// // // //           }));

// // // //         if (selectedData.length === 0) {
// // // //           throw new Error("No pending rows selected for approval/rejection.");
// // // //         }

// // // //         payload = { data: selectedData };
// // // //       } else {
// // // //         const row = overtimeData.find((row) => row.id === punchId);
// // // //         if (!row) {
// // // //           throw new Error("Row not found for punchId: " + punchId);
// // // //         }
// // // //         if (row.status !== "Pending") {
// // // //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// // // //         }

// // // //         payload = {
// // // //           data: [{
// // // //             punch_id: row.id,
// // // //             work_date: row.date,
// // // //             employee_id: row.name,
// // // //             extra_hours: row.hours,
// // // //             rate: parseFloat(row.rate) || 0,
// // // //             project: row.project || "",
// // // //             supervisor: row.supervisor || "",
// // // //             comments: row.comments || "",
// // // //             status: status,
// // // //           }]
// // // //         };
// // // //       }

// // // //       await axios.post(
// // // //         fullUrl,
// // // //         payload,
// // // //         {
// // // //           headers: {
// // // //             "x-api-key": API_KEY,
// // // //             "x-employee-id": meId,
// // // //             "Content-Type": "application/json",
// // // //           },
// // // //         }
// // // //       );

// // // //       setOvertimeData((prevData) =>
// // // //         prevData.map((row) =>
// // // //           isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // // //             ? { ...row, status }
// // // //             : row.id === punchId && row.status === "Pending"
// // // //             ? { ...row, status }
// // // //             : row
// // // //         )
// // // //       );

// // // //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");
// // // //       setSelectedRows([]);
// // // //       setSelectAll(false);

// // // //       const { startDate, endDate } = getDateRange(selectedMonth);
// // // //       await fetchData(startDate, endDate);
// // // //     } catch (error) {
// // // //       showAlert(
// // // //         error.response?.data?.error || error.response?.data?.message || error.message || "Network error",
// // // //         "Error"
// // // //       );
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// // // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);

// // // //   useEffect(() => {
// // // //     const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// // // //     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
// // // //     setSelectAll(allPendingSelected);
// // // //   }, [overtimeData, selectedRows]);

// // // //   useEffect(() => {
// // // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // // //     fetchData(startDate, endDate);
// // // //   }, [selectedMonth]);

// // // //   return (
// // // //     <div className="otd-overtime-container">
// // // //       <h2 className="otd-title">Overtime Details</h2>
// // // //       <div className="otd-month-selector">
// // // //         <span
// // // //           className={`otd-month-option ${selectedMonth === "current" ? "otd-active" : ""}`}
// // // //           onClick={() => setSelectedMonth("current")}
// // // //         >
// // // //           Current Month
// // // //         </span>
// // // //         <span
// // // //           className={`otd-month-option ${selectedMonth === "last" ? "otd-active" : ""}`}
// // // //           onClick={() => setSelectedMonth("last")}
// // // //         >
// // // //           Last Month
// // // //         </span>
// // // //       </div>
// // // //       <div className="otd-action-buttons-container">
// // // //         <button
// // // //           onClick={handleApproveSelected}
// // // //           className="otd-approve-button"
// // // //           disabled={selectedRows.length === 0 || isLoading}
// // // //         >
// // // //           Approve All
// // // //         </button>
// // // //         <button
// // // //           onClick={handleRejectSelected}
// // // //           className="otd-reject-button"
// // // //           disabled={selectedRows.length === 0 || isLoading}
// // // //         >
// // // //           Reject All
// // // //         </button>
// // // //       </div>
// // // //       {isLoading ? (
// // // //         <div className="otd-loading">Loading...</div>
// // // //       ) : (
// // // //         <div className="otd-table-container">
// // // //           <table className="otd-overtime-table">
// // // //             <thead>
// // // //               <tr>
// // // //                 <th className="otd-table-header">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={selectAll}
// // // //                     onChange={handleSelectAllChange}
// // // //                     className="otd-checkbox"
// // // //                     disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
// // // //                   />
// // // //                 </th>
// // // //                 <th className="otd-table-header">Date</th>
// // // //                 <th className="otd-table-header">Employee ID</th>
// // // //                 <th className="otd-table-header">Extra Hours</th>
// // // //                 <th className="otd-table-header">Rate</th>
// // // //                 <th className="otd-table-header">Project</th>
// // // //                 <th className="otd-table-header">Supervisor</th>
// // // //                 <th className="otd-table-header">Comments</th>
// // // //                 <th className="otd-table-header">Status</th>
// // // //                 <th className="otd-table-header">Actions</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {overtimeData.length > 0 ? (
// // // //                 overtimeData.map((row) => (
// // // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="checkbox"
// // // //                         checked={selectedRows.includes(row.id)}
// // // //                         onChange={() => handleCheckboxChange(row.id)}
// // // //                         className="otd-checkbox"
// // // //                         disabled={row.status !== "Pending"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// // // //                     <td className="otd-table-cell">{row.name}</td>
// // // //                     <td className="otd-table-cell">{row.hours}</td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="number"
// // // //                         value={row.rate}
// // // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // // //                         className="otd-input"
// // // //                         min="0"
// // // //                         step="0.01"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.project}
// // // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.supervisor}
// // // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className="otd-table-cell">
// // // //                       <input
// // // //                         type="text"
// // // //                         value={row.comments}
// // // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // // //                         className="otd-input"
// // // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // // //                       />
// // // //                     </td>
// // // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // // //                     <td className="otd-table-cell">
// // // //                       <div className="otd-action-buttons">
// // // //                         <button
// // // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // // //                           className="otd-approve"
// // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // //                         >
// // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // //                             <path
// // // //                               fill="currentColor"
// // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// // // //                             />
// // // //                           </svg>
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // // //                           className="otd-reject"
// // // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // // //                         >
// // // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // // //                             <path
// // // //                               fill="currentColor"
// // // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// // // //                             />
// // // //                           </svg>
// // // //                         </button>
// // // //                       </div>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))
// // // //               ) : (
// // // //                 <tr>
// // // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // // //                     No overtime records found.
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       )}
// // // //       {alertModal.isVisible && (
// // // //         <div className="otd-modal-overlay">
// // // //           <div className="otd-modal-content">
// // // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // // //             <p className="otd-modal-message">{alertModal.message}</p>
// // // //             <button
// // // //               onClick={closeAlert}
// // // //               className="otd-modal-button"
// // // //             >
// // // //               Close
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default OvertimeDetails;

// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import "./OvertimeDetails.css";

// // // const OvertimeDetails = () => {
// // //   const [overtimeData, setOvertimeData] = useState([]);
// // //   const [selectedMonth, setSelectedMonth] = useState("current");
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [selectedRows, setSelectedRows] = useState([]);
// // //   const [selectAll, setSelectAll] = useState(false);
// // //   const [aprilPendingPopup, setAprilPendingPopup] = useState({
// // //     isVisible: false,
// // //     pendingCount: 0,
// // //   });

// // //   const API_KEY = process.env.REACT_APP_API_KEY;
// // //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// // //   const [alertModal, setAlertModal] = useState({
// // //     isVisible: false,
// // //     title: "",
// // //     message: "",
// // //   });

// // //   const showAlert = (message, title = "Alert") => {
// // //     setAlertModal({ isVisible: true, title, message });
// // //   };

// // //   const closeAlert = () => {
// // //     setAlertModal({ isVisible: false, title: "", message: "" });
// // //   };

// // //   const getDateRange = (type) => {
// // //     const today = new Date();
// // //     const currentMonth = today.getMonth();
// // //     const currentYear = today.getFullYear();

// // //     let startDate, endDate;

// // //     if (type === "current") {
// // //       // July 2025 (e.g., 2025-07-01 to 2025-07-31)
// // //       startDate = new Date(currentYear, currentMonth, 1);
// // //       endDate = new Date(currentYear, currentMonth + 1, 0);
// // //     } else if (type === "last") {
// // //       // June 2025 (e.g., 2025-06-01 to 2025-06-30)
// // //       startDate = new Date(currentYear, currentMonth - 1, 1);
// // //       endDate = new Date(currentYear, currentMonth, 0);
// // //     } else if (type === "twoMonthsAgo") {
// // //       // May 2025 (e.g., 2025-05-01 to 2025-05-31)
// // //       startDate = new Date(currentYear, currentMonth - 2, 1);
// // //       endDate = new Date(currentYear, currentMonth - 1, 0);
// // //     } else if (type === "april") {
// // //       // April 2025 (e.g., 2025-04-01 to 2025-04-30)
// // //       startDate = new Date(currentYear, currentMonth - 3, 1);
// // //       endDate = new Date(currentYear, currentMonth - 2, 0);
// // //     }

// // //     return {
// // //       startDate: startDate.toISOString().split("T")[0],
// // //       endDate: endDate.toISOString().split("T")[0],
// // //     };
// // //   };

// // //   const getMonthName = (offset) => {
// // //     const date = new Date();
// // //     date.setMonth(date.getMonth() - offset);
// // //     const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
// // //     console.log(`getMonthName(${offset}): ${monthName}`);
// // //     return monthName;
// // //   };

// // //   const monthOptions = [
// // //     { type: "current", offset: 0, label: getMonthName(0) },
// // //     { type: "last", offset: 1, label: getMonthName(1) },
// // //     { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
// // //   ];

// // //   const fetchData = async (startDate, endDate) => {
// // //     try {
// // //       setIsLoading(true);
// // //       const response = await axios.get(
// // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// // //         {
// // //           headers: {
// // //             "x-api-key": API_KEY,
// // //             "x-employee-id": meId,
// // //           },
// // //           params: {
// // //             startDate,
// // //             endDate,
// // //           },
// // //         }
// // //       );

// // //       console.log("API Response:", response.data);

// // //       const data = Array.isArray(response.data.data) ? response.data.data : [];
// // //       const uniqueData = Array.from(
// // //         new Map(data.map((item) => [item.punch_id, item])).values()
// // //       );

// // //       const formattedData = uniqueData.map((item) => ({
// // //         id: item.punch_id,
// // //         date: new Date(item.work_date).toISOString().split("T")[0],
// // //         name: item.employee_id,
// // //         hours: parseFloat(item.extra_hours) || 0,
// // //         rate: parseFloat(item.rate) || 0,
// // //         project: item.project || "",
// // //         supervisor: item.supervisor || "",
// // //         comments: item.comments || "",
// // //         status: item.status || "Pending",
// // //       }));

// // //       setOvertimeData(formattedData);
// // //       setSelectedRows([]);
// // //       setSelectAll(false);
// // //     } catch (error) {
// // //       showAlert(
// // //         error.response?.data?.error || error.message || "Network error",
// // //         "Error"
// // //       );
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   // Check for pending April records
// // //   const checkAprilPending = async () => {
// // //     const { startDate, endDate } = getDateRange("april");
// // //     try {
// // //       const response = await axios.get(
// // //         `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// // //         {
// // //           headers: {
// // //             "x-api-key": API_KEY,
// // //             "x-employee-id": meId,
// // //           },
// // //           params: {
// // //             startDate,
// // //             endDate,
// // //           },
// // //         }
// // //       );

// // //       const data = Array.isArray(response.data.data) ? response.data.data : [];
// // //       const pendingData = data.filter((item) => item.status === "Pending" || !item.status);
// // //       if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
// // //         setAprilPendingPopup({ isVisible: true, pendingCount: pendingData.length });
// // //         sessionStorage.setItem("aprilPopupShown", "true");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error checking April pending records:", error);
// // //     }
// // //   };

// // //   const handleInputChange = (id, field, value) => {
// // //     setOvertimeData((prevData) =>
// // //       prevData.map((row) =>
// // //         row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
// // //       )
// // //     );
// // //   };

// // //   const handleCheckboxChange = (id) => {
// // //     setSelectedRows((prevSelected) => {
// // //       const newSelected = prevSelected.includes(id)
// // //         ? prevSelected.filter((rowId) => rowId !== id)
// // //         : [...prevSelected, id];
// // //       const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// // //       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
// // //       setSelectAll(allPendingSelected);
// // //       return newSelected;
// // //     });
// // //   };

// // //   const handleSelectAllChange = () => {
// // //     if (selectAll) {
// // //       setSelectedRows([]);
// // //       setSelectAll(false);
// // //     } else {
// // //       const pendingRowIds = overtimeData
// // //         .filter((row) => row.status === "Pending")
// // //         .map((row) => row.id);
// // //       setSelectedRows(pendingRowIds);
// // //       setSelectAll(true);
// // //     }
// // //   };

// // //   const handleStatusChange = async (punchId, status, isBulk = false, isApril = false) => {
// // //     try {
// // //       setIsLoading(true);
// // //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

// // //       let payload;
// // //       if (isBulk || isApril) {
// // //         let selectedData;
// // //         if (isApril) {
// // //           const { startDate, endDate } = getDateRange("april");
// // //           const response = await axios.get(
// // //             `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// // //             {
// // //               headers: {
// // //                 "x-api-key": API_KEY,
// // //                 "x-employee-id": meId,
// // //               },
// // //               params: { startDate, endDate },
// // //             }
// // //           );
// // //           const data = Array.isArray(response.data.data) ? response.data.data : [];
// // //           selectedData = data
// // //             .filter((item) => item.status === "Pending" || !item.status)
// // //             .map((item) => ({
// // //               punch_id: item.punch_id,
// // //               work_date: new Date(item.work_date).toISOString().split("T")[0],
// // //               employee_id: item.employee_id,
// // //               extra_hours: parseFloat(item.extra_hours) || 0,
// // //               rate: parseFloat(item.rate) || 0,
// // //               project: item.project || "",
// // //               supervisor: item.supervisor || "",
// // //               comments: item.comments || "",
// // //               status: status,
// // //             }));
// // //         } else {
// // //           selectedData = overtimeData
// // //             .filter((row) => selectedRows.includes(row.id))
// // //             .filter((row) => row.status === "Pending")
// // //             .map((row) => ({
// // //               punch_id: row.id,
// // //               work_date: row.date,
// // //               employee_id: row.name,
// // //               extra_hours: row.hours,
// // //               rate: parseFloat(row.rate) || 0,
// // //               project: row.project || "",
// // //               supervisor: row.supervisor || "",
// // //               comments: row.comments || "",
// // //               status: status,
// // //             }));
// // //         }

// // //         if (selectedData.length === 0) {
// // //           throw new Error("No pending rows selected for approval/rejection.");
// // //         }

// // //         payload = { data: selectedData };
// // //       } else {
// // //         const row = overtimeData.find((row) => row.id === punchId);
// // //         if (!row) {
// // //           throw new Error("Row not found for punchId: " + punchId);
// // //         }
// // //         if (row.status !== "Pending") {
// // //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// // //         }

// // //         payload = {
// // //           data: [{
// // //             punch_id: row.id,
// // //             work_date: row.date,
// // //             employee_id: row.name,
// // //             extra_hours: row.hours,
// // //             rate: parseFloat(row.rate) || 0,
// // //             project: row.project || "",
// // //             supervisor: row.supervisor || "",
// // //             comments: row.comments || "",
// // //             status: status,
// // //           }],
// // //         };
// // //       }

// // //       await axios.post(fullUrl, payload, {
// // //         headers: {
// // //           "x-api-key": API_KEY,
// // //           "x-employee-id": meId,
// // //           "Content-Type": "application/json",
// // //         },
// // //       });

// // //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");

// // //       if (isApril) {
// // //         setAprilPendingPopup({ isVisible: false, pendingCount: 0 });
// // //       } else {
// // //         setOvertimeData((prevData) =>
// // //           prevData.map((row) =>
// // //             isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// // //               ? { ...row, status }
// // //               : row.id === punchId && row.status === "Pending"
// // //               ? { ...row, status }
// // //               : row
// // //           )
// // //         );
// // //         setSelectedRows([]);
// // //         setSelectAll(false);
// // //         const { startDate, endDate } = getDateRange(selectedMonth);
// // //         await fetchData(startDate, endDate);
// // //       }
// // //     } catch (error) {
// // //       showAlert(
// // //         error.response?.data?.error || error.response?.data?.message || error.message || "Network error",
// // //         "Error"
// // //       );
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleApproveSelected = () => handleStatusChange(null, "Approved", true);
// // //   const handleRejectSelected = () => handleStatusChange(null, "Rejected", true);
// // //   const handleAprilApprove = () => handleStatusChange(null, "Approved", true, true);
// // //   const handleAprilReject = () => handleStatusChange(null, "Rejected", true, true);

// // //   useEffect(() => {
// // //     const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// // //     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
// // //     setSelectAll(allPendingSelected);
// // //   }, [overtimeData, selectedRows]);

// // //   useEffect(() => {
// // //     const { startDate, endDate } = getDateRange(selectedMonth);
// // //     console.log(`Fetching data for ${selectedMonth}: ${startDate} to ${endDate}`);
// // //     fetchData(startDate, endDate);
// // //   }, [selectedMonth]);

// // //   useEffect(() => {
// // //     // Check for April pending records on mount
// // //     checkAprilPending();
// // //   }, []);

// // //   return (
// // //     <div className="otd-overtime-container">
// // //       <h2 className="otd-title">Overtime Details</h2>
// // //       <div className="otd-month-selector">
// // //         {monthOptions.map(({ type, label }) => (
// // //           <span
// // //             key={type}
// // //             data-testid={`month-option-${type}`}
// // //             className={`otd-month-option ${selectedMonth === type ? "otd-active" : ""}`}
// // //             onClick={() => setSelectedMonth(type)}
// // //             title={label}
// // //           >
// // //             {label}
// // //           </span>
// // //         ))}
// // //       </div>
// // //       <div className="otd-action-buttons-container">
// // //         <button
// // //           onClick={handleApproveSelected}
// // //           className="otd-approve-button"
// // //           disabled={selectedRows.length === 0 || isLoading}
// // //         >
// // //           Approve All
// // //         </button>
// // //         <button
// // //           onClick={handleRejectSelected}
// // //           className="otd-reject-button"
// // //           disabled={selectedRows.length === 0 || isLoading}
// // //         >
// // //           Reject All
// // //         </button>
// // //       </div>
// // //       {isLoading ? (
// // //         <div className="otd-loading">Loading...</div>
// // //       ) : (
// // //         <div className="otd-table-container">
// // //           <table className="otd-overtime-table">
// // //             <thead>
// // //               <tr>
// // //                 <th className="otd-table-header">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={selectAll}
// // //                     onChange={handleSelectAllChange}
// // //                     className="otd-checkbox"
// // //                     disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
// // //                   />
// // //                 </th>
// // //                 <th className="otd-table-header">Date</th>
// // //                 <th className="otd-table-header">Employee ID</th>
// // //                 <th className="otd-table-header">Extra Hours</th>
// // //                 <th className="otd-table-header">Rate</th>
// // //                 <th className="otd-table-header">Project</th>
// // //                 <th className="otd-table-header">Supervisor</th>
// // //                 <th className="otd-table-header">Comments</th>
// // //                 <th className="otd-table-header">Status</th>
// // //                 <th className="otd-table-header">Actions</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {overtimeData.length > 0 ? (
// // //                 overtimeData.map((row) => (
// // //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// // //                     <td className="otd-table-cell">
// // //                       <input
// // //                         type="checkbox"
// // //                         checked={selectedRows.includes(row.id)}
// // //                         onChange={() => handleCheckboxChange(row.id)}
// // //                         className="otd-checkbox"
// // //                         disabled={row.status !== "Pending"}
// // //                       />
// // //                     </td>
// // //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// // //                     <td className="otd-table-cell">{row.name}</td>
// // //                     <td className="otd-table-cell">{row.hours}</td>
// // //                     <td className="otd-table-cell">
// // //                       <input
// // //                         type="number"
// // //                         value={row.rate}
// // //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// // //                         className="otd-input"
// // //                         min="0"
// // //                         step="0.01"
// // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // //                       />
// // //                     </td>
// // //                     <td className="otd-table-cell">
// // //                       <input
// // //                         type="text"
// // //                         value={row.project}
// // //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// // //                         className="otd-input"
// // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // //                       />
// // //                     </td>
// // //                     <td className="otd-table-cell">
// // //                       <input
// // //                         type="text"
// // //                         value={row.supervisor}
// // //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// // //                         className="otd-input"
// // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // //                       />
// // //                     </td>
// // //                     <td className="otd-table-cell">
// // //                       <input
// // //                         type="text"
// // //                         value={row.comments}
// // //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// // //                         className="otd-input"
// // //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// // //                       />
// // //                     </td>
// // //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// // //                     <td className="otd-table-cell">
// // //                       <div className="otd-action-buttons">
// // //                         <button
// // //                           onClick={() => handleStatusChange(row.id, "Approved")}
// // //                           className="otd-approve"
// // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // //                         >
// // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // //                             <path
// // //                               fill="currentColor"
// // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// // //                             />
// // //                           </svg>
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// // //                           className="otd-reject"
// // //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// // //                         >
// // //                           <svg className="otd-icon" viewBox="0 0 24 24">
// // //                             <path
// // //                               fill="currentColor"
// // //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
// // //                             />
// // //                           </svg>
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="10" className="otd-table-cell otd-no-records">
// // //                     No overtime records found.
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //       {alertModal.isVisible && (
// // //         <div className="otd-modal-overlay">
// // //           <div className="otd-modal-content">
// // //             <h3 className="otd-modal-title">{alertModal.title}</h3>
// // //             <p className="otd-modal-message">{alertModal.message}</p>
// // //             <button onClick={closeAlert} className="otd-modal-button">
// // //               Close
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //       {aprilPendingPopup.isVisible && (
// // //         <div className="otd-april-popup-overlay">
// // //           <div className="otd-april-popup-content">
// // //             <h3 className="otd-april-popup-title">Pending April 2025 Records</h3>
// // //             <p className="otd-april-popup-message">
// // //               There are {aprilPendingPopup.pendingCount} pending overtime records for April 2025. Please approve or reject them.
// // //             </p>
// // //             <div className="otd-april-popup-buttons">
// // //               <button
// // //                 onClick={handleAprilApprove}
// // //                 className="otd-april-approve-button"
// // //                 disabled={isLoading}
// // //               >
// // //                 Approve All
// // //               </button>
// // //               <button
// // //                 onClick={handleAprilReject}
// // //                 className="otd-april-reject-button"
// // //                 disabled={isLoading}
// // //               >
// // //                 Reject All
// // //               </button>
// // //               <button
// // //                 onClick={() => setAprilPendingPopup({ isVisible: false, pendingCount: 0 })}
// // //                 className="otd-april-close-button"
// // //               >
// // //                 Close
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default OvertimeDetails;
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./OvertimeDetails.css";

// // const OvertimeDetails = () => {
// //   const [overtimeData, setOvertimeData] = useState([]);
// //   const [selectedMonth, setSelectedMonth] = useState("current");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   const [selectAll, setSelectAll] = useState(false);
// //   const [aprilPendingPopup, setAprilPendingPopup] = useState({
// //     isVisible: false,
// //     pendingCount: 0,
// //   });
// //   const [monthOptions, setMonthOptions] = useState([]);

// //   const API_KEY = process.env.REACT_APP_API_KEY;
// //   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

// //   const [alertModal, setAlertModal] = useState({
// //     isVisible: false,
// //     title: "",
// //     message: "",
// //   });

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
// //       // June 25, 2025 to July 25, 2025
// //       startDate = new Date(currentYear, currentMonth - 1, 25);
// //       endDate = new Date(currentYear, currentMonth, 25);
// //     } else if (type === "last") {
// //       // May 25, 2025 to June 25, 2025
// //       startDate = new Date(currentYear, currentMonth - 2, 25);
// //       endDate = new Date(currentYear, currentMonth - 1, 25);
// //     } else if (type === "twoMonthsAgo") {
// //       // April 25, 2025 to May 25, 2025
// //       startDate = new Date(currentYear, currentMonth - 3, 25);
// //       endDate = new Date(currentYear, currentMonth - 2, 25);
// //     } else if (type === "april") {
// //       // March 25, 2025 to April 25, 2025
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
// //     date.setMonth(date.getMonth() - offset);
// //     const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
// //     console.log(`getMonthName(${offset}): ${monthName}`);
// //     return monthName;
// //   };

// //   // Set monthOptions after component mounts
// //   useEffect(() => {
// //     setMonthOptions([
// //       { type: "current", offset: 0, label: getMonthName(0) },
// //       { type: "last", offset: 1, label: getMonthName(1) },
// //       { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
// //     ]);
// //   }, []);

// //   const fetchData = async (startDate, endDate) => {
// //     try {
// //       setIsLoading(true);
// //       console.log(`Fetching data for ${startDate} to ${endDate}`);
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

// //       console.log("API Response:", response.data);

// //       const data = Array.isArray(response.data.data) ? response.data.data : [];
// //       console.log("Raw API Data:", data);

// //       if (data.length === 0) {
// //         console.warn("No records returned from API for the given date range");
// //       }

// //       const uniqueData = Array.from(
// //         new Map(data.map((item) => [item.punch_id, item])).values()
// //       );

// //       const formattedData = uniqueData.map((item) => {
// //         const hours = parseFloat(item.extra_hours) || 0;
// //         if (hours > 24) {
// //           console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
// //         }
// //         return {
// //           id: item.punch_id,
// //           date: new Date(item.work_date).toISOString().split("T")[0],
// //           name: item.employee_id,
// //           hours: Math.min(hours, 24), // Cap hours at 24 per day
// //           rate: parseFloat(item.rate) || 0,
// //           project: item.project || "",
// //           supervisor: item.supervisor || "",
// //           comments: item.comments || "",
// //           status: item.status || "Pending",
// //         };
// //       });

// //       console.log("Formatted Data:", formattedData);
// //       setOvertimeData(formattedData);
// //       setSelectedRows([]);
// //       setSelectAll(false);
// //     } catch (error) {
// //       console.error("Fetch error:", error);
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
// //       const pendingData = data.filter((item) => item.status === "Pending" || !item.status);
// //       console.log(`April pending records: ${pendingData.length}`);
// //       if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
// //         setAprilPendingPopup({ isVisible: true, pendingCount: pendingData.length });
// //         sessionStorage.setItem("aprilPopupShown", "true");
// //       }
// //     } catch (error) {
// //       console.error("Error checking April pending records:", error);
// //     }
// //   };

// //   const handleInputChange = (id, field, value) => {
// //     setOvertimeData((prevData) =>
// //       prevData.map((row) =>
// //         row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
// //       )
// //     );
// //   };

// //   const handleCheckboxChange = (id) => {
// //     setSelectedRows((prevSelected) => {
// //       const newSelected = prevSelected.includes(id)
// //         ? prevSelected.filter((rowId) => rowId !== id)
// //         : [...prevSelected, id];
// //       const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// //       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
// //       setSelectAll(allPendingSelected);
// //       return newSelected;
// //     });
// //   };

// //   const handleSelectAllChange = () => {
// //     if (selectAll) {
// //       setSelectedRows([]);
// //       setSelectAll(false);
// //     } else {
// //       const pendingRowIds = overtimeData
// //         .filter((row) => row.status === "Pending")
// //         .map((row) => row.id);
// //       setSelectedRows(pendingRowIds);
// //       setSelectAll(true);
// //     }
// //   };

// //   const handleStatusChange = async (punchId, status, isBulk = false, isApril = false) => {
// //     try {
// //       setIsLoading(true);
// //       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

// //       let payload;
// //       if (isBulk || isApril) {
// //         let selectedData;
// //         if (isApril) {
// //           const { startDate, endDate } = getDateRange("april");
// //           const response = await axios.get(
// //             `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
// //             {
// //               headers: {
// //                 "x-api-key": API_KEY,
// //                 "x-employee-id": meId,
// //               },
// //               params: { startDate, endDate },
// //             }
// //           );
// //           const data = Array.isArray(response.data.data) ? response.data.data : [];
// //           selectedData = data
// //             .filter((item) => item.status === "Pending" || !item.status)
// //             .map((item) => ({
// //               punch_id: item.punch_id,
// //               work_date: new Date(item.work_date).toISOString().split("T")[0],
// //               employee_id: item.employee_id,
// //               extra_hours: parseFloat(item.extra_hours) || 0,
// //               rate: parseFloat(item.rate) || 0,
// //               project: item.project || "",
// //               supervisor: item.supervisor || "",
// //               comments: item.comments || "",
// //               status: status,
// //             }));
// //         } else {
// //           selectedData = overtimeData
// //             .filter((row) => selectedRows.includes(row.id))
// //             .filter((row) => row.status === "Pending")
// //             .map((row) => ({
// //               punch_id: row.id,
// //               work_date: row.date,
// //               employee_id: row.name,
// //               extra_hours: row.hours,
// //               rate: parseFloat(row.rate) || 0,
// //               project: row.project || "",
// //               supervisor: row.supervisor || "",
// //               comments: row.comments || "",
// //               status: status,
// //             }));
// //         }

// //         if (selectedData.length === 0) {
// //           throw new Error("No pending rows selected for approval/rejection.");
// //         }

// //         payload = { data: selectedData };
// //       } else {
// //         const row = overtimeData.find((row) => row.id === punchId);
// //         if (!row) {
// //           throw new Error("Row not found for punchId: " + punchId);
// //         }
// //         if (row.status !== "Pending") {
// //           throw new Error(`Cannot change status of row with status: ${row.status}`);
// //         }

// //         payload = {
// //           data: [{
// //             punch_id: row.id,
// //             work_date: row.date,
// //             employee_id: row.name,
// //             extra_hours: row.hours,
// //             rate: parseFloat(row.rate) || 0,
// //             project: row.project || "",
// //             supervisor: row.supervisor || "",
// //             comments: row.comments || "",
// //             status: status,
// //           }],
// //         };
// //       }

// //       await axios.post(fullUrl, payload, {
// //         headers: {
// //           "x-api-key": API_KEY,
// //           "x-employee-id": meId,
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       showAlert(`Overtime record(s) ${status.toLowerCase()} successfully`, "Success");

// //       if (isApril) {
// //         setAprilPendingPopup({ isVisible: false, pendingCount: 0 });
// //       } else {
// //         setOvertimeData((prevData) =>
// //           prevData.map((row) =>
// //             isBulk && selectedRows.includes(row.id) && row.status === "Pending"
// //               ? { ...row, status }
// //               : row.id === punchId && row.status === "Pending"
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

// //   useEffect(() => {
// //     const pendingRows = overtimeData.filter((row) => row.status === "Pending");
// //     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
// //     setSelectAll(allPendingSelected);
// //   }, [overtimeData, selectedRows]);

// //   useEffect(() => {
// //     const { startDate, endDate } = getDateRange(selectedMonth);
// //     fetchData(startDate, endDate);
// //   }, [selectedMonth]);

// //   useEffect(() => {
// //     checkAprilPending();
// //   }, []);

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
// //           disabled={selectedRows.length === 0 || isLoading}
// //         >
// //           Approve All
// //         </button>
// //         <button
// //           onClick={handleRejectSelected}
// //           className="otd-reject-button"
// //           disabled={selectedRows.length === 0 || isLoading}
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
// //                     disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
// //                   />
// //                 </th>
// //                 <th className="otd-table-header">Date</th>
// //                 <th className="otd-table-header">Employee ID</th>
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
// //                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedRows.includes(row.id)}
// //                         onChange={() => handleCheckboxChange(row.id)}
// //                         className="otd-checkbox"
// //                         disabled={row.status !== "Pending"}
// //                       />
// //                     </td>
// //                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
// //                     <td className="otd-table-cell">{row.name}</td>
// //                     <td className="otd-table-cell">{row.hours}</td>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="number"
// //                         value={row.rate}
// //                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
// //                         className="otd-input"
// //                         min="0"
// //                         step="0.01"
// //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// //                       />
// //                     </td>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="text"
// //                         value={row.project}
// //                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
// //                         className="otd-input"
// //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// //                       />
// //                     </td>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="text"
// //                         value={row.supervisor}
// //                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
// //                         className="otd-input"
// //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// //                       />
// //                     </td>
// //                     <td className="otd-table-cell">
// //                       <input
// //                         type="text"
// //                         value={row.comments}
// //                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
// //                         className="otd-input"
// //                         disabled={row.status === "Approved" || row.status === "Rejected"}
// //                       />
// //                     </td>
// //                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
// //                     <td className="otd-table-cell">
// //                       <div className="otd-action-buttons">
// //                         <button
// //                           onClick={() => handleStatusChange(row.id, "Approved")}
// //                           className="otd-approve"
// //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
// //                         >
// //                           <svg className="otd-icon" viewBox="0 0 24 24">
// //                             <path
// //                               fill="currentColor"
// //                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
// //                             />
// //                           </svg>
// //                         </button>
// //                         <button
// //                           onClick={() => handleStatusChange(row.id, "Rejected")}
// //                           className="otd-reject"
// //                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
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
// //                   <td colSpan="10" className="otd-table-cell otd-no-records">
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
// //             <p className="otd-modal-message">{alertModal.message}</p>
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
// //             <div className="otd-april-popup-buttons">
// //               <button
// //                 onClick={handleAprilApprove}
// //                 className="otd-april-approve-button"
// //                 disabled={isLoading}
// //               >
// //                 Approve All
// //               </button>
// //               <button
// //                 onClick={handleAprilReject}
// //                 className="otd-april-reject-button"
// //                 disabled={isLoading}
// //               >
// //                 Reject All
// //               </button>
// //               <button
// //                 onClick={() => setAprilPendingPopup({ isVisible: false, pendingCount: 0 })}
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
//   const [selectedMonth, setSelectedMonth] = useState("current");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [aprilPendingPopup, setAprilPendingPopup] = useState({
//     isVisible: false,
//     pendingCount: 0,
//     showDetails: false,
//     data: [],
//   });
//   const [monthOptions, setMonthOptions] = useState([]);

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

//   const [alertModal, setAlertModal] = useState({
//     isVisible: false,
//     title: "",
//     message: "",
//   });

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

//   useEffect(() => {
//     console.log("Setting monthOptions");
//     setMonthOptions([
//       { type: "current", offset: 0, label: getMonthName(0) },
//       { type: "last", offset: 1, label: getMonthName(1) },
//       { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
//     ]);
//   }, []);

//   const fetchData = async (startDate, endDate) => {
//     try {
//       setIsLoading(true);
//       console.log(`Fetching data for ${startDate} to ${endDate}`);
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

//       console.log("API Response:", response.data);

//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       console.log("Raw API Data:", data);

//       if (data.length === 0) {
//         console.warn("No records returned from API for the given date range");
//       }

//       const uniqueData = Array.from(
//         new Map(data.map((item) => [item.punch_id, item])).values()
//       );

//       const formattedData = uniqueData.map((item) => {
//         const hours = parseFloat(item.extra_hours) || 0;
//         if (hours > 24) {
//           console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
//         }
//         return {
//           id: item.punch_id,
//           date: new Date(item.work_date).toISOString().split("T")[0],
//           name: item.employee_id,
//           hours: Math.min(hours, 24),
//           rate: parseFloat(item.rate) || 0,
//           project: item.project || "",
//           supervisor: item.supervisor || "",
//           comments: item.comments || "",
//           status: item.status || "Pending",
//         };
//       });

//       console.log("Formatted Data:", formattedData);
//       setOvertimeData(formattedData);
//       setSelectedRows([]);
//       setSelectAll(false);
//     } catch (error) {
//       console.error("Fetch error:", error);
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
//       const pendingData = data.filter((item) => item.status === "Pending" || !item.status);
//       console.log(`April pending records: ${pendingData.length}`);

//       const formattedData = pendingData.map((item) => {
//         const hours = parseFloat(item.extra_hours) || 0;
//         if (hours > 24) {
//           console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
//         }
//         return {
//           id: item.punch_id,
//           date: new Date(item.work_date).toISOString().split("T")[0],
//           name: item.employee_id,
//           hours: Math.min(hours, 24),
//           rate: parseFloat(item.rate) || 0,
//           project: item.project || "",
//           supervisor: item.supervisor || "",
//           comments: item.comments || "",
//           status: item.status || "Pending",
//         };
//       });

//       if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
//         setAprilPendingPopup({
//           isVisible: true,
//           pendingCount: pendingData.length,
//           showDetails: false,
//           data: formattedData,
//         });
//         sessionStorage.setItem("aprilPopupShown", "true");
//       }
//     } catch (error) {
//       console.error("Error checking April pending records:", error);
//     }
//   };

//   const handleInputChange = (id, field, value, isAprilPopup = false) => {
//     if (isAprilPopup) {
//       setAprilPendingPopup((prev) => ({
//         ...prev,
//         data: prev.data.map((row) =>
//           row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
//         ),
//       }));
//     } else {
//       setOvertimeData((prevData) =>
//         prevData.map((row) =>
//           row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
//         )
//       );
//     }
//   };

//   const handleCheckboxChange = (id) => {
//     setSelectedRows((prevSelected) => {
//       const newSelected = prevSelected.includes(id)
//         ? prevSelected.filter((rowId) => rowId !== id)
//         : [...prevSelected, id];
//       const pendingRows = overtimeData.filter((row) => row.status === "Pending");
//       const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
//       setSelectAll(allPendingSelected);
//       return newSelected;
//     });
//   };

//   const handleSelectAllChange = () => {
//     if (selectAll) {
//       setSelectedRows([]);
//       setSelectAll(false);
//     } else {
//       const pendingRowIds = overtimeData
//         .filter((row) => row.status === "Pending")
//         .map((row) => row.id);
//       setSelectedRows(pendingRowIds);
//       setSelectAll(true);
//     }
//   };

//   const handleStatusChange = async (punchId, status, isBulk = false, isApril = false) => {
//     try {
//       setIsLoading(true);
//       const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

//       let payload;
//       if (isBulk || isApril) {
//         let selectedData;
//         if (isApril) {
//           selectedData = aprilPendingPopup.data
//             .filter((row) => (isBulk ? selectedRows.includes(row.id) : row.id === punchId))
//             .filter((row) => row.status === "Pending")
//             .map((row) => ({
//               punch_id: row.id,
//               work_date: row.date,
//               employee_id: row.name,
//               extra_hours: row.hours,
//               rate: parseFloat(row.rate) || 0,
//               project: row.project || "",
//               supervisor: row.supervisor || "",
//               comments: row.comments || "",
//               status: status,
//             }));
//         } else {
//           selectedData = overtimeData
//             .filter((row) => selectedRows.includes(row.id))
//             .filter((row) => row.status === "Pending")
//             .map((row) => ({
//               punch_id: row.id,
//               work_date: row.date,
//               employee_id: row.name,
//               extra_hours: row.hours,
//               rate: parseFloat(row.rate) || 0,
//               project: row.project || "",
//               supervisor: row.supervisor || "",
//               comments: row.comments || "",
//               status: status,
//             }));
//         }

//         if (selectedData.length === 0) {
//           throw new Error("No pending rows selected for approval/rejection.");
//         }

//         payload = { data: selectedData };
//       } else {
//         const row = overtimeData.find((row) => row.id === punchId);
//         if (!row) {
//           throw new Error("Row not found for punchId: " + punchId);
//         }
//         if (row.status !== "Pending") {
//           throw new Error(`Cannot change status of row with status: ${row.status}`);
//         }

//         payload = {
//           data: [{
//             punch_id: row.id,
//             work_date: row.date,
//             employee_id: row.name,
//             extra_hours: row.hours,
//             rate: parseFloat(row.rate) || 0,
//             project: row.project || "",
//             supervisor: row.supervisor || "",
//             comments: row.comments || "",
//             status: status,
//           }],
//         };
//       }

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
//             (isBulk ? selectedRows.includes(row.id) : row.id === punchId) && row.status === "Pending"
//               ? { ...row, status }
//               : row
//           ),
//           pendingCount: prev.data.filter((row) => row.status === "Pending").length,
//           isVisible: prev.data.filter((row) => row.status === "Pending").length > 0,
//         }));
//         setSelectedRows([]);
//       } else {
//         setOvertimeData((prevData) =>
//           prevData.map((row) =>
//             isBulk && selectedRows.includes(row.id) && row.status === "Pending"
//               ? { ...row, status }
//               : row.id === punchId && row.status === "Pending"
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
//     const pendingRows = overtimeData.filter((row) => row.status === "Pending");
//     const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
//     setSelectAll(allPendingSelected);
//   }, [overtimeData, selectedRows]);

//   useEffect(() => {
//     const { startDate, endDate } = getDateRange(selectedMonth);
//     fetchData(startDate, endDate);
//   }, [selectedMonth]);

//   useEffect(() => {
//     checkAprilPending();
//   }, []);

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
//           disabled={selectedRows.length === 0 || isLoading}
//         >
//           Approve All
//         </button>
//         <button
//           onClick={handleRejectSelected}
//           className="otd-reject-button"
//           disabled={selectedRows.length === 0 || isLoading}
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
//                     disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
//                   />
//                 </th>
//                 <th className="otd-table-header">Date</th>
//                 <th className="otd-table-header">Employee ID</th>
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
//                   <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
//                     <td className="otd-table-cell">
//                       <input
//                         type="checkbox"
//                         checked={selectedRows.includes(row.id)}
//                         onChange={() => handleCheckboxChange(row.id)}
//                         className="otd-checkbox"
//                         disabled={row.status !== "Pending"}
//                       />
//                     </td>
//                     <td className="otd-table-cell otd-date-cell">{row.date}</td>
//                     <td className="otd-table-cell">{row.name}</td>
//                     <td className="otd-table-cell">{row.hours}</td>
//                     <td className="otd-table-cell">
//                       <input
//                         type="number"
//                         value={row.rate}
//                         onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
//                         className="otd-input"
//                         min="0"
//                         step="0.01"
//                         disabled={row.status === "Approved" || row.status === "Rejected"}
//                       />
//                     </td>
//                     <td className="otd-table-cell">
//                       <input
//                         type="text"
//                         value={row.project}
//                         onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
//                         className="otd-input"
//                         disabled={row.status === "Approved" || row.status === "Rejected"}
//                       />
//                     </td>
//                     <td className="otd-table-cell">
//                       <input
//                         type="text"
//                         value={row.supervisor}
//                         onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
//                         className="otd-input"
//                         disabled={row.status === "Approved" || row.status === "Rejected"}
//                       />
//                     </td>
//                     <td className="otd-table-cell">
//                       <input
//                         type="text"
//                         value={row.comments}
//                         onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
//                         className="otd-input"
//                         disabled={row.status === "Approved" || row.status === "Rejected"}
//                       />
//                     </td>
//                     <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
//                     <td className="otd-table-cell">
//                       <div className="otd-action-buttons">
//                         <button
//                           onClick={() => handleStatusChange(row.id, "Approved")}
//                           className="otd-approve"
//                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
//                         >
//                           <svg className="otd-icon" viewBox="0 0 24 24">
//                             <path
//                               fill="currentColor"
//                               d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(row.id, "Rejected")}
//                           className="otd-reject"
//                           disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
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
//                   <td colSpan="10" className="otd-table-cell otd-no-records">
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
//             <p className="otd-modal-message">{alertModal.message}</p>
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
//                       <th className="otd-table-header">Employee ID</th>
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
//                         <tr key={row.id} className="otd-table-row">
//                           <td className="otd-table-cell otd-date-cell">{row.date}</td>
//                           <td className="otd-table-cell">{row.name}</td>
//                           <td className="otd-table-cell">{row.hours}</td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="number"
//                               value={row.rate}
//                               onChange={(e) => handleInputChange(row.id, "rate", e.target.value, true)}
//                               className="otd-input"
//                               min="0"
//                               step="0.01"
//                               disabled={row.status === "Approved" || row.status === "Rejected"}
//                             />
//                           </td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="text"
//                               value={row.project}
//                               onChange={(e) => handleInputChange(row.id, "project", e.target.value, true)}
//                               className="otd-input"
//                               disabled={row.status === "Approved" || row.status === "Rejected"}
//                             />
//                           </td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="text"
//                               value={row.supervisor}
//                               onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value, true)}
//                               className="otd-input"
//                               disabled={row.status === "Approved" || row.status === "Rejected"}
//                             />
//                           </td>
//                           <td className="otd-table-cell">
//                             <input
//                               type="text"
//                               value={row.comments}
//                               onChange={(e) => handleInputChange(row.id, "comments", e.target.value, true)}
//                               className="otd-input"
//                               disabled={row.status === "Approved" || row.status === "Rejected"}
//                             />
//                           </td>
//                           <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
//                           <td className="otd-table-cell">
//                             <div className="otd-action-buttons">
//                               <button
//                                 onClick={() => handleStatusChange(row.id, "Approved", false, true)}
//                                 className="otd-approve"
//                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
//                               >
//                                 <svg className="otd-icon" viewBox="0 0 24 24">
//                                   <path
//                                     fill="currentColor"
//                                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
//                                   />
//                                 </svg>
//                               </button>
//                               <button
//                                 onClick={() => handleStatusChange(row.id, "Rejected", false, true)}
//                                 className="otd-reject"
//                                 disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
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
//                         <td colSpan="9" className="otd-table-cell otd-no-records">
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
//                 disabled={isLoading}
//               >
//                 Approve All
//               </button>
//               <button
//                 onClick={handleAprilReject}
//                 className="otd-april-reject-button"
//                 disabled={isLoading}
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OvertimeDetails.css";

const OvertimeDetails = () => {
  const [overtimeData, setOvertimeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("current");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [aprilPendingPopup, setAprilPendingPopup] = useState({
    isVisible: false,
    pendingCount: 0,
    showDetails: false,
    data: [],
  });
  const [monthOptions, setMonthOptions] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "Alert") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const getDateRange = (type) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let startDate, endDate;

    if (type === "current") {
      startDate = new Date(currentYear, currentMonth - 1, 25);
      endDate = new Date(currentYear, currentMonth, 25);
    } else if (type === "last") {
      startDate = new Date(currentYear, currentMonth - 2, 25);
      endDate = new Date(currentYear, currentMonth - 1, 25);
    } else if (type === "twoMonthsAgo") {
      startDate = new Date(currentYear, currentMonth - 3, 25);
      endDate = new Date(currentYear, currentMonth - 2, 25);
    } else if (type === "april") {
      startDate = new Date(currentYear, currentMonth - 4, 25);
      endDate = new Date(currentYear, currentMonth - 3, 25);
    }

    const range = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
    console.log(`getDateRange(${type}): ${range.startDate} to ${range.endDate}`);
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

  useEffect(() => {
    console.log("Setting monthOptions");
    setMonthOptions([
      { type: "current", offset: 0, label: getMonthName(0) },
      { type: "last", offset: 1, label: getMonthName(1) },
      { type: "twoMonthsAgo", offset: 2, label: getMonthName(2) },
    ]);
  }, []);

  const fetchData = async (startDate, endDate) => {
    try {
      setIsLoading(true);
      console.log(`Fetching overtime data for ${startDate} to ${endDate}`);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/employee-extra-hours`,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-employee-id": meId,
          },
          params: {
            startDate,
            endDate,
          },
        }
      );

      console.log("Overtime API Response:", response.data);

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      console.log("Overtime Raw API Data:", data);

      if (data.length === 0) {
        console.warn("No overtime records returned from API for the given date range");
      }

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.punch_id, item])).values()
      );

      const formattedData = uniqueData.map((item) => {
        const hours = parseFloat(item.extra_hours) || 0;
        if (hours > 24) {
          console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
        }
        return {
          id: item.punch_id,
          date: new Date(item.work_date).toISOString().split("T")[0],
          name: item.employee_id,
          hours: Math.min(hours, 24),
          rate: parseFloat(item.rate) || 0,
          project: item.project || "",
          supervisor: item.supervisor || "",
          comments: item.comments || "",
          status: item.status || "Pending",
        };
      });

      console.log("Overtime Formatted Data:", formattedData);
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
    const { startDate, endDate } = getDateRange("april");
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
            endDate,
          },
        }
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const pendingData = data.filter((item) => item.status === "Pending" || !item.status);
      console.log(`April pending records: ${pendingData.length}`);

      const formattedData = pendingData.map((item) => {
        const hours = parseFloat(item.extra_hours) || 0;
        if (hours > 24) {
          console.warn(`Unusually high extra_hours for punch_id ${item.punch_id}: ${hours}`);
        }
        return {
          id: item.punch_id,
          date: new Date(item.work_date).toISOString().split("T")[0],
          name: item.employee_id,
          hours: Math.min(hours, 24),
          rate: parseFloat(item.rate) || 0,
          project: item.project || "",
          supervisor: item.supervisor || "",
          comments: item.comments || "",
          status: item.status || "Pending",
        };
      });

      if (pendingData.length > 0 && !sessionStorage.getItem("aprilPopupShown")) {
        setAprilPendingPopup({
          isVisible: true,
          pendingCount: pendingData.length,
          showDetails: false,
          data: formattedData,
        });
        sessionStorage.setItem("aprilPopupShown", "true");
      }
    } catch (error) {
      console.error("Error checking April pending records:", error);
    }
  };

  const handleInputChange = (id, field, value, isAprilPopup = false) => {
    if (isAprilPopup) {
      setAprilPendingPopup((prev) => ({
        ...prev,
        data: prev.data.map((row) =>
          row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
        ),
      }));
    } else {
      setOvertimeData((prevData) =>
        prevData.map((row) =>
          row.id === id ? { ...row, [field]: field === "rate" ? parseFloat(value) || 0 : value } : row
        )
      );
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];
      const pendingRows = overtimeData.filter((row) => row.status === "Pending");
      const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => newSelected.includes(row.id));
      setSelectAll(allPendingSelected);
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      const pendingRowIds = overtimeData
        .filter((row) => row.status === "Pending")
        .map((row) => row.id);
      setSelectedRows(pendingRowIds);
      setSelectAll(true);
    }
  };

  const handleStatusChange = async (punchId, status, isBulk = false, isApril = false) => {
    try {
      setIsLoading(true);
      const fullUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/overtime-bulk`;

      let payload;
      if (isBulk || isApril) {
        let selectedData;
        if (isApril) {
          selectedData = aprilPendingPopup.data
            .filter((row) => (isBulk ? selectedRows.includes(row.id) : row.id === punchId))
            .filter((row) => row.status === "Pending")
            .map((row) => ({
              punch_id: row.id,
              work_date: row.date,
              employee_id: row.name,
              extra_hours: row.hours,
              rate: parseFloat(row.rate) || 0,
              project: row.project || "",
              supervisor: row.supervisor || "",
              comments: row.comments || "",
              status: status,
            }));
        } else {
          selectedData = overtimeData
            .filter((row) => selectedRows.includes(row.id))
            .filter((row) => row.status === "Pending")
            .map((row) => ({
              punch_id: row.id,
              work_date: row.date,
              employee_id: row.name,
              extra_hours: row.hours,
              rate: parseFloat(row.rate) || 0,
              project: row.project || "",
              supervisor: row.supervisor || "",
              comments: row.comments || "",
              status: status,
            }));
        }

        if (selectedData.length === 0) {
          throw new Error("No pending rows selected for approval/rejection.");
        }

        payload = { data: selectedData };
      } else {
        const row = overtimeData.find((row) => row.id === punchId);
        if (!row) {
          throw new Error("Row not found for punchId: " + punchId);
        }
        if (row.status !== "Pending") {
          throw new Error(`Cannot change status of row with status: ${row.status}`);
        }

        payload = {
          data: [{
            punch_id: row.id,
            work_date: row.date,
            employee_id: row.name,
            extra_hours: row.hours,
            rate: parseFloat(row.rate) || 0,
            project: row.project || "",
            supervisor: row.supervisor || "",
            comments: row.comments || "",
            status: status,
          }],
        };
      }

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
            (isBulk ? selectedRows.includes(row.id) : row.id === punchId) && row.status === "Pending"
              ? { ...row, status }
              : row
          ),
          pendingCount: prev.data.filter((row) => row.status === "Pending").length,
          isVisible: prev.data.filter((row) => row.status === "Pending").length > 0,
        }));
        setSelectedRows([]);
      } else {
        setOvertimeData((prevData) =>
          prevData.map((row) =>
            isBulk && selectedRows.includes(row.id) && row.status === "Pending"
              ? { ...row, status }
              : row.id === punchId && row.status === "Pending"
              ? { ...row, status }
              : row
          )
        );
        setSelectedRows([]);
        setSelectAll(false);
        const { startDate, endDate } = getDateRange(selectedMonth);
        await fetchData(startDate, endDate);
      }
    } catch (error) {
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
    const pendingRows = overtimeData.filter((row) => row.status === "Pending");
    const allPendingSelected = pendingRows.length > 0 && pendingRows.every((row) => selectedRows.includes(row.id));
    setSelectAll(allPendingSelected);
  }, [overtimeData, selectedRows]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(selectedMonth);
    fetchData(startDate, endDate);
  }, [selectedMonth]);

  useEffect(() => {
    checkAprilPending();
  }, []);

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
          disabled={selectedRows.length === 0 || isLoading}
        >
          Approve All
        </button>
        <button
          onClick={handleRejectSelected}
          className="otd-reject-button"
          disabled={selectedRows.length === 0 || isLoading}
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
                    disabled={overtimeData.filter((row) => row.status === "Pending").length === 0}
                  />
                </th>
                <th className="otd-table-header">Date</th>
                <th className="otd-table-header">Employee ID</th>
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
                  <tr key={row.id} className={`otd-table-row ${selectedRows.includes(row.id) ? "otd-selected-row" : ""}`}>
                    <td className="otd-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                        className="otd-checkbox"
                        disabled={row.status !== "Pending"}
                      />
                    </td>
                    <td className="otd-table-cell otd-date-cell">{row.date}</td>
                    <td className="otd-table-cell">{row.name}</td>
                    <td className="otd-table-cell">{row.hours}</td>
                    <td className="otd-table-cell">
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) => handleInputChange(row.id, "rate", e.target.value)}
                        className="otd-input"
                        min="0"
                        step="0.01"
                        disabled={row.status === "Approved" || row.status === "Rejected"}
                      />
                    </td>
                    <td className="otd-table-cell">
                      <input
                        type="text"
                        value={row.project}
                        onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
                        className="otd-input"
                        disabled={row.status === "Approved" || row.status === "Rejected"}
                      />
                    </td>
                    <td className="otd-table-cell">
                      <input
                        type="text"
                        value={row.supervisor}
                        onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value)}
                        className="otd-input"
                        disabled={row.status === "Approved" || row.status === "Rejected"}
                      />
                    </td>
                    <td className="otd-table-cell">
                      <input
                        type="text"
                        value={row.comments}
                        onChange={(e) => handleInputChange(row.id, "comments", e.target.value)}
                        className="otd-input"
                        disabled={row.status === "Approved" || row.status === "Rejected"}
                      />
                    </td>
                    <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                    <td className="otd-table-cell">
                      <div className="otd-action-buttons">
                        <button
                          onClick={() => handleStatusChange(row.id, "Approved")}
                          className="otd-approve"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                        >
                          <svg className="otd-icon" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusChange(row.id, "Rejected")}
                          className="otd-reject"
                          disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
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
            <p className="otd-modal-message">{alertModal.message}</p>
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
                      <th className="otd-table-header">Employee ID</th>
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
                        <tr key={row.id} className="otd-table-row">
                          <td className="otd-table-cell otd-date-cell">{row.date}</td>
                          <td className="otd-table-cell">{row.name}</td>
                          <td className="otd-table-cell">{row.hours}</td>
                          <td className="otd-table-cell">
                            <input
                              type="number"
                              value={row.rate}
                              onChange={(e) => handleInputChange(row.id, "rate", e.target.value, true)}
                              className="otd-input"
                              min="0"
                              step="0.01"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className="otd-table-cell">
                            <input
                              type="text"
                              value={row.project}
                              onChange={(e) => handleInputChange(row.id, "project", e.target.value, true)}
                              className="otd-input"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className="otd-table-cell">
                            <input
                              type="text"
                              value={row.supervisor}
                              onChange={(e) => handleInputChange(row.id, "supervisor", e.target.value, true)}
                              className="otd-input"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className="otd-table-cell">
                            <input
                              type="text"
                              value={row.comments}
                              onChange={(e) => handleInputChange(row.id, "comments", e.target.value, true)}
                              className="otd-input"
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            />
                          </td>
                          <td className={`otd-table-cell status-${row.status.toLowerCase()}`}>{row.status}</td>
                          <td className="otd-table-cell">
                            <div className="otd-action-buttons">
                              <button
                                onClick={() => handleStatusChange(row.id, "Approved", false, true)}
                                className="otd-approve"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
                              >
                                <svg className="otd-icon" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleStatusChange(row.id, "Rejected", false, true)}
                                className="otd-reject"
                                disabled={row.status === "Approved" || row.status === "Rejected" || isLoading}
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
                        <td colSpan="9" className="otd-table-cell otd-no-records">
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
                disabled={isLoading}
              >
                Approve All
              </button>
              <button
                onClick={handleAprilReject}
                className="otd-april-reject-button"
                disabled={isLoading}
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