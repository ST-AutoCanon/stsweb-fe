// src/components/LeaveQueries/useLeaveRequest.js
import { useState, useEffect } from "react";
import {
  defaultLeaveSettings,
  computeRequestedDays,
  getAdvanceNoticeDays,
  parseLocalDate,
  calculateDays,
} from "./leaveUtils";

const API_KEY = process.env.REACT_APP_API_KEY;
const BACKEND = process.env.REACT_APP_BACKEND_URL;
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

export default function useLeaveRequest() {
  // UI state
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    leavetype: "",
    h_f_day: "Full Day",
    startDate: "",
    endDate: "",
  });
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

  // Filters/team
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [teamSearch, setTeamSearch] = useState("");
  const [teamStatus, setTeamStatus] = useState("");

  // data
  const [balances, setBalances] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [activePolicy, setActivePolicy] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState({ self: [], team: [] });

  // venn state
  const now = new Date();
  const [lopMonth, setLopMonth] = useState(now.getMonth() + 1);
  const [lopYear, setLopYear] = useState(now.getFullYear());
  const [monthlyLop, setMonthlyLop] = useState(0);

  // LOP approve popup state (Admin flow uses a CompensationPopup component)
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

  const roleRaw = localStorage.getItem("userRole") || null;
  const roleNormalized = String(roleRaw || "")
    .toLowerCase()
    .replace(/[_\s]+/g, " ")
    .trim();
  const canViewTeam = rolesWithTeamView.has(roleNormalized);

  // internal caches
  const [leaveBalancesCache, setLeaveBalancesCache] = useState({});

  // ----- Alerts/Confirm helpers -----
  const showAlert = (message, title = "") => {
    // close LOP popup first just in case
    setLopModal((m) => ({ ...m, isVisible: false }));
    setTimeout(() => setAlertModal({ isVisible: true, title, message }), 120);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const showConfirm = (message, onConfirm) =>
    setConfirmModal({ isVisible: true, message, onConfirm });
  const closeConfirm = () =>
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });

  // ----- Fetchers -----
  const fetchLeaveBalance = async () => {
    const employeeId = employeeData?.employeeId;
    if (!employeeId) return;
    try {
      const res = await fetch(
        `${BACKEND}/api/leave-policies/employee/${employeeId}/leave-balance`,
        { headers }
      );
      if (!res.ok) throw new Error("Failed to load leave balance");
      const json = await res.json();
      setBalances(json.data || []);
    } catch (err) {
      console.error("fetchLeaveBalance:", err);
      showAlert("Could not fetch leave balance.");
      setBalances([]);
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/leave-policies`, { headers });
      const json = await res.json();
      setPolicies(json.data || []);
    } catch (err) {
      console.error("fetchPolicies:", err);
      setPolicies([]);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchLeaveBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Array.isArray(policies) || policies.length === 0) {
      setActivePolicy(null);
      return;
    }
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

  // fetch leave requests
  useEffect(() => {
    if (employeeData?.employeeId) fetchLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employeeData?.employeeId,
    teamSearch,
    teamStatus,
    filters.from_date,
    filters.to_date,
  ]);

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
      const employeeId = employeeData?.employeeId;
      if (!employeeId) return;
      // self
      const selfUrl = `${BACKEND}/employee/leave/${employeeId}`;
      const selfParams = new URLSearchParams();
      if (filters.from_date) selfParams.append("from_date", filters.from_date);
      if (filters.to_date) selfParams.append("to_date", filters.to_date);
      const selfFinalUrl = selfParams.toString()
        ? `${selfUrl}?${selfParams}`
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

      // team
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
          ? `${teamUrl}?${teamParams}`
          : teamUrl;
        const teamResponse = await fetch(teamFinalUrl, {
          method: "GET",
          headers,
        });
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          teamRequests = extractArrayFromTeamResult(
            teamResult?.data ?? teamResult ?? teamResult?.message ?? {}
          );
        } else {
          console.warn("Team fetch returned non-ok", teamResponse.status);
        }
      }

      setLeaveRequests({ self: selfRequests, team: teamRequests });
    } catch (err) {
      console.error("fetchLeaveRequests error:", err);
      setLeaveRequests({ self: [], team: [] });
    }
  };

  // leave balance loader (per employee cache)
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

  // helper to get balance for current user type
  const getBalanceForType = (type) => {
    if (!balances || balances.length === 0) return null;
    return (
      balances.find(
        (b) => String(b.type).toLowerCase() === String(type).toLowerCase()
      ) || null
    );
  };

  // ----- Form related -----
  const resetForm = () => {
    setFormData({
      reason: "",
      leavetype: "",
      h_f_day: "Full Day",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  const openForm = () => {
    resetForm();
    setFormVisible(true);
  };
  const closeForm = () => {
    resetForm();
    setFormVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (
        (name === "startDate" || name === "endDate") &&
        next.startDate &&
        next.endDate
      ) {
        if (new Date(next.endDate) > new Date(next.startDate))
          next.h_f_day = "Full Day";
      }
      return next;
    });
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
            `${BACKEND}/cancel/${id}/${employeeData.employeeId}`,
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

  /**
   * handleSubmit
   * - robustly picks setting: first from activePolicy (if present), falling back
   *   to defaultLeaveSettings when no policy or leave type not found in policy.
   * - ALWAYS enforces advance notice days where configured (including default settings when no policy).
   * - If requestedDays > remaining AND there is NO active policy, doSubmit runs directly
   *   (no LOP confirmation popup).
   */
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    // basic validation
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

    // Determine the applicable setting:
    // 1) Try activePolicy.leave_settings (if policy exists)
    // 2) If not found there, fall back to defaultLeaveSettings
    const selectedType = String(formData.leavetype || "").toLowerCase();

    let setting = null;
    if (activePolicy && Array.isArray(activePolicy.leave_settings)) {
      setting = activePolicy.leave_settings.find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      );
    }
    // fallback to global defaults if not found in activePolicy or no activePolicy
    if (!setting) {
      setting = defaultLeaveSettings.find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      );
    }

    if (!setting) {
      showAlert("Selected leave type is not available.");
      return;
    }

    // enforce advance notice (ALWAYS use the selected setting, even when no active policy)
    const noticeDays = getAdvanceNoticeDays(setting);
    if (!editingId && noticeDays > 0) {
      const today = new Date();
      // produce date-only (midnight) to avoid timezone surprises
      const minDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      minDate.setDate(minDate.getDate() + noticeDays);

      const chosenStartRaw = new Date(formData.startDate);
      const chosenStart = new Date(
        chosenStartRaw.getFullYear(),
        chosenStartRaw.getMonth(),
        chosenStartRaw.getDate()
      );

      if (chosenStart < minDate) {
        // If there is no active policy, be explicit in the message (user requested that)
        if (!activePolicy) {
          showAlert(
            `By default, a ${setting.type} request requires at least ${noticeDays} day(s) advance. You must apply at least ${noticeDays} day(s) before the start date.`
          );
        } else {
          showAlert(
            `You must apply for ${formData.leavetype} at least ${noticeDays} day(s) before the start date.`
          );
        }
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

    const requestData = {
      employeeId: employeeData.employeeId,
      name: employeeData.name,
      ...formData,
    };
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

    // When requestedDays > remaining AND there is NO active policy -> DO NOT show confirm for LOP;
    // just submit (user's requirement).
    if (requestedDays > remaining && !activePolicy) {
      await doSubmit(requestData, url, method);
      return;
    }

    // If requested > remaining and there IS active policy, show confirm about LoP
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

  // expose everything UI will need
  return {
    // state
    isFormVisible,
    formData,
    editingId,
    alertModal,
    confirmModal,
    balances,
    policies,
    activePolicy,
    leaveRequests,
    lopModal,
    monthlyLop,
    lopMonth,
    lopYear,

    // getters/mappings
    defaultLeaveSettings,
    canViewTeam,

    // actions
    openForm,
    closeForm,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleCancel,

    // filters
    filters,
    setFilters,
    teamSearch,
    setTeamSearch,
    teamStatus,
    setTeamStatus,
    fetchLeaveRequests,

    // modals & LOP
    setLopModal,
    fetchMonthlyLop: async (m, y) => {
      if (!employeeData?.employeeId) return 0;
      try {
        const url = `${BACKEND}/api/leave-policies/employee/${employeeData.employeeId}/monthly-lop?month=${m}&year=${y}`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    },
    computeMonthlyLop: async (m, y) => {
      if (!employeeData?.employeeId) return null;
      try {
        const url = `${BACKEND}/api/leave-policies/employee/${employeeData.employeeId}/compute-monthly-lop`;
        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ month: m, year: y }),
        });
        if (!res.ok) throw new Error("Compute failed");
        const json = await res.json();
        const payload = json?.data || {};
        const val = Number(
          payload.total_lop ?? payload.totalLop ?? payload.lop ?? 0
        );
        setMonthlyLop(Number.isFinite(val) ? val : 0);
        return val;
      } catch (err) {
        console.error("Compute monthly LOP failed:", err);
        showAlert("Failed to compute monthly LOP.");
        return null;
      }
    },

    // alert helpers
    showAlert,
    closeAlert,
    showConfirm,
    closeConfirm,

    // misc
    setFormData,
    setEditingId,
    setAlertModal,
    setConfirmModal,
    setBalances,
    setPolicies,
    setActivePolicy,
    setMonthlyLop,
    setLopMonth,
    setLopYear,
    loadLeaveBalance,
    getBalanceForType,
  };
}
