
import * as XLSX from "xlsx";
import axios from "axios";
import "./Salary_Statement.css";
import { VALID_SALARY_HEADERS } from "../constants/salarystatement";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

const Salary_Statement = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [tableData, setTableData] = useState([]);
  const [header, setHeader] = useState([]);
  const [invalidCells, setInvalidCells] = useState(new Map());
  const [updatedCells, setUpdatedCells] = useState(new Map());
  const [previousData, setPreviousData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const API_KEY = process.env.REACT_APP_API_KEY;
  const meId = JSON.parse(localStorage.getItem("dashboardData") || "{}").employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [month, setMonth] = useState(
    new Date().toLocaleString("default", { month: "long" }).toLowerCase()
  );
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState([]);
  const templateUrl = "/templates/Statement_Template.xlsx";
  const [selectedMonthYearData, setSelectedMonthYearData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showUploadedFileTable, setShowUploadedFile] = useState(false);
  const [isMonthYearSelected, setIsMonthYearSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [prevTableData, setPrevTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const filterSalaryData = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = salaryData.filter((row) =>
      Object.values(row).some((cell) =>
        cell?.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (!searchValue) {
      setFilteredData(tableData);
      return;
    }
    const employeeIdIndex = tableHeaders.indexOf("ID");
    const employeeNameIndex = tableHeaders.indexOf("Name");
    const filtered = tableData.filter((row) =>
      row.some((cell, index) => {
        const cellValue = cell.toString().toLowerCase();
        if (index === employeeIdIndex || index === employeeNameIndex) {
          return cellValue.includes(searchValue);
        }
        return false;
      })
    );
    setFilteredData(filtered);
  };

  const validateHeaders = (uploadedHeaders) => {
    if (!uploadedHeaders || uploadedHeaders.length === 0) {
      setError("❌ No headers found in the uploaded file.");
      return false;
    }
    const formattedUploadedHeaders = uploadedHeaders.map((header) =>
      header ? header.trim().toLowerCase() : ""
    );
    const formattedValidHeaders = VALID_SALARY_HEADERS.map((header) =>
      header.trim().toLowerCase()
    );
    return (
      formattedUploadedHeaders.length === formattedValidHeaders.length &&
      formattedUploadedHeaders.every(
        (header, index) => header === formattedValidHeaders[index]
      )
    );
  };

  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return { month, year };
  };

  const [showNote, setShowNote] = useState(true);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setFileName("No file chosen");
      setError("");
      setShowNote(true);
      return;
    }
    setShowNote(false);
    event.target.value = "";
    const { month, year } = getCurrentMonthYear();
    const fileNameLower = selectedFile.name.toLowerCase();
    if (!fileNameLower.includes(year.toString())) {
      setError(`❌ Wrong year in filename. Expected: ${year}`);
      setFileName("Invalid file");
      setTableData([]);
      setInvalidCells(new Map());
      setUpdatedCells(new Map());
      return;
    }
    if (!fileNameLower.includes(month.toLowerCase())) {
      setError(`❌ Wrong month in filename. Expected: ${month}`);
      setFileName("Invalid file");
      setTableData([]);
      setInvalidCells(new Map());
      setUpdatedCells(new Map());
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
    readExcel(selectedFile);
  };

  const [excelData, setExcelData] = useState([]);
  const parseNumeric = (val) => {
    if (val === "" || val === null || val === undefined) return 0;
    return isNaN(Number(val)) ? 0 : Number(val);
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      rows.forEach((row, index) => {
        console.log(`Row ${index + 1}:`);
        console.log("Professional Tax raw value:", row["Professional Tax"], "| Type:", typeof row["Professional Tax"]);
        console.log("ESIC raw value:", row["ESIC"], "| Type:", typeof row["ESIC"]);
        console.log("Income Tax raw value:", row["Income Tax"], "| Type:", typeof row["Income Tax"]);
      });
      const cleanKeys = (obj) => {
        const cleaned = {};
        Object.keys(obj).forEach((key) => {
          const trimmedKey = key.trim();
          cleaned[trimmedKey] = obj[key];
        });
        return cleaned;
      };
      const parsedRows = rows.map((row) => {
        const cleaned = cleanKeys(row);
        return {
          ...cleaned,
          "Advance Recovery": cleaned["Advance Recovery"] ?? 0,
          "Net Salary": cleaned["Net Salary"] ?? 0,
          "Gross Salary": cleaned["Gross Salary"] ?? 0,
        };
      });
      if (!jsonData || jsonData.length === 0) {
        setError("❌ Empty file or invalid format");
        setTableData([]);
        setInvalidCells(new Map());
        setUpdatedCells(new Map());
        return;
      }
      const extractedHeaders = jsonData[0];
      if (!validateHeaders(extractedHeaders)) {
        setError("❌ Headers not matched");
        setTableData([]);
        setInvalidCells(new Map());
        setUpdatedCells(new Map());
        return;
      }
      console.log("Extracted Headers:", extractedHeaders);
      const validData = jsonData.slice(1).filter((row) => row && row.length > 0);
      const previousData = prevTableData.length ? prevTableData : validData;
      const { invalidCells, updatedCells } = validateData(
        validData,
        extractedHeaders,
        prevTableData
      );
      setTableHeaders(extractedHeaders);
      const cleanedTableData = parsedRows.map((row) =>
        extractedHeaders.map((header) => row[header] ?? "")
      );
      setTableData(cleanedTableData);
      setPrevTableData(validData);
      setExcelData(parsedRows);
      setInvalidCells(invalidCells);
      setUpdatedCells(updatedCells);
    };
    reader.readAsArrayBuffer(file);
  };

  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  const processData = (newData) => {
    const columnTypes = detectColumnTypes(header);
    const validationErrors = validateData(newData, columnTypes);
    const changes = previousData ? trackChanges(newData) : new Map();
    newData = newData.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (columnTypes[cellIndex] === "date" && typeof cell === "number") {
          return convertExcelDate(cell);
        }
        return cell;
      })
    );
    setInvalidCells(validationErrors);
    setUpdatedCells(changes);
    setTableData(newData.slice(1));
    setPreviousData(newData);
  };

  const detectColumnTypes = (headers) => {
    return headers.map((header) => {
      const h = header.toLowerCase().trim();
      if (
        [
          "annual ctc",
          "basic salary",
          "hra",
          "lta",
          "other allowances",
          "incentives",
          "overtime",
          "statutory bonus",
          "bonus",
          "advance recovery",
          "employee pf",
          "employer pf",
          "esic",
          "gratuity",
          "professional tax",
          "income tax",
          "insurance",
          "lop deduction",
          "gross salary",
          "net salary",
          "lop days"
        ].includes(h)
      ) {
        return "number";
      }
      return "string";
    });
  };

  const normalizeHeaders = (headers) => {
    return headers.map((h) => h.trim().toLowerCase());
  };

  const actualHeaders = normalizeHeaders(header);

  const validateData = (jsonData, headers, prevData = []) => {
    const invalidCells = new Map();
    const updatedCells = new Map();

    jsonData.forEach((row, rowIndex) => {
      if (!row || !Array.isArray(row)) return;
      row.forEach((cell, colIndex) => {
        let isInvalid = false;
        let isUpdated = false;
        let formattedCell = cell;
        const columnName = headers[colIndex];

        if (columnName === "ID") {
          const empIdPattern = /^STS\d{3}$/;
          if (!empIdPattern.test(cell)) {
            isInvalid = true;
          }
        }

        if (["Name"].includes(columnName)) {
          const namePattern = /^[A-Za-z\s.]+$/;
          if (!namePattern.test(cell) || cell.trim() === "") {
            isInvalid = true;
          }
        }

        if (
          [
            "Annual CTC",
            "Basic Salary",
            "HRA",
            "LTA",
            "Other Allowances",
            "Incentives",
            "Overtime",
            "Statutory Bonus",
            "Bonus",
            "Advance Recovery",
            "Employee PF",
            "Employer PF",
            "ESIC",
            "Gratuity",
            "Professional Tax",
            "Income Tax",
            "Insurance",
            "LOP Deduction",
            "Gross Salary",
            "Net Salary",
            "LOP Days"
          ].includes(columnName)
        ) {
          if (isNaN(cell) || cell === "") {
            isInvalid = true;
          }
        }

        if (prevData[rowIndex]) {
          let prevCell = prevData[rowIndex][colIndex];
          if (prevCell !== formattedCell) {
            isUpdated = true;
          }
        }

        if (isInvalid) {
          if (!invalidCells.has(rowIndex)) invalidCells.set(rowIndex, new Set());
          invalidCells.get(rowIndex).add(colIndex);
        }

        if (isUpdated) {
          if (!updatedCells.has(rowIndex)) updatedCells.set(rowIndex, new Set());
          updatedCells.get(rowIndex).add(colIndex);
        }
      });
    });

    console.log("🚨 Debug: Invalid Cells Map:", invalidCells);
    console.log("🟢 Debug: Updated Cells Map:", updatedCells);
    return { invalidCells, updatedCells };
  };

  const convertExcelDate = (serial) => {
    if (!serial || typeof serial !== "number" || !isFinite(serial)) {
      console.warn("⚠️ Skipped date conversion for:", serial);
      return serial;
    }
    try {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch.setDate(excelEpoch.getDate() + serial - 2));
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("❌ Error converting date for:", serial, error);
      return serial;
    }
  };

  const trackChanges = (newData) => {
    if (!previousData) return new Map();
    let changedCells = new Map();
    newData.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const oldCell = previousData[rowIndex + 1]?.[cellIndex];
        if (oldCell !== undefined && oldCell !== cell) {
          if (!changedCells.has(rowIndex)) {
            changedCells.set(rowIndex, new Set());
          }
          changedCells.get(rowIndex).add(cellIndex);
        }
      });
    });
    return changedCells;
  };

  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };

 // Frontend: Salary_Statement.js (Enhanced with logging in handleTogglePayslip)
