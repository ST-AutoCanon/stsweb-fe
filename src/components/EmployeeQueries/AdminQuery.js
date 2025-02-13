import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiPaperclip } from "react-icons/fi";
import io from "socket.io-client"; // Importing socket.io-client
import "./AdminQuery.css";

const AdminQuery = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employee_id || null;
  const name = dashboardData.name || null;
  const authToken = localStorage.getItem("authToken");

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const chatContainerRef = useRef(null);

  const headers = {
    "x-api-key": API_KEY,
    Authorization: `Bearer ${authToken}`,
  };

  // Socket connection setup
  const socket = useRef(null);

  useEffect(() => {
    // Connect to socket.io server
    socket.current = io(`${process.env.REACT_APP_BACKEND_URL}`, {
      transports: ["websocket"],
      query: { authToken }, // Optionally, send the token for authentication
    });
  
    // Function to handle received messages
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    // Attach listener
    socket.current.on("receiveMessage", handleReceiveMessage);
  
    // Cleanup function to remove listener and disconnect socket
    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage", handleReceiveMessage); // Remove listener properly
        socket.current.disconnect();
      }
    };
  }, [authToken]); // Ensure socket reconnects only when authToken changes
  


  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/threads`, { headers });
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

    fetchQueries();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async (threadId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages`, { headers });
      setMessages(response.data.data);
      console.log("Fetched Messages:", response.data.data); // Debugging step
    } catch (error) {
      console.error("Error fetching messages:", error);
      alert("Failed to fetch thread messages. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !attachment) {
      alert("Message or attachment is required.");
      return;
    }
  
    const formData = new FormData();
    formData.append("sender_id", employeeId);
    formData.append("recipient_id", selectedQuery.sender_id);
    formData.append("sender_role", "Admin");
    formData.append("message", newMessage);
    if (attachment) formData.append("attachment", attachment);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${selectedQuery.id}/messages`,
        formData,
        { headers }
      );
  
      console.log("Sent Message Response:", response.data.data);
  
      // Emit message to socket (DO NOT update setMessages here)
      socket.current.emit("sendMessage", {
        id: response.data.message_id,
        sender_id: employeeId,
        sender_name: name,
        message: newMessage,
        attachment_url: response.data.attachment_url || null,
        created_at: response.data.created_at || new Date().toISOString(),
      });

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
  
      // Only reset input fields, let socket handle message update
      setNewMessage("");
      setAttachment(null);
      setAttachmentName("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send the message. Please try again.");
    }
  };
  
  
  const markMessagesAsRead = async (threadId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages/read`,
        { sender_id: employeeId },
        { headers }
      );

      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.id === threadId ? { ...query, unread_message_count: 0 } : query
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSelectQuery = async (query) => {
    console.log("Selected query:", query); // Debug log
    setSelectedQuery(query);

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages`, { headers });
      setMessages(response.data.data);

      // Mark messages as read
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages/read`,
        { sender_id: employeeId }, // sending sender_id as JSON
        {
          headers: {
            "Content-Type": "application/json", // setting the correct content type for JSON
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === query.id ? { ...q, unread_message_count: 0 } : q
        )
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
      const filename = url.split("/").pop(); // Extract filename from URL
  
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/attachments/${filename}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        },
        responseType: "blob", // Ensures file download
      });
  
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename); // Use extracted filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
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
  <div className={`toggle-option ${!showResolved ? "active" : ""}`} onClick={() => setShowResolved(false)}>
    Queries
  </div>
  <div className={`toggle-option ${showResolved ? "active" : ""}`} onClick={() => setShowResolved(true)}>
    Resolved
    </div>
  </div>

          <div className="query-list">
            {queries
              .filter((query) => (showResolved ? query.status === "closed" : query.status !== "closed"))
              .map((query) => (
                <div
                  key={query.id}
                  className={`query-item ${selectedQuery?.id === query.id ? "active" : ""}`}
                  onClick={() => handleSelectQuery(query)}
                >
                  <div className="profile-pic"></div>
                  <div className="query-info">
                    <div className="query-header">
                      <p className="name">{query.sender_name}</p>
                      {query.unread_message_count > 0 && <p className="unread-dot">{query.unread_message_count}</p>}
                      <p className="time">
                        {query.updated_at ? new Date(query.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </p>
                    </div>
                    <p className={`message-preview ${query.unread_message_count > 0 ? 'unread-message' : ''}`}>
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
                <p>{new Date(selectedQuery.created_at).toLocaleString()}</p>
                <p>From: <strong>{selectedQuery.sender_name}</strong></p>
                <h2>{selectedQuery.subject || "Subject"}</h2>
              </div>

              <div className="chat-messages" ref={chatContainerRef}>
  {messages.map((message) => (
    <div key={message.id} className={`message-container ${message.sender_id === employeeId ? "right" : "left"}`}>
      <div className="message-header">
        <p className="message-sender">{message.sender_name}</p>
      </div>
      <div className="message">
        <p>{message.message}</p>

        {/* Show attachment if available */}
        {message.attachment_url && (
          <button
            className="emp-attachment"
            onClick={() => downloadAttachment(message.attachment_url)}
          >
            📎 {message.attachment_url.split("/").pop()}
          </button>                    
        )}
        <span className="message-time">
          {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  ))}

  {/* Show Feedback and Note for Closed Queries */}
  {selectedQuery.status === "closed" && selectedQuery.feedback && (
    <div className="message-container feedback-message">
      <div className="message feedback">
        <p><strong>Feedback:</strong> {selectedQuery.feedback}</p>
        {selectedQuery.note && (
          <p><strong>Note:</strong> {selectedQuery.note}</p>
        )}
      </div>
    </div>
  )}
</div>

              
              <div className="chat-input">
                    {/* Input field container */}
                    <div className="input-container">
                    <input
                  type="text"
                  placeholder="Write a reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={selectedQuery.status === "closed"}
                />
                      <input
                  type="file"
                  onChange={(e) => {
                  console.log("Selected File:", e.target.files[0]);
                  setAttachment(e.target.files[0])
                  setAttachmentName(e.target.files[0].name); }}
                  disabled={selectedQuery.status === "closed"}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="attachment-icon"><FiPaperclip /></label>
                {attachmentName && <span className="file-name">{attachmentName}</span>}
                    </div>
                    
                    <button className="submit-btn" onClick={sendMessage} disabled={selectedQuery.status === "closed"}>
                  Submit
                </button>
                  </div>
            </>
          ) : (
            <p className="select-query">Select a query to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuery;
