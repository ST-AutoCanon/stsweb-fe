


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "./EmpReImbursement.css";

const EmpReImbursement = () => {
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [previousMonthData, setPreviousMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

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

    const fetchReimbursementData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) throw new Error("API Key is missing.");

        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/reimbursement/stats/${employeeId}`;

        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        });

        if (response.status === 200) {
          const data = response.data;

          const formatData = (dataset) => ({
            labels: dataset.labels,
            datasets: [
              {
                data: dataset.data.map(Number),
                backgroundColor: ["#82DAFE", "#004DC6", "#E8E9EA"],
                hoverBackgroundColor: ["#82DAFE", "#004DC6", "#E8E9EA"],
              },
            ],
          });

          setCurrentMonthData(formatData(data.currentMonth));
          setPreviousMonthData(formatData(data.previousMonth));
        } else {
          setCurrentMonthData(null);
          setPreviousMonthData(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursementData();
  }, [employeeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  if (!currentMonthData || !previousMonthData) {
    return <p>No reimbursement records available.</p>;
  }

  const CustomLegend = ({ chartData }) => {
    return (
      <div className="custom-legend">
        {chartData.labels.map((label, index) => (
          <div key={index} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
            ></span>
            <span className="legend-label">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="emp-reimbursement">
      <h3>Reimbursement Status</h3>
      <p>
        {new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="reimbursement-tabs">
        <div
          className={`tab-item ${activeTab === "current" ? "active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          Current Month
        </div>
        <div
          className={`tab-item ${activeTab === "previous" ? "active" : ""}`}
          onClick={() => setActiveTab("previous")}
        >
          Prev Month
        </div>
      </div>

      <div className="chart-container-reimbursement">
        <Pie
          data={activeTab === "previous" ? previousMonthData : currentMonthData}
          options={{
            plugins: {
              legend: {
                display: false, // Hides default legend
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>

      <CustomLegend chartData={activeTab === "previous" ? previousMonthData : currentMonthData} />
    </div>
  );
};

export default EmpReImbursement;
