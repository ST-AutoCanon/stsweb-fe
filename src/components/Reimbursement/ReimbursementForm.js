import React, { useMemo } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import ParticipantSelection from "./ParticipantSelection";
import "./Reimbursement.css";
import "./ParticipantSelection.css";

const ReimbursementForm = (props) => {
  const {
    projects = [],
    claimTypes = [],
    handleClaimTypeChange,
    formData = {},
    handleChange,
    shouldShowParticipantControls = () => false,
    participantMode,
    setParticipantMode,
    renderSingleTile,
    onParticipantSelectionChange,
    employeeOptions = [],
    handleFileUpload,
    handleTransportSubTypeChange,
    handleNoOfDaysChange,
    selectedFiles = [],
    setSelectedFiles,
    handleSubmit,
    editingId,
    setEditingId,
    setShowForm,
    setParticipants,
    setFormData,
  } = props;

  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  const maxDateISO = new Date(Date.now() - 86400000).toLocaleDateString(
    "en-CA"
  );

  const ensureInvoicesArray = () => {
    if (!formData.invoices || !Array.isArray(formData.invoices)) {
      setFormData((p) => ({ ...p, invoices: [] }));
      return [];
    }
    return formData.invoices;
  };

  const addInvoice = (afterIndex = null) => {
    const arr = ensureInvoicesArray().slice();
    if (afterIndex === null || afterIndex === arr.length - 1) arr.push("");
    else arr.splice(afterIndex + 1, 0, "");
    setFormData((p) => ({ ...p, invoices: arr }));
  };

  const removeInvoice = (idx) => {
    const arr = ensureInvoicesArray().slice();
    if (idx < 0 || idx >= arr.length) return;
    arr.splice(idx, 1);
    setFormData((p) => ({ ...p, invoices: arr }));
  };

  const handleInvoiceChange = (idx, value) => {
    const arr = ensureInvoicesArray().slice();
    arr[idx] = value;
    setFormData((p) => ({ ...p, invoices: arr }));
  };

  const renderInvoiceControls = () => {
    const invoices = ensureInvoicesArray();

    const source = invoices.length === 0 ? [""] : invoices;
    return (
      <div className="purpose-attachment-invoices">
        <div className="rb-form-grid">
          {source.map((inv, i) => (
            <div className="rb-groups" key={`inv-${i}`}>
              <div className="invoice-row">
                <input
                  className="invoice-input"
                  type="text"
                  name={`invoice_${i}`}
                  value={inv || ""}
                  onChange={(e) => handleInvoiceChange(i, e.target.value)}
                  placeholder="Enter invoice or transaction number"
                  aria-required="true"
                />

                {i === source.length - 1 ? (
                  <button
                    type="button"
                    aria-label="Add invoice"
                    onClick={() => addInvoice(i)}
                    className="invoice-add-btn"
                    title="Add invoice"
                  >
                    <CiCirclePlus />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Remove invoice"
                    onClick={() => removeInvoice(i)}
                    className="invoice-remove-btn"
                    title="Remove invoice"
                  >
                    <CiCircleMinus />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const { cleanedInvoices, hasEmptyInvoice, duplicateInvoice } = useMemo(() => {
    const raw =
      formData.invoices && Array.isArray(formData.invoices)
        ? formData.invoices
        : formData.invoices
        ? [formData.invoices]
        : [];
    const cleaned = (raw || []).map((i) => (i || "").toString().trim());
    const hasEmpty = cleaned.some((c) => !c);
    const seen = {};
    let dup = null;
    for (const c of cleaned) {
      if (!c) continue;
      const k = c.toLowerCase();
      if (seen[k]) {
        dup = c;
        break;
      }
      seen[k] = true;
    }
    return {
      cleanedInvoices: cleaned.filter(Boolean),
      hasEmptyInvoice: hasEmpty,
      duplicateInvoice: dup,
    };
  }, [formData.invoices]);

  const invoicesValid =
    cleanedInvoices.length > 0 && !hasEmptyInvoice && !duplicateInvoice;

  return (
    <div className="rb-modal">
      <div
        className={`rb-modal-content ${
          shouldShowParticipantControls() ? "show-participants" : ""
        }`}
      >
        <div className="claim-form-header">
          <h2 className="claim-form-title">
            {editingId ? "Edit Reimbursement" : "New Reimbursement"}
          </h2>
          <MdOutlineCancel
            className="claim-form-close"
            onClick={() => setShowForm(false)}
          />
        </div>

        <form
          className="reimbursement-form"
          onSubmit={(e) => {
            if (!invoicesValid) {
              e.preventDefault();
              if (hasEmptyInvoice) {
                alert("Please fill all invoice fields or remove empty rows.");
              } else if (duplicateInvoice) {
                alert(
                  `Duplicate invoice in form: "${duplicateInvoice}". Please remove duplicates.`
                );
              } else {
                alert("Please add at least one invoice (marked *).");
              }
              return;
            }
            handleSubmit(e);
          }}
        >
          <div className="claim-type">
            <label>
              Project<span className="asterisk">*</span>
            </label>
            <select
              name="project"
              value={formData.project || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select project</option>
              <option value="STS CLAIM">STS CLAIM</option>
              {projects.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="rb-tabs">
              {claimTypes.map(({ icon, label }) => (
                <div
                  key={label}
                  className={`rb-tab ${
                    formData.claim_type === label ? "active" : ""
                  }`}
                  onClick={() => handleClaimTypeChange(label)}
                  role="button"
                  tabIndex={0}
                >
                  {icon} {label}
                </div>
              ))}
            </div>
          </div>

          {shouldShowParticipantControls() && (
            <div className="participant-controls-wrapper">
              <div className="participant-mode-toggle">
                <label className="ps-mode-label">
                  <input
                    type="radio"
                    name="pmode"
                    checked={participantMode === "single"}
                    onChange={() => {
                      setParticipantMode("single");
                      setParticipants((prev) =>
                        prev && prev.length ? [prev[0]] : []
                      );
                    }}
                  />
                  <span className="ps-mode-text">Single</span>
                </label>
                <label className="ps-mode-label">
                  <input
                    type="radio"
                    name="pmode"
                    checked={participantMode === "group"}
                    onChange={() => setParticipantMode("group")}
                  />
                  <span className="ps-mode-text">Group</span>
                </label>
              </div>

              {participantMode === "single" ? (
                <div className="participant-single-inline">
                  {renderSingleTile()}
                </div>
              ) : (
                <ParticipantSelection
                  departmentId={formData.department_id || ""}
                  selectionMode="group"
                  onModeChange={(m) => setParticipantMode(m)}
                  onSelectionChange={onParticipantSelectionChange}
                  initialSelection={[]}
                  limit={500}
                  hideModeToggle={true}
                />
              )}
            </div>
          )}

          {formData.claim_type === "Transportation" && (
            <>
              <div className="sub-tabs">
                {["Outstation", "Intercity", "Fuel"].map((type) => (
                  <div
                    key={type}
                    className={`sub-tab ${
                      formData.transport_type === type ? "active" : ""
                    }`}
                    onClick={() => handleTransportSubTypeChange(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>

              {(formData.transport_type === "Intercity" ||
                formData.transport_type === "Fuel") && (
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
                      />{" "}
                      Single
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="no_of_days"
                        value="multiple"
                        checked={formData.no_of_days === "multiple"}
                        onChange={handleNoOfDaysChange}
                      />{" "}
                      Multiple
                    </label>
                  </div>
                </div>
              )}

              {formData.transport_type && (
                <div className="rb-main-form">
                  <div className="rb-form-grid">
                    {formData.transport_type === "Outstation" ? (
                      <>
                        <div className="rb-groups">
                          <label>
                            From Date<span className="asterisk">*</span>
                          </label>
                          <input
                            type="date"
                            name="fromDate"
                            value={formData.fromDate || ""}
                            onChange={handleChange}
                            max={maxDateISO}
                          />
                        </div>
                        <div className="rb-groups">
                          <label>
                            To Date<span className="asterisk">*</span>
                          </label>
                          <input
                            type="date"
                            name="toDate"
                            value={formData.toDate || ""}
                            onChange={handleChange}
                            max={maxDateISO}
                          />
                        </div>
                      </>
                    ) : formData.no_of_days === "single" ? (
                      <div className="rb-groups">
                        <label>
                          Date<span className="asterisk">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date || ""}
                          onChange={handleChange}
                          max={maxDateISO}
                        />
                      </div>
                    ) : formData.no_of_days === "multiple" ? (
                      <>
                        <div className="rb-groups">
                          <label>
                            From Date<span className="asterisk">*</span>
                          </label>
                          <input
                            type="date"
                            name="fromDate"
                            value={formData.fromDate || ""}
                            onChange={handleChange}
                            max={maxDateISO}
                          />
                        </div>
                        <div className="rb-groups">
                          <label>
                            To Date<span className="asterisk">*</span>
                          </label>
                          <input
                            type="date"
                            name="toDate"
                            value={formData.toDate || ""}
                            onChange={handleChange}
                            max={maxDateISO}
                          />
                        </div>
                      </>
                    ) : null}

                    <div className="rb-groups">
                      <label>
                        Travel From<span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        name="travel_from"
                        value={formData.travel_from || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="rb-groups">
                      <label>
                        Travel To<span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        name="travel_to"
                        value={formData.travel_to || ""}
                        onChange={handleChange}
                      />
                    </div>

                    {formData.transport_type === "Outstation" && (
                      <>
                        <div className="rb-groups">
                          <label>Transport Amount</label>
                          <input
                            type="number"
                            name="transport_amount"
                            value={formData.transport_amount || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="rb-groups">
                          <label>Accommodation Fees</label>
                          <input
                            type="number"
                            name="accommodation_fees"
                            value={formData.accommodation_fees || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="rb-groups">
                          <label>DA</label>
                          <input
                            type="number"
                            name="da"
                            value={formData.da || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}

                    <div className="rb-groups">
                      <label>
                        Total Amount<span className="asterisk">*</span>
                      </label>
                      <input
                        type="number"
                        name="total_amount"
                        value={formData.total_amount || ""}
                        onChange={handleChange}
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
                        name="purpose"
                        value={formData.purpose || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pa-groups">
                      <label>Attachment</label>
                      <div className="attachment-wrapper">
                        <div className="file-links">
                          {selectedFiles.length > 0 ? (
                            selectedFiles.map((n, i) => (
                              <p key={i} className="file-name">
                                {n}
                              </p>
                            ))
                          ) : (
                            <p>No files selected</p>
                          )}
                        </div>
                        <div className="attachment-upload">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            id={`fileInput-${uid}`}
                            className="hidden-file-input"
                          />
                          <label
                            htmlFor={`fileInput-${uid}`}
                            className="custom-file-upload"
                          >
                            Browse
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pa-groups">
                      <label>
                        Invoice / Bill / Transaction{" "}
                        <span className="asterisk">*</span>
                      </label>
                      {renderInvoiceControls()}
                      {!invoicesValid && (
                        <div style={{ marginTop: 8 }}>
                          {hasEmptyInvoice && (
                            <p className="rb-error-message">
                              Please fill or remove empty invoice rows.
                            </p>
                          )}
                          {duplicateInvoice && (
                            <p className="rb-error-message">
                              Duplicate invoice in form: "{duplicateInvoice}".
                            </p>
                          )}
                          {!hasEmptyInvoice &&
                            !duplicateInvoice &&
                            cleanedInvoices.length === 0 && (
                              <p className="rb-error-message">
                                At least one invoice is required.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {formData.claim_type === "Meals" && (
            <div className="rb-main-form">
              <div className="rb-form1-grid">
                <div className="rb-groups">
                  <label>
                    Date<span className="asterisk">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    max={maxDateISO}
                  />
                </div>
                <div className="rb-groups">
                  <label>Meal Type</label>
                  <select
                    name="meal_type"
                    value={formData.meal_type || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="breakfast">Break Fast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
                <div className="rb-groups">
                  <label>Meal's objective</label>
                  <select
                    name="meals_objective"
                    value={formData.meals_objective || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
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
                    value={formData.total_amount || ""}
                    onChange={handleChange}
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
                    name="purpose"
                    value={formData.purpose || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="pa-groups">
                  <label>Attachment</label>
                  <div className="attachment-wrapper">
                    <div className="file-links">
                      {selectedFiles.length > 0 ? (
                        selectedFiles.map((n, i) => (
                          <p key={i} className="file-name">
                            {n}
                          </p>
                        ))
                      ) : (
                        <p>No files selected</p>
                      )}
                    </div>
                    <div className="attachment-upload">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        id={`fileInputMeals-${uid}`}
                        className="hidden-file-input"
                      />
                      <label
                        htmlFor={`fileInputMeals-${uid}`}
                        className="custom-file-upload"
                      >
                        Browse
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pa-groups">
                  <label>
                    Invoice / Bill / Transaction{" "}
                    <span className="asterisk">*</span>
                  </label>
                  {renderInvoiceControls()}
                  {!invoicesValid && (
                    <div style={{ marginTop: 8 }}>
                      {hasEmptyInvoice && (
                        <p className="rb-error-message">
                          Please fill or remove empty invoice rows.
                        </p>
                      )}
                      {duplicateInvoice && (
                        <p className="rb-error-message">
                          Duplicate invoice in form: "{duplicateInvoice}".
                        </p>
                      )}
                      {!hasEmptyInvoice &&
                        !duplicateInvoice &&
                        cleanedInvoices.length === 0 && (
                          <p className="rb-error-message">
                            At least one invoice is required.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.claim_type === "Telecommunication" && (
            <div className="rb-main-form">
              <div className="rb-form2-grid">
                <div className="rb-groups">
                  <label>
                    Date<span className="asterisk">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    max={maxDateISO}
                  />
                </div>
                <div className="rb-groups">
                  <label>Service Provider</label>
                  <input
                    type="text"
                    name="service_provider"
                    value={formData.service_provider || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="rb-groups">
                  <label>
                    Total Amount<span className="asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount || ""}
                    onChange={handleChange}
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
                    name="purpose"
                    value={formData.purpose || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="pa-groups">
                  <label>Attachment</label>
                  <div className="attachment-wrapper">
                    <div className="file-links">
                      {selectedFiles.length > 0 ? (
                        selectedFiles.map((n, i) => (
                          <p key={i} className="file-name">
                            {n}
                          </p>
                        ))
                      ) : (
                        <p>No files selected</p>
                      )}
                    </div>
                    <div className="attachment-upload">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        id={`fileInputTele-${uid}`}
                        className="hidden-file-input"
                      />
                      <label
                        htmlFor={`fileInputTele-${uid}`}
                        className="custom-file-upload"
                      >
                        Browse
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pa-groups">
                  <label>
                    Invoice / Bill / Transaction{" "}
                    <span className="asterisk">*</span>
                  </label>
                  {renderInvoiceControls()}
                  {!invoicesValid && (
                    <div style={{ marginTop: 8 }}>
                      {hasEmptyInvoice && (
                        <p className="rb-error-message">
                          Please fill or remove empty invoice rows.
                        </p>
                      )}
                      {duplicateInvoice && (
                        <p className="rb-error-message">
                          Duplicate invoice in form: "{duplicateInvoice}".
                        </p>
                      )}
                      {!hasEmptyInvoice &&
                        !duplicateInvoice &&
                        cleanedInvoices.length === 0 && (
                          <p className="rb-error-message">
                            At least one invoice is required.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.claim_type === "Stationary" && (
            <div className="rb-main-form">
              <div className="rb-form1-grid">
                <div className="rb-groups">
                  <label>
                    Date<span className="asterisk">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    max={maxDateISO}
                  />
                </div>
                <div className="rb-groups">
                  <label>Stationary</label>
                  <select
                    name="stationary"
                    value={formData.stationary || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="office equipments">Office Equipments</option>
                    <option value="general stationary">
                      General Stationary
                    </option>
                  </select>
                </div>
                <div className="rb-groups">
                  <label>Purchasing Items</label>
                  <input
                    type="text"
                    name="purchasing_item"
                    value={formData.purchasing_item || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="rb-groups">
                  <label>
                    Total Amount<span className="asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount || ""}
                    onChange={handleChange}
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
                    name="purpose"
                    value={formData.purpose || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="pa-groups">
                  <label>Attachment</label>
                  <div className="attachment-wrapper">
                    <div className="file-links">
                      {selectedFiles.length > 0 ? (
                        selectedFiles.map((n, i) => (
                          <p key={i} className="file-name">
                            {n}
                          </p>
                        ))
                      ) : (
                        <p>No files selected</p>
                      )}
                    </div>
                    <div className="attachment-upload">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        id={`fileInputStat-${uid}`}
                        className="hidden-file-input"
                      />
                      <label
                        htmlFor={`fileInputStat-${uid}`}
                        className="custom-file-upload"
                      >
                        Browse
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pa-groups">
                  <label>
                    Invoice / Bill / Transaction{" "}
                    <span className="asterisk">*</span>
                  </label>
                  {renderInvoiceControls()}
                  {!invoicesValid && (
                    <div style={{ marginTop: 8 }}>
                      {hasEmptyInvoice && (
                        <p className="rb-error-message">
                          Please fill or remove empty invoice rows.
                        </p>
                      )}
                      {duplicateInvoice && (
                        <p className="rb-error-message">
                          Duplicate invoice in form: "{duplicateInvoice}".
                        </p>
                      )}
                      {!hasEmptyInvoice &&
                        !duplicateInvoice &&
                        cleanedInvoices.length === 0 && (
                          <p className="rb-error-message">
                            At least one invoice is required.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.claim_type === "Miscellaneous" && (
            <div className="rb-main-form">
              <div className="rb-form1-grid">
                <div className="rb-groups">
                  <label>
                    Date<span className="asterisk">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    max={maxDateISO}
                  />
                </div>
                <div className="rb-groups">
                  <label>
                    Total Amount<span className="asterisk">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount || ""}
                    onChange={handleChange}
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
                    name="purpose"
                    value={formData.purpose || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="pa-groups">
                  <label>Attachment</label>
                  <div className="attachment-wrapper">
                    <div className="file-links">
                      {selectedFiles.length > 0 ? (
                        selectedFiles.map((n, i) => (
                          <p key={i} className="file-name">
                            {n}
                          </p>
                        ))
                      ) : (
                        <p>No files selected</p>
                      )}
                    </div>
                    <div className="attachment-upload">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        id={`fileInputMisc-${uid}`}
                        className="hidden-file-input"
                      />
                      <label
                        htmlFor={`fileInputMisc-${uid}`}
                        className="custom-file-upload"
                      >
                        Browse
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pa-groups">
                  <label>
                    Invoice / Bill / Transaction{" "}
                    <span className="asterisk">*</span>
                  </label>
                  {renderInvoiceControls()}
                  {!invoicesValid && (
                    <div style={{ marginTop: 8 }}>
                      {hasEmptyInvoice && (
                        <p className="rb-error-message">
                          Please fill or remove empty invoice rows.
                        </p>
                      )}
                      {duplicateInvoice && (
                        <p className="rb-error-message">
                          Duplicate invoice in form: "{duplicateInvoice}".
                        </p>
                      )}
                      {!hasEmptyInvoice &&
                        !duplicateInvoice &&
                        cleanedInvoices.length === 0 && (
                          <p className="rb-error-message">
                            At least one invoice is required.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="reimbursement-form-button">
            <button
              type="button"
              className="rb-close"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rb-submit"
              disabled={!invoicesValid}
            >
              {editingId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReimbursementForm;
