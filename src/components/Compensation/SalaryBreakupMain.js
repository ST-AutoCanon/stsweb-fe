


import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import Header from "./Header/Header.js";
import TotalsContainer from "./TotalsContainer/TotalsContainer.js";
import EmployeeTable from "./EmployeeTable/EmployeeTable.js";
import AllDetailsView from "./AllDetailsView/AllDetailsView.js";
import NoPlanDetails from "./NoPlanDetails/NoPlanDetails.js";
import BonusModal from "./BonusModal/BonusModal.js";
import AdvanceModal from "./AdvanceModal/AdvanceModal.js";
import AssignModal from "./AssignModal/AssignModal.js";
import MessageModal from "../Modal/Modal";
import "./SalaryBreakupMain.css";
import {
  calculateSalaryDetails,
  calculateTotals,
  getMonthlySalary,
  parseApplicableMonth,
} from "../../utils/SalaryCalculations.js";
import { calculateLOPEffect } from "../../utils/lopCalculations.js";

const SalaryBreakupMain = () => {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [bonusRecords, setBonusRecords] = useState([]);
  const [employeeLopData, setEmployeeLopData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("yearly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bonusModal, setBonusModal] = useState({
    isVisible: false,
    percentageCtc: "",
    monthlySalaryCount: "",
    fixedAmount: "",
    selectedMonth: "",
    selectedYear: new Date().getFullYear().toString(),
    selectedOption: "",
    error: "",
  });
  const [advanceModal, setAdvanceModal] = useState({
    isVisible: false,
    employeeId: null,
    fullName: "",
    advanceAmount: "",
    recoveryMonths: "",
    applicableMonth: "",
    error: "",
    threeMonthsSalary: 0, // Initialize for AdvanceModal
  });
  const [messageModal, setMessageModal] = useState({
    isVisible: false,
    title: "",
    message: "",
    isError: false,
  });
  const [assignModal, setAssignModal] = useState({
    isVisible: false,
    employeeId: null,
    fullName: "",
    compensationList: [],
    selectedCompensation: "",
    error: "",
  });
  const [viewMode, setViewMode] = useState("main"); // Reverted to "main"
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsTab, setShowDetailsTab] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef(null);
  const rowsPerPage = 7;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const openBonusModal = () => {
    setBonusModal({
      isVisible: true,
      percentageCtc: "",
      monthlySalaryCount: "",
      fixedAmount: "",
      selectedMonth: "",
      selectedYear: new Date().getFullYear().toString(),
      selectedOption: "",
      error: "",
    });
    setMenuOpen(false);
  };

  const openAdvanceModal = (employeeId, fullName) => {
    const monthlySalary = getMonthlySalary(employeeId, employees);
    const threeMonthsSalary = monthlySalary * 3;
    setAdvanceModal({
      isVisible: true,
      employeeId,
      fullName,
      advanceAmount: "",
      recoveryMonths: "",
      applicableMonth: "",
      error: "",
      threeMonthsSalary,
    });
  };

  const openNoPlanModal = () => {
    setViewMode("noPlanDetails");
    setSearchTerm("");
    setMenuOpen(false);
  };

  const openMessageModal = (title, message, isError = false) => {
    setMessageModal({
      isVisible: true,
      title,
      message,
      isError,
    });
  };

  const openAssignModal = async (employeeId, fullName) => {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`;
      const response = await axios.get(url, {
        headers: { "x-api-key": API_KEY, "x-employee-id": meId },
      });
      if (response.data.success) {
        const validCompensations = Array.isArray(response.data.data)
          ? response.data.data.filter(
              (comp) =>
                comp &&
                typeof comp.compensation_plan_name === "string" &&
                comp.id &&
                !isNaN(parseInt(comp.id))
            )
          : [];
        if (validCompensations.length === 0) {
          throw new Error("No valid compensation plans available to assign.");
        }
        setAssignModal({
          isVisible: true,
          employeeId,
          fullName,
          compensationList: validCompensations,
          selectedCompensation: "",
          error: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch compensations");
      }
    } catch (error) {
      openMessageModal(
        "Error",
        `Failed to fetch compensations: ${error.message || "Network error"}`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllDetails = () => {
    setViewMode("allDetails");
    setSearchQuery("");
    setCurrentPage(1);
    setMenuOpen(false);
  };

  const handleViewSingleEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsTab(true);
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  };

  const handleCloseDetailsTab = () => {
    setShowDetailsTab(false);
    setSelectedEmployee(null);
  };

  const handleBackToMain = () => {
    setViewMode("main");
    setSelectedEmployee(null);
    setSearchQuery("");
    setCurrentPage(1);
    setShowDetailsTab(false);
    setSearchTerm("");
  };

  const handleBonusSubmit = async () => {
    const {
      percentageCtc,
      monthlySalaryCount,
      fixedAmount,
      selectedMonth,
      selectedYear,
      selectedOption,
    } = bonusModal;
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    if (!selectedOption) {
      setBonusModal({ ...bonusModal, error: "Please select one bonus option." });
      return;
    }
    if (
      selectedOption === "percentageCtc" &&
      (!percentageCtc || parseFloat(percentageCtc) <= 0 || parseFloat(percentageCtc) > 100)
    ) {
      setBonusModal({ ...bonusModal, error: "Please enter a valid CTC percentage (0-100)." });
      return;
    }
    if (
      selectedOption === "monthlySalaryCount" &&
      (!monthlySalaryCount || parseInt(monthlySalaryCount) < 1 || parseInt(monthlySalaryCount) > 10)
    ) {
      setBonusModal({
        ...bonusModal,
        error: "Please select a valid number of monthly salaries (1-10).",
      });
      return;
    }
    if (
      selectedOption === "fixedAmount" &&
      (!fixedAmount || parseFloat(fixedAmount) <= 0)
    ) {
      setBonusModal({
        ...bonusModal,
        error: "Please enter a valid fixed amount greater than 0.",
      });
      return;
    }
    if (!selectedMonth || !months.includes(selectedMonth)) {
      setBonusModal({ ...bonusModal, error: "Please select a valid month." });
      return;
    }
    if (!selectedYear || !/^\d{4}$/.test(selectedYear)) {
      setBonusModal({ ...bonusModal, error: "Please enter a valid year." });
      return;
    }
    const applicableMonth = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
    const payload = {
      percentageCtc: selectedOption === "percentageCtc" ? parseFloat(percentageCtc) : null,
      percentageMonthlySalary: selectedOption === "monthlySalaryCount" ? parseFloat(monthlySalaryCount) * 100 : null,
      fixedAmount: selectedOption === "fixedAmount" ? parseFloat(fixedAmount) : null,
      applicableMonth,
    };
    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/add-bonus-bulk`;
      const response = await axios.post(url, payload, {
        headers: {
          "x-api-key": API_KEY,
          "x-employee-id": meId,
        },
      });
      if (response.data.success) {
        openMessageModal(
          "Success",
          `Bonus successfully added for ${selectedMonth} ${selectedYear}.`
        );
        const bonusResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensation/bonus-list`,
          {
            headers: {
              "x-api-key": API_KEY,
              "x-employee-id": meId,
            },
          }
        );
        if (bonusResponse.data.success) {
          setBonusRecords(bonusResponse.data.data || []);
        }
        setBonusModal({ ...bonusModal, isVisible: false });
      } else {
        setBonusModal({
          ...bonusModal,
          error: response.data.error || "Failed to add bonus",
        });
      }
    } catch (error) {
      setBonusModal({
        ...bonusModal,
        error: error.response?.data?.error || error.message || "Network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvanceSubmit = async () => {
    const { advanceAmount, recoveryMonths, employeeId, applicableMonth } = advanceModal;
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
      setAdvanceModal({
        ...advanceModal,
        error: "Please enter a valid advance amount greater than 0.",
      });
      return;
    }
    if (!recoveryMonths || parseInt(recoveryMonths) <= 0) {
      setAdvanceModal({
        ...advanceModal,
        error: "Please enter a valid number of iterations (greater than 0).",
      });
      return;
    }
    if (!applicableMonth) {
      setAdvanceModal({ ...advanceModal, error: "Please select an applicable month." });
      return;
    }
    const monthlySalary = getMonthlySalary(employeeId, employees);
    const threeMonthsSalary = monthlySalary * 3;
    if (parseFloat(advanceAmount) > threeMonthsSalary) {
      setAdvanceModal({
        ...advanceModal,
        error: `Advance amount (₹${parseFloat(advanceAmount).toLocaleString()}) cannot exceed three months' salary (₹${threeMonthsSalary.toLocaleString()}).`,
      });
      return;
    }
    const [year, month] = applicableMonth.split("-").map(Number);
    const existingAdvances = advances.filter((adv) => {
      if (!adv.applicable_months) return false;
      const advDate = parseApplicableMonth(adv.applicable_months);
      if (!advDate) return false;
      const advYear = advDate.getFullYear();
      const advMonth = advDate.getMonth() + 1;
      const recoveryMonths = parseInt(adv.recovery_months);
      const startMonth = advMonth;
      const startYear = advYear;
      let endYear = startYear;
      let endMonth = startMonth + recoveryMonths - 1;
      if (endMonth > 12) {
        endYear += Math.floor((endMonth - 1) / 12);
        endMonth = ((endMonth - 1) % 12) + 1;
      }
      const inputDate = new Date(year, month - 1);
      const startDate = new Date(startYear, startMonth - 1);
      const endDate = new Date(endYear, endMonth - 1);
      return (
        adv.employee_id === employeeId &&
        (adv.applicable_months === applicableMonth ||
          (inputDate >= startDate && inputDate <= endDate))
      );
    });
    if (existingAdvances.length > 0) {
      const activeAdvance = existingAdvances[0];
      const advDate = parseApplicableMonth(activeAdvance.applicable_months);
      const recoveryMonths = parseInt(activeAdvance.recovery_months);
      const startMonth = advDate.getMonth() + 1;
      const startYear = advDate.getFullYear();
      let endMonth = startMonth + recoveryMonths - 1;
      let endYear = startYear;
      if (endMonth > 12) {
        endYear += Math.floor((endMonth - 1) / 12);
        endMonth = ((endMonth - 1) % 12) + 1;
      }
      const monthsLeft = (endYear - year) * 12 + (endMonth - month) + 1;
      setAdvanceModal({
        ...advanceModal,
        error: `An active advance of ₹${parseFloat(activeAdvance.advance_amount).toLocaleString()} is already in progress for this employee starting ${activeAdvance.applicable_months}, with ${monthsLeft} iteration(s) left until ${new Date(endYear, endMonth - 1).toLocaleString("en-US", { month: "long", year: "numeric" })}. No new advance can be added until the current one is fully recovered.`,
      });
      return;
    }
    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance`;
      const response = await axios.post(
        url,
        {
          employeeId,
          advanceAmount: parseFloat(advanceAmount),
          recoveryMonths: parseInt(recoveryMonths),
          applicableMonth,
        },
        {
          headers: { "x-api-key": API_KEY, "x-employee-id": meId },
        }
      );
      if (response.data.success) {
        openMessageModal(
          "Success",
          `Advance of ₹${parseFloat(advanceAmount).toLocaleString()} added successfully for ${advanceModal.fullName}.`
        );
        const advancesResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensation/advance-details`,
          {
            headers: { "x-api-key": API_KEY, "x-employee-id": meId },
          }
        );
        if (advancesResponse.data.success) {
          setAdvances(advancesResponse.data.data || []);
        }
        setAdvanceModal({ ...advanceModal, isVisible: false });
      } else {
        setAdvanceModal({
          ...advanceModal,
          error: response.data.message || "Failed to add advance",
        });
      }
    } catch (error) {
      setAdvanceModal({
        ...advanceModal,
        error: error.response?.data?.message || error.message || "Network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSubmit = async () => {
    const { selectedCompensation, employeeId, fullName } = assignModal;
    if (!selectedCompensation) {
      console.log("No compensation selected. Available compensation plans:", assignModal.compensationList);
      setAssignModal({ ...assignModal, error: "Please select a compensation plan." });
      return;
    }
    const compensation = assignModal.compensationList.find(
      (comp) => String(comp.id) === selectedCompensation
    );
    if (!compensation || isNaN(parseInt(selectedCompensation))) {
      console.log("Invalid compensation selected. Selected ID:", selectedCompensation, "Available plans:", assignModal.compensationList);
      setAssignModal({
        ...assignModal,
        error: "Invalid compensation plan selected. Please select a valid plan.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`;
      const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
      const response = await axios.get(url, { headers });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch assigned employees");
      }
      const assignedEmployees = Array.isArray(response.data.data) ? response.data.data : [];
      const assignedEmployee = assignedEmployees.find((emp) => emp.employee_id === employeeId);
      if (assignedEmployee) {
        setAssignModal({
          ...assignModal,
          error: `${fullName} already has a compensation plan assigned: ${assignedEmployee.compensation_plan_name}`,
        });
        return;
      }
      const assignUrl = `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assign`;
      const payload = {
        compensationId: parseInt(selectedCompensation),
        compensationPlanName: compensation.compensation_plan_name,
        employeeId: [employeeId],
        assignedBy: meId,
        assignedDate: new Date().toISOString().split("T")[0],
        departmentIds: [],
      };
      const assignResponse = await axios.post(assignUrl, payload, { headers });
      if (assignResponse.data.success) {
        openMessageModal("Success", `Compensation assigned successfully to ${fullName}!`);
        const compensationsResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`,
          { headers }
        );
        const compensationMap = new Map();
        if (compensationsResponse.data.success) {
          compensationsResponse.data.data.forEach((comp) => {
            compensationMap.set(comp.compensation_plan_name, comp.plan_data);
          });
        }
        const employeesResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensation/assigned`,
          { headers }
        );
        if (employeesResponse.data.success) {
          const enrichedEmployees = employeesResponse.data.data.map((emp) => ({
            ...emp,
            plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
          }));
          setEmployees(enrichedEmployees || []);
        }
        const allEmployeesResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/employees/names`,
          { headers }
        );
        if (allEmployeesResponse.data.success) {
          setAllEmployees(allEmployeesResponse.data.data || []);
        }
        setAssignModal({ ...assignModal, isVisible: false });
      } else {
        throw new Error(assignResponse.data.message || "Assignment unsuccessful");
      }
    } catch (error) {
      setAssignModal({
        ...assignModal,
        error: `Failed to assign compensation: ${error.response?.data?.message || error.message || "Network error"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSalaryBreakupData = async () => {
      try {
        setIsLoading(true);
        setBonusRecords([]);
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
        console.log("Fetching salary breakup data..."); // Debug log
        const allEmployeesResponse = await axios.get(`${baseUrl}/api/employees/names`, { headers });
        if (allEmployeesResponse.data.success) {
          console.log("All employees:", allEmployeesResponse.data.data); // Debug log
          setAllEmployees(allEmployeesResponse.data.data || []);
        } else {
          throw new Error(allEmployeesResponse.data.message || "Failed to fetch all employees");
        }
        const compensationsResponse = await axios.get(`${baseUrl}/api/compensations/list`, { headers });
        const compensationMap = new Map();
        if (compensationsResponse.data.success) {
          console.log("Compensations:", compensationsResponse.data.data); // Debug log
          compensationsResponse.data.data.forEach((comp) => {
            compensationMap.set(comp.compensation_plan_name, comp.plan_data);
          });
        } else {
          throw new Error(compensationsResponse.data.message || "Failed to fetch compensations");
        }
        const employeesResponse = await axios.get(`${baseUrl}/api/compensation/assigned`, { headers });
        if (employeesResponse.data.success) {
          const enrichedEmployees = employeesResponse.data.data.map((emp) => ({
            ...emp,
            plan_data: compensationMap.get(emp.compensation_plan_name) || emp.plan_data,
          }));
          console.log("Enriched employees:", enrichedEmployees); // Debug log
          setEmployees(enrichedEmployees || []);
          const lopDataPromises = enrichedEmployees.map((emp) =>
            calculateLOPEffect(emp.employee_id).then((result) => ({
              employeeId: emp.employee_id,
              lopData: result || {
                currentMonth: { days: 0, value: "0.00", currency: "INR" },
                deferred: { days: 0, value: "0.00", currency: "INR" },
                nextMonth: { days: 0, value: "0.00", currency: "INR" },
                yearly: { days: 0, value: "0.00", currency: "INR" },
              },
            })).catch(() => ({
              employeeId: emp.employee_id,
              lopData: {
                currentMonth: { days: 0, value: "0.00", currency: "INR" },
                deferred: { days: 0, value: "0.00", currency: "INR" },
                nextMonth: { days: 0, value: "0.00", currency: "INR" },
                yearly: { days: 0, value: "0.00", currency: "INR" },
              },
            }))
          );
          const lopDataResults = await Promise.all(lopDataPromises);
          const lopDataMap = lopDataResults.reduce(
            (acc, { employeeId, lopData }) => {
              acc[employeeId] = lopData;
              return acc;
            },
            {}
          );
          console.log("LOP data:", lopDataMap); // Debug log
          setEmployeeLopData(lopDataMap);
        } else {
          throw new Error(employeesResponse.data.message || "Failed to fetch salary breakup data");
        }
        const advancesResponse = await axios.get(`${baseUrl}/api/compensation/advance-details`, { headers });
        if (advancesResponse.data.success) {
          console.log("Advances:", advancesResponse.data.data); // Debug log
          setAdvances(advancesResponse.data.data || []);
        }
        const overtimeResponse = await axios.get(`${baseUrl}/api/compensation/overtime-details`, { headers });
        if (overtimeResponse.data.success) {
          console.log("Overtime records:", overtimeResponse.data.data); // Debug log
          setOvertimeRecords(overtimeResponse.data.data || []);
        }
        const bonusResponse = await axios.get(`${baseUrl}/api/compensation/bonus-list`, { headers });
        if (bonusResponse.data.success) {
          console.log("Bonus records:", bonusResponse.data.data); // Debug log
          setBonusRecords(bonusResponse.data.data || []);
        }
      } catch (error) {
        console.error("Fetch error:", error); // Debug log
        openMessageModal(
          "Error",
          `Failed to fetch data: ${error.response?.data?.message || error.message || "Network error"}`,
          true
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (API_KEY && meId) {
      fetchSalaryBreakupData();
    } else {
      console.error("Missing API_KEY or meId"); // Debug log
      openMessageModal("Error", "Authentication credentials are missing.", true);
      setIsLoading(false);
    }
  }, [API_KEY, meId]);

  useEffect(() => {
    console.log("Current viewMode:", viewMode, "Employees length:", employees.length); // Debug log
  }, [viewMode, employees]);

  const totals = employees.length > 0
    ? calculateTotals(employees, overtimeRecords, bonusRecords, advances)
    : {
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
      };
  const totalLopDeduction = employees.reduce((sum, emp) => {
    const lopData = employeeLopData[emp.employee_id];
    return sum + (lopData ? parseFloat(lopData.currentMonth.value || 0) : 0);
  }, 0);
  totals.totalLopDeduction = totalLopDeduction;

  const getAvailableMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    return [
      {
        value: `${currentYear}-${currentMonth.toString().padStart(2, "0")}`,
        label: new Date(currentYear, currentMonth - 1).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),
      },
      {
        value: `${nextYear}-${nextMonth.toString().padStart(2, "0")}`,
        label: new Date(nextYear, nextMonth - 1).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),
      },
    ];
  };

  const employeesWithoutPlans = allEmployees.filter(
    (emp) =>
      !employees.some((assignedEmp) => String(assignedEmp.employee_id) === String(emp.employee_id))
  );

  return (
    <div className="sb-main-container">
      {viewMode === "main" && (
        <>
          {isLoading ? (
            <div className="sb-main-loading">Loading...</div>
          ) : employees.length > 0 || allEmployees.length > 0 ? (
            <div className="sb-main-table-container">
              <Header
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                openNoPlanModal={openNoPlanModal}
                openBonusModal={openBonusModal}
                handleViewAllDetails={handleViewAllDetails}
              />
              <TotalsContainer totals={totals} totalLopDeduction={totalLopDeduction} />
              <EmployeeTable
                employees={employees}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                tableRef={tableRef}
                handleViewSingleEmployee={handleViewSingleEmployee}
                openAdvanceModal={openAdvanceModal}
                showDetailsTab={showDetailsTab}
                selectedEmployee={selectedEmployee}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tableHeight={tableHeight}
                handleCloseDetailsTab={handleCloseDetailsTab}
                calculateSalaryDetails={calculateSalaryDetails}
                employeeLopData={employeeLopData}
                overtimeRecords={overtimeRecords}
                bonusRecords={bonusRecords}
                advances={advances}
              />
            </div>
          ) : (
            <p>No employee data available</p>
          )}
        </>
      )}
      {viewMode === "allDetails" && (
        <AllDetailsView
          employees={employees}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleBackToMain={handleBackToMain}
          calculateSalaryDetails={calculateSalaryDetails}
          employeeLopData={employeeLopData}
          overtimeRecords={overtimeRecords}
          bonusRecords={bonusRecords}
          advances={advances}
        />
      )}
      {viewMode === "noPlanDetails" && (
        <NoPlanDetails
          allEmployees={allEmployees}
          employees={employees}
          searchTerm={searchTerm}
          debouncedSetSearchTerm={debouncedSetSearchTerm}
          handleBackToMain={handleBackToMain}
          openAssignModal={openAssignModal}
          isLoading={isLoading}
        />
      )}
      {bonusModal.isVisible && (
        <BonusModal
          bonusModal={bonusModal}
          setBonusModal={setBonusModal}
          handleBonusSubmit={handleBonusSubmit}
          isLoading={isLoading}
        />
      )}
      {advanceModal.isVisible && (
        <AdvanceModal
          advanceModal={advanceModal}
          setAdvanceModal={setAdvanceModal}
          handleAdvanceSubmit={handleAdvanceSubmit}
          isLoading={isLoading}
          getAvailableMonths={getAvailableMonths}
          threeMonthsSalary={advanceModal.threeMonthsSalary}
        />
      )}
      {assignModal.isVisible && (
        <AssignModal
          assignModal={assignModal}
          setAssignModal={setAssignModal}
          handleAssignSubmit={handleAssignSubmit}
          isLoading={isLoading}
        />
      )}
      {messageModal.isVisible && (
        <MessageModal
          title={messageModal.title}
          message={messageModal.message}
          isError={messageModal.isError}
          onClose={() => setMessageModal({ isVisible: false, title: "", message: "", isError: false })}
        />
      )}
    </div>
  );
};

export default SalaryBreakupMain;
