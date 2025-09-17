

import React, { useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./TaskManagement.css";
import SupervisorPlanViewer from "../SupervisorPlanViewer/SupervisorPlanViewer";
import Modal from "../Modal/Modal";

const getProgressColor = (p) => {
  if (p < 40) return "#ef4444";
  if (p < 70) return "#f59e0b";
  return "#10b981";
};

const parseDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error("Invalid date in parseDate:", dateStr);
    return "";
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDate = (date) => {
  if (!date) return "";
  if (date instanceof Date && !isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  if (typeof date === "string") {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    }
    console.error("Invalid string date format in formatDate:", date);
    return "";
  }
  console.error("Invalid date input in formatDate:", date);
  return "";
};

const displayDate = (date) => {
  if (!date) return "";
  let d;
  if (date instanceof Date && !isNaN(date.getTime())) {
    d = date;
  } else if (typeof date === "string") {
    d = new Date(date);
    if (isNaN(d.getTime()) && date.includes("-")) {
      const parts = date.split("-");
      if (parts.length === 3) {
        d = new Date(parts[2], parts[1] - 1, parts[0]);
        if (isNaN(d.getTime())) {
          d = new Date(parts[0], parts[1] - 1, parts[2]);
        }
      }
    }
  }
  if (!d || isNaN(d.getTime())) {
    console.error("Invalid date in displayDate:", date);
    return "";
  }
  return parseDate(d);
};

const TaskManagement = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Progress");
  const [mainTab, setMainTab] = useState("Task Board");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employeeId: "",
    startDate: null,
    endDate: null,
    status: "Yet to Start",
    percentage: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [supervisorId, setSupervisorId] = useState(null);
  const [editingProgress, setEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempStatus, setTempStatus] = useState("");
  const [alertModal, setAlertModal] = useState({ isVisible: false, title: "", message: "" });
  const defaultProfileImage = "https://placehold.co/80x80";
  const photoUrlCache = {};

  const normalizePhotoUrl = (photoUrl) => {
    if (!photoUrl) return defaultProfileImage;
    if (Array.isArray(photoUrl)) return photoUrl[0] || defaultProfileImage;
    if (typeof photoUrl === "string" && photoUrl.startsWith("/")) {
      return `${process.env.REACT_APP_BACKEND_URL}${photoUrl}`;
    }
    return photoUrl || defaultProfileImage;
  };

  async function fetchPhotoUrl(employeeId) {
    if (photoUrlCache[employeeId]) return photoUrlCache[employeeId];
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/employee-personal/${employeeId}`, {
        headers: { "x-employee-id": supervisorId },
      });
      const photoUrl = normalizePhotoUrl(response.data.photo_url);
      photoUrlCache[employeeId] = photoUrl;
      return photoUrl;
    } catch (err) {
      photoUrlCache[employeeId] = defaultProfileImage;
      return defaultProfileImage;
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("dashboardData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.employeeId) {
          setSupervisorId(String(parsed.employeeId));
        } else {
          setError("No employeeId found in dashboardData. Please log in again.");
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supervisor/employees`, {
          headers: { "x-employee-id": supervisorId },
        });
        if (!response.data.employees || !Array.isArray(response.data.employees)) {
          throw new Error("No employees found in response or invalid data format");
        }
        setEmployees(response.data.employees);
        setError(null);
      } catch (err) {
        let errorMessage = "Failed to fetch employees";
        if (err.response) errorMessage = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText || "Unknown server error"}`;
        else if (err.request) errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        else errorMessage = `Request setup error: ${err.message}`;
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
          headers: { "x-employee-id": supervisorId },
        });
        const tasksWithPhotos = await Promise.all(
          response.data.map(async (task) => {
            const employee = employees.find((emp) => emp.employee_id === task.employee_id);
            const photoUrl = employee ? normalizePhotoUrl(employee.photo_url) : await fetchPhotoUrl(task.employee_id);
            return {
              id: `Task-${task.task_id}`,
              title: task.task_title,
              description: task.description,
              status: task.status,
              startDate: formatDate(task.start_date),
              endDate: formatDate(task.due_date),
              employeeId: task.employee_id,
              user: {
                name: employee?.employee_name || "Loading...",
                profile: photoUrl,
              },
              progress: task.percentage,
              messages: [],
            };
          })
        );
        setTasks(tasksWithPhotos);
        setError(null);
      } catch (err) {
        let errorMessage = "Failed to fetch tasks";
        if (err.response) errorMessage = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText || "Unknown server error"}`;
        else if (err.request) errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        else errorMessage = `Request setup error: ${err.message}`;
        setError(errorMessage);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [supervisorId, employees]);

  useEffect(() => {
    if (employees.length > 0) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          const employee = employees.find((emp) => emp.employee_id === task.employeeId);
          const photoUrl = employee ? normalizePhotoUrl(employee.photo_url) : task.user.profile;
          return {
            ...task,
            user: {
              ...task.user,
              name: employee?.employee_name || "Unknown",
              profile: photoUrl,
            },
          };
        })
      );
    }
  }, [employees]);

  useEffect(() => {
    if (!selectedTaskId || !supervisorId) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      const taskId = selectedTaskId.split("-")[1];
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${taskId}`, {
          headers: { "x-employee-id": supervisorId },
        });
        if (response.status === 200) {
          if (response.data.success) {
            const { progressMessages = [], clarificationMessages = [] } = response.data;
            const allMessages = [
              ...progressMessages.map((msg) => {
                const employee = employees.find((emp) => String(emp.employee_id) === String(msg.sender));
                return {
                  text: msg.text,
                  time: msg.time,
                  sender: msg.sender,
                  senderName: msg.sender === "Supervisor" ? "You" : employee?.employee_name || "Unknown Employee",
                  type: "Progress",
                };
              }),
              ...clarificationMessages.map((msg) => {
                const employee = employees.find((emp) => String(emp.employee_id) === String(msg.sender));
                return {
                  text: msg.text,
                  time: msg.time,
                  sender: msg.sender,
                  senderName: msg.sender === "Supervisor" ? "You" : employee?.employee_name || "Unknown Employee",
                  type: "Clarification",
                };
              }),
            ].sort((a, b) => new Date(a.time) - new Date(b.time));
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === selectedTaskId
                  ? {
                      ...task,
                      messages: allMessages,
                      progress: allMessages
                        .filter((msg) => msg.type === "Progress")
                        .reduce((max, msg) => (isNaN(parseInt(msg.text)) ? max : Math.max(max, parseInt(msg.text))), task.progress),
                    }
                  : task
              )
            );
            setError(null);
          } else {
            throw new Error(response.data.message || "Failed to fetch messages");
          }
        } else if (response.status === 404) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === selectedTaskId ? { ...task, messages: [] } : task))
          );
          setError(null);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        let errorMessage = "Failed to fetch messages";
        if (err.response) {
          if (err.response.status === 404) {
            console.log(`No messages found for taskId: ${taskId}, treated as valid case`);
          } else {
            errorMessage = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText || "Unknown server error"}`;
          }
        } else if (err.request) {
          errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        } else {
          errorMessage = `Request setup error: ${err.message}`;
        }
        if (errorMessage !== "Failed to fetch messages") {
          setError(errorMessage);
        }
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedTaskId, supervisorId, employees]);

  const columns = useMemo(
    () => [
      { key: "Yet to Start", title: "Yet to Start", color: "#7c7d1e" },
      { key: "In Progress", title: "In Progress", color: "#1d4ed8" },
      { key: "On-Hold", title: "On-Hold", color: "#9d174d" },
      { key: "Completed", title: "Completed", color: "#065f46" },
    ],
    []
  );

  const selectedTask = useMemo(() => tasks.find((t) => t.id === selectedTaskId) || null, [tasks, selectedTaskId]);

  const currentDate = new Date(2025, 8, 17, 11, 37); // 11:37 AM IST, September 17, 2025

  const openDetails = (taskId) => setSelectedTaskId(taskId);

  const closeDetails = () => {
    setSelectedTaskId(null);
    setMessageText("");
    setActiveTab("Progress");
    setEditingProgress(false);
    setTempProgress(0);
    setTempStatus("");
  };

  const startEditingProgress = () => {
    if (selectedTask) {
      setTempProgress(selectedTask.progress);
      setTempStatus(selectedTask.status);
      setEditingProgress(true);
    }
  };

  const handleSliderChange = (e) => {
    const newProgress = parseInt(e.target.value, 10);
    setTempProgress(newProgress);
  };

  const handleStatusChange = (e) => {
    setTempStatus(e.target.value);
  };

  const saveProgress = async () => {
    if (!selectedTask || !supervisorId) return;
    try {
      const taskId = selectedTask.id.split("-")[1];
      const updateData = {
        status: tempStatus,
        percentage: tempProgress !== undefined ? tempProgress : null,
        progress_percentage: tempProgress !== undefined ? tempProgress : null,
      };
      setTasks((prev) =>
        prev.map((t) => (t.id === selectedTask.id ? { ...t, status: tempStatus, progress: tempProgress } : t))
      );
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/employee-tasks/update/${taskId}`,
        updateData,
        { headers: { "x-employee-id": supervisorId } }
      );
      if (response.data.success || response.data.message === "Task updated successfully") {
        const refreshedTask = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`, {
          headers: { "x-employee-id": supervisorId },
        });
        const updatedTask = refreshedTask.data;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === selectedTask.id ? { ...t, status: updatedTask.status, progress: updatedTask.percentage } : t
          )
        );
        setError(null);
        setEditingProgress(false);
        if (tempProgress !== selectedTask.progress && tempProgress !== undefined) {
          const messageData = {
            taskId,
            sender: "Supervisor",
            type: "Progress",
            text: `${tempProgress}%`,
          };
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, messageData, {
            headers: { "x-employee-id": supervisorId },
          });
        }
        setAlertModal({ isVisible: true, message: "Task updated successfully" });
      } else {
        throw new Error(response.data.message || "Unexpected server response");
      }
    } catch (err) {
      let errorMessage = "Failed to update task";
      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Network error: Unable to connect to the server";
      } else {
        errorMessage = `Request setup error: ${err.message}`;
      }
      setError(errorMessage);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, progress: selectedTask.progress, status: selectedTask.status } : t
        )
      );
      setEditingProgress(false);
      setTempProgress(selectedTask.progress);
      setTempStatus(selectedTask.status);
    }
  };

  const cancelEditing = () => {
    setEditingProgress(false);
    setTempProgress(selectedTask ? selectedTask.progress : 0);
    setTempStatus(selectedTask ? selectedTask.status : "");
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedTask || !supervisorId) return;
    try {
      const taskId = selectedTask.id.split("-")[1];
      const messageData = {
        taskId,
        sender: "Supervisor",
        type: activeTab,
        text,
      };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, messageData, {
        headers: { "x-employee-id": supervisorId },
      });
      if (response.data.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === selectedTask.id
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      text,
                      time: new Date().toISOString(),
                      sender: "Supervisor",
                      senderName: "You",
                      type: activeTab,
                    },
                  ].sort((a, b) => new Date(a.time) - new Date(b.time)),
                  ...(activeTab === "Progress" && !isNaN(parseInt(text)) ? { progress: parseInt(text) } : {}),
                }
              : t
          )
        );
        setMessageText("");
        setError(null);
      } else {
        throw new Error(response.data.error || "Failed to send message");
      }
    } catch (err) {
      let errorMessage = "Failed to send message";
      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText || "Unknown server error"}`;
      } else if (err.request) {
        errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
      } else {
        errorMessage = `Request setup error: ${err.message}`;
      }
      setError(errorMessage);
    }
  };

  const openAssignForm = () => setShowAssignForm(true);

  const closeAssignForm = () => {
    setShowAssignForm(false);
    setFormData({
      title: "",
      description: "",
      employeeId: "",
      startDate: null,
      endDate: null,
      status: "Yet to Start",
      percentage: 0,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { title, description, employeeId, startDate, endDate, status, percentage } = formData;
    if (!title || !employeeId || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!(startDate instanceof Date) || isNaN(startDate.getTime()) || !(endDate instanceof Date) || isNaN(endDate.getTime())) {
      setError("Invalid start or end date.");
      return;
    }
    try {
      const selectedEmployee = employees.find((emp) => emp.employee_id === employeeId);
      const newTaskId = tasks.length ? `Task-${Math.max(...tasks.map((t) => parseInt(t.id.split("-")[1]))) + 1}` : "Task-1";
      const taskData = {
        employee_id: employeeId,
        task_title: title,
        description,
        start_date: formatDate(startDate),
        due_date: formatDate(endDate),
        status,
        percentage,
      };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, taskData, {
        headers: { "x-employee-id": supervisorId },
      });
      const photoUrl = normalizePhotoUrl(selectedEmployee?.photo_url) || (await fetchPhotoUrl(employeeId));
      setTasks((prev) => [
        ...prev,
        {
          id: newTaskId,
          title: title,
          description,
          status,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          employeeId,
          user: {
            name: selectedEmployee?.employee_name || "Unknown Employee",
            profile: photoUrl,
          },
          progress: percentage,
          messages: [],
        },
      ]);
      setError(null);
      closeAssignForm();
      setAlertModal({ isVisible: true, message: "Assigned task successfully" });
    } catch (err) {
      let errorMessage = "Failed to assign task";
      if (err.response) errorMessage = `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText || "Unknown server error"}`;
      else if (err.request) errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
      else errorMessage = `Request setup error: ${err.message}`;
      setError(errorMessage);
    }
  };

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  if (!supervisorId) {
    return (
      <div className="task-board-container">
        <div className="task-error-message">
          {error || "Supervisor ID is missing. Please "}
          <a href="/login">log in again</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="task-board-container">
      <div className="task-sections">
        <button
          className={`task-section-btn ${mainTab === "Task Board" ? "task-active" : ""}`}
          onClick={() => setMainTab("Task Board")}
        >
          Supervisor Driven
        </button>
        <button
          className={`task-section-btn ${mainTab === "Weekly Tasks" ? "task-active" : ""}`}
          onClick={() => setMainTab("Weekly Tasks")}
        >
          Employee Driven
        </button>
      </div>
      {mainTab === "Task Board" && (
        <>
          {/* <div className="task-board-header">
            <h2>Supervisor Driven Tasks</h2>
          </div> */}
          <div className="task-board-subheader">
            <button className="assign-task-btn" onClick={openAssignForm}>
              Assign Task
            </button>
          </div>
          {error && <div className="task-error-message">{error}</div>}
          {loadingTasks && <div className="task-loading-message">Loading tasks...</div>}
          {!loadingTasks && tasks.length === 0 && !error && <div className="task-no-tasks">No tasks available</div>}
          <div className="task-board">
            {columns.map((col) => {
              const colTasks = tasks
                .filter((t) => t.status === col.key)
                .sort((a, b) => {
                  if (col.key === "Yet to Start") {
                    return new Date(b.endDate || 0) - new Date(a.endDate || 0);
                  }
                  return new Date(a.endDate || 0) - new Date(b.endDate || 0);
                });
              return (
                <div className="task-column" key={col.key}>
                  <div className="task-column-header" style={{ backgroundColor: col.color }}>
                    <span>{col.title}</span>
                  </div>
                  <div className="task-list">
                    {colTasks.length === 0 && !loadingTasks && !error ? (
                      <div className="task-no-tasks">No {col.title.toLowerCase()} tasks</div>
                    ) : (
                      colTasks.map((task) => {
                        const isOverdue = task.status !== "Completed" && new Date(task.endDate) < currentDate;
                        const ringColor = isOverdue ? "#ef4444" : getProgressColor(task.progress);
                        return (
                          <div className="task-card" key={task.id} onClick={() => openDetails(task.id)}>
                            <div className="task-header">
                              <div className="task-title-group">
                                <div className="task-title">{task.title}</div>
                                <div className="task-employee-name">{task.user.name}</div>
                                <div className="task-employee-id">EMP-ID: {task.employeeId}</div>
                                <div className="task-id-chip">{task.id}</div>
                              </div>
                              <div className="task-progress-wrapper" title={`${task.progress}%`}>
                                <svg viewBox="0 0 36 36" className="task-progress-ring">
                                  <path
                                    className="task-circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="#e5e7eb"
                                    strokeWidth="3"
                                    fill="none"
                                  />
                                  <path
                                    className="task-circle"
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - task.progress}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke={ringColor}
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                  />
                                  <text
                                    x="18"
                                    y="20.35"
                                    className="task-percentage"
                                    textAnchor="middle"
                                    fill="#111827"
                                    fontSize="10px"
                                    transform="rotate(0 18 18)"
                                  >
                                    {task.progress}%
                                  </text>
                                </svg>
                              </div>
                            </div>
                            <div className="task-dates">
                              <div className="task-date-group">
                                <span className="task-date-label">Start</span>
                                <span className="task-date-pill task-start">{displayDate(task.startDate)}</span>
                              </div>
                              <span className="task-arrow">→</span>
                              <div className="task-date-group">
                                <span className="task-date-label">End</span>
                                <span
                                  className={`task-date-pill task-end ${isOverdue ? "task-overdue" : ""}`}
                                >
                                  {displayDate(task.endDate)}
                                </span>
                              </div>
                            </div>
                            <div className="task-footer">
                              <div className="task-spacer" />
                              <div className="task-msg-wrap" title="Open messages">
                                <span className="task-message-icon" role="img" aria-label="messages">
                                  💬
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
            {selectedTask && (
              <div className="task-details-backdrop" onClick={closeDetails}>
                <div className="task-details" onClick={(e) => e.stopPropagation()}>
                  <div className="task-details-header">
                    <div className="task-details-title">
                      <div className="task-pill">{selectedTask.id}</div>
                      <h3>{selectedTask.title}</h3>
                    </div>
                    <button className="task-close-btn" onClick={closeDetails} aria-label="Close">
                      ✕
                    </button>
                  </div>
                  <div className="task-details-meta">
                    <div className="task-meta-row">
                      <div className="task-status-line">
                        <span className="task-label">Status:</span>
                        <span className="task-value">{selectedTask.status}</span>
                      </div>
                      <div className="task-progress-wrapper">
                        <svg viewBox="0 0 36 36" className="task-progress-ring">
                          <path
                            className="task-circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            className="task-circle"
                            strokeDasharray="100"
                            strokeDashoffset={100 - selectedTask.progress}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            stroke={
                              selectedTask.status !== "Completed" && new Date(selectedTask.endDate) < currentDate
                                ? "#ef4444"
                                : getProgressColor(selectedTask.progress)
                            }
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <text
                            x="18"
                            y="20.35"
                            className="task-percentage"
                            textAnchor="middle"
                            fill="#111827"
                            fontSize="10px"
                            transform="rotate(0 18 18)"
                          >
                            {selectedTask.progress}%
                          </text>
                        </svg>
                      </div>
                      {!editingProgress && (
                        <button
                          className="task-edit-progress-btn"
                          onClick={startEditingProgress}
                          title="Edit Progress"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              stroke="#6b7280"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    {editingProgress && (
                      <div className="task-progress-editor">
                        <div className="task-slider-container">
                          <label htmlFor="progress-slider">Progress</label>
                          <input
                            id="progress-slider"
                            type="range"
                            min="0"
                            max="100"
                            value={tempProgress}
                            onChange={handleSliderChange}
                            className="task-progress-slider"
                          />
                          <span className="task-slider-value">{tempProgress}%</span>
                        </div>
                        <div className="task-status-container">
                          <label htmlFor="status-select">Status</label>
                          <select
                            id="status-select"
                            value={tempStatus}
                            onChange={handleStatusChange}
                            className="task-status-select"
                          >
                            <option value="Yet to Start">Yet to Start</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On-Hold">On-Hold</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="task-editor-actions">
                          <button onClick={saveProgress} className="task-save-btn">
                            Update Progress
                          </button>
                          <button onClick={cancelEditing} className="task-cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="task-dates-row">
                      <span className="task-date-pill task-start">Start: {displayDate(selectedTask.startDate)}</span>
                      <span className="task-arrow">→</span>
                      <span
                        className={`task-date-pill task-end ${
                          selectedTask.status !== "Completed" && new Date(selectedTask.endDate) < currentDate
                            ? "task-overdue"
                            : ""
                        }`}
                      >
                        End: {displayDate(selectedTask.endDate)}
                      </span>
                    </div>
                    <div className="task-description">
                      <h4>Description</h4>
                      <p>
                        {selectedTask.description.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line.startsWith("- ") ? `• ${line.slice(2)}` : line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="task-tabs">
                    <div className="task-tab-header">
                      <button
                        className={`task-tab-btn ${activeTab === "Progress" ? "task-active" : ""}`}
                        onClick={() => setActiveTab("Progress")}
                      >
                        Progress
                      </button>
                      <button
                        className={`task-tab-btn ${activeTab === "Clarification" ? "task-active" : ""}`}
                        onClick={() => setActiveTab("Clarification")}
                      >
                        Clarification
                      </button>
                    </div>
                    <div className="task-tab-content">
                      {activeTab === "Progress" && (
                        <div className="task-progress-tab">
                          <h4>Progress Updates</h4>
                          {loadingMessages ? (
                            <p className="task-loading-message">Loading progress messages...</p>
                          ) : selectedTask.messages.filter((msg) => msg.type === "Progress").length > 0 ? (
                            <div className="task-messages">
                              {selectedTask.messages
                                .filter((msg) => msg.type === "Progress")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`task-message ${msg.sender === "Supervisor" ? "task-sent" : "task-received"}`}
                                  >
                                    <div className="task-message-content">{msg.text}</div>
                                    <div className="task-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="task-no-msg">No progress updates yet.</p>
                          )}
                          <form className="task-chat-input" onSubmit={handleAddMessage}>
                            <input
                              type="text"
                              placeholder="Type a progress comment…"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              disabled={loadingMessages}
                            />
                            <button type="submit" disabled={loadingMessages}>
                              Send
                            </button>
                          </form>
                        </div>
                      )}
                      {activeTab === "Clarification" && (
                        <div className="task-clarification-tab">
                          <h4>Clarification</h4>
                          {loadingMessages ? (
                            <p className="task-loading-message">Loading clarification messages...</p>
                          ) : selectedTask.messages.filter((msg) => msg.type === "Clarification").length > 0 ? (
                            <div className="task-messages">
                              {selectedTask.messages
                                .filter((msg) => msg.type === "Clarification")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`task-message ${msg.sender === "Supervisor" ? "task-sent" : "task-received"}`}
                                  >
                                    <div className="task-message-content">{msg.text}</div>
                                    <div className="task-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="task-no-msg">No clarifications yet.</p>
                          )}
                          <form className="task-chat-input" onSubmit={handleAddMessage}>
                            <input
                              type="text"
                              placeholder="Type a clarification message…"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              disabled={loadingMessages}
                            />
                            <button type="submit" disabled={loadingMessages}>
                              Send
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showAssignForm && (
              <div className="task-details-backdrop" onClick={closeAssignForm}>
                <div className="task-details assign-task-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="task-details-header">
                    <div className="task-details-title">
                      <h3>Assign New Task</h3>
                    </div>
                    <button className="task-close-btn" onClick={closeAssignForm} aria-label="Close">
                      ✕
                    </button>
                  </div>
                  <div className="assign-form">
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label htmlFor="title">Task Name</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                           onChange={handleFormChange}
                          placeholder="Enter task name"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label htmlFor="description">Task Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          placeholder="Enter task description (use - for bullet points)"
                          rows="4"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label htmlFor="employeeId">Assigned To</label>
                        <select
                          id="employeeId"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleFormChange}
                          required
                          disabled={loadingEmployees || (error && employees.length === 0)}
                        >
                          <option value="">{loadingEmployees ? "Loading employees..." : "Select Employee"}</option>
                          {employees.length === 0 && !loadingEmployees ? (
                            <option value="">No employees available</option>
                          ) : (
                            employees.map((emp) => (
                              <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.employee_name} ({emp.employee_id})
                              </option>
                            ))
                          )}
                        </select>
                        {error && employees.length === 0 && !loadingEmployees && (
                          <div className="task-error-message">No employees available due to an error: {error}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group half-width">
                        <label htmlFor="startDate">Start Date</label>
                        <DatePicker
                          selected={formData.startDate}
                          onChange={(date) => handleDateChange(date, "startDate")}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Select start date (dd-mm-yyyy)"
                          className="date-picker"
                          required
                        />
                      </div>
                      <div className="form-group half-width">
                        <label htmlFor="endDate">End Date</label>
                        <DatePicker
                          selected={formData.endDate}
                          onChange={(date) => handleDateChange(date, "endDate")}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Select end date (dd-mm-yyyy)"
                          className="date-picker"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group half-width">
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="Yet to Start">Yet to Start</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On-Hold">On-Hold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="form-group half-width">
                        <label htmlFor="percentage">Progress (%)</label>
                        <input
                          type="number"
                          id="percentage"
                          name="percentage"
                          value={formData.percentage}
                          onChange={handleFormChange}
                          min="0"
                          max="100"
                          placeholder="0-100"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        className="submit-btn"
                        onClick={handleFormSubmit}
                        disabled={loadingEmployees || loadingTasks || (error && employees.length === 0)}
                      >
                        Assign Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {mainTab === "Weekly Tasks" && <SupervisorPlanViewer />}
      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default TaskManagement;