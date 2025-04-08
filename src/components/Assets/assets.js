


import React, { useState,useEffect } from "react";
import "./assets.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserCheck } from "lucide-react"; // Import the icon
import { Eye } from "lucide-react"; // Import the icon
import { FaNetworkWired } from "react-icons/fa";
import { Monitor, Wrench, Package } from "lucide-react";
import { GiOfficeChair, GiTable, GiArchiveRegister } from "react-icons/gi"; // Chair, Table, Cabinet
import { Laptop2, Computer, Server } from "lucide-react"; // Import icons
import {  FaDesktop, FaServer } from "react-icons/fa"; // Font Awesome Icons
import { FaChair } from "react-icons/fa"; // New Chair Icon
import { MdStorage } from "react-icons/md"; // Correct Drawers Icon
import { FaHdd, FaMouse, FaPlug, FaTools } from "react-icons/fa"; // Import necessary icons
import { MdLaptop } from "react-icons/md"; // Import filled laptop icon

import {  Download } from "lucide-react";
import Modal from "../Modal/Modal";
import { TableProperties, Chair, Archive, Plug, Hammer } from 'lucide-react';

import { Boxes } from 'lucide-react';
import { LayoutPanelLeft, LayoutDashboard } from 'lucide-react';
import { MdOutlineCancel } from "react-icons/md";


const Assets = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [assetName, setAssetName] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [valuationDate, setValuationDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [document, setDocument] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [assets, setAssets] = useState([]); // Store fetched assets
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [comments, setComments] = useState("");

  const [assigningStatus, setAssigningStatus] = useState("Pending");
  const [status, setStatus] = useState("In Use"); // Default status

  const [assignedAssets, setAssignedAssets] = useState([]); // New state to store assigned assets
const [popupSuggestions, setPopupSuggestions] = useState({});


  const togglePopup = () => setShowPopup(!showPopup);


  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignments, setAssignments] = useState([]); // Initialize state for assignments

  const [assignmentRowsByAsset, setAssignmentRowsByAsset] = useState({});



  // NEW STATE FOR SEARCH
const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);


const [popupMessage, setPopupMessage] = useState("");


const showAlert = (message, title = "") => {
  setAlertModal({ isVisible: true, title, message });
};

const closeAlert = () => {
  setAlertModal({ isVisible: false, title: "", message: "" });
};
const [alertModal, setAlertModal] = useState({
  isVisible: false,
  title: "",
  message: "",
});
const handleAssignedToChange = async (e) => {
  const value = e.target.value;
  setAssignedTo(value);
  console.log("🔍 Typing:", value);

  if (value.length >= 1) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/search-employees?q=${value}`,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      // Only keep the names from response
      const namesOnly = response.data.data.map(emp => emp.name);
      setEmployeeSuggestions(namesOnly);
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
    }
  } else {
    setEmployeeSuggestions([]);
  }
};



const handleSelectSuggestion = (name) => {
  setAssignedTo(name);
  setEmployeeSuggestions([]); // Hide suggestions
};

const handleAssignedToInputChange = async (e, index) => {
  const value = e.target.value;
  updateAssignment(index, "assignedTo", value);

  if (value.length >= 1) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/search-employees?q=${value}`,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const names = response.data.data.map((emp) => emp.name);
      setPopupSuggestions((prev) => ({ ...prev, [index]: names }));
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  } else {
    setPopupSuggestions((prev) => ({ ...prev, [index]: [] }));
  }
};
const handleSuggestionSelect = (name, index) => {
  updateAssignment(index, "assignedTo", name);
  setPopupSuggestions((prev) => ({ ...prev, [index]: [] }));
};

  
  useEffect(() => {
    setAssignedTo("");
    fetchAssets();
    fetchAssignedAssets(); // Fetch assigned assets
    
  }, []);


  const { assetId } = useParams(); // Get assetId from the URL
  // useEffect(() => {
  //   const fetchAssignedAssets = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:5000/api/assets/assigned/FUR-TBL-002",
  //         {
  //           headers: {
  //             "Content-Type": "Application/JSON", // Ensure correct content type
  //             "x-api-key": API_KEY, // If needed
  //           },
  //         }
  //       );
  //       console.log("✅ Assigned Assets:", response.data);
  //       setAssignedAssets(response.data[0]?.assignments || []);
  //     } catch (error) {
  //       console.error("❌ Error fetching assigned assets:", error);
  //     }
  //   };
    
  
  //   fetchAssignedAssets();
  // }, []);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  useEffect(() => {
    if (assetId) {

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,  // Use the API key in the header
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch assignments");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length > 0 && data[0].assignments) {
                setAssignments(data[0].assignments);
            } else {
                setAssignments([]);
            }
        })
        .catch((error) => console.error("Error fetching assignment data:", error));
    }
}, [assetId]);

  


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("");
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const [assetsResponse, assignmentsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/list`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/assignments`)
        ]);
        setAssets(assetsResponse.data);
        setAssignedAssets(assignmentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchAssignments();
  }, []);
  


  const fetchAssets = async () => {
    try {
      console.log("Fetching assets...");
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/list`, {
        headers: {
          "Content-Type": "Application/JSON", // Ensure correct content type
          "x-api-key": API_KEY, // If needed
        },
      });
      
  
  
      console.log("✅ Fetched Assets:", response.data);
      setAssets(response.data);
    } catch (error) {
      console.error("❌ Error fetching assets:", error.response?.data || error.message);
      showAlert("Failed to fetch assets. See console.");
    }
  };

  const resetForm = () => {
    setAssignedTo('');
    setStartDate('');
    setReturnDate('');
    setComments('');
    setAssigningStatus('Pending');
  };

  const closePopup = () => {
    resetForm(); // Clear form when closing popup
    closeAssignPopup(); // Close the popup
  };
  const viewDocument = async (path) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/uploads/${path}`, {
            headers: { "x-api-key": API_KEY },
            responseType: "blob", // Ensure the file is treated as a blob
        });

        // Create a URL and open the document
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        window.open(fileURL, "_blank");
    } catch (error) {
        console.error("Error opening document:", error.response?.data || error.message);
        showAlert("Failed to open document. Check console logs.");
    }
};
// const openAssignPopup = (asset) => {
//   const assetId = asset.id;

