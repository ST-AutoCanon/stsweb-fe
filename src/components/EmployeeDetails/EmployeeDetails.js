import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeDetails.css';
import { MdOutlineCalendarToday, MdOutlineEdit, MdDeleteOutline, MdOutlineCancel } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const departmentPositions = {
  Software: ['Software Team Lead', 'Senior Software Engineer', 'Associate Software Engineer', 'Senior Test Engineer', 'Test Engineer', 'Senior Network Engineer', 'Network Engineer', 'Technical Engineer'],
  Homologation: ['Homologation Specialist', 'Homologation Team Lead', 'Homologation Engineer',],
  Design: ['Senior Design Engineer', 'Design Engineer', 'Design Lead', 'Design Team Lead'],
  Finance: ['Finance Team Lead', 'Accountant', 'Financial Analyst'],
  HR: ['HR Specialist', 'HR Team Lead'],
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
    father_name: '',
    mother_name: '', 
    aadhaar_number: '',
    pan_number: '',
    phone_number: '',
    gender: '',
    marital_status: '',
    spouse_name: '',
    marriage_date: '',
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
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      let apiUrl = `${process.env.REACT_APP_BACKEND_URL}/admin/employees`; // Base URL
      const params = [];

      // Add searchTerm if available
      if (searchTerm) {
        params.push(`search=${encodeURIComponent(searchTerm)}`);
      }

      // Add fromDate and toDate only when search button is clicked
      if (fromDate) {
        params.push(`fromDate=${fromDate.toISOString().split('T')[0]}`);
      }
      if (toDate) {
        params.push(`toDate=${toDate.toISOString().split('T')[0]}`);
      }

      if (params.length > 0) {
        apiUrl += `?${params.join('&')}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

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

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]); // Only refetch when search term changes

  // Function to handle search button click
  const handleSearchClick = () => {
    fetchEmployees(); // Call fetchEmployees when search button is clicked
  };
  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'role') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        department: value === 'Admin' ? '' : prevState.department,
        position: value.includes('Team Lead') ? '' : prevState.position,
      }));
    } else if (name === 'department') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        position: '', // Clear position when department changes
      }));
    } else if (name === 'gender') {
      // Ensure valid gender values are set
      const validGenders = ['Male', 'Female', 'Other'];
      if (validGenders.includes(value.trim())) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value.trim(), // Update gender only if valid
        }));
      } else {
        alert('Invalid gender value selected.');
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

// Date of birth validation (18 years before current date)
const validateDOB = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1;
  }
  return age;
};

const handleAddEmployee = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Validate Date of Birth (18 years old)
  const age = validateDOB(formData.dob);
  if (age < 18) {
    alert('Employee must be at least 18 years old.');
    setIsLoading(false);
    return;
  }

  try {
    const uploadData = new FormData();
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/employees`, uploadData, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });

    setFormData({
      first_name: '',
      last_name: '',
      dob: '',
      email: '',
      father_name: '',
      mother_name: '', 
      aadhaar_number: '',
      pan_number: '',
      phone_number: '',
      gender: '',
      marital_status: '',
      spouse_name: '',
      marriage_date: '',
      address: '',
      department: '',
      position: '',
      salary: '',
      photo: null,
    });

    setFormModalVisible(false); 
    alert('Employee added successfully. A password reset email has been sent.');
  } catch (err) {
    console.log(err);
    setError('Failed to add employee');
  } finally {
    setIsLoading(false);
  }
};

const fetchPhoto = async (photoUrl) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
      headers: {
        'x-api-key': API_KEY,
      },
      responseType: 'blob', 
    });

    const imageUrl = URL.createObjectURL(response.data);
    setFormData((prevData) => ({
      ...prevData,
      photo: imageUrl,
    }));
  } catch (err) {
    console.error('Error fetching photo:', err);
    alert('Failed to fetch photo.');
  }
};



