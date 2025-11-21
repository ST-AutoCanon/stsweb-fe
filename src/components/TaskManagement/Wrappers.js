// src/components/Wrappers.jsx
import React, { useState, useEffect, useRef } from "react";

// Task Management Components
import TaskManagementEmployee from "./TaskManagementEmployee/EmpTaskManagement";
import TaskManagement from "./TaskManagement/TaskManagement";
import TaskManagementHR from "./TaskManagementHR/TaskManagementHR";

// Reimbursement Components
import Reimbursement from "./Reimbursement/Reimbursement";
import RbAdmin from "./Reimbursement/RbAdmin";
import RbTeamLead from "./Reimbursement/RbTeamLead";
import ReimbursementHR from "./Reimbursement/ReimbursementHR";

// Salary Statement Components
import Salary_Statement from "./Salary_statement/Salary_Statement";
import GeneratePayslip from "./generate_payslip/generate_payslip";

// =============================
// ERROR BOUNDARY
// =============================
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) return <div>Error loading component.</div>;
  try {
    return <>{children}</>;
  } catch (err) {
    setHasError(true);
    return null;
  }
};

// =============================
// 1. TASK MANAGEMENT WRAPPER
// =============================
export const TaskManagementWrapper = () => {
  const [selectedView, setSelectedView] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const modalRef = useRef(null);
  const firstButtonRef = useRef(null);

  const userRole = localStorage.getItem("userRole") || "Employee";

  useEffect(() => {
    const saved = localStorage.getItem("taskViewPreference");
    const needsPopup = ["Supervisor", "HR"].includes(userRole);

    if (saved && needsPopup) {
      setSelectedView(saved);
      setShowPopup(false);
    } else if (needsPopup) {
      setShowPopup(true);
    } else {
      setSelectedView("employee");
    }
  }, [userRole]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setShowPopup(false);
  };

  const trapFocus = (e) => {
    if (!modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };

  useEffect(() => {
    if (!showPopup || !modalRef.current || !firstButtonRef.current) return;
    firstButtonRef.current.focus();
    document.addEventListener("keydown", handleKeyDown);
    modalRef.current.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (modalRef.current) modalRef.current.removeEventListener("keydown", trapFocus);
    };
  }, [showPopup]);

  const handleSelection = (view) => {
    setSelectedView(view);
    setShowPopup(false);
    localStorage.setItem("taskViewPreference", view);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowPopup(false);
  };

  if (!selectedView && !["Supervisor", "HR"].includes(userRole)) {
    return <TaskManagementEmployee />;
  }

  return (
    <div style={styles.wrapper}>
      {showPopup && ["Supervisor", "HR"].includes(userRole) && (
        <div style={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
          <div style={styles.modal} ref={modalRef}>
            <h3 style={styles.modalHeading}>Task Management</h3>

            <button ref={firstButtonRef} style={styles.button} onClick={() => handleSelection("employee")}>
              My Tasks
            </button>

            {userRole === "Supervisor" && (
              <button style={styles.button} onClick={() => handleSelection("supervisor")}>
                Team Tasks
              </button>
            )}

            {userRole === "HR" && (
              <button style={styles.button} onClick={() => handleSelection("hr")}>
                HR Tasks
              </button>
            )}
          </div>
        </div>
      )}

      <ErrorBoundary>
        {selectedView === "employee" && <TaskManagementEmployee />}
        {selectedView === "supervisor" && <TaskManagement />}
        {selectedView === "hr" && <TaskManagementHR />}
      </ErrorBoundary>
    </div>
  );
};

// =============================
// 2. REIMBURSEMENT WRAPPER
// =============================
export const ReimbursementWrapper = () => {
  const userRole = localStorage.getItem("userRole") || "Employee";

  // HR gets direct access
  if (userRole === "HR") {
    return <ReimbursementHR />;
  }

  // Others use existing logic
  if (userRole === "Admin") {
    return <RbAdmin />;
  } else if (userRole === "Manager") {
    return <RbTeamLead />;
  } else {
    return <Reimbursement />;
  }
};

// =============================
// 3. SALARY STATEMENT WRAPPER
// =============================
export const SalaryStatementWrapper = () => {
  const [selectedView, setSelectedView] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const modalRef = useRef(null);
  const firstButtonRef = useRef(null);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setShowPopup(false);
  };

  const trapFocus = (e) => {
    if (!modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };

  useEffect(() => {
    if (!showPopup || !modalRef.current || !firstButtonRef.current) return;
    firstButtonRef.current.focus();
    document.addEventListener("keydown", handleKeyDown);
    modalRef.current.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (modalRef.current) modalRef.current.removeEventListener("keydown", trapFocus);
    };
  }, [showPopup]);

  const handleSelection = (view) => {
    setSelectedView(view);
    setShowPopup(false);
    localStorage.setItem("selectedView", view);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setShowPopup(false);
  };

  return (
    <div style={styles.wrapper}>
      {showPopup && (
        <div style={styles.overlay} onClick={handleBackdropClick} role="dialog" aria-modal="true">
          <div style={styles.modal} ref={modalRef}>
            <h3 style={styles.modalHeading}>Select an Option</h3>
            <button
              ref={firstButtonRef}
              style={styles.button}
              onClick={() => handleSelection("statement")}
            >
              Salary Statement
            </button>
            <button style={styles.button} onClick={() => handleSelection("payslip")}>
              Generate Payslip
            </button>
          </div>
        </div>
      )}

      <ErrorBoundary>
        {selectedView === "statement" && <Salary_Statement />}
        {selectedView === "payslip" && <GeneratePayslip />}
      </ErrorBoundary>
    </div>
  );
};

// =============================
// STYLES
// =============================
const styles = {
  wrapper: { position: "relative", minHeight: "100vh" },
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modal: {
    backgroundColor: "white", color: "#1f2937", padding: "2rem",
    borderRadius: "12px", textAlign: "center", width: "320px", maxWidth: "90vw",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)", border: "3px solid #10b981",
  },
  modalHeading: { margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: "bold" },
  button: {
    display: "block", width: "100%", padding: "0.75rem 1rem",
    margin: "0.5rem 0", fontSize: "1rem", fontWeight: "500",
    backgroundColor: "#f3f4f6", border: "1px solid #d1d5db",
    borderRadius: "8px", cursor: "pointer", transition: "all 0.2s",
  },
};