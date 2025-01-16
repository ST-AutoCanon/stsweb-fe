import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import './EmployeeDetails.css'; // Assuming your styles are in this file
import { MdOutlineCalendarToday, MdOutlineEdit, MdDeleteOutline, MdOutlineCancel } from "react-icons/md";
import { PiAsteriskSimpleBold } from "react-icons/pi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const departmentPositions = {
  Software: ['Software Manager', 'Senior Software Engineer', 'Software Test Engineer', 'Junior Software Engineer'],
  Homologation: ['Homologation Specialist', 'Homologation Manager'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Design Manager'],
  Network: ['Network Manager', 'Network Engineer', 'System Administrator', 'Network Analyst'],
  Finance: ['Finance Manager', 'Accountant', 'Financial Analyst'],
};

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    aadhaar_number: '',
    pan_number: '',
    address: '',
    phone_number: '',
    father_name: '',
    mother_name: '',
    department: '',
    position: '',
    salary: '',
    photo: null,
  });
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormModalVisible, setFormModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to show/hide the modal
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);


  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const requiredFields = [
      'first_name',
      'last_name',
      'dob',
      'email',
      'aadhaar_number',
      'pan_number',
      'phone_number',
    ];
    const isValid = requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ''
    );
    setIsFormValid(isValid);
  }, [formData]);

  // Fetch all employees or search results based on the search term
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const formattedFromDate = fromDate
          ? new Date(fromDate).toISOString().split('T')[0]
          : '';
        const formattedToDate = toDate
          ? new Date(toDate).toISOString().split('T')[0]
          : '';

        const response = await axios.get(
          `http://localhost:5000/admin/employees?search=${searchTerm}&fromDate=${formattedFromDate}&toDate=${formattedToDate}`,
          {
            headers: {
              'x-api-key': API_KEY,
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data && response.data.message && response.data.message.data) {
          setEmployees(response.data.message.data);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        setError('Failed to fetch employees. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [searchTerm, fromDate, toDate]);

  const handleDateChange = (date, type) => {
    if (type === 'from') setFromDate(date);
    if (type === 'to') setToDate(date);
  };
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Reset position if department changes
    if (name === 'department') {
      setFormData({ ...formData, [name]: value, position: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validation functions
const validateText = (value) => /^[A-Za-z\s]+$/.test(value); // Only alphabets and spaces
const validateNumbers = (value) => /^\d+$/.test(value); // Only numbers
const validatePAN = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value); // Specific PAN format
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Email format

const handleAddEmployee = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Input validation
  if (!validateText(formData.first_name)) {
    alert('First name should only contain alphabets.');
    setIsLoading(false);
    return;
  }

  if (!validateText(formData.last_name)) {
    alert('Last name should only contain alphabets.');
    setIsLoading(false);
    return;
  }

  if (!validateNumbers(formData.phone_number)) {
    alert('Phone number should contain only digits.');
    setIsLoading(false);
    return;
  }

  if (!validateNumbers(formData.aadhaar_number)) {
    alert('Aadhaar number should contain only digits.');
    setIsLoading(false);
    return;
  }

  if (!validatePAN(formData.pan_number)) {
    alert('PAN number is not valid. It should be in the format ABCDE1234F.');
    setIsLoading(false);
    return;
  }

  if (!validateEmail(formData.email)) {
    alert('Email format is not valid.');
    setIsLoading(false);
    return;
  }

  try {
    const uploadData = new FormData();
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    await axios.post('http://localhost:5000/admin/employees', formData, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    setFormData({
      first_name: '',
      last_name: '',
      father_name: '',
      mother_name: '',
      dob: '',
      email: '',
      aadhaar_number: '',
      pan_number: '',
      address: '',
      phone_number: '',
      department: '',
      position: '',
      salary: '',
      photo: null,
    });

    setFormModalVisible(false); // Hide form after adding employee
    alert('Employee added successfully. A password reset email has been sent.');
  } catch (err) {
    console.log(err);
    setError('Failed to add employee');
  } finally {
    setIsLoading(false);
  }
};

  const handleEditEmployee = async (employeeId) => {
    try {
      // Fetch employee details from the backend API
      const response = await axios.get(`http://localhost:5000/employee/${employeeId}`, {
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      const employee = response?.data?.data;
  
      if (!employee) {
        alert('Employee data not found');
        return;
      }
  
      // Set form data with employee details
      setFormData({
        employee_id: employee.employee_id,
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        dob: employee.dob || '',
        email: employee.email || '',
        aadhaar_number: employee.aadhaar_number || '',
        pan_number: employee.pan_number || '',
        address: employee.address || '',
        phone_number: employee.phone_number || '',
        father_name: employee.father_name || '',
        mother_name: employee.mother_name || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        photo: employee.photo_url || null,
        role: employee.role || '',
      });
      console.log(employee.dob);
      setEditModalVisible(true); // Set edit mode to true
      setEmployeeToEdit(true);
    } catch (err) {
      console.error('Error fetching employee:', err);
      alert(err.response?.data?.message || 'Failed to fetch employee details.');
    }
  };
  

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Format the `dob` field to ensure it's in `YYYY-MM-DD` format
    const updatedFormData = {
      ...formData,
      dob: formData.dob ? formData.dob.split('T')[0] : '', // Strip any time portion
    };
  
    try {
      await axios.put(
        `http://localhost:5000/admin/employees/${formData.employee_id}`,
        updatedFormData,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
  
      setEditModalVisible(false); // Hide edit modal after updating employee
      setEmployeeToEdit(false);
      alert('Employee updated successfully.');
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.message || 'Failed to update employee');
      alert(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Handle delete employee action
  const handleDeleteEmployee = async () => {
    if (!deleteEmployeeId) return;

    try {
      await axios.delete(`http://localhost:5000/admin/employees/${deleteEmployeeId}`, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setEmployees(employees.filter((employee) => employee.employee_id !== deleteEmployeeId));
      setDeleteEmployeeId(null);
    } catch (err) {
      setError('Failed to delete employee');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <div className="employee-details-container">
      <div class="header-container">
      <h2 class="header-title">Employee Details</h2>
      <Modal
        className="confirm-deletion-modal"
        isVisible={modalVisible}
        buttons={[
        {
        label: 'Cancel',
        onClick: () => setModalVisible(false),
        className: 'modal-cancel-button',
        },
        {
        label: 'Delete',
        onClick: handleDeleteEmployee,
        className: 'modal-delete-button',
        }, ]}>
        <h2 className="header-title">Confirm Deletion</h2>
        <p>Are you sure you want to delete this employee?</p>
      </Modal>

      {/* Search Employee */}
      <div class="search-container">
  <div class="search-box">
    <input
      type="text"
      class="search-input"
      placeholder="by Name, Email ID or Dept"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <i className="fas fa-search search-icon"></i>
  </div>
</div>
<div className="calendar-buttons">
  {/* FROM Button */}
  <button
    className="calendar-button"
    onClick={() => setShowFromDatePicker(!showFromDatePicker)}
  >
    <MdOutlineCalendarToday className="calendar-icon" />
    <span className="calendar-text">FROM</span>
  </button>

  {showFromDatePicker && (
    <DatePicker
      selected={fromDate ? new Date(fromDate) : null}
      onChange={(date) => {
        handleDateChange(date, 'from');
        setShowFromDatePicker(false); // Close the calendar after selecting a date
      }}
      dateFormat="yyyy-MM-dd"
      inline
    />
  )}

  {/* TO Button */}
  <button
    className="calendar-button"
    onClick={() => setShowToDatePicker(!showToDatePicker)}
  >
    <MdOutlineCalendarToday className="calendar-icon" />
    <span className="calendar-text">TO</span>
  </button>

  {showToDatePicker && (
    <DatePicker
      selected={toDate ? new Date(toDate) : null}
      onChange={(date) => {
        handleDateChange(date, 'to');
        setShowToDatePicker(false); // Close the calendar after selecting a date
      }}
      dateFormat="yyyy-MM-dd"
      inline
    />
  )}
</div>

      {/* Add Employee Button */}
      <div className="actions-container">
      <button onClick={() => {
      setFormData({
        first_name: '',
        last_name: '',
        father_name: '',
        mother_name: '',
        dob: '',
        email: '',
        aadhaar_number: '',
        pan_number: '',
        address: '',
        phone_number: '',
        department: '',
        position: '',
        salary: '',
        photo: null,
      }); // Reset form data
      setFormModalVisible(true); // Show the form modal
    }} className="add-employee-button">
        <i className="add-icon">+</i>
        <span>Add New Employee</span>
        </button>
      </div>
      </div>
{/* Add Employee Form */}
{isFormModalVisible && (
  <Modal isVisible={isFormModalVisible} buttons={[]}>
  <form className="employee-form" onSubmit={handleAddEmployee}>
    <div className="form-header">
    <h3 class="form-header-title">Add New Employee</h3>
    <MdOutlineCancel className="cancel-icon" onClick={() => setFormModalVisible(false)} />
    </div>
    <div className="form-grid">
      <div className="form-group">
        <label>First Name<PiAsteriskSimpleBold className="asterisk"/> </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name<PiAsteriskSimpleBold className="asterisk"/> </label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date of Birth<PiAsteriskSimpleBold className="asterisk"/> </label>
        <input
          type="date"
          name="dob"
          value={formData.dob || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email<PiAsteriskSimpleBold className="asterisk"/> </label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Father Name</label>
        <input
          type="text"
          name="father_name"
          value={formData.father_name || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Mother Name</label>
        <input
          type="text"
          name="mother_name"
          value={formData.mother_name || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Aadhaar No<PiAsteriskSimpleBold className="asterisk"/> </label>
        <input
          type="text"
          name="aadhaar_number"
          value={formData.aadhaar_number || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>PAN<PiAsteriskSimpleBold className="asterisk"/></label>
        <input
          type="text"
          name="pan_number"
          value={formData.pan_number || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone<PiAsteriskSimpleBold className="asterisk"/></label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleInputChange}>
          <option value="">Select Department</option>
          {Object.keys(departmentPositions).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Position</label>
        <select
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          disabled={!formData.department} // Disable if no department selected
        >
          <option value="">Select Position</option>
          {formData.department &&
            departmentPositions[formData.department].map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label>Salary [ CTC ]</label>
        <input
          type="number"
          name="salary"
          value={formData.salary || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select
          name="role"
          value={formData.role || ''}
          onChange={handleInputChange}
          required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
          <option value="Project Manager">Project Manager</option>
          <option value="Finance Manager">Finance Manager</option>
        </select>
      </div>
      <div className="form-group">
        <label>Photo</label>
        <input
          type="file"
          name="photo"
          onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
        />
      </div>
      </div>
      <div className="button-group">
      <button type="button" className="cancel-button" onClick={() => setFormModalVisible(false)}>Cancel</button>
      <button type="submit" disabled={!isFormValid || isLoading} className="save-employee-button">{isLoading ? 'Submitting...' : 'Add Employee'}</button>
      {error && <p className="error">{error}</p>}
      </div>
    </form>
  </Modal>
)}

{/* Edit Employee Form */}
{isEditModalVisible && (
  <Modal isVisible={isEditModalVisible} buttons={[]}>
    <form
      className="employee-form"
      onSubmit={handleUpdateEmployee} // Ensure this function matches the update action
    >
      <div className="form-header">
        <h3 className="form-header-title">Update Employee</h3>
        <MdOutlineCancel
          className="cancel-icon"
          onClick={() => setEditModalVisible(false)}
        />
      </div>
      <div className="form-grid">
        {/* First Name */}
        <div className="form-group">
          <label>
            First Name <PiAsteriskSimpleBold className="asterisk" />
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Last Name */}
        <div className="form-group">
          <label>
            Last Name <PiAsteriskSimpleBold className="asterisk" />
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Date of Birth */}
        <div className="form-group">
          <label>
            Date of Birth <PiAsteriskSimpleBold className="asterisk" />
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob ? formData.dob.split('T')[0] : ''}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Email */}
        <div className="form-group">
          <label>
            Email <PiAsteriskSimpleBold className="asterisk" />
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Father Name */}
        <div className="form-group">
          <label>Father Name</label>
          <input
            type="text"
            name="father_name"
            value={formData.father_name || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Mother Name */}
        <div className="form-group">
          <label>Mother Name</label>
          <input
            type="text"
            name="mother_name"
            value={formData.mother_name || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Aadhaar Number */}
        <div className="form-group">
          <label>
            Aadhaar No <PiAsteriskSimpleBold className="asterisk" />
          </label>
          <input
            type="text"
            name="aadhaar_number"
            value={formData.aadhaar_number || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* PAN Number */}
        <div className="form-group">
          <label>PAN</label>
          <input
            type="text"
            name="pan_number"
            value={formData.pan_number || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Phone Number */}
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Department */}
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            {Object.keys(departmentPositions).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        {/* Position */}
        <div className="form-group">
          <label>Position</label>
          <select
            name="position"
            value={formData.position || ''}
            onChange={handleInputChange}
            disabled={!formData.department}
          >
            <option value="">Select Position</option>
            {formData.department &&
              departmentPositions[formData.department].map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
          </select>
        </div>
        {/* Salary */}
        <div className="form-group">
          <label>Salary [CTC]</label>
          <input
            type="number"
            name="salary"
            value={formData.salary || ''}
            onChange={handleInputChange}
          />
        </div>
        {/* Role */}
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Finance Manager">Finance Manager</option>
          </select>
        </div>
        {/* Photo */}
        <div className="form-group">
          <label>Photo</label>
          <input
            type="file"
            name="photo"
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.files[0] })
            }
          />
        </div>
      </div>
      {/* Button Group */}
      <div className="button-group">
        <button
          type="button"
          className="cancel-button"
          onClick={() => setEditModalVisible(false)}
        >
          Cancel
        </button>
        <button type="submit" className="save-employee-button">
          Update Employee
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  </Modal>
)}

      {/* Display Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Employee Table */}
{isLoading ? (
  <div className="loading">Loading...</div>
) : (
  <div class="table-scroll-container">
  <table className="employee-table">
    <thead>
      <tr>
        <th>Emp ID</th>
        <th>Emp Name</th>
        <th>DOJ</th>
        <th>Email ID</th>
        <th>Contact</th>
        <th>Level</th>
        <th>Department</th>
        <th>Designation</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
  <tbody>
  {employees.length === 0 ? (
    <tr>
      <td colSpan="8">No employees found</td>
    </tr>
      ) : (
    employees.map((employee) => (
      <tr key={employee.employee_id}>
        <td>{employee.employee_id}</td>
        <td>{employee.name}</td>
        <td>
        {(() => {
        const date = new Date(employee.joining_date);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
        return formattedDate;
        })()}
        </td>
        <td>{employee.email}</td>
        <td>{employee.phone_number}</td>
        <td>{employee.level}</td>
        <td>{employee.department}</td>
        <td>{employee.position}</td>
        <td>{employee.salary}</td>
        <td>
          <div className="actions">
            <button className="edit" onClick={() => handleEditEmployee(employee.employee_id)}>
            <MdOutlineEdit />
            </button>
            <button className="delete" onClick={() => { setDeleteEmployeeId(employee.employee_id); setModalVisible(true); }}>
            <MdDeleteOutline />
            </button>
          </div>
        </td>
      </tr>
       ))
      )}
      </tbody>
    </table>
    </div>
  )}
</div>
  );
};

export default EmployeeDetails;
