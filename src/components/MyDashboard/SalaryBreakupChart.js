
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./SalaryBreakupChart.css";

// Register only required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeSalaryBreakup = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        // Make a GET request to fetch salary data from the backend
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/salary-ranges`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        console.log("Full API Response:", jsonData); // Debugging output

        // Ensure the response contains the necessary data structure
        if (!jsonData || !jsonData.message || !jsonData.message.labels) {
          throw new Error("Invalid data format: Expected labels and datasets in jsonData.message");
        }

        // Set the chart data
        setData(jsonData.message);
      } catch (err) {
        console.error("Error fetching salary data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [authToken, API_KEY]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 8,
          font: {
            size: 12,
          },
        },
      },
      datalabels: {
        color: "#fff",
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 14,
        },
      },
    },
  };

  return (
    <div className="salary-breakup">
      <h3>Employee Salary Breakup</h3>
      <div className="chart-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Pie data={data} options={options} plugins={[ChartDataLabels]} />
        )}
      </div>
    </div>
  );
};

export default EmployeeSalaryBreakup;
