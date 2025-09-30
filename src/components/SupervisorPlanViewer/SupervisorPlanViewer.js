

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupervisorPlanViewer.css";
import { FaChevronDown } from "react-icons/fa";
import Modal from "../Modal/Modal";

// Helper function to get ISO week number for a date
const getISOWeekNumber = (date) => {
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  const weekNumber = Math.round(((tempDate - week1) / 86400000 + 1) / 7);
  return weekNumber;
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

// Helper function to calculate task date ranges within weeks
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

  currentDate.setDate(currentDate.getDate() + previousDays);

  for (let i = 0; i < startDateArray.length && daysAllocated < taskDays; i++) {
    const weekStart = new Date(startDateArray[i]);
    const weekEnd = new Date(endDateArray[i]);
    const weekLabel = weekLabels[i] ? `Week-${weekLabels[i]}` : `Week-${i + 1}`;

    if (currentDate < weekStart) {
      currentDate = new Date(weekStart);
    }

    const daysInWeek = Math.min(taskDays - daysAllocated, Math.floor((weekEnd - currentDate) / (1000 * 60 * 60 * 24)) + 1);
    if (daysInWeek > 0) {
      const rangeStart = new Date(currentDate);
      const rangeEnd = new Date(currentDate);
      rangeEnd.setDate(currentDate.getDate() + daysInWeek - 1);
      displayRanges.push(`${weekLabel}: ${rangeStart.toLocaleDateString()} - ${rangeEnd.toLocaleDateString()}`);
      daysAllocated += daysInWeek;
      currentDate.setDate(currentDate.getDate() + daysInWeek);
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

// Helper function to parse messages into employee/supervisor with timestamps
const parseMessages = (messages) => {
  if (!messages) return [];
  const messageArray = typeof messages === "string" ? messages.split("; ").filter((msg) => msg.trim() !== "") : Array.isArray(messages) ? messages.filter((msg) => msg.trim() !== "") : [messages];
  return messageArray.map((msg) => {
    const timestampMatch = msg.match(/on (\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM))/);
    const isSupervisorMessage = msg.startsWith("[SUPERVISOR]") || msg.startsWith("[APPROVED]") || msg.startsWith("Plan approved by supervisor");
    
    let timestamp = null;
    let text = msg;

    if (timestampMatch) {
      timestamp = timestampMatch[1];
      text = msg.replace(/on \d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/, '').trim();
    }
    
    if (isSupervisorMessage) {
      text = text.replace(/^\[SUPERVISOR\] /, '').replace(/^\[APPROVED\] /, '');
      if (!timestamp) {
        timestamp = new Date().toLocaleString('en-IN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: true, 
          timeZone: 'Asia/Kolkata' 
        }).replace(/,/, ', ');
      }
    }

    return {
      text,
      timestamp,
      isSupervisor: isSupervisorMessage,
      isEmployee: !isSupervisorMessage,
    };
  });
};

const SupervisorPlanViewer = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [projects, setProjects] = useState({});
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState({});
  const [approvalMessage, setApprovalMessage] = useState({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(null);
  const [displayedPlansCount, setDisplayedPlansCount] = useState(10);
  const [alertModal, setAlertModal] = useState({ isVisible: false, title: "", message: "" });

  const loggedInUser = JSON.parse(localStorage.getItem("dashboardData"));
  const supervisorId = loggedInUser?.employeeId;
  const currentWeek = getISOWeekNumber(new Date());

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    const fetchEmployeesAndPlans = async () => {
      if (!supervisorId) {
        console.error("Supervisor ID is missing (check dashboardData)");
        showAlert("Supervisor ID not found");
        return;
      }

      try {
        const empResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/supervisor/employees/${supervisorId}`,
          {
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
              "Content-Type": "application/json",
            },
          }
        );

        const empData = empResponse.data;
        console.log("Fetched employees:", empData);

        const employeesWithPlans = await Promise.all(
          empData.map(async (emp) => {
            try {
              console.log(`Fetching plans for employee: ${emp.id}`);
              const plansResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/plans/${emp.id}`,
                {
                  headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
                    "Content-Type": "application/json",
                  },
                }
              );

              const plans = (plansResponse.data.plans || []).filter((plan) => {
                if (!plan.plan_id) {
                  console.warn(`Invalid plan_id for employee ${emp.id}:`, plan);
                  return false;
                }
                const weeks = plan.week.split(",").map((w) => parseInt(w.trim().replace("Week-", ""), 10));
                return weeks.some((w) => w >= currentWeek);
              }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

              console.log(`Fetching projects for employee: ${emp.id}`);
              const projectsResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/projects/employeeProjects`,
                {
                  params: { employeeId: emp.id },
                  headers: {
                    "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
                    "Content-Type": "application/json",
                  },
                }
              );

              return {
                ...emp,
                plans,
                projects: projectsResponse.data.projects || [],
              };
            } catch (err) {
              console.error(`Error fetching data for employee ${emp.id}:`, err);
              return { ...emp, plans: [], projects: [] };
            }
          })
        );

        setEmployees(employeesWithPlans);

        const allProjects = {};
        employeesWithPlans.forEach((emp) => {
          emp.projects.forEach((proj) => {
            allProjects[proj.id] = proj.project;
          });
        });
        setProjects(allProjects);
        console.log("Projects lookup:", allProjects);

        if (employeesWithPlans.length === 0) {
          showAlert("No employees found for this supervisor");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        showAlert("Failed to fetch employees: " + (error.response?.data?.message || error.message));
      }
    };

    fetchEmployeesAndPlans();
  }, [supervisorId, currentWeek]);

  const handlePlanClick = (plan, employee) => {
    setSelectedEmployee(employee);
    setSelectedPlan(plan);
    setShowDetailsPopup(plan.plan_id);
    setNewMessage({});
    setApprovalMessage({});
  };

  const handleBackToAll = () => {
    setSelectedEmployee(null);
    setSelectedPlan(null);
    setNewMessage({});
    setApprovalMessage({});
    setShowDetailsPopup(null);
  };

  const handleClosePopup = () => {
    setShowDetailsPopup(null);
    setSelectedEmployee(null);
    setSelectedPlan(null);
    setNewMessage({});
    setApprovalMessage({});
  };

  const handleAddMessage = async (planId) => {
    if (!newMessage[planId]?.trim()) {
      showAlert("Message cannot be empty");
      return;
    }

    try {
      const plan = selectedEmployee.plans.find((p) => p.plan_id === planId);
      if (!plan) {
        throw new Error("Plan not found");
      }

      const timestamp = new Date().toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).replace(/,/, ', ');
      const formattedMessage = `[SUPERVISOR] ${newMessage[planId].trim()} on ${timestamp}`;

      const maxMessages = 10;
      const maxLength = 900;
      let existingMessages = plan.messages && typeof plan.messages === "string"
        ? plan.messages.split("; ").filter((msg, index, self) => msg.trim() && self.indexOf(msg) === index)
        : Array.isArray(plan.messages)
        ? plan.messages.filter((msg, index, self) => msg.trim() && self.indexOf(msg) === index)
        : [];

      existingMessages = [...existingMessages, formattedMessage].slice(-maxMessages);
      let updatedMessages = existingMessages.join("; ");

      if (updatedMessages.length > maxLength) {
        existingMessages = existingMessages.slice(-Math.floor(maxLength / (formattedMessage.length + 2)));
        updatedMessages = existingMessages.join("; ");
        console.warn("Messages truncated to fit database limit:", updatedMessages);
      }

      console.log("Sending updated messages to backend for planId:", planId, "messages:", updatedMessages);

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/plans/${planId}`,
        { messages: updatedMessages },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        }
      );

      const updatedPlan = response.data.plan;
      if (!updatedPlan) {
        throw new Error("No plan data returned from backend");
      }

      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id !== selectedEmployee.id) return emp;
          return {
            ...emp,
            plans: emp.plans.map((p) =>
              p.plan_id === planId ? updatedPlan : p
            ),
          };
        })
      );

      if (selectedPlan) {
        setSelectedPlan(updatedPlan);
      }

      setNewMessage((prev) => ({ ...prev, [planId]: "" }));
      showAlert("Message added successfully!", "Success");
    } catch (err) {
      console.error("Error adding message:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update messages";
      showAlert(`Failed to add message: ${errorMessage}`);
      if (errorMessage.includes("Data too long")) {
        showAlert("Failed to add message: Message history is too long. Please clear older messages or shorten your message.");
      }
    }
  };

  const handleApprovePlan = async (planId) => {
    if (!planId) {
      console.error("Invalid planId:", planId);
      showAlert("Invalid plan ID. Please select a valid plan.");
      return;
    }

    const planIdStr = String(planId);
    const plan = selectedEmployee.plans.find((p) => String(p.plan_id) === planIdStr);
    if (!plan) {
      console.error("Plan not found for planId:", planId, "in selectedEmployee:", selectedEmployee);
      showAlert("Plan not found. Please select a valid plan.");
      return;
    }

    if (isPlanApproved(plan.messages)) {
      console.warn("Plan already approved for planId:", planId);
      showAlert("Plan is already approved");
      return;
    }

    const timestamp = new Date()
      .toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
      .replace(/,/, ", ");

    const approvalMessageText = approvalMessage[planIdStr]?.trim()
      ? `Plan approved by supervisor: ${approvalMessage[planIdStr].trim()} on ${timestamp}`
      : `[APPROVED] on ${timestamp}`;

    const maxMessages = 10;
    const maxLength = 900;
    let existingMessages = plan.messages && typeof plan.messages === "string"
      ? plan.messages.split("; ").filter((msg, index, self) => msg.trim() && self.indexOf(msg) === index)
      : Array.isArray(plan.messages)
      ? plan.messages.filter((msg, index, self) => msg.trim() && self.indexOf(msg) === index)
      : [];

    if (!existingMessages.some((msg) => msg.startsWith("[APPROVED]") || msg.startsWith("Plan approved by supervisor"))) {
      existingMessages = [...existingMessages, approvalMessageText].slice(-maxMessages);
    }
    let updatedMessages = existingMessages.join("; ");

    if (!updatedMessages.trim()) {
      console.error("Empty messages after processing for planId:", planId);
      showAlert("Approval message cannot be empty");
      return;
    }

    if (updatedMessages.length > maxLength) {
      existingMessages = existingMessages.slice(
        -Math.floor(maxLength / (approvalMessageText.length + 2))
      );
      updatedMessages = existingMessages.join("; ");
      console.warn("Messages truncated to fit database limit:", updatedMessages);
    }

    try {
      console.log("Sending approval for planId:", planIdStr, "with messages:", updatedMessages);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/plans/${planIdStr}/approve`,
        { message: updatedMessages },
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "your-api-key-here",
            "Content-Type": "application/json",
          },
        }
      );

      const updatedPlan = response.data.plan;
      if (!updatedPlan || !updatedPlan.plan_id) {
        throw new Error("No valid plan data returned from backend");
      }

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id !== selectedEmployee.id
            ? emp
            : {
                ...emp,
                plans: emp.plans.map((p) =>
                  String(p.plan_id) === planIdStr ? updatedPlan : p
                ),
              }
        )
      );

      if (selectedPlan) {
        setSelectedPlan(updatedPlan);
      }

      setApprovalMessage((prev) => ({ ...prev, [planIdStr]: "" }));
      showAlert("Plan approved successfully!", "Success");
      handleClosePopup();
    } catch (err) {
      console.error("Error approving plan for planId:", planId, "error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to approve plan";
      showAlert(`Failed to approve plan: ${errorMessage}`);
    }
  };

  const handleViewMore = () => {
    setDisplayedPlansCount((prev) => prev + 10);
  };

  const allPlans = employees
    .flatMap((emp) =>
      emp.plans.map((plan) => ({ ...plan, employeeName: emp.name }))
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, displayedPlansCount);

  const getEmployeeByPlanId = (planId) => {
    return employees.find((emp) => emp.plans.some((p) => p.plan_id === planId));
  };

  return (
    <div className="sup-plan-container">
      <div className="sup-plan-main">
        {error && <div className="sup-plan-error-message">{error}</div>}

        {selectedEmployee ? (
          <div className="sup-plan-weekly-updates">
            <div className="sup-plan-header">
              <h2>{selectedEmployee.name}'s Updates</h2>
              <button className="sup-plan-back-btn" onClick={handleBackToAll}>
                Back to All Plans
              </button>
            </div>
            <div className="sup-plan-plans-list">
              <h4>Latest Plans</h4>
              {selectedEmployee.plans.length > 0 ? (
                selectedEmployee.plans.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className="sup-plan-plan-item"
                    onClick={() => handlePlanClick(plan, selectedEmployee)}
                  >
                    <div className="sup-plan-plan-header">
                      <span className="sup-plan-employee-name">{selectedEmployee.name}</span>
                      <span className={`sup-plan-plan-status ${isPlanApproved(plan.messages) ? 'approved' : 'pending'}`}>
                        {isPlanApproved(plan.messages) ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p>Plan ID: {plan.plan_id}</p>
                    <p>
                      Week: {plan.week.split(",").map((w) => {
                        const { start, end } = getWeekRange(`Week-${w}`);
                        return `Week-${w} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
                      }).join(", ")}
                    </p>
                  </div>
                ))
              ) : (
                <p>No plans available for this employee for current or upcoming weeks.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="sup-plan-all-plans">
            <h2>All Latest Plans</h2>
            {allPlans.length > 0 ? (
              <>
                <div className="sup-plan-plans-grid">
                  {allPlans.map((plan) => {
                    const emp = getEmployeeByPlanId(plan.plan_id);
                    return (
                      <div
                        key={plan.plan_id}
                        className="sup-plan-plan-card"
                        onClick={() => handlePlanClick(plan, emp)}
                      >
                        <div className="sup-plan-plan-header">
                          <span className="sup-plan-employee-name">{plan.employeeName}</span>
                          <span className={`sup-plan-plan-status ${isPlanApproved(plan.messages) ? 'approved' : 'pending'}`}>
                            {isPlanApproved(plan.messages) ? "Approved" : "Pending"}
                          </span>
                        </div>
                        <p>Plan ID: {plan.plan_id}</p>
                        <p>
                          Week: {plan.week.split(",").map((w) => {
                            const { start, end } = getWeekRange(`Week-${w}`);
                            return `Week-${w} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
                          }).join(", ")}
                        </p>
                        <p>Projects: {plan.project_id.split(",").slice(0, 2).map((id) => projects[id.trim()] || id).join(", ")}{plan.project_id.split(",").length > 2 ? "..." : ""}</p>
                      </div>
                    );
                  })}
                </div>
                {allPlans.length < employees.flatMap((emp) => emp.plans).length && (
                  <div className="sup-plan-view-more">
                    <FaChevronDown
                      className="sup-plan-expand-icon"
                      onClick={handleViewMore}
                      title="Show more plans"
                    />
                  </div>
                )}
              </>
            ) : (
              <p>No plans available across all employees for current or upcoming weeks.</p>
            )}
          </div>
        )}

        {showDetailsPopup && selectedPlan && (
          <div className="sup-plan-details-popup">
            <div className="sup-plan-details-popup-content">
              <div className="sup-plan-details-popup-header">
                <h3>
                  Plan for {selectedEmployee.name} (Plan ID: {selectedPlan.plan_id}, Week: {selectedPlan.week})
                </h3>
                <button
                  className="sup-plan-close-popup"
                  onClick={handleClosePopup}
                >
                  ×
                </button>
              </div>
              <div className="sup-plan-week-content">
                <div className="sup-plan-all-updates">
                  <h4>Plan Details</h4>
                  <div className="sup-plan-plan-details">
                    <p><b>Start Dates:</b> {selectedPlan.start_date}</p>
                    <p><b>End Dates:</b> {selectedPlan.end_date}</p>
                    <p><b>Projects:</b> {selectedPlan.project_id.split(",").map((id) => {
                      const projectName = projects[id.trim()] || id;
                      return `${id} - ${projectName}`;
                    }).join(", ")}</p>
                    <h5>Tasks</h5>
                    {(() => {
                      const taskNames = selectedPlan.task_name.split("; ");
                      const taskDescs = selectedPlan.task_desc.split(" | ").map((d) => d.split("; "));
                      let taskDays = [];
                      if (typeof selectedPlan.task_days === "string") {
                        taskDays = selectedPlan.task_days.split(",").map(Number);
                      } else if (Array.isArray(selectedPlan.task_days)) {
                        taskDays = selectedPlan.task_days.map(Number);
                      } else {
                        taskDays = [Number(selectedPlan.task_days) || 0];
                      }
                      let currentDayOffset = 0;
                      return taskNames.map((name, i) => {
                        const taskDates = getTaskDates(
                          taskDays[i],
                          selectedPlan.start_date,
                          selectedPlan.end_date,
                          currentDayOffset,
                          selectedPlan.week
                        );
                        currentDayOffset += taskDays[i] || 0;
                        return (
                          <div key={i} className="sup-plan-task-detail">
                            <strong>{name} ({taskDays[i] || 0} days)</strong>
                            <p><b>Dates:</b> {taskDates.display || "Not scheduled"}</p>
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
                </div>
                <div className="sup-plan-supervisor-section">
                  <div className="sup-plan-section-header">
                    <h4>Conversation</h4>
                    <div className="sup-plan-approval-actions">
                      <span className={`status ${isPlanApproved(selectedPlan?.messages) ? 'approved' : 'pending'}`}>
                        {isPlanApproved(selectedPlan?.messages) ? "Approved" : "Pending"}
                      </span>
                      {!isPlanApproved(selectedPlan?.messages) && (
                        <>
                          <input
                            type="text"
                            placeholder="Optional approval comment..."
                            value={approvalMessage[showDetailsPopup] || ""}
                            onChange={(e) =>
                              setApprovalMessage({ ...approvalMessage, [showDetailsPopup]: e.target.value })
                            }
                            className="sup-plan-approval-comment-input"
                          />
                          <button
                            className="sup-plan-approve-plan-btn"
                            onClick={() => handleApprovePlan(showDetailsPopup)}
                          >
                            Approve Plan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="sup-plan-message-chat">
                    {parseMessages(selectedPlan?.messages).map((msg, i) => (
                      <div key={i} className={`sup-plan-message ${msg.isSupervisor ? 'supervisor' : 'employee'}`}>
                        <div className="sup-plan-message-text">{msg.text}</div>
                        {msg.timestamp && (
                          <div className="sup-plan-message-timestamp">{msg.timestamp}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="sup-plan-comment-input">
                    <input
                      type="text"
                      placeholder="Add a new message..."
                      value={newMessage[showDetailsPopup] || ""}
                      onChange={(e) =>
                        setNewMessage({ ...newMessage, [showDetailsPopup]: e.target.value })
                      }
                    />
                    <button
                      className="sup-plan-send-message-btn"
                      onClick={() => handleAddMessage(showDetailsPopup)}
                    >
                      Send
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
    </div>
  );
};

export default SupervisorPlanViewer;