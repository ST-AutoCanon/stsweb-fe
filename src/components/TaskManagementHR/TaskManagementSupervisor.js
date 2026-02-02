
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

 
  const getISOWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-${String(weekNo).padStart(2, "0")}`;
  };


  const formatWeekId = (weekId) => {
    if (!weekId) return "N/A";

    let year, weekNum;

    if (typeof weekId === "string" && weekId.includes("-")) {
      [year, weekNum] = weekId.split("-").map(Number);
    } else {
      weekNum = Number(weekId);
      const taskForWeek = tasks.find((t) => t.week_id === weekId);
      year = taskForWeek
        ? new Date(taskForWeek.task_date).getFullYear()
        : new Date().getFullYear();
    }

    if (isNaN(year) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      console.error("Invalid weekId:", weekId);
      return "Invalid Week";
    }


    let tempDate = new Date(year, 0, 4);
    tempDate.setDate(tempDate.getDate() + 3);
    const thursdayOfWeek1 = new Date(tempDate);
    thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
    const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

    const weekStart = addDays(thursdayOfTargetWeek, -3);
    const weekEnd = addDays(weekStart, 6);

    const formattedStart = format(weekStart, "MMM d, yyyy");
    const formattedEnd = format(weekEnd, "MMM d, yyyy");

    const displayWeekId =
      typeof weekId === "string" && weekId.includes("-")
        ? weekId
        : `${year}-${String(weekNum).padStart(2, "0")}`;

    return `${displayWeekId} (${formattedStart} - ${formattedEnd})`;
  };

  const getWeekIdForDate = (date) => {
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) return null;
    return getISOWeekNumber(taskDate);
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

  useEffect(() => {
    if (!supervisorId) return;

    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
          {
            withCredentials: true,
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
            withCredentials: true,
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
            withCredentials: true,
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
            withCredentials: true,
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
                week_id: task.week_id, 
              }))
            : [];
        setTasks(taskData);

        const uniqueWeekIds = [...new Set(taskData.map((t) => t.week_id))].sort(
          (a, b) => {
            const getWeekValue = (id) => {
              if (typeof id === "string" && id.includes("-")) {
                const [year, week] = id.split("-").map(Number);
                return year * 100 + week;
              }
              return Number(id);
            };
            return getWeekValue(a) - getWeekValue(b);
          }
        );

        if (uniqueWeekIds.length > 0) {
          setSelectedWeekId(uniqueWeekIds[uniqueWeekIds.length - 1] || null);
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
            withCredentials: true,
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
          withCredentials: true,
          headers: {
            "x-employee-id": supervisorId,
            "x-api-key": process.env.REACT_APP_API_KEY || "",
          },
          timeout: 10000,
        }
      );
      const configData = response.data.data || [];
      const freezeDaysSupervisor =
        configData.find((item) => item.key === "freeze_days_supervisor")
          ?.value || "";
      const freezeDaysEmployee =
        configData.find((item) => item.key === "freeze_days_employee")?.value ||
        "";
      setConfigModal({
        isVisible: true,
        freezeDaysSupervisor,
        freezeDaysEmployee,
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      showAlert(`Failed to load freeze days: ${msg}`);
      setConfigModal({
        isVisible: true,
        freezeDaysSupervisor: "",
        freezeDaysEmployee: "",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const updateConfig = async () => {
    const { freezeDaysSupervisor, freezeDaysEmployee } = configModal;
    if (
      !/^\d+$/.test(freezeDaysSupervisor) ||
      !/^\d+$/.test(freezeDaysEmployee)
    ) {
      showAlert("Both values must be positive integers.");
      return;
    }

    setLoadingConfig(true);
    try {
      await Promise.all([
        axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
          { key: "freeze_days_supervisor", value: freezeDaysSupervisor },
          {
            withCredentials: true,
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        ),
        axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
          { key: "freeze_days_employee", value: freezeDaysEmployee },
          {
            withCredentials: true,
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        ),
      ]);
      showAlert("Freeze days updated successfully!");
      setConfigModal({ ...configModal, isVisible: false });
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      showAlert(`Update failed: ${msg}`);
    } finally {
      setLoadingConfig(false);
    }
  };

  const updateTaskField = () => {};
  const handleReviewChange = () => {};
  const saveTaskField = async () => {
    showAlert("Task updates are currently disabled.");
  };

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
    (a, b) => {
      const getWeekValue = (id) => {
        if (typeof id === "string" && id.includes("-")) {
          const [year, week] = id.split("-").map(Number);
          return year * 100 + week;
        }
        return Number(id);
      };
      return getWeekValue(a) - getWeekValue(b);
    }
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

    let year, weekNum;

    if (typeof selectedWeekId === "string" && selectedWeekId.includes("-")) {
      [year, weekNum] = selectedWeekId.split("-").map(Number);
    } else {
      weekNum = Number(selectedWeekId);
      const taskInWeek = tasks.find((t) => t.week_id === selectedWeekId);
      year = taskInWeek
        ? new Date(taskInWeek.task_date).getFullYear()
        : new Date().getFullYear();
    }

    if (isNaN(year) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      console.error("Invalid weekId:", selectedWeekId);
      return [];
    }

    let tempDate = new Date(year, 0, 4);
    tempDate.setDate(tempDate.getDate() + 3);
    const thursdayOfWeek1 = new Date(tempDate);
    thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
    const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

    const weekStart = addDays(thursdayOfTargetWeek, -3);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
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
        if (task.employee_id === selectedEmployee) {
          const taskWeek = task.week_id;
          const selectedWeekStr =
            typeof selectedWeekId === "string" && selectedWeekId.includes("-")
              ? selectedWeekId
              : String(selectedWeekId);
          const matchesWeek =
            taskWeek === selectedWeekId ||
            (typeof taskWeek === "number" &&
              taskWeek === Number(selectedWeekId.split("-")[1])) ||
            (typeof taskWeek === "string" && taskWeek === selectedWeekStr);

          if (matchesWeek) {
            const taskDateStr = format(parseISO(task.task_date), "yyyy-MM-dd");
            if (tasksByDate[taskDateStr]) {
              tasksByDate[taskDateStr].push(task);
            }
          }
        }
      });
    }
    return tasksByDate;
  };

  const tasksByDate = getTasksByDate();

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

      {configModal.isVisible && (
        <div
          className="task-management-freeze-modal-overlay"
          onClick={() => setConfigModal({ ...configModal, isVisible: false })}
        >
          <form
            className="task-management-freeze-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="task-management-freeze-modal-header">
              <h3>Update Freeze Days</h3>
              <button
                type="button"
                className="task-management-freeze-modal-close"
                onClick={() =>
                  setConfigModal({ ...configModal, isVisible: false })
                }
                disabled={loadingConfig}
              >
                X
              </button>
            </div>

            <div className="task-management-freeze-modal-content">
              <div className="task-management-freeze-input-group">
                <label>Supervisor Freeze Days</label>
                <input
                  type="number"
                  min="0"
                  value={configModal.freezeDaysSupervisor}
                  onChange={(e) =>
                    setConfigModal({
                      ...configModal,
                      freezeDaysSupervisor: e.target.value,
                    })
                  }
                  disabled={loadingConfig}
                />
              </div>

              <div className="task-management-freeze-input-group">
                <label>Employee Freeze Days</label>
                <input
                  type="number"
                  min="0"
                  value={configModal.freezeDaysEmployee}
                  onChange={(e) =>
                    setConfigModal({
                      ...configModal,
                      freezeDaysEmployee: e.target.value,
                    })
                  }
                  disabled={loadingConfig}
                />
              </div>
            </div>

            <div className="task-management-freeze-modal-footer">
              <button
                type="button"
                onClick={() =>
                  setConfigModal({ ...configModal, isVisible: false })
                }
                disabled={loadingConfig}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateConfig}
                disabled={loadingConfig}
              >
                {loadingConfig ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="task-management-header">
        <button
          className="task-management-config-button"
          onClick={fetchConfig}
          disabled={loadingConfig}
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          {loadingConfig ? "Loading..." : "Update Freeze Days"}
        </button>
      </div>

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
