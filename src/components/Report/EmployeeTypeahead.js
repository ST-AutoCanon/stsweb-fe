import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { getApiBase } from "./ReportUtils";

function extractEmployeeIdFromDashboardData(raw) {
  try {
    if (!raw) return "";
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        trimmed.startsWith("[")
      ) {
        try {
          const obj = JSON.parse(trimmed);
          return (
            obj.employeeId || obj.employee_id || obj.employee || obj.id || ""
          );
        } catch (e) {}
      }
      const m = trimmed.match(/(STS[0-9A-Za-z-_]+)/);
      if (m) return m[1];
      return trimmed;
    } else if (typeof raw === "object") {
      return raw.employeeId || raw.employee_id || raw.id || "";
    }
    return String(raw);
  } catch (e) {
    return "";
  }
}

export default function EmployeeTypeahead({
  placeholder = "Search by name or email...",
  limit = 10,
  onSelect = () => {},
  onTyping = () => {},
  onClear = () => {},

  selectedValue = "",
  isTyping = false,
  minChars = 2,
  debounceMs = 180,
}) {
  const [query, setQuery] = useState(selectedValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  // parse local storage robustly
  const teamLeadData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  // Convert to string/number consistently to avoid type mismatch
  const teamLeadId = teamLeadData?.employeeId
    ? String(teamLeadData.employeeId)
    : null;
  const departmentId = teamLeadData?.department_id || null;

  const debRef = useRef(null);
  const latestRequestId = useRef(0);
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const lastTypingRef = useRef(false);
  const mountedRef = useRef(true);

  let employeeId = "";
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("dashboardData")
        : "";
    employeeId = extractEmployeeIdFromDashboardData(raw);
  } catch (e) {
    employeeId = "";
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debRef.current) {
        clearTimeout(debRef.current);
        debRef.current = null;
      }
      latestRequestId.current++;
    };
  }, []);

  useEffect(() => {
    if (
      !isTyping &&
      typeof selectedValue === "string" &&
      selectedValue !== query
    ) {
      setQuery(selectedValue);
    }
  }, [selectedValue, isTyping]);

  useEffect(() => {
    function onDocClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        if (debRef.current) {
          clearTimeout(debRef.current);
          debRef.current = null;
        }
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const nowTyping = Boolean(query && query.trim().length > 0);
    if (lastTypingRef.current !== nowTyping) {
      lastTypingRef.current = nowTyping;
      try {
        onTyping(nowTyping);
      } catch (e) {}
      if (!nowTyping)
        try {
          onClear();
        } catch (e) {}
    }
  }, [query, onTyping, onClear]);

  useEffect(() => {
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }

    const trimmed = query ? query.trim() : "";
    if (trimmed.length < minChars) {
      if (mountedRef.current) {
        setSuggestions([]);
        setTotalMatches(0);
        setLoading(false);
        setOpen(false);
        setErrorText("");
      }
      return;
    }
    if (!mountedRef.current) return;

    setLoading(true);
    setErrorText("");
    debRef.current = setTimeout(async () => {
      const reqId = ++latestRequestId.current;
      const base = (getApiBase && getApiBase()) || "";
      const params = new URLSearchParams();
      try {
        params.set("q", trimmed);
        params.set("limit", String(limit));
        if (departmentId) params.set("department_id", String(departmentId));
      } catch (e) {}
      const url = `${base.replace(
        /\/$/,
        ""
      )}/api/report/search-employees?${params.toString()}`;
      const headers = {
        Accept: "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY || "",
        "x-employee-id": employeeId || "",
      };
      try {
        const resp = await axios.get(url, { headers, timeout: 10_000 });
        if (reqId !== latestRequestId.current) return; // stale
        if (!mountedRef.current) return;
        const data = resp && resp.data ? resp.data : {};
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.results)) items = data.results;
        else if (Array.isArray(data.data)) items = data.data;
        else if (Array.isArray(data.rows)) items = data.rows;
        else items = [];
        if (mountedRef.current && reqId === latestRequestId.current) {
          setSuggestions(items.slice(0, limit));
          setTotalMatches(
            typeof data.total === "number" ? data.total : items.length
          );
          setOpen(items.length > 0);
          setErrorText("");
        }
      } catch (err) {
        if (!mountedRef.current) return;
        if (reqId !== latestRequestId.current) return; // stale
        const msg = err && err.message ? String(err.message) : "Unknown error";
        if (
          msg.toLowerCase().includes("cors") ||
          msg.toLowerCase().includes("failed to fetch") ||
          msg.toLowerCase().includes("network error")
        ) {
          setErrorText(
            "Network/CORS error — check server CORS and getApiBase()."
          );
        } else if (err && err.response && err.response.status) {
          setErrorText(`Server returned ${err.response.status}`);
        } else {
          setErrorText(msg);
        }
        setSuggestions([]);
        setTotalMatches(0);
        setOpen(false);
      } finally {
        if (mountedRef.current && reqId === latestRequestId.current)
          setLoading(false);
        debRef.current = null;
      }
    }, debounceMs);

    return () => {
      if (debRef.current) {
        clearTimeout(debRef.current);
        debRef.current = null;
      }
    };
  }, [query, limit, departmentId, debounceMs, minChars, employeeId]);

  function handleSelect(item) {
    const name = item.employee_name || item.name || item.email || "";
    if (mountedRef.current) {
      setSuggestions([]);
      setTotalMatches(0);
      setQuery(name);
      setOpen(false);
    }
    try {
      onSelect(item);
    } catch (e) {}
    setTimeout(() => {
      try {
        const input = inputRef && inputRef.current;
        if (input && typeof input.focus === "function") input.focus();
        if (input && typeof input.setSelectionRange === "function") {
          const len = input.value ? input.value.length : 0;
          input.setSelectionRange(len, len);
        }
      } catch (e) {}
    }, 30);
  }

  function handleClear() {
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }
    latestRequestId.current++;
    if (mountedRef.current) {
      setQuery("");
      setSuggestions([]);
      setTotalMatches(0);
      setOpen(false);
      setErrorText("");
    }
    try {
      onClear();
    } catch (e) {}
  }

  return (
    <div
      className="rp-input-with-icon"
      ref={boxRef}
      style={{ position: "relative" }}
    >
      <input
        ref={inputRef}
        className="typeahead-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length) setOpen(true);
        }}
        aria-label="Search employee"
        autoComplete="off"
        style={{ width: "100%" }}
      />
      {loading && (
        <span
          className="typeahead-spinner"
          aria-hidden
          style={{ position: "absolute", right: 36, top: 10 }}
        >
          <span className="rp-spinner" />
        </span>
      )}
      {query && !loading && (
        <button
          type="button"
          className="typeahead-clear"
          onClick={handleClear}
          aria-label="Clear employee search"
          title="Clear"
          style={{
            position: "absolute",
            right: 8,
            top: 6,
            background: "transparent",
            border: "none",
            padding: 4,
            cursor: "pointer",
          }}
        >
          <MdClose size={16} />
        </button>
      )}
      {errorText && (
        <div style={{ color: "crimson", fontSize: 12, marginTop: 6 }}>
          {errorText}
        </div>
      )}
      {open && (suggestions.length > 0 || totalMatches > 0) && (
        <div
          className="typeahead-dropdown"
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 1000,
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            marginTop: 6,
          }}
        >
          <div
            className="typeahead-info"
            style={{ padding: "6px 10px", fontSize: 12, color: "#666" }}
          >
            {totalMatches === 0
              ? "No matches"
              : `${totalMatches} employee${totalMatches > 1 ? "s" : ""} match`}
          </div>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              maxHeight: 240,
              overflow: "auto",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={`${s.employee_id || s.id || ""}-${
                  s.employee_name || s.name || s.email || ""
                }`}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  handleSelect(s);
                }}
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {s.employee_name || s.name || s.email || "(no name)"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {s.employee_id ? `${s.employee_id} ` : ""}
                  {s.department_name || s.department || "No department"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
