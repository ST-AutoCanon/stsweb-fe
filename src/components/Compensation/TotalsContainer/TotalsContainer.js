
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import {
  calculateSalaryDetails,
  parseWorkDate,
} from "../../../utils/SalaryCalculations.js"; // Adjust path if needed
import { calculateLOPEffect } from "../../../utils/lopCalculations.js"; // Adjust path if needed
import { calculateIncentives } from "../../../utils/IncentiveUtils.js"; // Adjust path if needed

const TotalsContainer = () => {
  const [totals, setTotals] = useState({
    totalPayable: 0,
    totalGross: 0,
    totalTDS: 0,
    totalAdvance: 0,
    totalOvertime: 0,
    totalBonus: 0,
    totalEmployeePF: 0,
    totalEmployerPF: 0,
    totalInsurance: 0,
    totalLopDeduction: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  useEffect(() => {
    const fetchTotalsData = async () => {
      console.log("Environment Variables:", {
        API_KEY: process.env.REACT_APP_API_KEY,
        BASE_URL: process.env.REACT_APP_BACKEND_URL,
        meId,
      });

      if (!process.env.REACT_APP_API_KEY || !meId) {
        console.error("Missing credentials: API_KEY or meId");
        setIsLoading(false);
        return;
      }

      const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
      console.log("Fetching data with headers:", headers);

      try {
        setIsLoading(true);
        const [
          compensationsRes,
          employeesRes,
          advancesRes,
          overtimeRes,
          bonusRes,
        ] = await Promise.all([
          axios.get(`${BASE_URL}/api/compensations/list`, { headers }).catch(err => {
            console.error("Error fetching compensations/list:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/assigned`, { headers }).catch(err => {
            console.error("Error fetching compensation/assigned:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/advance-details`, { headers }).catch(err => {
            console.error("Error fetching compensation/advance-details:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/overtime-status-summary`, { headers }).catch(err => {
            console.error("Error fetching compensation/overtime-status-summary:", err);
            throw err;
          }),
          axios.get(`${BASE_URL}/api/compensation/bonus-list`, { headers }).catch(err => {
            console.error("Error fetching compensation/bonus-list:", err);
            throw err;
          }),
        ]);

        console.log("API Responses:", {
          compensations: compensationsRes.data,
          employees: employeesRes.data,
          advances: advancesRes.data,
          overtime: overtimeRes.data,
          bonus: bonusRes.data,
        });

        const compensationMap = new Map();
        (compensationsRes.data.data || []).forEach((comp) => {
          compensationMap.set(comp.compensation_plan_name, comp.plan_data);
        });

        const enrichedEmployeesMap = new Map();
        (employeesRes.data.data || []).forEach((emp) => {
          if (!enrichedEmployeesMap.has(emp.employee_id)) {
            enrichedEmployeesMap.set(emp.employee_id, {
              ...emp,
              plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
            });
          } else {
            console.warn(`Duplicate employee_id found: ${emp.employee_id}`);
          }
        });
        const enrichedEmployees = Array.from(enrichedEmployeesMap.values());

        const advances = advancesRes.data.data || [];
        const overtimeRecords = overtimeRes.data.data || [];
        const bonusRecords = bonusRes.data.data || [];

        const lopDataPromises = enrichedEmployees.map((emp) =>
          calculateLOPEffect(emp.employee_id)
            .then((result) => ({
              employeeId: emp.employee_id,
              lopData: result,
            }))
            .catch((err) => {
              console.warn(`LOP fetch failed for ${emp.employee_id}:`, err);
              return {
                employeeId: emp.employee_id,
                lopData: {
                  currentMonth: { days: 0, value: "0.00", currency: "INR" },
                  deferred: { days: 0, value: "0.00", currency: "INR" },
                  nextMonth: { days: 0, value: "0.00", currency: "INR" },
                  yearly: { days: 0, value: "0.00", currency: "INR" },
                },
              };
            })
        );

        const lopDataResults = await Promise.all(lopDataPromises);
        const lopDataMap = lopDataResults.reduce((acc, { employeeId, lopData }) => {
          acc[employeeId] = lopData;
          return acc;
        }, {});

        const incentiveDataPromises = enrichedEmployees.map((emp) =>
          calculateIncentives(emp.employee_id)
            .then((result) => ({
              employeeId: emp.employee_id,
              incentiveData: result,
            }))
            .catch((err) => {
              console.warn(`Incentive fetch failed for ${emp.employee_id}:`, err);
              return {
                employeeId: emp.employee_id,
                incentiveData: {
                  ctcIncentive: { value: "0.00", currency: "INR" },
                  salesIncentive: { value: "0.00", currency: "INR" },
                  totalIncentive: { value: "0.00", currency: "INR" },
                },
              };
            })
        );

        const incentiveDataResults = await Promise.all(incentiveDataPromises);
        const incentiveDataMap = incentiveDataResults.reduce(
          (acc, { employeeId, incentiveData }) => {
            const key = String(employeeId).toUpperCase();
            if (!acc[key] || parseFloat(incentiveData.totalIncentive.value) > 0) {
              acc[key] = incentiveData;
            }
            return acc;
          },
          {}
        );

        // Compute totals
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthNum = currentDate.getMonth() + 1;
        const currentMonthStr = String(currentMonthNum).padStart(2, '0');
        const currentYm = `${currentYear}-${currentMonthStr}`;
        const lastMonthIndex = currentMonthNum - 2;
        const startWorkDate = new Date(currentYear, lastMonthIndex, 25);
        const endWorkDate = new Date(currentYear, currentMonthNum - 1, 25);

        let totalGross = 0;
        let totalPayable = 0;
        let totalTDS = 0;
        let totalAdvance = 0;
        let totalOvertime = 0;
        let totalBonus = 0;
        let totalEmployeePF = 0;
        let totalEmployerPF = 0;
        let totalInsurance = 0;
        let totalLopDeduction = 0;

        enrichedEmployees.forEach((emp) => {
          const salaryDetails = calculateSalaryDetails(
            emp.ctc,
            emp.plan_data,
            emp.employee_id,
            overtimeRecords || [],
            bonusRecords || [],
            advances || [],
            incentiveDataMap || {},
            lopDataMap
          );
          const lopData =
            lopDataMap && emp.employee_id ? lopDataMap[emp.employee_id] || {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            } : {
              currentMonth: { days: 0, value: '0.00', currency: 'INR' },
              deferred: { days: 0, value: '0.00', currency: 'INR' },
              nextMonth: { days: 0, value: '0.00', currency: 'INR' },
              yearly: { days: 0, value: '0.00', currency: 'INR' },
            };

          const lopDays = lopData.yearly ? lopData.yearly.days : 0;
          const lopDeduction = parseFloat(lopData.yearly ? lopData.yearly.value : '0');

          // Calculate incentive for this employee
          const empId = String(emp.employee_id).toUpperCase();
          const incentiveObj = incentiveDataMap[empId];
          let incentiveValue = 0;
          if (incentiveObj && incentiveObj.incentives) {
            const currentMonthIncentives = incentiveObj.incentives.filter((inc) => inc.applicable_month === currentYm);
            incentiveValue = currentMonthIncentives.reduce((sum, inc) => sum + parseFloat(inc.value || 0), 0);
          }

          // Calculate overtime for this employee
          const employeeOvertime = overtimeRecords.filter((ot) => {
            const workDate = parseWorkDate(ot.work_date);
            const createdDate = parseWorkDate(ot.created_at);
            return (
              ot.employee_id === emp.employee_id &&
              ot.status === 'Approved' &&
              workDate &&
              workDate >= startWorkDate &&
              workDate <= endWorkDate &&
              createdDate &&
              createdDate.getFullYear() === currentYear &&
              String(createdDate.getMonth() + 1).padStart(2, '0') === currentMonthStr
            );
          });

          let totalOvertimePay = 0;
          if (employeeOvertime.length > 0) {
            totalOvertimePay = employeeOvertime.reduce((sum, ot) => {
              const hours = parseFloat(ot.extra_hours);
              let rate = parseFloat(ot.rate);
              if (isNaN(rate) || rate <= 0) {
                if (
                  emp.plan_data.isOvertimePay &&
                  emp.plan_data.overtimePayAmount &&
                  !isNaN(parseFloat(emp.plan_data.overtimePayAmount))
                ) {
                  rate = parseFloat(emp.plan_data.overtimePayAmount);
                } else {
                  rate = 500; // Fallback default rate
                }
              }
              return isNaN(hours) || hours <= 0 ? sum : sum + (hours * rate);
            }, 0);
          }

          // Compute gross and net
          const basicSalary = salaryDetails ? parseFloat(salaryDetails.basicSalary) : 0;
          const hra = salaryDetails ? parseFloat(salaryDetails.hra) : 0;
          const ltaAllowance = salaryDetails ? parseFloat(salaryDetails.ltaAllowance) : 0;
          const otherAllowances = salaryDetails ? parseFloat(salaryDetails.otherAllowances) : 0;
          const statutoryBonus = salaryDetails ? parseFloat(salaryDetails.statutoryBonus) : 0;
          const recordBonusPay = salaryDetails ? parseFloat(salaryDetails.recordBonusPay) : 0;
          const grossSalary = basicSalary + hra + ltaAllowance + otherAllowances + statutoryBonus + recordBonusPay + incentiveValue + totalOvertimePay;

          const advanceRecovery = salaryDetails ? parseFloat(salaryDetails.advanceRecovery) : 0;
          const employeePF = salaryDetails ? parseFloat(salaryDetails.employeePF) : 0;
          const esic = salaryDetails ? parseFloat(salaryDetails.esic) : 0;
          const gratuity = salaryDetails ? parseFloat(salaryDetails.gratuity) : 0;
          const professionalTax = salaryDetails ? parseFloat(salaryDetails.professionalTax) : 0;
          const tds = salaryDetails ? parseFloat(salaryDetails.tds) : 0;
          const insurance = salaryDetails ? parseFloat(salaryDetails.insurance) : 0;
          const totalDeductions = advanceRecovery + employeePF + esic + gratuity + professionalTax + tds + insurance + lopDeduction;
          const netSalary = grossSalary - totalDeductions;

          // Accumulate totals
          totalGross += grossSalary;
          totalPayable += netSalary;
          totalTDS += tds;
          totalAdvance += advanceRecovery;
          totalOvertime += totalOvertimePay;
          totalBonus += recordBonusPay;
          totalEmployeePF += employeePF;
          totalEmployerPF += salaryDetails ? parseFloat(salaryDetails.employerPF) : 0;
          totalInsurance += insurance;
          totalLopDeduction += lopDeduction;
        });

        setTotals({
          totalPayable,
          totalGross,
          totalTDS,
          totalAdvance,
          totalOvertime,
          totalBonus,
          totalEmployeePF,
          totalEmployerPF,
          totalInsurance,
          totalLopDeduction,
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalsData();
  }, []);

  if (isLoading) {
    return <div className="sb-loading">Loading totals...</div>;
  }

  return (
    <div className="sb-totals-container">
      <h2 className="sb-totals-total-payroll">
        Total Payroll: ₹{(totals.totalPayable).toLocaleString()}
      </h2>
      <div className="sb-totals-grid">
        <div className="sb-totals-card sb-payable">
          <FaMoneyBillWave className="sb-totals-card-icon" />
          <div>
            <span className="sb-totals-card-title">Total Payable</span>
            <span className="sb-totals-card-value">
              ₹{totals.totalPayable.toLocaleString()}
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
            <span className="sb-totals-card-value">₹{totals.totalLopDeduction.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalsContainer;