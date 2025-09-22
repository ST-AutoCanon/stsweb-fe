

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './createCompensation.css';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import { calculateSalaryDetails } from './../../utils/SalaryCalculations'; // Adjust path as needed

const API_KEY = process.env.REACT_APP_API_KEY;

// Default values for formData fields
const defaultFormData = {
  compensationPlanName: '',
  isPFApplicable: false,
  pfCalculationBase: "",
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
  medicalCalculationBase: "",
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
};

// Default values assumed by calculateSalaryDetails
const calculationDefaults = {
  basicSalary: { percentage: '40', type: 'percentage' },
  hra: { percentage: '20', type: 'percentage' },
  lta: { percentage: '0', type: 'percentage' },
  otherAllowance: { percentage: 'fill', type: 'percentage' },
  variablePay: { percentage: '0', type: 'percentage' },
  statutoryBonus: { percentage: '0', type: 'percentage' },
  incentives: { amount: '0', type: 'amount' },
  professionalTax: { amount: '200', type: 'amount' },
  pfEmployee: { percentage: '0', type: 'percentage' },
  pfEmployer: { percentage: '0', type: 'percentage' },
  esicEmployee: { percentage: '0', type: 'percentage' },
  insuranceEmployee: { percentage: '0', type: 'percentage' },
  gratuity: { percentage: '4.81', type: 'percentage' },
  tds: { percentage: '0', type: 'percentage' },
  advanceRecovery: { amount: '0', type: 'amount' },
};


