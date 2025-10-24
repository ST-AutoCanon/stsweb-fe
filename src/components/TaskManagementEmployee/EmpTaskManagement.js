
import React, { useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./EmpTaskManagement.css";
import WeeklyTaskPlanner from "../WeeklyTaskPlanner/WeeklyTaskPlanner";

const getProgressColor = (p) => {
  if (p < 40) return "#ef4444"; // red-500
  if (p < 70) return "#f59e0b"; // amber-500
  return "#10b981"; // emerald-500
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

const EmpTaskManagement = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("Progress");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [editingProgress, setEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempStatus, setTempStatus] = useState("");
  const [activeSection, setActiveSection] = useState("Tasks");

  const normalizeStatus = (status) => {
    if (!status) return "Yet to Start";
    const normalized = status.trim().toLowerCase();
    const statusMap = {
      "yet to start": "Yet to Start",
      "in progress": "In Progress",
      "on-hold": "On-Hold",
      "on hold": "On-Hold",
      "completed": "Completed",
    };
    return statusMap[normalized] || "Yet to Start";
  };

  useEffect(() => {
    const data = localStorage.getItem("dashboardData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.employeeId) setEmployeeId(parsed.employeeId);
        else setError("No employeeId found in dashboardData. Please log in again.");
      } catch (e) {
        setError("Failed to parse dashboardData. Please log in again.");
      }
    } else {
      setError("No dashboardData found in localStorage. Please log in again.");
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/task-emp-emp/employee/${employeeId}`,
          { headers: { "x-employee-id": employeeId } }
        );
        const tasksData = response.data;
        if (!Array.isArray(tasksData)) throw new Error("Expected tasks to be an array");
        const tasksWithPhotos = tasksData.map((task) => ({
          id: `Task-${task.task_id}`,
          title: task.task_title || "Untitled Task",
          description: task.description || "No description available",
          status: normalizeStatus(task.status),
          startDate: formatDate(task.start_date),
          endDate: formatDate(task.due_date),
          employeeId,
          progress: task.percentage || 0,
          messages: [],
        }));
        setTasks(tasksWithPhotos);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setTasks([]); // Set tasks to empty array for 404
        } else {
          let errorMessage = "Failed to fetch tasks";
          if (err.response) errorMessage = `Server Error ${err.response.status}: ${err.response.data?.message || "Unknown"}`;
          else if (err.request) errorMessage = "Network error: Unable to connect to the server.";
          else errorMessage = `Request setup error: ${err.message}`;
          setError(errorMessage);
        }
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [employeeId]);

  useEffect(() => {
    if (!selectedTaskId || !employeeId) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const taskId = selectedTaskId.split("-")[1];
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${taskId}`, {
          headers: { "x-employee-id": employeeId },
        });
        if (response.data.success) {
          const { progressMessages = [], clarificationMessages = [] } = response.data;
          const allMessages = [
            ...progressMessages.map((msg) => ({
              text: msg.text,
              time: msg.time,
              sender: msg.sender,
              senderName: msg.sender === "Supervisor" ? "Supervisor" : "You",
              type: "Progress",
              isRead: msg.sender === employeeId,
            })),
            ...clarificationMessages.map((msg) => ({
              text: msg.text,
              time: msg.time,
              sender: msg.sender,
              senderName: msg.sender === "Supervisor" ? "Supervisor" : "You",
              type: "Clarification",
              isRead: msg.sender === employeeId,
            })),
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
        } else throw new Error(response.data.message || "Failed to fetch messages");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setTasks((prevTasks) => prevTasks.map((task) => (task.id === selectedTaskId ? { ...task, messages: [] } : task)));
        } else {
          let errorMessage = "Failed to fetch messages";
          if (err.response) errorMessage = `Error ${err.response.status}: ${err.response.data?.message || "Unknown"}`;
          else if (err.request) errorMessage = "Network error: Unable to connect.";
          else errorMessage = `Request setup error: ${err.message}`;
          setError(errorMessage);
        }
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedTaskId, employeeId]);

  useEffect(() => {
    if (selectedTaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTaskId
            ? {
                ...task,
                messages: task.messages.map((msg) =>
                  msg.sender === "Supervisor" && msg.type === activeTab ? { ...msg, isRead: true } : msg
                ),
              }
            : task
        )
      );
    }
  }, [activeTab, selectedTaskId]);

  const columns = useMemo(
    () => [
      { key: "Yet to Start", title: "Yet to Start", color: "#7c7d1e" },
      { key: "In Progress", title: "In Progress", color: "#1d4ed8" },
      { key: "On-Hold", title: "On-Hold", color: "#9d174d" },
      { key: "Completed", title: "Completed", color: "#065f46" },
    ],
    []
  );

  const dropdownColumns = useMemo(() => columns.filter((col) => col.key !== "Completed"), [columns]);

  const selectedTask = useMemo(() => tasks.find((t) => t.id === selectedTaskId) || null, [tasks, selectedTaskId]);

  const currentDate = new Date(2025, 8, 17, 1, 23); // 12:23 AM IST, September 17, 2025

  const openDetails = (taskId) => {
    setSelectedTaskId(taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTempStatus(task.status);
      setTempProgress(task.progress);
    }
  };

  const closeDetails = () => {
    setSelectedTaskId(null);
    setMessageText("");
    setActiveTab("Progress");
    setEditingProgress(false);
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
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, progress: newProgress } : t)));
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setTempStatus(newStatus);
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, status: newStatus } : t)));
  };

  const saveProgress = async () => {
    if (!selectedTask || !employeeId) return;
    try {
      const taskId = selectedTask.id.split("-")[1];
      const updateData = { status: tempStatus, percentage: tempProgress, progress_percentage: tempProgress };
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/employee-tasks/update/${taskId}`,
        updateData,
        { headers: { "x-employee-id": employeeId, "x-api-key": process.env.REACT_APP_API_KEY } }
      );
      if (response.data.success || response.data.status === "success") {
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? { ...t, status: tempStatus, progress: tempProgress } : t))
        );
        setError(null);
        setEditingProgress(false);
        if (tempProgress !== selectedTask.progress) await sendProgressMessage(tempProgress);
        alert("Task updated successfully");
      } else {
        throw new Error(response.data.message || "Unexpected server response");
      }
    } catch (err) {
      setError(null);
      setEditingProgress(false);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, progress: selectedTask.progress, status: selectedTask.status } : t
        )
      );
    }
  };

  const cancelEditing = () => {
    setEditingProgress(false);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id ? { ...t, progress: selectedTask.progress, status: selectedTask.status } : t
      )
    );
  };

  const sendProgressMessage = async (percentage) => {
    if (!selectedTask || !employeeId) return;
    const text = `${percentage}%`;
    try {
      const taskId = selectedTask.id.split("-")[1];
      const messageData = { taskId, sender: employeeId, type: "Progress", text };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, messageData, {
        headers: { "x-employee-id": employeeId },
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
                      sender: employeeId,
                      senderName: "You",
                      type: "Progress",
                      isRead: true,
                    },
                  ].sort((a, b) => new Date(a.time) - new Date(b.time)),
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Error sending progress message:", err);
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedTask || !employeeId) return;
    try {
      const taskId = selectedTask.id.split("-")[1];
      const messageData = { taskId, sender: employeeId, type: activeTab, text };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, messageData, {
        headers: { "x-employee-id": employeeId },
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
                      sender: employeeId,
                      senderName: "You",
                      type: activeTab,
                      isRead: true,
                    },
                  ].sort((a, b) => new Date(a.time) - new Date(b.time)),
                  ...(activeTab === "Progress" && !isNaN(parseInt(text)) ? { progress: parseInt(text) } : {}),
                }
              : t
          )
        );
        setMessageText("");
        setError(null);
      } else throw new Error(response.data.message || "Failed to send message");
    } catch (err) {
      let errorMessage = "Failed to send message";
      if (err.response) errorMessage = `Error ${err.response.status}: ${err.response.data?.message || "Unknown"}`;
      else if (err.request) errorMessage = "Network error: Unable to connect.";
      else errorMessage = `Request setup error: ${err.message}`;
      setError(errorMessage);
    }
  };

  if (!employeeId) {
    return (
      <div className="emp-task-board-container">
        <div className="emp-task-error-message">
          {error || "Employee ID is missing. Please "}
          <a href="/login">log in again</a>
        </div>
      </div>
    );
  }

  return (
    <div className="emp-task-board-container-1">
      <div className="emp-task-sections">
        <button
          className={`emp-section-btn ${activeSection === "Tasks" ? "emp-active" : ""}`}
          onClick={() => setActiveSection("Tasks")}
        >
          Supervisor Driven
        </button>
        <button
          className={`emp-section-btn ${activeSection === "WeeklyTasks" ? "emp-active" : ""}`}
          onClick={() => setActiveSection("WeeklyTasks")}
        >
          Employee Driven
        </button>
      </div>
      {activeSection === "Tasks" ? (
        <>
          {error && <div className="emp-task-error-message">{error}</div>}
          {loadingTasks && <div className="emp-task-loading-message">Loading tasks...</div>}
          {!loadingTasks && tasks.length === 0 && !error && (
            <div className="emp-task-no-tasks">No tasks assigned yet</div>
          )}
          <div className="emp-task-board">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key).sort((a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0));
              return (
                <div className="emp-task-column" key={col.key}>
                  <div className="emp-task-column-header" style={{ backgroundColor: col.color }}>
                    <span>{col.title}</span>
                    <span className="emp-task-count-badge">{colTasks.length}</span>
                  </div>
                  <div className="emp-task-list">
                    {colTasks.length === 0 && !loadingTasks && !error ? (
                      <div className="emp-task-no-tasks">No {col.title.toLowerCase()} tasks</div>
                    ) : (
                      colTasks.map((task) => {
                        const isOverdue = task.status !== "Completed" && new Date(task.endDate) < currentDate;
                        const ringColor = isOverdue ? "#ef4444" : getProgressColor(task.progress);
                        return (
                          <div className="emp-task-card" key={task.id} onClick={() => openDetails(task.id)}>
                            <div className="emp-task-header">
                              <div className="emp-task-title-group">
                                <div className="emp-task-title">{task.title}</div>
                                <div className="emp-task-id-chip">{task.id}</div>
                              </div>
                              <div className="emp-task-progress-wrapper" title={`${task.progress}%`}>
                                <svg viewBox="0 0 36 36" className="emp-task-progress-ring">
                                  <path
                                    className="emp-task-circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="#e5e7eb"
                                    strokeWidth="3"
                                    fill="none"
                                  />
                                  <path
                                    className="emp-task-circle"
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
                                    className="emp-task-percentage"
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
                            <div className="emp-task-dates">
                              <div className="emp-task-date-group">
                                <span className="emp-task-date-label">Start</span>
                                <span className="emp-task-date-pill emp-task-start">{displayDate(task.startDate)}</span>
                              </div>
                              <span className="emp-task-arrow">→</span>
                              <div className="emp-task-date-group">
                                <span className="emp-task-date-label">End</span>
                                <span
                                  className={`emp-task-date-pill emp-task-end ${isOverdue ? "emp-task-overdue" : ""}`}
                                >
                                  {displayDate(task.endDate)}
                                </span>
                              </div>
                            </div>
                            <div className="emp-task-footer">
                              <div className="emp-task-spacer" />
                              <div className="emp-task-msg-wrap" title="Open messages">
                                <span className="emp-task-message-icon" role="img" aria-label="messages">
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
              <div className="emp-task-details-backdrop" onClick={closeDetails}>
                <div className="emp-task-details" onClick={(e) => e.stopPropagation()}>
                  <div className="emp-task-details-header">
                    <div className="emp-task-details-title">
                      <div className="emp-task-pill">{selectedTask.id}</div>
                      <h3>{selectedTask.title}</h3>
                    </div>
                    <button className="emp-task-close-btn" onClick={closeDetails} aria-label="Close">
                      ✕
                    </button>
                  </div>
                  <div className="emp-task-details-meta">
                    <div className="emp-task-meta-row">
                      <div className="emp-task-status-line">
                        <span className="emp-task-label">Status:</span>
                        <span className="emp-task-value">{selectedTask.status}</span>
                      </div>
                      <div className="emp-task-progress-wrapper">
                        <svg viewBox="0 0 36 36" className="emp-task-progress-ring">
                          <path
                            className="emp-task-circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            className="emp-task-circle"
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
                            className="emp-task-percentage"
                            textAnchor="middle"
                            fill="#111827"
                            fontSize="10px"
                            transform="rotate(0 18 18)"
                          >
                            {selectedTask.progress}%
                          </text>
                        </svg>
                      </div>
                      {activeTab === "Progress" && (
                        <button
                          className="emp-task-edit-progress-btn"
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
                      <div className="emp-task-progress-editor">
                        <div className="emp-task-slider-container">
                          <label htmlFor="progress-slider">Progress</label>
                          <input
                            id="progress-slider"
                            type="range"
                            min="0"
                            max="100"
                            value={tempProgress}
                            onChange={handleSliderChange}
                            className="emp-task-progress-slider"
                          />
                          <span className="emp-task-slider-value">{tempProgress}%</span>
                        </div>
                        <div className="emp-task-status-container">
                          <label htmlFor="status-select">Status</label>
                          <select
                            id="status-select"
                            value={tempStatus}
                            onChange={handleStatusChange}
                            className="emp-task-status-select"
                          >
                            {dropdownColumns.map((col) => (
                              <option key={col.key} value={col.key}>
                                {col.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="emp-task-editor-actions">
                          <button onClick={saveProgress} className="emp-task-save-btn">
                            Update Progress
                          </button>
                          <button onClick={cancelEditing} className="emp-task-cancel-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="emp-task-dates-row">
                      <span className="emp-task-date-pill emp-task-start">
                        Start: {displayDate(selectedTask.startDate)}
                      </span>
                      <span className="emp-task-arrow">→</span>
                      <span
                        className={`emp-task-date-pill emp-task-end ${
                          selectedTask.status !== "Completed" && new Date(selectedTask.endDate) < currentDate
                            ? "emp-task-overdue"
                            : ""
                        }`}
                      >
                        End: {displayDate(selectedTask.endDate)}
                      </span>
                    </div>
                    <div className="emp-task-description">
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
                  <div className="emp-task-tabs">
                    <div className="emp-task-tab-header">
                      <button
                        className={`emp-task-tab-btn ${activeTab === "Progress" ? "emp-task-active" : ""}`}
                        onClick={() => setActiveTab("Progress")}
                      >
                        Progress
                      </button>
                      <button
                        className={`emp-task-tab-btn ${activeTab === "Clarification" ? "emp-task-active" : ""}`}
                        onClick={() => setActiveTab("Clarification")}
                      >
                        Clarification
                      </button>
                    </div>
                    <div className="emp-task-tab-content">
                      {activeTab === "Progress" && (
                        <div className="emp-task-progress-tab">
                          <h4>Progress Updates</h4>
                          {loadingMessages ? (
                            <p className="emp-task-loading-message">Loading progress messages...</p>
                          ) : selectedTask.messages.filter((msg) => msg.type === "Progress").length > 0 ? (
                            <div className="emp-task-messages">
                              {selectedTask.messages
                                .filter((msg) => msg.type === "Progress")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`emp-task-message ${msg.sender === employeeId ? "emp-task-sent" : "emp-task-received"}`}
                                  >
                                    <div className="emp-task-message-content">{msg.text}</div>
                                    <div className="emp-task-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="emp-task-no-msg">No progress updates yet.</p>
                          )}
                          <form className="emp-task-chat-input" onSubmit={handleAddMessage}>
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
                        <div className="emp-task-clarification-tab">
                          <h4>Clarification</h4>
                          {loadingMessages ? (
                            <p className="emp-task-loading-message">Loading clarification messages...</p>
                          ) : selectedTask.messages.filter((msg) => msg.type === "Clarification").length > 0 ? (
                            <div className="emp-task-messages">
                              {selectedTask.messages
                                .filter((msg) => msg.type === "Clarification")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`emp-task-message ${msg.sender === employeeId ? "emp-task-sent" : "emp-task-received"}`}
                                  >
                                    <div className="emp-task-message-content">{msg.text}</div>
                                    <div className="emp-task-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="emp-task-no-msg">No clarifications yet.</p>
                          )}
                          <form className="emp-task-chat-input" onSubmit={handleAddMessage}>
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
          </div>
        </>
      ) : (
        <WeeklyTaskPlanner employeeId={employeeId} currentDate={currentDate} />
      )}
    </div>
  );
};

export default EmpTaskManagement;