
// export default Dashboardcard;
import React, { useEffect, useState } from "react";
import { IoBagSharp } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";
import { GiWallet } from "react-icons/gi"; // Import GiWallet
import "./Dashboardcard.css";

// Updated icon mapping
const iconMapping = {
  FaUserGroup: <GrMoney />,
  IoBagSharp: <IoBagSharp />,
  GiWallet: <GiWallet />, // Replacing middle card icon with GiWallet
};

const Dashboardcard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrollData, setPayrollData] = useState({});
  const [employeeId, setEmployeeId] = useState("12345"); // Replace with dynamic employee ID if needed

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        if (!authToken || !API_KEY) {
          throw new Error("Authorization token or API Key missing.");
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/total-payroll-data`, {
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
        console.log("Total Payroll Data:", jsonData);

        // Set the payroll data received from the backend
        setPayrollData(jsonData.message);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [authToken, API_KEY]);

  useEffect(() => {
    // Simulate the fetching of card data (this could be adjusted as needed)
    const fetchCardData = async () => {
      try {
        // Replace with dynamic card data fetch if necessary
        setCards([
          { label: "Previous Month Credit", icon: "GiWallet", value: "0" },
          { label: "Previous Month Expenses", icon: "IoBagSharp", value: "0" },
          { label: "Previous Month Salary", icon: "FaUserGroup", value: "0" },
        ]);
      } catch (err) {
        console.error("Error fetching card data:", err);
        setError(err.message);
      }
    };

    fetchCardData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-card-containers">
      {cards.map((item, index) => (
        <div className="card" key={index}>
          <div className="icon">
            {iconMapping[item.icon] ? (
              iconMapping[item.icon]
            ) : (
              <img src={item.icon} alt={item.label} className="custom-icon" />
            )}
          </div>
          <div className="content">
            <div className="label">{item.label}</div>
            <div className="value">
              {item.label === "Previous Month Credit"
                ? payrollData.total_previous_month_credit || "0.00"
                : item.label === "Previous Month Expenses"
                ? payrollData.total_previous_month_expenses || "0.00"
                : item.label === "Previous Month Salary"
                ? payrollData.total_previous_month_salary || "0.00"
                : item.value}
            </div>
          </div>
        </div>
      ))}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Dashboardcard;
