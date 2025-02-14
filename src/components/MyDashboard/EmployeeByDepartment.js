
// // import React, { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// // } from "chart.js";
// // import "./EmployeeByDepartment.css";

// // // Register chart components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const EmployeeByDepartment = () => {
// //     const [data, setData] = useState(null);

// //     useEffect(() => {
// //         fetch("/employees.json")
// //             .then((response) => response.json())
// //             .then((jsonData) => {
// //                 const labels = jsonData.departments.map((dept) => dept.name);
// //                 const menData = jsonData.departments.map((dept) => dept.men);
// //                 const womenData = jsonData.departments.map((dept) => dept.women);

// //                 setData({
// //                     labels,
// //                     datasets: [
// //                         {
// //                             label: "Men",
// //                             data: menData,
// //                             backgroundColor: "#007bff",
// //                         },
// //                         {
// //                             label: "Women",
// //                             data: womenData,
// //                             backgroundColor: "lightblue",
// //                         },
// //                     ],
// //                 });
// //             });
// //     }, []);

// //     const employeeChartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: "bottom",
                
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 stacked: true,
// //                 grid: {
// //                     display: false,
// //                 },
// //                 ticks: {
// //                   autoSkip: false, // Ensure all labels are shown
// //                   maxRotation: 0,  // Keep labels horizontal
// //                   minRotation: 0,
// //                   color: "black",
// //                   callback: function (value) {
// //                     const label = this.getLabelForValue(value);
// //                     const words = label.split(" ");
                    
// //                     // Ensure label splits into two lines
// //                     if (words.length > 1) {
// //                         return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "\n" + words.slice(Math.ceil(words.length / 2)).join(" ");
// //                     } 
// //                     return label;
// //                 },
// //                   font: {
// //                       size: 8, // Reduce font size to avoid overlap
                      
// //                   },
// //                   padding: 6, // Increase padding for better spacing
// //               },
// //               categoryPercentage: 0.3, // Decrease space allocated for each category
// //               barPercentage: 0.3,
              
                
// //             },
// //             y: {
// //                 stacked: true,
// //                 grid: {
// //                     display: false,
// //                 },
// //                 ticks: {
// //                     beginAtZero: true,
// //                 },
// //             },
// //         },
// //         elements: {
// //           bar: {
// //             maxBarThickness: 3, // Set explicit bar thickness (try adjusting the value)
// //               borderRadius: 5,
// //           },
// //       },
// //     };

// //     return (
// //         <div className="employee-department">
// //             <h3>Employees by Department Men & Women Employees</h3>
         
// //             <div className="chart-container">
// //                 {data ? <Bar data={data} options={employeeChartOptions} /> : <p>Loading...</p>}
// //             </div>
// //         </div>
// //     );
// // };

// // export default EmployeeByDepartment;

// // import React, { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// // } from "chart.js";
// // import "./EmployeeByDepartment.css";

// // // Register chart components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const EmployeeByDepartment = () => {
// //     const [data, setData] = useState(null);

// //     useEffect(() => {
// //         // Fetch data from the backend
// //         fetch("http://localhost:5000/admin/employee-by-department")
// //             .then((response) => {
// //                 if (!response.ok) {
// //                     throw new Error("Error fetching data");
// //                 }
// //                 return response.json();
// //             })
// //             .then((jsonData) => {
// //                 console.log(jsonData); // Log the response data

// //                 const labels = jsonData.data.map((dept) => dept.department_name);
// //                 const menData = jsonData.data.map((dept) => dept.men);
// //                 const womenData = jsonData.data.map((dept) => dept.women);

// //                 setData({
// //                     labels,
// //                     datasets: [
// //                         {
// //                             label: "Men",
// //                             data: menData,
// //                             backgroundColor: "#007bff",
// //                         },
// //                         {
// //                             label: "Women",
// //                             data: womenData,
// //                             backgroundColor: "lightblue",
// //                         },
// //                     ],
// //                 });
// //             })
// //             .catch((error) => {
// //                 console.error("Error fetching data:", error);
// //             });
// //     }, []);

// //     const employeeChartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: "bottom",
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 stacked: true,
// //                 grid: {
// //                     display: false,
// //                 },
// //                 ticks: {
// //                     autoSkip: false, // Ensure all labels are shown
// //                     maxRotation: 0,  // Keep labels horizontal
// //                     minRotation: 0,
// //                     color: "black",
// //                     callback: function (value) {
// //                         const label = this.getLabelForValue(value);
// //                         const words = label.split(" ");
                        
