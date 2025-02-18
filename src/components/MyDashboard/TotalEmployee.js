

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./TotalEmployee.css";

// Register required chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const TotalEmployee = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY; // Ensure this is correctly set in your .env
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTotalEmployeeData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/attendance-status`, {
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

        // Check if the response is in the expected format
        if (!jsonData || !jsonData.message) {
          throw new Error("Invalid data format received");
        }

        const { totalEmployees, categories } = jsonData.message;

        // Process categories
        const labels = categories.map((item) => item.label);
        const dataValues = categories.map((item) => item.count);
        const colors = categories.map((item) => item.color);

        setChartData({
          labels: labels,
          datasets: [
            {
              data: dataValues,
              backgroundColor: colors,
              hoverBackgroundColor: colors,
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching total employee data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEmployeeData();
  }, [authToken, API_KEY]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalEmployees = chartData ? chartData.datasets[0].data.reduce((a, b) => a + b, 0) : 0;

  // Custom plugin to add text in the center of the Doughnut chart
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.save();
      ctx.font = "20px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Adjust the y-coordinate to move the text up
      const offsetX = -2; // Move text left by 20 pixels (adjust as needed)
      const offsetY = -10; // Move text upwards by 15 pixels (you can also adjust this value)
      
      ctx.fillText(`${totalEmployees} Employees`, width / 2 + offsetX, height / 2 + offsetY);
    ctx.restore();
    },
  };

  // Chart options
  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 15,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, value) => acc + value, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${currentValue} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "black",
        anchor: "start",
        align: "end",
        font: {
          size: 16,
          weight: "bold",
        },
        formatter: (value) => value,
        clip: false,
      },
      
    },
  };

  return (
    <div className="total-employees">
      <h3>Total Employees</h3>
      <div className="admindashtotalemployee-chart">
      <Doughnut data={chartData} options={options} plugins={[ChartDataLabels, centerTextPlugin]} />
      </div>
    </div>
  );
};

export default TotalEmployee;
