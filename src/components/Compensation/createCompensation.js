
// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import './createCompensation.css';
// // // // import { FaEye, FaPencilAlt } from 'react-icons/fa';
// // // // import Modal from '../Modal/Modal';

// // // // const API_KEY = process.env.REACT_APP_API_KEY;

// // // // const CreateCompensation = () => {
// // // //   const [isPopupOpen, setIsPopupOpen] = useState(false);
// // // //   const [currentStep, setCurrentStep] = useState(1);
// // // //   const [isEditing, setIsEditing] = useState(false);
// // // //   const [editingCompensationId, setEditingCompensationId] = useState(null);
// // // //   const [previewModal, setPreviewModal] = useState(false);
// // // //   const [formData, setFormData] = useState({
// // // //     compensationPlanName: '',
// // // //     isPFApplicable: false,
// // // //     pfPercentage: '',
// // // //     pfAmount: '',
// // // //     pfType: 'percentage',
// // // //     isPFEmployerCeiling: false,
// // // //     pfEmployerCeilingPercentage: '',
// // // //     pfEmployerCeilingAmount: '',
// // // //     pfEmployerCeilingType: 'percentage',
// // // //     isPFEmployeeCeiling: false,
// // // //     pfEmployeeCeilingPercentage: '',
// // // //     pfEmployeeCeilingAmount: '',
// // // //     pfEmployeeCeilingType: 'percentage',
// // // //     isESICApplicable: false,
// // // //     esicPercentage: '',
// // // //     esicAmount: '',
// // // //     esicType: 'percentage',
// // // //     isGratuityApplicable: false,
// // // //     gratuityPercentage: '',
// // // //     gratuityAmount: '',
// // // //     gratuityType: 'percentage',
// // // //     isProfessionalTax: false,
// // // //     professionalTax: '',
// // // //     professionalTaxAmount: '',
// // // //     professionalTaxType: 'percentage',
// // // //     isVariablePay: false,
// // // //     variablePay: '',
// // // //     variablePayAmount: '',
// // // //     variablePayType: 'percentage',
// // // //     isStatutoryBonus: false,
// // // //     statutoryBonusPercentage: '',
// // // //     statutoryBonusAmount: '',
// // // //     statutoryBonusType: 'percentage',
// // // //     isBasicSalary: false,
// // // //     basicSalary: '',
// // // //     basicSalaryAmount: '',
// // // //     basicSalaryType: 'amount',
// // // //     isHouseRentAllowance: false,
// // // //     houseRentAllowance: '',
// // // //     houseRentAllowanceAmount: '',
// // // //     houseRentAllowanceType: 'amount',
// // // //     isLtaAllowance: false,
// // // //     ltaAllowance: '',
// // // //     ltaAllowanceAmount: '',
// // // //     ltaAllowanceType: 'amount',
// // // //     isOtherAllowance: false,
// // // //     otherAllowance: '',
// // // //     otherAllowanceAmount: '',
// // // //     otherAllowanceType: 'amount',
// // // //     isPfEmployer: false,
// // // //     pfEmployer: '',
// // // //     pfEmployerAmount: '',
// // // //     pfEmployerType: 'amount',
// // // //     isEsicEmployer: false,
// // // //     esicEmployer: '',
// // // //     esicEmployerAmount: '',
// // // //     esicEmployerType: 'amount',
// // // //     isStatutoryBonusAmount: false,
// // // //     statutoryBonus: '',
// // // //     statutoryBonusFixedAmount: '',
// // // //     statutoryBonusFixedType: 'amount',
// // // //     isVariablePayAmount: false,
// // // //     variablePayAmount: '',
// // // //     variablePayFixedAmount: '',
// // // //     variablePayFixedType: 'amount',
// // // //     isOvertimePay: false,
// // // //     overtimePayType: 'hourly',
// // // //     overtimePayAmount: '',
// // // //     overtimePayUnits: '',
// // // //     isIncentives: false,
// // // //     incentives: '',
// // // //     incentivesAmount: '',
// // // //     incentivesType: 'amount',
// // // //     isInsuranceApplicable: false,
// // // //     insurancePercentage: '',
// // // //     insuranceAmount: '',
// // // //     insuranceType: 'percentage',
// // // //     isDefaultWorkingHours: false,
// // // //     defaultWorkingHours: ''
// // // //   });
// // // //   const [compensations, setCompensations] = useState([]);
// // // //   const [alertModal, setAlertModal] = useState({
// // // //     isVisible: false,
// // // //     title: '',
// // // //     message: '',
// // // //   });
// // // //   const [viewExecCompensation, setViewExecCompensation] = useState(null);
// // // //   const [error, setError] = useState('');
// // // //   const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

// // // //   const showAlert = (message, title = '') => {
// // // //     setAlertModal({ isVisible: true, title, message });
// // // //   };

// // // //   const closeAlert = () => {
// // // //     setAlertModal({ isVisible: false, title: '', message: '' });
// // // //   };

// // // //   const togglePopup = () => {
// // // //     setIsPopupOpen(!isPopupOpen);
// // // //     setIsEditing(false);
// // // //     setEditingCompensationId(null);
// // // //     setCurrentStep(1);
// // // //     setFormData({
// // // //       compensationPlanName: '',
// // // //       isPFApplicable: false,
// // // //       pfPercentage: '',
// // // //       pfAmount: '',
// // // //       pfType: 'percentage',
// // // //       isPFEmployerCeiling: false,
// // // //       pfEmployerCeilingPercentage: '',
// // // //       pfEmployerCeilingAmount: '',
// // // //       pfEmployerCeilingType: 'percentage',
// // // //       isPFEmployeeCeiling: false,
// // // //       pfEmployeeCeilingPercentage: '',
// // // //       pfEmployeeCeilingAmount: '',
// // // //       pfEmployeeCeilingType: 'percentage',
// // // //       isESICApplicable: false,
// // // //       esicPercentage: '',
// // // //       esicAmount: '',
// // // //       esicType: 'percentage',
// // // //       isGratuityApplicable: false,
// // // //       gratuityPercentage: '',
// // // //       gratuityAmount: '',
// // // //       gratuityType: 'percentage',
// // // //       isProfessionalTax: false,
// // // //       professionalTax: '',
// // // //       professionalTaxAmount: '',
// // // //       professionalTaxType: 'percentage',
// // // //       isVariablePay: false,
// // // //       variablePay: '',
// // // //       variablePayAmount: '',
// // // //       variablePayType: 'percentage',
// // // //       isStatutoryBonus: false,
// // // //       statutoryBonusPercentage: '',
// // // //       statutoryBonusAmount: '',
// // // //       statutoryBonusType: 'percentage',
// // // //       isBasicSalary: false,
// // // //       basicSalary: '',
// // // //       basicSalaryAmount: '',
// // // //       basicSalaryType: 'amount',
// // // //       isHouseRentAllowance: false,
// // // //       houseRentAllowance: '',
// // // //       houseRentAllowanceAmount: '',
// // // //       houseRentAllowanceType: 'amount',
// // // //       isLtaAllowance: false,
// // // //       ltaAllowance: '',
// // // //       ltaAllowanceAmount: '',
// // // //       ltaAllowanceType: 'amount',
// // // //       isOtherAllowance: false,
// // // //       otherAllowance: '',
// // // //       otherAllowanceAmount: '',
// // // //       otherAllowanceType: 'amount',
// // // //       isPfEmployer: false,
// // // //       pfEmployer: '',
// // // //       pfEmployerAmount: '',
// // // //       pfEmployerType: 'amount',
// // // //       isEsicEmployer: false,
// // // //       esicEmployer: '',
// // // //       esicEmployerAmount: '',
// // // //       esicEmployerType: 'amount',
// // // //       isStatutoryBonusAmount: false,
// // // //       statutoryBonus: '',
// // // //       statutoryBonusFixedAmount: '',
// // // //       statutoryBonusFixedType: 'amount',
// // // //       isVariablePayAmount: false,
// // // //       variablePayAmount: '',
// // // //       variablePayFixedAmount: '',
// // // //       variablePayFixedType: 'amount',
// // // //       isOvertimePay: false,
// // // //       overtimePayType: 'hourly',
// // // //       overtimePayAmount: '',
// // // //       overtimePayUnits: '',
// // // //       isIncentives: false,
// // // //       incentives: '',
// // // //       incentivesAmount: '',
// // // //       incentivesType: 'amount',
// // // //       isInsuranceApplicable: false,
// // // //       insurancePercentage: '',
// // // //       insuranceAmount: '',
// // // //       insuranceType: 'percentage',
// // // //       isDefaultWorkingHours: false,
// // // //       defaultWorkingHours: ''
// // // //     });
// // // //     setError('');
// // // //   };

// // // //   const handleCheckboxChange = (field, value) => {
// // // //     setFormData((prev) => {
// // // //       const newData = { ...prev, [field]: value === 'yes' };
// // // //       if (value !== 'yes') {
// // // //         if (field === 'isPFApplicable') {
// // // //           newData.pfPercentage = '';
// // // //           newData.pfAmount = '';
// // // //         }
// // // //         if (field === 'isPFEmployerCeiling') {
// // // //           newData.pfEmployerCeilingPercentage = '';
// // // //           newData.pfEmployerCeilingAmount = '';
// // // //         }
// // // //         if (field === 'isPFEmployeeCeiling') {
// // // //           newData.pfEmployeeCeilingPercentage = '';
// // // //           newData.pfEmployeeCeilingAmount = '';
// // // //         }
// // // //         if (field === 'isESICApplicable') {
// // // //           newData.esicPercentage = '';
// // // //           newData.esicAmount = '';
// // // //         }
// // // //         if (field === 'isGratuityApplicable') {
// // // //           newData.gratuityPercentage = '';
// // // //           newData.gratuityAmount = '';
// // // //         }
// // // //         if (field === 'isProfessionalTax') {
// // // //           newData.professionalTax = '';
// // // //           newData.professionalTaxAmount = '';
// // // //         }
// // // //         if (field === 'isVariablePay') {
// // // //           newData.variablePay = '';
// // // //           newData.variablePayAmount = '';
// // // //         }
// // // //         if (field === 'isStatutoryBonus') {
// // // //           newData.statutoryBonusPercentage = '';
// // // //           newData.statutoryBonusAmount = '';
// // // //         }
// // // //         if (field === 'isBasicSalary') {
// // // //           newData.basicSalary = '';
// // // //           newData.basicSalaryAmount = '';
// // // //         }
// // // //         if (field === 'isHouseRentAllowance') {
// // // //           newData.houseRentAllowance = '';
// // // //           newData.houseRentAllowanceAmount = '';
// // // //         }
// // // //         if (field === 'isLtaAllowance') {
// // // //           newData.ltaAllowance = '';
// // // //           newData.ltaAllowanceAmount = '';
// // // //         }
// // // //         if (field === 'isOtherAllowance') {
// // // //           newData.otherAllowance = '';
// // // //           newData.otherAllowanceAmount = '';
// // // //         }
// // // //         if (field === 'isPfEmployer') {
// // // //           newData.pfEmployer = '';
// // // //           newData.pfEmployerAmount = '';
// // // //         }
// // // //         if (field === 'isEsicEmployer') {
// // // //           newData.esicEmployer = '';
// // // //           newData.esicEmployerAmount = '';
// // // //         }
// // // //         if (field === 'isStatutoryBonusAmount') {
// // // //           newData.statutoryBonus = '';
// // // //           newData.statutoryBonusFixedAmount = '';
// // // //         }
// // // //         if (field === 'isVariablePayAmount') {
// // // //           newData.variablePayAmount = '';
// // // //           newData.variablePayFixedAmount = '';
// // // //         }
// // // //         if (field === 'isOvertimePay') {
// // // //           newData.overtimePayType = 'hourly';
// // // //           newData.overtimePayAmount = '';
// // // //           newData.overtimePayUnits = '';
// // // //         }
// // // //         if (field === 'isIncentives') {
// // // //           newData.incentives = '';
// // // //           newData.incentivesAmount = '';
// // // //         }
// // // //         if (field === 'isInsuranceApplicable') {
// // // //           newData.insurancePercentage = '';
// // // //           newData.insuranceAmount = '';
// // // //         }
// // // //         if (field === 'isDefaultWorkingHours') {
// // // //           newData.defaultWorkingHours = '';
// // // //         }
// // // //       }
// // // //       return newData;
// // // //     });
// // // //   };

// // // //   const handleInputChange = (field, value) => {
// // // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // // //   };

// // // //   const fetchCompensations = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`, {
// // // //         headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
// // // //       });
// // // //       if (response.data.success) {
// // // //         setCompensations(response.data.data || []);
// // // //       } else {
// // // //         throw new Error('Fetch unsuccessful: ' + (response.data.message || 'Unknown error'));
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error fetching compensations:', error);
// // // //       showAlert('Failed to fetch compensations: ' + (error.message || 'Network error'));
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchCompensations();
// // // //   }, []);

// // // //   const handleEdit = (compensation) => {
// // // //     setIsEditing(true);
// // // //     setEditingCompensationId(compensation.id);
// // // //     setFormData({
// // // //       compensationPlanName: compensation.compensation_plan_name || '',
// // // //       isPFApplicable: compensation.plan_data?.isPFApplicable || false,
// // // //       pfPercentage: compensation.plan_data?.pfPercentage || '',
// // // //       pfAmount: compensation.plan_data?.pfAmount || '',
// // // //       pfType: compensation.plan_data?.pfType || 'percentage',
// // // //       isPFEmployerCeiling: compensation.plan_data?.isPFEmployerCeiling || false,
// // // //       pfEmployerCeilingPercentage: compensation.plan_data?.pfEmployerCeilingPercentage || '',
// // // //       pfEmployerCeilingAmount: compensation.plan_data?.pfEmployerCeilingAmount || '',
// // // //       pfEmployerCeilingType: compensation.plan_data?.pfEmployerCeilingType || 'percentage',
// // // //       isPFEmployeeCeiling: compensation.plan_data?.isPFEmployeeCeiling || false,
// // // //       pfEmployeeCeilingPercentage: compensation.plan_data?.pfEmployeeCeilingPercentage || '',
// // // //       pfEmployeeCeilingAmount: compensation.plan_data?.pfEmployeeCeilingAmount || '',
// // // //       pfEmployeeCeilingType: compensation.plan_data?.pfEmployeeCeilingType || 'percentage',
// // // //       isESICApplicable: compensation.plan_data?.isESICApplicable || false,
// // // //       esicPercentage: compensation.plan_data?.esicPercentage || '',
// // // //       esicAmount: compensation.plan_data?.esicAmount || '',
// // // //       esicType: compensation.plan_data?.esicType || 'percentage',
// // // //       isGratuityApplicable: compensation.plan_data?.isGratuityApplicable || false,
// // // //       gratuityPercentage: compensation.plan_data?.gratuityPercentage || '',
// // // //       gratuityAmount: compensation.plan_data?.gratuityAmount || '',
// // // //       gratuityType: compensation.plan_data?.gratuityType || 'percentage',
// // // //       isProfessionalTax: compensation.plan_data?.isProfessionalTax || false,
// // // //       professionalTax: compensation.plan_data?.professionalTax || '',
// // // //       professionalTaxAmount: compensation.plan_data?.professionalTaxAmount || '',
// // // //       professionalTaxType: compensation.plan_data?.professionalTaxType || 'percentage',
// // // //       isVariablePay: compensation.plan_data?.isVariablePay || false,
// // // //       variablePay: compensation.plan_data?.variablePay || '',
// // // //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// // // //       variablePayType: compensation.plan_data?.variablePayType || 'percentage',
// // // //       isStatutoryBonus: compensation.plan_data?.isStatutoryBonus || false,
// // // //       statutoryBonusPercentage: compensation.plan_data?.statutoryBonusPercentage || '',
// // // //       statutoryBonusAmount: compensation.plan_data?.statutoryBonusAmount || '',
// // // //       statutoryBonusType: compensation.plan_data?.statutoryBonusType || 'percentage',
// // // //       isBasicSalary: compensation.plan_data?.isBasicSalary || false,
// // // //       basicSalary: compensation.plan_data?.basicSalary || '',
// // // //       basicSalaryAmount: compensation.plan_data?.basicSalaryAmount || '',
// // // //       basicSalaryType: compensation.plan_data?.basicSalaryType || 'amount',
// // // //       isHouseRentAllowance: compensation.plan_data?.isHouseRentAllowance || false,
// // // //       houseRentAllowance: compensation.plan_data?.houseRentAllowance || '',
// // // //       houseRentAllowanceAmount: compensation.plan_data?.houseRentAllowanceAmount || '',
// // // //       houseRentAllowanceType: compensation.plan_data?.houseRentAllowanceType || 'amount',
// // // //       isLtaAllowance: compensation.plan_data?.isLtaAllowance || false,
// // // //       ltaAllowance: compensation.plan_data?.ltaAllowance || '',
// // // //       ltaAllowanceAmount: compensation.plan_data?.ltaAllowanceAmount || '',
// // // //       ltaAllowanceType: compensation.plan_data?.ltaAllowanceType || 'amount',
// // // //       isOtherAllowance: compensation.plan_data?.isOtherAllowance || false,
// // // //       otherAllowance: compensation.plan_data?.otherAllowance || '',
// // // //       otherAllowanceAmount: compensation.plan_data?.otherAllowanceAmount || '',
// // // //       otherAllowanceType: compensation.plan_data?.otherAllowanceType || 'amount',
// // // //       isPfEmployer: compensation.plan_data?.isPfEmployer || false,
// // // //       pfEmployer: compensation.plan_data?.pfEmployer || '',
// // // //       pfEmployerAmount: compensation.plan_data?.pfEmployerAmount || '',
// // // //       pfEmployerType: compensation.plan_data?.pfEmployerType || 'amount',
// // // //       isEsicEmployer: compensation.plan_data?.isEsicEmployer || false,
// // // //       esicEmployer: compensation.plan_data?.esicEmployer || '',
// // // //       esicEmployerAmount: compensation.plan_data?.esicEmployerAmount || '',
// // // //       esicEmployerType: compensation.plan_data?.esicEmployerType || 'amount',
// // // //       isStatutoryBonusAmount: compensation.plan_data?.isStatutoryBonusAmount || false,
// // // //       statutoryBonus: compensation.plan_data?.statutoryBonus || '',
// // // //       statutoryBonusFixedAmount: compensation.plan_data?.statutoryBonusFixedAmount || '',
// // // //       statutoryBonusFixedType: compensation.plan_data?.statutoryBonusFixedType || 'amount',
// // // //       isVariablePayAmount: compensation.plan_data?.isVariablePayAmount || false,
// // // //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// // // //       variablePayFixedAmount: compensation.plan_data?.variablePayFixedAmount || '',
// // // //       variablePayFixedType: compensation.plan_data?.variablePayFixedType || 'amount',
// // // //       isOvertimePay: compensation.plan_data?.isOvertimePay || false,
// // // //       overtimePayType: compensation.plan_data?.overtimePayType || 'hourly',
// // // //       overtimePayAmount: compensation.plan_data?.overtimePayAmount || '',
// // // //       overtimePayUnits: compensation.plan_data?.overtimePayUnits || '',
// // // //       isIncentives: compensation.plan_data?.isIncentives || false,
// // // //       incentives: compensation.plan_data?.incentives || '',
// // // //       incentivesAmount: compensation.plan_data?.incentivesAmount || '',
// // // //       incentivesType: compensation.plan_data?.incentivesType || 'amount',
// // // //       isInsuranceApplicable: compensation.plan_data?.isInsuranceApplicable || false,
// // // //       insurancePercentage: compensation.plan_data?.insurancePercentage || '',
// // // //       insuranceAmount: compensation.plan_data?.insuranceAmount || '',
// // // //       insuranceType: compensation.plan_data?.insuranceType || 'percentage',
// // // //       isDefaultWorkingHours: compensation.plan_data?.isDefaultWorkingHours || false,
// // // //       defaultWorkingHours: compensation.plan_data?.defaultWorkingHours || ''
// // // //     });
// // // //     setIsPopupOpen(true);
// // // //     setCurrentStep(1);
// // // //     setError('');
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();

