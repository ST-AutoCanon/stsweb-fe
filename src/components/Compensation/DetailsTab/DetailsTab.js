// import React from 'react';
// import './DetailsTab.css';

// const DetailsTab = ({
//   selectedEmployee,
//   activeTab,
//   setActiveTab,
//   handleCloseDetailsTab,
//   calculateSalaryDetails,
//   employeeLopData,
//   overtimeRecords,
//   bonusRecords,
//   advances,
// }) => {
//   // Default values as defined in calculateSalaryDetails
//   const calculationDefaults = {
//     basicSalary: { percentage: '40', type: 'percentage' },
//     hra: { percentage: '50', type: 'percentage' },
//     lta: { percentage: '0', type: 'percentage' },
//     otherAllowance: { percentage: 'fill', type: 'percentage' },
//     variablePay: { percentage: '0', type: 'percentage' },
//     statutoryBonus: { percentage: '0', type: 'percentage' },
//     incentives: { amount: '0', type: 'amount' },
//     professionalTax: { amount: '200', type: 'amount' },
//     pfEmployee: { percentage: '0', type: 'percentage' },
//     pfEmployer: { percentage: '0', type: 'percentage' },
//     esicEmployee: { percentage: '0', type: 'percentage' },
//     insuranceEmployee: { percentage: '0', type: 'percentage' },
//     gratuity: { percentage: '4.81', type: 'percentage' },
//     tds: { percentage: '0', type: 'percentage' },
//     advanceRecovery: { amount: '0', type: 'amount' },
//   };

//   // Format working days in a human-readable way
//   const formatWorkingDays = (workingDays) => {
//     if (!workingDays || typeof workingDays !== 'object') return 'None';
//     return Object.entries(workingDays)
//       .map(([day, status]) => `${day}: ${status}`)
//       .join(', ');
//   };

//   // Format TDS slabs in a human-readable way
//   const formatTdsSlabs = (slabs) => {
//     if (!Array.isArray(slabs) || slabs.length === 0) return 'None';
//     return slabs
//       .map((slab) => `From ₹${slab.from || '0'} to ₹${slab.to || '∞'}: ${slab.percentage || '0'}%`)
//       .join('; ');
//   };

//   // Calculate salary details
//   const salaryDetails = calculateSalaryDetails(
//     selectedEmployee.ctc,
//     selectedEmployee.plan_data,
//     selectedEmployee.employee_id,
//     overtimeRecords,
//     bonusRecords,
//     advances
//   );

//   // LOP data
//   const lopData =
//     employeeLopData[selectedEmployee.employee_id] || {
//       currentMonth: { days: 0, value: '0.00', currency: 'INR' },
//       deferred: { days: 0, value: '0.00', currency: 'INR' },
//       nextMonth: { days: 0, value: '0.00', currency: 'INR' },
//       yearly: { days: 0, value: '0.00', currency: 'INR' },
//     };

//   // Validation checks
//   if (!salaryDetails || !selectedEmployee.employee_id) {
//     return <p>No valid employee data provided</p>;
//   }
//   if (!selectedEmployee.ctc || selectedEmployee.ctc <= 0) {
//     return <p>No valid CTC provided for this employee</p>;
//   }

//   const planData = selectedEmployee.plan_data || {};
//   const monthlyCTC = selectedEmployee.ctc ? selectedEmployee.ctc / 12 : 0;

//   // Capitalize calculation base for display
//   const formatCalculationBase = (base) => {
//     return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Basic';
//   };

