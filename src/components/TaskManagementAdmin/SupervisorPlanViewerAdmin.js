// // import React, { useState, useEffect, useRef } from "react";
// // import { MdMic, MdMicOff } from "react-icons/md";
// // import axios from "axios";
// // import {
// //   getISOWeek,
// //   startOfISOWeek,
// //   endOfISOWeek,
// //   format,
// //   parseISO,
// //   addDays,
// // } from "date-fns";
// // import Modal from "../Modal/Modal";
// // import "./SupervisorPlanViewerAdmin.css";

// // const SupervisorPlanViewerAdmin = () => {
// //   const [supervisorId, setSupervisorId] = useState(null);
// //   const [employees, setEmployees] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [tasks, setTasks] = useState([]);
// //   const [projects, setProjects] = useState({});
// //   const [holidays, setHolidays] = useState([]);
// //   const [approvedLeaves, setApprovedLeaves] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [selectedWeekId, setSelectedWeekId] = useState(null);
// //   const [loadingEmployees, setLoadingEmployees] = useState(false);
// //   const [loadingTasks, setLoadingTasks] = useState(false);
// //   const [loadingProjects, setLoadingProjects] = useState(false);
// //   const [loadingHolidays, setLoadingHolidays] = useState(false);
// //   const [loadingLeaves, setLoadingLeaves] = useState(false);
// //   const [error, setError] = useState(null);

// //   const [reworkFrozenTasks, setReworkFrozenTasks] = useState({});

// //   const [alertModal, setAlertModal] = useState({
// //     isVisible: false,
// //     message: "",
// //   });

// //   const [configModal, setConfigModal] = useState({
// //     isVisible: false,
// //     freezeDaysSupervisor: "",
// //     freezeDaysEmployee: "",
// //   });
// //   const [loadingConfig, setLoadingConfig] = useState(false);
// //   const [pendingReviewChanges, setPendingReviewChanges] = useState({});

// //   const showAlert = (message) => {
// //     setAlertModal({ isVisible: true, message });
// //     setTimeout(() => closeAlert(), 5000);
// //   };

// //   const closeAlert = () => {
// //     setAlertModal({ isVisible: false, message: "" });
// //   };

// //   const formatWeekId = (weekId) => {
// //     if (weekId === null) return "N/A";
// //     const currentYear = new Date().getFullYear();
// //     const startDate = startOfISOWeek(new Date(currentYear, 0, 1));
// //     const weekStart = new Date(
// //       startDate.getTime() + (weekId - 1) * 7 * 24 * 60 * 60 * 1000
// //     );
// //     const weekEnd = endOfISOWeek(weekStart);
// //     const formattedStart = format(weekStart, "MMM d, yyyy");
// //     const formattedEnd = format(weekEnd, "MMM d, yyyy");
// //     return `Week ${weekId} (${formattedStart} - ${formattedEnd})`;
// //   };

// //   const getWeekIdForDate = (date) => {
// //     const taskDate = new Date(date);
// //     if (isNaN(taskDate.getTime())) return null;
// //     return getISOWeek(taskDate);
// //   };

// //   const recognitionRef = useRef(null);
// //   const [listeningTaskId, setListeningTaskId] = useState(null);
// //   const [liveComments, setLiveComments] = useState({});
// //   const SpeechRecognition =
// //     window.SpeechRecognition || window.webkitSpeechRecognition;

// //   const startListening = (taskId) => {
// //     if (!SpeechRecognition) {
// //       showAlert("Speech Recognition is not supported.");
// //       return;
// //     }

// //     if (recognitionRef.current) {
// //       try {
// //         recognitionRef.current.stop();
// //       } catch (e) {}
// //       recognitionRef.current = null;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognitionRef.current = recognition;

// //     recognition.continuous = true;
// //     recognition.interimResults = true;
// //     recognition.lang = "en-US";

// //     setListeningTaskId(taskId);

// //     recognition.start();

// //     let finalTranscript = "";

// //     recognition.onresult = (event) => {
// //       let interim = "";

// //       for (let i = 0; i < event.results.length; i++) {
// //         if (event.results[i].isFinal) {
// //           finalTranscript += event.results[i][0].transcript + " ";
// //         } else {
// //           interim += event.results[i][0].transcript;
// //         }
// //       }

// //       const existing =
// //         liveComments[taskId] ||
// //         tasks.find((t) => t.task_id === taskId)?.sup_comment ||
// //         "";

// //       const combined = (existing + " " + finalTranscript + interim).trim();

// //       setLiveComments((prev) => ({ ...prev, [taskId]: combined }));
// //       updateTaskField(taskId, "sup_comment", combined);
// //     };

// //     recognition.onend = () => {
// //       if (listeningTaskId === taskId) {
// //         try {
// //           recognition.start();
// //         } catch (e) {}
// //       }
// //     };

// //     recognition.onerror = (e) => {
// //       console.warn("Speech error:", e.error);
// //       if (e.error === "no-speech" || e.error === "audio-capture") return;

// //       setListeningTaskId(null);
// //     };
// //   };
// //   const stopListening = () => {
// //     if (recognitionRef.current) {
// //       try {
// //         recognitionRef.current.stop();
// //       } catch (e) {}
// //     }
// //     recognitionRef.current = null;
// //     setListeningTaskId(null);
// //   };

// //   useEffect(() => {
// //     const data = localStorage.getItem("dashboardData");
// //     if (data) {
// //       try {
// //         const parsed = JSON.parse(data);
// //         if (parsed.employeeId) {
// //           setSupervisorId(String(parsed.employeeId));
// //         } else {
// //           setError(
// //             "No employeeId found in dashboardData. Please log in again."
// //           );
// //         }
// //       } catch (e) {
// //         setError("Failed to parse dashboardData. Please log in again.");
// //       }
// //     } else {
// //       setError("No dashboardData found in localStorage. Please log in again.");
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (!supervisorId) return;

// //     const fetchEmployees = async () => {
// //       setLoadingEmployees(true);
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         const empData = Array.isArray(response.data.employees)
// //           ? response.data.employees.map((emp) => ({
// //               ...emp,
// //               employee_id: emp.employee_id?.trim().toUpperCase(),
// //             }))
// //           : [];
// //         if (empData.length === 0) {
// //           setError("No active employees available.");
// //         } else {
// //           setEmployees(empData);
// //           setSelectedEmployee(empData[0]?.employee_id || null);
// //           setError(null);
// //         }
// //       } catch (err) {
// //         const errorMessage = err.response
// //           ? `Error ${err.response.status}: ${
// //               err.response.data?.error || err.response.statusText
// //             }`
// //           : err.code === "ECONNABORTED"
// //           ? "Request timed out: Unable to connect to server"
// //           : `Network error: ${err.message}`;
// //         setError(errorMessage);
// //         setEmployees([]);
// //       } finally {
// //         setLoadingEmployees(false);
// //       }
// //     };

// //     const fetchHolidays = async () => {
// //       setLoadingHolidays(true);
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/holidays/all`,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         const holidayData = Array.isArray(response.data.holidays)
// //           ? response.data.holidays.map((holiday) => holiday.date)
// //           : [];
// //         setHolidays(holidayData);
// //       } catch (err) {
// //         setHolidays([]);
// //       } finally {
// //         setLoadingHolidays(false);
// //       }
// //     };

// //     const fetchApprovedLeaves = async () => {
// //       setLoadingLeaves(true);
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BACKEND_URL}/admin/leave`,
// //           {
// //             params: { status: "Approved" },
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         const leaveData = Array.isArray(response.data.data)
// //           ? response.data.data.map((leave) => ({
// //               employee_id: leave.employee_id?.trim().toUpperCase(),
// //               start_date: leave.start_date,
// //               end_date: leave.end_date,
// //               h_f_day: leave.H_F_day,
// //             }))
// //           : [];
// //         setApprovedLeaves(leaveData);
// //       } catch (err) {
// //         const errorMessage = err.response
// //           ? `Error ${err.response.status}: ${
// //               err.response.data?.error || err.response.statusText
// //             }`
// //           : err.code === "ECONNABORTED"
// //           ? "Request timed out: Unable to connect to server"
// //           : `Network error: ${err.message}`;
// //         setError(errorMessage);
// //         setApprovedLeaves([]);
// //       } finally {
// //         setLoadingLeaves(false);
// //       }
// //     };

// //     fetchEmployees();
// //     fetchHolidays();
// //     fetchApprovedLeaves();
// //   }, [supervisorId]);

// //   useEffect(() => {
// //     if (!supervisorId) return;

// //     const fetchTasks = async () => {
// //       setLoadingTasks(true);
// //       try {
// //         const res = await axios.get(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );

// //         const validStatuses = [
// //           "not started",
// //           "working",
// //           "completed",
// //           "suspended",
// //         ];
// //         const taskData =
// //           res.data.success && Array.isArray(res.data.data)
// //             ? res.data.data.map((task) => ({
// //                 ...task,
// //                 employee_id: task.employee_id?.trim().toUpperCase(),
// //                 emp_status: validStatuses.includes(task.emp_status)
// //                   ? task.emp_status
// //                   : "not started",
// //                 week_id: Number(task.week_id),
// //                 project_id: task.project_id,
// //                 project_name: task.project_name,
// //               }))
// //             : [];

// //         // 🔹 Mark all backend re-work tasks as frozen
// //         const initialReworkFrozen = {};
// //         taskData.forEach((task) => {
// //           if (task.sup_status === "re-work") {
// //             initialReworkFrozen[task.task_id] = true;
// //           }
// //         });
// //         setReworkFrozenTasks(initialReworkFrozen);

// //         setTasks(taskData);

// //         if (taskData.length > 0) {
// //           const weekIds = [
// //             ...new Set(taskData.map((task) => task.week_id)),
// //           ].sort((a, b) => a - b);
// //           setSelectedWeekId(weekIds[weekIds.length - 1] || null);
// //         } else {
// //           setSelectedWeekId(null);
// //         }
// //         setError(null);
// //       } catch (err) {
// //         const errorMessage = err.response
// //           ? `Error ${err.response.status}: ${
// //               err.response.data?.error || err.response.statusText
// //             }`
// //           : err.code === "ECONNABORTED"
// //           ? "Request timed out: Unable to connect to server"
// //           : `Network error: ${err.message}`;
// //         setError(errorMessage);
// //         setTasks([]);
// //       } finally {
// //         setLoadingTasks(false);
// //       }
// //     };

// //     fetchTasks();
// //   }, [supervisorId]);

// //   useEffect(() => {
// //     if (!selectedEmployee) return;

// //     const fetchProjects = async () => {
// //       setLoadingProjects(true);
// //       try {
// //         const response = await axios.get(
// //           `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`,
// //           {
// //             params: { employeeId: selectedEmployee },
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         const newProjects = {};
// //         (response.data.projects || []).forEach((project) => {
// //           newProjects[project.id] = project.project;
// //         });
// //         setProjects(newProjects);
// //         setError(null);
// //       } catch (err) {
// //         const errorMessage = err.response
// //           ? `Error ${err.response.status}: ${
// //               err.response.data?.error || err.response.statusText
// //             }`
// //           : err.code === "ECONNABORTED"
// //           ? "Request timed out: Unable to connect to server"
// //           : `Network error: ${err.message}`;
// //         setError(errorMessage);
// //         setProjects({});
// //       } finally {
// //         setLoadingProjects(false);
// //       }
// //     };

// //     fetchProjects();
// //   }, [selectedEmployee]);