const handleEditEmployee = async (employeeId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/employee/${employeeId}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const employee = response?.data?.data;

    if (!employee) {
      alert('Employee data not found');
      return;
    }

    setFormData({
      employee_id: employee.employee_id,
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      dob: employee.dob || '',
      email: employee.email || '',
      father_name: employee.father_name || '',
      mother_name: employee.mother_name || '',
      aadhaar_number: employee.aadhaar_number || '',
      pan_number: employee.pan_number || '',
      phone_number: employee.phone_number || '',
      gender: employee.gender || '',
      marital_status: employee.marital_status || '',
      spouse_name: employee.spouse_name || '',
      marriage_date: employee.marriage_date || '',
      address: employee.address || '',
      role: employee.role || '',
      department: employee.department || '',
      position: employee.position || '',
      salary: employee.salary || '',
      photo: employee.photo_url || '',
    });

    if (employee.photo_url) {
      await fetchPhoto(employee.photo_url); // Fetch the photo as a blob
    }

    setEditModalVisible(true);
    setEmployeeToEdit(true);
  } catch (err) {
    console.error('Error fetching employee:', err);
    alert(err.response?.data?.message || 'Failed to fetch employee details.');
  }
};

  

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const uploadData = new FormData();
Object.keys(formData).forEach((key) => {
  if ((key === 'dob' || key === 'marriage_date') && formData[key]) {
    // Format the date to 'YYYY-MM-DD'
    const formattedDate = new Date(formData[key]).toISOString().split('T')[0];
    uploadData.append(key, formattedDate);
  } else {
    uploadData.append(key, formData[key]);
  }
});
  
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/employees/${formData.employee_id}`,
        uploadData,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setEditModalVisible(false);
      setEmployeeToEdit(false);
      alert('Employee updated successfully.');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  // Handle deactivate employee action
const handleDeactivateEmployee = async () => {
  if (!deleteEmployeeId) return;

  try {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/admin/employees/${deleteEmployeeId}/deactivate`,
      {}, // Empty request body
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    setDeleteEmployeeId(null);
    alert('Employee Deactivated successfully.');
  } catch (err) {
    console.log('Failed to deactivate employee', err);
    setError('Failed to deactivate employee');
  } finally {
    setModalVisible(false);
  }
};

  return (
    <div className="employee-details-container">
      <h2 class="header-title">Employee Details</h2>
<div class="header-container">
      {/* Search Employee */}
      <div className="search-container">
        <label>Search by</label>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Name, EmpID, Email, Dept"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          />
        </div>
      </div>

        {/* Date From Input Group */}
        <div className="calendar-input-group">
          <label className="calendar-label">Date From</label>
          <div className="calendar-input-wrapper">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)} // Set the fromDate
              dateFormat="yyyy-MM-dd"
              customInput={
                <div className="custom-calendar-input">
                  <input
                    type="text"
                    value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
                    readOnly
                    placeholder="Select Date"
                  />
                  <MdOutlineCalendarToday className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>
        
        {/* Date To Input Group */}
        <div className="calendar-input-group">
          <label className="calendar-label">To</label>
          <div className="calendar-input-wrapper">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)} // Set the toDate
              dateFormat="yyyy-MM-dd"
              customInput={
                <div className="custom-calendar-input">
                  <input
                    type="text"
                    value={toDate ? toDate.toISOString().split('T')[0] : ''}
                    readOnly
                    placeholder="Select Date"
                  />
                  <MdOutlineCalendarToday className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

      <div className='button-search'>
        <button className="search-text" onClick={handleSearchClick}>
          <i className="fas fa-search search-icon"></i> Search
        </button>
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
      setFormModalVisible(true);}} 
        className="add-employee-button">
        <i className="add-icon">+</i>
        <span>Add Employee</span>
        </button>
      </div>