const salaryFieldToFormDataMap = {
  basicSalary: { amount: 'basicSalaryAmount', percentage: 'basicSalary', type: 'basicSalaryType', enable: 'isBasicSalary', default: calculationDefaults.basicSalary },
  hra: { amount: 'houseRentAllowanceAmount', percentage: 'houseRentAllowance', type: 'houseRentAllowanceType', enable: 'isHouseRentAllowance', default: calculationDefaults.hra },
  ltaAllowance: { amount: 'ltaAllowanceAmount', percentage: 'ltaAllowance', type: 'ltaAllowanceType', enable: 'isLtaAllowance', default: calculationDefaults.lta },
  otherAllowances: { amount: 'otherAllowanceAmount', percentage: 'otherAllowance', type: 'otherAllowanceType', enable: 'isOtherAllowance', default: calculationDefaults.otherAllowance },
  variablePay: { amount: 'variablePayAmount', percentage: 'variablePay', type: 'variablePayType', enable: 'isVariablePay', default: calculationDefaults.variablePay },
  statutoryBonus: { amount: 'statutoryBonusAmount', percentage: 'statutoryBonusPercentage', type: 'statutoryBonusType', enable: 'isStatutoryBonus', default: calculationDefaults.statutoryBonus },
  bonusPay: { amount: 'statutoryBonusAmount', percentage: 'statutoryBonusPercentage', type: 'statutoryBonusType', enable: 'isStatutoryBonus', default: calculationDefaults.statutoryBonus },
  incentives: { amount: 'incentivesAmount', percentage: 'incentives', type: 'incentivesType', enable: 'isIncentives', default: calculationDefaults.incentives },
  professionalTax: { amount: 'professionalTaxAmount', percentage: 'professionalTax', type: 'professionalTaxType', enable: 'isProfessionalTax', default: calculationDefaults.professionalTax },
  employeePF: { amount: 'pfEmployeeAmount', percentage: 'pfEmployeePercentage', type: 'pfEmployeeType', enable: 'isPFEmployee', default: calculationDefaults.pfEmployee },
  employerPF: { amount: 'pfEmployerAmount', percentage: 'pfEmployerPercentage', type: 'pfEmployerType', enable: 'isPFEmployer', default: calculationDefaults.pfEmployer },
  pfCalculationBase: { field: 'pfCalculationBase', default: '' },
  esic: { amount: 'esicEmployeeAmount', percentage: 'esicEmployeePercentage', type: 'esicEmployeeType', enable: 'isESICEmployee', default: calculationDefaults.esicEmployee },
  insurance: { amount: 'insuranceEmployeeAmount', percentage: 'insuranceEmployeePercentage', type: 'insuranceEmployeeType', enable: 'isInsuranceEmployee', default: calculationDefaults.insuranceEmployee },
  gratuity: { amount: 'gratuityAmount', percentage: 'gratuityPercentage', type: 'gratuityType', enable: 'isGratuityApplicable', default: calculationDefaults.gratuity },
  medicalCalculationBase: { field: 'medicalCalculationBase', default: '' },
  tds: { enable: 'isTDSApplicable', default: calculationDefaults.tds },
  advanceRecovery: { default: calculationDefaults.advanceRecovery },
  overtimePay: { amount: 'overtimePayAmount', type: 'overtimePayType', enable: 'isOvertimePay', units: 'overtimePayUnits', default: { amount: '0', type: 'hourly' } },
};
const CreateCompensation = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompensationId, setEditingCompensationId] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [ctcInput, setCtcInput] = useState('');
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
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
    setFormData(defaultFormData);
    setError('');
  };

  const handleCheckboxChange = (field, value) => {
  setFormData((prev) => {
    const newData = { ...prev, [field]: value === 'yes' };
    const updatedErrors = { ...errors };
    if (value !== 'yes') {
      // Reset fields when disabling
      if (field === 'isPFApplicable') {
        newData.pfPercentage = '';
        newData.pfAmount = '';
        newData.isPFEmployer = false;
        newData.pfEmployerPercentage = '';
        newData.pfEmployerAmount = '';
        newData.isPFEmployee = false;
        newData.pfEmployeePercentage = '';
        newData.pfEmployeeAmount = '';
        newData.pfCalculationBase = '';
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
        newData.medicalCalculationBase = '';
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
        newData.basicSalaryType = 'percentage';
        updatedErrors.basicSalary = '';
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
        newData.defaultWorkingDays = defaultFormData.defaultWorkingDays;
      }
      if (field === 'isTDSApplicable') {
        newData.tdsSlabs = [];
      }
    } else {
      // Set default values when enabling
      if (field === 'isLtaAllowance') {
        newData.ltaAllowanceType = 'percentage';
        newData.ltaAllowance = newData.ltaAllowance || '0';
      }
      if (field === 'isPFEmployee') {
        newData.pfEmployeeType = 'percentage';
        newData.pfEmployeePercentage = newData.pfEmployeePercentage || '0';
      }
      if (field === 'isPFEmployer') {
        newData.pfEmployerType = 'percentage';
        newData.pfEmployerPercentage = newData.pfEmployerPercentage || '0';
      }
      if (field === 'isESICEmployee') {
        newData.esicEmployeeType = 'percentage';
        newData.esicEmployeePercentage = newData.esicEmployeePercentage || '0';
      }
      if (field === 'isOtherAllowance') {
        newData.otherAllowanceType = 'percentage';
        newData.otherAllowance = newData.otherAllowance || '0';
      }
      if (field === 'isTDSApplicable' && newData.tdsSlabs.length === 0) {
        newData.tdsSlabs = [{ from: '', to: '', percentage: '' }];
      }
    }
    setErrors(updatedErrors);
    return newData;
  });
};
  const handleInputChange = (field, value) => {
  const newFormData = { ...formData, [field]: value };
  if (field.endsWith('Type')) {
    const baseField = field.replace('Type', '');
    const percentageField = salaryFieldToFormDataMap[baseField]?.percentage || `${baseField}Percentage`;
    const amountField = salaryFieldToFormDataMap[baseField]?.amount || `${baseField}Amount`;
    if (value === 'percentage') {
      newFormData[percentageField] = newFormData[percentageField] || '0';
      newFormData[amountField] = '';
    } else if (value === 'amount') {
      newFormData[amountField] = newFormData[amountField] || '0';
      newFormData[percentageField] = '';
    }
  }
  setFormData(newFormData);
  const fieldConfig = categories
    .flatMap((category) => category.fields)
    .find((f) => f.percentageField === field || f.amountField === field);
  if (fieldConfig && fieldConfig.validation && field === fieldConfig.percentageField) {
    const error = validateField(field, value, fieldConfig, newFormData);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  } else {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  }
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
    if (!Number.isInteger(index) || index < 0 || index >= formData.tdsSlabs.length) {
      console.warn(`Invalid index ${index} for removing TDS slab`);
      showAlert('Cannot remove slab: Invalid index');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tdsSlabs: Array.isArray(prev.tdsSlabs)
        ? prev.tdsSlabs.filter((_, i) => i !== index)
        : []
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
      pfCalculationBase: compensation.plan_data?.pfCalculationBase || '',
      pfEmployeeAmount: compensation.plan_data?.pfEmployeeAmount || '',
      pfEmployeeType: compensation.plan_data?.pfEmployeeType || 'percentage',
      isMedicalApplicable: compensation.plan_data?.isMedicalApplicable || false,
      medicalCalculationBase: compensation.plan_data?.medicalCalculationBase || '',
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
      defaultWorkingDays: compensation.plan_data?.defaultWorkingDays || defaultFormData.defaultWorkingDays,
      isTDSApplicable: compensation.plan_data?.isTDSApplicable || false,
      tdsSlabs: compensation.plan_data?.tdsSlabs || (compensation.plan_data?.tdsFrom ? [{ from: compensation.plan_data.tdsFrom, to: compensation.plan_data.tdsTo, percentage: compensation.plan_data.tdsPercentage }] : [])
    });
    setIsPopupOpen(true);
    setCurrentStep(1);
    setError('');
  };