// // // //     if (!formData.compensationPlanName.trim()) {
// // // //       showAlert('Compensation Plan Name is required and cannot be empty');
// // // //       return;
// // // //     }

// // // //     if (formData.isIncentives && !formData.incentivesAmount.trim()) {
// // // //       showAlert('Incentives amount is required when incentives are enabled');
// // // //       return;
// // // //     }

// // // //     if (formData.isDefaultWorkingHours && !formData.defaultWorkingHours.trim()) {
// // // //       showAlert('Default Working Hours is required when enabled');
// // // //       return;
// // // //     }

// // // //     const data = {
// // // //       compensationPlanName: formData.compensationPlanName,
// // // //       formData: {
// // // //         isPFApplicable: formData.isPFApplicable,
// // // //         pfPercentage: formData.pfPercentage,
// // // //         pfAmount: formData.pfAmount,
// // // //         pfType: formData.pfType,
// // // //         isPFEmployerCeiling: formData.isPFEmployerCeiling,
// // // //         pfEmployerCeilingPercentage: formData.pfEmployerCeilingPercentage,
// // // //         pfEmployerCeilingAmount: formData.pfEmployerCeilingAmount,
// // // //         pfEmployerCeilingType: formData.pfEmployerCeilingType,
// // // //         isPFEmployeeCeiling: formData.isPFEmployeeCeiling,
// // // //         pfEmployeeCeilingPercentage: formData.pfEmployeeCeilingPercentage,
// // // //         pfEmployeeCeilingAmount: formData.pfEmployeeCeilingAmount,
// // // //         pfEmployeeCeilingType: formData.pfEmployeeCeilingType,
// // // //         isESICApplicable: formData.isESICApplicable,
// // // //         esicPercentage: formData.esicPercentage,
// // // //         esicAmount: formData.esicAmount,
// // // //         esicType: formData.esicType,
// // // //         isGratuityApplicable: formData.isGratuityApplicable,
// // // //         gratuityPercentage: formData.gratuityPercentage,
// // // //         gratuityAmount: formData.gratuityAmount,
// // // //         gratuityType: formData.gratuityType,
// // // //         isProfessionalTax: formData.isProfessionalTax,
// // // //         professionalTax: formData.professionalTax,
// // // //         professionalTaxAmount: formData.professionalTaxAmount,
// // // //         professionalTaxType: formData.professionalTaxType,
// // // //         isVariablePay: formData.isVariablePay,
// // // //         variablePay: formData.variablePay,
// // // //         variablePayAmount: formData.variablePayAmount,
// // // //         variablePayType: formData.variablePayType,
// // // //         isStatutoryBonus: formData.isStatutoryBonus,
// // // //         statutoryBonusPercentage: formData.statutoryBonusPercentage,
// // // //         statutoryBonusAmount: formData.statutoryBonusAmount,
// // // //         statutoryBonusType: formData.statutoryBonusType,
// // // //         isBasicSalary: formData.isBasicSalary,
// // // //         basicSalary: formData.basicSalary,
// // // //         basicSalaryAmount: formData.basicSalaryAmount,
// // // //         basicSalaryType: formData.basicSalaryType,
// // // //         isHouseRentAllowance: formData.isHouseRentAllowance,
// // // //         houseRentAllowance: formData.houseRentAllowance,
// // // //         houseRentAllowanceAmount: formData.houseRentAllowanceAmount,
// // // //         houseRentAllowanceType: formData.houseRentAllowanceType,
// // // //         isLtaAllowance: formData.isLtaAllowance,
// // // //         ltaAllowance: formData.ltaAllowance,
// // // //         ltaAllowanceAmount: formData.ltaAllowanceAmount,
// // // //         ltaAllowanceType: formData.ltaAllowanceType,
// // // //         isOtherAllowance: formData.isOtherAllowance,
// // // //         otherAllowance: formData.otherAllowance,
// // // //         otherAllowanceAmount: formData.otherAllowanceAmount,
// // // //         otherAllowanceType: formData.otherAllowanceType,
// // // //         isPfEmployer: formData.isPfEmployer,
// // // //         pfEmployer: formData.pfEmployer,
// // // //         pfEmployerAmount: formData.pfEmployerAmount,
// // // //         pfEmployerType: formData.pfEmployerType,
// // // //         isEsicEmployer: formData.isEsicEmployer,
// // // //         esicEmployer: formData.esicEmployer,
// // // //         esicEmployerAmount: formData.esicEmployerAmount,
// // // //         esicEmployerType: formData.esicEmployerType,
// // // //         isStatutoryBonusAmount: formData.isStatutoryBonusAmount,
// // // //         statutoryBonus: formData.statutoryBonus,
// // // //         statutoryBonusFixedAmount: formData.statutoryBonusFixedAmount,
// // // //         statutoryBonusFixedType: formData.statutoryBonusFixedType,
// // // //         isVariablePayAmount: formData.isVariablePayAmount,
// // // //         variablePayAmount: formData.variablePayAmount,
// // // //         variablePayFixedAmount: formData.variablePayFixedAmount,
// // // //         variablePayFixedType: formData.variablePayFixedType,
// // // //         isOvertimePay: formData.isOvertimePay,
// // // //         overtimePayType: formData.overtimePayType,
// // // //         overtimePayAmount: formData.overtimePayAmount,
// // // //         overtimePayUnits: formData.overtimePayUnits,
// // // //         isIncentives: formData.isIncentives,
// // // //         incentives: formData.incentives,
// // // //         incentivesAmount: formData.incentivesAmount,
// // // //         incentivesType: formData.incentivesType,
// // // //         isInsuranceApplicable: formData.isInsuranceApplicable,
// // // //         insurancePercentage: formData.insurancePercentage,
// // // //         insuranceAmount: formData.insuranceAmount,
// // // //         insuranceType: formData.insuranceType,
// // // //         isDefaultWorkingHours: formData.isDefaultWorkingHours,
// // // //         defaultWorkingHours: formData.defaultWorkingHours
// // // //       }
// // // //     };

// // // //     try {
// // // //       let response;
// // // //       if (isEditing) {
// // // //         data.id = editingCompensationId;
// // // //         response = await axios.put(
// // // //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/update/${editingCompensationId}`,
// // // //           data,
// // // //           {
// // // //             headers: {
// // // //               'x-api-key': API_KEY,
// // // //               'x-employee-id': meId,
// // // //               'Content-Type': 'application/json',
// // // //             },
// // // //           }
// // // //         );
// // // //         showAlert('Compensation updated successfully!');
// // // //       } else {
// // // //         response = await axios.post(
// // // //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/add`,
// // // //           data,
// // // //           {
// // // //             headers: {
// // // //               'x-api-key': API_KEY,
// // // //               'x-employee-id': meId,
// // // //               'Content-Type': 'application/json',
// // // //             },
// // // //           }
// // // //         );
// // // //         showAlert('Compensation created successfully!');
// // // //       }
// // // //       togglePopup();
// // // //       fetchCompensations();
// // // //     } catch (error) {
// // // //       const errorMessage = error.response?.data?.error || error.message;
// // // //       showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
// // // //     }
// // // //   };

// // // //   const handleViewPopup = (planData) => {
// // // //     if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
// // // //       const mappedData = {
// // // //         compensationPlanName: formData.compensationPlanName,
// // // //         isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
// // // //         pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
// // // //         pfAmount: planData.pf_amount || planData.pfAmount || '',
// // // //         pfType: planData.pf_type || planData.pfType || 'percentage',
// // // //         isPFEmployerCeiling: planData.is_pf_employer_ceiling || planData.isPFEmployerCeiling || false,
// // // //         pfEmployerCeilingPercentage: planData.pf_employer_ceiling_percentage || planData.pfEmployerCeilingPercentage || '',
// // // //         pfEmployerCeilingAmount: planData.pf_employer_ceiling_amount || planData.pfEmployerCeilingAmount || '',
// // // //         pfEmployerCeilingType: planData.pf_employer_ceiling_type || planData.pfEmployerCeilingType || 'percentage',
// // // //         isPFEmployeeCeiling: planData.is_pf_employee_ceiling || planData.isPFEmployeeCeiling || false,
// // // //         pfEmployeeCeilingPercentage: planData.pf_employee_ceiling_percentage || planData.pfEmployeeCeilingPercentage || '',
// // // //         pfEmployeeCeilingAmount: planData.pf_employee_ceiling_amount || planData.pfEmployeeCeilingAmount || '',
// // // //         pfEmployeeCeilingType: planData.pf_employee_ceiling_type || planData.pfEmployeeCeilingType || 'percentage',
// // // //         isESICApplicable: planData.is_esic_applicable || planData.isESICApplicable || false,
// // // //         esicPercentage: planData.esic_percentage || planData.esicPercentage || '',
// // // //         esicAmount: planData.esic_amount || planData.esicAmount || '',
// // // //         esicType: planData.esic_type || planData.esicType || 'percentage',
// // // //         isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
// // // //         gratuityPercentage: planData.gratuity_percentage || planData.gratuityPercentage || '',
// // // //         gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
// // // //         gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
// // // //         isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
// // // //         professionalTax: planData.professional_tax || planData.professionalTax || '',
// // // //         professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
// // // //         professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
// // // //         isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
// // // //         variablePay: planData.variable_pay || planData.variablePay || '',
// // // //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// // // //         variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
// // // //         isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
// // // //         statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
// // // //         statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
// // // //         statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
// // // //         isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
// // // //         basicSalary: planData.basic_salary || planData.basicSalary || '',
// // // //         basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
// // // //         basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
// // // //         isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
// // // //         houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
// // // //         houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
// // // //         houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
// // // //         isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
// // // //         ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
// // // //         ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
// // // //         ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
// // // //         isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
// // // //         otherAllowance: planData.other_allowance || planData.otherAllowance || '',
// // // //         otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
// // // //         otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
// // // //         isPfEmployer: planData.is_pf_employer || planData.isPfEmployer || false,
// // // //         pfEmployer: planData.pf_employer || planData.pfEmployer || '',
// // // //         pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
// // // //         pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'amount',
// // // //         isEsicEmployer: planData.is_esic_employer || planData.isEsicEmployer || false,
// // // //         esicEmployer: planData.esic_employer || planData.esicEmployer || '',
// // // //         esicEmployerAmount: planData.esic_employer_amount || planData.esicEmployerAmount || '',
// // // //         esicEmployerType: planData.esic_employer_type || planData.esicEmployerType || 'amount',
// // // //         isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
// // // //         statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
// // // //         statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
// // // //         statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
// // // //         isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
// // // //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// // // //         variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
// // // //         variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
// // // //         isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
// // // //         overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
// // // //         overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
// // // //         overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
// // // //         isIncentives: planData.is_incentives || planData.isIncentives || false,
// // // //         incentives: planData.incentives || '',
// // // //         incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
// // // //         incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
// // // //         isInsuranceApplicable: planData.is_insurance_applicable || planData.isInsuranceApplicable || false,
// // // //         insurancePercentage: planData.insurance_percentage || planData.insurancePercentage || '',
// // // //         insuranceAmount: planData.insurance_amount || planData.insuranceAmount || '',
// // // //         insuranceType: planData.insurance_type || planData.insuranceType || 'percentage',
// // // //         isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
// // // //         defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || ''
// // // //       };
// // // //       setViewExecCompensation(mappedData);
// // // //     } else {
// // // //       showAlert('Failed to display compensation details: Invalid data format');
// // // //     }
// // // //   };

// // // //   const handlePreview = () => {
// // // //     setPreviewModal(true);
// // // //   };

// // // //   const closePreview = () => {
// // // //     setPreviewModal(false);
// // // //   };

// // // //   const formatFieldName = (key) => {
// // // //     return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
// // // //   };

// // // //   const handleStepChange = (step) => {
// // // //     // Clamp step between 1 and categories.length
// // // //     const newStep = Math.max(1, Math.min(step, categories.length));
// // // //     setCurrentStep(newStep);
// // // //   };

