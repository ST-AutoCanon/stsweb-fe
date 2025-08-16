
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './createCompensation.css';
// import { FaEye, FaPencilAlt } from 'react-icons/fa';
// import Modal from '../Modal/Modal';

// const API_KEY = process.env.REACT_APP_API_KEY;

// const CreateCompensation = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingCompensationId, setEditingCompensationId] = useState(null);
//   const [previewModal, setPreviewModal] = useState(false);
//   const [formData, setFormData] = useState({
//     compensationPlanName: '',
//     isPFApplicable: false,
//     pfPercentage: '',
//     pfAmount: '',
//     pfType: 'percentage',
//     isPFEmployer: false,
//     pfEmployerPercentage: '',
//     pfEmployerAmount: '',
//     pfEmployerType: 'percentage',
//     isPFEmployee: false,
//     pfEmployeePercentage: '',
//     pfEmployeeAmount: '',
//     pfEmployeeType: 'percentage',
//     isMedicalApplicable: false,
//     isESICEmployee: false,
//     esicEmployeePercentage: '',
//     esicEmployeeAmount: '',
//     esicEmployeeType: 'percentage',
//     isInsuranceEmployee: false,
//     insuranceEmployeePercentage: '',
//     insuranceEmployeeAmount: '',
//     insuranceEmployeeType: 'percentage',
//     isGratuityApplicable: false,
//     gratuityPercentage: '',
//     gratuityAmount: '',
//     gratuityType: 'percentage',
//     isProfessionalTax: false,
//     professionalTax: '',
//     professionalTaxAmount: '',
//     professionalTaxType: 'percentage',
//     isVariablePay: false,
//     variablePay: '',
//     variablePayAmount: '',
//     variablePayType: 'percentage',
//     isStatutoryBonus: false,
//     statutoryBonusPercentage: '',
//     statutoryBonusAmount: '',
//     statutoryBonusType: 'percentage',
//     isBasicSalary: false,
//     basicSalary: '',
//     basicSalaryAmount: '',
//     basicSalaryType: 'amount',
//     isHouseRentAllowance: false,
//     houseRentAllowance: '',
//     houseRentAllowanceAmount: '',
//     houseRentAllowanceType: 'amount',
//     isLtaAllowance: false,
//     ltaAllowance: '',
//     ltaAllowanceAmount: '',
//     ltaAllowanceType: 'amount',
//     isOtherAllowance: false,
//     otherAllowance: '',
//     otherAllowanceAmount: '',
//     otherAllowanceType: 'amount',
//     isStatutoryBonusAmount: false,
//     statutoryBonus: '',
//     statutoryBonusFixedAmount: '',
//     statutoryBonusFixedType: 'amount',
//     isVariablePayAmount: false,
//     variablePayAmount: '',
//     variablePayFixedAmount: '',
//     variablePayFixedType: 'amount',
//     isOvertimePay: false,
//     overtimePayType: 'hourly',
//     overtimePayAmount: '',
//     overtimePayUnits: '',
//     isIncentives: false,
//     incentives: '',
//     incentivesAmount: '',
//     incentivesType: 'amount',
//     isDefaultWorkingHours: false,
//     defaultWorkingHours: '',
//     isDefaultWorkingDays: false,
//     defaultWorkingDays: {
//       Sunday: 'weekOff',
//       Monday: 'fullDay',
//       Tuesday: 'fullDay',
//       Wednesday: 'fullDay',
//       Thursday: 'fullDay',
//       Friday: 'fullDay',
//       Saturday: 'weekOff'
//     },
//     isTDSApplicable: false,
//     tdsFrom: '',
//     tdsTo: '',
//     tdsPercentage: ''
//   });
//   const [compensations, setCompensations] = useState([]);
//   const [alertModal, setAlertModal] = useState({
//     isVisible: false,
//     title: '',
//     message: '',
//   });
//   const [viewExecCompensation, setViewExecCompensation] = useState(null);
//   const [error, setError] = useState('');
//   const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

//   const showAlert = (message, title = '') => {
//     setAlertModal({ isVisible: true, title, message });
//   };

//   const closeAlert = () => {
//     setAlertModal({ isVisible: false, title: '', message: '' });
//   };

//   const togglePopup = () => {
//     setIsPopupOpen(!isPopupOpen);
//     setIsEditing(false);
//     setEditingCompensationId(null);
//     setCurrentStep(1);
//     setFormData({
//       compensationPlanName: '',
//       isPFApplicable: false,
//       pfPercentage: '',
//       pfAmount: '',
//       pfType: 'percentage',
//       isPFEmployer: false,
//       pfEmployerPercentage: '',
//       pfEmployerAmount: '',
//       pfEmployerType: 'percentage',
//       isPFEmployee: false,
//       pfEmployeePercentage: '',
//       pfEmployeeAmount: '',
//       pfEmployeeType: 'percentage',
//       isMedicalApplicable: false,
//       isESICEmployee: false,
//       esicEmployeePercentage: '',
//       esicEmployeeAmount: '',
//       esicEmployeeType: 'percentage',
//       isInsuranceEmployee: false,
//       insuranceEmployeePercentage: '',
//       insuranceEmployeeAmount: '',
//       insuranceEmployeeType: 'percentage',
//       isGratuityApplicable: false,
//       gratuityPercentage: '',
//       gratuityAmount: '',
//       gratuityType: 'percentage',
//       isProfessionalTax: false,
//       professionalTax: '',
//       professionalTaxAmount: '',
//       professionalTaxType: 'percentage',
//       isVariablePay: false,
//       variablePay: '',
//       variablePayAmount: '',
//       variablePayType: 'percentage',
//       isStatutoryBonus: false,
//       statutoryBonusPercentage: '',
//       statutoryBonusAmount: '',
//       statutoryBonusType: 'percentage',
//       isBasicSalary: false,
//       basicSalary: '',
//       basicSalaryAmount: '',
//       basicSalaryType: 'amount',
//       isHouseRentAllowance: false,
//       houseRentAllowance: '',
//       houseRentAllowanceAmount: '',
//       houseRentAllowanceType: 'amount',
//       isLtaAllowance: false,
//       ltaAllowance: '',
//       ltaAllowanceAmount: '',
//       ltaAllowanceType: 'amount',
//       isOtherAllowance: false,
//       otherAllowance: '',
//       otherAllowanceAmount: '',
//       otherAllowanceType: 'amount',
//       isStatutoryBonusAmount: false,
//       statutoryBonus: '',
//       statutoryBonusFixedAmount: '',
//       statutoryBonusFixedType: 'amount',
//       isVariablePayAmount: false,
//       variablePayAmount: '',
//       variablePayFixedAmount: '',
//       variablePayFixedType: 'amount',
//       isOvertimePay: false,
//       overtimePayType: 'hourly',
//       overtimePayAmount: '',
//       overtimePayUnits: '',
//       isIncentives: false,
//       incentives: '',
//       incentivesAmount: '',
//       incentivesType: 'amount',
//       isDefaultWorkingHours: false,
//       defaultWorkingHours: '',
//       isDefaultWorkingDays: false,
//       defaultWorkingDays: {
//         Sunday: 'weekOff',
//         Monday: 'fullDay',
//         Tuesday: 'fullDay',
//         Wednesday: 'fullDay',
//         Thursday: 'fullDay',
//         Friday: 'fullDay',
//         Saturday: 'weekOff'
//       },
//       isTDSApplicable: false,
//       tdsFrom: '',
//       tdsTo: '',
//       tdsPercentage: ''
//     });
//     setError('');
//   };