// //                         // Ensure label splits into two lines
// //                         if (words.length > 1) {
// //                             return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "\n" + words.slice(Math.ceil(words.length / 2)).join(" ");
// //                         } 
// //                         return label;
// //                     },
// //                     font: {
// //                         size: 8, // Reduce font size to avoid overlap
// //                     },
// //                     padding: 6, // Increase padding for better spacing
// //                 },
// //                 categoryPercentage: 0.3, // Decrease space allocated for each category
// //                 barPercentage: 0.3,
// //             },
// //             y: {
// //                 stacked: true,
// //                 grid: {
// //                     display: false,
// //                 },
// //                 ticks: {
// //                     beginAtZero: true,
// //                 },
// //             },
// //         },
// //         elements: {
// //             bar: {
// //                 maxBarThickness: 3, // Set explicit bar thickness (try adjusting the value)
// //                 borderRadius: 5,
// //             },
// //         },
// //     };

// //     return (
// //         <div className="employee-department">
// //             <h3>Employees by Department (Men & Women)</h3>
// //             <div className="chart-container">
// //                 {data ? <Bar data={data} options={employeeChartOptions} /> : <p>Loading...</p>}
// //             </div>
// //         </div>
// //     );
// // };

// // export default EmployeeByDepartment;

// // import React, { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import "./EmployeeByDepartment.css";

// // // Register chart components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // // ✅ Use environment variables for API security
// // const API_URL = "http://localhost:5000/admindash/employee-by-department";
// // const API_KEY = process.env.REACT_APP_API_KEY || "your-default-api-key"; // ✅ Update this!

// // const EmployeeByDepartment = () => {
// //   const [chartData, setChartData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const handleFetchEmployeeData = async () => {
// //     try {
// //       // Clear previous error message
// //       setError("");
  
// //       // Send a request to fetch employee data
// //       const response = await fetch(API_URL, {
// //         headers: {
// //           "Content-Type": "application/json",
// //           "x-api-key": process.env.REACT_APP_API_KEY, // Ensure the API key is correctly loaded
// //         },
// //       });
  
// //       // Check if the response is OK
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         setError(errorData.message || "Failed to fetch employee data");
// //         return;
// //       }
  
// //       // Parse the response JSON
// //       const jsonData = await response.json();
// //       console.log("Fetched data:", jsonData);
  
// //       // Check if data exists in the response
// //       if (!jsonData || !jsonData.data) {
// //         throw new Error("Invalid response structure");
// //       }
  
// //       // Prepare the data for the chart
// //       const labels = jsonData.data.map((dept) => dept.department_name || "Unknown");
// //       const menData = jsonData.data.map((dept) => dept.men || 0);
// //       const womenData = jsonData.data.map((dept) => dept.women || 0);
  
// //       // Set the chart data
// //       setChartData({
// //         labels,
// //         datasets: [
// //           {
// //             label: "Men",
// //             data: menData,
// //             backgroundColor: "#007bff",
// //           },
// //           {
// //             label: "Women",
// //             data: womenData,
// //             backgroundColor: "lightblue",
// //           },
// //         ],
// //       });
// //     } catch (error) {
// //       console.error("Error fetching employee data:", error);
// //       setError("An unexpected error occurred while fetching the data.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   // Trigger this function when you want to fetch employee data (e.g., on page load, button click, etc.)
// //   useEffect(() => {
// //     setLoading(true);
// //     handleFetchEmployeeData();
// //   }, []);
  
// //   const chartOptions = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         position: "bottom",
// //       },
// //     },
// //     scales: {
// //       x: {
// //         stacked: true,
// //         grid: { display: false },
// //         ticks: {
// //           autoSkip: false,
// //           maxRotation: 0,
// //           minRotation: 0,
// //           color: "black",
// //           font: { size: 10 },
// //           padding: 6,
// //         },
// //         categoryPercentage: 0.5,
// //         barPercentage: 0.5,
// //       },
// //       y: {
// //         stacked: true,
// //         grid: { display: false },
// //         ticks: { beginAtZero: true },
// //       },
// //     },
// //     elements: {
// //       bar: {
// //         maxBarThickness: 15,
// //         borderRadius: 5,
// //       },
// //     },
// //   };

// //   return (
// //     <div className="employee-department">
// //       <h3>Employees by Department (Men & Women)</h3>
// //       <div className="chart-container">
// //         {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : <Bar data={chartData} options={chartOptions} />}
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeeByDepartment;


// // import React, { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// // } from "chart.js";
// // import "./EmployeeByDepartment.css";

// // // Register chart components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const EmployeeByDepartment = () => {
// //     const [data, setData] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const API_KEY = process.env.REACT_APP_API_KEY;
// //     const authToken = localStorage.getItem('authToken');
// //     console.log("API_KEY-",API_KEY);

