

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmpDashCards.css";
import { FaFingerprint, FaRegClock, FaMapMarkerAlt, FaDesktop } from "react-icons/fa";

const EmpDashCards = () => {
  const API_KEY = process.env.REACT_APP_API_KEY; 

  let employeeId;
  const dashboardData = localStorage.getItem("dashboardData");

  if (dashboardData) {
    try {
      const parsedData = JSON.parse(dashboardData);
      employeeId = parsedData.employeeId;
    } catch (error) {
      console.error("Error parsing dashboardData:", error);
    }
  }

  const latestPunchApi = `${process.env.REACT_APP_BACKEND_URL}/attendance/employee/${employeeId}/latest-punch`;

  const [punchData, setPunchData] = useState({ time: "NA", location: "NA", device: "NA" });
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (employeeId) {
      fetchPunchData();
    }
  }, [employeeId]);

  const fetchPunchData = async () => {
    try {
      if (!API_KEY) throw new Error("API Key is missing.");
  
      const response = await axios.get(latestPunchApi, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
      });
  
      console.log("🔹 API Response:", response.data);
  
      if (response.data?.data) {
        const latestPunch = response.data.data;
  
        setPunchData({
          time: latestPunch.punchout_time
            ? new Date(latestPunch.punchout_time).toLocaleString()
            : latestPunch.punchin_time
            ? new Date(latestPunch.punchin_time).toLocaleString()
            : "NA",
          location: latestPunch.punchout_location || latestPunch.punchin_location || "NA",
          device: latestPunch.punchout_device || latestPunch.punchin_device || "NA",
        });
  
        setIsPunchedIn(latestPunch.punch_status === "Punch In");
      } else {
        console.warn("⚠️ No punch data found.");
      }
    } catch (error) {
      console.error("❌ Error fetching punch data:", error);
      setErrorMessage("Failed to fetch punch data.");
    }
  };

  const getLocationAndDevice = async () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const userAgent = navigator.userAgent;
            const isMobile = /Mobi|Android/i.test(userAgent);
            const device = isMobile ? "Mobile" : "Desktop";
            const accessToken = "pk.e073d7dc1a8107f3fce9727be20a7434";
  
            try {
              const response = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=${accessToken}&lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
  
              let location = "Unknown";
              if (data && data.address) {
                const { road, suburb, city, state, country } = data.address;
                location = `${road ? road + ", " : ""}${suburb ? suburb + ", " : ""}${city ? city + ", " : ""}${state ? state + ", " : ""}${country || ""}`.trim();
              }
  
              resolve({ latitude, longitude, location, device });
            } catch (error) {
              console.error("Error fetching address:", error);
              resolve({ latitude, longitude, location: "Unknown", device });
            }
          },
          () => resolve({ latitude: "N/A", longitude: "N/A", location: "Location access denied", device: "Unknown" }),
          { enableHighAccuracy: true }
        );
      } else {
        resolve({ latitude: "N/A", longitude: "N/A", location: "Not supported", device: "Unknown" });
      }
    });
  };
  
  const handlePunch = async () => {
    if (!API_KEY) {
      setErrorMessage("Session expired. Please log in again.");
      return;
    }
    if (!employeeId) {
      console.error("❌ Employee ID is missing.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { location, device } = await getLocationAndDevice();

      const apiUrl = isPunchedIn
        ? `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-out`
        : `${process.env.REACT_APP_BACKEND_URL}/attendance/punch-in`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({ employeeId, device, location, punchMode: "Manual" }),
      });

      const data = await response.json();

      if (response.ok) {
        const newPunchState = !isPunchedIn;
        setIsPunchedIn(newPunchState);
        fetchPunchData(); // Fetch updated punch data immediately after punching in/out
      } else {
        setErrorMessage(data.message || "Punch-in failed");
      }
    } catch (error) {
      setErrorMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emp-dash-cards">
      <button className={`emp-card emp-punch-in ${isPunchedIn ? "emp-punched-out" : ""}`} onClick={handlePunch} disabled={loading}>
        <div className="emp-card-content">
          <FaFingerprint className="emp-icon" />
          <div>
            <span className="emp-text">{isPunchedIn ? "Punch Out" : "Punch In"}</span>
          </div>
        </div>
      </button>
      <div className="emp-card">
        <div className="emp-card-content">
          <FaRegClock className="emp-icon" />
          <div>
            <span className="emp-text">{punchData.time}</span>
            <span className="emp-label">Time</span>
          </div>
        </div>
      </div>
      <div className="emp-card">
        <div className="emp-card-content">
          <FaMapMarkerAlt className="emp-icon" />
          <div>
            <span className="emp-text">{punchData.location}</span>
            <span className="emp-label">Location</span>
          </div>
        </div>
      </div>
      <div className="emp-card">
        <div className="emp-card-content">
          <FaDesktop className="emp-icon" />
          <div>
            <span className="emp-text">{punchData.device}</span>
            <span className="emp-label">Device</span>
          </div>
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EmpDashCards;
