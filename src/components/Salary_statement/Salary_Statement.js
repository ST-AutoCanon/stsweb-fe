

import * as XLSX from "xlsx";
import axios from "axios";
import "./Salary_Statement.css";
import { VALID_SALARY_HEADERS } from "../constants/salarystatement"; // Adjust the path as needed


import { useState, useEffect } from "react";


const Salary_Statement = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]); // Store table headers
  const [invalidCells, setInvalidCells] = useState(new Map());
  const [updatedCells, setUpdatedCells] = useState(new Map());
  const [previousData, setPreviousData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const API_KEY = process.env.REACT_APP_API_KEY;

  
const [selectedMonth, setSelectedMonth] = useState("");
const [selectedYear, setSelectedYear] = useState("");

const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }).toLowerCase()); // Default to current month
const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

const [loading, setLoading] = useState(true); // ✅ Define loading state
const [salaryData, setSalaryData] = useState([]);

const templateUrl = "/templates/template_MAR_2025.xlsx"; // Correct path for public files

  const [selectedMonthYearData, setSelectedMonthYearData] = useState([]); // Store month-year table data
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Toggle between month-year and uploaded file table

  const [showUploadedFileTable, setShowUploadedFile] = useState(false);

  const [isMonthYearSelected, setIsMonthYearSelected] = useState(false);
  

  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
  
    // Filter rows where any cell fully contains the search term
    const filtered = tableData.filter((row) =>
      row.some((cell) => cell.toString().toLowerCase().includes(searchValue))
    );
    
  
    setFilteredData(filtered); // Store filtered results
  };
  
  
    


  const validateHeaders = (uploadedHeaders) => {
    if (!uploadedHeaders || uploadedHeaders.length === 0) {
      setError("❌ No headers found in the uploaded file.");
      return false;
    }
  
    const formattedUploadedHeaders = uploadedHeaders.map((header) =>
      header ? header.trim().toLowerCase() : "" // Ensure undefined headers are handled
    );
  
    const formattedValidHeaders = VALID_SALARY_HEADERS.map((header) =>
      header.trim().toLowerCase()
    );
  
    return (
      formattedUploadedHeaders.length === formattedValidHeaders.length &&
      formattedUploadedHeaders.every((header, index) => header === formattedValidHeaders[index])
    );
  };
  


  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" }); // e.g., "Feb"
    const year = date.getFullYear();
    return { month, year };
  };

  const [showNote, setShowNote] = useState(true); // Show note initially

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
    setFileName("No file chosen");
    setError("");
    setShowNote(true); // Show note again if no file is selected
    return;
  }

  setShowNote(false); // Hide note once file is selected

  // Clear input to allow re-uploading the same file
  event.target.value = "";

  const { month, year } = getCurrentMonthYear();
  const fileNameLower = selectedFile.name.toLowerCase();

  if (!fileNameLower.includes(year.toString())) {
    setError(`❌ Wrong year in filename. Expected: ${year}`);
    setFileName("Invalid file");
    setTableData([]);
    return;
  }

  if (!fileNameLower.includes(month.toLowerCase())) {
    setError(`❌ Wrong month in filename. Expected: ${month}`);
    setFileName("Invalid file");
    setTableData([]);
    return;
  }

  setFile(selectedFile);
  setFileName(selectedFile.name);
  setError("");
  readExcel(selectedFile);
};

    
    

  const readExcel = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      if (!sheet["!ref"]) {
        setError("❌ Invalid Excel file: No reference range found.");
        return;
      }

      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      const uploadedHeaders = parsedData[0] || []; // Ensure headers exist

      if (!validateHeaders(uploadedHeaders)) {
        setError("❌ Incorrect headers. Please upload a valid salary statement.");
        setTableData([]);
        return;
      }
  
      setHeaders(uploadedHeaders);

      const columnTypes = detectColumnTypes(parsedData);
    const validationErrors = validateData(parsedData, columnTypes);

    setInvalidCells(new Map(validationErrors)); // Store errors

    if (validationErrors.size > 0) {
      setError("❌ File contains errors. Please correct and re-upload.");
      setTableData(parsedData.slice(1)); // Show incorrect data in the table
      return;
    }

    setError(""); // Clear error if no issues
    processData(parsedData);
  };
      

    reader.readAsArrayBuffer(file);
  };

  const processData = (newData) => {
    const columnTypes = detectColumnTypes(newData);
    const validationErrors = validateData(newData, columnTypes);

     // ✅ Show notification if no changes are detected
   
  // ✅ Check for previous data before tracking changes
  const changes = previousData ? trackChanges(newData) : new Map();

  // ✅ Show notification if no changes are detected (except on first upload)
  if (previousData && changes.size === 0) {
    alert("⚠️ No changes detected in the uploaded file.");
  }
  
    // Convert dates correctly
    newData = newData.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (columnTypes[cellIndex] === "date") {
          return convertToDate(cell);
        }
        return cell;
      })
    );
  

    
    setInvalidCells(validationErrors);
    setUpdatedCells(changes);
    setTableData(newData.slice(1)); // Remove header from tableData
    setPreviousData(newData);
  };
  
  const convertToDate = (value) => {
    if (!isNaN(value) && value > 0) {
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + value * 86400000)
        .toISOString()
        .split("T")[0]; // Convert to YYYY-MM-DD
    }
    return value; // Return original value if it's not a serial number
  };
  
  const detectColumnTypes = (data) => {
    return data[0].map((_, colIndex) => {
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const cell = data[rowIndex][colIndex];
        if (cell && !isNaN(cell)) return "integer";
        if (cell && isValidDate(cell)) return "date";
      }
      return "string";
    });
  };


  
  
  const validateData = (data, columnTypes) => {
    let errors = new Map();
  
    data.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const columnName = headers[cellIndex] ? headers[cellIndex].trim().toLowerCase() : ""; // Handle undefined headers
        const cellValue = cell ? cell.toString().trim() : ""; // Ensure cell is not undefined
  
        
        // ✅ Validate Employee ID (Format: STS followed by 3 digits)
        if (columnName === "employee id" && !/^STS\d{3}$/.test(cellValue)) {
          markError(errors, rowIndex, cellIndex, "Invalid Employee ID (Format: STS123)");
        }
  
        // ✅ Validate Name, Department, Designation (Must not contain numbers)
        if (["employee name", "department", "designation"].includes(columnName) && /\d/.test(cellValue)) {
          markError(errors, rowIndex, cellIndex, "Must not contain numbers");
        }
  
        // ✅ Validate Joining Date (Correct Date Format)
        if (columnName === "joining date" && !isValidDate(cellValue)) {
          markError(errors, rowIndex, cellIndex, "Invalid Date (Expected: YYYY-MM-DD)");
        }
  
        // ✅ Validate Numeric Fields (Salary, Allowances, Deductions)
        if (
          [
            "uin number",
            "basic salary",
            "house rent allowance (hra)",
            "other allowances",
            "total earnings",
            "provident fund (pf)",
            "esi",
            "proffessional tax",
            "tds",
            "total deductions",
            "net salary",
          ].includes(columnName) &&
          isNaN(parseFloat(cellValue))
        ) {
          markError(errors, rowIndex, cellIndex, "Must be a valid number");
        }
      });
    });
  
    return errors;
  };
   
  

  const trackChanges = (newData) => {
    if (!previousData) return new Map();

    let changedCells = new Map();
    newData.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const oldCell = previousData[rowIndex + 1]?.[cellIndex]; // Adjust for header row

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

  const markError = (errors, rowIndex, cellIndex, message) => {
    if (!errors.has(rowIndex)) {
      errors.set(rowIndex, new Map());
    }
    errors.get(rowIndex).set(cellIndex, message);
  };
  
  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };
  

  
  const handleUpload = async () => {
    if (!file) {
      setTableData([]); // Clear previous table data
      setSelectedMonthYearData([]); // Ensure other table is hidden
      setSelectedMonth(""); // Reset month selection
      setSelectedYear(""); // Reset year selection
      setIsMonthYearSelected(false); // Reset the toggle state
      setSelectedTable("uploaded"); // Show uploaded table
      setTableData([]); // Clear any previous table data
      setError("❌ Please select a valid file to upload!");
      return;
    }
  

    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/salary/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-api-key": API_KEY,
          },
        }
      );
      alert("✅ File uploaded successfully");
    
  
      if (response.data.success) {
        setTableData(response.data.data);
        setHeaders(Object.keys(response.data[0])); // Extract headers
        setError("");
        setIsFileUploaded(true); // Show the uploaded table
        setIsMonthYearSelected(false); // Hide month-year table
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      setError("❌ Upload failed, table not created. Please try again.");
    }
  };
  
  const [filteredData, setFilteredData] = useState([]);

  