// // // //   const renderCategoryField = ({ label, field, percentageField, amountField, typeField, required = false }) => (
// // // //     <div key={field} className="compensation-form-group">
// // // //       <span className="compensation-label-text">
// // // //         {label} {required && <span style={{ color: 'red' }}>*</span>}
// // // //       </span>
// // // //       <div className="compensation-checkbox-group">
// // // //         <label className="compensation-checkbox-label">
// // // //           <input
// // // //             type="checkbox"
// // // //             checked={formData[field]}
// // // //             onChange={() => handleCheckboxChange(field, 'yes')}
// // // //             className="compensation-checkbox"
// // // //           />
// // // //           <span>Yes</span>
// // // //         </label>
// // // //         <label className="compensation-checkbox-label">
// // // //           <input
// // // //             type="checkbox"
// // // //             checked={!formData[field] && formData[field] !== undefined}
// // // //             onChange={() => handleCheckboxChange(field, 'no')}
// // // //             className="compensation-checkbox"
// // // //           />
// // // //           <span>No</span>
// // // //         </label>
// // // //       </div>
// // // //       {formData[field] && (
// // // //         <div className="compensation-input-group">
// // // //           <select
// // // //             value={formData[typeField]}
// // // //             onChange={(e) => handleInputChange(typeField, e.target.value)}
// // // //             className="compensation-select"
// // // //           >
// // // //             <option value="percentage">Percentage</option>
// // // //             <option value="amount">Fixed Amount</option>
// // // //           </select>
// // // //           {formData[typeField] === 'percentage' ? (
// // // //             <input
// // // //               type="number"
// // // //               placeholder="Percentage"
// // // //               value={formData[percentageField]}
// // // //               onChange={(e) => handleInputChange(percentageField, e.target.value)}
// // // //               className="compensation-percentage-input"
// // // //               required={required}
// // // //             />
// // // //           ) : (
// // // //             <input
// // // //               type="number"
// // // //               placeholder="Amount"
// // // //               value={formData[amountField]}
// // // //               onChange={(e) => handleInputChange(amountField, e.target.value)}
// // // //               className="compensation-number-input"
// // // //               required={required}
// // // //             />
// // // //           )}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   const categories = [
// // // //     {
// // // //       title: 'Plan Details',
// // // //       fields: [
// // // //         {
// // // //           component: (
// // // //             <div className="compensation-form-group">
// // // //               <span className="compensation-label-text">Compensation Plan Name <span style={{ color: 'red' }}>*</span></span>
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Enter Plan Name"
// // // //                 value={formData.compensationPlanName}
// // // //                 onChange={(e) => handleInputChange('compensationPlanName', e.target.value)}
// // // //                 className="compensation-highlighted-input"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //           )
// // // //         },
// // // //         {
// // // //           component: (
// // // //             <div className="compensation-form-group">
// // // //               <span className="compensation-label-text">
// // // //                 Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: 'red' }}>*</span>
// // // //               </span>
// // // //               <div className="compensation-checkbox-group">
// // // //                 <label className="compensation-checkbox-label">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={formData.isDefaultWorkingHours}
// // // //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'yes')}
// // // //                     className="compensation-checkbox"
// // // //                   />
// // // //                   <span>Yes</span>
// // // //                 </label>
// // // //                 <label className="compensation-checkbox-label">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={!formData.isDefaultWorkingHours && formData.isDefaultWorkingHours !== undefined}
// // // //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'no')}
// // // //                     className="compensation-checkbox"
// // // //                   />
// // // //                   <span>No</span>
// // // //                 </label>
// // // //               </div>
// // // //               {formData.isDefaultWorkingHours && (
// // // //                 <div className="compensation-input-group">
// // // //                   <input
// // // //                     type="number"
// // // //                     placeholder="Hours"
// // // //                     value={formData.defaultWorkingHours}
// // // //                     onChange={(e) => handleInputChange('defaultWorkingHours', e.target.value)}
// // // //                     className="compensation-number-input"
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )
// // // //         }
// // // //       ]
// // // //     },
// // // //     {
// // // //       title: 'PF and Employer Contributions',
// // // //       fields: [
// // // //         {
// // // //           label: 'PF Applicable',
// // // //           field: 'isPFApplicable',
// // // //           percentageField: 'pfPercentage',
// // // //           amountField: 'pfAmount',
// // // //           typeField: 'pfType',
// // // //         },
// // // //         {
// // // //           label: 'PF Employer Ceiling',
// // // //           field: 'isPFEmployerCeiling',
// // // //           percentageField: 'pfEmployerCeilingPercentage',
// // // //           amountField: 'pfEmployerCeilingAmount',
// // // //           typeField: 'pfEmployerCeilingType',
// // // //         },
// // // //         {
// // // //           label: 'PF Employee Ceiling',
// // // //           field: 'isPFEmployeeCeiling',
// // // //           percentageField: 'pfEmployeeCeilingPercentage',
// // // //           amountField: 'pfEmployeeCeilingAmount',
// // // //           typeField: 'pfEmployeeCeilingType',
// // // //         },
// // // //         {
// // // //           label: 'PF - Employer',
// // // //           field: 'isPfEmployer',
// // // //           percentageField: 'pfEmployer',
// // // //           amountField: 'pfEmployerAmount',
// // // //           typeField: 'pfEmployerType',
// // // //         },
// // // //         {
// // // //           label: 'ESIC - Employer',
// // // //           field: 'isEsicEmployer',
// // // //           percentageField: 'esicEmployer',
// // // //           amountField: 'esicEmployerAmount',
// // // //           typeField: 'esicEmployerType',
// // // //         },
// // // //       ]
// // // //     },
// // // //     {
// // // //       title: 'Incentives',
// // // //       fields: [
// // // //         {
// // // //           label: 'Incentives',
// // // //           field: 'isIncentives',
// // // //           percentageField: 'incentives',
// // // //           amountField: 'incentivesAmount',
// // // //           typeField: 'incentivesType',
// // // //           required: true,
// // // //         },
// // // //       ]
// // // //     },
// // // //     {
// // // //       title: 'Allowances',
// // // //       fields: [
// // // //         {
// // // //           label: 'Basic Salary',
// // // //           field: 'isBasicSalary',
// // // //           percentageField: 'basicSalary',
// // // //           amountField: 'basicSalaryAmount',
// // // //           typeField: 'basicSalaryType',
// // // //         },
// // // //         {
// // // //           label: 'House Rent Allowance',
// // // //           field: 'isHouseRentAllowance',
// // // //           percentageField: 'houseRentAllowance',
// // // //           amountField: 'houseRentAllowanceAmount',
// // // //           typeField: 'houseRentAllowanceType',
// // // //         },
// // // //         {
// // // //           label: 'LTA Allowance',
// // // //           field: 'isLtaAllowance',
// // // //           percentageField: 'ltaAllowance',
// // // //           amountField: 'ltaAllowanceAmount',
// // // //           typeField: 'ltaAllowanceType',
// // // //         },
// // // //         {
// // // //           label: 'Other Allowance',
// // // //           field: 'isOtherAllowance',
// // // //           percentageField: 'otherAllowance',
// // // //           amountField: 'otherAllowanceAmount',
// // // //           typeField: 'otherAllowanceType',
// // // //         },
// // // //       ]
// // // //     },
// // // //     {
// // // //       title: 'Other Statutory Components',
// // // //       fields: [
// // // //         {
// // // //           label: 'ESIC Applicable',
// // // //           field: 'isESICApplicable',
// // // //           percentageField: 'esicPercentage',
// // // //           amountField: 'esicAmount',
// // // //           typeField: 'esicType',
// // // //         },
// // // //         {
// // // //           label: 'Gratuity Applicable',
// // // //           field: 'isGratuityApplicable',
// // // //           percentageField: 'gratuityPercentage',
// // // //           amountField: 'gratuityAmount',
// // // //           typeField: 'gratuityType',
// // // //         },
// // // //         {
// // // //           label: 'Professional Tax (Monthly)',
// // // //           field: 'isProfessionalTax',
// // // //           percentageField: 'professionalTax',
// // // //           amountField: 'professionalTaxAmount',
// // // //           typeField: 'professionalTaxType',
// // // //         },
// // // //         {
// // // //           label: 'Variable Pay / Bonus (Yearly)',
// // // //           field: 'isVariablePay',
// // // //           percentageField: 'variablePay',
// // // //           amountField: 'variablePayAmount',
// // // //           typeField: 'variablePayType',
// // // //         },
// // // //         {
// // // //           label: 'Statutory Bonus',
// // // //           field: 'isStatutoryBonus',
// // // //           percentageField: 'statutoryBonusPercentage',
// // // //           amountField: 'statutoryBonusAmount',
// // // //           typeField: 'statutoryBonusType',
// // // //         },
// // // //         {
// // // //           label: 'Insurance',
// // // //           field: 'isInsuranceApplicable',
// // // //           percentageField: 'insurancePercentage',
// // // //           amountField: 'insuranceAmount',
// // // //           typeField: 'insuranceType',
// // // //         },
// // // //         {
// // // //           component: (
// // // //             <div className="compensation-form-group">
// // // //               <span className="compensation-label-text">Overtime Pay</span>
// // // //               <div className="compensation-checkbox-group">
// // // //                 <label className="compensation-checkbox-label">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={formData.isOvertimePay}
// // // //                     onChange={() => handleCheckboxChange('isOvertimePay', 'yes')}
// // // //                     className="compensation-checkbox"
// // // //                   />
// // // //                   <span>Yes</span>
// // // //                 </label>
// // // //                 <label className="compensation-checkbox-label">
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={!formData.isOvertimePay && formData.isOvertimePay !== undefined}
// // // //                     onChange={() => handleCheckboxChange('isOvertimePay', 'no')}
// // // //                     className="compensation-checkbox"
// // // //                   />
// // // //                   <span>No</span>
// // // //                 </label>
// // // //               </div>
// // // //               {formData.isOvertimePay && (
// // // //                 <div className="compensation-input-group">
// // // //                   <select
// // // //                     value={formData.overtimePayType}
// // // //                     onChange={(e) => handleInputChange('overtimePayType', e.target.value)}
// // // //                     className="compensation-select"
// // // //                   >
// // // //                     <option value="hourly">Hourly</option>
// // // //                     <option value="daily">Daily</option>
// // // //                     <option value="per unit">Per Unit</option>
// // // //                   </select>
// // // //                   <input
// // // //                     type="number"
// // // //                     placeholder={formData.overtimePayType === 'hourly' ? 'Rate per Hour' : formData.overtimePayType === 'daily' ? 'Rate per Day' : 'Rate per Unit'}
// // // //                     value={formData.overtimePayAmount}
// // // //                     onChange={(e) => handleInputChange('overtimePayAmount', e.target.value)}
// // // //                     className="compensation-number-input"
// // // //                   />
// // // //                   <input
// // // //                     type="number"
// // // //                     placeholder={formData.overtimePayType === 'hourly' ? 'Hours' : formData.overtimePayType === 'daily' ? 'Days' : 'Units'}
// // // //                     value={formData.overtimePayUnits}
// // // //                     onChange={(e) => handleInputChange('overtimePayUnits', e.target.value)}
// // // //                     className="compensation-number-input"
// // // //                   />
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )
// // // //         },
// // // //       ]
// // // //     }
// // // //   ];

// // // //   return (
// // // //     <div className="compensation-container">
// // // //       <div className="header-container">
// // // //         <button className="compensation-create-button" onClick={togglePopup}>
// // // //           Create Compensation
// // // //         </button>
// // // //       </div>

// // // //       <div className="table-scroll-wrapper">
// // // //         <table className="compensation-table">
// // // //           <thead>
// // // //             <tr className="header-row">
// // // //               <th>ID</th>
// // // //               <th>Compensation Plan Name</th>
// // // //               <th>All Details</th>
// // // //               <th>Last Edited</th>
// // // //               <th>Edit</th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {compensations.map((comp) => (
// // // //               <tr key={comp.id}>
// // // //                 <td>{comp.id}</td>
// // // //                 <td>{comp.compensation_plan_name}</td>
// // // //                 <td>
// // // //                   <button
// // // //                     className="vendor-view-doc-btn"
// // // //                     onClick={() => handleViewPopup(comp.plan_data)}
// // // //                   >
// // // //                     <FaEye size={16} style={{ marginRight: '5px' }} /> View
// // // //                   </button>
// // // //                 </td>
// // // //                 <td>
// // // //                   {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : '-'}
// // // //                 </td>
// // // //                 <td>
// // // //                   <button
// // // //                     className="vendor-edit-btn"
// // // //                     onClick={() => handleEdit(comp)}
// // // //                     title="Edit Compensation"
// // // //                   >
// // // //                     <FaPencilAlt size={16} />
// // // //                   </button>
// // // //                 </td>
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>

// // // //       {isPopupOpen && categories[currentStep - 1] && (
// // // //         <div className="compensation-popup-overlay">
// // // //           <div className="compensation-popup">
// // // //             <div className="compensation-popup-header">
// // // //               <h2>{isEditing ? 'Edit Compensation' : 'Create Compensation'}</h2>
// // // //               <button onClick={togglePopup} className="compensation-close-button">
// // // //                 ×
// // // //               </button>
// // // //             </div>
// // // //             <div className="compensation-progress-bar">
// // // //               {categories.map((category, index) => (
// // // //                 <React.Fragment key={index}>
// // // //                   <div
// // // //                     className={`progress-step ${currentStep === index + 1 ? 'active' : ''}`}
// // // //                     onClick={() => handleStepChange(index + 1)}
// // // //                     style={{ cursor: 'pointer' }}
// // // //                   >
// // // //                     <span className="step-number">{index + 1}</span>
// // // //                     <span className="step-label">{category.title}</span>
// // // //                   </div>
// // // //                   {index < categories.length - 1 && (
// // // //                     <div className="progress-connector">
// // // //                       <span className="progress-line"></span>
// // // //                       <span className="progress-dot"></span>
// // // //                       <span className="progress-line"></span>
// // // //                     </div>
// // // //                   )}
// // // //                 </React.Fragment>
// // // //               ))}
// // // //             </div>
// // // //             <div className="compensation-popup-content">
// // // //               <div className="compensation-form-section">
// // // //                 <div className="compensation-category">
// // // //                   <h3>{categories[currentStep - 1].title}</h3>
// // // //                   {categories[currentStep - 1].fields.map((field, idx) =>
// // // //                     field.component ? (
// // // //                       <React.Fragment key={idx}>{field.component}</React.Fragment>
// // // //                     ) : (
// // // //                       renderCategoryField(field)
// // // //                     )
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="compensation-button-container">
// // // //                   <button
// // // //                     className="compensation-back-button"
// // // //                     onClick={() => handleStepChange(currentStep - 1)}
// // // //                     disabled={currentStep === 1}
// // // //                   >
// // // //                     Back
// // // //                   </button>
// // // //                   {currentStep < categories.length && (
// // // //                     <button
// // // //                       className="compensation-add-button"
// // // //                       onClick={() => handleStepChange(currentStep + 1)}
// // // //                     >
// // // //                       Next
// // // //                     </button>
// // // //                   )}
// // // //                   {currentStep === categories.length && (
// // // //                     <>
// // // //                       <button className="compensation-preview-button" onClick={handlePreview}>
// // // //                         Preview Compensation
// // // //                       </button>
// // // //                       <button className="compensation-add-button" onClick={handleSubmit}>
// // // //                         {isEditing ? 'Update Compensation' : 'Save Compensation'}
// // // //                       </button>
// // // //                     </>
// // // //                   )}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {viewExecCompensation && (
// // // //         <div className="compensation-popup-overlay">
// // // //           <div className="compensation-popup">
// // // //             <div className="compensation-popup-header">
// // // //               <h2>Compensation Details</h2>
// // // //               <button onClick={() => setViewExecCompensation(null)} className="compensation-close-button">
// // // //                 ×
// // // //               </button>
// // // //             </div>
// // // //             <div className="compensation-popup-content">
// // // //               <table className="compensation-preview-table">
// // // //                 <thead>
// // // //                   <tr className="header-row">
// // // //                     <th>Field</th>
// // // //                     <th>Value</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {Object.entries(viewExecCompensation).map(([key, value]) => (
// // // //                     <tr key={key}>
// // // //                       <td>{formatFieldName(key)}</td>
// // // //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {previewModal && (
// // // //         <div className="compensation-popup-overlay">
// // // //           <div className="compensation-popup">
// // // //             <div className="compensation-popup-header">
// // // //               <h2>Preview Compensation</h2>
// // // //               <button onClick={closePreview} className="compensation-close-button">
// // // //                 ×
// // // //               </button>
// // // //             </div>
// // // //             <div className="compensation-popup-content">
// // // //               <table className="compensation-preview-table">
// // // //                 <thead>
// // // //                   <tr className="header-row">
// // // //                     <th>Field</th>
// // // //                     <th>Value</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {Object.entries(formData).map(([key, value]) => (
// // // //                     <tr key={key}>
// // // //                       <td>{formatFieldName(key)}</td>
// // // //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       <Modal
// // // //         isVisible={alertModal.isVisible}
// // // //         onClose={closeAlert}
// // // //         buttons={[{ label: 'OK', onClick: closeAlert }]}
// // // //       >
// // // //         <p>{alertModal.message}</p>
// // // //       </Modal>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CreateCompensation;
// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import './createCompensation.css';
// // // import { FaEye, FaPencilAlt } from 'react-icons/fa';
// // // import Modal from '../Modal/Modal';

// // // const API_KEY = process.env.REACT_APP_API_KEY;

// // // const CreateCompensation = () => {
// // //   const [isPopupOpen, setIsPopupOpen] = useState(false);
// // //   const [currentStep, setCurrentStep] = useState(1);
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [editingCompensationId, setEditingCompensationId] = useState(null);
// // //   const [previewModal, setPreviewModal] = useState(false);
// // //   const [formData, setFormData] = useState({
// // //     compensationPlanName: '',
// // //     isPFApplicable: false,
// // //     pfPercentage: '',
// // //     pfAmount: '',
// // //     pfType: 'percentage',
// // //     isPFEmployer: false,
// // //     pfEmployerPercentage: '',
// // //     pfEmployerAmount: '',
// // //     pfEmployerType: 'percentage',
// // //     isPFEmployee: false,
// // //     pfEmployeePercentage: '',
// // //     pfEmployeeAmount: '',
// // //     pfEmployeeType: 'percentage',
// // //     isMedicalApplicable: false,
// // //     isESICEmployee: false,
// // //     esicEmployeePercentage: '',
// // //     esicEmployeeAmount: '',
// // //     esicEmployeeType: 'percentage',
// // //     isInsuranceEmployee: false,
// // //     insuranceEmployeePercentage: '',
// // //     insuranceEmployeeAmount: '',
// // //     insuranceEmployeeType: 'percentage',
// // //     isGratuityApplicable: false,
// // //     gratuityPercentage: '',
// // //     gratuityAmount: '',
// // //     gratuityType: 'percentage',
// // //     isProfessionalTax: false,
// // //     professionalTax: '',
// // //     professionalTaxAmount: '',
// // //     professionalTaxType: 'percentage',
// // //     isVariablePay: false,
// // //     variablePay: '',
// // //     variablePayAmount: '',
// // //     variablePayType: 'percentage',
// // //     isStatutoryBonus: false,
// // //     statutoryBonusPercentage: '',
// // //     statutoryBonusAmount: '',
// // //     statutoryBonusType: 'percentage',
// // //     isBasicSalary: false,
// // //     basicSalary: '',
// // //     basicSalaryAmount: '',
// // //     basicSalaryType: 'amount',
// // //     isHouseRentAllowance: false,
// // //     houseRentAllowance: '',
// // //     houseRentAllowanceAmount: '',
// // //     houseRentAllowanceType: 'amount',
// // //     isLtaAllowance: false,
// // //     ltaAllowance: '',
// // //     ltaAllowanceAmount: '',
// // //     ltaAllowanceType: 'amount',
// // //     isOtherAllowance: false,
// // //     otherAllowance: '',
// // //     otherAllowanceAmount: '',
// // //     otherAllowanceType: 'amount',
// // //     isStatutoryBonusAmount: false,
// // //     statutoryBonus: '',
// // //     statutoryBonusFixedAmount: '',
// // //     statutoryBonusFixedType: 'amount',
// // //     isVariablePayAmount: false,
// // //     variablePayAmount: '',
// // //     variablePayFixedAmount: '',
// // //     variablePayFixedType: 'amount',
// // //     isOvertimePay: false,
// // //     overtimePayType: 'hourly',
// // //     overtimePayAmount: '',
// // //     overtimePayUnits: '',
// // //     isIncentives: false,
// // //     incentives: '',
// // //     incentivesAmount: '',
// // //     incentivesType: 'amount',
// // //     isDefaultWorkingHours: false,
// // //     defaultWorkingHours: ''
// // //   });
// // //   const [compensations, setCompensations] = useState([]);
// // //   const [alertModal, setAlertModal] = useState({
// // //     isVisible: false,
// // //     title: '',
// // //     message: '',
// // //   });
// // //   const [viewExecCompensation, setViewExecCompensation] = useState(null);
// // //   const [error, setError] = useState('');
// // //   const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

// // //   const showAlert = (message, title = '') => {
// // //     setAlertModal({ isVisible: true, title, message });
// // //   };

// // //   const closeAlert = () => {
// // //     setAlertModal({ isVisible: false, title: '', message: '' });
// // //   };

