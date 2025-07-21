import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiPaperclip } from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import "./AdminQuery.css";
import Modal from "../Modal/Modal";
import { io } from "socket.io-client";

const AdminQuery = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;
  const name = dashboardData.name || null;
  const userRole = localStorage.getItem("userRole") || null;

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentBase64, setAttachmentBase64] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const selectedThreadIdRef = useRef(null);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const headers = {
    "x-api-key": API_KEY,
  };

  useEffect(() => {
    selectedThreadIdRef.current = selectedQuery?.id ?? null;
  }, [selectedQuery]);

  // 1️⃣ Connect socket once
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      query: { userId: employeeId },
      auth: { apiKey: API_KEY },
    });

    socketRef.current.on("newMessage", (msg) => {
      // only append if it’s for our open thread
      if (msg.thread_id === selectedThreadIdRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
      // update preview list if you want
      fetchQueries();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [employeeId, API_KEY]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/threads`,
        { headers }
      );
      if (response.data && response.data.data) {
        setQueries(response.data.data);
      } else {
        setError("Invalid API response");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async (threadId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages`,
        { headers }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showAlert("Failed to fetch thread messages. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !attachmentBase64) {
      showAlert("Message or attachment is required.");
      return;
    }

    // attachments via REST/Multer
    if (attachmentFile) {
      const formData = new FormData();
      formData.append("attachment", attachmentFile);
      formData.append("sender_id", employeeId);
      formData.append("sender_role", userRole);
      formData.append("recipient_id", selectedQuery.sender_id);
      formData.append("message", newMessage);

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/threads/${selectedQuery.id}/messages`,
          formData,
          {
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // *** IMMEDIATE UI UPDATE: ***
        const { message: newMsg } = res.data.data;
        setMessages((prev) => [...prev, newMsg]);

        // clear inputs
        setNewMessage("");
        setAttachmentFile(null);
        setAttachmentBase64(null);
        setAttachmentName("");
        document.getElementById("fileInput").value = "";
      } catch (err) {
        console.error(err);
        showAlert("Failed to send attachment");
      }
      return;
    }

    // text‑only via socket
    const payload = {
      thread_id: selectedQuery.id,
      sender_id: employeeId,
      sender_role: userRole,
      recipient_id: selectedQuery.sender_id,
      sender_name: name,
      message: newMessage,
    };
    socketRef.current.emit("sendQueryMessage", payload);
    setNewMessage("");
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setAttachmentBase64(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const markMessagesAsRead = async (threadId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages/read`,
        { sender_id: employeeId },
        { headers }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSelectQuery = async (query) => {
    setSelectedQuery(query);
    setMessages([]);

    socketRef.current.emit("joinThread", query.id);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages`,
        { headers }
      );
      const fetchedMessages = response.data.data || [];
      setMessages(fetchedMessages);

      // Mark messages as read
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages/read`,
        { sender_id: employeeId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching messages or marking as read:", error);
    }
  };

  const toggleResolved = () => {
    setShowResolved((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const downloadAttachment = async (url) => {
    try {
      const filename = url.split("/").pop();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/attachments/${filename}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      showAlert("Failed to download file.");
    }
  };

  return (
    <div className="admin-query-container">
      <div className="admin-query-header">
        <h2>Employee Queries</h2>
      </div>

      <div className="admin-query-content">
        <div className="ad-sidebar">
          <div className="toggle-switch">
            <div
              className={`toggle-option ${!showResolved ? "active" : ""}`}
              onClick={() => setShowResolved(false)}
            >
              Queries
            </div>
            <div
              className={`toggle-option ${showResolved ? "active" : ""}`}
              onClick={() => setShowResolved(true)}
            >
              Resolved
            </div>
          </div>

          <div className="query-list">
            {queries
              .filter((query) =>
                showResolved
                  ? query.status === "closed"
                  : query.status !== "closed"
              )
              .map((query) => (
                <div
                  key={query.id}
                  className={`query-item ${
                    selectedQuery?.id === query.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectQuery(query)}
                >
                  <UserAvatar
                    photoUrl={query.photo_url}
                    role={query.role}
                    gender={query.gender}
                    apiKey={API_KEY}
                    className="profile-pic"
                  />
                  <div className="query-info">
                    <div className="query-header">
                      <p className="name">{query.sender_name}</p>
                      {query.unread_message_count > 0 && (
                        <p className="unread-dot">
                          {query.unread_message_count > 9
                            ? "9+"
                            : query.unread_message_count}
                        </p>
                      )}
                      <p className="time">
                        {query.updated_at
                          ? new Date(query.updated_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <p
                      className={`message-preview ${
                        query.unread_message_count > 0 ? "unread-message" : ""
                      }`}
                    >
                      {query.status === "closed" && query.feedback
                        ? query.feedback
                        : query.latest_message || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="chat-container">
          {selectedQuery ? (
            <>
              <div className="chat-header">
                <p>
                  {new Date(selectedQuery.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>
                  From: <strong>{selectedQuery.sender_name}</strong>
                </p>
                <h2>{selectedQuery.subject || "Subject"}</h2>
              </div>

              <div className="chat-messages" ref={chatContainerRef}>
                {selectedQuery.status === "closed" &&
                  selectedQuery.feedback && (
                    <div className="message-container feedback-message">
                      <div className="message feedback">
                        <p>
                          <strong>Feedback:</strong> {selectedQuery.feedback}
                        </p>
                        {selectedQuery.note && (
                          <p>
                            <strong>Note:</strong> {selectedQuery.note}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                {[...messages].reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`message-container ${
                      message.sender_id === employeeId ? "right" : "left"
                    }`}
                  >
                    <div className="message-header">
                      <p className="message-sender">{message.sender_name}</p>
                    </div>
                    <div className="message">
                      <p className="message-text">{message.message}</p>
                      {message.attachment_url && (
                        <button
                          className="emp-attachment"
                          onClick={() =>
                            downloadAttachment(message.attachment_url)
                          }
                        >
                          📎 {message.attachment_url.split("/").pop()}
                        </button>
                      )}
                      <span className="message-time">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={selectedQuery.status === "closed"}
                      className="message-input"
                    />
                    {attachmentName && (
                      <span className="attachment-suffix">
                        {attachmentName}
                      </span>
                    )}
                    <label htmlFor="fileInput" className="attachment-icon">
                      <FiPaperclip />
                    </label>
                  </div>
                  <input
                    type="file"
                    onChange={handleAttachmentChange}
                    disabled={selectedQuery.status === "closed"}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                </div>
                <button
                  className="submit-btn"
                  onClick={sendMessage}
                  disabled={selectedQuery.status === "closed"}
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <p className="select-query">Select a query to view details</p>
          )}
        </div>
      </div>
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

export default AdminQuery;
