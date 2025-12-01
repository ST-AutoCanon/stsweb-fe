import React, { useState, useEffect } from "react";
import "./Admin.css";
import PolicyModal from "./PolicyModal";
import Modal from "../Modal/Modal";
import CompensationPopup from "./CompensationPopup";
import { IoSearch } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { computeRequestedDays } from "./leaveUtils";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};

const parseDateOnly = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) {
    const parts = isoDate.split("-");
    if (parts.length >= 3) {
      const [y, m, day] = parts;
      return new Date(Number(y), Number(m) - 1, Number(day));
    }
    return null;
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const API_BASE = process.env.REACT_APP_BACKEND_URL;
const headers = {
  "x-api-key": process.env.REACT_APP_API_KEY,
  "Content-Type": "application/json",
};

export default function Admin({ openPolicyId = null }) {
  const [leaveQueries, setLeaveQueries] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [updatedQueries, setUpdatedQueries] = useState(new Set());
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState({});
  const location = useLocation();

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const [policyAlerts, setPolicyAlerts] = useState([]);
  const [showPolicyAlertsModal, setShowPolicyAlertsModal] = useState(false);

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

  const showAlert = (message, title = "") => {
    setLopModal((m) => ({ ...m, isVisible: false }));
    setTimeout(() => {
      setAlertModal({ isVisible: true, title, message });
    }, 120);
  };
  const closeAlert = () =>
    setAlertModal({ isVisible: false, title: "", message: "" });

  const daysUntil = (dateStr) => {
    if (!dateStr) return Infinity;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = d - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const computePolicyAlerts = (policyList = []) => {
    if (!Array.isArray(policyList)) return [];
    return policyList
      .map((p) => {
        const daysLeft = daysUntil(p.year_end);
        if (daysLeft < 0) return null;

        let severity = null;
        if (daysLeft <= 5) severity = "critical";
        else if (daysLeft <= 10) severity = "warning";
        if (!severity) return null;

        return {
          id: p.id,
          policy: p,
          daysLeft,
          severity,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const sevOrder = { critical: 0, warning: 1 };
        if (sevOrder[a.severity] !== sevOrder[b.severity]) {
          return sevOrder[a.severity] - sevOrder[b.severity];
        }
        return a.daysLeft - b.daysLeft;
      });
  };

  const fetchPolicies = async () => {
    try {
      const url = `${API_BASE}/api/leave-policies`;
      const res = await fetch(url, { headers });
      const json = await res.json();
      setPolicies(json.data || []);
      return json.data || [];
    } catch (err) {
      console.error("Failed to fetch leave policies:", err);
      showAlert("Could not load leave policies.");
      setPolicies([]);
      return [];
    }
  };

  useEffect(() => {
    const alerts = computePolicyAlerts(policies);
    setPolicyAlerts(alerts);
    setShowPolicyAlertsModal(alerts.length > 0);
  }, [policies]);

  useEffect(() => {
    (async () => {
      await fetchPolicies();
      await fetchLeaveQueries();
    })();
  }, [statusFilter, fromDate, toDate, search]);

  useEffect(() => {
    if (openPolicyId) {
      setShowPolicyModal(true);
      setShowPolicyAlertsModal(false);
    }
  }, [openPolicyId]);

  const fetchLeaveQueries = async () => {
    try {
      const paramsObj = {};
      if (search) paramsObj.search = search;
      if (statusFilter) paramsObj.status = statusFilter;
      if (fromDate) paramsObj.from_date = fromDate;
      if (toDate) paramsObj.to_date = toDate;

      const params = new URLSearchParams(paramsObj).toString();
      const url = `${API_BASE}/admin/leave${params ? `?${params}` : ""}`;
      const res = await fetch(url, { headers });
      let json = null;
      try {
        json = await res.json();
      } catch (e) {
        console.error("[fetchLeaveQueries] JSON parse error", e);
        const text = await res.text();
        showAlert("Failed to parse server response for leave queries.");
        return;
      }
      if (json.success) {
        setLeaveQueries(json.data || []);
        setStatusUpdates({});
      } else {
        showAlert(json.message || "Failed to fetch leave queries");
      }
    } catch (err) {
      console.error("[fetchLeaveQueries] Error:", err);
      showAlert("Error fetching leave queries");
    }
  };

  const loadLeaveBalance = async (employeeId) => {
    if (leaveBalances[employeeId]) {
      return leaveBalances[employeeId];
    }
    try {
      const url = `${API_BASE}/api/leave-policies/employee/${employeeId}/leave-balance`;
      const res = await fetch(url, { headers });
      let json = null;
      try {
        json = await res.json();
      } catch (e) {
        console.error("[loadLeaveBalance] JSON parse error", e);
        const text = await res.text();
        setLeaveBalances((b) => ({ ...b, [employeeId]: [] }));
        return [];
      }
      const data = json.data || [];
      setLeaveBalances((b) => ({ ...b, [employeeId]: data }));
      return data;
    } catch (err) {
      console.error("[loadLeaveBalance] Error:", err);
      return [];
    }
  };

  const handleDeletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/leave-policies/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchPolicies();
    } catch (err) {
      console.error("Failed to delete policy:", err);
      showAlert("Failed to delete policy.");
    }
  };

  const doUpdate = async (leaveId, payload = {}, query = null) => {
    try {
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
      else comments = null;

      let actorId = null;
      try {
        const raw = localStorage.getItem("dashboardData");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.employeeId !== undefined)
            actorId = parsed.employeeId;
          else if (parsed && parsed.id !== undefined) actorId = parsed.id;
        }
      } catch (e) {
        actorId = null;
      }

      const providedInternal = payload && payload._internalOrigin === "system";
      const isDefaulted =
        providedInternal &&
        (payload.is_defaulted === true ||
          payload.isDefaulted === true ||
          payload.is_defaulted === "true" ||
          payload.isDefaulted === "true")
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
          payload &&
          (payload.total_days ??
            payload.totalDays ??
            payload.totalDaysRequested ??
            null),
        totalDays:
          payload &&
          (payload.totalDays ??
            payload.total_days ??
            payload.totalDaysRequested ??
            null),

        actorId,

        is_defaulted: isDefaulted,
        isDefaulted: isDefaulted,

        _internalOrigin: payload._internalOrigin ?? null,
        __internal_system: payload.__internal_system === true,
      };

      try {
        const c = Number(fullPayload.compensated_days ?? 0) || 0;
        const d = Number(fullPayload.deducted_days ?? 0) || 0;
        const l = Number(fullPayload.loss_of_pay_days ?? 0) || 0;
        const isDefaultedFlag = !!fullPayload.is_defaulted;

        let days = null;
        if (
          fullPayload.total_days !== null &&
          fullPayload.total_days !== undefined
        ) {
          days = Number(fullPayload.total_days) || 0;
        } else if (
          query &&
          (query.start_date || query.startDate) &&
          (query.end_date || query.endDate)
        ) {
          days = computeRequestedDays(
            query.start_date || query.startDate,
            query.end_date || query.endDate,
            query.H_F_day || query.h_f_day || "Full Day"
          );
        }

        const EPS = 1e-6;
        if (
          /^Approved$/i.test(status) &&
          !isDefaultedFlag &&
          days !== null &&
          Math.abs(c + d + l - days) > EPS
        ) {
          console.warn(
            "[doUpdate] preflight blocked invalid split; opening popup if possible",
            { leaveId, c, d, l, days }
          );
          if (query) {
            const balances = await loadLeaveBalance(query.employee_id);
            const bal = balances.find((r) => r.type === query.leave_type);
            const remaining =
              bal && bal.remaining !== undefined
                ? Number(bal.remaining) || 0
                : 0;
            const deficit = Math.max(0, days - remaining);

            const approveDeficit = async () => {
              const preserved_leave_days = Number(remaining) || 0;
              const lopDaysVal = Number(days) || 0;
              const payload2 = {
                ...(payload || {}),
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
                is_defaulted: true,
                isDefaulted: true,
                _internalOrigin: "system",
                __internal_system: true,
              };
              return await doUpdate(leaveId, payload2, query);
            };

            const setAllCompensated = async () => {
              const compensated_days = Number(days) || 0;
              const preserved_leave_days = Number(remaining) || 0;
              const payload2 = {
                ...(payload || {}),
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
                _internalOrigin: "system",
                __internal_system: true,
              };
              return await doUpdate(leaveId, payload2, query);
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
              const payload2 = {
                ...(payload || {}),
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
                _internalOrigin: "system",
                __internal_system: true,
              };
              return await doUpdate(leaveId, payload2, query);
            };

            const applyFlexibleSplit = async (
              compensatedDays,
              deductedDays,
              lopDays
            ) => {
              const EPS = 1e-6;
              const cLocal = Number(compensatedDays) || 0;
              const dLocal = Number(deductedDays) || 0;
              const lLocal = Number(lopDays) || 0;
              if (Math.abs(cLocal + dLocal + lLocal - days) > EPS) {
                const msg = `Split values must add up to total requested days (${days}).`;
                setLopModal((m) => ({ ...m, error: msg }));
                return { ok: false, message: "validation_failed", body: msg };
              }
              if (dLocal > remaining + EPS) {
                const msg = `Deducted days (${dLocal}) exceed remaining (${remaining}). Please adjust.`;
                setLopModal((m) => ({ ...m, error: msg }));
                return {
                  ok: false,
                  message: "deducted_exceeds_remaining",
                  body: msg,
                };
              }
              let preserved_leave_days = Math.max(
                0,
                Number(remaining) - Number(dLocal)
              );
              preserved_leave_days = Number(preserved_leave_days.toFixed(2));
              const payload2 = {
                ...(payload || {}),
                status: "Approved",
                compensated_days: Number(cLocal.toFixed(2)),
                compensatedDays: Number(cLocal.toFixed(2)),
                compensated: Number(cLocal.toFixed(2)),
                deducted_days: Number(dLocal.toFixed(2)),
                deductedDays: Number(dLocal.toFixed(2)),
                deducted: Number(dLocal.toFixed(2)),
                loss_of_pay_days: Number(lLocal.toFixed(2)),
                lopDays: Number(lLocal.toFixed(2)),
                loss_of_pay: Number(lLocal.toFixed(2)),
                preserved_leave_days,
                preservedLeaveDays: preserved_leave_days,
                preserved: preserved_leave_days,
                total_days: Number(days),
                totalDays: Number(days),
                is_defaulted: false,
                isDefaulted: false,
                _internalOrigin: "system",
                __internal_system: true,
              };
              return await doUpdate(leaveId, payload2, query);
            };

            setLopModal({
              isVisible: true,
              leaveId,
              deficit: Math.max(0, days - remaining),
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

            return { ok: true, modalOpened: true };
          }

          showAlert(
            "Attempted to approve but split values are invalid — please use the compensation popup."
          );
          return { ok: false, message: "invalid_splits" };
        }
      } catch (preflightErr) {
        console.warn("[doUpdate] preflight check failed safely:", preflightErr);
      }

      const headersForReq = { ...headers };
      if (actorId) headersForReq["x-employee-id"] = actorId;

      const url = `${API_BASE}/admin/leave/${leaveId}`;

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
        console.warn("[doUpdate] Server error:", serverMsg);
        showAlert(serverMsg);
        return { ok: false, status: res.status, body: json || text };
      }

      if (json && json.success) {
        setUpdatedQueries((s) => new Set(s).add(leaveId));
        await fetchLeaveQueries();
        return { ok: true, status: res.status, body: json };
      } else {
        const serverMsg =
          (json && (json.message || json.error)) ||
          "Failed to update leave (no success flag)";
        console.warn("[doUpdate] Warning:", serverMsg);
        showAlert(serverMsg);
        return { ok: false, status: res.status, body: json };
      }
    } catch (err) {
      console.error("[doUpdate] Unexpected error:", err);
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

  const handleUpdate = async (leaveId, query) => {
    const raw = statusUpdates[leaveId] || {};
    const upd = { ...raw };
    delete upd.is_defaulted;
    delete upd.isDefaulted;
    delete upd._internalOrigin;

    if (upd.status === "Approved") {
      const days = computeRequestedDays(
        query.start_date,
        query.end_date,
        query.H_F_day || query.h_f_day || "Full Day"
      );

      if (!Array.isArray(policies) || policies.length === 0) {
        try {
          await fetchPolicies();
        } catch (err) {
          console.warn("[handleUpdate] fetchPolicies failed:", err);
        }
      }

      const balances = await loadLeaveBalance(query.employee_id);
      const bal = balances.find((r) => r.type === query.leave_type);
      const remaining =
        bal && bal.remaining !== undefined ? Number(bal.remaining) || 0 : 0;

      const deficit = Math.max(0, days - remaining);
      const EPS = 1e-6;

      const activePolicyForRequest = findActivePolicyForRequestDate(query);

      if (!activePolicyForRequest) {
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
          _internalOrigin: "system",
        };

        const result = await doUpdate(leaveId, simplePayload, query);
        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const msg =
            (result &&
              (result.message || (result.body && result.body.message))) ||
            "Failed to update leave";
          showAlert(msg);
        }
        return result;
      }

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
          _internalOrigin: "system",
          __internal_system: true,
        };

        const result = await doUpdate(leaveId, payload, query);

        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result && result.message) ||
            (result && result.body && result.body.message) ||
            JSON.stringify(result && result.body) ||
            "Failed to approve as LoP — see alert.";
          console.warn("[approveDeficit] server failure:", serverMsg);
          setLopModal((m) => ({ ...m, error: serverMsg }));
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
          _internalOrigin: "system",
          __internal_system: true,
        };

        const result = await doUpdate(leaveId, payload, query);

        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result && result.message) ||
            (result && result.body && result.body.message) ||
            JSON.stringify(result && result.body) ||
            "Failed to set all compensated — see alert.";
          console.warn("[setAllCompensated] server failure:", serverMsg);
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
          _internalOrigin: "system",
          __internal_system: true,
        };

        const result = await doUpdate(leaveId, payload, query);

        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result && result.message) ||
            (result && result.body && result.body.message) ||
            JSON.stringify(result && result.body) ||
            "Failed to set all deducted — see alert.";
          console.warn("[setAllDeducted] server failure:", serverMsg);
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
          console.warn("[applyFlexibleSplit] validation failed", {
            days,
            c,
            d,
            l,
          });
          return { ok: false, message: "validation_failed", body: msg };
        }

        const deducted_clamped = Math.min(Number(remaining) || 0, d);
        if (deducted_clamped + EPS < d) {
          const msg = `Deducted days (${d}) exceed remaining (${remaining}). Please adjust.`;
          setLopModal((m) => ({ ...m, error: msg }));
          console.warn("[applyFlexibleSplit] deducted > remaining", {
            d,
            remaining,
          });
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
          _internalOrigin: "system",
          __internal_system: true,
        };

        const result = await doUpdate(leaveId, payload, query);

        if (result && result.ok) {
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else if (
          result &&
          result.status &&
          result.status >= 200 &&
          result.status < 300
        ) {
          console.warn(
            "[applyFlexibleSplit] fallback: treating 2xx as success",
            result
          );
          const msg = (result.body && result.body.message) || "Leave updated";
          showAlert(msg);
        } else {
          const serverMsg =
            (result && result.message) ||
            (result && result.body && result.body.message) ||
            JSON.stringify(result && result.body) ||
            "Failed to apply split — see alert.";
          console.warn("[applyFlexibleSplit] server failure:", serverMsg);
          setLopModal((m) => ({ ...m, error: serverMsg }));
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
      return { modalOpened: true, ok: true };
    }

    const result = await doUpdate(leaveId, upd);
    if (result && result.ok) {
      const msg = (result.body && result.body.message) || "Leave updated";
      showAlert(msg);
    }

    return result;
  };

  const handleStatusChange = (leaveId, key, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [leaveId]: { ...prev[leaveId], [key]: value },
    }));
  };

  return (
    <div className="admin-container">
      <div className="policy-header">
        <h2>Leave Queries</h2>
        <button
          className="manage-button"
          onClick={() => setShowPolicyModal(true)}
        >
          Manage Leave Policies
        </button>
      </div>

      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onSaved={() => {
          fetchPolicies();
          fetchLeaveQueries();
          setShowPolicyModal(false);
        }}
        existingPolicies={policies}
        openPolicyId={openPolicyId}
      />

      <Modal
        isVisible={showPolicyAlertsModal}
        onClose={() => setShowPolicyAlertsModal(false)}
        buttons={[
          { label: "Ignore & Auto-extend", onClick: handleDeletePolicy },
          {
            label: "View Policy",
            onClick: () => {
              setShowPolicyModal(true);
              setShowPolicyAlertsModal(false);
            },
          },
        ]}
      >
        <div className="policy-alerts-modal-content">
          <h4>Policy End Alerts</h4>
          {policyAlerts.length === 0 && <p>No policy alerts.</p>}
          {policyAlerts.map((a) => (
            <div
              key={a.id}
              className={`policy-alert-item ${
                a.severity === "critical" ? "alert-critical" : "alert-warning"
              }`}
              style={{
                padding: "10px",
                borderRadius: 6,
                marginBottom: 8,
                background: a.severity === "critical" ? "#fff1f0" : "#fff8e6",
                borderLeft:
                  a.severity === "critical"
                    ? "4px solid #e74c3c"
                    : "4px solid #ffb020",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {a.severity === "critical"
                      ? "Policy ending soon — ACTION REQUIRED"
                      : "Policy ending soon"}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    Period:{" "}
                    <strong>
                      {new Date(a.policy.year_start).toLocaleDateString()} —{" "}
                      {new Date(a.policy.year_end).toLocaleDateString()}
                    </strong>
                    {" • "}
                    <span style={{ fontWeight: 700 }}>
                      {a.daysLeft} day{a.daysLeft !== 1 ? "s" : ""} left
                    </span>
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowPolicyModal(true);
                      setShowPolicyAlertsModal(false);
                    }}
                    className="alert-btn view-btn"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <div className="filters">
        <div className="status-filter">
          <label>Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="search-bar">
          <label>Search by</label>
          <input
            type="text"
            placeholder="Name, Emp ID, Reason"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="date-filter">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button className="search-button" onClick={fetchLeaveQueries}>
          <IoSearch /> Search
        </button>
      </div>

      <div>
        <div className="leave-table-container">
          <table className="leave-table">
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
              {leaveQueries
                .sort((a, b) => b.leave_id - a.leave_id)
                .map((query) => {
                  const update = statusUpdates[query.leave_id] || {};
                  const currentStatus = update.status || query.status || "";
                  const statusClass =
                    currentStatus === "Approved"
                      ? "leav-status-approved"
                      : currentStatus === "Rejected"
                      ? "leav-status-rejected"
                      : "";

                  const isAlreadyUpdated =
                    query.status !== "pending" && query.status !== "Pending";
                  const isUpdating =
                    statusUpdates[query.leave_id]?.status &&
                    statusUpdates[query.leave_id]?.status !== query.status;

                  const days = computeRequestedDays(
                    query.start_date,
                    query.end_date,
                    query.H_F_day || query.h_f_day || "Full Day"
                  );

                  return (
                    <tr
                      key={query.leave_id}
                      className={isAlreadyUpdated ? "row-updated" : ""}
                    >
                      <td>{query.name}</td>
                      <td>{query.employee_id}</td>
                      <td>{query.leave_type}</td>
                      <td>{query.H_F_day}</td>
                      <td>{formatDate(query.start_date)}</td>
                      <td>{formatDate(query.end_date)}</td>
                      <td className="comments-col">
                        <div className="comment-preview">{query.reason}</div>
                      </td>
                      <td>{days}</td>
                      <td>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              query.leave_id,
                              "status",
                              e.target.value
                            )
                          }
                          className={`leav-status-dropdown ${statusClass}`}
                          disabled={isAlreadyUpdated}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="comments-col">
                        <div className="comment-preview">
                          {query.comments ? (
                            <span>{query.comments}</span>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter Reason"
                              value={update.comments || ""}
                              onChange={(e) =>
                                handleStatusChange(
                                  query.leave_id,
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
                          onClick={() => handleUpdate(query.leave_id, query)}
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
      </div>

      <CompensationPopup lopModal={lopModal} setLopModal={setLopModal} />

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: "OK", onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
}
