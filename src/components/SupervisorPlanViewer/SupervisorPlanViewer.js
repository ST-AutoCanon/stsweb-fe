
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal/Modal';
import './SupervisorPlanViewer.css';

const SupervisorPlanViewer = () => {
  const [supervisorId, setSupervisorId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: '',
  });

  const showAlert = (message) => {
    setAlertModal({ isVisible: true, message });
    setTimeout(() => closeAlert(), 5000);
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, message: '' });
  };

  const formatWeekId = (weekId) => (weekId ? `Week ${weekId}` : 'N/A');

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
          `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/employees`,
          { headers: { 'x-employee-id': supervisorId }, timeout: 10000 }
        );
        const empData = Array.isArray(response.data.employees)
          ? response.data.employees.map(emp => ({
              ...emp,
              employee_id: emp.employee_id?.trim().toUpperCase()
            }))
          : [];
        if (empData.length === 0) {
          setError('No employees assigned to you.');
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
        console.error('Error fetching employees:', errorMessage);
        setError(errorMessage);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [supervisorId]);

  useEffect(() => {
    if (!supervisorId) return;

    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${supervisorId}`,
          { headers: { 'x-employee-id': supervisorId }, timeout: 10000 }
        );
        console.log('Tasks API response:', res.data);
        const validStatuses = ['not started', 'working', 'completed', 'suspended'];
        const taskData = res.data.success && Array.isArray(res.data.data)
          ? res.data.data.map(task => ({
              ...task,
              employee_id: task.employee_id?.trim().toUpperCase(),
              emp_status: validStatuses.includes(task.emp_status) ? task.emp_status : 'not started'
            }))
          : [];
        console.log('Processed tasks:', taskData);
        setTasks(taskData);
        if (taskData.length > 0) {
          const weekIds = [...new Set(taskData.map(task => task.week_id))].sort((a, b) => a - b);
          setSelectedWeekId(weekIds[weekIds.length - 1]);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === 'ECONNABORTED'
          ? 'Request timed out: Unable to connect to server'
          : `Network error: ${err.message}`;
        console.error('Error fetching tasks:', errorMessage);
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
            headers: { 'x-api-key': process.env.REACT_APP_API_KEY || '' },
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
        console.error('Error fetching projects:', errorMessage);
        setError(errorMessage);
        setProjects({});
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedEmployee]);

  const updateTaskField = (taskId, field, value, isEditable) => {
    if (!isEditable) {
      showAlert('Cannot edit: Task is from more than two days ago.');
      return;
    }
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

  const saveTaskField = async (taskId, isEditable) => {
    if (!isEditable) {
      showAlert('Cannot update: Task is from more than two days ago.');
      return;
    }
    const task = tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Task with task_id ${taskId} not found`);
      showAlert('Task not found');
      return;
    }

    try {
      console.log(`Saving task_id: ${taskId}, sup_status: ${task.sup_status}, project_id: ${task.project_id}`);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
        {
          sup_status: task.sup_status || 'incomplete',
          sup_comment: task.sup_comment || '',
          sup_review_status: task.sup_review_status || 'pending',
          replacement_task: task.replacement_task || null,
          star_rating: task.star_rating || 0,
          project_id: task.project_id,
          project_name: task.project_name,
        },
        { headers: { 'x-employee-id': supervisorId }, timeout: 10000 }
      );
      console.log(`Task ${taskId} updated successfully`, response.data);
      showAlert(response.data.message || 'Task updated successfully');

      if (response.data.newTask) {
        const newTask = {
          ...response.data.newTask,
          employee_name: employees.find(emp => emp.employee_id === response.data.newTask.employee_id)?.employee_name || 'Unknown',
          employee_id: response.data.newTask.employee_id?.trim().toUpperCase(),
          emp_status: response.data.newTask.emp_status || 'not started'
        };
        console.log(`New task added: task_id=${newTask.task_id}, week_id=${newTask.week_id}, task_date=${newTask.task_date}, emp_status=${newTask.emp_status}`);
        setTasks((prev) => [...prev.filter(t => t.task_id !== newTask.task_id), newTask]);
        if (newTask.week_id !== selectedWeekId) {
          console.log(`Switching to week_id: ${newTask.week_id}`);
          setSelectedWeekId(newTask.week_id);
        }
      }
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

  const isTaskEditable = (taskDate) => {
    if (!taskDate) return false;
    const taskDateObj = new Date(taskDate);
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Reset time components to compare dates only
    taskDateObj.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    // Calculate the earliest editable date (current date - 2 days)
    const earliestEditableDate = new Date(currentDate);
    earliestEditableDate.setDate(currentDate.getDate() - 2);
    
    // Task is editable if its date is on or after the earliest editable date
    return taskDateObj >= earliestEditableDate;
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

  const filteredTasks = selectedEmployee && selectedWeekId
    ? tasks.filter(task => {
        const matchesEmployee = task.employee_id === selectedEmployee;
        const matchesWeek = task.week_id === selectedWeekId;
        console.log(`Task ${task.task_id}: employee_id=${task.employee_id}, selectedEmployee=${selectedEmployee}, matchesEmployee=${matchesEmployee}, week_id=${task.week_id}, matchesWeek=${matchesWeek}, emp_status=${task.emp_status}`);
        return matchesEmployee && matchesWeek;
      })
    : [];

  if (!supervisorId) {
    return (
      <div className="supervisor-plan-wrapper">
        <div className="supervisor-plan-error-message">
          {error || 'Supervisor ID is missing. Please '}
          <a href="/login">log in again</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="supervisor-plan-wrapper">
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: 'OK', onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
      <div className="supervisor-plan-employee-list">
        <h3>Employees</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loadingEmployees ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees under you.</p>
        ) : (
          <ul className="supervisor-plan-employee-scroll">
            {employees.map((emp) => (
              <li
                key={emp.employee_id}
                className={selectedEmployee === emp.employee_id ? 'supervisor-plan-active' : ''}
                onClick={() => setSelectedEmployee(emp.employee_id)}
              >
                {emp.employee_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="supervisor-plan-task-details">
        {loadingTasks || loadingProjects ? (
          <p>Loading tasks or projects...</p>
        ) : selectedEmployee === null ? (
          <p>Select an employee to view tasks</p>
        ) : weekIds.length === 0 ? (
          <p>No tasks assigned for this employee.</p>
        ) : (
          <>
            <div className="supervisor-plan-week-navigation">
              <button
                className="supervisor-plan-nav-button"
                onClick={goToPreviousWeek}
                disabled={currentWeekIndex <= 0}
              >
                &lt;
              </button>
              <span className="supervisor-plan-week-label">{formatWeekId(selectedWeekId)}</span>
              <button
                className="supervisor-plan-nav-button"
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= weekIds.length - 1}
              >
                &gt;
              </button>
            </div>
            <div className="supervisor-plan-tasks-container">
              {filteredTasks.length === 0 ? (
                <p>No tasks for {selectedEmployee} in week {formatWeekId(selectedWeekId)}.</p>
              ) : (
                filteredTasks.map((task) => {
                  const editable = isTaskEditable(task.task_date);
                  return (
                    <div key={task.task_id} className="supervisor-plan-task-card">
                      <div className="supervisor-plan-task-header">
                        <div className="supervisor-plan-task-title">
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
                        <div className="supervisor-plan-task-meta">
                          {task.sup_review_status !== 'pending' && (
                            <span className="supervisor-plan-status-icon">
                              {task.sup_review_status === 'approved' && '✅'}
                              {task.sup_review_status === 'struck' && '📝'}
                              {task.sup_review_status === 'suspended_review' && '⛔'}
                            </span>
                          )}
                          <span className="supervisor-plan-task-date">{formatDate(task.task_date)}</span>
                          <div className="supervisor-plan-project-circle-wrapper">
                            <span className="supervisor-plan-project-circle">{task.project_id}</span>
                            <div className="supervisor-plan-tooltip">{task.project_name}</div>
                          </div>
                          <div className="supervisor-plan-status-dot-wrapper">
                            <span
                              className="supervisor-plan-status-dot"
                              style={{ backgroundColor: statusColor(task.emp_status) }}
                            ></span>
                            <div className="supervisor-plan-tooltip">
                              {statusLabel(task.emp_status)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="supervisor-plan-task-body">
                        <p><strong>Emp-Update:</strong> {task.emp_comment || '-'}</p>
                      </div>
                      <div className="supervisor-plan-edit-section" style={{ opacity: editable ? 2 : 0.9 }}>
                        <label>
                          Project:
                          <select
                            value={task.project_id || ''}
                            onChange={(e) => updateTaskField(task.task_id, 'project', e.target.value, editable)}
                            disabled={!editable}
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
                            onChange={(e) => updateTaskField(task.task_id, 'sup_status', e.target.value, editable)}
                            disabled={!editable}
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
                            onChange={(e) => updateTaskField(task.task_id, 'sup_comment', e.target.value, editable)}
                            placeholder="Add comment"
                            disabled={!editable}
                          />
                        </label>
                        {task.sup_review_status === 'pending' && (
                          <label>
                            Review:
                            <select
                              value={task.sup_review_status || 'pending'}
                              style={{ color: statusColor(task.sup_review_status) }}
                              onChange={(e) => updateTaskField(task.task_id, 'sup_review_status', e.target.value, editable)}
                              disabled={!editable}
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
                              onChange={(e) => updateTaskField(task.task_id, 'replacement_task', e.target.value, editable)}
                              placeholder="Enter updated task"
                              disabled={!editable}
                            />
                        </label>
                        )}
                        {task.sup_review_status !== 'pending' && (
                          <label>
                            Rating:
                            <div className="supervisor-plan-star-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`supervisor-plan-star ${task.star_rating >= star ? 'filled' : ''}`}
                                  onClick={() => editable && updateTaskField(task.task_id, 'star_rating', star, editable)}
                                  style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </label>
                        )}
                        <button
                          className="supervisor-plan-update-task-button"
                          onClick={() => saveTaskField(task.task_id, editable)}
                          disabled={!editable}
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

export default SupervisorPlanViewer;