// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";
// import { BiEdit } from "react-icons/bi";
// import { MdOutlineCancel } from "react-icons/md";
// import { FiPaperclip } from "react-icons/fi";
// import { TbMessageOff } from "react-icons/tb";
// import UserAvatar from "./UserAvatar";
// import "./EmployeeQuery.css";
// import Modal from "../Modal/Modal";

// const EmployeeQuery = () => {
//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//   const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
//   const employeeId = dashboardData.employeeId || null;
//   const departmentId = dashboardData.department_id || null;
//   const name = dashboardData.name || null;
//   const userRole = localStorage.getItem("userRole");

//   const [queries, setQueries] = useState([]);
//   const [selectedQuery, setSelectedQuery] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [attachmentFile, setAttachmentFile] = useState(null);
//   const [attachmentName, setAttachmentName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showResolved, setShowResolved] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const chatContainerRef = useRef(null);
//   const socketRef = useRef(null);
//   const [recipientRole, setRecipientRole] = useState("");
//   const [subject, setSubject] = useState("");
//   const [query, setQuery] = useState("");
//   const [threadId, setThreadId] = useState(null);
//   const [showThankYouModal, setShowThankYouModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [threadToClose, setThreadToClose] = useState(null);

//   const headers = {
//     "x-api-key": API_KEY,
//   };

//   const feedbackOptions = [
//     { value: "very unsatisfied", stars: 1 },
//     { value: "unsatisfied", stars: 2 },
//     { value: "satisfied", stars: 3 },
//     { value: "very satisfied", stars: 4 },
//   ];

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

//   const selectedThreadIdRef = useRef(null);

//   // whenever selectedQuery changes, update the ref
//   useEffect(() => {
//     selectedThreadIdRef.current = selectedQuery?.id ?? null;
//   }, [selectedQuery]);

//   // 1️⃣ Initialize socket connection once
//   useEffect(() => {
//     socketRef.current = io(BACKEND_URL, {
//       query: { userId: employeeId },
//       auth: { apiKey: API_KEY },
//     });

//     socketRef.current.on("newMessage", (msg) => {
//       // use the ref, not the stale state
//       if (msg.thread_id === selectedThreadIdRef.current) {
//         setMessages((prev) => [...prev, msg]);
//       }
//       fetchEmpQueries();
//     });

//     return () => socketRef.current.disconnect();
//   }, [BACKEND_URL, API_KEY, employeeId]);

//   const fetchEmpQueries = async () => {
//     try {
//       const response = await axios.get(
//         `${BACKEND_URL}/threads/employee/${employeeId}`,
//         { headers }
//       );
//       if (response.data.status === "success") {
//         setQueries(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching employee queries:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (employeeId) fetchEmpQueries();
//   }, [employeeId]);

//   // Join room when a thread is selected
//   useEffect(() => {
//     if (!selectedQuery) return;
//     socketRef.current.emit("joinThread", selectedQuery.id);
//     // Fetch history once
//     axios
//       .get(`${BACKEND_URL}/threads/${selectedQuery.id}/messages`, { headers })
//       .then((res) => setMessages(res.data.data))
//       .catch((e) => console.error(e));
//   }, [selectedQuery]);

//   useEffect(() => {
//     // Scroll to bottom
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

//   const startThread = async () => {
//     if (!recipientRole || !subject || !query) {
//       showAlert("Please fill out all fields.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/threads`,
//         {
//           sender_id: employeeId,
//           sender_role: userRole,
//           role: recipientRole,
//           department_id: departmentId,
//           subject: subject,
//           message: query,
//         },
//         { headers }
//       );

//       setThreadId(response.data.threadId);
//       showAlert("Thread started successfully!");
//       setShowModal(false);
//       await fetchEmpQueries();
//     } catch (error) {
//       console.error("Error starting thread:", error);
//       showAlert("Failed to start thread. Please try again.");
//     }
//   };

//   const handleSelectQuery = async (query) => {
//     setSelectedQuery(query);

//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages`,
//         { headers }
//       );
//       setMessages(response.data.data);

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

