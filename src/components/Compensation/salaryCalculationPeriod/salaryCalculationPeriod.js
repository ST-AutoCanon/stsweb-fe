

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './salaryCalculationPeriod.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

const SalaryCalculationPeriod = ({ onClose, showAlert }) => {
  const [periods, setPeriods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ cutoff_date: '' });
  const [errors, setErrors] = useState({});

  const fetchPeriods = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/salaryCalculationperiods`, {
        headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
      });
      if (response.data.success) {
        setPeriods(response.data.data || []);
        // Prefill with current day if no periods exist
        if (response.data.data.length === 0) {
          const currentDay = new Date().getDate();
          setFormData({ cutoff_date: currentDay.toString() });
        }
      }
    } catch (error) {
      console.error('Error fetching periods:', error);
      if (showAlert) {
        showAlert('Failed to fetch salary calculation periods');
      }
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData({ cutoff_date: value });
    if (errors.cutoff_date) {
      setErrors({ ...errors, cutoff_date: '' });
    }
  };

  const validateForm = () => {
    const { cutoff_date } = formData;
    const num = parseInt(cutoff_date);
    if (!cutoff_date || isNaN(num) || num < 1 || num > 31) {
      const errorMsg = 'Cutoff date must be between 1 and 31';
      setErrors({ ...errors, cutoff_date: errorMsg });
      if (showAlert) {
        showAlert(errorMsg);
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const headers = { 'x-api-key': API_KEY, 'x-employee-id': meId, 'Content-Type': 'application/json' };
      let response;
      if (isEditing) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/updateSalaryCalculationperiod/${editingId}`,
          { cutoff_date: parseInt(formData.cutoff_date) },
          { headers }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/addSalaryCalculationperiod`,
          { cutoff_date: parseInt(formData.cutoff_date) },
          { headers }
        );
      }
      if (response.data.success) {
        fetchPeriods();
        if (showAlert) {
          showAlert(response.data.message || (isEditing ? 'Period updated successfully' : 'Period added successfully'));
        }
        toggleModal();
      } else {
        throw new Error(response.data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving period:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save';
      setErrors({ ...errors, general: errorMsg });
      if (showAlert) {
        showAlert(errorMsg);
      }
    }
  };

  const handleEdit = (period) => {
    setIsEditing(true);
    setEditingId(period.id);
    setFormData({ cutoff_date: period.cutoff_date.toString() });
    setErrors({});
  };

  const toggleModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ cutoff_date: '' });
    setErrors({});
    onClose();
  };

  return (
    <div className="salary-period-overlay">
      <div className="salary-period-modal">
        <div className="salary-period-header">
          <h2>{isEditing ? 'Edit Salary Calculation Period' : 'Add Salary Calculation Period'}</h2>
          <button onClick={toggleModal} className="salary-period-close">&times;</button>
        </div>
        <div className="salary-period-content">
          <div className="salary-period-form-section">
            <p className="salary-period-note">For salary details salary calculation period</p>
            <form onSubmit={handleSubmit} className="salary-period-form">
              <div className="salary-period-form-group">
                <label className="salary-period-label">Cutoff Date (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.cutoff_date}
                  onChange={handleInputChange}
                  className={`salary-period-input ${errors.cutoff_date ? 'error' : ''}`}
                  required
                />
                {errors.cutoff_date && <span className="salary-period-error">{errors.cutoff_date}</span>}
              </div>
              {errors.general && <span className="salary-period-error general">{errors.general}</span>}
              <button type="submit" className="salary-period-submit" disabled={!formData.cutoff_date}>
                {isEditing ? 'Update' : 'Add'}
              </button>
            </form>
          </div>
          <div className="salary-period-list-section">
            <h3>Existing Periods</h3>
            {periods.length === 0 ? (
              <p className="salary-period-no-data">No periods found. Create one to get started.</p>
            ) : (
              <div className="salary-period-table-wrapper">
                <table className="salary-period-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cutoff Date</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period, index) => (
                      <tr key={period.id} className={index % 2 === 0 ? 'even-row' : ''}>
                        <td>{period.id}</td>
                        <td>{period.cutoff_date}</td>
                        <td>{period.created_at ? new Date(period.created_at).toLocaleDateString() : '-'}</td>
                        <td>{period.updated_at ? new Date(period.updated_at).toLocaleDateString() : '-'}</td>
                        <td className="salary-period-actions">
                          <button onClick={() => handleEdit(period)} className="salary-period-edit-btn">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculationPeriod;