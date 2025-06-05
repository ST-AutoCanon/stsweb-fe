
import React, { useState, useRef } from 'react';
import generatePDF from './generatepdfforletters';
import './letterhead.css';

const LetterHead = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [letterType, setLetterType] = useState('Letter');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [signature, setSignature] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [position, setPosition] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const contentRef = useRef(null);
  const letterRef = useRef(null);

  const originalLogo = '/images/OriginalLogo.png';
const API_KEY = process.env.REACT_APP_API_KEY;
const meId = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  ).employeeId;
  const headers = { "x-api-key": API_KEY, "x-employee-id": meId };

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
  template_name: '',
  letter_type: '',
  subject: '',
  body: '',
  
});



  const showAlert = (message) => {
    console.log('Current formData:', formData);
    alert(message); // You can customize this to show a styled popup
  };

  const handleSave = async (e) => {
  e.preventDefault();

  const { template_name, letter_type, subject, body } = formData;

  // === Validation ===
  if (!template_name || template_name.trim() === '') {
    showAlert('Template name is required');
    return;
  }

  if (!letter_type || letter_type.trim() === '') {
    showAlert('Letter type is required');
    return;
  }

  if (!subject || subject.trim() === '') {
    showAlert('Subject is required');
    return;
  }

  if (!body || body.trim() === '') {
    showAlert('Letter body is required');
    return;
  }

  // Replace these with actual values (e.g. from user session or context)
  const API_KEY = 'your_api_key_here';
  const meId = 'your_employee_id_here';

  try {
    const response = await axios.post(
      
      'http://localhost:5000/api/letterheads/add',
      {
        template_name,
        letter_type,
        subject,
        body,
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'x-employee-id': meId,
          'Content-Type': 'application/json',
        },
      }
    );

    showAlert('Letterhead saved successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error saving letterhead:', errorMessage);
    showAlert(`Failed to save letterhead: ${errorMessage}`);
  }
};


// const handleSave = async (e) => {
//   e.preventDefault();

//   // Validate Company Name
//   if (!formData.company_name || formData.company_name.trim() === '') {
//     showAlert('Company name is required and cannot be empty');
//     return;
//   }

//   // Validate Years of Experience
//   const years = formData.years_of_experience;
//   if (!years) {
//     showAlert('Years of Experience is required');
//     return;
//   }
//   if (/[^0-9]/.test(years)) {
//     showAlert('Years of Experience must contain only numbers');
//     return;
//   }
//   if (parseInt(years) <= 0) {
//     showAlert('Years of Experience must be a positive number');
//     return;
//   }

//   // Validate Contact 1 fields
//   if (!formData.contact1_name || formData.contact1_name.trim() === '') {
//     showAlert('Contact 1 Name is required and cannot be empty');
//     return;
//   }
//   if (!formData.contact1_designation || formData.contact1_designation.trim() === '') {
//     showAlert('Contact 1 Designation is required and cannot be empty');
//     return;
//   }
//   if (!formData.contact1_mobile || formData.contact1_mobile.trim() === '') {
//     showAlert('Contact 1 Mobile Number is required and cannot be empty');
//     return;
//   }
//   if (!formData.contact1_email || formData.contact1_email.trim() === '') {
//     showAlert('Contact 1 Email ID is required and cannot be empty');
//     return;
//   }

//   // You can add more validations here...

//   // Prepare payload (assuming JSON)
//   const payload = { ...formData };

//   // Prepare headers with API key and employee ID
//   const headers = {
//     'x-api-key': API_KEY,           // Replace this with your actual API key
//     'x-employee-id': meId,   // Replace this with actual Employee ID
//     'Content-Type': application/json,
//   };

//   try {
//     const response = await axios.post(
//       'http://localhost:5000/api/letterheads/add',
//       payload,
//       { headers }
//     );

//     showAlert('Data saved successfully!');
//     // Optionally reset form or close modal here
//   } catch (error) {
//     const errMsg = error.response?.data?.message || error.message || 'Unknown error';
//     showAlert(`Failed to save data: ${errMsg}`);
//   }
// };

const letterTemplates = {
    'Offer Letter': `
      Dear [Recipient Name],

      We are pleased to offer you the position of [Position] at Sukalpa Tech Solutions Pvt Ltd. Your skills and experience align perfectly with our team’s vision. Below are the details of your employment:

      - <strong>Position</strong>: [Position]
      - <strong>Start Date</strong>: [Start Date]
      - <strong>Salary</strong>: [Salary Details]
      - <strong>Benefits</strong>: [Benefits Details]

      Please confirm your acceptance by signing and returning a copy of this letter by [Date].

      We look forward to welcoming you to the team!

      Best Regards,
    `,
    'Relieving Letter': `
      Dear [Recipient Name],

      This is to certify that [Employee Name] has been relieved from their duties as [Position] at Sukalpa Tech Solutions Pvt Ltd, effective [Date]. During their tenure, [Employee Name] demonstrated professionalism and dedication.

      We wish them the very best in their future endeavors.

      Sincerely,
    `,
    'Bank Details Request Letter': `
      Dear [Recipient Name],

      Subject: Request for Bank Details

      We hope this message finds you well. To facilitate [Purpose, e.g., salary processing, vendor payments], kindly provide the following bank details:

      - <strong>Bank Name</strong>:
      - <strong>Account Number</strong>:
      - <strong>IFSC Code</strong>:
      - <strong>Branch Name</strong>:

      Please submit these details by [Date] to ensure timely processing.

      Thank you for your cooperation.

      Regards,
    `,
    'Letter': `
      Dear [Recipient Name],

      This is a general letter template. Please edit the content as needed to suit your requirements.

      Thank you.

      Regards,
    `,
  };

  const handleLetterTypeChange = (e) => {
    const selectedType = e.target.value;
    setLetterType(selectedType);
    if (contentRef.current) {
      let template = letterTemplates[selectedType];
      template = template
        .replace('[Recipient Name]', recipientName || '[Recipient Name]')
        .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
        .replace(/\[Position\]/g, position || '[Position]')
        .replace(/\[Date\]/g, effectiveDate || '[Date]');
      contentRef.current.innerHTML = template;
    }
    setSubject(selectedType === 'Letter' ? '' : selectedType);
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
  };

  const handleGenerate = () => {
    const element = letterRef.current;
    generatePDF(element, letterType, originalLogo, recipientName, employeeName, position, effectiveDate);
  };

  const handlePreview = async () => {
    try {
      const element = letterRef.current;
      const pdfBlob = await generatePDF(
        element,
        letterType,
        originalLogo,
        recipientName,
        employeeName,
        position,
        effectiveDate,
        true
      );
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('Failed to generate PDF preview. Check console for details.');
    }
  };

  const handleClosePreview = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setShowPreview(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = '<br>';
      range.insertNode(newParagraph);
      range.selectNodeContents(newParagraph);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      contentRef.current.focus();
    }
  };

  return (
    <div className="letterhead-letterhead-container">
      <button
        onClick={() => setShowPopup(true)}
        className="letterhead-open-popup-btn"
      >
        Create Letter
      </button>

      {showPopup && (
        <div className="letterhead-popup-overlay">
          <div className="letterhead-popup-content" ref={letterRef}>
            <div className="letterhead-letterhead-header">
              <img src={originalLogo} alt="Company Logo" className="letterhead-watermark" />
              <h2 className="letterhead-letterhead-title">Sukalpa Tech Solutions Pvt Ltd</h2>
              {/* <p className="letterhead-letterhead-tagline">Let us join to support you deserve</p> */}
              <p className="letterhead-letterhead-subtitle">
                #71, Bauxite Road, Sarathi Nagar, Belagavi -591108, Karnataka, India | 
                admin@sukalpatechsolutions.com | 
                +9178928-59968 | 
                <a href="https://sukalpatechsolutions.com">sukalpatechsolutions.com</a>
              </p>
              <hr />
            </div>

            <div className="letterhead-letter-form">
              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="letterType">Letter Type</label>
                  <div className="letterhead-input-container">
                    <select
                      id="letterType"
                      value={letterType}
                      onChange={handleLetterTypeChange}
                      className="letterhead-letter-type-select letterhead-highlighted-select"
                    >
                      <option value="Letter">General Letter</option>
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="Relieving Letter">Relieving Letter</option>
                      <option value="Bank Details Request Letter">Bank Details Request Letter</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="recipientName">Recipient Name</label>
                  <div className="letterhead-input-container">
                    <input
                      id="recipientName"
                      type="text"
                      placeholder="Recipient Name"
                      value={recipientName}
                      onChange={(e) => {
                        setRecipientName(e.target.value);
                        if (contentRef.current) {
                          let template = letterTemplates[letterType];
                          template = template
                            .replace('[Recipient Name]', e.target.value || '[Recipient Name]')
                            .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
                            .replace(/\[Position\]/g, position || '[Position]')
                            .replace(/\[Date\]/g, effectiveDate || '[Date]');
                          contentRef.current.innerHTML = template;
                        }
                      }}
                      className="letterhead-input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="address">Recipient Address</label>
                  <div className="letterhead-input-container">
                    <input
                      id="address"
                      type="text"
                      placeholder="Recipient Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="letterhead-input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="date">Date</label>
                  <div className="letterhead-input-container">
                    <input
                      id="date"
                      type="date"
                      placeholder="Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="letterhead-input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="letterhead-input-container">
                    <input
                      id="subject"
                      type="text"
                      placeholder="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="letterhead-input-field"
                    />
                  </div>
                </div>
              </div>

              {letterType === 'Relieving Letter' && (
                <>
                  <div className="letterhead-form-row">
                    <div className="letterhead-form-group">
                      <label htmlFor="employeeName">Employee Name</label>
                      <div className="letterhead-input-container">
                        <input
                          id="employeeName"
                          type="text"
                          placeholder="Employee Name"
                          value={employeeName}
                          onChange={(e) => {
                            setEmployeeName(e.target.value);
                            if (contentRef.current) {
                              let template = letterTemplates[letterType];
                              template = template
                                .replace('[Recipient Name]', recipientName || '[Recipient Name]')
                                .replace(/\[Employee Name\]/g, e.target.value || '[Employee Name]')
                                .replace(/\[Position\]/g, position || '[Position]')
                                .replace(/\[Date\]/g, effectiveDate || '[Date]');
                              contentRef.current.innerHTML = template;
                            }
                          }}
                          className="letterhead-input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="letterhead-form-row">
                    <div className="letterhead-form-group">
                      <label htmlFor="position">Position</label>
                      <div className="letterhead-input-container">
                        <input
                          id="position"
                          type="text"
                          placeholder="Position"
                          value={position}
                          onChange={(e) => {
                            setPosition(e.target.value);
                            if (contentRef.current) {
                              let template = letterTemplates[letterType];
                              template = template
                                .replace('[Recipient Name]', recipientName || '[Recipient Name]')
                                .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
                                .replace(/\[Position\]/g, e.target.value || '[Position]')
                                .replace(/\[Date\]/g, effectiveDate || '[Date]');
                              contentRef.current.innerHTML = template;
                            }
                          }}
                          className="letterhead-input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="letterhead-form-row">
                    <div className="letterhead-form-group">
                      <label htmlFor="effectiveDate">Effective Date</label>
                      <div className="letterhead-input-container">
                        <input
                          id="effectiveDate"
                          type="date"
                          placeholder="Effective Date"
                          value={effectiveDate}
                          onChange={(e) => {
                            setEffectiveDate(e.target.value);
                            if (contentRef.current) {
                              let template = letterTemplates[letterType];
                              template = template
                                .replace('[Recipient Name]', recipientName || '[Recipient Name]')
                                .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
                                .replace(/\[Position\]/g, position || '[Position]')
                                .replace(/\[Date\]/g, e.target.value || '[Date]');
                              contentRef.current.innerHTML = template;
                            }
                          }}
                          className="letterhead-input-field"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="content">Content</label>
                  <div className="letterhead-input-container">
                    <div className="letterhead-formatting-buttons">
                      <button
                        onClick={() => applyFormat('bold')}
                        className="letterhead-format-btn"
                        aria-label="Bold text"
                      >
                        B
                      </button>
                      <button
                        onClick={() => applyFormat('underline')}
                        className="letterhead-format-btn"
                        aria-label="Underline text"
                      >
                        U
                      </button>
                      <button
                        onClick={() => applyFormat('italic')}
                        className="letterhead-format-btn"
                        aria-label="Italic text"
                      >
                        I
                      </button>
                      <button
                        onClick={() => applyFormat('hiliteColor', '#ffff00')}
                        className="letterhead-format-btn"
                        aria-label="Highlight text"
                      >
                        H
                      </button>
                    </div>
                    <div
                      id="content"
                      ref={contentRef}
                      contentEditable
                      className="letterhead-content-area"
                      aria-label="Letter content editor"
                      onKeyDown={handleKeyDown}
                      dangerouslySetInnerHTML={{
                        __html: letterTemplates[letterType]
                          .replace('[Recipient Name]', recipientName || '[Recipient Name]')
                          .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
                          .replace(/\[Position\]/g, position || '[Position]')
                          .replace(/\[Date\]/g, effectiveDate || '[Date]')
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="letterhead-form-row">
                <div className="letterhead-form-group">
                  <label htmlFor="signature">Signature</label>
                  <div className="letterhead-input-container">
                    <input
                      id="signature"
                      type="text"
                      placeholder="Signature (Your Name, Designation)"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="letterhead-input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="letterhead-popup-actions">
              <button onClick={() => setShowPopup(false)} className="letterhead-cancel-btn">
                Cancel
              </button>
              <button onClick={handlePreview} className="letterhead-preview-btn">
                Preview
              </button>
              <button onClick={handleGenerate} className="letterhead-save-btn">
                Save
              </button>
              <button onClick={handleSave}>Save data</button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="letterhead-preview-overlay">
          <div className="letterhead-preview-content">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                style={{ width: '100%', height: '80vh', border: 'none' }}
              />
            ) : (
              <p>Loading PDF preview...</p>
            )}
            <button onClick={handleClosePreview} className="letterhead-close-btn">
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterHead;