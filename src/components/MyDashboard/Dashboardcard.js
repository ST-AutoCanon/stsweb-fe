
import React, { useEffect, useState } from "react";
import { IoBagSharp } from "react-icons/io5";
import { GrMoney } from "react-icons/gr";
import { GiWallet } from "react-icons/gi";
import "./Dashboardcard.css";

// Icon mapping
const iconMapping = {
  GiWallet: <GiWallet />,
  IoBagSharp: <IoBagSharp />,
  GrMoney: <GrMoney />,
};

const Dashboardcard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrollData, setPayrollData] = useState({});
  const [reimbursementData, setReimbursementData] = useState({ totalApprovedReimbursement: "0.00" });

  const API_KEY = process.env.REACT_APP_API_KEY;
  const authToken = localStorage.getItem("authToken");

  // Fetch previous month's salary data
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/salary/last-month-total`, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        console.log("Last Month Salary Data:", jsonData);

        setPayrollData({ total_previous_month_salary: jsonData.total_salary || "0.00" });
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [authToken, API_KEY]);

  // Fetch previous month's approved reimbursement data
  useEffect(() => {
    const fetchReimbursementData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/approved-reimbursement-last-month`, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const jsonData = await response.json();
        console.log("Last Month Reimbursement Data:", jsonData);

        setReimbursementData({ totalApprovedReimbursement: jsonData.totalApprovedReimbursement || "0.00" });
      } catch (err) {
        console.error("Error fetching reimbursement data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursementData();
  }, [authToken, API_KEY]);

  useEffect(() => {
    setCards([
      { label: "Previous Month Credit", icon: "GiWallet", value: "0.00" },
      { label: "Previous Month Reimbursement (Approved)", icon: "IoBagSharp", value: "0.00" },
      { label: "Previous Month Salary", icon: "GrMoney", value: "0.00" },
    ]);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-card-containers">
      {cards.map((item, index) => (
        <div className="card" key={index}>
          <div className="icon">
            {iconMapping[item.icon] || <img src={item.icon} alt={item.label} className="custom-icon" />}
          </div>
          <div className="content">
            <div className="label">{item.label}</div>
            <div className="value">
              {item.label === "Previous Month Credit"
                ? "Coming soon!"
                : item.label === "Previous Month Reimbursement (Approved)"
                ? reimbursementData.totalApprovedReimbursement || "0.00"
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
