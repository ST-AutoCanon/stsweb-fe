// src/components/LeaveQueries/LopModal.js
import React from "react";
import Modal from "../Modal/Modal";
import { monthName } from "./leaveUtils";

export default function LopModal({
  isVisible,
  onClose,
  lopMonth,
  lopYear,
  monthlyLop,
  prevMonth,
  nextMonth,
  onRecompute,
}) {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      buttons={[
        { label: "Close", onClick: onClose },
        { label: "Recompute", onClick: onRecompute },
      ]}
    >
      <div className="lop-modal-content">
        <h4 className="lop-title">Total LOP</h4>
        <div
          className="lop-month-row"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <button type="button" onClick={prevMonth} aria-label="Previous month">
            ◀
          </button>
          <div className="lop-month-title">
            {monthName(lopMonth, lopYear)} {lopYear}
          </div>
          <button type="button" onClick={nextMonth} aria-label="Next month">
            ▶
          </button>
        </div>

        <div className="lop-value-big" style={{ fontSize: 28, marginTop: 12 }}>
          {Number.isFinite(Number(monthlyLop)) ? monthlyLop.toFixed(2) : "0.00"}{" "}
          days
        </div>

        <p className="lop-note" style={{ marginTop: 12 }}>
          Note: Use Recompute if the displayed value looks outdated.
        </p>
      </div>
    </Modal>
  );
}
