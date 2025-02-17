import React, { useState, useEffect } from 'react';
import './LeaveRequest.css';
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const LeaveRequest = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        leavetype: 'Casual',
        h_f_day: 'Full Day',
        startDate: '',
        endDate: '',
    });
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filters, setFilters] = useState({ from_date: '', to_date: '' });
    const [editingId, setEditingId] = useState(null);

    const API_KEY = process.env.REACT_APP_API_KEY;
    const authToken = localStorage.getItem('authToken');

    // Retrieve employee details from local storage
    const employeeData = JSON.parse(localStorage.getItem('dashboardData'));
    const employeeId = employeeData?.employeeId;
    const name = employeeData?.name;

    useEffect(() => {
        if (employeeId) {
            fetchLeaveRequests();
        }
    }, [employeeId]);

    const fetchLeaveRequests = async () => {
        try {
            let url = `http://122.166.77.12:5000/employee/leave/${employeeId}`;
            if (filters.from_date || filters.to_date) {
                const params = new URLSearchParams();
                if (filters.from_date) params.append("from_date", filters.from_date);
                if (filters.to_date) params.append("to_date", filters.to_date);
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result?.status === "success" && Array.isArray(result.message)) {
                    setLeaveRequests(result.message);
                } else {
                    setLeaveRequests([]);
                }
            } else {
                setLeaveRequests([]);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setLeaveRequests([]);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchLeaveRequests();
    };

    // Handle form submission for both new and edited requests
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!employeeId || !name) {
            alert("Employee data not found. Please log in again.");
            return;
        }

        const startDate = new Date(formData.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date

        const daysDifference = (startDate - today) / (1000 * 60 * 60 * 24);

        if ((formData.leavetype === 'Casual' || formData.leavetype === 'Vacation') && daysDifference < 3) {
            alert('Casual and Vacation leaves must be applied at least 3 days in advance.');
            return;
        }

        const requestData = {
            employeeId,
            name,
            ...formData,
        };

        const url = editingId
            ? `http://122.166.77.12:5000/edit/${editingId}`
            : `http://122.166.77.12:5000/employee/leave`;

        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    employeeId,
                    ...formData,
                }),
            });

            if (response.ok) {
                alert(editingId ? "Leave request updated successfully!" : "Leave request submitted successfully!");
                setFormVisible(false);
                setEditingId(null);
                setFormData({
                    reason: '',
                    leavetype: 'Casual',
                    h_f_day: 'Full Day',
                    startDate: '',
                    endDate: '',
                });
                fetchLeaveRequests();
            } else {
                console.error("Failed to submit leave request.");
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
        }
    };

    const handleEdit = (request) => {
        setFormData({
            reason: request.reason,
            leavetype: request.leave_type,
            h_f_day: request.h_f_day || "Full Day",
            startDate: request.start_date ? request.start_date.split("T")[0] : "",
            endDate: request.end_date ? request.end_date.split("T")[0] : "",
        });
        setEditingId(request.id);
        setFormVisible(true);
    };

    // Handle cancel (delete) request
    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this leave request?")) {
            try {
                const response = await fetch(`http://122.166.77.12:5000/cancel/${id}/${employeeId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    alert("Leave request cancelled successfully!");
                    fetchLeaveRequests();
                } else {
                    console.error("Failed to cancel leave request.");
                }
            } catch (error) {
                console.error("Error cancelling leave request:", error);
            }
        }
    };

    return (
        <div className="leave-container">
            <div className="leave-header">
                <h3 className="leave-queries-title">Leave Queries</h3>
            </div>

            <div className='leave-filters'>
                <label>Date</label>
                <label>From:</label>
                <input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} className="date-filter-input" />
                <label>To:</label>
                <input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} className="date-filter-input" />
                <button className="filter-button" onClick={handleFilterSubmit}><IoSearch /> Search</button>
                <button className="leave-form-button" onClick={() => setFormVisible(true)}>Leave Request</button>
            </div>

            {isFormVisible && (
                <div className="leave-modal">
                    <div className="leave-modal-content">
                    <form className="leave-form" onSubmit={handleSubmit}>
                        <div className="leave-form-header">
                            <h2>Leave Request Form</h2>
                            <MdOutlineCancel className="icon" onClick={() => setFormVisible(false)} />
                        </div>
                            <div className='leave-form-grid'>
                            <div className='leave-form-group'>
                                <label>Type of Leave</label>
                                <select name="leavetype" value={formData.leavetype} onChange={handleInputChange}>
                                    <option value="Casual">Casual</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className='leave-form-group'>
                                <label>Leave Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                            </div>
                            <div className='leave-form-group'>
                                <label>Leave End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                            </div>

                            <div className='leave-form-group'>
                                <label>Half or Full Day Leave</label>
                                <select name="h_f_day" value={formData.h_f_day} onChange={handleInputChange}>
                                    <option value="Full Day">Full Day</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </div>

                            <div className='leave-form-group'>
                                <label>Leave Reason</label>
                                <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} required />
                            </div>
                            </div>
                            <div className="leave-form-actions">
                                <button type="button" className="leave-cancel" onClick={() => setFormVisible(false)}>Cancel</button>
                                <button type="submit" className="leave-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <div className='leave-request-table'>
                <table className='leave-requests'>
                <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Half/Full Day</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Comments</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {leaveRequests
        .sort((a, b) => b.id - a.id) // Sort in descending order
        .map((request) => {
            const isPending = request.status.toLowerCase() === "pending";

        return (
            <tr key={request.id}>
                <td>{request.leave_type}</td>
                <td>{request.start_date.split("T")[0]}</td>
                <td>{request.end_date.split("T")[0]}</td>
                <td>{request.h_f_day || "Full Day"}</td>
                <td>{request.reason}</td>
                <td 
                    className={
                        request.status.toLowerCase() === "approved" ? "status-approved" :
                        request.status.toLowerCase() === "rejected" ? "status-rejected" :
                        "status-pending"
                    }
                >
                    {request.status}
                </td>
                <td>{request.comments}</td>
                <td>
                    <MdOutlineEdit 
                        className={`button-edit ${!isPending ? "button-disabled" : ""}`} 
                        onClick={() => isPending && handleEdit(request)}
                    />
                    <MdDeleteOutline 
                        className={`button-delete ${!isPending ? "button-disabled" : ""}`} 
                        onClick={() => isPending && handleCancel(request.id)}
                    />
                </td>
            </tr>
        );
    })}
</tbody>

                </table>
            </div>
        </div>
    );
};

export default LeaveRequest;
