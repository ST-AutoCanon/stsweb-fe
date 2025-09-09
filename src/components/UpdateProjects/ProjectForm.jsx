import React from "react";
import "./ProjectForm.css";
import { MdOutlineCancel } from "react-icons/md";
import Modal from "../Modal/Modal";
import useProjectForm from "./useProjectForm";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

const ProjectForm = ({ onClose, projectData, onSuccess, onProjectAdded }) => {
  const {
    step,
    setStep,
    adjustedSteps,
    currentIndex,
    progressPercent,
    lineLeft,
    totalLineWidth,
    allowedSteps,
    editable,
    formData,
    handleSubmit,
    prevStep,
    nextStep,
    alertModal,
    closeAlert,
    downloadAllAttachments,
    projectRole,
    onMonthlyFixedAmountChange,
    handleFinancialDetailsChange,
    valuesForSteps,
  } = useProjectForm({ projectData, onClose, onSuccess, onProjectAdded });

  return (
    <div className="pj-form-container">
      <div className="pj-form-header">
        <h2 className="pj-form-title">
          {projectData ? "Update Project" : "Add New Project"}
        </h2>
        <MdOutlineCancel className="pj-close-btn" onClick={onClose} />
      </div>

      <div
        className="pj-step-navigation"
        style={{
          "--step-line-left": lineLeft,
          "--step-line-total-width": totalLineWidth,
          "--step-progress-width": progressPercent,
        }}
      >
        <div className="pj-step-bg"></div>
        <div className="pj-step-line"></div>
        {adjustedSteps.map((stepName, index) => (
          <div
            key={index}
            className="pj-step-item"
            onClick={() => {
              if (allowedSteps.includes(index + 1)) {
                setStep(index + 1);
              }
            }}
            style={{
              cursor: allowedSteps.includes(index + 1)
                ? "pointer"
                : "not-allowed",
            }}
          >
            <div
              className={`pj-step-circle ${
                index < currentIndex
                  ? "completed"
                  : index === currentIndex
                  ? "active"
                  : ""
              }`}
            ></div>
            {stepName}
          </div>
        ))}
      </div>

      <div className="pj-form-content">
        {step === 1 && (
          <StepOne {...valuesForSteps.stepOne} editable={editable[1]} />
        )}

        {step === 2 && (
          <StepTwo {...valuesForSteps.stepTwo} editable={editable[2]} />
        )}

        {formData.payment_type !== "Monthly Scheduled" && step === 3 && (
          <StepThree {...valuesForSteps.stepThree} editable={editable[3]} />
        )}

        {((formData.payment_type === "Monthly Scheduled" && step === 4) ||
          (!["Monthly Scheduled"].includes(formData.payment_type) &&
            step === 4)) && (
          <StepFour
            {...valuesForSteps.stepFour}
            editable={editable[4]}
            downloadAllAttachments={downloadAllAttachments}
            onMonthlyFixedAmountChange={onMonthlyFixedAmountChange}
            onFinancialDetailsChange={handleFinancialDetailsChange}
          />
        )}
      </div>

      <div className="pj-form-buttons">
        {step > 1 && (
          <button className="pj-cancel-btn" onClick={prevStep}>
            Previous
          </button>
        )}
        {adjustedSteps.length > 0 && currentIndex < adjustedSteps.length - 1 ? (
          <button className="pj-next-btn" onClick={nextStep}>
            Next
          </button>
        ) : projectRole === "Employee" ? null : (
          <button className="pj-next-btn" onClick={handleSubmit}>
            {projectData ? "Update" : "Submit"}
          </button>
        )}
      </div>

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[
          {
            label: "OK",
            onClick: () => {
              closeAlert();
              if (alertModal.shouldCloseOnOk) {
                onClose();
              }
            },
          },
        ]}
      >
        <p style={{ whiteSpace: "pre-wrap" }}>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default ProjectForm;