</div>
    
    {/* Add Employee Form */}
    {isFormModalVisible && (
      <div className='emp-modal-overlay'>
    <div className="emp-modal" isVisible={isFormModalVisible} buttons={[]}>
    <form className="employee-form" onSubmit={handleAddEmployee}>
    <div className="form-header">
    <h3 class="form-header-title">Add New Employee</h3>
    <MdOutlineCancel className="cancel-icon" onClick={() => setFormModalVisible(false)} />
    </div>
    <div className="form-grid">
      <div className="form-group">
        <label>First Name<span className="required">*</span></label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleInputChange}
          pattern="[A-Za-z\s]+"
          title="First name should only contain alphabets."
          placeholder='John'
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name<span className="required">*</span></label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleInputChange}
          pattern="[A-Za-z\s]+"
          title="Last name should only contain alphabets."
          placeholder='Doe'
          required
        />
      </div>
      <div className="form-group">
        <label>Date of Birth<span className="required">*</span></label>
        <input
          type="date"
          name="dob"
          value={formData.dob ? formData.dob.split('T')[0] : ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email<span className="required">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address (e.g., user@example.com)."
          placeholder='john.doe@gmail.com'
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
          pattern="[A-Za-z\s]+"
          placeholder='Robert'
        />
      </div>
      <div className="form-group">
        <label>Mother Name</label>
        <input
          type="text"
          name="mother_name"
          value={formData.mother_name || ''}
          onChange={handleInputChange}
          pattern="[A-Za-z\s]+"
          placeholder='Julie'
        />
      </div>
      <div className="form-group">
        <label>Aadhaar No<span className="required">*</span></label>
        <input
          type="text"
          name="aadhaar_number"
          value={formData.aadhaar_number || ''}
          onChange={handleInputChange}
          pattern="^\d{12}$"
          title="Aadhaar number must contain exactly 12 digits."
          placeholder='984567345465'
          required
        />
      </div>
      <div className="form-group">
        <label>PAN<span className="required">*</span></label>
        <input
          type="text"
          name="pan_number"
          value={formData.pan_number || ''}
          onChange={handleInputChange}
          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
          title="Please enter a valid pan number (e.g., ABCDE1234F)."
          placeholder='ABCDE1234F'
          required
        />
      </div>
      <div className="form-group">
        <label>Mobile<span className="required">*</span></label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number || ''}
          onChange={handleInputChange}
          pattern="^\d{10}$"
          title="mobile number must contain 10 digits."
          placeholder='+91 8976345687'
          required
        />
      </div>
      <div className="form-group">
  <label>Role<span className="required">*</span></label>
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
    <option value="Team Lead">Team Lead</option>
  </select>
</div>

<div className="form-group">
  <label>Department</label>
  <select
    name="department"
    value={formData.department || ''}
    onChange={handleInputChange}
    disabled={formData.role === 'Admin'}
  >
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
    value={formData.position || ''}
    onChange={handleInputChange}
    disabled={!formData.department && formData.role === 'Admin'}
  >
    <option value="">Select Position</option>
    {formData.department &&
      (formData.role.toLowerCase().includes('team lead')
        ? departmentPositions[formData.department]
            ?.filter((pos) => pos.toLowerCase().includes('team lead'))
            .map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))
        : departmentPositions[formData.department]
            ?.filter((pos) => !pos.toLowerCase().includes('team lead'))
            .map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            )))}
  </select>
</div>
      <div className="form-group">
  <label>Gender<span className="required">*</span></label>
  <select
    name="gender"
    value={formData.gender || ''}
    onChange={handleInputChange}
    required
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="form-group">
  <label>Marital Status<span className="required">*</span></label>
  <select
    name="marital_status"
    value={formData.marital_status || ''}
    onChange={(e) => {
      handleInputChange(e);
      if (e.target.value === 'Unmarried') {
        setFormData((prevState) => ({
          ...prevState,
          spouse_name: 'NA', // Default to NA for Unmarried
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          spouse_name: '', // Clear spouse_name for Married
        }));
      }
    }}
    required
  >
    <option value="">Select Marital Status</option>
    <option value="Married">Married</option>
    <option value="Unmarried">Unmarried</option>
  </select>