// // //   const togglePopup = () => {
// // //     setIsPopupOpen(!isPopupOpen);
// // //     setIsEditing(false);
// // //     setEditingCompensationId(null);
// // //     setCurrentStep(1);
// // //     setFormData({
// // //       compensationPlanName: '',
// // //       isPFApplicable: false,
// // //       pfPercentage: '',
// // //       pfAmount: '',
// // //       pfType: 'percentage',
// // //       isPFEmployer: false,
// // //       pfEmployerPercentage: '',
// // //       pfEmployerAmount: '',
// // //       pfEmployerType: 'percentage',
// // //       isPFEmployee: false,
// // //       pfEmployeePercentage: '',
// // //       pfEmployeeAmount: '',
// // //       pfEmployeeType: 'percentage',
// // //       isMedicalApplicable: false,
// // //       isESICEmployee: false,
// // //       esicEmployeePercentage: '',
// // //       esicEmployeeAmount: '',
// // //       esicEmployeeType: 'percentage',
// // //       isInsuranceEmployee: false,
// // //       insuranceEmployeePercentage: '',
// // //       insuranceEmployeeAmount: '',
// // //       insuranceEmployeeType: 'percentage',
// // //       isGratuityApplicable: false,
// // //       gratuityPercentage: '',
// // //       gratuityAmount: '',
// // //       gratuityType: 'percentage',
// // //       isProfessionalTax: false,
// // //       professionalTax: '',
// // //       professionalTaxAmount: '',
// // //       professionalTaxType: 'percentage',
// // //       isVariablePay: false,
// // //       variablePay: '',
// // //       variablePayAmount: '',
// // //       variablePayType: 'percentage',
// // //       isStatutoryBonus: false,
// // //       statutoryBonusPercentage: '',
// // //       statutoryBonusAmount: '',
// // //       statutoryBonusType: 'percentage',
// // //       isBasicSalary: false,
// // //       basicSalary: '',
// // //       basicSalaryAmount: '',
// // //       basicSalaryType: 'amount',
// // //       isHouseRentAllowance: false,
// // //       houseRentAllowance: '',
// // //       houseRentAllowanceAmount: '',
// // //       houseRentAllowanceType: 'amount',
// // //       isLtaAllowance: false,
// // //       ltaAllowance: '',
// // //       ltaAllowanceAmount: '',
// // //       ltaAllowanceType: 'amount',
// // //       isOtherAllowance: false,
// // //       otherAllowance: '',
// // //       otherAllowanceAmount: '',
// // //       otherAllowanceType: 'amount',
// // //       isStatutoryBonusAmount: false,
// // //       statutoryBonus: '',
// // //       statutoryBonusFixedAmount: '',
// // //       statutoryBonusFixedType: 'amount',
// // //       isVariablePayAmount: false,
// // //       variablePayAmount: '',
// // //       variablePayFixedAmount: '',
// // //       variablePayFixedType: 'amount',
// // //       isOvertimePay: false,
// // //       overtimePayType: 'hourly',
// // //       overtimePayAmount: '',
// // //       overtimePayUnits: '',
// // //       isIncentives: false,
// // //       incentives: '',
// // //       incentivesAmount: '',
// // //       incentivesType: 'amount',
// // //       isDefaultWorkingHours: false,
// // //       defaultWorkingHours: ''
// // //     });
// // //     setError('');
// // //   };

// // //   const handleCheckboxChange = (field, value) => {
// // //     setFormData((prev) => {
// // //       const newData = { ...prev, [field]: value === 'yes' };
// // //       if (value !== 'yes') {
// // //         if (field === 'isPFApplicable') {
// // //           newData.pfPercentage = '';
// // //           newData.pfAmount = '';
// // //           newData.isPFEmployer = false;
// // //           newData.pfEmployerPercentage = '';
// // //           newData.pfEmployerAmount = '';
// // //           newData.isPFEmployee = false;
// // //           newData.pfEmployeePercentage = '';
// // //           newData.pfEmployeeAmount = '';
// // //         }
// // //         if (field === 'isPFEmployer') {
// // //           newData.pfEmployerPercentage = '';
// // //           newData.pfEmployerAmount = '';
// // //         }
// // //         if (field === 'isPFEmployee') {
// // //           newData.pfEmployeePercentage = '';
// // //           newData.pfEmployeeAmount = '';
// // //         }
// // //         if (field === 'isMedicalApplicable') {
// // //           newData.isESICEmployee = false;
// // //           newData.esicEmployeePercentage = '';
// // //           newData.esicEmployeeAmount = '';
// // //           newData.isInsuranceEmployee = false;
// // //           newData.insuranceEmployeePercentage = '';
// // //           newData.insuranceEmployeeAmount = '';
// // //         }
// // //         if (field === 'isESICEmployee') {
// // //           newData.esicEmployeePercentage = '';
// // //           newData.esicEmployeeAmount = '';
// // //         }
// // //         if (field === 'isInsuranceEmployee') {
// // //           newData.insuranceEmployeePercentage = '';
// // //           newData.insuranceEmployeeAmount = '';
// // //         }
// // //         if (field === 'isGratuityApplicable') {
// // //           newData.gratuityPercentage = '';
// // //           newData.gratuityAmount = '';
// // //         }
// // //         if (field === 'isProfessionalTax') {
// // //           newData.professionalTax = '';
// // //           newData.professionalTaxAmount = '';
// // //         }
// // //         if (field === 'isVariablePay') {
// // //           newData.variablePay = '';
// // //           newData.variablePayAmount = '';
// // //         }
// // //         if (field === 'isStatutoryBonus') {
// // //           newData.statutoryBonusPercentage = '';
// // //           newData.statutoryBonusAmount = '';
// // //         }
// // //         if (field === 'isBasicSalary') {
// // //           newData.basicSalary = '';
// // //           newData.basicSalaryAmount = '';
// // //         }
// // //         if (field === 'isHouseRentAllowance') {
// // //           newData.houseRentAllowance = '';
// // //           newData.houseRentAllowanceAmount = '';
// // //         }
// // //         if (field === 'isLtaAllowance') {
// // //           newData.ltaAllowance = '';
// // //           newData.ltaAllowanceAmount = '';
// // //         }
// // //         if (field === 'isOtherAllowance') {
// // //           newData.otherAllowance = '';
// // //           newData.otherAllowanceAmount = '';
// // //         }
// // //         if (field === 'isStatutoryBonusAmount') {
// // //           newData.statutoryBonus = '';
// // //           newData.statutoryBonusFixedAmount = '';
// // //         }
// // //         if (field === 'isVariablePayAmount') {
// // //           newData.variablePayAmount = '';
// // //           newData.variablePayFixedAmount = '';
// // //         }
// // //         if (field === 'isOvertimePay') {
// // //           newData.overtimePayType = 'hourly';
// // //           newData.overtimePayAmount = '';
// // //           newData.overtimePayUnits = '';
// // //         }
// // //         if (field === 'isIncentives') {
// // //           newData.incentives = '';
// // //           newData.incentivesAmount = '';
// // //         }
// // //         if (field === 'isDefaultWorkingHours') {
// // //           newData.defaultWorkingHours = '';
// // //         }
// // //       }
// // //       return newData;
// // //     });
// // //   };

// // //   const handleInputChange = (field, value) => {
// // //     setFormData((prev) => ({ ...prev, [field]: value }));
// // //   };

// // //   const fetchCompensations = async () => {
// // //     try {
// // //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`, {
// // //         headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
// // //       });
// // //       if (response.data.success) {
// // //         setCompensations(response.data.data || []);
// // //       } else {
// // //         throw new Error('Fetch unsuccessful: ' + (response.data.message || 'Unknown error'));
// // //       }
// // //     } catch (error) {
// // //       console.error('Error fetching compensations:', error);
// // //       showAlert('Failed to fetch compensations: ' + (error.message || 'Network error'));
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchCompensations();
// // //   }, []);

// // //   const handleEdit = (compensation) => {
// // //     setIsEditing(true);
// // //     setEditingCompensationId(compensation.id);
// // //     setFormData({
// // //       compensationPlanName: compensation.compensation_plan_name || '',
// // //       isPFApplicable: compensation.plan_data?.isPFApplicable || false,
// // //       pfPercentage: compensation.plan_data?.pfPercentage || '',
// // //       pfAmount: compensation.plan_data?.pfAmount || '',
// // //       pfType: compensation.plan_data?.pfType || 'percentage',
// // //       isPFEmployer: compensation.plan_data?.isPFEmployer || false,
// // //       pfEmployerPercentage: compensation.plan_data?.pfEmployerPercentage || '',
// // //       pfEmployerAmount: compensation.plan_data?.pfEmployerAmount || '',
// // //       pfEmployerType: compensation.plan_data?.pfEmployerType || 'percentage',
// // //       isPFEmployee: compensation.plan_data?.isPFEmployee || false,
// // //       pfEmployeePercentage: compensation.plan_data?.pfEmployeePercentage || '',
// // //       pfEmployeeAmount: compensation.plan_data?.pfEmployeeAmount || '',
// // //       pfEmployeeType: compensation.plan_data?.pfEmployeeType || 'percentage',
// // //       isMedicalApplicable: compensation.plan_data?.isMedicalApplicable || false,
// // //       isESICEmployee: compensation.plan_data?.isESICEmployee || false,
// // //       esicEmployeePercentage: compensation.plan_data?.esicEmployeePercentage || '',
// // //       esicEmployeeAmount: compensation.plan_data?.esicEmployeeAmount || '',
// // //       esicEmployeeType: compensation.plan_data?.esicEmployeeType || 'percentage',
// // //       isInsuranceEmployee: compensation.plan_data?.isInsuranceEmployee || false,
// // //       insuranceEmployeePercentage: compensation.plan_data?.insuranceEmployeePercentage || '',
// // //       insuranceEmployeeAmount: compensation.plan_data?.insuranceEmployeeAmount || '',
// // //       insuranceEmployeeType: compensation.plan_data?.insuranceEmployeeType || 'percentage',
// // //       isGratuityApplicable: compensation.plan_data?.isGratuityApplicable || false,
// // //       gratuityPercentage: compensation.plan_data?.gratuityPercentage || '',
// // //       gratuityAmount: compensation.plan_data?.gratuityAmount || '',
// // //       gratuityType: compensation.plan_data?.gratuityType || 'percentage',
// // //       isProfessionalTax: compensation.plan_data?.isProfessionalTax || false,
// // //       professionalTax: compensation.plan_data?.professionalTax || '',
// // //       professionalTaxAmount: compensation.plan_data?.professionalTaxAmount || '',
// // //       professionalTaxType: compensation.plan_data?.professionalTaxType || 'percentage',
// // //       isVariablePay: compensation.plan_data?.isVariablePay || false,
// // //       variablePay: compensation.plan_data?.variablePay || '',
// // //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// // //       variablePayType: compensation.plan_data?.variablePayType || 'percentage',
// // //       isStatutoryBonus: compensation.plan_data?.isStatutoryBonus || false,
// // //       statutoryBonusPercentage: compensation.plan_data?.statutoryBonusPercentage || '',
// // //       statutoryBonusAmount: compensation.plan_data?.statutoryBonusAmount || '',
// // //       statutoryBonusType: compensation.plan_data?.statutoryBonusType || 'percentage',
// // //       isBasicSalary: compensation.plan_data?.isBasicSalary || false,
// // //       basicSalary: compensation.plan_data?.basicSalary || '',
// // //       basicSalaryAmount: compensation.plan_data?.basicSalaryAmount || '',
// // //       basicSalaryType: compensation.plan_data?.basicSalaryType || 'amount',
// // //       isHouseRentAllowance: compensation.plan_data?.isHouseRentAllowance || false,
// // //       houseRentAllowance: compensation.plan_data?.houseRentAllowance || '',
// // //       houseRentAllowanceAmount: compensation.plan_data?.houseRentAllowanceAmount || '',
// // //       houseRentAllowanceType: compensation.plan_data?.houseRentAllowanceType || 'amount',
// // //       isLtaAllowance: compensation.plan_data?.isLtaAllowance || false,
// // //       ltaAllowance: compensation.plan_data?.ltaAllowance || '',
// // //       ltaAllowanceAmount: compensation.plan_data?.ltaAllowanceAmount || '',
// // //       ltaAllowanceType: compensation.plan_data?.ltaAllowanceType || 'amount',
// // //       isOtherAllowance: compensation.plan_data?.isOtherAllowance || false,
// // //       otherAllowance: compensation.plan_data?.otherAllowance || '',
// // //       otherAllowanceAmount: compensation.plan_data?.otherAllowanceAmount || '',
// // //       otherAllowanceType: compensation.plan_data?.otherAllowanceType || 'amount',
// // //       isStatutoryBonusAmount: compensation.plan_data?.isStatutoryBonusAmount || false,
// // //       statutoryBonus: compensation.plan_data?.statutoryBonus || '',
// // //       statutoryBonusFixedAmount: compensation.plan_data?.statutoryBonusFixedAmount || '',
// // //       statutoryBonusFixedType: compensation.plan_data?.statutoryBonusFixedType || 'amount',
// // //       isVariablePayAmount: compensation.plan_data?.isVariablePayAmount || false,
// // //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// // //       variablePayFixedAmount: compensation.plan_data?.variablePayFixedAmount || '',
// // //       variablePayFixedType: compensation.plan_data?.variablePayFixedType || 'amount',
// // //       isOvertimePay: compensation.plan_data?.isOvertimePay || false,
// // //       overtimePayType: compensation.plan_data?.overtimePayType || 'hourly',
// // //       overtimePayAmount: compensation.plan_data?.overtimePayAmount || '',
// // //       overtimePayUnits: compensation.plan_data?.overtimePayUnits || '',
// // //       isIncentives: compensation.plan_data?.isIncentives || false,
// // //       incentives: compensation.plan_data?.incentives || '',
// // //       incentivesAmount: compensation.plan_data?.incentivesAmount || '',
// // //       incentivesType: compensation.plan_data?.incentivesType || 'amount',
// // //       isDefaultWorkingHours: compensation.plan_data?.isDefaultWorkingHours || false,
// // //       defaultWorkingHours: compensation.plan_data?.defaultWorkingHours || ''
// // //     });
// // //     setIsPopupOpen(true);
// // //     setCurrentStep(1);
// // //     setError('');
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!formData.compensationPlanName.trim()) {
// // //       showAlert('Compensation Plan Name is required and cannot be empty');
// // //       return;
// // //     }

// // //     if (formData.isIncentives && !formData.incentivesAmount.trim()) {
// // //       showAlert('Incentives amount is required when incentives are enabled');
// // //       return;
// // //     }

// // //     if (formData.isDefaultWorkingHours && !formData.defaultWorkingHours.trim()) {
// // //       showAlert('Default Working Hours is required when enabled');
// // //       return;
// // //     }

// // //     const data = {
// // //       compensationPlanName: formData.compensationPlanName,
// // //       formData: {
// // //         isPFApplicable: formData.isPFApplicable,
// // //         pfPercentage: formData.pfPercentage,
// // //         pfAmount: formData.pfAmount,
// // //         pfType: formData.pfType,
// // //         isPFEmployer: formData.isPFEmployer,
// // //         pfEmployerPercentage: formData.pfEmployerPercentage,
// // //         pfEmployerAmount: formData.pfEmployerAmount,
// // //         pfEmployerType: formData.pfEmployerType,
// // //         isPFEmployee: formData.isPFEmployee,
// // //         pfEmployeePercentage: formData.pfEmployeePercentage,
// // //         pfEmployeeAmount: formData.pfEmployeeAmount,
// // //         pfEmployeeType: formData.pfEmployeeType,
// // //         isMedicalApplicable: formData.isMedicalApplicable,
// // //         isESICEmployee: formData.isESICEmployee,
// // //         esicEmployeePercentage: formData.esicEmployeePercentage,
// // //         esicEmployeeAmount: formData.esicEmployeeAmount,
// // //         esicEmployeeType: formData.esicEmployeeType,
// // //         isInsuranceEmployee: formData.isInsuranceEmployee,
// // //         insuranceEmployeePercentage: formData.insuranceEmployeePercentage,
// // //         insuranceEmployeeAmount: formData.insuranceEmployeeAmount,
// // //         insuranceEmployeeType: formData.insuranceEmployeeType,
// // //         isGratuityApplicable: formData.isGratuityApplicable,
// // //         gratuityPercentage: formData.gratuityPercentage,
// // //         gratuityAmount: formData.gratuityAmount,
// // //         gratuityType: formData.gratuityType,
// // //         isProfessionalTax: formData.isProfessionalTax,
// // //         professionalTax: formData.professionalTax,
// // //         professionalTaxAmount: formData.professionalTaxAmount,
// // //         professionalTaxType: formData.professionalTaxType,
// // //         isVariablePay: formData.isVariablePay,
// // //         variablePay: formData.variablePay,
// // //         variablePayAmount: formData.variablePayAmount,
// // //         variablePayType: formData.variablePayType,
// // //         isStatutoryBonus: formData.isStatutoryBonus,
// // //         statutoryBonusPercentage: formData.statutoryBonusPercentage,
// // //         statutoryBonusAmount: formData.statutoryBonusAmount,
// // //         statutoryBonusType: formData.statutoryBonusType,
// // //         isBasicSalary: formData.isBasicSalary,
// // //         basicSalary: formData.basicSalary,
// // //         basicSalaryAmount: formData.basicSalaryAmount,
// // //         basicSalaryType: formData.basicSalaryType,
// // //         isHouseRentAllowance: formData.isHouseRentAllowance,
// // //         houseRentAllowance: formData.houseRentAllowance,
// // //         houseRentAllowanceAmount: formData.houseRentAllowanceAmount,
// // //         houseRentAllowanceType: formData.houseRentAllowanceType,
// // //         isLtaAllowance: formData.isLtaAllowance,
// // //         ltaAllowance: formData.ltaAllowance,
// // //         ltaAllowanceAmount: formData.ltaAllowanceAmount,
// // //         ltaAllowanceType: formData.ltaAllowanceType,
// // //         isOtherAllowance: formData.isOtherAllowance,
// // //         otherAllowance: formData.otherAllowance,
// // //         otherAllowanceAmount: formData.otherAllowanceAmount,
// // //         otherAllowanceType: formData.otherAllowanceType,
// // //         isStatutoryBonusAmount: formData.isStatutoryBonusAmount,
// // //         statutoryBonus: formData.statutoryBonus,
// // //         statutoryBonusFixedAmount: formData.statutoryBonusFixedAmount,
// // //         statutoryBonusFixedType: formData.statutoryBonusFixedType,
// // //         isVariablePayAmount: formData.isVariablePayAmount,
// // //         variablePayAmount: formData.variablePayAmount,
// // //         variablePayFixedAmount: formData.variablePayFixedAmount,
// // //         variablePayFixedType: formData.variablePayFixedType,
// // //         isOvertimePay: formData.isOvertimePay,
// // //         overtimePayType: formData.overtimePayType,
// // //         overtimePayAmount: formData.overtimePayAmount,
// // //         overtimePayUnits: formData.overtimePayUnits,
// // //         isIncentives: formData.isIncentives,
// // //         incentives: formData.incentives,
// // //         incentivesAmount: formData.incentivesAmount,
// // //         incentivesType: formData.incentivesType,
// // //         isDefaultWorkingHours: formData.isDefaultWorkingHours,
// // //         defaultWorkingHours: formData.defaultWorkingHours
// // //       }
// // //     };

// // //     try {
// // //       let response;
// // //       if (isEditing) {
// // //         data.id = editingCompensationId;
// // //         response = await axios.put(
// // //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/update/${editingCompensationId}`,
// // //           data,
// // //           {
// // //             headers: {
// // //               'x-api-key': API_KEY,
// // //               'x-employee-id': meId,
// // //               'Content-Type': 'application/json',
// // //             },
// // //           }
// // //         );
// // //         showAlert('Compensation updated successfully!');
// // //       } else {
// // //         response = await axios.post(
// // //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/add`,
// // //           data,
// // //           {
// // //             headers: {
// // //               'x-api-key': API_KEY,
// // //               'x-employee-id': meId,
// // //               'Content-Type': 'application/json',
// // //             },
// // //           }
// // //         );
// // //         showAlert('Compensation created successfully!');
// // //       }
// // //       togglePopup();
// // //       fetchCompensations();
// // //     } catch (error) {
// // //       const errorMessage = error.response?.data?.error || error.message;
// // //       showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
// // //     }
// // //   };

// // //   const handleViewPopup = (planData) => {
// // //     if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
// // //       const mappedData = {
// // //         compensationPlanName: formData.compensationPlanName,
// // //         isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
// // //         pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
// // //         pfAmount: planData.pf_amount || planData.pfAmount || '',
// // //         pfType: planData.pf_type || planData.pfType || 'percentage',
// // //         isPFEmployer: planData.is_pf_employer || planData.isPFEmployer || false,
// // //         pfEmployerPercentage: planData.pf_employer_percentage || planData.pfEmployerPercentage || '',
// // //         pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
// // //         pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'percentage',
// // //         isPFEmployee: planData.is_pf_employee || planData.isPFEmployee || false,
// // //         pfEmployeePercentage: planData.pf_employee_percentage || planData.pfEmployeePercentage || '',
// // //         pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
// // //         pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
// // //         isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
// // //         isESICEmployee: planData.is_esic_employee || planData.isESICEmployee || false,
// // //         esicEmployeePercentage: planData.esic_employee_percentage || planData.esicEmployeePercentage || '',
// // //         esicEmployeeAmount: planData.esic_employee_amount || planData.esicEmployeeAmount || '',
// // //         esicEmployeeType: planData.esic_employee_type || planData.esicEmployeeType || 'percentage',
// // //         isInsuranceEmployee: planData.is_insurance_employee || planData.isInsuranceEmployee || false,
// // //         insuranceEmployeePercentage: planData.insurance_employee_percentage || planData.insuranceEmployeePercentage || '',
// // //         insuranceEmployeeAmount: planData.insurance_employee_amount || planData.insuranceEmployeeAmount || '',
// // //         insuranceEmployeeType: planData.insurance_employee_type || planData.insuranceEmployeeType || 'percentage',
// // //         isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
// // //         gratuityPercentage: planData.gratuity_percentage || planData.gratuityPercentage || '',
// // //         gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
// // //         gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
// // //         isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
// // //         professionalTax: planData.professional_tax || planData.professionalTax || '',
// // //         professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
// // //         professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
// // //         isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
// // //         variablePay: planData.variable_pay || planData.variablePay || '',
// // //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// // //         variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
// // //         isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
// // //         statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
// // //         statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
// // //         statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
// // //         isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
// // //         basicSalary: planData.basic_salary || planData.basicSalary || '',
// // //         basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
// // //         basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
// // //         isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
// // //         houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
// // //         houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
// // //         houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
// // //         isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
// // //         ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
// // //         ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
// // //         ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
// // //         isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
// // //         otherAllowance: planData.other_allowance || planData.otherAllowance || '',
// // //         otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
// // //         otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
// // //         isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
// // //         statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
// // //         statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
// // //         statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
// // //         isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
// // //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// // //         variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
// // //         variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
// // //         isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
// // //         overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
// // //         overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
// // //         overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
// // //         isIncentives: planData.is_incentives || planData.isIncentives || false,
// // //         incentives: planData.incentives || '',
// // //         incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
// // //         incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
// // //         isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
// // //         defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || ''
// // //       };
// // //       setViewExecCompensation(mappedData);
// // //     } else {
// // //       showAlert('Failed to display compensation details: Invalid data format');
// // //     }
// // //   };

// // //   const handlePreview = () => {
// // //     setPreviewModal(true);
// // //   };

// // //   const closePreview = () => {
// // //     setPreviewModal(false);
// // //   };

// // //   const formatFieldName = (key) => {
// // //     return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
// // //   };

// // //   const handleStepChange = (step) => {
// // //     const newStep = Math.max(1, Math.min(step, categories.length));
// // //     setCurrentStep(newStep);
// // //   };

// // //   const renderCategoryField = ({ label, field, percentageField, amountField, typeField, required = false }) => (
// // //     <div key={field} className="compensation-form-group">
// // //       <span className="compensation-label-text">
// // //         {label} {required && <span style={{ color: 'red' }}>*</span>}
// // //       </span>
// // //       <div className="compensation-checkbox-group">
// // //         <label className="compensation-checkbox-label">
// // //           <input
// // //             type="checkbox"
// // //             checked={formData[field]}
// // //             onChange={() => handleCheckboxChange(field, 'yes')}
// // //             className="compensation-checkbox"
// // //           />
// // //           <span>Yes</span>
// // //         </label>
// // //         <label className="compensation-checkbox-label">
// // //           <input
// // //             type="checkbox"
// // //             checked={!formData[field] && formData[field] !== undefined}
// // //             onChange={() => handleCheckboxChange(field, 'no')}
// // //             className="compensation-checkbox"
// // //           />
// // //           <span>No</span>
// // //         </label>
// // //       </div>
// // //       {formData[field] && (
// // //         <div className="compensation-input-group">
// // //           <select
// // //             value={formData[typeField]}
// // //             onChange={(e) => handleInputChange(typeField, e.target.value)}
// // //             className="compensation-select"
// // //           >
// // //             <option value="percentage">Percentage</option>
// // //             <option value="amount">Fixed Amount</option>
// // //           </select>
// // //           {formData[typeField] === 'percentage' ? (
// // //             <input
// // //               type="number"
// // //               placeholder="Percentage"
// // //               value={formData[percentageField]}
// // //               onChange={(e) => handleInputChange(percentageField, e.target.value)}
// // //               className="compensation-percentage-input"
// // //               required={required}
// // //             />
// // //           ) : (
// // //             <input
// // //               type="number"
// // //               placeholder="Amount"
// // //               value={formData[amountField]}
// // //               onChange={(e) => handleInputChange(amountField, e.target.value)}
// // //               className="compensation-number-input"
// // //               required={required}
// // //             />
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );

// // //   const categories = [
// // //     {
// // //       title: 'Plan Details',
// // //       fields: [
// // //         {
// // //           component: (
// // //             <div className="compensation-form-group">
// // //               <span className="compensation-label-text">Compensation Plan Name <span style={{ color: 'red' }}>*</span></span>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Enter Plan Name"
// // //                 value={formData.compensationPlanName}
// // //                 onChange={(e) => handleInputChange('compensationPlanName', e.target.value)}
// // //                 className="compensation-highlighted-input"
// // //                 required
// // //               />
// // //             </div>
// // //           )
// // //         },
// // //         {
// // //           component: (
// // //             <div className="compensation-form-group">
// // //               <span className="compensation-label-text">
// // //                 Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: 'red' }}>*</span>
// // //               </span>
// // //               <div className="compensation-checkbox-group">
// // //                 <label className="compensation-checkbox-label">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={formData.isDefaultWorkingHours}
// // //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'yes')}
// // //                     className="compensation-checkbox"
// // //                   />
// // //                   <span>Yes</span>
// // //                 </label>
// // //                 <label className="compensation-checkbox-label">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={!formData.isDefaultWorkingHours && formData.isDefaultWorkingHours !== undefined}
// // //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'no')}
// // //                     className="compensation-checkbox"
// // //                   />
// // //                   <span>No</span>
// // //                 </label>
// // //               </div>
// // //               {formData.isDefaultWorkingHours && (
// // //                 <div className="compensation-input-group">
// // //                   <input
// // //                     type="number"
// // //                     placeholder="Hours"
// // //                     value={formData.defaultWorkingHours}
// // //                     onChange={(e) => handleInputChange('defaultWorkingHours', e.target.value)}
// // //                     className="compensation-number-input"
// // //                     required
// // //                   />
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )
// // //         }
// // //       ]
// // //     },
// // //     {
// // //       title: 'PF and Medical Contributions',
// // //       fields: [
// // //         {
// // //           label: 'PF Applicable',
// // //           field: 'isPFApplicable',
// // //           percentageField: 'pfPercentage',
// // //           amountField: 'pfAmount',
// // //           typeField: 'pfType',
// // //         },
// // //         ...(formData.isPFApplicable ? [
// // //           {
// // //             label: 'PF of Employee',
// // //             field: 'isPFEmployee',
// // //             percentageField: 'pfEmployeePercentage',
// // //             amountField: 'pfEmployeeAmount',
// // //             typeField: 'pfEmployeeType',
// // //           },
// // //           {
// // //             label: 'PF of Employer',
// // //             field: 'isPFEmployer',
// // //             percentageField: 'pfEmployerPercentage',
// // //             amountField: 'pfEmployerAmount',
// // //             typeField: 'pfEmployerType',
// // //           }
// // //         ] : []),
// // //         {
// // //           label: 'Medical Applicable',
// // //           field: 'isMedicalApplicable',
// // //           percentageField: '',
// // //           amountField: '',
// // //           typeField: '',
// // //         },
// // //         ...(formData.isMedicalApplicable ? [
// // //           {
// // //             label: 'ESIC of Employee',
// // //             field: 'isESICEmployee',
// // //             percentageField: 'esicEmployeePercentage',
// // //             amountField: 'esicEmployeeAmount',
// // //             typeField: 'esicEmployeeType',
// // //           },
// // //           {
// // //             label: 'Insurance of Employee',
// // //             field: 'isInsuranceEmployee',
// // //             percentageField: 'insuranceEmployeePercentage',
// // //             amountField: 'insuranceEmployeeAmount',
// // //             typeField: 'insuranceEmployeeType',
// // //           }
// // //         ] : [])
// // //       ]
// // //     },
// // //     {
// // //       title: 'Incentives',
// // //       fields: [
// // //         {
// // //           label: 'Incentives',
// // //           field: 'isIncentives',
// // //           percentageField: 'incentives',
// // //           amountField: 'incentivesAmount',
// // //           typeField: 'incentivesType',
// // //           required: true,
// // //         },
// // //       ]
// // //     },
// // //     {
// // //       title: 'Allowances',
// // //       fields: [
// // //         {
// // //           label: 'Basic Salary',
// // //           field: 'isBasicSalary',
// // //           percentageField: 'basicSalary',
// // //           amountField: 'basicSalaryAmount',
// // //           typeField: 'basicSalaryType',
// // //         },
// // //         {
// // //           label: 'House Rent Allowance',
// // //           field: 'isHouseRentAllowance',
// // //           percentageField: 'houseRentAllowance',
// // //           amountField: 'houseRentAllowanceAmount',
// // //           typeField: 'houseRentAllowanceType',
// // //         },
// // //         {
// // //           label: 'LTA Allowance',
// // //           field: 'isLtaAllowance',
// // //           percentageField: 'ltaAllowance',
// // //           amountField: 'ltaAllowanceAmount',
// // //           typeField: 'ltaAllowanceType',
// // //         },
// // //         {
// // //           label: 'Other Allowance',
// // //           field: 'isOtherAllowance',
// // //           percentageField: 'otherAllowance',
// // //           amountField: 'otherAllowanceAmount',
// // //           typeField: 'otherAllowanceType',
// // //         },
// // //       ]
// // //     },
// // //     {
// // //       title: 'Other Statutory Components',
// // //       fields: [
// // //         {
// // //           label: 'Gratuity Applicable',
// // //           field: 'isGratuityApplicable',
// // //           percentageField: 'gratuityPercentage',
// // //           amountField: 'gratuityAmount',
// // //           typeField: 'gratuityType',
// // //         },
// // //         {
// // //           label: 'Professional Tax (Monthly)',
// // //           field: 'isProfessionalTax',
// // //           percentageField: 'professionalTax',
// // //           amountField: 'professionalTaxAmount',
// // //           typeField: 'professionalTaxType',
// // //         },
// // //         {
// // //           label: 'Variable Pay / Bonus (Yearly)',
// // //           field: 'isVariablePay',
// // //           percentageField: 'variablePay',
// // //           amountField: 'variablePayAmount',
// // //           typeField: 'variablePayType',
// // //         },
// // //         {
// // //           label: 'Statutory Bonus',
// // //           field: 'isStatutoryBonus',
// // //           percentageField: 'statutoryBonusPercentage',
// // //           amountField: 'statutoryBonusAmount',
// // //           typeField: 'statutoryBonusType',
// // //         },
// // //         {
// // //           component: (
// // //             <div className="compensation-form-group">
// // //               <span className="compensation-label-text">Overtime Pay</span>
// // //               <div className="compensation-checkbox-group">
// // //                 <label className="compensation-checkbox-label">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={formData.isOvertimePay}
// // //                     onChange={() => handleCheckboxChange('isOvertimePay', 'yes')}
// // //                     className="compensation-checkbox"
// // //                   />
// // //                   <span>Yes</span>
// // //                 </label>
// // //                 <label className="compensation-checkbox-label">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={!formData.isOvertimePay && formData.isOvertimePay !== undefined}
// // //                     onChange={() => handleCheckboxChange('isOvertimePay', 'no')}
// // //                     className="compensation-checkbox"
// // //                   />
// // //                   <span>No</span>
// // //                 </label>
// // //               </div>
// // //               {formData.isOvertimePay && (
// // //                 <div className="compensation-input-group">
// // //                   <select
// // //                     value={formData.overtimePayType}
// // //                     onChange={(e) => handleInputChange('overtimePayType', e.target.value)}
// // //                     className="compensation-select"
// // //                   >
// // //                     <option value="hourly">Hourly</option>
// // //                     <option value="daily">Daily</option>
// // //                     <option value="per unit">Per Unit</option>
// // //                   </select>
// // //                   <input
// // //                     type="number"
// // //                     placeholder={formData.overtimePayType === 'hourly' ? 'Rate per Hour' : formData.overtimePayType === 'daily' ? 'Rate per Day' : 'Rate per Unit'}
// // //                     value={formData.overtimePayAmount}
// // //                     onChange={(e) => handleInputChange('overtimePayAmount', e.target.value)}
// // //                     className="compensation-number-input"
// // //                   />
// // //                   <input
// // //                     type="number"
// // //                     placeholder={formData.overtimePayType === 'hourly' ? 'Hours' : formData.overtimePayType === 'daily' ? 'Days' : 'Units'}
// // //                     value={formData.overtimePayUnits}
// // //                     onChange={(e) => handleInputChange('overtimePayUnits', e.target.value)}
// // //                     className="compensation-number-input"
// // //                   />
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )
// // //         },
// // //       ]
// // //     }
// // //   ];

// // //   return (
// // //     <div className="compensation-container">
// // //       <div className="header-container">
// // //         <button className="compensation-create-button" onClick={togglePopup}>
// // //           Create Compensation
// // //         </button>
// // //       </div>