// //   const fetchConfig = async () => {
// //     setLoadingConfig(true);
// //     try {
// //       const response = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/config`,
// //         {
// //           withCredentials: true,
// //           headers: {
// //             "x-employee-id": supervisorId,
// //             "x-api-key": process.env.REACT_APP_API_KEY || "",
// //           },
// //           timeout: 10000,
// //         }
// //       );
// //       const configData = response.data.data || [];
// //       const freezeDaysSupervisor =
// //         configData.find((item) => item.key === "freeze_days_supervisor")
// //           ?.value || "";
// //       const freezeDaysEmployee =
// //         configData.find((item) => item.key === "freeze_days_employee")?.value ||
// //         "";
// //       setConfigModal({
// //         isVisible: true,
// //         freezeDaysSupervisor,
// //         freezeDaysEmployee,
// //       });
// //       setError(null);
// //     } catch (err) {
// //       const errorMessage = err.response
// //         ? `Error ${err.response.status}: ${
// //             err.response.data?.error || err.response.statusText
// //           }`
// //         : err.code === "ECONNABORTED"
// //         ? "Request timed out: Unable to connect to server"
// //         : `Network error: ${err.message}`;
// //       setError(errorMessage);
// //       setConfigModal({
// //         isVisible: true,
// //         freezeDaysSupervisor: "",
// //         freezeDaysEmployee: "",
// //       });
// //     } finally {
// //       setLoadingConfig(false);
// //     }
// //   };

// //   const updateConfig = async () => {
// //     setLoadingConfig(true);
// //     try {
// //       const { freezeDaysSupervisor, freezeDaysEmployee } = configModal;
// //       if (
// //         !/^\d+$/.test(freezeDaysSupervisor) ||
// //         !/^\d+$/.test(freezeDaysEmployee)
// //       ) {
// //         showAlert("Freeze days must be positive integers.");
// //         return;
// //       }
// //       await Promise.all([
// //         axios.put(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
// //           { key: "freeze_days_supervisor", value: freezeDaysSupervisor },
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         ),
// //         axios.put(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
// //           { key: "freeze_days_employee", value: freezeDaysEmployee },
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         ),
// //       ]);
// //       showAlert("Configuration updated successfully");
// //       setConfigModal({ ...configModal, isVisible: false });
// //     } catch (err) {
// //       const errorMessage = err.response
// //         ? `Error ${err.response.status}: ${
// //             err.response.data?.error || err.response.statusText
// //           }`
// //         : err.code === "ECONNABORTED"
// //         ? "Request timed out: Unable to connect to server"
// //         : `Network error: ${err.message}`;
// //       showAlert(`Failed to update configuration: ${errorMessage}.`);
// //       setConfigModal({ ...configModal, isVisible: false });
// //     } finally {
// //       setLoadingConfig(false);
// //     }
// //   };

// //   const updateTaskField = (taskId, field, value) => {
// //     setTasks((prev) =>
// //       prev.map((task) => {
// //         if (task.task_id === taskId) {
// //           if (field === "project") {
// //             const selectedProject = Object.entries(projects).find(
// //               ([id]) => id === value
// //             );
// //             return {
// //               ...task,
// //               project_id: value,
// //               project_name: selectedProject
// //                 ? selectedProject[1]
// //                 : task.project_name,
// //             };
// //           }
// //           return { ...task, [field]: value };
// //         }
// //         return task;
// //       })
// //     );
// //   };

// //   const handleReviewChange = (taskId, value) => {
// //     if (value === "pending") {
// //       setPendingReviewChanges((prev) => {
// //         const newPrev = { ...prev };
// //         delete newPrev[taskId];
// //         return newPrev;
// //       });
// //     } else {
// //       setPendingReviewChanges((prev) => ({ ...prev, [taskId]: value }));
// //     }
// //   };

// //   const saveTaskField = async (taskId) => {
// //     const task = tasks.find((t) => t.task_id === taskId);
// //     if (!task) {
// //       console.error(`Task with task_id ${taskId} not found`);
// //       showAlert("Task not found");
// //       return;
// //     }

// //     if (task.sup_review_status === "suspended_review") {
// //       showAlert("This task is suspended and cannot be updated.");
// //       return;
// //     }

// //     try {
// //       const effectiveReviewStatus =
// //         pendingReviewChanges[taskId] || task.sup_review_status;
// //       const updateData = {
// //         sup_status: task.sup_status || "incomplete",
// //         sup_comment: task.sup_comment || "",
// //         sup_review_status: effectiveReviewStatus || "pending",
// //         replacement_task: task.replacement_task || null,
// //         star_rating: task.star_rating || 0,
// //         project_id: task.project_id,
// //         project_name: task.project_name,
// //       };

// //       if (task.sup_status === "re-work") {
// //         const taskDate = new Date(task.task_date || new Date());
// //         if (isNaN(taskDate.getTime())) {
// //           taskDate = new Date();
// //         }
// //         taskDate.setHours(0, 0, 0, 0);
// //         const nextDay = new Date(taskDate);
// //         nextDay.setDate(taskDate.getDate() + 1);
// //         const nextDayString = nextDay.toLocaleDateString("en-CA");
// //         const nextDayWeekId = getWeekIdForDate(nextDay);

// //         const newTaskName = task.replacement_task || task.task_name;

// //         const newTaskData = {
// //           week_id: nextDayWeekId,
// //           task_date: nextDayString,
// //           project_id: task.project_id,
// //           project_name: task.project_name,
// //           task_name: newTaskName,
// //           employee_id: task.employee_id,
// //           emp_status: "not started",
// //           sup_status: "incomplete",
// //           emp_comment: null,
// //           sup_comment: null,
// //           sup_review_status: "pending",
// //           star_rating: 0,
// //           parent_task_id: task.task_id,
// //         };

// //         const response = await axios.post(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
// //           newTaskData,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );

// //         updateData.sup_status = "re-work";
// //         await axios.put(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
// //           updateData,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         // freeze this task AFTER successful re-work update
// //         setReworkFrozenTasks((prev) => ({
// //           ...prev,
// //           [taskId]: true,
// //         }));

// //         showAlert(response.data.message || "New task created successfully");

// //         if (response.data.newTask) {
// //           const newTask = {
// //             ...response.data.newTask,
// //             employee_name:
// //               employees.find(
// //                 (emp) => emp.employee_id === response.data.newTask.employee_id
// //               )?.employee_name || "Unknown",
// //             employee_id: response.data.newTask.employee_id
// //               ?.trim()
// //               .toUpperCase(),
// //             emp_status: response.data.newTask.emp_status || "not started",
// //             week_id: Number(response.data.newTask.week_id),
// //             project_id: response.data.newTask.project_id,
// //             project_name: response.data.newTask.project_name,
// //           };
// //           setTasks((prev) => [...prev, newTask]);
// //           const newTaskWeek = newTask.week_id;
// //           if (newTaskWeek && newTaskWeek !== selectedWeekId) {
// //             setSelectedWeekId(newTaskWeek);
// //           }
// //           if (newTask.employee_id !== selectedEmployee) {
// //             setSelectedEmployee(newTask.employee_id);
// //           }
// //         }
// //       } else {
// //         await axios.put(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
// //           updateData,
// //           {
// //             withCredentials: true,
// //             headers: {
// //               "x-employee-id": supervisorId,
// //               "x-api-key": process.env.REACT_APP_API_KEY || "",
// //             },
// //             timeout: 10000,
// //           }
// //         );
// //         // freeze this task AFTER successful re-work update
// //         setReworkFrozenTasks((prev) => ({
// //           ...prev,
// //           [taskId]: true,
// //         }));

// //         showAlert("Task updated successfully");
// //       }

// //       setPendingReviewChanges((prev) => {
// //         const newPrev = { ...prev };
// //         delete newPrev[taskId];
// //         return newPrev;
// //       });

// //       const res = await axios.get(
// //         `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
// //         {
// //           withCredentials: true,
// //           headers: {
// //             "x-employee-id": supervisorId,
// //             "x-api-key": process.env.REACT_APP_API_KEY || "",
// //           },
// //           timeout: 10000,
// //         }
// //       );
// //       const validStatuses = [
// //         "not started",
// //         "working",
// //         "completed",
// //         "suspended",
// //       ];
// //       const taskData =
// //         res.data.success && Array.isArray(res.data.data)
// //           ? res.data.data.map((task) => ({
// //               ...task,
// //               employee_id: task.employee_id?.trim().toUpperCase(),
// //               emp_status: validStatuses.includes(task.emp_status)
// //                 ? task.emp_status
// //                 : "not started",
// //               week_id: Number(task.week_id),
// //               project_id: task.project_id,
// //               project_name: task.project_name,
// //             }))
// //           : [];
// //       setTasks(taskData);
// //     } catch (err) {
// //       const errorMessage = err.response
// //         ? `Error ${err.response.status}: ${
// //             err.response.data?.error || err.response.statusText
// //           }`
// //         : err.code === "ECONNABORTED"
// //         ? "Request timed out: Unable to connect to server"
// //         : `Network error: ${err.message}`;
// //       showAlert(`Failed to update task: ${errorMessage}`);
// //     }
// //   };

// //   const statusColor = (status) => {
// //     switch (status) {
// //       case "completed":
// //         return "#28a745";
// //       case "working":
// //         return "#3770ecff";
// //       case "not started":
// //         return "#888";
// //       case "suspended":
// //         return "#dc3545";
// //       default:
// //         return "#007bff";
// //     }
// //   };

// //   const statusLabel = (status) => {
// //     switch (status) {
// //       case "completed":
// //         return "Completed";
// //       case "working":
// //         return "Working";
// //       case "not started":
// //         return "Not Started";
// //       case "suspended":
// //         return "Suspended";
// //       default:
// //         return "Unknown";
// //     }
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "N/A";
// //     const date = new Date(dateString);
// //     return date.toLocaleString("en-US", {
// //       timeZone: "Asia/Kolkata",
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     });
// //   };

// //   const getTaskDateStyle = (dateString, employeeId) => {
// //     if (!dateString) {
// //       return {
// //         className:
// //           "supervisor-plan-task-date supervisor-plan-task-date-regular",
// //         tooltip: "N/A",
// //       };
// //     }
// //     const taskDate = new Date(dateString);
// //     taskDate.setHours(0, 0, 0, 0);
// //     const isApprovedLeave = approvedLeaves.some((leave) => {
// //       if (leave.employee_id !== employeeId) return false;
// //       const startDate = new Date(leave.start_date);
// //       const endDate = new Date(leave.end_date);
// //       startDate.setHours(0, 0, 0, 0);
// //       endDate.setHours(0, 0, 0, 0);
// //       const isHalfDay = leave.h_f_day.toLowerCase().includes("half");
// //       if (isHalfDay) {
// //         return taskDate.getTime() === startDate.getTime();
// //       }
// //       return (
// //         taskDate.getTime() >= startDate.getTime() &&
// //         taskDate.getTime() <= endDate.getTime()
// //       );
// //     });
// //     const isSunday = taskDate.getDay() === 0;
// //     const isHoliday = holidays.some((holiday) => {
// //       const holidayDate = new Date(holiday);
// //       holidayDate.setHours(0, 0, 0, 0);
// //       return taskDate.getTime() === holidayDate.getTime();
// //     });
// //     if (isApprovedLeave) {
// //       return {
// //         className: "supervisor-plan-task-date supervisor-plan-task-date-leave",
// //         tooltip: "Leave",
// //       };
// //     }
// //     if (isHoliday) {
// //       return {
// //         className:
// //           "supervisor-plan-task-date supervisor-plan-task-date-holiday",
// //         tooltip: "Holiday",
// //       };
// //     }
// //     if (isSunday) {
// //       return {
// //         className: "supervisor-plan-task-date supervisor-plan-task-date-sunday",
// //         tooltip: "Sunday",
// //       };
// //     }
// //     return {
// //       className: "supervisor-plan-task-date supervisor-plan-task-date-regular",
// //       tooltip: formatDate(dateString),
// //     };
// //   };