</div>

<div className="form-group">
  <label>Spouse Name</label>
  <input
    type="text"
    name="spouse_name"
    value={formData.spouse_name || ''}
    onChange={handleInputChange}
    disabled={formData.marital_status === 'Unmarried'}
    placeholder={formData.marital_status === 'Unmarried' ? 'NA' : 'Enter Spouse Name'}
    required
  />
</div>
<div className="form-group">
        <label>Marriage Anniversary</label>
        <input
          type="date"
          name="marriage_date"
          value={formData.marriage_date || ''}
          onChange={handleInputChange}
          disabled={formData.marital_status === 'Unmarried'}
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
          placeholder='123 Street, City, State, Country'
        />
      </div>
      <div className="form-group">
        <label>Salary [ CTC ]</label>
        <input
          type="number"
          name="salary"
          value={formData.salary || ''}
          onChange={handleInputChange}
          placeholder='00000.00'
        />
      </div>
      <div className="form-group">
      <label>Photo</label>
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
      />
      </div>
      </div>
      <div className="button-group">
      <button type="button" className="cancel-button" onClick={() => setFormModalVisible(false)}>Cancel</button>
      <button type="submit" disabled={!isFormValid || isLoading} className="save-employee-button">{isLoading ? 'Submitting...' : 'Add Employee'}</button>
      </div>
    </form>
  </div>
  </div>
)}

{/* Edit Employee Form */}
{isEditModalVisible && (
  <div className='emp-modal-overlay'>
  <div className="emp-modal" isVisible={isEditModalVisible} buttons={[]}>
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
        <label>First Name<span className="required">*</span></label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleInputChange}
          pattern="[A-Za-z\s]+"
          title="First name should only contain alphabets."
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name<span className="required">*</span></label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleInputChange}
          pattern="[A-Za-z\s]+"
          title="Last name should only contain alphabets."
          required
        />
      </div>
      <div className="form-group">
          <label>
            Date of Birth<span className="required">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob ? formData.dob.split('T')[0] : ''}
            onChange={handleInputChange}
            required
          />
        </div>
      <div className="form-group">
        <label>Email<span className="required">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Please enter a valid email address (e.g., user@example.com)."
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
        <label>Aadhaar No<span className="required">*</span></label>
        <input
          type="text"
          name="aadhaar_number"
          value={formData.aadhaar_number || ''}
          onChange={handleInputChange}
          pattern="^\d{12}$"
          title="Aadhaar number must contain exactly 12 digits."
          required
        />
      </div>
      <div className="form-group">
        <label>PAN<span className="required">*</span></label>
        <input
          type="text"
          name="pan_number"
          value={formData.pan_number || ''}
          onChange={handleInputChange}
          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
          title="Please enter a valid pan number (e.g., ABCDE1234F)."
          required
        />
      </div>
      <div className="form-group">
        <label>Mobile<span className="required">*</span></label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number || ''}
          onChange={handleInputChange}
          pattern="\d+"
          title="mobile number must contain exactly 10 digits."
          required
        />
      </div>
      <div className="form-group">
  <label>Role<span className="required">*</span></label>
  <select
    name="role"
    value={formData.role || ''}
    onChange={handleInputChange}
    required>
    <option value="">Select Role</option>
    <option value="Admin">Admin</option>
    <option value="Employee">Employee</option>
    <option value="Project Manager">Project Manager</option>
    <option value="Team Lead">Team Lead</option>
  </select>
</div>

<div className="form-group">
  <label>Department</label>
  <select
    name="department"
    value={formData.department || ''}
    onChange={handleInputChange}
    disabled={formData.role === 'Admin'} // Admin role doesn't need a department
  >
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
    value={formData.position || ''}
    onChange={handleInputChange}
    disabled={!formData.department && formData.role === 'Admin'} 
  >
    <option value="">Select Position</option>
    {formData.department &&
      (formData.role.toLowerCase().includes('team lead')
        ? departmentPositions[formData.department]
            ?.filter((pos) => pos.toLowerCase().includes('team lead')) 
            .map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))
        : departmentPositions[formData.department]
            ?.filter((pos) => !pos.toLowerCase().includes('team lead')) 
            .map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            )))}
  </select>
