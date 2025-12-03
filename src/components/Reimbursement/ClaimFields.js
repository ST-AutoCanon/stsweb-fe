import React, { useEffect, useState } from "react";
import {
  MdEmojiTransportation,
  MdOutlinePhoneAndroid,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { GiKnifeFork, GiPencilBrush } from "react-icons/gi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import ParticipantSelection from "./ParticipantSelection";

const iconMap = {
  Transportation: <MdEmojiTransportation className="claim-icons" />,
  Meals: <GiKnifeFork className="claim-icons" />,
  Telecommunication: <MdOutlinePhoneAndroid className="claim-icons" />,
  Stationary: <GiPencilBrush className="claim-icons" />,
  Miscellaneous: <TbTriangleSquareCircle className="claim-icons" />,
};

const ClaimFields = ({
  claimTypes,
  projects,
  formData,
  setFormData,
  selectedFiles,
  setSelectedFiles,
  handleFileUpload,
  setSelectedSubType,
  selectedSubType,
  modalContentRef,
}) => {
  const [localParticipantMode, setLocalParticipantMode] = useState(
    formData.participant_mode || "single"
  );
  const [employeeOptions, setEmployeeOptions] = useState([]);

  useEffect(() => {
    setLocalParticipantMode(formData.participant_mode || "single");
  }, [formData.participant_mode]);

  const updateField = (k, v) => setFormData((prev) => ({ ...prev, [k]: v }));

  const handleTransportSubTypeChange = (type) => {
    updateField("transport_type", type);
    setSelectedSubType(type);

    const modalEl = modalContentRef?.current;
    if (modalEl) {
      modalEl.classList.add("transport-claim");
      modalEl.classList.add("subtype-selected");
    }
  };

  const onParticipantModeChange = (mode) => {
    setLocalParticipantMode(mode);
    setFormData((prev) => ({ ...prev, participant_mode: mode }));
    const modalEl = modalContentRef?.current;
    if (!modalEl) return;
    if (mode === "group") modalEl.classList.add("show-participants");
    else modalEl.classList.remove("show-participants");
  };

  const renderDateFields = () => {
    if (formData.transport_type === "Outstation") {
      return (
        <>
          <div className="rb-groups">
            <label>
              From Date<span className="asterisk">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate || ""}
              onChange={(e) => updateField("fromDate", e.target.value)}
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
              onChange={(e) => updateField("toDate", e.target.value)}
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
            value={formData.date || ""}
            onChange={(e) => updateField("date", e.target.value)}
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
              value={formData.fromDate || ""}
              onChange={(e) => updateField("fromDate", e.target.value)}
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
              onChange={(e) => updateField("toDate", e.target.value)}
            />
          </div>
        </>
      );
    }
    return null;
  };

  const FileList = () => (
    <div className="attachment-wrapper">
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
  );

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
                    formData.transport_type === type ? "active" : ""
                  }`}
                  onClick={() => handleTransportSubTypeChange(type)}
                  data-subtype={type}
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
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          no_of_days: e.target.value,
                        }))
                      }
                    />
                    Single
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="no_of_days"
                      value="multiple"
                      checked={formData.no_of_days === "multiple"}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          no_of_days: e.target.value,
                        }))
                      }
                    />
                    Multiple
                  </label>
                </div>
              </div>
            )}

            {formData.transport_type && (
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
                      value={formData.travel_from || ""}
                      onChange={(e) =>
                        updateField("travel_from", e.target.value)
                      }
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
                      onChange={(e) => updateField("travel_to", e.target.value)}
                    />
                  </div>

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups">
                      <label>Transport Amount</label>
                      <input
                        type="number"
                        name="transport_amount"
                        value={formData.transport_amount || ""}
                        onChange={(e) =>
                          updateField("transport_amount", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups">
                      <label>Accommodation Fees</label>
                      <input
                        type="number"
                        name="accommodation_fees"
                        value={formData.accommodation_fees || ""}
                        onChange={(e) =>
                          updateField("accommodation_fees", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {formData.transport_type === "Outstation" && (
                    <div className="rb-groups">
                      <label>DA</label>
                      <input
                        type="number"
                        name="da"
                        value={formData.da || ""}
                        onChange={(e) => updateField("da", e.target.value)}
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
                      value={formData.total_amount || ""}
                      onChange={(e) =>
                        updateField("total_amount", e.target.value)
                      }
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
                      onChange={(e) => updateField("purpose", e.target.value)}
                    />
                    <div className="participant-hint">
                      Choose Single or Group below to add participants (when
                      applicable).
                    </div>

                    <div
                      className="participant-row-inline"
                      style={{ marginTop: 8 }}
                    >
                      <label>
                        <input
                          type="radio"
                          name="participant"
                          value="single"
                          checked={localParticipantMode === "single"}
                          onChange={() => onParticipantModeChange("single")}
                        />
                        <span> Single</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="participant"
                          value="group"
                          checked={localParticipantMode === "group"}
                          onChange={() => onParticipantModeChange("group")}
                        />
                        <span> Group</span>
                      </label>
                    </div>

                    <ParticipantSelection
                      visible={
                        modalContentRef?.current?.classList?.contains(
                          "show-participants"
                        ) ||
                        localParticipantMode === "group" ||
                        (formData.claim_type === "Transportation" &&
                          !!formData.transport_type)
                      }
                      participants={formData.participants || []}
                      onChangeParticipants={(parts) =>
                        updateField("participants", parts)
                      }
                      employeeOptions={employeeOptions}
                    />
                  </div>

                  <div className="pa-groups">
                    <label>Attachment</label>
                    <FileList />
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "Meals":
        return (
          <>
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
                    onChange={(e) => updateField("date", e.target.value)}
                  />
                </div>
                <div className="rb-groups">
                  <label>Meal Type</label>
                  <select
                    name="meal_type"
                    value={formData.meal_type || ""}
                    onChange={(e) => updateField("meal_type", e.target.value)}
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
                    onChange={(e) =>
                      updateField("meals_objective", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField("total_amount", e.target.value)
                    }
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
                    onChange={(e) => updateField("purpose", e.target.value)}
                  />
                </div>

                <div className="pa-groups">
                  <label>Attachment</label>
                  <FileList />
                </div>
              </div>
            </div>
          </>
        );

      case "Telecommunication":
        return (
          <>
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
                    onChange={(e) => updateField("date", e.target.value)}
                  />
                </div>
                <div className="rb-groups">
                  <label>Service Provider</label>
                  <input
                    type="text"
                    name="service_provider"
                    value={formData.service_provider || ""}
                    onChange={(e) =>
                      updateField("service_provider", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField("total_amount", e.target.value)
                    }
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
                    onChange={(e) => updateField("purpose", e.target.value)}
                  />
                </div>

                <div className="pa-groups">
                  <label>Attachment</label>
                  <FileList />
                </div>
              </div>
            </div>
          </>
        );

      case "Stationary":
        return (
          <>
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
                    onChange={(e) => updateField("date", e.target.value)}
                  />
                </div>
                <div className="rb-groups">
                  <label>Stationary</label>
                  <select
                    name="stationary"
                    value={formData.stationary || ""}
                    onChange={(e) => updateField("stationary", e.target.value)}
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
                    onChange={(e) =>
                      updateField("purchasing_item", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateField("total_amount", e.target.value)
                    }
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
                    onChange={(e) => updateField("purpose", e.target.value)}
                  />
                </div>

                <div className="pa-groups">
                  <label>Attachment</label>
                  <FileList />
                </div>
              </div>
            </div>
          </>
        );

      case "Miscellaneous":
        return (
          <>
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
                    onChange={(e) => updateField("date", e.target.value)}
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
                    onChange={(e) =>
                      updateField("total_amount", e.target.value)
                    }
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
                    onChange={(e) => updateField("purpose", e.target.value)}
                  />
                </div>

                <div className="pa-groups">
                  <label>Attachment</label>
                  <FileList />
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="claim-type">
        <label>
          Project<span className="asterisk">*</span>
        </label>
        <select
          name="project"
          value={formData.project || ""}
          onChange={(e) =>
            setFormData((p) => ({ ...p, project: e.target.value }))
          }
          required
        >
          <option value="">Select project</option>
          <option value="STS CLAIM">STS CLAIM</option>
          {projects.map((proj, i) => (
            <option key={i} value={proj}>
              {proj}
            </option>
          ))}
        </select>

        <div className="rb-tabs" role="tablist" aria-label="Claim types">
          {claimTypes.map(({ label }) => (
            <div
              key={label}
              className={`rb-tab ${
                formData.claim_type === label ? "active" : ""
              }`}
              onClick={() => setFormData((p) => ({ ...p, claim_type: label }))}
              role="tab"
              aria-selected={formData.claim_type === label}
            >
              {iconMap[label]} {label}
            </div>
          ))}
        </div>
      </div>

      {renderClaimSpecificFields()}
    </>
  );
};

export default ClaimFields;