// //     // Fetch employee count by department when the component mounts
// //     useEffect(() => {
// //         const fetchEmployeeCount = async () => {
// //             try {

// //                 const response = await fetch("http://localhost:5000/employee-count", {
// //                     method: "GET",
// //                     headers: {
// //                         'Authorization': `Bearer ${authToken}`,  // Pass the authorization token
// //                         'x-api-key': API_KEY,  // Include API key if necessary
// //                         'Content-Type': 'application/json',
// //                     },
// //                 });

// //                 if (!response.ok) {
// //                     throw new Error("Failed to fetch data");
// //                 }

// //                 const jsonData = await response.json();
// //                 console.log("responce",response);

// //                 if (jsonData.status === "success") {
// //                     console.log("JsonData",jsonData);
// //                     const departments = jsonData.data.filter(dept => dept.department_name); // Remove null names

// //                     const labels = departments.map((dept) => dept.department_name);
// //                     const menData = departments.map((dept) => dept.men);
// //                     const womenData = departments.map((dept) => dept.women);

// //                     setData({
// //                         labels,
// //                         datasets: [
// //                             {
// //                                 label: "Men",
// //                                 data: menData,
// //                                 backgroundColor: "#007bff",
// //                             },
// //                             {
// //                                 label: "Women",
// //                                 data: womenData,
// //                                 backgroundColor: "lightblue",
// //                             },
// //                         ],
// //                     });
// //                 } else {
// //                     throw new Error("Invalid data format");
// //                 }
// //             } catch (err) {
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchEmployeeCount();
// //     }, []);

// //     const employeeChartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: "bottom",
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 stacked: true,
// //                 grid: { display: false },
// //                 ticks: {
// //                     autoSkip: false,
// //                     maxRotation: 0,
// //                     minRotation: 0,
// //                     color: "black",
// //                     callback: function (value) {
// //                         const label = this.getLabelForValue(value);
// //                         const words = label.split(" ");
// //                         return words.length > 1
// //                             ? words.slice(0, Math.ceil(words.length / 2)).join(" ") +
// //                               "\n" +
// //                               words.slice(Math.ceil(words.length / 2)).join(" ")
// //                             : label;
// //                     },
// //                     font: { size: 8 },
// //                     padding: 6,
// //                 },
// //                 categoryPercentage: 0.3,
// //                 barPercentage: 0.3,
// //             },
// //             y: {
// //                 stacked: true,
// //                 grid: { display: false },
// //                 ticks: { beginAtZero: true },
// //             },
// //         },
// //         elements: {
// //             bar: {
// //                 maxBarThickness: 3,
// //                 borderRadius: 5,
// //             },
// //         },
// //     };

// //     return (
// //         <div className="employee-department">
// //             <h3>Employees by Department (Men & Women)</h3>
// //             <div className="chart-container">
// //                 {loading ? (
// //                     <p>Loading...</p>
// //                 ) : error ? (
// //                     <p>{error}</p>
// //                 ) : (
// //                     <Bar data={data} options={employeeChartOptions} />
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default EmployeeByDepartment;


// // import React, { useEffect, useState } from "react";
// // import { Bar } from "react-chartjs-2";
// // import {
// //     Chart as ChartJS,
// //     CategoryScale,
// //     LinearScale,
// //     BarElement,
// //     Title,
// //     Tooltip,
// //     Legend,
// // } from "chart.js";
// // import "./EmployeeByDepartment.css";

// // // Register chart components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const EmployeeByDepartment = () => {
// //     const [data, setData] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const API_KEY = process.env.REACT_APP_API_KEY;
// //     const authToken = localStorage.getItem("authToken");

// //     // Fetch employee count by department when the component mounts
// //    useEffect(() => {
// //         const fetchEmployeeCount = async () => {
// //             try {
// //                 const response = await fetch("http://localhost:5000/employee-count", {
// //                     method: "GET",
// //                     headers: {
// //                         "Authorization": `Bearer ${authToken}`,  // Pass the authorization token
// //                         "x-api-key": API_KEY,  // Include API key if necessary
// //                         "Content-Type": "application/json",
// //                     },
// //                 });

// //                 if (!response.ok) {
// //                     throw new Error("Failed to fetch data");
// //                 }

// //                 const jsonData = await response.json();
// //                 console.log("Response Data: ", jsonData); // Log the response to check the structure

// //                 if (jsonData.statusCode === 200 && jsonData.data) {
// //                     const departments = jsonData.data.filter(
// //                         (dept) => dept.department_name && dept.department_name.trim() !== "" // Remove null or empty department names
// //                     );

