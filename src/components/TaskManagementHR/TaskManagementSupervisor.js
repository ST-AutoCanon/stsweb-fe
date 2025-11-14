import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getISOWeek,
  startOfISOWeek,
  endOfISOWeek,
  format,
  parseISO,
  addDays,
} from "date-fns";
import Modal from "../Modal/Modal";
import "./TaskManagementSupervisor.css";

const TaskManagementSupervisor = () => {
  const [supervisorId, setSupervisorId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
    message: "",
  });
  const [configModal, setConfigModal] = useState({
    isVisible: false,
    freezeDaysSupervisor: "",
    freezeDaysEmployee: "",
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [pendingReviewChanges, setPendingReviewChanges] = useState({});

  const showAlert = (message) => {
    setAlertModal({ isVisible: true, message });
    setTimeout(() => closeAlert(), 5000);
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, message: "" });
  };

  const formatWeekId = (weekId) => {
    if (weekId === null) return "N/A";
    const currentYear = new Date().getFullYear();
    const startDate = startOfISOWeek(new Date(currentYear, 0, 1));
    const weekStart = new Date(
      startDate.getTime() + (weekId - 1) * 7 * 24 * 60 * 60 * 1000
    );
    const weekEnd = endOfISOWeek(weekStart);
    const formattedStart = format(weekStart, "MMM d, yyyy");
    const formattedEnd = format(weekEnd, "MMM d, yyyy");
    return `Week ${weekId} (${formattedStart} - ${formattedEnd})`;
  };

  const getWeekIdForDate = (date) => {
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) return null;
    return getISOWeek(taskDate);
  };

  useEffect(() => {
    const data = localStorage.getItem("dashboardData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.employeeId) {
          setSupervisorId(String(parsed.employeeId));
        } else {
          setError(
            "No employeeId found in dashboardData. Please log in again."
          );
        }
      } catch (e) {
        setError("Failed to parse dashboardData. Please log in again.");
      }
    } else {
      setError("No dashboardData found in localStorage. Please log in again.");
    }
  }, []);

  /* ------------------- FETCH DATA ------------------- */
  useEffect(() => {
    if (!supervisorId) return;

    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
          {
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        const empData = Array.isArray(response.data.employees)
          ? response.data.employees.map((emp) => ({
              ...emp,
              employee_id: emp.employee_id?.trim().toUpperCase(),
            }))
          : [];
        if (empData.length === 0) {
          setError("No active employees available.");
        } else {
          setEmployees(empData);
          setSelectedEmployee(empData[0]?.employee_id || null);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${
              err.response.data?.error || err.response.statusText
            }`
          : err.code === "ECONNABORTED"
          ? "Request timed out: Unable to connect to server"
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
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        const holidayData = Array.isArray(response.data.holidays)
          ? response.data.holidays.map((holiday) => holiday.date)
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
            params: { status: "Approved" },
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        const leaveData = Array.isArray(response.data.data)
          ? response.data.data.map((leave) => ({
              employee_id: leave.employee_id?.trim().toUpperCase(),
              start_date: leave.start_date,
              end_date: leave.end_date,
              h_f_day: leave.H_F_day,
            }))
          : [];
        setApprovedLeaves(leaveData);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${
              err.response.data?.error || err.response.statusText
            }`
          : err.code === "ECONNABORTED"
          ? "Request timed out: Unable to connect to server"
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
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        const validStatuses = [
          "not started",
          "working",
          "completed",
          "suspended",
        ];
        const taskData =
          res.data.success && Array.isArray(res.data.data)
            ? res.data.data.map((task) => ({
                ...task,
                employee_id: task.employee_id?.trim().toUpperCase(),
                emp_status: validStatuses.includes(task.emp_status)
                  ? task.emp_status
                  : "not started",
                week_id: Number(task.week_id),
              }))
            : [];
        setTasks(taskData);
        if (taskData.length > 0) {
          const weekIds = [
            ...new Set(taskData.map((task) => task.week_id)),
          ].sort((a, b) => a - b);
          setSelectedWeekId(weekIds[weekIds.length - 1] || null);
        } else {
          setSelectedWeekId(null);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${
              err.response.data?.error || err.response.statusText
            }`
          : err.code === "ECONNABORTED"
          ? "Request timed out: Unable to connect to server"
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
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
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
          ? `Error ${err.response.status}: ${
              err.response.data?.error || err.response.statusText
            }`
          : err.code === "ECONNABORTED"
          ? "Request timed out: Unable to connect to server"
          : `Network error: ${err.message}`;
        setError(errorMessage);
        setProjects({});
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedEmployee]);

  /* ------------------- FREEZE DAYS (DISABLED) ------------------- */
  const fetchConfig = async () => {
    // *** DISABLED *** – we never open the modal
    showAlert("Freeze-days configuration is currently disabled.");
    return;
  };

  const updateConfig = async () => {
    // *** DISABLED ***
    showAlert("Freeze-days update is disabled.");
  };

  /* ------------------- TASK EDITING (DISABLED) ------------------- */
  const updateTaskField = () => {
    // No-op – fields are read-only
  };

  const handleReviewChange = () => {
    // No-op
  };

  const saveTaskField = async () => {
    // *** ALWAYS DISABLED ***
    showAlert("Task updates are currently disabled.");
  };

  /* ------------------- UTILS ------------------- */
  const statusColor = (status) => {
    switch (status) {
      case "completed":
        return "#28a745";
      case "working":
        return "#3770ecff";
      case "not started":
        return "#888";
      case "suspended":
        return "#dc3545";
      default:
        return "#007bff";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "working":
        return "Working";
      case "not started":
        return "Not Started";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTaskDateStyle = (dateString, employeeId) => {
    if (!dateString) {
      return {
        className:
          "task-management-task-date task-management-task-date-regular",
        tooltip: "N/A",
      };
    }
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);
    const isApprovedLeave = approvedLeaves.some((leave) => {
      if (leave.employee_id !== employeeId) return false;
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const isHalfDay = leave.h_f_day.toLowerCase().includes("half");
      if (isHalfDay) {
        return taskDate.getTime() === startDate.getTime();
      }
      return (
        taskDate.getTime() >= startDate.getTime() &&
        taskDate.getTime() <= endDate.getTime()
      );
    });
    const isSunday = taskDate.getDay() === 0;
    const isHoliday = holidays.some((holiday) => {
      const holidayDate = new Date(holiday);
      holidayDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === holidayDate.getTime();
    });
    if (isApprovedLeave) {
      return {
        className: "task-management-task-date task-management-task-date-leave",
        tooltip: "Leave",
      };
    }
    if (isHoliday) {
      return {
        className:
          "task-management-task-date task-management-task-date-holiday",
        tooltip: "Holiday",
      };
    }
    if (isSunday) {
      return {
        className: "task-management-task-date task-management-task-date-sunday",
        tooltip: "Sunday",
      };
    }
    return {
      className: "task-management-task-date task-management-task-date-regular",
      tooltip: formatDate(dateString),
    };
  };

  const getReviewStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#28a745";
      case "struck":
        return "#ffc107";
      case "suspended_review":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const weekIds = [...new Set(tasks.map((task) => task.week_id))].sort(
    (a, b) => a - b
  );
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

  const filteredEmployees = employees.filter((emp) =>
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateWeekDays = () => {
    if (!selectedWeekId) return [];
    const currentYear = new Date().getFullYear();
    const weekStartDate = startOfISOWeek(new Date(currentYear, 0, 1));
    const adjustedStart = addDays(weekStartDate, (selectedWeekId - 1) * 7);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(adjustedStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dateDisplay = format(date, "MMM d");
      days.push({ dateStr, dateDisplay });
    }
    return days;
  };

  const weekDays = generateWeekDays();

  const getTasksByDate = () => {
    const tasksByDate = {};
    weekDays.forEach(({ dateStr }) => {
      tasksByDate[dateStr] = [];
    });
    if (selectedEmployee && selectedWeekId) {
      tasks.forEach((task) => {
        if (
          task.employee_id === selectedEmployee &&
          task.week_id === selectedWeekId
        ) {
          const taskDateStr = format(parseISO(task.task_date), "yyyy-MM-dd");
          if (tasksByDate[taskDateStr]) {
            tasksByDate[taskDateStr].push(task);
          }
        }
      });
    }
    return tasksByDate;
  };

  const tasksByDate = getTasksByDate();

  /* ------------------- RENDER ------------------- */
  if (!supervisorId) {
    return (
      <div className="task-management-wrapper">
        <div className="task-management-error-message">
          {error || "Supervisor ID is missing. Please "}
          <a href="/login">log in again</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="task-management-wrapper">
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>

      {/* ---- FREEZE DAYS BUTTON (DISABLED) ---- */}
      <div className="task-management-header">
        <button
          className="task-management-config-button"
          onClick={fetchConfig}
          disabled={true} // ALWAYS disabled
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          Update Freeze Days
        </button>
      </div>

      {/* ---- EMPLOYEE LIST ---- */}
      <div className="task-management-employee-list">
        <h3>Employees</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search employees by name"
          className="task-management-search-bar"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loadingEmployees || loadingHolidays || loadingLeaves ? (
          <p>Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p>No employees match the search criteria.</p>
        ) : (
          <ul className="task-management-employee-scroll">
            {filteredEmployees.map((emp) => (
              <li
                key={emp.employee_id}
                className={
                  selectedEmployee === emp.employee_id
                    ? "task-management-active"
                    : ""
                }
                onClick={() => setSelectedEmployee(emp.employee_id)}
              >
                {emp.employee_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---- TASK DETAILS ---- */}
      <div className="task-management-task-details">
        {loadingTasks || loadingProjects ? (
          <p>Loading tasks or projects...</p>
        ) : selectedEmployee === null ? (
          <p>Select an employee to view tasks</p>
        ) : weekIds.length === 0 ? (
          <p>No tasks assigned for this employee.</p>
        ) : (
          <>
            <div className="task-management-week-navigation">
              <button
                className="task-management-nav-button"
                onClick={goToPreviousWeek}
                disabled={currentWeekIndex <= 0}
              >
                &lt;
              </button>
              <span className="task-management-week-label">
                {formatWeekId(selectedWeekId)}
              </span>
              <button
                className="task-management-nav-button"
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= weekIds.length - 1}
              >
                &gt;
              </button>
            </div>

            <div className="task-management-tasks-container">
              {weekDays.map(({ dateStr, dateDisplay }) => {
                const dayTasks = tasksByDate[dateStr] || [];
                const sampleTaskForStyle = dayTasks[0] || {
                  task_date: dateStr,
                  employee_id: selectedEmployee,
                };
                const dateStyle = getTaskDateStyle(
                  sampleTaskForStyle.task_date,
                  selectedEmployee
                );
                return (
                  <div key={dateStr} className="task-management-day-group">
                    <div className="task-management-day-header">
                      <span
                        className={dateStyle.className}
                        title={dateStyle.tooltip}
                      >
                        {dateDisplay}
                      </span>
                    </div>
                    {dayTasks.length === 0 ? (
                      <p className="task-management-no-tasks">
                        No tasks assigned for this day.
                      </p>
                    ) : (
                      dayTasks.map((task) => {
                        const taskDateStyle = getTaskDateStyle(
                          task.task_date,
                          task.employee_id
                        );
                        const effectiveReviewStatus =
                          pendingReviewChanges[task.task_id] ||
                          task.sup_review_status;
                        const isFrozen =
                          task.sup_review_status === "suspended_review";
                        const showReviewSelect =
                          task.sup_review_status === "pending" &&
                          !pendingReviewChanges[task.task_id];
                        return (
                          <div
                            key={task.task_id}
                            className={`task-management-task-card ${
                              isFrozen ? "task-management-task-frozen" : ""
                            }`}
                          >
                            <div className="task-management-task-header">
                              <div className="task-management-task-title">
                                {effectiveReviewStatus === "struck" ? (
                                  <>
                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "#a0a0a0",
                                      }}
                                    >
                                      {task.task_name}
                                    </span>
                                    {task.replacement_task && (
                                      <span
                                        style={{
                                          color: "#007bff",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        → {task.replacement_task}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  task.task_name
                                )}
                              </div>
                              <div className="task-management-task-meta">
                                {effectiveReviewStatus !== "pending" && (
                                  <span className="task-management-status-icon">
                                    {effectiveReviewStatus === "approved" &&
                                      "✅"}
                                    {effectiveReviewStatus === "struck" && "📝"}
                                    {effectiveReviewStatus ===
                                      "suspended_review" && "⛔"}
                                  </span>
                                )}
                                <span
                                  className={taskDateStyle.className}
                                  title={taskDateStyle.tooltip}
                                >
                                  {formatDate(task.task_date)}
                                </span>
                                <div className="task-management-project-circle-wrapper">
                                  <span className="task-management-project-circle">
                                    {task.project_id || "N/A"}
                                  </span>
                                  <div className="task-management-tooltip">
                                    {task.project_name || "Unknown"}
                                  </div>
                                </div>
                                <div className="task-management-status-dot-wrapper">
                                  <span
                                    className="task-management-status-dot"
                                    style={{
                                      backgroundColor: statusColor(
                                        task.emp_status
                                      ),
                                    }}
                                  ></span>
                                  <div className="task-management-tooltip">
                                    {statusLabel(task.emp_status)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="task-management-task-body">
                              <p>
                                <strong>Emp-Update:</strong>{" "}
                                {task.emp_comment || "-"}
                              </p>
                            </div>
                            {isFrozen && (
                              <div className="task-management-frozen-message">
                                This task is suspended and frozen. No edits
                                allowed.
                              </div>
                            )}
                            {/* ---- EDIT SECTION (READ-ONLY) ---- */}
                            <div
                              className={`task-management-edit-section ${
                                isFrozen
                                  ? "task-management-edit-section-disabled"
                                  : ""
                              }`}
                            >
                              <label>
                                Project:
                                <select value={task.project_id || ""} disabled>
                                  <option value="">Select Project</option>
                                  {Object.entries(projects).map(
                                    ([id, name]) => (
                                      <option key={id} value={id}>
                                        {id} - {name}
                                      </option>
                                    )
                                  )}
                                </select>
                              </label>
                              <label>
                                Update:
                                <select
                                  value={task.sup_status || "incomplete"}
                                  disabled
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
                                  value={task.sup_comment || ""}
                                  placeholder="Add comment"
                                  disabled
                                />
                              </label>
                              {showReviewSelect && (
                                <label>
                                  Review:
                                  <select
                                    value={task.sup_review_status || "pending"}
                                    style={{
                                      color: getReviewStatusColor(
                                        task.sup_review_status
                                      ),
                                    }}
                                    disabled
                                  >
                                    {/* options kept for UI consistency */}
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="struck">Update task</option>
                                    <option value="suspended_review">
                                      Suspended
                                    </option>
                                  </select>
                                </label>
                              )}
                              {effectiveReviewStatus === "struck" && (
                                <label>
                                  Updated task:
                                  <input
                                    type="text"
                                    value={task.replacement_task || ""}
                                    placeholder="Enter updated task"
                                    disabled
                                  />
                                </label>
                              )}
                              {effectiveReviewStatus !== "pending" && (
                                <label>
                                  Rating:
                                  <div className="task-management-star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        className={`task-management-star ${
                                          task.star_rating >= star
                                            ? "filled"
                                            : ""
                                        }`}
                                        style={{ cursor: "default" }}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </label>
                              )}
                              {/* ---- UPDATE BUTTON (DISABLED) ---- */}
                              <button
                                className="task-management-update-task-button"
                                onClick={saveTaskField}
                                disabled={true}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManagementSupervisor;