//   setSelectedAsset(asset); // Store full asset details
//   setSelectedAssetId(assetId); // Store ID if needed elsewhere

//   try {
//     let parsed = [];

//     if (asset.assigned_to) {
//       parsed = typeof asset.assigned_to === "string"
//         ? JSON.parse(asset.assigned_to)
//         : asset.assigned_to;
//     }

//     // Store the full list of assignment rows for this asset
//     setAssignmentRowsByAsset((prev) => ({
//       ...prev,
//       [assetId]: parsed.length
//         ? parsed
//         : [{
//             assignedTo: "",
//             startDate: "",
//             returnDate: "",
//             status: "Pending",
//             comments: ""
//           }]
//     }));
//   } catch (err) {
//     console.error("Error parsing assigned_to:", err);
//     // Default to 1 empty row
//     setAssignmentRowsByAsset((prev) => ({
//       ...prev,
//       [assetId]: [{
//         assignedTo: "",
//         startDate: "",
//         returnDate: "",
//         status: "Pending",
//         comments: ""
//       }]
//     }));
//   }

//   // Reset controlled states (if you're using individual states)
//   setAssignedTo("");
//   setStartDate("");
//   setReturnDate("");
//   setComments("");
//   setAssigningStatus("Pending");

//   // Show popup
//   setShowAssignPopup(true);
// };
const openAssignPopup = (asset) => {
  const assetId = asset.id;
  setSelectedAssetId(assetId);

  try {
    let parsed = [];
    if (asset.assigned_to) {
      parsed = typeof asset.assigned_to === "string" ? JSON.parse(asset.assigned_to) : asset.assigned_to;
    }

    // 🟢 Map backend "name" to frontend "assignedTo"
    const formattedAssignments = parsed.length
      ? parsed.reverse().map((a) => ({
          assignedTo: a.name || "",
          startDate: a.startDate || "",
          returnDate: a.returnDate || "",
          assigningStatus: a.status || "Assigned",
          comments: a.comments || "",
        }))
      : [
          {
            assignedTo: "",
            startDate: "",
            returnDate: "",
            assigningStatus: "Pending",
            comments: "",
          },
        ];

    setAssignmentRowsByAsset((prev) => ({
      ...prev,
      [assetId]: formattedAssignments,
    }));
  } catch (err) {
    console.error("Error parsing assigned_to:", err);
  }

  setShowAssignPopup(true);
  setSelectedAsset(asset);
};


const closeAssignPopup = () => {
  setShowAssignPopup(false);
  setSelectedAsset(null);
  setAssignedTo("");
  setStartDate("");
  setReturnDate("");
  setComments("");
  setAssigningStatus("Pending");
  
};
const formatDate = (date) => {
  if (!date) return ""; // Handle empty dates
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
};


// const handleAssign = async () => {
//   const assetAssignment = {
//     assetId: selectedAsset?.asset_id || "",
//     name: assignedTo?.name || assignedTo, // Ensure name is a string
//     startDate: formatDate(startDate),  // Convert date format
//     returnDate: formatDate(returnDate), // Convert date format
//     comments: comments || "", // Ensure comments are not undefined
//     status: assigningStatus || "Pending",
//   };
  

