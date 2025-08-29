// src/components/LeaveRequest.js
import React, { useState, useEffect } from "react";
import "./LeaveRequest.css";
import Modal from "../Modal/Modal";
import CompensationPopup from "../LeaveQueries/CompensationPopup";
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

// parse date-only robustly (handles YYYY-MM-DD or full ISO)
const parseDateOnly = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (!isNaN(d.getTime())) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // fallback for 'YYYY-MM-DD'
  const parts = String(isoDate).split("-");
  if (parts.length >= 3) {
    const [y, m, day] = parts;
    return new Date(Number(y), Number(m) - 1, Number(day));
  }
  return null;
};

// inclusive day count (handles half-day single-day case via h_f_day)
const calculateDays = (startDate, endDate, h_f_day = "") => {
  const s = parseDateOnly(startDate);
  const e = parseDateOnly(endDate);
  if (!s || !e || e < s) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((e - s) / msPerDay);
  const total = diffDays >= 0 ? diffDays + 1 : 0;
  if (
    String(h_f_day).toLowerCase().includes("half") &&
    s.getTime() === e.getTime()
  ) {
    return 0.5;
  }
  return total;
};

// helper to normalize advance notice number from setting object
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

const rolesWithTeamView = new Set([
  "supervisor",
  "manager",
  "admin",
  "ceo",
  "super admin",
  "superadmin",
  "super_admin",
]);

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

  // Team-specific filters
  const [teamSearch, setTeamSearch] = useState("");
  const [teamStatus, setTeamStatus] = useState("");

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

  // NEW: separate LOP modal boolean (for Total LOP display)
  const [isLopModalOpen, setIsLopModalOpen] = useState(false);

  // Compensation popup (LOP) state — wired to CompensationPopup component (approval flows)
  const [lopModal, setLopModal] = useState({
    isVisible: false,
    leaveId: null,
    deficit: 0,
    days: 0,
    remaining: 0,
    message: "",
    compensatedDays: 0,
    deductedDays: 0,
    lopDays: 0,
    approveDeficit: null,
    setAllCompensated: null,
    setAllDeducted: null,
    applyFlexibleSplit: null,
    error: "",
  });

  // Venn navigation state (UI)
  const [vennStartIndex, setVennStartIndex] = useState(0);
  const [vennVisibleCount, setVennVisibleCount] = useState(6);

  const employeeId = employeeData?.employeeId;
  const name = employeeData?.name;
  const roleRaw = localStorage.getItem("userRole") || null;

  const roleNormalized = String(roleRaw || "")
    .toLowerCase()
    .replace(/[_\s]+/g, " ")
    .trim();

  const canViewTeam = rolesWithTeamView.has(roleNormalized);

  // ---------- Alerts/Modals ----------
  const showAlert = (message, title = "") => {
    // force-close compensation popup first to avoid stacking
    setLopModal((m) => ({ ...m, isVisible: false }));
    setTimeout(() => {
      setAlertModal({ isVisible: true, title, message });
    }, 120);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isVisible: true, message, onConfirm });
  };
  const closeConfirm = () =>
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });

  // ---------- Balance & Policy fetch ----------
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
      setVennStartIndex(0);
    } catch (err) {
      console.error(err);
      showAlert("Could not fetch leave balance.");
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/leave-policies`, { headers });
      const json = await res.json();
      setPolicies(json.data || []);
    } catch (err) {
      console.error("Could not fetch policies", err);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchLeaveBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    if (!Array.isArray(policies) || policies.length === 0) return;
    const today = new Date();
    const inRange = policies.find((p) => {
      try {
        const s = new Date(p.year_start);
        const e = new Date(p.year_end);
        return s <= today && today <= e;
      } catch {
        return false;
      }
    });
    setActivePolicy(
      inRange ||
        policies
          .slice()
          .sort((a, b) => new Date(b.year_start) - new Date(a.year_start))[0] ||
        null
    );
  }, [policies]);

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
    setVennVisibleCount(calcVisible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [balances.length]);

  // ---------- Fetch monthly LOP & compute handlers ----------
  const fetchMonthlyLop = async (month = lopMonth, year = lopYear) => {
    if (!employeeId) return 0;
    try {
      const url = `${BACKEND}/api/leave-policies/employee/${employeeId}/monthly-lop?month=${month}&year=${year}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
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

  const computeMonthlyLop = async (month = lopMonth, year = lopYear) => {
    if (!employeeId) return null;
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

  // fetch monthlyLop on change (so LOP modal is ready)
  useEffect(() => {
    (async () => {
      await fetchMonthlyLop(lopMonth, lopYear);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lopMonth, lopYear, employeeId]);

  // ---------- Fetch leave requests (self & team) ----------
  useEffect(() => {
    if (employeeId) fetchLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, teamSearch, teamStatus, filters.from_date, filters.to_date]);

  const extractArrayFromTeamResult = (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.message?.data)) return obj.message.data;
    if (Array.isArray(obj.message)) return obj.message;
    if (Array.isArray(obj.result)) return obj.result;
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) return obj[key];
    }
    return [];
  };

  const fetchLeaveRequests = async () => {
    try {
      // self requests
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
        selfRequests = selfResult?.data || selfResult?.message?.data || [];
        if (!Array.isArray(selfRequests))
          selfRequests = extractArrayFromTeamResult(selfResult);
      }

      // team requests (if allowed)
      let teamRequests = [];
      if (canViewTeam) {
        const teamUrl = `${BACKEND}/team-lead/${employeeId}`;
        const teamParams = new URLSearchParams();
        if (filters.from_date)
          teamParams.append("from_date", filters.from_date);
        if (filters.to_date) teamParams.append("to_date", filters.to_date);
        if (teamSearch) teamParams.append("search", teamSearch);
        if (teamStatus) teamParams.append("status", teamStatus);
        const teamFinalUrl = teamParams.toString()
          ? `${teamUrl}?${teamParams.toString()}`
          : teamUrl;
        const teamResponse = await fetch(teamFinalUrl, {
          method: "GET",
          headers,
        });
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          const maybeArray = extractArrayFromTeamResult(
            teamResult?.data ?? teamResult ?? teamResult?.message ?? {}
          );
          teamRequests = maybeArray;
        } else {
          console.warn(
            "Team request fetch returned non-OK status",
            teamResponse.status
          );
        }
      }

      setLeaveRequests({ self: selfRequests, team: teamRequests });
      setStatusUpdates({});
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setLeaveRequests({ self: [], team: [] });
    }
  };

  // ---------- Utility: load leave balance for an employee (cache per-page) ----------
  const [leaveBalancesCache, setLeaveBalancesCache] = useState({});
  const loadLeaveBalance = async (employeeIdToLoad) => {
    if (!employeeIdToLoad) return [];
    if (leaveBalancesCache[employeeIdToLoad])
      return leaveBalancesCache[employeeIdToLoad];
    try {
      const url = `${BACKEND}/api/leave-policies/employee/${employeeIdToLoad}/leave-balance`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr = json.data || [];
      setLeaveBalancesCache((prev) => ({ ...prev, [employeeIdToLoad]: arr }));
      return arr;
    } catch (err) {
      console.warn("loadLeaveBalance failed:", err);
      setLeaveBalancesCache((prev) => ({ ...prev, [employeeIdToLoad]: [] }));
      return [];
    }
  };

  // ---------- doUpdateLocal: normalized PUT to admin endpoint ----------
  const doUpdateLocal = async (leaveId, payload = {}, closeModal = null) => {
    try {
      // normalize similar to Admin.doUpdate
      let compensatedRaw;
      if (payload.hasOwnProperty("compensated_days"))
        compensatedRaw = payload.compensated_days;
      else if (payload.hasOwnProperty("compensatedDays"))
        compensatedRaw = payload.compensatedDays;
      else if (payload.hasOwnProperty("compensated"))
        compensatedRaw = payload.compensated;
      else compensatedRaw = 0;
      const compensated = Number(compensatedRaw) || 0;

      let deductedRaw;
      if (payload.hasOwnProperty("deducted_days"))
        deductedRaw = payload.deducted_days;
      else if (payload.hasOwnProperty("deductedDays"))
        deductedRaw = payload.deductedDays;
      else if (payload.hasOwnProperty("deducted"))
        deductedRaw = payload.deducted;
      else deductedRaw = 0;
      const deducted = Number(deductedRaw) || 0;

      let lopRaw;
      if (payload.hasOwnProperty("loss_of_pay_days"))
        lopRaw = payload.loss_of_pay_days;
      else if (payload.hasOwnProperty("lopDays")) lopRaw = payload.lopDays;
      else if (payload.hasOwnProperty("loss_of_pay"))
        lopRaw = payload.loss_of_pay;
      else lopRaw = 0;
      const lop = Number(lopRaw) || 0;

      let preservedRaw = null;
      if (payload.hasOwnProperty("preserved_leave_days"))
        preservedRaw = payload.preserved_leave_days;
      else if (payload.hasOwnProperty("preservedLeaveDays"))
        preservedRaw = payload.preservedLeaveDays;
      else if (payload.hasOwnProperty("preserved"))
        preservedRaw = payload.preserved;
      const preserved =
        preservedRaw === null || preservedRaw === undefined
          ? null
          : Number(preservedRaw);

      let status = "";
      if (payload.hasOwnProperty("status")) status = payload.status;
      else if (payload.hasOwnProperty("statusText"))
        status = payload.statusText;

      let comments = null;
      if (payload.hasOwnProperty("comments")) comments = payload.comments;
      else if (payload.hasOwnProperty("comment")) comments = payload.comment;

      // actorId fallback from localStorage (optional)
      let actorId = null;
      try {
        const raw = localStorage.getItem("dashboardData");
        if (raw) {
          const parsed = JSON.parse(raw);
          actorId = parsed?.employeeId ?? parsed?.id ?? null;
        }
      } catch (_) {
        actorId = null;
      }

      const fullPayload = {
        status,
        comments,
        compensated_days: compensated,
        deducted_days: deducted,
        loss_of_pay_days: lop,
        preserved_leave_days: preserved === undefined ? null : preserved,
        actorId,
      };

      const url = `${BACKEND}/admin/leave/${leaveId}`;
      console.log("[doUpdateLocal] PUT", url, fullPayload);

      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(fullPayload),
      });

      let json = null;
      let text = null;
      try {
        json = await res.json();
      } catch (e) {
        try {
          text = await res.text();
        } catch {
          text = "<failed to read text>";
        }
      }

      if (!res.ok) {
        const serverMsg =
          (json && (json.message || (json.error && json.error.message))) ||
          text ||
          `Server returned ${res.status}`;
        console.warn("[doUpdateLocal] server error:", serverMsg);
        showAlert(serverMsg);
        return { ok: false, status: res.status, body: json || text };
      }

      if (json && json.success) {
        // refresh the list after update
        await fetchLeaveRequests();
        if (closeModal) closeModal(); // close modal on success
        showAlert("Leave updated successfully!");
        return { ok: true, status: res.status, body: json };
      }

      const serverMsg =
        (json && (json.message || json.error)) ||
        "Failed to update leave (no success flag)";
      console.warn("[doUpdateLocal] warning:", serverMsg);
      showAlert(serverMsg);
      return { ok: false, status: res.status, body: json };
    } catch (err) {
      console.error("[doUpdateLocal] unexpected:", err);
      showAlert(
        err?.message || "Error updating leave (network or client error)."
      );
      return { ok: false, error: err };
    }
  };

  // ---------- handleUpdate: supervisor uses same logic as admin ----------
  const handleUpdate = async (leaveId) => {
    const upd = statusUpdates[leaveId] || {};
    // find the corresponding leave in team data
    const query = (leaveRequests.team || []).find(
      (l) => l.leave_id === leaveId
    );
    console.log("[handleUpdate-supervisor] invoked", { leaveId, upd, query });
    if (!query) {
      showAlert("Leave request not found in current team list.");
      return;
    }

    if (upd.status === "Approved") {
      const days = calculateDays(
        query.start_date,
        query.end_date,
        query.H_F_day
      );
      const balances = await loadLeaveBalance(query.employee_id);
      const bal = (balances || []).find((r) => r.type === query.leave_type);
      const remaining =
        bal && bal.remaining !== undefined ? Number(bal.remaining) || 0 : 0;
      const deficit = Math.max(0, days - remaining);
      const EPS = 1e-6;

      const approveDeficit = async () => {
        const preserved_leave_days = Number(remaining) || 0;
        const result = await doUpdateLocal(leaveId, {
          ...(upd || {}),
          status: "Approved",
          compensated_days: 0,
          deducted_days: 0,
          loss_of_pay_days: Number(days) || 0,
          preserved_leave_days,
          total_days: Number(days),
        });
        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result &&
              (result.message || (result.body && result.body.message))) ||
            JSON.stringify(result && result.body) ||
            "Failed to approve as LoP — see alert.";
          setLopModal((m) => ({ ...m, error: serverMsg }));
        }
        return result;
      };

      const setAllCompensated = async () => {
        const compensated_days = Number(days) || 0;
        const preserved_leave_days = Number(remaining) || 0;
        const result = await doUpdateLocal(leaveId, {
          ...(upd || {}),
          status: "Approved",
          compensated_days,
          deducted_days: 0,
          loss_of_pay_days: 0,
          preserved_leave_days,
          total_days: Number(days),
        });
        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result &&
              (result.message || (result.body && result.body.message))) ||
            JSON.stringify(result && result.body) ||
            "Failed to set all compensated — see alert.";
          setLopModal((m) => ({ ...m, error: serverMsg }));
        }
        return result;
      };

      const setAllDeducted = async () => {
        const daysNum = Number(days) || 0;
        const remainingNum = Number(remaining) || 0;
        const deducted_clamped = Math.min(daysNum, remainingNum);
        const lop_days = Math.max(0, daysNum - deducted_clamped);
        const preserved_leave_days = Math.max(
          0,
          remainingNum - deducted_clamped
        );
        const result = await doUpdateLocal(leaveId, {
          ...(upd || {}),
          status: "Approved",
          compensated_days: 0,
          deducted_days: deducted_clamped,
          loss_of_pay_days: lop_days,
          preserved_leave_days,
          total_days: Number(days),
        });
        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result &&
              (result.message || (result.body && result.body.message))) ||
            JSON.stringify(result && result.body) ||
            "Failed to set all deducted — see alert.";
          setLopModal((m) => ({ ...m, error: serverMsg }));
        }
        return result;
      };

      const applyFlexibleSplit = async (
        compensatedDays,
        deductedDays,
        lopDays
      ) => {
        const c = Number(compensatedDays) || 0;
        const d = Number(deductedDays) || 0;
        const l = Number(lopDays) || 0;
        if (Math.abs(c + d + l - days) > EPS) {
          const msg = `Split values must add up to total requested days (${days}). Received: compensated=${c}, deducted=${d}, loss_of_pay=${l}.`;
          setLopModal((m) => ({ ...m, error: msg }));
          return { ok: false, message: "validation_failed", body: msg };
        }
        const deducted_clamped = Math.min(Number(remaining) || 0, d);
        if (deducted_clamped + EPS < d) {
          const msg = `Deducted days (${d}) exceed remaining (${remaining}). Please adjust.`;
          setLopModal((m) => ({ ...m, error: msg }));
          return {
            ok: false,
            message: "deducted_exceeds_remaining",
            body: msg,
          };
        }
        let preserved_leave_days = Math.max(
          0,
          Number(remaining) - Number(deducted_clamped)
        );
        preserved_leave_days = Number(preserved_leave_days.toFixed(2));
        const payload = {
          ...(upd || {}),
          status: "Approved",
          compensated_days: Number(c.toFixed(2)),
          deducted_days: Number(deducted_clamped.toFixed(2)),
          loss_of_pay_days: Number(l.toFixed(2)),
          preserved_leave_days,
        };
        const result = await doUpdateLocal(leaveId, payload);
        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else if (
          result &&
          result.status &&
          result.status >= 200 &&
          result.status < 300
        ) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result &&
              (result.message || (result.body && result.body.message))) ||
            JSON.stringify(result && result.body) ||
            "Failed to apply split — see alert.";
          setLopModal((m) => ({ ...m, error: serverMsg }));
        }
        return result;
      };

      // Open compensation popup with prepared handlers and defaults
      // NOTE: this opens the compensation popup used for approval flows (NOT the Total-LOP modal)
      setLopModal({
        isVisible: true,
        leaveId,
        deficit: Number(deficit),
        days: Number(days),
        remaining: Number(remaining),
        message: `Employee requested ${days} day(s); remaining balance = ${remaining}. Deficit = ${deficit}. Choose how to allocate the ${days} requested days:`,
        compensatedDays: 0,
        deductedDays: Math.min(Number(remaining), Number(days)),
        lopDays: Math.max(
          0,
          Number(days) - Math.min(Number(remaining), Number(days))
        ),
        approveDeficit,
        setAllCompensated,
        setAllDeducted,
        applyFlexibleSplit,
        error: "",
      });
      return;
    }

    // Not Approved or simple flow: send simple update
    const result = await doUpdateLocal(leaveId, upd);
    if (result && result.ok) {
      const msg = (result.body && result.body.message) || "Leave updated";
      showAlert(msg);
    } else {
      const message =
        (result && result.message) || "Failed to update leave request.";
      showAlert(message);
    }
  };

  // ---------- Status change UI handler ----------
  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...prev[leaveId], [key]: value },
    }));
  };

  // ---------- Form/Submit related functions (existing) ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "leavetype") {
      if (!value) {
        setSelectedSetting(null);
      } else {
        const ls = (activePolicy?.leave_settings || []).find(
          (s) => (s.type || "").toLowerCase() === String(value).toLowerCase()
        );
        setSelectedSetting(ls || null);
        const noticeDays = getAdvanceNoticeDays(ls);
        if (ls && noticeDays > 0) {
          showAlert(
            `Note: ${value} requires applying at least ${noticeDays} day(s) before the start date.`
          );
        }
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

  const computeRequestedDays = (start, end, h_f_day) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    if (h_f_day === "Half Day") return 0.5;
    return diff;
  };

  const getBalanceForType = (type) => {
    if (!balances || balances.length === 0) return null;
    return (
      balances.find(
        (b) => String(b.type).toLowerCase() === String(type).toLowerCase()
      ) || null
    );
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.leavetype ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      showAlert("Please fill in all required fields.");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showAlert("End date cannot be earlier than start date.");
      return;
    }
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
    const requestedDays = computeRequestedDays(
      formData.startDate,
      formData.endDate,
      formData.h_f_day
    );
    const balanceRow = getBalanceForType(setting.type);
    let allowance = 0,
      used = 0,
      remaining = 0,
      carry_forward = Number(setting.carry_forward || 0);
    if (balanceRow) {
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
      if (String(setting.type).toLowerCase() === "earned")
        allowance = Number(setting.earned_leaves || 0) + carry_forward;
      else allowance = Number(setting.value || 0) + carry_forward;
      used = 0;
      remaining = allowance - used;
    }
    if (!employeeId || !name) {
      showAlert("Employee data not found. Please log in again.");
      return;
    }
    const requestData = { employeeId, name, ...formData };
    const url = editingId
      ? `${BACKEND}/edit/${editingId}`
      : `${BACKEND}/employee/leave`;
    const method = editingId ? "PUT" : "POST";
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
    if (requestedDays > remaining) {
      const deficit = requestedDays - remaining;
      const confirmMsg = `You're requesting ${requestedDays} day(s), but you have only ${remaining} remaining (${allowance} allowance, ${used} used, ${carry_forward} carry-forward). This will incur ${deficit} Loss-of-Pay day(s). Do you want to continue?`;
      showConfirm(confirmMsg, async () => {
        await doSubmit(requestData, url, method);
        closeConfirm();
      });
      return;
    }
    await doSubmit(requestData, url, method);
  };

  const handleEdit = (request) => {
    setFormData({
      reason: request.reason,
      leavetype: request.leave_type,
      h_f_day: request.H_F_day || "Full Day",
      startDate: parseLocalDate(request.start_date),
      endDate: parseLocalDate(request.end_date),
    });
    setEditingId(request.id || request.leave_id || null);
    setFormVisible(true);
  };

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

  // ---------- UI pieces reused from earlier file (Venn etc.) ----------
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
    if (lopYear > curYear || (lopYear === curYear && lopMonth >= curMonth))
      return;
    if (lopMonth === 12) {
      setLopMonth(1);
      setLopYear((y) => y + 1);
    } else {
      setLopMonth((m) => m + 1);
    }
  };

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

  const RenderVenn = ({ label, allowance = 0, used = 0, remaining = 0 }) => {
    const formatOne = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(1) : "0.0";
    };
    const aNum = Number.isFinite(Number(allowance)) ? Number(allowance) : 0;
    const uNum = Number.isFinite(Number(used)) ? Number(used) : 0;
    const rNum = Number.isFinite(Number(remaining))
      ? Number(remaining)
      : Math.max(aNum - uNum, 0);
    const adjustedRemainingNum = Math.max(rNum, aNum - uNum);
    const width = 320,
      height = 140,
      rCircle = 74,
      cy = 70,
      cx1 = 110,
      cx2 = 200;
    const midX = (cx1 + cx2) / 2,
      midY = cy;
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
          <circle
            cx={cx1}
            cy={cy}
            r={rCircle}
            fill="rgba(220,53,69,0.28)"
            stroke="rgba(220,53,69,0.6)"
          />
          <circle
            cx={cx2}
            cy={cy}
            r={rCircle}
            fill="rgba(25,135,84,0.28)"
            stroke="rgba(25,135,84,0.6)"
          />
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
    const start = activePolicy?.year_start
      ? new Date(activePolicy.year_start).toLocaleDateString()
      : "-";
    const end = activePolicy?.year_end
      ? new Date(activePolicy.year_end).toLocaleDateString()
      : "-";
    const visibleBalances = balances.slice(
      vennStartIndex,
      vennStartIndex + vennVisibleCount
    );
    return (
      <div className="venn-balance-section">
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
                {/* OPEN the Total-LOP modal (separate boolean) */}
                <button
                  type="button"
                  className="show-lop-btn"
                  onClick={() => setIsLopModalOpen(true)}
                >
                  Show LOP
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="venn-grid-with-nav">
          <div className="venn-nav-column">
            <button
              className="venn-nav-btn venn-prev"
              onClick={prevVenn}
              disabled={!canPrevVenn}
            >
              ◀
            </button>
          </div>
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
            {visibleBalances.length < vennVisibleCount &&
              Array.from({
                length: vennVisibleCount - visibleBalances.length,
              }).map((_, idx) => (
                <div key={`ph-${idx}`} className="venn-card-placeholder" />
              ))}
          </div>
          <div className="venn-nav-column">
            <button
              className="venn-nav-btn venn-next"
              onClick={nextVenn}
              disabled={!canNextVenn}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="leave-container">
      {/* Policy header (small) */}
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
                      activePolicy?.carry_forward_enabled
                        ? "carry-forward"
                        : "lapse"
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
          </Modal>
        )}
      </div>

      {/* Venn balances */}
      <div>{renderVennBalanceSection()}</div>

      {/* Filters */}
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
        {canViewTeam && (
          <>
            <label>Search:</label>
            <input
              type="text"
              placeholder="Name, Emp ID, Reason"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="team-search-input"
            />
            <label>Status:</label>
            <div>
              <select
                className="team-search-input"
                value={teamStatus}
                onChange={(e) => setTeamStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </>
        )}
        <button className="filter-button" onClick={handleFilterSubmit}>
          <IoSearch /> Search
        </button>
        <button className="leave-form-button" onClick={handleOpenModal}>
          Leave Request
        </button>
      </div>

      {/* Leave request form modal */}
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

      {/* Team Leave Requests (Supervisor/Admin style table) */}
      {canViewTeam && (
        <>
          <h4 className="my-leaves">Team Leave Requests</h4>
          <div className="leave-request-table">
            <table className="leave-requests">
              <thead>
                <tr>
                  <th>Emp Name</th>
                  <th>Emp ID</th>
                  <th>Leave Type</th>
                  <th>Half/Full Day</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(leaveRequests.team || [])
                  .sort(
                    (a, b) =>
                      (b.leave_id || b.id || 0) - (a.leave_id || a.id || 0)
                  )
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
                    const statusBy =
                      leave.status_by ||
                      leave.approved_by ||
                      leave.updated_by ||
                      "";
                    const days = calculateDays(
                      leave.start_date,
                      leave.end_date,
                      leave.H_F_day
                    );
                    return (
                      <tr
                        key={leave.leave_id || leave.id}
                        className={isAlreadyUpdated ? "row-updated" : ""}
                      >
                        <td>
                          {leave.name ||
                            `${leave.first_name || ""} ${
                              leave.last_name || ""
                            }`.trim()}
                        </td>
                        <td>{leave.employee_id}</td>
                        <td>{leave.leave_type}</td>
                        <td>{leave.H_F_day}</td>
                        <td>{parseLocalDate(leave.start_date)}</td>
                        <td>{parseLocalDate(leave.end_date)}</td>
                        <td className="comments-col">
                          <div className="comment-preview">{leave.reason}</div>
                        </td>
                        <td>{days}</td>
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

      {/* My Leave Requests (self) - unchanged UI */}
      <h4 className="my-leaves">My Leave Requests</h4>
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
            {(leaveRequests.self || [])
              .sort((a, b) =>
                String(b.start_date).localeCompare(String(a.start_date))
              )
              .map((request) => (
                <tr key={request.id || request.leave_id}>
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
                          handleCancel(request.id || request.leave_id);
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

      {/* mobile view (self) */}
      <div className="mobile-view">
        {(leaveRequests.self || [])
          .sort((a, b) =>
            String(b.start_date).localeCompare(String(a.start_date))
          )
          .map((request) => (
            <div key={request.id || request.leave_id} className="leave-card">
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
                      handleCancel(request.id || request.leave_id);
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

      {/* Compensation popup (rendered BEFORE alert) - ONLY opens when lopModal.isVisible */}
      <CompensationPopup lopModal={lopModal} setLopModal={setLopModal} />

      {/* Alerts & Confirm modals */}
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

      {/* Total LOP Modal (separate from compensation popup) */}
      <Modal
        isVisible={isLopModalOpen}
        onClose={() => setIsLopModalOpen(false)}
        buttons={[
          { label: "Close", onClick: () => setIsLopModalOpen(false) },
          {
            label: "Recompute",
            onClick: async () => {
              await computeMonthlyLop(lopMonth, lopYear);
            },
          },
        ]}
      >
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
            <button
              type="button"
              onClick={nextLopMonth}
              aria-label="Next month"
            >
              ▶
            </button>
          </div>

          <div
            className="lop-value-big"
            style={{ fontSize: 28, marginTop: 12 }}
          >
            {Number.isFinite(Number(monthlyLop))
              ? monthlyLop.toFixed(2)
              : "0.00"}{" "}
            days
          </div>

          <p className="lop-note" style={{ marginTop: 12 }}>
            Note: Use Recompute if the displayed value looks outdated.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveRequest;
