import React, { useRef, useState } from "react";
import StepPersonal from "./steps/StepPersonal";
import StepGovernmentDocs from "./steps/StepGovernmentDocs";
import StepEducation from "./steps/StepEducation";
import StepProfessional from "./steps/StepProfessional";
import StepBankDetails from "./steps/StepBankDetails";
import StepInsurance from "./steps/StepFamilyDetails";

const STEPS = [
  "personal",
  "government docs",
  "education",
  "professional",
  "bank details",
  "family details",
];

export default function EmployeeForm({
  initialData = {},
  onSubmit,
  onCancel,
  departments = [],
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const sanitizedInitialData = {
    ...initialData,
    experience: Array.isArray(initialData.experience)
      ? initialData.experience
      : [],
    other_docs: Array.isArray(initialData.other_docs)
      ? initialData.other_docs
      : [],
    additional_certs: Array.isArray(initialData.additional_certs)
      ? initialData.additional_certs
      : [],
    tenth_cert: Array.isArray(initialData.tenth_cert)
      ? initialData.tenth_cert
      : [],
    twelfth_cert: Array.isArray(initialData.twelfth_cert)
      ? initialData.twelfth_cert
      : [],
    ug_cert: Array.isArray(initialData.ug_cert) ? initialData.ug_cert : [],
    pg_cert: Array.isArray(initialData.pg_cert) ? initialData.pg_cert : [],
  };

  const [formData, setFormData] = useState({
    // personal
    first_name: "",
    last_name: "",
    dob: null,
    email: "",
    alternate_email: "",
    phone_number: "",
    alternate_number: "",
    gender: "",
    blood_group: "",
    emergency_name: "",
    emergency_number: "",
    address: "",
    photo: null,
    // government
    aadhaar_number: "",
    aadhaar_doc: null,
    pan_number: "",
    pan_doc: null,
    passport_number: "",
    passport_doc: null,
    driving_license_number: "",
    driving_license_doc: null,
    voter_id: "",
    voter_id_doc: null,
    uan_number: "",
    pf_number: "",
    esi_number: "",
    // education
    tenth_institution: "",
    tenth_year: "",
    tenth_board: "",
    tenth_score: "",
    tenth_cert: sanitizedInitialData.tenth_cert,
    twelfth_institution: "",
    twelfth_year: "",
    twelfth_board: "",
    twelfth_score: "",
    twelfth_cert: sanitizedInitialData.twelfth_cert,
    ug_institution: "",
    ug_year: "",
    ug_board: "",
    ug_score: "",
    ug_cert: sanitizedInitialData.ug_cert,
    pg_institution: "",
    pg_year: "",
    pg_board: "",
    pg_score: "",
    pg_cert: sanitizedInitialData.pg_cert,
    additional_certs: sanitizedInitialData.additional_certs,
    // professional
    domain: "",
    employee_type: "",
    joining_date: null,
    role: "",
    department_id: "",
    position: "",
    supervisor_id: "",
    salary: "",
    experience: sanitizedInitialData.experience,
    other_docs: sanitizedInitialData.other_docs,
    resume: null,
    // bank
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    // family
    father_name: "",
    father_dob: null,
    father_gov_doc: null,
    mother_name: "",
    mother_dob: null,
    mother_gov_doc: null,
    marital_status: "",
    marriage_date: null,
    spouse_name: "",
    spouse_dob: null,
    spouse_gov_doc: null,
    child1_name: "",
    child1_dob: null,
    child1_gov_doc: null,
    child2_name: "",
    child2_dob: null,
    child2_gov_doc: null,
    child3_name: "",
    child3_dob: null,
    child3_gov_doc: null,
    ...sanitizedInitialData,
  });

  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const validateStep = () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return false;
    }
    return true;
  };

  const next = () => {
    setError("");
    if (!validateStep()) return;
    setCurrentStep((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => setCurrentStep((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      // append simple fields (exclude arrays)
      Object.entries(formData).forEach(([key, val]) => {
        if (
          [
            "experience",
            "other_docs",
            "additional_certs",
            "tenth_cert",
            "twelfth_cert",
            "ug_cert",
            "pg_cert",
            "father_gov_doc",
            "mother_gov_doc",
            "spouse_gov_doc",
            "child1_gov_doc",
            "child2_gov_doc",
            "child3_gov_doc",
          ].includes(key)
        )
          return;
        if (val != null) fd.append(key, val);
      });
      // multiple file arrays
      [
        "other_docs",
        "tenth_cert",
        "twelfth_cert",
        "ug_cert",
        "pg_cert",
      ].forEach((field) => {
        const arr = formData[field];
        if (Array.isArray(arr)) {
          arr.forEach((file) => {
            if (file instanceof File) fd.append(field, file, file.name);
          });
        }
      });
      // experience
      formData.experience.forEach((exp, idx) => {
        fd.append(`experience[${idx}][company]`, exp.company);
        fd.append(`experience[${idx}][role]`, exp.role);
        fd.append(`experience[${idx}][start_date]`, exp.start_date);
        fd.append(`experience[${idx}][end_date]`, exp.end_date);
        if (Array.isArray(exp.doc)) {
          exp.doc.forEach((f) => {
            fd.append(`experience[${idx}][doc]`, f, f.name);
          });
        } else if (exp.doc instanceof File) {
          fd.append(`experience[${idx}][doc]`, exp.doc, exp.doc.name);
        }
      });
      // additional certs
      formData.additional_certs.forEach((cert, idx) => {
        fd.append(`additional_certs[${idx}][name]`, cert.name);
        fd.append(`additional_certs[${idx}][year]`, cert.year);
        fd.append(`additional_certs[${idx}][institution]`, cert.institution);
        if (Array.isArray(cert.file)) {
          cert.file.forEach((f) => {
            fd.append(`additional_certs[${idx}][file]`, f, f.name);
          });
        } else if (cert.file instanceof File) {
          fd.append(
            `additional_certs[${idx}][file]`,
            cert.file,
            cert.file.name
          );
        }
      });

      [
        "father_gov_doc",
        "mother_gov_doc",
        "spouse_gov_doc",
        "child1_gov_doc",
        "child2_gov_doc",
        "child3_gov_doc",
      ].forEach((field) => {
        const arr = formData[field];
        if (Array.isArray(arr)) {
          arr.forEach((f) => fd.append(field, f, f.name));
        }
      });

      // resume
      if (formData.resume instanceof File)
        fd.append("resume", formData.resume, formData.resume.name);
      // …inside handleSubmit, just before await onSubmit(fd):
      for (let [key, val] of fd.entries()) {
        // If it's a File, log name + size; otherwise just log the value
        if (val instanceof File) {
          console.log(
            `↪︎ FormData field: ${key} ⇒ File { name: ${val.name}, size: ${val.size} }`
          );
        } else {
          console.log(`↪︎ FormData field: ${key} ⇒`, val);
        }
      }
      await onSubmit(fd);
    } catch (err) {
      setError(err.message || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const stepsComponents = [
    <StepPersonal key="personal" data={formData} onChange={handleChange} />,
    <StepGovernmentDocs
      key="government_docs"
      data={formData}
      onChange={handleChange}
    />,
    <StepEducation key="education" data={formData} onChange={handleChange} />,
    <StepProfessional
      key="professional"
      data={formData}
      onChange={handleChange}
      departments={departments}
    />,
    <StepBankDetails
      key="bank_details"
      data={formData}
      onChange={handleChange}
    />,
    <StepInsurance
      key="family_details"
      data={formData}
      onChange={handleChange}
    />,
  ];

  return (
    <div className="employee-form">
      <div className="steps-indicator">
        {STEPS.map((lbl, i) => (
          <div key={lbl} className={i === currentStep ? "active" : ""}>
            {lbl}
          </div>
        ))}
      </div>
      <form ref={formRef} noValidate className="ed-form">
        {stepsComponents.map((Comp, idx) => (
          <fieldset
            key={idx}
            disabled={idx !== currentStep}
            style={{ display: idx === currentStep ? "block" : "none" }}
          >
            {Comp}
          </fieldset>
        ))}
      </form>
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
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
      </div>
    </div>
  );
}
