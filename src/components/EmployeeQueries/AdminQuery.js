// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { FiPaperclip } from "react-icons/fi";
// import UserAvatar from "./UserAvatar";
// import "./AdminQuery.css";
// import Modal from "../Modal/Modal";
// import { io } from "socket.io-client";

// const AdminQuery = () => {
//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
//   const employeeId = dashboardData.employeeId || null;
//   const name = dashboardData.name || null;
//   const userRole = localStorage.getItem("userRole") || null;

//   const [queries, setQueries] = useState([]);
//   const [selectedQuery, setSelectedQuery] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [attachmentBase64, setAttachmentBase64] = useState(null);
//   const [attachmentName, setAttachmentName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showResolved, setShowResolved] = useState(false);
//   const chatContainerRef = useRef(null);
//   const socketRef = useRef(null);
//   const selectedThreadIdRef = useRef(null);
//   const [attachmentFile, setAttachmentFile] = useState(null);

//   const headers = {
//     "x-api-key": API_KEY,
//   };

//   useEffect(() => {
//     selectedThreadIdRef.current = selectedQuery?.id ?? null;
//   }, [selectedQuery]);

//   // 1️⃣ Connect socket once
//   useEffect(() => {
//     socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
//       query: { userId: employeeId },
//       auth: { apiKey: API_KEY },
//     });

//     socketRef.current.on("newMessage", (msg) => {
//       // only append if it’s for our open thread
//       if (msg.thread_id === selectedThreadIdRef.current) {
//         setMessages((prev) => [...prev, msg]);
//       }
//       // update preview list if you want
//       fetchQueries();
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [employeeId, API_KEY]);

//   const fetchQueries = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/threads`,
//         { headers }
//       );
//       if (response.data && response.data.data) {
//         setQueries(response.data.data);
//       } else {
//         setError("Invalid API response");
//       }
//     } catch (err) {
//       setError("Error fetching data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQueries();
//   }, []);

//   const [alertModal, setAlertModal] = useState({
//     isVisible: false,
//     title: "",
//     message: "",
//   });

//   const showAlert = (message, title = "") => {
//     setAlertModal({ isVisible: true, title, message });
//   };

//   const closeAlert = () => {
//     setAlertModal({ isVisible: false, title: "", message: "" });
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const fetchMessages = async (threadId) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages`,
//         { headers }
//       );
//       setMessages(response.data.data);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       showAlert("Failed to fetch thread messages. Please try again.");
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() && !attachmentBase64) {
//       showAlert("Message or attachment is required.");
//       return;
//     }

//     // attachments via REST/Multer
//     if (attachmentFile) {
//       const formData = new FormData();
//       formData.append("attachment", attachmentFile);
//       formData.append("sender_id", employeeId);
//       formData.append("sender_role", userRole);
//       formData.append("recipient_id", selectedQuery.sender_id);
//       formData.append("message", newMessage);

//       try {
//         const res = await axios.post(
//           `${process.env.REACT_APP_BACKEND_URL}/threads/${selectedQuery.id}/messages`,
//           formData,
//           {
//             headers: {
//               "x-api-key": API_KEY,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         // *** IMMEDIATE UI UPDATE: ***
//         const { message: newMsg } = res.data.data;
//         setMessages((prev) => [...prev, newMsg]);

//         // clear inputs
//         setNewMessage("");
//         setAttachmentFile(null);
//         setAttachmentBase64(null);
//         setAttachmentName("");
//         document.getElementById("fileInput").value = "";
//       } catch (err) {
//         console.error(err);
//         showAlert("Failed to send attachment");
//       }
//       return;
//     }

//     // text‑only via socket
//     const payload = {
//       thread_id: selectedQuery.id,
//       sender_id: employeeId,
//       sender_role: userRole,
//       recipient_id: selectedQuery.sender_id,
//       sender_name: name,
//       message: newMessage,
//     };
//     socketRef.current.emit("sendQueryMessage", payload);
//     setNewMessage("");
//   };

//   const handleAttachmentChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setAttachmentFile(file);
//       setAttachmentName(file.name);
//       const reader = new FileReader();
//       reader.onload = (e) => setAttachmentBase64(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const markMessagesAsRead = async (threadId) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${threadId}/messages/read`,
//         { sender_id: employeeId },
//         { headers }
//       );
//     } catch (error) {
//       console.error("Error marking messages as read:", error);
//     }
//   };

