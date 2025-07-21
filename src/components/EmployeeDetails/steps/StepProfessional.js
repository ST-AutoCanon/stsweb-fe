// ./steps/StepProfessional.jsx
import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import FileInput from "../FileInput";

export default function StepProfessional({
  data,
  onChange,
  departments = [],
  supervisors = [],
}) {
  const generatePositions = (deptId, role) => {
    // find the department object so we can grab its name
    const dept = departments.find((d) => d.id === Number(deptId));
    const deptName = dept ? dept.name : "";
    if (!deptName) return [];
    const positions = [];
    const roleLower = (role || "").toLowerCase();
    if (deptName === "HR") {
      if (roleLower === "manager") return ["HR Manager"];
      return ["HR Specialist", "HR Coordinator"];
    }
    if (deptName === "Finance") {
      if (roleLower === "manager") return ["Finance Manager"];
      return ["Accountant", "Financial Analyst"];
    }
    if (deptName === "Office Support") {
      if (roleLower === "manager") return ["Office Support Manager"];
      return ["Office Staff", "General Staff"];
    }
    if (roleLower === "manager") return [`${deptName} Manager`];
    return [
      `Senior ${deptName} Engineer`,
      `${deptName} Engineer`,
      `Associate ${deptName} Engineer`,
    ];
  };

  const positionsList = generatePositions(data.department_id, data.role);
  const expList = Array.isArray(data.experience) ? data.experience : [];

  // Update one field of an experience entry
  const updateExperience = (idx, field, value) => {
    const newList = [...expList];
    newList[idx] = { ...newList[idx], [field]: value };
    onChange("experience", newList);
  };

  // Add a blank experience entry
  const addExperience = () => {
    onChange("experience", [
      ...expList,
      { company: "", role: "", start_date: "", end_date: "", doc: null },
    ]);
  };

  // Remove an entry
  const removeExperience = (idx) => {
    const newList = expList.filter((_, i) => i !== idx);
    onChange("experience", newList);
  };

  // Compute total experience in months, then convert to years + months
  const totalMonths = expList.reduce((sum, exp) => {
    if (exp.start_date && exp.end_date) {
      const start = new Date(exp.start_date);
      const end = new Date(exp.end_date);
      if (end > start) {
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        return sum + months;
      }
    }
    return sum;
  }, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return (
    <div className="step-professional">
      <label>
        <input
          type="radio"
          name="domain"
          value="ST"
          checked={data.domain === "ST"}
          onChange={() => onChange("domain", "ST")}
          required
        />
        ST
      </label>
      <label>
        <input
          type="radio"
          name="domain"
          value="STS"
          checked={data.domain === "STS"}
          onChange={() => onChange("domain", "STS")}
          required
        />
        STS
      </label>

      {/* Core fields */}
      <div className="st-pro">
        <label>
          Employee Type<span className="required">*</span>
          <select
            name="employee_type"
            value={data.employee_type || ""}
            onChange={(e) => onChange("employee_type", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Permanent">Permanent</option>
            <option value="Consultant">Consultant</option>
          </select>
        </label>

        <label>
          Role<span className="required">*</span>
          <select
            name="role"
            value={data.role || ""}
            onChange={(e) => onChange("role", e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="General">General</option>
          </select>
        </label>

        <label>
          Department<span className="required">*</span>
          <select
            name="department_id"
            value={data.department_id || ""}
            onChange={(e) => onChange("department_id", e.target.value)}
            required
          >
            <option value="">Select</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Position<span className="required">*</span>
          <select
            name="position"
            value={data.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            required
          >
            <option value="">Select</option>
            {positionsList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Supervisor<span className="required">*</span>
          <select
            name="supervisor_id"
            value={data.supervisor_id || ""}
            onChange={(e) => onChange("supervisor_id", e.target.value)}
            required
          >
            <option value="">Select</option>
            {supervisors.map((s) => (
              <option key={s.employee_id} value={s.employee_id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Salary (CTC)<span className="required">*</span>
          <input
            type="number"
            name="salary"
            value={data.salary || ""}
            onChange={(e) => onChange("salary", e.target.value)}
            required
          />
        </label>
      </div>

      {/* Experiences */}
      <div className="edu-add-row">
        <button type="button" className="pj-next-btn" onClick={addExperience}>
          + Add Experience
        </button>
        {/* Display total experience */}
        <div className="total-experience">
          <strong>
            Total Experience:{" "}
            {years > 0 && `${years} yr${years > 1 ? "s" : ""} `}{" "}
            {months > 0 && `${months} mo${months > 1 ? "s" : ""}`}
            {years === 0 && months === 0 && "0"}
          </strong>
        </div>
      </div>

      <div className="exp-box">
        {expList.map((exp, idx) => (
          <div className="st-pro" key={idx}>
            <label>
              Company Name
              <input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(idx, "company", e.target.value)
                }
              />
            </label>

            <label>
              Role / Designation
              <input
                type="text"
                value={exp.role}
                onChange={(e) => updateExperience(idx, "role", e.target.value)}
              />
            </label>

            <label>
              Start Date
              <input
                type="date"
                value={exp.start_date || ""}
                onChange={(e) =>
                  updateExperience(idx, "start_date", e.target.value)
                }
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                value={exp.end_date || ""}
                onChange={(e) =>
                  updateExperience(idx, "end_date", e.target.value)
                }
              />
            </label>

            {/* Only one FileInput per row */}
            <FileInput
              name={`experience_${idx}_doc`}
              label="Experience Letter"
              accept=".pdf,image/*"
              existingUrl={exp.doc_url}
              onChange={(name, file) => updateExperience(idx, "doc", file)}
            />

            <MdOutlineCancel
              className="remove-qual-btn"
              onClick={() => removeExperience(idx)}
            />
          </div>
        ))}
      </div>

      {/* Final document uploads */}
      <div className="st-pro">
        <FileInput
          name="resume"
          label="Resume Upload"
          accept=".pdf"
          required
          existingUrl={data.resume_url}
          onChange={onChange}
        />

        <FileInput
          name="other_docs"
          label="Other Documents"
          accept=".pdf,image/*"
          multiple
          existingUrl={data.other_docs_urls} // pass the array of existing URLs
          onChange={onChange}
        />
      </div>
    </div>
  );
}
