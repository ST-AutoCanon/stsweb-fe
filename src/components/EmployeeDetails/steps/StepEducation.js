// ./steps/StepEducation.jsx
import React from "react";
import FileInput from "../FileInput";

export default function StepEducation({ data, onChange }) {
  return (
    <div className="step-education">
      {/* SSLC (10th) */}
      <label>
        SSLC(10th) Institution<span className="required">*</span>
        <input
          type="text"
          name="tenth_institution"
          value={data.tenth_institution || ""}
          onChange={(e) => onChange("tenth_institution", e.target.value)}
          required
        />
      </label>
      <label>
        SSLC(10th) Year<span className="required">*</span>
        <input
          type="number"
          name="tenth_year"
          min="1900"
          max={new Date().getFullYear()}
          value={data.tenth_year || ""}
          onChange={(e) => onChange("tenth_year", e.target.value)}
          required
        />
      </label>
      <label>
        SSLC(10th) Board<span className="required">*</span>
        <input
          type="text"
          name="tenth_board"
          value={data.tenth_board || ""}
          onChange={(e) => onChange("tenth_board", e.target.value)}
          required
        />
      </label>
      <label>
        SSLC(10th) Score (%)<span className="required">*</span>
        <input
          type="number"
          name="tenth_score"
          min="0"
          max="100"
          step="0.01"
          value={data.tenth_score || ""}
          onChange={(e) => onChange("tenth_score", e.target.value)}
          required
        />
      </label>

      <FileInput
        name="tenth_cert"
        label="SSLC(10th) Certificate"
        accept=".pdf,image/*"
        required
        existingUrl={data.tenth_cert_url}
        onChange={onChange}
      />

      {/* PUC (12th) / Diploma */}
      <label>
        12th/Diploma Institution<span className="required">*</span>
        <input
          type="text"
          name="twelfth_institution"
          value={data.twelfth_institution || ""}
          onChange={(e) => onChange("twelfth_institution", e.target.value)}
          required
        />
      </label>
      <label>
        12th/Diploma Year<span className="required">*</span>
        <input
          type="number"
          name="twelfth_year"
          min="1900"
          max={new Date().getFullYear()}
          value={data.twelfth_year || ""}
          onChange={(e) => onChange("twelfth_year", e.target.value)}
          required
        />
      </label>
      <label>
        12th/Diploma Board<span className="required">*</span>
        <input
          type="text"
          name="twelfth_board"
          value={data.twelfth_board || ""}
          onChange={(e) => onChange("twelfth_board", e.target.value)}
          required
        />
      </label>
      <label>
        12th/Diploma Score (%)<span className="required">*</span>
        <input
          type="number"
          name="twelfth_score"
          min="0"
          max="100"
          step="0.01"
          value={data.twelfth_score || ""}
          onChange={(e) => onChange("twelfth_score", e.target.value)}
          required
        />
      </label>

      <FileInput
        name="twelfth_cert"
        label="12th/Diploma Certificate"
        accept=".pdf,image/*"
        required
        existingUrl={data.twelfth_cert_url}
        onChange={onChange}
      />

      {/* Undergraduate */}
      <label>
        UG Institution<span className="required">*</span>
        <input
          type="text"
          name="ug_institution"
          value={data.ug_institution || ""}
          onChange={(e) => onChange("ug_institution", e.target.value)}
          required
        />
      </label>
      <label>
        UG Year<span className="required">*</span>
        <input
          type="number"
          name="ug_year"
          min="1900"
          max={new Date().getFullYear()}
          value={data.ug_year || ""}
          onChange={(e) => onChange("ug_year", e.target.value)}
          required
        />
      </label>
      <label>
        UG University<span className="required">*</span>
        <input
          type="text"
          name="ug_board"
          value={data.ug_board || ""}
          onChange={(e) => onChange("ug_board", e.target.value)}
          required
        />
      </label>
      <label>
        UG Score (%)<span className="required">*</span>
        <input
          type="number"
          name="ug_score"
          min="0"
          max="100"
          step="0.01"
          value={data.ug_score || ""}
          onChange={(e) => onChange("ug_score", e.target.value)}
          required
        />
      </label>

      <FileInput
        name="ug_cert"
        label="UG Certificate"
        accept=".pdf,image/*"
        required
        existingUrl={data.ug_cert_url}
        onChange={onChange}
      />

      {/* Postgraduate */}
      <label>
        PG Institution
        <input
          type="text"
          name="pg_institution"
          value={data.pg_institution || ""}
          onChange={(e) => onChange("pg_institution", e.target.value)}
        />
      </label>
      <label>
        PG Year
        <input
          type="number"
          name="pg_year"
          min="1900"
          max={new Date().getFullYear()}
          value={data.pg_year || ""}
          onChange={(e) => onChange("pg_year", e.target.value)}
        />
      </label>
      <label>
        PG University
        <input
          type="text"
          name="pg_board"
          value={data.pg_board || ""}
          onChange={(e) => onChange("pg_board", e.target.value)}
        />
      </label>
      <label>
        PG Score (%)
        <input
          type="number"
          name="pg_score"
          min="0"
          max="100"
          step="0.01"
          value={data.pg_score || ""}
          onChange={(e) => onChange("pg_score", e.target.value)}
        />
      </label>

      <FileInput
        name="pg_cert"
        label="PG Certificate"
        accept=".pdf,image/*"
        existingUrl={data.pg_cert_url}
        onChange={onChange}
      />

      {/* Additional Certification */}
      <label>
        Additional Certification
        <input
          type="text"
          name="additional_cert_name"
          value={data.additional_cert_name || ""}
          onChange={(e) => onChange("additional_cert_name", e.target.value)}
        />
      </label>

      <FileInput
        name="additional_cert_file"
        label="Additional Certificate"
        accept=".pdf,image/*"
        existingUrl={data.additional_cert_url}
        onChange={onChange}
      />
    </div>
  );
}
