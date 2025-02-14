


// import React, { useEffect, useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import {
//     Chart as ChartJS,
//     ArcElement,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import "./TotalEmployee.css";

// // Register required components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const TotalEmployee = () => {
//     const [chartData, setChartData] = useState(null);

//     useEffect(() => {
//         fetch("/employeeData.json") // Fetching from the JSON file
//             .then((response) => response.json())
//             .then((data) => setChartData(data))
//             .catch((error) => console.error("Error fetching data:", error));
//     }, []);

//     if (!chartData) return <p>Loading...</p>;

//     // Extract data from JSON
//     const totalEmployees = chartData.totalEmployees;
//     const labels = chartData.categories.map((item) => item.label);
//     const dataValues = chartData.categories.map((item) => item.count);
//     const colors = chartData.categories.map((item) => item.color);

//     // Chart data
//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 data: dataValues,
//                 backgroundColor: colors,
//                 hoverBackgroundColor: colors,
//                 borderWidth: 1,
//             },
//         ],
//     };

//     // Custom plugin to add text in the center of the Doughnut chart
//     const centerTextPlugin = {
//         id: 'centerText',
//         beforeDraw: (chart) => {
//             const { width, height, ctx } = chart;
//             ctx.save();
//             ctx.font = '22px Arial';
//             ctx.fillStyle = '#000';
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'middle';
//             ctx.fillText(`${totalEmployees} Employees`, width / 2, height / 2);
//             ctx.restore();
//         }
//     };

//     // Chart options
//     const options = {
//         cutout: '70%',
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 align: 'center',
//                 labels: {
//                     boxWidth: 20,
//                     padding: 20,
//                 },
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function (tooltipItem) {
//                         const dataset = tooltipItem.dataset;
//                         const total = dataset.data.reduce((acc, value) => acc + value, 0);
//                         const currentValue = dataset.data[tooltipItem.dataIndex];
//                         const percentage = ((currentValue / total) * 100).toFixed(1);
//                         return `${currentValue} (${percentage}%)`;
//                     },
//                 },
//             },
//             datalabels: {
//                 display: true,  
//                 color: 'black',
//                 anchor: 'start',  
//                 align: 'end',
//                 font: {
//                     size: 16,
//                     weight: 'bold',
//                 },
//                 formatter: (value) => value, 
//                 clip: false,  
//             },
//         },
//     };

//     return (
//         <div className="total-employees">
//             <h3>Total Employees</h3>
//             <div className="donut-chart">
//                 <Doughnut data={data} options={options} plugins={[ChartDataLabels, centerTextPlugin]} />
//             </div>
//         </div>
//     );
// };

// export default TotalEmployee;



// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import "./EmployeeByDepartment.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const TotalEmployeeChart = () => {
//   const [data, setData] = useState(null);
//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const authToken = localStorage.getItem("authToken");

//   useEffect(() => {
//     const fetchAttendanceStatusCount = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/attendance-status", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//             "x-api-key": API_KEY,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
//         }

//         const jsonData = await response.json();
//         console.log("Full API Response:", jsonData);

//         if (!jsonData || !jsonData.data || !Array.isArray(jsonData.data)) {
//           throw new Error("Invalid data format: Expected an array in jsonData.data");
//         }

//         setTotalEmployees(jsonData.totalEmployees || 0);

//         const labels = jsonData.data.map((item) => item.label);
//         const counts = jsonData.data.map((item) => item.count);
//         const colors = jsonData.data.map((item) => item.color);

//         setData({
//           labels,
//           datasets: [
//             {
//               label: "Attendance Status",
//               data: counts,
//               backgroundColor: colors,
//             },
//           ],
//         });
//       } catch (err) {
//         console.error("Error fetching attendance status count:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendanceStatusCount();
//   }, [authToken, API_KEY]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "bottom" },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { color: "black" },
//       },
//       y: {
//         grid: { display: false },
//         ticks: { beginAtZero: true },
//       },
//     },
//     elements: {
//       bar: { maxBarThickness: 30, borderRadius: 5 },
//     },
//   };

//   return (
//     <div className="employee-attendance">
//       <h3>Total Employees: {totalEmployees}</h3>
//       <h4>Attendance Status Overview</h4>
//       <div className="chart-container">
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : (
//           <Bar data={data} options={chartOptions} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TotalEmployeeChart;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./TotalEmployee.css";
// import { FaUsers } from "react-icons/fa";

// const TotalEmployees = () => {
//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const authToken = localStorage.getItem("authToken");
//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     fetchTotalEmployees();
//   }, []);

//   const fetchTotalEmployees = async () => {
//     try {
//       setLoading(true);
//       if (!authToken) throw new Error("Session expired. Please log in again.");
//       if (!API_KEY) throw new Error("API Key is missing.");

//       const response = await axios.get("http://localhost:5000/attendance-status", {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": API_KEY,
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       // Log the response data for debugging
//       console.log("Response Data:", response.data);

//       if (response.status === 200) {
//         const { totalEmployees, categories } = response.data.message;

//         if (Array.isArray(categories)) {
//           setTotalEmployees(totalEmployees);
//           setAttendanceData(categories);
//         } else {
//           throw new Error("Invalid categories data format.");
//         }
//       } else {
//         throw new Error("Invalid response from server.");
//       }
//     } catch (error) {
//       console.error("Error fetching total employees:", error);
//       setErrorMessage(error.message || "Failed to fetch total employees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="emp-card">
//       <div className="emp-card-content">
//         <FaUsers className="emp-icon" />
//         <div>
//           <span className="emp-text">{totalEmployees}</span>
//           <span className="emp-label">Total Employees</span>
//         </div>
//       </div>

//       <div className="attendance-stats">
//         {loading ? (
//           <p>Loading...</p>
//         ) : errorMessage ? (
//           <p className="error-message">{errorMessage}</p>
//         ) : attendanceData.length > 0 ? (
//           attendanceData.map((status, index) => (
//             <div key={index} className="attendance-status">
//               <span className="attendance-label">{status.label}</span>
//               <span className="attendance-count" style={{ color: status.color }}>
//                 {status.count}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p>No attendance data available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TotalEmployees;




// import React, { useEffect, useState } from "react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import "./TotalEmployee.css";

// // Register required chart components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const TotalEmployee = () => {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_KEY = process.env.REACT_APP_API_KEY; // Ensure this is correctly set in your .env
//   const authToken = localStorage.getItem("authToken");

//   useEffect(() => {
//     const fetchTotalEmployeeData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/attendance-status", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//             "x-api-key": API_KEY,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
//         }

//         const jsonData = await response.json();
//         console.log("Full API Response:", jsonData); // Debugging output

//         // Check if the response is in the expected format
//         if (!jsonData || !jsonData.message) {
//           throw new Error("Invalid data format received");
//         }

//         const { totalEmployees, categories } = jsonData.message;

//         // Process categories
//         const labels = categories.map((item) => item.label);
//         const dataValues = categories.map((item) => item.count);
//         const colors = categories.map((item) => item.color);

//         setChartData({
//           labels: labels,
//           datasets: [
//             {
//               data: dataValues,
//               backgroundColor: colors,
//               hoverBackgroundColor: colors,
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (err) {
//         console.error("Error fetching total employee data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTotalEmployeeData();
//   }, [authToken, API_KEY]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   const totalEmployees = chartData ? chartData.datasets[0].data.reduce((a, b) => a + b, 0) : 0;

//   // Custom plugin to add text in the center of the Doughnut chart
//   const centerTextPlugin = {
//     id: "centerText",
//     beforeDraw: (chart) => {
//       const { width, height, ctx } = chart;
//       ctx.save();
//       ctx.font = "22px Arial";
//       ctx.fillStyle = "#000";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.fillText(`${totalEmployees} Employees`, width / 2, height / 2);
//       ctx.restore();
//     },
//   };

//   // Chart options
//   const options = {
//     cutout: "70%",
//     plugins: {
//       legend: {
//         position: "bottom",
//         align: "center",
//         labels: {
//           boxWidth: 20,
//           padding: 20,
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             const dataset = tooltipItem.dataset;
//             const total = dataset.data.reduce((acc, value) => acc + value, 0);
//             const currentValue = dataset.data[tooltipItem.dataIndex];
//             const percentage = ((currentValue / total) * 100).toFixed(1);
//             return `${currentValue} (${percentage}%)`;
//           },
//         },
//       },
//       datalabels: {
//         display: true,
//         color: "black",
//         anchor: "start",
//         align: "end",
//         font: {
//           size: 16,
//           weight: "bold",
//         },
//         formatter: (value) => value,
//         clip: false,
//       },
//     },
//   };

//   return (
//     <div className="total-employees">
//       <h3>Total Employees</h3>
//       <div className="donut-chart">
//         <Doughnut data={chartData} options={options} plugins={[ChartDataLabels, centerTextPlugin]} />
//       </div>
//     </div>
//   );
// };

// export default TotalEmployee;


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
        const response = await fetch("http://localhost:5000/attendance-status", {
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