// // //       <div className="table-scroll-wrapper">
// // //         <table className="compensation-table">
// // //           <thead>
// // //             <tr className="header-row">
// // //               <th>ID</th>
// // //               <th>Compensation Plan Name</th>
// // //               <th>All Details</th>
// // //               <th>Last Edited</th>
// // //               <th>Edit</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {compensations.map((comp) => (
// // //               <tr key={comp.id}>
// // //                 <td>{comp.id}</td>
// // //                 <td>{comp.compensation_plan_name}</td>
// // //                 <td>
// // //                   <button
// // //                     className="vendor-view-doc-btn"
// // //                     onClick={() => handleViewPopup(comp.plan_data)}
// // //                   >
// // //                     <FaEye size={16} style={{ marginRight: '5px' }} /> View
// // //                   </button>
// // //                 </td>
// // //                 <td>
// // //                   {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : '-'}
// // //                 </td>
// // //                 <td>
// // //                   <button
// // //                     className="vendor-edit-btn"
// // //                     onClick={() => handleEdit(comp)}
// // //                     title="Edit Compensation"
// // //                   >
// // //                     <FaPencilAlt size={16} />
// // //                   </button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       {isPopupOpen && categories[currentStep - 1] && (
// // //         <div className="compensation-popup-overlay">
// // //           <div className="compensation-popup">
// // //             <div className="compensation-popup-header">
// // //               <h2>{isEditing ? 'Edit Compensation' : 'Create Compensation'}</h2>
// // //               <button onClick={togglePopup} className="compensation-close-button">
// // //                 ×
// // //               </button>
// // //             </div>
// // //             <div className="compensation-progress-bar">
// // //               {categories.map((category, index) => (
// // //                 <React.Fragment key={index}>
// // //                   <div
// // //                     className={`progress-step ${currentStep === index + 1 ? 'active' : ''}`}
// // //                     onClick={() => handleStepChange(index + 1)}
// // //                     style={{ cursor: 'pointer' }}
// // //                   >
// // //                     <span className="step-number">{index + 1}</span>
// // //                     <span className="step-label">{category.title}</span>
// // //                   </div>
// // //                   {index < categories.length - 1 && (
// // //                     <div className="progress-connector">
// // //                       <span className="progress-line"></span>
// // //                       <span className="progress-dot"></span>
// // //                       <span className="progress-line"></span>
// // //                     </div>
// // //                   )}
// // //                 </React.Fragment>
// // //               ))}
// // //             </div>
// // //             <div className="compensation-popup-content">
// // //               <div className="compensation-form-section">
// // //                 <div className="compensation-category">
// // //                   <h3>{categories[currentStep - 1].title}</h3>
// // //                   {categories[currentStep - 1].fields.map((field, idx) =>
// // //                     field.component ? (
// // //                       <React.Fragment key={idx}>{field.component}</React.Fragment>
// // //                     ) : (
// // //                       renderCategoryField(field)
// // //                     )
// // //                   )}
// // //                 </div>
// // //                 <div className="compensation-button-container">
// // //                   <button
// // //                     className="compensation-back-button"
// // //                     onClick={() => handleStepChange(currentStep - 1)}
// // //                     disabled={currentStep === 1}
// // //                   >
// // //                     Back
// // //                   </button>
// // //                   {currentStep < categories.length && (
// // //                     <button
// // //                       className="compensation-add-button"
// // //                       onClick={() => handleStepChange(currentStep + 1)}
// // //                     >
// // //                       Next
// // //                     </button>
// // //                   )}
// // //                   {currentStep === categories.length && (
// // //                     <>
// // //                       <button className="compensation-preview-button" onClick={handlePreview}>
// // //                         Preview Compensation
// // //                       </button>
// // //                       <button className="compensation-add-button" onClick={handleSubmit}>
// // //                         {isEditing ? 'Update Compensation' : 'Save Compensation'}
// // //                       </button>
// // //                     </>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {viewExecCompensation && (
// // //         <div className="compensation-popup-overlay">
// // //           <div className="compensation-popup">
// // //             <div className="compensation-popup-header">
// // //               <h2>Compensation Details</h2>
// // //               <button onClick={() => setViewExecCompensation(null)} className="compensation-close-button">
// // //                 ×
// // //               </button>
// // //             </div>
// // //             <div className="compensation-popup-content">
// // //               <table className="compensation-preview-table">
// // //                 <thead>
// // //                   <tr className="header-row">
// // //                     <th>Field</th>
// // //                     <th>Value</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {Object.entries(viewExecCompensation).map(([key, value]) => (
// // //                     <tr key={key}>
// // //                       <td>{formatFieldName(key)}</td>
// // //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {previewModal && (
// // //         <div className="compensation-popup-overlay">
// // //           <div className="compensation-popup">
// // //             <div className="compensation-popup-header">
// // //               <h2>Preview Compensation</h2>
// // //               <button onClick={closePreview} className="compensation-close-button">
// // //                 ×
// // //               </button>
// // //             </div>
// // //             <div className="compensation-popup-content">
// // //               <table className="compensation-preview-table">
// // //                 <thead>
// // //                   <tr className="header-row">
// // //                     <th>Field</th>
// // //                     <th>Value</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {Object.entries(formData).map(([key, value]) => (
// // //                     <tr key={key}>
// // //                       <td>{formatFieldName(key)}</td>
// // //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <Modal
// // //         isVisible={alertModal.isVisible}
// // //         onClose={closeAlert}
// // //         buttons={[{ label: 'OK', onClick: closeAlert }]}
// // //       >
// // //         <p>{alertModal.message}</p>
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default CreateCompensation;
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import './createCompensation.css';
// // import { FaEye, FaPencilAlt } from 'react-icons/fa';
// // import Modal from '../Modal/Modal';

// // const API_KEY = process.env.REACT_APP_API_KEY;

// // const CreateCompensation = () => {
// //   const [isPopupOpen, setIsPopupOpen] = useState(false);
// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editingCompensationId, setEditingCompensationId] = useState(null);
// //   const [previewModal, setPreviewModal] = useState(false);
// //   const [formData, setFormData] = useState({
// //     compensationPlanName: '',
// //     isPFApplicable: false,
// //     pfPercentage: '',
// //     pfAmount: '',
// //     pfType: 'percentage',
// //     isPFEmployer: false,
// //     pfEmployerPercentage: '',
// //     pfEmployerAmount: '',
// //     pfEmployerType: 'percentage',
// //     isPFEmployee: false,
// //     pfEmployeePercentage: '',
// //     pfEmployeeAmount: '',
// //     pfEmployeeType: 'percentage',
// //     isMedicalApplicable: false,
// //     isESICEmployee: false,
// //     esicEmployeePercentage: '',
// //     esicEmployeeAmount: '',
// //     esicEmployeeType: 'percentage',
// //     isInsuranceEmployee: false,
// //     insuranceEmployeePercentage: '',
// //     insuranceEmployeeAmount: '',
// //     insuranceEmployeeType: 'percentage',
// //     isGratuityApplicable: false,
// //     gratuityPercentage: '',
// //     gratuityAmount: '',
// //     gratuityType: 'percentage',
// //     isProfessionalTax: false,
// //     professionalTax: '',
// //     professionalTaxAmount: '',
// //     professionalTaxType: 'percentage',
// //     isVariablePay: false,
// //     variablePay: '',
// //     variablePayAmount: '',
// //     variablePayType: 'percentage',
// //     isStatutoryBonus: false,
// //     statutoryBonusPercentage: '',
// //     statutoryBonusAmount: '',
// //     statutoryBonusType: 'percentage',
// //     isBasicSalary: false,
// //     basicSalary: '',
// //     basicSalaryAmount: '',
// //     basicSalaryType: 'amount',
// //     isHouseRentAllowance: false,
// //     houseRentAllowance: '',
// //     houseRentAllowanceAmount: '',
// //     houseRentAllowanceType: 'amount',
// //     isLtaAllowance: false,
// //     ltaAllowance: '',
// //     ltaAllowanceAmount: '',
// //     ltaAllowanceType: 'amount',
// //     isOtherAllowance: false,
// //     otherAllowance: '',
// //     otherAllowanceAmount: '',
// //     otherAllowanceType: 'amount',
// //     isStatutoryBonusAmount: false,
// //     statutoryBonus: '',
// //     statutoryBonusFixedAmount: '',
// //     statutoryBonusFixedType: 'amount',
// //     isVariablePayAmount: false,
// //     variablePayAmount: '',
// //     variablePayFixedAmount: '',
// //     variablePayFixedType: 'amount',
// //     isOvertimePay: false,
// //     overtimePayType: 'hourly',
// //     overtimePayAmount: '',
// //     overtimePayUnits: '',
// //     isIncentives: false,
// //     incentives: '',
// //     incentivesAmount: '',
// //     incentivesType: 'amount',
// //     isDefaultWorkingHours: false,
// //     defaultWorkingHours: ''
// //   });
// //   const [compensations, setCompensations] = useState([]);
// //   const [alertModal, setAlertModal] = useState({
// //     isVisible: false,
// //     title: '',
// //     message: '',
// //   });
// //   const [viewExecCompensation, setViewExecCompensation] = useState(null);
// //   const [error, setError] = useState('');
// //   const meId = JSON.parse(localStorage.getItem('dashboardData') || '{}').employeeId;

// //   const showAlert = (message, title = '') => {
// //     setAlertModal({ isVisible: true, title, message });
// //   };

// //   const closeAlert = () => {
// //     setAlertModal({ isVisible: false, title: '', message: '' });
// //   };

// //   const togglePopup = () => {
// //     setIsPopupOpen(!isPopupOpen);
// //     setIsEditing(false);
// //     setEditingCompensationId(null);
// //     setCurrentStep(1);
// //     setFormData({
// //       compensationPlanName: '',
// //       isPFApplicable: false,
// //       pfPercentage: '',
// //       pfAmount: '',
// //       pfType: 'percentage',
// //       isPFEmployer: false,
// //       pfEmployerPercentage: '',
// //       pfEmployerAmount: '',
// //       pfEmployerType: 'percentage',
// //       isPFEmployee: false,
// //       pfEmployeePercentage: '',
// //       pfEmployeeAmount: '',
// //       pfEmployeeType: 'percentage',
// //       isMedicalApplicable: false,
// //       isESICEmployee: false,
// //       esicEmployeePercentage: '',
// //       esicEmployeeAmount: '',
// //       esicEmployeeType: 'percentage',
// //       isInsuranceEmployee: false,
// //       insuranceEmployeePercentage: '',
// //       insuranceEmployeeAmount: '',
// //       insuranceEmployeeType: 'percentage',
// //       isGratuityApplicable: false,
// //       gratuityPercentage: '',
// //       gratuityAmount: '',
// //       gratuityType: 'percentage',
// //       isProfessionalTax: false,
// //       professionalTax: '',
// //       professionalTaxAmount: '',
// //       professionalTaxType: 'percentage',
// //       isVariablePay: false,
// //       variablePay: '',
// //       variablePayAmount: '',
// //       variablePayType: 'percentage',
// //       isStatutoryBonus: false,
// //       statutoryBonusPercentage: '',
// //       statutoryBonusAmount: '',
// //       statutoryBonusType: 'percentage',
// //       isBasicSalary: false,
// //       basicSalary: '',
// //       basicSalaryAmount: '',
// //       basicSalaryType: 'amount',
// //       isHouseRentAllowance: false,
// //       houseRentAllowance: '',
// //       houseRentAllowanceAmount: '',
// //       houseRentAllowanceType: 'amount',
// //       isLtaAllowance: false,
// //       ltaAllowance: '',
// //       ltaAllowanceAmount: '',
// //       ltaAllowanceType: 'amount',
// //       isOtherAllowance: false,
// //       otherAllowance: '',
// //       otherAllowanceAmount: '',
// //       otherAllowanceType: 'amount',
// //       isStatutoryBonusAmount: false,
// //       statutoryBonus: '',
// //       statutoryBonusFixedAmount: '',
// //       statutoryBonusFixedType: 'amount',
// //       isVariablePayAmount: false,
// //       variablePayAmount: '',
// //       variablePayFixedAmount: '',
// //       variablePayFixedType: 'amount',
// //       isOvertimePay: false,
// //       overtimePayType: 'hourly',
// //       overtimePayAmount: '',
// //       overtimePayUnits: '',
// //       isIncentives: false,
// //       incentives: '',
// //       incentivesAmount: '',
// //       incentivesType: 'amount',
// //       isDefaultWorkingHours: false,
// //       defaultWorkingHours: ''
// //     });
// //     setError('');
// //   };

// //   const handleCheckboxChange = (field, value) => {
// //     setFormData((prev) => {
// //       const newData = { ...prev, [field]: value === 'yes' };
// //       if (value !== 'yes') {
// //         if (field === 'isPFApplicable') {
// //           newData.pfPercentage = '';
// //           newData.pfAmount = '';
// //           newData.isPFEmployer = false;
// //           newData.pfEmployerPercentage = '';
// //           newData.pfEmployerAmount = '';
// //           newData.isPFEmployee = false;
// //           newData.pfEmployeePercentage = '';
// //           newData.pfEmployeeAmount = '';
// //         }
// //         if (field === 'isPFEmployer') {
// //           newData.pfEmployerPercentage = '';
// //           newData.pfEmployerAmount = '';
// //         }
// //         if (field === 'isPFEmployee') {
// //           newData.pfEmployeePercentage = '';
// //           newData.pfEmployeeAmount = '';
// //         }
// //         if (field === 'isMedicalApplicable') {
// //           newData.isESICEmployee = false;
// //           newData.esicEmployeePercentage = '';
// //           newData.esicEmployeeAmount = '';
// //           newData.isInsuranceEmployee = false;
// //           newData.insuranceEmployeePercentage = '';
// //           newData.insuranceEmployeeAmount = '';
// //         }
// //         if (field === 'isESICEmployee') {
// //           newData.esicEmployeePercentage = '';
// //           newData.esicEmployeeAmount = '';
// //         }
// //         if (field === 'isInsuranceEmployee') {
// //           newData.insuranceEmployeePercentage = '';
// //           newData.insuranceEmployeeAmount = '';
// //         }
// //         if (field === 'isGratuityApplicable') {
// //           newData.gratuityPercentage = '';
// //           newData.gratuityAmount = '';
// //         }
// //         if (field === 'isProfessionalTax') {
// //           newData.professionalTax = '';
// //           newData.professionalTaxAmount = '';
// //         }
// //         if (field === 'isVariablePay') {
// //           newData.variablePay = '';
// //           newData.variablePayAmount = '';
// //         }
// //         if (field === 'isStatutoryBonus') {
// //           newData.statutoryBonusPercentage = '';
// //           newData.statutoryBonusAmount = '';
// //         }
// //         if (field === 'isBasicSalary') {
// //           newData.basicSalary = '';
// //           newData.basicSalaryAmount = '';
// //         }
// //         if (field === 'isHouseRentAllowance') {
// //           newData.houseRentAllowance = '';
// //           newData.houseRentAllowanceAmount = '';
// //         }
// //         if (field === 'isLtaAllowance') {
// //           newData.ltaAllowance = '';
// //           newData.ltaAllowanceAmount = '';
// //         }
// //         if (field === 'isOtherAllowance') {
// //           newData.otherAllowance = '';
// //           newData.otherAllowanceAmount = '';
// //         }
// //         if (field === 'isStatutoryBonusAmount') {
// //           newData.statutoryBonus = '';
// //           newData.statutoryBonusFixedAmount = '';
// //         }
// //         if (field === 'isVariablePayAmount') {
// //           newData.variablePayAmount = '';
// //           newData.variablePayFixedAmount = '';
// //         }
// //         if (field === 'isOvertimePay') {
// //           newData.overtimePayType = 'hourly';
// //           newData.overtimePayAmount = '';
// //           newData.overtimePayUnits = '';
// //         }
// //         if (field === 'isIncentives') {
// //           newData.incentives = '';
// //           newData.incentivesAmount = '';
// //         }
// //         if (field === 'isDefaultWorkingHours') {
// //           newData.defaultWorkingHours = '';
// //         }
// //       }
// //       return newData;
// //     });
// //   };

// //   const handleInputChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const fetchCompensations = async () => {
// //     try {
// //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/compensations/list`, {
// //         headers: { 'x-api-key': API_KEY, 'x-employee-id': meId },
// //       });
// //       if (response.data.success) {
// //         setCompensations(response.data.data || []);
// //       } else {
// //         throw new Error('Fetch unsuccessful: ' + (response.data.message || 'Unknown error'));
// //       }
// //     } catch (error) {
// //       console.error('Error fetching compensations:', error);
// //       showAlert('Failed to fetch compensations: ' + (error.message || 'Network error'));
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCompensations();
// //   }, []);

// //   const handleEdit = (compensation) => {
// //     setIsEditing(true);
// //     setEditingCompensationId(compensation.id);
// //     setFormData({
// //       compensationPlanName: compensation.compensation_plan_name || '',
// //       isPFApplicable: compensation.plan_data?.isPFApplicable || false,
// //       pfPercentage: compensation.plan_data?.pfPercentage || '',
// //       pfAmount: compensation.plan_data?.pfAmount || '',
// //       pfType: compensation.plan_data?.pfType || 'percentage',
// //       isPFEmployer: compensation.plan_data?.isPFEmployer || false,
// //       pfEmployerPercentage: compensation.plan_data?.pfEmployerPercentage || '',
// //       pfEmployerAmount: compensation.plan_data?.pfEmployerAmount || '',
// //       pfEmployerType: compensation.plan_data?.pfEmployerType || 'percentage',
// //       isPFEmployee: compensation.plan_data?.isPFEmployee || false,
// //       pfEmployeePercentage: compensation.plan_data?.pfEmployeePercentage || '',
// //       pfEmployeeAmount: compensation.plan_data?.pfEmployeeAmount || '',
// //       pfEmployeeType: compensation.plan_data?.pfEmployeeType || 'percentage',
// //       isMedicalApplicable: compensation.plan_data?.isMedicalApplicable || false,
// //       isESICEmployee: compensation.plan_data?.isESICEmployee || false,
// //       esicEmployeePercentage: compensation.plan_data?.esicEmployeePercentage || '',
// //       esicEmployeeAmount: compensation.plan_data?.esicEmployeeAmount || '',
// //       esicEmployeeType: compensation.plan_data?.esicEmployeeType || 'percentage',
// //       isInsuranceEmployee: compensation.plan_data?.isInsuranceEmployee || false,
// //       insuranceEmployeePercentage: compensation.plan_data?.insuranceEmployeePercentage || '',
// //       insuranceEmployeeAmount: compensation.plan_data?.insuranceEmployeeAmount || '',
// //       insuranceEmployeeType: compensation.plan_data?.insuranceEmployeeType || 'percentage',
// //       isGratuityApplicable: compensation.plan_data?.isGratuityApplicable || false,
// //       gratuityPercentage: compensation.plan_data?.gratuityPercentage || '',
// //       gratuityAmount: compensation.plan_data?.gratuityAmount || '',
// //       gratuityType: compensation.plan_data?.gratuityType || 'percentage',
// //       isProfessionalTax: compensation.plan_data?.isProfessionalTax || false,
// //       professionalTax: compensation.plan_data?.professionalTax || '',
// //       professionalTaxAmount: compensation.plan_data?.professionalTaxAmount || '',
// //       professionalTaxType: compensation.plan_data?.professionalTaxType || 'percentage',
// //       isVariablePay: compensation.plan_data?.isVariablePay || false,
// //       variablePay: compensation.plan_data?.variablePay || '',
// //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// //       variablePayType: compensation.plan_data?.variablePayType || 'percentage',
// //       isStatutoryBonus: compensation.plan_data?.isStatutoryBonus || false,
// //       statutoryBonusPercentage: compensation.plan_data?.statutoryBonusPercentage || '',
// //       statutoryBonusAmount: compensation.plan_data?.statutoryBonusAmount || '',
// //       statutoryBonusType: compensation.plan_data?.statutoryBonusType || 'percentage',
// //       isBasicSalary: compensation.plan_data?.isBasicSalary || false,
// //       basicSalary: compensation.plan_data?.basicSalary || '',
// //       basicSalaryAmount: compensation.plan_data?.basicSalaryAmount || '',
// //       basicSalaryType: compensation.plan_data?.basicSalaryType || 'amount',
// //       isHouseRentAllowance: compensation.plan_data?.isHouseRentAllowance || false,
// //       houseRentAllowance: compensation.plan_data?.houseRentAllowance || '',
// //       houseRentAllowanceAmount: compensation.plan_data?.houseRentAllowanceAmount || '',
// //       houseRentAllowanceType: compensation.plan_data?.houseRentAllowanceType || 'amount',
// //       isLtaAllowance: compensation.plan_data?.isLtaAllowance || false,
// //       ltaAllowance: compensation.plan_data?.ltaAllowance || '',
// //       ltaAllowanceAmount: compensation.plan_data?.ltaAllowanceAmount || '',
// //       ltaAllowanceType: compensation.plan_data?.ltaAllowanceType || 'amount',
// //       isOtherAllowance: compensation.plan_data?.isOtherAllowance || false,
// //       otherAllowance: compensation.plan_data?.otherAllowance || '',
// //       otherAllowanceAmount: compensation.plan_data?.otherAllowanceAmount || '',
// //       otherAllowanceType: compensation.plan_data?.otherAllowanceType || 'amount',
// //       isStatutoryBonusAmount: compensation.plan_data?.isStatutoryBonusAmount || false,
// //       statutoryBonus: compensation.plan_data?.statutoryBonus || '',
// //       statutoryBonusFixedAmount: compensation.plan_data?.statutoryBonusFixedAmount || '',
// //       statutoryBonusFixedType: compensation.plan_data?.statutoryBonusFixedType || 'amount',
// //       isVariablePayAmount: compensation.plan_data?.isVariablePayAmount || false,
// //       variablePayAmount: compensation.plan_data?.variablePayAmount || '',
// //       variablePayFixedAmount: compensation.plan_data?.variablePayFixedAmount || '',
// //       variablePayFixedType: compensation.plan_data?.variablePayFixedType || 'amount',
// //       isOvertimePay: compensation.plan_data?.isOvertimePay || false,
// //       overtimePayType: compensation.plan_data?.overtimePayType || 'hourly',
// //       overtimePayAmount: compensation.plan_data?.overtimePayAmount || '',
// //       overtimePayUnits: compensation.plan_data?.overtimePayUnits || '',
// //       isIncentives: compensation.plan_data?.isIncentives || false,
// //       incentives: compensation.plan_data?.incentives || '',
// //       incentivesAmount: compensation.plan_data?.incentivesAmount || '',
// //       incentivesType: compensation.plan_data?.incentivesType || 'amount',
// //       isDefaultWorkingHours: compensation.plan_data?.isDefaultWorkingHours || false,
// //       defaultWorkingHours: compensation.plan_data?.defaultWorkingHours || ''
// //     });
// //     setIsPopupOpen(true);
// //     setCurrentStep(1);
// //     setError('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!formData.compensationPlanName.trim()) {
// //       showAlert('Compensation Plan Name is required and cannot be empty');
// //       return;
// //     }

