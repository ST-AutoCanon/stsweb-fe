// src/components/ChatWindow.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import FileUpload from "./FileUpload";
import "./ChatWindow.css";
import {
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaUsers,
  FaTrash,
} from "react-icons/fa";
import UserAvatar from "../EmployeeQueries/UserAvatar";
import Picker from "emoji-picker-react";
import MemberListModal from "./MemberListModal";
import Modal from "../Modal/Modal";

export default function ChatWindow({ room }) {
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);

  // --- Alert modal state for delete-confirm ---
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const showAlert = ({ title = "", message, onConfirm }) => {
    setAlertModal({ isVisible: true, title, message, onConfirm });
  };
  const closeAlert = () =>
    setAlertModal({
      isVisible: false,
      title: "",
      message: "",
      onConfirm: null,
    });

  const socket = useSocket();
  const messagesRef = useRef();
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;

  const headers = {
    "x-api-key": process.env.REACT_APP_API_KEY,
    "x-employee-id": meId,
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        emojiRef.current &&
        !emojiRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // -- Load history --
  useEffect(() => {
    if (!room || room.isNew) return;
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/rooms/${room.id}/messages`, {
        headers,
      })
      .then((r) => setMsgs(r.data))
      .catch(console.error);
  }, [room]);

  // -- Realtime incoming --
  useEffect(() => {
    const handler = (m) => {
      if (m.roomId !== room?.id) return;
      const normalized = {
        id: m.id,
        sender_id: m.senderId,
        sender_name: m.senderName,
        content: m.content,
        photo_url: m.photoUrl ?? m.photo_url,
        type: m.type,
        file_url: m.fileUrl ?? m.file_url,
        sent_at: m.sentAt ?? m.sent_at,
      };
      setMsgs((ms) => [...ms, normalized]);
    };
    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }, [socket, room]);

  useEffect(() => {
    const box = messagesRef.current;
    if (box) {
      // jump or smooth scroll as you like
      box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    }
  }, [msgs]);

  // -- Send text message --
  const send = () => {
    if (!txt.trim() || !room) return;
    socket.emit("send_message", {
      roomId: room.id,
      content: txt,
      type: "text",
    });
    setTxt("");
    setShowEmojiPicker(false);
  };

  // -- Upload file message --
  const onFileUploaded = (url) => {
    socket.emit("send_message", {
      roomId: room.id,
      content: "",
      type: "file",
      fileUrl: url,
    });
  };

  // -- Emoji picker handler --
  const onEmojiClick = (a, b) => {
    const emojiObj = a.emoji ? a : b.emoji ? b : null;
    if (emojiObj) setTxt((prev) => prev + emojiObj.emoji);
  };

  const downloadFile = async (fileUrl, suggestedName) => {
    const base = process.env.REACT_APP_BACKEND_URL.replace(/\/+$/, "");
    const path = fileUrl.replace(/^\/+/, "");
    const url = `${base}/${path}`;

    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        console.error("❌ response not OK");
        alert(`Could not download file (status ${resp.status})`);
        return;
      }

      const contentType = resp.headers.get("Content-Type") || "(none)";

      let filename = suggestedName || "";
      if (!filename) {
        const dispo = resp.headers.get("Content-Disposition");
        if (dispo && dispo.includes("filename=")) {
          filename = dispo.split("filename=")[1].replace(/["']/g, "");
        } else {
          filename = path.split("/").pop();
        }
      }

      const buffer = await resp.arrayBuffer();
      const blob = new Blob([buffer], { type: contentType });

      // 🛠 Step 6: createObjectURL & click
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // 🛠 Step X: network / unexpected error
      console.error("🚨 downloadFile error:", err);
      alert("Network error when downloading. Check console for details.");
    }
  };

  // -- Load group members --
  useEffect(() => {
    if (room?.is_group === 1) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/rooms/${room.id}/members`, {
          headers,
        })
        .then((r) => setMembers(r.data))
        .catch(console.error);
    } else {
      setMembers([]);
    }
  }, [room]);

  if (!room) return <div className="chat-window empty">Select a chat</div>;

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="m-header">
        <UserAvatar
          photoUrl={room.photo_url}
          role={room.role}
          gender={room.gender}
          apiKey={process.env.REACT_APP_API_KEY}
          className="header-avatar"
        />
        <div className="chat-header-title">{room.name}</div>
        {room.is_group === 1 && (
          <button
            className="members-btn"
            onClick={() => setShowMembers(true)}
            title="View members"
          >
            <FaUsers />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="messages" ref={messagesRef}>
        {msgs.map((m) => {
          const isMe = m.sender_id === meId;
          return (
            <div
              key={m.id || m.sent_at}
              className={`msg-row ${isMe ? "me" : "them"}`}
            >
              {!isMe && (
                <UserAvatar
                  photoUrl={m.photo_url}
                  role={m.sender_role}
                  gender={m.sender_gender}
                  apiKey={process.env.REACT_APP_API_KEY}
                  className="msg-avatar"
                />
              )}

              <div
                className={`msg-bubble ${isMe ? "me-bubble" : "them-bubble"}`}
              >
                {room.is_group === 1 && !isMe && m.sender_name && (
                  <div className="msg-sender">{m.sender_name}</div>
                )}
                {m.type === "text" ? (
                  m.content
                ) : (
                  <button
                    className="msg-download-btn"
                    onClick={() => downloadFile(m.file_url, m.file_name)}
                  >
                    <FaPaperclip /> Download
                  </button>
                )}
                <div className="msg-time">
                  {new Date(m.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* delete icon for your own messages */}
              {isMe && (
                <button
                  className="msg-delete-btn"
                  onClick={() =>
                    showAlert({
                      message:
                        "Are you sure you want to permanently delete this message?",
                      onConfirm: async () => {
                        try {
                          await axios.delete(
                            `${process.env.REACT_APP_BACKEND_URL}/rooms/${room.id}/messages/${m.id}`,
                            { headers }
                          );
                          setMsgs((old) => old.filter((x) => x.id !== m.id));
                        } catch (e) {
                          console.error(e);
                          alert("Could not delete message");
                        }
                        closeAlert();
                      },
                    })
                  }
                  title="Delete message"
                >
                  <FaTrash />
                </button>
              )}
              {isMe && <div className="msg-spacer" />}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="emoji-picker-container">
          <button
            className="icon-btn"
            onClick={() => setShowEmojiPicker((o) => !o)}
          >
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div className="emoji-dropdown" ref={emojiRef}>
              {" "}
              <Picker
                onEmojiClick={onEmojiClick}
                pickerStyle={{ width: "100%" }}
              />
            </div>
          )}
        </div>

        <FileUpload onUpload={onFileUploaded}>
          {(open) => (
            <button className="icon-btn" onClick={open}>
              <FaPaperclip />
            </button>
          )}
        </FileUpload>
        <textarea
          className="m-input"
          rows={2}
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="send-btn" onClick={send}>
          <FaPaperPlane />
        </button>
      </div>

      {/* Members modal */}
      {showMembers && (
        <MemberListModal
          roomId={room.id}
          members={members}
          setMembers={setMembers}
          onClose={() => setShowMembers(false)}
          apiKey={process.env.REACT_APP_API_KEY}
        />
      )}

      {/* our custom confirm dialog */}
      <Modal
        isVisible={alertModal.isVisible}
        title={alertModal.title}
        onClose={closeAlert}
        buttons={[
          { label: "Cancel", className: "cancel-btn", onClick: closeAlert },
          {
            label: "Delete",
            className: "confirm-btn",
            onClick: alertModal.onConfirm,
          },
        ]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
}
