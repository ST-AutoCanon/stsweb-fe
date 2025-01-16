import React, { useState } from 'react';
import './LeaveRequest.css';
import { MdOutlineCancel } from "react-icons/md";

const LeaveRequest = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        leavetype: 'Casual',
        Half_or_Fullday: 'Full Day',
        startDate: '',
        endDate: '',
    });

    const API_KEY = process.env.REACT_APP_API_KEY;
    const authToken = localStorage.getItem('authToken');

    // Retrieve employee details from local storage
    const employeeData = JSON.parse(localStorage.getItem('dashboardData'));
    const employeeId = employeeData?.employeeId;
    const name = employeeData?.name;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId || !name) {
            alert("Employee data not found. Please log in again.");
            return;
        }

        const requestData = {
            employeeId,
            name,
            ...formData,
        };

        try {
            const response = await fetch('http://localhost:5000/employee/leave', {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                alert('Leave request submitted successfully!');
                setFormVisible(false);
                setFormData({
                    reason: '',
                    leavetype: 'Casual',
                    Half_or_Fullday: 'Full Day',
                    startDate: '',
                    endDate: '',
                });
            } else {
                alert('Failed to submit leave request.');
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <button className="open-form-button" onClick={() => setFormVisible(true)}>Leave Request</button>
            {isFormVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header">
                            <h2>Leave Request Form</h2>
                            <MdOutlineCancel className="icon" onClick={() => setFormVisible(false)} />
                        </div>
                        {/* Attach the onSubmit handler to the form */}
                        <form className="form" onSubmit={handleSubmit}>
                            <div>
                                <label>Type of Leave</label>
                                <select name="leavetype" value={formData.leavetype} onChange={handleChange}>
                                    <option value="Casual">Casual</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label>Leave Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Leave End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Half or Full Day Leave</label>
                                <select name="Half_or_Fullday" value={formData.Half_or_Fullday} onChange={handleChange}>
                                    <option value="Full Day">Full Day</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </div>
                            <div>
                                <label>Leave Reason</label>
                                <input type="text" name="reason" value={formData.reason} onChange={handleChange} required />
                            </div>
                            <div></div>
                            <div></div>
                            <div>
                                <button type="button" className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
                                </div>
                            <div>
                                <button type="submit" className="save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequest;
