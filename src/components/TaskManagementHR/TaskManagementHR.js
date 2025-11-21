

import React, { useMemo, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./TaskManagementHR.css";
import SupervisorPlanViewerAdmin from "./TaskManagementSupervisor";
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

const TaskManagementHR = () => {
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
  const [adminId, setAdminId] = useState(null);
  const [editingProgress, setEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [tempStatus, setTempStatus] = useState("");
  const [alertModal, setAlertModal] = useState({ isVisible: false, title: "", message: "" });

  // READ-ONLY: Everything except tab switching
  const readOnly = true;

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const data = localStorage.getItem("dashboardData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.employeeId) {
          setAdminId(String(parsed.employeeId));
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

  /* ---------- FETCH EMPLOYEES ---------- */
  useEffect(() => {
    if (!adminId) return;
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
          { headers: { "x-employee-id": adminId } }
        );
        if (!response.data.employees || !Array.isArray(response.data.employees)) {
          throw new Error("No employees found in response or invalid data format");
        }
        setEmployees(response.data.employees);
        setError(null);
      } catch (err) {
        let errorMessage = "Failed to fetch employees";
        if (err.response)
          errorMessage = `Error ${err.response.status}: ${
            err.response.data?.error || err.response.statusText || "Unknown server error"
          }`;
        else if (err.request)
          errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        else errorMessage = `Request setup error: ${err.message}`;
        setError(errorMessage);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [adminId]);

  /* ---------- FETCH TASKS ---------- */
  useEffect(() => {
    if (!adminId) return;
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
          headers: { "x-employee-id": adminId },
        });
        const tasksWithEmployeeData = response.data.map((task) => {
          const employee =
            employees.find((emp) => emp.employee_id === task.employee_id) || {
              employee_name: "Unknown Employee",
              employee_id: task.employee_id,
            };
          return {
            id: `Task-${task.task_id}`,
            title: task.task_title,
            description: task.description,
            status: task.status,
            startDate: formatDate(task.start_date),
            endDate: formatDate(task.due_date),
            employeeId: task.employee_id,
            user: { name: employee.employee_name, profile: "" },
            progress: task.percentage,
            messages: [],
          };
        });
        setTasks(tasksWithEmployeeData);
        setError(null);
      } catch (err) {
        let errorMessage = "Failed to fetch tasks";
        if (err.response)
          errorMessage = `Error ${err.response.status}: ${
            err.response.data?.error || err.response.statusText || "Unknown server error"
          }`;
        else if (err.request)
          errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        else errorMessage = `Request setup error: ${err.message}`;
        setError(errorMessage);
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [adminId, employees]);

  /* ---------- FETCH MESSAGES ---------- */
  useEffect(() => {
    if (!selectedTaskId || !adminId) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      const taskId = selectedTaskId.split("-")[1];
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${taskId}`, {
          headers: { "x-employee-id": adminId },
        });
        if (response.status === 200 && response.data.success) {
          const { progressMessages = [], clarificationMessages = [] } = response.data;
          const allMessages = [
            ...progressMessages.map((msg) => {
              const employee = employees.find(
                (emp) => String(emp.employee_id) === String(msg.sender)
              );
              return {
                text: msg.text,
                time: msg.time,
                sender: msg.sender,
                senderName: msg.sender === "Supervisor" ? "You" : employee?.employee_name || "Unknown Employee",
                type: "Progress",
              };
            }),
            ...clarificationMessages.map((msg) => {
              const employee = employees.find(
                (emp) => String(emp.employee_id) === String(msg.sender)
              );
              return {
                text: msg.text,
                time: msg.time,
                sender: msg.sender,
                senderName: msg.sender === "Supervisor" ? "You" : employee?.employee_name || "Unknown Employee",
                type: "Clarification",
              };
            }),
          ].sort((a, b) => new Date(a.time) - new Date(b.time));

          setTasks((prev) =>
            prev.map((t) =>
              t.id === selectedTaskId
                ? {
                    ...t,
                    messages: allMessages,
                    progress: allMessages
                      .filter((m) => m.type === "Progress")
                      .reduce(
                        (max, m) => (isNaN(parseInt(m.text)) ? max : Math.max(max, parseInt(m.text))),
                        t.progress
                      ),
                  }
                : t
            )
          );
          setError(null);
        } else if (response.status === 404) {
          setTasks((prev) => prev.map((t) => (t.id === selectedTaskId ? { ...t, messages: [] } : t)));
          setError(null);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        let errorMessage = "Failed to fetch messages";
        if (err.response && err.response.status !== 404) {
          errorMessage = `Error ${err.response.status}: ${
            err.response.data?.error || err.response.statusText || "Unknown server error"
          }`;
        } else if (err.request) {
          errorMessage = `Network error: Unable to connect to the server at ${process.env.REACT_APP_BACKEND_URL}.`;
        } else {
          errorMessage = `Request setup error: ${err.message}`;
        }
        if (errorMessage !== "Failed to fetch messages") setError(errorMessage);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedTaskId, adminId, employees]);

  /* ---------- BOARD CONFIG ---------- */
  const columns = useMemo(
    () => [
      { key: "Yet to Start", title: "Yet to Start", color: "#7c7d1e" },
      { key: "In Progress", title: "In Progress", color: "#1d4ed8" },
      { key: "On-Hold", title: "On-Hold", color: "#9d174d" },
      { key: "Completed", title: "Completed", color: "#065f46" },
    ],
    []
  );

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  const currentDate = new Date(2025, 8, 17, 11, 37); // fixed for demo

  /* ---------- HANDLERS (ALL BLOCKED EXCEPT TAB SWITCH) ---------- */
  const openDetails = (taskId) => setSelectedTaskId(taskId);
  const closeDetails = () => {
    setSelectedTaskId(null);
    setMessageText("");
    setActiveTab("Progress");
    setEditingProgress(false);
    setTempProgress(0);
    setTempStatus("");
  };

  const startEditingProgress = () => { /* BLOCKED */ };
  const handleSliderChange = () => { /* BLOCKED */ };
  const handleStatusChange = () => { /* BLOCKED */ };
  const saveProgress = async () => { /* BLOCKED */ };
  const cancelEditing = () => { /* BLOCKED */ };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    /* BLOCKED */
  };

  const openAssignForm = () => { /* BLOCKED */ };
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

  const handleFormChange = () => { /* BLOCKED */ };
  const handleDateChange = () => { /* BLOCKED */ };
  const handleFormSubmit = async () => { /* BLOCKED */ };

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };
  const closeAlert = () => setAlertModal({ isVisible: false, title: "", message: "" });

  /* ---------- RENDER ---------- */
  if (!adminId) {
    return (
      <div className="task-hr-board-container">
        <div className="task-hr-error-message">
          {error || "HR ID is missing. Please "}
          <a href="/login">log in again</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="task-hr-board-container">
      {/* ---------- SECTION TABS (CLICKABLE) ---------- */}
      <div className="task-hr-sections">
        <button
          className={`task-hr-section-btn ${mainTab === "Task Board" ? "task-hr-active" : ""}`}
          onClick={() => setMainTab("Task Board")}
        >
          Supervisor Driven
        </button>
        <button
          className={`task-hr-section-btn ${mainTab === "Weekly Tasks" ? "task-hr-active" : ""}`}
          onClick={() => setMainTab("Weekly Tasks")}
        >
          Employee Driven
        </button>
      </div>

      {/* ---------- TASK BOARD (READ-ONLY) ---------- */}
      {mainTab === "Task Board" && (
        <>
          <div className="task-hr-board-subheader">
            {/* <button className="assign-task-hr-btn" disabled>
              Assign Task
            </button> */}
          </div>

          {error && <div className="task-hr-error-message">{error}</div>}
          {loadingTasks && <div className="task-hr-loading-message">Loading tasks...</div>}
          {!loadingTasks && tasks.length === 0 && !error && (
            <div className="task-hr-no-tasks">No tasks available</div>
          )}

          <div className="task-hr-board">
            {columns.map((col) => {
              const colTasks = tasks
                .filter((t) => t.status === col.key)
                .sort((a, b) => {
                  if (col.key === "Yet to Start")
                    return new Date(b.endDate || 0) - new Date(a.endDate || 0);
                  return new Date(a.endDate || 0) - new Date(b.endDate || 0);
                });

              return (
                <div className="task-hr-column" key={col.key}>
                  <div className="task-hr-column-header" style={{ backgroundColor: col.color }}>
                    <span>{col.title}</span>
                  </div>
                  <div className="task-hr-list">
                    {colTasks.length === 0 && !loadingTasks && !error ? (
                      <div className="task-hr-no-tasks">No {col.title.toLowerCase()} tasks</div>
                    ) : (
                      colTasks.map((task) => {
                        const isOverdue = task.status !== "Completed" && new Date(task.endDate) < currentDate;
                        const ringColor = isOverdue ? "#ef4444" : getProgressColor(task.progress);
                        return (
                          <div className="task-hr-card" key={task.id} onClick={() => openDetails(task.id)} style={{ cursor: "pointer" }}>
                            <div className="task-hr-header">
                              <div className="task-hr-title-group">
                                <div className="task-hr-title">{task.title}</div>
                                <div className="task-hr-employee-name">{task.user.name}</div>
                                <div className="task-hr-employee-id">EMP-ID: {task.employeeId}</div>
                                <div className="task-hr-id-chip">{task.id}</div>
                              </div>
                              <div className="task-hr-progress-wrapper" title={`${task.progress}%`}>
                                <svg viewBox="0 0 36 36" className="task-hr-progress-ring">
                                  <path
                                    className="task-hr-circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    stroke="#e5e7eb"
                                    strokeWidth="3"
                                    fill="none"
                                  />
                                  <path
                                    className="task-hr-circle"
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
                                    className="task-hr-percentage"
                                    textAnchor="middle"
                                    fill="#111827"
                                    fontSize="10px"
                                  >
                                    {task.progress}%
                                  </text>
                                </svg>
                              </div>
                            </div>

                            <div className="task-hr-dates">
                              <div className="task-hr-date-group">
                                <span className="task-hr-date-label">Start</span>
                                <span className="task-hr-date-pill task-hr-start">
                                  {displayDate(task.startDate)}
                                </span>
                              </div>
                              <span className="task-hr-arrow">→</span>
                              <div className="task-hr-date-group">
                                <span className="task-hr-date-label">End</span>
                                <span
                                  className={`task-hr-date-pill task-hr-end ${
                                    isOverdue ? "task-hr-overdue" : ""
                                  }`}
                                >
                                  {displayDate(task.endDate)}
                                </span>
                              </div>
                            </div>

                            <div className="task-hr-footer">
                              <div className="task-hr-spacer" />
                              <div className="task-hr-msg-wrap" title="Open messages">
                                <span className="task-hr-message-icon" role="img" aria-label="messages">
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

            {/* ---------- TASK DETAILS MODAL (READ-ONLY) ---------- */}
            {selectedTask && (
              <div className="task-hr-details-backdrop" onClick={closeDetails}>
                <div className="task-hr-details" onClick={(e) => e.stopPropagation()}>
                  <div className="task-hr-details-header">
                    <div className="task-hr-details-title">
                      <div className="task-hr-pill">{selectedTask.id}</div>
                      <h3>{selectedTask.title}</h3>
                    </div>
                    <button className="task-hr-close-btn" onClick={closeDetails} aria-label="Close">
                      X
                    </button>
                  </div>

                  <div className="task-hr-details-meta">
                    <div className="task-hr-meta-row">
                      <div className="task-hr-status-line">
                        <span className="task-hr-label">Status:</span>
                        <span className="task-hr-value">{selectedTask.status}</span>
                      </div>
                      <div className="task-hr-progress-wrapper">
                        <svg viewBox="0 0 36 36" className="task-hr-progress-ring">
                          <path
                            className="task-hr-circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            className="task-hr-circle"
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
                            className="task-hr-percentage"
                            textAnchor="middle"
                            fill="#111827"
                            fontSize="10px"
                          >
                            {selectedTask.progress}%
                          </text>
                        </svg>
                      </div>
                      {/* Edit button removed */}
                    </div>

                    <div className="task-hr-dates-row">
                      <span className="task-hr-date-pill task-hr-start">
                        Start: {displayDate(selectedTask.startDate)}
                      </span>
                      <span className="task-hr-arrow">→</span>
                      <span
                        className={`task-hr-date-pill task-hr-end ${
                          selectedTask.status !== "Completed" && new Date(selectedTask.endDate) < currentDate
                            ? "task-hr-overdue"
                            : ""
                        }`}
                      >
                        End: {displayDate(selectedTask.endDate)}
                      </span>
                    </div>

                    <div className="task-hr-description">
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

                  {/* ---------- CHAT TABS (READ-ONLY) ---------- */}
                  <div className="task-hr-tabs">
                    <div className="task-hr-tab-header">
                      <button
                        className={`task-hr-tab-btn ${activeTab === "Progress" ? "task-hr-active" : ""}`}
                        onClick={() => setActiveTab("Progress")}
                      >
                        Progress
                      </button>
                      <button
                        className={`task-hr-tab-btn ${activeTab === "Clarification" ? "task-hr-active" : ""}`}
                        onClick={() => setActiveTab("Clarification")}
                      >
                        Clarification
                      </button>
                    </div>

                    <div className="task-hr-tab-content">
                      {activeTab === "Progress" && (
                        <div className="task-hr-progress-tab">
                          <h4>Progress Updates</h4>
                          {loadingMessages ? (
                            <p className="task-hr-loading-message">Loading progress messages...</p>
                          ) : selectedTask.messages.filter((m) => m.type === "Progress").length > 0 ? (
                            <div className="task-hr-messages">
                              {selectedTask.messages
                                .filter((m) => m.type === "際")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`task-hr-message ${
                                      msg.sender === "Supervisor" ? "task-hr-sent" : "task-hr-received"
                                    }`}
                                  >
                                    <div className="task-hr-message-content">{msg.text}</div>
                                    <div className="task-hr-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="task-hr-no-msg">No progress updates yet.</p>
                          )}
                          <div className="task-hr-chat-input" style={{ opacity: 0.6, pointerEvents: "none" }}>
                            <input
                              type="text"
                              placeholder="Messages are read-only"
                              value={messageText}
                              readOnly
                            />
                            <button disabled>Send</button>
                          </div>
                        </div>
                      )}

                      {activeTab === "Clarification" && (
                        <div className="task-hr-clarification-tab">
                          <h4>Clarification</h4>
                          {loadingMessages ? (
                            <p className="task-hr-loading-message">Loading clarification messages...</p>
                          ) : selectedTask.messages.filter((m) => m.type === "Clarification").length > 0 ? (
                            <div className="task-hr-messages">
                              {selectedTask.messages
                                .filter((m) => m.type === "Clarification")
                                .map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`task-hr-message ${
                                      msg.sender === "Supervisor" ? "task-hr-sent" : "task-hr-received"
                                    }`}
                                  >
                                    <div className="task-hr-message-content">{msg.text}</div>
                                    <div className="task-hr-message-meta">
                                      <span>{displayDate(msg.time)}</span>
                                      <span>{msg.senderName}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="task-hr-no-msg">No clarifications yet.</p>
                          )}
                          <div className="task-hr-chat-input" style={{ opacity: 0.6, pointerEvents: "none" }}>
                            <input
                              type="text"
                              placeholder="Messages are read-only"
                              value={messageText}
                              readOnly
                            />
                            <button disabled>Send</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ---------- EMPLOYEE-DRIVEN VIEW (FULLY INTERACTIVE) ---------- */}
      {mainTab === "Weekly Tasks" && <SupervisorPlanViewerAdmin />}

      {/* ---------- GLOBAL ALERT MODAL ---------- */}
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

export default TaskManagementHR;