// NoteDetailPanel.jsx
import React from "react";
import "./NoteDetailPanel.css";

export default function NoteDetailPanel({ note, onClose }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="note-close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{note.client_company}</h2>
        <p>
          <strong>POC:</strong> {note.contact_name}
        </p>
        <p>
          <strong>Purpose:</strong> {note.purpose}
        </p>
        <p>
          <strong>Description:</strong> {note.description}
        </p>
        <p>
          <strong>Action Points:</strong>
          <br /> {note.action_points}
        </p>
        <p>
          <strong>Assigned To:</strong> {note.assigned_to}
        </p>
        <p>
          <strong>Follow-up:</strong>{" "}
          {new Date(note.follow_up_date).toLocaleString()}
        </p>
      </aside>
    </div>
  );
}
