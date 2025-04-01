


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmpLeaveTracker.css";

const EmpLeaveTracker = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const dashboardData = localStorage.getItem("dashboardData");
    if (dashboardData) {
      try {
        const parsedData = JSON.parse(dashboardData);
        if (parsedData.employeeId) {
          setEmployeeId(parsedData.employeeId);
          console.log("✅ Employee ID found:", parsedData.employeeId);
        } else {
          console.warn("⚠️ Employee ID not found in dashboardData");
        }
      } catch (error) {
        console.error("❌ Error parsing dashboardData:", error);
      }
    } else {
      console.warn("⚠️ No dashboardData found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!employeeId) {
      console.warn("⏳ Waiting for Employee ID...");
      return;
    }

    const fetchLeaveData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) throw new Error("⚠️ API Key is missing.");

        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/leave-queries/${employeeId}`;
        console.log("📡 Fetching leave data from:", apiUrl);

        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY, // Keeping API key check
          },
        });

        console.log("✅ API Response:", response.data);

        if (response.status === 200 && Array.isArray(response.data.leaveQueries)) {
          if (response.data.leaveQueries.length === 0) {
            setLeaveData([]); // No data found, but not an error.
          } else {
            const formattedData = response.data.leaveQueries.map((leave) => ({
              leaveType: leave["Leave Type"] || "N/A",
              startDate: leave["Start Date"] || "N/A",
              endDate: leave["End Date"] || "N/A",
              halfOrFullDay: leave["Half/Full Day"] || "N/A",
              reason: leave["Reason"] || "N/A",
              status: leave["Status"] || "N/A",
              comments: leave["Comments"] || "N/A",
            }));
            setLeaveData(formattedData);
          }
        } else {
          setLeaveData([]);
          console.warn("⚠️ No leave records found.");
        }
      } catch (err) {
        console.error("❌ Error fetching leave data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    console.log("🔄 Fetching leave data...");
    fetchLeaveData();
  }, [employeeId]);

  console.log("🛠 leaveData before rendering:", leaveData);

  if (loading) return <p>Loading...</p>;
  
  if (error) return <p className="error">{error}</p>;

  if (!Array.isArray(leaveData) || leaveData.length === 0) {
    return <p>No leave records available.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  return (
    <div className="empleavetracker-container">
      <div className="empleavetracker-header"> Leave Tracker</div>
      <table className="empleavetracker-table">
        <thead>
          <tr>
            {["Leave Type", "Start Date", "End Date", "Half/Full Day", "Reason", "Status", "Comments"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr key={index}>
              <td>{leave.leaveType || "N/A"}</td>
              <td>{formatDate(leave.startDate)}</td>
              <td>{formatDate(leave.endDate)}</td>
              <td>{leave.halfOrFullDay || "N/A"}</td>
              <td className="reason-cell" title={leave.reason}>
                {leave.reason.length > 20 ? `${leave.reason.substring(0, 20)}...` : leave.reason || "N/A"}
              </td>
              <td>
  <span className={`empleavetracker-status-${leave.status.toLowerCase() || "default"}`}>
    {leave.status || "N/A"}
  </span>
</td>

              <td className="tooltip-cell" title={leave.comments}>
                {leave.comments.length > 20 ? `${leave.comments.substring(0, 20)}...` : leave.comments || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpLeaveTracker;




