import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import UserAvatar from "../EmployeeQueries/UserAvatar";
import GroupModal from "./GroupModal";
import { FaTrash } from "react-icons/fa";
import "./ChatList.css";
import Modal from "../Modal/Modal";

export default function ChatList({ onSelect }) {
  const socket = useSocket();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState("private");
  const [mode, setMode] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);

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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/rooms`, {
        withCredentials: true,
        headers,
      })
      .then((r) => setRooms(r.data))
      .catch(() => setRooms([]));

    socket.on("room_created", (newRoom) => {
      setRooms((rs) => [newRoom, ...rs]);
      const id = newRoom.id;
      setActiveId(id);
      onSelect(newRoom);
    });
    return () => socket.off("room_created");
  }, [socket, onSelect]);

  useEffect(() => {
    if (tab === "private") {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/employees`, {
          withCredentials: true,
          headers,
        })
        .then((r) => setEmployees(r.data.data || []))
        .catch(() => setEmployees([]));
    }
  }, [tab]);

  const filteredRooms = rooms.filter((r) =>
    r.is_group ? tab === "group" : tab === "private"
  );
  const suggestions = employees.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteGroup = (roomId) => {
    showAlert({
      message: "Are you sure you want to delete this group permanently?",
      onConfirm: async () => {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`,
          { withCredentials: true, headers }
        );
        setRooms((rs) => rs.filter((r) => r.id !== roomId));
        if (activeId === roomId) setActiveId(null);
        closeAlert();
      },
    });
  };

  return (
    <div className="chat-list">
      <div className="chat-tabs">
        <button
          className={tab === "private" ? "active" : ""}
          onClick={() => {
            setTab("private");
            setMode(null);
            setActiveId(null);
          }}
        >
          Private
        </button>
        <button
          className={tab === "group" ? "active" : ""}
          onClick={() => {
            setTab("group");
            setMode(null);
            setActiveId(null);
          }}
        >
          Group
        </button>
      </div>

      <div className="new-chat-area">
        {tab === "private" ? (
          <>
            <input
              className="chat-search"
              placeholder="Search or start new…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="search-suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((u) => (
                    <div
                      key={u.employee_id}
                      className="suggestion-item"
                      onClick={() => {
                        socket.emit("create_room", {
                          name: "",
                          isGroup: false,
                          members: [u.employee_id],
                        });
                        setSearchTerm("");
                      }}
                    >
                      <UserAvatar
                        photoUrl={u.photo_url}
                        role={u.role}
                        gender={u.gender}
                        apiKey={API_KEY}
                        className="chat-avatar-small"
                      />
                      <span>{u.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-suggest">No users found</div>
                )}
              </div>
            )}
          </>
        ) : (
          <button className="new-group-btn" onClick={() => setMode("group")}>
            + New Group
          </button>
        )}
      </div>

      <div className="rooms-container">
        {filteredRooms.map((r) => (
          <div key={r.id} className="chat-list-item-wrapper">
            <div
              className={`chat-list-item ${activeId === r.id ? "active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                setActiveId(r.id);
                onSelect(r);
              }}
            >
              <UserAvatar
                photoUrl={r.photo_url}
                role={r.role}
                gender={r.gender}
                apiKey={API_KEY}
                className="chat-avatar"
              />
              <span className="chat-name">
                {r.name}
                {r.unreadCount > 0 && (
                  <span className="unread-badge">{r.unreadCount}</span>
                )}
              </span>
            </div>
            {r.is_group === 1 && r.createdBy === meId && (
              <button
                className="delete-group-btn"
                onClick={() => deleteGroup(r.id)}
                title="Delete group"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
        {filteredRooms.length === 0 && (
          <div className="empty-placeholder">
            {tab === "private" ? "No private chats" : "No groups yet"}
          </div>
        )}
      </div>

      {mode === "group" && (
        <GroupModal
          onCreate={() => setMode(null)}
          onClose={() => setMode(null)}
        />
      )}

      <Modal
        isVisible={alertModal.isVisible}
        title={alertModal.title}
        onClose={closeAlert}
        buttons={[
          { label: "Cancel", onClick: closeAlert },
          {
            label: "Delete",
            onClick: alertModal.onConfirm,
          },
        ]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
}