//   // Define salary components
//   const components = [
//     {
//       label: 'Basic Salary',
//       planDetail:
//         planData.isBasicSalary && planData.basicSalaryType === 'percentage' && planData.basicSalary
//           ? `${planData.basicSalary}% of CTC`
//           : planData.isBasicSalary && planData.basicSalaryType === 'amount' && planData.basicSalaryAmount
//           ? `₹${parseFloat(planData.basicSalaryAmount).toLocaleString()}`
//           : `${calculationDefaults.basicSalary.percentage}% of CTC (default)`,
//       yearly: salaryDetails.basicSalary * 12,
//       monthly: salaryDetails.basicSalary,
//       isDeduction: false,
//     },
//     {
//       label: 'HRA',
//       planDetail:
//         planData.isHouseRentAllowance &&
//         planData.houseRentAllowanceType === 'percentage' && planData.houseRentAllowance
//           ? `${planData.houseRentAllowance}% of Basic`
//           : planData.isHouseRentAllowance &&
//             planData.houseRentAllowanceType === 'amount' && planData.houseRentAllowanceAmount
//           ? `₹${parseFloat(planData.houseRentAllowanceAmount).toLocaleString()}`
//           : `${calculationDefaults.hra.percentage}% of Basic (default)`,
//       yearly: salaryDetails.hra * 12,
//       monthly: salaryDetails.hra,
//       isDeduction: false,
//     },
//     {
//       label: 'LTA Allowance',
//       planDetail:
//         planData.isLtaAllowance && planData.ltaAllowanceType === 'percentage' && planData.ltaAllowance
//           ? `${planData.ltaAllowance}% of CTC`
//           : planData.isLtaAllowance && planData.ltaAllowanceType === 'amount' && planData.ltaAllowanceAmount
//           ? `₹${parseFloat(planData.ltaAllowanceAmount).toLocaleString()}`
//           : `${calculationDefaults.lta.percentage}% of CTC (default)`,
//       yearly: salaryDetails.ltaAllowance * 12,
//       monthly: salaryDetails.ltaAllowance,
//       isDeduction: false,
//     },
//     {
//       label: 'Other Allowances',
//       planDetail:
//         planData.isOtherAllowance &&
//         planData.otherAllowanceType === 'percentage' && planData.otherAllowance
//           ? `${planData.otherAllowance}% of CTC`
//           : planData.isOtherAllowance &&
//             planData.otherAllowanceType === 'amount' && planData.otherAllowanceAmount
//           ? `₹${parseFloat(planData.otherAllowanceAmount).toLocaleString()}`
//           : salaryDetails.otherAllowances > 0 && monthlyCTC > 0
//           ? `${((salaryDetails.otherAllowances / monthlyCTC) * 100).toFixed(2)}% of CTC (calculated)`
//           : `${calculationDefaults.otherAllowance.percentage}% of CTC (default)`,
//       yearly: salaryDetails.otherAllowances * 12,
//       monthly: salaryDetails.otherAllowances,
//       isDeduction: false,
//     },
//     {
//       label: 'Incentives',
//       planDetail:
//         planData.isIncentives && planData.incentivesType === 'amount' && planData.incentivesAmount
//           ? `₹${parseFloat(planData.incentivesAmount).toLocaleString()}`
//           : planData.isIncentives && planData.incentivesType === 'percentage' && planData.incentives
//           ? `${planData.incentives}% of CTC`
//           : `${calculationDefaults.incentives.amount} (default)`,
//       yearly: salaryDetails.incentives * 12,
//       monthly: salaryDetails.incentives,
//       isDeduction: false,
//     },
//     {
//       label: 'Overtime Pay',
//       planDetail:
//         planData.isOvertimePay && planData.overtimePayAmount
//           ? `₹${parseFloat(planData.overtimePayAmount).toLocaleString()}/hour`
//           : 'None (default)',
//       yearly: salaryDetails.overtimePay * 12,
//       monthly: salaryDetails.overtimePay,
//       isDeduction: false,
//     },
//     {
//       label: 'Bonus',
//       planDetail:
//         planData.isStatutoryBonus &&
//         planData.statutoryBonusType === 'percentage' && planData.statutoryBonusPercentage
//           ? `${planData.statutoryBonusPercentage}% of CTC`
//           : planData.isStatutoryBonus && planData.statutoryBonusType === 'amount' && planData.statutoryBonusAmount
//           ? `₹${parseFloat(planData.statutoryBonusAmount).toLocaleString()}`
//           : `${calculationDefaults.statutoryBonus.percentage}% of CTC (default)`,
//       yearly: salaryDetails.bonusPay * 12,
//       monthly: salaryDetails.bonusPay,
//       isDeduction: false,
//     },
//     {
//       label: 'Advance Recovery',
//       planDetail: `${calculationDefaults.advanceRecovery.amount} (default)`,
//       yearly: salaryDetails.advanceRecovery * 12,
//       monthly: salaryDetails.advanceRecovery,
//       isDeduction: true,
//     },
//     {
//       label: 'Employee PF',
//      planDetail:
//   planData.isPFApplicable &&
//   planData.isPFEmployee &&
//   planData.pfEmployeeType === 'percentage' &&
//   planData.pfEmployeePercentage
//     ? `${planData.pfEmployeePercentage}% of ${formatCalculationBase(planData.pfCalculationBase)}`
//     : planData.isPFApplicable && planData.isPFEmployee && planData.pfEmployeeType === 'amount' && planData.pfEmployeeAmount
//     ? `₹${parseFloat(planData.pfEmployeeAmount).toLocaleString()}`
//     : `${calculationDefaults.pfEmployee.percentage}% of Basic (default)`,

