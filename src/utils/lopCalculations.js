import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const employeeData = JSON.parse(localStorage.getItem("dashboardData") || "{}");
const meId = employeeData?.employeeId;

const fetchLOPData = async (employeeId) => {
  try {
    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const [currentMonthResponse, deferredResponse, nextMonthResponse] =
      await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/lop/current-month-lop`,
          { withCredentials: true, headers }
        ),
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/api/lop/deferred-lop`, {
            withCredentials: true,
            headers,
          })
          .catch(() => ({ data: { data: [] } })),
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/api/lop/next-month-lop`, {
            withCredentials: true,
            headers,
          })
          .catch(() => ({ data: { data: [] } })),
      ]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    const currentMonthLOP = currentMonthResponse.data.data.filter(
      (lop) =>
        lop.employee_id.toUpperCase() === employeeId.toUpperCase() &&
        parseInt(lop.month) === currentMonth &&
        parseInt(lop.year) === currentYear
    );

    const yearlyLOP = currentMonthResponse.data.data.filter(
      (lop) =>
        lop.employee_id.toUpperCase() === employeeId.toUpperCase() &&
        parseInt(lop.year) === currentYear
    );

    const deferredLOP = deferredResponse.data.data.filter(
      (lop) => lop.employee_id.toUpperCase() === employeeId.toUpperCase()
    );

    const nextMonthLOP = nextMonthResponse.data.data.filter(
      (lop) => lop.employee_id.toUpperCase() === employeeId.toUpperCase()
    );

    return { currentMonthLOP, yearlyLOP, deferredLOP, nextMonthLOP };
  } catch (error) {
    console.error(`Error fetching LOP data for ${employeeId}:`, error);
    throw error;
  }
};

export const calculateLOPEffect = async (employeeId) => {
  try {
    const { currentMonthLOP, yearlyLOP, deferredLOP, nextMonthLOP } =
      await fetchLOPData(employeeId);

    const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
    const [employeeResponse, workingDaysResponse] = await Promise.all([
      axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
        { withCredentials: true, headers }
      ),
      axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/compensation/working-days`,
        { withCredentials: true, headers }
      ),
    ]);

    const employee = employeeResponse.data.data.find(
      (emp) => emp.employee_id.toUpperCase() === employeeId.toUpperCase()
    );
    const workingDays = workingDaysResponse.data.success
      ? parseInt(workingDaysResponse.data.data.totalWorkingDays)
      : 22;

    if (!employee || !employee.ctc) {
      console.warn(`No valid employee or CTC found for ${employeeId}`);
      return {
        currentMonth: { days: 0, value: "0.00", currency: "INR" },
        deferred: { days: 0, value: "0.00", currency: "INR" },
        nextMonth: { days: 0, value: "0.00", currency: "INR" },
        yearly: { days: 0, value: "0.00", currency: "INR" },
      };
    }

    const monthlyCTC = parseFloat(employee.ctc) / 12;
    const lopPerDay = monthlyCTC / workingDays;

    const currentMonth =
      currentMonthLOP.length > 0
        ? {
            days: parseInt(currentMonthLOP[0].total_lop || 0),
            value: (
              parseInt(currentMonthLOP[0].total_lop || 0) * lopPerDay
            ).toFixed(2),
            currency: "INR",
          }
        : { days: 0, value: "0.00", currency: "INR" };

    const deferred =
      deferredLOP.length > 0
        ? {
            days: parseInt(deferredLOP[0].total_lop || 0),
            value: (
              parseInt(deferredLOP[0].total_lop || 0) * lopPerDay
            ).toFixed(2),
            currency: "INR",
          }
        : { days: 0, value: "0.00", currency: "INR" };

    const nextMonth =
      nextMonthLOP.length > 0
        ? {
            days: parseInt(nextMonthLOP[0].total_lop || 0),
            value: (
              parseInt(nextMonthLOP[0].total_lop || 0) * lopPerDay
            ).toFixed(2),
            currency: "INR",
          }
        : { days: 0, value: "0.00", currency: "INR" };

    const yearlyDays = yearlyLOP.reduce(
      (sum, lop) => sum + parseInt(lop.total_lop || 0),
      0
    );
    const yearly = {
      days: yearlyDays,
      value: (yearlyDays * lopPerDay).toFixed(2),
      currency: "INR",
    };

    const result = { currentMonth, deferred, nextMonth, yearly };
    return result;
  } catch (error) {
    console.error(`Error in calculateLOPEffect for ${employeeId}:`, error);
    return {
      currentMonth: { days: 0, value: "0.00", currency: "INR" },
      deferred: { days: 0, value: "0.00", currency: "INR" },
      nextMonth: { days: 0, value: "0.00", currency: "INR" },
      yearly: { days: 0, value: "0.00", currency: "INR" },
    };
  }
};