// //                     const labels = departments.map((dept) => dept.department_name);
// //                     const menData = departments.map((dept) => dept.men);
// //                     const womenData = departments.map((dept) => dept.women);

// //                     setData({
// //                         labels,
// //                         datasets: [
// //                             {
// //                                 label: "Men",
// //                                 data: menData,
// //                                 backgroundColor: "#007bff",
// //                             },
// //                             {
// //                                 label: "Women",
// //                                 data: womenData,
// //                                 backgroundColor: "lightblue",
// //                             },
// //                         ],
// //                     });
// //                 } else {
// //                     throw new Error("Invalid data format");
// //                 }
// //             } catch (err) {
// //                 setError(err.message);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchEmployeeCount();
// //     }, [authToken, API_KEY]);

// //     const employeeChartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 position: "bottom",
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 stacked: true,
// //                 grid: { display: false },
// //                 ticks: {
// //                     autoSkip: false,
// //                     maxRotation: 0,
// //                     minRotation: 0,
// //                     color: "black",
// //                     callback: function (value) {
// //                         const label = this.getLabelForValue(value);
// //                         const words = label.split(" ");
// //                         return words.length > 1
// //                             ? words.slice(0, Math.ceil(words.length / 2)).join(" ") +
// //                               "\n" +
// //                               words.slice(Math.ceil(words.length / 2)).join(" ")
// //                             : label;
// //                     },
// //                     font: { size: 8 },
// //                     padding: 6,
// //                 },
// //                 categoryPercentage: 0.3,
// //                 barPercentage: 0.3,
// //             },
// //             y: {
// //                 stacked: true,
// //                 grid: { display: false },
// //                 ticks: { beginAtZero: true },
// //             },
// //         },
// //         elements: {
// //             bar: {
// //                 maxBarThickness: 3,
// //                 borderRadius: 5,
// //             },
// //         },
// //     };

// //     return (
// //         <div className="employee-department">
// //             <h3>Employees by Department (Men & Women)</h3>
// //             <div className="chart-container">
// //                 {loading ? (
// //                     <p>Loading...</p>
// //                 ) : error ? (
// //                     <p>{error}</p>
// //                 ) : (
// //                     <Bar data={data} options={employeeChartOptions} />
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default EmployeeByDepartment;


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

// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const EmployeeByDepartment = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const authToken = localStorage.getItem("authToken");

//   useEffect(() => {
//     const fetchEmployeeCountByDepartment = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/employee-count-by-department", {
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

//         // Ensure the structure is correct
//         if (!jsonData || !jsonData.message || !Array.isArray(jsonData.message)) {
//           throw new Error("Invalid data format: Expected an array in jsonData.message");
//         }

//         // Filter and map departments
//         const departments = jsonData.message.filter(dept => dept.department_name?.trim());

//         const labels = departments.map(dept => dept.department_name);
//         const menData = departments.map(dept => dept.men || 0);
//         const womenData = departments.map(dept => dept.women || 0);

//         setData({
//           labels,
//           datasets: [
//             {
//               label: "Men",
//               data: menData,
//               backgroundColor: "#007bff",
//             },
//             {
//               label: "Women",
//               data: womenData,
//               backgroundColor: "lightblue",
//             },
//           ],
//         });
//       } catch (err) {
//         console.error("Error fetching employee count by department:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeCountByDepartment();
//   }, [authToken, API_KEY]);

//   const employeeChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "bottom" },
//     },
//     scales: {
//       x: {
//         stacked: true,
//         grid: { display: false },
//         ticks: {
//           autoSkip: false,
//           maxRotation: 0,
//           minRotation: 0,
//           color: "black",
//           callback: function (value) {
//             const label = this.getLabelForValue(value);
//             const words = label.split(" ");
//             return words.length > 1
//               ? words.slice(0, Math.ceil(words.length / 2)).join(" ") +
//                 "\n" +
//                 words.slice(Math.ceil(words.length / 2)).join(" ")
//               : label;
//           },
//           font: { size: 8 },
//           padding: 6,
//         },
//         categoryPercentage: 0.3,
//         barPercentage: 0.3,
//       },
//       y: {
//         stacked: true,
//         grid: { display: false },
//         ticks: { beginAtZero: true },
//       },
//     },
//     elements: {
//       bar: { maxBarThickness: 3, borderRadius: 5 },
//     },
//   };

//   return (
//     <div className="employee-department">
//       <h3>Employees by Department (Men & Women)</h3>
//       <div className="chart-container">
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : (
//           <Bar data={data} options={employeeChartOptions} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeByDepartment;




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
        const response = await fetch("http://localhost:5000/employee-count-by-department", {
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
