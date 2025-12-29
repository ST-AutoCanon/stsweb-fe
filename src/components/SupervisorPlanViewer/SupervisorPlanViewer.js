import React, { useState, useEffect, useRef } from "react";
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
import { MdMic, MdMicOff } from "react-icons/md";

import "./SupervisorPlanViewer.css";

const SupervisorPlanViewer = () => {
  const [supervisorId, setSupervisorId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [error, setError] = useState(null);
  const [justSavedRework, setJustSavedRework] = useState({});
  const [savedSupStatus, setSavedSupStatus] = useState({});

  const [openNodes, setOpenNodes] = useState({});

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    message: "",
  });
  const [freezeDays, setFreezeDays] = useState(0);
  const [pendingReviewChanges, setPendingReviewChanges] = useState({});

  const showAlert = (message) => {
    setAlertModal({ isVisible: true, message });
    setTimeout(() => setAlertModal({ isVisible: false, message: "" }), 5000);
  };

  // Employee level lookup map
  const employeeLevelMap = React.useMemo(() => {
    const map = {};
    const traverse = (nodes) => {
      nodes.forEach((emp) => {
        map[emp.employee_id] = emp.level;
        if (emp.children && emp.children.length > 0) {
          traverse(emp.children);
        }
      });
    };
    traverse(employees);
    return map;
  }, [employees]);

  const canEditByHierarchy = (taskEmployeeId) => {
    const findEmployee = (nodes) => {
      for (const emp of nodes) {
        if (emp.employee_id === taskEmployeeId) return emp;
        if (emp.children?.length) {
          const found = findEmployee(emp.children);
          if (found) return found;
        }
      }
      return null;
    };
    const employee = findEmployee(employees);
    return employee?.supervisor_id === supervisorId;
  };

  // Build Employee Tree
  const buildEmployeeTree = (employees) => {
    const map = {};
    const roots = [];

    employees.forEach((emp) => {
      map[emp.employee_id] = { ...emp, children: [], level: 0 };
    });

    employees.forEach((emp) => {
      if (map[emp.supervisor_id]) {
        map[emp.employee_id].level = map[emp.supervisor_id].level + 1;
        map[emp.supervisor_id].children.push(map[emp.employee_id]);
      } else {
        roots.push(map[emp.employee_id]);
      }
    });

    return roots;
  };

  // Updated: Returns "YYYY-WW" format
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
    const taskForWeek = tasks.find(t => t.week_id === weekId);
    year = taskForWeek ? new Date(taskForWeek.task_date).getFullYear() : new Date().getFullYear();
  }

  // Same logic as above to get correct ISO year
  let tempDate = new Date(year, 0, 4);
  tempDate.setDate(tempDate.getDate() + 3);
  const thursdayOfWeek1 = new Date(tempDate);
  thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
  const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);
  const isoYear = thursdayOfTargetWeek.getFullYear();

  const weekStart = addDays(thursdayOfTargetWeek, -3);
  const weekEnd = addDays(weekStart, 6);

  const formattedStart = format(weekStart, "MMM d, yyyy");
  const formattedEnd = format(weekEnd, "MMM d, yyyy");

  return `Week ${weekNum} (${formattedStart} - ${formattedEnd})`;
};

  const getWeekIdForDate = (date) => {
    const taskDate = new Date(date);
    return isNaN(taskDate.getTime()) ? null : getISOWeekNumber(taskDate);
  };

  const isTaskEditable = (taskDate) => {
    if (!taskDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDateObj = new Date(taskDate);
    taskDateObj.setHours(0, 0, 0, 0);
    const diffDays = (today - taskDateObj) / (1000 * 3600 * 24);
    return diffDays <= 0 || (diffDays > 0 && diffDays <= freezeDays);
  };

  const handleReviewChange = (taskId, value) => {
    if (value === "pending") {
      setPendingReviewChanges((prev) => {
        const newPrev = { ...prev };
        delete newPrev[taskId];
        return newPrev;
      });
    } else {
      setPendingReviewChanges((prev) => ({ ...prev, [taskId]: value }));
    }
  };

  const recognitionRef = useRef(null);
  const [listeningTaskId, setListeningTaskId] = useState(null);
  const [liveComments, setLiveComments] = useState({});

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = (taskId) => {
    if (!SpeechRecognition) {
      showAlert("Speech Recognition is not supported.");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setListeningTaskId(taskId);
    recognition.start();

    let finalTranscript = "";

    recognition.onresult = (event) => {
      finalTranscript += event.results[0][0].transcript + " ";
      const existing =
        liveComments[taskId] ||
        tasks.find((t) => t.task_id === taskId)?.sup_comment ||
        "";
      const combined = (existing + " " + finalTranscript).trim();
      setLiveComments((prev) => ({ ...prev, [taskId]: combined }));
      updateTaskField(taskId, "sup_comment", combined);
    };

    recognition.onend = () => {
      if (listeningTaskId === taskId && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    };

    recognition.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "audio-capture") return;
    };
  };

  const stopListening = () => {
    setListeningTaskId(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    recognitionRef.current = null;
  };

  const getNextDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

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
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/hierarchy`,
          {
            withCredentials: true,
            headers: { "x-employee-id": supervisorId },
            timeout: 10000,
          }
        );

        const empData = Array.isArray(response.data.hierarchy)
          ? response.data.hierarchy.map((emp) => ({
              ...emp,
              employee_id: emp.employee_id?.trim().toUpperCase(),
              supervisor_id: emp.supervisor_id?.trim().toUpperCase(),
            }))
          : [];

        const employeeTree = buildEmployeeTree(empData);
        setEmployees(employeeTree);
        setSelectedEmployee(empData[0]?.employee_id || null);
        setError(empData.length === 0 ? "No employees under your hierarchy." : null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : err.code === "ECONNABORTED"
          ? "Request timed out: Unable to connect to server"
          : `Network error: ${err.message}`;
        console.error("Error fetching employees:", errorMessage);
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
        setHolidays(
          Array.isArray(response.data.holidays)
            ? response.data.holidays.map((holiday) => holiday.date)
            : []
        );
      } catch (err) {
        console.error("Error fetching holidays:", err.response?.data || err.message);
        setHolidays(["2025-12-25"]);
      } finally {
        setLoadingHolidays(false);
      }
    };

    const fetchLeaves = async () => {
      setLoadingLeaves(true);
      try {
        const leavesMap = {};
        for (const emp of employees) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/employee/leave/${emp.employee_id}`,
            {
              withCredentials: true,
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY || "",
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );
          leavesMap[emp.employee_id] = Array.isArray(response.data.data)
            ? response.data.data.filter((leave) => leave.status === "Approved")
            : [];
        }
        setEmployeeLeaves(leavesMap);
      } catch (err) {
        console.error("Error fetching leaves:", err.response?.data || err.message);
        setEmployeeLeaves({});
      } finally {
        setLoadingLeaves(false);
      }
    };

    const fetchFreezeDays = async () => {
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

        if (!response.data?.success || !Array.isArray(response.data.data)) {
          setFreezeDays(0);
          return;
        }
        const freezeDaysConfig = response.data.data.find(
          (item) => item.key === "freeze_days_supervisor"
        );
        const days = freezeDaysConfig ? Number(freezeDaysConfig.value) : 0;
        setFreezeDays(isNaN(days) || days < 0 ? 0 : days);
      } catch (err) {
        console.error("Error fetching freeze days:", err.message);
        setFreezeDays(0);
      }
    };

    fetchEmployees();
    fetchHolidays();
    fetchFreezeDays();
    if (employees.length > 0) fetchLeaves();
  }, [supervisorId, employees.length]);

  useEffect(() => {
    if (!supervisorId) return;

    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
          {
            withCredentials: true,
            headers: { "x-employee-id": supervisorId },
            timeout: 10000,
          }
        );

        const validStatuses = ["not started", "working", "completed", "suspended"];
        const taskData =
          res.data.success && Array.isArray(res.data.data)
            ? res.data.data.map((task) => ({
                ...task,
                employee_id: task.employee_id?.trim().toUpperCase(),
                emp_status: validStatuses.includes(task.emp_status)
                  ? task.emp_status
                  : "not started",
              }))
            : [];

        setTasks(taskData);

        const uniqueWeekIds = [...new Set(taskData.map((t) => t.week_id))].sort();
        if (uniqueWeekIds.length > 0) {
          setSelectedWeekId(uniqueWeekIds[uniqueWeekIds.length - 1]);
        }

        const statusMap = {};
        taskData.forEach((t) => {
          statusMap[t.task_id] = t.sup_status;
        });
        setSavedSupStatus(statusMap);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
          : `Network error: ${err.message}`;
        console.error("Error fetching tasks:", errorMessage);
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
            headers: { "x-api-key": process.env.REACT_APP_API_KEY || "" },
            timeout: 10000,
          }
        );
        const newProjects = {};
        (response.data.projects || []).forEach((project) => {
          newProjects[project.id] = project.project;
        });
        setProjects(newProjects);
      } catch (err) {
        console.error("Error fetching projects:", err.response?.data || err.message);
        setProjects({});
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedEmployee]);

  const updateTaskField = (taskId, field, value) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.task_id === taskId) {
          if (field === "project") {
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
      showAlert("Task not found");
      return;
    }

    if (!isTaskEditable(task.task_date)) {
      showAlert(`Cannot edit task: It is before the ${freezeDays}-day editable period.`);
      return;
    }

    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
      return;
    }

    try {
      const effectiveReviewStatus = pendingReviewChanges[taskId] || task.sup_review_status;

      const updateData = {
        sup_status: task.sup_status || "incomplete",
        sup_comment: task.sup_comment || "",
        sup_review_status: effectiveReviewStatus || "pending",
        replacement_task: task.replacement_task || null,
        star_rating: task.star_rating || 0,
        project_id: task.project_id,
        project_name: task.project_name,
      };

      if (task.sup_status === "re-work") {
        const taskDate = new Date(task.task_date || new Date());
        taskDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(taskDate);
        nextDay.setDate(taskDate.getDate() + 1);
        const nextDayString = nextDay.toLocaleDateString("en-CA");

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
          emp_status: "not started",
          sup_status: "incomplete",
          emp_comment: null,
          sup_comment: null,
          sup_review_status: "pending",
          star_rating: 0,
          parent_task_id: task.task_id,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
          newTaskData,
          {
            withCredentials: true,
            headers: { "x-employee-id": supervisorId },
            timeout: 10000,
          }
        );

        if (updateData.sup_status === "re-work") {
          setJustSavedRework((prev) => ({ ...prev, [taskId]: true }));
        }

        updateData.sup_status = "re-work";
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            withCredentials: true,
            headers: { "x-employee-id": supervisorId },
            timeout: 10000,
          }
        );

        showAlert(response.data.message || "New task created successfully");

        if (response.data.newTask) {
          const newTask = {
            ...response.data.newTask,
            employee_name:
              employees.find((emp) => emp.employee_id === response.data.newTask.employee_id)
                ?.employee_name || "Unknown",
            employee_id: response.data.newTask.employee_id?.trim().toUpperCase(),
            emp_status: response.data.newTask.emp_status || "not started",
          };
          setTasks((prev) => [...prev, newTask]);

          const newTaskWeek = newTask.week_id;
          if (newTaskWeek && newTaskWeek !== selectedWeekId) {
            setSelectedWeekId(newTaskWeek);
          }
        }
      } else {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            withCredentials: true,
            headers: { "x-employee-id": supervisorId },
            timeout: 10000,
          }
        );
        showAlert("Task updated successfully");
      }

      setSavedSupStatus((prev) => ({ ...prev, [taskId]: updateData.sup_status }));
      setPendingReviewChanges((prev) => {
        const newPrev = { ...prev };
        delete newPrev[taskId];
        return newPrev;
      });

      // Refresh tasks
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
        {
          withCredentials: true,
          headers: { "x-employee-id": supervisorId },
          timeout: 10000,
        }
      );

      const validStatuses = ["not started", "working", "completed", "suspended"];
      const refreshedTasks =
        res.data.success && Array.isArray(res.data.data)
          ? res.data.data.map((task) => ({
              ...task,
              employee_id: task.employee_id?.trim().toUpperCase(),
              emp_status: validStatuses.includes(task.emp_status)
                ? task.emp_status
                : "not started",
            }))
          : [];

      setTasks(refreshedTasks);

      const statusMap = {};
      refreshedTasks.forEach((t) => {
        statusMap[t.task_id] = t.sup_status;
      });
      setSavedSupStatus(statusMap);
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`
        : `Network error: ${err.message}`;
      console.error(`Error updating task ${taskId}:`, errorMessage);
      showAlert(`Failed to update task: ${errorMessage}`);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "#28a745";
      case "working": return "#3770ecff";
      case "not started": return "#888";
      case "suspended": return "#dc3545";
      default: return "#007bff";
    }
  };

  const getReviewStatusColor = (status) => {
    switch (status) {
      case "approved": return "#28a745";
      case "struck": return "#ffc107";
      case "suspended_review": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "completed": return "Completed";
      case "working": return "Working";
      case "not started": return "Not Started";
      case "suspended": return "Suspended";
      default: return "Unknown";
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
        className: "supervisor-plan-task-date supervisor-plan-task-date-regular",
        tooltip: "N/A",
      };
    }
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    const isApprovedLeave = employeeLeaves[employeeId]?.some((leave) => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return taskDate >= startDate && taskDate <= endDate;
    });

    const isSunday = taskDate.getDay() === 0;
    const isHoliday = holidays.some((holiday) => {
      const holidayDate = new Date(holiday);
      holidayDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === holidayDate.getTime();
    });

    if (isApprovedLeave) return { className: "supervisor-plan-task-date supervisor-plan-task-date-leave", tooltip: "Leave" };
    if (isHoliday) return { className: "supervisor-plan-task-date supervisor-plan-task-date-holiday", tooltip: "Holiday" };
    if (isSunday) return { className: "supervisor-plan-task-date supervisor-plan-task-date-sunday", tooltip: "Sunday" };
    return { className: "supervisor-plan-task-date supervisor-plan-task-date-regular", tooltip: formatDate(dateString) };
  };

  const weekIds = [...new Set(tasks.map((task) => task.week_id))].sort();

  const currentWeekIndex = weekIds.indexOf(selectedWeekId);

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) setSelectedWeekId(weekIds[currentWeekIndex - 1]);
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weekIds.length - 1) setSelectedWeekId(weekIds[currentWeekIndex + 1]);
  };

  // Fixed: Correctly generates week days even across year boundary
// Replace your current generateWeekDays function with this corrected version

const generateWeekDays = () => {
  if (!selectedWeekId) return [];

  let year, weekNum;

  if (typeof selectedWeekId === "string" && selectedWeekId.includes("-")) {
    [year, weekNum] = selectedWeekId.split("-").map(Number);
  } else {
    weekNum = Number(selectedWeekId);
    const taskInWeek = tasks.find(t => t.week_id === selectedWeekId);
    year = taskInWeek 
      ? new Date(taskInWeek.task_date).getFullYear()
      : new Date().getFullYear();
  }

  if (isNaN(year) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
    console.error("Invalid weekId:", selectedWeekId);
    return [];
  }

  // Find Thursday of the week (ISO week year is determined by Thursday)
  let tempDate = new Date(year, 0, 4); // Jan 4 of the year
  tempDate.setDate(tempDate.getDate() + 3); // Move to Thursday (Jan 7 at latest)

  // Adjust back to the Thursday of week 1
  const thursdayOfWeek1 = new Date(tempDate);
  thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));

  // Calculate Thursday of the target week
  const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

  // The ISO week year is the year of this Thursday
  const isoYear = thursdayOfTargetWeek.getFullYear();

  // Monday is 3 days before Thursday
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
        // Accept both "2026-01" and old "1"
        const taskWeek = task.week_id;
        const matchesWeek =
          taskWeek === selectedWeekId ||
          (typeof taskWeek === "number" && Number(taskWeek) === parseInt(selectedWeekId.split("-")[1])) ||
          (typeof taskWeek === "string" && taskWeek === selectedWeekId.split("-")[1]);

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

  const filteredEmployees = employees.filter((emp) =>
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleNode = (id) => {
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const EmployeeNode = ({ emp, level = 0 }) => {
    const hasChildren = emp.children && emp.children.length > 0;
    const isOpen = openNodes[emp.employee_id] || false;

    return (
      <>
        <li className={selectedEmployee === emp.employee_id ? "supervisor-plan-active" : ""}>
          {hasChildren ? (
            <span onClick={(e) => { e.stopPropagation(); toggleNode(emp.employee_id); }} style={{ fontSize: "12px" }}>
              {isOpen ? "▼" : "▶"}
            </span>
          ) : (
            <span style={{ width: "12px" }}></span>
          )}
          <span onClick={() => setSelectedEmployee(emp.employee_id)} style={{ flex: 1 }}>
            {emp.employee_name}
          </span>
        </li>

        {hasChildren && isOpen && emp.children.map((child) => (
          <EmployeeNode key={child.employee_id} emp={child} level={level + 1} />
        ))}
      </>
    );
  };

  return (
    <div className="supervisor-plan-wrapper">
      <Modal
        isVisible={alertModal.isVisible}
        onClose={() => setAlertModal({ isVisible: false, message: "" })}
        buttons={[
          {
            label: "OK",
            onClick: () => setAlertModal({ isVisible: false, message: "" }),
          },
        ]}
      >
        <p>{alertModal.message}</p>
      </Modal>

      <div className="supervisor-plan-employee-list">
        <h3>Employees</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search employees by name"
          className="supervisor-plan-search-bar"
          style={{
            padding: "8px",
            fontSize: "10px",
            
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loadingEmployees || loadingHolidays || loadingLeaves ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees under your hierarchy.</p>
        ) : (
          <ul className="supervisor-plan-employee-scroll">
  {employees.map((root) => (
    <EmployeeNode key={root.employee_id} emp={root} level={0} />
  ))}
</ul>

        )}
      </div>
      <div className="supervisor-plan-task-details">
        {loadingTasks || loadingProjects || loadingLeaves ? (
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
              <span className="supervisor-plan-week-label">
                {formatWeekId(selectedWeekId)}
              </span>
              <button
                className="supervisor-plan-nav-button"
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= weekIds.length - 1}
              >
                &gt;
              </button>
            </div>
            <div className="supervisor-plan-tasks-container">
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
                  <div key={dateStr} className="supervisor-plan-day-group">
                    <div className="supervisor-plan-day-header">
                      <span
                        className={dateStyle.className}
                        title={dateStyle.tooltip}
                      >
                        {dateDisplay}
                      </span>
                    </div>
                    {dayTasks.length === 0 ? (
                      <p className="supervisor-plan-no-tasks">
                        No tasks assigned for this day.
                      </p>
                    ) : (
                      dayTasks.map((task) => {
                        const editable = isTaskEditable(task.task_date);
                        const taskDateStyle = getTaskDateStyle(
                          task.task_date,
                          task.employee_id
                        );
                        const effectiveReviewStatus =
                          pendingReviewChanges[task.task_id] ||
                          task.sup_review_status;
  //                    const isFrozen =
  // task.sup_review_status === "suspended_review" ||
  // reworkFrozenTasks[task.task_id];

// const hierarchyFrozen = !canEditByHierarchy(task.employee_id);

// const isFrozen =
//   hierarchyFrozen ||
//   task.sup_review_status === "suspended_review" ||
//   reworkFrozenTasks[task.task_id];
const hierarchyFrozen = !canEditByHierarchy(task.employee_id);

// Freeze ONLY if backend-saved status is re-work
const reworkFrozenFromDB =
  savedSupStatus[task.task_id] === "re-work";

const isFrozen =
  hierarchyFrozen ||
  task.sup_review_status === "suspended_review" ||
  reworkFrozenFromDB;



                          
                        const showReviewSelect =
                          task.sup_review_status === "pending" &&
                          !pendingReviewChanges[task.task_id];

                        return (
                          <div
                            key={task.task_id}
                            className={`supervisor-plan-task-card ${
                              !editable || isFrozen
                                ? "supervisor-plan-task-frozen"
                                : ""
                            }`}
                          >
                            <div className="supervisor-plan-task-header">
                              <div className="supervisor-plan-task-title">
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
                              <div className="supervisor-plan-task-meta">
                                {effectiveReviewStatus !== "pending" && (
                                  <span className="supervisor-plan-status-icon">
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
                                <div className="supervisor-plan-project-circle-wrapper">
                                  <span className="supervisor-plan-project-circle">
                                    {task.project_id}
                                  </span>
                                  <div className="supervisor-plan-tooltip">
                                    {task.project_name}
                                  </div>
                                </div>
                                <div className="supervisor-plan-status-dot-wrapper">
                                  <span
                                    className="supervisor-plan-status-dot"
                                    style={{
                                      backgroundColor: statusColor(
                                        task.emp_status
                                      ),
                                    }}
                                  ></span>
                                  <div className="supervisor-plan-tooltip">
                                    {statusLabel(task.emp_status)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="supervisor-plan-task-body">
                              <p>
                                <strong>Emp-Update:</strong>{" "}
                                {task.emp_comment || "-"}
                              </p>
                            </div>
                            {isFrozen && (
                              <div className="supervisor-plan-frozen-message">
                                This task is suspended and frozen. No edits
                                allowed.
                              </div>
                            )}
                            <div className="supervisor-plan-edit-section">
                              <label>
                                Project:
                                <select
                                  value={task.project_id || ""}
                                  onChange={(e) =>
                                    updateTaskField(
                                      task.task_id,
                                      "project",
                                      e.target.value
                                    )
                                  }
                                  disabled={!editable || isFrozen}
                                >
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
                                  onChange={(e) =>
                                    updateTaskField(
                                      task.task_id,
                                      "sup_status",
                                      e.target.value
                                    )
                                  }
                                  disabled={!editable || isFrozen}
                                >
                                  <option value="completed">Completed</option>
                                  <option value="add on">Add On</option>
                                  <option value="re-work">Re-work</option>
                                  <option value="incomplete">Incomplete</option>
                                </select>
                              </label>
                              <label className="supervisor-admin-feedback-label">
                                Feedback:
                                <div className="supervisor-admin-feedback-wrapper">
                                  <input
                                    type="text"
                                    value={
                                      liveComments[task.task_id] ??
                                      task.sup_comment ??
                                      ""
                                    }
                                    onChange={(e) => {
                                      const text = e.target.value;
                                      setLiveComments((prev) => ({
                                        ...prev,
                                        [task.task_id]: text,
                                      }));
                                      updateTaskField(
                                        task.task_id,
                                        "sup_comment",
                                        text
                                      );
                                    }}
                                    placeholder="Add comment"
                                    disabled={isFrozen}
                                    className="supervisor-admin-feedback-input"
                                  />

                                  <button
                                    type="button"
                                    className={`supervisor-admin-mic-button ${
                                      listeningTaskId === task.task_id
                                        ? "listening"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      listeningTaskId === task.task_id
                                        ? stopListening()
                                        : startListening(task.task_id)
                                    }
                                    disabled={isFrozen}
                                  >
                                    {listeningTaskId === task.task_id ? (
                                      <MdMicOff />
                                    ) : (
                                      <MdMic />
                                    )}
                                  </button>
                                </div>
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
                                    onChange={(e) =>
                                      handleReviewChange(
                                        task.task_id,
                                        e.target.value
                                      )
                                    }
                                    disabled={!editable || isFrozen}
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
                                    onChange={(e) =>
                                      updateTaskField(
                                        task.task_id,
                                        "replacement_task",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter updated task"
                                    disabled={!editable || isFrozen}
                                  />
                                </label>
                              )}
                              {effectiveReviewStatus !== "pending" && (
                                <label>
                                  Rating:
                                  <div className="supervisor-plan-star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        className={`supervisor-plan-star ${
                                          task.star_rating >= star
                                            ? "filled"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          editable &&
                                          !isFrozen &&
                                          updateTaskField(
                                            task.task_id,
                                            "star_rating",
                                            star
                                          )
                                        }
                                        style={{
                                          cursor:
                                            editable && !isFrozen
                                              ? "pointer"
                                              : "not-allowed",
                                        }}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </label>
                              )}
                              <button
  className="supervisor-plan-update-task-button"
  onClick={() => saveTaskField(task.task_id)}
  disabled={!editable || isFrozen}
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

export default SupervisorPlanViewer;