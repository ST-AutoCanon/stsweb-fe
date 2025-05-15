import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import "./EmpWorkDays.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EmpWorkDays = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

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

    const fetchWorkDaysData = async () => {
      if (!API_KEY) {
        setError("API Key is missing.");
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/attendance/${employeeId}`;
        console.log("API Request URL:", apiUrl);
        const response = await axios.get(apiUrl, {
          headers,
        });

        console.log("API Response:", response.data);

        if (response.status === 200 && response.data.attendanceStats) {
          const {
            total_working_days,
            leave_count,
            present_count,
            absent_count,
          } = response.data.attendanceStats;

          setChartData({
            labels: ["Leaves", "Present", "Absent"],
            data: [leave_count, present_count, absent_count],
            backgroundColors: ["#82DAFE", "#004DC6", "#E8E9EA"],
            hoverColors: ["#82DAFE", "#004DC6", "#E8E9EA"],
            centerTextWorkDays: `${total_working_days} Days`,
          });
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching workdays:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkDaysData();
  }, [employeeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!chartData) return <p>No data available.</p>;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartData.backgroundColors,
        hoverBackgroundColor: chartData.hoverColors,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: "70%",
    layout: {
      padding: {
        top: 15, // Adds space above the chart
        bottom: 15, // Adds space below the chart
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "end",
        offset: 0,
        font: { weight: "bold", size: 12 },
        formatter: (value) => `${value}`,
      },
    },
  };

  // Plugin for center text
  const centerTextPluginWorkDays = {
    id: "centerTextWorkDays",
    afterDraw: (chart) => {
      if (!chartData || !chartData.centerTextWorkDays) return;

      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.save();

      const centerText = chartData.centerTextWorkDays;
      const parts = centerText.split(" ");
      const number = parts[0] || "";
      const unit = parts[1] || "";

      ctx.font = "bold 26px sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000";
      ctx.fillText(number, width / 2, height / 2 - 10);

      ctx.font = "14px sans-serif";
      ctx.fillText(unit, width / 2, height / 2 + 10);

      ctx.restore();
    },
  };

  return (
    <div className="emp-workdays">
      <h3>Work Days</h3>
      <p>
        {new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <div className="chart-container1" style={{ paddingTop: "50px" }}>
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPluginWorkDays]}
        />
      </div>
      <div className="custom-legend">
        {chartData.labels.map((label, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: chartData.backgroundColors[index] }}
            ></span>
            <span className="legend-text">
              {label}: {chartData.data[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpWorkDays;