const handleTogglePayslip = async (employeeId, currentValue) => {
  const newValue = currentValue === 0 ? 1 : 0;
  const action = newValue === 1 ? "enable" : "disable";
  console.log(`🔄 Toggling payslip for ${employeeId}: ${currentValue} -> ${newValue} (${action})`);
  try {
    const response = await axios.post(
      `${BASE_URL}/api/salary-statement/update-payslip/${selectedMonth.toLowerCase()}/${selectedYear}/${employeeId}`,
      { payslip_generated: newValue },
      { headers }
    );
    console.log(`📥 Backend response:`, response.data);
    if (response.data.success) {
      setSalaryData((prev) =>
        prev.map((row) =>
          row.employee_id === employeeId
            ? { ...row, payslip_generated: newValue }
            : row
        )
      );
      showAlert(`Payslip ${action}d successfully`, "Success");
    } else {
      throw new Error(response.data.error || "Update failed");
    }
  } catch (err) {
    console.error("❌ Error updating payslip status:", err);
    console.error("❌ Full error details:", err.response?.data || err.message);
    showAlert(`Failed to ${action} payslip: ${err.response?.data?.error || err.message}`, "Error");
  }
};
  const handleUpload = async () => {
  console.log("📂 handleUpload() called. File:", file?.name);
  if (!file || excelData.length === 0) {
    setError("❌ Please select a valid file to upload!");
    setTableData([]);
    setSelectedMonthYearData([]);
    setSelectedMonth("");
    setSelectedYear("");
    setIsMonthYearSelected(false);
    setTableData([]);
    showAlert("❌ Please select a valid file to upload!", "No File Selected");
    return;
  }

  // Extract month and year from filename
  const fileNameLower = file.name.toLowerCase();
  const monthMatch = fileNameLower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
  const yearMatch = fileNameLower.match(/(\d{4})/);
  const month = monthMatch ? monthMatch[1].toLowerCase() : "";
  const year = yearMatch ? yearMatch[1] : "";

  if (!month || !year) {
    setError("❌ Could not extract month/year from filename");
    showAlert("❌ Invalid filename format", "Error");
    return;
  }

  // Verify no invalid cells
  console.log("🔍 Checking invalidCells:", invalidCells);
  if (invalidCells.size > 0) {
    let errorMessage = "❌ Cannot save due to invalid data in the following cells:\n";
    invalidCells.forEach((colSet, rowIndex) => {
      colSet.forEach((colIndex) => {
        const columnName = tableHeaders[colIndex] || `Column ${colIndex + 1}`;
        errorMessage += `- Row ${rowIndex + 2}, ${columnName}\n`;
      });
    });
    errorMessage += "Please correct the highlighted (red) cells in the table and try again.";
    setError(errorMessage);
    showAlert(errorMessage, "Invalid Data Detected");
    return;
  }

  try {
    // Process the excelData to match the backend expected format
    const fullSalaryData = excelData.map((row) => ({
      employee_id: row["ID"] || "",
      full_name: row["Name"] || "",
      annual_ctc: parseFloat(row["Annual CTC"] || 0),
      basic_salary: parseFloat(row["Basic Salary"] || 0),
      hra: parseFloat(row["HRA"] || 0),
      lta: parseFloat(row["LTA"] || 0),
      other_allowances: parseFloat(row["Other Allowances"] || 0),
      incentives: parseFloat(row["Incentives"] || 0),
      overtime: parseFloat(row["Overtime"] || 0),
      statutory_bonus: parseFloat(row["Statutory Bonus"] || 0),
      bonus: parseFloat(row["Bonus"] || 0),
      advance_recovery: parseFloat(row["Advance Recovery"] || 0),
      employee_pf: parseFloat(row["Employee PF"] || 0),
      employer_pf: parseFloat(row["Employer PF"] || 0),
      esic: parseFloat(row["ESIC"] || 0),
      gratuity: parseFloat(row["Gratuity"] || 0),
      professional_tax: parseFloat(row["Professional Tax"] || 0),
      income_tax: parseFloat(row["Income Tax"] || 0),
      insurance: parseFloat(row["Insurance"] || 0),
      lop_days: parseInt(row["LOP Days"] || 0),
      lop_deduction: parseFloat(row["LOP Deduction"] || 0),
      gross_salary: parseFloat(row["Gross Salary"] || 0),
      net_salary: parseFloat(row["Net Salary"] || 0) > 0 ? parseFloat(row["Net Salary"] || 0) : 0,
      payslip_generated: 0,
    })).filter((item) => item.employee_id && item.full_name); // Filter out invalid rows

    console.log("📤 Sending fullSalaryData:", fullSalaryData);

    const response = await axios.post(
      `${BASE_URL}/api/salary-details/save`,
      { salaryData: fullSalaryData, month, year },
      { headers }
    );
    console.log("📥 Backend Response:", response.data);

    if (response.data.success) {
      console.log("✅ Success: Data uploaded successfully");
      // Handle success response
      const successMessage = `Data saved successfully in table: ${response.data.tableName}`;
      setError(""); // Clear any previous error
      showAlert(successMessage, "Upload Successful");
      setIsFileUploaded(true);
      setIsMonthYearSelected(false);
      // Clear states after successful save
      setFile(null);
      setFileName("No file chosen");
      setTableData([]);
      setHeader([]);
      setInvalidCells(new Map());
      setUpdatedCells(new Map());
      setExcelData([]);
      setPrevTableData([]);
      setShowNote(true);
    } else {
      console.log("❌ Failure: Backend returned an error");
      const errorMsg = response.data.error || "Unknown error";
      setError(`❌ Upload failed: ${errorMsg}`);
      showAlert(`❌ Upload failed: ${errorMsg}`, "Upload Error");
    }
  } catch (error) {
    console.error("❌ Error uploading data:", error);
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unknown server error";
    setError(`❌ Upload failed: ${errorMsg}`);
    showAlert(`❌ Upload failed: ${errorMsg}`, "Upload Error");
  }
};
  const calculateTotalSalary = () => {
    if (!tableData || tableData.length === 0 || !tableHeaders || tableHeaders.length === 0) {
      return 0;
    }
    const netSalaryIndex = tableHeaders.findIndex(
      (header) => header.trim().toLowerCase() === "net salary"
    );
    if (netSalaryIndex === -1) {
      return 0;
    }
    let total = 0;
    tableData.forEach((row) => {
      const salary = parseFloat(row[netSalaryIndex]?.toString().replace(/,/g, ""));
      if (!isNaN(salary)) {
        total += salary;
      }
    });
    return total;
  };

  const calculateTotalNetSalary = () => {
    if (!salaryData || salaryData.length === 0) {
      return "0.00";
    }
    const totalSalary = salaryData.reduce((total, row) => {
      let salary = row["Net Salary"] || row["net_salary"] || row["netSalary"];
      if (salary) {
        salary = parseFloat(salary.toString().replace(/,/g, "")) || 0;
        return total + salary;
      }
      return total;
    }, 0);
    return totalSalary.toFixed(2);
  };

  useEffect(() => {
    if (salaryData.length > 0) {
      console.log("🔹 Total Net Salary:", calculateTotalNetSalary());
    }
  }, [salaryData]);

  const generateMonthYearOptions = () => {
    const options = [];
    const current = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      options.push({
        label: `${month} ${year}`,
        value: `${month}_${year}`,
      });
    }
    return options;
  };

  const handleMonthYearChange = async (event) => {
    const [month, year] = event.target.value.split("_");
    setSelectedMonth(month);
    setSelectedYear(year);
    setIsMonthYearSelected(true);
    setIsFileUploaded(false);
    setError("");
    console.log("Selected Month & Year:", month, year);
    await fetchSalaryStatement(month, year);
  };

  const fetchSalaryStatement = async (month, year) => {
    if (!month || !year) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/salary-statement/${month.toLowerCase()}/${year}`,
        { headers }
      );
      console.log("Salary statement response:", response.data);
      if (response.data && response.data.length > 0) {
        setTableData(response.data);
        setHeader(Object.keys(response.data[0]));
        setError("");
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.error("Error fetching salary statement:", err);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "Salary_Statement_Template.xlsx";
    console.log("linkherf",link.href);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLastMonthYear = () => {
    const date = new Date();
    const lastMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const month = lastMonthDate.toLocaleString("default", { month: "short" });
    const year = lastMonthDate.getFullYear();
    return { month, year };
  };

  useEffect(() => {
    const { month, year } = getLastMonthYear();
    setSelectedMonth(month);
    setSelectedYear(year);
    setIsMonthYearSelected(true);
    fetchSalaryStatement(month, year);
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSalaryData(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchSalaryData = async (month, yr) => {
    console.log("Fetching Salary Data for:", month, yr);
    try {
      const apiUrl = `${
        process.env.REACT_APP_BACKEND_URL
      }/api/salary-statement/${month.toLowerCase()}/${yr}`;
      console.log("API Request URL:", apiUrl);
      const response = await axios.get(apiUrl, { headers });
      console.log("Full API Response:", response.data);
      if (
        response.data &&
        response.data.salary_statement &&
        response.data.salary_statement.length > 0
      ) {
        setSalaryData(response.data.salary_statement);
        console.log("Salary Data Set:", response.data.salary_statement);
      } else {
        setSalaryData([]);
        console.warn("⚠ Debug: No salary data found");
      }
    } catch (error) {
      console.error(
        "Error fetching salary data:",
        error.response?.data || error.message
      );
      setSalaryData([]);
    }
  };

  const formatHeader = (header) => {
    return header.charAt(0).toUpperCase() + header.slice(1).toLowerCase();
  };

  // Get display keys excluding payslip_generated
  const getDisplayKeys = () => {
    if (salaryData.length === 0) return [];
    return Object.keys(salaryData[0]).filter((key) => key !== "payslip_generated");
  };

  return (
    <div className="salary-container">
      <div className="upload-container">
        {showNote && (
          <p className="file-note">
            📌 Filename format should include <strong>Month-Year</strong> (e.g.,{" "}
            <strong>EmpDetails_MAR_2025.xlsx</strong>).
          </p>
        )}
        <div className="upload-box-payslip">
          <label className="file-label">
            <div className="upload-text">
              <p className="upload-title">Upload a Salary Sheet</p>
              <p className="file-name">{fileName || "No file chosen"}</p>
            </div>
            <img
              src="/images/upload.png"
              alt="Upload Icon"
              className="upload-icon"
            />
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>
        <div className="salary-month-year-selector-box">
          <div className="salary-month-year-selector">
            <label>Select Month & Year:</label>
            {selectedMonth && selectedYear && (
              <select
                value={`${selectedMonth}_${selectedYear}`}
                onChange={handleMonthYearChange}
                className="salary-month-year-dropdown"
              >
                {generateMonthYearOptions().map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div style={{ minHeight: "30px", display: "flex", alignItems: "center" }}>
          {error && (
            <p className="error-message-for-uploadfile" style={{ whiteSpace: "pre-wrap" }}>
              {error}
            </p>
          )}
        </div>
      </div>
      <div className="reference-container">
        <div className="reference-box">
          <p className="reference-text">Template For Your Reference</p>
          <button
            className="download-template-btn"
            onClick={handleDownloadTemplate}
          >
            📥 Download
          </button>
        </div>
      </div>
      {tableData.length > 0 ? (
        <div className="salary-table-container">
          <div className="table-scroll-wrapper">
            <div className="table-header">
              <h2 className="table-heading">Employee Data</h2>
              <input
                type="text"
                placeholder="Search Employee..."
                value={searchTerm}
                onChange={handleSearch}
                className="admin-search-box"
              />
              <button className="upload-btn" onClick={handleUpload}>
                Save Data
              </button>
            </div>
            <div className="salary-table-wrapper">
              <table className="salary-table">
                <thead>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(searchTerm ? filteredData : tableData).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        const isInvalid =
                          invalidCells.has(rowIndex) &&
                          invalidCells.get(rowIndex).has(colIndex);
                        const isUpdated =
                          updatedCells.has(rowIndex) &&
                          updatedCells.get(rowIndex).has(colIndex);
                        return (
                          <td
                            key={colIndex}
                            style={{
                              backgroundColor: isInvalid
                                ? "red"
                                : isUpdated
                                ? "lightgreen"
                                : "white",
                            }}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={tableHeaders.length} className="sticky-footer">
                      Total Amount: {calculateTotalSalary()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : salaryData.length > 0 ? (
        <div>
          <div className="admin-table-container">
            <div className="table-scroll-wrapper">
              <div className="table-header">
                <h2 className="table-title">
                  Salary Statement - {selectedMonth.toUpperCase()} {selectedYear}
                </h2>
                <input
                  type="text"
                  className="salary-search-box"
                  placeholder="Search..."
                  onChange={filterSalaryData}
                />
              </div>
              <div className="adminsalary-table-container">
                <table className="adminsalary-table">
                  <thead>
                    <tr>
                      {getDisplayKeys().map((key) => (
                        <th key={key}>{formatHeader(key)}</th>
                      ))}
                      <th>Payslip Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchTerm ? filteredData : salaryData).map((row, index) => (
                      <tr key={index}>
                        {getDisplayKeys().map((key, idx) => (
                          <td key={idx}>{row[key] ?? "N/A"}</td>
                        ))}
                        <td>
                          <button
                            className="toggle-btn"
                            onClick={() => handleTogglePayslip(row.employee_id, row.payslip_generated)}
                          >
                            {row.payslip_generated === 0 ? "Enable" : "Disable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={getDisplayKeys().length + 1}
                        className="net-salary-row"
                      >
                        Total Amount: ₹ {Math.floor(calculateTotalNetSalary())}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <Modal
            isVisible={alertModal.isVisible}
            onClose={closeAlert}
            buttons={[{ label: "OK", onClick: closeAlert }]}
          >
            <p>{alertModal.message}</p>
          </Modal>
        </div>
      ) : null}
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default Salary_Statement;