// //   const getReviewStatusColor = (status) => {
// //     switch (status) {
// //       case "approved":
// //         return "#28a745";
// //       case "struck":
// //         return "#ffc107";
// //       case "suspended_review":
// //         return "#dc3545";
// //       default:
// //         return "#6c757d";
// //     }
// //   };

// //   const weekIds = [...new Set(tasks.map((task) => task.week_id))].sort(
// //     (a, b) => a - b
// //   );
// //   const currentWeekIndex = weekIds.indexOf(selectedWeekId);

// //   const goToPreviousWeek = () => {
// //     if (currentWeekIndex > 0) {
// //       setSelectedWeekId(weekIds[currentWeekIndex - 1]);
// //     }
// //   };

// //   const goToNextWeek = () => {
// //     if (currentWeekIndex < weekIds.length - 1) {
// //       setSelectedWeekId(weekIds[currentWeekIndex + 1]);
// //     }
// //   };

// //   const filteredEmployees = employees.filter((emp) =>
// //     emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   const generateWeekDays = () => {
// //     if (!selectedWeekId) return [];
// //     const currentYear = new Date().getFullYear();
// //     const weekStartDate = startOfISOWeek(new Date(currentYear, 0, 1));
// //     const adjustedStart = addDays(weekStartDate, (selectedWeekId - 1) * 7);
// //     const days = [];
// //     for (let i = 0; i < 7; i++) {
// //       const date = addDays(adjustedStart, i);
// //       const dateStr = format(date, "yyyy-MM-dd");
// //       const dateDisplay = format(date, "MMM d");
// //       days.push({ dateStr, dateDisplay });
// //     }
// //     return days;
// //   };

// //   const weekDays = generateWeekDays();

// //   const getTasksByDate = () => {
// //     const tasksByDate = {};
// //     weekDays.forEach(({ dateStr }) => {
// //       tasksByDate[dateStr] = [];
// //     });
// //     if (selectedEmployee && selectedWeekId) {
// //       tasks.forEach((task) => {
// //         if (
// //           task.employee_id === selectedEmployee &&
// //           task.week_id === selectedWeekId
// //         ) {
// //           const taskDateStr = format(parseISO(task.task_date), "yyyy-MM-dd");
// //           if (tasksByDate[taskDateStr]) {
// //             tasksByDate[taskDateStr].push(task);
// //           }
// //         }
// //       });
// //     }
// //     return tasksByDate;
// //   };

// //   const tasksByDate = getTasksByDate();

// //   if (!supervisorId) {
// //     return (
// //       <div className="supervisor-plan-admin-wrapper">
// //         <div className="supervisor-plan-admin-error-message">
// //           {error || "Supervisor ID is missing. Please "}
// //           <a href="/login">log in again</a>.
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="supervisor-plan-admin-wrapper">
// //       <Modal
// //         isVisible={alertModal.isVisible}
// //         onClose={closeAlert}
// //         buttons={[{ label: "OK", onClick: closeAlert }]}
// //       >
// //         <p>{alertModal.message}</p>
// //       </Modal>
// //       {configModal.isVisible && (
// //         <div
// //           className="supervisor-plan-admin-modal-overlay"
// //           onClick={() => setConfigModal({ ...configModal, isVisible: false })}
// //         >
// //           <form
// //             className="supervisor-plan-admin-modal"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <h3 className="supervisor-plan-admin-modal-title">
// //               Update Freeze Days
// //             </h3>
// //             <div className="supervisor-plan-admin-config-modal-content">
// //               <div className="supervisor-plan-admin-config-input-group">
// //                 <label className="supervisor-plan-admin-config-label">
// //                   Supervisor Freeze Days
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     value={configModal.freezeDaysSupervisor}
// //                     onChange={(e) =>
// //                       setConfigModal({
// //                         ...configModal,
// //                         freezeDaysSupervisor: e.target.value,
// //                       })
// //                     }
// //                     disabled={loadingConfig}
// //                     className="supervisor-plan-admin-config-input"
// //                   />
// //                 </label>
// //                 <label className="supervisor-plan-admin-config-label">
// //                   Employee Freeze Days
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     value={configModal.freezeDaysEmployee}
// //                     onChange={(e) =>
// //                       setConfigModal({
// //                         ...configModal,
// //                         freezeDaysEmployee: e.target.value,
// //                       })
// //                     }
// //                     disabled={loadingConfig}
// //                     className="supervisor-plan-admin-config-input"
// //                   />
// //                 </label>
// //               </div>
// //             </div>
// //             <div className="supervisor-plan-admin-modal-buttons">
// //               <button
// //                 type="button"
// //                 className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-cancel"
// //                 onClick={() =>
// //                   setConfigModal({ ...configModal, isVisible: false })
// //                 }
// //                 disabled={loadingConfig}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-save"
// //                 onClick={updateConfig}
// //                 disabled={loadingConfig}
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}
// //       <div className="supervisor-plan-admin-header">
// //         <button
// //           className="supervisor-plan-admin-config-button"
// //           onClick={fetchConfig}
// //           disabled={loadingConfig}
// //           style={{ position: "absolute", top: "10px", right: "10px" }}
// //         >
// //           {loadingConfig ? "Loading..." : "Update Freeze Days"}
// //         </button>
// //       </div>
// //       <div className="supervisor-plan-admin-employee-list">
// //         <h3>Employees</h3>
// //         <input
// //           type="text"
// //           value={searchQuery}
// //           onChange={(e) => setSearchQuery(e.target.value)}
// //           placeholder="Search employees by name"
// //           className="supervisor-plan-admin-search-bar"
// //         />
// //         {error && <p style={{ color: "red" }}>{error}</p>}
// //         {loadingEmployees || loadingHolidays || loadingLeaves ? (
// //           <p>Loading employees...</p>
// //         ) : filteredEmployees.length === 0 ? (
// //           <p>No employees match the search criteria.</p>
// //         ) : (
// //           <ul className="supervisor-plan-admin-employee-scroll">
// //             {filteredEmployees.map((emp) => (
// //               <li
// //                 key={emp.employee_id}
// //                 className={
// //                   selectedEmployee === emp.employee_id
// //                     ? "supervisor-plan-admin-active"
// //                     : ""
// //                 }
// //                 onClick={() => setSelectedEmployee(emp.employee_id)}
// //               >
// //                 {emp.employee_name}
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </div>
// //       <div className="supervisor-plan-admin-task-details">
// //         {loadingTasks || loadingProjects ? (
// //           <p>Loading tasks or projects...</p>
// //         ) : selectedEmployee === null ? (
// //           <p>Select an employee to view tasks</p>
// //         ) : weekIds.length === 0 ? (
// //           <p>No tasks assigned for this employee.</p>
// //         ) : (
// //           <>
// //             <div className="supervisor-plan-admin-week-navigation">
// //               <button
// //                 className="supervisor-plan-admin-nav-button"
// //                 onClick={goToPreviousWeek}
// //                 disabled={currentWeekIndex <= 0}
// //               >
// //                 &lt;
// //               </button>
// //               <span className="supervisor-plan-admin-week-label">
// //                 {formatWeekId(selectedWeekId)}
// //               </span>
// //               <button
// //                 className="supervisor-plan-admin-nav-button"
// //                 onClick={goToNextWeek}
// //                 disabled={currentWeekIndex >= weekIds.length - 1}
// //               >
// //                 &gt;
// //               </button>
// //             </div>
// //             <div className="supervisor-plan-admin-tasks-container">
// //               {weekDays.map(({ dateStr, dateDisplay }) => {
// //                 const dayTasks = tasksByDate[dateStr] || [];
// //                 const sampleTaskForStyle = dayTasks[0] || {
// //                   task_date: dateStr,
// //                   employee_id: selectedEmployee,
// //                 };
// //                 const dateStyle = getTaskDateStyle(
// //                   sampleTaskForStyle.task_date,
// //                   selectedEmployee
// //                 );
// //                 return (
// //                   <div
// //                     key={dateStr}
// //                     className="supervisor-plan-admin-day-group"
// //                   >
// //                     <div className="supervisor-plan-admin-day-header">
// //                       <span
// //                         className={dateStyle.className}
// //                         title={dateStyle.tooltip}
// //                       >
// //                         {dateDisplay}
// //                       </span>
// //                     </div>
// //                     {dayTasks.length === 0 ? (
// //                       <p className="supervisor-plan-admin-no-tasks">
// //                         No tasks assigned for this day.
// //                       </p>
// //                     ) : (
// //                       dayTasks.map((task) => {
// //                         const taskDateStyle = getTaskDateStyle(
// //                           task.task_date,
// //                           task.employee_id
// //                         );
// //                         const effectiveReviewStatus =
// //                           pendingReviewChanges[task.task_id] ||
// //                           task.sup_review_status;
// //                         // Freeze tasks that came from backend as re-work or suspended_review
// //                         // const isBackendRework = task.sup_status === "re-work" && !reworkFrozenTasks[task.task_id];
// //                         // Freeze only if:
// //                         // 1. The task is suspended_review
// //                         // 2. The task came from backend as re-work (already saved)
// //                         const isFrozen =
// //                           task.sup_review_status === "suspended_review" ||
// //                           (task.sup_status === "re-work" &&
// //                             reworkFrozenTasks[task.task_id]);

