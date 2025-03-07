
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "./Salary_Statement.css";
import { VALID_SALARY_HEADERS } from "../constants/salarystatement"; // Adjust the path as needed

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


  const validateHeaders = (uploadedHeaders) => {
    const formattedUploadedHeaders = uploadedHeaders.map((header) =>
      header.trim().toLowerCase()
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

      const uploadedHeaders = parsedData[0]; // Extract headers

      if (!validateHeaders(uploadedHeaders)) {
        setError("❌ Incorrect headers. Please upload a valid salary statement.");
        setTableData([]);
        return;
      }
  
      setHeaders(uploadedHeaders);
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
        if (columnTypes[cellIndex] === "integer" && isNaN(cell)) {
          markError(errors, rowIndex, cellIndex);
        } else if (columnTypes[cellIndex] === "date" && !isValidDate(cell)) {
          markError(errors, rowIndex, cellIndex);
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

  const markError = (errors, rowIndex, cellIndex) => {
    if (!errors.has(rowIndex)) {
      errors.set(rowIndex, new Set());
    }
    errors.get(rowIndex).add(cellIndex);
  };

  const isValidDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("❌ No file selected!");
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
  
      console.log("Upload Response:", response.data);
      alert("✅ File uploaded successfully");
      
    } catch (error) {
      console.error("Upload Error:", error.response ? error.response.data : error.message);
      setError("❌ Upload failed table not created. Please try again.");
    }
  };
  
  const filteredData = tableData.slice(1).filter((row) =>
    row.some((cell) =>
      cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );




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
  



  return (
    <div className="salary-container">
    <div className="upload-container">
    {showNote && (
      <p className="file-note">
        📌 Filename format should include <strong>Month-Year</strong> (e.g., <strong>EmpDetails_MAR_2025.xlsx</strong>).
      </p>
    )}
  <div className="upload-box-payslip">
  
    <label className="file-label">
      <div className="upload-text">
        <p className="upload-title">Click here to choose file</p>
        <p className="file-name">{fileName || "No file chosen"}</p>

      </div>
      <img src="/images/upload.png" alt="Upload Icon" className="upload-icon" />
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} hidden />
    </label>
  </div>
  {error && <p className="error-message">{error}</p>}
</div>


      {tableData.length > 0 && (
        <div className="search-upload-container">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
          </div>
    )}

      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}

      {tableData.length > 0 && (
        <div className="table-container">
        <div className="table-scroll-wrapper">
          <div className="table-header">
            <h2 className="table-heading">Employee Data</h2>
            <button className="upload-btn" onClick={handleUpload}>Save Data</button>
          </div>
      
          <table className="salary-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(searchQuery ? filteredData : tableData).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        invalidCells.has(rowIndex) &&
                        invalidCells.get(rowIndex).has(cellIndex)
                          ? "invalid-cell"
                          : updatedCells.has(rowIndex) &&
                            updatedCells.get(rowIndex).has(cellIndex)
                          ? "updated-cell"
                          : ""
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={headers.length} style={{ fontWeight: "bold", textAlign: "left" }}>
                Total Amount: {Math.floor(calculateTotalSalary())}
                </td>
              </tr>
            </tfoot>
          </table>
        
      
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary_Statement;

