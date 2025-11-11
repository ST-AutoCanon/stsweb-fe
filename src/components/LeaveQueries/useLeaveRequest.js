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
const headersBase = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
  // note: x-employee-id header added per-request when actorId known
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

const managerOrAboveSet = new Set([
  "manager",
  "admin",
  "ceo",
  "super admin",
  "superadmin",
  "super_admin",
]);

const normalizeStatus = (s) => {
  if (s === null || s === undefined) return "";
  const str = String(s).trim();
  if (!str) return "";
  const low = str.toLowerCase();
  if (low === "pending") return "Pending";
  if (low === "approved") return "Approved";
  if (low === "rejected") return "Rejected";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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

  // status updates for TeamTable editing
  // shape: { [leaveId]: { status?: 'Pending'|'Approved'|'Rejected', comments?: '...' } }
  const [statusUpdates, setStatusUpdates] = useState({});

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
        { headers: headersBase }
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
      const res = await fetch(`${BACKEND}/api/leave-policies`, {
        headers: headersBase,
      });
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
        headers: headersBase,
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

        // optional departments filter if manager has departments saved in localStorage
        try {
          const md = localStorage.getItem("managedDepartments");
          if (md) {
            const arr = JSON.parse(md);
            if (Array.isArray(arr) && arr.length) {
              teamParams.append("departments", arr.join(","));
            }
          }
        } catch (e) {
          // ignore parse error
        }

        const teamFinalUrl = teamParams.toString()
          ? `${teamUrl}?${teamParams}`
          : teamUrl;
        const teamResponse = await fetch(teamFinalUrl, {
          method: "GET",
          headers: headersBase,
        });
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          teamRequests = extractArrayFromTeamResult(
            teamResult?.data ?? teamResult ?? teamResult?.message ?? {}
          );
        } else {
          console.warn("Team fetch returned non-ok", teamResponse.status);
        }

        // ------------------ NEW: client-side filtering fixes ------------------
        // 1) Always filter out current user's own leaves from the team list
        // 2) If current user is a supervisor (not manager/admin), hide supervisor-owned leaves in team list.
        try {
          if (Array.isArray(teamRequests) && meId) {
            teamRequests = teamRequests.filter((r) => {
              const rowEmpId = (
                r.employee_id ||
                r.employeeId ||
                r.empId ||
                r.employee ||
                ""
              )
                .toString()
                .trim();

              // 1) Exclude the current user (their leaves belong in "My Leaves")
              if (rowEmpId && String(rowEmpId) === String(meId)) return false;

              // 2) The server should already scope correctly, but defensively:
              // if the current viewer is NOT manager-or-above, hide rows that belong to employees
              // whose role is 'supervisor' (supervisor-owned leaves visible only to manager/admin).
              if (!managerOrAboveSet.has(roleNormalized)) {
                const roleFields = (
                  r.role ||
                  r.emp_role ||
                  r.employee_role ||
                  r.role_name ||
                  r.roleName ||
                  r.position ||
                  ""
                )
                  .toString()
                  .toLowerCase();

                const isSupervisorRow =
                  roleFields.includes("supervisor") ||
                  roleFields === "supervisor";

                // also consider explicit flags (some APIs set is_supervisor or is_manager)
                const isSupervisorFlag =
                  r.is_supervisor === 1 ||
                  r.isSupervisor === 1 ||
                  r.is_supervisor === true ||
                  r.isSupervisor === true;

                // If the row is a supervisor-owned leave, hide it from non-manager viewers.
                if (isSupervisorRow || isSupervisorFlag) {
                  return false;
                }
              }

              // otherwise keep the row
              return true;
            });
          }
        } catch (e) {
          console.warn("Client-side team filter failed:", e);
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
      const res = await fetch(url, { headers: headersBase });
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
            { method: "DELETE", headers: headersBase }
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
   * handleSubmit (employee submit) - unchanged from previous behavior
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
    const selectedType = String(formData.leavetype || "").toLowerCase();

    let setting = null;
    if (activePolicy && Array.isArray(activePolicy.leave_settings)) {
      setting = activePolicy.leave_settings.find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      );
    }
    if (!setting) {
      setting = defaultLeaveSettings.find(
        (s) => String(s.type || "").toLowerCase() === selectedType
      );
    }

    if (!setting) {
      showAlert("Selected leave type is not available.");
      return;
    }

    // enforce advance notice
    const noticeDays = getAdvanceNoticeDays(setting);
    if (!editingId && noticeDays > 0) {
      const today = new Date();
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
          headers: headersBase,
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
          return { ok: true, body: responseData };
        } else {
          console.error(
            "Failed to submit leave request:",
            responseData.message
          );
          showAlert(responseData.message || "Failed to submit leave request.");
          return { ok: false, body: responseData };
        }
      } catch (error) {
        console.error("Error submitting leave request:", error);
        showAlert("An error occurred while submitting the leave request.");
        return { ok: false, error };
      }
    };

    // requestedDays > remaining and no active policy -> submit directly
    if (requestedDays > remaining && !activePolicy) {
      return await doSubmit(requestData, url, method);
    }

    // requestedDays > remaining AND active policy -> confirm LOP
    if (requestedDays > remaining) {
      const deficit = requestedDays - remaining;
      const confirmMsg = `You're requesting ${requestedDays} day(s), but you have only ${remaining} remaining (${allowance} allowance, ${used} used, ${carry_forward} carry-forward). This will incur ${deficit} Loss-of-Pay day(s). Do you want to continue?`;
      showConfirm(confirmMsg, async () => {
        await doSubmit(requestData, url, method);
        closeConfirm();
      });
      return { ok: true, modalOpened: true };
    }

    return await doSubmit(requestData, url, method);
  };

  // ----- Manager / Supervisor update logic (for TeamTable) -----

  /**
   * doUpdate - robust, shared update caller for admin/manager actions
   * returns object like { ok: boolean, status?, body? }
   */
  const doUpdate = async (leaveId, payload = {}) => {
    try {
      // normalize numeric synonyms
      const compensated =
        Number(
          payload.compensated_days ??
            payload.compensatedDays ??
            payload.compensated ??
            0
        ) || 0;
      const deducted =
        Number(
          payload.deducted_days ?? payload.deductedDays ?? payload.deducted ?? 0
        ) || 0;
      const lop =
        Number(
          payload.loss_of_pay_days ??
            payload.lopDays ??
            payload.loss_of_pay ??
            0
        ) || 0;

      const preservedRaw =
        payload.preserved_leave_days ??
        payload.preservedLeaveDays ??
        payload.preserved;
      const preserved =
        preservedRaw === null || preservedRaw === undefined
          ? null
          : Number(preservedRaw);

      const status = payload.status ?? payload.statusText ?? "";
      const comments = payload.comments ?? payload.comment ?? null;

      // actorId fallback from localStorage
      let actorId = null;
      try {
        const raw = localStorage.getItem("dashboardData");
        if (raw) {
          const parsed = JSON.parse(raw);
          actorId = parsed.employeeId ?? parsed.id ?? null;
        }
      } catch (e) {
        actorId = null;
      }

      const isDefaulted =
        payload.is_defaulted === true ||
        payload.isDefaulted === true ||
        payload.is_defaulted === "true" ||
        payload.isDefaulted === "true"
          ? true
          : false;

      const fullPayload = {
        status,
        comments,

        compensated_days: compensated,
        compensatedDays: compensated,
        compensated: compensated,

        deducted_days: deducted,
        deductedDays: deducted,
        deducted: deducted,

        loss_of_pay_days: lop,
        lopDays: lop,
        loss_of_pay: lop,

        preserved_leave_days: preserved === undefined ? null : preserved,
        preservedLeaveDays: preserved === undefined ? null : preserved,
        preserved: preserved === undefined ? null : preserved,

        total_days:
          payload.total_days ??
          payload.totalDays ??
          payload.totalDaysRequested ??
          null,
        totalDays:
          payload.totalDays ??
          payload.total_days ??
          payload.totalDaysRequested ??
          null,

        actorId,
        is_defaulted: isDefaulted,
        isDefaulted: isDefaulted,
      };

      const headersForReq = { ...headersBase };
      if (actorId) headersForReq["x-employee-id"] = actorId;

      const url = `${BACKEND}/admin/leave/${leaveId}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: headersForReq,
        body: JSON.stringify(fullPayload),
      });

      let json = null;
      let text = null;
      try {
        json = await res.json();
      } catch (err) {
        try {
          text = await res.text();
        } catch (e) {
          text = `<failed to read text: ${String(e)}>`;
        }
      }

      if (!res.ok) {
        const serverMsg =
          (json && (json.message || (json.error && json.error.message))) ||
          text ||
          `Server returned ${res.status}`;
        showAlert(serverMsg);
        return { ok: false, status: res.status, body: json || text };
      }

      if (json && json.success) {
        // refresh list
        await fetchLeaveRequests();
        return { ok: true, status: res.status, body: json };
      } else {
        const serverMsg =
          (json && (json.message || json.error)) ||
          "Failed to update leave (no success flag)";
        showAlert(serverMsg);
        return { ok: false, status: res.status, body: json };
      }
    } catch (err) {
      console.error("doUpdate unexpected error:", err);
      showAlert(
        "Error updating leave (network or client error). Check console."
      );
      return { ok: false, error: err };
    }
  };

  const findActivePolicyForRequestDate = (request) => {
    if (!request) return null;
    if (!Array.isArray(policies) || policies.length === 0) return null;
    const startDate = request.start_date || request.startDate || null;
    if (!startDate) return null;
    try {
      const req = new Date(startDate);
      req.setHours(0, 0, 0, 0);
      for (const p of policies) {
        try {
          const s = new Date(p.year_start);
          const e = new Date(p.year_end);
          s.setHours(0, 0, 0, 0);
          e.setHours(0, 0, 0, 0);
          if (s <= req && req <= e) return p;
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  /**
   * handleStatusChange - called by TeamTable when user edits select/input
   * keeps changes in statusUpdates state so TeamTable can read them
   */
  const handleStatusChange = (leaveId, key, value) => {
    const val = key === "status" ? normalizeStatus(value) : value;
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...(prev[leaveId] || {}), [key]: val },
    }));
  };

  /**
   * onUpdate - called when manager clicks Update for a particular leave row.
   * Accepts (leaveId, leaveObj) — leaveObj is optional but we use it when provided.
   *
   * IMPORTANT: returns an object in all code paths.
   * - successful network update: { ok: true, ... }
   * - failure: { ok: false, ... }
   * - modal opened for further input: { modalOpened: true }
   */
  const onUpdate = async (leaveId, leaveObj = null) => {
    const upd = statusUpdates[leaveId] || {};
    const newStatus = normalizeStatus(upd.status ?? "");
    const serverStatus = normalizeStatus(
      (leaveObj && (leaveObj.status ?? leaveObj.Status)) ?? ""
    );

    // If rejecting, require comment either in upd.comments or existing leaveObj.comments
    if (/^rejected$/i.test(newStatus)) {
      const commentProvided =
        (upd.comments && String(upd.comments).trim()) ||
        (leaveObj && leaveObj.comments && String(leaveObj.comments).trim());
      if (!commentProvided) {
        showAlert("Please add comments when rejecting a leave.");
        return { ok: false, message: "comment_required" };
      }
    }

    // if approving: handle LOP logic & activePolicy
    if (/^approved$/i.test(newStatus)) {
      // need leaveObj to compute days and balances; if not passed find it from leaveRequests
      let query = leaveObj;
      if (!query) {
        const all = (leaveRequests.team || []).concat(leaveRequests.self || []);
        query = all.find((r) => String(r.leave_id ?? r.id) === String(leaveId));
      }
      if (!query) {
        showAlert("Could not find leave request details for update.");
        return { ok: false, message: "no_request_found" };
      }

      const days = calculateDays(query.start_date, query.end_date);
      const balances = await loadLeaveBalance(query.employee_id);
      const bal = balances.find(
        (r) =>
          String(r.type).toLowerCase() ===
          String(query.leave_type).toLowerCase()
      );
      const remaining =
        bal && bal.remaining !== undefined ? Number(bal.remaining) || 0 : 0;

      const deficit = Math.max(0, days - remaining);
      const activePolicyForRequest = findActivePolicyForRequestDate(query);

      if (!activePolicyForRequest) {
        // No active policy: perform simple approve with default LoP (mark is_defaulted)
        const simplePayload = {
          ...(upd || {}),
          status: "Approved",

          compensated_days: 0,
          compensatedDays: 0,
          compensated: 0,

          deducted_days: 0,
          deductedDays: 0,
          deducted: 0,

          loss_of_pay_days: Number(days),
          lopDays: Number(days),
          loss_of_pay: Number(days),

          preserved_leave_days: remaining > 0 ? Number(remaining) : null,
          preservedLeaveDays: remaining > 0 ? Number(remaining) : null,
          preserved: remaining > 0 ? Number(remaining) : null,

          total_days: Number(days),
          totalDays: Number(days),

          is_defaulted: true,
          isDefaulted: true,
        };

        const result = await doUpdate(leaveId, simplePayload);
        if (result && result.ok) {
          showAlert((result.body && result.body.message) || "Leave updated");
        } else {
          // doUpdate already showed alert when server returned an error
        }
        return result || { ok: false, message: "update_failed" };
      }

      // Active policy -> set up handlers and open lopModal
      const approveDeficit = async () => {
        const preserved_leave_days = Number(remaining) || 0;
        const lopDaysVal = Number(days) || 0;

        const payload = {
          ...(upd || {}),
          status: "Approved",

          compensated_days: 0,
          compensatedDays: 0,
          compensated: 0,

          deducted_days: 0,
          deductedDays: 0,
          deducted: 0,

          loss_of_pay_days: lopDaysVal,
          lopDays: lopDaysVal,
          loss_of_pay: lopDaysVal,

          preserved_leave_days,
          preservedLeaveDays: preserved_leave_days,
          preserved: preserved_leave_days,

          total_days: Number(days),
          totalDays: Number(days),

          is_defaulted: false,
          isDefaulted: false,
        };

        const result = await doUpdate(leaveId, payload);
        if (result && result.ok) {
          showAlert((result.body && result.body.message) || "Leave updated");
        } else {
          setLopModal((m) => ({ ...m, error: "Failed to approve deficit." }));
        }
        return result;
      };

      const setAllCompensated = async () => {
        const compensated_days = Number(days) || 0;
        const preserved_leave_days = Number(remaining) || 0;

        const payload = {
          ...(upd || {}),
          status: "Approved",

          compensated_days: compensated_days,
          compensatedDays: compensated_days,
          compensated: compensated_days,

          deducted_days: 0,
          deductedDays: 0,
          deducted: 0,

          loss_of_pay_days: 0,
          lopDays: 0,
          loss_of_pay: 0,

          preserved_leave_days,
          preservedLeaveDays: preserved_leave_days,
          preserved: preserved_leave_days,

          total_days: Number(days),
          totalDays: Number(days),

          is_defaulted: false,
          isDefaulted: false,
        };

        const result = await doUpdate(leaveId, payload);
        if (result && result.ok) {
          showAlert((result.body && result.body.message) || "Leave updated");
        } else {
          setLopModal((m) => ({
            ...m,
            error: "Failed to set all compensated.",
          }));
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

        const payload = {
          ...(upd || {}),
          status: "Approved",

          compensated_days: 0,
          compensatedDays: 0,
          compensated: 0,

          deducted_days: deducted_clamped,
          deductedDays: deducted_clamped,
          deducted: deducted_clamped,

          loss_of_pay_days: lop_days,
          lopDays: lop_days,
          loss_of_pay: lop_days,

          preserved_leave_days,
          preservedLeaveDays: preserved_leave_days,
          preserved: preserved_leave_days,

          total_days: Number(days),
          totalDays: Number(days),

          is_defaulted: false,
          isDefaulted: false,
        };

        const result = await doUpdate(leaveId, payload);
        if (result && result.ok) {
          showAlert((result.body && result.body.message) || "Leave updated");
        } else {
          setLopModal((m) => ({ ...m, error: "Failed to set all deducted." }));
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
        const EPS = 1e-6;
        if (Math.abs(c + d + l - days) > EPS) {
          const msg = `Split values must add up to total requested days (${days}).`;
          setLopModal((m) => ({ ...m, error: msg }));
          return { ok: false, message: "validation_failed", body: msg };
        }

        const deducted_clamped = Math.min(Number(remaining) || 0, d);
        if (deducted_clamped < d) {
          const msg = `Deducted days (${d}) exceed remaining (${remaining}).`;
          setLopModal((m) => ({ ...m, error: msg }));
          return {
            ok: false,
            message: "deducted_exceeds_remaining",
            body: msg,
          };
        }

        const preserved_leave_days = Number(
          Math.max(0, Number(remaining) - deducted_clamped).toFixed(2)
        );

        const payload = {
          ...(upd || {}),
          status: "Approved",

          compensated_days: Number(c.toFixed(2)),
          compensatedDays: Number(c.toFixed(2)),
          compensated: Number(c.toFixed(2)),

          deducted_days: Number(deducted_clamped.toFixed(2)),
          deductedDays: Number(deducted_clamped.toFixed(2)),
          deducted: Number(deducted_clamped.toFixed(2)),

          loss_of_pay_days: Number(l.toFixed(2)),
          lopDays: Number(l.toFixed(2)),
          loss_of_pay: Number(l.toFixed(2)),

          preserved_leave_days: preserved_leave_days,
          preservedLeaveDays: preserved_leave_days,
          preserved: preserved_leave_days,

          total_days: Number(days),
          totalDays: Number(days),

          is_defaulted: false,
          isDefaulted: false,
        };

        const result = await doUpdate(leaveId, payload);
        if (result && result.ok) {
          showAlert((result.body && result.body.message) || "Leave updated");
        } else {
          setLopModal((m) => ({ ...m, error: "Failed to apply split." }));
        }
        return result;
      };

      setLopModal({
        isVisible: true,
        leaveId,
        deficit: Number(deficit),
        days: Number(days),
        remaining: Number(remaining),
        message: `Employee requested ${days} day(s); remaining balance = ${remaining}. Deficit = ${deficit}. Choose how to allocate the ${days} requested days:`,
        compensatedDays: 0,
        deductedDays: Math.min(Number(remaining), Number(days)),
        lopDays: Math.max(0, days - Math.min(Number(remaining), Number(days))),
        approveDeficit,
        setAllCompensated,
        setAllDeducted,
        applyFlexibleSplit,
        error: "",
      });

      // IMPORTANT: signal to caller (TeamTable) that modal was opened and NOT an error
      return { ok: true, modalOpened: true };
    }

    // non-approved (e.g., pending -> rejected), simple update
    const sendPayload = {
      ...(statusUpdates[leaveId] || {}),
      status: normalizeStatus(upd.status ?? serverStatus ?? ""),
    };
    const result = await doUpdate(leaveId, sendPayload);
    if (result && result.ok) {
      showAlert((result.body && result.body.message) || "Leave updated");
    }
    return result || { ok: false, message: "update_failed" };
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
        const res = await fetch(url, { headers: headersBase });
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
          headers: headersBase,
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

    // status updates for TeamTable
    statusUpdates,
    handleStatusChange,
    onUpdate,

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