// //                         const showReviewSelect =
// //                           task.sup_review_status === "pending" &&
// //                           !pendingReviewChanges[task.task_id];
// //                         return (
// //                           <div
// //                             key={task.task_id}
// //                             className={`supervisor-plan-admin-task-card ${
// //                               isFrozen
// //                                 ? "supervisor-plan-admin-task-frozen"
// //                                 : ""
// //                             }`}
// //                           >
// //                             <div className="supervisor-plan-admin-task-header">
// //                               <div className="supervisor-plan-admin-task-title">
// //                                 {effectiveReviewStatus === "struck" ? (
// //                                   <>
// //                                     <span
// //                                       style={{
// //                                         textDecoration: "line-through",
// //                                         color: "#a0a0a0",
// //                                       }}
// //                                     >
// //                                       {task.task_name}
// //                                     </span>
// //                                     {task.replacement_task && (
// //                                       <span
// //                                         style={{
// //                                           color: "#007bff",
// //                                           marginLeft: "8px",
// //                                         }}
// //                                       >
// //                                         → {task.replacement_task}
// //                                       </span>
// //                                     )}
// //                                   </>
// //                                 ) : (
// //                                   task.task_name
// //                                 )}
// //                               </div>
// //                               <div className="supervisor-plan-admin-task-meta">
// //                                 {effectiveReviewStatus !== "pending" && (
// //                                   <span className="supervisor-plan-status-icon">
// //                                     {effectiveReviewStatus === "approved" &&
// //                                       "✅"}
// //                                     {effectiveReviewStatus === "struck" && "📝"}
// //                                     {effectiveReviewStatus ===
// //                                       "suspended_review" && "⛔"}
// //                                   </span>
// //                                 )}
// //                                 <span
// //                                   className={taskDateStyle.className}
// //                                   title={taskDateStyle.tooltip}
// //                                 >
// //                                   {formatDate(task.task_date)}
// //                                 </span>
// //                                 <div className="supervisor-plan-admin-project-circle-wrapper">
// //                                   <span className="supervisor-plan-admin-project-circle">
// //                                     {task.project_id || "N/A"}
// //                                   </span>
// //                                   <div className="supervisor-plan-admin-tooltip">
// //                                     {task.project_name || "Unknown"}
// //                                   </div>
// //                                 </div>
// //                                 <div className="supervisor-plan-admin-status-dot-wrapper">
// //                                   <span
// //                                     className="supervisor-plan-admin-status-dot"
// //                                     style={{
// //                                       backgroundColor: statusColor(
// //                                         task.emp_status
// //                                       ),
// //                                     }}
// //                                   ></span>
// //                                   <div className="supervisor-plan-admin-tooltip">
// //                                     {statusLabel(task.emp_status)}
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                             <div className="supervisor-plan-admin-task-body">
// //                               <p>
// //                                 <strong>Emp-Update:</strong>{" "}
// //                                 {task.emp_comment || "-"}
// //                               </p>
// //                             </div>
// //                             {isFrozen && (
// //                               <div className="supervisor-plan-admin-frozen-message">
// //                                 This task is suspended and frozen. No edits
// //                                 allowed.
// //                               </div>
// //                             )}
// //                             <div
// //                               className={`supervisor-plan-admin-edit-section ${
// //                                 isFrozen
// //                                   ? "supervisor-plan-admin-edit-section-disabled"
// //                                   : ""
// //                               }`}
// //                             >
// //                               <label>
// //                                 Project:
// //                                 <select
// //                                   value={task.project_id || ""}
// //                                   onChange={(e) =>
// //                                     updateTaskField(
// //                                       task.task_id,
// //                                       "project",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   disabled={isFrozen}
// //                                 >
// //                                   <option value="">Select Project</option>
// //                                   {Object.entries(projects).map(
// //                                     ([id, name]) => (
// //                                       <option key={id} value={id}>
// //                                         {id} - {name}
// //                                       </option>
// //                                     )
// //                                   )}
// //                                 </select>
// //                               </label>
// //                               <label>
// //                                 Update:
// //                                 <select
// //                                   value={task.sup_status || "incomplete"}
// //                                   onChange={(e) =>
// //                                     updateTaskField(
// //                                       task.task_id,
// //                                       "sup_status",
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   disabled={isFrozen}
// //                                 >
// //                                   <option value="completed">Completed</option>
// //                                   <option value="add on">Add On</option>
// //                                   <option value="re-work">Re-work</option>
// //                                   <option value="incomplete">Incomplete</option>
// //                                 </select>
// //                               </label>
// //                               <label className="supervisor-admin-feedback-label">
// //                                 Feedback:
// //                                 <div className="supervisor-admin-feedback-wrapper">
// //                                   <input
// //                                     type="text"
// //                                     value={
// //                                       liveComments[task.task_id] ??
// //                                       task.sup_comment ??
// //                                       ""
// //                                     }
// //                                     onChange={(e) => {
// //                                       const text = e.target.value;
// //                                       setLiveComments((prev) => ({
// //                                         ...prev,
// //                                         [task.task_id]: text,
// //                                       }));
// //                                       updateTaskField(
// //                                         task.task_id,
// //                                         "sup_comment",
// //                                         text
// //                                       );
// //                                     }}
// //                                     placeholder="Add comment"
// //                                     disabled={isFrozen}
// //                                   />

// //                                   {/* Mic Icon */}
// //                                   <button
// //                                     type="button"
// //                                     className={`supervisor-admin-mic-button ${
// //                                       listeningTaskId === task.task_id
// //                                         ? "listening"
// //                                         : ""
// //                                     }`}
// //                                     onClick={() => {
// //                                       listeningTaskId === task.task_id
// //                                         ? stopListening()
// //                                         : startListening(task.task_id);
// //                                     }}
// //                                   >
// //                                     {listeningTaskId === task.task_id ? (
// //                                       <MdMicOff />
// //                                     ) : (
// //                                       <MdMic />
// //                                     )}
// //                                   </button>
// //                                 </div>
// //                                 {/* {listeningTaskId === task.task_id && (
// //     <div className="supervisor-admin-mic-listening">Listening…</div>
// //   )} */}
// //                               </label>

// //                               {showReviewSelect && (
// //                                 <label>
// //                                   Review:
// //                                   <select
// //                                     value={task.sup_review_status || "pending"}
// //                                     style={{
// //                                       color: getReviewStatusColor(
// //                                         task.sup_review_status
// //                                       ),
// //                                     }}
// //                                     onChange={(e) =>
// //                                       handleReviewChange(
// //                                         task.task_id,
// //                                         e.target.value
// //                                       )
// //                                     }
// //                                     disabled={isFrozen}
// //                                   >
// //                                     <option value="pending">Pending</option>
// //                                     <option value="approved">Approved</option>
// //                                     <option value="struck">Update task</option>
// //                                     <option value="suspended_review">
// //                                       Suspended
// //                                     </option>
// //                                   </select>
// //                                 </label>
// //                               )}
// //                               {effectiveReviewStatus === "struck" && (
// //                                 <label>
// //                                   Updated task:
// //                                   <input
// //                                     type="text"
// //                                     value={task.replacement_task || ""}
// //                                     onChange={(e) =>
// //                                       updateTaskField(
// //                                         task.task_id,
// //                                         "replacement_task",
// //                                         e.target.value
// //                                       )
// //                                     }
// //                                     placeholder="Enter updated task"
// //                                     disabled={isFrozen}
// //                                   />
// //                                 </label>
// //                               )}
// //                               {effectiveReviewStatus !== "pending" && (
// //                                 <label>
// //                                   Rating:
// //                                   <div className="supervisor-plan-admin-star-rating">
// //                                     {[1, 2, 3, 4, 5].map((star) => (
// //                                       <span
// //                                         key={star}
// //                                         className={`supervisor-plan-admin-star ${
// //                                           task.star_rating >= star
// //                                             ? "filled"
// //                                             : ""
// //                                         }`}
// //                                         onClick={() =>
// //                                           !isFrozen &&
// //                                           updateTaskField(
// //                                             task.task_id,
// //                                             "star_rating",
// //                                             star
// //                                           )
// //                                         }
// //                                         style={{
// //                                           cursor: isFrozen
// //                                             ? "not-allowed"
// //                                             : "pointer",
// //                                         }}
// //                                       >
// //                                         ★
// //                                       </span>
// //                                     ))}
// //                                   </div>
// //                                 </label>
// //                               )}
// //                               <button
// //                                 className="supervisor-plan-admin-update-task-button"
// //                                 onClick={() => saveTaskField(task.task_id)}
// //                                 disabled={isFrozen}
// //                               >
// //                                 Update
// //                               </button>
// //                             </div>
// //                           </div>
// //                         );
// //                       })
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SupervisorPlanViewerAdmin;


// import React, { useState, useEffect, useRef } from "react";
// import { MdMic, MdMicOff } from "react-icons/md";
// import axios from "axios";
// import {
//   getISOWeek,
//   startOfISOWeek,
//   endOfISOWeek,
//   format,
//   parseISO,
//   addDays,
// } from "date-fns";
// import Modal from "../Modal/Modal";
// import "./SupervisorPlanViewerAdmin.css";

// const SupervisorPlanViewerAdmin = () => {
//   const [supervisorId, setSupervisorId] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState({});
//   const [holidays, setHolidays] = useState([]);
//   const [approvedLeaves, setApprovedLeaves] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedWeekId, setSelectedWeekId] = useState(null);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   const [loadingTasks, setLoadingTasks] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);
//   const [loadingHolidays, setLoadingHolidays] = useState(false);
//   const [loadingLeaves, setLoadingLeaves] = useState(false);
//   const [error, setError] = useState(null);

//   const [reworkFrozenTasks, setReworkFrozenTasks] = useState({});

//   const [alertModal, setAlertModal] = useState({
//     isVisible: false,
//     message: "",
//   });

//   const [configModal, setConfigModal] = useState({
//     isVisible: false,
//     freezeDaysSupervisor: "",
//     freezeDaysEmployee: "",
//   });
//   const [loadingConfig, setLoadingConfig] = useState(false);
//   const [pendingReviewChanges, setPendingReviewChanges] = useState({});

//   const showAlert = (message) => {
//     setAlertModal({ isVisible: true, message });
//     setTimeout(() => closeAlert(), 5000);
//   };

//   const closeAlert = () => {
//     setAlertModal({ isVisible: false, message: "" });
//   };

//   // Updated: Returns "YYYY-WW" format
//   const getISOWeekNumber = (date) => {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     d.setDate(d.getDate() + 4 - (d.getDay() || 7));
//     const yearStart = new Date(d.getFullYear(), 0, 1);
//     const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
//     return `${d.getFullYear()}-${String(weekNo).padStart(2, "0")}`;
//   };

//   // CHANGED: Now shows "2026-01" instead of "Week 1"
//   const formatWeekId = (weekId) => {
//     if (!weekId) return "N/A";

//     let displayId;

//     if (typeof weekId === "string" && weekId.includes("-")) {
//       displayId = weekId; // Already "2026-01"
//     } else {
//       // Old numeric format: convert to "YYYY-WW"
//       const weekNum = Number(weekId);
//       const taskForWeek = tasks.find(t => t.week_id === weekId);
//       const year = taskForWeek 
//         ? new Date(taskForWeek.task_date).getFullYear()
//         : new Date().getFullYear();
//       displayId = `${year}-${String(weekNum).padStart(2, "0")}`;
//     }

//     return displayId;
//   };

//   const getWeekIdForDate = (date) => {
//     const taskDate = new Date(date);
//     if (isNaN(taskDate.getTime())) return null;
//     return getISOWeekNumber(taskDate);
//   };

//   const recognitionRef = useRef(null);
//   const [listeningTaskId, setListeningTaskId] = useState(null);
//   const [liveComments, setLiveComments] = useState({});
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   const startListening = (taskId) => {
//     if (!SpeechRecognition) {
//       showAlert("Speech Recognition is not supported.");
//       return;
//     }

//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (e) {}
//       recognitionRef.current = null;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;

//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     setListeningTaskId(taskId);

//     recognition.start();

//     let finalTranscript = "";

//     recognition.onresult = (event) => {
//       let interim = "";

//       for (let i = 0; i < event.results.length; i++) {
//         if (event.results[i].isFinal) {
//           finalTranscript += event.results[i][0].transcript + " ";
//         } else {
//           interim += event.results[i][0].transcript;
//         }
//       }

//       const existing =
//         liveComments[taskId] ||
//         tasks.find((t) => t.task_id === taskId)?.sup_comment ||
//         "";

//       const combined = (existing + " " + finalTranscript + interim).trim();

//       setLiveComments((prev) => ({ ...prev, [taskId]: combined }));
//       updateTaskField(taskId, "sup_comment", combined);
//     };

//     recognition.onend = () => {
//       if (listeningTaskId === taskId) {
//         try {
//           recognition.start();
//         } catch (e) {}
//       }
//     };

//     recognition.onerror = (e) => {
//       console.warn("Speech error:", e.error);
//       if (e.error === "no-speech" || e.error === "audio-capture") return;

//       setListeningTaskId(null);
//     };
//   };
//   const stopListening = () => {
//     if (recognitionRef.current) {
//       try {
//         recognitionRef.current.stop();
//       } catch (e) {}
//     }
//     recognitionRef.current = null;
//     setListeningTaskId(null);
//   };

//   useEffect(() => {
//     const data = localStorage.getItem("dashboardData");
//     if (data) {
//       try {
//         const parsed = JSON.parse(data);
//         if (parsed.employeeId) {
//           setSupervisorId(String(parsed.employeeId));
//         } else {
//           setError(
//             "No employeeId found in dashboardData. Please log in again."
//           );
//         }
//       } catch (e) {
//         setError("Failed to parse dashboardData. Please log in again.");
//       }
//     } else {
//       setError("No dashboardData found in localStorage. Please log in again.");
//     }
//   }, []);

//   useEffect(() => {
//     if (!supervisorId) return;

//     const fetchEmployees = async () => {
//       setLoadingEmployees(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/employees/all`,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         const empData = Array.isArray(response.data.employees)
//           ? response.data.employees.map((emp) => ({
//               ...emp,
//               employee_id: emp.employee_id?.trim().toUpperCase(),
//             }))
//           : [];
//         if (empData.length === 0) {
//           setError("No active employees available.");
//         } else {
//           setEmployees(empData);
//           setSelectedEmployee(empData[0]?.employee_id || null);
//           setError(null);
//         }
//       } catch (err) {
//         const errorMessage = err.response
//           ? `Error ${err.response.status}: ${
//               err.response.data?.error || err.response.statusText
//             }`
//           : err.code === "ECONNABORTED"
//           ? "Request timed out: Unable to connect to server"
//           : `Network error: ${err.message}`;
//         setError(errorMessage);
//         setEmployees([]);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };

//     const fetchHolidays = async () => {
//       setLoadingHolidays(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/holidays/all`,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         const holidayData = Array.isArray(response.data.holidays)
//           ? response.data.holidays.map((holiday) => holiday.date)
//           : [];
//         setHolidays(holidayData);
//       } catch (err) {
//         setHolidays([]);
//       } finally {
//         setLoadingHolidays(false);
//       }
//     };

//     const fetchApprovedLeaves = async () => {
//       setLoadingLeaves(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/admin/leave`,
//           {
//             params: { status: "Approved" },
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         const leaveData = Array.isArray(response.data.data)
//           ? response.data.data.map((leave) => ({
//               employee_id: leave.employee_id?.trim().toUpperCase(),
//               start_date: leave.start_date,
//               end_date: leave.end_date,
//               h_f_day: leave.H_F_day,
//             }))
//           : [];
//         setApprovedLeaves(leaveData);
//       } catch (err) {
//         const errorMessage = err.response
//           ? `Error ${err.response.status}: ${
//               err.response.data?.error || err.response.statusText
//             }`
//           : err.code === "ECONNABORTED"
//           ? "Request timed out: Unable to connect to server"
//           : `Network error: ${err.message}`;
//         setError(errorMessage);
//         setApprovedLeaves([]);
//       } finally {
//         setLoadingLeaves(false);
//       }
//     };

//     fetchEmployees();
//     fetchHolidays();
//     fetchApprovedLeaves();
//   }, [supervisorId]);

//   useEffect(() => {
//     if (!supervisorId) return;

//     const fetchTasks = async () => {
//       setLoadingTasks(true);
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );

