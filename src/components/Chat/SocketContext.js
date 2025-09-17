// src/components/SocketContext.js
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  // 1) read employeeId out of your dashboardData
  let userId = null;
  try {
    const dd = JSON.parse(localStorage.getItem("dashboardData"));
    userId = dd?.employeeId ?? null;
  } catch {
    console.warn("SocketProvider: dashboardData is missing or malformed");
  }

  // 2) determine backend URL
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || window.location.origin;

  useEffect(() => {
    if (!userId) {
      console.warn("SocketProvider: no employeeId found in localStorage");
      return;
    }

     // 3) create socket and connect
    const sock = io(process.env.REACT_APP_BACKEND_URL.replace('/api', ''), {
      path: "/api/socket.io",
      query: { userId },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 20000,
    });
    
    // optional: log connection status
    sock.on("connect", () => {
      console.log(`Socket connected as ${sock.id} (userId=${userId})`);
    });
    sock.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    setSocket(sock);

    // cleanup on unmount
    return () => {
      sock.disconnect();
      setSocket(null);
    };
  }, [userId, BACKEND_URL]);

  // 4) until we have a socket, don’t render children
  if (!socket) {
    return <div>Connecting to chat…</div>;
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