// ✅ Function to display errors in the UI
const displayErrors = (errors) => {
  errors.forEach((error) => {
    alert(`Error in Row ${error.rowIndex + 1}, Column ${error.cellIndex + 1}: ${error.message}`);
  });
};


  const getSalaryColumnIndex = () => {
    return headers.findIndex((header) =>
      header.toLowerCase().includes("salary")
    );
  };
  
  const calculateTotalSalary = () => {
    if (tableData.length === 0) return 0;
  
    const salaryColumnIndex = headers.length - 1; // Last column index
  
    return tableData.reduce((total, row) => {
      const salary = parseFloat(row[salaryColumnIndex]); // Convert to number
      return !isNaN(salary) ? total + salary : total; // Sum only valid numbers
    }, 0);
  };
  
  const getCurrentYear = () => new Date().getFullYear();

  const generateMonthYearOptions = () => {
  const months = [];
  const currentDate = new Date();
  
  // Ensure March is always included as the first month
  let startMonth = "Mar"; 
  let startYear = currentDate.getFullYear();

  months.push({ label: `Mar ${startYear}`, value: `mar_${startYear}` });

  // Generate the previous 5 months
  currentDate.setMonth(currentDate.getMonth() - 1); // Move to February

  for (let i = 0; i < 5; i++) {
    const month = currentDate.toLocaleString("default", { month: "short" });
    const year = currentDate.getFullYear();
    months.push({ label: `${month} ${year}`, value: `${month.toLowerCase()}_${year}` });

    currentDate.setMonth(currentDate.getMonth() - 1); // Move to the previous month
  }

  return months;
};

