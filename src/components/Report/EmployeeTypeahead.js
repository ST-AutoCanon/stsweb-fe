// EmployeeTypeahead.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { getApiBase } from "./ReportUtils";

export default function EmployeeTypeahead({
  placeholder = "Search by name or email...",
  limit = 10,
  onSelect = () => {},
  onTyping = () => {},
  onClear = () => {},
  departmentId = null,
  selectedValue = "",
  isTyping = false,
}) {
  const [query, setQuery] = useState(selectedValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debRef = useRef(null);
  const abortRef = useRef(null);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const employeeId = localStorage.getItem("dashboardData");

  // Sync selectedValue into input when not typing
  useEffect(() => {
    if (
      !isTyping &&
      typeof selectedValue === "string" &&
      selectedValue.length > 0 &&
      selectedValue !== query
    ) {
      setQuery(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, isTyping]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        if (debRef.current) {
          clearTimeout(debRef.current);
          debRef.current = null;
        }
        if (abortRef.current) {
          try {
            abortRef.current.abort();
          } catch (e) {}
          abortRef.current = null;
        }
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const lastTypingRef = useRef(false);
  useEffect(() => {
    const nowTyping = Boolean(query && query.trim().length > 0);
    if (lastTypingRef.current !== nowTyping) {
      lastTypingRef.current = nowTyping;
      try {
        onTyping(nowTyping);
      } catch (e) {
        // ignore
      }
      if (!nowTyping) {
        try {
          onClear();
        } catch (e) {
          // ignore
        }
      }
    }
  }, [query, onTyping, onClear]);

  useEffect(() => {
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
      abortRef.current = null;
    }

    const trimmed = query ? query.trim() : "";
    if (trimmed.length === 0) {
      setSuggestions([]);
      setTotalMatches(0);
      setLoading(false);
      setOpen(false);
      return;
    }

    const DEBOUNCE_MS = 180;
    setLoading(true);

    debRef.current = setTimeout(async () => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const base = getApiBase();
        const params = { q: trimmed, limit };
        if (departmentId) params.department_id = departmentId;

        const resp = await axios.get(`${base}/api/report/search-employees`, {
          params,
          signal: ac.signal,
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY || "",
            "x-employee-id": employeeId || "",
            Accept: "application/json",
          },
        });

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
        if (
          err?.name === "CanceledError" ||
          err?.name === "AbortError" ||
          (err?.message && err.message.includes("canceled"))
        ) {
          // aborted — ignore
        } else {
          console.error(
            "Typeahead error:",
            err && (err.response || err.message || err)
          );
        }
        setSuggestions([]);
        setTotalMatches(0);
        setOpen(false);
      } finally {
        setLoading(false);
        debRef.current = null;
        if (abortRef.current === ac) abortRef.current = null;
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debRef.current) {
        clearTimeout(debRef.current);
        debRef.current = null;
      }
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {}
        abortRef.current = null;
      }
    };
  }, [query, limit, departmentId]);

  function handleSelect(item) {
    const name = item.employee_name || item.name || item.email || "";
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
      abortRef.current = null;
    }

    setSuggestions([]);
    setTotalMatches(0);
    setQuery(name);
    setOpen(false);

    try {
      onSelect(item);
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      try {
        if (inputRef.current && typeof inputRef.current.focus === "function") {
          inputRef.current.focus();
          const len = inputRef.current.value
            ? inputRef.current.value.length
            : 0;
          inputRef.current.setSelectionRange(len, len);
        }
      } catch (e) {
        // ignore
      }
    }, 40);
  }

  function handleClear() {
    if (debRef.current) {
      clearTimeout(debRef.current);
      debRef.current = null;
    }
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
      abortRef.current = null;
    }
    setQuery("");
    setSuggestions([]);
    setTotalMatches(0);
    setOpen(false);
    onClear();
  }

  return (
    <div className="rp-input-with-icon" ref={boxRef}>
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
      />
      {loading && (
        <span className="typeahead-spinner">
          <span className="rp-spinner" />
        </span>
      )}
      {query && !loading && (
        <button
          className="typeahead-clear"
          onClick={handleClear}
          aria-label="Clear employee search"
          title="Clear"
        >
          <MdClose size={16} />
        </button>
      )}
      {open && (suggestions.length > 0 || totalMatches > 0) && (
        <div className="typeahead-dropdown" role="listbox">
          <div className="typeahead-info">
            {totalMatches === 0
              ? "No matches"
              : `${totalMatches} employee${totalMatches > 1 ? "s" : ""} match`}
          </div>
          <ul className="typeahead-list">
            {suggestions.map((s) => (
              <li
                key={`${s.employee_id || s.id || ""}-${
                  s.employee_name || s.name || s.email || ""
                }`}
                className="typeahead-item"
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  handleSelect(s);
                }}
              >
                <div className="ta-name">
                  {s.employee_name || s.name || s.email || "(no name)"}
                </div>
                <div className="ta-dept">
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
