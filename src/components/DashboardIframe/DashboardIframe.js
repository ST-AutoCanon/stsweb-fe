import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardIframe({
  externalLoginUrlProp,
  allowedOriginsProp,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const routeCreds = location.state || {};
  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("EMBED_LOGIN") || "{}");
    } catch {
      return {};
    }
  })();

  const username = routeCreds.username || stored.username || "";
  const password = routeCreds.password || stored.password || "";
  const orgIdFromStorage = routeCreds.orgId || stored.orgId || 1;

  useEffect(() => {
    if (routeCreds.username && routeCreds.password) {
      try {
        sessionStorage.setItem(
          "EMBED_LOGIN",
          JSON.stringify({
            username: routeCreds.username,
            password: routeCreds.password,
            orgId: orgIdFromStorage,
          })
        );
      } catch {}
    }
  }, [routeCreds, orgIdFromStorage]);

  const externalLoginUrl =
    externalLoginUrlProp ||
    process.env.REACT_APP_EXTERNAL_LOGIN_URL ||
    process.env.REACT_APP_EXTERNAL_EMBED_URL ||
    "";

  const iframeOrigin = useMemo(() => {
    try {
      return new URL(externalLoginUrl).origin;
    } catch {
      return "";
    }
  }, [externalLoginUrl]);

  const allowedOrigins = useMemo(() => {
    const raw =
      allowedOriginsProp ||
      process.env.REACT_APP_ALLOWED_IFRAME_ORIGINS ||
      iframeOrigin ||
      "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [iframeOrigin, allowedOriginsProp]);

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [childReady, setChildReady] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showParentUI, setShowParentUI] = useState(true);

  useEffect(() => {
    console.debug("[Parent] allowedOrigins:", allowedOrigins);

    function onMessage(ev) {
      console.debug(
        "[Parent][msg] origin:",
        ev?.origin,
        "source:",
        ev?.source,
        "data:",
        ev?.data
      );

      const msg = ev?.data || {};

      const isFromIframeWindow =
        iframeRef.current && ev?.source === iframeRef.current.contentWindow;

      const originAllowed =
        allowedOrigins.length === 0 ||
        (ev?.origin && allowedOrigins.includes(ev.origin));

      if (!originAllowed && !isFromIframeWindow) {
        console.debug(
          "[Parent] ignoring message - origin not allowed and not from iframe window:",
          ev?.origin
        );
        return;
      }

      if (msg.type === "child-ready") {
        console.debug("[Parent] child-ready");
        setChildReady(true);
        return;
      }

      if (msg.type === "login-success") {
        console.debug("[Parent] login-success");
        try {
          sessionStorage.removeItem("EMBED_LOGIN");
        } catch {}
        setStatus("success");
        setShowParentUI(false);
        return;
      }

      if (msg.type === "login-failed") {
        navigate("/", {
          replace: true,
          state: { loginError: msg.error || "Invalid credentials" },
        });
      }

      if (msg.type === "child-logged-out") {
        console.debug("[Parent] child-logged-out received", msg);

        try {
          sessionStorage.removeItem("EMBED_LOGIN");
        } catch (e) {}

        try {
          navigate("/", { replace: true });
          console.debug("[Parent] navigate('/') called");
        } catch (navErr) {
          console.warn("[Parent] navigate('/') failed", navErr);
          try {
            window.location.replace("/");
          } catch (locErr) {
            console.error(
              "[Parent] window.location.replace('/') failed",
              locErr
            );
          }
        }

        setShowParentUI(true);
        setStatus("idle");
        return;
      }
    }

    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage, false);
  }, [allowedOrigins, navigate]);

  useEffect(() => {
    if (!iframeLoaded) return;

    try {
      const win = iframeRef.current?.contentWindow;
      if (win) {
        win.postMessage({ type: "parent-handshake" }, iframeOrigin || "*");
      }
    } catch (err) {
      console.warn("[Parent] handshake failed", err);
    }

    const fallback = setTimeout(() => {
      if (!childReady && username && password) {
        try {
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: "parent-login",
              username,
              password,
              orgId: orgIdFromStorage,
            },
            iframeOrigin || "*"
          );
          setStatus("sent");
        } catch (err) {
          setStatus("error");
          setError("postMessage failed (fallback)");
        }
      }
    }, 250);

    return () => clearTimeout(fallback);
  }, [
    iframeLoaded,
    childReady,
    username,
    password,
    iframeOrigin,
    orgIdFromStorage,
  ]);

  useEffect(() => {
    if (!childReady) return;
    if (!username || !password) return;

    try {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "parent-login",
          username,
          password,
          orgId: orgIdFromStorage,
        },
        iframeOrigin || "*"
      );
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError("postMessage failed");
    }
  }, [childReady, username, password, iframeOrigin, orgIdFromStorage]);

  useEffect(() => {
    if (status !== "sent") return;
    const t = setTimeout(() => {
      setStatus("failed");
      setError((prev) => prev || "No response from embedded app");
    }, 10000);
    return () => clearTimeout(t);
  }, [status]);

  if (!externalLoginUrl) {
    return (
      <p style={{ color: "crimson" }}>
        Configuration error: missing external login URL
      </p>
    );
  }

  return (
    <div>
      <h1>Dashboard (Embedded)</h1>

      <div style={{ width: "100%", height: "100vh", marginTop: 10 }}>
        <iframe
          ref={iframeRef}
          src={externalLoginUrl}
          title="Embedded App"
          onLoad={() => setIframeLoaded(true)}
          style={{ width: "100%", height: "100%", border: "1px solid #ddd" }}
          allow="camera; microphone; geolocation; fullscreen"
        />
      </div>
    </div>
  );
}
