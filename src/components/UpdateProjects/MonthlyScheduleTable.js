import React, { useState, useEffect, useRef } from "react";
import "./MonthlyScheduleTable.css";

const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  return `${month} ${year}`;
};

const MonthlyScheduleTable = ({
  initialFinancialDetails = [],
  monthlyFixedAmount,
  service_description = "",
  onFinancialDetailsChange,
  onMonthlyFixedAmountChange,
}) => {
  const [financialDetails, setFinancialDetails] = useState([]);
  const initRef = useRef(false);
  const currentMonthYear = getCurrentMonthYear();

  // 1️⃣ One‑time initialization (or when the prop array truly changes)
  useEffect(() => {
    if (!initRef.current) {
      const seeded = initialFinancialDetails.map((row) => ({
        ...row,
        month_year: currentMonthYear,
        monthly_fixed_amount: monthlyFixedAmount,
        service_description: row.service_description ?? service_description,
        project_amount: row.project_amount ?? monthlyFixedAmount,
      }));
      setFinancialDetails(seeded);
      initRef.current = true;
      // also let parent know immediately:
      onFinancialDetailsChange?.({
        financialDetails: seeded,
        month_year: seeded[0]?.month_year,
        project_amount: seeded[0]?.project_amount,
        tds_percentage: seeded[0]?.tds_percentage,
        tds_amount: seeded[0]?.tds_amount,
        gst_percentage: seeded[0]?.gst_percentage,
        gst_amount: seeded[0]?.gst_amount,
        total_amount: seeded[0]?.total_amount,
        service_description: seeded[0]?.service_description,
      });
    }
  }, [initialFinancialDetails, monthlyFixedAmount, service_description]);

  // 2️⃣ Only update monthly_fixed_amount if that prop changes
  useEffect(() => {
    setFinancialDetails((rows) =>
      rows.map((r) => ({
        ...r,
        monthly_fixed_amount: monthlyFixedAmount,
      }))
    );
  }, [monthlyFixedAmount]);

  const updateFinancialDetails = (newDetails) => {
    setFinancialDetails(newDetails);
    const first = newDetails[0] || {};
    onFinancialDetailsChange?.({
      financialDetails: newDetails,
      month_year: first.month_year,
      project_amount: first.project_amount,
      tds_percentage: first.tds_percentage,
      tds_amount: first.tds_amount,
      gst_percentage: first.gst_percentage,
      gst_amount: first.gst_amount,
      total_amount: first.total_amount,
      service_description: first.service_description,
    });
  };

  const handleInputChange = (idx, field, raw) => {
    const rows = [...financialDetails];
    const row = { ...rows[idx] };

    const val =
      field === "service_description" || field === "status"
        ? raw
        : parseFloat(raw) || 0;

    row[field] = val;

    const base = field === "project_amount" ? val : row.project_amount || 0;

    row.tds_amount = (base * (row.tds_percentage || 0)) / 100;
    row.gst_amount = (base * (row.gst_percentage || 0)) / 100;
    row.total_amount = base + row.gst_amount - row.tds_amount;

    if (field === "tds_amount") {
      row.tds_percentage = base ? (val / base) * 100 : 0;
    }
    if (field === "gst_amount") {
      row.gst_percentage = base ? (val / base) * 100 : 0;
    }

    // 🆕 Add this part: if status changed to "Received", set today's date if not already set
    if (field === "status" && val === "Received" && !row.completed_date) {
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      row.completed_date = formattedToday;
    }

    rows[idx] = row;
    updateFinancialDetails(rows);
  };

  return (
    <div className="schedule-wrapper">
      <div className="estimated-amount">
        <label>Monthly Fixed Amount</label>
        <input
          type="number"
          name="monthly_fixed_amount"
          value={monthlyFixedAmount || ""}
          onChange={(e) => {
            const amt = parseFloat(e.target.value) || 0;
            onMonthlyFixedAmountChange?.(amt, service_description);
          }}
        />
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Month/Year</th>
            <th>Service Description</th>
            <th>Monthly Amount</th>
            <th>TDS</th>
            <th>GST</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Received Date</th>
          </tr>
        </thead>
        <tbody>
          {financialDetails.map((f, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{f.month_year}</td>
              <td>
                <input
                  type="text"
                  name="service_description"
                  value={f.service_description || ""}
                  onChange={(e) =>
                    handleInputChange(
                      idx,
                      "service_description",
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  name="project_amount"
                  value={f.project_amount || ""}
                  onChange={(e) =>
                    handleInputChange(idx, "project_amount", e.target.value)
                  }
                />
              </td>
              <td>
                <div className="monthly-group">
                  <div className="monthly-small">
                    <input
                      type="number"
                      name="tds_percentage"
                      value={f.tds_percentage || ""}
                      onChange={(e) =>
                        handleInputChange(idx, "tds_percentage", e.target.value)
                      }
                    />
                  </div>
                  <span>%</span>
                  <input
                    type="number"
                    name="tds_amount"
                    value={f.tds_amount || ""}
                    readOnly
                  />
                </div>
              </td>
              <td>
                <div className="monthly-group">
                  <div className="monthly-small">
                    <input
                      type="number"
                      name="gst_percentage"
                      value={f.gst_percentage || ""}
                      onChange={(e) =>
                        handleInputChange(idx, "gst_percentage", e.target.value)
                      }
                    />
                  </div>
                  <span>%</span>
                  <input
                    type="number"
                    name="gst_amount"
                    value={f.gst_amount || ""}
                    readOnly
                  />
                </div>
              </td>
              <td>
                <input
                  type="number"
                  name="total_amount"
                  value={f.total_amount || ""}
                  readOnly
                />
              </td>
              <td>
                <select
                  name="status"
                  value={f.status || "Pending"}
                  onChange={(e) =>
                    handleInputChange(idx, "status", e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                </select>
              </td>
              <td>
                <input
                  type="date"
                  name="completed_date"
                  value={f.completed_date || ""}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyScheduleTable;