//   try {
//     const response = await fetch("http://localhost:5000/api/assets/assign", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": API_KEY, // Add API Key here

//       },
//       body: JSON.stringify(assetAssignment),
//     });

//     const data = await response.json();
//     if (response.ok) {
      
//       closeAssignPopup();
//     }
//      else {
//       alert(`Error: ${data.message}`);
//     }
//     alert("Asset assigned successfully!");
//       fetchAssets(); // Refresh data after assigning
//   } catch (error) {
//     console.error("Error assigning asset:", error); // Log the full error object
//     alert(`Error assigning asset: ${error.response?.data?.message || error.message || "Unknown error"}`);
//   }
  
// };
const [fieldErrors, setFieldErrors] = useState({});

// const handleAssign = async () => {
//   const rows = assignmentRowsByAsset[selectedAssetId] || [];
//   const errors = {};
//   let hasValidRow = false;

//   console.log("🧾 Assignment Rows:", rows);

//   rows.forEach((row, index) => {
//     const rowErrors = {};

//     const assignedToValue =
//       typeof row.assignedTo === "string"
//         ? row.assignedTo.trim()
//         : row.assignedTo?.name?.trim?.() || "";

//     const startDateValue = row.startDate
//       ? typeof row.startDate === "string"
//         ? row.startDate.trim()
//         : row.startDate.toString().trim()
//       : "";

//     const statusValue = row.status?.toString().trim() || "";

//     console.log(`Row ${index + 1}:`, {
//       assignedToValue,
//       startDateValue,
//       statusValue,
//     });

//     if (!assignedToValue) rowErrors.assignedTo = true;
//     if (!startDateValue) rowErrors.startDate = true;
//     if (!statusValue) rowErrors.status = true;

//     if (Object.keys(rowErrors).length > 0) {
//       errors[index] = rowErrors;
//     } else {
//       hasValidRow = true;
//     }
//   });

//   setFieldErrors(errors);

//   if (!hasValidRow) {
//     alert("Please fill at least one complete assignment row.");
//     return;
//   }

//   const validAssignments = rows
//     .filter(row => {
//       const assignedToValue =
//         typeof row.assignedTo === "string"
//           ? row.assignedTo.trim()
//           : row.assignedTo?.name?.trim?.() || "";

//       const startDateValue = row.startDate
//         ? typeof row.startDate === "string"
//           ? row.startDate.trim()
//           : row.startDate.toString().trim()
//         : "";

//       const statusValue = row.status?.toString().trim() || "";

//       return assignedToValue && startDateValue && statusValue;
//     })
//     .map(row => ({
//       assetId: selectedAsset?.asset_id || "",
//       name:
//         typeof row.assignedTo === "string"
//           ? row.assignedTo.trim()
//           : row.assignedTo?.name?.trim(),
//       startDate: formatDate(row.startDate),
//       returnDate: row.returnDate ? formatDate(row.returnDate) : null,
//       comments: row.comments || "",
//       status: row.status,
//     }));

//   console.log("✅ Valid Assignments to Submit:", validAssignments);

//   if (validAssignments.length === 0) {
//     alert("Please fill at least one complete assignment row.");
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:5000/api/assets/assign", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": API_KEY,
//       },
//       body: JSON.stringify({ assignments: validAssignments }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert("Assets assigned successfully!");
//       closeAssignPopup();
//       fetchAssets();
//     } else {
//       alert(`Error: ${data.message}`);
//     }
//   } catch (error) {
//     console.error("❌ Error assigning asset:", error);
//     alert("Failed to assign assets.");
//   }
// };

const handleAssign = async () => {
  try {
    const rows = assignmentRowsByAsset[selectedAssetId];

    if (!rows || rows.length === 0 || !rows[0].assignedTo) {
      console.error("❌ First row is empty or missing required data");
      return;
    }

    const firstAssignment = {
      assetId: selectedAsset?.asset_id,
      assignedTo: rows[0].assignedTo,
      startDate: rows[0].startDate,
      returnDate: rows[0].returnDate,
      status: rows[0].assigningStatus,
      comments: rows[0].comments || "",
    };

    // ✅ Check for missing values
    // ✅ Check for required fields (excluding optional returnDate)
const requiredFields = ["assetId", "assignedTo", "startDate", "status"];
for (const field of requiredFields) {
  if (!firstAssignment[field]) {
    console.error(`❌ Missing value for "${field}"`);
    openPopup(`Missing value for "${field}"`);

    return;
  }
}

// Set returnDate to null if not provided
if (!firstAssignment.returnDate) {
  firstAssignment.returnDate = null;
}


    console.log("📤 Sending First Assignment:", firstAssignment);

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/assets/assign`,
      firstAssignment,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      }
    );

    console.log("✅ Assigned successfully", response.data);
    showAlert("Asset Assigned successfully ");
    closeAssignPopup();
    fetchAssets();
  } catch (error) {
    console.error("❌ Error assigning asset:", error.response?.data || error.message);
    showAlert(error.response?.data?.error || "Assignment failed");
  }
};

const handleDownloadDocument = async (documentPath) => {
  if (!documentPath) {
    showAlert("No document available.");
    return;
  }

  try {
    const fileName = documentPath.split("/").pop();

    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/assets/download/${fileName}`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // ✅ Make sure 'document' is NOT redeclared or overwritten anywhere above
    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading document:", error);
    showAlert("Failed to download file. See console.");
  }
};

