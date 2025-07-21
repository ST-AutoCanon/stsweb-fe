import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineCancel,
  MdEmojiTransportation,
  MdOutlinePhoneAndroid,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { GiKnifeFork, GiPencilBrush } from "react-icons/gi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import "./Reimbursement.css";
import Modal from "../Modal/Modal"; // Alert modal component

const claimTypes = [
  {
    icon: <MdEmojiTransportation className="claim-icons" />,
    label: "Transportation",
  },
  { icon: <GiKnifeFork className="claim-icons" />, label: "Meals" },
  {
    icon: <MdOutlinePhoneAndroid className="claim-icons" />,
    label: "Telecommunication",
  },
  { icon: <GiPencilBrush className="claim-icons" />, label: "Stationary" },
  {
    icon: <TbTriangleSquareCircle className="claim-icons" />,
    label: "Miscellaneous",
  },
];

const role = localStorage.getItem("userRole");

const Reimbursement = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [filteredReimbursements, setFilteredReimbursements] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [transportType, setTransportType] = useState("");
  const [noOfDaysType, setNoOfDaysType] = useState("");
  const authToken = localStorage.getItem("authToken");
  const employeeData = JSON.parse(localStorage.getItem("dashboardData"));
  const employeeId = employeeData?.employeeId;
  const departmentId = employeeData?.department_id;
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedSubType, setSelectedSubType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    role === "Admin" ? "approved" : "pending"
  );
  const [formData, setFormData] = useState({
    employeeId: employeeId,
    department_id: departmentId,
    claim_type: "",
    transport_type: "",
    transport_amount: "",
    da: "",
    fromDate: "",
    toDate: "",
    date: "",
    travel_from: "",
    travel_to: "",
    meals_objective: "",
    purpose: "",
    purchasing_item: "",
    accommodation_fees: "",
    no_of_days: "",
    total_amount: "",
    meal_type: "",
    stationary: "",
    service_provider: "",
    attachments: null,
  });

  // At the top of your component
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    message: "",
    onConfirm: null,
  });

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ isVisible: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ isVisible: false, message: "", onConfirm: null });
  };

  // Alert modal state (no title by default)
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: "",
    message: "",
  });

  // Helper functions for the alert modal
  const showAlert = (message, title = "") => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: "", message: "" });
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${employeeId}`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            fromDate,
            toDate,
          },
        }
      );

      const reimbursementsData = response.data;

      // Fetch attachments for each reimbursement
      const attachmentsData = {};
      await Promise.all(
        reimbursementsData.map(async (claim) => {
          try {
            console.log(`Fetching attachments for claim ID: ${claim.id}`);
            const attachmentResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${claim.id}/attachments`,
              {
                headers: {
                  "x-api-key": process.env.REACT_APP_API_KEY,
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );

            // Process attachments
            attachmentsData[claim.id] = (
              attachmentResponse.data.attachments || []
            ).map((file) => {
              const pathParts = file.file_path.split("/"); // Split path
              const year = pathParts[pathParts.length - 4]; // Extract year
              const month = pathParts[pathParts.length - 3]; // Extract month
              const employeeId = pathParts[pathParts.length - 2]; // Extract employee ID

              return {
                ...file,
                year,
                month,
                employeeId,
              };
            });
          } catch (error) {
            console.error(
              `Error fetching attachments for reimbursement ${claim.id}:`,
              error
            );
            attachmentsData[claim.id] = [];
          }
        })
      );

      setReimbursements(reimbursementsData);
      setFilteredReimbursements(response.data);
      setAttachments(attachmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "We ran into a problem fetching reimbursements."
        );
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      showAlert(errorMessage || "Error fetching reimbursements.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClaimTypeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, claim_type: value });
    setSelectedSubType(""); // Reset subtypes when changing the claim type
  };

  const handleTransportSubTypeChange = (type) => {
    setFormData({ ...formData, transport_type: type });
    setSelectedSubType(type);
    if (type === "Outstation") {
      // Optionally clear the no_of_days value if it’s not applicable:
      setFormData((prev) => ({ ...prev, no_of_days: "" }));
    }
  };

  const filterClaims = reimbursements.filter(
    (claim) => claim.status.toLowerCase() === statusFilter.toLowerCase()
  );

  const handleNoOfDaysChange = (event) => {
    setFormData({ ...formData, no_of_days: event.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files.map((file) => file.name)); // Updates filenames for display
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const renderDateFields = () => {
    // If Outstation, always show its dates and ignore no_of_days
    if (selectedSubType === "Outstation") {
      return (
        <>
          <div className="rb-groups">
            <label>
              From Date<span className="asterisk">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
          <div className="rb-groups">
            <label>
              To Date<span className="asterisk">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
        </>
      );
    } else if (formData.no_of_days === "single") {
      return (
        <div className="rb-groups">
          <label>
            Date<span className="asterisk">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
          />
        </div>
      );
    } else if (formData.no_of_days === "multiple") {
      return (
        <>
          <div className="rb-groups">
            <label>
              From Date<span className="asterisk">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
          <div className="rb-groups">
            <label>
              To Date<span className="asterisk">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
              max={new Date(Date.now() - 86400000).toLocaleDateString("en-CA")}
            />
          </div>
        </>
      );
    }
    return null;
  };

  const handleEdit = (claim) => {
    setEditingId(claim.id);
    setShowForm(true);
    const existingAttachments = attachments[claim.id] || [];
    setFormData({
      employeeId: claim.employeeId || employeeId,
      department_id: claim.department_id || departmentId,
      claim_type: claim.claim_type || "",
      transport_type: claim.transport_type || "",
      fromDate: claim.from_date ? claim.from_date.substring(0, 10) : "",
      toDate: claim.to_date ? claim.to_date.substring(0, 10) : "",
      date: claim.date ? claim.date.substring(0, 10) : "",
      travel_from: claim.travel_from || "",
      travel_to: claim.travel_to || "",
      meals_objective: claim.meals_objective || "",
      purpose: claim.purpose || "",
      purchasing_item: claim.purchasing_item || "",
      accommodation_fees: claim.accommodation_fees || "",
      transport_amount: claim.transport_amount || "",
      da: claim.da || "",
      no_of_days: claim.no_of_days || "",
      total_amount: claim.total_amount || "",
      meal_type: claim.meal_type || "",
      stationary: claim.stationary || "",
      comments: claim.comments || "",
      service_provider: claim.service_provider || "",
      attachments: existingAttachments,
    });
    setSelectedFiles(
      existingAttachments.map((file) => file.file_name || file.name)
    );
    if (claim.claim_type === "Transportation") {
      setSelectedSubType(claim.transport_type || "");
    }
    if (claim.no_of_days) {
      setNoOfDaysType(claim.no_of_days);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitErrorMessage("");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("department_id", formData.department_id);
      formDataToSend.append("claim_type", formData.claim_type);
      formDataToSend.append("transport_type", formData.transport_type);
      formDataToSend.append("comments", formData.comments);
      formDataToSend.append("fromDate", formData.fromDate);
      formDataToSend.append("toDate", formData.toDate);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("travel_from", formData.travel_from);
      formDataToSend.append("travel_to", formData.travel_to);
      formDataToSend.append("meals_objective", formData.meals_objective);
      formDataToSend.append("purpose", formData.purpose);
      formDataToSend.append("da", formData.da);
      formDataToSend.append("transport_amount", formData.transport_amount);
      formDataToSend.append("purchasing_item", formData.purchasing_item);
      formDataToSend.append("accommodation_fees", formData.accommodation_fees);
      formDataToSend.append("no_of_days", formData.no_of_days);
      formDataToSend.append("total_amount", formData.total_amount);
      formDataToSend.append("meal_type", formData.meal_type);
      formDataToSend.append("stationary", formData.stationary);
      formDataToSend.append("service_provider", formData.service_provider);

      formDataToSend.append("role", role);

      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((file) => {
          formDataToSend.append("attachments", file);
        });
      }

      const config = {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${editingId}`,
          formDataToSend,
          config
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/reimbursement`,
          formDataToSend,
          config
        );
      }

      showAlert("Reimbursement submitted successfully!");
      setFormData({
        employeeId: employeeId,
        department_id: departmentId,
        claim_type: "",
        transport_type: "",
        fromDate: "",
        toDate: "",
        date: "",
        travel_from: "",
        travel_to: "",
        meals_objective: "",
        purpose: "",
        transport_amount: "",
        da: "",
        purchasing_item: "",
        accommodation_fees: "",
        no_of_days: "",
        total_amount: "",
        meal_type: "",
        stationary: "",
        comments: "",
        service_provider: "",
        attachments: null,
      });
      setShowForm(false);
      fetchReimbursements();
    } catch (error) {
      console.error("Error submitting reimbursement:", error);
      if (error.response) {
        setSubmitErrorMessage(
          error.response.data.error ||
            error.response.data.message ||
            "This type of file cannot be uploaded."
        );
        showAlert(
          error.response.data.error ||
            error.response.data.message ||
            "This type of file cannot be uploaded."
        );
      } else {
        setSubmitErrorMessage("An unexpected error occurred.");
        showAlert("An unexpected error occurred.");
      }
    }
  };

  const updateReimbursement = async (reimbursementId, updateData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/reimbursement/update/${reimbursementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Reimbursement update did not go through."
        );
      }
      console.log("Update Response:", data);
    } catch (error) {
      console.error("Error updating reimbursement:", error);
      setUpdateErrorMessage(error.message || "An unexpected error occurred.");
      showAlert(error.message || "An unexpected error occurred.");
    }
  };

  const deleteReimbursement = async (id) => {
    if (!id) {
      console.error("Error: Reimbursement ID is missing.");
      return;
    }

    showConfirm(
      "Are you sure you want to delete this reimbursement claim?",
      async () => {
        try {
          const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${id}`,
            {
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          showAlert(
            response.data.message || "Reimbursement deleted successfully!"
          );
          fetchReimbursements();
        } catch (error) {
          console.error("Error deleting reimbursement:", error);
          showAlert("There was an issue deleting the reimbursement.");
        } finally {
          closeConfirm();
        }
      }
    );
  };

  const handleOpenAttachments = async (files, claim) => {
    try {
      const fetchedFiles = await Promise.all(
        files.map(async (file) => {
          if (!file?.file_name) return null;
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/reimbursement/${file.year}/${file.month}/${file.employeeId}/${file.file_name}`,
            {
              headers: {
                "x-api-key": process.env.REACT_APP_API_KEY,
                Authorization: `Bearer ${authToken}`,
              },
              responseType: "blob",
            }
          );
          return {
            name: file.file_name,
            url: URL.createObjectURL(
              new Blob([response.data], {
                type: response.headers["content-type"],
              })
            ),
          };
        })
      );
      setSelectedFiles(fetchedFiles.filter(Boolean));
      setSelectedClaim(claim);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching attachments:", error);
      showAlert("Could not load attachments. Please try again.");
    }
  };

  const totalAmount = filteredReimbursements.reduce(
    (sum, claim) => sum + parseFloat(claim.total_amount || 0),
    0
  );

  const approvedAmount = filteredReimbursements
    .filter((claim) => claim.status === "approved")
    .reduce((sum, claim) => sum + parseFloat(claim.total_amount || 0), 0);

  const rejectedAmount = filteredReimbursements
    .filter((claim) => claim.status === "rejected")
    .reduce((sum, claim) => sum + parseFloat(claim.total_amount || 0), 0);

  const renderClaimSpecificFields = () => {
    switch (formData.claim_type) {
      case "Transportation":
        return (
          <>
            <div className="sub-tabs">
              {["Outstation", "Intercity", "Fuel"].map((type) => (
                <div
                  key={type}
                  className={`sub-tab ${
                    selectedSubType === type ? "active" : ""
                  }`}
                  onClick={() => handleTransportSubTypeChange(type)} // ✅ Pass type directly
                >
                  {type}
                </div>
              ))}
            </div>

            {(selectedSubType === "Intercity" ||
              selectedSubType === "Fuel") && (
              <div className="rb-radio">
                <label>Select no of days</label>
                <div className="rb-radio-options">
                  <label>
                    <input
                      type="radio"
                      name="no_of_days"
                      value="single"
                      checked={formData.no_of_days === "single"}
                      onChange={handleNoOfDaysChange}
                      required
                    />
                    Single
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="no_of_days"
                      value="multiple"
                      checked={formData.no_of_days === "multiple"}
                      onChange={handleNoOfDaysChange}
                      required
                    />
                    Multiple
                  </label>
                </div>
              </div>
            )}

            {selectedSubType && (
              <div className="rb-main-form">
                <div className="rb-form-grid">
                  {renderDateFields()}

                  <div className="rb-groups">
                    <label>
                      Travel From<span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="travel_from"
                      value={formData.travel_from}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="rb-groups">
                    <label>
                      Travel To<span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="travel_to"
                      value={formData.travel_to}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {selectedSubType === "Outstation" && (
                    <div className="rb-groups">
                      <label>Transport Amount</label>
                      <input
                        type="number"
                        name="transport_amount"
                        value={formData.transport_amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  {selectedSubType === "Outstation" && (
                    <div className="rb-groups">
                      <label>Accommodation Fees</label>
                      <input
                        type="number"
                        name="accommodation_fees"
                        value={formData.accommodation_fees}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  {selectedSubType === "Outstation" && (
                    <div className="rb-groups">
                      <label>DA</label>
                      <input
                        type="number"
                        name="da"
                        value={formData.da}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="rb-groups">
                    <label>
                      Total Amount<span className="asterisk">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_amount"
                      value={formData.total_amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="purpose-attachment">
                  <div className="pa-groups">
                    <label>
                      Purpose Details / Comments
                      <span className="asterisk">*</span>
                    </label>
                    <textarea
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="pa-groups">
                    <label>Attachment</label>
                    <div className="attachment-wrapper">
                      {/* Display selected file names */}
                      <div className="file-links">
                        {selectedFiles.length > 0 ? (
                          selectedFiles.map((fileName, index) => (
                            <p key={index} className="file-name">
                              {fileName}
                            </p>
                          ))
                        ) : (
                          <p>No files selected</p>
                        )}
                      </div>

                      {/* File upload input */}
                      <div className="attachment-upload">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          id="fileInput"
                          className="hidden-file-input"
                        />
                        <label
                          htmlFor="fileInput"
                          className="custom-file-upload"
                        >
                          Browse
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "Meals":
        return (
          <div className="rb-main-form">
            <div className="rb-form1-grid">
              <div className="rb-groups">
                <label>
                  Date<span className="asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups">
                <label>Meal Type</label>
                <select
                  name="meal_type"
                  value={formData.meal_type}
                  onChange={handleChange}
                  required
                >
                  <option value="breakfast">Break Fast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>
              <div className="rb-groups">
                <label>Meal's objective </label>
                <select
                  name="meals_objective"
                  value={formData.meals_objective}
                  onChange={handleChange}
                  required
                >
                  <option value="client_visit">Client Visit</option>
                  <option value="team_outing">Team Outing</option>
                  <option value="extended_work">Extended</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="rb-groups">
                <label>
                  Total Amount<span className="asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="purpose-attachment">
              <div className="pa-groups">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk">*</span>
                </label>
                <textarea
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pa-groups">
                <label>Attachment</label>
                <div className="attachment-wrapper">
                  {/* Display selected file names */}
                  <div className="file-links">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  {/* File upload input */}
                  <div className="attachment-upload">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input"
                    />
                    <label htmlFor="fileInput" className="custom-file-upload">
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Telecommunication":
        return (
          <div className="rb-main-form">
            <div className="rb-form2-grid">
              <div className="rb-groups">
                <label>
                  Date<span className="asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups">
                <label>Service Provider</label>
                <input
                  type="text"
                  name="service_provider"
                  value={formData.service_provider}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div className="rb-groups">
              <label>Reason</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleChange} required />
            </div> */}
              <div className="rb-groups">
                <label>
                  Total Amount<span className="asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="purpose-attachment">
              <div className="pa-groups">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk">*</span>
                </label>
                <textarea
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pa-groups">
                <label>Attachment</label>
                <div className="attachment-wrapper">
                  {/* Display selected file names */}
                  <div className="file-links">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  {/* File upload input */}
                  <div className="attachment-upload">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input"
                    />
                    <label htmlFor="fileInput" className="custom-file-upload">
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Stationary":
        return (
          <div className="rb-main-form">
            <div className="rb-form1-grid">
              <div className="rb-groups">
                <label>
                  Date<span className="asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              <div className="rb-groups">
                <label>Stationary</label>
                <select
                  name="stationary"
                  value={formData.stationary}
                  onChange={handleChange}
                  required
                >
                  <option value="office equipments">Office Equipments</option>
                  <option value="general stationary">General Stationary</option>
                </select>
              </div>
              <div className="rb-groups">
                <label>Purchasing Items</label>
                <input
                  type="text"
                  name="purchasing_item"
                  value={formData.purchasing_item}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div className="rb-groups">
              <label>Reason</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleChange} required />
            </div> */}
              <div className="rb-groups">
                <label>
                  Total Amount
                  <span className="asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="purpose-attachment">
              <div className="pa-groups">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk">*</span>
                </label>
                <textarea
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pa-groups">
                <label>Attachment</label>
                <div className="attachment-wrapper">
                  {/* Display selected file names */}
                  <div className="file-links">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  {/* File upload input */}
                  <div className="attachment-upload">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input"
                    />
                    <label htmlFor="fileInput" className="custom-file-upload">
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Miscellaneous":
        return (
          <div className="rb-main-form">
            <div className="rb-form1-grid">
              <div className="rb-groups">
                <label>
                  Date<span className="asterisk">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date(Date.now() - 86400000).toLocaleDateString(
                    "en-CA"
                  )}
                />
              </div>
              {/* <div className="rb-groups">
              <label>Expense Description</label>
              <input type="text" name="misc_description" value={formData.misc_description} onChange={handleChange} required />
            </div> */}
              <div className="rb-groups">
                <label>
                  Total Amount
                  <span className="asterisk">*</span>
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="purpose-attachment">
              <div className="pa-groups">
                <label>
                  Purpose Details / Comments
                  <span className="asterisk">*</span>
                </label>
                <textarea
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="pa-groups">
                <label>Attachment</label>
                <div className="attachment-wrapper">
                  {/* Display selected file names */}
                  <div className="file-links">
                    {selectedFiles.length > 0 ? (
                      selectedFiles.map((fileName, index) => (
                        <p key={index} className="file-name">
                          {fileName}
                        </p>
                      ))
                    ) : (
                      <p>No files selected</p>
                    )}
                  </div>

                  {/* File upload input */}
                  <div className="attachment-upload">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      id="fileInput"
                      className="hidden-file-input"
                    />
                    <label htmlFor="fileInput" className="custom-file-upload">
                      Browse
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="reimbursement-container">
      <div className="rb-form-header">
        {role !== "Manager" && role !== "Admin" && (
          <h2>Reimbursement Requests</h2>
        )}
      </div>

      <div className="filter-container">
        <label>Status By</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <label>Date From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          required
        />
        <label>To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          required
        />
        <button className="search-btn" onClick={fetchReimbursements}>
          <FaSearch /> Search
        </button>

        <button
          className="apply-btn"
          onClick={() => {
            setSubmitErrorMessage([]);
            setUpdateErrorMessage([]);
            setSelectedFiles([]);
            setShowForm(true);
            setEditingId(null); // Reset editing mode when applying a new claim
            setFormData({
              employeeId: employeeId,
              department_id: departmentId,
              claim_type: "",
              transport_type: "",
              fromDate: "",
              toDate: "",
              date: "",
              travel_from: "",
              travel_to: "",
              meals_objective: "",
              purpose: "",
              purchasing_item: "",
              accommodation_fees: "",
              no_of_days: "",
              total_amount: "",
              meal_type: "",
              stationary: "",
              service_provider: "",
              attachments: null,
            });
          }}
        >
          Apply Claim
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="reimbursement-table-scroll">
        <table className="reimbursement-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Claim Type</th>
              <th>Date</th>
              <th>Purpose </th>
              <th>Amount</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterClaims.map((claim, index) => (
              <tr key={claim.id}>
                <td>{index + 1}</td>
                <td>{claim.claim_type}</td>
                <td>
                  {claim.date_range
                    ? claim.date_range
                        .split(" - ")
                        .map((date) =>
                          new Date(date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        )
                        .join(" - ")
                    : claim.date
                    ? new Date(claim.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td>
                  <div className="rbadmin-comments">{claim.purpose}</div>
                </td>
                <td>{claim.total_amount}</td>
                <td>
                  {attachments[claim.id]?.length > 0 ? (
                    <button
                      className="attachments-btn"
                      onClick={() =>
                        handleOpenAttachments(attachments[claim.id], claim)
                      }
                    >
                      <MdOutlineRemoveRedEye className="eye-icon" /> View
                    </button>
                  ) : (
                    "Not Attached"
                  )}
                </td>
                <td>
                  <span
                    className={`rb-status-label ${
                      claim.status === "approved"
                        ? "rb-approved"
                        : claim.status === "rejected"
                        ? "rb-rejected"
                        : ""
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td>
                  <div className="rbadmin-comments">
                    {claim.approver_comments || "No comments"}
                  </div>
                </td>
                <td>{claim.payment_status}</td>
                <td className="actions-column">
                  {/* In self view, employees cannot edit reimbursement details */}
                  <span className="action-label"></span>
                  <MdOutlineEdit
                    className={`edit-icon ${
                      claim.status.toLowerCase() !== "pending"
                        ? "disabled-icon"
                        : ""
                    }`}
                    onClick={() => {
                      if (claim.status.toLowerCase() === "pending") {
                        handleEdit(claim);
                        setShowForm(true);
                      }
                    }}
                  />
                  <MdDeleteOutline
                    className={`delete-icon ${
                      claim.status.toLowerCase() !== "pending"
                        ? "disabled-icon"
                        : ""
                    }`}
                    onClick={() => {
                      if (claim.status.toLowerCase() === "pending") {
                        deleteReimbursement(claim.id);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td
                colSpan="4"
                style={{
                  textAlign: "right",
                  color: "#949494",
                  fontWeight: "bold",
                }}
              >
                Total Amount Claiming:{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Rs {totalAmount}
                </span>
              </td>
              <td colSpan="3" style={{ textAlign: "right" }}>
                Amount Approved: Rs{" "}
                <span style={{ fontWeight: "bold" }}>{approvedAmount}</span>
              </td>
              <td colSpan="3" style={{ textAlign: "right" }}>
                Amount Rejected: Rs{" "}
                <span style={{ fontWeight: "bold" }}>{rejectedAmount}</span>
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Cards for Mobile View */}
        <div className="rb-reimbursement-cards">
          {filterClaims.map((claim, index) => (
            <div className="rb-reimbursement-card" key={claim.id}>
              {/* Status inside the card */}
              <div className="rb-card-header">
                <span className={`rb-status ${claim.status.toLowerCase()}`}>
                  {claim.status}
                </span>
              </div>

              <div className="rb-card-body">
                <p>
                  <strong>Sl No:</strong> {index + 1}
                </p>
                <p>
                  <strong>Claim Type:</strong> {claim.claim_type}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {claim.date
                    ? new Date(claim.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
                <p>
                  <strong>Purpose:</strong> {claim.purpose}
                </p>
                <p>
                  <strong>Amount:</strong> Rs {claim.total_amount}
                </p>

                <p>
                  <strong>Comments:</strong>{" "}
                  {claim.approver_comments || "No comments"}
                </p>
              </div>

              <div className="rb-card-footer">
                {attachments[claim.id]?.length > 0 ? (
                  <button
                    className="rb-attachments-btn"
                    onClick={() =>
                      handleOpenAttachments(attachments[claim.id], claim)
                    }
                  >
                    <MdOutlineRemoveRedEye className="rb-eye-icon" /> View
                  </button>
                ) : (
                  <span className="rb-no-attachment">No Attachment</span>
                )}

                {claim.status.toLowerCase() === "pending" && (
                  <div className="rb-card-actions">
                    <MdOutlineEdit
                      className="rb-edit-icon"
                      onClick={() => {
                        handleEdit(claim);
                        setShowForm(true);
                      }}
                    />
                    <MdDeleteOutline
                      className="rb-delete-icon"
                      onClick={() => deleteReimbursement(claim.id)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="rb-modal">
          <div className="rb-modal-content">
            <div className="claim-form-header">
              <h2 className="claim-form-title">
                {editingId ? "Edit Reimbursement" : "New Reimbursement"}
              </h2>
              <MdOutlineCancel
                className="claim-form-close"
                onClick={() => setShowForm(false)}
              />
            </div>
            {submitErrorMessage && (
              <p className="error-message">{submitErrorMessage}</p>
            )}
            {updateErrorMessage && (
              <p className="error-message">{updateErrorMessage}</p>
            )}
            <form className="reimbursement-form" onSubmit={handleSubmit}>
              <div className="claim-type">
                <div className="rb-tabs">
                  {claimTypes.map(({ icon, label }) => (
                    <div
                      key={label}
                      className={`rb-tab ${
                        formData.claim_type === label ? "active" : ""
                      }`}
                      onClick={() =>
                        handleClaimTypeChange({ target: { value: label } })
                      }
                    >
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>
              {renderClaimSpecificFields()}
              <div className="reimbursement-form-button">
                <button
                  type="button"
                  className="rb-close"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rb-submit">
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Attachments */}
      {isModalOpen && (
        <div className="att-modal-overlay">
          <div className="att-modal-content">
            <div className="att-header">
              <h2>Attachments</h2>
              <MdOutlineCancel
                className="att-close"
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <h4 className="att-files">
              {selectedClaim?.claim_type
                ? `${selectedClaim.claim_type} Bills`
                : "Bills"}
            </h4>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => (
                <div className="att-files" key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </div>
              ))
            ) : (
              <p>No attachments available</p>
            )}
            <button
              className="att-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Modal
        isVisible={confirmModal.isVisible}
        onClose={closeConfirm}
        buttons={[
          { label: "Cancel", onClick: closeConfirm },
          { label: "Confirm", onClick: confirmModal.onConfirm },
        ]}
      >
        <p>{confirmModal.message}</p>
      </Modal>

      {/* Alert Modal */}
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

export default Reimbursement;