// Usage
const previousMonths = generateMonthYearOptions();
console.log(previousMonths);

  
const handleMonthYearChange = async (event) => {
  const [month, year] = event.target.value.split("_");
  setSelectedMonth(month);
  setSelectedYear(year);

  setIsMonthYearSelected(true); // Show month-year table
  setIsFileUploaded(false); // Hide uploaded file table
  setError(""); 

  console.log("Selected Month & Year:", month, year); // Debugging
  await fetchSalaryStatement(month, year); // Fetch data
};




const formattedMonth = selectedMonth.toLowerCase(); // Convert to lowercase
const fetchUrl = `${process.env.REACT_APP_BACKEND_URL}/api/salary-statement/${formattedMonth}/${selectedYear}`;

  const fetchSalaryStatement = async (month, year) => {
    if (!month || !year) return;
  
    try {
      const response = await axios.get(
        
          `${process.env.REACT_APP_BACKEND_URL}/api/salary-statement/${month}/${year}`,
          {
              headers: {
                  "x-api-key": API_KEY,
              },
          }
      );
  
      console.log("Salary statement response:", response.data);
  
      if (response.data && response.data.length > 0) {
          setTableData(response.data);
          setHeaders(Object.keys(response.data[0])); // Extract headers from first row
          setError("");
      } else {
          setTableData([]);
      }
  } catch (err) {
      console.error("Error fetching salary statement:", err);
      setError("❌ Failed to fetch salary data. Please try again.");
  }
  
  };
 

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = "Salary_Statement_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSalaryData();
    }
  }, [selectedMonth, selectedYear]); // Fetch data when selectedMonth or selectedYear changes
  
