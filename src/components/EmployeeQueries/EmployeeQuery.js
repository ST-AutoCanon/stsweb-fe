import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import { TbMessageOff } from "react-icons/tb";
import io from "socket.io-client";
import "./EmployeeQuery.css";


const EmployeeQuery = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;
  const departmentId = dashboardData.department_id || null;
  const name = dashboardData.name || null;
  const userRole = localStorage.getItem("userRole");

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatContainerRef = useRef(null);
  const [recipientRole, setRecipientRole] = useState("");
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [threadToClose, setThreadToClose] = useState(null);
  const [threads, setThreads] = useState([]);
  

  const headers = {
    "x-api-key": API_KEY,
  };

  const feedbackOptions = [
    { value: "very unsatisfied", stars: 1 },
    { value: "unsatisfied", stars: 2 },
    { value: "satisfied", stars: 3 },
    { value: "very satisfied", stars: 4 },
  ];

  // Socket connection setup
  const socket = useRef(null);

  useEffect(() => {
    // Connect to socket.io server
    socket.current = io(`${process.env.REACT_APP_BACKEND_URL}`, {
      transports: ["websocket"],
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
  });

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmpQueries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/threads/employee/${employeeId}`, { headers });
        if (response.data.status === "success") {
          setQueries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching employee queries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpQueries();
  }, [employeeId]);

  // Start a new thread
  const startThread = async () => {
    if (!recipientRole || !subject || !query) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/threads`,
        {
          sender_id: employeeId,
          role: recipientRole,
          department_id: departmentId,
          subject: subject,
          question: query,
        },
        { headers }
      );

      setThreadId(response.data.threadId);
      alert("Thread started successfully!");
      setShowModal(false); // Close the modal after submitting
    } catch (error) {
      console.error("Error starting thread:", error);
      alert("Failed to start thread. Please try again.");
    }
  };


  const handleSelectQuery = async (query) => {
    setSelectedQuery(query);
  
    try {
      // Fetch messages for the selected query
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
          },
        }
      );
  
      // Update the queries state and set unread_message_count to 0
      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === query.id ? { ...q, unread_message_count: 0 } : q
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const toggleResolved = () => {
    setShowResolved((prev) => !prev);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachment) {
      alert("Message or attachment is required.");
      return;
    }

    const formData = new FormData();
    formData.append("sender_id", employeeId);
    formData.append("sender_role", userRole);
    formData.append("recipient_id", selectedQuery.recipient_id);
    formData.append("message", inputMessage);
    if (attachment) formData.append("attachment", attachment);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/threads/${selectedQuery.id}/messages`, formData, { headers });

      socket.current.emit("sendMessage", {
          id: response.data.message.id, // Assuming the backend returns the new message ID
          sender_id: employeeId,
          sender_name: name, // Adjust this based on available user info
          message: inputMessage,
          attachment_url: response.data.message.attachment_url || null, // Assuming backend sends attachment URL
          created_at: response.data.created_at || new Date().toISOString(), // Set the current timestamp for immediate display
        });

        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);

        // Clear input and attachment
        setInputMessage("");
        setAttachment(null);
        setAttachmentName("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) setAttachment(file);
  };

  const openFeedbackModal = (threadId) => {
    setThreadToClose(threadId); // Correctly set threadToClose here
    setShowFeedbackModal(true); // Open the feedback modal
  };

  const closeThread = async () => {
    if (!feedback) {
      alert("Please select your feedback.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${threadToClose}/close`,
        {
          feedback: feedback,
          note: query,
        },
        { headers }
      );

      alert("Thread closed successfully.");
      closeFeedbackModal();

      // Show the thank-you modal
    setShowThankYouModal(true);

      // Refresh threads after closing
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/threads/employee/${employeeId}`,
        { headers }
      );
      setThreads(response.data.threads);

    } catch (error) {
      console.error("Error closing thread:", error);
      alert("Failed to close thread. Please try again.");
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setThreadToClose(null);
    setFeedback("");
  };

  const downloadAttachment = async (url) => {
    try {
      const filename = url.split("/").pop(); // Extract filename from URL
  
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/attachments/${filename}`, {
        headers: {
          "x-api-key": API_KEY,
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
    <div className="emp-query-container">
      <div className="emp-query-header">
        <h2>Employee Queries</h2>
      </div>
      <div className="emp-query-content">
        {/* Sidebar */}
        <div className="emp-sidebar">
          <div className="toggle-switch">
  <div className={`toggle-option ${!showResolved ? "active" : ""}`} onClick={() => setShowResolved(false)}>
    Queries
  </div>
  <div className={`toggle-option ${showResolved ? "active" : ""}`} onClick={() => setShowResolved(true)}>
    Resolved
    </div>
  </div>
          <div className="emp-query-list">
            {loading ? (
              <p>Loading...</p>
            ) : queries.length === 0 ? (
              <p>No queries found</p>
            ) : (
              queries
                .filter((query) => (showResolved ? query.status === "closed" : query.status !== "closed"))
                .map((query) => (
                  <div key={query.id} className={`emp-query-item ${selectedQuery?.id === query.id ? "active" : ""}`} onClick={() => handleSelectQuery(query)}>
                    <div className="emp-profile-pic"></div>
                    <div className="emp-query-info">
                      <div className="emp-query-header">
                        <p className="emp-name">{query.recipient_name}</p>
                        {query.unread_message_count > 0 && <div className="emp-unread-dot">{query.unread_message_count}</div>}
                        <p className="time">
                          {query.updated_at ? new Date(query.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
                        </p>
                      </div>
                      <p className={`emp-message-preview ${query.unread_message_count > 0 ? 'unread-message' : ''}`}>
                      {query.latest_message || "No messages yet"}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

       {showModal && (
         <div className="employee-query-modal-overlay">
          <div className="employee-query-modal">
             <div className="emp-form-header">
           <h3>New Query</h3>
           <MdOutlineCancel className="emp-close-button"  onClick={() => setShowModal(false)}/>
             </div>
             <div className="employee-query-form">
               <div className="employee-query-field">
                 <label htmlFor="recipientRole" className="employee-query-label">
                   To 
                 </label>
                 <select
                   id="recipientRole"
                   className="employee-query-select"
                   value={recipientRole}
                   onChange={(e) => setRecipientRole(e.target.value)}
                 >
                   <option value="">Select Recipient</option>
                   <option value="Admin">Admin</option>
                   <option value="Manager">Manager</option>
                   <option value="HR">HR</option>
                 </select>
               </div>

               <div className="employee-query-field">
                 <label htmlFor="subject" className="employee-query-label">
                  Subject
                 </label>
                 <input
                   type="text"
                   id="subject"
                   placeholder="Enter subject"
                   className="employee-query-input"
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                 />
               </div>

               <div className="employee-query-field">
                <label className="employee-query-label">
                  My Query
                 </label>
                 <textarea
                   id="query"
                   placeholder="Text field"
                   className="employee-query-textarea"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                 />
               </div>
               <button className="empform-cancel-button" onClick={() => setShowModal(false)}>
                 Cancel
               </button>
               <button className="employee-query-button" onClick={startThread}>
                 Submit
               </button>
             </div>
           </div>
         </div>
       )}

{showFeedbackModal && (
  <div className="employee-query-modal-overlay">
    <div className="employee-query-modal">
      <div className="emp-form-header">
        <h3>End Query</h3>
        <MdOutlineCancel className="emp-close-button" onClick={closeFeedbackModal} />
      </div>

      <div className="feedback-options">
        <p className="feedback-para">
          Great!! <br />
          I hope your query has been resolved. If not, click “Cancel” to continue.  
          Please provide your valuable Rating and Feedback before you end your conversation. <br />
          <span className="stars-info">
            1 star is low and 4 stars are the highest rating.
          </span>
        </p>

        {/* Star Rating */}
<div className="stars-container">
  {feedbackOptions.map((option, index) => (
    <span
      key={option.value}
      className={`star ${index <= feedbackOptions.findIndex((o) => o.value === feedback) ? "selected" : ""}`}
      onClick={() => setFeedback(option.value)}
    >
      ★
    </span>
  ))}
</div>

        {/* Feedback Textarea */}
        <div>
          <label className="employee-query-label">Feedback</label>
          <textarea
            id="query"
            placeholder="Your feedback matters"
            className="employee-query-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <button className="empform-cancel-button" onClick={closeFeedbackModal}>
        Cancel
      </button>
      <button className="employee-query-button" onClick={closeThread}>
        End Query
      </button>
    </div>
  </div>
)}


{showThankYouModal && (
  <div className="employee-query-modal-overlay">
    <div className="employee-query-modal">
    <div className="emp-form-header">
          <h3>End Query</h3>
          <MdOutlineCancel className="emp-close-button"  onClick={() => setShowThankYouModal(false)}/>
            </div>
            <div className="feedback-options">
      <p className="thank-you">Thanks for your valuable feedback</p>
    </div>
    <div className="thank-button">
    <button className="thank-close" onClick={() => setShowThankYouModal(false)}>
              Close
            </button> </div>
  </div>
  </div>
)}

        {/* Chat Container */}
        <div className="emp-chat-container">
          {selectedQuery ? (
            <>
              <div className="emp-chat-header">
              <div className="end">
              <button className="close-thread-button"
                onClick={() => openFeedbackModal(selectedQuery.id)} disabled={selectedQuery.status === "closed"}>
                          <TbMessageOff className="close-thread-icon"/>  End Query
                          </button>
                <button className="compose-button" onClick={() => setShowModal(true)}>
                <BiEdit className="compose-icon"/>  Compose
                </button></div>
                <div><p>{new Date(selectedQuery.created_at).toLocaleString()}</p>
                <p>From: <strong>{selectedQuery.recipient_name}</strong></p>
                <h2>{selectedQuery.subject || "Subject"}</h2></div>
              </div>
              <div className="emp-chat-messages" ref={chatContainerRef}>
  {messages.map((message) => (
    <div key={message.id} className={`emp-message-container ${message.sender_id === employeeId ? "right" : "left"}`}>
      <div className="emp-message-header">
        <p className="emp-message-sender">
          {message.sender_id === employeeId ? message.sender_name : message.sender_name}
        </p>
      </div>
      <div className="emp-message">
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
              </div>
              <div className="emp-chat-input">
      {/* Input field container */}
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={selectedQuery.status === "closed"} 
        />
        {/* Hidden file input */}
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
      <button className="emp-submit-btn" onClick={handleSendMessage} disabled={selectedQuery.status === "closed"}>
        Submit
      </button>
    </div>
            </>
          ) : (
            <div className="emp-select-query">Select a query to view messages OR ===
            <button className="compose-button" onClick={() => setShowModal(true)}>
                <BiEdit className="compose-icon"/>  Compose
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeQuery;
