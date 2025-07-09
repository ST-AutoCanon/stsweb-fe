
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Dashboard.css";
import axios from "axios";
import BirthdayCard from "../BirthdayCard/BirthdayCard"; // Adjust path if needed
import { isBirthdayToday } from "../../utils/checkBirthday"; // Utility for MM-DD comparison

const Dashboard = () => {
  // State to manage active content inside the main-content container
  const [activeContent, setActiveContent] = useState();

  // 🎉 Birthday state
  const [showBirthday, setShowBirthday] = useState(false);
  const [employeeName, setEmployeeName] = useState("");

  const email = localStorage.getItem("username"); // or "userEmail" if stored differently
  const API_KEY = process.env.REACT_APP_API_KEY;

  // Get employeeId from dashboardData stored in localStorage (for headers if needed)
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  // Headers to send with API call
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  useEffect(() => {
    // const fetchBirthday = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_BACKEND_URL}/api/employee/birthday/${email}`,
    //       { headers }
    //     );

    //     const { full_name, dob } = response.data;

    //     if (isBirthdayToday(dob)) {
    //       setEmployeeName(full_name);
    //       setShowBirthday(true);
    //       setTimeout(() => {
    //         setShowBirthday(false);
    //       }, 18000); // Show for 4 seconds
    //     }
    //   } catch (error) {
    //     console.error("Error fetching birthday:", error);
    //   }
    // };

    const fetchBirthday = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/employee/birthday/${email}`,
      { headers }
    );

    console.log("🎂 Birthday API Response:", response.data);

    const { full_name, first_name, dob } = response.data;

    // Use first_name or full_name if available
    const nameToUse = full_name || first_name || "there";

    if (isBirthdayToday(dob)) {
      setEmployeeName(nameToUse);
      setShowBirthday(true);
      setTimeout(() => {
        setShowBirthday(false);
      }, 25000); // Show for 18 seconds
    }
  } catch (error) {
    console.error("❌ Error fetching birthday:", error);
  }
};


    if (email) {
      fetchBirthday();
    }
  }, [email]);

  const renderContent = () => {
    return (
      <div className="content-container-design">
        <div>{activeContent}</div>
      </div>
    );
  };

  return (
    <div className="Dashboard123">
      <div className="Dashboarddesign">
        <div className="dashboard">
          {/* 🎉 Show Birthday Card if it's today */}
          {showBirthday && <BirthdayCard name={employeeName} />}

          {/* Topbar at the top */}
          <Topbar />

          {/* Content container: Sidebar on the left, Main Content on the right */}
          <div className="content-container">
            <Sidebar setActiveContent={setActiveContent} />
            <div className="main-content">{renderContent() /* Dynamic content rendered here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