//     },
//     {
//       label: 'Employer PF',
//       planDetail:
//         planData.isPFApplicable &&
//         planData.isPFEmployer &&
//         planData.pfEmployerType === 'percentage' &&
//         planData.pfEmployerPercentage
//           ? `${planData.pfEmployerPercentage}% of ${formatCalculationBase(planData.pfCalculationBase)}`
//           : planData.isPFApplicable && planData.isPFEmployer && planData.pfEmployerType === 'amount' && planData.pfEmployerAmount
//           ? `₹${parseFloat(planData.pfEmployerAmount).toLocaleString()}`
//           : `${calculationDefaults.pfEmployer.percentage}% of Basic (default)`,
//       yearly: salaryDetails.employerPF * 12,
//       monthly: salaryDetails.employerPF,
//       isDeduction: true,
//     },
//     {
//       label: 'ESIC',
//       planDetail:
//         planData.isMedicalApplicable &&
//         planData.isESICEmployee &&
//         planData.esicEmployeeType === 'percentage' &&
//         planData.esicEmployeePercentage
//           ? `${planData.esicEmployeePercentage}% of ${formatCalculationBase(planData.medicalCalculationBase)}`
//           : planData.isMedicalApplicable && planData.isESICEmployee && planData.esicEmployeeType === 'amount' && planData.esicEmployeeAmount
//           ? `₹${parseFloat(planData.esicEmployeeAmount).toLocaleString()}`
//           : `${calculationDefaults.esicEmployee.percentage}% of Basic (default)`,
//       yearly: salaryDetails.esic * 12,
//       monthly: salaryDetails.esic,
//       isDeduction: true,
//     },
//     {
//       label: 'Gratuity',
//       planDetail:
//         planData.isGratuityApplicable && planData.gratuityType === 'percentage' && planData.gratuityPercentage
//           ? `${planData.gratuityPercentage}% of Basic`
//           : planData.isGratuityApplicable && planData.gratuityType === 'amount' && planData.gratuityAmount
//           ? `₹${parseFloat(planData.gratuityAmount).toLocaleString()}`
//           : `${calculationDefaults.gratuity.percentage}% of Basic (default)`,
//       yearly: salaryDetails.gratuity * 12,
//       monthly: salaryDetails.gratuity,
//       isDeduction: true,
//     },
//     {
//       label: 'Professional Tax',
//       planDetail:
//         planData.isProfessionalTax && planData.professionalTaxType === 'percentage' && planData.professionalTax
//           ? `${planData.professionalTax}% of CTC`
//           : planData.isProfessionalTax && planData.professionalTaxType === 'amount' && planData.professionalTaxAmount
//           ? `₹${parseFloat(planData.professionalTaxAmount).toLocaleString()}`
//           : monthlyCTC <= 15000
//           ? `₹0 (default)`
//           : `₹${calculationDefaults.professionalTax.amount} (default)`,
//       yearly: salaryDetails.professionalTax * 12,
//       monthly: salaryDetails.professionalTax,
//       isDeduction: true,
//     },
//     {
//       label: 'TDS',
//       planDetail: (() => {
//         if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
//           return formatTdsSlabs(planData.tdsSlabs);
//         }
//         return `${calculationDefaults.tds.percentage}% (default)`;
//       })(),
//       yearly: salaryDetails.tds * 12,
//       monthly: salaryDetails.tds,
//       isDeduction: true,
//     },
//     {
//       label: 'Insurance',
//       planDetail:
//         planData.isMedicalApplicable &&
//         planData.isInsuranceEmployee &&
//         planData.insuranceEmployeeType === 'percentage' &&
//         planData.insuranceEmployeePercentage
//           ? `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(planData.medicalCalculationBase)}`
//           : planData.isMedicalApplicable && planData.isInsuranceEmployee && planData.insuranceEmployeeType === 'amount' && planData.insuranceEmployeeAmount
//           ? `₹${parseFloat(planData.insuranceEmployeeAmount).toLocaleString()}`
//           : `${calculationDefaults.insuranceEmployee.percentage}% of Basic (default)`,
//       yearly: salaryDetails.insurance * 12,
//       monthly: salaryDetails.insurance,
//       isDeduction: true,
//     },
//     {
//       label: 'LOP Deduction',
//       planDetail:
//         lopData && lopData.currentMonth.days > 0
//           ? `${lopData.currentMonth.days} day${lopData.currentMonth.days > 1 ? 's' : ''}`
//           : 'None (default)',
//       yearly: lopData ? parseFloat(lopData.yearly.value) : 0,
//       monthly: lopData ? parseFloat(lopData.currentMonth.value) : 0,
//       isDeduction: true,
//     },
//     {
//       label: 'Default Working Hours',
//       planDetail:
//         planData.isDefaultWorkingHours && planData.defaultWorkingHours
//           ? `${planData.defaultWorkingHours} hours`
//           : 'None',
//       yearly: null,
//       monthly: null,
//       isDeduction: false,
//     },
//     {
//       label: 'Default Working Days',
//       planDetail:
//         planData.isDefaultWorkingDays && planData.defaultWorkingDays
//           ? formatWorkingDays(planData.defaultWorkingDays)
//           : 'None',
//       yearly: null,
//       monthly: null,
//       isDeduction: false,
//     },
//   ];

