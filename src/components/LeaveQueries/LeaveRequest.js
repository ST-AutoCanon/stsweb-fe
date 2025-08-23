// src/components/LeaveRequest.js
import React, { useState, useEffect } from "react";
import "./LeaveRequest.css";
import Modal from "../Modal/Modal";
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

// Helper: If dateStr is already YYYY-MM-DD return it, otherwise convert.
const parseLocalDate = (dateStr) => {
  if (!dateStr) return "";
  if (typeof dateStr === "string" && dateStr.length === 10) return dateStr;
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

// helper: normalize advance notice number from setting object
const getAdvanceNoticeDays = (setting) =>
  Number(setting?.advance_notice_days ?? setting?.advanceNoticeDays ?? 0);

const API_KEY = process.env.REACT_APP_API_KEY;
const BACKEND = process.env.REACT_APP_BACKEND_URL;

// employee info (used in multiple places)
const employeeData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
const meId = employeeData?.employeeId;
const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
  "x-employee-id": meId,
};

const LeaveRequest = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [formData, setFormData] = useState({
    reason: "",
    leavetype: "",
    h_f_day: "Full Day",
    startDate: "",
    endDate: "",
  });
  const [leaveRequests, setLeaveRequests] = useState({ self: [], team: [] });
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [editingId, setEditingId] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    message: "",
    onConfirm: null,
  });

  // leave balances and policies
  const [balances, setBalances] = useState([]); // from /leave-balance
  const [policies, setPolicies] = useState([]); // policy periods array
  const [activePolicy, setActivePolicy] = useState(null); // selected policy to use
  const [selectedSetting, setSelectedSetting] = useState(null); // leave setting for selected type
  const [isPolicyModalOpen, setPolicyModalOpen] = useState(false);

  // monthly LOP navigation state
  const now = new Date();
  const [lopMonth, setLopMonth] = useState(now.getMonth() + 1); // 1..12
  const [lopYear, setLopYear] = useState(now.getFullYear());
  const [monthlyLop, setMonthlyLop] = useState(0);

  // NEW: Venn navigation state (replaces x-axis scroll)
  // start index for visible balance cards (0-based)
  const [vennStartIndex, setVennStartIndex] = useState(0);
  // how many balance cards to show at once (responsive)
  const [vennVisibleCount, setVennVisibleCount] = useState(6);
  const [showLopCard, setShowLopCard] = useState(false); // false -> hidden by default

  const employeeId = employeeData?.employeeId;
  const name = employeeData?.name;
  const role = localStorage.getItem("userRole") || null;

  // ---------- Helper: detect bereavement-like types ----------
  const isBereavementType = (type) => {
    if (!type) return false;
    const t = String(type).toLowerCase();
    return t.includes("bereav") || t.includes("brev");
  };

  // fetch leave balance for the employee
  const fetchLeaveBalance = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(
        `${BACKEND}/api/leave-policies/employee/${employeeId}/leave-balance`,
        { headers }
      );
      if (!res.ok) throw new Error("Failed to load leave balance");
      const json = await res.json();
      setBalances(json.data || []);
      // reset venn navigation when balances change
      setVennStartIndex(0);
    } catch (err) {
      console.error(err);
      showAlert("Could not fetch leave balance.");
    }
  };

  const fetchMonthlyLop = async (
    month = lopMonth,
    year = lopYear,
    { forceCompute = false } = {}
  ) => {
    if (!employeeId) return;
    try {
      const url = `${BACKEND}/api/leave-policies/employee/${employeeId}/monthly-lop?month=${month}&year=${year}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        if (forceCompute) {
          await computeMonthlyLop(month, year);
          return fetchMonthlyLop(month, year, { forceCompute: false });
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      const payload = json?.data || {};
      const val = Number(
        payload.total_lop ?? payload.totalLop ?? payload.lop ?? 0
      );
      setMonthlyLop(Number.isFinite(val) ? val : 0);
      return val;
    } catch (err) {
      console.error("Could not fetch monthly LOP:", err);
      setMonthlyLop(0);
      return 0;
    }
  };

  // fetch policies (periods)
  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/leave-policies`, { headers });
      const json = await res.json();
      setPolicies(json.data || []);
    } catch (err) {
      console.error("Could not fetch policies", err);
    }
  };

  // New: force compute & persist monthly LOP (POST)
  const computeMonthlyLop = async (month = lopMonth, year = lopYear) => {
    if (!employeeId) return;
    try {
      const url = `${BACKEND}/api/leave-policies/employee/${employeeId}/compute-monthly-lop`;
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ month, year }),
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => null);
        throw new Error(`Compute failed ${res.status} ${errBody || ""}`);
      }
      const json = await res.json();
      const payload = json?.data || {};
      const val = Number(
        payload.total_lop ?? payload.totalLop ?? payload.lop ?? 0
      );
      setMonthlyLop(Number.isFinite(val) ? val : 0);
      return val;
    } catch (err) {
      console.error("Compute monthly LOP failed:", err);
      showAlert("Failed to compute monthly LOP. Check server logs.");
      return null;
    }
  };

  // determine active policy: where today is between start/end, else pick latest by year_start
  const pickActivePolicy = (policyList) => {
    if (!Array.isArray(policyList) || policyList.length === 0) return null;
    const today = new Date();
    const inRange = policyList.find((p) => {
      try {
        const s = new Date(p.year_start);
        const e = new Date(p.year_end);
        return s <= today && today <= e;
      } catch {
        return false;
      }
    });
    if (inRange) return inRange;
    return policyList
      .slice()
      .sort((a, b) => new Date(b.year_start) - new Date(a.year_start))[0];
  };

  // load policies + balances + monthly lop on mount (or when employeeId changes)
  useEffect(() => {
    fetchPolicies();
    fetchLeaveBalance();
    fetchMonthlyLop(lopMonth, lopYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    const p = pickActivePolicy(policies);
    setActivePolicy(p || null);
    setFormData((f) => ({ ...f, leavetype: "" }));
    setSelectedSetting(null);
  }, [policies]);

  useEffect(() => {
    (async () => {
      const val = await fetchMonthlyLop(lopMonth, lopYear);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lopMonth, lopYear, employeeId]);

  // responsive visible count for venn cards: 1 on small, 2 on medium, 3 on desktop
  useEffect(() => {
    const calcVisible = () => {
      const w = window.innerWidth;
      if (w < 600) return 1;
      if (w < 900) return 2;
      return 6;
    };
    const onResize = () => {
      const newCount = calcVisible();
      setVennVisibleCount((prev) => {
        if (prev !== newCount) {
          // adjust start index so currently visible items remain valid
          setVennStartIndex((start) => {
            const maxStart = Math.max(
              0,
              Math.min(start, Math.max(0, balances.length - newCount))
            );
            return maxStart;
          });
          return newCount;
        }
        return prev;
      });
    };

    // initialize
    setVennVisibleCount(calcVisible());

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [balances.length]);

  // update selectedSetting when user picks a leave type
  useEffect(() => {
    if (!activePolicy || !formData.leavetype) {
      setSelectedSetting(null);
      return;
    }
    const ls = (activePolicy.leave_settings || []).find(
      (s) =>
        (s.type || "").toLowerCase() ===
        String(formData.leavetype).toLowerCase()
    );
    setSelectedSetting(ls || null);
  }, [formData.leavetype, activePolicy]);

  // UI helpers
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  // Reset form
  const resetForm = () => {
    setFormData({
      reason: "",
      leavetype: "",
      h_f_day: "Full Day",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
    setSelectedSetting(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setFormVisible(true);
  };
  const handleCloseModal = () => {
    resetForm();
    setFormVisible(false);
  };

  // fetch leave requests (self and team)
  useEffect(() => {
    if (employeeId) fetchLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const fetchLeaveRequests = async () => {
    try {
      const selfUrl = `${BACKEND}/employee/leave/${employeeId}`;
      const selfParams = new URLSearchParams();
      if (filters.from_date) selfParams.append("from_date", filters.from_date);
      if (filters.to_date) selfParams.append("to_date", filters.to_date);
      const selfFinalUrl = selfParams.toString()
        ? `${selfUrl}?${selfParams.toString()}`
        : selfUrl;

      const selfResponse = await fetch(selfFinalUrl, {
        method: "GET",
        headers,
      });
      let selfRequests = [];
      if (selfResponse.ok) {
        const selfResult = await selfResponse.json();
        selfRequests = selfResult?.data || [];
      }

      let teamRequests = [];
      if (role === "Manager") {
        const teamUrl = `${BACKEND}/team-lead/${employeeId}`;
        const teamParams = new URLSearchParams();
        if (filters.from_date)
          teamParams.append("from_date", filters.from_date);
        if (filters.to_date) teamParams.append("to_date", filters.to_date);
        const teamFinalUrl = teamParams.toString()
          ? `${teamUrl}?${teamParams.toString()}`
          : teamUrl;
        const teamResponse = await fetch(teamFinalUrl, {
          method: "GET",
          headers,
        });
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          teamRequests = teamResult?.message?.data || [];
        }
      }

      setLeaveRequests({ self: selfRequests, team: teamRequests });
      setStatusUpdates({});
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      setLeaveRequests({ self: [], team: [] });
    }
  };

  // update admin status of leaves (kept as-is)
  const handleUpdate = async (leaveId) => {
    try {
      const update = statusUpdates[leaveId];
      if (!update) return;
      const response = await fetch(`${BACKEND}/admin/leave/${leaveId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(update),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        showAlert(data.message || "Leave request updated successfully.");
        fetchLeaveRequests();
      } else {
        showAlert(data.message || "Failed to update leave request.");
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
      showAlert("An error occurred while updating the leave request.");
    }
  };

  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...prev[leaveId], [key]: value },
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "leavetype") {
      if (isBereavementType(value)) {
        showAlert(
          "Bereavement Leave is for emergency/critical cases only. Please ensure this is an emergency before applying."
        );
      }

      const ls =
        (activePolicy?.leave_settings || []).find(
          (s) => (s.type || "").toLowerCase() === String(value).toLowerCase()
        ) || null;

      const noticeDays = getAdvanceNoticeDays(ls);
      if (ls && noticeDays > 0) {
        showAlert(
          `Note: ${value} requires applying at least ${noticeDays} day(s) before the start date.`
        );
      }
    }

    if (name === "startDate") {
      const settingToCheck =
        selectedSetting ||
        (activePolicy?.leave_settings || []).find(
          (s) =>
            (s.type || "").toLowerCase() ===
            String(formData.leavetype).toLowerCase()
        );

      const noticeDays = getAdvanceNoticeDays(settingToCheck);
      if (settingToCheck && noticeDays > 0 && value) {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + noticeDays);

        const chosen = new Date(value);
        const d1 = new Date(
          minDate.getFullYear(),
          minDate.getMonth(),
          minDate.getDate()
        );
        const d2 = new Date(
          chosen.getFullYear(),
          chosen.getMonth(),
          chosen.getDate()
        );

        if (d2 < d1) {
          showAlert(
            `Selected start date is within the ${noticeDays}-day advance-notice period for this leave. You must apply at least ${noticeDays} day(s) before the start date.`
          );
        }
      }
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (
        (name === "startDate" || name === "endDate") &&
        next.startDate &&
        next.endDate
      ) {
        if (new Date(next.endDate) > new Date(next.startDate)) {
          next.h_f_day = "Full Day";
        }
      }
      return next;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLeaveRequests();
  };

  // compute requested days (inclusive)
  const computeRequestedDays = (start, end, h_f_day) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    if (h_f_day === "Half Day") return 0.5;
    return diff;
  };

  // helper to find balance for a given type from balances (server-calculated)
  const getBalanceForType = (type) => {
    if (!balances || balances.length === 0) return null;
    return (
      balances.find(
        (b) => String(b.type).toLowerCase() === String(type).toLowerCase()
      ) || null
    );
  };

  // Submit leave request: validate against settings & balances
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) required
    if (
      !formData.leavetype ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      showAlert("Please fill in all required fields.");
      return;
    }

    // 2) date ordering
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showAlert("End date cannot be earlier than start date.");
      return;
    }

    // 3) find the selected setting from activePolicy
    const setting = selectedSetting;
    if (!setting) {
      showAlert("Selected leave type is not available in current policy.");
      return;
    }

    const noticeDays = getAdvanceNoticeDays(setting);
    if (!editingId && noticeDays > 0) {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + noticeDays);

      const chosenStart = new Date(formData.startDate);
      const ds = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate()
      );
      const dc = new Date(
        chosenStart.getFullYear(),
        chosenStart.getMonth(),
        chosenStart.getDate()
      );

      if (dc < ds) {
        showAlert(
          `You must apply for ${formData.leavetype} at least ${noticeDays} day(s) before the start date.`
        );
        return;
      }
    }

    // 4) compute requested days
    const requestedDays = computeRequestedDays(
      formData.startDate,
      formData.endDate,
      formData.h_f_day
    );

    // 5) determine allowance and used depending on type (try using balances if available)
    const balanceRow = getBalanceForType(setting.type);
    let allowance = 0;
    let used = 0;
    let remaining = 0;
    let carry_forward = Number(setting.carry_forward || 0);

    if (balanceRow) {
      // server provided values: preferred
      allowance = Number(
        balanceRow.allowance ??
          balanceRow.earned ??
          balanceRow.annual_allowance ??
          0
      );
      used = Number(balanceRow.used ?? 0);
      remaining = Number(balanceRow.remaining ?? 0);
      carry_forward = Number(balanceRow.carry_forward ?? carry_forward);
    } else {
      // fall back to client-side compute from setting:
      if (String(setting.type).toLowerCase() === "earned") {
        allowance = Number(setting.earned_leaves || 0) + carry_forward;
      } else {
        allowance = Number(setting.value || 0) + carry_forward;
      }
      used = 0; // unknown client-side without queries
      remaining = allowance - used;
    }

    // 8) Build request payload (but don't send yet if we need confirmation)
    if (!employeeId || !name) {
      showAlert("Employee data not found. Please log in again.");
      return;
    }

    const requestData = { employeeId, name, ...formData };

    const url = editingId
      ? `${BACKEND}/edit/${editingId}`
      : `${BACKEND}/employee/leave`;
    const method = editingId ? "PUT" : "POST";

    // helper to actually send request
    const doSubmit = async (data, submitUrl, submitMethod) => {
      try {
        const response = await fetch(submitUrl, {
          method: submitMethod,
          headers,
          body: JSON.stringify(data),
        });
        const responseData = await response.json();

        if (response.ok) {
          showAlert(
            editingId
              ? "Leave request updated successfully!"
              : "Leave request submitted successfully!"
          );
          setFormVisible(false);
          setEditingId(null);
          resetForm();
          fetchLeaveRequests();
          fetchLeaveBalance();
        } else {
          console.error(
            "Failed to submit leave request:",
            responseData.message
          );
          showAlert(responseData.message || "Failed to submit leave request.");
        }
      } catch (error) {
        console.error("Error submitting leave request:", error);
        showAlert("An error occurred while submitting the leave request.");
      }
    };

    // 7) If requestedDays > remaining => warn about LOP using app Modal (not window.confirm)
    if (requestedDays > remaining) {
      const deficit = requestedDays - remaining;
      const confirmMsg = `You're requesting ${requestedDays} day(s), but you have only ${remaining} remaining (${allowance} allowance, ${used} used, ${carry_forward} carry-forward). This will incur ${deficit} Loss-of-Pay day(s). Do you want to continue?`;

      // Use the app's confirm modal (showConfirm) and pass doSubmit as onConfirm
      showConfirm(confirmMsg, async () => {
        await doSubmit(requestData, url, method);
        closeConfirm();
      });

      return;
    }

    // If no LOP or within remaining, submit directly
    await doSubmit(requestData, url, method);
  };

  // Edit existing request
  const handleEdit = (request) => {
    setFormData({
      reason: request.reason,
      leavetype: request.leave_type,
      h_f_day: request.h_f_day || "Full Day",
      startDate: parseLocalDate(request.start_date),
      endDate: parseLocalDate(request.end_date),
    });
    setEditingId(request.id);
    setFormVisible(true);
  };

  // Cancel (delete) request
  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isVisible: true, message, onConfirm });
  };
  const closeConfirm = () =>
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });

  const handleCancel = (id) => {
    showConfirm(
      "Are you sure you want to cancel this leave request?",
      async () => {
        try {
          const response = await fetch(
            `${BACKEND}/cancel/${id}/${employeeId}`,
            { method: "DELETE", headers }
          );
          if (response.ok) {
            showAlert("Leave request cancelled successfully!");
            fetchLeaveRequests();
          } else {
            console.error("Failed to cancel leave request.");
            showAlert("Failed to cancel leave request.");
          }
        } catch (error) {
          console.error("Error cancelling leave request:", error);
          showAlert("An error occurred while cancelling the leave request.");
        }
        closeConfirm();
      }
    );
  };

  // Build leave type options from activePolicy.leave_settings
  const leaveTypeOptions = (activePolicy?.leave_settings || [])
    .filter((s) => s && (s.enabled === undefined ? true : s.enabled))
    .map((s) => ({
      type: s.type,
      label:
        s.type === "casual"
          ? "Casual Leave"
          : s.type === "earned"
          ? "Earned Leave"
          : s.type.charAt(0).toUpperCase() + s.type.slice(1),
      raw: s,
    }));

  // --- Venn diagram balances + total LOP with month navigation (HORIZONTAL) ---
  const monthName = (m) =>
    new Date(lopYear, m - 1, 1).toLocaleString(undefined, { month: "short" });

  const prevLopMonth = () => {
    if (lopMonth === 1) {
      setLopMonth(12);
      setLopYear((y) => y - 1);
    } else {
      setLopMonth((m) => m - 1);
    }
  };
  const nextLopMonth = () => {
    const cur = new Date();
    const curMonth = cur.getMonth() + 1;
    const curYear = cur.getFullYear();
    if (lopYear > curYear || (lopYear === curYear && lopMonth >= curMonth)) {
      return;
    }
    if (lopMonth === 12) {
      setLopMonth(1);
      setLopYear((y) => y + 1);
    } else {
      setLopMonth((m) => m + 1);
    }
  };

  // VENN: navigation for balances (not LOP card)
  const vennTotalCount = balances.length;
  const canPrevVenn = vennStartIndex > 0;
  const canNextVenn = vennStartIndex + vennVisibleCount < vennTotalCount;
  const prevVenn = () => {
    if (!canPrevVenn) return;
    setVennStartIndex((s) => Math.max(0, s - vennVisibleCount));
  };
  const nextVenn = () => {
    if (!canNextVenn) return;
    setVennStartIndex((s) =>
      Math.min(vennTotalCount - vennVisibleCount, s + vennVisibleCount)
    );
  };

  // Render a simple 2-circle Venn where left = Used, right = Remaining, union = Total
  const RenderVenn = ({ label, allowance = 0, used = 0, remaining = 0 }) => {
    // formatting helper: 1 decimal place
    const formatOne = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(1) : "0.0";
    };

    // Ensure numbers are sane (as numeric values)
    const aNum = Number.isFinite(Number(allowance)) ? Number(allowance) : 0;
    const uNum = Number.isFinite(Number(used)) ? Number(used) : 0;
    const rNum = Number.isFinite(Number(remaining))
      ? Number(remaining)
      : Math.max(aNum - uNum, 0);

    // when values are inconsistent, adjust remaining to match union
    const adjustedRemainingNum = Math.max(rNum, aNum - uNum);

    // geometry: choose circle positions so they overlap
    const width = 320;
    const height = 140;
    const rCircle = 74; // radius
    const cy = 70;
    const cx1 = 110; // left circle center
    const cx2 = 200; // right circle center (distance = 100 < r1+r2=120 => overlap)

    // midpoint (intersection center) used to place the Total label
    const midX = (cx1 + cx2) / 2;
    const midY = cy;

    return (
      <div
        className="venn-card venn-card-fixed"
        aria-label={`${label} leave balance`}
      >
        <div className="venn-label">{label}</div>
        <svg
          className="venn-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`venn-${label}-title`}
        >
          <title
            id={`venn-${label}-title`}
          >{`${label} - Used vs Remaining`}</title>

          {/* left circle: Used (semi-transparent) */}
          <circle
            cx={cx1}
            cy={cy}
            r={rCircle}
            fill="rgba(220,53,69,0.28)"
            stroke="rgba(220,53,69,0.6)"
          />

          {/* right circle: Remaining (semi-transparent) */}
          <circle
            cx={cx2}
            cy={cy}
            r={rCircle}
            fill="rgba(25,135,84,0.28)"
            stroke="rgba(25,135,84,0.6)"
          />

          {/* Used label */}
          <text
            x={cx1 - 12}
            y={cy - 22}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="22"
            fontWeight="600"
          >
            Used
          </text>
          <text
            x={cx1 - 11}
            y={cy + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="25"
            fontWeight="700"
          >
            {formatOne(uNum)}
          </text>

          {/* Remaining label */}
          <text
            x={cx2 + 11}
            y={cy - 22}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="22"
            fontWeight="600"
          >
            Bal
          </text>
          <text
            x={cx2 + 10}
            y={cy + 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="25"
            fontWeight="700"
          >
            {formatOne(adjustedRemainingNum)}
          </text>

          {/* TOTAL inside the overlap region (midpoint of centers) */}
          <g>
            <text
              x={midX}
              y={midY + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="800"
            >
              Total
            </text>
            <text
              x={midX}
              y={midY + 25}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
              fontWeight="700"
            >
              {formatOne(aNum)}
            </text>
          </g>
        </svg>
      </div>
    );
  };

  const renderVennBalanceSection = () => {
    if (!balances || balances.length === 0) return null;
    // compute policy period strings safely from activePolicy
    const start = activePolicy?.year_start
      ? new Date(activePolicy.year_start).toLocaleDateString()
      : "-";
    const end = activePolicy?.year_end
      ? new Date(activePolicy.year_end).toLocaleDateString()
      : "-";

    // slice balances according to current navigation window
    const visibleBalances = balances.slice(
      vennStartIndex,
      vennStartIndex + vennVisibleCount
    );

    // helper to format LOP with 1 decimal
    const formatLop = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(1) : "0.0";
    };

    return (
      <div className="venn-balance-section">
        {/* Policy period separate container */}
        <div className="policy-period">
          <div className="policy-modal-content">
            <div className="policy-period-row">
              <div>
                <span className="date-label">Current Policy Period :</span>
                <span className="date-value">
                  {start} - {end}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  className="show-lop-btn"
                  onClick={() => setShowLopCard((s) => !s)}
                  aria-pressed={showLopCard}
                  title={showLopCard ? "Hide Total LOP" : "Show Total LOP"}
                >
                  {showLopCard ? "Hide LOP" : "Show LOP"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LOP card + Venn cards with navigation */}
        <div className="venn-grid-with-nav">
          {/* LOP card (conditionally rendered) */}
          {showLopCard && (
            <div className="balance-mini-card total-lop-card">
              <div>
                <strong>Total LOP</strong>
              </div>

              <div className="lop-month-row">
                <button
                  type="button"
                  onClick={prevLopMonth}
                  aria-label="Previous month"
                >
                  ◀
                </button>
                <div>
                  {monthName(lopMonth)} {lopYear}
                </div>
                <button
                  type="button"
                  onClick={nextLopMonth}
                  aria-label="Next month"
                >
                  ▶
                </button>
              </div>

              <div className="lop-controls">
                {/* Format monthlyLop to 2 decimals */}
                <div className="lop-value">{formatLop(monthlyLop)} days</div>

                <div className="lop-actions">
                  <button
                    type="button"
                    className="recompute-button"
                    title="Force compute monthly LOP"
                    onClick={async () => {
                      await computeMonthlyLop(lopMonth, lopYear);
                    }}
                  >
                    Recompute
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons for venn cards */}
          <div className="venn-nav-column">
            <button
              className="venn-nav-btn venn-prev"
              onClick={prevVenn}
              disabled={!canPrevVenn}
              aria-label="Show previous balances"
              title={!canPrevVenn ? "No previous items" : "Previous"}
            >
              ◀
            </button>
          </div>

          {/* Visible Venn cards container */}
          <div
            className="venn-cards-container"
            role="list"
            aria-label="Leave balances"
          >
            {visibleBalances.map((b) => {
              const typeLabel =
                (b.type === "casual" && "Casual Leave") ||
                (b.type === "earned" && "Earned Leave") ||
                (b.type &&
                  String(b.type).charAt(0).toUpperCase() + b.type.slice(1)) ||
                "Other";
              const used = Number(b.used ?? 0);
              const allowance = Number(
                b.allowance ?? b.earned ?? b.annual_allowance ?? 0
              );
              const remaining = Number(
                b.remaining ?? Math.max(allowance - used, 0)
              );

              return (
                <div key={b.type} role="listitem" className="venn-card-wrapper">
                  <RenderVenn
                    label={typeLabel}
                    allowance={allowance}
                    used={used}
                    remaining={remaining}
                  />
                </div>
              );
            })}
            {/* If less than visible slots, render placeholders to keep layout stable */}
            {visibleBalances.length < vennVisibleCount &&
              Array.from({
                length: vennVisibleCount - visibleBalances.length,
              }).map((_, idx) => (
                <div key={`ph-${idx}`} className="venn-card-placeholder" />
              ))}
          </div>

          {/* Navigation right */}
          <div className="venn-nav-column">
            <button
              className="venn-nav-btn venn-next"
              onClick={nextVenn}
              disabled={!canNextVenn}
              aria-label="Show next balances"
              title={!canNextVenn ? "No more items" : "Next"}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPolicyInfo = () => {
    if (!activePolicy) return null;
    const start = new Date(activePolicy.year_start).toLocaleDateString();
    const end = new Date(activePolicy.year_end).toLocaleDateString();

    return (
      <div className="lv-policy-header">
        <h2 className="lv-title">Leave Queries</h2>

        {isPolicyModalOpen && (
          <Modal
            isVisible={isPolicyModalOpen}
            onClose={() => setPolicyModalOpen(false)}
            buttons={[
              { label: "Close", onClick: () => setPolicyModalOpen(false) },
            ]}
          >
            <div className="policy-modal-content">
              {/* Policy Period */}
              <div className="policy-dates">
                <div>
                  <span className="date-label">Start Date:</span>
                  <span className="date-value">{start}</span>
                </div>
                <div>
                  <span className="date-label">End Date:</span>
                  <span className="date-value">{end}</span>
                </div>
              </div>

              {/* Policy Note */}
              <div className="policy-note">
                <p>
                  <strong>Note:</strong> Leaves remaining after{" "}
                  <strong>{end}</strong> will{" "}
                  <span
                    className={
                      activePolicy.carry_forward_enabled
                        ? "carry-forward"
                        : "lapse"
                    }
                  >
                    {activePolicy.carry_forward_enabled
                      ? "be carried forward as per policy."
                      : "lapse at the end of the policy period."}
                  </span>
                </p>
              </div>

              {/* Leave Breakdown Table */}
              {Array.isArray(activePolicy.leave_settings) &&
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
          </Modal>
        )}
      </div>
    );
  };

  return (
    <div className="leave-container">
      {renderPolicyInfo()}

      {/* — replace the small compact cards with Venn diagrams */}
      <div>{renderVennBalanceSection()}</div>

      <div className="leave-filters">
        <label>From:</label>
        <input
          type="date"
          name="from_date"
          value={filters.from_date}
          onChange={handleFilterChange}
          className="date-filter-input"
        />
        <label>To:</label>
        <input
          type="date"
          name="to_date"
          value={filters.to_date}
          onChange={handleFilterChange}
          className="date-filter-input"
        />
        <button className="filter-button" onClick={handleFilterSubmit}>
          <IoSearch /> Search
        </button>

        <button className="leave-form-button" onClick={handleOpenModal}>
          Leave Request
        </button>
      </div>

      {isFormVisible && (
        <div className="leave-modal">
          <div className="leave-modal-content">
            <form className="leave-form" onSubmit={handleSubmit}>
              <div className="leave-form-header">
                <h2>Leave Request Form</h2>
                <MdOutlineCancel className="icon" onClick={handleCloseModal} />
              </div>

              <div className="leave-form-grid">
                <div className="leave-form-group">
                  <label>Type of Leave</label>
                  <select
                    name="leavetype"
                    value={formData.leavetype}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    {leaveTypeOptions.map((opt) => (
                      <option key={opt.type} value={opt.type}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="leave-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="leave-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    required
                  />
                </div>

                <div className="leave-form-group">
                  <label>Half/Full Day</label>
                  <select
                    name="h_f_day"
                    value={formData.h_f_day}
                    onChange={handleInputChange}
                    disabled={
                      formData.startDate &&
                      formData.endDate &&
                      formData.endDate > formData.startDate
                    }
                  >
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>

                <div className="leave-form-group">
                  <label>Leave Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="leave-form-actions">
                <button
                  type="button"
                  className="leave-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="leave-save">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {role === "Manager" && (
        <>
          <h4 className="my-leaves">Team Leave Requests</h4>
          <div className="leave-request-table">
            <table className="leave-requests">
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Half/Full Day</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests?.team
                  ?.sort((a, b) => b.leave_id - a.leave_id)
                  .map((leave) => {
                    const update = statusUpdates?.[leave.leave_id] || {};
                    const currentStatus = update.status || leave.status || "";
                    const statusClass =
                      currentStatus === "Approved"
                        ? "status-approved"
                        : currentStatus === "Rejected"
                        ? "status-rejected"
                        : "";
                    const isAlreadyUpdated = leave.status !== "pending";
                    const isUpdating =
                      update.status && update.status !== leave.status;
                    return (
                      <tr
                        key={leave.leave_id}
                        className={isAlreadyUpdated ? "row-updated" : ""}
                      >
                        <td>{leave.employee_id}</td>
                        <td>{leave.leave_type}</td>
                        <td>{parseLocalDate(leave.start_date)}</td>
                        <td>{parseLocalDate(leave.end_date)}</td>
                        <td>{leave.H_F_day}</td>
                        <td className="comments-col">
                          <div className="comment-preview">{leave.reason}</div>
                        </td>
                        <td>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                leave.leave_id,
                                "status",
                                e.target.value
                              )
                            }
                            className={`status-dropdown ${statusClass}`}
                            disabled={isAlreadyUpdated}
                          >
                            <option value="pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="comments-col">
                          <div className="comment-preview">
                            {leave.comments ? (
                              <span className="comments-display">
                                {leave.comments}
                              </span>
                            ) : (
                              <input
                                type="text"
                                placeholder="Enter Reason"
                                value={update.comments || ""}
                                onChange={(e) =>
                                  handleStatusChange(
                                    leave.leave_id,
                                    "comments",
                                    e.target.value
                                  )
                                }
                                className="comments-input"
                                disabled={isAlreadyUpdated}
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            className={`update-button ${
                              isAlreadyUpdated ? "disabled-button" : ""
                            }`}
                            onClick={() => handleUpdate(leave.leave_id)}
                            disabled={
                              isAlreadyUpdated ||
                              !isUpdating ||
                              (currentStatus === "Rejected" && !update.comments)
                            }
                          >
                            {isAlreadyUpdated ? "Updated" : "Update"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h4 className="my-leaves">My Leave Requests</h4>
      {/* Desktop Table View */}
      <div className="leave-request-table desktop-view">
        <table className="leave-requests">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Half/Full Day</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.self
              .sort((a, b) => b.start_date.localeCompare(a.start_date))
              .map((request) => (
                <tr key={request.id}>
                  <td>{request.leave_type}</td>
                  <td>{parseLocalDate(request.start_date)}</td>
                  <td>{parseLocalDate(request.end_date)}</td>
                  <td>{request.H_F_day}</td>
                  <td className="comment-col">
                    <div className="comment-preview">{request.reason}</div>
                  </td>
                  <td>
                    <span
                      className={`leave-status-label ${
                        request.status === "Approved"
                          ? "leave-approved"
                          : request.status === "Rejected"
                          ? "leave-rejected"
                          : ""
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="comment-col">
                    <div className="comment-preview">{request.comments}</div>
                  </td>
                  <td>
                    <MdOutlineEdit
                      onClick={() => {
                        if (
                          request.status !== "Approved" &&
                          request.status !== "Rejected"
                        )
                          handleEdit(request);
                      }}
                      className={`action-button ${
                        request.status === "Approved" ||
                        request.status === "Rejected"
                          ? "disabled"
                          : ""
                      }`}
                    />
                    <MdDeleteOutline
                      onClick={() => {
                        if (
                          request.status !== "Approved" &&
                          request.status !== "Rejected"
                        )
                          handleCancel(request.id);
                      }}
                      className={`action-button ${
                        request.status === "Approved" ||
                        request.status === "Rejected"
                          ? "disabled"
                          : ""
                      }`}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="mobile-view">
        {leaveRequests.self
          .sort((a, b) => b.start_date.localeCompare(a.start_date))
          .map((request) => (
            <div key={request.id} className="leave-card">
              <div className="leave-header">
                <span className="leave-type">{request.leave_type}</span>
                <span
                  className={`leave-status-label ${
                    request.status === "Approved"
                      ? "leave-approved"
                      : request.status === "Rejected"
                      ? "leave-rejected"
                      : ""
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <div className="leave-details">
                <p>
                  <strong>Start:</strong> {parseLocalDate(request.start_date)}
                </p>
                <p>
                  <strong>End:</strong> {parseLocalDate(request.end_date)}
                </p>
                <p>
                  <strong>Day Type:</strong> {request.H_F_day}
                </p>
                <p>
                  <strong>Reason:</strong> {request.reason}
                </p>
                <p>
                  <strong>Comments:</strong> {request.comments}
                </p>
              </div>
              <div className="leave-actions">
                <MdOutlineEdit
                  onClick={() => {
                    if (
                      request.status !== "Approved" &&
                      request.status !== "Rejected"
                    )
                      handleEdit(request);
                  }}
                  className={`action-button ${
                    request.status === "Approved" ||
                    request.status === "Rejected"
                      ? "disabled"
                      : ""
                  }`}
                />
                <MdDeleteOutline
                  onClick={() => {
                    if (
                      request.status !== "Approved" &&
                      request.status !== "Rejected"
                    )
                      handleCancel(request.id);
                  }}
                  className={`action-button ${
                    request.status === "Approved" ||
                    request.status === "Rejected"
                      ? "disabled"
                      : ""
                  }`}
                />
              </div>
            </div>
          ))}
      </div>
      <Modal
        title={alertModal.title}
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
      <Modal
        isVisible={confirmModal.isVisible}
        onClose={closeConfirm}
        buttons={[
          { label: "Cancel", onClick: closeConfirm },
          { label: "Confirm", onClick: confirmModal.onConfirm },
        ]}
      >
        <p>{confirmModal.message}</p>
      </Modal>
    </div>
  );
};

export default LeaveRequest;