//         const validStatuses = [
//           "not started",
//           "working",
//           "completed",
//           "suspended",
//         ];
//         const taskData =
//           res.data.success && Array.isArray(res.data.data)
//             ? res.data.data.map((task) => ({
//                 ...task,
//                 employee_id: task.employee_id?.trim().toUpperCase(),
//                 emp_status: validStatuses.includes(task.emp_status)
//                   ? task.emp_status
//                   : "not started",
//                 week_id: task.week_id,
//                 project_id: task.project_id,
//                 project_name: task.project_name,
//               }))
//             : [];

//         const initialReworkFrozen = {};
//         taskData.forEach((task) => {
//           if (task.sup_status === "re-work") {
//             initialReworkFrozen[task.task_id] = true;
//           }
//         });
//         setReworkFrozenTasks(initialReworkFrozen);

//         setTasks(taskData);

//         const uniqueWeekIds = [...new Set(taskData.map((t) => t.week_id))].sort((a, b) => {
//           const getWeekValue = (id) => {
//             if (typeof id === "string" && id.includes("-")) {
//               const [year, week] = id.split("-").map(Number);
//               return year * 100 + week;
//             }
//             return Number(id);
//           };
//           return getWeekValue(a) - getWeekValue(b);
//         });

//         if (uniqueWeekIds.length > 0) {
//           setSelectedWeekId(uniqueWeekIds[uniqueWeekIds.length - 1]);
//         } else {
//           setSelectedWeekId(null);
//         }
//         setError(null);
//       } catch (err) {
//         const errorMessage = err.response
//           ? `Error ${err.response.status}: ${
//               err.response.data?.error || err.response.statusText
//             }`
//           : `Network error: ${err.message}`;
//         setError(errorMessage);
//         setTasks([]);
//       } finally {
//         setLoadingTasks(false);
//       }
//     };

//     fetchTasks();
//   }, [supervisorId]);

//   useEffect(() => {
//     if (!selectedEmployee) return;

//     const fetchProjects = async () => {
//       setLoadingProjects(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`,
//           {
//             params: { employeeId: selectedEmployee },
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         const newProjects = {};
//         (response.data.projects || []).forEach((project) => {
//           newProjects[project.id] = project.project;
//         });
//         setProjects(newProjects);
//         setError(null);
//       } catch (err) {
//         const errorMessage = err.response
//           ? `Error ${err.response.status}: ${
//               err.response.data?.error || err.response.statusText
//             }`
//           : `Network error: ${err.message}`;
//         setError(errorMessage);
//         setProjects({});
//       } finally {
//         setLoadingProjects(false);
//       }
//     };

//     fetchProjects();
//   }, [selectedEmployee]);

//   const fetchConfig = async () => {
//     setLoadingConfig(true);
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/config`,
//         {
//           withCredentials: true,
//           headers: {
//             "x-employee-id": supervisorId,
//             "x-api-key": process.env.REACT_APP_API_KEY || "",
//           },
//           timeout: 10000,
//         }
//       );
//       const configData = response.data.data || [];
//       const freezeDaysSupervisor =
//         configData.find((item) => item.key === "freeze_days_supervisor")
//           ?.value || "";
//       const freezeDaysEmployee =
//         configData.find((item) => item.key === "freeze_days_employee")?.value ||
//         "";
//       setConfigModal({
//         isVisible: true,
//         freezeDaysSupervisor,
//         freezeDaysEmployee,
//       });
//       setError(null);
//     } catch (err) {
//       const errorMessage = err.response
//         ? `Error ${err.response.status}: ${
//             err.response.data?.error || err.response.statusText
//           }`
//         : err.code === "ECONNABORTED"
//         ? "Request timed out: Unable to connect to server"
//         : `Network error: ${err.message}`;
//       setError(errorMessage);
//       setConfigModal({
//         isVisible: true,
//         freezeDaysSupervisor: "",
//         freezeDaysEmployee: "",
//       });
//     } finally {
//       setLoadingConfig(false);
//     }
//   };

//   const updateConfig = async () => {
//     setLoadingConfig(true);
//     try {
//       const { freezeDaysSupervisor, freezeDaysEmployee } = configModal;
//       if (
//         !/^\d+$/.test(freezeDaysSupervisor) ||
//         !/^\d+$/.test(freezeDaysEmployee)
//       ) {
//         showAlert("Freeze days must be positive integers.");
//         return;
//       }
//       await Promise.all([
//         axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
//           { key: "freeze_days_supervisor", value: freezeDaysSupervisor },
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         ),
//         axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/config/update`,
//           { key: "freeze_days_employee", value: freezeDaysEmployee },
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         ),
//       ]);
//       showAlert("Configuration updated successfully");
//       setConfigModal({ ...configModal, isVisible: false });
//     } catch (err) {
//       const errorMessage = err.response
//         ? `Error ${err.response.status}: ${
//             err.response.data?.error || err.response.statusText
//           }`
//         : err.code === "ECONNABORTED"
//         ? "Request timed out: Unable to connect to server"
//         : `Network error: ${err.message}`;
//       showAlert(`Failed to update configuration: ${errorMessage}.`);
//       setConfigModal({ ...configModal, isVisible: false });
//     } finally {
//       setLoadingConfig(false);
//     }
//   };

//   const updateTaskField = (taskId, field, value) => {
//     setTasks((prev) =>
//       prev.map((task) => {
//         if (task.task_id === taskId) {
//           if (field === "project") {
//             const selectedProject = Object.entries(projects).find(
//               ([id]) => id === value
//             );
//             return {
//               ...task,
//               project_id: value,
//               project_name: selectedProject
//                 ? selectedProject[1]
//                 : task.project_name,
//             };
//           }
//           return { ...task, [field]: value };
//         }
//         return task;
//       })
//     );
//   };

//   const handleReviewChange = (taskId, value) => {
//     if (value === "pending") {
//       setPendingReviewChanges((prev) => {
//         const newPrev = { ...prev };
//         delete newPrev[taskId];
//         return newPrev;
//       });
//     } else {
//       setPendingReviewChanges((prev) => ({ ...prev, [taskId]: value }));
//     }
//   };

//   const saveTaskField = async (taskId) => {
//     const task = tasks.find((t) => t.task_id === taskId);
//     if (!task) {
//       console.error(`Task with task_id ${taskId} not found`);
//       showAlert("Task not found");
//       return;
//     }

//     if (task.sup_review_status === "suspended_review") {
//       showAlert("This task is suspended and cannot be updated.");
//       return;
//     }

//     try {
//       const effectiveReviewStatus =
//         pendingReviewChanges[taskId] || task.sup_review_status;
//       const updateData = {
//         sup_status: task.sup_status || "incomplete",
//         sup_comment: task.sup_comment || "",
//         sup_review_status: effectiveReviewStatus || "pending",
//         replacement_task: task.replacement_task || null,
//         star_rating: task.star_rating || 0,
//         project_id: task.project_id,
//         project_name: task.project_name,
//       };

//       if (task.sup_status === "re-work") {
//         const taskDate = new Date(task.task_date || new Date());
//         if (isNaN(taskDate.getTime())) {
//           taskDate = new Date();
//         }
//         taskDate.setHours(0, 0, 0, 0);
//         const nextDay = new Date(taskDate);
//         nextDay.setDate(taskDate.getDate() + 1);
//         const nextDayString = nextDay.toLocaleDateString("en-CA");
//         const nextDayWeekId = getWeekIdForDate(nextDay);

//         const newTaskName = task.replacement_task || task.task_name;

//         const newTaskData = {
//           week_id: nextDayWeekId,
//           task_date: nextDayString,
//           project_id: task.project_id,
//           project_name: task.project_name,
//           task_name: newTaskName,
//           employee_id: task.employee_id,
//           emp_status: "not started",
//           sup_status: "incomplete",
//           emp_comment: null,
//           sup_comment: null,
//           sup_review_status: "pending",
//           star_rating: 0,
//           parent_task_id: task.task_id,
//         };

//         const response = await axios.post(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
//           newTaskData,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );

//         updateData.sup_status = "re-work";
//         await axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
//           updateData,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         setReworkFrozenTasks((prev) => ({
//           ...prev,
//           [taskId]: true,
//         }));

//         showAlert(response.data.message || "New task created successfully");

//         if (response.data.newTask) {
//           const newTask = {
//             ...response.data.newTask,
//             employee_name:
//               employees.find(
//                 (emp) => emp.employee_id === response.data.newTask.employee_id
//               )?.employee_name || "Unknown",
//             employee_id: response.data.newTask.employee_id
//               ?.trim()
//               .toUpperCase(),
//             emp_status: response.data.newTask.emp_status || "not started",
//             week_id: response.data.newTask.week_id,
//             project_id: response.data.newTask.project_id,
//             project_name: response.data.newTask.project_name,
//           };
//           setTasks((prev) => [...prev, newTask]);
//           const newTaskWeek = newTask.week_id;
//           if (newTaskWeek && newTaskWeek !== selectedWeekId) {
//             setSelectedWeekId(newTaskWeek);
//           }
//           if (newTask.employee_id !== selectedEmployee) {
//             setSelectedEmployee(newTask.employee_id);
//           }
//         }
//       } else {
//         await axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
//           updateData,
//           {
//             withCredentials: true,
//             headers: {
//               "x-employee-id": supervisorId,
//               "x-api-key": process.env.REACT_APP_API_KEY || "",
//             },
//             timeout: 10000,
//           }
//         );
//         showAlert("Task updated successfully");
//       }

