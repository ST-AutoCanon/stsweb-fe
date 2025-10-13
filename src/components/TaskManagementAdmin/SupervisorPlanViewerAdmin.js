

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getISOWeek, startOfISOWeek, endOfISOWeek, format } from 'date-fns';
import Modal from '../Modal/Modal';
import './SupervisorPlanViewerAdmin.css';

const SupervisorPlanViewerAdmin = () => {
  const [supervisorId, setSupervisorId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });
  const [configModal, setConfigModal] = useState({
    isVisible: false,
    freezeDaysSupervisor: '',
    freezeDaysEmployee: '',
  });
  const [loadingConfig, setLoadingConfig] = useState(false);

  const showAlert = (message) => {
    setAlertModal({ isVisible: true, message });
    setTimeout(() => closeAlert(), 5000);
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, message: '' });
  };

  const formatWeekId = (weekId) => {
    if (weekId === null) return 'N/A';
    const currentYear = new Date().getFullYear(); // Use current year (2025)
    const startDate = startOfISOWeek(new Date(currentYear, 0, 1));
    const weekStart = new Date(startDate.getTime() + (weekId - 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = endOfISOWeek(weekStart);
    const formattedStart = format(weekStart, 'MMM d, yyyy');
    const formattedEnd = format(weekEnd, 'MMM d, yyyy');
    return `Week ${weekId} (${formattedStart} - ${formattedEnd})`;
  };

  const getWeekIdForDate = (date) => {
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) return null;
    return getISOWeek(taskDate);
  };

  useEffect(() => {
    const data = localStorage.getItem('dashboardData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.employeeId) {
          setSupervisorId(String(parsed.employeeId));
        } else {
          setError('No employeeId found in dashboardData. Please log in again.');
        }
      } catch (e) {
        setError('Failed to parse dashboardData. Please log in again.');
      }
    } else {
      setError('No dashboardData found in localStorage. Please log in again.');
    }
  }, []);

  useEffect(() => {
    if (!supervisorId) return;

    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        const empData = Array.isArray(response.data.employees)
          ? response.data.employees.map(emp => ({
              ...emp,
              employee_id: emp.employee_id?.trim().toUpperCase(),
            }))
          : [];
        if (empData.length === 0) {
          setError('No active employees available.');
        } else {
          setEmployees(empData);
          setSelectedEmployee(empData[0]?.employee_id || null);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === 'ECONNABORTED'
          ? 'Request timed out: Unable to connect to server'
          : `Network error: ${err.message}`;
        setError(errorMessage);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    const fetchHolidays = async () => {
      setLoadingHolidays(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/holidays/all`,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        const holidayData = Array.isArray(response.data.holidays)
          ? response.data.holidays.map(holiday => holiday.date)
          : [];
        setHolidays(holidayData);
      } catch (err) {
        setHolidays([]);
      } finally {
        setLoadingHolidays(false);
      }
    };

    const fetchApprovedLeaves = async () => {
      setLoadingLeaves(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/admin/leave`,
          {
            params: { status: 'Approved' },
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        const leaveData = Array.isArray(response.data.data)
          ? response.data.data.map(leave => ({
              employee_id: leave.employee_id?.trim().toUpperCase(),
              start_date: leave.start_date,
              end_date: leave.end_date,
              h_f_day: leave.H_F_day,
            }))
          : [];
        setApprovedLeaves(leaveData);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === 'ECONNABORTED'
          ? 'Request timed out: Unable to connect to server'
          : `Network error: ${err.message}`;
        setError(errorMessage);
        setApprovedLeaves([]);
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchEmployees();
    fetchHolidays();
    fetchApprovedLeaves();
  }, [supervisorId]);

  useEffect(() => {
    if (!supervisorId) return;

    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        const validStatuses = ['not started', 'working', 'completed', 'suspended'];
        const taskData = res.data.success && Array.isArray(res.data.data)
          ? res.data.data.map(task => ({
              ...task,
              employee_id: task.employee_id?.trim().toUpperCase(),
              emp_status: validStatuses.includes(task.emp_status) ? task.emp_status : 'not started',
              week_id: Number(task.week_id),
            }))
          : [];
        setTasks(taskData);
        if (taskData.length > 0) {
          const weekIds = [...new Set(taskData.map(task => task.week_id))].sort((a, b) => a - b);
          setSelectedWeekId(weekIds[weekIds.length - 1] || null);
        } else {
          setSelectedWeekId(null);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === 'ECONNABORTED'
          ? 'Request timed out: Unable to connect to server'
          : `Network error: ${err.message}`;
        setError(errorMessage);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [supervisorId]);

  useEffect(() => {
    if (!selectedEmployee) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`,
          {
            params: { employeeId: selectedEmployee },
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        const newProjects = {};
        (response.data.projects || []).forEach((project) => {
          newProjects[project.id] = project.project;
        });
        setProjects(newProjects);
        setError(null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === 'ECONNABORTED'
          ? 'Request timed out: Unable to connect to server'
          : `Network error: ${err.message}`;
        setError(errorMessage);
        setProjects({});
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedEmployee]);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/config`,
        {
          headers: {
            'x-employee-id': supervisorId,
            'x-api-key': process.env.REACT_APP_API_KEY || '',
          },
          timeout: 10000,
        }
      );
      const configData = response.data.data || [];
      const freezeDaysSupervisor = configData.find(item => item.key === 'freeze_days_supervisor')?.value || '';
      const freezeDaysEmployee = configData.find(item => item.key === 'freeze_days_employee')?.value || '';
      setConfigModal({
        isVisible: true,
        freezeDaysSupervisor,
        freezeDaysEmployee,
      });
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
        : err.code === 'ECONNABORTED'
        ? 'Request timed out: Unable to connect to server'
        : `Network error: ${err.message}`;
      setError(errorMessage);
      setConfigModal({
        isVisible: true,
        freezeDaysSupervisor: '',
        freezeDaysEmployee: '',
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const updateConfig = async () => {
    setLoadingConfig(true);
    try {
      const { freezeDaysSupervisor, freezeDaysEmployee } = configModal;
      if (!/^\d+$/.test(freezeDaysSupervisor) || !/^\d+$/.test(freezeDaysEmployee)) {
        showAlert('Freeze days must be positive integers.');
        return;
      }
      await Promise.all([
        axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
          { key: 'freeze_days_supervisor', value: freezeDaysSupervisor },
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        ),
        axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
          { key: 'freeze_days_employee', value: freezeDaysEmployee },
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        ),
      ]);
      showAlert('Configuration updated successfully');
      setConfigModal({ ...configModal, isVisible: false });
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
        : err.code === 'ECONNABORTED'
        ? 'Request timed out: Unable to connect to server'
        : `Network error: ${err.message}`;
      showAlert(`Failed to update configuration: ${errorMessage}.`);
      setConfigModal({ ...configModal, isVisible: false });
    } finally {
      setLoadingConfig(false);
    }
  };

  const updateTaskField = (taskId, field, value) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.task_id === taskId) {
          if (field === 'project') {
            const selectedProject = Object.entries(projects).find(([id]) => id === value);
            return {
              ...task,
              project_id: value,
              project_name: selectedProject ? selectedProject[1] : task.project_name,
            };
          }
          return { ...task, [field]: value };
        }
        return task;
      })
    );
  };

  const saveTaskField = async (taskId) => {
    const task = tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Task with task_id ${taskId} not found`);
      showAlert('Task not found');
      return;
    }

    try {
      const updateData = {
        sup_status: task.sup_status || 'incomplete',
        sup_comment: task.sup_comment || '',
        sup_review_status: task.sup_review_status || 'pending',
        replacement_task: task.replacement_task || null,
        star_rating: task.star_rating || 0,
        project_id: task.project_id,
        project_name: task.project_name,
      };

      if (task.sup_status === 're-work') {
        const taskDate = new Date(task.task_date || new Date());
        if (isNaN(taskDate.getTime())) {
          taskDate = new Date();
        }
        taskDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(taskDate);
        nextDay.setDate(taskDate.getDate() + 1);
        const nextDayString = nextDay.toLocaleDateString('en-CA');
        const nextDayWeekId = getWeekIdForDate(nextDay);

        const newTaskData = {
          week_id: nextDayWeekId,
          task_date: nextDayString,
          project_id: task.project_id,
          project_name: task.project_name,
          task_name: task.task_name,
          employee_id: task.employee_id,
          emp_status: 'not started',
          sup_status: 'incomplete',
          emp_comment: null,
          sup_comment: null,
          sup_review_status: 'pending',
          star_rating: 0,
          parent_task_id: task.task_id,
        };

        console.log('New task data:', newTaskData);

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
          newTaskData,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );

        updateData.sup_status = 're-work';
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );

        showAlert(response.data.message || 'New task created successfully');

        if (response.data.newTask) {
          const newTask = {
            ...response.data.newTask,
            employee_name: employees.find(emp => emp.employee_id === response.data.newTask.employee_id)?.employee_name || 'Unknown',
            employee_id: response.data.newTask.employee_id?.trim().toUpperCase(),
            emp_status: response.data.newTask.emp_status || 'not started',
            week_id: Number(response.data.newTask.week_id),
            project_id: response.data.newTask.project_id,
            project_name: response.data.newTask.project_name,
          };
          setTasks((prev) => [...prev, newTask]);
          const newTaskWeek = newTask.week_id;
          if (newTaskWeek && newTaskWeek !== selectedWeekId) {
            setSelectedWeekId(newTaskWeek);
          }
          if (newTask.employee_id !== selectedEmployee) {
            console.log(`Switching selectedEmployee to ${newTask.employee_id} for project fetch`);
            setSelectedEmployee(newTask.employee_id);
          }
        }
      } else {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            headers: {
              'x-employee-id': supervisorId,
              'x-api-key': process.env.REACT_APP_API_KEY || '',
            },
            timeout: 10000,
          }
        );
        showAlert('Task updated successfully');
      }

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
        {
          headers: {
            'x-employee-id': supervisorId,
            'x-api-key': process.env.REACT_APP_API_KEY || '',
          },
          timeout: 10000,
        }
      );
      const validStatuses = ['not started', 'working', 'completed', 'suspended'];
      const taskData = res.data.success && Array.isArray(res.data.data)
        ? res.data.data.map(task => ({
            ...task,
            employee_id: task.employee_id?.trim().toUpperCase(),
            emp_status: validStatuses.includes(task.emp_status) ? task.emp_status : 'not started',
            week_id: Number(task.week_id),
            project_id: task.project_id,
            project_name: task.project_name,
          }))
        : [];
      setTasks(taskData);
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
        : err.code === 'ECONNABORTED'
        ? 'Request timed out: Unable to connect to server'
        : `Network error: ${err.message}`;
      console.error(`Error updating task ${taskId}:`, errorMessage);
      setError(`Failed to update task: ${errorMessage}`);
      showAlert(`Failed to update task: ${errorMessage}`);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'working': return '#3770ecff';
      case 'not started': return '#888';
      case 'suspended': return '#dc3545';
      default: return '#007bff';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'working': return 'Working';
      case 'not started': return 'Not Started';
      case 'suspended': return 'Suspended';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTaskDateStyle = (dateString, employeeId) => {
    if (!dateString) {
      return { className: 'supervisor-plan-task-date supervisor-plan-task-date-regular', tooltip: 'N/A' };
    }
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);
    const isApprovedLeave = approvedLeaves.some(leave => {
      if (leave.employee_id !== employeeId) return false;
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const isHalfDay = leave.h_f_day.toLowerCase().includes('half');
      if (isHalfDay) {
        return taskDate.getTime() === startDate.getTime();
      }
      return taskDate.getTime() >= startDate.getTime() && taskDate.getTime() <= endDate.getTime();
    });
    const isSunday = taskDate.getDay() === 0;
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday);
      holidayDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === holidayDate.getTime();
    });
    if (isApprovedLeave) {
      return { className: 'supervisor-plan-task-date supervisor-plan-task-date-leave', tooltip: 'Leave' };
    }
    if (isHoliday) {
      return { className: 'supervisor-plan-task-date supervisor-plan-task-date-holiday', tooltip: 'Holiday' };
    }
    if (isSunday) {
      return { className: 'supervisor-plan-task-date supervisor-plan-task-date-sunday', tooltip: 'Sunday' };
    }
    return { className: 'supervisor-plan-task-date supervisor-plan-task-date-regular', tooltip: formatDate(dateString) };
  };

  const weekIds = [...new Set(tasks.map(task => task.week_id))].sort((a, b) => a - b);
  const currentWeekIndex = weekIds.indexOf(selectedWeekId);

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setSelectedWeekId(weekIds[currentWeekIndex - 1]);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weekIds.length - 1) {
      setSelectedWeekId(weekIds[currentWeekIndex + 1]);
    }
  };

  const filteredTasks = selectedEmployee && selectedWeekId !== null
    ? tasks.filter(task => task.employee_id === selectedEmployee && task.week_id === selectedWeekId)
    : [];

  const filteredEmployees = employees.filter(emp =>
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!supervisorId) {
    return (
      <div className="supervisor-plan-admin-wrapper">
        <div className="supervisor-plan-admin-error-message">
          {error || 'Supervisor ID is missing. Please '}
          <a href="/login">log in again</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="supervisor-plan-admin-wrapper">
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: 'OK', onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
      {configModal.isVisible && (
        <div
          className="supervisor-plan-admin-modal-overlay"
          onClick={() => setConfigModal({ ...configModal, isVisible: false })}
        >
          <form
            className="supervisor-plan-admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="supervisor-plan-admin-modal-title">Update Freeze Days</h3>
            <div className="supervisor-plan-admin-config-modal-content">
              <div className="supervisor-plan-admin-config-input-group">
                <label className="supervisor-plan-admin-config-label">
                  Supervisor Freeze Days
                  <input
                    type="number"
                    min="0"
                    value={configModal.freezeDaysSupervisor}
                    onChange={(e) => setConfigModal({ ...configModal, freezeDaysSupervisor: e.target.value })}
                    placeholder="Enter freeze days for supervisors"
                    disabled={loadingConfig}
                    className="supervisor-plan-admin-config-input"
                  />
                </label>
                <label className="supervisor-plan-admin-config-label">
                  Employee Freeze Days
                  <input
                    type="number"
                    min="0"
                    value={configModal.freezeDaysEmployee}
                    onChange={(e) => setConfigModal({ ...configModal, freezeDaysEmployee: e.target.value })}
                    placeholder="Enter freeze days for employees"
                    disabled={loadingConfig}
                    className="supervisor-plan-admin-config-input"
                  />
                </label>
              </div>
            </div>
            <div className="supervisor-plan-admin-modal-buttons">
              <button
                type="button"
                className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-cancel"
                onClick={() => setConfigModal({ ...configModal, isVisible: false })}
                disabled={loadingConfig}
              >
                Cancel
              </button>
              <button
                type="button"
                className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-save"
                onClick={updateConfig}
                disabled={loadingConfig}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="supervisor-plan-admin-header">
        <button
          className="supervisor-plan-admin-config-button"
          onClick={fetchConfig}
          disabled={loadingConfig}
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          {loadingConfig ? 'Loading...' : 'Update Freeze Days'}
        </button>
      </div>
      <div className="supervisor-plan-admin-employee-list">
        <h3>Employees</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search employees by name"
          className="supervisor-plan-admin-search-bar"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loadingEmployees || loadingHolidays || loadingLeaves ? (
          <p>Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p>No employees match the search criteria.</p>
        ) : (
          <ul className="supervisor-plan-admin-employee-scroll">
            {filteredEmployees.map((emp) => (
              <li
                key={emp.employee_id}
                className={selectedEmployee === emp.employee_id ? 'supervisor-plan-admin-active' : ''}
                onClick={() => setSelectedEmployee(emp.employee_id)}
              >
                {emp.employee_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="supervisor-plan-admin-task-details">
        {loadingTasks || loadingProjects ? (
          <p>Loading tasks or projects...</p>
        ) : selectedEmployee === null ? (
          <p>Select an employee to view tasks</p>
        ) : weekIds.length === 0 ? (
          <p>No tasks assigned for this employee.</p>
        ) : (
          <>
            <div className="supervisor-plan-admin-week-navigation">
              <button
                className="supervisor-plan-admin-nav-button"
                onClick={goToPreviousWeek}
                disabled={currentWeekIndex <= 0}
              >
                &lt;
              </button>
              <span className="supervisor-plan-admin-week-label">{formatWeekId(selectedWeekId)}</span>
              <button
                className="supervisor-plan-admin-nav-button"
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= weekIds.length - 1}
              >
                &gt;
              </button>
            </div>
            <div className="supervisor-plan-admin-tasks-container">
              {filteredTasks.length === 0 ? (
                <p>No tasks for {selectedEmployee} in week {formatWeekId(selectedWeekId)}.</p>
              ) : (
                filteredTasks.map((task) => {
                  const dateStyle = getTaskDateStyle(task.task_date, task.employee_id);
                  return (
                    <div key={task.task_id} className="supervisor-plan-admin-task-card">
                      <div className="supervisor-plan-admin-task-header">
                        <div className="supervisor-plan-admin-task-title">
                          {task.sup_review_status === 'struck' ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#a0a0a0' }}>
                                {task.task_name}
                              </span>
                              {task.replacement_task && (
                                <span style={{ color: '#007bff', marginLeft: '8px' }}>
                                  → {task.replacement_task}
                                </span>
                              )}
                            </>
                          ) : (
                            task.task_name
                          )}
                        </div>
                        <div className="supervisor-plan-admin-task-meta">
                          {task.sup_review_status !== 'pending' && (
                            <span className="supervisor-plan-admin-status-icon">
                              {task.sup_review_status === 'approved' && '✅'}
                              {task.sup_review_status === 'struck' && '📝'}
                              {task.sup_review_status === 'suspended_review' && '⛔'}
                            </span>
                          )}
                          <span className={dateStyle.className} title={dateStyle.tooltip}>
                            {formatDate(task.task_date)}
                          </span>
                          <div className="supervisor-plan-admin-project-circle-wrapper">
                            <span className="supervisor-plan-admin-project-circle">{task.project_id || 'N/A'}</span>
                            <div className="supervisor-plan-admin-tooltip">{task.project_name || 'Unknown'}</div>
                          </div>
                          <div className="supervisor-plan-admin-status-dot-wrapper">
                            <span
                              className="supervisor-plan-admin-status-dot"
                              style={{ backgroundColor: statusColor(task.emp_status) }}
                            ></span>
                            <div className="supervisor-plan-admin-tooltip">
                              {statusLabel(task.emp_status)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="supervisor-plan-admin-task-body">
                        <p><strong>Emp-Update:</strong> {task.emp_comment || '-'}</p>
                      </div>
                      <div className="supervisor-plan-admin-edit-section">
                        <label>
                          Project:
                          <select
                            value={task.project_id || ''}
                            onChange={(e) => updateTaskField(task.task_id, 'project', e.target.value)}
                          >
                            <option value="">Select Project</option>
                            {Object.entries(projects).map(([id, name]) => (
                              <option key={id} value={id}>
                                {id} - {name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Update:
                          <select
                            value={task.sup_status || 'incomplete'}
                            onChange={(e) => updateTaskField(task.task_id, 'sup_status', e.target.value)}
                          >
                            <option value="completed">Completed</option>
                            <option value="add on">Add On</option>
                            <option value="re-work">Re-work</option>
                            <option value="incomplete">Incomplete</option>
                          </select>
                        </label>
                        <label>
                          Feedback:
                          <input
                            type="text"
                            value={task.sup_comment || ''}
                            onChange={(e) => updateTaskField(task.task_id, 'sup_comment', e.target.value)}
                            placeholder="Add comment"
                          />
                        </label>
                        {task.sup_review_status === 'pending' && (
                          <label>
                            Review:
                            <select
                              value={task.sup_review_status || 'pending'}
                              style={{ color: statusColor(task.sup_review_status) }}
                              onChange={(e) => updateTaskField(task.task_id, 'sup_review_status', e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="struck">Update task</option>
                              <option value="suspended_review">Suspended</option>
                            </select>
                          </label>
                        )}
                        {task.sup_review_status === 'struck' && (
                          <label>
                            Updated task:
                            <input
                              type="text"
                              value={task.replacement_task || ''}
                              onChange={(e) => updateTaskField(task.task_id, 'replacement_task', e.target.value)}
                              placeholder="Enter updated task"
                            />
                          </label>
                        )}
                        {task.sup_review_status !== 'pending' && (
                          <label>
                            Rating:
                            <div className="supervisor-plan-admin-star-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`supervisor-plan-admin-star ${task.star_rating >= star ? 'filled' : ''}`}
                                  onClick={() => updateTaskField(task.task_id, 'star_rating', star)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </label>
                        )}
                        <button
                          className="supervisor-plan-admin-update-task-button"
                          onClick={() => saveTaskField(task.task_id)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupervisorPlanViewerAdmin;