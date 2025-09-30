import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./WeeklyTaskPlanner.css";
import Modal from "../Modal/Modal";

// Helper function to get ISO week number for a date
const getISOWeekNumber = (date) => {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const weekNumber = Math.round(((tempDate - week1) / 86400000 + 1) / 7);
  return weekNumber;
};

// Helper function to get the next four upcoming weeks (future weeks only)
const getUpcomingWeeks = (currentDate, numWeeks = 4) => {
  const currentWeek = getISOWeekNumber(currentDate);
  const currentYear = currentDate.getFullYear();
  const weeks = [];
  let weekOffset = 0;

  const today = new Date(currentDate);
  const currentDay = today.getDay();
  if (currentDay !== 1) {
    weekOffset = 1;
  }

  for (let i = weekOffset; i < weekOffset + numWeeks; i++) {
    const weekNum = currentWeek + i;
    const weekStart = new Date(currentYear, 0, 1 + (weekNum - 1) * 7);
    const dow = weekStart.getDay();
    const ISOweekStart = new Date(weekStart);
    if (dow <= 4) ISOweekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    else ISOweekStart.setDate(weekStart.getDate() + 8 - weekStart.getDay());

    if (ISOweekStart >= today) {
      if (weekNum <= 53) {
        weeks.push(`Week-${weekNum}`);
      }
    } else if (weeks.length < numWeeks) {
      weekOffset++;
    }
  }

  return weeks;
};

// Helper function to get week range for a given week
const getWeekRange = (weekStr, year = 2025) => {
  const weekNum = parseInt(weekStr.split("-")[1], 10);
  const simple = new Date(year, 0, 1 + (weekNum - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = new Date(simple);
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  const ISOweekEnd = new Date(ISOweekStart);
  ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
  return {
    start: ISOweekStart,
    end: ISOweekEnd,
  };
};

// Helper function to calculate task date ranges within weeks, including weekends
const getTaskDates = (taskDays, startDates, endDates, previousDays = 0, weeks) => {
  if (!startDates || !endDates || !weeks) {
    return { dates: [], display: "Invalid date range" };
  }

  const startDateArray = startDates.split(",").map((d) => new Date(d));
  const endDateArray = endDates.split(",").map((d) => new Date(d));
  const weekLabels = weeks.split(",");
  const displayRanges = [];
  let daysAllocated = 0;
  let currentDate = new Date(startDateArray[0]);

  if (startDateArray.some((d) => isNaN(d.getTime())) || endDateArray.some((d) => isNaN(d.getTime()))) {
    return { dates: [], display: "Invalid date format" };
  }

  let daysToSkip = previousDays;
  while (daysToSkip > 0) {
    currentDate.setDate(currentDate.getDate() + 1);
    daysToSkip--;
  }

  for (let i = 0; i < startDateArray.length && daysAllocated < taskDays; i++) {
    const weekStart = new Date(startDateArray[i]);
    const weekEnd = new Date(endDateArray[i]);
    const weekLabel = weekLabels[i] ? `Week-${weekLabels[i]}` : `Week-${i + 1}`;

    if (currentDate < weekStart) {
      currentDate = new Date(weekStart);
    }

    let daysInWeek = 0;
    let rangeStart = null;
    let rangeEnd = new Date(currentDate);

    while (daysAllocated < taskDays && currentDate <= weekEnd) {
      if (!rangeStart) rangeStart = new Date(currentDate);
      rangeEnd = new Date(currentDate);
      daysAllocated++;
      daysInWeek++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (daysInWeek > 0) {
      displayRanges.push(`${weekLabel}: ${rangeStart.toLocaleDateString()} - ${rangeEnd.toLocaleDateString()}`);
    }
  }

  if (daysAllocated < taskDays) {
    console.warn(`Could not allocate all ${taskDays} days; only ${daysAllocated} days allocated.`);
    displayRanges.push(`Warning: Only ${daysAllocated} of ${taskDays} days allocated`);
  }

  return { dates: displayRanges, display: displayRanges.join("; ") };
};

// Helper function to check if plan is approved
const isPlanApproved = (messages) => {
  if (!messages) return false;
  const messageArray = typeof messages === "string" ? messages.split("; ") : Array.isArray(messages) ? messages : [messages];
  return messageArray.some((msg) => msg.startsWith("[APPROVED]") || msg.startsWith("Plan approved by supervisor"));
};

// Helper function to get message array with sender and timestamp
const getMessageArray = (messages, isSupervisor) => {
  if (!messages) return [];
  const messageArray = typeof messages === "string" ? messages.split("; ").filter((msg) => msg.trim() !== "") : Array.isArray(messages) ? messages.filter((msg) => msg.trim() !== "") : [messages];

  return messageArray.map((msg) => {
    const timestampMatch = msg.match(/on (\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM))/);
    const isSupervisorMessage = msg.startsWith("[APPROVED]") || msg.startsWith("Plan approved by supervisor") || msg.startsWith("[SUPERVISOR]");

    let timestamp = null;
    let text = msg;

    if (timestampMatch) {
      timestamp = timestampMatch[1];
      text = msg.replace(/on \d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/, "").trim();
    }

    if (isSupervisorMessage) {
      text = text.replace(/^\[SUPERVISOR\] /, "").replace(/^\[APPROVED\] /, "");
      if (!timestamp) {
        timestamp = new Date().toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }).replace(/,/, ", ");
      }
    }

    return {
      text: text.replace(/^\[APPROVED\] /, ""),
      sender: isSupervisorMessage ? "supervisor" : "employee",
      timestamp,
    };
  });
};

