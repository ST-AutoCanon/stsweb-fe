
import React, { useState, useEffect } from "react";
import "./assets.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { Eye } from "lucide-react";
import { FaNetworkWired } from "react-icons/fa";
import { Monitor, Wrench, Package } from "lucide-react";
import { GiOfficeChair, GiTable, GiArchiveRegister } from "react-icons/gi";
import { Laptop2, Computer, Server } from "lucide-react";
import { FaDesktop, FaServer } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import { MdStorage } from "react-icons/md";
import { FaHdd, FaMouse, FaPlug, FaTools } from "react-icons/fa";
import { MdLaptop } from "react-icons/md";
import { Download } from "lucide-react";
import Modal from "../Modal/Modal";
import { TableProperties, Chair, Archive, Plug, Hammer } from "lucide-react";
import { Boxes } from "lucide-react";
import { LayoutPanelLeft, LayoutDashboard } from "lucide-react";
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
  const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  const [assets, setAssets] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [comments, setComments] = useState("");
  const [assigningStatus, setAssigningStatus] = useState("Unassigned");
  const [status, setStatus] = useState("In Use");
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [popupSuggestions, setPopupSuggestions] = useState({});
  const togglePopup = () => {
    if (showPopup) {
      resetFormforaddasset();
    }
    setShowPopup(!showPopup);
  };
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignmentRowsByAsset, setAssignmentRowsByAsset] = useState({});
  const [initialAssignmentRowsByAsset, setInitialAssignmentRowsByAsset] = useState({});
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
  const handleSelectSuggestion = (name) => {
    setAssignedTo(name);
    setEmployeeSuggestions([]);
  };
  const handleAssignedToInputChange = async (e, index) => {
    const value = e.target.value;
    updateAssignment(index, "assignedTo", value);
    if (value.length === 0) {
      setPopupSuggestions((prev) => ({
        ...prev,
        [index]: defaultLocationSuggestions,
      }));
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/assets/search-employees?q=${value}`,
          {
            withCredentials: true,
            headers,
          }
        );
        const suggestions = response.data.data.map((emp) => ({
          name: emp.name,
          employeeId: emp.employee_id,
        }));
        setPopupSuggestions((prev) => ({
          ...prev,
          [index]: [...defaultLocationSuggestions, ...suggestions],
        }));
      } catch (err) {
        console.error("Suggestion error:", err);
        setPopupSuggestions((prev) => ({
          ...prev,
          [index]: defaultLocationSuggestions,
        }));
      }
    }
  };
  const handleSuggestionSelect = (selectedEmp, index) => {
    updateAssignment(index, "assignedTo", selectedEmp.name);
    updateAssignment(index, "employeeId", selectedEmp.employeeId);
    setPopupSuggestions((prev) => ({ ...prev, [index]: [] }));
  };
  useEffect(() => {
    setAssignedTo("");
    fetchAssets();
    fetchAssignedAssets();
  }, []);
  const { assetId } = useParams();
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  useEffect(() => {
    if (assetId) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`,
        {
          method: "GET",
          credentials: "include",
          headers,
        }
      )
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
        .catch((error) =>
          console.error("Error fetching assignment data:", error)
        );
    }
  }, [assetId]);
  const defaultLocationSuggestions = [
    { name: "sts-belagavi", employeeId: "sts-belagavi" },
    { name: "sts-dharwad", employeeId: "sts-dharwad" },
    { name: "sts-chennai", employeeId: "sts-chennai" },
  ];
  const handleBlurAssignPopup = (index) => {
    setTimeout(() => {
      setPopupSuggestions((prev) => ({ ...prev, [index]: [] }));
    }, 150);
  };
  const handleAssignedToChange2 = async (e) => {
    const value = e.target.value;
    setAssignedTo(value);
    if (value.length === 0) {
      setEmployeeSuggestions(defaultLocationSuggestions);
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/assets/search-employees?q=${value}`,
          {
            withCredentials: true,
            headers,
          }
        );
        const suggestions = response.data.data.map((emp) => ({
          name: emp.name,
          employeeId: emp.employee_id,
        }));
        setEmployeeSuggestions([...defaultLocationSuggestions, ...suggestions]);
      } catch (err) {
        console.error("Suggestion error:", err);
      }
    }
  };
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
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/assets/list`, {
            withCredentials: true,
            headers,
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/assignments`, {
            withCredentials: true,
            headers,
          }),
        ]);
        setAssets(assetsResponse.data);
        setAssignedAssets(assignmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAssignments();
  }, []);
  const fetchAssets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/assets/list`,
        {
          withCredentials: true,
          headers,
        }
      );
      setAssets(response.data);
    } catch (error) {
      console.error(
        "❌ Error fetching assets:",
        error.response?.data || error.message
      );
      showAlert("Failed to fetch assets.");
    }
  };
  const resetForm = () => {
    setAssignedTo("");
    setStartDate("");
    setReturnDate("");
    setComments("");
    setAssigningStatus("Unassigned");
  };
  const resetFormforaddasset = () => {
    setAssetName("");
    setConfiguration("");
    setValuationDate("");
    setAssignedTo("");
    setDocument(null);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setStatus("In Use");
  };
  const closePopup = () => {
    resetForm();
    closeAssignPopup();
  };
  const viewDocument = async (path) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/uploads/${path}`,
        {
          headers,
          withCredentials: true,
          responseType: "blob",
        }
      );
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error(
        "Error opening document:",
        error.response?.data || error.message
      );
      showAlert("Failed to open document.");
    }
  };
  const openAssignPopup = (asset) => {
    const assetId = asset.id;
    setSelectedAssetId(assetId);
    setSelectedAsset(asset);
    let formattedAssignments = [];
    if (
      asset.assigned_to &&
      asset.assigned_to !== "null" &&
      asset.assigned_to !== ""
    ) {
      try {
        const parsed =
          typeof asset.assigned_to === "string"
            ? JSON.parse(asset.assigned_to)
            : asset.assigned_to;
        if (Array.isArray(parsed) && parsed.length > 0) {
          formattedAssignments = parsed.reverse().map((a) => ({
            assignedTo: a.name || "",
            employeeId: a.employeeId || a.employee_id || "",
            startDate: a.startDate || asset.valuation_date || "",
            returnDate: a.returnDate || "",
            assigningStatus: a.status || "Assigned",
            comments: a.comments || "",
          }));
        }
      } catch (err) {
        console.error("Error parsing assigned_to JSON:", err);
      }
    }
    if (formattedAssignments.length === 0) {
      formattedAssignments = [
        {
          assignedTo: "",
          employeeId: "",
          startDate:
            asset.valuation_date || new Date().toISOString().split("T")[0],
          returnDate: "",
          assigningStatus: "Unassigned",
          comments: "",
        },
      ];
    }
    const initialRows = [...formattedAssignments];
    setAssignmentRowsByAsset((prev) => ({
      ...prev,
      [assetId]: initialRows,
    }));
    setInitialAssignmentRowsByAsset((prev) => ({
      ...prev,
      [assetId]: initialRows,
    }));
    setShowAssignPopup(true);
  };
  const closeAssignPopup = () => {
    setShowAssignPopup(false);
    setSelectedAsset(null);
    setSelectedAssetId(null);
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [fieldErrors, setFieldErrors] = useState({});
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
        employeeId: rows[0].employeeId,
        startDate: rows[0].startDate,
        returnDate: rows[0].returnDate,
        status: rows[0].assigningStatus,
        comments: rows[0].comments || "",
      };
      const requiredFields = ["assetId", "assignedTo", "startDate", "status"];
      for (const field of requiredFields) {
        if (!firstAssignment[field]) {
          console.error(`❌ Missing value for "${field}"`);
          showAlert(`Missing value for "${field}"`);
          return;
        }
      }
      if (firstAssignment.status === "Returned" && !firstAssignment.returnDate) {
        showAlert("Please select a return date before marking as Returned.");
        return;
      }
      if (!firstAssignment.returnDate) {
        firstAssignment.returnDate = null;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assign`,
        firstAssignment,
        {
          withCredentials: true,
          headers,
        }
      );
      const successMessage = firstAssignment.status === "Returned" ? "Asset returned successfully!" : "Asset assigned successfully!";
      showAlert(successMessage);
      if (firstAssignment.status === "Returned") {
        const submittedRow = { ...rows[0] };
        setInitialAssignmentRowsByAsset((prev) => ({
          ...prev,
          [selectedAssetId]: [...(prev[selectedAssetId] || []), submittedRow],
        }));
        const newRow = {
          assignedTo: "",
          employeeId: "",
          startDate: new Date().toISOString().split("T")[0],
          returnDate: "",
          assigningStatus: "Unassigned",
          comments: "",
        };
        setAssignmentRowsByAsset((prev) => ({
          ...prev,
          [selectedAssetId]: [newRow, ...(prev[selectedAssetId] || [])],
        }));
      } else {
        closeAssignPopup();
      }
      fetchAssets();
    } catch (error) {
      console.error(
        "❌ Error assigning asset:",
        error.response?.data || error.message
      );
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
          headers,
          withCredentials: true,
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
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
    const fileName = documentPath.split("/").pop().trim();
    const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/assets/download/${fileName}`;
    try {
      const response = await axios.get(fileUrl, {
        headers,
        withCredentials: true,
        responseType: "blob",
      });
      if (response.data.type === "text/html") {
        console.error("Server returned an HTML error page (likely 404).");
        showAlert(
          "Document not found on the server. Please verify the file was uploaded correctly."
        );
        return;
      }
      const extension = fileName.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream";
      if (extension === "pdf") mimeType = "application/pdf";
      else if (["jpg", "jpeg"].includes(extension)) mimeType = "image/jpeg";
      else if (extension === "png") mimeType = "image/png";
      const fileBlob = new Blob([response.data], { type: mimeType });
      const fileURL = window.URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000);
    } catch (error) {
      console.error("Error opening document:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: fileUrl,
      });
      showAlert(
        "Document not found on the server. Please verify the file was uploaded correctly."
      );
    }
  };
  const handleSave = async () => {
    if (!assetName || !configuration || !valuationDate || !assignedTo) {
      showAlert(
        "Please fill all required fields: Asset Name, Configuration, Purchased Date, and Assigned To."
      );
      return;
    }
    const formData = new FormData();
    formData.append("asset_name", assetName);
    formData.append("configuration", configuration);
    formData.append("valuation_date", valuationDate);
    formData.append("category", selectedCategory);
    formData.append("sub_category", selectedSubCategory);
    formData.append("status", status);
    let assignedToArray = [];
    if (
      assignedTo &&
      typeof assignedTo === "object" &&
      assignedTo.name &&
      assignedTo.employeeId
    ) {
      assignedToArray.push({
        name: assignedTo.name,
        employeeId: assignedTo.employeeId,
        startDate: valuationDate || null,
        returnDate: null,
        comments: "",
        status: "Assigned",
      });
    } else {
      assignedToArray.push({ name: "STS" });
    }
    formData.append("assigned_to", JSON.stringify(assignedToArray));
    if (document) {
      formData.append("document", document);
    }
    for (let [key, value] of formData.entries()) {
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/assets/add`,
        formData,
        { withCredentials: true, headers }
      );
      showAlert("Asset saved successfully!");
      resetFormforaddasset();
      togglePopup();
      fetchAssets();
    } catch (error) {
      console.error("Error saving asset:", error);
      showAlert(
        `Failed to save asset: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    }
  };
  useEffect(() => {
    fetchAssignedAssets();
  }, []);
  const fetchAssignedAssets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned`,
        { withCredentials: true, headers }
      );
      if (response.data && response.data.length > 0) {
        setAssignedAssets(response.data);
      } else {
        setAssignedAssets([]);
      }
    } catch (error) {
      console.error(
        "Error fetching assigned assets:",
        error.response?.data || error.message
      );
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
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`,
        { withCredentials: true, headers }
      );
      if (response.data.length === 0) {
        console.warn("⚠ No assignments found for this asset.");
        setAssignedAssets([]);
        return;
      }
      setAssignedAssets(response.data[0]?.assignments || []);
    } catch (error) {
      console.error(
        "❌ Error fetching assignment data:",
        error.response?.data || error
      );
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: "",
    employeeName: "",
    returnDate: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAssignmentChange = (index, field, value) => {
    setAssignmentRowsByAsset((prev) => {
      const updated = [...prev[selectedAssetId]];
      updated[index][field] = value;
      return { ...prev, [selectedAssetId]: updated };
    });
  };
  const handleSaveReturnDate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/return-date`,
        {
          assetId: formData.assetId,
          employeeName: formData.employeeName,
          returnDate: formData.returnDate,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      showAlert("Return date updated successfully!");
      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.assetId === formData.assetId
            ? {
                ...asset,
                status: response.data.updatedStatus || "Returned",
                returnDate: formData.returnDate,
              }
            : asset
        )
      );
      setFormData({ assetId: "", employeeName: "", returnDate: "" });
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error updating return date:", error);
      showAlert("Failed to update return date. Please try again.");
    }
  };
  const [assetCounts, setAssetCounts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/assets/counts`, {
      credentials: "include",
      headers,
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
      const response = await fetch("/api/assets/assign", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignments),
      });
      if (!response.ok) {
        throw new Error("Failed to submit assignments");
      }
      const result = await response.json();
      showAlert("Assets assigned successfully!");
    } catch (error) {
      console.error("Error submitting assignments:", error);
      showAlert("Failed to assign assets. Please try again.");
    }
  };
  const addAssignmentRow = () => {
    const currentRows = assignmentRowsByAsset[selectedAssetId] || [];
    if (currentRows.length > 0) {
      const topRow = currentRows[0];
      const isFilled =
        topRow.assignedTo &&
        topRow.startDate &&
        topRow.assigningStatus &&
        (topRow.assigningStatus !== "Returned" || topRow.returnDate);
      if (!isFilled) {
        showAlert(
          "Please fill out the current top row before adding a new one."
        );
        return;
      }
    }
    const newRow = {
      assignedTo: "",
      startDate: "",
      returnDate: "",
      assigningStatus: "Unassigned",
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
  const handleStatusChange = (index, e) => {
    const newStatus = e.target.value;
    updateAssignment(index, "assigningStatus", newStatus);
  };
  useEffect(() => {
    if (assetId) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/assets/assigned/${assetId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0 && Array.isArray(data[0].assignments)) {
            const parsed = data[0].assignments;
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
                    assigningStatus: "Unassigned",
                    comments: "",
                  },
                ];
            setAssignments(formattedAssignments);
          }
        });
    }
  }, [assetId]);
  const handleBlur2 = () => {
    setTimeout(() => {
      setEmployeeSuggestions([]);
    }, 150);
  };
  const handleBlur = () => {
    if (!employeeSuggestions.includes(assignedTo)) {
      setAssignedTo("");
    }
  };
  const groupedAssetCounts = assetCounts.reduce((acc, item) => {
    const {
      category,
      sub_category,
      sub_category_count,
      category_total,
      total_assets,
    } = item;
    if (!acc[category]) {
      acc[category] = {
        categoryTotal: category_total,
        subcategories: [],
      };
    }
    acc[category].subcategories.push({ sub_category, sub_category_count });
    return acc;
  }, {});
  const [searchTerm, setSearchTerm] = useState("");
  const sortedAssets = [...assets].sort((a, b) => {
    const numA = parseInt(a.asset_code?.split("-")[2] || "0", 10);
    const numB = parseInt(b.asset_code?.split("-")[2] || "0", 10);
    return numB - numA;
  });
  const filteredAssets = sortedAssets.filter(
    (asset) =>
      (asset.asset_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (asset.asset_id?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (asset.asset_code?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );
  const truncateWords = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };
  return (
    <div className="assets-container">
      <div className="asset-summary-buttons2">
        <div className="left-buttons">
          <div className="total-assets-box">
            <strong>Total Assets:</strong>{" "}
            <span>
              {assetCounts.length > 0 ? assetCounts[0].total_assets : "0"}
            </span>
          </div>
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
      <caption
        style={{ captionSide: "top", padding: "10px", textAlign: "left" }}
      >
        <div className="asset-search-container">
          <input
            type="text"
            placeholder="Search by Asset_ID,Asset_code.."
            className="asset-table-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </caption>
      {showPopup && (
        <div className="asset-popup-overlay">
          <div className="asset-popup-content">
            <div className="asset-popup-header">New Asset</div>
            <button className="close-btn-addasset" onClick={togglePopup}>
              <MdOutlineCancel className="assetmain-close-popup-icon" />
            </button>
            <div className="sticky-options">
              <button
                className={selectedCategory === "System" ? "active" : ""}
                onClick={() => handleCategoryChange("System")}
              >
                {" "}
                <div className="icon-group">
                  {" "}
                  <Monitor className="icon" /> <span> System</span>
                </div>{" "}
              </button>
              <button
                className={selectedCategory === "Furniture" ? "active" : ""}
                onClick={() => handleCategoryChange("Furniture")}
              >
                <div className="icon-group">
                  <GiOfficeChair className="icon" />
                </div>
                <span>Furniture</span>
              </button>
              <button
                className={selectedCategory === "Equipment" ? "active" : ""}
                onClick={() => handleCategoryChange("Equipment")}
              >
                <div className="icon-group">
                  <Wrench className="icon" />
                </div>
                Equipment
              </button>
              <button
                className={selectedCategory === "Others" ? "active" : ""}
                onClick={() => handleCategoryChange("Others")}
              >
                <Package className="icon" />
                Others
              </button>
            </div>
            {selectedCategory === "System" && (
              <div className="sticky-suboptions">
                <button
                  className={selectedSubCategory === "Laptop" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Laptop")}
                >
                  {" "}
                  <MdLaptop className="icon" /> Laptop
                </button>
                <button
                  className={selectedSubCategory === "Desktop" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Desktop")}
                >
                  {" "}
                  <FaDesktop className="icon" />
                  Desktop
                </button>
                <button
                  className={selectedSubCategory === "Server" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Server")}
                >
                  {" "}
                  <Server className="icon" />
                  Server
                </button>
              </div>
            )}
            {selectedCategory === "Furniture" && (
              <div className="sticky-suboptions">
                <button
                  className={selectedSubCategory === "Table" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Table")}
                >
                  {" "}
                  <GiTable className="icon" /> Table
                </button>
                <button
                  className={selectedSubCategory === "Chair" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Chair")}
                >
                  {" "}
                  <FaChair className="icon" /> Chair
                </button>
                <button
                  className={selectedSubCategory === "Drawers" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("Drawers")}
                >
                  {" "}
                  <MdStorage className="icon" />
                  Drawers
                </button>
                <button
                  className={selectedSubCategory === "cupboard" ? "active" : ""}
                  onClick={() => setSelectedSubCategory("cupboard")}
                >
                  {" "}
                  <LayoutPanelLeft className="icon" /> Cupboard
                </button>
              </div>
            )}
            {selectedCategory === "Equipment" && (
              <div className="sticky-suboptions">
                <button
                  className={
                    selectedSubCategory === "Electrical" ? "active" : ""
                  }
                  onClick={() => setSelectedSubCategory("Electrical")}
                >
                  <Plug className="icon" />
                  <span>Electrical</span>
                </button>
                <button
                  className={
                    selectedSubCategory === "Non-Electrical" ? "active" : ""
                  }
                  onClick={() => setSelectedSubCategory("Non-Electrical")}
                >
                  <Hammer className="icon" />
                  <span>Non-Electrical</span>
                </button>
              </div>
            )}
            {selectedSubCategory || selectedCategory === "Others" ? (
              <div className="asset-details-grid">
                <div className="row">
                  <label>
                    Asset Name{" "}
                    <span className="assets-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Asset Name"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>
                <div className="row">
                  <label>
                    Configuration
                    <span className="assets-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Configuration"
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                  />
                </div>
                <div className="row">
                  <label>
                    Purchased Date
                    <span className="assets-required-asterisk">*</span>
                  </label>
                  <input
                    type="date"
                    value={valuationDate}
                    onChange={(e) => setValuationDate(e.target.value)}
                  />
                </div>
                <div className="row" style={{ position: "relative" }}>
                  <label>
                    Assigned To{" "}
                    <span className="assets-required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Assignee Name or Location (e.g. sts-belagavi)"
                    value={assignedTo?.name || assignedTo || ""}
                    onChange={handleAssignedToChange2}
                    onBlur={handleBlur2}
                    autoComplete="off"
                  />
                  {employeeSuggestions.length > 0 && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 999,
                        maxHeight: "150px",
                        overflowY: "auto",
                        listStyle: "none",
                        padding: "0",
                        margin: "0",
                        width: "100%",
                        maxWidth: "250px",
                      }}
                    >
                      {employeeSuggestions.map((emp, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectSuggestion(emp)}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {emp.name} ({emp.employeeId}){" "}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="row">
                  <label>Upload Document</label>
                  <input type="file" onChange={handleFileChange} />
                </div>
                <div className="popup-buttons">
                  <button onClick={togglePopup} className="cancel-btn">
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div className="assets-table-wrapper">
        <div className="assets-table">
          <table>
            <thead>
              <tr>
                <th>Asset_ID</th>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>Configuration</th>
                <th>Purchased Date</th>
                <th>Assigned To</th>
                <th>Category</th>
                <th>Status</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {(filteredAssets.length > 0 ? filteredAssets : sortedAssets)
                .length > 0 ? (
                (filteredAssets.length > 0 ? filteredAssets : sortedAssets).map(
                  (asset) => (
                    <tr
                      key={asset.id}
                      style={{
                        backgroundColor: (() => {
                          try {
                            const assignedData =
                              typeof asset.assigned_to === "string"
                                ? JSON.parse(asset.assigned_to)
                                : asset.assigned_to;
                            if (
                              Array.isArray(assignedData) &&
                              assignedData.length > 0
                            ) {
                              const latestAssignment =
                                assignedData[assignedData.length - 1];
                              if (
                                latestAssignment.status === "Decommissioned"
                              ) {
                                return "#e7d9d9";
                              }
                            }
                          } catch (error) {
                            console.error("Row style JSON parse error:", error);
                          }
                          return "transparent";
                        })(),
                      }}
                    >
                      <td>{asset.asset_id}</td>
                      <td>{asset.asset_code}</td>
                      <td title={asset.asset_name}>
                        {truncateWords(asset.asset_name, 3)}
                      </td>
                      <td title={asset.configuration}>
                        {truncateWords(asset.configuration, 3)}
                      </td>
                      <td>
                        {asset.valuation_date
                          ? (() => {
                              try {
                                const date = new Date(asset.valuation_date);
                                if (isNaN(date.getTime()))
                                  return "Invalid Date";
                                const year = date.getFullYear();
                                const month = String(
                                  date.getMonth() + 1
                                ).padStart(2, "0");
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                return `${year}-${month}-${day}`;
                              } catch (error) {
                                console.error(
                                  "Error parsing valuation_date:",
                                  asset.valuation_date,
                                  error
                                );
                                return "Invalid Date";
                              }
                            })()
                          : "N/A"}
                      </td>
                      <td className="assigned-to-cell">
                        <span className="assigned-name">
                          {(() => {
                            if (!asset.assigned_to || asset.assigned_to === "")
                              return "Unassigned";
                            try {
                              const assignedData =
                                typeof asset.assigned_to === "string"
                                  ? JSON.parse(asset.assigned_to)
                                  : asset.assigned_to;
                              if (
                                typeof assignedData === "object" &&
                                !Array.isArray(assignedData)
                              ) {
                                return assignedData.name || "Unassigned";
                              }
                              if (
                                Array.isArray(assignedData) &&
                                assignedData.length > 0
                              ) {
                                return (
                                  assignedData[assignedData.length - 1].name ||
                                  "Unassigned"
                                );
                              }
                              return "Unassigned";
                            } catch (error) {
                              console.error("JSON Parsing Error:", error);
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
                              if (
                                Array.isArray(assignedData) &&
                                assignedData.length > 0
                              ) {
                                const latestAssignment =
                                  assignedData[assignedData.length - 1];
                                if (
                                  latestAssignment.status === "Decommissioned"
                                ) {
                                  showAlert(
                                    "This device is decommissioned and cannot be assigned."
                                  );
                                  return;
                                }
                              }
                              openAssignPopup(asset);
                            } catch (error) {
                              console.error("JSON Parsing Error:", error);
                              showAlert(
                                "Error: Unable to process asset assignment."
                              );
                            }
                          }}
                        >
                          <UserCheck size={16} style={{ marginRight: "5px" }} />{" "}
                          Assign
                        </button>
                      </td>
                      <td>{asset.category}</td>
                      <td
                        style={{
                          color: (() => {
                            try {
                              const assignedData =
                                typeof asset.assigned_to === "string"
                                  ? JSON.parse(asset.assigned_to)
                                  : asset.assigned_to;
                              if (
                                Array.isArray(assignedData) &&
                                assignedData.length > 0
                              ) {
                                const latestAssignment =
                                  assignedData[assignedData.length - 1];
                                return latestAssignment.status ===
                                  "Decommissioned"
                                  ? "red"
                                  : "black";
                              }
                            } catch (error) {
                              console.error("JSON Parsing Error:", error);
                            }
                            return "black";
                          })(),
                        }}
                      >
                        {(() => {
                          if (!asset.assigned_to || asset.assigned_to === "")
                            return "Unassigned";
                          try {
                            const assignedData =
                              typeof asset.assigned_to === "string"
                                ? JSON.parse(asset.assigned_to)
                                : asset.assigned_to;
                            if (
                              Array.isArray(assignedData) &&
                              assignedData.length > 0
                            ) {
                              const latestAssignment =
                                assignedData[assignedData.length - 1];
                              if (
                                latestAssignment.status &&
                                latestAssignment.status !== "Assigned"
                              ) {
                                return latestAssignment.status;
                              }
                              return latestAssignment.returnDate
                                ? "Returned"
                                : "Assigned";
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
                              onClick={() =>
                                handleViewDocument(asset.document_path)
                              }
                              className="view-doc-btn"
                            >
                              <Eye size={16} style={{ marginRight: "5px" }} />
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadDocument(asset.document_path)
                              }
                              className="download-doc-btn"
                            >
                              <Download
                                size={16}
                                style={{ marginRight: "5px" }}
                              />
                            </button>
                          </div>
                        ) : (
                          "No Document"
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="9">No assets available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAssignPopup && selectedAsset && (
        <div className="assign-popup">
          <h3>Assign Asset: {selectedAsset.asset_name}</h3>
          <p>
            <strong>Asset ID:</strong> {selectedAsset.asset_id}
          </p>
          <p>
            <strong>Category:</strong> {selectedAsset.category}
          </p>
          <div className="assignpopup-overlay">
            <div className="assignpopup-content">
              <h3>Assign Asset</h3>
              <button
                className="close-button-assign-asset"
                onClick={closeAssignPopup}
                aria-label="Close"
              >
                <MdOutlineCancel className="assign-close-popup-icon" />
              </button>
              <div className="row"></div>
              <button className="addrow-btn" onClick={addAssignmentRow}>
                + Add Row
              </button>
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
                <div>Status</div>
                <div>Return Date</div>
                <div>Comments</div>
              </div>
              {(() => {
                const rows = assignmentRowsByAsset[selectedAssetId] || [];
                const initialRows = initialAssignmentRowsByAsset[selectedAssetId] || [];
                const addedCount = rows.length - initialRows.length;
                return (
                  <>
                    {rows.map((assignment, index) => {
                      let isFrozen = false;
                      if (index < addedCount) {
                        isFrozen = false;
                      } else {
                        const histIndex = index - addedCount;
                        if (histIndex < initialRows.length && initialRows[histIndex].assigningStatus === "Returned") {
                          isFrozen = true;
                        }
                      }
                      return (
                        <div key={index} className="assetform-row">
                          <div style={{ position: "relative", width: "100%" }}>
                            <input
                              type="text"
                              placeholder="Assigned To"
                              value={assignment.assignedTo}
                              onChange={(e) => !isFrozen && handleAssignedToInputChange(e, index)}
                              onBlur={() => !isFrozen && handleBlurAssignPopup(index)}
                              disabled={isFrozen}
                              className={`input-style ${fieldErrors[index]?.assignedTo ? "error-border" : ""} ${isFrozen ? "frozen-input" : ""}`}
                              autoComplete="off"
                            />
                            {!isFrozen && popupSuggestions[index]?.length > 0 && (
                              <ul
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "0px",
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
                                {popupSuggestions[index].map((emp, i) => (
                                  <li
                                    key={i}
                                    onClick={() => handleSuggestionSelect(emp, index)}
                                    style={{
                                      padding: "8px",
                                      cursor: "pointer",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {emp.name} ({emp.employeeId})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <input
                            type="date"
                            value={assignment.startDate}
                            onChange={(e) => !isFrozen && updateAssignment(index, "startDate", e.target.value)}
                            disabled={isFrozen}
                            className={`input-style ${fieldErrors[index]?.startDate ? "error-border" : ""} ${isFrozen ? "frozen-input" : ""}`}
                          />
                          <select
                            value={assignment.assigningStatus}
                            onChange={(e) => !isFrozen && handleStatusChange(index, e)}
                            disabled={isFrozen}
                            className={`${isFrozen ? "frozen-input" : ""}`}
                          >
                            <option value="Unassigned">Unassigned</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Returned">Returned</option>
                            <option value="Decommissioned">Decommissioned</option>
                          </select>
                          <input
                            type="date"
                            value={assignment.returnDate}
                            onChange={(e) => !isFrozen && updateAssignment(index, "returnDate", e.target.value)}
                            disabled={isFrozen || assignment.assigningStatus !== "Returned"}
                            className={`input-style ${fieldErrors[index]?.returnDate ? "error-border" : ""} ${isFrozen || assignment.assigningStatus !== "Returned" ? "frozen-input" : ""}`}
                          />
                          <textarea
                            placeholder="Enter comments"
                            value={assignment.comments}
                            onChange={(e) => !isFrozen && updateAssignment(index, "comments", e.target.value)}
                            disabled={isFrozen}
                            className={`${isFrozen ? "frozen-input" : ""}`}
                          />
                        </div>
                      );
                    })}
                  </>
                );
              })()}
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
                    onChange={(e) =>
                      setFormData({ ...formData, assetId: e.target.value })
                    }
                    maxLength={50}
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
                </div>
                <div className="returndateform-buttons">
                  <button
                    type="button"
                    className="rcancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rsave-btn"
                    onClick={handleSaveReturnDate}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
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