

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
  
  const [tableHeaders, setTableHeaders] = useState([]);
  const [prevTableData, setPrevTableData] = useState([]); // ✅ Initialize previous data


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
      setFilteredData(tableData); // Reset when input is cleared
      return;
    }

    const employeeIdIndex = tableHeaders.indexOf("Employee ID");
    const employeeNameIndex = tableHeaders.indexOf("Employee Name");

    const filtered = tableData.filter((row) => {
      return row.some((cell, index) => {
        const cellValue = cell.toString().toLowerCase();
        
        // 🔹 Match Employee ID or Employee Name directly
        if (index === employeeIdIndex || index === employeeNameIndex) {
          return cellValue.includes(searchValue);
        }

        return false; // Other columns are ignored for search
      });
    });

    setFilteredData(filtered);
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
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      const sheetName = workbook.SheetNames[0]; // Read first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // 🔹 Check if jsonData is null or empty
      if (!jsonData || jsonData.length === 0) {
        setError("❌ Empty file or invalid format");
        setTableData([]);
        setInvalidCells(new Map());
        setUpdatedCells(new Map());
        return;
      }
  
      // Extract headers from the first row
      const extractedHeaders = jsonData[0];
  
      // 🔹 Ensure headers are valid
      if (!validateHeaders(extractedHeaders)) {
        setError("❌ Headers not matched");
        setTableData([]);
        setInvalidCells(new Map());
        setUpdatedCells(new Map());
        return;
      }
  
      console.log("Extracted Headers:", extractedHeaders);
  
      // 🔹 Filter out null or empty rows
      const validData = jsonData.slice(1).filter(row => row && row.length > 0);
  
      const previousData = prevTableData.length ? prevTableData : validData; // Use validData if first upload

      // 🔹 Validate Data & Get Errors
 // 🔹 Validate Data & Get Errors + Updated Cells
 const { invalidCells, updatedCells } = validateData(validData, extractedHeaders, prevTableData);
  
      // 🔹 Store Data in State
      setTableHeaders(extractedHeaders);
      setTableData(validData);
      setPrevTableData(validData); // ✅ Store the new data for future comparison

      setInvalidCells(invalidCells);
      setUpdatedCells(updatedCells);
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
  const validateData = (jsonData, headers, prevData = []) => {
    const invalidCells = new Map();
    const updatedCells = new Map();
  
    jsonData.forEach((row, rowIndex) => {
      if (!row || !Array.isArray(row)) return;
  
      row.forEach((cell, colIndex) => {
        let isInvalid = false;
        let isUpdated = false;
        let formattedCell = cell; // Store original value before formatting
  
        const columnName = headers[colIndex];
  
        // 🔹 Validate Employee ID
        if (columnName === "Employee ID") {
          const empIdPattern = /^STS\d{3}$/;
          if (!empIdPattern.test(cell)) {
            isInvalid = true;
          }
        }
  
        // 🔹 Validate Text Fields (No Numbers)
        if (["Employee Name", "Department", "Designation"].includes(columnName)) {
          const namePattern = /^[A-Za-z\s.]+$/;
          if (!namePattern.test(cell) || cell.trim() === "") {
            isInvalid = true;
          }
        }
  
        // 🔹 Validate Numeric Fields
        if (
          [
            "UIN Number",
            "Basic Salary",
            "HRA",
            "Allowances",
            "Total Earnings",
            "PF",
            "ESI",
            "PT",
            "TDS",
            "Total Deductions",
            "Net Salary",
          ].includes(columnName)
        ) {
          if (isNaN(cell) || cell === "") {
            isInvalid = true;
          }
        }
  
        // 🔹 Validate and Format "Joining Date"
        if (columnName === "Joining Date") {
          const originalValue = cell;
          formattedCell = convertExcelDate(cell); // Convert Excel date
  
          console.log("📅 Debug: Checking Date Validation", {
            original: originalValue,
            formatted: formattedCell,
          });
  
          if (!formattedCell || !/^\d{4}-\d{2}-\d{2}$/.test(formattedCell)) {
            isInvalid = true;
          } else {
            row[colIndex] = formattedCell; // ✅ Replace with formatted date
          }
        }
  
        // ✅ Compare the formatted value correctly
        if (prevData[rowIndex]) {
          let prevCell = prevData[rowIndex][colIndex];
  
          // Convert previous date if it's an Excel number format
          if (columnName === "Joining Date" && !/^\d{4}-\d{2}-\d{2}$/.test(prevCell)) {
            prevCell = convertExcelDate(prevCell);
          }
  
          // ✅ Check if the values are different before marking as updated
          if (prevCell !== formattedCell) {
            isUpdated = true;
          }
        }
  
        // 🔹 Track Invalid Cells (Red)
        if (isInvalid) {
          if (!invalidCells.has(rowIndex)) invalidCells.set(rowIndex, new Set());
          invalidCells.get(rowIndex).add(colIndex);
        }
  
        // 🔹 Track Updated Cells (Green)
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
  

const convertExcelDate = (excelDate) => {
  if (!excelDate || excelDate === "") return ""; // 🔹 Return empty for invalid values

  // 🔹 If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
      return excelDate;
  }

  // 🔹 Ensure it's a valid number before converting
  const numericDate = Number(excelDate);
  if (isNaN(numericDate) || numericDate < 0) {
      console.error("🚨 Invalid Excel Date:", excelDate);
      return ""; // Return empty to avoid errors
  }

  // 🔹 Convert from Excel date format (starting from 1899-12-30)
  const date = new Date((numericDate - 25569) * 86400000);
  
  // 🔹 Ensure the date is valid
  if (isNaN(date.getTime())) {
      console.error("🚨 Error: Invalid date conversion for", excelDate);
      return "";
  }

  return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
};


      
  
    
  
  
  // Helper function to store errors
  const markError = (errors, rowIndex, colIndex, message) => {
    if (!errors.has(rowIndex)) {
      errors.set(rowIndex, new Map()); 
    }
    errors.get(rowIndex).set(colIndex, message);
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

  
  
  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };
  

  
  const handleUpload = async () => {
    console.log("📂 handleUpload() called. Checking file...");

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
  
    const { invalidCells } = validateData(tableData, tableHeaders);

console.log("🚨 Debug: Invalid Cells Before Upload:", invalidCells); // Debug log

// ✅ Fix condition to check Map correctly
if (invalidCells && invalidCells.size > 0) {
    setError("❌ Data contains errors. Please correct highlighted fields before uploading.");
    return;
} else {
    console.log("✅ No invalid cells found.");
    setError(""); // ✅ Clear error if no invalid cells
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
    console.log("🔹 Function Called!");
  
    if (!tableData || tableData.length === 0) {
      console.log("❌ tableData is empty!");
      return 0;
    }
    if (!tableHeaders || tableHeaders.length === 0) {
      console.log("❌ tableHeaders is empty!");
      return 0;
    }
  
    console.log("🔹 Headers:", tableHeaders);
    console.log("🔹 Table Data:", tableData);
  
    // ✅ Find "Net Salary" column index
    const netSalaryIndex = tableHeaders.findIndex(
      (header) => header.trim().toLowerCase() === "net salary"
    );
  
    console.log("🔹 Net Salary Index:", netSalaryIndex);
    if (netSalaryIndex === -1) {
      console.log("❌ 'Net Salary' column not found in headers!");
      return 0;
    }
  
    // ✅ Calculate Total Salary
    let total = 0;
    tableData.forEach((row, rowIndex) => {
      console.log(`🔹 Row ${rowIndex}:`, row);
      
      const salary = parseFloat(row[netSalaryIndex]?.toString().replace(/,/g, "")); // Convert to number
      if (!isNaN(salary)) {
        total += salary;
        console.log(`✅ Adding Salary: ${salary}`);
      } else {
        console.log(`❌ Invalid Salary in row ${rowIndex}:`, row[netSalaryIndex]);
      }
    });
  
    console.log("🔹 Final Total Salary:", total);
    return total;
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
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/salary-statement/${selectedMonth.toLowerCase()}/${selectedYear}`;
    
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
    <div className="reference-container">
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
      {tableHeaders.map((header, index) => (
        <th key={index}>{header}</th>
      ))}
    </tr>
  </thead>
  
  <tbody>
  
  {(searchTerm ? filteredData : tableData).map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, colIndex) => { // ✅ Corrected: Ensure colIndex is defined here
          const isInvalid = invalidCells.has(rowIndex) && invalidCells.get(rowIndex).has(colIndex); // ✅ Fix here
          const isUpdated = updatedCells.has(rowIndex) && updatedCells.get(rowIndex).has(colIndex);

          return (
            <td key={colIndex} style={{ 
              backgroundColor: isInvalid ? "red" : isUpdated ? "lightgreen" : "white"
          }}>
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
      Total Amount: {calculateTotalSalary()} {/* Call the function */}
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
  className="salary-search-box"
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
