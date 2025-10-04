

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeeklyTaskPlanner.css";
import Modal from "../Modal/Modal";

const WeeklyTaskPlanner = ({ userRole = "employee", employeeId }) => {
  const [weekOffset, setWeekOffset] = useState(0); // Start at current week
  const currentDate = new Date(2025, 8, 29); // September 29, 2025
  const dayOfWeek = currentDate.getDay();
  const offset = (dayOfWeek + 6) % 7; // Adjust to Monday as week start
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - offset + weekOffset * 7);

  // Calculate end date of the week
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Format dates for display
  const formatDateRange = (start, end) => {
    const startDay = start.getDate();
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endDay = end.getDate();
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const year = start.getFullYear();
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  };
  const dateRange = formatDateRange(startDate, endDate);

  const getISOWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };
  const weekId = getISOWeekNumber(startDate);
  console.log("Week ID:", weekId, "Employee ID:", employeeId);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    weekDates.push(dateStr);
  }

  const [tasksData, setTasksData] = useState(
    weekDates.map((date) => ({ date, tasks: [] }))
  );
  const [projects, setProjects] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [editingSupStatus, setEditingSupStatus] = useState(null);
  const [formData, setFormData] = useState({ taskName: "", status: "", comment: "" });
  const [supFormData, setSupFormData] = useState({ supStatus: "", supComment: "" });
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignTasks, setAssignTasks] = useState([]);
  const [supReviewMode, setSupReviewMode] = useState(false);
  const [strikeTaskId, setStrikeTaskId] = useState(null);
  const [replacementData, setReplacementData] = useState({
    projectId: "",
    projectName: "",
    taskName: "",
    date: "",
    isNewProject: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noTasks, setNoTasks] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState({});

  // Helper functions for the alert modal
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const withRetry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  const formatDateIST = (date) => {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(istDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isTaskEditable = (taskDate) => {
    if (!taskDate) return false;
    const taskDateObj = new Date(taskDate);
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Reset time components to compare dates only
    taskDateObj.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    // Calculate the earliest editable date (current date - 1 day)
    const earliestEditableDate = new Date(currentDate);
    earliestEditableDate.setDate(currentDate.getDate() - 1);

    // Task is editable if its date is on or after the earliest editable date
    return taskDateObj >= earliestEditableDate;
  };

  const fetchData = async () => {
    if (!employeeId) {
      showAlert("Employee ID is required to fetch data.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNoTasks(false);

    try {
      const projectsUrl = `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`;
      console.log("Fetching projects from:", projectsUrl);
      const projectsRes = await withRetry(() =>
        axios.get(projectsUrl, {
          params: { employeeId },
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz",
            "Content-Type": "application/json",
          },
        })
      );
      const newProjects = {};
      (projectsRes.data.projects || []).forEach((project) => {
        newProjects[project.id] = project.project;
      });
      setProjects(newProjects);

      const tasksUrl = `${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/employee/${employeeId}`;
      console.log("Fetching tasks from:", tasksUrl);
      const tasksRes = await withRetry(() =>
        axios.get(tasksUrl, {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
        })
      );
      let tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
      if (tasks.length === 0) {
        setNoTasks(true);
        setTasksData(weekDates.map((date) => ({ date, tasks: [] })));
        return;
      }

      const filteredTasks = tasks.filter((task) => task.week_id === weekId);
      const groupedTasks = weekDates.map((date) => ({
        date,
        tasks: filteredTasks.filter((task) => {
          const taskDate = new Date(task.task_date);
          return `${taskDate.getDate()} ${taskDate.toLocaleString('default', { month: 'short' })}` === date;
        }),
      }));
      setTasksData(groupedTasks);
    } catch (err) {
      console.error("Error fetching data:", err.message, err.response?.status);
      if (err.response?.status === 404) {
        showAlert("API endpoint not found. Please check if the backend server is running and the routes are correctly configured.");
      } else if (err.response?.status === 401) {
        showAlert("Invalid API key. Please check your configuration.");
      } else {
        showAlert(`Failed to fetch data: ${err.response?.status || ''} ${err.message}. Please check the backend server or network.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_BACKEND_URL) {
      fetchData();
    } else {
      showAlert("Backend URL not configured. Please check your .env file.");
    }
  }, [employeeId, weekId, weekOffset]);

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => Math.max(prev - 1, -3));
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => Math.min(prev + 1, 3));
  };

  const toggleExpand = (date) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const handleEditClick = (task) => {
    if (userRole !== "employee") return;
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    setEditingTask(task.task_id);
    setFormData({ taskName: task.task_name, status: task.emp_status, comment: task.emp_comment || "" });
  };

  const handleSupStatusEditClick = (task) => {
    if (userRole !== "supervisor") return;
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    setEditingSupStatus(task.task_id);
    setSupFormData({ supStatus: task.sup_status || "incomplete", supComment: task.sup_comment || "" });
  };

  const handleSave = async (taskId) => {
    if (userRole !== "employee") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    try {
      const updatedTask = {
        project_id: task.project_id,
        project_name: task.project_name,
        task_name: formData.taskName,
        emp_status: formData.status,
        emp_comment: formData.comment,
        sup_status: task.sup_status || "incomplete",
        sup_comment: task.sup_comment,
        sup_review_status: task.sup_review_status,
        employee_id: task.employee_id,
        star_rating: task.star_rating,
        replacement_task: task.replacement_task,
      };
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, updatedTask, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });
      setTasksData((prev) =>
        prev.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) =>
            t.task_id === taskId
              ? { ...t, task_name: formData.taskName, emp_status: formData.status, emp_comment: formData.comment }
              : t
          ),
        }))
      );
      showAlert("Task updated successfully!");
      setEditingTask(null);
    } catch (err) {
      showAlert(`Failed to update task: ${err.message}`);
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setFormData({ taskName: "", status: "", comment: "" });
  };

  const handleSupStatusSave = async (taskId) => {
    if (userRole !== "supervisor") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    try {
      const updatedTask = {
        project_id: task.project_id,
        project_name: task.project_name,
        task_name: task.task_name,
        emp_status: task.emp_status,
        emp_comment: task.emp_comment,
        sup_status: supFormData.supStatus || "incomplete",
        sup_comment: supFormData.supComment,
        sup_review_status: task.sup_review_status,
        employee_id: task.employee_id,
        star_rating: task.star_rating,
        replacement_task: task.replacement_task,
      };
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, updatedTask, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });
      setTasksData((prev) =>
        prev.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) =>
            t.task_id === taskId
              ? { ...t, sup_status: supFormData.supStatus, sup_comment: supFormData.supComment }
              : t
          ),
        }))
      );
      showAlert("Supervisor status updated successfully!");
      setEditingSupStatus(null);
    } catch (err) {
      showAlert(`Failed to update supervisor status: ${err.message}`);
      console.error(err);
    }
  };

  const handleSupStatusCancel = () => {
    setEditingSupStatus(null);
    setSupFormData({ supStatus: "", supComment: "" });
  };

  const handleEnterReview = () => {
    if (userRole === "supervisor") {
      setSupReviewMode(true);
    }
  };

  const handleExitReview = () => {
    setSupReviewMode(false);
    setStrikeTaskId(null);
    setEditingSupStatus(null);
  };

  const handleApprove = async (taskId) => {
    if (userRole !== "supervisor") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, {
        ...task,
        sup_review_status: "approved",
        sup_status: task.sup_status || "incomplete",
        replacement_task: task.replacement_task,
      }, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });
      setTasksData((prev) =>
        prev.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) => (t.task_id === taskId ? { ...t, sup_review_status: "approved" } : t)),
        }))
      );
      showAlert("Task approved successfully!");
    } catch (err) {
      showAlert(`Failed to approve task: ${err.message}`);
      console.error(err);
    }
  };

  const handleSuspendReview = async (taskId) => {
    if (userRole !== "supervisor") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, {
        ...task,
        sup_review_status: "suspended_review",
        sup_status: task.sup_status || "incomplete",
        replacement_task: task.replacement_task,
      }, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });
      setTasksData((prev) =>
        prev.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) => (t.task_id === taskId ? { ...t, sup_review_status: "suspended_review" } : t)),
        }))
      );
      showAlert("Task suspended successfully!");
    } catch (err) {
      showAlert(`Failed to suspend task: ${err.message}`);
      console.error(err);
    }
  };

  const handleStrike = async (taskId, dayDate) => {
    if (userRole !== "supervisor") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert("Cannot edit: Task is from more than one day ago.");
      return;
    }
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, {
        ...task,
        sup_review_status: "struck",
        sup_status: task.sup_status || "incomplete",
        replacement_task: null,
      }, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });
      setTasksData((prev) =>
        prev.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) => (t.task_id === taskId ? { ...t, sup_review_status: "struck", replacement_task: null } : t)),
        }))
      );
      setStrikeTaskId(taskId);
      setReplacementData({ projectId: "", projectName: "", taskName: "", date: dayDate, isNewProject: false });
    } catch (err) {
      showAlert(`Failed to strike task: ${err.message}`);
      console.error(err);
    }
  };

  const handleReplacementChange = (field, value) => {
    if (field === "projectId") {
      setReplacementData((prev) => ({
        ...prev,
        projectId: value,
        projectName: projects[value] || (prev.isNewProject ? prev.projectName : ""),
        isNewProject: !projects[value] && value !== "new",
      }));
    } else {
      setReplacementData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddReplacement = async () => {
    if (userRole !== "supervisor") return;
    if (!replacementData.projectId || !replacementData.taskName || (replacementData.isNewProject ? !replacementData.projectName : false)) {
      showAlert("Please provide project ID, project name (if new project), and task name.");
      return;
    }
    try {
      const dayIndex = tasksData.findIndex((d) => d.date === replacementData.date);
      const taskIndex = tasksData[dayIndex].tasks.findIndex((t) => t.task_id === strikeTaskId);
      const task = tasksData[dayIndex].tasks[taskIndex];

      if (!isTaskEditable(task.task_date)) {
        showAlert("Cannot edit: Task is from more than one day ago.");
        return;
      }

      const updatedTask = {
        project_id: task.project_id,
        project_name: task.project_name,
        task_name: task.task_name,
        emp_status: task.emp_status,
        emp_comment: task.emp_comment,
        sup_status: task.sup_status || "incomplete",
        sup_comment: task.sup_comment,
        sup_review_status: "struck",
        employee_id: task.employee_id,
        star_rating: task.star_rating,
        replacement_task: replacementData.taskName,
      };
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${strikeTaskId}`, updatedTask, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });

      const [day, monthName] = replacementData.date.split(" ");
      const year = new Date().getFullYear();
      const month = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const newTask = {
        week_id: weekId,
        task_date: formattedDate,
        project_id: replacementData.projectId,
        project_name: replacementData.projectName,
        task_name: replacementData.taskName,
        emp_status: "not started",
        emp_comment: "",
        sup_status: "incomplete",
        sup_comment: "",
        sup_review_status: "approved",
        employee_id: employeeId,
        star_rating: null,
        replacement_task: null,
      };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks`, newTask, {
        headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
      });

      setTasksData((prev) =>
        prev.map((day, i) =>
          i === dayIndex
            ? {
                ...day,
                tasks: [
                  ...day.tasks.slice(0, taskIndex + 1),
                  { ...newTask, task_id: response.data.taskId },
                  ...day.tasks.slice(taskIndex + 1),
                ],
              }
            : day
        )
      );
      setProjects((prev) => ({
        ...prev,
        [replacementData.projectId]: replacementData.projectName,
      }));
      setNoTasks(false);
      showAlert("Replacement task added successfully!");
      setStrikeTaskId(null);
      setReplacementData({ projectId: "", projectName: "", taskName: "", date: "", isNewProject: false });
    } catch (err) {
      showAlert(`Failed to add replacement task: ${err.message}`);
      console.error(err);
    }
  };

  const handleAssignClick = () => {
    setShowAssignForm(true);
    setAssignTasks([]);
    setDropdownOpen({});
  };

  const handleAddTask = () => {
    setAssignTasks((prev) => [
      ...prev,
      {
        dates: [],
        projectId: "",
        projectName: "",
        taskName: "",
        isNewProject: false,
      },
    ]);
  };

  const handleRemoveTask = (index) => {
    setAssignTasks((prev) => prev.filter((_, i) => i !== index));
    setDropdownOpen((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleAssignChange = (index, field, value) => {
    setAssignTasks((prev) =>
      prev.map((t, i) => {
        if (i !== index) return t;
        if (field === "dates") {
          const newDates = t.dates.includes(value)
            ? t.dates.filter((d) => d !== value)
            : [...t.dates, value];
          return { ...t, dates: newDates };
        }
        return { ...t, [field]: value };
      })
    );
  };

  const handleProjectSelect = (index) => (e) => {
    const id = e.target.value;
    setAssignTasks((prev) =>
      prev.map((t, i) =>
        i === index
          ? {
              ...t,
              projectId: id,
              projectName: projects[id] || (t.isNewProject ? t.projectName : ""),
              isNewProject: !projects[id] && id !== "new",
            }
          : t
      )
    );
  };

  const handleAssignSubmit = async () => {
    const validTasks = assignTasks.filter(
      (task) => task.projectId && task.taskName && task.dates.length > 0 && (task.isNewProject ? task.projectName : true)
    );
    if (validTasks.length === 0) {
      showAlert("Please fill in at least one valid task with at least one date, project ID, project name (if new), and task name.");
      return;
    }
    try {
      for (const task of validTasks) {
        for (const date of task.dates) {
          const [day, month] = date.split(" ");
          const monthIndex = new Date(Date.parse(`${month} 1, 2025`)).getMonth();
          const taskDate = new Date(2025, monthIndex, parseInt(day));
          taskDate.setHours(0, 0, 0, 0);
          const taskDateStr = formatDateIST(taskDate);
          console.log("Assigning task for date:", date, "Parsed Date:", taskDate, "Formatted Date:", taskDateStr);

          const newTask = {
            week_id: weekId,
            task_date: taskDateStr,
            project_id: task.projectId,
            project_name: task.projectName,
            task_name: task.taskName,
            emp_status: "not started",
            emp_comment: "",
            sup_status: "incomplete",
            sup_comment: "",
            sup_review_status: "pending",
            employee_id: employeeId,
            star_rating: null,
            replacement_task: null,
          };
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks`, newTask, {
            headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
          });

          setTasksData((prev) => {
            const newData = [...prev];
            const dayIndex = newData.findIndex((d) => d.date === date);
            console.log("Day Index:", dayIndex, "Date:", date, "Task:", newTask);
            if (dayIndex > -1) {
              newData[dayIndex] = {
                ...newData[dayIndex],
                tasks: [...newData[dayIndex].tasks, { ...newTask, task_id: response.data.taskId }],
              };
            } else {
              console.error("No matching day found for date:", date);
            }
            return newData;
          });
          setProjects((prev) => ({
            ...prev,
            [newTask.project_id]: newTask.project_name,
          }));
        }
      }
      setNoTasks(false);
      showAlert("Tasks assigned successfully!");
      setShowAssignForm(false);
      setAssignTasks([]);
      setDropdownOpen({});
    } catch (err) {
      showAlert(`Failed to assign tasks: ${err.message}`);
      console.error(err);
    }
  };

  const handleAssignCancel = () => {
    setShowAssignForm(false);
    setAssignTasks([]);
    setDropdownOpen({});
  };

  const statusColors = {
    completed: "#28a745",
    "add on": "#17a2b8",
    "re-work": "#dc3545",
    incomplete: "#ffc107",
    "not started": "#888",
    working: "#007bff",
  };

  const statusLabels = {
    completed: "Completed",
    "add on": "Add On",
    "re-work": "Re-work",
    incomplete: "Incomplete",
    "not started": "Not Started",
    working: "Working",
  };

  const reviewColors = {
    approved: "#28a745",
    struck: "#dc3545",
    suspended_review: "#ffc107",
  };

  const reviewIcons = {
    approved: "✓",
    struck: "✗",
    suspended_review: "⛔",
  };

  return (
    <div className="weekly-task-planner">
      <div className="planner-header">
        <h2>
          Weekly Task Planner{" "}
          <span className="week-id">
            Week {weekId}: {dateRange}
          </span>
          <div className="week-navigation">
            <button
              onClick={handlePreviousWeek}
              className="nav-button-task"
              disabled={weekOffset <= -3}
              title={weekOffset <= -3 ? "Cannot view earlier than Week 36" : "Previous Week"}
            >
              <svg
                className="nav-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="nav-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button
              onClick={handleNextWeek}
              className="nav-button-task"
              disabled={weekOffset >= 3}
              title={weekOffset >= 3 ? "Cannot view beyond Week 42" : "Next Week"}
            >
              <svg
                className="nav-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </h2>
        <div className="header-buttons">
          <button className="assign-task-button" onClick={handleAssignClick}>
            Assign New Tasks
          </button>
          {userRole === "supervisor" && !supReviewMode && (
            <button className="review-button" onClick={handleEnterReview}>
              Supervisor Review
            </button>
          )}
          {userRole === "supervisor" && supReviewMode && (
            <button className="exit-review-button" onClick={handleExitReview}>
              Exit Review
            </button>
          )}
        </div>
      </div>

      {loading && <div>Loading tasks...</div>}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => fetchData()} style={{ marginLeft: "10px" }}>
            Retry
          </button>
        </div>
      )}
      {!loading && !error && noTasks && (
        <div className="no-tasks-message">
          No tasks available in this Week {weekId}: {dateRange}.{" "}
        </div>
      )}

      {showAssignForm && (
        <div className="assign-form-modal">
          <div className="assign-form-empdriven">
            <div className="form-header">
              <h3>Assign New Tasks</h3>
              <button className="close-button" onClick={handleAssignCancel}>×</button>
            </div>
            {assignTasks.length === 0 && (
              <div className="empty-state">
                <button onClick={handleAddTask} className="add-first-task-button">
                  Add Task
                </button>
              </div>
            )}
            {assignTasks.length > 0 && (
              <div className="tasks-form-container">
                {assignTasks.map((task, index) => (
                  <div key={index} className="task-form-row">
                    <div className="form-row-header">
                      <h4>Task {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveTask(index)}
                        className="remove-task-button"
                      >
                        ×
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Dates</label>
                        <div className="multi-select-dropdown">
                          <div
                            className="dropdown-header-task"
                            onClick={() => toggleDropdown(index)}
                          >
                            {task.dates.length > 0
                              ? task.dates.join(", ")
                              : "-- Select Dates --"}
                            <span className="arrow">{dropdownOpen[index] ? "▲" : "▼"}</span>
                          </div>
                          {dropdownOpen[index] && (
                            <div className="dropdown-list">
                              {weekDates.map((date) => (
                                <label key={date} className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={task.dates.includes(date)}
                                    onChange={() => handleAssignChange(index, "dates", date)}
                                  />
                                  {date}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Project</label>
                        <select
                          value={task.projectId}
                          onChange={handleProjectSelect(index)}
                        >
                          <option value="">Select Project</option>
                          {Object.entries(projects).map(([id, name]) => (
                            <option key={id} value={id}>
                              {id} - {name}
                            </option>
                          ))}
                          <option value="new">New Project</option>
                        </select>
                      </div>
                      {task.isNewProject && (
                        <>
                          <div className="form-group">
                            <label>Project ID</label>
                            <input
                              type="text"
                              value={task.projectId}
                              onChange={(e) => handleAssignChange(index, "projectId", e.target.value)}
                              placeholder="Enter new project ID"
                            />
                          </div>
                          <div className="form-group">
                            <label>Project Name</label>
                            <input
                              type="text"
                              value={task.projectName}
                              onChange={(e) => handleAssignChange(index, "projectName", e.target.value)}
                              placeholder="Enter new project name"
                            />
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label>Task Name</label>
                        <input
                          type="text"
                          value={task.taskName}
                          onChange={(e) => handleAssignChange(index, "taskName", e.target.value)}
                          placeholder="Enter task name"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddTask} className="add-task-button">
                  + Add Another Task
                </button>
              </div>
            )}
            <div className="form-actions">
              <button onClick={handleAssignSubmit} className="save-button">
                Save All Tasks
              </button>
              <button onClick={handleAssignCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole === "supervisor" && strikeTaskId && (
        <div className="replacement-modal">
          <div className="replacement-form">
            <div className="form-header">
              <h4>Replace Struck Task</h4>
              <button className="close-button" onClick={() => setStrikeTaskId(null)}>×</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Project</label>
                <select
                  value={replacementData.projectId}
                  onChange={(e) => handleReplacementChange("projectId", e.target.value)}
                >
                  <option value="">Select Project</option>
                  {Object.entries(projects).map(([id, name]) => (
                    <option key={id} value={id}>
                      {id} - {name}
                    </option>
                  ))}
                  <option value="new">New Project</option>
                </select>
              </div>
              {replacementData.isNewProject && (
                <>
                  <div className="form-group">
                    <label>Project ID</label>
                    <input
                      type="text"
                      value={replacementData.projectId}
                      onChange={(e) => handleReplacementChange("projectId", e.target.value)}
                      placeholder="Enter new project ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={replacementData.projectName}
                      onChange={(e) => handleReplacementChange("projectName", e.target.value)}
                      placeholder="Enter new project name"
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={replacementData.taskName}
                  onChange={(e) => handleReplacementChange("taskName", e.target.value)}
                  placeholder="Enter replacement task name"
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleAddReplacement} className="save-button">
                Add Replacement
              </button>
              <button onClick={() => setStrikeTaskId(null)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && !noTasks && tasksData.map((day) => {
        const isExpanded = expandedDates[day.date] || false;
        const visibleTasks = isExpanded ? day.tasks : day.tasks.slice(0, 3);

        return (
          <div key={day.date} className="day-card">
            <div className="day-left-column">
              <span className="day-date">{day.date}</span>
              <div className="projects-column">
                {visibleTasks.map((task) => (
                  <div key={task.task_id} className="circle-container">
                    <div className="project-circle" title={task.project_name}>
                      {task.project_id}
                    </div>
                    <div className="task-id-circle" title={`Task ID: ${task.task_id}`}>
                      {task.task_id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tasks-section">
              <div className="tasks-header">
                <div className="header-task">Tasks</div>
                <div className="header-employee">Employee Update</div>
                <div className="header-supervisor">Supervisor Feedback</div>
              </div>
              <div className="tasks-list">
                {visibleTasks.map((task) => {
                  const editable = isTaskEditable(task.task_date);
                  return (
                    <div key={task.task_id} className="task-row">
                      <div className="task-name">
                        {task.sup_review_status === "struck" ? (
                          <>
                            <span style={{ textDecoration: "line-through", color: "#a0a0a0" }}>
                              {task.task_name}
                            </span>
                            {task.replacement_task && (
                              <span style={{ color: "#007bff", marginLeft: "10px", display: "inline-flex", alignItems: "center" }}>
                                <span
                                  className={`review-status-icon ${task.sup_review_status}`}
                                  style={{ color: reviewColors[task.sup_review_status], marginRight: "5px" }}
                                  title={
                                    task.sup_review_status === "approved"
                                      ? "Approved"
                                      : task.sup_review_status === "struck"
                                      ? "Struck"
                                      : "Suspended"
                                  }
                                >
                                  {reviewIcons[task.sup_review_status]}
                                </span>
                                {task.replacement_task}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {task.task_name}
                            {task.sup_review_status !== "pending" && (
                              <span
                                className={`review-status-icon ${task.sup_review_status}`}
                                style={{ color: reviewColors[task.sup_review_status] }}
                                title={
                                  task.sup_review_status === "approved"
                                    ? "Approved"
                                    : task.sup_review_status === "struck"
                                    ? "Struck"
                                    : "Suspended"
                                }
                              >
                                {reviewIcons[task.sup_review_status]}
                              </span>
                            )}
                          </>
                        )}
                        {userRole === "supervisor" && supReviewMode && task.sup_review_status === "pending" && (
                          <div className="review-action-icons" style={{ opacity: editable ? 2 : 0.2 }}>
                            <svg
                              className="action-icon approve"
                              onClick={() => handleApprove(task.task_id)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="green"
                              strokeWidth="2"
                              style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <svg
                              className="action-icon strike"
                              onClick={() => handleStrike(task.task_id, day.date)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="red"
                              strokeWidth="2"
                              style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                            >
                              <path d="M18 6L6 18" />
                            </svg>
                            <svg
                              className="action-icon suspend"
                              onClick={() => handleSuspendReview(task.task_id)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="orange"
                              strokeWidth="2"
                              style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="update-section" style={{ opacity: editable ? 1 : 0.2 }}>
                        {editingTask === task.task_id && userRole === "employee" && (
                          <div className="edit-popup">
                            <div className="checkbox-group">
                              {["completed", "not started", "working"].map((status) => (
                                <label key={status} className="checkbox-label">
                                  <input
                                    type="radio"
                                    name="emp-status"
                                    value={status}
                                    checked={formData.status === status}
                                    onChange={(e) =>
                                      setFormData({ ...formData, status: e.target.value })
                                    }
                                    disabled={!editable}
                                  />
                                  {statusLabels[status] || status}
                                </label>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Add comment"
                              value={formData.comment}
                              onChange={(e) =>
                                setFormData({ ...formData, comment: e.target.value })
                              }
                              className="edit-comment-input"
                              disabled={!editable}
                            />
                            <div className="edit-actions">
                              <button
                                onClick={handleCancelEdit}
                                className="cancel-button"
                                disabled={!editable}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(task.task_id)}
                                className="edit-save-button"
                                disabled={!editable}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="status-container">
                          <span className="comment">{task.emp_comment || "N/A"}</span>
                          <div className="status-dots">
                            <span
                              className="status-dot"
                              style={{ backgroundColor: statusColors[task.emp_status] || "#888" }}
                              title={statusLabels[task.emp_status] || task.emp_status}
                            ></span>
                            {userRole === "employee" && (
                              <svg
                                className="edit-icon"
                                onClick={() => handleEditClick(task)}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#007bff"
                                strokeWidth="2"
                                style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="supervisor-section" style={{ opacity: editable ? 1 : 0.2 }}>
                        {userRole === "supervisor" && supReviewMode && editingSupStatus === task.task_id ? (
                          <div className="edit-section">
                            <div className="checkbox-group">
                              {["completed", "add on", "re-work", "incomplete"].map((status) => (
                                <label key={status} className="checkbox-label">
                                  <input
                                    type="radio"
                                    name="sup-status"
                                    value={status}
                                    checked={supFormData.supStatus === status}
                                    onChange={(e) =>
                                      setSupFormData({ ...supFormData, supStatus: e.target.value })
                                    }
                                    disabled={!editable}
                                  />
                                  {statusLabels[status] || status}
                                </label>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Add supervisor comment"
                              value={supFormData.supComment}
                              onChange={(e) =>
                                setSupFormData({ ...supFormData, supComment: e.target.value })
                              }
                              className="edit-comment-input"
                              disabled={!editable}
                            />
                            <div className="edit-actions">
                              <button
                                onClick={handleSupStatusCancel}
                                className="cancel-button"
                                disabled={!editable}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSupStatusSave(task.task_id)}
                                className="edit-save-button"
                                disabled={!editable}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="status-container">
                            <span className="comment">{task.sup_comment || "N/A"}</span>
                            <div className="status-dots">
                              <span
                                className="status-dot"
                                style={{ backgroundColor: statusColors[task.sup_status] || "#888" }}
                                title={statusLabels[task.sup_status] || task.sup_status}
                              ></span>
                              {userRole === "supervisor" && supReviewMode && (
                                <svg
                                  className="edit-icon"
                                  onClick={() => handleSupStatusEditClick(task)}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#007bff"
                                  strokeWidth="2"
                                  style={{ cursor: editable ? 'pointer' : 'not-allowed' }}
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {day.tasks.length > 3 && (
                <svg
                  className="expand-icon-task"
                  onClick={() => toggleExpand(day.date)}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#28a745"
                  strokeWidth="2"
                >
                  {isExpanded ? (
                    <path d="M19 9l-7-7-7 7" />
                  ) : (
                    <path d="M5 15l7 7 7-7" />
                  )}
                </svg>
              )}
            </div>
          </div>
        );
      })}

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

export default WeeklyTaskPlanner;