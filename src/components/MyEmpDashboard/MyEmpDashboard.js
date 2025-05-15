import React, { useEffect, useState } from "react";
import EmpDashCards from "./EmpDashCards";
import EmpReImbursement from "./EmpReImbursement";
import EmpSessions from "./EmpSessions";
import EmpWorkDays from "./EmpWorkDays";
import EmpProjectTable from "./EmpProjectTable";
import EmpLeaveTracker from "./EmpLeaveTracker";
import MyDailyWorkHour from "./MyDailyWorkHour";
import SaveFaceData from "./SaveFaceData";
import "./MyEmpDashboard.css";
import axios from "axios";

const MyEmpDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [showFacePopup, setShowFacePopup] = useState(false);

  // ✅ Modified useEffect to check camera presence before showing popup
  useEffect(() => {
    const dashboardData = localStorage.getItem("dashboardData");

    if (dashboardData) {
      try {
        const parsedData = JSON.parse(dashboardData);
        const employeeId = parsedData.employeeId;
        setEmployeeId(employeeId); // Set it here for the second useEffect
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/check-face-registered/${employeeId}`;

        // Check if device has a camera
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const hasCamera = devices.some(
            (device) => device.kind === "videoinput"
          );
          if (!hasCamera) {
            console.log("No camera found, skipping face registration popup.");
            return; // Skip if no camera
          }

          // If camera is available, call API
          axios
            .get(apiUrl, {
              headers,
            })
            .then((response) => {
              if (response.data && response.data.isRegistered === false) {
                setShowFacePopup(true); // Show popup only if not registered
              }
            })
            .catch((error) => {
              console.error("Error checking face registration:", error);
            });
        });
      } catch (err) {
        console.error("Error parsing dashboardData:", err);
      }
    }
  }, []);

  // Unused now, but keeping it if you later need it
  useEffect(() => {
    if (!employeeId) return;

    const checkFaceRegistration = async () => {
      try {
        console.log("Calling API for employeeId:", employeeId);
        const checkResponse = await axios.get(
          `${BACKEND_URL}/api/face/check/${employeeId}`,

          {
            headers,
          }
        );
        console.log("API response:", checkResponse.data);
        if (checkResponse.data.isRegistered === false) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking face registration:", error);
      }
    };

    checkFaceRegistration();
  }, [employeeId, BACKEND_URL, API_KEY]);

  return (
    <div>
      {showFacePopup && (
        <div className="reg-popup-overlay">
          <div className="reg-popup-content">
            <SaveFaceData onClose={() => setShowFacePopup(false)} />
          </div>
        </div>
      )}

      <div className="EmpDashCards1234">
        <EmpDashCards />
      </div>

      <div className="empcardcharts123">
        <EmpSessions />
        <EmpWorkDays />
        <EmpReImbursement />
      </div>

      <div className="mydailyworkhour123">
        <MyDailyWorkHour />
      </div>

      {/* <div className="EmpProjectTable">
        <EmpProjectTable />
      </div> */}

      <div className="EmpLeaveTracker123">
        <EmpLeaveTracker />
      </div>
    </div>
  );
};

export default MyEmpDashboard;