</div>
      <div className="form-group">
  <label>Gender<span className="required">*</span></label>
  <select
    name="gender"
    value={formData.gender || ''}
    onChange={handleInputChange}
    required
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="form-group">
  <label>Marital Status<span className="required">*</span></label>
  <select
    name="marital_status"
    value={formData.marital_status || ''}
    onChange={(e) => {
      handleInputChange(e);
      if (e.target.value === 'Unmarried') {
        setFormData((prevState) => ({
          ...prevState,
          spouse_name: 'NA', // Default to NA for Unmarried
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          spouse_name: '', // Clear spouse_name for Married
        }));
      }
    }}
    required
  >
    <option value="">Select Marital Status</option>
    <option value="Married">Married</option>
    <option value="Unmarried">Unmarried</option>
  </select>
</div>

<div className="form-group">
  <label>Spouse Name</label>
  <input
    type="text"
    name="spouse_name"
    value={formData.spouse_name || ''}
    onChange={handleInputChange}
    disabled={formData.marital_status === 'Unmarried'}
    placeholder={formData.marital_status === 'Unmarried' ? 'NA' : 'Enter Spouse Name'}
    required
  />
</div>
<div className="form-group">
        <label>Marriage Anniversary</label>
        <input
          type="date"
          name="marriage_date"
          value={formData.marriage_date ? formData.marriage_date.split('T')[0] : ''}
          onChange={handleInputChange}
          disabled={formData.marital_status === 'Unmarried'}
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
        <label>Salary [ CTC ]</label>
        <input
          type="number"
          name="salary"
          value={formData.salary || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
      <label>Photo</label>
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
      />
      </div>
     {formData.photo && (
     <div className="form-group">
      <label>Photo:</label>
      <img
      src={formData.photo}
      alt="Employee Photo"
      style={{ width: '60px', height: '60px', cursor: 'pointer' }}
      onClick={() => window.open(formData.photo, '_blank')}
      />
      </div>
      )}
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
      </div>
    </form>
  </div>
  </div>
)}
{modalVisible && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <h2>Confirm Deactivation</h2>
      <p>Are you sure you want to deactivate this employee?</p>
      <div className="delete-buttons">
        <button
          onClick={() => setModalVisible(false)}
          className="delete-modal-cancel"
        >
          Cancel
        </button>
        <button
          onClick={handleDeactivateEmployee}
          className="delete-modal-delete"
        >
          Deactivate
        </button>
      </div>
    </div>
  </div>
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
        <th>Status</th>
        <th>Email ID</th>
        <th>Contact</th>
        <th>Department</th>
        <th>Designation</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
  <tbody>
  {employees.length === 0 ? (
    <tr>
      <td colSpan="10">No employees found</td>
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
        <td className={employee.status === 'Active' ? 'status-active' : 'status-inactive'}>
        {employee.status}
        </td>
        <td>{employee.email}</td>
        <td>{employee.phone_number}</td>
        <td>{employee.department}</td>
        <td>{employee.position}</td>
        <td>{employee.salary}</td>
        <td>
          <div className="actions">
            <button className="edit" onClick={() => handleEditEmployee(employee.employee_id)}
              disabled={employee.status === 'Inactive'}>
            <MdOutlineEdit />
            </button>
            <button className="deactivate" onClick={() => { setDeleteEmployeeId(employee.employee_id); setModalVisible(true); }}
              disabled={employee.status === 'Inactive'}>
            <MdDeleteOutline />
            </button>
          </div>
        </td>
      </tr>
      )))}
      </tbody>
    </table>
    </div>
  )}
</div>
  );
};

export default EmployeeDetails;