//       setQueries((prevQueries) =>
//         prevQueries.map((q) =>
//           q.id === query.id ? { ...q, unread_message_count: 0 } : q
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const toggleResolved = () => {
//     setShowResolved((prev) => !prev);
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleAttachmentChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAttachmentFile(file);
//       setAttachmentName(file.name);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!selectedQuery) return;

//     // 1️⃣ Attachment via REST+Multer
//     if (attachmentFile) {
//       const formData = new FormData();
//       formData.append("attachment", attachmentFile);
//       formData.append("sender_id", employeeId);
//       formData.append("sender_role", userRole);
//       formData.append("recipient_id", selectedQuery.recipient_id);
//       formData.append("message", inputMessage);

//       try {
//         const res = await axios.post(
//           `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
//           formData,
//           {
//             headers: {
//               "x-api-key": API_KEY,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         // *** HERE IS THE NEW CODE ***
//         const { message: newMsg } = res.data.data; // <- your handler returns { data: { message: newMessage } }
//         setMessages((prev) => [...prev, newMsg]);

//         // reset UI
//         setInputMessage("");
//         setAttachmentFile(null);
//         setAttachmentName("");
//       } catch (err) {
//         console.error(err);
//         showAlert("Failed to send attachment");
//       }
//       return;
//     }
//     // Otherwise text-only via socket
//     const payload = {
//       thread_id: selectedQuery.id,
//       sender_id: employeeId,
//       sender_role: userRole,
//       recipient_id: selectedQuery.recipient_id,
//       sender_name: name,
//       message: inputMessage,
//     };

//     socketRef.current.emit("sendQueryMessage", payload);
//     setInputMessage("");
//   };

//   const openFeedbackModal = (threadId) => {
//     setThreadToClose(threadId);
//     setShowFeedbackModal(true);
//   };

//   const closeThread = async () => {
//     if (!feedback) {
//       showAlert("Please select your feedback.");
//       return;
//     }

//     try {
//       await axios.put(
//         `${process.env.REACT_APP_BACKEND_URL}/threads/${threadToClose}/close`,
//         {
//           feedback: feedback,
//           note: query,
//         },
//         { headers }
//       );

//       showAlert("Thread closed successfully.");
//       closeFeedbackModal();

//       setQueries((prevQueries) =>
//         prevQueries.map((q) =>
//           q.id === threadToClose ? { ...q, status: "closed" } : q
//         )
//       );
//       setShowThankYouModal(true);
//     } catch (error) {
//       console.error("Error closing thread:", error);
//       showAlert("Failed to close thread. Please try again.");
//     }
//   };

//   const closeFeedbackModal = () => {
//     setShowFeedbackModal(false);
//     setThreadToClose(null);
//     setFeedback("");
//   };

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
//     <div className="emp-query-container">
//       <div className="emp-query-header">
//         <h2>Employee Queries</h2>
//         <button className="compose-button" onClick={() => setShowModal(true)}>
//           <BiEdit className="compose-icon" /> Compose
//         </button>
//       </div>
//       <div className="emp-query-content">
//         {/* Sidebar */}
//         <div className="emp-sidebar">
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
//           <div className="emp-query-list">
//             {loading ? (
//               <p>Loading...</p>
//             ) : queries.length === 0 ? (
//               <p>No queries found</p>
//             ) : (
//               queries
//                 .filter((query) =>
//                   showResolved
//                     ? query.status === "closed"
//                     : query.status !== "closed"
//                 )
//                 .map((query) => (
//                   <div
//                     key={query.id}
//                     className={`emp-query-item ${
//                       selectedQuery?.id === query.id ? "active" : ""
//                     }`}
//                     onClick={() => handleSelectQuery(query)}
//                   >
//                     <UserAvatar
//                       photoUrl={query.photo_url}
//                       role={query.role}
//                       gender={query.gender}
//                       apiKey={API_KEY}
//                       className="profile-pic"
//                     />
//                     <div className="emp-query-info">
//                       <div className="emp-query-header">
//                         <p className="emp-name">{query.recipient_name}</p>
//                         {query.unread_message_count > 0 && (
//                           <p className="emp-unread-dot">
//                             {query.unread_message_count > 9
//                               ? "9+"
//                               : query.unread_message_count}
//                           </p>
//                         )}
//                         <p className="time">
//                           {query.updated_at
//                             ? new Date(query.updated_at).toLocaleTimeString(
//                                 [],
//                                 {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 }
//                               )
//                             : "N/A"}
//                         </p>
//                       </div>
//                       <p
//                         className={`emp-message-preview ${
//                           query.unread_message_count > 0 ? "unread-message" : ""
//                         }`}
//                       >
//                         {query.latest_message || "No messages yet"}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//             )}
//           </div>
//         </div>

//         {showModal && (
//           <div className="employee-query-modal-overlay">
//             <div className="employee-query-modal">
//               <div className="emp-form-header">
//                 <h3>New Query</h3>
//                 <MdOutlineCancel
//                   className="emp-close-button"
//                   onClick={() => setShowModal(false)}
//                 />
//               </div>
//               <div className="employee-query-form">
//                 <div className="employee-query-field">
//                   <label
//                     htmlFor="recipientRole"
//                     className="employee-query-label"
//                   >
//                     To
//                   </label>
//                   <select
//                     id="recipientRole"
//                     className="employee-query-select"
//                     value={recipientRole}
//                     onChange={(e) => setRecipientRole(e.target.value)}
//                   >
//                     <option value="">Select Recipient</option>
//                     <option value="Admin">Admin</option>
//                     {userRole !== "Manager" && (
//                       <option value="Manager">Manager</option>
//                     )}
//                     <option value="HR">HR</option>
//                   </select>
//                 </div>

//                 <div className="employee-query-field">
//                   <label htmlFor="subject" className="employee-query-label">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     id="subject"
//                     placeholder="Enter subject"
//                     className="employee-query-input"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                   />
//                 </div>

//                 <div className="employee-query-field">
//                   <label className="employee-query-label">My Query</label>
//                   <textarea
//                     id="query"
//                     placeholder="Text field"
//                     className="employee-query-textarea"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   className="empform-cancel-button"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button className="employee-query-button" onClick={startThread}>
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showFeedbackModal && (
//           <div className="employee-query-modal-overlay">
//             <div className="employee-query-modal">
//               <div className="emp-form-header">
//                 <h3>End Query</h3>
//                 <MdOutlineCancel
//                   className="emp-close-button"
//                   onClick={closeFeedbackModal}
//                 />
//               </div>

//               <div className="feedback-options">
//                 <p className="feedback-para">
//                   Great!! <br />
//                   I hope your query has been resolved. If not, click “Cancel” to
//                   continue. Please provide your valuable Rating and Feedback
//                   before you end your conversation. <br />
//                   <span className="stars-info">
//                     1 star is low and 4 stars are the highest rating.
//                   </span>
//                 </p>

//                 <div className="stars-container">
//                   {feedbackOptions.map((option, index) => (
//                     <span
//                       key={option.value}
//                       className={`star ${
//                         index <=
//                         feedbackOptions.findIndex((o) => o.value === feedback)
//                           ? "selected"
//                           : ""
//                       }`}
//                       onClick={() => setFeedback(option.value)}
//                     >
//                       ★
//                     </span>
//                   ))}
//                 </div>

//                 <div>
//                   <label className="employee-query-label">Feedback</label>
//                   <textarea
//                     id="query"
//                     placeholder="Your feedback matters"
//                     className="employee-query-textarea"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <button
//                 className="empform-cancel-button"
//                 onClick={closeFeedbackModal}
//               >
//                 Cancel
//               </button>
//               <button className="employee-query-button" onClick={closeThread}>
//                 End Query
//               </button>
//             </div>
//           </div>
//         )}

//         {showThankYouModal && (
//           <div className="employee-query-modal-overlay">
//             <div className="employee-query-modal">
//               <div className="emp-form-header">
//                 <h3>End Query</h3>
//                 <MdOutlineCancel
//                   className="emp-close-button"
//                   onClick={() => setShowThankYouModal(false)}
//                 />
//               </div>
//               <div className="feedback-options">
//                 <p className="thank-you">Thanks for your valuable feedback</p>
//               </div>
//               <div className="thank-button">
//                 <button
//                   className="thank-close"
//                   onClick={() => setShowThankYouModal(false)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Chat Container */}
//         <div className="emp-chat-container">
//           {selectedQuery ? (
//             <>
//               <div className="emp-chat-header">
//                 <div className="end">
//                   <button
//                     className="close-thread-button"
//                     onClick={() => openFeedbackModal(selectedQuery.id)}
//                     disabled={selectedQuery.status === "closed"}
//                   >
//                     <TbMessageOff className="close-thread-icon" /> End Query
//                   </button>
//                 </div>
//                 <div>
//                   <p>
//                     {new Date(selectedQuery.created_at).toLocaleString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "numeric",
//                         minute: "2-digit",
//                         hour12: true,
//                       }
//                     )}
//                   </p>
//                   <p>
//                     From: <strong>{selectedQuery.recipient_name}</strong>
//                   </p>
//                   <h2>{selectedQuery.subject || "Subject"}</h2>
//                 </div>
//               </div>
//               <div className="emp-chat-messages" ref={chatContainerRef}>
//                 {[...messages].reverse().map((message) => (
//                   <div
//                     key={message.id}
//                     className={`emp-message-container ${
//                       message.sender_id === employeeId ? "right" : "left"
//                     }`}
//                   >
//                     <div className="emp-message-header">
//                       <p className="emp-message-sender">
//                         {message.sender_name}
//                       </p>
//                     </div>
//                     <div className="emp-message">
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
//               <div className="emp-chat-input">
//                 <div className="input-container">
//                   <div className="input-wrapper">
//                     <input
//                       type="text"
//                       placeholder="Write a reply..."
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
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
//                     id="fileInput"
//                     style={{ display: "none" }}
//                     onChange={handleAttachmentChange}
//                     disabled={selectedQuery?.status === "closed"}
//                   />
//                 </div>
//                 <button
//                   className="emp-submit-btn"
//                   onClick={handleSendMessage}
//                   disabled={selectedQuery.status === "closed"}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="emp-select-query">
//               Select a query to view messages
//             </div>
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

// export default EmployeeQuery;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import { TbMessageOff } from "react-icons/tb";
import UserAvatar from "./UserAvatar";
import "./EmployeeQuery.css";
import Modal from "../Modal/Modal";

const EmployeeQuery = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;
  const departmentId = dashboardData.department_id || null;
  const name = dashboardData.name || null;
  const userRole = localStorage.getItem("userRole");

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const [recipientRole, setRecipientRole] = useState("");
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [threadToClose, setThreadToClose] = useState(null);

  const headers = {
    "x-api-key": API_KEY,
  };

  const feedbackOptions = [
    { value: "very unsatisfied", stars: 1 },
    { value: "unsatisfied", stars: 2 },
    { value: "satisfied", stars: 3 },
    { value: "very satisfied", stars: 4 },
  ];

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

  const selectedThreadIdRef = useRef(null);

  // whenever selectedQuery changes, update the ref
  useEffect(() => {
    selectedThreadIdRef.current = selectedQuery?.id ?? null;
  }, [selectedQuery]);

  // useEffect: init socket only when employeeId exists
  useEffect(() => {
    if (!employeeId) {
      console.warn("[socket] skipping connect because employeeId is missing");
      return;
    }

    socketRef.current = io(BACKEND_URL, {
      query: { userId: employeeId },
      auth: { apiKey: API_KEY },
      // optional: you may force websocket transport during debugging
      // transports: ["websocket"],
    });

    const socket = socketRef.current;

    const onConnect = () =>
      console.log("[socket] connected", socket.id, "userId=", employeeId);
    const onDisconnect = (reason) =>
      console.log("[socket] disconnected", reason);
    const onConnectError = (err) =>
      console.error("[socket] connect_error", err);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("newMessage", (msg) => {
      console.log("[socket] newMessage received:", msg);
      if (String(msg.thread_id) === String(selectedThreadIdRef.current)) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchEmpQueries();
    });

    socket.on("messageAck", (msg) => {
      console.log("[socket] messageAck received:", msg);
      if (String(msg.thread_id) === String(selectedThreadIdRef.current)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("error", (err) => console.error("[socket] error:", err));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("newMessage");
      socket.off("messageAck");
      socket.off("error");
      socket.disconnect();
    };
  }, [BACKEND_URL, API_KEY, employeeId]); // will re-run only when employeeId changes

  const fetchEmpQueries = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/threads/employee/${employeeId}`,
        { headers }
      );
      if (response.data.status === "success") {
        setQueries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employee queries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchEmpQueries();
  }, [employeeId]);

  // Join room when a thread is selected
  useEffect(() => {
    if (!selectedQuery) return;
    socketRef.current.emit("joinThread", selectedQuery.id);
    // Fetch history once
    axios
      .get(`${BACKEND_URL}/threads/${selectedQuery.id}/messages`, { headers })
      .then((res) => setMessages(res.data.data))
      .catch((e) => console.error(e));
  }, [selectedQuery]);

  useEffect(() => {
    // Scroll to bottom
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

  const startThread = async () => {
    if (!recipientRole || !subject || !query) {
      showAlert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/threads`,
        {
          sender_id: employeeId,
          sender_role: userRole,
          role: recipientRole,
          department_id: departmentId,
          subject: subject,
          message: query,
        },
        { headers }
      );

      setThreadId(response.data.threadId);
      showAlert("Thread started successfully!");
      setShowModal(false);
      await fetchEmpQueries();
    } catch (error) {
      console.error("Error starting thread:", error);
      showAlert("Failed to start thread. Please try again.");
    }
  };

  const handleSelectQuery = async (query) => {
    setSelectedQuery(query);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/threads/${query.id}/messages`,
        { headers }
      );
      setMessages(response.data.data);

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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentName(file.name);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedQuery) return;

    // 1️⃣ Attachment via REST+Multer
    if (attachmentFile) {
      const formData = new FormData();
      formData.append("attachment", attachmentFile);
      formData.append("sender_id", employeeId);
      formData.append("sender_role", userRole);
      formData.append("recipient_id", selectedQuery.recipient_id);
      formData.append("message", inputMessage);

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

        // *** HERE IS THE NEW CODE ***
        const { message: newMsg } = res.data.data; // <- your handler returns { data: { message: newMessage } }
        setMessages((prev) => [...prev, newMsg]);

        // reset UI
        setInputMessage("");
        setAttachmentFile(null);
        setAttachmentName("");
      } catch (err) {
        console.error(err);
        showAlert("Failed to send attachment");
      }
      return;
    }
    if (!inputMessage?.trim()) {
      showAlert("Please enter a message.");
      return;
    }

    const payload = {
      thread_id: selectedQuery.id,
      sender_id: employeeId,
      sender_role: userRole,
      recipient_id: selectedQuery.recipient_id,
      sender_name: name,
      message: inputMessage,
    };

    // DEBUG log
    console.log(
      "[client] sendQueryMessage -> payload:",
      payload,
      "socketConnected=",
      !!socketRef.current?.connected
    );

    // If socket is connected, use it with ack callback. Otherwise fallback to REST.
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("sendQueryMessage", payload, (resp) => {
        console.log("[client] sendQueryMessage ack:", resp);
        if (resp && resp.success && resp.message) {
          setMessages((prev) => [...prev, resp.message]);
          setInputMessage("");
        } else {
          console.error("sendQueryMessage failed (socket):", resp);
          showAlert(
            "Failed to send message via socket. Trying REST fallback..."
          );
          // Try REST fallback:
          (async () => {
            try {
              const res = await axios.post(
                `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
                {
                  sender_id: employeeId,
                  sender_role: userRole,
                  recipient_id: selectedQuery.recipient_id,
                  message: inputMessage,
                },
                { headers: { "x-api-key": API_KEY } }
              );
              const newMsg = res.data.data.message;
              setMessages((prev) => [...prev, newMsg]);
              setInputMessage("");
            } catch (err) {
              console.error("REST fallback failed:", err);
              showAlert("Failed to send message. Please try again.");
            }
          })();
        }
      });
    } else {
      // REST fallback when socket not connected
      try {
        console.log("[client] socket not connected — using REST fallback");
        const res = await axios.post(
          `${BACKEND_URL}/threads/${selectedQuery.id}/messages`,
          {
            sender_id: employeeId,
            sender_role: userRole,
            recipient_id: selectedQuery.recipient_id,
            message: inputMessage,
          },
          { headers: { "x-api-key": API_KEY } }
        );
        const newMsg = res.data.data.message;
        setMessages((prev) => [...prev, newMsg]);
        setInputMessage("");
      } catch (err) {
        console.error("REST send failed:", err);
        showAlert("Failed to send message. Please try again.");
      }
    }
  };

  const openFeedbackModal = (threadId) => {
    setThreadToClose(threadId);
    setShowFeedbackModal(true);
  };

  const closeThread = async () => {
    if (!feedback) {
      showAlert("Please select your feedback.");
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

      showAlert("Thread closed successfully.");
      closeFeedbackModal();

      setQueries((prevQueries) =>
        prevQueries.map((q) =>
          q.id === threadToClose ? { ...q, status: "closed" } : q
        )
      );
      setShowThankYouModal(true);
    } catch (error) {
      console.error("Error closing thread:", error);
      showAlert("Failed to close thread. Please try again.");
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setThreadToClose(null);
    setFeedback("");
  };

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
    <div className="emp-query-container">
      <div className="emp-query-header">
        <h2>Employee Queries</h2>
        <button className="compose-button" onClick={() => setShowModal(true)}>
          <BiEdit className="compose-icon" /> Compose
        </button>
      </div>
      <div className="emp-query-content">
        {/* Sidebar */}
        <div className="emp-sidebar">
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
          <div className="emp-query-list">
            {loading ? (
              <p>Loading...</p>
            ) : queries.length === 0 ? (
              <p>No queries found</p>
            ) : (
              queries
                .filter((query) =>
                  showResolved
                    ? query.status === "closed"
                    : query.status !== "closed"
                )
                .map((query) => (
                  <div
                    key={query.id}
                    className={`emp-query-item ${
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
                    <div className="emp-query-info">
                      <div className="emp-query-header">
                        <p className="emp-name">{query.recipient_name}</p>
                        {query.unread_message_count > 0 && (
                          <p className="emp-unread-dot">
                            {query.unread_message_count > 9
                              ? "9+"
                              : query.unread_message_count}
                          </p>
                        )}
                        <p className="time">
                          {query.updated_at
                            ? new Date(query.updated_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <p
                        className={`emp-message-preview ${
                          query.unread_message_count > 0 ? "unread-message" : ""
                        }`}
                      >
                        {query.latest_message || "No messages yet"}
                      </p>
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
                <MdOutlineCancel
                  className="emp-close-button"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="employee-query-form">
                <div className="employee-query-field">
                  <label
                    htmlFor="recipientRole"
                    className="employee-query-label"
                  >
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
                    {userRole !== "Manager" && (
                      <option value="Manager">Manager</option>
                    )}
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
                  <label className="employee-query-label">My Query</label>
                  <textarea
                    id="query"
                    placeholder="Text field"
                    className="employee-query-textarea"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  className="empform-cancel-button"
                  onClick={() => setShowModal(false)}
                >
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
                <MdOutlineCancel
                  className="emp-close-button"
                  onClick={closeFeedbackModal}
                />
              </div>

              <div className="feedback-options">
                <p className="feedback-para">
                  Great!! <br />
                  I hope your query has been resolved. If not, click “Cancel” to
                  continue. Please provide your valuable Rating and Feedback
                  before you end your conversation. <br />
                  <span className="stars-info">
                    1 star is low and 4 stars are the highest rating.
                  </span>
                </p>

                <div className="stars-container">
                  {feedbackOptions.map((option, index) => (
                    <span
                      key={option.value}
                      className={`star ${
                        index <=
                        feedbackOptions.findIndex((o) => o.value === feedback)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setFeedback(option.value)}
                    >
                      ★
                    </span>
                  ))}
                </div>

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

              <button
                className="empform-cancel-button"
                onClick={closeFeedbackModal}
              >
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
                <MdOutlineCancel
                  className="emp-close-button"
                  onClick={() => setShowThankYouModal(false)}
                />
              </div>
              <div className="feedback-options">
                <p className="thank-you">Thanks for your valuable feedback</p>
              </div>
              <div className="thank-button">
                <button
                  className="thank-close"
                  onClick={() => setShowThankYouModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="emp-chat-container">
          {selectedQuery ? (
            <>
              <div className="emp-chat-header">
                <div className="end">
                  <button
                    className="close-thread-button"
                    onClick={() => openFeedbackModal(selectedQuery.id)}
                    disabled={selectedQuery.status === "closed"}
                  >
                    <TbMessageOff className="close-thread-icon" /> End Query
                  </button>
                </div>
                <div>
                  <p>
                    {new Date(selectedQuery.created_at).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                  <p>
                    From: <strong>{selectedQuery.recipient_name}</strong>
                  </p>
                  <h2>{selectedQuery.subject || "Subject"}</h2>
                </div>
              </div>
              <div className="emp-chat-messages" ref={chatContainerRef}>
                {[...messages].reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`emp-message-container ${
                      message.sender_id === employeeId ? "right" : "left"
                    }`}
                  >
                    <div className="emp-message-header">
                      <p className="emp-message-sender">
                        {message.sender_name}
                      </p>
                    </div>
                    <div className="emp-message">
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
              <div className="emp-chat-input">
                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
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
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleAttachmentChange}
                    disabled={selectedQuery?.status === "closed"}
                  />
                </div>
                <button
                  className="emp-submit-btn"
                  onClick={handleSendMessage}
                  disabled={selectedQuery.status === "closed"}
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <div className="emp-select-query">
              Select a query to view messages
            </div>
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

export default EmployeeQuery;