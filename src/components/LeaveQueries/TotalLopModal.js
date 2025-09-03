import React from "react";

const TotalLopModal = ({
  isLopModalOpen,
  onClose,
  prevLopMonth,
  nextLopMonth,
  lopMonth,
  lopYear,
  monthName,
  monthlyLop,
  computeMonthlyLop,
}) => {
  if (!isLopModalOpen) return null;
  return (
    <div>
      <div className="lop-modal-content">
        <h4 className="lop-title">Total LOP</h4>
        <div
          className="lop-month-row"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <button
            type="button"
            onClick={prevLopMonth}
            aria-label="Previous month"
          >
            ◀
          </button>
          <div className="lop-month-title">
            {monthName(lopMonth)} {lopYear}
          </div>
          <button type="button" onClick={nextLopMonth} aria-label="Next month">
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
    </div>
  );
};

export default TotalLopModal;
