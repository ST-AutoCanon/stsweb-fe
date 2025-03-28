import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";

const idleTimeout = 5 * 60 * 1000;

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatContainerRef = useRef(null);
  const [idleModalVisible, setIdleModalVisible] = useState(false);

  const updateActivity = () => {
    localStorage.setItem("lastActivity", Date.now());
  };

  const checkIdleTime = () => {
    const lastActivity = localStorage.getItem("lastActivity");
    if (
      lastActivity &&
      Date.now() - parseInt(lastActivity, 10) > idleTimeout &&
      !idleModalVisible
    ) {
      setIdleModalVisible(true);
    }
  };

  const handleIdleModalClose = () => {
    setIdleModalVisible(false);
    localStorage.clear();
    navigate("/");
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
  }, [navigate, idleModalVisible]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });

  return (
    <>
      {idleModalVisible && (
        <Modal
          isVisible={idleModalVisible}
          onClose={handleIdleModalClose}
          buttons={[{ label: "OK", onClick: handleIdleModalClose }]}
        >
          <p>You have been logged out due to inactivity.</p>
        </Modal>
      )}
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