//   const handleSelectQuery = async (query) => {
//     setSelectedQuery(query);
//     setMessages([]);

//     socketRef.current.emit("joinThread", query.id);

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages`,
//         { headers }
//       );
//       const fetchedMessages = response.data.data || [];
//       setMessages(fetchedMessages);

//       // Mark messages as read
//       await axios.put(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages/read`,
//         { sender_id: employeeId },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": API_KEY,
//           },
//         }
//       );
//     } catch (error) {
//       console.error("Error fetching messages or marking as read:", error);
//     }
//   };

//   const toggleResolved = () => {
//     setShowResolved((prev) => !prev);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   const downloadAttachment = async (url) => {
//     try {
//       const filename = url.split("/").pop();
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/attachments/${filename}`,
//         {
//           headers: {
//             "x-api-key": API_KEY,
//           },
//           responseType: "blob",
//         }
//       );
//       const blob = new Blob([response.data]);
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       showAlert("Failed to download file.");
//     }
//   };

//   return (
//     <div className="admin-query-container">
//       <div className="admin-query-header">
//         <h2>Employee Queries</h2>
//       </div>

//       <div className="admin-query-content">
//         <div className="ad-sidebar">
//           <div className="toggle-switch">
//             <div
//               className={`toggle-option ${!showResolved ? "active" : ""}`}
//               onClick={() => setShowResolved(false)}
//             >
//               Queries
//             </div>
//             <div
//               className={`toggle-option ${showResolved ? "active" : ""}`}
//               onClick={() => setShowResolved(true)}
//             >
//               Resolved
//             </div>
//           </div>

//           <div className="query-list">
//             {queries
//               .filter((query) =>
//                 showResolved
//                   ? query.status === "closed"
//                   : query.status !== "closed"
//               )
//               .map((query) => (
//                 <div
//                   key={query.id}
//                   className={`query-item ${
//                     selectedQuery?.id === query.id ? "active" : ""
//                   }`}
//                   onClick={() => handleSelectQuery(query)}
//                 >
//                   <UserAvatar
//                     photoUrl={query.photo_url}
//                     role={query.role}
//                     gender={query.gender}
//                     apiKey={API_KEY}
//                     className="profile-pic"
//                   />
//                   <div className="query-info">
//                     <div className="query-header">
//                       <p className="name">{query.sender_name}</p>
//                       {query.unread_message_count > 0 && (
//                         <p className="unread-dot">
//                           {query.unread_message_count > 9
//                             ? "9+"
//                             : query.unread_message_count}
//                         </p>
//                       )}
//                       <p className="time">
//                         {query.updated_at
//                           ? new Date(query.updated_at).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                           : "N/A"}
//                       </p>
//                     </div>
//                     <p
//                       className={`message-preview ${
//                         query.unread_message_count > 0 ? "unread-message" : ""
//                       }`}
//                     >
//                       {query.status === "closed" && query.feedback
//                         ? query.feedback
//                         : query.latest_message || "No messages yet"}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className="chat-container">
//           {selectedQuery ? (
//             <>
//               <div className="chat-header">
//                 <p>
//                   {new Date(selectedQuery.created_at).toLocaleString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   })}
//                 </p>
//                 <p>
//                   From: <strong>{selectedQuery.sender_name}</strong>
//                 </p>
//                 <h2>{selectedQuery.subject || "Subject"}</h2>
//               </div>

//               <div className="chat-messages" ref={chatContainerRef}>
//                 {selectedQuery.status === "closed" &&
//                   selectedQuery.feedback && (
//                     <div className="message-container feedback-message">
//                       <div className="message feedback">
//                         <p>
//                           <strong>Feedback:</strong> {selectedQuery.feedback}
//                         </p>
//                         {selectedQuery.note && (
//                           <p>
//                             <strong>Note:</strong> {selectedQuery.note}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 {[...messages].reverse().map((message) => (
//                   <div
//                     key={message.id}
//                     className={`message-container ${
//                       message.sender_id === employeeId ? "right" : "left"
//                     }`}
//                   >
//                     <div className="message-header">
//                       <p className="message-sender">{message.sender_name}</p>
//                     </div>
//                     <div className="message">
//                       <p className="message-text">{message.message}</p>
//                       {message.attachment_url && (
//                         <button
//                           className="emp-attachment"
//                           onClick={() =>
//                             downloadAttachment(message.attachment_url)
//                           }
//                         >
//                           📎 {message.attachment_url.split("/").pop()}
//                         </button>
//                       )}
//                       <span className="message-time">
//                         {new Date(message.created_at).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="chat-input">
//                 <div className="input-container">
//                   <div className="input-wrapper">
//                     <input
//                       type="text"
//                       placeholder="Write a reply..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       disabled={selectedQuery.status === "closed"}
//                       className="message-input"
//                     />
//                     {attachmentName && (
//                       <span className="attachment-suffix">
//                         {attachmentName}
//                       </span>
//                     )}
//                     <label htmlFor="fileInput" className="attachment-icon">
//                       <FiPaperclip />
//                     </label>
//                   </div>
//                   <input
//                     type="file"
//                     onChange={handleAttachmentChange}
//                     disabled={selectedQuery.status === "closed"}
//                     style={{ display: "none" }}
//                     id="fileInput"
//                   />
//                 </div>
//                 <button
//                   className="submit-btn"
//                   onClick={sendMessage}
//                   disabled={selectedQuery.status === "closed"}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </>
//           ) : (
//             <p className="select-query">Select a query to view details</p>
//           )}
//         </div>
//       </div>
//       <Modal
//         isVisible={alertModal.isVisible}
//         onClose={closeAlert}
//         buttons={[{ label: "OK", onClick: closeAlert }]}
//       >
//         <p>{alertModal.message}</p>
//       </Modal>
//     </div>
//   );
// };

// export default AdminQuery;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiPaperclip } from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import "./AdminQuery.css";
import Modal from "../Modal/Modal";
import { io } from "socket.io-client";

const AdminQuery = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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

  // ------ SOCKET: init only when employeeId exists ------
  useEffect(() => {
    if (!employeeId) {
      console.warn("[socket] not connecting: employeeId missing");
      setLoading(false); // avoid infinite loading if you rely on socket
      return;
    }

    const socket = io(BACKEND_URL, {
      query: { userId: employeeId },
      auth: { apiKey: API_KEY },
      // transports: ["websocket"], // uncomment if you want to force websocket for debugging
    });

    socketRef.current = socket;

    const onConnect = () =>
      console.log("[socket] connected", socket.id, "userId=", employeeId);
    const onDisconnect = (reason) =>
      console.log("[socket] disconnected", reason);
    const onConnectError = (err) =>
      console.error("[socket] connect_error", err);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // newMessage broadcast handler
    socket.on("newMessage", (msg) => {
      console.log("[socket] newMessage:", msg);
      if (String(msg.thread_id) === String(selectedThreadIdRef.current)) {
        setMessages((prev) => [...prev, msg]);
      }
      // refresh thread previews/unread counts
      fetchQueries();
    });

    // ack back to the sender (optional: server emits this)
    socket.on("messageAck", (msg) => {
      console.log("[socket] messageAck:", msg);
      if (String(msg.thread_id) === String(selectedThreadIdRef.current)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("error", (err) => console.error("[socket] server error:", err));

    // cleanup
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("newMessage");
      socket.off("messageAck");
      socket.off("error");
      try {
        socket.disconnect();
      } catch (e) {
        console.warn("[socket] disconnect error", e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BACKEND_URL, API_KEY, employeeId]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/threads`, { headers });
      if (response.data && response.data.data) {
        setQueries(response.data.data);
      } else {
        setError("Invalid API response");
      }
    } catch (err) {
      console.error("fetchQueries error:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        `${BACKEND_URL}/threads/${threadId}/messages`,
        { headers }
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showAlert("Failed to fetch thread messages. Please try again.");
    }
  };

  // ----------------- SEND MESSAGE (socket with REST fallback) -----------------
  const sendMessage = async () => {
    if (!newMessage.trim() && !attachmentBase64) {
      showAlert("Message or attachment is required.");
      return;
    }

    // attachments via REST/Multer (unchanged)
    if (attachmentFile) {
      const formData = new FormData();
      formData.append("attachment", attachmentFile);
      formData.append("sender_id", employeeId);
      formData.append("sender_role", userRole);
      formData.append("recipient_id", selectedQuery.sender_id);
      formData.append("message", newMessage);

      try {
        const res = await axios.post(
          `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
          formData,
          {
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { message: newMsg } = res.data.data;
        setMessages((prev) => [...prev, newMsg]);

        // clear inputs
        setNewMessage("");
        setAttachmentFile(null);
        setAttachmentBase64(null);
        setAttachmentName("");
        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";
      } catch (err) {
        console.error("attachment send error:", err);
        showAlert("Failed to send attachment");
      }
      return;
    }

    // Build payload
    const payload = {
      thread_id: selectedQuery.id,
      sender_id: employeeId,
      sender_role: userRole,
      recipient_id: selectedQuery.sender_id,
      sender_name: name,
      message: newMessage,
    };

    console.log(
      "[client] sendMessage payload:",
      payload,
      "socketConnected=",
      !!socketRef.current?.connected
    );

    // If socket connected, use it with ack. Otherwise fallback to REST.
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("sendQueryMessage", payload, async (resp) => {
        console.log("[client] sendQueryMessage ack:", resp);
        if (resp && resp.success && resp.message) {
          setMessages((prev) => [...prev, resp.message]);
          setNewMessage("");
        } else {
          console.error("Socket send failed, falling back to REST:", resp);
          // REST fallback
          try {
            const res = await axios.post(
              `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
              {
                sender_id: employeeId,
                sender_role: userRole,
                recipient_id: selectedQuery.sender_id,
                message: newMessage,
              },
              { headers: { "x-api-key": API_KEY } }
            );
            const newMsg = res.data.data.message;
            setMessages((prev) => [...prev, newMsg]);
            setNewMessage("");
          } catch (err) {
            console.error("REST fallback error:", err);
            showAlert("Failed to send message. Please try again.");
          }
        }
      });
    } else {
      // REST fallback when no socket
      try {
        console.log("[client] socket not connected — using REST fallback");
        const res = await axios.post(
          `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
          {
            sender_id: employeeId,
            sender_role: userRole,
            recipient_id: selectedQuery.sender_id,
            message: newMessage,
          },
          { headers: { "x-api-key": API_KEY } }
        );
        const newMsg = res.data.data.message;
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
      } catch (err) {
        console.error("REST send failed:", err);
        showAlert("Failed to send message. Please try again.");
      }
    }
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
        `${BACKEND_URL}/threads/${threadId}/messages/read`,
        { sender_id: employeeId },
        { headers }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // When selecting a thread, join the room (if socket connected) and fetch messages
  const handleSelectQuery = async (query) => {
    setSelectedQuery(query);
    setMessages([]);

    if (socketRef.current && socketRef.current.connected) {
      console.log("[client] joinThread emit:", query.id);
      socketRef.current.emit("joinThread", query.id);
    } else {
      console.warn("[client] socket not connected: cannot emit joinThread");
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/threads/${query.id}/messages`,
        { headers }
      );
      const fetchedMessages = response.data.data || [];
      setMessages(fetchedMessages);

      // Mark messages as read
      await axios.put(
        `${BACKEND_URL}/threads/${query.id}/messages/read`,
        { sender_id: employeeId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      // refresh queries list (to update unread counts)
      fetchQueries();
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
        `${BACKEND_URL}/attachments/${filename}`,
        {
          headers: { "x-api-key": API_KEY },
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