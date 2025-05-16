import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './vendors.css';
import { FaEye } from 'react-icons/fa';
import { Eye, Download } from 'react-feather'; // or from 'react-icons/fi' or 'react-icons/fa' if using FontAwesome
import Modal from "../Modal/Modal";

const API_KEY = process.env.REACT_APP_API_KEY;

const Vendors = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    company_name: '',
    registered_address: '',
    branch_address: '',
    city: '',
    state: '',
    pin_code: '',
    gst_number: '',
    pan_number: '',
    company_type: '',
    msme_status: 'Not Applicable',
    contact1_name: '',
    contact1_designation: '',
    contact1_mobile: '',
    contact1_email: '',
    contact2_name: '',
    contact2_designation: '',
    contact2_mobile: '',
    contact2_email: '',
    contact3_name: '',
    contact3_designation: '',
    contact3_mobile: '',
    contact3_email: '',
    bank_name: '',
    branch: '',
    account_number: '',
    ifsc_code: '',
    nature_of_business: '',
    product_category: '',
    years_of_experience: '',
  });
  
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

  const [files, setFiles] = useState({
    gst_certificate: null,
    pan_card: null,
    cancelled_cheque: null,
    msme_certificate: null,
    incorporation_certificate: null,
  });
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocumentsPopup, setShowDocumentsPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showCompanyDetailsPopup, setShowCompanyDetailsPopup] = useState(false);
  const [showContactDetailsPopup, setShowContactDetailsPopup] = useState(false);
  const [showBankDetailsPopup, setShowBankDetailsPopup] = useState(false);
  const [showBusinessInfoPopup, setShowBusinessInfoPopup] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorFiles, setSelectedVendorFiles] = useState(null);
  const [error, setError] = useState('');