//   const handleCheckboxChange = (field, value) => {
//     setFormData((prev) => {
//       const newData = { ...prev, [field]: value === 'yes' };
//       if (value !== 'yes') {
//         if (field === 'isPFApplicable') {
//           newData.pfPercentage = '';
//           newData.pfAmount = '';
//           newData.isPFEmployer = false;
//           newData.pfEmployerPercentage = '';
//           newData.pfEmployerAmount = '';
//           newData.isPFEmployee = false;
//           newData.pfEmployeePercentage = '';
//           newData.pfEmployeeAmount = '';
//         }
//         if (field === 'isPFEmployer') {
//           newData.pfEmployerPercentage = '';
//           newData.pfEmployerAmount = '';
//         }
//         if (field === 'isPFEmployee') {
//           newData.pfEmployeePercentage = '';
//           newData.pfEmployeeAmount = '';
//         }
//         if (field === 'isMedicalApplicable') {
//           newData.isESICEmployee = false;
//           newData.esicEmployeePercentage = '';
//           newData.esicEmployeeAmount = '';
//           newData.isInsuranceEmployee = false;
//           newData.insuranceEmployeePercentage = '';
//           newData.insuranceEmployeeAmount = '';
//         }
//         if (field === 'isESICEmployee') {
//           newData.esicEmployeePercentage = '';
//           newData.esicEmployeeAmount = '';
//         }
//         if (field === 'isInsuranceEmployee') {
//           newData.insuranceEmployeePercentage = '';
//           newData.insuranceEmployeeAmount = '';
//         }
//         if (field === 'isGratuityApplicable') {
//           newData.gratuityPercentage = '';
//           newData.gratuityAmount = '';
//         }
//         if (field === 'isProfessionalTax') {
//           newData.professionalTax = '';
//           newData.professionalTaxAmount = '';
//         }
//         if (field === 'isVariablePay') {
//           newData.variablePay = '';
//           newData.variablePayAmount = '';
//         }
//         if (field === 'isStatutoryBonus') {
//           newData.statutoryBonusPercentage = '';
//           newData.statutoryBonusAmount = '';
//         }
//         if (field === 'isBasicSalary') {
//           newData.basicSalary = '';
//           newData.basicSalaryAmount = '';
//         }
//         if (field === 'isHouseRentAllowance') {
//           newData.houseRentAllowance = '';
//           newData.houseRentAllowanceAmount = '';
//         }
//         if (field === 'isLtaAllowance') {
//           newData.ltaAllowance = '';
//           newData.ltaAllowanceAmount = '';
//         }
//         if (field === 'isOtherAllowance') {
//           newData.otherAllowance = '';
//           newData.otherAllowanceAmount = '';
//         }
//         if (field === 'isStatutoryBonusAmount') {
//           newData.statutoryBonus = '';
//           newData.statutoryBonusFixedAmount = '';
//         }
//         if (field === 'isVariablePayAmount') {
//           newData.variablePayAmount = '';
//           newData.variablePayFixedAmount = '';
//         }
//         if (field === 'isOvertimePay') {
//           newData.overtimePayType = 'hourly';
//           newData.overtimePayAmount = '';
//           newData.overtimePayUnits = '';
//         }
//         if (field === 'isIncentives') {
//           newData.incentives = '';
//           newData.incentivesAmount = '';
//         }
//         if (field === 'isDefaultWorkingHours') {
//           newData.defaultWorkingHours = '';
//         }
//         if (field === 'isDefaultWorkingDays') {
//           newData.defaultWorkingDays = {
//             Sunday: 'weekOff',
//             Monday: 'fullDay',
//             Tuesday: 'fullDay',
//             Wednesday: 'fullDay',
//             Thursday: 'fullDay',
//             Friday: 'fullDay',
//             Saturday: 'weekOff'
//           };
//         }
//         if (field === 'isTDSApplicable') {
//           newData.tdsFrom = '';
//           newData.tdsTo = '';
//           newData.tdsPercentage = '';
//         }
//       }
//       return newData;
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleWorkingDayChange = (day, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       defaultWorkingDays: {
//         ...prev.defaultWorkingDays,
//         [day]: value
//       }
//     }));
//   };

//   const fetchCompensations = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`, {
//         headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
//       });
//       if (response.data.success) {
//         const compensations = response.data.data || [];
//         // Fetch working days for each compensation plan
//         const updatedCompensations = await Promise.all(
//           compensations.map(async (comp) => {
//             try {
//               const workingDaysResponse = await axios.get(
//                 `${process.env.REACT_APP_BACKEND_URL}/api/compensations/working-days/${comp.id}`,
//                 {
//                   headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
//                 }
//               );
//               if (workingDaysResponse.data.success && workingDaysResponse.data.data.length > 0) {
//                 const workingDays = workingDaysResponse.data.data[0];
//                 return {
//                   ...comp,
//                   plan_data: {
//                     ...comp.plan_data,
//                     defaultWorkingDays: {
//                       Sunday: workingDays.sunday,
//                       Monday: workingDays.monday,
//                       Tuesday: workingDays.tuesday,
//                       Wednesday: workingDays.wednesday,
//                       Thursday: workingDays.thursday,
//                       Friday: workingDays.friday,
//                       Saturday: workingDays.saturday,
//                     },
//                   },
//                 };
//               }
//               return comp;
//             } catch (error) {
//               console.error(`Error fetching working days for plan ${comp.id}:`, error);
//               return comp;
//             }
//           })
//         );
//         setCompensations(updatedCompensations);
//       } else {
//         throw new Error('Fetch unsuccessful: ' + (response.data.message || 'Unknown error'));
//       }
//     } catch (error) {
//       console.error('Error fetching compensations:', error);
//       showAlert('Failed to fetch compensations: ' + (error.message || 'Network error'));
//     }
//   };

//   useEffect(() => {
//     fetchCompensations();
//   }, []);

//   const handleEdit = (compensation) => {
//     setIsEditing(true);
//     setEditingCompensationId(compensation.id);
//     setFormData({
//       compensationPlanName: compensation.compensation_plan_name || '',
//       isPFApplicable: compensation.plan_data?.isPFApplicable || false,
//       pfPercentage: compensation.plan_data?.pfPercentage || '',
//       pfAmount: compensation.plan_data?.pfAmount || '',
//       pfType: compensation.plan_data?.pfType || 'percentage',
//       isPFEmployer: compensation.plan_data?.isPFEmployer || false,
//       pfEmployerPercentage: compensation.plan_data?.pfEmployerPercentage || '',
//       pfEmployerAmount: compensation.plan_data?.pfEmployerAmount || '',
//       pfEmployerType: compensation.plan_data?.pfEmployerType || 'percentage',
//       isPFEmployee: compensation.plan_data?.isPFEmployee || false,
//       pfEmployeePercentage: compensation.plan_data?.pfEmployeePercentage || '',
//       pfEmployeeAmount: compensation.plan_data?.pfEmployeeAmount || '',
//       pfEmployeeType: compensation.plan_data?.pfEmployeeType || 'percentage',
//       isMedicalApplicable: compensation.plan_data?.isMedicalApplicable || false,
//       isESICEmployee: compensation.plan_data?.isESICEmployee || false,
//       esicEmployeePercentage: compensation.plan_data?.esicEmployeePercentage || '',
//       esicEmployeeAmount: compensation.plan_data?.esicEmployeeAmount || '',
//       esicEmployeeType: compensation.plan_data?.esicEmployeeType || 'percentage',
//       isInsuranceEmployee: compensation.plan_data?.isInsuranceEmployee || false,
//       insuranceEmployeePercentage: compensation.plan_data?.insuranceEmployeePercentage || '',
//       insuranceEmployeeAmount: compensation.plan_data?.insuranceEmployeeAmount || '',
//       insuranceEmployeeType: compensation.plan_data?.insuranceEmployeeType || 'percentage',
//       isGratuityApplicable: compensation.plan_data?.isGratuityApplicable || false,
//       gratuityPercentage: compensation.plan_data?.gratuityPercentage || '',
//       gratuityAmount: compensation.plan_data?.gratuityAmount || '',
//       gratuityType: compensation.plan_data?.gratuityType || 'percentage',
//       isProfessionalTax: compensation.plan_data?.isProfessionalTax || false,
//       professionalTax: compensation.plan_data?.professionalTax || '',
//       professionalTaxAmount: compensation.plan_data?.professionalTaxAmount || '',
//       professionalTaxType: compensation.plan_data?.professionalTaxType || 'percentage',
//       isVariablePay: compensation.plan_data?.isVariablePay || false,
//       variablePay: compensation.plan_data?.variablePay || '',
//       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
//       variablePayType: compensation.plan_data?.variablePayType || 'percentage',
//       isStatutoryBonus: compensation.plan_data?.isStatutoryBonus || false,
//       statutoryBonusPercentage: compensation.plan_data?.statutoryBonusPercentage || '',
//       statutoryBonusAmount: compensation.plan_data?.statutoryBonusAmount || '',
//       statutoryBonusType: compensation.plan_data?.statutoryBonusType || 'percentage',
//       isBasicSalary: compensation.plan_data?.isBasicSalary || false,
//       basicSalary: compensation.plan_data?.basicSalary || '',
//       basicSalaryAmount: compensation.plan_data?.basicSalaryAmount || '',
//       basicSalaryType: compensation.plan_data?.basicSalaryType || 'amount',
//       isHouseRentAllowance: compensation.plan_data?.isHouseRentAllowance || false,
//       houseRentAllowance: compensation.plan_data?.houseRentAllowance || '',
//       houseRentAllowanceAmount: compensation.plan_data?.houseRentAllowanceAmount || '',
//       houseRentAllowanceType: compensation.plan_data?.houseRentAllowanceType || 'amount',
//       isLtaAllowance: compensation.plan_data?.isLtaAllowance || false,
//       ltaAllowance: compensation.plan_data?.ltaAllowance || '',
//       ltaAllowanceAmount: compensation.plan_data?.ltaAllowanceAmount || '',
//       ltaAllowanceType: compensation.plan_data?.ltaAllowanceType || 'amount',
//       isOtherAllowance: compensation.plan_data?.isOtherAllowance || false,
//       otherAllowance: compensation.plan_data?.otherAllowance || '',
//       otherAllowanceAmount: compensation.plan_data?.otherAllowanceAmount || '',
//       otherAllowanceType: compensation.plan_data?.otherAllowanceType || 'amount',
//       isStatutoryBonusAmount: compensation.plan_data?.isStatutoryBonusAmount || false,
//       statutoryBonus: compensation.plan_data?.statutoryBonus || '',
//       statutoryBonusFixedAmount: compensation.plan_data?.statutoryBonusFixedAmount || '',
//       statutoryBonusFixedType: compensation.plan_data?.statutoryBonusFixedType || 'amount',
//       isVariablePayAmount: compensation.plan_data?.isVariablePayAmount || false,
//       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
//       variablePayFixedAmount: compensation.plan_data?.variablePayFixedAmount || '',
//       variablePayFixedType: compensation.plan_data?.variablePayFixedType || 'amount',
//       isOvertimePay: compensation.plan_data?.isOvertimePay || false,
//       overtimePayType: compensation.plan_data?.overtimePayType || 'hourly',
//       overtimePayAmount: compensation.plan_data?.overtimePayAmount || '',
//       overtimePayUnits: compensation.plan_data?.overtimePayUnits || '',
//       isIncentives: compensation.plan_data?.isIncentives || false,
//       incentives: compensation.plan_data?.incentives || '',
//       incentivesAmount: compensation.plan_data?.incentivesAmount || '',
//       incentivesType: compensation.plan_data?.incentivesType || 'amount',
//       isDefaultWorkingHours: compensation.plan_data?.isDefaultWorkingHours || false,
//       defaultWorkingHours: compensation.plan_data?.defaultWorkingHours || '',
//       isDefaultWorkingDays: compensation.plan_data?.isDefaultWorkingDays || false,
//       defaultWorkingDays: compensation.plan_data?.defaultWorkingDays || {
//         Sunday: 'weekOff',
//         Monday: 'fullDay',
//         Tuesday: 'fullDay',
//         Wednesday: 'fullDay',
//         Thursday: 'fullDay',
//         Friday: 'fullDay',
//         Saturday: 'weekOff'
//       },
//       isTDSApplicable: compensation.plan_data?.isTDSApplicable || false,
//       tdsFrom: compensation.plan_data?.tdsFrom || '',
//       tdsTo: compensation.plan_data?.tdsTo || '',
//       tdsPercentage: compensation.plan_data?.tdsPercentage || ''
//     });
//     setIsPopupOpen(true);
//     setCurrentStep(1);
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.compensationPlanName.trim()) {
//       showAlert('Compensation Plan Name is required and cannot be empty');
//       return;
//     }

//     if (formData.isIncentives && !formData.incentivesAmount.trim()) {
//       showAlert('Incentives amount is required when incentives are enabled');
//       return;
//     }

//     if (formData.isDefaultWorkingHours && !formData.defaultWorkingHours.trim()) {
//       showAlert('Default Working Hours is required when enabled');
//       return;
//     }

//     const data = {
//       compensationPlanName: formData.compensationPlanName,
//       formData: {
//         isPFApplicable: formData.isPFApplicable,
//         pfPercentage: formData.pfPercentage,
//         pfAmount: formData.pfAmount,
//         pfType: formData.pfType,
//         isPFEmployer: formData.isPFEmployer,
//         pfEmployerPercentage: formData.pfEmployerPercentage,
//         pfEmployerAmount: formData.pfEmployerAmount,
//         pfEmployerType: formData.pfEmployerType,
//         isPFEmployee: formData.isPFEmployee,
//         pfEmployeePercentage: formData.pfEmployeePercentage,
//         pfEmployeeAmount: formData.pfEmployeeAmount,
//         pfEmployeeType: formData.pfEmployeeType,
//         isMedicalApplicable: formData.isMedicalApplicable,
//         isESICEmployee: formData.isESICEmployee,
//         esicEmployeePercentage: formData.esicEmployeePercentage,
//         esicEmployeeAmount: formData.esicEmployeeAmount,
//         esicEmployeeType: formData.esicEmployeeType,
//         isInsuranceEmployee: formData.isInsuranceEmployee,
//         insuranceEmployeePercentage: formData.insuranceEmployeePercentage,
//         insuranceEmployeeAmount: formData.insuranceEmployeeAmount,
//         insuranceEmployeeType: formData.insuranceEmployeeType,
//         isGratuityApplicable: formData.isGratuityApplicable,
//         gratuityPercentage: formData.gratuityPercentage,
//         gratuityAmount: formData.gratuityAmount,
//         gratuityType: formData.gratuityType,
//         isProfessionalTax: formData.isProfessionalTax,
//         professionalTax: formData.professionalTax,
//         professionalTaxAmount: formData.professionalTaxAmount,
//         professionalTaxType: formData.professionalTaxType,
//         isVariablePay: formData.isVariablePay,
//         variablePay: formData.variablePay,
//         variablePayAmount: formData.variablePayAmount,
//         variablePayType: formData.variablePayType,
//         isStatutoryBonus: formData.isStatutoryBonus,
//         statutoryBonusPercentage: formData.statutoryBonusPercentage,
//         statutoryBonusAmount: formData.statutoryBonusAmount,
//         statutoryBonusType: formData.statutoryBonusType,
//         isBasicSalary: formData.isBasicSalary,
//         basicSalary: formData.basicSalary,
//         basicSalaryAmount: formData.basicSalaryAmount,
//         basicSalaryType: formData.basicSalaryType,
//         isHouseRentAllowance: formData.isHouseRentAllowance,
//         houseRentAllowance: formData.houseRentAllowance,
//         houseRentAllowanceAmount: formData.houseRentAllowanceAmount,
//         houseRentAllowanceType: formData.houseRentAllowanceType,
//         isLtaAllowance: formData.isLtaAllowance,
//         ltaAllowance: formData.ltaAllowance,
//         ltaAllowanceAmount: formData.ltaAllowanceAmount,
//         ltaAllowanceType: formData.ltaAllowanceType,
//         isOtherAllowance: formData.isOtherAllowance,
//         otherAllowance: formData.otherAllowance,
//         otherAllowanceAmount: formData.otherAllowanceAmount,
//         otherAllowanceType: formData.otherAllowanceType,
//         isStatutoryBonusAmount: formData.isStatutoryBonusAmount,
//         statutoryBonus: formData.statutoryBonus,
//         statutoryBonusFixedAmount: formData.statutoryBonusFixedAmount,
//         statutoryBonusFixedType: formData.statutoryBonusFixedType,
//         isVariablePayAmount: formData.isVariablePayAmount,
//         variablePayAmount: formData.variablePayAmount,
//         variablePayFixedAmount: formData.variablePayFixedAmount,
//         variablePayFixedType: formData.variablePayFixedType,
//         isOvertimePay: formData.isOvertimePay,
//         overtimePayType: formData.overtimePayType,
//         overtimePayAmount: formData.overtimePayAmount,
//         overtimePayUnits: formData.overtimePayUnits,
//         isIncentives: formData.isIncentives,
//         incentives: formData.incentives,
//         incentivesAmount: formData.incentivesAmount,
//         incentivesType: formData.incentivesType,
//         isDefaultWorkingHours: formData.isDefaultWorkingHours,
//         defaultWorkingHours: formData.defaultWorkingHours,
//         isDefaultWorkingDays: formData.isDefaultWorkingDays,
//         defaultWorkingDays: formData.defaultWorkingDays,
//         isTDSApplicable: formData.isTDSApplicable,
//         tdsFrom: formData.tdsFrom,
//         tdsTo: formData.tdsTo,
//         tdsPercentage: formData.tdsPercentage
//       }
//     };

//     try {
//       let response;
//       if (isEditing) {
//         data.id = editingCompensationId;
//         response = await axios.put(
//           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/update/${editingCompensationId}`,
//           data,
//           {
//             headers: {
//               'x-api-key': API_KEY,
//               'x-employee-id': meId,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         showAlert('Compensation updated successfully!');
//       } else {
//         response = await axios.post(
//           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/add`,
//           data,
//           {
//             headers: {
//               'x-api-key': API_KEY,
//               'x-employee-id': meId,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         showAlert('Compensation created successfully!');
//       }
//       togglePopup();
//       fetchCompensations();
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message;
//       showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
//     }
//   };

//   const handleViewPopup = async (planData, planId) => {
//     if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
//       try {
//         let defaultWorkingDays = {
//           Sunday: 'weekOff',
//           Monday: 'fullDay',
//           Tuesday: 'fullDay',
//           Wednesday: 'fullDay',
//           Thursday: 'fullDay',
//           Friday: 'fullDay',
//           Saturday: 'weekOff'
//         };
//         try {
//           const workingDaysResponse = await axios.get(
//             `${process.env.REACT_APP_BACKEND_URL}/api/compensations/working-days/${planId}`,
//             {
//               headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
//             }
//           );
//           if (workingDaysResponse.data.success && workingDaysResponse.data.data.length > 0) {
//             const workingDays = workingDaysResponse.data.data[0];
//             defaultWorkingDays = {
//               Sunday: workingDays.sunday,
//               Monday: workingDays.monday,
//               Tuesday: workingDays.tuesday,
//               Wednesday: workingDays.wednesday,
//               Thursday: workingDays.thursday,
//               Friday: workingDays.friday,
//               Saturday: workingDays.saturday,
//             };
//           } else {
//             console.warn(`No working days found for plan ID ${planId}, using defaults`);
//           }
//         } catch (error) {
//           console.warn(`Failed to fetch working days for plan ID ${planId}:`, error.response?.data?.error || error.message);
//           // Continue with default working days instead of showing an alert
//         }
//         const mappedData = {
//           compensationPlanName: formData.compensationPlanName,
//           isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
//           pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
//           pfAmount: planData.pf_amount || planData.pfAmount || '',
//           pfType: planData.pf_type || planData.pfType || 'percentage',
//           isPFEmployer: planData.is_pf_employer || planData.isPFEmployer || false,
//           pfEmployerPercentage: planData.pf_employer_percentage || planData.pfEmployerPercentage || '',
//           pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
//           pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'percentage',
//           isPFEmployee: planData.is_pf_employee || planData.isPFEmployee || false,
//           pfEmployeePercentage: planData.pf_employee_percentage || planData.pfEmployeePercentage || '',
//           pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
//           pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
//           isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
//           isESICEmployee: planData.is_esic_employee || planData.isESICEmployee || false,
//           esicEmployeePercentage: planData.esic_employee_percentage || planData.esicEmployeePercentage || '',
//           esicEmployeeAmount: planData.esic_employee_amount || planData.esicEmployeeAmount || '',
//           esicEmployeeType: planData.esic_employee_type || planData.esicEmployeeType || 'percentage',
//           isInsuranceEmployee: planData.is_insurance_employee || planData.isInsuranceEmployee || false,
//           insuranceEmployeePercentage: planData.insurance_employee_percentage || planData.insuranceEmployeePercentage || '',
//           insuranceEmployeeAmount: planData.insurance_employee_amount || planData.insuranceEmployeeAmount || '',
//           insuranceEmployeeType: planData.insurance_employee_type || planData.insuranceEmployeeType || 'percentage',
//           isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
//           gratuityPercentage: planData.gratuity_percentage || planData.gratuityPercentage || '',
//           gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
//           gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
//           isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
//           professionalTax: planData.professional_tax || planData.professionalTax || '',
//           professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
//           professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
//           isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
//           variablePay: planData.variable_pay || planData.variablePay || '',
//           variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
//           variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
//           isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
//           statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
//           statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
//           statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
//           isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
//           basicSalary: planData.basic_salary || planData.basicSalary || '',
//           basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
//           basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
//           isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
//           houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
//           houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
//           houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
//           isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
//           ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
//           ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
//           ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
//           isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
//           otherAllowance: planData.other_allowance || planData.otherAllowance || '',
//           otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
//           otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
//           isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
//           statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
//           statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
//           statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
//           isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
//           variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
//           variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
//           variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
//           isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
//           overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
//           overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
//           overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
//           isIncentives: planData.is_incentives || planData.isIncentives || false,
//           incentives: planData.incentives || '',
//           incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
//           incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
//           isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
//           defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || '',
//           isDefaultWorkingDays: planData.is_default_working_days || planData.isDefaultWorkingDays || false,
//           defaultWorkingDays: defaultWorkingDays,
//           isTDSApplicable: planData.is_tds_applicable || planData.isTDSApplicable || false,
//           tdsFrom: planData.tds_from || planData.tdsFrom || '',
//           tdsTo: planData.tds_to || planData.tdsTo || '',
//           tdsPercentage: planData.tds_percentage || planData.tdsPercentage || ''
//         };
//         setViewExecCompensation(mappedData);
//       } catch (error) {
//         console.error('Error processing compensation details:', error);
//         showAlert('Failed to display compensation details: Invalid data format');
//       }
//     } else {
//       showAlert('Failed to display compensation details: Invalid data format');
//     }
//   };

//   const handlePreview = () => {
//     setPreviewModal(true);
//   };

//   const closePreview = () => {
//     setPreviewModal(false);
//   };

//   const formatFieldName = (key) => {
//     return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
//   };

//   const handleStepChange = (step) => {
//     const newStep = Math.max(1, Math.min(step, categories.length));
//     setCurrentStep(newStep);
//   };

//   const renderCategoryField = ({ label, field, percentageField, amountField, typeField, required = false }) => (
//     <div key={field} className="compensation-form-group">
//       <span className="compensation-label-text">
//         {label} {required && <span style={{ color: 'red' }}>*</span>}
//       </span>
//       <div className="compensation-checkbox-group">
//         <label className="compensation-checkbox-label">
//           <input
//             type="checkbox"
//             checked={formData[field]}
//             onChange={() => handleCheckboxChange(field, 'yes')}
//             className="compensation-checkbox"
//           />
//           <span>Yes</span>
//         </label>
//         <label className="compensation-checkbox-label">
//           <input
//             type="checkbox"
//             checked={!formData[field] && formData[field] !== undefined}
//             onChange={() => handleCheckboxChange(field, 'no')}
//             className="compensation-checkbox"
//           />
//           <span>No</span>
//         </label>
//       </div>
//       {formData[field] && percentageField && amountField && typeField && (
//         <div className="compensation-input-group">
//           <select
//             value={formData[typeField]}
//             onChange={(e) => handleInputChange(typeField, e.target.value)}
//             className="compensation-select"
//           >
//             <option value="percentage">Percentage</option>
//             <option value="amount">Fixed Amount</option>
//           </select>
//           {formData[typeField] === 'percentage' ? (
//             <input
//               type="number"
//               placeholder="Percentage"
//               value={formData[percentageField]}
//               onChange={(e) => handleInputChange(percentageField, e.target.value)}
//               className="compensation-percentage-input"
//               required={required}
//             />
//           ) : (
//             <input
//               type="number"
//               placeholder="Amount"
//               value={formData[amountField]}
//               onChange={(e) => handleInputChange(amountField, e.target.value)}
//               className="compensation-number-input"
//               required={required}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );

//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const dayRows = [
//     daysOfWeek.slice(0, 2), // Sunday, Monday
//     daysOfWeek.slice(2, 4), // Tuesday, Wednesday
//     daysOfWeek.slice(4, 6), // Thursday, Friday
//     daysOfWeek.slice(6)     // Saturday
//   ];

//   const slabOptions = [
//     { value: '100000', label: '1 Lac' },
//     { value: '200000', label: '2 Lac' },
//     { value: '300000', label: '3 Lac' },
//     { value: '400000', label: '4 Lac' },
//     { value: '500000', label: '5 Lac' },
//     { value: '600000', label: '6 Lac' },
//     { value: '700000', label: '7 Lac' },
//     { value: '800000', label: '8 Lac' },
//     { value: '900000', label: '9 Lac' },
//     { value: '1000000', label: '10 Lac' }
//   ];

//   const categories = [
//     {
//       title: 'Plan Details',
//       fields: [
//         {
//           component: (
//             <div className="compensation-form-group">
//               <span className="compensation-label-text">Compensation Plan Name <span style={{ color: 'red' }}>*</span></span>
//               <input
//                 type="text"
//                 placeholder="Enter Plan Name"
//                 value={formData.compensationPlanName}
//                 onChange={(e) => handleInputChange('compensationPlanName', e.target.value)}
//                 className="compensation-highlighted-input"
//                 required
//               />
//             </div>
//           )
//         },
//         {
//           component: (
//             <div className="compensation-form-group">
//               <span className="compensation-label-text">
//                 Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: 'red' }}>*</span>
//               </span>
//               <div className="compensation-checkbox-group">
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={formData.isDefaultWorkingHours}
//                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'yes')}
//                     className="compensation-checkbox"
//                   />
//                   <span>Yes</span>
//                 </label>
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={!formData.isDefaultWorkingHours && formData.isDefaultWorkingHours !== undefined}
//                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'no')}
//                     className="compensation-checkbox"
//                   />
//                   <span>No</span>
//                 </label>
//               </div>
//               {formData.isDefaultWorkingHours && (
//                 <div className="compensation-input-group">
//                   <input
//                     type="number"
//                     placeholder="Hours"
//                     value={formData.defaultWorkingHours}
//                     onChange={(e) => handleInputChange('defaultWorkingHours', e.target.value)}
//                     className="compensation-number-input"
//                     required
//                   />
//                 </div>
//               )}
//             </div>
//           )
//         },
//         {
//           component: (
//             <div className="compensation-form-group">
//               <span className="compensation-label-text">Default Working Days</span>
//               <div className="compensation-checkbox-group">
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={formData.isDefaultWorkingDays}
//                     onChange={() => handleCheckboxChange('isDefaultWorkingDays', 'yes')}
//                     className="compensation-checkbox"
//                   />
//                   <span>Yes</span>
//                 </label>
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={!formData.isDefaultWorkingDays && formData.isDefaultWorkingDays !== undefined}
//                     onChange={() => handleCheckboxChange('isDefaultWorkingDays', 'no')}
//                     className="compensation-checkbox"
//                   />
//                   <span>No</span>
//                 </label>
//               </div>
//               {formData.isDefaultWorkingDays && (
//                 <div className="compensation-working-days-container">
//                   {dayRows.map((row, rowIndex) => (
//                     <div key={rowIndex} className="working-day-row">
//                       {row.map((day) => (
//                         <div key={day} className="working-day-selector">
//                           <span className="working-day-label">{day}</span>
//                           <select
//                             value={formData.defaultWorkingDays[day]}
//                             onChange={(e) => handleWorkingDayChange(day, e.target.value)}
//                             className="compensation-select"
//                           >
//                             <option value="fullDay">Full Day</option>
//                             <option value="halfDay">Half Day</option>
//                             <option value="weekOff">Week Off</option>
//                           </select>
//                         </div>
//                       ))}
//                       {row.length < 2 && <div className="working-day-selector-placeholder"></div>}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )
//         }
//       ]
//     },
//     {
//       title: 'PF and Medical Contributions',
//       fields: [
//         {
//           label: 'PF Applicable',
//           field: 'isPFApplicable',
//           percentageField: 'pfPercentage',
//           amountField: 'pfAmount',
//           typeField: 'pfType',
//         },
//         ...(formData.isPFApplicable ? [
//           {
//             label: 'PF of Employee',
//             field: 'isPFEmployee',
//             percentageField: 'pfEmployeePercentage',
//             amountField: 'pfEmployeeAmount',
//             typeField: 'pfEmployeeType',
//           },
//           {
//             label: 'PF of Employer',
//             field: 'isPFEmployer',
//             percentageField: 'pfEmployerPercentage',
//             amountField: 'pfEmployerAmount',
//             typeField: 'pfEmployerType',
//           }
//         ] : []),
//         {
//           label: 'Medical Applicable',
//           field: 'isMedicalApplicable',
//           percentageField: '',
//           amountField: '',
//           typeField: '',
//         },
//         ...(formData.isMedicalApplicable ? [
//           {
//             label: 'ESIC of Employee',
//             field: 'isESICEmployee',
//             percentageField: 'esicEmployeePercentage',
//             amountField: 'esicEmployeeAmount',
//             typeField: 'esicEmployeeType',
//           },
//           {
//             label: 'Insurance of Employee',
//             field: 'isInsuranceEmployee',
//             percentageField: 'insuranceEmployeePercentage',
//             amountField: 'insuranceEmployeeAmount',
//             typeField: 'insuranceEmployeeType',
//           }
//         ] : []),
//         {
//           component: (
//             <div className="compensation-form-group">
//               <span className="compensation-label-text">TDS Applicable</span>
//               <div className="compensation-checkbox-group">
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={formData.isTDSApplicable}
//                     onChange={() => handleCheckboxChange('isTDSApplicable', 'yes')}
//                     className="compensation-checkbox"
//                   />
//                   <span>Yes</span>
//                 </label>
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={!formData.isTDSApplicable && formData.isTDSApplicable !== undefined}
//                     onChange={() => handleCheckboxChange('isTDSApplicable', 'no')}
//                     className="compensation-checkbox"
//                   />
//                   <span>No</span>
//                 </label>
//               </div>
//               {formData.isTDSApplicable && (
//                 <div className="compensation-input-group">
//                   <select
//                     value={formData.tdsFrom}
//                     onChange={(e) => handleInputChange('tdsFrom', e.target.value)}
//                     className="compensation-select"
//                   >
//                     <option value="">From Amount</option>
//                     {slabOptions.map(option => (
//                       <option key={option.value} value={option.value}>{option.label}</option>
//                     ))}
//                   </select>
//                   <select
//                     value={formData.tdsTo}
//                     onChange={(e) => handleInputChange('tdsTo', e.target.value)}
//                     className="compensation-select"
//                   >
//                     <option value="">To Amount</option>
//                     {slabOptions.map(option => (
//                       <option key={option.value} value={option.value}>{option.label}</option>
//                     ))}
//                   </select>
//                   <input
//                     type="number"
//                     placeholder="Percentage"
//                     value={formData.tdsPercentage}
//                     onChange={(e) => handleInputChange('tdsPercentage', e.target.value)}
//                     className="compensation-number-input"
//                   />
//                 </div>
//               )}
//             </div>
//           )
//         }
//       ]
//     },
//     {
//       title: 'Allowances',
//       fields: [
//         {
//           label: 'Basic Salary',
//           field: 'isBasicSalary',
//           percentageField: 'basicSalary',
//           amountField: 'basicSalaryAmount',
//           typeField: 'basicSalaryType',
//         },
//         {
//           label: 'House Rent Allowance',
//           field: 'isHouseRentAllowance',
//           percentageField: 'houseRentAllowance',
//           amountField: 'houseRentAllowanceAmount',
//           typeField: 'houseRentAllowanceType',
//         },
//         {
//           label: 'LTA Allowance',
//           field: 'isLtaAllowance',
//           percentageField: 'ltaAllowance',
//           amountField: 'ltaAllowanceAmount',
//           typeField: 'ltaAllowanceType',
//         },
//         {
//           label: 'Other Allowance',
//           field: 'isOtherAllowance',
//           percentageField: 'otherAllowance',
//           amountField: 'otherAllowanceAmount',
//           typeField: 'otherAllowanceType',
//         },
//       ]
//     },
//     {
//       title: 'Statutory Components',
//       fields: [
//         {
//           label: 'Gratuity Applicable',
//           field: 'isGratuityApplicable',
//           percentageField: 'gratuityPercentage',
//           amountField: 'gratuityAmount',
//           typeField: 'gratuityType',
//         },
//         {
//           label: 'Professional Tax (Monthly)',
//           field: 'isProfessionalTax',
//           percentageField: 'professionalTax',
//           amountField: 'professionalTaxAmount',
//           typeField: 'professionalTaxType',
//         },
//         {
//           label: 'Variable Pay / Bonus (Yearly)',
//           field: 'isVariablePay',
//           percentageField: 'variablePay',
//           amountField: 'variablePayAmount',
//           typeField: 'variablePayType',
//         },
//         {
//           label: 'Statutory Bonus',
//           field: 'isStatutoryBonus',
//           percentageField: 'statutoryBonusPercentage',
//           amountField: 'statutoryBonusAmount',
//           typeField: 'statutoryBonusType',
//         },
//         {
//           label: 'Incentives',
//           field: 'isIncentives',
//           percentageField: 'incentives',
//           amountField: 'incentivesAmount',
//           typeField: 'incentivesType',
//           required: true,
//         },
//         {
//           component: (
//             <div className="compensation-form-group">
//               <span className="compensation-label-text">Overtime Pay</span>
//               <div className="compensation-checkbox-group">
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={formData.isOvertimePay}
//                     onChange={() => handleCheckboxChange('isOvertimePay', 'yes')}
//                     className="compensation-checkbox"
//                   />
//                   <span>Yes</span>
//                 </label>
//                 <label className="compensation-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={!formData.isOvertimePay && formData.isOvertimePay !== undefined}
//                     onChange={() => handleCheckboxChange('isOvertimePay', 'no')}
//                     className="compensation-checkbox"
//                   />
//                   <span>No</span>
//                 </label>
//               </div>
//               {formData.isOvertimePay && (
//                 <div className="compensation-input-group">
//                   <select
//                     value={formData.overtimePayType}
//                     onChange={(e) => handleInputChange('overtimePayType', e.target.value)}
//                     className="compensation-select"
//                   >
//                     <option value="hourly">Hourly</option>
//                     <option value="daily">Daily</option>
//                     <option value="per unit">Per Unit</option>
//                   </select>
//                   <input
//                     type="number"
//                     placeholder={formData.overtimePayType === 'hourly' ? 'Rate per Hour' : formData.overtimePayType === 'daily' ? 'Rate per Day' : 'Rate per Unit'}
//                     value={formData.overtimePayAmount}
//                     onChange={(e) => handleInputChange('overtimePayAmount', e.target.value)}
//                     className="compensation-number-input"
//                   />
//                   <input
//                     type="number"
//                     placeholder={formData.overtimePayType === 'hourly' ? 'Hours' : formData.overtimePayType === 'daily' ? 'Days' : 'Units'}
//                     value={formData.overtimePayUnits}
//                     onChange={(e) => handleInputChange('overtimePayUnits', e.target.value)}
//                     className="compensation-number-input"
//                   />
//                 </div>
//               )}
//             </div>
//           )
//         },
//       ]
//     }
//   ];

//   return (
//     <div className="compensation-container">
//       <div className="header-container">
//         <button className="compensation-create-button" onClick={togglePopup}>
//           Create Compensation
//         </button>
//       </div>

//       <div className="table-scroll-wrapper">
//         <table className="compensation-table">
//           <thead>
//             <tr className="header-row">
//               <th>ID</th>
//               <th>Compensation Plan Name</th>
//               <th>All Details</th>
//               <th>Last Edited</th>
//               <th>Edit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {compensations.map((comp) => (
//               <tr key={comp.id}>
//                 <td>{comp.id}</td>
//                 <td>{comp.compensation_plan_name}</td>
//                 <td>
//                   <button
//                     className="vendor-view-doc-btn"
//                     onClick={() => handleViewPopup(comp.plan_data, comp.id)}
//                   >
//                     <FaEye size={16} style={{ marginRight: '5px' }} /> View
//                   </button>
//                 </td>
//                 <td>
//                   {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : '-'}
//                 </td>
//                 <td>
//                   <button
//                     className="vendor-edit-btn"
//                     onClick={() => handleEdit(comp)}
//                     title="Edit Compensation"
//                   >
//                     <FaPencilAlt size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isPopupOpen && categories[currentStep - 1] && (
//         <div className="compensation-popup-overlay">
//           <div className="compensation-popup">
//             <div className="compensation-popup-header">
//               <h2>{isEditing ? 'Edit Compensation' : 'Create Compensation'}</h2>
//               <button onClick={togglePopup} className="compensation-close-button">
//                 ×
//               </button>
//             </div>
//             <div className="compensation-progress-bar">
//               {categories.map((category, index) => (
//                 <React.Fragment key={index}>
//                   <div
//                     className={`progress-step ${currentStep === index + 1 ? 'active' : ''}`}
//                     onClick={() => handleStepChange(index + 1)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <span className="step-number">{index + 1}</span>
//                     <span className="step-label">{category.title}</span>
//                   </div>
//                   {index < categories.length - 1 && (
//                     <div className="progress-connector">
//                       <span className="progress-line"></span>
//                       <span className="progress-dot"></span>
//                       <span className="progress-line"></span>
//                     </div>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//             <div className="compensation-popup-content">
//               <div className="compensation-form-section">
//                 <div className="compensation-category">
//                   <h3>{categories[currentStep - 1].title}</h3>
//                   {categories[currentStep - 1].fields.map((field, idx) =>
//                     field.component ? (
//                       <React.Fragment key={idx}>{field.component}</React.Fragment>
//                     ) : (
//                       renderCategoryField(field)
//                     )
//                   )}
//                 </div>
//                 <div className="compensation-button-container">
//                   <button
//                     className="compensation-back-button"
//                     onClick={() => handleStepChange(currentStep - 1)}
//                     disabled={currentStep === 1}
//                   >
//                     Back
//                   </button>
//                   {currentStep < categories.length && (
//                     <button
//                       className="compensation-add-button"
//                       onClick={() => handleStepChange(currentStep + 1)}
//                     >
//                       Next
//                     </button>
//                   )}
//                   {currentStep === categories.length && (
//                     <>
//                       <button className="compensation-preview-button" onClick={handlePreview}>
//                         Preview Compensation
//                       </button>
//                       <button className="compensation-add-button" onClick={handleSubmit}>
//                         {isEditing ? 'Update Compensation' : 'Save Compensation'}
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {viewExecCompensation && (
//         <div className="compensation-popup-overlay">
//           <div className="compensation-popup">
//             <div className="compensation-popup-header">
//               <h2>Compensation Details</h2>
//               <button onClick={() => setViewExecCompensation(null)} className="compensation-close-button">
//                 ×
//               </button>
//             </div>
//             <div className="compensation-popup-content">
//               <table className="compensation-preview-table">
//                 <thead>
//                   <tr className="header-row">
//                     <th>Field</th>
//                     <th>Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(viewExecCompensation).map(([key, value]) => (
//                     <tr key={key}>
//                       <td>{formatFieldName(key)}</td>
//                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : typeof value === 'object' ? JSON.stringify(value) : value || '-'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {previewModal && (
//         <div className="compensation-popup-overlay">
//           <div className="compensation-popup">
//             <div className="compensation-popup-header">
//               <h2>Preview Compensation</h2>
//               <button onClick={closePreview} className="compensation-close-button">
//                 ×
//               </button>
//             </div>
//             <div className="compensation-popup-content">
//               <table className="compensation-preview-table">
//                 <thead>
//                   <tr className="header-row">
//                     <th>Field</th>
//                     <th>Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(formData).map(([key, value]) => (
//                     <tr key={key}>
//                       <td>{formatFieldName(key)}</td>
//                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : typeof value === 'object' ? JSON.stringify(value) : value || '-'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       <Modal
//         isVisible={alertModal.isVisible}
//         onClose={closeAlert}
//         buttons={[{ label: 'OK', onClick: closeAlert }]}
//       >
//         <p>{alertModal.message}</p>
//       </Modal>
//     </div>
//   );
// };

// export default CreateCompensation;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './createCompensation.css';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import Modal from '../Modal/Modal';

const API_KEY = process.env.REACT_APP_API_KEY;

const CreateCompensation = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompensationId, setEditingCompensationId] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    compensationPlanName: '',
    isPFApplicable: false,
    pfPercentage: '',
    pfAmount: '',
    pfType: 'percentage',
    isPFEmployer: false,
    pfEmployerPercentage: '',
    pfEmployerAmount: '',
    pfEmployerType: 'percentage',
    isPFEmployee: false,
    pfEmployeePercentage: '',
    pfEmployeeAmount: '',
    pfEmployeeType: 'percentage',
    isMedicalApplicable: false,
    isESICEmployee: false,
    esicEmployeePercentage: '',
    esicEmployeeAmount: '',
    esicEmployeeType: 'percentage',
    isInsuranceEmployee: false,
    insuranceEmployeePercentage: '',
    insuranceEmployeeAmount: '',
    insuranceEmployeeType: 'percentage',
    isGratuityApplicable: false,
    gratuityPercentage: '',
    gratuityAmount: '',
    gratuityType: 'percentage',
    isProfessionalTax: false,
    professionalTax: '',
    professionalTaxAmount: '',
    professionalTaxType: 'percentage',
    isVariablePay: false,
    variablePay: '',
    variablePayAmount: '',
    variablePayType: 'percentage',
    isStatutoryBonus: false,
    statutoryBonusPercentage: '',
    statutoryBonusAmount: '',
    statutoryBonusType: 'percentage',
    isBasicSalary: false,
    basicSalary: '',
    basicSalaryAmount: '',
    basicSalaryType: 'amount',
    isHouseRentAllowance: false,
    houseRentAllowance: '',
    houseRentAllowanceAmount: '',
    houseRentAllowanceType: 'amount',
    isLtaAllowance: false,
    ltaAllowance: '',
    ltaAllowanceAmount: '',
    ltaAllowanceType: 'amount',
    isOtherAllowance: false,
    otherAllowance: '',
    otherAllowanceAmount: '',
    otherAllowanceType: 'amount',
    isStatutoryBonusAmount: false,
    statutoryBonus: '',
    statutoryBonusFixedAmount: '',
    statutoryBonusFixedType: 'amount',
    isVariablePayAmount: false,
    variablePayAmount: '',
    variablePayFixedAmount: '',
    variablePayFixedType: 'amount',
    isOvertimePay: false,
    overtimePayType: 'hourly',
    overtimePayAmount: '',
    overtimePayUnits: '',
    isIncentives: false,
    incentives: '',
    incentivesAmount: '',
    incentivesType: 'amount',
    isDefaultWorkingHours: false,
    defaultWorkingHours: '',
    isDefaultWorkingDays: false,
    defaultWorkingDays: {
      Sunday: 'weekOff',
      Monday: 'fullDay',
      Tuesday: 'fullDay',
      Wednesday: 'fullDay',
      Thursday: 'fullDay',
      Friday: 'fullDay',
      Saturday: 'weekOff'
    },
    isTDSApplicable: false,
    tdsSlabs: []
  });
  const [compensations, setCompensations] = useState([]);
  const [alertModal, setAlertModal] = useState({
    isVisible: false,
    title: '',
    message: '',
  });
  const [viewExecCompensation, setViewExecCompensation] = useState(null);
  const [error, setError] = useState('');
  const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

  const showAlert = (message, title = '') => {
    setAlertModal({ isVisible: true, title, message });
  };

  const closeAlert = () => {
    setAlertModal({ isVisible: false, title: '', message: '' });
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsEditing(false);
    setEditingCompensationId(null);
    setCurrentStep(1);
    setFormData({
      compensationPlanName: '',
      isPFApplicable: false,
      pfPercentage: '',
      pfAmount: '',
      pfType: 'percentage',
      isPFEmployer: false,
      pfEmployerPercentage: '',
      pfEmployerAmount: '',
      pfEmployerType: 'percentage',
      isPFEmployee: false,
      pfEmployeePercentage: '',
      pfEmployeeAmount: '',
      pfEmployeeType: 'percentage',
      isMedicalApplicable: false,
      isESICEmployee: false,
      esicEmployeePercentage: '',
      esicEmployeeAmount: '',
      esicEmployeeType: 'percentage',
      isInsuranceEmployee: false,
      insuranceEmployeePercentage: '',
      insuranceEmployeeAmount: '',
      insuranceEmployeeType: 'percentage',
      isGratuityApplicable: false,
      gratuityPercentage: '',
      gratuityAmount: '',
      gratuityType: 'percentage',
      isProfessionalTax: false,
      professionalTax: '',
      professionalTaxAmount: '',
      professionalTaxType: 'percentage',
      isVariablePay: false,
      variablePay: '',
      variablePayAmount: '',
      variablePayType: 'percentage',
      isStatutoryBonus: false,
      statutoryBonusPercentage: '',
      statutoryBonusAmount: '',
      statutoryBonusType: 'percentage',
      isBasicSalary: false,
      basicSalary: '',
      basicSalaryAmount: '',
      basicSalaryType: 'amount',
      isHouseRentAllowance: false,
      houseRentAllowance: '',
      houseRentAllowanceAmount: '',
      houseRentAllowanceType: 'amount',
      isLtaAllowance: false,
      ltaAllowance: '',
      ltaAllowanceAmount: '',
      ltaAllowanceType: 'amount',
      isOtherAllowance: false,
      otherAllowance: '',
      otherAllowanceAmount: '',
      otherAllowanceType: 'amount',
      isStatutoryBonusAmount: false,
      statutoryBonus: '',
      statutoryBonusFixedAmount: '',
      statutoryBonusFixedType: 'amount',
      isVariablePayAmount: false,
      variablePayAmount: '',
      variablePayFixedAmount: '',
      variablePayFixedType: 'amount',
      isOvertimePay: false,
      overtimePayType: 'hourly',
      overtimePayAmount: '',
      overtimePayUnits: '',
      isIncentives: false,
      incentives: '',
      incentivesAmount: '',
      incentivesType: 'amount',
      isDefaultWorkingHours: false,
      defaultWorkingHours: '',
      isDefaultWorkingDays: false,
      defaultWorkingDays: {
        Sunday: 'weekOff',
        Monday: 'fullDay',
        Tuesday: 'fullDay',
        Wednesday: 'fullDay',
        Thursday: 'fullDay',
        Friday: 'fullDay',
        Saturday: 'weekOff'
      },
      isTDSApplicable: false,
      tdsSlabs: []
    });
    setError('');
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value === 'yes' };
      if (value !== 'yes') {
        if (field === 'isPFApplicable') {
          newData.pfPercentage = '';
          newData.pfAmount = '';
          newData.isPFEmployer = false;
          newData.pfEmployerPercentage = '';
          newData.pfEmployerAmount = '';
          newData.isPFEmployee = false;
          newData.pfEmployeePercentage = '';
          newData.pfEmployeeAmount = '';
        }
        if (field === 'isPFEmployer') {
          newData.pfEmployerPercentage = '';
          newData.pfEmployerAmount = '';
        }
        if (field === 'isPFEmployee') {
          newData.pfEmployeePercentage = '';
          newData.pfEmployeeAmount = '';
        }
        if (field === 'isMedicalApplicable') {
          newData.isESICEmployee = false;
          newData.esicEmployeePercentage = '';
          newData.esicEmployeeAmount = '';
          newData.isInsuranceEmployee = false;
          newData.insuranceEmployeePercentage = '';
          newData.insuranceEmployeeAmount = '';
        }
        if (field === 'isESICEmployee') {
          newData.esicEmployeePercentage = '';
          newData.esicEmployeeAmount = '';
        }
        if (field === 'isInsuranceEmployee') {
          newData.insuranceEmployeePercentage = '';
          newData.insuranceEmployeeAmount = '';
        }
        if (field === 'isGratuityApplicable') {
          newData.gratuityPercentage = '';
          newData.gratuityAmount = '';
        }
        if (field === 'isProfessionalTax') {
          newData.professionalTax = '';
          newData.professionalTaxAmount = '';
        }
        if (field === 'isVariablePay') {
          newData.variablePay = '';
          newData.variablePayAmount = '';
        }
        if (field === 'isStatutoryBonus') {
          newData.statutoryBonusPercentage = '';
          newData.statutoryBonusAmount = '';
        }
        if (field === 'isBasicSalary') {
          newData.basicSalary = '';
          newData.basicSalaryAmount = '';
        }
        if (field === 'isHouseRentAllowance') {
          newData.houseRentAllowance = '';
          newData.houseRentAllowanceAmount = '';
        }
        if (field === 'isLtaAllowance') {
          newData.ltaAllowance = '';
          newData.ltaAllowanceAmount = '';
        }
        if (field === 'isOtherAllowance') {
          newData.otherAllowance = '';
          newData.otherAllowanceAmount = '';
        }
        if (field === 'isStatutoryBonusAmount') {
          newData.statutoryBonus = '';
          newData.statutoryBonusFixedAmount = '';
        }
        if (field === 'isVariablePayAmount') {
          newData.variablePayAmount = '';
          newData.variablePayFixedAmount = '';
        }
        if (field === 'isOvertimePay') {
          newData.overtimePayType = 'hourly';
          newData.overtimePayAmount = '';
          newData.overtimePayUnits = '';
        }
        if (field === 'isIncentives') {
          newData.incentives = '';
          newData.incentivesAmount = '';
        }
        if (field === 'isDefaultWorkingHours') {
          newData.defaultWorkingHours = '';
        }
        if (field === 'isDefaultWorkingDays') {
          newData.defaultWorkingDays = {
            Sunday: 'weekOff',
            Monday: 'fullDay',
            Tuesday: 'fullDay',
            Wednesday: 'fullDay',
            Thursday: 'fullDay',
            Friday: 'fullDay',
            Saturday: 'weekOff'
          };
        }
        if (field === 'isTDSApplicable') {
          newData.tdsSlabs = [];
        }
      } else if (field === 'isTDSApplicable' && value === 'yes' && prev.tdsSlabs.length === 0) {
        newData.tdsSlabs = [{ from: '', to: '', percentage: '' }];
      }
      return newData;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSlabChange = (index, slabField, value) => {
    setFormData((prev) => {
      const newSlabs = [...prev.tdsSlabs];
      newSlabs[index][slabField] = value;
      return { ...prev, tdsSlabs: newSlabs };
    });
  };

  const handleAddSlab = () => {
    if (formData.tdsSlabs.length < 4) {
      setFormData((prev) => ({
        ...prev,
        tdsSlabs: [...prev.tdsSlabs, { from: '', to: '', percentage: '' }],
      }));
    }
  };

  const handleRemoveSlab = (index) => {
    setFormData((prev) => ({
      ...prev,
      tdsSlabs: prev.tdsSlabs.filter((_, i) => i !== index),
    }));
  };

  const handleWorkingDayChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      defaultWorkingDays: {
        ...prev.defaultWorkingDays,
        [day]: value
      }
    }));
  };

  const fetchCompensations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`, {
        headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
      });
      if (response.data.success) {
        const compensations = response.data.data || [];
        // Fetch working days for each compensation plan
        const updatedCompensations = await Promise.all(
          compensations.map(async (comp) => {
            try {
              const workingDaysResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/compensations/working-days/${comp.id}`,
                {
                  headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
                }
              );
              if (workingDaysResponse.data.success && workingDaysResponse.data.data.length > 0) {
                const workingDays = workingDaysResponse.data.data[0];
                return {
                  ...comp,
                  plan_data: {
                    ...comp.plan_data,
                    defaultWorkingDays: {
                      Sunday: workingDays.sunday,
                      Monday: workingDays.monday,
                      Tuesday: workingDays.tuesday,
                      Wednesday: workingDays.wednesday,
                      Thursday: workingDays.thursday,
                      Friday: workingDays.friday,
                      Saturday: workingDays.saturday,
                    },
                  },
                };
              }
              return comp;
            } catch (error) {
              console.error(`Error fetching working days for plan ${comp.id}:`, error);
              return comp;
            }
          })
        );
        setCompensations(updatedCompensations);
      } else {
        throw new Error('Fetch unsuccessful: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching compensations:', error);
      showAlert('Failed to fetch compensations: ' + (error.message || 'Network error'));
    }
  };

  useEffect(() => {
    fetchCompensations();
  }, []);

  const handleEdit = (compensation) => {
    setIsEditing(true);
    setEditingCompensationId(compensation.id);
    setFormData({
      compensationPlanName: compensation.compensation_plan_name || '',
      isPFApplicable: compensation.plan_data?.isPFApplicable || false,
      pfPercentage: compensation.plan_data?.pfPercentage || '',
      pfAmount: compensation.plan_data?.pfAmount || '',
      pfType: compensation.plan_data?.pfType || 'percentage',
      isPFEmployer: compensation.plan_data?.isPFEmployer || false,
      pfEmployerPercentage: compensation.plan_data?.pfEmployerPercentage || '',
      pfEmployerAmount: compensation.plan_data?.pfEmployerAmount || '',
      pfEmployerType: compensation.plan_data?.pfEmployerType || 'percentage',
      isPFEmployee: compensation.plan_data?.isPFEmployee || false,
      pfEmployeePercentage: compensation.plan_data?.pfEmployeePercentage || '',
      pfEmployeeAmount: compensation.plan_data?.pfEmployeeAmount || '',
      pfEmployeeType: compensation.plan_data?.pfEmployeeType || 'percentage',
      isMedicalApplicable: compensation.plan_data?.isMedicalApplicable || false,
      isESICEmployee: compensation.plan_data?.isESICEmployee || false,
      esicEmployeePercentage: compensation.plan_data?.esicEmployeePercentage || '',
      esicEmployeeAmount: compensation.plan_data?.esicEmployeeAmount || '',
      esicEmployeeType: compensation.plan_data?.esicEmployeeType || 'percentage',
      isInsuranceEmployee: compensation.plan_data?.isInsuranceEmployee || false,
      insuranceEmployeePercentage: compensation.plan_data?.insuranceEmployeePercentage || '',
      insuranceEmployeeAmount: compensation.plan_data?.insuranceEmployeeAmount || '',
      insuranceEmployeeType: compensation.plan_data?.insuranceEmployeeType || 'percentage',
      isGratuityApplicable: compensation.plan_data?.isGratuityApplicable || false,
      gratuityPercentage: compensation.plan_data?.gratuityPercentage || '',
      gratuityAmount: compensation.plan_data?.gratuityAmount || '',
      gratuityType: compensation.plan_data?.gratuityType || 'percentage',
      isProfessionalTax: compensation.plan_data?.isProfessionalTax || false,
      professionalTax: compensation.plan_data?.professionalTax || '',
      professionalTaxAmount: compensation.plan_data?.professionalTaxAmount || '',
      professionalTaxType: compensation.plan_data?.professionalTaxType || 'percentage',
      isVariablePay: compensation.plan_data?.isVariablePay || false,
      variablePay: compensation.plan_data?.variablePay || '',
      variablePayAmount: compensation.plan_data?.variablePayAmount || '',
      variablePayType: compensation.plan_data?.variablePayType || 'percentage',
      isStatutoryBonus: compensation.plan_data?.isStatutoryBonus || false,
      statutoryBonusPercentage: compensation.plan_data?.statutoryBonusPercentage || '',
      statutoryBonusAmount: compensation.plan_data?.statutoryBonusAmount || '',
      statutoryBonusType: compensation.plan_data?.statutoryBonusType || 'percentage',
      isBasicSalary: compensation.plan_data?.isBasicSalary || false,
      basicSalary: compensation.plan_data?.basicSalary || '',
      basicSalaryAmount: compensation.plan_data?.basicSalaryAmount || '',
      basicSalaryType: compensation.plan_data?.basicSalaryType || 'amount',
      isHouseRentAllowance: compensation.plan_data?.isHouseRentAllowance || false,
      houseRentAllowance: compensation.plan_data?.houseRentAllowance || '',
      houseRentAllowanceAmount: compensation.plan_data?.houseRentAllowanceAmount || '',
      houseRentAllowanceType: compensation.plan_data?.houseRentAllowanceType || 'amount',
      isLtaAllowance: compensation.plan_data?.isLtaAllowance || false,
      ltaAllowance: compensation.plan_data?.ltaAllowance || '',
      ltaAllowanceAmount: compensation.plan_data?.ltaAllowanceAmount || '',
      ltaAllowanceType: compensation.plan_data?.ltaAllowanceType || 'amount',
      isOtherAllowance: compensation.plan_data?.isOtherAllowance || false,
      otherAllowance: compensation.plan_data?.otherAllowance || '',
      otherAllowanceAmount: compensation.plan_data?.otherAllowanceAmount || '',
      otherAllowanceType: compensation.plan_data?.otherAllowanceType || 'amount',
      isStatutoryBonusAmount: compensation.plan_data?.isStatutoryBonusAmount || false,
      statutoryBonus: compensation.plan_data?.statutoryBonus || '',
      statutoryBonusFixedAmount: compensation.plan_data?.statutoryBonusFixedAmount || '',
      statutoryBonusFixedType: compensation.plan_data?.statutoryBonusFixedType || 'amount',
      isVariablePayAmount: compensation.plan_data?.isVariablePayAmount || false,
      variablePayAmount: compensation.plan_data?.variablePayAmount || '',
      variablePayFixedAmount: compensation.plan_data?.variablePayFixedAmount || '',
      variablePayFixedType: compensation.plan_data?.variablePayFixedType || 'amount',
      isOvertimePay: compensation.plan_data?.isOvertimePay || false,
      overtimePayType: compensation.plan_data?.overtimePayType || 'hourly',
      overtimePayAmount: compensation.plan_data?.overtimePayAmount || '',
      overtimePayUnits: compensation.plan_data?.overtimePayUnits || '',
      isIncentives: compensation.plan_data?.isIncentives || false,
      incentives: compensation.plan_data?.incentives || '',
      incentivesAmount: compensation.plan_data?.incentivesAmount || '',
      incentivesType: compensation.plan_data?.incentivesType || 'amount',
      isDefaultWorkingHours: compensation.plan_data?.isDefaultWorkingHours || false,
      defaultWorkingHours: compensation.plan_data?.defaultWorkingHours || '',
      isDefaultWorkingDays: compensation.plan_data?.isDefaultWorkingDays || false,
      defaultWorkingDays: compensation.plan_data?.defaultWorkingDays || {
        Sunday: 'weekOff',
        Monday: 'fullDay',
        Tuesday: 'fullDay',
        Wednesday: 'fullDay',
        Thursday: 'fullDay',
        Friday: 'fullDay',
        Saturday: 'weekOff'
      },
      isTDSApplicable: compensation.plan_data?.isTDSApplicable || false,
      tdsSlabs: compensation.plan_data?.tdsSlabs || (compensation.plan_data?.tdsFrom ? [{ from: compensation.plan_data.tdsFrom, to: compensation.plan_data.tdsTo, percentage: compensation.plan_data.tdsPercentage }] : [])
    });
    setIsPopupOpen(true);
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.compensationPlanName.trim()) {
      showAlert('Compensation Plan Name is required and cannot be empty');
      return;
    }

    if (formData.isIncentives && !formData.incentivesAmount.trim()) {
      showAlert('Incentives amount is required when incentives are enabled');
      return;
    }

    if (formData.isDefaultWorkingHours && !formData.defaultWorkingHours.trim()) {
      showAlert('Default Working Hours is required when enabled');
      return;
    }

    const data = {
      compensationPlanName: formData.compensationPlanName,
      formData: {
        isPFApplicable: formData.isPFApplicable,
        pfPercentage: formData.pfPercentage,
        pfAmount: formData.pfAmount,
        pfType: formData.pfType,
        isPFEmployer: formData.isPFEmployer,
        pfEmployerPercentage: formData.pfEmployerPercentage,
        pfEmployerAmount: formData.pfEmployerAmount,
        pfEmployerType: formData.pfEmployerType,
        isPFEmployee: formData.isPFEmployee,
        pfEmployeePercentage: formData.pfEmployeePercentage,
        pfEmployeeAmount: formData.pfEmployeeAmount,
        pfEmployeeType: formData.pfEmployeeType,
        isMedicalApplicable: formData.isMedicalApplicable,
        isESICEmployee: formData.isESICEmployee,
        esicEmployeePercentage: formData.esicEmployeePercentage,
        esicEmployeeAmount: formData.esicEmployeeAmount,
        esicEmployeeType: formData.esicEmployeeType,
        isInsuranceEmployee: formData.isInsuranceEmployee,
        insuranceEmployeePercentage: formData.insuranceEmployeePercentage,
        insuranceEmployeeAmount: formData.insuranceEmployeeAmount,
        insuranceEmployeeType: formData.insuranceEmployeeType,
        isGratuityApplicable: formData.isGratuityApplicable,
        gratuityPercentage: formData.gratuityPercentage,
        gratuityAmount: formData.gratuityAmount,
        gratuityType: formData.gratuityType,
        isProfessionalTax: formData.isProfessionalTax,
        professionalTax: formData.professionalTax,
        professionalTaxAmount: formData.professionalTaxAmount,
        professionalTaxType: formData.professionalTaxType,
        isVariablePay: formData.isVariablePay,
        variablePay: formData.variablePay,
        variablePayAmount: formData.variablePayAmount,
        variablePayType: formData.variablePayType,
        isStatutoryBonus: formData.isStatutoryBonus,
        statutoryBonusPercentage: formData.statutoryBonusPercentage,
        statutoryBonusAmount: formData.statutoryBonusAmount,
        statutoryBonusType: formData.statutoryBonusType,
        isBasicSalary: formData.isBasicSalary,
        basicSalary: formData.basicSalary,
        basicSalaryAmount: formData.basicSalaryAmount,
        basicSalaryType: formData.basicSalaryType,
        isHouseRentAllowance: formData.isHouseRentAllowance,
        houseRentAllowance: formData.houseRentAllowance,
        houseRentAllowanceAmount: formData.houseRentAllowanceAmount,
        houseRentAllowanceType: formData.houseRentAllowanceType,
        isLtaAllowance: formData.isLtaAllowance,
        ltaAllowance: formData.ltaAllowance,
        ltaAllowanceAmount: formData.ltaAllowanceAmount,
        ltaAllowanceType: formData.ltaAllowanceType,
        isOtherAllowance: formData.isOtherAllowance,
        otherAllowance: formData.otherAllowance,
        otherAllowanceAmount: formData.otherAllowanceAmount,
        otherAllowanceType: formData.otherAllowanceType,
        isStatutoryBonusAmount: formData.isStatutoryBonusAmount,
        statutoryBonus: formData.statutoryBonus,
        statutoryBonusFixedAmount: formData.statutoryBonusFixedAmount,
        statutoryBonusFixedType: formData.statutoryBonusFixedType,
        isVariablePayAmount: formData.isVariablePayAmount,
        variablePayAmount: formData.variablePayAmount,
        variablePayFixedAmount: formData.variablePayFixedAmount,
        variablePayFixedType: formData.variablePayFixedType,
        isOvertimePay: formData.isOvertimePay,
        overtimePayType: formData.overtimePayType,
        overtimePayAmount: formData.overtimePayAmount,
        overtimePayUnits: formData.overtimePayUnits,
        isIncentives: formData.isIncentives,
        incentives: formData.incentives,
        incentivesAmount: formData.incentivesAmount,
        incentivesType: formData.incentivesType,
        isDefaultWorkingHours: formData.isDefaultWorkingHours,
        defaultWorkingHours: formData.defaultWorkingHours,
        isDefaultWorkingDays: formData.isDefaultWorkingDays,
        defaultWorkingDays: formData.defaultWorkingDays,
        isTDSApplicable: formData.isTDSApplicable,
        tdsSlabs: formData.tdsSlabs
      }
    };

    try {
      let response;
      if (isEditing) {
        data.id = editingCompensationId;
        response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensations/update/${editingCompensationId}`,
          data,
          {
            headers: {
              'x-api-key': API_KEY,
              'x-employee-id': meId,
              'Content-Type': 'application/json',
            },
          }
        );
        showAlert('Compensation updated successfully!');
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/compensations/add`,
          data,
          {
            headers: {
              'x-api-key': API_KEY,
              'x-employee-id': meId,
              'Content-Type': 'application/json',
            },
          }
        );
        showAlert('Compensation created successfully!');
      }
      togglePopup();
      fetchCompensations();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
    }
  };

  const handleViewPopup = async (planData, planId) => {
    if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
      try {
        let defaultWorkingDays = {
          Sunday: 'weekOff',
          Monday: 'fullDay',
          Tuesday: 'fullDay',
          Wednesday: 'fullDay',
          Thursday: 'fullDay',
          Friday: 'fullDay',
          Saturday: 'weekOff'
        };
        try {
          const workingDaysResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/compensations/working-days/${planId}`,
            {
              headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
            }
          );
          if (workingDaysResponse.data.success && workingDaysResponse.data.data.length > 0) {
            const workingDays = workingDaysResponse.data.data[0];
            defaultWorkingDays = {
              Sunday: workingDays.sunday,
              Monday: workingDays.monday,
              Tuesday: workingDays.tuesday,
              Wednesday: workingDays.wednesday,
              Thursday: workingDays.thursday,
              Friday: workingDays.friday,
              Saturday: workingDays.saturday,
            };
          } else {
            console.warn(`No working days found for plan ID ${planId}, using defaults`);
          }
        } catch (error) {
          console.warn(`Failed to fetch working days for plan ID ${planId}:`, error.response?.data?.error || error.message);
          // Continue with default working days instead of showing an alert
        }
        const mappedData = {
          compensationPlanName: formData.compensationPlanName,
          isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
          pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
          pfAmount: planData.pf_amount || planData.pfAmount || '',
          pfType: planData.pf_type || planData.pfType || 'percentage',
          isPFEmployer: planData.is_pf_employer || planData.isPFEmployer || false,
          pfEmployerPercentage: planData.pf_employer_percentage || planData.pfEmployerPercentage || '',
          pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
          pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'percentage',
          isPFEmployee: planData.is_pf_employee || planData.isPFEmployee || false,
          pfEmployeePercentage: planData.pf_employee_percentage || planData.pfEmployeePercentage || '',
          pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
          pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
          isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
          isESICEmployee: planData.is_esic_employee || planData.isESICEmployee || false,
          esicEmployeePercentage: planData.esic_employee_percentage || planData.esicEmployeePercentage || '',
          esicEmployeeAmount: planData.esic_employee_amount || planData.esicEmployeeAmount || '',
          esicEmployeeType: planData.esic_employee_type || planData.esicEmployeeType || 'percentage',
          isInsuranceEmployee: planData.is_insurance_employee || planData.isInsuranceEmployee || false,
          insuranceEmployeePercentage: planData.insurance_employee_percentage || planData.insuranceEmployeePercentage || '',
          insuranceEmployeeAmount: planData.insurance_employee_amount || planData.insuranceEmployeeAmount || '',
          insuranceEmployeeType: planData.insurance_employee_type || planData.insuranceEmployeeType || 'percentage',
          isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
          gratuityPercentage: planData.gratuity_percentage || planData.gratuityPercentage || '',
          gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
          gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
          isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
          professionalTax: planData.professional_tax || planData.professionalTax || '',
          professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
          professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
          isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
          variablePay: planData.variable_pay || planData.variablePay || '',
          variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
          variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
          isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
          statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
          statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
          statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
          isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
          basicSalary: planData.basic_salary || planData.basicSalary || '',
          basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
          basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
          isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
          houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
          houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
          houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
          isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
          ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
          ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
          ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
          isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
          otherAllowance: planData.other_allowance || planData.otherAllowance || '',
          otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
          otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
          isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
          statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
          statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
          statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
          isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
          variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
          variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
          variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
          isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
          overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
          overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
          overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
          isIncentives: planData.is_incentives || planData.isIncentives || false,
          incentives: planData.incentives || '',
          incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
          incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
          isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
          defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || '',
          isDefaultWorkingDays: planData.is_default_working_days || planData.isDefaultWorkingDays || false,
          defaultWorkingDays: defaultWorkingDays,
          isTDSApplicable: planData.is_tds_applicable || planData.isTDSApplicable || false,
          tdsSlabs: planData.tds_slabs || planData.tdsSlabs || (planData.tds_from || planData.tdsFrom ? [{ from: planData.tds_from || planData.tdsFrom, to: planData.tds_to || planData.tdsTo, percentage: planData.tds_percentage || planData.tdsPercentage }] : [])
        };
        setViewExecCompensation(mappedData);
      } catch (error) {
        console.error('Error processing compensation details:', error);
        showAlert('Failed to display compensation details: Invalid data format');
      }
    } else {
      showAlert('Failed to display compensation details: Invalid data format');
    }
  };

  const handlePreview = () => {
    setPreviewModal(true);
  };

  const closePreview = () => {
    setPreviewModal(false);
  };

  const formatFieldName = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const handleStepChange = (step) => {
    const newStep = Math.max(1, Math.min(step, categories.length));
    setCurrentStep(newStep);
  };

  const renderCategoryField = ({ label, field, percentageField, amountField, typeField, required = false }) => (
    <div key={field} className="compensation-form-group">
      <span className="compensation-label-text">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </span>
      <div className="compensation-checkbox-group">
        <label className="compensation-checkbox-label">
          <input
            type="checkbox"
            checked={formData[field]}
            onChange={() => handleCheckboxChange(field, 'yes')}
            className="compensation-checkbox"
          />
          <span>Yes</span>
        </label>
        <label className="compensation-checkbox-label">
          <input
            type="checkbox"
            checked={!formData[field] && formData[field] !== undefined}
            onChange={() => handleCheckboxChange(field, 'no')}
            className="compensation-checkbox"
          />
          <span>No</span>
        </label>
      </div>
      {formData[field] && percentageField && amountField && typeField && (
        <div className="compensation-input-group">
          <select
            value={formData[typeField]}
            onChange={(e) => handleInputChange(typeField, e.target.value)}
            className="compensation-select"
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Fixed Amount</option>
          </select>
          {formData[typeField] === 'percentage' ? (
            <input
              type="number"
              placeholder="Percentage"
              value={formData[percentageField]}
              onChange={(e) => handleInputChange(percentageField, e.target.value)}
              className="compensation-percentage-input"
              required={required}
            />
          ) : (
            <input
              type="number"
              placeholder="Amount"
              value={formData[amountField]}
              onChange={(e) => handleInputChange(amountField, e.target.value)}
              className="compensation-number-input"
              required={required}
            />
          )}
        </div>
      )}
    </div>
  );

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayRows = [
    daysOfWeek.slice(0, 2), // Sunday, Monday
    daysOfWeek.slice(2, 4), // Tuesday, Wednesday
    daysOfWeek.slice(4, 6), // Thursday, Friday
    daysOfWeek.slice(6)     // Saturday
  ];

  const slabOptions = Array.from({ length: 50 }, (_, i) => {
    const val = (i + 1) * 100000;
    return { value: val.toString(), label: `${i + 1} Lac` };
  });

  const categories = [
    {
      title: 'Plan Details',
      fields: [
        {
          component: (
            <div className="compensation-form-group">
              <span className="compensation-label-text">Compensation Plan Name <span style={{ color: 'red' }}>*</span></span>
              <input
                type="text"
                placeholder="Enter Plan Name"
                value={formData.compensationPlanName}
                onChange={(e) => handleInputChange('compensationPlanName', e.target.value)}
                className="compensation-highlighted-input"
                required
              />
            </div>
          )
        },
        {
          component: (
            <div className="compensation-form-group">
              <span className="compensation-label-text">
                Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: 'red' }}>*</span>
              </span>
              <div className="compensation-checkbox-group">
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultWorkingHours}
                    onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'yes')}
                    className="compensation-checkbox"
                  />
                  <span>Yes</span>
                </label>
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!formData.isDefaultWorkingHours && formData.isDefaultWorkingHours !== undefined}
                    onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'no')}
                    className="compensation-checkbox"
                  />
                  <span>No</span>
                </label>
              </div>
              {formData.isDefaultWorkingHours && (
                <div className="compensation-input-group">
                  <input
                    type="number"
                    placeholder="Hours"
                    value={formData.defaultWorkingHours}
                    onChange={(e) => handleInputChange('defaultWorkingHours', e.target.value)}
                    className="compensation-number-input"
                    required
                  />
                </div>
              )}
            </div>
          )
        },
        {
          component: (
            <div className="compensation-form-group">
              <span className="compensation-label-text">Default Working Days</span>
              <div className="compensation-checkbox-group">
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultWorkingDays}
                    onChange={() => handleCheckboxChange('isDefaultWorkingDays', 'yes')}
                    className="compensation-checkbox"
                  />
                  <span>Yes</span>
                </label>
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!formData.isDefaultWorkingDays && formData.isDefaultWorkingDays !== undefined}
                    onChange={() => handleCheckboxChange('isDefaultWorkingDays', 'no')}
                    className="compensation-checkbox"
                  />
                  <span>No</span>
                </label>
              </div>
              {formData.isDefaultWorkingDays && (
                <div className="compensation-working-days-container">
                  {dayRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="working-day-row">
                      {row.map((day) => (
                        <div key={day} className="working-day-selector">
                          <span className="working-day-label">{day}</span>
                          <select
                            value={formData.defaultWorkingDays[day]}
                            onChange={(e) => handleWorkingDayChange(day, e.target.value)}
                            className="compensation-select"
                          >
                            <option value="fullDay">Full Day</option>
                            <option value="halfDay">Half Day</option>
                            <option value="weekOff">Week Off</option>
                          </select>
                        </div>
                      ))}
                      {row.length < 2 && <div className="working-day-selector-placeholder"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        },
        {
          component: (
            <div className="compensation-form-group">
              <span className="compensation-label-text">TDS Applicable</span>
              <div className="compensation-checkbox-group">
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isTDSApplicable}
                    onChange={() => handleCheckboxChange('isTDSApplicable', 'yes')}
                    className="compensation-checkbox"
                  />
                  <span>Yes</span>
                </label>
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!formData.isTDSApplicable && formData.isTDSApplicable !== undefined}
                    onChange={() => handleCheckboxChange('isTDSApplicable', 'no')}
                    className="compensation-checkbox"
                  />
                  <span>No</span>
                </label>
              </div>
              {formData.isTDSApplicable && (
                <div>
                  {formData.tdsSlabs.map((slab, index) => (
                    <div key={index} className="compensation-input-group" style={{ marginBottom: '10px' }}>
                      <select
                        value={slab.from}
                        onChange={(e) => handleSlabChange(index, 'from', e.target.value)}
                        className="compensation-select"
                      >
                        <option value="">From Amount</option>
                        {slabOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <select
                        value={slab.to}
                        onChange={(e) => handleSlabChange(index, 'to', e.target.value)}
                        className="compensation-select"
                      >
                        <option value="">To Amount</option>
                        {slabOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Percentage"
                        value={slab.percentage}
                        onChange={(e) => handleSlabChange(index, 'percentage', e.target.value)}
                        className="compensation-number-input"
                      />
                      {index > 0 && (
                        <button onClick={() => handleRemoveSlab(index)} className="compensation-remove-button">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.tdsSlabs.length < 4 && (
                    <button onClick={handleAddSlab} className="compensation-add-slab-button">
                      Add Slab
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        }
      ]
    },
    {
      title: 'PF and Medical Contributions',
      fields: [
        {
          label: 'PF Applicable',
          field: 'isPFApplicable',
          percentageField: 'pfPercentage',
          amountField: 'pfAmount',
          typeField: 'pfType',
        },
        ...(formData.isPFApplicable ? [
          {
            label: 'PF of Employee',
            field: 'isPFEmployee',
            percentageField: 'pfEmployeePercentage',
            amountField: 'pfEmployeeAmount',
            typeField: 'pfEmployeeType',
          },
          {
            label: 'PF of Employer',
            field: 'isPFEmployer',
            percentageField: 'pfEmployerPercentage',
            amountField: 'pfEmployerAmount',
            typeField: 'pfEmployerType',
          }
        ] : []),
        {
          label: 'Medical Applicable',
          field: 'isMedicalApplicable',
          percentageField: '',
          amountField: '',
          typeField: '',
        },
        ...(formData.isMedicalApplicable ? [
          {
            label: 'ESIC of Employee',
            field: 'isESICEmployee',
            percentageField: 'esicEmployeePercentage',
            amountField: 'esicEmployeeAmount',
            typeField: 'esicEmployeeType',
          },
          {
            label: 'Insurance of Employee',
            field: 'isInsuranceEmployee',
            percentageField: 'insuranceEmployeePercentage',
            amountField: 'insuranceEmployeeAmount',
            typeField: 'insuranceEmployeeType',
          }
        ] : []),
      ]
    },
    {
      title: 'Allowances',
      fields: [
        {
          label: 'Basic Salary',
          field: 'isBasicSalary',
          percentageField: 'basicSalary',
          amountField: 'basicSalaryAmount',
          typeField: 'basicSalaryType',
        },
        {
          label: 'House Rent Allowance',
          field: 'isHouseRentAllowance',
          percentageField: 'houseRentAllowance',
          amountField: 'houseRentAllowanceAmount',
          typeField: 'houseRentAllowanceType',
        },
        {
          label: 'LTA Allowance',
          field: 'isLtaAllowance',
          percentageField: 'ltaAllowance',
          amountField: 'ltaAllowanceAmount',
          typeField: 'ltaAllowanceType',
        },
        {
          label: 'Other Allowance',
          field: 'isOtherAllowance',
          percentageField: 'otherAllowance',
          amountField: 'otherAllowanceAmount',
          typeField: 'otherAllowanceType',
        },
      ]
    },
    {
      title: 'Statutory Components',
      fields: [
        {
          label: 'Gratuity Applicable',
          field: 'isGratuityApplicable',
          percentageField: 'gratuityPercentage',
          amountField: 'gratuityAmount',
          typeField: 'gratuityType',
        },
        {
          label: 'Professional Tax (Monthly)',
          field: 'isProfessionalTax',
          percentageField: 'professionalTax',
          amountField: 'professionalTaxAmount',
          typeField: 'professionalTaxType',
        },
        {
          label: 'Variable Pay / Bonus (Yearly)',
          field: 'isVariablePay',
          percentageField: 'variablePay',
          amountField: 'variablePayAmount',
          typeField: 'variablePayType',
        },
        {
          label: 'Statutory Bonus',
          field: 'isStatutoryBonus',
          percentageField: 'statutoryBonusPercentage',
          amountField: 'statutoryBonusAmount',
          typeField: 'statutoryBonusType',
        },
        {
          label: 'Incentives',
          field: 'isIncentives',
          percentageField: 'incentives',
          amountField: 'incentivesAmount',
          typeField: 'incentivesType',
          required: true,
        },
        {
          component: (
            <div className="compensation-form-group">
              <span className="compensation-label-text">Overtime Pay</span>
              <div className="compensation-checkbox-group">
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isOvertimePay}
                    onChange={() => handleCheckboxChange('isOvertimePay', 'yes')}
                    className="compensation-checkbox"
                  />
                  <span>Yes</span>
                </label>
                <label className="compensation-checkbox-label">
                  <input
                    type="checkbox"
                    checked={!formData.isOvertimePay && formData.isOvertimePay !== undefined}
                    onChange={() => handleCheckboxChange('isOvertimePay', 'no')}
                    className="compensation-checkbox"
                  />
                  <span>No</span>
                </label>
              </div>
              {formData.isOvertimePay && (
                <div className="compensation-input-group">
                  <select
                    value={formData.overtimePayType}
                    onChange={(e) => handleInputChange('overtimePayType', e.target.value)}
                    className="compensation-select"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="per unit">Per Unit</option>
                  </select>
                  <input
                    type="number"
                    placeholder={formData.overtimePayType === 'hourly' ? 'Rate per Hour' : formData.overtimePayType === 'daily' ? 'Rate per Day' : 'Rate per Unit'}
                    value={formData.overtimePayAmount}
                    onChange={(e) => handleInputChange('overtimePayAmount', e.target.value)}
                    className="compensation-number-input"
                  />
                  <input
                    type="number"
                    placeholder={formData.overtimePayType === 'hourly' ? 'Hours' : formData.overtimePayType === 'daily' ? 'Days' : 'Units'}
                    value={formData.overtimePayUnits}
                    onChange={(e) => handleInputChange('overtimePayUnits', e.target.value)}
                    className="compensation-number-input"
                  />
                </div>
              )}
            </div>
          )
        },
      ]
    }
  ];

  return (
    <div className="compensation-container">
      <div className="header-container">
        <button className="compensation-create-button" onClick={togglePopup}>
          Create Compensation
        </button>
      </div>

      <div className="table-scroll-wrapper">
        <table className="compensation-table">
          <thead>
            <tr className="header-row">
              <th>ID</th>
              <th>Compensation Plan Name</th>
              <th>All Details</th>
              <th>Last Edited</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {compensations.map((comp) => (
              <tr key={comp.id}>
                <td>{comp.id}</td>
                <td>{comp.compensation_plan_name}</td>
                <td>
                  <button
                    className="vendor-view-doc-btn"
                    onClick={() => handleViewPopup(comp.plan_data, comp.id)}
                  >
                    <FaEye size={16} style={{ marginRight: '5px' }} /> View
                  </button>
                </td>
                <td>
                  {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : '-'}
                </td>
                <td>
                  <button
                    className="vendor-edit-btn"
                    onClick={() => handleEdit(comp)}
                    title="Edit Compensation"
                  >
                    <FaPencilAlt size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && categories[currentStep - 1] && (
        <div className="compensation-popup-overlay">
          <div className="compensation-popup">
            <div className="compensation-popup-header">
              <h2>{isEditing ? 'Edit Compensation' : 'Create Compensation'}</h2>
              <button onClick={togglePopup} className="compensation-close-button">
                ×
              </button>
            </div>
            <div className="compensation-progress-bar">
              {categories.map((category, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`progress-step ${currentStep === index + 1 ? 'active' : ''}`}
                    onClick={() => handleStepChange(index + 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="step-number">{index + 1}</span>
                    <span className="step-label">{category.title}</span>
                  </div>
                  {index < categories.length - 1 && (
                    <div className="progress-connector">
                      <span className="progress-line"></span>
                      <span className="progress-dot"></span>
                      <span className="progress-line"></span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="compensation-popup-content">
              <div className="compensation-form-section">
                <div className="compensation-category">
                  <h3>{categories[currentStep - 1].title}</h3>
                  {categories[currentStep - 1].fields.map((field, idx) =>
                    field.component ? (
                      <React.Fragment key={idx}>{field.component}</React.Fragment>
                    ) : (
                      renderCategoryField(field)
                    )
                  )}
                </div>
                <div className="compensation-button-container">
                  <button
                    className="compensation-back-button"
                    onClick={() => handleStepChange(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                  {currentStep < categories.length && (
                    <button
                      className="compensation-add-button"
                      onClick={() => handleStepChange(currentStep + 1)}
                    >
                      Next
                    </button>
                  )}
                  {currentStep === categories.length && (
                    <>
                      <button className="compensation-preview-button" onClick={handlePreview}>
                        Preview Compensation
                      </button>
                      <button className="compensation-add-button" onClick={handleSubmit}>
                        {isEditing ? 'Update Compensation' : 'Save Compensation'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewExecCompensation && (
        <div className="compensation-popup-overlay">
          <div className="compensation-popup">
            <div className="compensation-popup-header">
              <h2>Compensation Details</h2>
              <button onClick={() => setViewExecCompensation(null)} className="compensation-close-button">
                ×
              </button>
            </div>
            <div className="compensation-popup-content">
              <table className="compensation-preview-table">
                <thead>
                  <tr className="header-row">
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(viewExecCompensation).map(([key, value]) => (
                    <tr key={key}>
                      <td>{formatFieldName(key)}</td>
                      <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : typeof value === 'object' ? JSON.stringify(value) : value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {previewModal && (
        <div className="compensation-popup-overlay">
          <div className="compensation-popup">
            <div className="compensation-popup-header">
              <h2>Preview Compensation</h2>
              <button onClick={closePreview} className="compensation-close-button">
                ×
              </button>
            </div>
            <div className="compensation-popup-content">
              <table className="compensation-preview-table">
                <thead>
                  <tr className="header-row">
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData).map(([key, value]) => (
                    <tr key={key}>
                      <td>{formatFieldName(key)}</td>
                      <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : typeof value === 'object' ? JSON.stringify(value) : value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal
        isVisible={alertModal.isVisible}
        onClose={closeAlert}
        buttons={[{ label: 'OK', onClick: closeAlert }]}
      >
        <p>{alertModal.message}</p>
      </Modal>
    </div>
  );
};

export default CreateCompensation;