const [errors, setErrors] = useState({});
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
    if (Object.values(errors).some((error) => error !== '')) {
    showAlert('Please fix the validation errors before submitting');
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
        pfCalculationBase: formData.pfCalculationBase,
        pfEmployeeAmount: formData.pfEmployeeAmount,
        pfEmployeeType: formData.pfEmployeeType,
        isMedicalApplicable: formData.isMedicalApplicable,
        medicalCalculationBase: formData.medicalCalculationBase,
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
         console.log('this is componsetion response:',response);
        showAlert('Compensation created successfully!');
      }
      togglePopup();
      fetchCompensations();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      showAlert(`Failed to ${isEditing ? 'update' : 'create'} compensation: ${errorMessage}`);
    }
  };


const validateField = (name, value, fieldConfig, formData) => {
  const { validation } = fieldConfig;
  if (!validation || !formData[validation.appliesWhen.field] || formData[validation.appliesWhen.field] !== validation.appliesWhen.value) {
    return ''; // Validation does not apply
  }
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return 'Please enter a valid number.';
  }
  if (numValue < validation.min || numValue > validation.max) {
    return validation.message;
  }
  return '';
};
  const handleViewPopup = async (planData, planId) => {
    if (planData && typeof planData === 'object' && !Array.isArray(planData)) {
      try {
        let defaultWorkingDays = defaultFormData.defaultWorkingDays;
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
          pfCalculationBase: planData.pf_calculation_base || planData.pfCalculationBase || 'basicSalary',
          pfEmployeeAmount: planData.pf_employee_amount || planData.pfEmployeeAmount || '',
          pfEmployeeType: planData.pf_employee_type || planData.pfEmployeeType || 'percentage',
          isMedicalApplicable: planData.is_medical_applicable || planData.isMedicalApplicable || false,
          medicalCalculationBase: planData.medical_calculation_base || planData.medicalCalculationBase || 'basicSalary',
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
          incentivesAmount: planData.incentivesAmount || '',
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
    setCtcInput('');
    setSalaryDetails(null);
  };

  const closePreview = () => {
    setPreviewModal(false);
    setCtcInput('');
    setSalaryDetails(null);
  };

  const formatFieldName = (key) => {
  const fieldNames = {
    basicSalary: 'Basic Salary',
    hra: 'Hra',
    ltaAllowance: 'LTA Allowance',
    overtimePay: 'Overtime Pay',
    bonusPay: 'Statutory Bonus',
    employeePF: 'Employee PF',
    employerPF: 'Employer PF',
    esic: 'ESIC Employee',
    gratuity: 'Gratuity',
    professionalTax: 'Professional Tax',
    otherAllowances: 'Other Allowances',
    tds: 'TDS',
    advanceRecovery: 'Advance Recovery',
    insurance: 'Insurance',
    grossSalary: 'Gross Salary',
    netSalary: 'Net Salary',
    isESICEmployee: 'Is Esic Employee', // Add specific mapping for isESICEmployee
    isMedicalApplicable: 'Is Medical Applicable',
    esicEmployeePercentage: 'Esic Employee Percentage',
    recordBonusPay: null,
    recordBonusPayYearly: null,
    // Add other fields as needed
  };

  return fieldNames[key] || key.replace(/([A-Z][a-z]+)/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
};

  const isDefaultValue = (key, value) => {
    const defaultValue = defaultFormData[key];
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value) === JSON.stringify(defaultValue);
    }
    return value === defaultValue;
  };


const shouldDisplayField = (key, value, formData) => {
  // Exclude specific fields
  const excludedFields = [
    'pfEmployeeText',
    'pfEmployerText',
    'esicEmployeeText',
    'insuranceEmployeeText',
    'recordBonusPay',
    'recordBonusPayYearly',
    'bonusPay' // Exclude bonusPay to avoid duplicate Statutory Bonus
  ];
  if (excludedFields.includes(key)) {
    return false;
  }

  // Skip default/empty values
  if (isDefaultValue(key, value)) {
    return false;
  }

  // Map fields to their enable fields
  const fieldEnableMap = {
    // formData fields
    overtimePayAmount: 'isOvertimePay',
    overtimePayUnits: 'isOvertimePay',
    isDefaultWorkingDays: true,
    defaultWorkingDays: 'isDefaultWorkingDays',
    basicSalary: 'isBasicSalary',
    basicSalaryAmount: 'isBasicSalary',
    houseRentAllowance: 'isHouseRentAllowance',
    houseRentAllowanceAmount: 'isHouseRentAllowance',
    ltaAllowance: 'isLtaAllowance',
    ltaAllowanceAmount: 'isLtaAllowance',
    otherAllowance: 'isOtherAllowance',
    otherAllowanceAmount: 'isOtherAllowance',
    variablePay: 'isVariablePay',
    variablePayAmount: 'isVariablePay',
    statutoryBonusPercentage: 'isStatutoryBonus',
    statutoryBonusAmount: 'isStatutoryBonus',
    incentives: 'isIncentives',
    incentivesAmount: 'isIncentives',
    professionalTax: 'isProfessionalTax',
    professionalTaxAmount: 'isProfessionalTax',
    pfEmployeePercentage: 'isPFEmployee',
    pfEmployeeAmount: 'isPFEmployee',
    pfEmployerPercentage: 'isPFEmployer',
    pfEmployerAmount: 'isPFEmployer',
    esicEmployeePercentage: 'isESICEmployee',
    esicEmployeeAmount: 'isESICEmployee',
    insuranceEmployeePercentage: 'isInsuranceEmployee',
    insuranceEmployeeAmount: 'isInsuranceEmployee',
    gratuityPercentage: 'isGratuityApplicable',
    gratuityAmount: 'isGratuityApplicable',
    // salaryDetails fields
    basicSalary: 'isBasicSalary',
    hra: 'isHouseRentAllowance',
    ltaAllowance: 'isLtaAllowance',
    otherAllowances: 'isOtherAllowance',
    variablePay: 'isVariablePay',
    statutoryBonus: 'isStatutoryBonus',
    incentives: 'isIncentives',
    professionalTax: 'isProfessionalTax',
    employeePF: 'isPFEmployee',
    employerPF: 'isPFEmployer',
    esic: 'isESICEmployee',
    insurance: 'isInsuranceEmployee',
    gratuity: 'isGratuityApplicable',
    overtimePay: 'isOvertimePay',
    tds: 'isTDSApplicable',
    grossSalary: true,
    netSalary: true,
    advanceRecovery: true
  };

  // Check if the field is enabled
  const enableField = fieldEnableMap[key];
  if (enableField) {
    if (enableField === true) {
      if (typeof value === 'object' && value !== null) {
        return true;
      }
      return typeof value === 'number' ? value !== 0 : value !== '';
    }
    if (formData[enableField]) {
      if (typeof value === 'object' && value !== null) {
        return true;
      }
      return typeof value === 'number' ? value !== 0 : value !== '';
    }
  }

  // Type-dependent fields
  const typeDependentFields = {
    pfEmployeePercentage: { typeField: 'pfEmployeeType', showWhen: 'percentage', enableField: 'isPFEmployee' },
    pfEmployeeAmount: { typeField: 'pfEmployeeType', showWhen: 'amount', enableField: 'isPFEmployee' },
    pfEmployerPercentage: { typeField: 'pfEmployerType', showWhen: 'percentage', enableField: 'isPFEmployer' },
    pfEmployerAmount: { typeField: 'pfEmployerType', showWhen: 'amount', enableField: 'isPFEmployer' },
    esicEmployeePercentage: { typeField: 'esicEmployeeType', showWhen: 'percentage', enableField: 'isESICEmployee' },
    esicEmployeeAmount: { typeField: 'esicEmployeeType', showWhen: 'amount', enableField: 'isESICEmployee' },
    insuranceEmployeePercentage: { typeField: 'insuranceEmployeeType', showWhen: 'percentage', enableField: 'isInsuranceEmployee' },
    insuranceEmployeeAmount: { typeField: 'insuranceEmployeeType', showWhen: 'amount', enableField: 'isInsuranceEmployee' },
    gratuityPercentage: { typeField: 'gratuityType', showWhen: 'percentage', enableField: 'isGratuityApplicable' },
    gratuityAmount: { typeField: 'gratuityType', showWhen: 'amount', enableField: 'isGratuityApplicable' },
    professionalTax: { typeField: 'professionalTaxType', showWhen: 'percentage', enableField: 'isProfessionalTax' },
    professionalTaxAmount: { typeField: 'professionalTaxType', showWhen: 'amount', enableField: 'isProfessionalTax' },
    variablePay: { typeField: 'variablePayType', showWhen: 'percentage', enableField: 'isVariablePay' },
    variablePayAmount: { typeField: 'variablePayType', showWhen: 'amount', enableField: 'isVariablePay' },
    statutoryBonusPercentage: { typeField: 'statutoryBonusType', showWhen: 'percentage', enableField: 'isStatutoryBonus' },
    statutoryBonusAmount: { typeField: 'statutoryBonusType', showWhen: 'amount', enableField: 'isStatutoryBonus' },
    basicSalary: { typeField: 'basicSalaryType', showWhen: 'percentage', enableField: 'isBasicSalary' },
    basicSalaryAmount: { typeField: 'basicSalaryType', showWhen: 'amount', enableField: 'isBasicSalary' },
    houseRentAllowance: { typeField: 'houseRentAllowanceType', showWhen: 'percentage', enableField: 'isHouseRentAllowance' },
    houseRentAllowanceAmount: { typeField: 'houseRentAllowanceType', showWhen: 'amount', enableField: 'isHouseRentAllowance' },
    ltaAllowance: { typeField: 'ltaAllowanceType', showWhen: 'percentage', enableField: 'isLtaAllowance' },
    ltaAllowanceAmount: { typeField: 'ltaAllowanceType', showWhen: 'amount', enableField: 'isLtaAllowance' },
    otherAllowance: { typeField: 'otherAllowanceType', showWhen: 'percentage', enableField: 'isOtherAllowance' },
    otherAllowanceAmount: { typeField: 'otherAllowanceType', showWhen: 'amount', enableField: 'isOtherAllowance' },
    incentives: { typeField: 'incentivesType', showWhen: 'percentage', enableField: 'isIncentives' },
    incentivesAmount: { typeField: 'incentivesType', showWhen: 'amount', enableField: 'isIncentives' }
  };

  if (typeDependentFields[key]) {
    const { typeField, showWhen, enableField } = typeDependentFields[key];
    return formData[enableField] && formData[typeField] === showWhen && value !== '';
  }

  return false;
};


  const getPlanValue = (calcField, formData) => {
  const mapping = salaryFieldToFormDataMap[calcField];
  if (!mapping) return '-';

  const { enable, amount, percentage, type, units, default: defaultConfig } = mapping;

  // Special handling for overtimePay
  // Special handling for overtimePay
if (calcField === 'overtimePay') {
  const typeValue = formData[type] || defaultConfig?.type || 'hourly';
  const amountValue = formData[amount] || '0';
  const unitsValue = formData[units] || '0';
  const unitLabel = typeValue === 'hourly' ? 'hour' : typeValue === 'daily' ? 'day' : 'unit';
  if (amountValue && amountValue !== '0') {
    return `₹${parseFloat(amountValue).toLocaleString('en-IN')} / ${unitLabel}${unitsValue !== '0' ? ` (${unitsValue} ${unitLabel}${parseInt(unitsValue) !== 1 ? 's' : ''})` : ''}`;
  }
  return defaultConfig ? `${defaultConfig.amount}/${typeValue} (default)` : '-';
}

  // Use text fields set by calculateSalaryDetails if available
  if (calcField === 'employeePF' && formData.pfEmployeeText) {
    return formData.pfEmployeeText !== 'Not Applicable' ? formData.pfEmployeeText : '0%';
  }
  if (calcField === 'employerPF' && formData.pfEmployerText) {
    return formData.pfEmployerText !== 'Not Applicable' ? formData.pfEmployerText : '0%';
  }
  if (calcField === 'esic' && formData.esicEmployeeText) {
    return formData.esicEmployeeText !== 'Not Applicable' ? formData.esicEmployeeText : '0%';
  }

  // General handling for other fields
  if (enable && formData[enable]) {
    const typeValue = formData[type] || defaultConfig?.type || 'percentage';
    const valueField = typeValue === 'percentage' ? percentage : amount;
    const value = formData[valueField];
    if (value && !isDefaultValue(valueField, value)) {
      return typeValue === 'percentage'
        ? `${parseFloat(value)}%`
        : `₹${parseFloat(value).toLocaleString('en-IN')}`;
    }
    // Fallback to amount if percentage is not set
    if (typeValue === 'percentage' && !value && formData[amount]) {
      return `₹${parseFloat(formData[amount]).toLocaleString('en-IN')}`;
    }
    // Fallback to percentage if amount is not set
    if (typeValue === 'amount' && !value && formData[percentage]) {
      return `${parseFloat(formData[percentage])}%`;
    }
  }

  // Fallback to default configuration
  if (defaultConfig) {
    const { percentage, amount, type } = defaultConfig;
    const defaultValue = type === 'percentage' ? percentage : amount;
    return defaultValue === 'fill'
      ? 'Fill remaining (default)'
      : `${defaultValue}${type === 'percentage' ? '%' : ''} (default)`;
  }

  return '-';
};

  const handleStepChange = (step) => {
    const newStep = Math.max(1, Math.min(step, categories.length));
    setCurrentStep(newStep);
  };

  const handleCalculate = () => {
  if (!ctcInput || isNaN(parseFloat(ctcInput)) || parseFloat(ctcInput) <= 0) {
    showAlert('Please enter a valid CTC amount');
    return;
  }
  if (formData.isOvertimePay && (!formData.overtimePayAmount || !formData.overtimePayUnits)) {
    showAlert('Please provide both Overtime Pay Amount and Units when Overtime Pay is enabled');
    return;
  }
  if (formData.isBasicSalary && !formData.basicSalary && !formData.basicSalaryAmount) {
    showAlert('Please provide a value for Basic Salary when it is enabled');
    return;
  }
  if (formData.isLtaAllowance && !formData.ltaAllowance && !formData.ltaAllowanceAmount) {
    showAlert('Please provide a value for LTA Allowance when it is enabled');
    return;
  }
  if (formData.isOtherAllowance && !formData.otherAllowance && !formData.otherAllowanceAmount) {
    showAlert('Please provide a value for Other Allowance when it is enabled');
    return;
  }
  if (formData.isPFEmployee && !formData.pfEmployeePercentage && !formData.pfEmployeeAmount) {
    showAlert('Please provide a value for Employee PF when it is enabled');
    return;
  }
  if (formData.isPFEmployer && !formData.pfEmployerPercentage && !formData.pfEmployerAmount) {
    showAlert('Please provide a value for Employer PF when it is enabled');
    return;
  }
  if (formData.isStatutoryBonus && !formData.statutoryBonusPercentage && !formData.statutoryBonusAmount) {
    showAlert('Please provide a value for Statutory Bonus when it is enabled');
    return;
  }
  // Create a copy of formData to pass to calculateSalaryDetails
  const planDataCopy = { ...formData };
  const calculatedDetails = calculateSalaryDetails(
    parseFloat(ctcInput),
    planDataCopy,
    'preview-employee',
    [],
    [],
    []
  );
  if (!calculatedDetails) {
    showAlert('Failed to calculate salary details');
    return;
  }
  // Project overtime pay for preview if units are provided
  if (formData.isOvertimePay && formData.overtimePayAmount && formData.overtimePayUnits) {
    const projectedOvertime = parseFloat(formData.overtimePayAmount) * parseFloat(formData.overtimePayUnits);
    calculatedDetails.overtimePay = Math.round(projectedOvertime);
  }
  // Update formData with text fields from calculateSalaryDetails
  setFormData((prev) => ({
    ...prev,
    pfEmployeeText: planDataCopy.pfEmployeeText || '0%',
    pfEmployerText: planDataCopy.pfEmployerText || '0%',
    esicEmployeeText: planDataCopy.esicEmployeeText || '0%',
    insuranceEmployeeText: planDataCopy.insuranceEmployeeText || '0%'
  }));
  setSalaryDetails(calculatedDetails);
};

const renderCategoryField = ({
  label,
  field,
  percentageField,
  amountField,
  typeField,
  required = false,
  type,
  options = [],
  validation // Include validation for displaying error messages
}) => (
  <div key={field} className="compensation-form-group">
    <span className="compensation-label-text">
      {label}
    </span>

    {type === 'dropdown' ? (
      <div className="compensation-input-group">
        <select
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="compensation-select"
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <>
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                  type="number"
                  placeholder="Percentage"
                  value={formData[percentageField]}
                  onChange={(e) => handleInputChange(percentageField, e.target.value)}
                  className="compensation-percentage-input"
                  required={required}
                />
                {errors[percentageField] && (
                  <span style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                    {errors[percentageField]}
                  </span>
                )}
              </div>
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
      </>
    )}
  </div>
);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayRows = [
    daysOfWeek.slice(0, 2),
    daysOfWeek.slice(2, 4),
    daysOfWeek.slice(4, 6),
    daysOfWeek.slice(6)
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
              <span className="compensation-label-text">Compensation Plan Name <span style={{ color: '#f44336' }}>*</span></span>
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
                Default Working Hours (Excluding Lunch/Breaks) <span style={{ color: '#f44336' }}>*</span>
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
  title: 'Allowances',
  fields: [
   {
      label: 'Basic Salary',
      field: 'isBasicSalary',
      percentageField: 'basicSalary',
      amountField: 'basicSalaryAmount',
      typeField: 'basicSalaryType',
      validation: {
        appliesWhen: {
          field: 'basicSalaryType',
          value: 'percentage'
        },
        min: 30,
        max: 50,
        message: 'Basic Salary percentage must be between 30% and 50%.'
      }
    },
    {
      label: 'House Rent Allowance',
      field: 'isHouseRentAllowance',
      percentageField: 'houseRentAllowance',
      amountField: 'houseRentAllowanceAmount',
      typeField: 'houseRentAllowanceType'
    },
    {
      label: 'LTA Allowance',
      field: 'isLtaAllowance',
      percentageField: 'ltaAllowance',
      amountField: 'ltaAllowanceAmount',
      typeField: 'ltaAllowanceType'
    },
    {
      label: 'Other Allowance',
      field: 'isOtherAllowance',
      percentageField: 'otherAllowance',
      amountField: 'otherAllowanceAmount',
      typeField: 'otherAllowanceType'
    }
  ]
},


    // {
    //   title: 'PF and Medical Contributions',
    //   fields: [
    //     {
    //       label: 'PF Applicable',
    //       field: 'isPFApplicable',
    //       percentageField: '',
    //       amountField: '',
    //       typeField: '',
    //     },
    //     ...(formData.isPFApplicable ? [
    //       {
    //         label: 'PF of Employee',
    //         field: 'isPFEmployee',
    //         percentageField: 'pfPercentage',
    //         amountField: 'pfAmount',
    //         typeField: 'pfType',
    //       },
    //       {
    //         label: 'PF of Employer',
    //         field: 'isPFEmployer',
    //         percentageField: 'pfEmployerPercentage',
    //         amountField: 'pfEmployerAmount',
    //         typeField: 'pfEmployerType',
    //       }
    //     ] : []),
    //     {
    //       label: 'Medical Applicable',
    //       field: 'isMedicalApplicable',
    //       percentageField: '',
    //       amountField: '',
    //       typeField: '',
    //     },
    //     ...(formData.isMedicalApplicable ? [
    //       {
    //         label: 'ESIC of Employee',
    //         field: 'isESICEmployee',
    //         percentageField: 'esicEmployeePercentage',
    //         amountField: 'esicEmployeeAmount',
    //         typeField: 'esicEmployeeType',
    //       },
    //       {
    //         label: 'Insurance of Employee',
    //         field: 'isInsuranceEmployee',
    //         percentageField: 'insuranceEmployeePercentage',
    //         amountField: 'insuranceEmployeeAmount',
    //         typeField: 'insuranceEmployeeType',
    //       }
    //     ] : []),
    //   ]
    // },


  {
  title: 'PF and Medical Contributions',
  fields: [
    {
      label: 'PF Applicable',
      field: 'isPFApplicable',
    },
    ...(formData.isPFApplicable
      ? [
          {
            label: 'Calculation Based On',
            field: 'pfCalculationBase',
            component: (
              <div className="compensation-form-group">
                <span className="compensation-label-text">Calculation Based On</span>
                <div className="compensation-input-group">
                  <select
                    value={formData.pfCalculationBase || ''}
                    onChange={(e) => handleInputChange('pfCalculationBase', e.target.value)}
                    className="compensation-select"
                  >
                    <option value="">Select</option>
                    <option value="basic">Basic Salary</option>
                    <option value="gross">Gross Salary</option>
                  </select>
                </div>
              </div>
            ),
          },
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
          },
        ]
      : []),

    {
      label: 'Medical Applicable',
      field: 'isMedicalApplicable',
    },
    ...(formData.isMedicalApplicable
      ? [
          {
            label: 'Calculation Based On',
            field: 'medicalCalculationBase',
            component: (
              <div className="compensation-form-group">
                <span className="compensation-label-text">Calculation Based On</span>
                <div className="compensation-input-group">
                  <select
                    value={formData.medicalCalculationBase || ''}
                    onChange={(e) =>
                      handleInputChange('medicalCalculationBase', e.target.value)
                    }
                    className="compensation-select"
                  >
                    <option value="">Select</option>
                    <option value="basic">Basic Salary</option>
                    <option value="gross">Gross Salary</option>
                  </select>
                </div>
              </div>
            ),
          },
          {
            label: 'Esic of Employee',
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
          },
        ]
      : []),
  ],
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
              <th>Last Updated</th>
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
                  {Object.entries(viewExecCompensation)
                    .filter(([key, value]) => shouldDisplayField(key, value, viewExecCompensation))
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td>{formatFieldName(key)}</td>
                        <td>
                          {typeof value === 'boolean'
                            ? value ? 'Yes' : 'No'
                            : typeof value === 'object'
                            ? JSON.stringify(value)
                            : value}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {previewModal && (
        <div className="create-compensation-popup-overlay">
          <div className="create-compensation-popup">
            <div className="create-compensation-popup-header">
              <h2>Preview Compensation</h2>
              <button onClick={closePreview} className="create-compensation-close-button">
                ×
              </button>
            </div>
            <div className="create-compensation-popup-content">
              <div className="create-compensation-form-group">
                <span className="create-compensation-label-text">Enter Annual CTC (₹)</span>
                <div className="create-compensation-input-group">
                  <input
                    type="number"
                    placeholder="Enter CTC"
                    value={ctcInput}
                    onChange={(e) => setCtcInput(e.target.value)}
                    className="create-compensation-number-input"
                  />
                  <button className="create-compensation-add-button" onClick={handleCalculate}>
                    Calculate
                  </button>
                </div>
              </div>
              <div className="create-preview-columns">
                <div className="create-preview-left">
                  <table className="create-compensation-preview-table">
                    <thead>
                      <tr className="create-header-row">
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      {Object.entries(formData)
                        .filter(([key, value]) => shouldDisplayField(key, value, formData))
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td>{formatFieldName(key)}</td>
                            <td>
                              {typeof value === 'boolean'
                                ? value ? 'Yes' : 'No'
                                : typeof value === 'object'
                                ? JSON.stringify(value)
                                : value}
                            </td>
                          </tr>
                        ))}
                    </tbody> */}

         <tbody>
  {[
    {
      label: "Basic Salary",
      values: {
        Percentage: formData.basicSalary || formData.basicSalaryPercentage,
        Amount: formData.basicSalaryAmount,
        Type: formData.basicSalaryType,
      },
    },
    {
      label: "House Rent Allowance (HRA)",
      values: {
        Percentage: formData.hra || formData.houseRentAllowance,
        Amount: formData.hraAmount,
        Type: formData.houseRentAllowanceType,
      },
    },
    {
      label: "Leave Travel Allowance (LTA)",
      values: {
        Percentage: formData.lta || formData.ltaAllowance,
        Amount: formData.ltaAmount,
        Type: formData.ltaAllowanceType,
      },
    },
    {
      label: "Other Allowance",
      values: {
        Percentage: formData.otherAllowance || formData.otherAllowancePercentage,
        Amount: formData.otherAllowanceAmount,
        Type: formData.otherAllowanceType,
      },
    },
    {
      label: "Provident Fund (PF - Employee)",
      values: {
        Percentage: formData.pfEmployeePercentage || formData.pfPercentage,
        Amount: formData.pfEmployeeAmount,
        Type: formData.pfEmployeeType,
      },
    },
    {
      label: "Provident Fund (PF - Employer)",
      values: {
        Percentage: formData.pfEmployerPercentage,
        Amount: formData.pfEmployerAmount,
        Type: formData.pfEmployerType,
      },
    },
    {
      label: "Employee State Insurance (ESIC - Employee)",
      values: {
        Percentage: formData.esicEmployeePercentage || formData.esiPercentage,
        Amount: formData.esicEmployeeAmount,
        Type: formData.esicEmployeeType,
      },
    },
    {
      label: "Insurance (Employee)",
      values: {
        Percentage: formData.insuranceEmployeePercentage || formData.insurancePercentage,
        Amount: formData.insuranceEmployeeAmount,
        Type: formData.insuranceEmployeeType,
      },
    },
    {
      label: "TDS Slabs",
      values: {
        Slabs: formData.tdsSlabs || [],
        Type: formData.tdsType,
      },
    },
    {
      label: "Professional Tax",
      values: {
        Percentage: formData.professionalTax || formData.professionalTaxPercentage,
        Amount: formData.professionalTaxAmount,
        Type: formData.professionalTaxType,
      },
    },
    {
      label: "Statutory Bonus",
      values: {
        Percentage: formData.statutoryBonusPercentage,
        Amount: formData.statutoryBonusAmount,
        Type: formData.statutoryBonusType,
      },
    },
    {
      label: "Incentives",
      values: {
        Percentage: formData.incentives || formData.incentivesPercentage,
        Amount: formData.incentivesAmount,
        Type: formData.incentivesType,
      },
    },
    {
      label: "Variable Pay / Bonus",
      values: {
        Percentage: formData.variablePay || formData.variablePayPercentage,
        Amount: formData.variablePayAmount,
        Type: formData.variablePayType,
      },
    },
    {
      label: "Gratuity",
      values: {
        Percentage: formData.gratuityPercentage,
        Amount: formData.gratuityAmount,
        Type: formData.gratuityType,
      },
    },
    {
      label: "Overtime Pay",
      values: {
        Type: formData.overtimePayType,
        Rate: formData.overtimePayAmount,
        Units: formData.overtimePayUnits,
      },
    },
    {
      label: "Default Working Days",
      values: formData.defaultWorkingDays || {},
    },
  ].map((field, idx) => (
    <tr key={idx}>
      <td>{field.label}</td>
      <td>
        {Array.isArray(field.values.Slabs) ? (
          field.values.Slabs.length > 0 ? (
            field.values.Slabs.map((slab, i) => (
              <div key={i}>
                From: {slab.from}, To: {slab.to}, %: {slab.percentage}
              </div>
            ))
          ) : (
            <span>-</span>
          )
        ) : field.label === "Default Working Days" ? (
          Object.entries(field.values).map(([day, status]) => (
            <div key={day}>{`${day}: ${status}`}</div>
          ))
        ) : (
          Object.entries(field.values).map(([subKey, val]) => (
            <div key={subKey}>
              {subKey}:{" "}
              {val !== undefined && val !== ""
                ? isNaN(val)
                  ? val
                  : Number(val).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                : "-"}
            </div>
          ))
        )}
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
                {salaryDetails && (
                  <div className="create-preview-right">
                    <h3>Calculated Salary (Monthly)</h3>
                    <table className="create-compensation-preview-table">
                      <thead>
                        <tr className="create-header-row">
                          <th>Component</th>
                          <th>Amount (₹)</th>
                          <th>Plan Value</th>
                        </tr>
                      </thead>
                     <tbody>
  {salaryDetails &&
    Object.entries(salaryDetails)
      .filter(([key, value]) => shouldDisplayField(key, value, formData))
      .map(([key, value]) => (
        <tr key={key}>
          <td>{formatFieldName(key)}</td>
          <td>
            {typeof value === 'number'
              ? value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : value}
          </td>
          <td>{getPlanValue(key, formData)}</td>
        </tr>
      ))}
</tbody>
                    </table>
                  </div>
                )}
              </div>
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
