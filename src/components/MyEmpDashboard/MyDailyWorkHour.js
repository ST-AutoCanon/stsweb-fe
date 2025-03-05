
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./MyDailyWorkHour.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const MyDailyWorkHour = () => {
  const [view, setView] = useState("Daily");
  const [workHourData, setWorkHourData] = useState(null);
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
        }
      } catch (error) {
        console.error("Error parsing dashboardData:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchWorkHourData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!authToken) throw new Error("Session expired. Please log in again.");
        if (!API_KEY) throw new Error("API Key is missing.");

        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/work-hour-summary/${employeeId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.reduce((acc, item) => {
            acc[item.view] = item.data;
            return acc;
          }, {});

          setWorkHourData(data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkHourData();
  }, [employeeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!workHourData) return <p>No work-hour data available.</p>;

  const chartData = workHourData[view] || { labels: [], values: [] };

  // Convert decimal hours to HH:MM format
  const formatTime = (hours) => {
    if (hours === null) return "--:--";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const generateData = () => ({
    labels: chartData.labels,
    datasets: [
      {
        label: "Work Hours",
        data: chartData.values.map((value) => (value !== null ? value : 0)),
        backgroundColor: chartData.values.map((value) =>
          value === null ? "#d3d3d3" : value >= 9 ? "#0033cc" : "#99ccff"
        ),
        barThickness: view === "Daily" ? 30 : view === "Weekly" ? 40 : 10,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return formatTime(tooltipItem.raw);
          },
        },
      },
      datalabels: {
        color: "#fff",
        anchor: "end",
        align: "top",
        formatter: (value) => formatTime(value),
        font: { weight: "bold", size: 14 },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        max: view === "Weekly" ? 48 : 10, // Weekly max = 48 hours
        ticks: {
          callback: function (value) {
            return formatTime(value);
          },
          stepSize: view === "Weekly" ? 8 : 1, // Weekly step size = 8 hours
        },
      },
    },
  };

  return (
    <div className="work-hour-container">
      <div className="work-hour-header">
        <h3>My daily work hours</h3>
        <div className="work-hour-view-options">
          {["Daily", "Weekly", "Monthly"].map((option) => (
            <button key={option} className={view === option ? "active" : ""} onClick={() => setView(option)}>
              {option}
            </button>
          ))}
        </div>
        <div className="work-hour-legend">
  {view === "Weekly" ? (
    <>
      <span className="work-hour-legend-item">
        <span className="work-hour-box blue"></span> 48+ hours
      </span>
      <span className="work-hour-legend-item">
        <span className="work-hour-box light-blue"></span> Less than 48 hours
      </span>
    </>
  ) : (
    <>
      <span className="work-hour-legend-item">
        <span className="work-hour-box blue"></span> 9+ hours
      </span>
      <span className="work-hour-legend-item">
        <span className="work-hour-box light-blue"></span> Less than 9 hours
      </span>
    </>
  )}
</div>

      </div>
      <div style={{ width: "1050px", height: "200px", margin: "0 auto" }}>
        <Bar data={generateData()} options={options} />
      </div>
    </div>
  );
};

export default MyDailyWorkHour;