// //     if (formData.isIncentives && !formData.incentivesAmount.trim()) {
// //       showAlert('Incentives amount is required when incentives are enabled');
// //       return;
// //     }

// //     if (formData.isDefaultWorkingHours && !formData.defaultWorkingHours.trim()) {
// //       showAlert('Default Working Hours is required when enabled');
// //       return;
// //     }

// //     const data = {
// //       compensationPlanName: formData.compensationPlanName,
// //       formData: {
// //         isPFApplicable: formData.isPFApplicable,
// //         pfPercentage: formData.pfPercentage,
// //         pfAmount: formData.pfAmount,
// //         pfType: formData.pfType,
// //         isPFEmployer: formData.isPFEmployer,
// //         pfEmployerPercentage: formData.pfEmployerPercentage,
// //         pfEmployerAmount: formData.pfEmployerAmount,
// //         pfEmployerType: formData.pfEmployerType,
// //         isPFEmployee: formData.isPFEmployee,
// //         pfEmployeePercentage: formData.pfEmployeePercentage,
// //         pfEmployeeAmount: formData.pfEmployeeAmount,
// //         pfEmployeeType: formData.pfEmployeeType,
// //         isMedicalApplicable: formData.isMedicalApplicable,
// //         isESICEmployee: formData.isESICEmployee,
// //         esicEmployeePercentage: formData.esicEmployeePercentage,
// //         esicEmployeeAmount: formData.esicEmployeeAmount,
// //         esicEmployeeType: formData.esicEmployeeType,
// //         isInsuranceEmployee: formData.isInsuranceEmployee,
// //         insuranceEmployeePercentage: formData.insuranceEmployeePercentage,
// //         insuranceEmployeeAmount: formData.insuranceEmployeeAmount,
// //         insuranceEmployeeType: formData.insuranceEmployeeType,
// //         isGratuityApplicable: formData.isGratuityApplicable,
// //         gratuityPercentage: formData.gratuityPercentage,
// //         gratuityAmount: formData.gratuityAmount,
// //         gratuityType: formData.gratuityType,
// //         isProfessionalTax: formData.isProfessionalTax,
// //         professionalTax: formData.professionalTax,
// //         professionalTaxAmount: formData.professionalTaxAmount,
// //         professionalTaxType: formData.professionalTaxType,
// //         isVariablePay: formData.isVariablePay,
// //         variablePay: formData.variablePay,
// //         variablePayAmount: formData.variablePayAmount,
// //         variablePayType: formData.variablePayType,
// //         isStatutoryBonus: formData.isStatutoryBonus,
// //         statutoryBonusPercentage: formData.statutoryBonusPercentage,
// //         statutoryBonusAmount: formData.statutoryBonusAmount,
// //         statutoryBonusType: formData.statutoryBonusType,
// //         isBasicSalary: formData.isBasicSalary,
// //         basicSalary: formData.basicSalary,
// //         basicSalaryAmount: formData.basicSalaryAmount,
// //         basicSalaryType: formData.basicSalaryType,
// //         isHouseRentAllowance: formData.isHouseRentAllowance,
// //         houseRentAllowance: formData.houseRentAllowance,
// //         houseRentAllowanceAmount: formData.houseRentAllowanceAmount,
// //         houseRentAllowanceType: formData.houseRentAllowanceType,
// //         isLtaAllowance: formData.isLtaAllowance,
// //         ltaAllowance: formData.ltaAllowance,
// //         ltaAllowanceAmount: formData.ltaAllowanceAmount,
// //         ltaAllowanceType: formData.ltaAllowanceType,
// //         isOtherAllowance: formData.isOtherAllowance,
// //         otherAllowance: formData.otherAllowance,
// //         otherAllowanceAmount: formData.otherAllowanceAmount,
// //         otherAllowanceType: formData.otherAllowanceType,
// //         isStatutoryBonusAmount: formData.isStatutoryBonusAmount,
// //         statutoryBonus: formData.statutoryBonus,
// //         statutoryBonusFixedAmount: formData.statutoryBonusFixedAmount,
// //         statutoryBonusFixedType: formData.statutoryBonusFixedType,
// //         isVariablePayAmount: formData.isVariablePayAmount,
// //         variablePayAmount: formData.variablePayAmount,
// //         variablePayFixedAmount: formData.variablePayFixedAmount,
// //         variablePayFixedType: formData.variablePayFixedType,
// //         isOvertimePay: formData.isOvertimePay,
// //         overtimePayType: formData.overtimePayType,
// //         overtimePayAmount: formData.overtimePayAmount,
// //         overtimePayUnits: formData.overtimePayUnits,
// //         isIncentives: formData.isIncentives,
// //         incentives: formData.incentives,
// //         incentivesAmount: formData.incentivesAmount,
// //         incentivesType: formData.incentivesType,
// //         isDefaultWorkingHours: formData.isDefaultWorkingHours,
// //         defaultWorkingHours: formData.defaultWorkingHours
// //       }
// //     };

// //     try {
// //       let response;
// //       if (isEditing) {
// //         data.id = editingCompensationId;
// //         response = await axios.put(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/update/${editingCompensationId}`,
// //           data,
// //           {
// //             headers: {
// //               'x-api-key': API_KEY,
// //               'x-employee-id': meId,
// //               'Content-Type': 'application/json',
// //             },
// //           }
// //         );
// //         showAlert('Compensation updated successfully!');
// //       } else {
// //         response = await axios.post(
// //           `${process.env.REACT_APP_BACKEND_URL}/api/compensations/add`,
// //           data,
// //           {
// //             headers: {
// //               'x-api-key': API_KEY,
// //               'x-employee-id': meId,
// //               'Content-Type': 'application/json',
// //             },
// //           }
// //         );
// //         showAlert('Compensation created successfully!');
// //       }
// //       togglePopup();
// //       fetchCompensations();
// //     } catch (error) {
// //       const errorMessage = error.response?.data?.error || error.message;
// //       showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
// //     }
// //   };

// //   const handleViewPopup = (planData) => {
// //     if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
// //       const mappedData = {
// //         compensationPlanName: formData.compensationPlanName,
// //         isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
// //         pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
// //         pfAmount: planData.pf_amount || planData.pfAmount || '',
// //         pfType: planData.pf_type || planData.pfType || 'percentage',
// //         isPFEmployer: planData.is_pf_employer || planData.isPFEmployer || false,
// //         pfEmployerPercentage: planData.pf_employer_percentage || planData.pfEmployerPercentage || '',
// //         pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
// //         pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'percentage',
// //         isPFEmployee: planData.is_pf_employee || planData.isPFEmployee || false,
// //         pfEmployeePercentage: planData.pf_employee_percentage || planData.pfEmployeePercentage || '',
// //         pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
// //         pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
// //         isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
// //         isESICEmployee: planData.is_esic_employee || planData.isESICEmployee || false,
// //         esicEmployeePercentage: planData.esic_employee_percentage || planData.esicEmployeePercentage || '',
// //         esicEmployeeAmount: planData.esic_employee_amount || planData.esicEmployeeAmount || '',
// //         esicEmployeeType: planData.esic_employee_type || planData.esicEmployeeType || 'percentage',
// //         isInsuranceEmployee: planData.is_insurance_employee || planData.isInsuranceEmployee || false,
// //         insuranceEmployeePercentage: planData.insurance_employee_percentage || planData.insuranceEmployeePercentage || '',
// //         insuranceEmployeeAmount: planData.insurance_employee_amount || planData.insuranceEmployeeAmount || '',
// //         insuranceEmployeeType: planData.insurance_employee_type || planData.insuranceEmployeeType || 'percentage',
// //         isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
// //         gratuityPercentageI: planData.gratuity_percentage || planData.gratuityPercentage || '',
// //         gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
// //         gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
// //         isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
// //         professionalTax: planData.professional_tax || planData.professionalTax || '',
// //         professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
// //         professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
// //         isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
// //         variablePay: planData.variable_pay || planData.variablePay || '',
// //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// //         variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
// //         isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
// //         statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
// //         statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
// //         statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
// //         isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
// //         basicSalary: planData.basic_salary || planData.basicSalary || '',
// //         basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
// //         basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
// //         isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
// //         houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
// //         houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
// //         houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
// //         isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
// //         ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
// //         ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
// //         ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
// //         isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
// //         otherAllowance: planData.other_allowance || planData.otherAllowance || '',
// //         otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
// //         otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
// //         isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
// //         statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
// //         statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
// //         statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
// //         isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
// //         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
// //         variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
// //         variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
// //         isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
// //         overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
// //         overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
// //         overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
// //         isIncentives: planData.is_incentives || planData.isIncentives || false,
// //         incentives: planData.incentives || '',
// //         incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
// //         incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
// //         isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
// //         defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || ''
// //       };
// //       setViewExecCompensation(mappedData);
// //     } else {
// //       showAlert('Failed to display compensation details: Invalid data format');
// //     }
// //   };

// //   const handlePreview = () => {
// //     setPreviewModal(true);
// //   };

// //   const closePreview = () => {
// //     setPreviewModal(false);
// //   };

// //   const formatFieldName = (key) => {
// //     return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
// //   };

// //   const handleStepChange = (step) => {
// //     const newStep = Math.max(1, Math.min(step, categories.length));
// //     setCurrentStep(newStep);
// //   };

// //   const renderCategoryField = ({ label, field, percentageField, amountField, typeField, required = false }) => (
// //     <div key={field} className="compensation-form-group">
// //       <span className="compensation-label-text">
// //         {label} {required && <span style={{ color: 'red' }}>*</span>}
// //       </span>
// //       <div className="compensation-checkbox-group">
// //         <label className="compensation-checkbox-label">
// //           <input
// //             type="checkbox"
// //             checked={formData[field]}
// //             onChange={() => handleCheckboxChange(field, 'yes')}
// //             className="compensation-checkbox"
// //           />
// //           <span>Yes</span>
// //         </label>
// //         <label className="compensation-checkbox-label">
// //           <input
// //             type="checkbox"
// //             checked={!formData[field] && formData[field] !== undefined}
// //             onChange={() => handleCheckboxChange(field, 'no')}
// //             className="compensation-checkbox"
// //           />
// //           <span>No</span>
// //         </label>
// //       </div>
// //       {formData[field] && percentageField && amountField && typeField && (
// //         <div className="compensation-input-group">
// //           <select
// //             value={formData[typeField]}
// //             onChange={(e) => handleInputChange(typeField, e.target.value)}
// //             className="compensation-select"
// //           >
// //             <option value="percentage">Percentage</option>
// //             <option value="amount">Fixed Amount</option>
// //           </select>
// //           {formData[typeField] === 'percentage' ? (
// //             <input
// //               type="number"
// //               placeholder="Percentage"
// //               value={formData[percentageField]}
// //               onChange={(e) => handleInputChange(percentageField, e.target.value)}
// //               className="compensation-percentage-input"
// //               required={required}
// //             />
// //           ) : (
// //             <input
// //               type="number"
// //               placeholder="Amount"
// //               value={formData[amountField]}
// //               onChange={(e) => handleInputChange(amountField, e.target.value)}
// //               className="compensation-number-input"
// //               required={required}
// //             />
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );

// //   const categories = [
// //     {
// //       title: 'Plan Details',
// //       fields: [
// //         {
// //           component: (
// //             <div className="compensation-form-group">
// //               <span className="compensation-label-text">Compensation Plan Name <span style={{ color: 'red' }}>*</span></span>
// //               <input
// //                 type="text"
// //                 placeholder="Enter Plan Name"
// //                 value={formData.compensationPlanName}
// //                 onChange={(e) => handleInputChange('compensationPlanName', e.target.value)}
// //                 className="compensation-highlighted-input"
// //                 required
// //               />
// //             </div>
// //           )
// //         },
// //         {
// //           component: (
// //             <div className="compensation-form-group">
// //               <span className="compensation-label-text">
// //                 Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: 'red' }}>*</span>
// //               </span>
// //               <div className="compensation-checkbox-group">
// //                 <label className="compensation-checkbox-label">
// //                   <input
// //                     type="checkbox"
// //                     checked={formData.isDefaultWorkingHours}
// //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'yes')}
// //                     className="compensation-checkbox"
// //                   />
// //                   <span>Yes</span>
// //                 </label>
// //                 <label className="compensation-checkbox-label">
// //                   <input
// //                     type="checkbox"
// //                     checked={!formData.isDefaultWorkingHours && formData.isDefaultWorkingHours !== undefined}
// //                     onChange={() => handleCheckboxChange('isDefaultWorkingHours', 'no')}
// //                     className="compensation-checkbox"
// //                   />
// //                   <span>No</span>
// //                 </label>
// //               </div>
// //               {formData.isDefaultWorkingHours && (
// //                 <div className="compensation-input-group">
// //                   <input
// //                     type="number"
// //                     placeholder="Hours"
// //                     value={formData.defaultWorkingHours}
// //                     onChange={(e) => handleInputChange('defaultWorkingHours', e.target.value)}
// //                     className="compensation-number-input"
// //                     required
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           )
// //         }
// //       ]
// //     },
// //     {
// //       title: 'PF and Medical Contributions',
// //       fields: [
// //         {
// //           label: 'PF Applicable',
// //           field: 'isPFApplicable',
// //           percentageField: 'pfPercentage',
// //           amountField: 'pfAmount',
// //           typeField: 'pfType',
// //         },
// //         ...(formData.isPFApplicable ? [
// //           {
// //             label: 'PF of Employee',
// //             field: 'isPFEmployee',
// //             percentageField: 'pfEmployeePercentage',
// //             amountField: 'pfEmployeeAmount',
// //             typeField: 'pfEmployeeType',
// //           },
// //           {
// //             label: 'PF of Employer',
// //             field: 'isPFEmployer',
// //             percentageField: 'pfEmployerPercentage',
// //             amountField: 'pfEmployerAmount',
// //             typeField: 'pfEmployerType',
// //           }
// //         ] : []),
// //         {
// //           label: 'Medical Applicable',
// //           field: 'isMedicalApplicable',
// //           percentageField: '',
// //           amountField: '',
// //           typeField: '',
// //         },
// //         ...(formData.isMedicalApplicable ? [
// //           {
// //             label: 'ESIC of Employee',
// //             field: 'isESICEmployee',
// //             percentageField: 'esicEmployeePercentage',
// //             amountField: 'esicEmployeeAmount',
// //             typeField: 'esicEmployeeType',
// //           },
// //           {
// //             label: 'Insurance of Employee',
// //             field: 'isInsuranceEmployee',
// //             percentageField: 'insuranceEmployeePercentage',
// //             amountField: 'insuranceEmployeeAmount',
// //             typeField: 'insuranceEmployeeType',
// //           }
// //         ] : [])
// //       ]
// //     },
// //     {
// //       title: 'Allowances',
// //       fields: [
// //         {
// //           label: 'Basic Salary',
// //           field: 'isBasicSalary',
// //           percentageField: 'basicSalary',
// //           amountField: 'basicSalaryAmount',
// //           typeField: 'basicSalaryType',
// //         },
// //         {
// //           label: 'House Rent Allowance',
// //           field: 'isHouseRentAllowance',
// //           percentageField: 'houseRentAllowance',
// //           amountField: 'houseRentAllowanceAmount',
// //           typeField: 'houseRentAllowanceType',
// //         },
// //         {
// //           label: 'LTA Allowance',
// //           field: 'isLtaAllowance',
// //           percentageField: 'ltaAllowance',
// //           amountField: 'ltaAllowanceAmount',
// //           typeField: 'ltaAllowanceType',
// //         },
// //         {
// //           label: 'Other Allowance',
// //           field: 'isOtherAllowance',
// //           percentageField: 'otherAllowance',
// //           amountField: 'otherAllowanceAmount',
// //           typeField: 'otherAllowanceType',
// //         },
// //       ]
// //     },
// //     {
// //       title: ' Statutory Components',
// //       fields: [
// //         {
// //           label: 'Gratuity Applicable',
// //           field: 'isGratuityApplicable',
// //           percentageField: 'gratuityPercentage',
// //           amountField: 'gratuityAmount',
// //           typeField: 'gratuityType',
// //         },
// //         {
// //           label: 'Professional Tax (Monthly)',
// //           field: 'isProfessionalTax',
// //           percentageField: 'professionalTax',
// //           amountField: 'professionalTaxAmount',
// //           typeField: 'professionalTaxType',
// //         },
// //         {
// //           label: 'Variable Pay / Bonus (Yearly)',
// //           field: 'isVariablePay',
// //           percentageField: 'variablePay',
// //           amountField: 'variablePayAmount',
// //           typeField: 'variablePayType',
// //         },
// //         {
// //           label: 'Statutory Bonus',
// //           field: 'isStatutoryBonus',
// //           percentageField: 'statutoryBonusPercentage',
// //           amountField: 'statutoryBonusAmount',
// //           typeField: 'statutoryBonusType',
// //         },
// //         {
// //           label: 'Incentives',
// //           field: 'isIncentives',
// //           percentageField: 'incentives',
// //           amountField: 'incentivesAmount',
// //           typeField: 'incentivesType',
// //           required: true,
// //         },
// //         {
// //           component: (
// //             <div className="compensation-form-group">
// //               <span className="compensation-label-text">Overtime Pay</span>
// //               <div className="compensation-checkbox-group">
// //                 <label className="compensation-checkbox-label">
// //                   <input
// //                     type="checkbox"
// //                     checked={formData.isOvertimePay}
// //                     onChange={() => handleCheckboxChange('isOvertimePay', 'yes')}
// //                     className="compensation-checkbox"
// //                   />
// //                   <span>Yes</span>
// //                 </label>
// //                 <label className="compensation-checkbox-label">
// //                   <input
// //                     type="checkbox"
// //                     checked={!formData.isOvertimePay && formData.isOvertimePay !== undefined}
// //                     onChange={() => handleCheckboxChange('isOvertimePay', 'no')}
// //                     className="compensation-checkbox"
// //                   />
// //                   <span>No</span>
// //                 </label>
// //               </div>
// //               {formData.isOvertimePay && (
// //                 <div className="compensation-input-group">
// //                   <select
// //                     value={formData.overtimePayType}
// //                     onChange={(e) => handleInputChange('overtimePayType', e.target.value)}
// //                     className="compensation-select"
// //                   >
// //                     <option value="hourly">Hourly</option>
// //                     <option value="daily">Daily</option>
// //                     <option value="per unit">Per Unit</option>
// //                   </select>
// //                   <input
// //                     type="number"
// //                     placeholder={formData.overtimePayType === 'hourly' ? 'Rate per Hour' : formData.overtimePayType === 'daily' ? 'Rate per Day' : 'Rate per Unit'}
// //                     value={formData.overtimePayAmount}
// //                     onChange={(e) => handleInputChange('overtimePayAmount', e.target.value)}
// //                     className="compensation-number-input"
// //                   />
// //                   <input
// //                     type="number"
// //                     placeholder={formData.overtimePayType === 'hourly' ? 'Hours' : formData.overtimePayType === 'daily' ? 'Days' : 'Units'}
// //                     value={formData.overtimePayUnits}
// //                     onChange={(e) => handleInputChange('overtimePayUnits', e.target.value)}
// //                     className="compensation-number-input"
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           )
// //         },
// //       ]
// //     }
// //   ];

