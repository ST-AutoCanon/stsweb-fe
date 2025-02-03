import React, { useState, useEffect } from 'react';
import './AddDepartment.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const authToken = localStorage.getItem('authToken');

const AddDepartment = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [departments, setDepartments] = useState([]);

    // Fetch existing departments
    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://localhost:5000/departments', {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                setDepartments(result.departments);
            } else {
                setMessage(result.message || 'Failed to fetch departments');
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setMessage('An error occurred');
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setMessage('Department name is required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/departments/add', {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                setName('');
                fetchDepartments(); // Refresh the department list
            } else {
                setMessage(result.message || 'Failed to add department');
            }
        } catch (error) {
            console.error('Error adding department:', error);
            setMessage('An error occurred');
        }
    };

    return (
        <div className="department-container">
            <div className="add-department">
                <div className="header">
                    <h2>Manage Departments</h2>
                    <p>Add, view, and manage all departments efficiently</p>
                </div>

                <div className="department-section">
                    <h3>Existing Departments</h3>
                    <div className="department-list">
                        {departments.length > 0 ? (
                            departments.map((dept) => (
                                <div key={dept.id} className="department-card">
                                    <span>{dept.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>No departments found</p>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Add New Department</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Department Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button className='add-button' type="submit">Add</button>
                        </div>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
