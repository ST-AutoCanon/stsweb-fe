import React, { useEffect, useRef } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const idleTimeout = 15 * 60 * 1000;

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef(null);

  // Update user activity timestamp
  const updateActivity = () => {
    localStorage.setItem("lastActivity", Date.now());
  };

  // Check if the user is idle and log them out if necessary
  const checkIdleTime = () => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - parseInt(lastActivity, 10) > idleTimeout) {
      localStorage.clear();
      sessionStorage.setItem("loggedOutDueToInactivity", "true");
      navigate("/");
    }
  };

  useEffect(() => {
    updateActivity();

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    const interval = setInterval(checkIdleTime, 60000);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });

  return <Outlet />;
};

export default ProtectedLayout;