//   // Calculate totals
//   const totalEarningsMonthly = components
//     .filter((comp) => !comp.isDeduction && comp.monthly !== null)
//     .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
//   const totalDeductionsMonthly = components
//     .filter((comp) => comp.isDeduction && comp.monthly !== null)
//     .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
//   const netSalaryMonthly = totalEarningsMonthly - totalDeductionsMonthly;
//   const totalEarningsYearly = components
//     .filter((comp) => !comp.isDeduction && comp.yearly !== null)
//     .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
//   const totalDeductionsYearly = components
//     .filter((comp) => comp.isDeduction && comp.yearly !== null)
//     .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
//   const netSalaryYearly = totalEarningsYearly - totalDeductionsYearly;

//   return (
//     <div className="sb-details-tab">
//       <div className="sb-details-tab-header">
//         <h2>Salary Details</h2>
//         <button className="sb-details-tab-close" onClick={handleCloseDetailsTab}>
//           ×
//         </button>
//       </div>
//       <div className="sb-details-tab-content">
//         <div className="sb-details-employee-name">{selectedEmployee.full_name || 'N/A'}</div>
//         <div className="sb-details-ctc-info">
//           <div>
//             <strong>Comp. Plan:</strong> {selectedEmployee.compensation_plan_name || 'N/A'}
//           </div>
//           <div>
//             <strong>CTC (Yearly):</strong>{' '}
//             ₹{selectedEmployee.ctc ? parseFloat(selectedEmployee.ctc).toLocaleString() : 'N/A'}
//           </div>
//           <div>
//             <strong>CTC (Monthly):</strong>{' '}
//             ₹{selectedEmployee.ctc ? (parseFloat(selectedEmployee.ctc) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
//           </div>
//         </div>
//         <div className="sb-details-tab-buttons">
//           <button
//             className={`sb-details-tab-button yearly ${activeTab === 'yearly' ? 'active' : ''}`}
//             onClick={() => setActiveTab('yearly')}
//           >
//             Yearly
//           </button>
//           <button
//             className={`sb-details-tab-button monthly ${activeTab === 'monthly' ? 'active' : ''}`}
//             onClick={() => setActiveTab('monthly')}
//           >
//             Monthly
//           </button>
//         </div>
//         <div className="sb-details-tab-details">
//           <table className="sb-details-table">
//             <thead>
//               <tr>
//                 <th className="sb-details-table-header sb-details-align-left">Component</th>
//                 <th className="sb-details-table-header sb-details-align-left">Comp. Plan</th>
//                 <th className="sb-details-table-header sb-details-align-right">
//                   {activeTab === 'yearly' ? 'Yearly Amount' : 'Monthly Amount'}
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="sb-details-table-body-wrapper">
//               {components.map((item, index) => (
//                 <tr key={index} className={item.isDeduction ? 'sb-details-deduction-row' : ''}>
//                   <td className="sb-details-table-cell sb-details-align-left">{item.label}</td>
//                   <td className="sb-details-table-cell sb-details-align-left">{item.planDetail}</td>
//                   <td className="sb-details-table-cell sb-details-align-right">
//                     {(activeTab === 'yearly' ? item.yearly : item.monthly) != null &&
//                     (activeTab === 'yearly' ? item.yearly : item.monthly) > 0
//                       ? `₹${parseFloat(activeTab === 'yearly' ? item.yearly : item.monthly).toLocaleString()}`
//                       : 'N/A'}
//                   </td>
//                 </tr>
//               ))}
//               <tr className="sb-details-total-row">
//                 <td className="sb-details-table-cell sb-details-align-left">
//                   <strong>Earnings</strong>
//                 </td>
//                 <td className="sb-details-table-cell sb-details-align-left">N/A</td>
//                 <td className="sb-details-table-cell sb-details-align-right">
//                   <strong>₹{parseFloat(activeTab === 'yearly' ? totalEarningsYearly : totalEarningsMonthly).toLocaleString()}</strong>
//                 </td>
//               </tr>
//               <tr className="sb-details-total-row">
//                 <td className="sb-details-table-cell sb-details-align-left">
//                   <strong>Deductions</strong>
//                 </td>
//                 <td className="sb-details-table-cell sb-details-align-left">N/A</td>
//                 <td className="sb-details-table-cell sb-details-align-right">
//                   <strong>₹{parseFloat(activeTab === 'yearly' ? totalDeductionsYearly : totalDeductionsMonthly).toLocaleString()}</strong>
//                 </td>
//               </tr>
//               <tr className="sb-details-total-row">
//                 <td className="sb-details-table-cell sb-details-align-left">
//                   <strong>Gross Salary</strong>
//                 </td>
//                 <td className="sb-details-table-cell sb-details-align-left">N/A</td>
//                 <td className="sb-details-table-cell sb-details-align-right">
//                   <strong>₹{parseFloat(activeTab === 'yearly' ? salaryDetails.grossSalary * 12 : salaryDetails.grossSalary).toLocaleString()}</strong>
//                 </td>
//               </tr>
//               <tr className="sb-details-total-row">
//                 <td className="sb-details-table-cell sb-details-align-left">
//                   <strong>Net Salary</strong>
//                 </td>
//                 <td className="sb-details-table-cell sb-details-align-left">N/A</td>
//                 <td className="sb-details-table-cell sb-details-align-right">
//                   <strong>₹{parseFloat(activeTab === 'yearly' ? netSalaryYearly : netSalaryMonthly).toLocaleString()}</strong>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsTab;

