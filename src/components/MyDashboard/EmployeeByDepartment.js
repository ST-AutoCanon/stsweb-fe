

import React, { useEffect, useState } from "react";
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
import "./EmployeeByDepartment.css";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeByDepartment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchEmployeeCountByDepartment = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/employee-count-by-department`, {
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

        // Ensure the response contains `categories`
        if (!jsonData || !jsonData.categories || !Array.isArray(jsonData.categories)) {
          throw new Error("Invalid data format: Expected an array in jsonData.categories");
        }

        // Filter and map departments
        const departments = jsonData.categories.filter(dept => dept.department_name?.trim());

        const labels = departments.map(dept => dept.department_name);
        const menData = departments.map(dept => dept.men || 0);
        const womenData = departments.map(dept => dept.women || 0);

        setData({
          labels,
          datasets: [
            {
              label: "Men",
              data: menData,
              backgroundColor: "#007bff",
            },
            {
              label: "Women",
              data: womenData,
              backgroundColor: "lightblue",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching employee count by department:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeCountByDepartment();
  }, [authToken, API_KEY]);

  const employeeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          color: "black",
          callback: function (value) {
            const label = this.getLabelForValue(value);
            const words = label.split(" ");
            return words.length > 1
              ? words.slice(0, Math.ceil(words.length / 2)).join(" ") +
                "\n" +
                words.slice(Math.ceil(words.length / 2)).join(" ")
              : label;
          },
          font: { size: 8 },
          padding: 6,
        },
        categoryPercentage: 0.3,
        barPercentage: 0.3,
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { beginAtZero: true },
      },
    },
    elements: {
      bar: { maxBarThickness: 3, borderRadius: 5 },
    },
  };

  return (
    <div className="employee-department">
      <h3>Employees by Department (Men & Women)</h3>
      <div className="chart-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <Bar data={data} options={employeeChartOptions} />
        )}
      </div>
    </div>
  );
};

export default EmployeeByDepartment;
