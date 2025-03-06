
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmpLeaveTracker.css";

const EmpLeaveTracker = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const dashboardData = localStorage.getItem("dashboardData");
    if (dashboardData) {
      try {
        const parsedData = JSON.parse(dashboardData);
        if (parsedData.employeeId) {
          setEmployeeId(parsedData.employeeId);
          console.log("✅ Employee ID found:", parsedData.employeeId);
        } else {
          console.warn("⚠️ Employee ID not found in dashboardData");
        }
      } catch (error) {
        console.error("❌ Error parsing dashboardData:", error);
      }
    } else {
      console.warn("⚠️ No dashboardData found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!employeeId) {
      console.warn("⏳ Waiting for Employee ID...");
      return;
    }

//     const fetchLeaveData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         if (!authToken) throw new Error("⚠️ Session expired. Please log in again.");
//         if (!API_KEY) throw new Error("⚠️ API Key is missing.");

//         const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/leave-queries/${employeeId}`;
//         console.log("📡 Fetching leave data from:", apiUrl);

//         const response = await axios.get(apiUrl, {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": API_KEY,
//             Authorization: `Bearer ${authToken}`,
//           },
//         });

//         console.log("✅ API Response:", response.data.leaveQueries);
//         console.log("response123",response);
//         // if (response.status === 200 && Array.isArray(response.data.leaveQueries)) {
//         //   setLeaveData([...response.data.leaveQueries]); // Force React state update
//         //   console.log("⬆️ Updated leaveData:", response.data.leaveQueries);
//         // }
        
        
        
//           if (response.status === 200 && Array.isArray(response.data.leaveQueries)) {
//       // 🔄 Convert API keys to camelCase
//       const formattedData = response.data.leaveQueries.map((leave) => ({
//         leaveType: leave["Leave Type"] || "N/A",
//         startDate: leave["Start Date"] || "N/A",
//         endDate: leave["End Date"] || "N/A",
//         halfOrFullDay: leave["Half/Full Day"] || "N/A",
//         reason: leave["Reason"] || "N/A",
//         status: leave["Status"] || "N/A",
//         comments: leave["Comments"] || "N/A",
//       }));
//       setLeaveData(formattedData);
//       console.log("⬆️ Updated leaveData (formatted):", formattedData);
//     } else {
//       setLeaveData([]);
//       console.warn("⚠️ No leave records found in API response")
//     }
//   } catch (err) {
//     console.error("❌ Error fetching leave data:", err);
//     setError(err.response?.data?.message || err.message || "Failed to load data.");
//   } finally {
//     setLoading(false);
//   }
// };
        


const fetchLeaveData = async () => {
  setLoading(true);
  setError(null);

  try {
    if (!API_KEY) throw new Error("⚠️ API Key is missing.");

    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/leave-queries/${employeeId}`;
    console.log("📡 Fetching leave data from:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY, // Keeping API key check
      },
    });

    console.log("✅ API Response:", response.data);

    if (response.status === 200 && Array.isArray(response.data.leaveQueries)) {
      const formattedData = response.data.leaveQueries.map((leave) => ({
        leaveType: leave["Leave Type"] || "N/A",
        startDate: leave["Start Date"] || "N/A",
        endDate: leave["End Date"] || "N/A",
        halfOrFullDay: leave["Half/Full Day"] || "N/A",
        reason: leave["Reason"] || "N/A",
        status: leave["Status"] || "N/A",
        comments: leave["Comments"] || "N/A",
      }));
      setLeaveData(formattedData);
    } else {
      setLeaveData([]);
      console.warn("⚠️ No leave records found.");
    }
  } catch (err) {
    console.error("❌ Error fetching leave data:", err);
    setError(err.response?.data?.message || "Failed to load data.");
  } finally {
    setLoading(false);
  }
};

    //     else {
    //       setLeaveData([]); // Avoid errors if response is empty
    //       console.warn("⚠️ No leave records found in API response");
    //     }
    //   } catch (err) {
    //     console.error("❌ Error fetching leave data:", err);
    //     setError(err.response?.data?.message || err.message || "Failed to load data.");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    console.log("🔄 Fetching leave data...");
    fetchLeaveData();
  }, [employeeId]); // ✅ Runs when employeeId updates

  console.log("🛠 leaveData before rendering:", leaveData);

  if (loading) return <p>Loading...</p>;
  
  if (error) return <p className="error">{error}</p>;
  if (!Array.isArray(leaveData) || leaveData.length === 0) {
    console.warn(" No leave records found in UI:", leaveData);
    return <p>No leave records available.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";
      case "Rejected":
        return "status-rejected";
      case "Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {["Leave Type", "Start Date", "End Date", "Half/Full Day", "Reason", "Status", "Comments"].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr key={index}>
              <td>{leave.leaveType || "N/A"}</td>
              <td>{formatDate(leave.startDate)}</td>
              <td>{formatDate(leave.endDate)}</td>
              <td>{leave.halfOrFullDay || "N/A"}</td>
              <td>{leave.reason || "N/A"}</td>
              <td className={getStatusClass(leave.status)}>{leave.status || "N/A"}</td>
              <td>{leave.comments || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EmpLeaveTracker;






