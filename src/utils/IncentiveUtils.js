import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const API_KEY = process.env.REACT_APP_API_KEY || "";

const employeeData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
const meId = employeeData?.employeeId;

const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ym = `${year}-${month}`;
  return ym;
};

const fetchEmployeeCTC = async (employeeId) => {
  try {
    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const response = await axios.get(`${BASE_URL}/api/compensation/assigned`, {
      withCredentials: true,
      headers,
    });

    const employee = response.data.data.find(
      (emp) => emp.employee_id.toUpperCase() === employeeId.toUpperCase()
    );

    if (!employee || !employee.ctc) {
      console.warn(`❌ No CTC found for ${employeeId}`);
      return 0;
    }

    const ctcAmount = parseFloat(employee.ctc);
    return ctcAmount;
  } catch (error) {
    console.error(`❌ Error fetching CTC for ${employeeId}:`, error);
    return 0;
  }
};

const fetchIncentiveData = async () => {
  try {
    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const response = await axios.get(`${BASE_URL}/api/incentives`, {
      withCredentials: true,
      headers,
    });
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching incentives:", error);
    return [];
  }
};

export const calculateIncentives = async (employeeId) => {
  try {
    const [ctcAmount, allIncentives] = await Promise.all([
      fetchEmployeeCTC(employeeId),
      fetchIncentiveData(),
    ]);

    const currentYm = getCurrentYearMonth();

    const currentMonthIncentives = allIncentives.filter(
      (inc) => inc.employee_id?.toUpperCase() === employeeId.toUpperCase()
    );

    let incentivesArr = [];
    let totalIncentiveValue = 0;

    currentMonthIncentives.forEach((inc) => {
      let value = 0;
      if (inc.incentive_type === "ctc") {
        value = (ctcAmount * parseFloat(inc.ctc_percentage || 0)) / 100;
      } else if (inc.incentive_type === "sales") {
        value = parseFloat(inc.sales_amount || 0);
      }
      totalIncentiveValue += value;

      incentivesArr.push({
        applicable_month: inc.applicable_month,
        incentive_type: inc.incentive_type,
        value,
        ctc_percentage: inc.ctc_percentage,
        sales_amount: inc.sales_amount,
      });
    });

    return {
      totalIncentive: {
        value: totalIncentiveValue.toFixed(2),
        currency: "INR",
      },
      incentives: incentivesArr,
    };
  } catch (error) {
    console.error(error);
    return {
      totalIncentive: { value: "0.00", currency: "INR" },
      incentives: [],
    };
  }
};
