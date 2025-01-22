import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LoginTimerGraph = ({ data }) => {
  const [filter, setFilter] = useState("daily");

  if (!data || typeof data !== "object" || !data[filter]) {
    return <div>Loading graph data...</div>;
  }

  // Filter the data based on the selected parameter (Daily, Weekly, Monthly)
  const filteredData = data[filter];

  const labels = filteredData.map((entry) => entry.timing);
  const counts = filteredData.map((entry) => entry.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Login Count`,
        data: counts,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        tension: 0, // Straight lines
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Custom sizing
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      x: { title: { display: true, text: "Timing" } },
      y: { title: { display: true, text: "Count" }, min: 0 },
    },
  };

  return (
    <div style={{ width: "300px", height: "200px", margin: "0 auto" }}>
      <div className="filter-buttons" style={{ textAlign: "center", marginBottom: "10px" }}>
        <button
          onClick={() => setFilter("daily")}
          style={{
            background: filter === "daily" ? "blue" : "white",
            color: filter === "daily" ? "white" : "blue",
            margin: "0 5px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid blue",
            cursor: "pointer",
          }}
        >
          Daily
        </button>
        <button
          onClick={() => setFilter("weekly")}
          style={{
            background: filter === "weekly" ? "blue" : "white",
            color: filter === "weekly" ? "white" : "blue",
            margin: "0 5px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid blue",
            cursor: "pointer",
          }}
        >
          Weekly
        </button>
        <button
          onClick={() => setFilter("monthly")}
          style={{
            background: filter === "monthly" ? "blue" : "white",
            color: filter === "monthly" ? "white" : "blue",
            margin: "0 5px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid blue",
            cursor: "pointer",
          }}
        >
          Monthly
        </button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LoginTimerGraph;
