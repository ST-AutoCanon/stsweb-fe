// src/components/Topbar/Notifications.js
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { ContentContext } from "./Context";
import NoteDashboard from "../Notes/NoteDashboard";
import "./Notifications.css";
import Admin from "../LeaveQueries/Admin";

const API_KEY = process.env.REACT_APP_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const meId = JSON.parse(
  localStorage.getItem("dashboardData") || "{}"
).employeeId;

// IMPORTANT: import Admin (main Leave Queries/Admin view)
export default function Notifications({ visible, onClose, onRead }) {
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const { setActiveContent } = useContext(ContentContext);

  useEffect(() => {
    if (!visible) return;
    axios
      .get(`${BACKEND_URL}/api/notifications`, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      })
      .then((res) => {
        if (res.data.success) setNotifications(res.data.notifications || []);
      })
      .catch((err) => console.error("Error fetching notifications", err));
  }, [visible]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const markRead = (id) => {
    return axios
      .put(
        `${BACKEND_URL}/api/notifications/${id}/read`,
        {},
        { headers: { "x-api-key": API_KEY, "x-employee-id": meId } }
      )
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (onRead) onRead();
      })
      .catch((err) => console.error("Error marking notification read", err));
  };

  const handleClickNotification = async (note) => {
    try {
      // mark notification as read first
      await markRead(note.id);

      // close dropdown if parent provided onClose
      if (typeof onClose === "function") onClose();

      // If notification relates to a policy -> open Admin + open PolicyModal for that policy
      if (note.policy_id) {
        // Render the Admin view as the active content and pass openPolicyId prop
        setActiveContent(
          <Admin
            key={`admin-policy-${note.policy_id}`}
            openPolicyId={note.policy_id}
          />
        );
        return;
      }

      // Meeting-related: keep existing NoteDashboard behavior
      if (note.meeting_id) {
        setActiveContent(
          <NoteDashboard
            key={note.meeting_id}
            highlightedId={note.meeting_id}
          />
        );
        return;
      }

      // fallback: do nothing for other notification types (or extend as needed)
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  if (!visible) return null;

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p className="empty">No new notifications</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note.id}
            className="notification-item"
            onClick={() => handleClickNotification(note)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                handleClickNotification(note);
            }}
            aria-label={`Notification: ${note.message}`}
          >
            <p className="n_message">{note.message}</p>
            <small className="n_time">
              {new Date(note.triggered_at).toLocaleString()}
            </small>
            <button
              className="mark-read"
              onClick={(e) => {
                e.stopPropagation();
                markRead(note.id);
              }}
              aria-label="Mark as read"
            >
              ✓
            </button>
          </div>
        ))
      )}
    </div>
  );
}
