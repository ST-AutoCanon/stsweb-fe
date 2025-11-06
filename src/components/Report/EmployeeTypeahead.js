// src/components/EmployeeTypeahead.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { getApiBase } from "./ReportUtils";

/**
 * Non-aborting EmployeeTypeahead
 * - Debounces input.
 * - DOES NOT abort inflight requests (so browser won't show "cancelled"),
 *   instead uses requestId to ignore stale responses.
 * - Logs request URL + headers + response status for easy debugging.
 */
export default function EmployeeTypeahead({
  placeholder = "Search by name or email...",
  limit = 10,
  onSelect = () => {},
  onTyping = () => {},
  onClear = () => {},
  departmentId = null,
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

  const debRef = useRef(null);
  const latestRequestId = useRef(0); // incrementing request id
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const lastTypingRef = useRef(false);

  const employeeId =
    typeof window !== "undefined" ? localStorage.getItem("dashboardData") : "";

  // sync external selectedValue into local state when not typing
  useEffect(() => {
    if (
      !isTyping &&
      typeof selectedValue === "string" &&
      selectedValue !== query
    ) {
      setQuery(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, isTyping]);

  // click outside closes dropdown
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

  // notify parent typing state
  useEffect(() => {
    const nowTyping = Boolean(query && query.trim().length > 0);
    if (lastTypingRef.current !== nowTyping) {
      lastTypingRef.current = nowTyping;
      try {
        onTyping(nowTyping);
      } catch (e) {}
      if (!nowTyping) {
        try {
          onClear();
        } catch (e) {}
      }
    }
  }, [query, onTyping, onClear]);

  // main effect: debounce + fire axios (without cancelling prior requests)
  useEffect(() => {
    // clear previous timer
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }

    const trimmed = query ? query.trim() : "";

    if (trimmed.length < minChars) {
      setSuggestions([]);
      setTotalMatches(0);
      setLoading(false);
      setOpen(false);
      setErrorText("");
      return;
    }

    setLoading(true);
    setErrorText("");

    debRef.current = setTimeout(async () => {
      // increment request id and capture for this request
      const reqId = ++latestRequestId.current;

      const base = getApiBase() || "";
      const params = new URLSearchParams();
      params.set("q", trimmed);
      params.set("limit", String(limit));
      if (departmentId) params.set("department_id", String(departmentId));
      const url = `${base.replace(
        /\/$/,
        ""
      )}/api/report/search-employees?${params.toString()}`;

      // prepare headers
      const headers = {
        Accept: "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY || "",
        "x-employee-id": employeeId || "",
      };

      // debug log to help map front ↔ back
      console.debug("[EmployeeTypeahead] requesting:", { reqId, url, headers });

      try {
        const resp = await axios.get(url, { headers, timeout: 25_000 });
        console.debug("[EmployeeTypeahead] response:", {
          reqId,
          status: resp.status,
          url,
        });

        // If a newer request was fired meanwhile, ignore this response
        if (reqId !== latestRequestId.current) {
          console.debug("[EmployeeTypeahead] ignoring stale response", {
            reqId,
            latest: latestRequestId.current,
          });
          return;
        }

        const data = resp && resp.data ? resp.data : {};
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.results)) items = data.results;
        else if (Array.isArray(data.data)) items = data.data;
        else items = [];

        setSuggestions(items.slice(0, limit));
        setTotalMatches(
          typeof data.total === "number" ? data.total : items.length
        );
        setOpen(items.length > 0);
      } catch (err) {
        // if axios cancelled or network error — surface friendly message
        const isCancel = axios.isCancel && axios.isCancel(err);
        const msg = err && err.message ? String(err.message) : "Unknown error";
        console.error("[EmployeeTypeahead] request error:", { reqId, err });

        // ignore stale errors if newer request exists
        if (reqId !== latestRequestId.current) {
          console.debug("[EmployeeTypeahead] ignoring stale error", {
            reqId,
            latest: latestRequestId.current,
          });
          return;
        }

        // Detect common failures and give helpful message
        if (
          msg.toLowerCase().includes("cors") ||
          msg.toLowerCase().includes("failed to fetch") ||
          msg.toLowerCase().includes("network error")
        ) {
          setErrorText(
            "Network/CORS error — check server CORS and getApiBase()."
          );
        } else {
          // server responded with error - try to extract status
          if (err && err.response && err.response.status) {
            setErrorText(`Server returned ${err.response.status}`);
          } else {
            setErrorText(msg);
          }
        }

        setSuggestions([]);
        setTotalMatches(0);
        setOpen(false);
      } finally {
        // only clear loading if this is the latest request
        if (reqId === latestRequestId.current) setLoading(false);
        debRef.current = null;
      }
    }, debounceMs);

    return () => {
      if (debRef.current) {
        clearTimeout(debRef.current);
        debRef.current = null;
      }
      // do NOT cancel inflight requests — we rely on requestId ignoring stale responses
    };
  }, [query, limit, departmentId, debounceMs, minChars, employeeId]);

  function handleSelect(item) {
    const name = item.employee_name || item.name || item.email || "";
    // reset UI and mark query
    setSuggestions([]);
    setTotalMatches(0);
    setQuery(name);
    setOpen(false);
    try {
      onSelect(item);
    } catch (e) {}
    // focus back
    setTimeout(() => {
      try {
        if (inputRef.current) {
          inputRef.current.focus();
          const len = inputRef.current.value
            ? inputRef.current.value.length
            : 0;
          inputRef.current.setSelectionRange(len, len);
        }
      } catch (e) {}
    }, 40);
  }

  function handleClear() {
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }
    // increment latestRequestId to ignore any inflight responses
    latestRequestId.current++;
    setQuery("");
    setSuggestions([]);
    setTotalMatches(0);
    setOpen(false);
    setErrorText("");
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
