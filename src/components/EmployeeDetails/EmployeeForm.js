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

  const dashboardData = JSON.parse(localStorage.getItem("dashboardData")) || {};
  const employeeId = dashboardData.employeeId || null;

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

      // helpers
      const isFile = (v) => v instanceof File;
      const hasFileIn = (val) => {
        if (!val) return false;
        if (Array.isArray(val)) return val.some(isFile);
        return isFile(val);
      };

      // appendUrlArray: always appends a JSON string array of URLs when there are only URLs (no File)
      function appendUrlArray(fd, key, maybeArr) {
        if (!maybeArr) return;
        if (Array.isArray(maybeArr)) {
          const urls = maybeArr.filter((v) => typeof v === "string");
          if (urls.length) fd.append(key, JSON.stringify(urls));
          return;
        }
        const s = String(maybeArr).trim();
        if (!s) return;
        if (s.startsWith("[") && s.endsWith("]")) {
          try {
            JSON.parse(s);
            fd.append(key, s);
            return;
          } catch {
            // fall through to comma separated
          }
        }
        if (s.includes(",")) {
          const parts = s
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          if (parts.length) fd.append(key, JSON.stringify(parts));
          return;
        }
        fd.append(key, JSON.stringify([s]));
      }

      // -----------------------
      // 1) append simple (non-file) fields
      // -----------------------
      const skipKeys = new Set([
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
        "resume",
      ]);

      Object.entries(formData).forEach(([key, val]) => {
        if (skipKeys.has(key)) return;
        // Note: include url fields if user prefilled them (we handle them below more carefully)
        if (val !== undefined && val !== null) fd.append(key, val);
      });

      // -----------------------
      // 2) append multi-file arrays (actual file uploads)
      // names here match the file input names your server code expects
      // -----------------------
      [
        "other_docs",
        "tenth_cert",
        "twelfth_cert",
        "ug_cert",
        "pg_cert",
      ].forEach((field) => {
        const arr = formData[field];
        if (!Array.isArray(arr)) return;
        for (const f of arr) {
          if (isFile(f)) fd.append(field, f, f.name);
        }
      });

      // family gov doc file inputs
      [
        "father_gov_doc",
        "mother_gov_doc",
        "spouse_gov_doc",
        "child1_gov_doc",
        "child2_gov_doc",
        "child3_gov_doc",
      ].forEach((field) => {
        const arr = formData[field];
        if (!arr) return;
        if (Array.isArray(arr)) {
          for (const f of arr) {
            if (isFile(f)) fd.append(field, f, f.name);
          }
        } else if (isFile(arr)) {
          fd.append(field, arr, arr.name);
        }
      });

      // resume (single file)
      if (isFile(formData.resume)) {
        fd.append("resume", formData.resume, formData.resume.name);
      }

      // -----------------------
      // 3) experience array: append scalar fields + files (or urls fallback)
      // server.editFullEmployee expects experience items with doc_urls for existing URLs
      // -----------------------
      (formData.experience || []).forEach((exp, idx) => {
        fd.append(`experience[${idx}][company]`, exp.company ?? "");
        fd.append(`experience[${idx}][role]`, exp.role ?? "");
        fd.append(`experience[${idx}][start_date]`, exp.start_date ?? "");
        fd.append(`experience[${idx}][end_date]`, exp.end_date ?? "");

        // If this exp has File(s), append them under experience[IDX][doc]
        if (Array.isArray(exp.doc) && exp.doc.some(isFile)) {
          for (const f of exp.doc) {
            if (isFile(f)) fd.append(`experience[${idx}][doc]`, f, f.name);
          }
        } else if (isFile(exp.doc)) {
          fd.append(`experience[${idx}][doc]`, exp.doc, exp.doc.name);
        } else {
          // no files -> if URLs exist, send doc_urls JSON array
          if (Array.isArray(exp.doc)) {
            const urlOnly = exp.doc.filter((x) => typeof x === "string");
            if (urlOnly.length)
              fd.append(
                `experience[${idx}][doc_urls]`,
                JSON.stringify(urlOnly)
              );
          } else if (typeof exp.doc === "string" && exp.doc.trim()) {
            fd.append(
              `experience[${idx}][doc_urls]`,
              JSON.stringify([exp.doc.trim()])
            );
          } else if (Array.isArray(exp.files)) {
            // older naming variants: exp.files
            const urlOnly = exp.files.filter((x) => typeof x === "string");
            if (urlOnly.length)
              fd.append(
                `experience[${idx}][doc_urls]`,
                JSON.stringify(urlOnly)
              );
          }
        }
      });

      // -----------------------
      // 4) additional_certs: append scalars + files (or url fallback)
      // server.editFullEmployee expects additional_certs[*].file_urls for existing URLs
      // -----------------------
      (formData.additional_certs || []).forEach((cert, idx) => {
        fd.append(`additional_certs[${idx}][name]`, cert.name ?? "");
        fd.append(`additional_certs[${idx}][year]`, cert.year ?? "");
        fd.append(
          `additional_certs[${idx}][institution]`,
          cert.institution ?? ""
        );

        if (Array.isArray(cert.file) && cert.file.some(isFile)) {
          for (const f of cert.file) {
            if (isFile(f))
              fd.append(`additional_certs[${idx}][file]`, f, f.name);
          }
        } else if (isFile(cert.file)) {
          fd.append(
            `additional_certs[${idx}][file]`,
            cert.file,
            cert.file.name
          );
        } else {
          // fallback to url array keys if no files
          if (
            Array.isArray(cert.files) &&
            cert.files.some((x) => typeof x === "string")
          ) {
            fd.append(
              `additional_certs[${idx}][file_urls]`,
              JSON.stringify(cert.files.filter((x) => typeof x === "string"))
            );
          } else if (
            Array.isArray(cert.file) &&
            cert.file.every((x) => typeof x === "string")
          ) {
            fd.append(
              `additional_certs[${idx}][file_urls]`,
              JSON.stringify(cert.file)
            );
          } else if (typeof cert.file === "string" && cert.file.trim()) {
            fd.append(
              `additional_certs[${idx}][file_urls]`,
              JSON.stringify([cert.file.trim()])
            );
          } else if (Array.isArray(cert.file_urls)) {
            fd.append(
              `additional_certs[${idx}][file_urls]`,
              JSON.stringify(cert.file_urls)
            );
          } else if (
            typeof cert.file_urls === "string" &&
            cert.file_urls.trim()
          ) {
            // maybe comma separated or JSON
            appendUrlArray(
              fd,
              `additional_certs[${idx}][file_urls]`,
              cert.file_urls
            );
          }
        }
      });

      // -----------------------
      // 5) fallback: append existing URL arrays for fields that had no new files
      // send keys the server expects: tenth_cert_url, twelfth_cert_url, ug_cert_url, pg_cert_url, other_docs_urls, resume_url, family *_gov_doc_url
      // -----------------------
      if (!hasFileIn(formData.tenth_cert))
        appendUrlArray(fd, "tenth_cert_url", formData.tenth_cert);
      if (!hasFileIn(formData.twelfth_cert))
        appendUrlArray(fd, "twelfth_cert_url", formData.twelfth_cert);
      if (!hasFileIn(formData.ug_cert))
        appendUrlArray(fd, "ug_cert_url", formData.ug_cert);
      if (!hasFileIn(formData.pg_cert))
        appendUrlArray(fd, "pg_cert_url", formData.pg_cert);

      // other_docs: file uploads are 'other_docs'. if none uploaded, send other_docs_urls
      if (!hasFileIn(formData.other_docs))
        appendUrlArray(
          fd,
          "other_docs_urls",
          formData.other_docs || formData.other_docs_urls
        );

      // resume
      if (!isFile(formData.resume) && formData.resume) {
        // formData.resume might be a string or array-of-strings
        appendUrlArray(fd, "resume_url", formData.resume);
      } else if (!formData.resume && formData.resume_url) {
        // if backend returned resume_url earlier and front didn't set resume
        appendUrlArray(fd, "resume_url", formData.resume_url);
      }

      // family gov doc urls fallback (only if no new files were provided)
      const familyPairs = [
        ["father_gov_doc", "father_gov_doc_url"],
        ["mother_gov_doc", "mother_gov_doc_url"],
        ["spouse_gov_doc", "spouse_gov_doc_url"],
        ["child1_gov_doc", "child1_gov_doc_url"],
        ["child2_gov_doc", "child2_gov_doc_url"],
        ["child3_gov_doc", "child3_gov_doc_url"],
      ];
      for (const [fileField, urlField] of familyPairs) {
        // prefer either the `*_gov_doc` or existing `*_gov_doc_url` keys from formData
        const maybeFiles = formData[fileField];
        const maybeUrls = formData[urlField] || formData[fileField + "_url"];
        // if no file present, append the url array
        if (!hasFileIn(maybeFiles)) {
          appendUrlArray(fd, urlField, maybeUrls || maybeFiles);
        }
      }

      // -----------------------
      // 6) final debug log of FormData entries (useful to inspect duplicates)
      // -----------------------
      for (let [key, val] of fd.entries()) {
        if (val instanceof File) {
          console.log(
            `↪︎ FormData field: ${key} ⇒ File { name: ${val.name}, size: ${val.size} }`
          );
        } else {
          console.log(`↪︎ FormData field: ${key} ⇒`, val);
        }
      }

      // 7) send to server
      await onSubmit(fd);

      // 8) create supervisor assignment if required (existing logic)
      if (
        initialData.employee_id &&
        initialData.supervisor_id !== formData.supervisor_id
      ) {
        const today = new Date().toISOString().slice(0, 10);
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/supervisor/assign`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
            "x-employee-id": employeeId,
          },
          body: JSON.stringify({
            employeeId: initialData.employee_id,
            supervisorId: formData.supervisor_id,
            startDate: today,
          }),
        })
          .then((r) => r.json())
          .then((json) => {
            if (!json.success) console.error("Supervisor assign failed", json);
          })
          .catch(console.error);
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
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
