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

  let userId = null;
  try {
    const dd = JSON.parse(localStorage.getItem("dashboardData"));
    userId = dd?.employeeId ?? null;
  } catch {
    console.warn("SocketProvider: dashboardData is missing or malformed");
  }

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || window.location.origin;

  useEffect(() => {
    if (!userId) {
      console.warn("SocketProvider: no employeeId found in localStorage");
      return;
    }

    const sock = io(process.env.REACT_APP_BACKEND_URL.replace("/api", ""), {
      query: { userId },
      extraHeaders: {
        "x-employee-id": userId,
      },
      transports: ["polling", "websocket"],
      transportOptions: {
        polling: {
          withCredentials: true,
        },
      },
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    sock.on("connect", () => {
      console.log(`Socket connected as ${sock.id} (userId=${userId})`);
    });
    sock.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    setSocket(sock);

    return () => {
      sock.disconnect();
      setSocket(null);
    };
  }, [userId, BACKEND_URL]);

  if (!socket) {
    return <div>Connecting to chat…</div>;
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
