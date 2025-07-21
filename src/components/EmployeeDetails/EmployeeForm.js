import React, { useRef, useState } from "react";
import StepPersonal from "./steps/StepPersonal";
import StepEducation from "./steps/StepEducation";
import StepProfessional from "./steps/StepProfessional";
import StepBankDetails from "./steps/StepBankDetails";

const STEPS = ["personal", "education", "professional", "bank details"];

export default function EmployeeForm({
  initialData = {},
  onSubmit,
  onCancel,
  departments = [],
  positions = [],
  supervisors = [],
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: null,
    email: "",
    phone_number: "",
    gender: "",
    marital_status: "",
    spouse_name: "",
    marriage_date: null,
    father_name: "",
    mother_name: "",
    aadhaar_number: "",
    aadhaar_doc: null,
    pan_number: "",
    pan_doc: null,
    passport_number: "",
    voter_id: "",
    address: "",
    photo: null,
    tenth_institution: "",
    tenth_year: "",
    tenth_board: "",
    tenth_score: "",
    tenth_cert: null,
    twelfth_institution: "",
    twelfth_year: "",
    twelfth_board: "",
    twelfth_score: "",
    twelfth_cert: null,
    ug_institution: "",
    ug_year: "",
    ug_board: "",
    ug_score: "",
    ug_cert: null,
    pg_institution: "",
    pg_year: "",
    pg_board: "",
    pg_score: "",
    pg_cert: null,
    additional_cert_name: "",
    additional_cert_file: null,
    domain: "",
    employee_type: "",
    role: "",
    department_id: "",
    position: "",
    supervisor_id: "",
    salary: "",
    experience: [],
    resume: null,
    other_docs: [],
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  console.log("resume:", formData.resume);
  console.log("other_docs:", formData.other_docs);
  console.log(
    "experience docs:",
    formData.experience.map((e) => e.doc)
  );

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  function validateStep() {
    if (formRef.current) {
      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity();
        return false;
      }
    }
    return true;
  }

  const next = () => {
    setError("");

    if (!validateStep()) return;

    if (STEPS[currentStep] === "personal") {
      console.log("DOB raw value:", formData.dob, "type:", typeof formData.dob);

      if (!formData.dob) {
        setError("Please enter your date of birth.");
        return;
      }

      const [year, month, day] = formData.dob.split("-").map(Number);
      const dob = new Date(year, month - 1, day);
      console.log("Parsed DOB:", dob.toString());

      if (isNaN(dob.getTime())) {
        setError("Invalid date of birth.");
        return;
      }

      const today = new Date();
      const minDob = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      console.log("Minimum allowed DOB:", minDob.toString());

      if (dob > minDob) {
        setError("Employee must be at least 18 years old.");
        return;
      }
    }

    setCurrentStep((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const back = () => setCurrentStep((i) => Math.max(i - 1, 0));

  // inside EmployeeForm …
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError("");

    try {
      // 1) Build FormData
      const fd = new FormData();

      // append all primitive fields
      Object.entries(formData).forEach(([key, val]) => {
        // skip experience & other_docs for now
        if (key === "experience" || key === "other_docs") return;
        if (val != null) fd.append(key, val);
      });

      // 2) Add each experience entry
      formData.experience.forEach((exp, idx) => {
        fd.append(`experience[${idx}][company]`, exp.company);
        fd.append(`experience[${idx}][role]`, exp.role);
        fd.append(`experience[${idx}][start_date]`, exp.start_date);
        fd.append(`experience[${idx}][end_date]`, exp.end_date);

        // and *this* is the important bit:
        // FileInput called onChange("experience_${idx}_doc", file)
        // so we need to pick it up here:
        if (exp.doc instanceof File) {
          fd.append(`experience_${idx}_doc`, exp.doc, exp.doc.name);
        }
      });

      // 3) Other multi‑file fields
      if (Array.isArray(formData.other_docs)) {
        formData.other_docs.forEach((file, i) => {
          if (file instanceof File) {
            fd.append("other_docs", file, file.name);
          }
        });
      }

      // 4) And finally the resume
      if (formData.resume instanceof File) {
        fd.append("resume", formData.resume, formData.resume.name);
      }

      // 5) Send as multipart
      await onSubmit(fd); // make sure your onSubmit/axios call doesn't JSON.stringify
    } catch (err) {
      setError(err.message || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep]) {
      case "personal":
        return <StepPersonal data={formData} onChange={handleChange} />;
      case "education":
        return <StepEducation data={formData} onChange={handleChange} />;
      case "professional":
        return (
          <StepProfessional
            data={formData}
            onChange={handleChange}
            departments={departments}
            supervisors={supervisors}
          />
        );
      case "bank details":
        return <StepBankDetails data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="employee-form">
      <div className="steps-indicator">
        {STEPS.map((label, idx) => (
          <div key={label} className={idx === currentStep ? "active" : ""}>
            {label}
          </div>
        ))}
      </div>

      {/* wrap current step in its own <form> for HTML5 validation */}
      <form ref={formRef} noValidate>
        {renderStep()}
      </form>

      {error && <div className="error">{error}</div>}

      <div className="actions">
        {currentStep > 0 && (
          <button type="button" onClick={back}>
            Back
          </button>
        )}
        {currentStep < STEPS.length - 1 && (
          <button type="button" onClick={next}>
            Next
          </button>
        )}
        {currentStep === STEPS.length - 1 && (
          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        )}
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
