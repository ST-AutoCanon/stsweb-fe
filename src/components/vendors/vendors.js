import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendors.css";
const API_KEY = process.env.REACT_APP_API_KEY;

const Vendors = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    company_name: "",
    registered_address: "",
    city: "",
    state: "",
    pin_code: "",
    gst_number: "",
    pan_number: "",
    company_type: "",
    contact1_name: "",
    contact1_designation: "",
    contact1_mobile: "",
    contact1_email: "",
    contact2_name: "",
    contact2_designation: "",
    contact2_mobile: "",
    contact2_email: "",
    contact3_name: "",
    contact3_designation: "",
    contact3_mobile: "",
    contact3_email: "",
    bank_name: "",
    branch: "",
    account_number: "",
    ifsc_code: "",
    nature_of_business: "",
    product_category: "",
    years_of_experience: "",
  });
  const [files, setFiles] = useState({
    gst_certificate: null,
    pan_card: null,
    cancelled_cheque: null,
    msme_certificate: null,
    incorporation_certificate: null,
  });
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedVendorFiles, setSelectedVendorFiles] = useState(null);

  const togglePopup = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles({ ...files, [name]: fileList[0] });
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/vendors/list", {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      alert("Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name || formData.company_name.trim() === "") {
      alert("Company name is required and cannot be empty");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    for (const key in files) {
      if (files[key]) {
        data.append(key, files[key]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/vendors/add",
        data,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Vendor registered successfully!");
      togglePopup();
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        company_name: "",
        registered_address: "",
        city: "",
        state: "",
        pin_code: "",
        gst_number: "",
        pan_number: "",
        company_type: "",
        contact1_name: "",
        contact1_designation: "",
        contact1_mobile: "",
        contact1_email: "",
        contact2_name: "",
        contact2_designation: "",
        contact2_mobile: "",
        contact2_email: "",
        contact3_name: "",
        contact3_designation: "",
        contact3_mobile: "",
        contact3_email: "",
        bank_name: "",
        branch: "",
        account_number: "",
        ifsc_code: "",
        nature_of_business: "",
        product_category: "",
        years_of_experience: "",
      });
      setFiles({
        gst_certificate: null,
        pan_card: null,
        cancelled_cheque: null,
        msme_certificate: null,
        incorporation_certificate: null,
      });
      fetchVendors();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      alert(`Failed to register vendor: ${errorMessage}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (filePath) => {
    if (filePath) {
      window.open(`http://localhost:5000/${filePath}`, "_blank");
    } else {
      alert("Document not available");
    }
  };

  const handleDownloadDocument = (filePath) => {
    if (filePath) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/${filePath}`;
      link.download = filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Document not available");
    }
  };

  const handleShowDocuments = (vendor) => {
    setSelectedVendorFiles({
      gst_certificate: vendor.gst_certificate,
      pan_card: vendor.pan_card,
      cancelled_cheque: vendor.cancelled_cheque,
      msme_certificate: vendor.msme_certificate,
      incorporation_certificate: vendor.incorporation_certificate,
    });
    setShowDocumentsPopup(true);
  };

  const handleShowDownloadPopup = (vendor) => {
    setSelectedVendorFiles({
      gst_certificate: vendor.gst_certificate,
      pan_card: vendor.pan_card,
      cancelled_cheque: vendor.cancelled_cheque,
      msme_certificate: vendor.msme_certificate,
      incorporation_certificate: vendor.incorporation_certificate,
    });
    setShowDownloadPopup(true);
  };

  const handleDownloadAll = (files) => {
    const filePaths = [
      files.gst_certificate,
      files.pan_card,
      files.cancelled_cheque,
      files.msme_certificate,
      files.incorporation_certificate,
    ].filter(Boolean);

    if (filePaths.length === 0) {
      alert("No documents available to download");
      return;
    }

    filePaths.forEach((filePath) => {
      handleDownloadDocument(filePath);
    });
  };

  return (
    <div className="vendors-container">
      <button className="add-vendor-btn" onClick={togglePopup}>
        Add Vendor
      </button>

      <div className="table-scroll-wrapper">
        <div className="v-search-container">
          <input
            type="text"
            placeholder="Search by Company Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <table className="vendor-table">
          <thead>
            <tr className="header-row">
              <th>Vendor ID</th>
              <th>Company Name</th>
              <th>City</th>
              <th>State</th>
              <th>Contact 1 Name</th>
              <th>Contact 1 Mobile</th>
              <th>Contact 1 Email</th>
              <th>Experience</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr key={vendor.vendor_id}>
                <td>{vendor.vendor_id}</td>
                <td>{vendor.company_name}</td>
                <td>{vendor.city}</td>
                <td>{vendor.state}</td>
                <td>{vendor.contact1_name}</td>
                <td>{vendor.contact1_mobile}</td>
                <td>{vendor.contact1_email}</td>
                <td>{vendor.years_of_experience}</td>
                <td className="document-actions">
                  <button
                    className="view-documents-btn"
                    onClick={() => handleShowDocuments(vendor)}
                  >
                    👁️
                  </button>
                  <button
                    className="download-all-btn"
                    onClick={() => handleShowDownloadPopup(vendor)}
                  >
                    ⬇️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup-form">
            <button className="vendor-popup-close-btn" onClick={togglePopup}>
              ×
            </button>

            <h2 className="vendor-form-title">Vendor Registration Form</h2>

            <form onSubmit={handleSubmit}>
              {/* Company Details */}
              <div className="companydetailsfeildset">
                <fieldset>
                  <legend>Company Details</legend>
                  <div className="contact-row four-columns">
                    <div className="contact-field">
                      <label htmlFor="company_name">Company Name:</label>
                      <input
                        id="company_name"
                        name="company_name"
                        placeholder="Company Name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="city">City:</label>
                      <input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="state">State:</label>
                      <input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="pin_code">Pin Code:</label>
                      <input
                        id="pin_code"
                        name="pin_code"
                        placeholder="Pin Code"
                        value={formData.pin_code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="contact-row three-columns">
                    <div className="contact-field">
                      <label htmlFor="gst_number">GST Number:</label>
                      <input
                        id="gst_number"
                        name="gst_number"
                        placeholder="GST Number"
                        value={formData.gst_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="pan_number">PAN Number:</label>
                      <input
                        id="pan_number"
                        name="pan_number"
                        placeholder="PAN Number"
                        value={formData.pan_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="company_type">Company Type:</label>
                      <input
                        id="company_type"
                        name="company_type"
                        placeholder="Company Type"
                        value={formData.company_type}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="contact-row full-width">
                    <div className="contact-field">
                      <label htmlFor="registered_address">
                        Registered Address:
                      </label>
                      <input
                        id="registered_address"
                        name="registered_address"
                        placeholder="Registered Address"
                        value={formData.registered_address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Contact Details */}
              <div className="contactdetailsfeildset">
                {[1, 2, 3].map((i) => (
                  <fieldset key={i} className="contact-fieldset spaced">
                    <legend>Contact Details - {i}</legend>
                    <div className="contact-row four-columns">
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_name`}>
                          Contact Person Name:
                        </label>
                        <input
                          id={`contact${i}_name`}
                          name={`contact${i}_name`}
                          placeholder="Contact Person Name"
                          value={formData[`contact${i}_name`]}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_designation`}>
                          Designation:
                        </label>
                        <input
                          id={`contact${i}_designation`}
                          name={`contact${i}_designation`}
                          placeholder="Designation"
                          value={formData[`contact${i}_designation`]}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_mobile`}>
                          Mobile Number:
                        </label>
                        <input
                          id={`contact${i}_mobile`}
                          name={`contact${i}_mobile`}
                          placeholder="Mobile Number"
                          value={formData[`contact${i}_mobile`]}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_email`}>Email ID:</label>
                        <input
                          id={`contact${i}_email`}
                          name={`contact${i}_email`}
                          placeholder="Email ID"
                          value={formData[`contact${i}_email`]}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </fieldset>
                ))}
              </div>

              {/* Bank Details */}
              <div className="feildsetbankdetails">
                <fieldset>
                  <legend>Bank Details</legend>
                  <div className="contact-row four-columns">
                    <div className="contact-field">
                      <label htmlFor="bank_name">Bank Name:</label>
                      <input
                        id="bank_name"
                        name="bank_name"
                        placeholder="Bank Name"
                        value={formData.bank_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="branch">Branch:</label>
                      <input
                        id="branch"
                        name="branch"
                        placeholder="Branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="account_number">Account Number:</label>
                      <input
                        id="account_number"
                        name="account_number"
                        placeholder="Account Number"
                        value={formData.account_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="ifsc_code">IFSC Code:</label>
                      <input
                        id="ifsc_code"
                        name="ifsc_code"
                        placeholder="IFSC Code"
                        value={formData.ifsc_code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Business Info */}
              <div className="feildsetbusinessinformation">
                <fieldset>
                  <legend>Business Information</legend>
                  <div className="contact-row three-columns">
                    <div className="contact-field">
                      <label htmlFor="nature_of_business">
                        Nature of Business:
                      </label>
                      <input
                        id="nature_of_business"
                        name="nature_of_business"
                        placeholder="Nature of Business"
                        value={formData.nature_of_business}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="product_category">
                        Category of Products:
                      </label>
                      <input
                        id="product_category"
                        name="product_category"
                        placeholder="Category of Products/Services"
                        value={formData.product_category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="years_of_experience">
                        Years of Experience:
                      </label>
                      <input
                        id="years_of_experience"
                        name="years_of_experience"
                        placeholder="Years of Experience"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Documents */}
              <fieldset>
                <legend>Documents Required (Attach Copies)</legend>
                <div className="contact-row four-columns">
                  <div className="contact-field">
                    <label htmlFor="gst_certificate">GST Certificate:</label>
                    <input
                      id="gst_certificate"
                      type="file"
                      name="gst_certificate"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="pan_card">PAN Card:</label>
                    <input
                      id="pan_card"
                      type="file"
                      name="pan_card"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="cancelled_cheque">Cancelled Cheque:</label>
                    <input
                      id="cancelled_cheque"
                      type="file"
                      name="cancelled_cheque"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="msme_certificate">
                      MSME Certificate (if applicable):
                    </label>
                    <input
                      id="msme_certificate"
                      type="file"
                      name="msme_certificate"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="contact-row one-column">
                  <div className="contact-field">
                    <label htmlFor="incorporation_certificate">
                      Company Incorporation Certificate:
                    </label>
                    <input
                      id="incorporation_certificate"
                      type="file"
                      name="incorporation_certificate"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </fieldset>

              <div className="vendor-form-buttons">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="vendor-close-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="vendor-submit-btn">
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDocumentsPopup && selectedVendorFiles && (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup-form documents-popup">
            <button
              className="vendor-popup-close-btn"
              onClick={() => setShowDocumentsPopup(false)}
            >
              ×
            </button>
            <h2 className="vendor-form-title">Vendor Documents (View)</h2>
            <ul className="documents-list">
              <li>
                <span
                  className={
                    selectedVendorFiles.gst_certificate
                      ? "file-link"
                      : "file-link disabled"
                  }
                  onClick={() =>
                    handleViewDocument(selectedVendorFiles.gst_certificate)
                  }
                >
                  GST Certificate
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedVendorFiles.pan_card
                      ? "file-link"
                      : "file-link disabled"
                  }
                  onClick={() =>
                    handleViewDocument(selectedVendorFiles.pan_card)
                  }
                >
                  PAN Card
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedVendorFiles.cancelled_cheque
                      ? "file-link"
                      : "file-link disabled"
                  }
                  onClick={() =>
                    handleViewDocument(selectedVendorFiles.cancelled_cheque)
                  }
                >
                  Cancelled Cheque
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedVendorFiles.msme_certificate
                      ? "file-link"
                      : "file-link disabled"
                  }
                  onClick={() =>
                    handleViewDocument(selectedVendorFiles.msme_certificate)
                  }
                >
                  MSME Certificate
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedVendorFiles.incorporation_certificate
                      ? "file-link"
                      : "file-link disabled"
                  }
                  onClick={() =>
                    handleViewDocument(
                      selectedVendorFiles.incorporation_certificate
                    )
                  }
                >
                  Incorporation Certificate
                </span>
              </li>
            </ul>
            <div className="vendor-form-buttons">
              <button
                className="vendor-submit-btn"
                onClick={() => handleDownloadAll(selectedVendorFiles)}
                disabled={
                  !selectedVendorFiles.gst_certificate &&
                  !selectedVendorFiles.pan_card &&
                  !selectedVendorFiles.cancelled_cheque &&
                  !selectedVendorFiles.msme_certificate &&
                  !selectedVendorFiles.incorporation_certificate
                }
              >
                Download All
              </button>
            </div>
          </div>
        </div>
      )}

      {showDownloadPopup && selectedVendorFiles && (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup-form documents-popup">
            <button
              className="vendor-popup-close-btn"
              onClick={() => setShowDownloadPopup(false)}
            >
              ×
            </button>
            <h2 className="vendor-form-title">Vendor Documents (Download)</h2>
            <ul className="documents-list">
              <li className="document-item">
                <span className="file-name">GST Certificate</span>
                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownloadDocument(selectedVendorFiles.gst_certificate)
                  }
                  disabled={!selectedVendorFiles.gst_certificate}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">PAN Card</span>
                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownloadDocument(selectedVendorFiles.pan_card)
                  }
                  disabled={!selectedVendorFiles.pan_card}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">Cancelled Cheque</span>
                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownloadDocument(selectedVendorFiles.cancelled_cheque)
                  }
                  disabled={!selectedVendorFiles.cancelled_cheque}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">MSME Certificate</span>
                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownloadDocument(selectedVendorFiles.msme_certificate)
                  }
                  disabled={!selectedVendorFiles.msme_certificate}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">Incorporation Certificate</span>
                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownloadDocument(
                      selectedVendorFiles.incorporation_certificate
                    )
                  }
                  disabled={!selectedVendorFiles.incorporation_certificate}
                >
                  Download
                </button>
              </li>
            </ul>
            <div className="vendor-form-buttons">
              <button
                className="vendor-submit-btn"
                onClick={() => handleDownloadAll(selectedVendorFiles)}
                disabled={
                  !selectedVendorFiles.gst_certificate &&
                  !selectedVendorFiles.pan_card &&
                  !selectedVendorFiles.cancelled_cheque &&
                  !selectedVendorFiles.msme_certificate &&
                  !selectedVendorFiles.incorporation_certificate
                }
              >
                Download All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
