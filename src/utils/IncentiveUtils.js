import axios from "axios";

// 🔹 Base URL and API key from .env
const BASE_URL = process.env.REACT_APP_BACKEND_URL ;
const API_KEY = process.env.REACT_APP_API_KEY || "";

// 🔹 Logged-in employee ID from localStorage
const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}")?.employeeId || "";

/**
 * Utility: Get current Year-Month in YYYY-MM format
 */
const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ym = `${year}-${month}`;
  console.log("🗓 Current Year-Month:", ym);
  return ym;
};

/**
 * Fetch employee CTC from backend
 */
const fetchEmployeeCTC = async (employeeId) => {
  try {
    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const response = await axios.get(`${BASE_URL}/api/compensation/assigned`, { headers });

    const employee = response.data.data.find(
      (emp) => emp.employee_id.toUpperCase() === employeeId.toUpperCase()
    );

    if (!employee || !employee.ctc) {
      console.warn(`❌ No CTC found for ${employeeId}`);
      return 0;
    }

    const ctcAmount = parseFloat(employee.ctc);
    console.log(`💰 CTC for ${employeeId}:`, ctcAmount);
    return ctcAmount;
  } catch (error) {
    console.error(`❌ Error fetching CTC for ${employeeId}:`, error);
    return 0;
  }
};

/**
 * Fetch incentive data from backend
 */
const fetchIncentiveData = async () => {
  try {
    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const response = await axios.get(`${BASE_URL}/api/incentives`, { headers });
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching incentives:", error);
    return [];
  }
};

/**
 * Calculate incentives for a specific employee
 */
export const calculateIncentives = async (employeeId) => {
  try {
    console.log("🚀 Starting incentive calculation for:", employeeId);

    const [ctcAmount, allIncentives] = await Promise.all([
      fetchEmployeeCTC(employeeId),
      fetchIncentiveData()
    ]);

    const currentYm = getCurrentYearMonth();

    // Filter incentives for employee and current month
    const currentMonthIncentives = allIncentives.filter(
      (inc) =>
        inc.employee_id?.toUpperCase() === employeeId.toUpperCase() &&
        inc.applicable_month === currentYm
    );

    let ctcIncentiveValue = 0;
    let salesIncentiveValue = 0;

    currentMonthIncentives.forEach((inc) => {
      if (inc.incentive_type === "ctc") {
        const percent = parseFloat(inc.ctc_percentage || 0);
        const value = (ctcAmount * percent) / 100;
        ctcIncentiveValue += value;
        console.log(`📊 CTC incentive added: ${value} (percentage: ${percent}%)`);
      } else if (inc.incentive_type === "sales") {
        const value = parseFloat(inc.sales_amount || 0);
        salesIncentiveValue += value;
        console.log(`📊 Sales incentive added: ${value}`);
      }
    });

    const result = {
      ctcIncentive: { value: ctcIncentiveValue.toFixed(2), currency: "INR" },
      salesIncentive: { value: salesIncentiveValue.toFixed(2), currency: "INR" },
      totalIncentive: { value: (ctcIncentiveValue + salesIncentiveValue).toFixed(2), currency: "INR" },
    };

    console.log(`✅ Final Incentives for ${employeeId}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error calculating incentives for ${employeeId}:`, error);
    return {
      ctcIncentive: { value: "0.00", currency: "INR" },
      salesIncentive: { value: "0.00", currency: "INR" },
      totalIncentive: { value: "0.00", currency: "INR" },
    };
  }
};
