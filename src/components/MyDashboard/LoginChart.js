

// import React, { useState, useEffect } from 'react';
// import './LoginChart.css';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// // Register required components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LoginChart = () => {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('LoginData.json');
//         const data = await response.json();

//         const formattedData = {
//           labels: data.labels,
//           datasets: [
//             {
//               label: 'Daily',
//               data: data.daily,
//               borderColor: 'green',
//               backgroundColor: 'green',
//               pointBorderColor: 'green',
//               pointBackgroundColor: 'green',
//               borderWidth: 2,
//               tension: 0.4,
//             },
//             {
//               label: 'Weekly',
//               data: data.weekly,
//               borderColor: 'blue',
//               backgroundColor: 'blue',
//               pointBorderColor: 'blue',
//               pointBackgroundColor: 'blue',
//               borderWidth: 2,
//               tension: 0.4,
//             },
//             {
//               label: 'Monthly',
//               data: data.monthly,
//               borderColor: 'black',
//               backgroundColor: 'black',
//               pointBorderColor: 'black',
//               pointBackgroundColor: 'black',
//               borderWidth: 2,
//               tension: 0.4,
//             },
//           ],
//         };

//         setChartData(formattedData);
//       } catch (error) {
//         console.error('Error fetching the chart data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//         align: 'end',
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           display: false,
//         },
//         ticks: {
//           stepSize: 10,
//         },
//       },
//     },
//   };

//   return (
//     <div className="dashboardlogin-chart-container">
//       <div className="dashboardloginchartgray-box">
//         <div className="dashboardlogin-chart">
//           <h3>Login Timer</h3>
//           {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginChart;



import React, { useState, useEffect } from 'react';
import './LoginChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LoginChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/login-data-count", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`, 
            "x-api-key": API_KEY,  
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Login Data Response: ", data); // Log response to check structure

        if (data.status === "success" && data.data) {
          setChartData({
            labels: data.data.labels,
            datasets: [
              {
                label: "Daily",
                data: data.data.daily,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.5)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Weekly",
                data: data.data.weekly,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.5)",
                borderWidth: 2,
                tension: 0.4,
              },
              {
                label: "Monthly",
                data: data.data.monthly,
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderWidth: 2,
                tension: 0.4,
              },
            ],
          });
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching the chart data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, API_KEY]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <div className="dashboardlogin-chart-container">
      <div className="dashboardloginchartgray-box">
        <div className="dashboardlogin-chart">
          <h3>Login Timer</h3>
          {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <Line data={chartData} options={options} />}
        </div>
      </div>
    </div>
  );
};

export default LoginChart;