const fetchSalaryData = async () => {
  console.log("Fetching Salary Data for:", selectedMonth, selectedYear); // Debugging

  try {
    const apiUrl = `http://localhost:5000/api/salary-statement/${selectedMonth.toLowerCase()}/${selectedYear}`;
    
    console.log("API Request URL:", apiUrl); // Log API URL

    const response = await axios.get(apiUrl, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    console.log("Full API Response:", response.data); // Log the response

    if (response.data && response.data.salary_statement && response.data.salary_statement.length > 0) {
      setSalaryData(response.data.salary_statement);
      console.log("Salary Data Set:", response.data.salary_statement);
    } else {
      setSalaryData([]); // No data found

      console.warn("⚠ Debug: No salary data found");
    }
  } catch (error) {
    console.error("Error fetching salary data:", error.response?.data || error.message);
    setSalaryData([]); // Clear previous data on error

  }

};
// Filter data based on Employee ID or Employee Name
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







return (
  <div className="salary-container">
    {/* Upload Section */}
    <div className="upload-container">
      {showNote && (
        <p className="file-note">
          📌 Filename format should include <strong>Month-Year</strong> (e.g., <strong>EmpDetails_MAR_2025.xlsx</strong>).
        </p>
      )}
      <div className="upload-box-payslip">
        <label className="file-label">
          <div className="upload-text">
            <p className="upload-title">Upload a Salary Sheet</p>
            <p className="file-name">{fileName || "No file chosen"}</p>
          </div>
          <img src="/images/upload.png" alt="Upload Icon" className="upload-icon" />
          <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} hidden />
        </label>
      </div>


      {/* Month & Year Selector */}
      <div className="salary-month-year-selector-box">
      <div className="salary-month-year-selector">
        <label>Select Month & Year:</label>
        <select value={`${selectedMonth}_${selectedYear}`} onChange={handleMonthYearChange} className="salary-month-year-dropdown">
          {generateMonthYearOptions().map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div></div>

      <div style={{ minHeight: "30px", display: "flex", alignItems: "center" }}>
  {error && <p className="error-message-for-uploadfile">{error}</p>}
</div>
   </div>

    {/* 📌 New Section - Reference File Download */}
    <div class="reference-container">

    <div className="reference-box">
      <p className="reference-text">Template For Your Reference</p>
      <button className="download-template-btn" onClick={handleDownloadTemplate}>
        📥 Download
      </button>
    </div>
    </div>
    {/* Conditionally Render the Correct Table - Show only one table at a time */}
    {tableData.length > 0 ? (
      // Uploaded Table - Shows only when tableData is available
      <div className="table-container">
        <div className="table-scroll-wrapper">
          <div className="table-header">
            <h2 className="table-heading">Employee Data</h2>
            {/* Search Input */}
  <input
    type="text"
    placeholder="Search Employee..."
    value={searchTerm}
    onChange={handleSearch}
    className="admin-search-box"
  />

            <button className="upload-btn" onClick={handleUpload}>Save Data</button>
          </div>

          <table className="salary-table">
            <thead>
            <tr>
      {headers.map((header, colIndex) => (
        <th key={colIndex}>{header}</th>
      ))}
    </tr>
  </thead>
  <tbody>
  {(searchTerm ? filteredData : tableData).map((row, rowIndex) => (
    
    <tr key={rowIndex}>
      {row.map((cell, colIndex) => {
        const hasError = invalidCells.has(rowIndex) && invalidCells.get(rowIndex).has(colIndex);
        const isUpdated = updatedCells.has(rowIndex) && updatedCells.get(rowIndex).has(colIndex);
        const errorMessage = hasError ? invalidCells.get(rowIndex).get(colIndex) : "";

        return (
          <td
            key={colIndex}
            className={`${hasError ? "error-cell" : ""} ${isUpdated ? "updated-cell" : ""}`}
            title={errorMessage} // Show error message on hover
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
              <td colSpan={headers.length} className="sticky-footer">
              Total Amount: {Math.floor(calculateTotalSalary())}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    ) : salaryData.length > 0 ? (
      <div>

        <div className="admin-table-container">
        <div className="table-scroll-wrapper">
          <div className="table-header">
          <h2 className="table-title">Salary Statement - {selectedMonth} {selectedYear}</h2>
          <input
  type="text"
  className="search-box"
  placeholder="Search..."
  onChange={filterSalaryData} // Updated function name
/>

    </div>

      
        <div className="adminsalary-table-container">
  <table className="adminsalary-table">
    <thead>
      <tr>
        {Object.keys(salaryData[0] || {}).map((key) => (
          <th key={key}>{key.toUpperCase()}</th>
        ))}
      </tr>
    </thead>
    <tbody>
  {(searchTerm ? filteredData : salaryData).map((row, index) => (
    <tr key={index}>
      {Object.values(row).map((value, idx) => (
        <td key={idx}>{value ?? "N/A"}</td>
      ))}
    </tr>
  ))}
</tbody>

  </table>
</div>
</div>
</div>
      </div>
    ) : null}

    {/* Upload Message */}
    {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
  </div>
);
}
export default Salary_Statement;
