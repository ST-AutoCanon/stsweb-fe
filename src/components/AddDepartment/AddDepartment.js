import React, { useState, useEffect } from 'react';
import './AddDepartment.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

const API_KEY = process.env.REACT_APP_API_KEY;

const AddDepartment = () => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(null);
    const [message, setMessage] = useState('');
    const [departments, setDepartments] = useState([]);
    const [showPopup, setShowPopup] = useState(false); 

    // Fetch existing departments
    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/departments`, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY,
                },
            });

            const result = await response.json();
            if (response.ok) {
                const departmentsWithImages = await Promise.all(result.departments.map(async (dept) => {
                    if (dept.icon) {
                        try {
                            const imgResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}${dept.icon}`, {
                                headers: {
                                    'x-api-key': API_KEY,
                                },
                            });

                            if (imgResponse.ok) {
                                const blob = await imgResponse.blob();
                                dept.iconUrl = URL.createObjectURL(blob);
                            } else {
                                dept.iconUrl = '/default-icon.png'; // Fallback image
                            }
                        } catch (error) {
                            console.error('Error fetching image:', error);
                            dept.iconUrl = '/default-icon.png';
                        }
                    }
                    return dept;
                }));

                setDepartments(departmentsWithImages);
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
        if (!icon) {
            setMessage('Please upload an icon');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('icon', icon); // Ensure file is appended properly
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/departments/add`, {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                },
                body: formData,
            });
    
            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                setName('');
                setIcon(null);
                setShowPopup(false); 
                fetchDepartments();
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
            <div className="dp-header">
                <h2>Add Department</h2>
                <button className='add-dp' onClick={() => setShowPopup(true)}>
                    <i className="add-icon">+</i> <span>Add Department</span>
                </button>
            </div>

            <div className="department-section">
                <div className="department-list">
                    {/* Existing Departments */}
                    {departments.length > 0 ? (
                        departments.map((dept) => (
                            <div key={dept.id} className="department-card">
                                {dept.iconUrl ? (
                                    <img src={dept.iconUrl} alt={dept.name} className="department-icon" />
                                ) : (
                                    <img src="/default-icon.png" alt="Default" className="department-icon" />
                                )}
                                <div className='dp-name'>{dept.name}</div>
                            </div>
                        ))
                    ) : (
                        <p>No departments found</p>
                    )}

                    {/* Add New Department Card - Opens Popup */}
                    <div className="add-new" onClick={() => setShowPopup(true)}>
                        <div className="addDp-name"><IoMdAddCircleOutline className='dp-icon' /> Add new <br/> Department</div>
                    </div>
                </div>
            </div>

            {/* 🔹 Pop-up Form for Adding a New Department */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className='popup-header'>
                        <h3>Add New Department</h3>
                        <MdOutlineCancel className="close-popup" onClick={() => setShowPopup(false)} />
                        </div>
                        <form className='dp-form' onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="input-group">
                                <label>Department Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Department Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="name-input"
                                />
                                </div>
                                <div className="input-group">
                                <div className="file-upload">
                                <label>Upload Icon</label>
                                <div className="file-input-container">
                                <input
                                type="text"
                                value={icon ? icon.name : ""}
                                placeholder="Select Icon"
                                readOnly
                                className="file-name-input"
                                />
                                <label htmlFor="fileInput" className="custom-file-button">
                                Upload Icon
                                </label>
                                <input type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    onChange={(e) => setIcon(e.target.files[0])}
                                    style={{ display: 'none' }} // Hide default file input
                                    />
                                    </div>
                                </div>
                                <button className='dp-cancel' onClick={() => setShowPopup(false)}>Cancel</button>
                                <button className='add-button' type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddDepartment;