// //   return (
// //     <div className="compensation-container">
// //       <div className="header-container">
// //         <button className="compensation-create-button" onClick={togglePopup}>
// //           Create Compensation
// //         </button>
// //       </div>

// //       <div className="table-scroll-wrapper">
// //         <table className="compensation-table">
// //           <thead>
// //             <tr className="header-row">
// //               <th>ID</th>
// //               <th>Compensation Plan Name</th>
// //               <th>All Details</th>
// //               <th>Last Edited</th>
// //               <th>Edit</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {compensations.map((comp) => (
// //               <tr key={comp.id}>
// //                 <td>{comp.id}</td>
// //                 <td>{comp.compensation_plan_name}</td>
// //                 <td>
// //                   <button
// //                     className="vendor-view-doc-btn"
// //                     onClick={() => handleViewPopup(comp.plan_data)}
// //                   >
// //                     <FaEye size={16} style={{ marginRight: '5px' }} /> View
// //                   </button>
// //                 </td>
// //                 <td>
// //                   {comp.created_at ? new Date(comp.created_at).toLocaleDateString() : '-'}
// //                 </td>
// //                 <td>
// //                   <button
// //                     className="vendor-edit-btn"
// //                     onClick={() => handleEdit(comp)}
// //                     title="Edit Compensation"
// //                   >
// //                     <FaPencilAlt size={16} />
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {isPopupOpen && categories[currentStep - 1] && (
// //         <div className="compensation-popup-overlay">
// //           <div className="compensation-popup">
// //             <div className="compensation-popup-header">
// //               <h2>{isEditing ? 'Edit Compensation' : 'Create Compensation'}</h2>
// //               <button onClick={togglePopup} className="compensation-close-button">
// //                 ×
// //               </button>
// //             </div>
// //             <div className="compensation-progress-bar">
// //               {categories.map((category, index) => (
// //                 <React.Fragment key={index}>
// //                   <div
// //                     className={`progress-step ${currentStep === index + 1 ? 'active' : ''}`}
// //                     onClick={() => handleStepChange(index + 1)}
// //                     style={{ cursor: 'pointer' }}
// //                   >
// //                     <span className="step-number">{index + 1}</span>
// //                     <span className="step-label">{category.title}</span>
// //                   </div>
// //                   {index < categories.length - 1 && (
// //                     <div className="progress-connector">
// //                       <span className="progress-line"></span>
// //                       <span className="progress-dot"></span>
// //                       <span className="progress-line"></span>
// //                     </div>
// //                   )}
// //                 </React.Fragment>
// //               ))}
// //             </div>
// //             <div className="compensation-popup-content">
// //               <div className="compensation-form-section">
// //                 <div className="compensation-category">
// //                   <h3>{categories[currentStep - 1].title}</h3>
// //                   {categories[currentStep - 1].fields.map((field, idx) =>
// //                     field.component ? (
// //                       <React.Fragment key={idx}>{field.component}</React.Fragment>
// //                     ) : (
// //                       renderCategoryField(field)
// //                     )
// //                   )}
// //                 </div>
// //                 <div className="compensation-button-container">
// //                   <button
// //                     className="compensation-back-button"
// //                     onClick={() => handleStepChange(currentStep - 1)}
// //                     disabled={currentStep === 1}
// //                   >
// //                     Back
// //                   </button>
// //                   {currentStep < categories.length && (
// //                     <button
// //                       className="compensation-add-button"
// //                       onClick={() => handleStepChange(currentStep + 1)}
// //                     >
// //                       Next
// //                     </button>
// //                   )}
// //                   {currentStep === categories.length && (
// //                     <>
// //                       <button className="compensation-preview-button" onClick={handlePreview}>
// //                         Preview Compensation
// //                       </button>
// //                       <button className="compensation-add-button" onClick={handleSubmit}>
// //                         {isEditing ? 'Update Compensation' : 'Save Compensation'}
// //                       </button>
// //                     </>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {viewExecCompensation && (
// //         <div className="compensation-popup-overlay">
// //           <div className="compensation-popup">
// //             <div className="compensation-popup-header">
// //               <h2>Compensation Details</h2>
// //               <button onClick={() => setViewExecCompensation(null)} className="compensation-close-button">
// //                 ×
// //               </button>
// //             </div>
// //             <div className="compensation-popup-content">
// //               <table className="compensation-preview-table">
// //                 <thead>
// //                   <tr className="header-row">
// //                     <th>Field</th>
// //                     <th>Value</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {Object.entries(viewExecCompensation).map(([key, value]) => (
// //                     <tr key={key}>
// //                       <td>{formatFieldName(key)}</td>
// //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {previewModal && (
// //         <div className="compensation-popup-overlay">
// //           <div className="compensation-popup">
// //             <div className="compensation-popup-header">
// //               <h2>Preview Compensation</h2>
// //               <button onClick={closePreview} className="compensation-close-button">
// //                 ×
// //               </button>
// //             </div>
// //             <div className="compensation-popup-content">
// //               <table className="compensation-preview-table">
// //                 <thead>
// //                   <tr className="header-row">
// //                     <th>Field</th>
// //                     <th>Value</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {Object.entries(formData).map(([key, value]) => (
// //                     <tr key={key}>
// //                       <td>{formatFieldName(key)}</td>
// //                       <td>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}</td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <Modal
// //         isVisible={alertModal.isVisible}
// //         onClose={closeAlert}
// //         buttons={[{ label: 'OK', onClick: closeAlert }]}
// //       >
// //         <p>{alertModal.message}</p>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default CreateCompensation;
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
//     }
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
//       }
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
//         setCompensations(response.data.data || []);
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
//       }
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
//         defaultWorkingDays: formData.defaultWorkingDays
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

//   const handleViewPopup = (planData) => {
//     if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
//       const mappedData = {
//         compensationPlanName: formData.compensationPlanName,
//         isPFApplicable: planData.is_pf_applicable || planData.isPFApplicable || false,
//         pfPercentage: planData.pf_percentage || planData.pfPercentage || '',
//         pfAmount: planData.pf_amount || planData.pfAmount || '',
//         pfType: planData.pf_type || planData.pfType || 'percentage',
//         isPFEmployer: planData.is_pf_employer || planData.isPFEmployer || false,
//         pfEmployerPercentage: planData.pf_employer_percentage || planData.pfEmployerPercentage || '',
//         pfEmployerAmount: planData.pf_employer_amount || planData.pfEmployerAmount || '',
//         pfEmployerType: planData.pf_employer_type || planData.pfEmployerType || 'percentage',
//         isPFEmployee: planData.is_pf_employee || planData.isPFEmployee || false,
//         pfEmployeePercentage: planData.pf_employee_percentage || planData.pfEmployeePercentage || '',
//         pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
//         pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
//         isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
//         isESICEmployee: planData.is_esic_employee || planData.isESICEmployee || false,
//         esicEmployeePercentage: planData.esic_employee_percentage || planData.esicEmployeePercentage || '',
//         esicEmployeeAmount: planData.esic_employee_amount || planData.esicEmployeeAmount || '',
//         esicEmployeeType: planData.esic_employee_type || planData.esicEmployeeType || 'percentage',
//         isInsuranceEmployee: planData.is_insurance_employee || planData.isInsuranceEmployee || false,
//         insuranceEmployeePercentage: planData.insurance_employee_percentage || planData.insuranceEmployeePercentage || '',
//         insuranceEmployeeAmount: planData.insurance_employee_amount || planData.insuranceEmployeeAmount || '',
//         insuranceEmployeeType: planData.insurance_employee_type || planData.insuranceEmployeeType || 'percentage',
//         isGratuityApplicable: planData.is_gratuity_applicable || planData.isGratuityApplicable || false,
//         gratuityPercentage: planData.gratuity_percentage || planData.gratuityPercentage || '',
//         gratuityAmount: planData.gratuity_amount || planData.gratuityAmount || '',
//         gratuityType: planData.gratuity_type || planData.gratuityType || 'percentage',
//         isProfessionalTax: planData.is_professional_tax || planData.isProfessionalTax || false,
//         professionalTax: planData.professional_tax || planData.professionalTax || '',
//         professionalTaxAmount: planData.professional_tax_amount || planData.professionalTaxAmount || '',
//         professionalTaxType: planData.professional_tax_type || planData.professionalTaxType || 'percentage',
//         isVariablePay: planData.is_variable_pay || planData.isVariablePay || false,
//         variablePay: planData.variable_pay || planData.variablePay || '',
//         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
//         variablePayType: planData.variable_pay_type || planData.variablePayType || 'percentage',
//         isStatutoryBonus: planData.is_statutory_bonus || planData.isStatutoryBonus || false,
//         statutoryBonusPercentage: planData.statutory_bonus_percentage || planData.statutoryBonusPercentage || '',
//         statutoryBonusAmount: planData.statutory_bonus_amount || planData.statutoryBonusAmount || '',
//         statutoryBonusType: planData.statutory_bonus_type || planData.statutoryBonusType || 'percentage',
//         isBasicSalary: planData.is_basic_salary || planData.isBasicSalary || false,
//         basicSalary: planData.basic_salary || planData.basicSalary || '',
//         basicSalaryAmount: planData.basic_salary_amount || planData.basicSalaryAmount || '',
//         basicSalaryType: planData.basic_salary_type || planData.basicSalaryType || 'amount',
//         isHouseRentAllowance: planData.is_house_rent_allowance || planData.isHouseRentAllowance || false,
//         houseRentAllowance: planData.house_rent_allowance || planData.houseRentAllowance || '',
//         houseRentAllowanceAmount: planData.house_rent_allowance_amount || planData.houseRentAllowanceAmount || '',
//         houseRentAllowanceType: planData.house_rent_allowance_type || planData.houseRentAllowanceType || 'amount',
//         isLtaAllowance: planData.is_lta_allowance || planData.isLtaAllowance || false,
//         ltaAllowance: planData.lta_allowance || planData.ltaAllowance || '',
//         ltaAllowanceAmount: planData.lta_allowance_amount || planData.ltaAllowanceAmount || '',
//         ltaAllowanceType: planData.lta_allowance_type || planData.ltaAllowanceType || 'amount',
//         isOtherAllowance: planData.is_other_allowance || planData.isOtherAllowance || false,
//         otherAllowance: planData.other_allowance || planData.otherAllowance || '',
//         otherAllowanceAmount: planData.other_allowance_amount || planData.otherAllowanceAmount || '',
//         otherAllowanceType: planData.other_allowance_type || planData.otherAllowanceType || 'amount',
//         isStatutoryBonusAmount: planData.is_statutory_bonus_amount || planData.isStatutoryBonusAmount || false,
//         statutoryBonus: planData.statutory_bonus || planData.statutoryBonus || '',
//         statutoryBonusFixedAmount: planData.statutory_bonus_fixed_amount || planData.statutoryBonusFixedAmount || '',
//         statutoryBonusFixedType: planData.statutory_bonus_fixed_type || planData.statutoryBonusFixedType || 'amount',
//         isVariablePayAmount: planData.is_variable_pay_amount || planData.isVariablePayAmount || false,
//         variablePayAmount: planData.variable_pay_amount || planData.variablePayAmount || '',
//         variablePayFixedAmount: planData.variable_pay_fixed_amount || planData.variablePayFixedAmount || '',
//         variablePayFixedType: planData.variable_pay_fixed_type || planData.variablePayFixedType || 'amount',
//         isOvertimePay: planData.is_overtime_pay || planData.isOvertimePay || false,
//         overtimePayType: planData.overtime_pay_type || planData.overtimePayType || 'hourly',
//         overtimePayAmount: planData.overtime_pay_amount || planData.overtimePayAmount || '',
//         overtimePayUnits: planData.overtime_pay_units || planData.overtimePayUnits || '',
//         isIncentives: planData.is_incentives || planData.isIncentives || false,
//         incentives: planData.incentives || '',
//         incentivesAmount: planData.incentives_amount || planData.incentivesAmount || '',
//         incentivesType: planData.incentives_type || planData.incentivesType || 'amount',
//         isDefaultWorkingHours: planData.is_default_working_hours || planData.isDefaultWorkingHours || false,
//         defaultWorkingHours: planData.default_working_hours || planData.defaultWorkingHours || '',
//         isDefaultWorkingDays: planData.is_default_working_days || planData.isDefaultWorkingDays || false,
//         defaultWorkingDays: planData.default_working_days || planData.defaultWorkingDays || {
//           Sunday: 'weekOff',
//           Monday: 'fullDay',
//           Tuesday: 'fullDay',
//           Wednesday: 'fullDay',
//           Thursday: 'fullDay',
//           Friday: 'fullDay',
//           Saturday: 'weekOff'
//         }
//       };
//       setViewExecCompensation(mappedData);
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
//                 <div className="compensation-input-group">
//                   <div className="working-day-row">
//                     {daysOfWeek.slice(0, 3).map((day) => (
//                       <div key={day} className="working-day-selector">
//                         <span className="working-day-label">{day}</span>
//                         <select
//                           value={formData.defaultWorkingDays[day]}
//                           onChange={(e) => handleWorkingDayChange(day, e.target.value)}
//                           className="compensation-select"
//                         >
//                           <option value="fullDay">Full Day</option>
//                           <option value="halfDay">Half Day</option>
//                           <option value="weekOff">Week Off</option>
//                         </select>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="working-day-row">
//                     {daysOfWeek.slice(3).map((day) => (
//                       <div key={day} className="working-day-selector">
//                         <span className="working-day-label">{day}</span>
//                         <select
//                           value={formData.defaultWorkingDays[day]}
//                           onChange={(e) => handleWorkingDayChange(day, e.target.value)}
//                           className="compensation-select"
//                         >
//                           <option value="fullDay">Full Day</option>
//                           <option value="halfDay">Half Day</option>
//                           <option value="weekOff">Week Off</option>
//                         </select>
//                       </div>
//                     ))}
//                   </div>
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
//         ] : [])
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
//       title: ' Statutory Components',
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
//                     onClick={() => handleViewPopup(comp.plan_data)}
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
    }
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
      }
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
      }
      return newData;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        setCompensations(response.data.data || []);
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
      }
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
        defaultWorkingDays: formData.defaultWorkingDays
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

  const handleViewPopup = (planData) => {
    if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
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
        defaultWorkingDays: planData.default_working_days || planData.defaultWorkingDays || {
          Sunday: 'weekOff',
          Monday: 'fullDay',
          Tuesday: 'fullDay',
          Wednesday: 'fullDay',
          Thursday: 'fullDay',
          Friday: 'fullDay',
          Saturday: 'weekOff'
        }
      };
      setViewExecCompensation(mappedData);
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
        ] : [])
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
                    onClick={() => handleViewPopup(comp.plan_data)}
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