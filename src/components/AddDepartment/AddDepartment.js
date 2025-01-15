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
        <div className="add-department">
            <h2>Departments</h2>
            <ul className="department-list">
                {departments.length > 0 ? (
                    departments.map((dept) => (
                        <li key={dept.id}>{dept.name}</li>
                    ))
                ) : (
                    <p>No departments found</p>
                )}
            </ul>
            <h2>Add Department</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Department Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddDepartment;