// Retry helper function for API calls
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

const WeeklyTaskPlanner = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDays, setTaskDays] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");
  const [weekOptions, setWeekOptions] = useState([]);
  const [alertModal, setAlertModal] = useState({ isVisible: false, title: "", message: "" });

  const employeeData = useMemo(() => JSON.parse(localStorage.getItem("dashboardData") || "{}"), []);
  const isSupervisor = employeeData?.role === "supervisor";

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setError(null);
      try {
        const employeeId = employeeData?.employeeId || "STS079";
        const projectsUrl = `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`;
        console.log("Fetching projects from:", projectsUrl);
        const projectsRes = await withRetry(() =>
          axios.get(projectsUrl, {
            params: { employeeId },
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
              "Content-Type": "application/json",
            },
          })
        );
        if (isMounted) {
          setProjects(projectsRes.data.projects || []);
        }

        const plansUrl = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${employeeId}`;
        console.log("Fetching plans from:", plansUrl);
        const plansRes = await withRetry(() =>
          axios.get(plansUrl, {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
              "Content-Type": "application/json",
            },
          })
        );
        if (isMounted) {
          const sortedPlans = plansRes.data.plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setPlans(sortedPlans || []);

          const currentDate = new Date();
          const upcomingWeeks = getUpcomingWeeks(currentDate, 4);
          const submittedWeeks = new Set();
          sortedPlans.forEach((plan) => {
            if (plan.week) {
              plan.week.split(",").forEach((week) => {
                submittedWeeks.add(`Week-${week.trim()}`);
              });
            }
          });
          const availableWeeks = upcomingWeeks.filter((week) => !submittedWeeks.has(week));
          setWeekOptions(availableWeeks);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching data:", err.response?.data || err.message);
          if (err.response?.status === 404) {
            setError("Endpoint not found. Please check the backend server.");
          } else if (err.response?.status === 401) {
            setError("Invalid API key. Please check your configuration.");
          } else {
            setError(`Network error: ${err.message}. Please try again later.`);
          }
        }
      }
    };

    if (process.env.REACT_APP_BACKEND_URL) {
      fetchData();
    } else {
      setError("Backend URL not configured. Please check your .env file.");
    }

    return () => {
      isMounted = false;
    };
  }, [employeeData]);

  const toggleWeek = (week) => {
    setSelectedWeeks((prev) => (prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]));
  };

  const toggleProject = (project) => {
    setSelectedProjects((prev) =>
      prev.some((p) => p.id === project.id) ? prev.filter((p) => p.id !== project.id) : [...prev, project]
    );
  };

  const handleAddTask = () => {
    const minRequiredDays = selectedWeeks.length * 5;

    if (!taskName || !taskDays) {
      showAlert("Please fill in task name and number of days.");
      return;
    }

    const parsedTaskDays = parseInt(taskDays, 10);
    if (isNaN(parsedTaskDays) || parsedTaskDays <= 0) {
      showAlert("Please enter a valid number of days (greater than 0).");
      return;
    }

    const usedDays = tasks.reduce((sum, t) => sum + (t.days || 0), 0);
    const availableDays = selectedWeeks.length * 7;
    const remainingDays = availableDays - usedDays;

    if (parsedTaskDays > remainingDays) {
      showAlert(`Only ${remainingDays} day(s) remain for allocation in the selected ${selectedWeeks.length} week(s).`);
      return;
    }

    const weekRanges = selectedWeeks.map((w) => ({
      week: w,
      ...getWeekRange(w),
    }));
    const sortedWeeks = [...weekRanges].sort((a, b) => a.start.getTime() - b.start.getTime());
    const startDates = sortedWeeks.map((wr) => wr.start.toISOString().split("T")[0]).join(",");
    const endDates = sortedWeeks.map((wr) => wr.end.toISOString().split("T")[0]).join(",");
    const weekNumbers = sortedWeeks.map((wr) => wr.week.replace("Week-", "")).join(",");
    const taskDates = getTaskDates(parsedTaskDays, startDates, endDates, usedDays, weekNumbers);

    const newTask = {
      name: taskName,
      desc: taskDesc.split("\n").filter((line) => line.trim() !== ""),
      days: parsedTaskDays,
      dates: taskDates.display,
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDesc("");
    setTaskDays("");
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    const currentPlan = plans[currentPlanIndex];
    const timestamp = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).replace(/,/, ", ");
    const formattedMessage = isSupervisor ? `[SUPERVISOR] ${newMessage.trim()} on ${timestamp}` : `${newMessage.trim()} on ${timestamp}`;

    let updatedMessages = "";
    if (typeof currentPlan.messages === "string") {
      updatedMessages = currentPlan.messages + "; " + formattedMessage;
    } else if (Array.isArray(currentPlan.messages)) {
      updatedMessages = [...currentPlan.messages, formattedMessage].join("; ");
    } else {
      updatedMessages = formattedMessage;
    }

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${currentPlan.plan_id}`;
      console.log("Updating plan messages at:", url);
      await withRetry(() =>
        axios.put(
          url,
          { messages: updatedMessages },
          {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
              "Content-Type": "application/json",
            },
          }
        )
      );

      setNewMessage("");

      const employeeId = employeeData?.employeeId || "STS079";
      const plansUrl = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${employeeId}`;
      console.log("Fetching updated plans from:", plansUrl);
      const res = await withRetry(() =>
        axios.get(plansUrl, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        })
      );
      const sortedPlans = res.data.plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPlans(sortedPlans || []);
    } catch (err) {
      console.error("Error updating messages:", err.response?.data || err.message);
      if (err.response?.status === 404) {
        setError("Plan update endpoint not found. Please check the backend server.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Please check your configuration.");
      } else {
        setError("Failed to update messages: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedWeeks.length === 0 || selectedProjects.length === 0 || tasks.length === 0) {
      showAlert("Please select at least one week, one project, and add at least one task.");
      return;
    }

    const minRequiredDays = selectedWeeks.length * 5;
    const usedDays = tasks.reduce((sum, t) => sum + (t.days || 0), 0);
    if (usedDays < minRequiredDays) {
      showAlert(`Total task days (${usedDays}) must be at least ${minRequiredDays} days for ${selectedWeeks.length} week(s).`);
      return;
    }

    const employeeId = employeeData?.employeeId || "STS079";
    if (!employeeId) {
      showAlert("Employee ID not found. Please login again.");
      return;
    }

    const weekRanges = selectedWeeks.map((w) => ({
      week: w,
      ...getWeekRange(w),
    }));

    const sortedWeeks = [...weekRanges].sort((a, b) => a.start.getTime() - b.start.getTime());

    const startDates = sortedWeeks.map((wr) => wr.start.toISOString().split("T")[0]).join(",");
    const endDates = sortedWeeks.map((wr) => wr.end.toISOString().split("T")[0]).join(",");

    const plan = {
      emp_id: employeeId,
      week: sortedWeeks.map((wr) => wr.week.replace("Week-", "")).join(","),
      start_date: startDates,
      end_date: endDates,
      project_id: selectedProjects.map((p) => String(p.id)).join(","),
      task_name: tasks.map((t) => t.name).join("; "),
      task_desc: tasks.map((t) => t.desc.join("; ")).join(" | "),
      task_days: tasks.map((t) => t.days.toString()).join(","),
      messages: `Plan submitted for approval on ${new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }).replace(/,/, ", ")}`,
    };

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/plans`;
      console.log("Submitting plan to:", url);
      const response = await withRetry(() =>
        axios.post(url, plan, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        })
      );

      setShowForm(false);
      setTasks([]);
      setSelectedWeeks([]);
      setSelectedProjects([]);
      setError(null);

      const plansUrl = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${employeeId}`;
      console.log("Fetching updated plans from:", plansUrl);
      const res = await withRetry(() =>
        axios.get(plansUrl, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        })
      );
      const sortedPlans = res.data.plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPlans(sortedPlans || []);
      setCurrentPlanIndex(0);

      const submittedWeeks = new Set();
      sortedPlans.forEach((plan) => {
        if (plan.week) {
          plan.week.split(",").forEach((week) => {
            submittedWeeks.add(`Week-${week.trim()}`);
          });
        }
      });
      const currentDate = new Date();
      const upcomingWeeks = getUpcomingWeeks(currentDate, 4);
      const availableWeeks = upcomingWeeks.filter((week) => !submittedWeeks.has(week));
      setWeekOptions(availableWeeks);

      showAlert("Plan saved successfully! ID: " + response.data.plan_id, "Success");
    } catch (err) {
      console.error("Error saving plan:", err.response?.data || err.message);
      if (err.response?.status === 404) {
        setError("Plan submission endpoint not found. Please check the backend server.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Please check your configuration.");
      } else {
        setError("Failed to save plan: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleApprovePlan = async (planId) => {
    if (!isSupervisor) {
      showAlert("Only supervisors can approve plans.");
      return;
    }

    const timestamp = new Date().toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).replace(/,/, ", ");
    const approvalMessageText = approvalMessage.trim()
      ? `Plan approved by supervisor: ${approvalMessage.trim()} on ${timestamp}`
      : `[APPROVED] on ${timestamp}`;

    const currentPlan = plans[currentPlanIndex];
    let updatedMessages = "";
    if (typeof currentPlan.messages === "string") {
      updatedMessages = currentPlan.messages + "; " + approvalMessageText;
    } else if (Array.isArray(currentPlan.messages)) {
      updatedMessages = [...currentPlan.messages, approvalMessageText].join("; ");
    } else {
      updatedMessages = approvalMessageText;
    }

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${planId}/approve`;
      console.log("Approving plan at:", url);
      await withRetry(() =>
        axios.put(
          url,
          { message: updatedMessages },
          {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
              "Content-Type": "application/json",
            },
          }
        )
      );

      setApprovalMessage("");

      const employeeId = employeeData?.employeeId || "STS079";
      const plansUrl = `${process.env.REACT_APP_BACKEND_URL}/api/plans/${employeeId}`;
      console.log("Fetching updated plans from:", plansUrl);
      const res = await withRetry(() =>
        axios.get(plansUrl, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        })
      );
      const sortedPlans = res.data.plans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPlans(sortedPlans || []);
      showAlert("Plan approved successfully!", "Success");
    } catch (err) {
      console.error("Error approving plan:", err.response?.data || err.message);
      if (err.response?.status === 404) {
        setError("Plan approval endpoint not found. Please check the backend server.");
      } else if (err.response?.status === 401) {
        setError("Invalid API key. Please check your configuration.");
      } else {
        setError("Failed to approve plan: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setTaskName("");
    setTaskDesc("");
    setTaskDays("");
    setTasks([]);
    setSelectedWeeks([]);
    setSelectedProjects([]);
    setShowWeekDropdown(false);
    setShowProjectDropdown(false);
  };

  const minRequiredDays = selectedWeeks.length * 5;
  const usedDays = tasks.reduce((sum, t) => sum + (t.days || 0), 0);
  const isSubmitEnabled = selectedWeeks.length > 0 && selectedProjects.length > 0 && tasks.length > 0 && usedDays >= minRequiredDays;

  return (
    <div className="week-plan-planner-container">
      <div className="week-plan-planner-header">
        <h2>Weekly Planner</h2>
        <button className="week-plan-add-plan-btn" onClick={() => setShowForm(true)}>
          + Add Plan
        </button>
      </div>

      {error && (
        <div className="week-plan-error-message">{error}</div>
      )}

      {plans.length > 0 && (
        <div className="week-plan-detailed-plan-view">
          <h3>Saved Plans</h3>
          <div className="week-plan-plan-navigation">
            <button
              className="week-plan-nav-btn"
              disabled={currentPlanIndex === plans.length - 1}
              onClick={() => setCurrentPlanIndex((prev) => prev + 1)}
            >
              &lt; Previous (Older Plan)
            </button>
            <span className="week-plan-plan-title">
              Plan ID: {plans[currentPlanIndex].plan_id} (Week: {plans[currentPlanIndex].week})
            </span>
            <button
              className="week-plan-nav-btn"
              disabled={currentPlanIndex === 0}
              onClick={() => setCurrentPlanIndex((prev) => prev - 1)}
            >
              Next (Newer Plan) &gt;
            </button>
          </div>
          <div className="week-plan-plan-sections">
            <div className="week-plan-left-section">
              <h4>Plan Details</h4>
              <p>
                <b>Week:</b> {plans[currentPlanIndex].week}
              </p>
              <p>
                <b>Start Dates:</b> {plans[currentPlanIndex].start_date}
              </p>
              <p>
                <b>End Dates:</b> {plans[currentPlanIndex].end_date}
              </p>
              <p>
                <b>Projects:</b>{" "}
                {(() => {
                  const projectIds = plans[currentPlanIndex].project_id.split(",");
                  return projectIds
                    .map((id) => {
                      const project = projects.find((p) => p.id === id.trim());
                      return project ? `${id} - ${project.project}` : id;
                    })
                    .join(", ");
                })()}
              </p>
              <h4>Tasks</h4>
              {(() => {
                const currentPlan = plans[currentPlanIndex];
                const taskNames = currentPlan.task_name.split("; ");
                const taskDescs = currentPlan.task_desc.split(" | ").map((d) => d.split("; "));
                let taskDays = [];
                if (typeof currentPlan.task_days === "string") {
                  taskDays = currentPlan.task_days.split(",").map(Number);
                } else if (Array.isArray(currentPlan.task_days)) {
                  taskDays = currentPlan.task_days.map(Number);
                } else {
                  taskDays = [Number(currentPlan.task_days) || 0];
                }
                let currentDayOffset = 0;
                return taskNames.map((name, i) => {
                  const taskDates = getTaskDates(
                    taskDays[i],
                    currentPlan.start_date,
                    currentPlan.end_date,
                    currentDayOffset,
                    currentPlan.week
                  );
                  currentDayOffset += taskDays[i] || 0;
                  return (
                    <div key={i} className="week-plan-task-detail">
                      <strong>
                        {name} ({taskDays[i] || 0} days)
                      </strong>
                      <p>
                        <b>Dates:</b> {taskDates.display || "Not scheduled"}
                      </p>
                      <ul>
                        {taskDescs[i].map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="week-plan-right-section">
              <div className="week-plan-message-header">
                <h4>Messages / Conversation</h4>
                <span
                  className={`week-plan-approval-status ${
                    isPlanApproved(plans[currentPlanIndex].messages) ? "week-plan-approved" : "week-plan-pending"
                  }`}
                >
                  {isPlanApproved(plans[currentPlanIndex].messages) ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="week-plan-message-list">
                {getMessageArray(plans[currentPlanIndex].messages, isSupervisor).map((msg, i) => (
                  <div key={i} className={`week-plan-message ${msg.sender}`}>
                    <div className="week-plan-message-text">{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="week-plan-message-input">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="week-plan-send-message-btn" onClick={handleAddMessage}>
                  Send
                </button>
                {isSupervisor && !isPlanApproved(plans[currentPlanIndex].messages) && (
                  <div className="week-plan-approval-input">
                    <input
                      type="text"
                      placeholder="Add optional approval comment..."
                      value={approvalMessage}
                      onChange={(e) => setApprovalMessage(e.target.value)}
                    />
                    <button
                      className="week-plan-approve-plan-btn"
                      onClick={() => handleApprovePlan(plans[currentPlanIndex].plan_id)}
                    >
                      Approve Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="week-plan-modal">
          <div className="week-plan-modal-content">
            <span className="week-plan-close-btn" onClick={closeModal}>
              &times;
            </span>
            <h3>Create New Plan</h3>
            <div className="week-plan-planner-form">
              <div className="week-plan-form-container">
                <div className="week-plan-row-section">
                  <div className="week-plan-half-section">
                    <label>Select Week(s):</label>
                    <div className="week-plan-dropdown">
                      <button
                        className="week-plan-dropdown-btn"
                        onClick={() => setShowWeekDropdown(!showWeekDropdown)}
                      >
                        {selectedWeeks.length > 0
                          ? selectedWeeks
                              .map((week) => {
                                const { start, end } = getWeekRange(week);
                                return `${week} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
                              })
                              .join(", ")
                          : "Select one or more weeks"}
                      </button>
                      {showWeekDropdown && (
                        <div className="week-plan-dropdown-content">
                          {weekOptions.length > 0 ? (
                            weekOptions.map((week, i) => {
                              const { start, end } = getWeekRange(week);
                              return (
                                <label key={i}>
                                  <input
                                    type="checkbox"
                                    checked={selectedWeeks.includes(week)}
                                    onChange={() => toggleWeek(week)}
                                  />
                                  {week} ({start.toLocaleDateString()} - {end.toLocaleDateString()})
                                </label>
                              );
                            })
                          ) : (
                            <p>No available weeks for planning.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="week-plan-half-section">
                    <label>Select Project(s):</label>
                    <div className="week-plan-dropdown">
                      <button
                        className="week-plan-dropdown-btn"
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                      >
                        {selectedProjects.length > 0
                          ? selectedProjects.map((p) => `${p.id} - ${p.project}`).join(", ")
                          : "Select one or more projects"}
                      </button>
                      {showProjectDropdown && (
                        <div className="week-plan-dropdown-content">
                          {projects.map((project) => (
                            <label key={project.id}>
                              <input
                                type="checkbox"
                                checked={selectedProjects.some((p) => p.id === project.id)}
                                onChange={() => toggleProject(project)}
                              />
                              {project.id} - {project.project}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="week-plan-task-section">
                  <div className="week-plan-task-field">
                    <label>Task Name:</label>
                    <input
                      type="text"
                      placeholder="Enter the task name"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </div>
                  <div className="week-plan-task-field">
                    <label>Task Description (one point per line):</label>
                    <textarea
                      placeholder="Enter task description (one point per line)"
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                    />
                  </div>
                  <div className="week-plan-task-field">
                    <label>Number of Days:</label>
                    <input
                      type="number"
                      placeholder="Enter number of days"
                      value={taskDays}
                      onChange={(e) => setTaskDays(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="week-plan-button-group">
                    <button className="week-plan-add-task-btn" onClick={handleAddTask}>
                      + Add Task
                    </button>
                  </div>
                </div>
                {tasks.length > 0 && (
                  <div className="week-plan-task-preview">
                    <h4>Preview Tasks</h4>
                    <p>Total Days Allocated: {usedDays} / Minimum {minRequiredDays} (for {selectedWeeks.length} week(s))</p>
                    <ul>
                      {tasks.map((task, i) => (
                        <li key={i}>
                          <strong>
                            {task.name} ({task.days} days)
                          </strong>
                          <p>
                            <b>Dates:</b> {task.dates || "Not scheduled"}
                          </p>
                          <ul>
                            {task.desc.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="week-plan-submit-section">
                  <button
                    className="week-plan-submit-btn"
                    onClick={handleSubmit}
                    disabled={!isSubmitEnabled}
                  >
                    Submit Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <h3>{alertModal.title}</h3>
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default WeeklyTaskPlanner;
