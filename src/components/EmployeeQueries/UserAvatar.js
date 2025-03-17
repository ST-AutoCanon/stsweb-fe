// UserAvatar.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserAvatar = ({ photoUrl, role, gender, apiKey, className }) => {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (photoUrl) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
          headers: { "x-api-key": apiKey },
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
              ? "/images/female-avatar.png"
              : "/images/male-avatar.png"
          );
        });
    } else {
      // No photoUrl provided; use default based on role/gender
      setAvatar(
        role === "Admin"
          ? "/images/admin-avatar.png"
          : gender === "Female"
          ? "/images/female-avatar.png"
          : "/images/male-avatar.png"
      );
    }
  }, [photoUrl, role, gender, apiKey]);

  return <img src={avatar} alt="Profile" className={className} />;
};

export default UserAvatar;
