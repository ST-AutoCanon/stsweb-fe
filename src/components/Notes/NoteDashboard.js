import React, { useState, useEffect } from "react";
import AddNotePanel from "./AddNotePanel";
import VoiceNoteFlow from "./VoiceNoteFlow";
import "./NoteDashboard.css";
import { LuFilePlus } from "react-icons/lu";
import NoteDetailPanel from "./NoteDetailPanel";

export default function NoteDashboard({ highlightedId }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [detailNote, setDetailNote] = useState(null);
  const highlightMeetingId = highlightedId ? Number(highlightedId) : null;

  // Helper: return local YYYY-MM-DD (not UTC!)
  const getLocalDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Track the start of the current week (Monday). Initialize to today’s Monday.
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 (Sun) – 6 (Sat)
    const diff = (day === 0 ? -6 : 1) - day; // if Sunday, go back 6 days; else go to Monday
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  // Build an array of 7 Date objects (Mon → Sun) based on weekStart
  const getWeekDates = (monday) => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      arr.push(d);
    }
    return arr;
  };
  const weekDates = getWeekDates(weekStart);

  // Track which date (YYYY-MM-DD) has been clicked to show its cards, default = today (local)
  const [selectedDateKey, setSelectedDateKey] = useState(
    getLocalDateKey(new Date())
  );

  // Fetch only this user’s meetings on mount
  useEffect(() => {
    const fetchMeetings = async () => {
      setLoadingMeetings(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/meetings`,
          {
            method: "GET",
            headers: {
              "x-api-key": process.env.REACT_APP_API_KEY,
              "x-employee-id": JSON.parse(
                localStorage.getItem("dashboardData") || "{}"
              ).employeeId,
            },
          }
        );
        if (!res.ok) {
          console.error("Failed to fetch meetings:", res.statusText);
          setLoadingMeetings(false);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setMeetings(json.meetings);
        } else {
          console.error("Backend error fetching meetings:", json.message);
        }
      } catch (err) {
        console.error("Network error fetching meetings:", err);
      } finally {
        setLoadingMeetings(false);
      }
    };
    fetchMeetings();
  }, []);

  // When a new voice note is saved, add it to meetings
  const handleVoiceDone = (newRecord) => {
    setSelectedOption(null);
    setMeetings((prev) => [newRecord, ...prev]);
  };

  // Helper to format "DD" and weekday and month abbreviations
  const formatDateHeader = (dateObj) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      dayNum: String(dateObj.getDate()).padStart(2, "0"),
      month: months[dateObj.getMonth()],
      weekday: dayNames[dateObj.getDay()],
    };
  };

  // When user clicks on a date header
  const onDateClick = (dateObj) => {
    setSelectedDateKey(getLocalDateKey(dateObj));
  };

  // Move weekStart backward or forward by 7 days
  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };
  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  // Filter meetings that were created on selectedDateKey
  const notesForSelectedDate = meetings.filter((m) => {
    const createdKey = getLocalDateKey(new Date(m.created_at));
    return createdKey === selectedDateKey;
  });

  const onPanelSelect = (type) => {
    setSelectedOption(type);
    setAddMode(false);
  };

  useEffect(() => {
    if (!highlightMeetingId || meetings.length === 0) return;
    const note = meetings.find((m) => m.id === highlightMeetingId);
    if (!note) return;

    // Reset the calendar to that note’s date
    const targetDate = new Date(note.created_at);
    setWeekStart(getMonday(targetDate));
    setSelectedDateKey(getLocalDateKey(targetDate));

    // 2) Wait for cards to render, then scroll into view & highlight
    setTimeout(() => {
      const el = document.getElementById(`note-card-${note.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight");
        // Remove highlight after a couple seconds
        setTimeout(() => el.classList.remove("highlight"), 3000);
      }
    }, 100);
  }, [highlightMeetingId, meetings]);

  return (
    <div className="note-dashboard-container">
      {/* Header row: title + Add button */}
      <div className="nt-header-row">
        <h2 className="dashboard-title">My Notes</h2>
        <button className="nt-add-button" onClick={() => setAddMode(true)}>
          <LuFilePlus size={24} /> Add new Note
        </button>
      </div>

      {/* If in add mode (clicked “Add new Note”), show the panel */}
      {addMode && !selectedOption && <AddNotePanel onSelect={onPanelSelect} />}

      {selectedOption === "voice" && (
        <div className="voice-flow-wrapper">
          <VoiceNoteFlow onDone={handleVoiceDone} />
        </div>
      )}

      {!addMode && !selectedOption && (
        <div className="notes-box">
          <div className="week-grid">
            <div className="month-label">
              {weekDates[0].toLocaleString("default", { month: "long" })}{" "}
              {weekDates[0].getFullYear()}
            </div>
            <button
              className="nav-button"
              onClick={prevWeek}
              aria-label="Previous Week"
            >
              &lt;
            </button>
            {weekDates.map((dateObj) => {
              const { dayNum, weekday } = formatDateHeader(dateObj);
              // Compare local Y/M/D rather than ISO
              const today = new Date();
              const isToday =
                dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();

              const dateKey = getLocalDateKey(dateObj);
              const isSelected = dateKey === selectedDateKey;

              return (
                <div key={dateKey} className="day-column">
                  <div
                    className={`date-header ${isToday ? "today" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => onDateClick(dateObj)}
                  >
                    <div className="date-number">{dayNum}</div>
                    <div className="date-weekday">{weekday}</div>
                  </div>
                </div>
              );
            })}
            <button
              className="nav-button"
              onClick={nextWeek}
              aria-label="Next Week"
            >
              &gt;
            </button>
          </div>

          {/* Notes for the selected date (grid of colorful cards) */}
          <section className="notes-grid-section">
            {loadingMeetings ? (
              <p>Loading your notes…</p>
            ) : notesForSelectedDate.length === 0 ? (
              <p>No notes created on this date.</p>
            ) : (
              <div className="notes-cards-grid">
                <>
                  {notesForSelectedDate.map((m) => (
                    <div
                      id={`note-card-${m.id}`}
                      key={m.id}
                      className={`note-card-card ${
                        m.id === highlightMeetingId ? "highlight" : ""
                      } ${
                        m.id % 4 === 0
                          ? "color-card-1"
                          : m.id % 4 === 1
                          ? "color-card-2"
                          : m.id % 4 === 2
                          ? "color-card-3"
                          : "color-card-4"
                      }`}
                      onClick={() => setDetailNote(m)}
                    >
                      <h3 className="note-card-title">{m.client_company}</h3>
                      <p className="note-card-subtitle">{m.contact_name}</p>
                      <div className="note-card-body">{m.purpose}</div>
                      <div className="note-card-footer">
                        Reminder:{" "}
                        {new Date(m.follow_up_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(m.follow_up_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Drawer */}
                  {detailNote && (
                    <NoteDetailPanel
                      note={detailNote}
                      onClose={() => setDetailNote(null)}
                    />
                  )}
                </>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