//       setPendingReviewChanges((prev) => {
//         const newPrev = { ...prev };
//         delete newPrev[taskId];
//         return newPrev;
//       });

//       const res = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor`,
//         {
//           withCredentials: true,
//           headers: {
//             "x-employee-id": supervisorId,
//             "x-api-key": process.env.REACT_APP_API_KEY || "",
//           },
//           timeout: 10000,
//         }
//       );
//       const validStatuses = [
//         "not started",
//         "working",
//         "completed",
//         "suspended",
//       ];
//       const taskData =
//         res.data.success && Array.isArray(res.data.data)
//           ? res.data.data.map((task) => ({
//               ...task,
//               employee_id: task.employee_id?.trim().toUpperCase(),
//               emp_status: validStatuses.includes(task.emp_status)
//                 ? task.emp_status
//                 : "not started",
//               week_id: task.week_id,
//               project_id: task.project_id,
//               project_name: task.project_name,
//             }))
//           : [];
//       setTasks(taskData);
//     } catch (err) {
//       const errorMessage = err.response
//         ? `Error ${err.response.status}: ${
//             err.response.data?.error || err.response.statusText
//           }`
//         : `Network error: ${err.message}`;
//       showAlert(`Failed to update task: ${errorMessage}`);
//     }
//   };

//   const statusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "#28a745";
//       case "working":
//         return "#3770ecff";
//       case "not started":
//         return "#888";
//       case "suspended":
//         return "#dc3545";
//       default:
//         return "#007bff";
//     }
//   };

