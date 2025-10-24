
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./WeeklyTaskPlanner.css";
import Modal from "../Modal/Modal";

const WeeklyTaskPlanner = ({ userRole = "employee", employeeId }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const currentDate = new Date(2025, 9, 13); // October 13, 2025
  const dayOfWeek = currentDate.getDay();
  const offset = (dayOfWeek + 6) % 7;
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - offset + weekOffset * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
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
  const [holidays, setHolidays] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
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
  });
  const [loading, setLoading] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [error, setError] = useState(null);
  const [noTasks, setNoTasks] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [freezeDays, setFreezeDays] = useState(0);
  const [mobileTooltip, setMobileTooltip] = useState({
    isVisible: false,
    content: '',
    position: { x: 0, y: 0 },
    dotId: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const tooltipRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      console.log('Window width:', window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click/touch outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && mobileTooltip.isVisible && tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        console.log('Closing tooltip due to outside click');
        setMobileTooltip({ isVisible: false, content: '', position: { x: 0, y: 0 }, dotId: null });
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileTooltip.isVisible, isMobile]);

  // Handle tooltip click/touch for all elements
  const handleTooltipClick = (e, content, dotId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMobile) {
      console.log('Not mobile view, ignoring click for tooltip');
      return;
    }
    console.log('Tooltip element clicked:', { content, dotId });
    const rect = e.target.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const tooltipX = rect.left + rect.width / 2 + scrollX;
    const tooltipY = rect.top - 40 + scrollY;
    setMobileTooltip((prev) => {
      const newState = {
        isVisible: prev.dotId === dotId ? false : true,
        content: content,
        position: { x: tooltipX, y: tooltipY },
        dotId: prev.dotId === dotId ? null : dotId,
      };
      console.log('New tooltip state:', newState);
      return newState;
    });
  };

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
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(istDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const isTaskEditable = (taskDate) => {
    if (!taskDate) {
      console.log(`Task date: ${taskDate}, freezeDays: ${freezeDays}, editable: false (no date)`);
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDateObj = new Date(taskDate);
    taskDateObj.setHours(0, 0, 0, 0);
    const diffDays = (today - taskDateObj) / (1000 * 3600 * 24);
    const editable = diffDays <= 0 || (diffDays > 0 && diffDays <= freezeDays);
    console.log(`Task date: ${taskDate}, today: ${today.toISOString()}, diffDays: ${diffDays}, freezeDays: ${freezeDays}, editable: ${editable}`);
    return editable;
  };
  const getTaskDateStyle = (dateStr) => {
    const [day, month] = dateStr.split(" ");
    const year = 2025;
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const taskDate = new Date(year, monthIndex, parseInt(day));
    taskDate.setHours(0, 0, 0, 0);
    const isApprovedLeave = approvedLeaves.some(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return taskDate >= startDate && taskDate <= endDate;
    });
    const isSunday = taskDate.getDay() === 0;
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday);
      holidayDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === holidayDate.getTime();
    });
    if (isApprovedLeave) {
      return {
        className: 'week-task-day-date week-task-day-date-leave',
        tooltip: 'Leave'
      };
    } else if (isHoliday) {
      return {
        className: 'week-task-day-date week-task-day-date-holiday',
        tooltip: 'Holiday'
      };
    } else if (isSunday) {
      return {
        className: 'week-task-day-date week-task-day-date-sunday',
        tooltip: 'Sunday'
      };
    }
    return {
      className: 'week-task-day-date week-task-day-date-regular',
      tooltip: dateStr
    };
  };
  const fetchData = async () => {
    if (!employeeId) {
      showAlert("Employee ID is required to fetch data.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadingHolidays(true);
    setLoadingLeaves(true);
    setError(null);
    setNoTasks(false);
    try {
      const configResponse = await withRetry(() =>
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/config`, {
          headers: {
            "x-employee-id": employeeId,
            "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz",
            "Content-Type": "application/json",
          },
        })
      );
      console.log('Config API response:', JSON.stringify(configResponse.data, null, 2));
      if (!configResponse.data || !configResponse.data.success || !Array.isArray(configResponse.data.data)) {
        console.error('Invalid API response structure:', configResponse.data);
        setFreezeDays(0);
        showAlert('Invalid config API response. Freezing all past tasks.');
      } else {
        const configData = configResponse.data.data;
        const freezeDaysConfig = configData.find(item => item.key === 'freeze_days_employee');
        if (!freezeDaysConfig) {
          console.error('freeze_days_employee key not found in config data:', configData);
          setFreezeDays(0);
          showAlert('freeze_days_employee not found. Freezing all past tasks.');
        } else {
          const days = Number(freezeDaysConfig.value);
          if (isNaN(days) || days < 0) {
            console.error(`Invalid freeze_days_employee value: ${freezeDaysConfig.value}`);
            setFreezeDays(0);
            showAlert('Invalid freeze_days_employee value. Freezing all past tasks.');
          } else {
            console.log(`freeze_days_employee value: ${freezeDaysConfig.value}, parsed days: ${days}`);
            setFreezeDays(days);
          }
        }
      }
      const holidaysUrl = `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/holidays/all`;
      console.log("Fetching holidays from:", holidaysUrl);
      const holidaysRes = await withRetry(() =>
        axios.get(holidaysUrl, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz",
            "x-employee-id": employeeId,
            "Content-Type": "application/json",
          },
        })
      );
      const holidayData = Array.isArray(holidaysRes.data.holidays)
        ? holidaysRes.data.holidays.map(holiday => holiday.date)
        : [];
      setHolidays(holidayData.length > 0 ? holidayData : ['2025-12-25']);
      console.log("Holidays:", holidayData);
      const leavesUrl = `${process.env.REACT_APP_BACKEND_URL}/employee/leave/${employeeId}`;
      console.log("Fetching leaves from:", leavesUrl);
      const leavesRes = await withRetry(() =>
        axios.get(leavesUrl, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz",
            "Content-Type": "application/json",
          },
        })
      );
      const approvedLeavesData = Array.isArray(leavesRes.data.data)
        ? leavesRes.data.data.filter(leave => leave.status === "Approved")
        : [];
      setApprovedLeaves(approvedLeavesData);
      console.log("Approved Leaves:", approvedLeavesData);
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
      setHolidays(['2025-12-25']);
      setApprovedLeaves([]);
      setFreezeDays(0);
    } finally {
      setLoading(false);
      setLoadingHolidays(false);
      setLoadingLeaves(false);
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
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
      return;
    }
    if (editingTask === task.task_id) {
      setEditingTask(null);
      setFormData({ taskName: "", status: "", comment: "" });
    } else {
      setEditingTask(task.task_id);
      setFormData({ taskName: task.task_name, status: task.emp_status, comment: task.emp_comment || "" });
    }
  };
  const handleSupStatusEditClick = (task) => {
    if (userRole !== "supervisor") return;
    if (!isTaskEditable(task.task_date)) {
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
      return;
    }
    if (editingSupStatus === task.task_id) {
      setEditingSupStatus(null);
      setSupFormData({ supStatus: "", supComment: "" });
    } else {
      setEditingSupStatus(task.task_id);
      setSupFormData({ supStatus: task.sup_status || "incomplete", supComment: task.sup_comment || "" });
    }
  };
  const handleSave = async (taskId) => {
    if (userRole !== "employee") return;
    const task = tasksData
      .flatMap((day) => day.tasks)
      .find((t) => t.task_id === taskId);
    if (!isTaskEditable(task.task_date)) {
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
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
    } catch (err) {
      showAlert(`Failed to update task: ${err.message}`);
      console.error(err);
    } finally {
      setEditingTask(null);
      setFormData({ taskName: "", status: "", comment: "" });
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
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
      return;
    }
    try {
      const updateData = {
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
      if (supFormData.supStatus === 're-work') {
        const taskDate = new Date(task.task_date || new Date());
        if (isNaN(taskDate.getTime())) taskDate = new Date();
        taskDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(taskDate);
        nextDay.setDate(taskDate.getDate() + 1);
        const nextDayString = nextDay.toLocaleDateString('en-CA');
        if (!isTaskEditable(nextDayString)) {
          showAlert(`Cannot create new task: Next day is before the ${freezeDays}-day editable period.`);
          return;
        }
        const nextDayWeekId = getISOWeekNumber(nextDay);
        const newTaskName = task.replacement_task || task.task_name;
        const newTaskData = {
          week_id: nextDayWeekId,
          task_date: nextDayString,
          project_id: task.project_id,
          project_name: task.project_name,
          task_name: newTaskName,
          employee_id: task.employee_id,
          emp_status: 'not started',
          sup_status: 'incomplete',
          emp_comment: null,
          sup_comment: null,
          sup_review_status: 'pending',
          star_rating: 0,
          parent_task_id: task.task_id,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/week_tasks`,
          newTaskData,
          { headers: { 'x-api-key': process.env.REACT_APP_API_KEY || "abc123xyz" }, timeout: 10000 }
        );
        updateData.sup_status = 're-work';
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`,
          updateData,
          { headers: { 'x-api-key': process.env.REACT_APP_API_KEY || "abc123xyz" }, timeout: 10000 }
        );
        showAlert(response.data.message || 'New task created successfully');
        if (response.data.newTask) {
          const newTask = {
            ...response.data.newTask,
            employee_name: 'Unknown',
            employee_id: response.data.newTask.employee_id?.trim().toUpperCase(),
            emp_status: response.data.newTask.emp_status || 'not started',
          };
          setTasksData((prev) => {
            const newData = [...prev];
            const dayIndex = newData.findIndex((d) => d.date === formatDateRange(new Date(nextDayString), new Date(nextDayString)));
            if (dayIndex > -1) {
              newData[dayIndex] = {
                ...newData[dayIndex],
                tasks: [...newData[dayIndex].tasks, newTask],
              };
            }
            return newData;
          });
          const newTaskWeek = newTask.week_id;
          if (newTaskWeek && newTaskWeek !== weekId) {
            const newOffset = weekOffset + (newTaskWeek - weekId);
            setWeekOffset(newOffset);
          }
        }
      } else {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/week_tasks/${taskId}`, updateData, {
          headers: { "x-api-key": process.env.REACT_APP_API_KEY || "abc123xyz" },
        });
        showAlert('Task updated successfully');
      }
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
    } catch (err) {
      showAlert(`Failed to update supervisor status: ${err.message}`);
      console.error(err);
    } finally {
      setEditingSupStatus(null);
      setSupFormData({ supStatus: "", supComment: "" });
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
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
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
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
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
      showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
      return;
    }
    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
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
      setReplacementData({ projectId: "", projectName: "", taskName: "", date: dayDate });
    } catch (err) {
      showAlert(`Failed to strike task: ${err.message}`);
      console.error(err);
    }
  };
  const handleReplacementChange = (field, value) => {
    setReplacementData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "projectId" ? { projectName: projects[value] || "" } : {}),
    }));
  };
  const handleAddReplacement = async () => {
    if (userRole !== "supervisor") return;
    if (!replacementData.projectId || !replacementData.taskName) {
      showAlert("Please provide project ID and task name.");
      return;
    }
    try {
      const dayIndex = tasksData.findIndex((d) => d.date === replacementData.date);
      const taskIndex = tasksData[dayIndex].tasks.findIndex((t) => t.task_id === strikeTaskId);
      const task = tasksData[dayIndex].tasks[taskIndex];
      if (!isTaskEditable(task.task_date)) {
        showAlert(`Cannot edit: Task is before the ${freezeDays}-day editable period.`);
        return;
      }
      if (task.sup_review_status === "suspended_review") {
        showAlert("This task is suspended and cannot be updated.");
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
      const year = 2025;
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
      setReplacementData({ projectId: "", projectName: "", taskName: "", date: "" });
    } catch (err) {
      showAlert(`Failed to add replacement task: ${err.message}`);
      console.error(err);
    }
  };
  const handleAssignClick = () => {
    console.log("Assign New Tasks button clicked, setting showAssignForm to true");
    setShowAssignForm(true);
    setAssignTasks([
      {
        dates: [],
        projectId: "",
        projectName: "",
        taskName: "",
      },
    ]);
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
      },
    ]);
  };
  const handleRemoveTask = (index) => {
    setAssignTasks((prev) => {
      if (prev.length <= 1) return prev;
      const newTasks = prev.filter((_, i) => i !== index);
      return newTasks;
    });
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
              projectName: projects[id] || "",
            }
          : t
      )
    );
  };
  const handleAssignSubmit = async () => {
    console.log("Submitting assign tasks:", assignTasks);
    const validTasks = assignTasks.filter(
      (task) => task.projectId && task.taskName && task.dates.length > 0
    );
    if (validTasks.length === 0) {
      showAlert("Please fill in at least one valid task with at least one date, project ID, and task name.");
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
    console.log("Cancel assign form, resetting state");
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
    <div className="week-task-weekly-task-planner">
      <div className="week-task-planner-header">
        <h2>
          Weekly Task Planner{" "}
          <span className="week-task-week-id">
            Week {weekId}: {dateRange}
          </span>
          <div className="week-task-week-navigation">
            <button
              onClick={handlePreviousWeek}
              className="week-task-nav-button-task"
              disabled={weekOffset <= -3}
              title={weekOffset <= -3 ? "Cannot view earlier than Week 36" : "Previous Week"}
            >
              <svg
                className="week-task-nav-icon"
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
            <div className="week-task-nav-dots">
              <span className="week-task-dot"></span>
              <span className="week-task-dot"></span>
              <span className="week-task-dot"></span>
            </div>
            <button
              onClick={handleNextWeek}
              className="week-task-nav-button-task"
              disabled={weekOffset >= 3}
              title={weekOffset >= 3 ? "Cannot view beyond Week 42" : "Next Week"}
            >
              <svg
                className="week-task-nav-icon"
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
        <div className="week-task-header-buttons">
          <button
            className="week-task-assign-task-button"
            onClick={() => {
              console.log("Assign New Tasks button clicked");
              handleAssignClick();
            }}
          >
            Assign New Tasks
          </button>
          {userRole === "supervisor" && !supReviewMode && (
            <button className="week-task-review-button" onClick={handleEnterReview}>
              Supervisor Review
            </button>
          )}
          {userRole === "supervisor" && supReviewMode && (
            <button className="week-task-exit-review-button" onClick={handleExitReview}>
              Exit Review
            </button>
          )}
        </div>
      </div>
      {loading || loadingHolidays || loadingLeaves ? <div>Loading data...</div> : null}
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
          No tasks available in this Week {weekId}: {dateRange}.
        </div>
      )}
      {mobileTooltip.isVisible && (
        <div
          ref={tooltipRef}
          className="week-task-mobile-tooltip"
          style={{
            top: `${mobileTooltip.position.y}px`,
            left: `${mobileTooltip.position.x}px`,
            position: 'absolute',
            zIndex: 1000,
          }}
        >
          {mobileTooltip.content}
        </div>
      )}
      {showAssignForm && (
        <div className="week-task-assign-form-modal">
          <div className="week-task-assign-form-empdriven">
            <div className="week-task-form-header">
              <h3>Assign New Tasks</h3>
              <button className="week-task-close-button" onClick={handleAssignCancel}>×</button>
            </div>
            <div className="week-task-tasks-form-container">
              {assignTasks.map((task, index) => (
                <div key={index} className="week-task-task-form-row">
                  <div className="week-task-form-row-header">
                    <h4>Task {index + 1}</h4>
                    <button
                      onClick={() => handleRemoveTask(index)}
                      className="week-task-remove-task-button"
                      disabled={assignTasks.length === 1}
                    >
                      ×
                    </button>
                  </div>
                  <div className="week-task-form-grid">
                    <div className="week-task-form-group-task">
                      <label>Dates</label>
                      <div className="week-task-multi-select-dropdown">
                        <div
                          className="week-task-dropdown-header-task"
                          onClick={() => toggleDropdown(index)}
                        >
                          {task.dates.length > 0
                            ? task.dates.join(", ")
                            : "-- Select Dates --"}
                          <span className="arrow">{dropdownOpen[index] ? "▲" : "▼"}</span>
                        </div>
                        {dropdownOpen[index] && (
                          <div className="week-task-dropdown-list">
                            {weekDates.map((date) => {
                              const dateStyle = getTaskDateStyle(date);
                              return (
                                <label key={date} className="week-task-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={task.dates.includes(date)}
                                    onChange={() => handleAssignChange(index, "dates", date)}
                                  />
                                  {date}
                                  {dateStyle.tooltip !== date && (
                                    <span className={`week-task-date-status ${dateStyle.className}`}>
                                      {dateStyle.tooltip}
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="week-task-form-group-task">
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
                      </select>
                    </div>
                    <div className="week-task-form-group-task">
                      <label>Task</label>
                      <input
                        type="text"
                        value={task.taskName}
                        onChange={(e) => handleAssignChange(index, "taskName", e.target.value)}
                        placeholder="Enter task"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={handleAddTask} className="week-task-add-task-button">
                + Add Another Task
              </button>
            </div>
            <div className="week-task-form-actions">
              <button onClick={handleAssignCancel} className="week-task-cancel-button">
                Cancel
              </button>
              <button onClick={handleAssignSubmit} className="week-task-save-button">
                Save All Tasks
              </button>
            </div>
          </div>
        </div>
      )}
      {userRole === "supervisor" && strikeTaskId && (
        <div className="week-task-replacement-modal">
          <div className="week-task-replacement-form">
            <div className="week-task-form-header">
              <h4>Replace Struck Task</h4>
              <button className="week-task-close-button" onClick={() => setStrikeTaskId(null)}>×</button>
            </div>
            <div className="week-task-form-grid">
              <div className="week-task-form-group-task">
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
                </select>
              </div>
              <div className="week-task-form-group-task">
                <label>Task Name</label>
                <input
                  type="text"
                  value={replacementData.taskName}
                  onChange={(e) => handleReplacementChange("taskName", e.target.value)}
                  placeholder="Enter replacement task name"
                />
              </div>
            </div>
            <div className="week-task-form-actions">
              <button onClick={handleAddReplacement} className="week-task-save-button">
                Add Replacement
              </button>
              <button onClick={() => setStrikeTaskId(null)} className="week-task-cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && !error && !noTasks && tasksData.map((day) => {
        const isExpanded = expandedDates[day.date] || false;
        const visibleTasks = isExpanded ? day.tasks : day.tasks.slice(0, 3);
        const dateStyle = getTaskDateStyle(day.date);
        return (
          <div key={day.date} className="week-task-day-card">
            <div className="week-task-day-left-column">
              <span
                className={dateStyle.className}
                title={isMobile ? '' : dateStyle.tooltip}
                onClick={(e) => handleTooltipClick(e, dateStyle.tooltip, `date-${day.date}`)}
                onTouchStart={(e) => handleTooltipClick(e, dateStyle.tooltip, `date-${day.date}`)}
                style={{ cursor: isMobile ? 'pointer' : 'default' }}
              >
                {day.date}
              </span>
              <div className="week-task-projects-column">
                {visibleTasks.map((task) => (
                  <div key={task.task_id} className="week-task-circle-container">
                    <div
                      className="week-task-project-circle"
                      title={isMobile ? '' : task.project_name}
                      onClick={(e) => handleTooltipClick(e, task.project_name, `project-${task.task_id}`)}
                      onTouchStart={(e) => handleTooltipClick(e, task.project_name, `project-${task.task_id}`)}
                      style={{ cursor: isMobile ? 'pointer' : 'default' }}
                    >
                      {task.project_id}
                    </div>
                    <div
                      className="week-task-task-id-circle"
                      title={isMobile ? '' : `Task ID: ${task.task_id}`}
                      onClick={(e) => handleTooltipClick(e, `Task ID: ${task.task_id}`, `task-${task.task_id}`)}
                      onTouchStart={(e) => handleTooltipClick(e, `Task ID: ${task.task_id}`, `task-${task.task_id}`)}
                      style={{ cursor: isMobile ? 'pointer' : 'default' }}
                    >
                      {task.task_id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="week-task-tasks-section">
              <div className="week-task-tasks-header">
                <div className="week-task-header-task">Tasks</div>
                <div className="week-task-header-employee">Employee Update</div>
                <div className="week-task-header-supervisor">Supervisor Feedback</div>
              </div>
              <div className="week-task-tasks-list">
                {visibleTasks.map((task) => {
                  const editable = isTaskEditable(task.task_date);
                  const isFrozen = task.sup_review_status === "suspended_review";
                  const effectiveEditable = editable && !isFrozen;
                  console.log(`Rendering task ${task.task_id}: date=${task.task_date}, editable=${editable}, frozen=${isFrozen}, effectiveEditable=${effectiveEditable}, class=${!effectiveEditable ? 'task-frozen' : ''}`);
                  return (
                    <div key={task.task_id} className={`week-task-task-row ${!effectiveEditable ? 'task-frozen' : ''}`}>
                      <div className="week-task-task-name">
                        {task.sup_review_status === "struck" ? (
                          <>
                            <span style={{ textDecoration: "line-through", color: "#a0a0a0" }}>
                              {task.task_name}
                            </span>
                            {task.replacement_task && (
                              <span style={{ color: "#007bff", marginLeft: "10px", display: "inline-flex", alignItems: "center" }}>
                                <span
                                  className={`week-task-review-status-icon ${task.sup_review_status}`}
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
                                className={`week-task-review-status-icon ${task.sup_review_status}`}
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
                          <div className="week-task-review-action-icons" style={{ opacity: effectiveEditable ? 1 : 0.5 }}>
                            <svg
                              className="week-task-action-icon approve"
                              onClick={() => handleApprove(task.task_id)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="green"
                              strokeWidth="2"
                              style={{ cursor: effectiveEditable ? 'pointer' : 'not-allowed' }}
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <svg
                              className="week-task-action-icon strike"
                              onClick={() => handleStrike(task.task_id, day.date)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="red"
                              strokeWidth="2"
                              style={{ cursor: effectiveEditable ? 'pointer' : 'not-allowed' }}
                            >
                              <path d="M18 6L6 18" />
                            </svg>
                            <svg
                              className="week-task-action-icon suspend"
                              onClick={() => handleSuspendReview(task.task_id)}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="orange"
                              strokeWidth="2"
                              style={{ cursor: effectiveEditable ? 'pointer' : 'not-allowed' }}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="week-task-update-section" style={{ opacity: effectiveEditable ? 1 : 0.5 }}>
                        {editingTask === task.task_id && userRole === "employee" && (
                          <div className="week-task-edit-popup">
                            <div className="week-task-checkbox-group">
                              {["completed", "not started", "working"].map((status) => (
                                <label key={status} className="week-task-checkbox-label">
                                  <input
                                    type="radio"
                                    name="emp-status"
                                    value={status}
                                    checked={formData.status === status}
                                    onChange={(e) =>
                                      setFormData({ ...formData, status: e.target.value })
                                    }
                                    disabled={!effectiveEditable}
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
                              className="week-task-edit-comment-input"
                              disabled={!effectiveEditable}
                            />
                            <div className="week-task-edit-actions">
                              <button
                                onClick={handleCancelEdit}
                                className="week-task-cancel-button"
                                disabled={!effectiveEditable}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(task.task_id)}
                                className="week-task-edit-save-button"
                                disabled={!effectiveEditable}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="week-task-status-container">
                          <span className="week-task-comment">{task.emp_comment || "N/A"}</span>
                          <div className="week-task-status-dots">
                            <span
                              className="week-task-status-dot"
                              style={{
                                backgroundColor: statusColors[task.emp_status] || "#888",
                                cursor: isMobile ? 'pointer' : 'default',
                              }}
                              title={isMobile ? '' : (statusLabels[task.emp_status] || task.emp_status)}
                              onClick={(e) => handleTooltipClick(e, statusLabels[task.emp_status] || task.emp_status, `emp-${task.task_id}`)}
                              onTouchStart={(e) => handleTooltipClick(e, statusLabels[task.emp_status] || task.emp_status, `emp-${task.task_id}`)}
                            ></span>
                            {userRole === "employee" && (
                              <svg
                                className="week-task-edit-icon"
                                onClick={() => handleEditClick(task)}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#007bff"
                                strokeWidth="2"
                                style={{ cursor: effectiveEditable ? 'pointer' : 'not-allowed' }}
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="week-task-supervisor-section" style={{ opacity: effectiveEditable ? 1 : 0.5 }}>
                        {userRole === "supervisor" && supReviewMode && editingSupStatus === task.task_id ? (
                          <div className="week-task-edit-section">
                            <div className="week-task-checkbox-group">
                              {["completed", "add on", "re-work", "incomplete"].map((status) => (
                                <label key={status} className="week-task-checkbox-label">
                                  <input
                                    type="radio"
                                    name="sup-status"
                                    value={status}
                                    checked={supFormData.supStatus === status}
                                    onChange={(e) =>
                                      setSupFormData({ ...supFormData, supStatus: e.target.value })
                                    }
                                    disabled={!effectiveEditable}
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
                              className="week-task-edit-comment-input"
                              disabled={!effectiveEditable}
                            />
                            <div className="week-task-edit-actions">
                              <button
                                onClick={handleSupStatusCancel}
                                className="week-task-cancel-button"
                                disabled={!effectiveEditable}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSupStatusSave(task.task_id)}
                                className="week-task-edit-save-button"
                                disabled={!effectiveEditable}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="week-task-status-container">
                            <span className="week-task-comment">{task.sup_comment || "N/A"}</span>
                            <div className="week-task-status-dots">
                              <span
                                className="week-task-status-dot"
                                style={{
                                  backgroundColor: statusColors[task.sup_status] || "#888",
                                  cursor: isMobile ? 'pointer' : 'default',
                                }}
                                title={isMobile ? '' : (statusLabels[task.sup_status] || task.sup_status)}
                                onClick={(e) => handleTooltipClick(e, statusLabels[task.sup_status] || task.sup_status, `sup-${task.task_id}`)}
                                onTouchStart={(e) => handleTooltipClick(e, statusLabels[task.sup_status] || task.sup_status, `sup-${task.task_id}`)}
                              ></span>
                              {userRole === "supervisor" && supReviewMode && (
                                <svg
                                  className="week-task-edit-icon"
                                  onClick={() => handleSupStatusEditClick(task)}
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#007bff"
                                  strokeWidth="2"
                                  style={{ cursor: effectiveEditable ? 'pointer' : 'not-allowed' }}
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
                  className="week-task-expand-icon-task"
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