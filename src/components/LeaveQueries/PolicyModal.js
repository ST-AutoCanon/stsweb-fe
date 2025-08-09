// src/components/PolicyModal.js
import React, { useState, useEffect } from "react";
import "./PolicyModal.css";
import {
  MdOutlineCancel,
  MdDeleteOutline,
  MdAddCircleOutline,
  MdOutlineEdit,
} from "react-icons/md";

const API_BASE = process.env.REACT_APP_BACKEND_URL;
const headers = {
  "x-api-key": process.env.REACT_APP_API_KEY,
  "Content-Type": "application/json",
};

// Built-in leave types
const BUILT_IN = [
  { key: "casual", label: "Casual Leave" },
  { key: "earned", label: "Earned Leave" },
];

export default function PolicyModal({ isOpen, onClose }) {
  const [policies, setPolicies] = useState([]);
  const [alert, setAlert] = useState(null);

  // form state: id null = create, non-null = editing
  const [form, setForm] = useState({
    id: null,
    period: "yearly",
    yearStart: "",
    yearEnd: "",
    config: BUILT_IN.reduce((acc, { key }) => {
      acc[key] = {
        enabled: false,
        value: "",
        carryForward: "",
        advanceNoticeDays: "", // NEW: days notice required before applying
        ...(key === "earned" ? { workingDays: "", earnedLeaves: "" } : {}),
      };
      return acc;
    }, {}),
    extras: [],
  });

  const showAlert = (msg) => setAlert(msg);
  const clearAlert = () => setAlert(null);

  // Fetch list whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/leave-policies`, {
          headers,
        });
        const json = await res.json();
        setPolicies(json.data || []);
      } catch {
        showAlert("Could not load policies.");
      }
    })();
    // reset form on open
    resetForm();
  }, [isOpen]);

  // Reset form to blank “create” state
  function resetForm() {
    setForm({
      id: null,
      period: "yearly",
      yearStart: "",
      yearEnd: "",
      config: BUILT_IN.reduce((acc, { key }) => {
        acc[key] = {
          enabled: false,
          value: "",
          carryForward: "",
          advanceNoticeDays: "",
          ...(key === "earned" ? { workingDays: "", earnedLeaves: "" } : {}),
        };
        return acc;
      }, {}),
      extras: [],
    });
    clearAlert();
  }

  // Re-calc end date when start or period changes
  useEffect(() => {
    if (!form.yearStart) {
      setForm((f) => ({ ...f, yearEnd: "" }));
      return;
    }
    const start = new Date(form.yearStart);
    const end = new Date(start);
    if (form.period === "half") end.setMonth(end.getMonth() + 6);
    else if (form.period === "quarter") end.setMonth(end.getMonth() + 3);
    else end.setFullYear(end.getFullYear() + 1);
    // inclusive
    end.setDate(end.getDate() - 1);
    setForm((f) => ({
      ...f,
      yearEnd: end.toISOString().split("T")[0],
    }));
  }, [form.yearStart, form.period]);

  // Helpers to update nested form state
  const updateForm = (patch) => setForm((f) => ({ ...f, ...patch }));
  const updateConfig = (key, patch) =>
    setForm((f) => ({
      ...f,
      config: { ...f.config, [key]: { ...f.config[key], ...patch } },
    }));
  const addExtra = () =>
    updateForm({
      extras: [
        ...form.extras,
        {
          id: Date.now(),
          label: "",
          value: "",
          carryForward: "",
          advanceNoticeDays: "",
        },
      ],
    });
  const removeExtra = (id) =>
    updateForm({ extras: form.extras.filter((r) => r.id !== id) });
  const updateExtra = (id, patch) =>
    updateForm({
      extras: form.extras.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });

  // Prefill form for editing
  const onEdit = (policy) => {
    const cfg = BUILT_IN.reduce((acc, { key }) => {
      const s =
        (policy.leave_settings || []).find((ls) => ls.type === key) || {};
      acc[key] = {
        enabled: !!s.enabled,
        value: s.value ?? "",
        carryForward: s.carry_forward ?? "",
        advanceNoticeDays: s.advance_notice_days ?? "", // NEW read-back
        workingDays: s.working_days ?? "",
        earnedLeaves: s.earned_leaves ?? "",
      };
      return acc;
    }, {});
    const extras = (policy.leave_settings || [])
      .filter((ls) => !BUILT_IN.some((b) => b.key === ls.type))
      .map((ls) => ({
        id: Date.now() + Math.random(),
        label: ls.type,
        value: ls.value ?? "",
        carryForward: ls.carry_forward ?? "",
        advanceNoticeDays: ls.advance_notice_days ?? "",
      }));
    setForm({
      id: policy.id,
      period: policy.period,
      yearStart: policy.year_start,
      yearEnd: policy.year_end,
      config: cfg,
      extras,
    });
    clearAlert();
  };

  // Submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, period, yearStart, yearEnd, config, extras } = form;
    // build settings array
    const settings = [
      ...BUILT_IN.filter(({ key }) => config[key].enabled).map(({ key }) => ({
        type: key,
        enabled: true,
        ...(key === "earned"
          ? {
              working_days: Number(config.earned.workingDays) || 0,
              earned_leaves: Number(config.earned.earnedLeaves) || 0,
            }
          : { value: Number(config[key].value) || 0 }),
        carry_forward: Number(config[key].carryForward) || 0,
        advance_notice_days: Number(config[key].advanceNoticeDays || 0), // NEW!
      })),
      ...extras.map(({ label, value, carryForward, advanceNoticeDays }) => ({
        type: label.trim() || "Custom",
        enabled: true,
        value: Number(value) || 0,
        carry_forward: Number(carryForward) || 0,
        advance_notice_days: Number(advanceNoticeDays || 0),
      })),
    ];
    const payload = {
      period,
      year_start: yearStart,
      year_end: yearEnd,
      leave_settings: settings,
    };
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE}/api/leave-policies/${id}`
      : `${API_BASE}/api/leave-policies`;
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      // refresh list, close
      const fresh = await fetch(`${API_BASE}/api/leave-policies`, { headers });
      const json = await fresh.json();
      setPolicies(json.data || []);
      onClose();
    } catch {
      showAlert("Failed to save policy.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    await fetch(`${API_BASE}/api/leave-policies/${id}`, {
      method: "DELETE",
      headers,
    });
    // refresh
    const fresh = await fetch(`${API_BASE}/api/leave-policies`, { headers });
    const json = await fresh.json();
    setPolicies(json.data || []);
  };

  if (!isOpen) return null;
  return (
    <div className="policy-modal-overlay">
      <div className="policy-modal">
        <header className="policy-modal-header">
          <h3>Leave Policy Management</h3>
          <MdOutlineCancel className="policy-modal-close" onClick={onClose} />
        </header>

        <section className="policy-modal-body">
          {alert && <div className="policy-alert">{alert}</div>}

          <form onSubmit={handleSubmit} className="leave-config-form">
            {/* Period */}
            <div className="period-row">
              <label>Period</label>
              <select
                value={form.period}
                onChange={(e) => updateForm({ period: e.target.value })}
              >
                <option value="yearly">Yearly</option>
                <option value="half">Half-Yearly</option>
                <option value="quarter">Quarterly</option>
              </select>
            </div>

            {/* Dates */}
            <div className="year-range">
              <label>
                Start Date
                <input
                  type="date"
                  value={form.yearStart}
                  onChange={(e) => updateForm({ yearStart: e.target.value })}
                  required
                />
              </label>
              <label>
                End Date
                <input type="date" value={form.yearEnd} readOnly />
              </label>
            </div>

            {/* Add custom leave type */}
            <button type="button" className="add-extra-btn" onClick={addExtra}>
              <MdAddCircleOutline /> Add Leave Type
            </button>

            {/* Leave type rows */}
            <div className="leave-types-grid">
              {BUILT_IN.map(({ key, label }) => (
                <div key={key} className="leave-type-row">
                  <input
                    type="checkbox"
                    checked={form.config[key].enabled}
                    onChange={(e) =>
                      updateConfig(key, { enabled: e.target.checked })
                    }
                  />{" "}
                  {label}
                  {form.config[key].enabled && (
                    <>
                      {key === "earned" ? (
                        <>
                          <input
                            type="number"
                            placeholder="Worked days"
                            value={form.config.earned.workingDays}
                            onChange={(e) =>
                              updateConfig("earned", {
                                workingDays: e.target.value,
                              })
                            }
                            required
                          />
                          <input
                            type="number"
                            placeholder="Earned leaves"
                            value={form.config.earned.earnedLeaves}
                            onChange={(e) =>
                              updateConfig("earned", {
                                earnedLeaves: e.target.value,
                              })
                            }
                            required
                          />
                        </>
                      ) : (
                        <input
                          type="number"
                          placeholder="Leaves / year"
                          value={form.config[key].value}
                          onChange={(e) =>
                            updateConfig(key, { value: e.target.value })
                          }
                          required
                        />
                      )}

                      <input
                        type="number"
                        placeholder="Carry forward"
                        value={form.config[key].carryForward}
                        onChange={(e) =>
                          updateConfig(key, {
                            carryForward: e.target.value,
                          })
                        }
                        required
                      />

                      {/* NEW: advance notice days */}
                      <input
                        type="number"
                        placeholder="Apply before (days)"
                        value={form.config[key].advanceNoticeDays}
                        onChange={(e) =>
                          updateConfig(key, {
                            advanceNoticeDays: e.target.value,
                          })
                        }
                        min="0"
                      />
                    </>
                  )}
                </div>
              ))}

              {/* Extras */}
              {form.extras.map(
                ({ id, label, value, carryForward, advanceNoticeDays }) => (
                  <div key={id} className="leave-type-row extra-row">
                    <input
                      type="text"
                      placeholder="Leave name"
                      value={label}
                      onChange={(e) =>
                        updateExtra(id, { label: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Leaves / year"
                      value={value}
                      onChange={(e) =>
                        updateExtra(id, { value: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Carry forward"
                      value={carryForward}
                      onChange={(e) =>
                        updateExtra(id, { carryForward: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Apply before (days)"
                      value={advanceNoticeDays}
                      onChange={(e) =>
                        updateExtra(id, { advanceNoticeDays: e.target.value })
                      }
                      min="0"
                    />
                    <MdDeleteOutline
                      className="remove-extra"
                      onClick={() => removeExtra(id)}
                    />
                  </div>
                )
              )}
            </div>

            <button type="submit" className="policy-submit">
              {form.id ? "Update Policy" : "Create Policy"}
            </button>
          </form>

          {/* Table of existing policies */}
          <table className="policy-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Start</th>
                <th>End</th>
                <th>Settings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => {
                const parts = (p.leave_settings || []).map((ls) => {
                  const notice = ls.advance_notice_days
                    ? `, Notice ${ls.advance_notice_days}d`
                    : "";
                  if (ls.type === "earned") {
                    return `Earned: ${ls.earned_leaves}/${ls.working_days} (CF ${ls.carry_forward}${notice})`;
                  } else {
                    return `${ls.type}: ${ls.value} (CF ${ls.carry_forward}${notice})`;
                  }
                });
                return (
                  <tr key={p.id}>
                    <td>{p.period}</td>
                    <td>{new Date(p.year_start).toLocaleDateString()}</td>
                    <td>{new Date(p.year_end).toLocaleDateString()}</td>
                    <td>{parts.join(", ") || "—"}</td>
                    <td>
                      <MdOutlineEdit
                        className="policy-action-icon"
                        onClick={() => onEdit(p)}
                      />
                      <MdDeleteOutline
                        className="policy-action-icon"
                        onClick={() => handleDelete(p.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <footer className="policy-modal-footer">
          <button className="policy-modal-btn cancel" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
