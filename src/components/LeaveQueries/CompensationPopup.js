// src/components/LeaveQueries/CompensationPopup.js
import React from "react";
import "./CompensationPopup.css";

/**
 * Props:
 * - lopModal: object (shape from Admin)
 * - setLopModal: setter from Admin
 *
 * NOTE: Admin must set lopModal.days and lopModal.remaining before opening this popup.
 */
export default function CompensationPopup({ lopModal, setLopModal }) {
  if (!lopModal?.isVisible) return null;

  const days = Number(lopModal.days) || Number(lopModal.deficit) || 0;
  const remaining = Number(lopModal.remaining) || 0;

  // Allow decimals (use parseFloat, do not floor)
  const updateField = (key, value) => {
    // keep raw input so user can type `.5` etc — parse to number for clamping
    const parsed = parseFloat(String(value));
    const isNum = Number.isFinite(parsed);
    const base = isNum ? Math.max(0, parsed) : 0;

    // clamp depending on key (but keep decimal precision)
    let clamped = base;
    const daysNum = Number(lopModal.days) || 0;
    const remainingNum = Number(lopModal.remaining) || 0;

    if (key === "compensatedDays") {
      clamped = Math.min(base, daysNum);
    } else if (key === "deductedDays") {
      clamped = Math.min(base, daysNum, remainingNum);
    } else if (key === "lopDays") {
      clamped = Math.min(base, daysNum);
    }

    // If user cleared the field (empty string), allow empty string to be stored
    // so they can type a new value.
    const valueToStore =
      value === "" || value === null || value === undefined
        ? ""
        : // keep the numeric value (with decimals)
          clamped;

    setLopModal((m) => ({ ...m, [key]: valueToStore, error: "" }));
  };

  const close = () =>
    setLopModal((m) => ({ ...m, isVisible: false, error: "" }));

  // compute sum (coerce empty to 0)
  const toNumberSafe = (v) =>
    v === "" || v === null || v === undefined ? 0 : Number(v) || 0;

  const sum =
    toNumberSafe(lopModal.compensatedDays) +
    toNumberSafe(lopModal.deductedDays) +
    toNumberSafe(lopModal.lopDays);

  // floating-tolerance helper
  const EPS = 1e-6;

  // helper validation before apply (tolerant to float rounding)
  const validateBeforeApply = (c, d, l) => {
    if (Math.abs(c + d + l - days) > EPS) {
      return `Split must add up to total requested days (${days}). Current sum: ${
        c + d + l
      }.`;
    }
    if (d - remaining > EPS) {
      return `Deducted days (${d}) cannot exceed employee remaining (${remaining}).`;
    }
    return null;
  };

  return (
    <div
      className="comp-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comp-popup-title"
      onMouseDown={close}
    >
      <div
        className="comp-card"
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="comp-header">
          <h3 id="comp-popup-title">Process Deficit</h3>
          <button
            className="comp-close"
            aria-label="Close dialog"
            onClick={close}
          >
            ✕
          </button>
        </header>

        <div className="comp-body">
          <p className="comp-message">{lopModal.message}</p>

          <div className="comp-deficit-row">
            <strong>Total requested days:</strong>
            <span className="comp-deficit-value" style={{ marginLeft: 8 }}>
              {days}
            </span>
            <span style={{ marginLeft: 12, color: "#666" }}>
              (remaining balance: {remaining})
            </span>
          </div>

          <div className="comp-input-grid">
            <label className="comp-field">
              <span className="comp-label">Compensated days</span>
              <input
                type="number"
                min={0}
                max={days}
                step="any"
                value={lopModal.compensatedDays ?? ""}
                onChange={(e) => updateField("compensatedDays", e.target.value)}
              />
            </label>

            <label className="comp-field">
              <span className="comp-label">Deducted from balance</span>
              <input
                type="number"
                min={0}
                max={Math.min(days, remaining)}
                step="any"
                value={lopModal.deductedDays ?? ""}
                onChange={(e) => updateField("deductedDays", e.target.value)}
              />
              <small style={{ display: "block", marginTop: 6 }}>
                Max deductible: {remaining}
              </small>
            </label>

            <label className="comp-field">
              <span className="comp-label">Loss-of-Pay days</span>
              <input
                type="number"
                min={0}
                max={days}
                step="any"
                value={lopModal.lopDays ?? ""}
                onChange={(e) => updateField("lopDays", e.target.value)}
              />
            </label>
          </div>

          <div className="comp-sum-row">
            <small>
              Sum: <strong>{sum}</strong> / Total requested days:{" "}
              <strong>{days}</strong>
            </small>
            {lopModal.error && (
              <div
                className="comp-error"
                role="alert"
                style={{ color: "crimson" }}
              >
                {lopModal.error}
              </div>
            )}
          </div>

          <div className="comp-quick-row">
            <button
              type="button"
              className="comp-btn comp-btn-ghost"
              onClick={() =>
                setLopModal((m) => ({
                  ...m,
                  compensatedDays: 0,
                  deductedDays: 0,
                  lopDays: days,
                  error: "",
                }))
              }
            >
              Quick: All → LoP
            </button>

            <button
              type="button"
              className="comp-btn comp-btn-ghost"
              onClick={() =>
                setLopModal((m) => ({
                  ...m,
                  compensatedDays: days,
                  deductedDays: 0,
                  lopDays: 0,
                  error: "",
                }))
              }
            >
              Quick: All → Compensated
            </button>

            <button
              type="button"
              className="comp-btn comp-btn-ghost"
              onClick={() =>
                setLopModal((m) => ({
                  ...m,
                  compensatedDays: 0,
                  deductedDays: Math.min(remaining, days),
                  lopDays: Math.max(0, days - Math.min(remaining, days)),
                  error: "",
                }))
              }
            >
              Quick: Use Balance → Deducted
            </button>
          </div>

          <div className="comp-actions" style={{ marginTop: 12 }}>
            <button className="comp-btn comp-btn-muted" onClick={close}>
              Cancel
            </button>

            <button
              className="comp-btn comp-btn-danger"
              onClick={async () => {
                // approve deficit as LoP for entire period
                if (typeof lopModal.approveDeficit === "function") {
                  console.log("[CompensationPopup] Approve as LoP:", {
                    leaveId: lopModal.leaveId,
                    days,
                  });
                  await lopModal.approveDeficit();
                } else {
                  close();
                }
              }}
            >
              {`Approve ${days} LoP`}
            </button>

            <button
              className="comp-btn"
              onClick={async () => {
                if (typeof lopModal.setAllCompensated === "function") {
                  console.log("[CompensationPopup] All compensated:", {
                    leaveId: lopModal.leaveId,
                    days,
                  });
                  await lopModal.setAllCompensated();
                } else {
                  close();
                }
              }}
            >
              All Compensated
            </button>

            <button
              className="comp-btn"
              onClick={async () => {
                if (typeof lopModal.setAllDeducted === "function") {
                  console.log("[CompensationPopup] All deducted:", {
                    leaveId: lopModal.leaveId,
                    days,
                  });
                  await lopModal.setAllDeducted();
                } else {
                  close();
                }
              }}
            >
              All Deducted
            </button>

            <button
              className="comp-btn comp-btn-primary"
              onClick={async () => {
                const c = toNumberSafe(lopModal.compensatedDays);
                const d = toNumberSafe(lopModal.deductedDays);
                const l = toNumberSafe(lopModal.lopDays);

                const validation = validateBeforeApply(c, d, l);
                if (validation) {
                  setLopModal((m) => ({ ...m, error: validation }));
                  console.warn(
                    "[CompensationPopup] validation failed:",
                    validation
                  );
                  return;
                }

                // all good — call handler which triggers doUpdate in Admin
                console.log("[CompensationPopup] apply split payload:", {
                  leaveId: lopModal.leaveId,
                  compensated_days: c,
                  deducted_days: d,
                  loss_of_pay_days: l,
                });

                if (typeof lopModal.applyFlexibleSplit === "function") {
                  await lopModal.applyFlexibleSplit(c, d, l);
                }
              }}
            >
              Apply split
            </button>
          </div>

          <div className="comp-note" style={{ marginTop: 8 }}>
            <small>
              <em>Note:</em> Deducted days cannot exceed the employee's
              remaining balance ({remaining}). Sum must equal total requested
              days ({days}).
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
