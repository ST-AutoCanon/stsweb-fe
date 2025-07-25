import React from "react";
import FileInput from "../FileInput";

export default function StepPersonal({ data, onChange }) {
  const today = new Date().toISOString().split("T")[0];
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDob = eighteenYearsAgo.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="step-personal">
      {/* Basic Info */}
      <label>
        First Name<span className="required">*</span>
        <input
          type="text"
          name="first_name"
          value={data.first_name || ""}
          onChange={(e) => onChange("first_name", e.target.value)}
          pattern="^[A-Z][a-zA-Z]+$"
          title="Must start with a capital letter and contain only letters"
          required
        />
      </label>

      <label>
        Last Name<span className="required">*</span>
        <input
          type="text"
          name="last_name"
          value={data.last_name || ""}
          onChange={(e) => onChange("last_name", e.target.value)}
          pattern="^[A-Z][a-zA-Z]*$"
          title="Must start with a capital letter and contain only letters"
          required
        />
      </label>

      <label>
        Date of Birth<span className="required">*</span>
        <input
          type="date"
          name="dob"
          max={maxDob}
          value={data.dob ? data.dob.split("T")[0] : ""}
          onChange={(e) => onChange("dob", e.target.value)}
          title={`You must be at least 18 years old (born on or before ${maxDob})`}
          required
        />
      </label>

      <label>
        Email<span className="required">*</span>
        <input
          type="email"
          name="email"
          value={data.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </label>

      <label>
        Mobile<span className="required">*</span>
        <input
          type="tel"
          name="phone_number"
          value={data.phone_number || ""}
          onChange={(e) => onChange("phone_number", e.target.value)}
          pattern="^[6-9]\d{9}$"
          title="10‑digit Indian mobile number starting with 6–9"
          required
        />
      </label>

      <label>
        Gender<span className="required">*</span>
        <select
          name="gender"
          value={data.gender || ""}
          onChange={(e) => onChange("gender", e.target.value)}
          required
        >
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </label>

      {/* Marital */}
      <label>
        Marital Status<span className="required">*</span>
        <select
          name="marital_status"
          value={data.marital_status || ""}
          onChange={(e) => onChange("marital_status", e.target.value)}
          required
        >
          <option value="">Select</option>
          <option>Married</option>
          <option>Unmarried</option>
        </select>
      </label>
      {data.marital_status === "Married" && (
        <>
          <label>
            Spouse Name<span className="required">*</span>
            <input
              type="text"
              name="spouse_name"
              value={data.spouse_name || ""}
              onChange={(e) => onChange("spouse_name", e.target.value)}
              pattern="^[A-Z][a-zA-Z]+$"
              title="Must start with a capital letter and contain only letters"
              required
            />
          </label>
          <label>
            Marriage Date<span className="required">*</span>
            <input
              type="date"
              name="marriage_date"
              max={today}
              value={data.marriage_date ? data.marriage_date.split("T")[0] : ""}
              onChange={(e) => onChange("marriage_date", e.target.value)}
              title={`Marriage date cannot be in the future (on or before ${today})`}
              required
            />
          </label>
        </>
      )}

      {/* Family */}
      <label>
        Father’s Name
        <input
          type="text"
          name="father_name"
          value={data.father_name || ""}
          onChange={(e) => onChange("father_name", e.target.value)}
          pattern="^[A-Z][a-zA-Z]+$"
          title="Must start with a capital letter and contain only letters"
        />
      </label>
      <label>
        Mother’s Name
        <input
          type="text"
          name="mother_name"
          value={data.mother_name || ""}
          onChange={(e) => onChange("mother_name", e.target.value)}
          pattern="^[A-Z][a-zA-Z]+$"
          title="Must start with a capital letter and contain only letters"
        />
      </label>

      {/* Govt IDs */}
      <label>
        Aadhaar Number<span className="required">*</span>
        <input
          type="text"
          name="aadhaar_number"
          value={data.aadhaar_number || ""}
          onChange={(e) => onChange("aadhaar_number", e.target.value)}
          pattern="^\d{12}$"
          title="Enter exactly 12 digits"
          required
        />
      </label>
      <FileInput
        name="aadhaar_doc"
        label="Aadhaar Copy"
        accept=".pdf,image/*"
        required
        existingUrl={data.aadhaar_doc_url}
        onChange={onChange}
      />

      <label>
        PAN Number<span className="required">*</span>
        <input
          type="text"
          name="pan_number"
          value={data.pan_number || ""}
          onChange={(e) => onChange("pan_number", e.target.value)}
          pattern="^[A-Z]{5}[0-9]{4}[A-Z]$"
          title="Format: ABCDE1234F"
          required
        />
      </label>
      <FileInput
        name="pan_doc"
        label="PAN Copy"
        accept=".pdf,image/*"
        required
        existingUrl={data.pan_doc_url}
        onChange={onChange}
      />

      <label>
        Passport Number
        <input
          type="text"
          name="passport_number"
          value={data.passport_number || ""}
          onChange={(e) => onChange("passport_number", e.target.value)}
          pattern="^[A-Z][0-9]{7}$"
          title="1 letter followed by 7 digits"
        />
      </label>

      <label>
        Voter ID
        <input
          type="text"
          name="voter_id"
          value={data.voter_id || ""}
          onChange={(e) => onChange("voter_id", e.target.value)}
          pattern="^[A-Z]{3}[0-9]{7}$"
          title="3 letters followed by 7 digits"
        />
      </label>

      <label>
        Address
        <textarea
          name="address"
          value={data.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="123 Street, City, State, Country"
        />
      </label>

      <FileInput
        name="photo"
        label="Profile Photo"
        accept="image/*"
        existingUrl={data.photo_url}
        onChange={onChange}
      />
    </div>
  );
}
