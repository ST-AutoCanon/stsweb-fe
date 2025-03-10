
import React, { useEffect, useState } from "react";
import "./RbAdmin.css";
import { MdOutlineRemoveRedEye, MdOutlineCancel } from "react-icons/md";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaFileInvoice } from "react-icons/fa6";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";

const RbAdmin = () => {
    const [employees, setEmployees] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [attachments, setAttachments] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedFiles, setSelectedFiles] = useState([]);
      const [selectedClaim, setSelectedClaim] = useState(null);
      const [statusUpdates, setStatusUpdates] = useState({});
      const [comments, setComments] = useState({});
      const [statusFilter, setStatusFilter] = useState("pending"); // Default to "pending"
      const employeeData = JSON.parse(localStorage.getItem('dashboardData'));
      const employeeId = employeeData?.employee_id;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reimbursements`, {
                headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY,
                },
                params: { fromDate, toDate } // Send the date filter as query parameters
            });
    
            setEmployees(response.data);
    
            const attachmentsMap = {};
            response.data.forEach((employee) => {
                employee.claims.forEach((claim) => {
                    attachmentsMap[claim.id] = claim.attachments || [];
                });
            });
    
            setAttachments(attachmentsMap);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    
    
    const toggleRow = (employeeId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [employeeId]: !prev[employeeId],
        }));
    };

    const handleOpenAttachments = async (files, claim) => {
        try {
            if (!files || files.length === 0) {
                alert("No attachments available.");
                return;
            }
    
            const authToken = localStorage.getItem("token"); // Retrieve auth token
    
            const fetchedFiles = await Promise.all(
                files.map(async (file) => {
                    if (!file?.filename) return null;
    
                    // Extract year and month from filename (format: YYYY-MM-DD_XX.png)
                    const match = file.filename.match(/^(\d{4})-(\d{2})-\d{2}/); // Extract YYYY-MM
                    if (!match) return null;
    
                    const year = match[1]; // Extracted year
                    const month = match[2]; // Extracted month
                    const employeeId = claim.employee_id; // Employee ID from claim
    
                    // Construct the correct URL
                    const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${year}/${month}/${employeeId}/${file.filename}`;
    
                    const response = await axios.get(fileUrl, {
                        headers: {
                            "x-api-key": process.env.REACT_APP_API_KEY,
                            Authorization: `Bearer ${authToken}`,
                        },
                        responseType: "blob",
                    });
    
                    return {
                        name: file.filename,
                        url: URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] })),
                    };
                })
            );
    
            setSelectedFiles(fetchedFiles.filter(Boolean)); // Remove null values
            setSelectedClaim(claim);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching attachments:", error);
            alert("Failed to load attachments.");
        }
    };  
    
    const totalAmount = employees.reduce(
        (sum, employee) =>
            sum +
            employee.claims.reduce((claimSum, claim) => claimSum + parseFloat(claim.total_amount || 0), 0),
        0
    );
    
    const approvedAmount = employees.reduce(
        (sum, employee) =>
            sum +
            employee.claims
                .filter((claim) => claim.status === "approved")
                .reduce((claimSum, claim) => claimSum + parseFloat(claim.total_amount || 0), 0),
        0
    );

    const handleStatusChange = (id, value) => {
        setStatusUpdates((prev) => ({ ...prev, [id]: value }));
    };

    const updateStatus = async (id) => {
        if (!statusUpdates[id]) {
            alert("Please select a status.");
            return;
        }
    
        const updatedStatus = statusUpdates[id];
        const approverComment = comments?.[id] || ""; 
    
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/reimbursement/status/${id}`, 
                {
                    status: updatedStatus,
                    approver_comments: approverComment,
                    approver_id: employeeId,
                },
                {
                    headers: {
                        "x-api-key": process.env.REACT_APP_API_KEY,
                    },
                }
            );
    
            alert(`Reimbursement ${updatedStatus} successfully.`);
    
            // ✅ Update employees state after status change
            setEmployees((prevEmployees) =>
                prevEmployees.map((emp) => ({
                    ...emp,
                    claims: emp.claims.map((claim) =>
                        claim.id === id ? { ...claim, status: updatedStatus, approver_comments: approverComment } : claim
                    ),
                }))
            );
        } catch (error) {
            console.error("Error updating reimbursement status:", error);
            alert("Failed to update status.");
        }
    };
    
    const handleDownloadPDF = async (claim) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/download/${claim.id}`, {
                headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY,
                },
                responseType: "blob",
            });
    
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Reimbursement_${claim.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading reimbursement PDF:", error);
            alert("Failed to download file.");
        }
    };
    
    
    return (
        <div className="rb-admin">
            <h2>Reimbursement Requests</h2>
            {/* Filter Section */}
            <div className="rb-filters">
            <div className="rb-filter-group">
        <label>Status By</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
                <div className="rb-filter-group">
                    <label>From Date:</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="rb-filter-group">
                    <label>To Date:</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <button className="rb-search" onClick={fetchEmployees}>
                    <FaSearch /> Search
                </button>
            </div>
            {/* Employee List */}
<div className="rb-atable-container">
    {employees.map((employee) => {
        const filteredClaims = employee.claims.filter((rb) => rb.status.toLowerCase() === statusFilter.toLowerCase());
        if (filteredClaims.length === 0) return null; // Skip employees with no matching claims
        return (
            <div key={employee.employee_id} className="employee-section">
                {/* Employee Row */}
                <div className="employee-row" onClick={() => toggleRow(employee.employee_id)}>
                    <div className="empId-rows">
                        Employee ID - <span>{employee.employee_id}</span>
                    </div>
                    <div className="emp-rows">
                        Total Amount Claiming: Rs{" "}
                        <span>
                            {filteredClaims.reduce((sum, claim) => sum + parseFloat(claim.total_amount || 0), 0).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="emp-rows">
                        Amount Approved: Rs{" "}
                        <span>
                            {filteredClaims
                                .filter((claim) => claim.status === "approved")
                                .reduce((sum, claim) => sum + parseFloat(claim.total_amount || 0), 0)
                                .toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="toggle-btn">
                        {expandedRows[employee.employee_id] ? (
                            <FaChevronUp className="drop-icon" />
                        ) : (
                            <FaChevronDown className="drop-icon" />
                        )}
                    </div>
                </div>
                {/* Expanded Reimbursement Table */}
                {expandedRows[employee.employee_id] && (
                    <div className="rb-sub-container">
                        <table className="rb-sub-table">
                            <thead>
                                <tr>
                                    <th>Sl No</th>
                                    <th>Claim Type</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Attachments</th>
                                    <th>Status</th>
                                    <th>Approver Comments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClaims.map((rb, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rb.claim_type}</td>
                                        <td>
                                            {rb.date_range
                                                ? rb.date_range
                                                      .split(" - ")
                                                      .map((date) =>
                                                          new Date(date).toLocaleDateString("en-GB", {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          })
                                                      )
                                                      .join(" - ")
                                                : rb.date
                                                ? new Date(rb.date).toLocaleDateString("en-GB", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                  })
                                                : "N/A"}
                                        </td>
                                        <td>₹{rb.total_amount}</td>
                                        <td>
                                            {attachments[rb.id] && attachments[rb.id].length > 0 ? (
                                                <button
                                                    className="attachments-btn"
                                                    onClick={() => handleOpenAttachments(attachments[rb.id], rb)}
                                                >
                                                    <MdOutlineRemoveRedEye className="eye-icon" /> View
                                                </button>
                                            ) : (
                                                "No Attachments"
                                            )}
                                        </td>
                                        <td>
  {rb.status === "approved" || rb.status === "rejected" ? (
    <span className={`status-label ${rb.status}`}>
      <span className="status-dot"></span>
      {rb.status.charAt(0).toUpperCase() + rb.status.slice(1)}
    </span>
  ) : (
    <select 
      className="rb-status-dropdown"
      value={statusUpdates[rb.id] || rb.status}
      onChange={(e) => handleStatusChange(rb.id, e.target.value)}
    >
      <option value="">Pending</option>
      <option value="approved">Approve</option>
      <option value="rejected">Reject</option>
    </select>
  )}
</td>

<td>
    {(rb.status === "approved" || rb.status === "rejected") ? (
        <div className="rbadmin-comments" title={rb.approver_comments}>
            {rb.approver_comments || "No comments"}
        </div>
    ) : (
        <input
            type="text"
            placeholder="Enter comments"
            value={comments[rb.id] || ""}
            onChange={(e) => setComments((prev) => ({ ...prev, [rb.id]: e.target.value }))}
        />
    )}
</td>


                                        <td>
                                            <FaFileInvoice size={24}
                                            className="update-btn" 
                                            onClick={() => updateStatus(rb.id)} 
                                            disabled={rb.status === "approved" || rb.status === "rejected"}/>
                                            <FiDownload size={24} 
                                            className="download-btn" onClick={() => handleDownloadPDF(rb)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    })}
</div>
            {/* Modal for Attachments */}
                  {isModalOpen && (
                            <div className="att-modal-overlay">
                                <div className="att-modal-content">
                                    <div className="att-header">
                                    <h2>Attachments</h2>
                                    <MdOutlineCancel className="att-close" onClick={() => setIsModalOpen(false)}/>
                                      </div>
                                      <h4 className="att-files">{selectedClaim?.claim_type ? `${selectedClaim.claim_type} Bills` : "Bills"}</h4>
                                    {selectedFiles.length > 0 ? (
                                        selectedFiles.map((file, index) => (
                                            <div className="att-files" key={index}>
                                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                    {file.name}
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No attachments available</p>
                                    )}
                                    <button className="att-close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                                </div>
                            </div>
                        )}
        </div>
    );
};

export default RbAdmin;

