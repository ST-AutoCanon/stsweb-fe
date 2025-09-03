import React from "react";

const PolicyModalContent = ({ activePolicy }) => {
  return (
    <div className="policy-modal-content">
      <div className="policy-dates">
        <div>
          <span className="date-label">Start Date:</span>
          <span className="date-value">
            {activePolicy
              ? new Date(activePolicy.year_start).toLocaleDateString()
              : "-"}
          </span>
        </div>
        <div>
          <span className="date-label">End Date:</span>
          <span className="date-value">
            {activePolicy
              ? new Date(activePolicy.year_end).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>

      <div className="policy-note">
        <p>
          <strong>Note:</strong> Leaves remaining after{" "}
          <strong>
            {activePolicy
              ? new Date(activePolicy.year_end).toLocaleDateString()
              : "-"}
          </strong>{" "}
          will{" "}
          <span
            className={
              activePolicy?.carry_forward_enabled ? "carry-forward" : "lapse"
            }
          >
            {activePolicy?.carry_forward_enabled
              ? "be carried forward as per policy."
              : "lapse at the end of the policy period."}
          </span>
        </p>
      </div>

      {Array.isArray(activePolicy?.leave_settings) &&
        activePolicy.leave_settings.length > 0 && (
          <table className="leave-policy-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Allowed Days</th>
                <th>Carry Forward</th>
              </tr>
            </thead>
            <tbody>
              {activePolicy.leave_settings.map((s) => (
                <tr key={s.type}>
                  <td>{s.type}</td>
                  <td>{s.value || s.earned_leaves}</td>
                  <td>{s.carry_forward || "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default PolicyModalContent;