import React from "react";
import "./DetailsTab.css";

const DetailsTab = ({
  selectedEmployee,
  activeTab,
  setActiveTab,
  handleCloseDetailsTab,
  calculateSalaryDetails,
  employeeLopData,
  overtimeRecords,
  bonusRecords,
  advances,
}) => {
  // Default values as defined in calculateSalaryDetails
  const calculationDefaults = {
    basicSalary: { percentage: "40", type: "percentage" },
    hra: { percentage: "50", type: "percentage" },
    lta: { percentage: "0", type: "percentage" },
    otherAllowance: { percentage: "fill", type: "percentage" },
    variablePay: { percentage: "0", type: "percentage" },
    statutoryBonus: { percentage: "0", type: "percentage" },
    incentives: { amount: "0", type: "amount" },
    professionalTax: { amount: "200", type: "amount" },
    pfEmployee: { percentage: "0", type: "percentage" },
    pfEmployer: { percentage: "0", type: "percentage" },
    esicEmployee: { percentage: "0", type: "percentage" },
    insuranceEmployee: { percentage: "0", type: "percentage" },
    gratuity: { percentage: "4.81", type: "percentage" },
    tds: { percentage: "0", type: "percentage" },
    advanceRecovery: { amount: "0", type: "amount" },
  };

  // Format working days in a human-readable way
  const formatWorkingDays = (workingDays) => {
    if (!workingDays || typeof workingDays !== "object") return "None";
    return Object.entries(workingDays)
      .map(([day, status]) => `${day}: ${status}`)
      .join(", ");
  };

  // Format TDS slabs in a human-readable way
  const formatTdsSlabs = (slabs) => {
    if (!Array.isArray(slabs) || slabs.length === 0) return "None";
    return slabs
      .map(
        (slab) =>
          `From ₹${slab.from || "0"} to ₹${slab.to || "∞"}: ${
            slab.percentage || "0"
          }%`
      )
      .join("; ");
  };

  // Calculate salary details
  const salaryDetails = calculateSalaryDetails(
    selectedEmployee.ctc,
    selectedEmployee.plan_data,
    selectedEmployee.employee_id,
    overtimeRecords,
    bonusRecords,
    advances
  );

  // LOP data
  const lopData = employeeLopData[selectedEmployee.employee_id] || {
    currentMonth: { days: 0, value: "0.00", currency: "INR" },
    deferred: { days: 0, value: "0.00", currency: "INR" },
    nextMonth: { days: 0, value: "0.00", currency: "INR" },
    yearly: { days: 0, value: "0.00", currency: "INR" },
  };

  // Validation checks
  if (!salaryDetails || !selectedEmployee.employee_id) {
    return <p>No valid employee data provided</p>;
  }
  if (!selectedEmployee.ctc || selectedEmployee.ctc <= 0) {
    return <p>No valid CTC provided for this employee</p>;
  }

  const planData = selectedEmployee.plan_data || {};
  const monthlyCTC = selectedEmployee.ctc ? selectedEmployee.ctc / 12 : 0;

  // Capitalize calculation base for display
  const formatCalculationBase = (base) => {
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
  };

  // Define salary components
  const components = [
    {
      label: "Basic Salary",
      planDetail:
        planData.isBasicSalary &&
        planData.basicSalaryType === "percentage" &&
        planData.basicSalary
          ? `${planData.basicSalary}% of CTC`
          : planData.isBasicSalary &&
            planData.basicSalaryType === "amount" &&
            planData.basicSalaryAmount
          ? `₹${parseFloat(planData.basicSalaryAmount).toLocaleString()}`
          : `${calculationDefaults.basicSalary.percentage}% of CTC (default)`,
      yearly: salaryDetails.basicSalary * 12,
      monthly: salaryDetails.basicSalary,
      isDeduction: false,
    },
    {
      label: "HRA",
      planDetail:
        planData.isHouseRentAllowance &&
        planData.houseRentAllowanceType === "percentage" &&
        planData.houseRentAllowance
          ? `${planData.houseRentAllowance}% of Basic`
          : planData.isHouseRentAllowance &&
            planData.houseRentAllowanceType === "amount" &&
            planData.houseRentAllowanceAmount
          ? `₹${parseFloat(planData.houseRentAllowanceAmount).toLocaleString()}`
          : `${calculationDefaults.hra.percentage}% of Basic (default)`,
      yearly: salaryDetails.hra * 12,
      monthly: salaryDetails.hra,
      isDeduction: false,
    },
    {
      label: "LTA Allowance",
      planDetail:
        planData.isLtaAllowance &&
        planData.ltaAllowanceType === "percentage" &&
        planData.ltaAllowance
          ? `${planData.ltaAllowance}% of CTC`
          : planData.isLtaAllowance &&
            planData.ltaAllowanceType === "amount" &&
            planData.ltaAllowanceAmount
          ? `₹${parseFloat(planData.ltaAllowanceAmount).toLocaleString()}`
          : `${calculationDefaults.lta.percentage}% of CTC (default)`,
      yearly: salaryDetails.ltaAllowance * 12,
      monthly: salaryDetails.ltaAllowance,
      isDeduction: false,
    },
    {
      label: "Other Allowances",
      planDetail:
        planData.isOtherAllowance &&
        planData.otherAllowanceType === "percentage" &&
        planData.otherAllowance
          ? `${planData.otherAllowance}% of CTC`
          : planData.isOtherAllowance &&
            planData.otherAllowanceType === "amount" &&
            planData.otherAllowanceAmount
          ? `₹${parseFloat(planData.otherAllowanceAmount).toLocaleString()}`
          : salaryDetails.otherAllowances > 0 && monthlyCTC > 0
          ? `${((salaryDetails.otherAllowances / monthlyCTC) * 100).toFixed(
              2
            )}% of CTC (calculated)`
          : `${calculationDefaults.otherAllowance.percentage}% of CTC (default)`,
      yearly: salaryDetails.otherAllowances * 12,
      monthly: salaryDetails.otherAllowances,
      isDeduction: false,
    },
    {
      label: "Incentives",
      planDetail:
        planData.isIncentives &&
        planData.incentivesType === "amount" &&
        planData.incentivesAmount
          ? `₹${parseFloat(planData.incentivesAmount).toLocaleString()}`
          : planData.isIncentives &&
            planData.incentivesType === "percentage" &&
            planData.incentives
          ? `${planData.incentives}% of CTC`
          : `${calculationDefaults.incentives.amount} (default)`,
      yearly: null, // Set to null to match table's N/A
      monthly: salaryDetails.incentives,
      isDeduction: false,
    },
    {
      label: "Overtime Pay",
      planDetail:
        planData.isOvertimePay && planData.overtimePayAmount
          ? `₹${parseFloat(planData.overtimePayAmount).toLocaleString()}/hour`
          : "None (default)",
      yearly: salaryDetails.overtimePay * 12,
      monthly: salaryDetails.overtimePay,
      isDeduction: false,
    },
    {
      label: "Bonus",
      planDetail:
        planData.isStatutoryBonus &&
        planData.statutoryBonusType === "percentage" &&
        planData.statutoryBonusPercentage
          ? `${planData.statutoryBonusPercentage}% of CTC`
          : planData.isStatutoryBonus &&
            planData.statutoryBonusType === "amount" &&
            planData.statutoryBonusAmount
          ? `₹${parseFloat(planData.statutoryBonusAmount).toLocaleString()}`
          : `${calculationDefaults.statutoryBonus.percentage}% of CTC (default)`,
      yearly: salaryDetails.bonusPay * 12,
      monthly: salaryDetails.bonusPay,
      isDeduction: false,
    },
    {
      label: "Advance Recovery",
      planDetail: `${calculationDefaults.advanceRecovery.amount} (default)`,
      yearly: salaryDetails.advanceRecovery * 12,
      monthly: salaryDetails.advanceRecovery,
      isDeduction: true,
    },
    {
      label: "Employee PF",
      planDetail:
        planData.isPFApplicable &&
        planData.isPFEmployee &&
        planData.pfEmployeeType === "percentage" &&
        planData.pfEmployeePercentage
          ? `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
              planData.pfCalculationBase
            )}`
          : planData.isPFApplicable &&
            planData.isPFEmployee &&
            planData.pfEmployeeType === "amount" &&
            planData.pfEmployeeAmount
          ? `₹${parseFloat(planData.pfEmployeeAmount).toLocaleString()}`
          : `${calculationDefaults.pfEmployee.percentage}% of Basic (default)`,
      yearly: salaryDetails.employeePF * 12,
      monthly: salaryDetails.employeePF,
      isDeduction: true,
    },
    {
      label: "Employer PF",
      planDetail:
        planData.isPFApplicable &&
        planData.isPFEmployer &&
        planData.pfEmployerType === "percentage" &&
        planData.pfEmployerPercentage
          ? `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
              planData.pfCalculationBase
            )}`
          : planData.isPFApplicable &&
            planData.isPFEmployer &&
            planData.pfEmployerType === "amount" &&
            planData.pfEmployerAmount
          ? `₹${parseFloat(planData.pfEmployerAmount).toLocaleString()}`
          : `${calculationDefaults.pfEmployer.percentage}% of Basic (default)`,
      yearly: salaryDetails.employerPF * 12,
      monthly: salaryDetails.employerPF,
      isDeduction: true,
    },
    {
      label: "ESIC",
      planDetail:
        planData.isMedicalApplicable &&
        planData.isESICEmployee &&
        planData.esicEmployeeType === "percentage" &&
        planData.esicEmployeePercentage
          ? `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
              planData.medicalCalculationBase
            )}`
          : planData.isMedicalApplicable &&
            planData.isESICEmployee &&
            planData.esicEmployeeType === "amount" &&
            planData.esicEmployeeAmount
          ? `₹${parseFloat(planData.esicEmployeeAmount).toLocaleString()}`
          : `${calculationDefaults.esicEmployee.percentage}% of Basic (default)`,
      yearly: salaryDetails.esic * 12,
      monthly: salaryDetails.esic,
      isDeduction: true,
    },
    {
      label: "Gratuity",
      planDetail:
        planData.isGratuityApplicable &&
        planData.gratuityType === "percentage" &&
        planData.gratuityPercentage
          ? `${planData.gratuityPercentage}% of Basic`
          : planData.isGratuityApplicable &&
            planData.gratuityType === "amount" &&
            planData.gratuityAmount
          ? `₹${parseFloat(planData.gratuityAmount).toLocaleString()}`
          : `${calculationDefaults.gratuity.percentage}% of Basic (default)`,
      yearly: salaryDetails.gratuity * 12,
      monthly: salaryDetails.gratuity,
      isDeduction: true,
    },
    {
      label: "Professional Tax",
      planDetail:
        planData.isProfessionalTax &&
        planData.professionalTaxType === "percentage" &&
        planData.professionalTax
          ? `${planData.professionalTax}% of CTC`
          : planData.isProfessionalTax &&
            planData.professionalTaxType === "amount" &&
            planData.professionalTaxAmount
          ? `₹${parseFloat(planData.professionalTaxAmount).toLocaleString()}`
          : monthlyCTC <= 15000
          ? `₹0 (default)`
          : `₹${calculationDefaults.professionalTax.amount} (default)`,
      yearly: salaryDetails.professionalTax * 12,
      monthly: salaryDetails.professionalTax,
      isDeduction: true,
    },
    {
      label: "TDS",
      planDetail: (() => {
        if (
          planData.isTDSApplicable &&
          Array.isArray(planData.tdsSlabs) &&
          planData.tdsSlabs.length > 0
        ) {
          return formatTdsSlabs(planData.tdsSlabs);
        }
        return `${calculationDefaults.tds.percentage}% (default)`;
      })(),
      yearly: salaryDetails.tds * 12,
      monthly: salaryDetails.tds,
      isDeduction: true,
    },
    {
      label: "Insurance",
      planDetail:
        planData.isMedicalApplicable &&
        planData.isInsuranceEmployee &&
        planData.insuranceEmployeeType === "percentage" &&
        planData.insuranceEmployeePercentage
          ? `${
              planData.insuranceEmployeePercentage
            }% of ${formatCalculationBase(planData.medicalCalculationBase)}`
          : planData.isMedicalApplicable &&
            planData.isInsuranceEmployee &&
            planData.insuranceEmployeeType === "amount" &&
            planData.insuranceEmployeeAmount
          ? `₹${parseFloat(planData.insuranceEmployeeAmount).toLocaleString()}`
          : `${calculationDefaults.insuranceEmployee.percentage}% of Basic (default)`,
      yearly: salaryDetails.insurance * 12,
      monthly: salaryDetails.insurance,
      isDeduction: true,
    },
    {
      label: "LOP Deduction",
      planDetail:
        lopData && lopData.currentMonth.days > 0
          ? `${lopData.currentMonth.days} day${
              lopData.currentMonth.days > 1 ? "s" : ""
            }`
          : "None (default)",
      yearly: lopData ? parseFloat(lopData.yearly.value) : 0,
      monthly: lopData ? parseFloat(lopData.currentMonth.value) : 0,
      isDeduction: true,
    },
    {
      label: "Default Working Hours",
      planDetail:
        planData.isDefaultWorkingHours && planData.defaultWorkingHours
          ? `${planData.defaultWorkingHours} hours`
          : "None",
      yearly: null,
      monthly: null,
      isDeduction: false,
    },
    {
      label: "Default Working Days",
      planDetail:
        planData.isDefaultWorkingDays && planData.defaultWorkingDays
          ? formatWorkingDays(planData.defaultWorkingDays)
          : "None",
      yearly: null,
      monthly: null,
      isDeduction: false,
    },
  ];

  // Calculate totals
  const totalEarningsMonthly = components
    .filter((comp) => !comp.isDeduction && comp.monthly !== null)
    .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
  const totalDeductionsMonthly = components
    .filter((comp) => comp.isDeduction && comp.monthly !== null)
    .reduce((sum, comp) => sum + (comp.monthly || 0), 0);
  const netSalaryMonthly = totalEarningsMonthly - totalDeductionsMonthly;
  const totalEarningsYearly = components
    .filter((comp) => !comp.isDeduction && comp.yearly !== null)
    .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
  const totalDeductionsYearly = components
    .filter((comp) => comp.isDeduction && comp.yearly !== null)
    .reduce((sum, comp) => sum + (comp.yearly || 0), 0);
  const netSalaryYearly = totalEarningsYearly - totalDeductionsYearly;

  return (
    <div className="sb-details-tab">
      <div className="sb-details-tab-header">
        <h2>Salary Details</h2>
        <button
          className="sb-details-tab-close"
          onClick={handleCloseDetailsTab}
        >
          ×
        </button>
      </div>
      <div className="sb-details-tab-content">
        <div className="sb-details-employee-name">
          {selectedEmployee.full_name || "N/A"}
        </div>
        <div className="sb-details-ctc-info">
          <div>
            <strong>Comp. Plan:</strong>{" "}
            {selectedEmployee.compensation_plan_name || "N/A"}
          </div>
          <div>
            <strong>CTC (Yearly):</strong> ₹
            {selectedEmployee.ctc
              ? parseFloat(selectedEmployee.ctc).toLocaleString()
              : "N/A"}
          </div>
          <div>
            <strong>CTC (Monthly):</strong> ₹
            {selectedEmployee.ctc
              ? (parseFloat(selectedEmployee.ctc) / 12).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )
              : "N/A"}
          </div>
        </div>
        <div className="sb-details-tab-buttons">
          <button
            className={`sb-details-tab-button yearly ${
              activeTab === "yearly" ? "active" : ""
            }`}
            onClick={() => setActiveTab("yearly")}
          >
            Yearly
          </button>
          <button
            className={`sb-details-tab-button monthly ${
              activeTab === "monthly" ? "active" : ""
            }`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>
        </div>
        <div className="sb-details-tab-details">
          <table className="sb-details-table">
            <thead>
              <tr>
                <th className="sb-details-table-header sb-details-align-left">
                  Component
                </th>
                <th className="sb-details-table-header sb-details-align-left">
                  Comp. Plan
                </th>
                <th className="sb-details-table-header sb-details-align-right">
                  {activeTab === "yearly" ? "Yearly Amount" : "Monthly Amount"}
                </th>
              </tr>
            </thead>
            <tbody className="sb-details-table-body-wrapper">
              {components.map((item, index) => (
                <tr
                  key={index}
                  className={item.isDeduction ? "sb-details-deduction-row" : ""}
                >
                  <td className="sb-details-table-cell sb-details-align-left">
                    {item.label}
                  </td>
                  <td className="sb-details-table-cell sb-details-align-left">
                    {item.planDetail}
                  </td>
                  <td className="sb-details-table-cell sb-details-align-right">
                    {(activeTab === "yearly" ? item.yearly : item.monthly) !=
                      null &&
                    (activeTab === "yearly" ? item.yearly : item.monthly) > 0
                      ? `₹${parseFloat(
                          activeTab === "yearly" ? item.yearly : item.monthly
                        ).toLocaleString()}`
                      : "N/A"}
                  </td>
                </tr>
              ))}
              <tr className="sb-details-total-row">
                <td className="sb-details-table-cell sb-details-align-left">
                  <strong>Earnings</strong>
                </td>
                <td className="sb-details-table-cell sb-details-align-left">
                  N/A
                </td>
                <td className="sb-details-table-cell sb-details-align-right">
                  <strong>
                    ₹
                    {parseFloat(
                      activeTab === "yearly"
                        ? totalEarningsYearly
                        : totalEarningsMonthly
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
              <tr className="sb-details-total-row">
                <td className="sb-details-table-cell sb-details-align-left">
                  <strong>Deductions</strong>
                </td>
                <td className="sb-details-table-cell sb-details-align-left">
                  N/A
                </td>
                <td className="sb-details-table-cell sb-details-align-right">
                  <strong>
                    ₹
                    {parseFloat(
                      activeTab === "yearly"
                        ? totalDeductionsYearly
                        : totalDeductionsMonthly
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
              <tr className="sb-details-total-row">
                <td className="sb-details-table-cell sb-details-align-left">
                  <strong>Gross Salary</strong>
                </td>
                <td className="sb-details-table-cell sb-details-align-left">
                  N/A
                </td>
                <td className="sb-details-table-cell sb-details-align-right">
                  <strong>
                    ₹
                    {parseFloat(
                      activeTab === "yearly"
                        ? salaryDetails.grossSalary * 12
                        : salaryDetails.grossSalary
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
              <tr className="sb-details-total-row">
                <td className="sb-details-table-cell sb-details-align-left">
                  <strong>Net Salary</strong>
                </td>
                <td className="sb-details-table-cell sb-details-align-left">
                  N/A
                </td>
                <td className="sb-details-table-cell sb-details-align-right">
                  <strong>
                    ₹
                    {parseFloat(
                      activeTab === "yearly"
                        ? netSalaryYearly
                        : netSalaryMonthly
                    ).toLocaleString()}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
