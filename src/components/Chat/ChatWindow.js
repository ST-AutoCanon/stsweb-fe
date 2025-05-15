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
  const endRef = useRef();
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;

  const headers = {
    "x-api-key": process.env.REACT_APP_API_KEY,
    "x-employee-id": meId,
  };

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
        id: m.id ?? Date.now(),
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

  // -- Auto-scroll when msgs change --
  useEffect(
    () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
    [msgs]
  );

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

  // -- Download a file blob --
  const downloadFile = async (fileUrl, suggestedName) => {
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}${fileUrl}`, {
      headers,
    });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
      <div className="messages">
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
                    onClick={() => downloadFile(m.file_url, `file-${m.id}.pdf`)}
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
        <div ref={endRef} />
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
            <div className="emoji-dropdown">
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
