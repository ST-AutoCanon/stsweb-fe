import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./SalaryBreakupChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeSalaryBreakup = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/salary-ranges`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}`
          );
        }

        const jsonData = await response.json();

        if (!jsonData || !jsonData.message || !jsonData.message.labels) {
          throw new Error(
            "Invalid data format: Expected labels and datasets in jsonData.message"
          );
        }

        setData(jsonData.message);
      } catch (err) {
        console.error("Error fetching salary data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [API_KEY]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        layout: {
          padding: 10,
        },
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
    <div className="salary-breakup-chart">
      <h3>Employee Salary Breakup</h3>
      <div className="chart-container-for-employee">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Pie
            data={data}
            options={options}
            plugins={[ChartDataLabels]}
            width={250}
            height={250}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeSalaryBreakup;