const handleViewDocument = async (documentPath) => {
  if (!documentPath) {
    showAlert("No document available.");
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/${documentPath.replace(/^\/?uploads\//, "uploads/")}`, {
      headers: {
        "x-api-key": API_KEY, // Send API key
      },
      responseType: "blob", // Ensure it's treated as a file
    });

    // Create a URL and open the document
    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Error opening document:", error.response?.data || error.message);
    showAlert("Failed to open document. Check console logs.");
  }
};



  const handleSave = async () => {
    if (!assetName || !configuration || !valuationDate ) {
      showAlert("Please fill all required fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append("asset_name", assetName);
    formData.append("configuration", configuration);
    formData.append("valuation_date", valuationDate);
    formData.append("assigned_to", JSON.stringify([{ name: assignedTo || "STS" }]));
    formData.append("category", selectedCategory);
    formData.append("sub_category", selectedSubCategory);
    formData.append("status", status); // Make sure status is included

    if (document) {
      formData.append("document", document);
    }
  
    // Debugging: Log FormData before sending
    console.log("Sending FormData...");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/assets/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
            "x-api-key": API_KEY, // If needed
          },
        }
      );
  
      console.log("Server Response:", response.data);
      showAlert("Asset saved successfully!");
      togglePopup(); // Close popup after save
      fetchAssets(); // Refresh table after adding an asset

    } catch (error) {
      console.error("Error saving asset:", error); // Log the full error object
      showAlert(`Failed to save asset: ${error.response?.data?.message || error.message || "Unknown error"}`);
    }
    
  };
;

  useEffect(() => {
    fetchAssignedAssets();
  }, []);

  const fetchAssignedAssets = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (response.data && response.data.length > 0) {
        setAssignedAssets(response.data);
      } else {
        setAssignedAssets([]);
      }
    } catch (error) {
      console.error("Error fetching assigned assets:", error.response?.data || error.message);
    }
  };

