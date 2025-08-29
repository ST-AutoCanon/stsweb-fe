import React from "react";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaMoneyCheckAlt,
  FaHandHoldingUsd,
  FaClock,
  FaGift,
  FaShieldAlt,
  FaBriefcase,
  FaStethoscope,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./TotalsContainer.css";

const TotalsContainer = ({ totals, totalLopDeduction }) => {
  return (
    <div className="sb-totals-container">
      <h2 className="sb-totals-total-payroll">
        Total Payroll: ₹{(totals.totalPayable - totalLopDeduction).toLocaleString()}
      </h2>
      <div className="sb-totals-grid">
        <div className="sb-totals-card sb-payable">
          <FaMoneyBillWave className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Payable</span>
            <span className="sb-totals-card-value">
              ₹{(totals.totalPayable - totalLopDeduction).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="sb-totals-card sb-gross">
          <FaChartLine className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Gross</span>
            <span className="sb-totals-card-value">₹{totals.totalGross.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-tds">
          <FaMoneyCheckAlt className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total TDS</span>
            <span className="sb-totals-card-value">₹{totals.totalTDS.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-advance">
          <FaHandHoldingUsd className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Advance</span>
            <span className="sb-totals-card-value">₹{totals.totalAdvance.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-overtime">
          <FaClock className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Overtime</span>
            <span className="sb-totals-card-value">₹{totals.totalOvertime.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-bonus">
          <FaGift className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Bonus</span>
            <span className="sb-totals-card-value">₹{totals.totalBonus.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-pf-employee">
          <FaShieldAlt className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total PF Employee</span>
            <span className="sb-totals-card-value">₹{totals.totalEmployeePF.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-pf-employer">
          <FaBriefcase className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total PF Employer</span>
            <span className="sb-totals-card-value">₹{totals.totalEmployerPF.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-insurance">
          <FaStethoscope className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Insurance</span>
            <span className="sb-totals-card-value">₹{totals.totalInsurance.toLocaleString()}</span>
          </div>
        </div>
        <div className="sb-totals-card sb-lop">
          <FaExclamationTriangle className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total LOP Deduction</span>
            <span className="sb-totals-card-value">₹{totalLopDeduction.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsContainer;