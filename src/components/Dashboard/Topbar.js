// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import HolidayCalendar from "../HolidayCalendar/HolidayCalendar";
// import "./Topbar.css";
// import axios from "axios";

// const Topbar = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState("User");
//     const [userRole, setUserRole] = useState("Role");
//     const [avatar, setAvatar] = useState("");
//     const [showCalendar, setShowCalendar] = useState(false);

//     const API_KEY = process.env.REACT_APP_API_KEY;

//     useEffect(() => {
//         const storedName = localStorage.getItem("userName") || "User";
//         const storedRole = localStorage.getItem("userRole") || "Role";
//         const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
//         const photoUrl = dashboardData.photoUrl || null;
//         const storedGender = localStorage.getItem("userGender");

//         setUserName(storedName);
//         setUserRole(storedRole);

//         if (photoUrl) {
//             // If photoUrl exists, fetch the image as a blob and set as avatar
//             axios
//                 .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
//                     headers: {
//                         'x-api-key': API_KEY,
//                     },
//                     responseType: 'blob', // Get image as a blob
//                 })
//                 .then((response) => {
//                     const imageUrl = URL.createObjectURL(response.data);
//                     setAvatar(imageUrl);
//                 })
//                 .catch((err) => {
//                     console.error('Error fetching photo:', err);
//                     // Fallback to default avatar if fetching fails
//                     setAvatar(storedRole === "Admin"
//                         ? "/images/admin-avatar.png"
//                         : storedGender === "Female"
//                             ? "/images/female-avatar.png"
//                             : "/images/male-avatar.png"
//                     );
//                 });
//         } else {
//             // If no photoUrl, use default avatars based on role and gender
//             if (storedRole === "Admin") {
//                 setAvatar("/images/admin-avatar.png");
//             } else {
//                 const avatarPath =
//                     storedGender === "Female"
//                         ? "/images/female-avatar.png"
//                         : "/images/male-avatar.png";
//                 setAvatar(avatarPath);
//             }
//         }
//     }, []);

//     return (
//         <div className="topbar1">
//             <div className="profile-section">
//                 <img src={avatar} alt="Profile" className="profile-img" />
//                 <div className="profile-info">
//                     <span className="profile-namedash">{userName}</span>
//                     <span className="profile-designation">{userRole}</span>
//                 </div>
//             </div>
//             <div className="icon-section">
//                 <i className="fas fa-bell"></i>

//                 {/* Calendar Icon */}
//                 <i
//                     className="fas fa-calendar-alt"
//                     onClick={() => setShowCalendar(!showCalendar)}
//                 ></i>

//                 {/* Holiday Calendar Dropdown */}
//                 {showCalendar && (
//                     <div className="calendar-dropdown">
//                         <HolidayCalendar closeCalendar={() => setShowCalendar(false)} />
//                     </div>
//                 )}

//                 <i className="fas fa-power-off" onClick={() => navigate('/login')}></i>
//             </div>
//         </div>
//     );
// };

// export default Topbar;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HolidayCalendar from "../HolidayCalendar/HolidayCalendar";
import "./Topbar.css";
import axios from "axios";
import ReactDOM from "react-dom";
import Notifications from "./Notifications";

const Topbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Role");
  const [avatar, setAvatar] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;

  const fetchNotificationCount = () => {
    axios
      .get(`${BACKEND_URL}/api/notifications`, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      })
      .then((res) => {
        if (res.data.success) {
          setNotificationCount(res.data.notifications.length);
        }
      })
      .catch((err) => console.error("Error fetching notification count", err));
  };

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User";
    const storedRole = localStorage.getItem("userRole") || "Role";
    const dashboardData =
      JSON.parse(localStorage.getItem("dashboardData")) || {};
    const photoUrl = dashboardData.photoUrl || null;
    const storedGender = localStorage.getItem("userGender");

    setUserName(storedName);
    setUserRole(storedRole);

    if (photoUrl) {
      // If photoUrl exists, fetch the image as a blob and set as avatar
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
          headers: {
            "x-api-key": API_KEY,
          },
          responseType: "blob", // Get image as a blob
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setAvatar(imageUrl);
        })
        .catch((err) => {
          console.error("Error fetching photo:", err);
          // Fallback to default avatar if fetching fails
          setAvatar(
            storedRole === "Admin"
              ? "/images/admin-avatar.png"
              : storedGender === "Female"
              ? "/images/female-avatar.jpeg"
              : "/images/male-avatar.jpeg"
          );
        });
    } else {
      // If no photoUrl, use default avatars based on role and gender
      if (storedRole === "Admin") {
        setAvatar("/images/admin-avatar.png");
      } else {
        const avatarPath =
          storedGender === "Female"
            ? "/images/female-avatar.jpeg"
            : "/images/male-avatar.jpeg";
        setAvatar(avatarPath);
      }
    }
  }, []);

  return (
    <div className="topbar1">
      <div className="profile-section">
        <img src={avatar} alt="Profile" className="profile-img" />
        <div className="profile-info">
          <span className="profile-namedash">{userName}</span>
          <span className="profile-designation">{userRole}</span>
        </div>
      </div>
      <div className="icon-section">
        {/* Notification Icon with badge */}
        <div
          className="notification-icon"
          onClick={() => {
            setShowNotifications((v) => !v);
            fetchNotificationCount();
          }}
        >
          <i className="fas fa-bell"></i>
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>

        <Notifications
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          onRead={fetchNotificationCount}
        />

        {/* Calendar Icon */}
        <i
          className="fas fa-calendar-alt"
          onClick={() => setShowCalendar(!showCalendar)}
        ></i>

        {/* Holiday Calendar Dropdown */}
        {showCalendar &&
          ReactDOM.createPortal(
            <div className="calendar-dropdown">
              <HolidayCalendar closeCalendar={() => setShowCalendar(false)} />
            </div>,
            document.getElementById("portal-root")
          )}

        <i className="fas fa-power-off" onClick={() => navigate("/")}></i>
      </div>
    </div>
  );
};

export default Topbar;
