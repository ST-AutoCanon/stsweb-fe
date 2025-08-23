// src/components/PolicyModal.js
import React, { useState, useEffect, useRef } from "react";
import "./PolicyModal.css";
import {
  MdOutlineCancel,
  MdDeleteOutline,
  MdAddCircleOutline,
  MdOutlineEdit,
} from "react-icons/md";
import Modal from "../Modal/Modal"; // <- using your reusable Modal component

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

/**
 * Props:
 *  - isOpen: boolean
 *  - onClose: fn
 *  - onSaved: fn
 *  - openPolicyId: optional id (number|string) -> when provided, modal will auto-edit that policy after policies load
 */
export default function PolicyModal({
  isOpen,
  onClose,
  onSaved,
  openPolicyId = null,
}) {
  const [policies, setPolicies] = useState([]);
  const [alert, setAlert] = useState(null);

  // NEW: alerts state (computed from policies)
  const [policyAlerts, setPolicyAlerts] = useState([]);

  // confirmation modal state for deletes
  const [confirmDelete, setConfirmDelete] = useState({
    isVisible: false,
    id: null,
    loading: false,
    message: "Are you sure you want to delete this policy?",
  });

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
        advanceNoticeDays: "",
        ...(key === "earned" ? { workingDays: "", earnedLeaves: "" } : {}),
      };
      return acc;
    }, {}),
    extras: [],
  });

  // local ref to know whether we've auto-opened the requested policy (prevent repeated onEdit)
  const autoOpenedRef = useRef(null);

  const showAlert = (msg) => setAlert(msg);
  const clearAlert = () => setAlert(null);

  // ----------------- ALERT LOGIC -----------------
  // compute days left until end date (integer)
  const daysUntil = (dateStr) => {
    if (!dateStr) return Infinity;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = d - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // compute alerts from policy list
  const computePolicyAlerts = (policyList = []) => {
    if (!Array.isArray(policyList)) return [];
    return (
      policyList
        .map((p) => {
          const daysLeft = daysUntil(p.year_end);
          // only show alerts for policies that have not yet ended (daysLeft >= 0)
          if (daysLeft < 0) return null;

          // severity: critical if within 5 days, warning if within 10 days
          let severity = null;
          if (daysLeft <= 5) severity = "critical"; // 2nd alert
          else if (daysLeft <= 10) severity = "warning"; // 1st alert

          if (!severity) return null;
          return {
            id: p.id,
            policy: p,
            daysLeft,
            severity,
          };
        })
        .filter(Boolean)
        // sort: most urgent first (critical before warning, then smaller daysLeft)
        .sort((a, b) => {
          const sevOrder = { critical: 0, warning: 1 };
          if (sevOrder[a.severity] !== sevOrder[b.severity]) {
            return sevOrder[a.severity] - sevOrder[b.severity];
          }
          return a.daysLeft - b.daysLeft;
        })
    );
  };

  // whenever policies update, recalc alerts
  useEffect(() => {
    setPolicyAlerts(computePolicyAlerts(policies));
  }, [policies]);

  // ----------------- Existing fetch when modal opens -----------------
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/leave-policies`, {
          headers,
        });
        const json = await res.json();
        const list = json.data || [];
        setPolicies(list);
        // After loading policies, attempt auto-extend for any ignored & ended policies
        runAutoExtendOnLoad(list);
      } catch {
        showAlert("Could not load policies.");
      }
    })();
    // reset form on open
    resetForm();
    // reset auto-open tracker when modal opens
    autoOpenedRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // When policies have loaded and an openPolicyId was provided, auto-open that policy for editing
  useEffect(() => {
    if (!isOpen || openPolicyId == null) return;
    if (!policies || policies.length === 0) return;
    // avoid repeatedly calling onEdit for the same id during this modal session
    if (autoOpenedRef.current === String(openPolicyId)) return;

    const found = policies.find((p) => String(p.id) === String(openPolicyId));
    if (found) {
      onEdit(found);
      autoOpenedRef.current = String(openPolicyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policies, openPolicyId, isOpen]);

  // ----------------- other helpers (unchanged) -----------------
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

  // persist policy alerts to localStorage so Notifications can pick them up
  useEffect(() => {
    try {
      const toStore = (policyAlerts || []).map((a) => ({
        id: `policy-${a.id}`, // local id prefix so we can identify them later
        type: "policy",
        message:
          a.severity === "critical"
            ? `Policy ending soon — ${a.daysLeft} day${
                a.daysLeft !== 1 ? "s" : ""
              } left`
            : `Policy ending in ${a.daysLeft} day${
                a.daysLeft !== 1 ? "s" : ""
              }`,
        policyId: a.id,
        year_start: a.policy?.year_start,
        year_end: a.policy?.year_end,
        daysLeft: a.daysLeft,
        severity: a.severity,
        triggered_at: new Date().toISOString(),
      }));
      localStorage.setItem("policyAlerts", JSON.stringify(toStore));
    } catch (err) {
      // non-fatal — if localStorage fails just continue
      console.error("Failed to persist policy alerts:", err);
    }
  }, [policyAlerts]);

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

  const onEdit = (policy) => {
    const cfg = BUILT_IN.reduce((acc, { key }) => {
      const s =
        (policy.leave_settings || []).find((ls) => ls.type === key) || {};
      acc[key] = {
        enabled: !!s.enabled,
        value: s.value ?? "",
        carryForward: s.carry_forward ?? "",
        advanceNoticeDays: s.advance_notice_days ?? "",
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

  // ----------------- NEW HELPER: overlap / duplicate check -----------------
  const hasOverlappingPolicy = (yearStart, yearEnd, ignoreId = null) => {
    if (!yearStart || !yearEnd) return false;
    const newStart = new Date(yearStart);
    const newEnd = new Date(yearEnd);
    newStart.setHours(0, 0, 0, 0);
    newEnd.setHours(0, 0, 0, 0);

    return policies.some((p) => {
      if (ignoreId && p.id === ignoreId) return false;
      if (!p.year_start || !p.year_end) return false;

      if (p.year_start === yearStart) return true;

      const existingStart = new Date(p.year_start);
      const existingEnd = new Date(p.year_end);
      existingStart.setHours(0, 0, 0, 0);
      existingEnd.setHours(0, 0, 0, 0);

      return newStart <= existingEnd && existingStart <= newEnd;
    });
  };

  // ----------------- UPDATED handleSubmit with client-side guard -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, period, yearStart, yearEnd, config, extras } = form;

    if (hasOverlappingPolicy(yearStart, yearEnd, id)) {
      showAlert(
        id
          ? "Another policy already uses this date range. Choose different dates or edit the existing policy."
          : "A policy already exists for this start/end date (or overlaps). Please pick different dates or edit the existing policy."
      );
      return;
    }

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
        advance_notice_days: Number(config[key].advanceNoticeDays || 0),
      })),
      ...extras.map(({ label, value, carryForward, advanceNoticeDays }) => ({
        type: (label || "").trim() || "Custom",
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
    const url = id
      ? `${API_BASE}/api/leave-policies/${id}`
      : `${API_BASE}/api/leave-policies`;
    try {
      const res = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      // refresh list inside modal (optional)
      const fresh = await fetch(`${API_BASE}/api/leave-policies`, { headers });
      const json = await fresh.json();
      const list = json.data || [];
      setPolicies(list);
      // After saving (create/update), clear any ignored/extended flags for this policy
      if (id) {
        try {
          localStorage.removeItem(`policyIgnored:${id}`);
          localStorage.removeItem(`policyExtended:${id}`);
        } catch (err) {
          /* ignore localStorage errors */
        }
      }
      // notify parent (Admin) that save completed so it can refresh global data
      if (typeof onSaved === "function") onSaved();
      onClose();
    } catch {
      showAlert("Failed to save policy.");
    }
  };

  const promptDelete = (id) => {
    setConfirmDelete({
      isVisible: true,
      id,
      loading: false,
      message: "Are you sure you want to delete this policy?",
    });
  };

  const handleConfirmDelete = async () => {
    const id = confirmDelete.id;
    if (!id) {
      setConfirmDelete({
        isVisible: false,
        id: null,
        loading: false,
        message: "",
      });
      return;
    }
    setConfirmDelete((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch(`${API_BASE}/api/leave-policies/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      // refresh list
      const fresh = await fetch(`${API_BASE}/api/leave-policies`, { headers });
      const json = await fresh.json();
      setPolicies(json.data || []);
      // clear any stored flags for the deleted policy
      try {
        localStorage.removeItem(`policyIgnored:${id}`);
        localStorage.removeItem(`policyExtended:${id}`);
      } catch (err) {
        /* ignore */
      }
      // notify parent
      if (typeof onSaved === "function") onSaved();
      // close confirm
      setConfirmDelete({
        isVisible: false,
        id: null,
        loading: false,
        message: "",
      });
    } catch (err) {
      setConfirmDelete((s) => ({ ...s, loading: false }));
      showAlert("Failed to delete policy.");
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({
      isVisible: false,
      id: null,
      loading: false,
      message: "",
    });
  };

  // ----------------- NEW: ignore action for alerts -----------------
  const handleIgnoreAlert = (policy) => {
    try {
      const key = `policyIgnored:${policy.id}`;
      const ts = new Date().toISOString();
      localStorage.setItem(key, ts);
      showAlert(
        "Alert ignored — if the policy ends and no changes are made, it will be auto-extended up to 3 months."
      );
      if (daysUntil(policy.year_end) < 0) {
        extendPolicyIfNeeded(policy, ts).catch((err) => {
          console.error("Auto-extend failed:", err);
        });
      }
    } catch (err) {
      console.error("Failed to record ignore:", err);
    }
  };

  // ----------------- NEW: auto-extend logic -----------------
  const extendPolicyIfNeeded = async (
    policy,
    ignoredAtISO = null,
    monthsToAdd = 3
  ) => {
    if (!policy || !policy.id || !policy.year_end) return false;

    const ignoredKey = `policyIgnored:${policy.id}`;
    const extendedKey = `policyExtended:${policy.id}`;

    try {
      if (!ignoredAtISO) {
        ignoredAtISO = localStorage.getItem(ignoredKey);
      }
      if (!ignoredAtISO) return false;

      if (localStorage.getItem(extendedKey)) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(policy.year_end);
      endDate.setHours(0, 0, 0, 0);

      if (endDate >= today) return false;

      if (policy.updated_at) {
        const updatedAt = new Date(policy.updated_at);
        const ignoredAt = new Date(ignoredAtISO);
        if (updatedAt > ignoredAt) return false;
      }

      const newEnd = new Date(policy.year_end);
      newEnd.setMonth(newEnd.getMonth() + monthsToAdd);
      newEnd.setHours(0, 0, 0, 0);
      const newEndISO = newEnd.toISOString().split("T")[0];

      const payload = {
        period: policy.period,
        year_start: policy.year_start,
        year_end: newEndISO,
        leave_settings: policy.leave_settings || [],
      };

      const res = await fetch(`${API_BASE}/api/leave-policies/${policy.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Extend API failed with status ${res.status}`);
      }

      localStorage.setItem(extendedKey, newEndISO);

      const fresh = await fetch(`${API_BASE}/api/leave-policies`, { headers });
      const json = await fresh.json();
      setPolicies(json.data || []);

      if (typeof onSaved === "function") onSaved();

      showAlert(
        `Policy automatically extended to ${newEnd.toLocaleDateString()} (grace extension).`
      );

      return true;
    } catch (err) {
      console.error("extendPolicyIfNeeded error:", err);
      return false;
    }
  };

  const runAutoExtendOnLoad = async (policyList = []) => {
    if (!Array.isArray(policyList) || policyList.length === 0) return;
    for (const p of policyList) {
      try {
        const ignoredAt = localStorage.getItem(`policyIgnored:${p.id}`);
        if (!ignoredAt) continue;
        if (localStorage.getItem(`policyExtended:${p.id}`)) continue;
        if (daysUntil(p.year_end) < 0) {
          await extendPolicyIfNeeded(p, ignoredAt, 3);
        }
      } catch (err) {
        console.error("runAutoExtendOnLoad error for policy", p.id, err);
      }
    }
  };

  // ----------------- UI / Render -----------------
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

          {policyAlerts.length > 0 && (
            <div
              className="policy-alerts-banner"
              role="region"
              aria-live="polite"
            >
              {policyAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`policy-alert-item ${
                    a.severity === "critical"
                      ? "alert-critical"
                      : "alert-warning"
                  }`}
                >
                  <div className="alert-left">
                    <div className="alert-title">
                      {a.severity === "critical"
                        ? "Policy ending soon — ACTION REQUIRED"
                        : "Policy ending soon"}
                    </div>
                    <div className="alert-body">
                      Policy period:{" "}
                      <strong>
                        {new Date(a.policy.year_start).toLocaleDateString()} —{" "}
                        {new Date(a.policy.year_end).toLocaleDateString()}
                      </strong>
                      {" • "}
                      <span className="days-left">
                        {a.daysLeft} day{a.daysLeft !== 1 ? "s" : ""} left
                      </span>
                    </div>
                  </div>

                  <div className="alert-actions">
                    <button
                      type="button"
                      className="alert-btn view-btn"
                      onClick={() => onEdit(a.policy)}
                      title="Open policy in editor"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="alert-btn ignore-btn"
                      onClick={() => handleIgnoreAlert(a.policy)}
                      title="Ignore this alert; if no changes are made after end, policy will be auto-extended up to 3 months"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="leave-config-form">
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

            <button type="button" className="add-extra-btn" onClick={addExtra}>
              <MdAddCircleOutline /> Add Leave Type
            </button>

            <div className="leave-types-grid">
              {BUILT_IN.map(({ key, label }) => (
                <div key={key} className="leave-type-row">
                  <input
                    type="checkbox"
                    checked={!!form.config[key]?.enabled}
                    onChange={(e) =>
                      updateConfig(key, { enabled: e.target.checked })
                    }
                  />{" "}
                  {label}
                  {form.config[key]?.enabled && (
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
                const settings = p.leave_settings || [];

                const renderSetting = (ls, idx) => {
                  const notice = ls.advance_notice_days
                    ? ` • Notice ${ls.advance_notice_days}d`
                    : "";
                  if ((ls.type || "").toLowerCase() === "earned") {
                    return (
                      <li key={ls.type + idx} className="policy-setting-item">
                        <span className="setting-name">Earned</span>
                        <span className="setting-value">
                          {ls.earned_leaves ?? ls.value ?? 0} /{" "}
                          {ls.working_days ?? "—"}
                        </span>
                        <span className="setting-meta">
                          CF {ls.carry_forward ?? 0}
                          {notice}
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={(ls.type || `custom${idx}`) + idx}
                      className="policy-setting-item"
                    >
                      <span className="setting-name">
                        {String(ls.type || "Custom")
                          .split("_")
                          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                          .join(" ")}
                      </span>
                      <span className="setting-value">
                        {ls.value ?? ls.earned_leaves ?? 0} days
                      </span>
                      <span className="setting-meta">
                        CF {ls.carry_forward ?? 0}
                        {notice}
                      </span>
                    </li>
                  );
                };

                return (
                  <tr key={p.id}>
                    <td>{p.period}</td>
                    <td>{new Date(p.year_start).toLocaleDateString()}</td>
                    <td>{new Date(p.year_end).toLocaleDateString()}</td>
                    <td>
                      {settings.length === 0 ? (
                        "—"
                      ) : (
                        <ul className="policy-settings-list">
                          {settings.map((ls, idx) => renderSetting(ls, idx))}
                        </ul>
                      )}
                    </td>

                    <td>
                      <MdOutlineEdit
                        className="policy-action-icon"
                        onClick={() => onEdit(p)}
                        style={{ cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        className="policy-action-icon"
                        onClick={() => promptDelete(p.id)}
                        style={{ cursor: "pointer" }}
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

      {/* Confirmation Modal (using your Modal component) */}
      <Modal
        isVisible={confirmDelete.isVisible}
        onClose={handleCancelDelete}
        buttons={[
          {
            label: "Cancel",
            className: "policy-confirm-cancel",
            onClick: handleCancelDelete,
          },
          {
            label: confirmDelete.loading ? "Deleting..." : "Delete",
            className: "policy-confirm-delete",
            onClick: () => {
              if (!confirmDelete.loading) handleConfirmDelete();
            },
          },
        ]}
      >
        <p>{confirmDelete.message}</p>
      </Modal>
    </div>
  );
}
