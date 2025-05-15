// src/components/MemberListModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserAvatar from "../EmployeeQueries/UserAvatar";
import Modal from "../Modal/Modal";
import "./MemberListModal.css";

export default function MemberListModal({
  roomId,
  members,
  setMembers,
  onClose,
  apiKey,
}) {
  const [allEmployees, setAllEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [creatorId, setCreatorId] = useState(null);

  const meId = JSON.parse(localStorage.getItem("dashboardData")).employeeId;
  const headers = {
    "x-api-key": apiKey,
    "x-employee-id": meId,
  };

  // helper to open our confirm modal
  const showAlert = ({ title, message, onConfirm }) => {
    setAlertModal({ isVisible: true, title, message, onConfirm });
  };
  const closeAlert = () =>
    setAlertModal({
      isVisible: false,
      title: "",
      message: "",
      onConfirm: null,
    });

  // load members + detect creator
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}/members`, {
        headers,
      })
      .then((res) => {
        setMembers(res.data);
        // first in array is the creatorId
        setCreatorId(res.data[0]?.creatorId);
      })
      .catch(console.error);
  }, [roomId, setMembers]);

  // load all employees for suggestions
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/employees`, { headers })
      .then((r) => setAllEmployees(r.data.data || []))
      .catch(console.error);
  }, []);

  // suggestions = those not already in members
  const suggestions = allEmployees.filter(
    (u) =>
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.employee_id.toLowerCase().includes(query.toLowerCase())) &&
      !members.some((m) => m.employee_id === u.employee_id)
  );

  // add a member
  const addMember = async (empId) => {
    setAdding(empId);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}/members`,
        { employeeId: empId },
        { headers }
      );
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}/members`,
        { headers }
      );
      setMembers(data);
      setQuery("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  // remove member via our custom confirm modal
  const confirmRemove = (empId) => {
    showAlert({
      message: "This will remove them from the group. Continue?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}/members/${empId}`,
            { headers }
          );
          const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}/members`,
            { headers }
          );
          setMembers(data);
        } catch (err) {
          console.error(err);
        }
        closeAlert();
      },
    });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="member-modal" onClick={(e) => e.stopPropagation()}>
          <h4>Group Members</h4>
          <ul className="member-list">
            {members.map((u) => (
              <li key={u.employee_id} className="member-item">
                <UserAvatar
                  photoUrl={u.photo_url}
                  role={u.role}
                  gender={u.gender}
                  apiKey={apiKey}
                  className="member-avatar"
                />
                <span className="member-name">
                  {u.name}
                  {u.employee_id === creatorId && (
                    <span className="creator-badge"> (Creator)</span>
                  )}
                </span>
                {creatorId === meId && u.employee_id !== creatorId && (
                  <button
                    className="remove-btn"
                    disabled={adding === u.employee_id}
                    onClick={() => confirmRemove(u.employee_id)}
                    title="Remove from group"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          <hr />

          {creatorId === meId && (
            <>
              <input
                type="text"
                placeholder="Add member by name or ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="member-search"
              />
              {query && (
                <ul className="suggestions-list">
                  {suggestions.length > 0 ? (
                    suggestions.map((u) => (
                      <li key={u.employee_id} className="suggestion-item">
                        <UserAvatar
                          photoUrl={u.photo_url}
                          role={u.role}
                          gender={u.gender}
                          apiKey={apiKey}
                          className="suggest-avatar"
                        />
                        <span>{u.name}</span>
                        <button
                          disabled={adding === u.employee_id}
                          onClick={() => addMember(u.employee_id)}
                        >
                          {adding === u.employee_id ? "Adding…" : "Add"}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="no-suggest">No matches</li>
                  )}
                </ul>
              )}
            </>
          )}

          <button className="member-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Custom confirm dialog */}
      <Modal
        isVisible={alertModal.isVisible}
        title={alertModal.title}
        onClose={closeAlert}
        buttons={[
          { label: "Cancel", className: "cancel-btn", onClick: closeAlert },
          {
            label: "Remove",
            className: "confirm-btn",
            onClick: alertModal.onConfirm,
          },
        ]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </>
  );
}