useEffect(() => {
    if (selectedAsset) {
      fetchAssignedData(selectedAsset.asset_id);
    }
  }, [selectedAsset]);
  const fetchAssignedData = async (assetId) => {
    try {
      if (!assetId) {
        console.error("❌ Asset ID is undefined or missing.");
        return; // Stop execution if assetId is undefined
      }
  
      const API_KEY = "eeb8ddcfdf985823f17b55554844d972eb67eb6c4606a631e9372ac77d9f24d3";
      console.log(`📡 Fetching data for Asset ID: ${assetId}`);
  
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
  
      if (response.data.length === 0) {
        console.warn("⚠ No assignments found for this asset.");
        setAssignedAssets([]); // Clear previous data
        return;
      }
  
      console.log("✅ Assigned Asset Data:", response.data);
      setAssignedAssets(response.data[0]?.assignments || []);
    } catch (error) {
      console.error("❌ Error fetching assignment data:", error.response?.data || error);
    }
  };
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    assetId: '',
    employeeName: '',
    returnDate: '',
  });

  

  // Handle input changes for formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Dynamically set the key and value based on input name
    }));
  };
  
  const handleAssignmentChange = (index, field, value) => {
    setAssignmentRowsByAsset(prev => {
      const updated = [...prev[selectedAssetId]];
      updated[index][field] = value;
      return { ...prev, [selectedAssetId]: updated };
    });
  };
  
  const handleSaveReturnDate = async () => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/assets/return-date`, {
            assetId: formData.assetId,
            employeeName: formData.employeeName,
            returnDate: formData.returnDate,
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            }
        });

        console.log('📤 Response from Backend:', response.data);

        showAlert('Return date updated successfully!');

        // Update UI: Change status to "Returned"
        setAssets((prevAssets) =>
            prevAssets.map((asset) =>
                asset.assetId === formData.assetId
                    ? { ...asset, status: response.data.updatedStatus || 'Returned', returnDate: formData.returnDate }
                    : asset
            )
        );

        setFormData({ assetId: '', employeeName: '', returnDate: '' });
        setShowForm(false);
    } catch (error) {
        console.error('❌ Error updating return date:', error);
        showAlert('Failed to update return date. Please try again.');
    }
};

  
const [assetCounts, setAssetCounts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/assets/counts`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    }) 
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAssetCounts(data.data);
        } else {
          console.error("Failed to fetch asset counts");
        }
      })
      .catch((error) => console.error("Error fetching asset counts:", error));
  }, []);

  


  
  
  const submitAssignments = async () => {
    try {
      const response = await fetch('/api/assets/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignments), // assuming 'assignments' is your state
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit assignments');
      }
  
      const result = await response.json();
      console.log('Assignments submitted:', result);
      showAlert('Assets assigned successfully!');
    } catch (error) {
      console.error('Error submitting assignments:', error);
      showAlert('Failed to assign assets. Please try again.');
    }
  };
  


  const addAssignmentRow = () => {
    const currentRows = assignmentRowsByAsset[selectedAssetId] || [];
  
    // If there's at least one row, validate the top row first
    if (currentRows.length > 0) {
      const topRow = currentRows[0];
  
      const isFilled =
        topRow.assignedTo &&
        topRow.startDate &&
        topRow.returnDate &&
        topRow.assigningStatus &&
        topRow.comments;
  
      if (!isFilled) {
        showAlert("Please fill out the current top row before adding a new one.");
        return;
      }
    }
  
    const newRow = {
      assignedTo: "",
      startDate: "",
      returnDate: "",
      assigningStatus: "Pending",
      comments: "",
    };
  
    setAssignmentRowsByAsset((prev) => ({
      ...prev,
      [selectedAssetId]: [newRow, ...(prev[selectedAssetId] || [])],
    }));
  };
    
  const updateAssignment = (index, field, value) => {
    setAssignmentRowsByAsset((prev) => {
      const updatedRows = [...(prev[selectedAssetId] || [])];
      updatedRows[index] = {
        ...updatedRows[index],
        [field]: value,
      };
      return {
        ...prev,
        [selectedAssetId]: updatedRows,
      };
    });
  };
  
  
  useEffect(() => {
    if (  assetId) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0 && Array.isArray(data[0].assignments)) {
            const formattedAssignments = parsed.length
  ? parsed.reverse().map((a) => ({
      assignedTo: a.name || "",
      startDate: a.startDate || "",
      returnDate: a.returnDate || "",
      assigningStatus: a.status || "Assigned",  // Use assigningStatus for the form
      comments: a.comments || "",
    }))
  : [
      {
        assignedTo: "",
        startDate: "",
        returnDate: "",
        assigningStatus: "Pending",
        comments: "",
      },
    ];

            setAssignments(formattedAssignments);
          }
        });
    }
  }, [assetId]);