//   const statusLabel = (status) => {
//     switch (status) {
//       case "completed":
//         return "Completed";
//       case "working":
//         return "Working";
//       case "not started":
//         return "Not Started";
//       case "suspended":
//         return "Suspended";
//       default:
//         return "Unknown";
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       timeZone: "Asia/Kolkata",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getTaskDateStyle = (dateString, employeeId) => {
//     if (!dateString) {
//       return {
//         className:
//           "supervisor-plan-task-date supervisor-plan-task-date-regular",
//         tooltip: "N/A",
//       };
//     }
//     const taskDate = new Date(dateString);
//     taskDate.setHours(0, 0, 0, 0);
//     const isApprovedLeave = approvedLeaves.some((leave) => {
//       if (leave.employee_id !== employeeId) return false;
//       const startDate = new Date(leave.start_date);
//       const endDate = new Date(leave.end_date);
//       startDate.setHours(0, 0, 0, 0);
//       endDate.setHours(0, 0, 0, 0);
//       const isHalfDay = leave.h_f_day.toLowerCase().includes("half");
//       if (isHalfDay) {
//         return taskDate.getTime() === startDate.getTime();
//       }
//       return (
//         taskDate.getTime() >= startDate.getTime() &&
//         taskDate.getTime() <= endDate.getTime()
//       );
//     });
//     const isSunday = taskDate.getDay() === 0;
//     const isHoliday = holidays.some((holiday) => {
//       const holidayDate = new Date(holiday);
//       holidayDate.setHours(0, 0, 0, 0);
//       return taskDate.getTime() === holidayDate.getTime();
//     });
//     if (isApprovedLeave) {
//       return {
//         className: "supervisor-plan-task-date supervisor-plan-task-date-leave",
//         tooltip: "Leave",
//       };
//     }
//     if (isHoliday) {
//       return {
//         className:
//           "supervisor-plan-task-date supervisor-plan-task-date-holiday",
//         tooltip: "Holiday",
//       };
//     }
//     if (isSunday) {
//       return {
//         className: "supervisor-plan-task-date supervisor-plan-task-date-sunday",
//         tooltip: "Sunday",
//       };
//     }
//     return {
//       className: "supervisor-plan-task-date supervisor-plan-task-date-regular",
//       tooltip: formatDate(dateString),
//     };
//   };

//   const getReviewStatusColor = (status) => {
//     switch (status) {
//       case "approved":
//         return "#28a745";
//       case "struck":
//         return "#ffc107";
//       case "suspended_review":
//         return "#dc3545";
//       default:
//         return "#6c757d";
//     }
//   };

//   const weekIds = [...new Set(tasks.map((task) => task.week_id))].sort((a, b) => {
//     const getWeekValue = (id) => {
//       if (typeof id === "string" && id.includes("-")) {
//         const [year, week] = id.split("-").map(Number);
//         return year * 100 + week;
//       }
//       return Number(id);
//     };
//     return getWeekValue(a) - getWeekValue(b);
//   });

//   const currentWeekIndex = weekIds.indexOf(selectedWeekId);

//   const goToPreviousWeek = () => {
//     if (currentWeekIndex > 0) {
//       setSelectedWeekId(weekIds[currentWeekIndex - 1]);
//     }
//   };

//   const goToNextWeek = () => {
//     if (currentWeekIndex < weekIds.length - 1) {
//       setSelectedWeekId(weekIds[currentWeekIndex + 1]);
//     }
//   };

//   const filteredEmployees = employees.filter((emp) =>
//     emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Fixed: Correctly generates week days even across year boundary
//   const generateWeekDays = () => {
//     if (!selectedWeekId) return [];

//     let year, weekNum;

//     if (typeof selectedWeekId === "string" && selectedWeekId.includes("-")) {
//       [year, weekNum] = selectedWeekId.split("-").map(Number);
//     } else {
//       weekNum = Number(selectedWeekId);
//       const taskInWeek = tasks.find(t => t.week_id === selectedWeekId);
//       year = taskInWeek 
//         ? new Date(taskInWeek.task_date).getFullYear()
//         : new Date().getFullYear();
//     }

//     if (isNaN(year) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
//       console.error("Invalid weekId:", selectedWeekId);
//       return [];
//     }

//     // Find Thursday of the week (ISO week year is determined by Thursday)
//     let tempDate = new Date(year, 0, 4);
//     tempDate.setDate(tempDate.getDate() + 3);
//     const thursdayOfWeek1 = new Date(tempDate);
//     thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
//     const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

//     // Monday is 3 days before Thursday
//     const weekStart = addDays(thursdayOfTargetWeek, -3);

//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       const date = addDays(weekStart, i);
//       const dateStr = format(date, "yyyy-MM-dd");
//       const dateDisplay = format(date, "MMM d");
//       days.push({ dateStr, dateDisplay });
//     }

//     return days;
//   };

//   const weekDays = generateWeekDays();

//   const getTasksByDate = () => {
//     const tasksByDate = {};
//     weekDays.forEach(({ dateStr }) => {
//       tasksByDate[dateStr] = [];
//     });
//     if (selectedEmployee && selectedWeekId) {
//       tasks.forEach((task) => {
//         if (task.employee_id === selectedEmployee) {
//           const taskWeek = task.week_id;
//           const selectedWeekStr = typeof selectedWeekId === "string" && selectedWeekId.includes("-")
//             ? selectedWeekId
//             : String(selectedWeekId);
//           const matchesWeek =
//             taskWeek === selectedWeekId ||
//             (typeof taskWeek === "number" && taskWeek === Number(selectedWeekId.split("-")[1])) ||
//             (typeof taskWeek === "string" && taskWeek === selectedWeekStr);

//           if (matchesWeek) {
//             const taskDateStr = format(parseISO(task.task_date), "yyyy-MM-dd");
//             if (tasksByDate[taskDateStr]) {
//               tasksByDate[taskDateStr].push(task);
//             }
//           }
//         }
//       });
//     }
//     return tasksByDate;
//   };

//   const tasksByDate = getTasksByDate();

//   if (!supervisorId) {
//     return (
//       <div className="supervisor-plan-admin-wrapper">
//         <div className="supervisor-plan-admin-error-message">
//           {error || "Supervisor ID is missing. Please "}
//           <a href="/login">log in again</a>.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="supervisor-plan-admin-wrapper">
//       <Modal
//         isVisible={alertModal.isVisible}
//         onClose={closeAlert}
//         buttons={[{ label: "OK", onClick: closeAlert }]}
//       >
//         <p>{alertModal.message}</p>
//       </Modal>
//       {configModal.isVisible && (
//         <div
//           className="supervisor-plan-admin-modal-overlay"
//           onClick={() => setConfigModal({ ...configModal, isVisible: false })}
//         >
//           <form
//             className="supervisor-plan-admin-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3 className="supervisor-plan-admin-modal-title">
//               Update Freeze Days
//             </h3>
//             <div className="supervisor-plan-admin-config-modal-content">
//               <div className="supervisor-plan-admin-config-input-group">
//                 <label className="supervisor-plan-admin-config-label">
//                   Supervisor Freeze Days
//                   <input
//                     type="number"
//                     min="0"
//                     value={configModal.freezeDaysSupervisor}
//                     onChange={(e) =>
//                       setConfigModal({
//                         ...configModal,
//                         freezeDaysSupervisor: e.target.value,
//                       })
//                     }
//                     disabled={loadingConfig}
//                     className="supervisor-plan-admin-config-input"
//                   />
//                 </label>
//                 <label className="supervisor-plan-admin-config-label">
//                   Employee Freeze Days
//                   <input
//                     type="number"
//                     min="0"
//                     value={configModal.freezeDaysEmployee}
//                     onChange={(e) =>
//                       setConfigModal({
//                         ...configModal,
//                         freezeDaysEmployee: e.target.value,
//                       })
//                     }
//                     disabled={loadingConfig}
//                     className="supervisor-plan-admin-config-input"
//                   />
//                 </label>
//               </div>
//             </div>
//             <div className="supervisor-plan-admin-modal-buttons">
//               <button
//                 type="button"
//                 className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-cancel"
//                 onClick={() =>
//                   setConfigModal({ ...configModal, isVisible: false })
//                 }
//                 disabled={loadingConfig}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-save"
//                 onClick={updateConfig}
//                 disabled={loadingConfig}
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//       <div className="supervisor-plan-admin-header">
//         <button
//           className="supervisor-plan-admin-config-button"
//           onClick={fetchConfig}
//           disabled={loadingConfig}
//           style={{ position: "absolute", top: "10px", right: "10px" }}
//         >
//           {loadingConfig ? "Loading..." : "Update Freeze Days"}
//         </button>
//       </div>
//       <div className="supervisor-plan-admin-employee-list">
//         <h3>Employees</h3>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search employees by name"
//           className="supervisor-plan-admin-search-bar"
//         />
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {loadingEmployees || loadingHolidays || loadingLeaves ? (
//           <p>Loading employees...</p>
//         ) : filteredEmployees.length === 0 ? (
//           <p>No employees match the search criteria.</p>
//         ) : (
//           <ul className="supervisor-plan-admin-employee-scroll">
//             {filteredEmployees.map((emp) => (
//               <li
//                 key={emp.employee_id}
//                 className={
//                   selectedEmployee === emp.employee_id
//                     ? "supervisor-plan-admin-active"
//                     : ""
//                 }
//                 onClick={() => setSelectedEmployee(emp.employee_id)}
//               >
//                 {emp.employee_name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <div className="supervisor-plan-admin-task-details">
//         {loadingTasks || loadingProjects ? (
//           <p>Loading tasks or projects...</p>
//         ) : selectedEmployee === null ? (
//           <p>Select an employee to view tasks</p>
//         ) : weekIds.length === 0 ? (
//           <p>No tasks assigned for this employee.</p>
//         ) : (
//           <>
//             <div className="supervisor-plan-admin-week-navigation">
//               <button
//                 className="supervisor-plan-admin-nav-button"
//                 onClick={goToPreviousWeek}
//                 disabled={currentWeekIndex <= 0}
//               >
//                 &lt;
//               </button>
//               <span className="supervisor-plan-admin-week-label">
//                 {formatWeekId(selectedWeekId)}
//               </span>
//               <button
//                 className="supervisor-plan-admin-nav-button"
//                 onClick={goToNextWeek}
//                 disabled={currentWeekIndex >= weekIds.length - 1}
//               >
//                 &gt;
//               </button>
//             </div>
//             <div className="supervisor-plan-admin-tasks-container">
//               {weekDays.map(({ dateStr, dateDisplay }) => {
//                 const dayTasks = tasksByDate[dateStr] || [];
//                 const sampleTaskForStyle = dayTasks[0] || {
//                   task_date: dateStr,
//                   employee_id: selectedEmployee,
//                 };
//                 const dateStyle = getTaskDateStyle(
//                   sampleTaskForStyle.task_date,
//                   selectedEmployee
//                 );
//                 return (
//                   <div
//                     key={dateStr}
//                     className="supervisor-plan-admin-day-group"
//                   >
//                     <div className="supervisor-plan-admin-day-header">
//                       <span
//                         className={dateStyle.className}
//                         title={dateStyle.tooltip}
//                       >
//                         {dateDisplay}
//                       </span>
//                     </div>
//                     {dayTasks.length === 0 ? (
//                       <p className="supervisor-plan-admin-no-tasks">
//                         No tasks assigned for this day.
//                       </p>
//                     ) : (
//                       dayTasks.map((task) => {
//                         const taskDateStyle = getTaskDateStyle(
//                           task.task_date,
//                           task.employee_id
//                         );
//                         const effectiveReviewStatus =
//                           pendingReviewChanges[task.task_id] ||
//                           task.sup_review_status;
//                         const isFrozen =
//                           task.sup_review_status === "suspended_review" ||
//                           (task.sup_status === "re-work" &&
//                             reworkFrozenTasks[task.task_id]);

//                         const showReviewSelect =
//                           task.sup_review_status === "pending" &&
//                           !pendingReviewChanges[task.task_id];
//                         return (
//                           <div
//                             key={task.task_id}
//                             className={`supervisor-plan-admin-task-card ${
//                               isFrozen
//                                 ? "supervisor-plan-admin-task-frozen"
//                                 : ""
//                             }`}
//                           >
//                             <div className="supervisor-plan-admin-task-header">
//                               <div className="supervisor-plan-admin-task-title">
//                                 {effectiveReviewStatus === "struck" ? (
//                                   <>
//                                     <span
//                                       style={{
//                                         textDecoration: "line-through",
//                                         color: "#a0a0a0",
//                                       }}
//                                     >
//                                       {task.task_name}
//                                     </span>
//                                     {task.replacement_task && (
//                                       <span
//                                         style={{
//                                           color: "#007bff",
//                                           marginLeft: "8px",
//                                         }}
//                                       >
//                                         → {task.replacement_task}
//                                       </span>
//                                     )}
//                                   </>
//                                 ) : (
//                                   task.task_name
//                                 )}
//                               </div>
//                               <div className="supervisor-plan-admin-task-meta">
//                                 {effectiveReviewStatus !== "pending" && (
//                                   <span className="supervisor-plan-status-icon">
//                                     {effectiveReviewStatus === "approved" &&
//                                       "✅"}
//                                     {effectiveReviewStatus === "struck" && "📝"}
//                                     {effectiveReviewStatus ===
//                                       "suspended_review" && "⛔"}
//                                   </span>
//                                 )}
//                                 <span
//                                   className={taskDateStyle.className}
//                                   title={taskDateStyle.tooltip}
//                                 >
//                                   {formatDate(task.task_date)}
//                                 </span>
//                                 <div className="supervisor-plan-admin-project-circle-wrapper">
//                                   <span className="supervisor-plan-admin-project-circle">
//                                     {task.project_id || "N/A"}
//                                   </span>
//                                   <div className="supervisor-plan-admin-tooltip">
//                                     {task.project_name || "Unknown"}
//                                   </div>
//                                 </div>
//                                 <div className="supervisor-plan-admin-status-dot-wrapper">
//                                   <span
//                                     className="supervisor-plan-admin-status-dot"
//                                     style={{
//                                       backgroundColor: statusColor(
//                                         task.emp_status
//                                       ),
//                                     }}
//                                   ></span>
//                                   <div className="supervisor-plan-admin-tooltip">
//                                     {statusLabel(task.emp_status)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="supervisor-plan-admin-task-body">
//                               <p>
//                                 <strong>Emp-Update:</strong>{" "}
//                                 {task.emp_comment || "-"}
//                               </p>
//                             </div>
//                             {isFrozen && (
//                               <div className="supervisor-plan-admin-frozen-message">
//                                 This task is suspended and frozen. No edits
//                                 allowed.
//                               </div>
//                             )}
//                             <div
//                               className={`supervisor-plan-admin-edit-section ${
//                                 isFrozen
//                                   ? "supervisor-plan-admin-edit-section-disabled"
//                                   : ""
//                               }`}
//                             >
//                               <label>
//                                 Project:
//                                 <select
//                                   value={task.project_id || ""}
//                                   onChange={(e) =>
//                                     updateTaskField(
//                                       task.task_id,
//                                       "project",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={isFrozen}
//                                 >
//                                   <option value="">Select Project</option>
//                                   {Object.entries(projects).map(
//                                     ([id, name]) => (
//                                       <option key={id} value={id}>
//                                         {id} - {name}
//                                       </option>
//                                     )
//                                   )}
//                                 </select>
//                               </label>
//                               <label>
//                                 Update:
//                                 <select
//                                   value={task.sup_status || "incomplete"}
//                                   onChange={(e) =>
//                                     updateTaskField(
//                                       task.task_id,
//                                       "sup_status",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={isFrozen}
//                                 >
//                                   <option value="completed">Completed</option>
//                                   <option value="add on">Add On</option>
//                                   <option value="re-work">Re-work</option>
//                                   <option value="incomplete">Incomplete</option>
//                                 </select>
//                               </label>
//                               <label className="supervisor-admin-feedback-label">
//                                 Feedback:
//                                 <div className="supervisor-admin-feedback-wrapper">
//                                   <input
//                                     type="text"
//                                     value={
//                                       liveComments[task.task_id] ??
//                                       task.sup_comment ??
//                                       ""
//                                     }
//                                     onChange={(e) => {
//                                       const text = e.target.value;
//                                       setLiveComments((prev) => ({
//                                         ...prev,
//                                         [task.task_id]: text,
//                                       }));
//                                       updateTaskField(
//                                         task.task_id,
//                                         "sup_comment",
//                                         text
//                                       );
//                                     }}
//                                     placeholder="Add comment"
//                                     disabled={isFrozen}
//                                   />

//                                   <button
//                                     type="button"
//                                     className={`supervisor-admin-mic-button ${
//                                       listeningTaskId === task.task_id
//                                         ? "listening"
//                                         : ""
//                                     }`}
//                                     onClick={() => {
//                                       listeningTaskId === task.task_id
//                                         ? stopListening()
//                                         : startListening(task.task_id);
//                                     }}
//                                   >
//                                     {listeningTaskId === task.task_id ? (
//                                       <MdMicOff />
//                                     ) : (
//                                       <MdMic />
//                                     )}
//                                   </button>
//                                 </div>
//                               </label>

//                               {showReviewSelect && (
//                                 <label>
//                                   Review:
//                                   <select
//                                     value={task.sup_review_status || "pending"}
//                                     style={{
//                                       color: getReviewStatusColor(
//                                         task.sup_review_status
//                                       ),
//                                     }}
//                                     onChange={(e) =>
//                                       handleReviewChange(
//                                         task.task_id,
//                                         e.target.value
//                                       )
//                                     }
//                                     disabled={isFrozen}
//                                   >
//                                     <option value="pending">Pending</option>
//                                     <option value="approved">Approved</option>
//                                     <option value="struck">Update task</option>
//                                     <option value="suspended_review">
//                                       Suspended
//                                     </option>
//                                   </select>
//                                 </label>
//                               )}
//                               {effectiveReviewStatus === "struck" && (
//                                 <label>
//                                   Updated task:
//                                   <input
//                                     type="text"
//                                     value={task.replacement_task || ""}
//                                     onChange={(e) =>
//                                       updateTaskField(
//                                         task.task_id,
//                                         "replacement_task",
//                                         e.target.value
//                                       )
//                                     }
//                                     placeholder="Enter updated task"
//                                     disabled={isFrozen}
//                                   />
//                                 </label>
//                               )}
//                               {effectiveReviewStatus !== "pending" && (
//                                 <label>
//                                   Rating:
//                                   <div className="supervisor-plan-admin-star-rating">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                       <span
//                                         key={star}
//                                         className={`supervisor-plan-admin-star ${
//                                           task.star_rating >= star
//                                             ? "filled"
//                                             : ""
//                                         }`}
//                                         onClick={() =>
//                                           !isFrozen &&
//                                           updateTaskField(
//                                             task.task_id,
//                                             "star_rating",
//                                             star
//                                           )
//                                         }
//                                         style={{
//                                           cursor: isFrozen
//                                             ? "not-allowed"
//                                             : "pointer",
//                                         }}
//                                       >
//                                         ★
//                                       </span>
//                                     ))}
//                                   </div>
//                                 </label>
//                               )}
//                               <button
//                                 className="supervisor-plan-admin-update-task-button"
//                                 onClick={() => saveTaskField(task.task_id)}
//                                 disabled={isFrozen}
//                               >
//                                 Update
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupervisorPlanViewerAdmin;

import React, { useState, useEffect, useRef } from "react";
import { MdMic, MdMicOff } from "react-icons/md";
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
import "./SupervisorPlanViewerAdmin.css";

const SupervisorPlanViewerAdmin = () => {
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

  const [reworkFrozenTasks, setReworkFrozenTasks] = useState({});

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

  // Updated: Returns "YYYY-WW" format
  const getISOWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-${String(weekNo).padStart(2, "0")}`;
  };

  // CHANGED: Shows "2026-01 (Dec 29, 2025 - Jan 4, 2026)" — both week ID and date range
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

    if (isNaN(year) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      console.error("Invalid weekId:", weekId);
      return "Invalid Week";
    }

    // Find Thursday of the week (ISO week year is determined by Thursday)
    let tempDate = new Date(year, 0, 4);
    tempDate.setDate(tempDate.getDate() + 3);
    const thursdayOfWeek1 = new Date(tempDate);
    thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
    const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

    const weekStart = addDays(thursdayOfTargetWeek, -3);
    const weekEnd = addDays(weekStart, 6);

    const formattedStart = format(weekStart, "MMM d, yyyy");
    const formattedEnd = format(weekEnd, "MMM d, yyyy");

    const displayWeekId = typeof weekId === "string" && weekId.includes("-") 
      ? weekId 
      : `${year}-${String(weekNum).padStart(2, "0")}`;

    return `${displayWeekId} (${formattedStart} - ${formattedEnd})`;
  };

  const getWeekIdForDate = (date) => {
    const taskDate = new Date(date);
    if (isNaN(taskDate.getTime())) return null;
    return getISOWeekNumber(taskDate);
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
    recognition.interimResults = true;
    recognition.lang = "en-US";

    setListeningTaskId(taskId);

    recognition.start();

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const existing =
        liveComments[taskId] ||
        tasks.find((t) => t.task_id === taskId)?.sup_comment ||
        "";

      const combined = (existing + " " + finalTranscript + interim).trim();

      setLiveComments((prev) => ({ ...prev, [taskId]: combined }));
      updateTaskField(taskId, "sup_comment", combined);
    };

    recognition.onend = () => {
      if (listeningTaskId === taskId) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech error:", e.error);
      if (e.error === "no-speech" || e.error === "audio-capture") return;

      setListeningTaskId(null);
    };
  };
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    recognitionRef.current = null;
    setListeningTaskId(null);
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
                project_id: task.project_id,
                project_name: task.project_name,
              }))
            : [];

        const initialReworkFrozen = {};
        taskData.forEach((task) => {
          if (task.sup_status === "re-work") {
            initialReworkFrozen[task.task_id] = true;
          }
        });
        setReworkFrozenTasks(initialReworkFrozen);

        setTasks(taskData);

        const uniqueWeekIds = [...new Set(taskData.map((t) => t.week_id))].sort((a, b) => {
          const getWeekValue = (id) => {
            if (typeof id === "string" && id.includes("-")) {
              const [year, week] = id.split("-").map(Number);
              return year * 100 + week;
            }
            return Number(id);
          };
          return getWeekValue(a) - getWeekValue(b);
        });

        if (uniqueWeekIds.length > 0) {
          setSelectedWeekId(uniqueWeekIds[uniqueWeekIds.length - 1]);
        } else {
          setSelectedWeekId(null);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err.response
          ? `Error ${err.response.status}: ${
              err.response.data?.error || err.response.statusText
            }`
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
    setLoadingConfig(true);
    try {
      const { freezeDaysSupervisor, freezeDaysEmployee } = configModal;
      if (
        !/^\d+$/.test(freezeDaysSupervisor) ||
        !/^\d+$/.test(freezeDaysEmployee)
      ) {
        showAlert("Freeze days must be positive integers.");
        return;
      }
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
      showAlert("Configuration updated successfully");
      setConfigModal({ ...configModal, isVisible: false });
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${
            err.response.data?.error || err.response.statusText
          }`
        : err.code === "ECONNABORTED"
        ? "Request timed out: Unable to connect to server"
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
          if (field === "project") {
            const selectedProject = Object.entries(projects).find(
              ([id]) => id === value
            );
            return {
              ...task,
              project_id: value,
              project_name: selectedProject
                ? selectedProject[1]
                : task.project_name,
            };
          }
          return { ...task, [field]: value };
        }
        return task;
      })
    );
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

  const saveTaskField = async (taskId) => {
    const task = tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Task with task_id ${taskId} not found`);
      showAlert("Task not found");
      return;
    }

    if (task.sup_review_status === "suspended_review") {
      showAlert("This task is suspended and cannot be updated.");
      return;
    }

    try {
      const effectiveReviewStatus =
        pendingReviewChanges[taskId] || task.sup_review_status;
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
        if (isNaN(taskDate.getTime())) {
          taskDate = new Date();
        }
        taskDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(taskDate);
        nextDay.setDate(taskDate.getDate() + 1);
        const nextDayString = nextDay.toLocaleDateString("en-CA");
        const nextDayWeekId = getWeekIdForDate(nextDay);

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
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );

        updateData.sup_status = "re-work";
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            withCredentials: true,
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        setReworkFrozenTasks((prev) => ({
          ...prev,
          [taskId]: true,
        }));

        showAlert(response.data.message || "New task created successfully");

        if (response.data.newTask) {
          const newTask = {
            ...response.data.newTask,
            employee_name:
              employees.find(
                (emp) => emp.employee_id === response.data.newTask.employee_id
              )?.employee_name || "Unknown",
            employee_id: response.data.newTask.employee_id
              ?.trim()
              .toUpperCase(),
            emp_status: response.data.newTask.emp_status || "not started",
            week_id: response.data.newTask.week_id,
            project_id: response.data.newTask.project_id,
            project_name: response.data.newTask.project_name,
          };
          setTasks((prev) => [...prev, newTask]);
          const newTaskWeek = newTask.week_id;
          if (newTaskWeek && newTaskWeek !== selectedWeekId) {
            setSelectedWeekId(newTaskWeek);
          }
          if (newTask.employee_id !== selectedEmployee) {
            setSelectedEmployee(newTask.employee_id);
          }
        }
      } else {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/weekly_task_supervisor/${taskId}`,
          updateData,
          {
            withCredentials: true,
            headers: {
              "x-employee-id": supervisorId,
              "x-api-key": process.env.REACT_APP_API_KEY || "",
            },
            timeout: 10000,
          }
        );
        showAlert("Task updated successfully");
      }

      setPendingReviewChanges((prev) => {
        const newPrev = { ...prev };
        delete newPrev[taskId];
        return newPrev;
      });

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
              project_id: task.project_id,
              project_name: task.project_name,
            }))
          : [];
      setTasks(taskData);
    } catch (err) {
      const errorMessage = err.response
        ? `Error ${err.response.status}: ${
            err.response.data?.error || err.response.statusText
          }`
        : `Network error: ${err.message}`;
      showAlert(`Failed to update task: ${errorMessage}`);
    }
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
          "supervisor-plan-task-date supervisor-plan-task-date-regular",
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
        className: "supervisor-plan-task-date supervisor-plan-task-date-leave",
        tooltip: "Leave",
      };
    }
    if (isHoliday) {
      return {
        className:
          "supervisor-plan-task-date supervisor-plan-task-date-holiday",
        tooltip: "Holiday",
      };
    }
    if (isSunday) {
      return {
        className: "supervisor-plan-task-date supervisor-plan-task-date-sunday",
        tooltip: "Sunday",
      };
    }
    return {
      className: "supervisor-plan-task-date supervisor-plan-task-date-regular",
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

  const weekIds = [...new Set(tasks.map((task) => task.week_id))].sort((a, b) => {
    const getWeekValue = (id) => {
      if (typeof id === "string" && id.includes("-")) {
        const [year, week] = id.split("-").map(Number);
        return year * 100 + week;
      }
      return Number(id);
    };
    return getWeekValue(a) - getWeekValue(b);
  });

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

  // Fixed: Correctly generates week days even across year boundary
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
    let tempDate = new Date(year, 0, 4);
    tempDate.setDate(tempDate.getDate() + 3);
    const thursdayOfWeek1 = new Date(tempDate);
    thursdayOfWeek1.setDate(tempDate.getDate() - ((tempDate.getDay() + 3) % 7));
    const thursdayOfTargetWeek = addDays(thursdayOfWeek1, (weekNum - 1) * 7);

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
          const taskWeek = task.week_id;
          const selectedWeekStr = typeof selectedWeekId === "string" && selectedWeekId.includes("-")
            ? selectedWeekId
            : String(selectedWeekId);
          const matchesWeek =
            taskWeek === selectedWeekId ||
            (typeof taskWeek === "number" && taskWeek === Number(selectedWeekId.split("-")[1])) ||
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
      <div className="supervisor-plan-admin-wrapper">
        <div className="supervisor-plan-admin-error-message">
          {error || "Supervisor ID is missing. Please "}
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
        buttons={[{ label: "OK", onClick: closeAlert }]}
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
            <h3 className="supervisor-plan-admin-modal-title">
              Update Freeze Days
            </h3>
            <div className="supervisor-plan-admin-config-modal-content">
              <div className="supervisor-plan-admin-config-input-group">
                <label className="supervisor-plan-admin-config-label">
                  Supervisor Freeze Days
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
                    className="supervisor-plan-admin-config-input"
                  />
                </label>
                <label className="supervisor-plan-admin-config-label">
                  Employee Freeze Days
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
                    className="supervisor-plan-admin-config-input"
                  />
                </label>
              </div>
            </div>
            <div className="supervisor-plan-admin-modal-buttons">
              <button
                type="button"
                className="supervisor-plan-admin-modal-button supervisor-plan-admin-modal-button-cancel"
                onClick={() =>
                  setConfigModal({ ...configModal, isVisible: false })
                }
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
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          {loadingConfig ? "Loading..." : "Update Freeze Days"}
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loadingEmployees || loadingHolidays || loadingLeaves ? (
          <p>Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p>No employees match the search criteria.</p>
        ) : (
          <ul className="supervisor-plan-admin-employee-scroll">
            {filteredEmployees.map((emp) => (
              <li
                key={emp.employee_id}
                className={
                  selectedEmployee === emp.employee_id
                    ? "supervisor-plan-admin-active"
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
              <span className="supervisor-plan-admin-week-label">
                {formatWeekId(selectedWeekId)}
              </span>
              <button
                className="supervisor-plan-admin-nav-button"
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= weekIds.length - 1}
              >
                &gt;
              </button>
            </div>
            <div className="supervisor-plan-admin-tasks-container">
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
                  <div
                    key={dateStr}
                    className="supervisor-plan-admin-day-group"
                  >
                    <div className="supervisor-plan-admin-day-header">
                      <span
                        className={dateStyle.className}
                        title={dateStyle.tooltip}
                      >
                        {dateDisplay}
                      </span>
                    </div>
                    {dayTasks.length === 0 ? (
                      <p className="supervisor-plan-admin-no-tasks">
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
                          task.sup_review_status === "suspended_review" ||
                          (task.sup_status === "re-work" &&
                            reworkFrozenTasks[task.task_id]);

                        const showReviewSelect =
                          task.sup_review_status === "pending" &&
                          !pendingReviewChanges[task.task_id];
                        return (
                          <div
                            key={task.task_id}
                            className={`supervisor-plan-admin-task-card ${
                              isFrozen
                                ? "supervisor-plan-admin-task-frozen"
                                : ""
                            }`}
                          >
                            <div className="supervisor-plan-admin-task-header">
                              <div className="supervisor-plan-admin-task-title">
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
                              <div className="supervisor-plan-admin-task-meta">
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
                                <div className="supervisor-plan-admin-project-circle-wrapper">
                                  <span className="supervisor-plan-admin-project-circle">
                                    {task.project_id || "N/A"}
                                  </span>
                                  <div className="supervisor-plan-admin-tooltip">
                                    {task.project_name || "Unknown"}
                                  </div>
                                </div>
                                <div className="supervisor-plan-admin-status-dot-wrapper">
                                  <span
                                    className="supervisor-plan-admin-status-dot"
                                    style={{
                                      backgroundColor: statusColor(
                                        task.emp_status
                                      ),
                                    }}
                                  ></span>
                                  <div className="supervisor-plan-admin-tooltip">
                                    {statusLabel(task.emp_status)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="supervisor-plan-admin-task-body">
                              <p>
                                <strong>Emp-Update:</strong>{" "}
                                {task.emp_comment || "-"}
                              </p>
                            </div>
                            {isFrozen && (
                              <div className="supervisor-plan-admin-frozen-message">
                                This task is suspended and frozen. No edits
                                allowed.
                              </div>
                            )}
                            <div
                              className={`supervisor-plan-admin-edit-section ${
                                isFrozen
                                  ? "supervisor-plan-admin-edit-section-disabled"
                                  : ""
                              }`}
                            >
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
                                  disabled={isFrozen}
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
                                  disabled={isFrozen}
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
                                  />

                                  <button
                                    type="button"
                                    className={`supervisor-admin-mic-button ${
                                      listeningTaskId === task.task_id
                                        ? "listening"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      listeningTaskId === task.task_id
                                        ? stopListening()
                                        : startListening(task.task_id);
                                    }}
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
                                    disabled={isFrozen}
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
                                    disabled={isFrozen}
                                  />
                                </label>
                              )}
                              {effectiveReviewStatus !== "pending" && (
                                <label>
                                  Rating:
                                  <div className="supervisor-plan-admin-star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        className={`supervisor-plan-admin-star ${
                                          task.star_rating >= star
                                            ? "filled"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          !isFrozen &&
                                          updateTaskField(
                                            task.task_id,
                                            "star_rating",
                                            star
                                          )
                                        }
                                        style={{
                                          cursor: isFrozen
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
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
                                disabled={isFrozen}
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

export default SupervisorPlanViewerAdmin;