const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };
  const togglePopup = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'years_of_experience') {
      if (/[^0-9]/.test(value)) {
        setError('Years of Experience must contain only numbers');
      } else if (value && parseInt(value) <= 0) {
        setError('Years of Experience must be a positive number');
      } else {
        setError('');
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles({ ...files, [name]: fileList[0] });
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendors/list`, 
       
        {
          headers,
        }
      );
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      showAlert('Failed to fetch vendors');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_name || formData.company_name.trim() === '') {
      showAlert('Company name is required and cannot be empty');
      return;
    }

    const years = formData.years_of_experience;
    if (!years) {
      setError('Years of Experience is required');
      return;
    }
    if (/[^0-9]/.test(years)) {
      setError('Years of Experience must contain only numbers');
      return;
    }
    if (parseInt(years) <= 0) {
      setError('Years of Experience must be a positive number');
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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/vendors/add`, data, {
        
          headers,
        
      });
      showAlert('Vendor registered successfully!');
      togglePopup();
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        company_name: '',
        registered_address: '',
        branch_address: '',
        city: '',
        state: '',
        pin_code: '',
        gst_number: '',
        pan_number: '',
        company_type: '',
        msme_status: 'Not Applicable',
        contact1_name: '',
        contact1_designation: '',
        contact1_mobile: '',
        contact1_email: '',
        contact2_name: '',
        contact2_designation: '',
        contact2_mobile: '',
        contact2_email: '',
        contact3_name: '',
        contact3_designation: '',
        contact3_mobile: '',
        contact3_email: '',
        bank_name: '',
        branch: '',
        account_number: '',
        ifsc_code: '',
        nature_of_business: '',
        product_category: '',
        years_of_experience: '',
      });
      setFiles({
        gst_certificate: null,
        pan_card: null,
        cancelled_cheque: null,
        msme_certificate: null,
        incorporation_certificate: null,
      });
      setError('');
      fetchVendors();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      showAlert(`Failed to register vendor: ${errorMessage}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const normalizeFilePath = (filePath) => {
    if (!filePath) {
      console.warn('normalizeFilePath: Empty filePath received');
      return null;
    }
    console.log('Original filePath:', filePath);
    let normalized = filePath.replace(/\\/g, '/');
    normalized = normalized.replace(/^\.\//, '').replace(/\/+/g, '/');
    normalized = normalized.replace(/^uploads\//i, 'Uploads/');
    if (!normalized.startsWith('Uploads/')) {
      normalized = `Uploads/${normalized}`;
    }
    console.log('Normalized filePath:', normalized);
    return normalized;
  };

  const handleViewDocument = async (documentPath) => {
    if (!documentPath) {
     showAlert ("No document available.");
      return;
    }

    try {
      const fileName = documentPath.split("\\").pop();
      const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/vendors/download/${encodeURIComponent(fileName)}`;

      const response = await axios.get(fileUrl, {
        headers,
        responseType: "blob",
      });

      const extension = fileName.split(".").pop().toLowerCase();
      let mimeType = "application/octet-stream";

      if (extension === "pdf") mimeType = "application/pdf";
      else if (["jpg", "jpeg"].includes(extension)) mimeType = "image/jpeg";
      else if (extension === "png") mimeType = "image/png";

      const fileBlob = new Blob([response.data], { type: mimeType });
      const fileURL = window.URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing vendor document:", error.response?.data || error.message);
      showAlert("Failed to open vendor document.");
    }
  };

  const handleDownloadDocument = async (documentPath) => {
    if (!documentPath) {
     showAlert ("No document available.");
      return;
    }

    try {
      const fileName = documentPath.split(/[/\\]/).pop();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/vendors/download/${fileName}`,
        {
          headers,
        responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
     showAlert ("Failed to download file.");
    }
  };

  const handleDownloadAll = (vendorFiles) => {
    const fileKeys = [
      'gst_certificate',
      'pan_card',
      'cancelled_cheque',
      'msme_certificate',
      'incorporation_certificate',
    ];

    fileKeys.forEach((key) => {
      if (vendorFiles[key]) {
        handleDownloadDocument(vendorFiles[key]);
      }
    });
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

  const handleShowCompanyDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowCompanyDetailsPopup(true);
  };

  const handleShowContactDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowContactDetailsPopup(true);
  };

  const handleShowBankDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowBankDetailsPopup(true);
  };

  const handleShowBusinessInfo = (vendor) => {
    setSelectedVendor(vendor);
    setShowBusinessInfoPopup(true);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vendors-container">
      <div className="header-container">
        <div className="vendor-search-container">
          <input
            type="text"
            placeholder="Search by Company Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <button className="add-vendor-btn" onClick={togglePopup}>
          Add Vendor
        </button>
      </div>

      <div className="table-scroll-wrapper">
        <table className="vendor-table">
  <thead>
    <tr className="header-row">
      <th>Vendor ID</th>
      <th>Company Name</th>
      <th>Company Details</th>
      <th>Contact Details</th>
      <th>Bank Details</th>
      <th>Business Information</th>
      <th>Documents</th>
    </tr>
  </thead>
  <tbody>
    {filteredVendors.map(vendor => (
      <tr key={vendor.vendor_id}>
        <td>{vendor.vendor_id}</td>
        <td>{vendor.company_name}</td>

        <td>
          <button
            className="vendor-view-doc-btn"
            onClick={() => handleShowCompanyDetails(vendor)}
          >
            <Eye size={16} style={{ marginRight: '5px' }} /> View
          </button>
        </td>

        <td>
          <button
            className="vendor-view-doc-btn"
            onClick={() => handleShowContactDetails(vendor)}
          >
            <Eye size={16} style={{ marginRight: '5px' }} /> View
          </button>
        </td>

        <td>
          <button
            className="vendor-view-doc-btn"
            onClick={() => handleShowBankDetails(vendor)}
          >
            <Eye size={16} style={{ marginRight: '5px' }} /> View
          </button>
        </td>

        <td>
          <button
            className="vendor-view-doc-btn"
            onClick={() => handleShowBusinessInfo(vendor)}
          >
            <Eye size={16} style={{ marginRight: '5px' }} /> View
          </button>
        </td>

        <td>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="vendor-view-doc-btn"
              onClick={() => handleShowDocuments(vendor)}
            >
              <Eye size={16} style={{ marginRight: '5px' }} /> View
            </button>

            <button
              className="vendor-download-doc-btn"
              onClick={() => handleShowDownloadPopup(vendor)}
            >
              <Download size={16} style={{ marginRight: '5px' }} /> Download
            </button>
          </div>
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
              <div className='companydetailsfeildset'>
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
                        required
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
                        required
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
                        required
                      />
                    </div>
                  </div>
                  <div className="contact-row four-columns">
                    <div className="contact-field">
                      <label htmlFor="gst_number">GST Number:</label>
                      <input
                        id="gst_number"
                        name="gst_number"
                        placeholder="GST Number"
                        value={formData.gst_number}
                        onChange={handleInputChange}
                        required
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
                        required
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
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="msme_status">MSME Status:</label>
                      <select
                        id="msme_status"
                        name="msme_status"
                        value={formData.msme_status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Applicable">Applicable</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>
                  </div>
                  <div className="contact-row two-columns">
                    <div className="contact-field">
                      <label htmlFor="registered_address">Registered Address:</label>
                      <input
                        id="registered_address"
                        name="registered_address"
                        placeholder="Registered Address"
                        value={formData.registered_address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="branch_address">Branch/Manufacturing Address:</label>
                      <input
                        id="branch_address"
                        name="branch_address"
                        placeholder="Branch/Manufacturing Address"
                        value={formData.branch_address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className='contactdetailsfeildset'>
                {[1, 2, 3].map((i) => (
                  <fieldset key={i} className="contact-fieldset spaced">
                    <legend>Contact Details - {i}</legend>
                    <div className="contact-row four-columns">
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_name`}>Contact Person Name:</label>
                        <input
                          id={`contact${i}_name`}
                          name={`contact${i}_name`}
                          placeholder="Contact Person Name"
                          value={formData[`contact${i}_name`]}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_designation`}>Designation:</label>
                        <input
                          id={`contact${i}_designation`}
                          name={`contact${i}_designation`}
                          placeholder="Designation"
                          value={formData[`contact${i}_designation`]}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor={`contact${i}_mobile`}>Mobile Number:</label>
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

              <div className='feildsetbankdetails'>
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
                        required
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
                        required
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
                        required
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
                        required
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className='feildsetbusinessinformation'>
                <fieldset>
                  <legend>Business Information</legend>
                  <div className="contact-row three-columns">
                    <div className="contact-field">
                      <label htmlFor="nature_of_business">Nature of Business:</label>
                      <input
                        id="nature_of_business"
                        name="nature_of_business"
                        placeholder="Nature of Business"
                        value={formData.nature_of_business}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="product_category">Category of Products:</label>
                      <input
                        id="product_category"
                        name="product_category"
                        placeholder="Category of Products/Services"
                        value={formData.product_category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="years_of_experience">Years of Experience:</label>
                      <input
                        id="years_of_experience"
                        name="years_of_experience"
                        type="number"
                        min="1"
                        pattern="[0-9]*"
                        placeholder="Years of Experience"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                        required
                      />
                      {error && <span className="error-message">{error}</span>}
                    </div>
                  </div>
                </fieldset>
              </div>

              <fieldset>
                <legend>Documents Required (Attach Copies)</legend>
                <div className="contact-row three-columns">
                  <div className="contact-field">
                    <label htmlFor="gst_certificate">GST Certificate:</label>
                    <input
                      id="gst_certificate"
                      type="file"
                      name="gst_certificate"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                      required
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
                      required
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
                </div>
                <div className="contact-row two-columns">
                  <div className="contact-field msme-field">
                    <label htmlFor="msme_certificate">MSME Certificate (if applicable):</label>
                    <input
                      id="msme_certificate"
                      type="file"
                      name="msme_certificate"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="incorporation_certificate">Company Incorporation Certificate:</label>
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
                <button type="button" onClick={togglePopup} className="vendor-close-btn">
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

      {showCompanyDetailsPopup && selectedVendor && (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup-box">
            <button
              className="vendor-popup-close-btn"
              onClick={() => setShowCompanyDetailsPopup(false)}
            >
              ×
            </button>
            <h2 className="vendor-popup-title">Company Details</h2>
            <div className="vendor-details-container">
              <table className="details-table">
                <tbody>
                  <tr>
                    <td className="details-label">Company Name</td>
                    <td className="details-value">{selectedVendor.company_name}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Registered Address</td>
                    <td className="details-value">{selectedVendor.registered_address}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Branch/Manufacturing Address</td>
                    <td className="details-value">{selectedVendor.branch_address || '-'}</td>
                  </tr>
                  <tr>
                    <td className="details-label">City</td>
                    <td className="details-value">{selectedVendor.city}</td>
                  </tr>
                  <tr>
                    <td className="details-label">State</td>
                    <td className="details-value">{selectedVendor.state}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Pin Code</td>
                    <td className="details-value">{selectedVendor.pin_code}</td>
                  </tr>
                  <tr>
                    <td className="details-label">GST Number</td>
                    <td className="details-value">{selectedVendor.gst_number}</td>
                  </tr>
                  <tr>
                    <td className="details-label">PAN Number</td>
                    <td className="details-value">{selectedVendor.pan_number}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Company Type</td>
                    <td className="details-value">{selectedVendor.company_type}</td>
                  </tr>
                  <tr>
                    <td className="details-label">MSME Status</td>
                    <td className="details-value">{selectedVendor.msme_status || 'Not Applicable'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
{showContactDetailsPopup && selectedVendor && (
  <div className="vendor-popup-overlay">
    <div className="vendor-popup-box">
      <button
        className="vendor-popup-close-btn"
        onClick={() => setShowContactDetailsPopup(false)}
      >
        ×
      </button>
      <h2 className="vendor-popup-title">Contact Details</h2>
      <div className="contact-grid">
        {/* Contact 1 */}
        <div className="grid-label" rowSpan={2}>Contact 1</div>
        <div className="grid-field">Name: {selectedVendor.contact1_name || '-'}</div>
        <div className="grid-field">Designation: {selectedVendor.contact1_designation || '-'}</div>
        <div className="grid-field">Email: {selectedVendor.contact1_email || '-'}</div>
        <div className="grid-field">Mobile: {selectedVendor.contact1_mobile || '-'}</div>

        {/* Contact 2 */}
        <div className="grid-label">Contact 2</div>
        <div className="grid-field">Name: {selectedVendor.contact2_name || '-'}</div>
        <div className="grid-field">Designation: {selectedVendor.contact2_designation || '-'}</div>
        <div className="grid-field">Email: {selectedVendor.contact2_email || '-'}</div>
        <div className="grid-field">Mobile: {selectedVendor.contact2_mobile || '-'}</div>

        {/* Contact 3 */}
        <div className="grid-label">Contact 3</div>
        <div className="grid-field">Name: {selectedVendor.contact3_name || '-'}</div>
        <div className="grid-field">Designation: {selectedVendor.contact3_designation || '-'}</div>
        <div className="grid-field">Email: {selectedVendor.contact3_email || '-'}</div>
        <div className="grid-field">Mobile: {selectedVendor.contact3_mobile || '-'}</div>
      </div>
    </div>
  </div>
)}


      {showBankDetailsPopup && selectedVendor && (
        <div className="vendor-popup-overlay">
          <div className="vendor-popup-box">
            <button
              className="vendor-popup-close-btn"
              onClick={() => setShowBankDetailsPopup(false)}
            >
              ×
            </button>
            <h2 className="vendor-popup-title">Bank Details</h2>
            <div className="vendor-details-container">
              <table className="details-table">
                <tbody>
                  <tr>
                    <td className="details-label">Bank Name</td>
                    <td className="details-value">{selectedVendor.bank_name}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Branch</td>
                    <td className="details-value">{selectedVendor.branch}</td>
                  </tr>
                  <tr>
                    <td className="details-label">Account Number</td>
                    <td className="details-value">{selectedVendor.account_number}</td>
                  </tr>
                  <tr>
                    <td className="details-label">IFSC Code</td>
                    <td className="details-value">{selectedVendor.ifsc_code}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showBusinessInfoPopup && selectedVendor && (
  <div className="vendor-popup-overlay">
    <div className="vendor-popup-box">
      <button
        className="vendor-popup-close-btn"
        onClick={() => setShowBusinessInfoPopup(false)}
      >
        ×
      </button>
      <h2 className="vendor-popup-title">Business Information</h2>
      <div className="vendor-details-container">
        <table className="details-table">
          <tbody>
            <tr>
              <td className="details-label">Nature of Business</td>
              <td className="details-value">{selectedVendor.nature_of_business}</td>
            </tr>
            <tr>
              <td className="details-label">Product Category</td>
              <td className="details-value">{selectedVendor.product_category}</td>
            </tr>
            <tr>
              <td className="details-label">Years of Experience</td>
              <td className="details-value">{selectedVendor.years_of_experience}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
                  className={selectedVendorFiles.gst_certificate ? 'file-link' : 'file-link disabled'}
                  onClick={() => handleViewDocument(selectedVendorFiles.gst_certificate)}
                >
                  GST Certificate
                </span>
              </li>
              <li>
                <span
                  className={selectedVendorFiles.pan_card ? 'file-link' : 'file-link disabled'}
                  onClick={() => handleViewDocument(selectedVendorFiles.pan_card)}
                >
                  PAN Card
                </span>
              </li>
              <li>
                <span
                  className={selectedVendorFiles.cancelled_cheque ? 'file-link' : 'file-link disabled'}
                  onClick={() => handleViewDocument(selectedVendorFiles.cancelled_cheque)}
                >
                  Cancelled Cheque
                </span>
              </li>
              <li>
                <span
                  className={selectedVendorFiles.msme_certificate ? 'file-link' : 'file-link disabled'}
                  onClick={() => handleViewDocument(selectedVendorFiles.msme_certificate)}
                >
                  MSME Certificate
                </span>
              </li>
              <li>
                <span
                  className={selectedVendorFiles.incorporation_certificate ? 'file-link' : 'file-link disabled'}
                  onClick={() => handleViewDocument(selectedVendorFiles.incorporation_certificate)}
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
                  onClick={() => handleDownloadDocument(selectedVendorFiles.gst_certificate)}
                  disabled={!selectedVendorFiles.gst_certificate}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">PAN Card</span>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadDocument(selectedVendorFiles.pan_card)}
                  disabled={!selectedVendorFiles.pan_card}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">Cancelled Cheque</span>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadDocument(selectedVendorFiles.cancelled_cheque)}
                  disabled={!selectedVendorFiles.cancelled_cheque}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">MSME Certificate</span>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadDocument(selectedVendorFiles.msme_certificate)}
                  disabled={!selectedVendorFiles.msme_certificate}
                >
                  Download
                </button>
              </li>
              <li className="document-item">
                <span className="file-name">Incorporation Certificate</span>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadDocument(selectedVendorFiles.incorporation_certificate)}
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

export default Vendors;