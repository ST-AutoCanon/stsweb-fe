import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { ContentContext } from "./Context";
import NoteDashboard from "../Notes/NoteDashboard";
import "./Notifications.css";
import Admin from "../LeaveQueries/Admin";
import Profile from "../Profile/Profile";

const API_KEY = process.env.REACT_APP_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const meId = JSON.parse(
  localStorage.getItem("dashboardData") || "{}"
).employeeId;

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
    const onExternalMarkRead = (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // optional: you could also call onRead() here if parent needs to know
      if (typeof onRead === "function") onRead();
    };

    window.addEventListener("notification-read", onExternalMarkRead);
    return () =>
      window.removeEventListener("notification-read", onExternalMarkRead);
  }, [onRead]);

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
      if (note.policy_id) {
        setActiveContent(
          <Admin
            key={`admin-policy-${note.policy_id}`}
            openPolicyId={note.policy_id}
          />
        );
        if (onClose) onClose();
        return;
      }

      if (note.meeting_id) {
        setActiveContent(
          <NoteDashboard
            key={note.meeting_id}
            highlightedId={note.meeting_id}
          />
        );
        if (onClose) onClose();
        return;
      }

      const msg = (note.message || "").toLowerCase();
      const isProfileMissing =
        msg.includes("profile") &&
        (msg.includes("incomplete") ||
          msg.includes("missing") ||
          msg.includes("update"));

      if (isProfileMissing) {
        setActiveContent(
          <Profile
            key={`profile-notif-${note.id}`}
            onClose={() => setActiveContent(null)}
            notificationId={note.id}
          />
        );
        if (typeof onClose === "function") onClose();
        return;
      }

      await markRead(note.id);
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Error handling notification click:", err);
    }
  };

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (typeof onClose === "function") onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p className="empty">No new notifications</p>
      ) : (
        notifications.map((note) => {
          const msg = (note.message || "").toLowerCase();
          const isProfileMissing =
            msg.includes("profile") &&
            (msg.includes("incomplete") ||
              msg.includes("missing") ||
              msg.includes("update"));

          return (
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
              <div className="notification-main">
                <p className="n_message">{note.message}</p>
                <small className="n_time">
                  {new Date(note.triggered_at).toLocaleString()}
                </small>
              </div>

              {isProfileMissing ? (
                <button
                  className="mark-read disabled"
                  aria-disabled="true"
                  title="This notification is cleared after you update your profile"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✓
                </button>
              ) : (
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
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
