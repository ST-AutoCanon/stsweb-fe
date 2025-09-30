// UserAvatar.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserAvatar = ({ photoUrl, role, gender, apiKey, className }) => {
  const [avatar, setAvatar] = useState("");
  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;

  useEffect(() => {
    if (photoUrl) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/docs${photoUrl}`, {
          headers: { "x-api-key": apiKey, "x-employee-id": employeeId },
          responseType: "blob",
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setAvatar(imageUrl);
        })
        .catch((err) => {
          console.error("Error fetching photo:", err);
          // Fallback to default avatar if fetching fails
          setAvatar(
            role === "Admin"
              ? "/images/admin-avatar.png"
              : gender === "Female"
              ? "/images/female-avatar.jpeg"
              : "/images/male-avatar.jpeg"
          );
        });
    } else {
      // No photoUrl provided; use default based on role/gender
      setAvatar(
        role === "Admin"
          ? "/images/admin-avatar.png"
          : gender === "Female"
          ? "/images/female-avatar.jpeg"
          : "/images/male-avatar.jpeg"
      );
    }
  }, [photoUrl, role, gender, apiKey]);

  return <img src={avatar} alt="Profile" className={className} />;
};

export default UserAvatar;
