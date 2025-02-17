import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HolidayCalendar from "../HolidayCalendar/HolidayCalendar";
import "./Topbar.css";
import axios from "axios";

const Topbar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("Role");
    const [avatar, setAvatar] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const API_KEY = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const storedName = localStorage.getItem("userName") || "User";
        const storedRole = localStorage.getItem("userRole") || "Role";
        const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
        const photoUrl = dashboardData.photoUrl || null;
        const storedGender = localStorage.getItem("userGender");

        setUserName(storedName);
        setUserRole(storedRole);

        if (photoUrl) {
            // If photoUrl exists, fetch the image as a blob and set as avatar
            axios
                .get(`${process.env.REACT_APP_BACKEND_URL}/${photoUrl}`, {
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    responseType: 'blob', // Get image as a blob
                })
                .then((response) => {
                    const imageUrl = URL.createObjectURL(response.data);
                    setAvatar(imageUrl);
                })
                .catch((err) => {
                    console.error('Error fetching photo:', err);
                    // Fallback to default avatar if fetching fails
                    setAvatar(storedRole === "Admin" 
                        ? "/images/admin-avatar.png" 
                        : storedGender === "Female"
                            ? "/images/female-avatar.png"
                            : "/images/male-avatar.png"
                    );
                });
        } else {
            // If no photoUrl, use default avatars based on role and gender
            if (storedRole === "Admin") {
                setAvatar("/images/admin-avatar.png");
            } else {
                const avatarPath =
                    storedGender === "Female"
                        ? "/images/female-avatar.png"
                        : "/images/male-avatar.png";
                setAvatar(avatarPath);
            }
        }
    }, []);

    return (
        <div className="topbar">
            <div className="profile-section">
                <img src={avatar} alt="Profile" className="profile-img" />
                <div className="profile-info">
                    <span className="profile-namedash">{userName}</span>
                    <span className="profile-designation">{userRole}</span>
                </div>
            </div>
            <div className="icon-section">
                <i className="fas fa-bell"></i>

                {/* Calendar Icon */}
                <i
                    className="fas fa-calendar-alt"
                    onClick={() => setShowCalendar(!showCalendar)}
                ></i>

                {/* Holiday Calendar Dropdown */}
                {showCalendar && (
                    <div className="calendar-dropdown">
                        <HolidayCalendar closeCalendar={() => setShowCalendar(false)} />
                    </div>
                )}

                <i className="fas fa-power-off" onClick={() => navigate('/login')}></i>
            </div>
        </div>
    );
};

export default Topbar;