const handleBlur = () => {
  if (!employeeSuggestions.includes(assignedTo)) {
    setAssignedTo(""); // or keep last valid selection
  }
};
const groupedAssetCounts = assetCounts.reduce((acc, item) => {
  const { category, sub_category, sub_category_count, category_total, total_assets } = item;

  if (!acc[category]) {
    acc[category] = {
      categoryTotal: category_total,
      subcategories: []
    };
  }

  acc[category].subcategories.push({ sub_category, sub_category_count });
  return acc;
}, {});






  



  return (
    <div className="assets-container">
    

    <div className="asset-summary-buttons2">
  <div className="left-buttons">

    {/* ✅ Total Assets First */}
    <div className="total-assets-box">
      <strong>Total Assets:</strong>{" "}
      <span>{assetCounts.length > 0 ? assetCounts[0].total_assets : "0"}</span>
    </div>

    {/* ✅ Then category buttons */}
    {Object.entries(groupedAssetCounts).map(([category, data]) => (
      <div className="category-button-wrapper" key={category}>
        <button className="category-button">
          {category} ({data.categoryTotal})
        </button>
        <div className="subcategory-tooltip">
          {data.subcategories.map((sub, i) => (
            <div className="subcategory-item" key={i}>
              {sub.sub_category} {sub.sub_category_count}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>



  <div className="right-button">
    <button className="add-assets-btn" onClick={togglePopup}>
      <FaNetworkWired style={{ marginRight: "5px" }} />
      Add New Asset
    </button>
  </div>
</div>



      {showPopup && (
        <div className="asset-popup-overlay">
          <div className="asset-popup-content">
            <div className="asset-popup-header">New Asset</div>
            <button className="close-btn-addasset" onClick={togglePopup}><MdOutlineCancel className="assetmain-close-popup-icon" /></button>

            {/* Main Categories */}
            <div className="sticky-options">
              <button className={selectedCategory === "System" ? "active" : ""} onClick={() => handleCategoryChange("System")}> <div className="icon-group">  <Monitor className="icon" /> <span>    System</span></div> </button>
              <button className={selectedCategory === "Furniture" ? "active" : ""} onClick={() => handleCategoryChange("Furniture")}><div className="icon-group"><GiOfficeChair className="icon" /></div><span>Furniture</span></button>
              <button className={selectedCategory === "Equipment" ? "active" : ""} onClick={() => handleCategoryChange("Equipment")}><div className="icon-group"><Wrench className="icon" /></div>Equipment</button>
              <button className={selectedCategory === "Others" ? "active" : ""} onClick={() => handleCategoryChange("Others")}><Package className="icon" />Others</button>
            </div>
            
            {/* Sub-options based on selected category */}
            {selectedCategory === "System" && (
              <div className="sticky-suboptions">
                <button className={selectedSubCategory === "Laptop" ? "active" : ""} onClick={() => setSelectedSubCategory("Laptop")}>    <MdLaptop className="icon" />  Laptop</button>
                <button className={selectedSubCategory === "Desktop" ? "active" : ""} onClick={() => setSelectedSubCategory("Desktop")}>           <FaDesktop className="icon" />Desktop</button>
                <button className={selectedSubCategory === "Server" ? "active" : ""} onClick={() => setSelectedSubCategory("Server")}>       <Server className="icon" />Server</button>
              </div>
            )}

            {selectedCategory === "Furniture" && (
              <div className="sticky-suboptions">
                <button className={selectedSubCategory === "Table" ? "active" : ""} onClick={() => setSelectedSubCategory("Table")}>      <GiTable className="icon" />    Table</button>
                <button className={selectedSubCategory === "Chair" ? "active" : ""} onClick={() => setSelectedSubCategory("Chair")}>    <FaChair className="icon" />                Chair</button>
                <button className={selectedSubCategory === "Drawers" ? "active" : ""} onClick={() => setSelectedSubCategory("Drawers")}>           <MdStorage className="icon" />Drawers</button>
                <button className={selectedSubCategory === "cupboard" ? "active" : ""} onClick={() => setSelectedSubCategory("cupboard")}>           <LayoutPanelLeft className="icon" /> Cupboard</button>

                
              </div>
            )}

            {selectedCategory === "Equipment" && (

              <div className="sticky-suboptions">
                <button className={selectedSubCategory === "Electrical" ? "active" : ""} onClick={() => setSelectedSubCategory("Electrical")}><Plug className="icon" /><span>Electrical</span></button>
                <button className={selectedSubCategory === "Non-Electrical" ? "active" : ""}  onClick={() => setSelectedSubCategory("Non-Electrical")}><Hammer className="icon" /><span>Non-Electrical</span></button>
                 </div>
              
            )}

            {/* Asset Details Form (Shown only when a sub-category is selected) */}
            {selectedSubCategory || selectedCategory === "Others" ? (
  <div className="asset-details-grid">
    <div className="row">
      <label>Asset Name</label>
      <input type="text" placeholder="Enter Asset Name" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
      </div>

    <div className="row">
      <label>Configuration</label>
      <input type="text" placeholder="Enter Configuration" value={configuration} onChange={(e) => setConfiguration(e.target.value)} />
      </div>

    <div className="row">
      <label>Purchased Date</label>
      <input type="date" value={valuationDate} onChange={(e) => setValuationDate(e.target.value)} />
      </div>

<div className="row" style={{ position: "relative" }}>
  <label>Assigned To</label>
  <input
    type="text"
    placeholder="Enter Assignee Name"
    value={assignedTo}
    onChange={handleAssignedToChange}
    onBlur={handleBlur} 
    autoComplete="off"
  />

  {employeeSuggestions.length > 0 && (
    <ul
      style={{
    position: "absolute",
    top: "100%",
        left: "160px", // 👈 moves box to the right

    right: 0, // 👈 shifts box to the right
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    zIndex: 999,
    maxHeight: "150px",
    overflowY: "auto",
    listStyle: "none",
    padding: "0",
    margin: "0",
    width: "100%", // matches input
    maxWidth: "250px", // optional
  }}
    >
      {employeeSuggestions.map((name, index) => (
        <li
          key={index}
          onClick={() => handleSelectSuggestion(name)}
          style={{
            padding: "8px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          {name}
        </li>
      ))}
    </ul>
  )}
</div>



      <div className="row">
  <label>Status</label>
  <div className="asset-status-dropdown">
    <select value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="In Use">In Use</option>
      <option value="Not Using">Not Using</option>
      <option value="Decommissioned">Decommissioned</option>
    </select>
  </div>
</div>

    <div className="row">
      <label>Upload Document</label>
      <input type="file" onChange={handleFileChange} />
      </div>
      <div className="popup-buttons">
              <button onClick={togglePopup} className="cancel-btn">Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
  </div>
  
) : null}


            {/* Popup Buttons */}
            
          </div>
        </div>
      )}

      
      {/* Display Assets in Table */}
      <div className="assets-table">
        <table>
          <thead>
            <tr>
              <th>Asset_ID</th>
              <th>Asset Name</th>
              <th>Configuration</th>
              <th>Purchased Date</th>
              <th>Assigned To</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Status</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
<tr
  key={asset.id}
  style={{
    backgroundColor: (() => {
      try {
        const assignedData =
          typeof asset.assigned_to === "string"
            ? JSON.parse(asset.assigned_to)
            : asset.assigned_to;

        if (Array.isArray(assignedData) && assignedData.length > 0) {
          const latestAssignment = assignedData[assignedData.length - 1];
          if (latestAssignment.status === "Decommissioned") {
            return "#e7d9d9"; // Light red background for decommissioned rows
          }
        }
      } catch (error) {
        console.error("Row style JSON parse error:", error);
      }
      return "transparent"; // default row background
    })(),
  }}
>
                  <td> {asset.asset_id}</td>
                  <td>{asset.asset_name}</td>
                  <td>{asset.configuration}</td>
                  <td>{new Date(asset.valuation_date).toISOString().split("T")[0]}</td>
                  <td>
                  <td className="assigned-to-cell">
                             <span className="assigned-name">  {(() => {
    if (!asset.assigned_to || asset.assigned_to === "") return "Unassigned";

    try {
      // Parse JSON if stored as a string
      const assignedData = typeof asset.assigned_to === "string"
        ? JSON.parse(asset.assigned_to)
        : asset.assigned_to;

      // If it's an object, return the name
      if (typeof assignedData === "object" && !Array.isArray(assignedData)) {
        return assignedData.name || "Unassigned";
      }

      // If it's an array, return the last assigned person's name
      if (Array.isArray(assignedData) && assignedData.length > 0) {
        return assignedData[assignedData.length - 1].name || "Unassigned";
      }

      return "Unassigned";
    } catch (error) {
      // console.error("JSON Parsing Error:", error);
      return "Unassigned";
    }
  })()}
     </span>
  <button
  className="editassign-btn"
  onClick={() => {
    try {
      const assignedData =
        typeof asset.assigned_to === "string"
          ? JSON.parse(asset.assigned_to)
          : asset.assigned_to;

      if (Array.isArray(assignedData) && assignedData.length > 0) {
        const latestAssignment = assignedData[assignedData.length - 1];

        if (latestAssignment.status === "Decommissioned") {
          showAlert("Error: This device is decommissioned and cannot be assigned.");
          
          return; // Stop execution
        }
      }

      // If not decommissioned, proceed with opening the assign popup
      openAssignPopup(asset);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      showAlert("Error: Unable to process asset assignment.");
    }
  }}
>
<UserCheck size={16} style={{ marginRight: "5px" }} /> Assign
</button>
</td>

  
</td>

          <td>{asset.category}</td>
                  <td>{asset.sub_category}</td>

<td
  style={{
    color:
      (() => {
        try {
          const assignedData =
            typeof asset.assigned_to === "string"
              ? JSON.parse(asset.assigned_to)
              : asset.assigned_to;

          if (Array.isArray(assignedData) && assignedData.length > 0) {
            const latestAssignment = assignedData[assignedData.length - 1];

            return latestAssignment.status === "Decommissioned" ? "red" : "black";
          }
        } catch (error) {
          console.error("JSON Parsing Error:", error);
        }
        return "black"; // Default color
      })(),
  }}
>
  {(() => {
    if (!asset.assigned_to || asset.assigned_to === "") return "Unassigned";

    try {
      const assignedData =
        typeof asset.assigned_to === "string"
          ? JSON.parse(asset.assigned_to)
          : asset.assigned_to;

      if (Array.isArray(assignedData) && assignedData.length > 0) {
        const latestAssignment = assignedData[assignedData.length - 1];

        if (latestAssignment.status && latestAssignment.status !== "Assigned") {
          return latestAssignment.status; // e.g., "Decommissioned"
        }

        return latestAssignment.returnDate ? "Returned" : "Assigned";
      }
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
    return "Unassigned";
  })()}
</td>

<td>
  {asset.document_path ? (
    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={() => handleViewDocument(asset.document_path)}
        className="view-doc-btn"
      >
        <Eye size={16} style={{ marginRight: "5px" }} /> View
      </button>

      <button
        onClick={() => handleDownloadDocument(asset.document_path)}
        className="download-doc-btn"
      >
        <Download size={16} style={{ marginRight: "5px" }} /> Download
      </button>
    </div>
  ) : (
    "No Document"
  )}
</td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No assets available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>






      {/* Assign Popup */}
      {showAssignPopup && selectedAsset && (
        
  <div className="assign-popup">
    <h3>Assign Asset: {selectedAsset.asset_name}</h3>
    <p><strong>Asset ID:</strong> {selectedAsset.asset_id}</p>
    <p><strong>Category:</strong> {selectedAsset.category}</p>
    {/* Other fields like configuration, current status, etc. */}
    {/* Form to assign with fields like name, startDate, status, etc. */}
  
    <div className="assignpopup-overlay">
    <div className="assignpopup-content">
      <h3>Assign Asset</h3>
      <button className="close-button-assign-asset" onClick={closeAssignPopup} aria-label="Close">
      <MdOutlineCancel className="assign-close-popup-icon" />
      </button>


      {/* Asset Info */}
      <div className="row">
        </div>

      {/* Add Row Button */}
      <button className="addrow-btn" onClick={addAssignmentRow}>+ Add Row</button>
      <div className="assignpopup-buttons">
        <button className="assigncancel-btn" onClick={closeAssignPopup}>
          Cancel
        </button>
        <button className="assignsave-btn" onClick={handleAssign}>
          Assign
        </button>
      </div>
    
      <div className="assetform-header">
  <div>Assigned To</div>
  <div>Start Date</div>
  <div>Return Date</div>
  <div>Status</div>
  <div>Comments</div>
</div>
      {/* Form Rows */}
      {/* Form Rows */}
      {assignmentRowsByAsset[selectedAssetId]?.map((assignment, index) => (
  <div key={index} className="assetform-row">
   <div style={{ position: "relative", width: "100%" }}>
  <input
    type="text"
    placeholder="Assigned To"
    value={assignment.assignedTo}
    onChange={(e) => handleAssignedToInputChange(e, index)}
    className={`input-style ${fieldErrors[index]?.assignedTo ? "error-border" : ""}`}
    autoComplete="off"
  />

  {popupSuggestions[index]?.length > 0 && (
    <ul
      style={{
        position: "absolute",
        top: "100%",
        left: "20px",
        background: "#fff",
        border: "1px solid #ccc",
        zIndex: 9999,
        width: "250px",
        listStyle: "none",
        padding: 0,
        margin: 0,
        maxHeight: "150px",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {popupSuggestions[index].map((name, i) => (
        <li
          key={i}
          onClick={() => handleSuggestionSelect(name, index)}
          style={{
            padding: "8px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          {name}
        </li>
      ))}
    </ul>
  )}
</div>

<input
  type="date"
  value={assignment.startDate}
  onChange={(e) => updateAssignment(index, "startDate", e.target.value)}
  className={`input-style ${fieldErrors[index]?.startDate ? "error-border" : ""}`}

/>
<input
  type="date"
  value={assignment.returnDate}
  onChange={(e) => updateAssignment(index, "returnDate", e.target.value)}
  className={`input-style ${fieldErrors[index]?.returnDate ? "error-border" : ""}`}

/>

<select
      value={assignment.assigningStatus}
      onChange={(e) =>
        updateAssignment(index, "assigningStatus", e.target.value)
      }
    >
      <option value="Pending">Unassigned</option>
      <option value="Assigned">Assigned</option>
      <option value="Returned">Returned</option>
      <option value="Decommissioned">Decommissioned</option>
    </select>


<textarea
  placeholder="Enter comments"
  value={assignment.comments}
  onChange={(e) => updateAssignment(index, "comments", e.target.value)}
/>

  </div>
  
))}

  </div>
  
    </div>
  








      {showForm && (
    <div className="returndateform-container">
      <h3>Enter Return Date</h3>
      <form>
        <div>
          <label>Asset ID:</label>
         <input
  type="text"
  name="assetId"
  value={formData.assetId}
  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
  maxLength={50} // Adjust the maximum length according to your requirement
/>
        </div>
        <div>
          <label>Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Return Date:</label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleInputChange}
            required
          />
        </div><div className="returndateform-buttons">
  
  <button type="button" className="rcancel-btn" onClick={() => setShowForm(false)}>
    Cancel
  </button>
  <button type="button" className="rsave-btn" onClick={handleSaveReturnDate}>
    Save
  </button>
</div>
      </form>
    </div>
  )}
  </div>
    
     
)}
{/* Alert Modal for displaying messages */}
        <Modal
          isVisible={alertModal.isVisible}
          onClose={closeAlert}
          buttons={[{ label: "OK", onClick: closeAlert }]}
        >
          <p>{alertModal.message}</p>
        </Modal>
    </div>
  );
};

export default Assets;
