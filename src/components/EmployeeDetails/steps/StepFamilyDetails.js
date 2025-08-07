import React from "react";
import FileInput from "../FileInput";

export default function StepFamilyDetails({ data, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="step-personal">
      {/* Father */}
      <label>
        Father’s Name
        <input
          type="text"
          name="father_name"
          value={data.father_name || ""}
          onChange={(e) => onChange("father_name", e.target.value)}
        />
      </label>
      <label>
        Father's Date of Birth
        <input
          type="date"
          name="father_dob"
          value={data.father_dob ? data.father_dob.split("T")[0] : ""}
          onChange={(e) => onChange("father_dob", e.target.value)}
        />
      </label>
      <FileInput
        name="father_gov_doc"
        label="Father's Government ID"
        accept=".pdf,image/*"
        multiple
        existingUrl={data.father_gov_doc_url}
        onChange={onChange}
      />

      {/* Mother */}
      <label>
        Mother’s Name
        <input
          type="text"
          name="mother_name"
          value={data.mother_name || ""}
          onChange={(e) => onChange("mother_name", e.target.value)}
        />
      </label>
      <label>
        Mother's Date of Birth
        <input
          type="date"
          name="mother_dob"
          value={data.mother_dob ? data.mother_dob.split("T")[0] : ""}
          onChange={(e) => onChange("mother_dob", e.target.value)}
        />
      </label>
      <FileInput
        name="mother_gov_doc"
        label="Mother's Government ID"
        accept=".pdf,image/*"
        multiple
        existingUrl={data.mother_gov_doc_url}
        onChange={onChange}
      />

      {/* Marital Status */}
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
          {/* Marriage Details */}
          <label>
            Marriage Date<span className="required">*</span>
            <input
              type="date"
              name="marriage_date"
              max={today}
              value={data.marriage_date ? data.marriage_date.split("T")[0] : ""}
              onChange={(e) => onChange("marriage_date", e.target.value)}
              required
            />
          </label>
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
            Spouse Date of Birth<span className="required">*</span>
            <input
              type="date"
              name="spouse_dob"
              value={data.spouse_dob ? data.spouse_dob.split("T")[0] : ""}
              onChange={(e) => onChange("spouse_dob", e.target.value)}
              required
            />
          </label>
          <FileInput
            name="spouse_gov_doc"
            label="Spouse Government ID"
            accept=".pdf,image/*"
            multiple
            existingUrl={data.spouse_gov_doc_url}
            onChange={onChange}
            required
          />

          {/* Children (up to 3) without extra grouping */}
          <label>
            Child 1 Name
            <input
              type="text"
              name="child1_name"
              value={data.child1_name || ""}
              onChange={(e) => onChange("child1_name", e.target.value)}
              pattern="^[A-Z][a-zA-Z]+$"
              title="Must start with a capital letter and contain only letters"
            />
          </label>
          <label>
            Child 1 Date of Birth
            <input
              type="date"
              name="child1_dob"
              max={today}
              value={data.child1_dob ? data.child1_dob.split("T")[0] : ""}
              onChange={(e) => onChange("child1_dob", e.target.value)}
            />
          </label>
          <FileInput
            name="child1_gov_doc"
            label="Child 1 Government ID"
            accept=".pdf,image/*"
            multiple
            existingUrl={data.child1_gov_doc_url}
            onChange={onChange}
          />

          <label>
            Child 2 Name
            <input
              type="text"
              name="child2_name"
              value={data.child2_name || ""}
              onChange={(e) => onChange("child2_name", e.target.value)}
              pattern="^[A-Z][a-zA-Z]+$"
              title="Must start with a capital letter and contain only letters"
            />
          </label>
          <label>
            Child 2 Date of Birth
            <input
              type="date"
              name="child2_dob"
              max={today}
              value={data.child2_dob ? data.child2_dob.split("T")[0] : ""}
              onChange={(e) => onChange("child2_dob", e.target.value)}
            />
          </label>
          <FileInput
            name="child2_gov_doc"
            label="Child 2 Government ID"
            accept=".pdf,image/*"
            multiple
            existingUrl={data.child2_gov_doc_url}
            onChange={onChange}
          />

          <label>
            Child 3 Name
            <input
              type="text"
              name="child3_name"
              value={data.child3_name || ""}
              onChange={(e) => onChange("child3_name", e.target.value)}
              pattern="^[A-Z][a-zA-Z]+$"
              title="Must start with a capital letter and contain only letters"
            />
          </label>
          <label>
            Child 3 Date of Birth
            <input
              type="date"
              name="child3_dob"
              max={today}
              value={data.child3_dob ? data.child3_dob.split("T")[0] : ""}
              onChange={(e) => onChange("child3_dob", e.target.value)}
            />
          </label>
          <FileInput
            name="child3_gov_doc"
            label="Child 3 Government ID"
            accept=".pdf,image/*"
            multiple
            existingUrl={data.child3_gov_doc_url}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
}
