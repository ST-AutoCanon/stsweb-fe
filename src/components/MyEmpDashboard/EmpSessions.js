

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

import "./EmpSessions.css";

const EmpSessions = () => {
  const [chartData, setChartData] = useState(null);
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0);
  const [totalIdleSeconds, setTotalIdleSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [remainingTime, setRemainingTime] = useState("00:00:00");

  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const dashboardData = localStorage.getItem("dashboardData");
    if (dashboardData) {
      try {
        const parsedData = JSON.parse(dashboardData);
        if (parsedData.employeeId) {
          setEmployeeId(parsedData.employeeId);
        }
      } catch (error) {
        console.error("Error parsing dashboardData:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchSessionData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) {
          setError("API Key is missing.");
          return;
        }

        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/today-punch/${employeeId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        });

        if (response.status === 200 && response.data.success) {
          const punchData = response.data.data || [];
          const now = new Date();
          let sessionSegments = [];
          let lastPunchOut = null;
          let totalWorkedSeconds = 0;
          let totalIdleSeconds = 0;

          if (punchData.length > 0) {
            const firstPunchInTime = punchData[0].punchin_time ? new Date(punchData[0].punchin_time) : null;
            const midnight = new Date(firstPunchInTime);
            midnight.setHours(0, 0, 0, 0);

            if (firstPunchInTime && firstPunchInTime > midnight) {
              const idleSecondsFromMidnight = (firstPunchInTime - midnight) / 1000;
              totalIdleSeconds += idleSecondsFromMidnight;
              sessionSegments.push({ label: "Idle", value: idleSecondsFromMidnight, color: "#82DAFE" });
            }
          }

          punchData.forEach((record) => {
            const punchInTime = record.punchin_time ? new Date(record.punchin_time) : null;
            const punchOutTime = record.punchout_time ? new Date(record.punchout_time) : null;

            if (punchInTime && lastPunchOut) {
              const idleSeconds = (punchInTime - lastPunchOut) / 1000;
              if (idleSeconds > 0) {
                totalIdleSeconds += idleSeconds;
                sessionSegments.push({ label: "Idle", value: idleSeconds, color: "#82DAFE" });
              }
            }

            if (punchInTime && punchOutTime) {
              const workSeconds = (punchOutTime - punchInTime) / 1000;
              totalWorkedSeconds += workSeconds;
              sessionSegments.push({ label: "Work", value: workSeconds, color: "#004DC6" });
              lastPunchOut = punchOutTime;
            } else if (punchInTime && !punchOutTime) {
              const workSeconds = (now - punchInTime) / 1000;
              totalWorkedSeconds += workSeconds;
              sessionSegments.push({ label: "Work", value: workSeconds, color: "#004DC6" });
              lastPunchOut = now;
            }
          });

          const remainingSeconds = 86400 - (totalWorkedSeconds + totalIdleSeconds);
          setRemainingTime(formatTime(remainingSeconds));

          sessionSegments.push({ label: "Remaining", value: remainingSeconds, color: "#E8E9EA" });

          setChartData({
            labels: sessionSegments.map((seg) => seg.label),
            datasets: [
              {
                data: sessionSegments.map((seg) => seg.value),
                backgroundColor: sessionSegments.map((seg) => seg.color),
                hoverBackgroundColor: sessionSegments.map((seg) => seg.color),
              },
            ],
          });

          setTotalWorkSeconds(totalWorkedSeconds);
          setTotalIdleSeconds(totalIdleSeconds);
        } else {
          setChartData(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
    const interval = setInterval(fetchSessionData, 30000);
    return () => clearInterval(interval);
  }, [employeeId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!chartData) return <p>No session data available.</p>;

  return (
    <div className="emp-sessions">
      <h3>Work Session Status</h3>
      <p className="current-time">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
      <div className="chart-container">
        <Doughnut data={chartData} options={{
         responsive: true, maintainAspectRatio: false, cutout: "70%",
         layout: {
           padding: { top: 20, bottom: 20 },
         },
         plugins: { legend: { display: false }, tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${formatTime(tooltipItem.raw)}` } }, datalabels: { color: "#000", font: { size: 10, weight: "bold" }, anchor: "end", align: "end", offset: 6, formatter: (value) => (value <= 0 ? "" : formatTime(value)) } } }} />
        <div className="chart-center-label">
          <p>{formatTime(totalWorkSeconds)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmpSessions;