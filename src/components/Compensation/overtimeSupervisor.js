import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./overtimeSupervisor.css";
import Modal from "../Modal/Modal";

const OvertimeSupervisor = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [approvedSet, setApprovedSet] = useState(new Set());
  const [edited, setEdited] = useState({});
  const [rateMap, setRateMap] = useState({});
  const [defaultHoursMap, setDefaultHoursMap] = useState({});
  const [tab, setTab] = useState("current");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );
  const myName =
    dashboardData.employeeName ||
    dashboardData.full_name ||
    dashboardData.name ||
    dashboardData.preferred_name ||
    "";
  const headers = {
    "x-api-key": API_KEY,
    "x-employee-id": meId,
    "Content-Type": "application/json",
  };

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const monthLabel = (offset) => {
    const d = new Date();
    d.setMonth(d.getMonth() - offset);
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const toLocalDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const fetchData = async () => {
    if (!API_KEY || !meId) return;
    setLoading(true);
    try {
      const cutoffRes = await axios.get(
        `${BASE_URL}/api/salaryCalculationperiods`,
        { withCredentials: true, headers }
      );
      const cutoff_date = cutoffRes.data?.data?.[0]?.cutoff_date || 5;

      const now = new Date();
      let currentMonth = now.getMonth();
      let currentYear = now.getFullYear();
      if (tab === "prev1") currentMonth -= 1;
      else if (tab === "prev2") currentMonth -= 2;
      while (currentMonth < 0) {
        currentMonth += 12;
        currentYear -= 1;
      }

      const periodEnd = new Date(currentYear, currentMonth, cutoff_date);
      const periodStart = new Date(currentYear, currentMonth - 1, cutoff_date);

      const startDate = `${periodStart.getFullYear()}-${String(
        periodStart.getMonth() + 1
      ).padStart(2, "0")}-${String(periodStart.getDate()).padStart(2, "0")}`;
      const endDate = `${periodEnd.getFullYear()}-${String(
        periodEnd.getMonth() + 1
      ).padStart(2, "0")}-${String(periodEnd.getDate()).padStart(2, "0")}`;

      const [extraRes, summaryRes, assignedRes, planListRes, teamRes] =
        await Promise.all([
          axios.get(
            `${BASE_URL}/api/compensation/employee-extra-hours?startDate=${startDate}&endDate=${endDate}`,
            { withCredentials: true, headers }
          ),
          axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, {
            withCredentials: true,
            headers,
          }),
          axios.get(`${BASE_URL}/api/compensation/assigned`, {
            withCredentials: true,
            headers,
          }),
          axios.get(`${BASE_URL}/api/compensations/list`, {
            withCredentials: true,
            headers,
          }),
          axios.get(`${BASE_URL}/api/overtime-summary/${meId}`, {
            withCredentials: true,
            headers,
          }),
        ]);

      const teamEmployeeIds = new Set(
        (teamRes.data?.data || []).map((e) => e.employee_id)
      );

      const rateObj = {};
      const hoursObj = {};
      const assignedData = assignedRes.data?.data || [];
      const planList = planListRes.data?.data || [];
      const planHoursMap = {};
      planList.forEach((p) => {
        planHoursMap[p.id] = parseFloat(p.plan_data?.defaultWorkingHours) || 8;
      });
      assignedData.forEach((a) => {
        const rate = parseFloat(a.plan_data?.overtimePayAmount || 0);
        const defHrs = planHoursMap[a.id] || 8;
        (a.assigned_data || []).forEach((emp) => {
          rateObj[emp.employee_id] = rate;
          hoursObj[emp.employee_id] = defHrs;
        });
      });
      setRateMap(rateObj);
      setDefaultHoursMap(hoursObj);

      const mainData = (extraRes.data?.data || [])
        .filter((item) => teamEmployeeIds.has(item.employee_id))
        .map((item) => {
          const localDate = toLocalDate(item.work_date);
          const totalHrs = parseFloat(item.total_hours_worked) || 0;
          const defHrs = hoursObj[item.employee_id] || 8;
          const extra = totalHrs > defHrs ? totalHrs - defHrs : 0;

          const sessions = (item.sessions || []).map((s) => ({
            ...s,
            extra_hours:
              item.sessions.length > 0
                ? (extra / item.sessions.length).toFixed(2)
                : "0.00",
          }));

          return {
            ...item,
            work_date: localDate,
            extra_hours: extra.toFixed(2),
            sessions,
            employee_name: item.employee_name || "—",
          };
        });
      setData(mainData);

      const approved = new Set();
      const summaryData = summaryRes.data?.data || [];
      summaryData.forEach((r) => {
        if (
          r.employee_id &&
          r.work_date &&
          teamEmployeeIds.has(r.employee_id)
        ) {
          approved.add(`${r.employee_id}-${toLocalDate(r.work_date)}`);
        }
      });
      setApprovedSet(approved);
    } catch (err) {
      console.error("Fetch error:", err);
      showAlert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.employee_id?.toLowerCase().includes(q) ||
        r.employee_name?.toLowerCase().includes(q) ||
        r.work_date?.includes(q)
    );
  }, [data, search]);

  const rowKey = (item) => `${item.employee_id}-${item.work_date}`;
  const isApproved = (item) => approvedSet.has(rowKey(item));
  const isRowSelected = (item) => selected.has(rowKey(item));

  const toggleRow = (item) => {
    if (isApproved(item)) return;
    const key = rowKey(item);
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const toggleAll = () => {
    const keys = filtered.filter((r) => !isApproved(r)).map(rowKey);
    setSelected((prev) =>
      keys.every((k) => prev.has(k)) ? new Set() : new Set(keys)
    );
  };

  const isAllSelected =
    filtered.filter((r) => !isApproved(r)).length > 0 &&
    filtered
      .filter((r) => !isApproved(r))
      .every((r) => selected.has(rowKey(r)));

  const buildPayload = (status, parent) => {
    const groupKey = rowKey(parent);

    const effectiveRate =
      edited[groupKey]?.rate !== undefined
        ? parseFloat(edited[groupKey].rate)
        : rateMap[parent.employee_id] ?? 0;

    const effectiveComments = edited[groupKey]?.comments ?? "";

    return [
      {
        punch_id: `${parent.employee_id}_${parent.work_date}`,
        work_date: parent.work_date,
        employee_id: parent.employee_id,
        extra_hours: parseFloat(parent.extra_hours) || 0,
        rate: effectiveRate ? parseFloat(effectiveRate.toFixed(2)) : 0,

        project: parent.project_name?.trim() || "",

        supervisor: myName.trim() || meId,

        comments: effectiveComments,
        status: status,
      },
    ];
  };

  const bulkUpdate = async (payload, action) => {
    if (!payload.length) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/compensation/overtime-upsert-supervisor`,
        { data: payload },
        { withCredentials: true, headers }
      );

      showAlert(`Successfully ${action} ${payload.length} record(s)`);

      await fetchData();
      setSelected(new Set());
      setEdited({});
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      showAlert(`Failed: ${err.response?.data?.details || err.message}`);
    }
  };

  const approveAll = () => {
    const payload = [];
    filtered.forEach((r) => {
      if (selected.has(rowKey(r))) {
        payload.push(...buildPayload("Approved", r));
      }
    });

    if (payload.length) bulkUpdate(payload, "Approved");
  };

  const rejectAll = () => {
    const payload = [];
    filtered.forEach((r) => {
      if (selected.has(rowKey(r))) {
        payload.push(...buildPayload("Rejected", r));
      }
    });

    if (payload.length) bulkUpdate(payload, "Rejected");
  };

  const approveOne = (row) =>
    bulkUpdate(buildPayload("Approved", row), "Approved");

  const rejectOne = (row) =>
    bulkUpdate(buildPayload("Rejected", row), "Rejected");

  if (loading) return <div className="ot-loading">Loading…</div>;

  return (
    <div className="ot-container">
      <h1>Supervisor Overtime Approval</h1>

      <div className="ot-tabs">
        {["prev2", "prev1", "current"].map((t) => (
          <button
            key={t}
            className={tab === t ? "ot-tab active" : "ot-tab"}
            onClick={() => setTab(t)}
          >
            {monthLabel(t === "prev2" ? 2 : t === "prev1" ? 1 : 0)}
          </button>
        ))}
      </div>

      <div className="ot-controls">
        <input
          type="text"
          placeholder="Search by ID, Name, Date..."
          className="ot-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ot-bulk-actions">
          <button
            className="ot-btn ot-btn-approve"
            onClick={approveAll}
            disabled={selected.size === 0}
          >
            Approve Selected
          </button>
          <button
            className="ot-btn ot-btn-reject"
            onClick={rejectAll}
            disabled={selected.size === 0}
          >
            Reject Selected
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="ot-no-data">No overtime records found for your team</p>
      ) : (
        <div className="ot-table-wrapper">
          <table className="ot-table">
            <thead>
              <tr>
                <th className="ot-th ot-th-select">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th className="ot-th">Date</th>
                <th className="ot-th">Employee ID</th>
                <th className="ot-th">Name</th>
                <th className="ot-th ot-align-right">Total Hrs</th>
                <th className="ot-th ot-align-right">Extra Hrs</th>
                <th className="ot-th ot-align-right">Rate</th>
                <th className="ot-th">Status</th>
                <th className="ot-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const key = rowKey(row);
                const approved = isApproved(row);
                const sel = isRowSelected(row);
                const defaultRate = rateMap[row.employee_id] ?? 0;

                return (
                  <tr key={key} className={approved ? "ot-row-disabled" : ""}>
                    <td className="ot-td ot-td-select">
                      <input
                        type="checkbox"
                        checked={sel}
                        disabled={approved}
                        onChange={() => toggleRow(row)}
                      />
                    </td>
                    <td className="ot-td">{row.work_date}</td>
                    <td className="ot-td">{row.employee_id}</td>
                    <td className="ot-td">{row.employee_name}</td>
                    <td className="ot-td ot-align-right">
                      {Number(row.total_hours_worked || 0).toFixed(2)}
                    </td>
                    <td className="ot-td ot-align-right">
                      {parseFloat(row.extra_hours || 0).toFixed(2)}
                    </td>
                    <td className="ot-td ot-align-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={(edited[key]?.rate ?? defaultRate).toFixed(2)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setEdited((prev) => ({
                            ...prev,
                            [key]: { ...(prev[key] || {}), rate: val },
                          }));
                        }}
                        disabled={approved}
                        className="ot-input-rate"
                      />
                    </td>
                    <td className="ot-td">
                      <span
                        className={`ot-status ot-status-${
                          approved ? "approved" : "pending"
                        }`}
                      >
                        {approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="ot-td ot-td-actions">
                      {!approved && (
                        <>
                          <button
                            className="ot-btn-icon ot-btn-approve"
                            onClick={() => approveOne(row)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="ot-btn-icon ot-btn-reject"
                            onClick={() => rejectOne(row)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default OvertimeSupervisor;
