// import React, { useState, useEffect } from 'react';
// import './LeaveRequest.css';
// import { MdOutlineCancel } from "react-icons/md";

// const LeaveRequest = () => {
//     const [isFormVisible, setFormVisible] = useState(false);
//     const [formData, setFormData] = useState({
//         reason: '',
//         leavetype: 'Casual',
//         Half_or_Fullday: 'Full Day',
//         startDate: '',
//         endDate: '',
//     });
//     const [leaveRequests, setLeaveRequests] = useState([]);

//     const API_KEY = process.env.REACT_APP_API_KEY;
//     const authToken = localStorage.getItem('authToken');

//     // Retrieve employee details from local storage
//     const employeeData = JSON.parse(localStorage.getItem('dashboardData'));
//     const employeeId = employeeData?.employeeId;
//     const name = employeeData?.name;

//     useEffect(() => {
//         if (employeeId) {
//             fetchLeaveRequests();
//         }
//     }, [employeeId]);

//     const fetchLeaveRequests = async () => {
//         try {
//             const response = await fetch(`http://localhost:5000/employee/leave/${employeeId}`, {
//                 headers: {
//                     'x-api-key': API_KEY,
//                     'Authorization': `Bearer ${authToken}`,
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setLeaveRequests(data);
//             } else {
//                 console.error('Failed to fetch leave requests');
//             }
//         } catch (error) {
//             console.error('Error fetching leave requests:', error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!employeeId || !name) {
//             alert("Employee data not found. Please log in again.");
//             return;
//         }

//         const startDate = new Date(formData.startDate);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Normalize today's date

//         const daysDifference = (startDate - today) / (1000 * 60 * 60 * 24);

//         if ((formData.leavetype === 'Casual' || formData.leavetype === 'Vacation') && daysDifference < 3) {
//             alert('Casual and Vacation leaves must be applied at least 3 days in advance.');
//             return;
//         }

//         const requestData = {
//             employeeId,
//             name,
//             ...formData,
//         };

//         try {
//             const response = await fetch('http://localhost:5000/employee/leave', {
//                 method: 'POST',
//                 headers: {
//                     'x-api-key': API_KEY,
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${authToken}`,
//                 },
//                 body: JSON.stringify(requestData),
//             });

//             if (response.ok) {
//                 alert('Leave request submitted successfully!');
//                 setFormVisible(false);
//                 setFormData({
//                     reason: '',
//                     leavetype: 'Casual',
//                     Half_or_Fullday: 'Full Day',
//                     startDate: '',
//                     endDate: '',
//                 });
//                 fetchLeaveRequests();
//             } else {
//                 alert('Failed to submit leave request.');
//             }
//         } catch (error) {
//             console.error("Error submitting leave request:", error);
//             alert('An error occurred. Please try again.');
//         }
//     };

//     return (
//         <div className="container">
//             <button className="open-form-button" onClick={() => setFormVisible(true)}>Leave Request</button>
//             {isFormVisible && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <div className="header">
//                             <h2>Leave Request Form</h2>
//                             <MdOutlineCancel className="icon" onClick={() => setFormVisible(false)} />
//                         </div>
//                         <form className="form" onSubmit={handleSubmit}>
//                             <div>
//                                 <label>Type of Leave</label>
//                                 <select name="leavetype" value={formData.leavetype} onChange={handleChange}>
//                                     <option value="Casual">Casual</option>
//                                     <option value="Sick">Sick</option>
//                                     <option value="Vacation">Vacation</option>
//                                     <option value="Other">Other</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Leave Start Date</label>
//                                 <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
//                             </div>
//                             <div>
//                                 <label>Leave End Date</label>
//                                 <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
//                             </div>
//                             <div>
//                                 <label>Half or Full Day Leave</label>
//                                 <select name="Half_or_Fullday" value={formData.Half_or_Fullday} onChange={handleChange}>
//                                     <option value="Full Day">Full Day</option>
//                                     <option value="Half Day">Half Day</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label>Leave Reason</label>
//                                 <input type="text" name="reason" value={formData.reason} onChange={handleChange} required />
//                             </div>
//                             <div></div>
//                             <div></div>
//                             <div>
//                                 <button type="button" className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
//                             </div>
//                             <div>
//                                 <button type="submit" className="save">Save</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <div className="leave-requests">
//                 <h2>Your Leave Requests</h2>
//                 {leaveRequests.length === 0 ? (
//                     <p>No leave requests found.</p>
//                 ) : (
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Leave Type</th>
//                                 <th>Start Date</th>
//                                 <th>End Date</th>
//                                 <th>Half/Full Day</th>
//                                 <th>Reason</th>
//                                 <th>Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leaveRequests.map((request, index) => (
//                                 <tr key={index}>
//                                     <td>{request.leavetype}</td>
//                                     <td>{request.startDate}</td>
//                                     <td>{request.endDate}</td>
//                                     <td>{request.Half_or_Fullday}</td>
//                                     <td>{request.reason}</td>
//                                     <td>{request.status}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LeaveRequest;



import React, { useState, useEffect } from 'react';
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
    const [leaveRequests, setLeaveRequests] = useState([]);

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
            const response = await fetch(`http://localhost:5000/employee/leave/${employeeId}`, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            if (response.ok) {
                const result = await response.json();
    
                // Extract the 'data' field from the API response
                if (result && result.status === "success" && Array.isArray(result.data)) {
                    setLeaveRequests(result.data);
                } else {
                    console.error("Unexpected API response format:", result);
                    setLeaveRequests([]); // Fallback to an empty array
                }
            } else {
                console.error('Failed to fetch leave requests. HTTP status:', response.status);
                setLeaveRequests([]);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setLeaveRequests([]); // Fallback to an empty array
        }
    };
    

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
                fetchLeaveRequests();
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

            <div className="leave-requests">
                <h2>Your Leave Requests</h2>
                {leaveRequests.length === 0 ? (
                    <p>No leave requests found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Leave Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Half/Full Day</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
    {leaveRequests.map((request) => (
        <tr key={request.id}>
            <td>{request.leave_type}</td>
            <td>{new Date(request.start_date).toLocaleDateString()}</td>
            <td>{new Date(request.end_date).toLocaleDateString()}</td>
            <td>{request.Half_or_Fullday || "Full Day"}</td>
            <td>{request.reason}</td>
            <td>{request.status}</td>
        </tr>
    ))}
</tbody>

                    </table>
                )}
            </div>
        </div>
    );
};

export default LeaveRequest;
