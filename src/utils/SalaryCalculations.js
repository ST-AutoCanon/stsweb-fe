// // export const parseApplicableMonth = (monthStr) => {
// //   if (!monthStr) return null;

// //   if (/^\d{4}-\d{2}$/.test(monthStr)) {
// //     const [year, month] = monthStr.split('-').map(Number);
// //     return new Date(year, month - 1);
// //   }

// //   const monthNames = [
// //     "January", "February", "March", "April", "May", "June",
// //     "July", "August", "September", "October", "November", "December"
// //   ];
// //   const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthStr.toLowerCase());
// //   if (monthIndex !== -1) {
// //     return new Date(new Date().getFullYear(), monthIndex);
// //   }

// //   console.log(`Invalid applicable_month format: ${monthStr}`);
// //   return null;
// // };

// // export const parseWorkDate = (dateStr) => {
// //   if (!dateStr) return null;
// //   const date = new Date(dateStr);
// //   if (isNaN(date.getTime())) {
// //     console.log(`Invalid work_date format: ${dateStr}`);
// //     return null;
// //   }
// //   return date;
// // };

// // export const calculateSalaryDetails = (ctc, planData, employeeId, overtimeRecords, bonusRecords, advances, lopDetails) => {
// //   if (!ctc || ctc <= 0) {
// //     console.log(`Invalid CTC for employee ${employeeId}: ${ctc}`);
// //     return null;
// //   }

// //   const now = new Date();
// //   const currentYear = now.getFullYear();
// //   const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

// //   console.log(`Calculating salary for employee ${employeeId} for ${currentYear}-${currentMonth}`);
// //   console.log(`planData:`, JSON.stringify(planData, null, 2));
// //   console.log(`overtimeRecords:`, JSON.stringify(overtimeRecords, null, 2));

// //   const annualCtc = parseFloat(ctc);
// //   const monthlyCtc = Math.round(annualCtc / 12);

// //   let basicSalary = 0,
// //     hra = 0,
// //     ltaAllowance = 0,
// //     incentives = 0,
// //     overtimePay = 0,
// //     bonusPay = 0,
// //     employeePF = 0,
// //     employerPF = 0,
// //     esic = 0,
// //     gratuity = 0,
// //     professionalTax = 0,
// //     otherAllowances = 0,
// //     advanceRecovery = 0,
// //     insurance = 0,
// //     lopDeduction = 0;

// //   if (planData?.isBasicSalary && planData.basicSalaryType === "percentage" && planData.basicSalary) {
// //     basicSalary = Math.round(annualCtc * (parseFloat(planData.basicSalary) / 100));
// //   } else if (planData?.basicSalaryAmount) {
// //     basicSalary = parseFloat(planData.basicSalaryAmount);
// //   } else {
// //     basicSalary = Math.round(annualCtc * 0.4);
// //   }
// //   console.log(`Basic Salary: ₹${basicSalary}`);

// //   if (planData?.isHouseRentAllowance && planData.houseRentAllowanceType === "percentage" && planData.houseRentAllowance) {
// //     hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
// //   } else if (planData?.houseRentAllowanceAmount) {
// //     hra = parseFloat(planData.houseRentAllowanceAmount);
// //   } else {
// //     hra = Math.round(basicSalary * 0.5);
// //   }
// //   console.log(`HRA: ₹${hra}`);

// //   if (planData?.isLtaAllowance && planData.ltaAllowanceType === "percentage" && planData.ltaAllowance) {
// //     ltaAllowance = Math.round(annualCtc * (parseFloat(planData.ltaAllowance) / 100));
// //   } else if (planData?.ltaAllowanceAmount) {
// //     ltaAllowance = parseFloat(planData.ltaAllowanceAmount);
// //   }
// //   console.log(`LTA Allowance: ₹${ltaAllowance}`);

// //   if (planData?.isIncentives && planData.incentivesType === "amount" && planData.incentivesAmount) {
// //     incentives = parseFloat(planData.incentivesAmount);
// //   }
// //   console.log(`Incentives: ₹${incentives}`);

// //   console.log(`Filtering overtime records for employee ${employeeId}`);
// //   const employeeOvertime = overtimeRecords.filter((ot) => {
// //     const otDate = parseWorkDate(ot.work_date);
// //     const isValid = (
// //       ot.employee_id === employeeId &&
// //       ot.status === "Approved" &&
// //       otDate &&
// //       otDate.getFullYear() === currentYear &&
// //       (otDate.getMonth() + 1).toString().padStart(2, '0') === currentMonth
// //     );
// //     console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
// //     return isValid;
// //   });

// //   overtimePay = employeeOvertime.reduce((total, ot) => {
// //     const hours = parseFloat(ot.extra_hours);
// //     let rate = parseFloat(ot.rate);
// //     console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

// //     if (!rate || isNaN(rate) || rate === 0) {
// //       if (planData?.isOvertimePay && planData.overtimePayAmount && !isNaN(parseFloat(planData.overtimePayAmount))) {
// //         rate = parseFloat(planData.overtimePayAmount);
// //         console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
// //       } else {
// //         rate = 0;
// //         console.log(`No valid rate or overtimePayAmount; using rate=0`);
// //       }
// //     }

// //     if (isNaN(hours) || hours <= 0) {
// //       console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
// //       return total;
// //     }

// //     const pay = hours * rate;
// //     console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
// //     return total + pay;
// //   }, 0);
// //   console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

// //   const employeeBonuses = bonusRecords.filter((bonus) => {
// //     const date = parseApplicableMonth(bonus.applicable_month);
// //     const isValid = date &&
// //                     date.getFullYear() === currentYear &&
// //                     (date.getMonth() + 1).toString().padStart(2, '0') === currentMonth;
// //     console.log(`Checking bonus ID ${bonus.id}: applicable_month=${bonus.applicable_month}, isValid=${isValid}`);
// //     return isValid;
// //   });

// //   console.log(`Employee ${employeeId} bonuses for ${currentYear}-${currentMonth}:`, employeeBonuses);

// //   bonusPay = employeeBonuses.reduce((total, bonus) => {
// //     let amount = 0;
// //     if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
// //       amount = parseFloat(bonus.fixed_amount);
// //       console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount}`);
// //     } else if (bonus.percentage_ctc && annualCtc && !isNaN(parseFloat(bonus.percentage_ctc))) {
// //       amount = Math.round((parseFloat(bonus.percentage_ctc) / 100) * annualCtc / 12);
// //       console.log(`Bonus ID ${bonus.id}: Applying percentage_ctc=₹${amount}`);
// //     } else if (bonus.percentage_monthly_salary && monthlyCtc && !isNaN(parseFloat(bonus.percentage_monthly_salary))) {
// //       amount = Math.round((parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc);
// //       console.log(`Bonus ID ${bonus.id}: Applying percentage_monthly_salary=₹${amount}`);
// //     }
// //     return total + amount;
// //   }, 0);
// //   console.log(`Total bonusPay for employee ${employeeId}: ₹${bonusPay}`);

// //   if (planData?.isPFApplicable && planData.pfType === "percentage" && planData.pfPercentage) {
// //     employeePF = Math.round(basicSalary * (parseFloat(planData.pfPercentage) / 100));
// //   } else if (planData?.pfAmount) {
// //     employeePF = parseFloat(planData.pfAmount);
// //   } else {
// //     employeePF = Math.round(basicSalary * 0.12);
// //   }
// //   console.log(`Employee PF: ₹${employeePF}`);

// //   if (planData?.isPfEmployer && planData.pfEmployerType === "percentage" && planData.pfEmployerCeilingPercentage && planData.isPFEmployerCeiling) {
// //     employerPF = Math.min(Math.round(basicSalary * (parseFloat(planData.pfEmployerCeilingPercentage) / 100)), 1800);
// //   } else if (planData?.pfEmployerAmount) {
// //     employerPF = parseFloat(planData.pfEmployerAmount);
// //   } else {
// //     employerPF = employeePF;
// //   }
// //   console.log(`Employer PF: ₹${employerPF}`);

// //   if (planData?.isESICApplicable && planData.esicType === "percentage" && planData.esicPercentage) {
// //     esic = Math.round(annualCtc * (parseFloat(planData.esicPercentage) / 100));
// //   } else if (planData?.esicAmount) {
// //     esic = parseFloat(planData.esicAmount);
// //   }
// //   console.log(`ESIC: ₹${esic}`);

// //   if (planData?.isGratuityApplicable && planData.gratuityType === "percentage" && planData.gratuityPercentage) {
// //     gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
// //   } else if (planData?.gratuityAmount) {
// //     gratuity = parseFloat(planData.gratuityAmount);
// //   } else {
// //     gratuity = Math.round(basicSalary * 0.0481);
// //   }
// //   console.log(`Gratuity: ₹${gratuity}`);

// //   if (planData?.isProfessionalTax && planData.professionalTaxType === "percentage" && planData.professionalTax) {
// //     professionalTax = Math.round(annualCtc * (parseFloat(planData.professionalTax) / 100));
// //   } else if (planData?.professionalTaxAmount) {
// //     professionalTax = parseFloat(planData.professionalTaxAmount);
// //   }
// //   console.log(`Professional Tax: ₹${professionalTax}`);

// //   if (planData?.isOtherAllowance && planData.otherAllowanceType === "amount" && planData.otherAllowanceAmount) {
// //     otherAllowances = parseFloat(planData.otherAllowanceAmount);
// //   } else {
// //     otherAllowances = Math.max(0, annualCtc - basicSalary - hra - ltaAllowance - incentives - overtimePay - bonusPay - employerPF - gratuity - insurance);
// //   }
// //   console.log(`Other Allowances: ₹${otherAllowances}`);

// //   const employeeAdvances = advances.filter((adv) => {
// //     const advDate = parseApplicableMonth(adv.applicable_months);
// //     if (!advDate) return false;
// //     const advYear = advDate.getFullYear();
// //     const advMonth = advDate.getMonth() + 1;
// //     const recoveryMonths = parseInt(adv.recovery_months);
// //     const startMonth = advMonth;
// //     const startYear = advYear;
// //     let endYear = startYear;
// //     let endMonth = startMonth + recoveryMonths - 1;
// //     if (endMonth > 12) {
// //       endYear += Math.floor((endMonth - 1) / 12);
// //       endMonth = ((endMonth - 1) % 12) + 1;
// //     }
// //     const currentDate = new Date(currentYear, parseInt(currentMonth) - 1);
// //     const startDate = new Date(startYear, startMonth - 1);
// //     const endDate = new Date(endYear, endMonth - 1);
// //     return (
// //       adv.employee_id === employeeId &&
// //       currentDate >= startDate &&
// //       currentDate <= endDate
// //     );
// //   });

// //   if (employeeAdvances.length > 0) {
// //     advanceRecovery = employeeAdvances.reduce((total, adv) => {
// //       const amount = parseFloat(adv.advance_amount);
// //       const months = parseInt(adv.recovery_months);
// //       return total + (months > 0 ? amount / months : 0);
// //     }, 0);
// //   }
// //   console.log(`Advance Recovery: ₹${advanceRecovery}`);

// //   const employeeLop = lopDetails.find((lop) => lop.employee_id === employeeId);
// //   if (employeeLop && employeeLop.lop_days) {
// //     const workingDaysInMonth = 30;
// //     const dailySalary = monthlyCtc / workingDaysInMonth;
// //     lopDeduction = Math.round(parseFloat(employeeLop.lop_days) * dailySalary);
// //     console.log(`LOP Deduction for ${employeeId}: ${employeeLop.lop_days} days * ₹${dailySalary} = ₹${lopDeduction}`);
// //   }
// //   console.log(`LOP Deduction: ₹${lopDeduction}`);

// //   if (planData?.isInsuranceApplicable && planData.insuranceType === "percentage" && planData.insurancePercentage) {
// //     insurance = Math.round(annualCtc * (parseFloat(planData.insurancePercentage) / 100));
// //   } else if (planData?.insuranceAmount) {
// //     insurance = parseFloat(planData.insuranceAmount);
// //   }
// //   console.log(`Insurance: ₹${insurance}`);

// //   const taxableIncome = basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances - employeePF - esic - insurance;
// //   let incomeTax = taxableIncome > 1200000 ? Math.round((taxableIncome - 1200000) * 0.05) : 0;
// //   console.log(`Taxable Income: ₹${taxableIncome}, Income Tax: ₹${incomeTax}`);

// //   const netSalaryAnnual = taxableIncome - employeePF - professionalTax - incomeTax - esic - advanceRecovery - insurance - lopDeduction;
// //   const netSalaryMonthly = Math.round(netSalaryAnnual / 12);

// //   const salaryDetails = {
// //     basicSalary: Math.round(basicSalary / 12),
// //     hra: Math.round(hra / 12),
// //     ltaAllowance: Math.round(ltaAllowance / 12),
// //     incentives: Math.round(incentives / 12),
// //     overtimePay: Math.round(overtimePay),
// //     bonusPay: Math.round(bonusPay),
// //     employeePF: Math.round(employeePF / 12),
// //     employerPF: Math.round(employerPF / 12),
// //     esic: Math.round(esic / 12),
// //     gratuity: Math.round(gratuity / 12),
// //     professionalTax: Math.round(professionalTax / 12),
// //     otherAllowances: Math.round(otherAllowances / 12),
// //     incomeTax: Math.round(incomeTax / 12),
// //     advanceRecovery: Math.round(advanceRecovery),
// //     insurance: Math.round(insurance / 12),
// //     lopDeduction: Math.round(lopDeduction),
// //     netSalary: netSalaryMonthly,
// //     grossSalary: Math.round((basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances) / 12),
// //   };

// //   console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));

// //   return salaryDetails;
// // };

// // export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, lopDetails) => {
// //   let totalTDS = 0,
// //     totalEmployeePF = 0,
// //     totalEmployerPF = 0,
// //     totalNetSalary = 0,
// //     totalGross = 0,
// //     totalPayable = 0,
// //     totalAdvance = 0,
// //     totalOvertime = 0,
// //     totalBonus = 0,
// //     totalInsurance = 0,
// //     totalLopDeduction = 0;

// //   employees.forEach((emp) => {
// //     const salaryDetails = calculateSalaryDetails(emp.ctc, emp.plan_data, emp.employee_id, overtimeRecords, bonusRecords, advances, lopDetails);
// //     if (salaryDetails) {
// //       totalTDS += salaryDetails.incomeTax;
// //       totalEmployeePF += salaryDetails.employeePF;
// //       totalEmployerPF += salaryDetails.employerPF;
// //       totalNetSalary += salaryDetails.netSalary;
// //       totalGross += salaryDetails.grossSalary;
// //       totalPayable += salaryDetails.netSalary;
// //       totalAdvance += salaryDetails.advanceRecovery;
// //       totalOvertime += salaryDetails.overtimePay;
// //       totalBonus += salaryDetails.bonusPay;
// //       totalInsurance += salaryDetails.insurance;
// //       totalLopDeduction += salaryDetails.lopDeduction;
// //     }
// //   });

// //   return {
// //     totalTDS,
// //     totalEmployeePF,
// //     totalEmployerPF,
// //     totalNetSalary,
// //     totalGross,
// //     totalPayable,
// //     totalAdvance,
// //     totalOvertime,
// //     totalBonus,
// //     totalInsurance,
// //     totalLopDeduction,
// //   };
// // };

// // export const getMonthlySalary = (employeeId, employees) => {
// //   const employee = employees.find(emp => emp.employee_id === employeeId);
// //   if (!employee || !employee.ctc) return 0;
// //   const salaryDetails = calculateSalaryDetails(employee.ctc, employee.plan_data, employeeId);
// //   return salaryDetails ? salaryDetails.netSalary : 0;
// // };

// // export const calculateAdvancePerIteration = (advanceModal) => {
// //   const { advanceAmount, recoveryMonths } = advanceModal;
// //   if (!advanceAmount || !recoveryMonths || parseFloat(recoveryMonths) <= 0) return "";
// //   const amount = parseFloat(advanceAmount);
// //   const months = parseInt(recoveryMonths);
// //   const perIteration = Math.round(amount / months);
// //   return Array(months).fill(perIteration).join(" + ");
// // };

// // Utility function to parse applicable month string (e.g., "2025-07" or "July")
// export const parseApplicableMonth = (monthStr) => {
//   if (!monthStr || typeof monthStr !== 'string') {
//     console.log(`Invalid applicable_month format: ${monthStr}`);
//     return null;
//   }

//   if (/^\d{4}-\d{2}$/.test(monthStr)) {
//     const [year, month] = monthStr.split('-').map(Number);
//     if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
//       console.log(`Invalid year or month in ${monthStr}`);
//       return null;
//     }
//     return new Date(year, month - 1);
//   }

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthStr.toLowerCase());
//   if (monthIndex !== -1) {
//     return new Date(new Date().getFullYear(), monthIndex);
//   }

//   console.log(`Invalid applicable_month format: ${monthStr}`);
//   return null;
// };

// // Utility function to parse work date string
// export const parseWorkDate = (dateStr) => {
//   if (!dateStr || typeof dateStr !== 'string') {
//     console.log(`Invalid work_date format: ${dateStr}`);
//     return null;
//   }
//   const date = new Date(dateStr);
//   if (isNaN(date.getTime())) {
//     console.log(`Invalid work_date format: ${dateStr}`);
//     return null;
//   }
//   return date;
// };

// // Calculate monthly salary details for an employee
// export const calculateSalaryDetails = (
//   ctc,
//   planData,
//   employeeId,
//   overtimeRecords = [],
//   bonusRecords = [],
//   advances = [],
//   lopDetails = []
// ) => {
//   // Defensive checks for input arrays
//   const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
//   const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
//   const safeAdvances = Array.isArray(advances) ? advances : [];
//   const safeLopDetails = Array.isArray(lopDetails) ? lopDetails : [];

//   if (!ctc || ctc <= 0 || !employeeId) {
//     console.log(`Invalid CTC (${ctc}) or employeeId (${employeeId})`);
//     return {
//       basicSalary: 0,
//       hra: 0,
//       ltaAllowance: 0,
//       incentives: 0,
//       overtimePay: 0,
//       bonusPay: 0,
//       employeePF: 0,
//       employerPF: 0,
//       esic: 0,
//       gratuity: 0,
//       professionalTax: 0,
//       otherAllowances: 0,
//       advanceRecovery: 0,
//       insurance: 0,
//       lopDeduction: 0,
//       grossSalary: 0,
//       netSalary: 0,
//     };
//   }

//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');

//   console.log(`Calculating salary for employee ${employeeId} for ${currentYear}-${currentMonth}`);
//   console.log(`planData:`, JSON.stringify(planData, null, 2));
//   console.log(`overtimeRecords:`, JSON.stringify(safeOvertimeRecords, null, 2));

//   const monthlyCtc = Math.round(parseFloat(ctc) / 12);

//   let basicSalary = 0,
//       hra = 0,
//       ltaAllowance = 0,
//       incentives = 0,
//       overtimePay = 0,
//       bonusPay = 0,
//       employeePF = 0,
//       employerPF = 0,
//       esic = 0,
//       gratuity = 0,
//       professionalTax = 0,
//       otherAllowances = 0,
//       advanceRecovery = 0,
//       insurance = 0,
//       lopDeduction = 0;

//   if (planData?.isBasicSalary && planData.basicSalaryType === "percentage" && planData.basicSalary) {
//     basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
//   } else if (planData?.basicSalaryAmount) {
//     basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
//   } else {
//     basicSalary = Math.round(monthlyCtc * 0.4);
//   }
//   console.log(`Basic Salary (monthly): ₹${basicSalary}`);

//   if (planData?.isHouseRentAllowance && planData.houseRentAllowanceType === "percentage" && planData.houseRentAllowance) {
//     hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
//   } else if (planData?.houseRentAllowanceAmount) {
//     hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
//   } else {
//     hra = Math.round(basicSalary * 0.5);
//   }
//   console.log(`HRA (monthly): ₹${hra}`);

//   if (planData?.isLtaAllowance && planData.ltaAllowanceType === "percentage" && planData.ltaAllowance) {
//     hra = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
//   } else if (planData?.ltaAllowanceAmount) {
//     ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
//   } else {
//     ltaAllowance = 0;
//   }
//   console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

//   if (planData?.isIncentives && planData.incentivesType === "amount" && planData.incentivesAmount) {
//     incentives = Math.round(parseFloat(planData.incentivesAmount) / 12);
//   }
//   console.log(`Incentives (monthly): ₹${incentives}`);

//   console.log(`Filtering overtime records for employee ${employeeId}`);
//   const employeeOvertime = safeOvertimeRecords.filter((ot) => {
//     const otDate = parseWorkDate(ot.work_date);
//     const isValid = (
//       ot.employee_id === employeeId &&
//       ot.status === "Approved" &&
//       otDate &&
//       otDate.getFullYear() === currentYear &&
//       (otDate.getMonth() + 1).toString().padStart(2, '0') === currentMonth
//     );
//     console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
//     return isValid;
//   });

//   overtimePay = employeeOvertime.reduce((total, ot) => {
//     const hours = parseFloat(ot.extra_hours);
//     let rate = parseFloat(ot.rate);
//     console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

//     if (!rate || isNaN(rate) || rate === 0) {
//       if (planData?.isOvertimePay && planData.overtimePayAmount && !isNaN(parseFloat(planData.overtimePayAmount))) {
//         rate = parseFloat(planData.overtimePayAmount);
//         console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
//       } else {
//         rate = 0;
//         console.log(`No valid rate or overtimePayAmount; using rate=0`);
//       }
//     }

//     if (isNaN(hours) || hours <= 0) {
//       console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
//       return total;
//     }

//     const pay = hours * rate;
//     console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
//     return total + pay;
//   }, 0);
//   console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

//   const employeeBonuses = safeBonusRecords.filter((bonus) => {
//     const date = parseApplicableMonth(bonus.applicable_month);
//     const isValid = date &&
//                     date.getFullYear() === currentYear &&
//                     (date.getMonth() + 1).toString().padStart(2, '0') === currentMonth;
//     console.log(`Checking bonus ID ${bonus.id}: applicable_month=${bonus.applicable_month}, isValid=${isValid}`);
//     return isValid;
//   });

//   console.log(`Employee ${employeeId} bonuses for ${currentYear}-${currentMonth}:`, employeeBonuses);

//   bonusPay = employeeBonuses.reduce((total, bonus) => {
//     let amount = 0;
//     if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
//       amount = parseFloat(bonus.fixed_amount);
//       console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount}`);
//     } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
//       amount = Math.round((parseFloat(bonus.percentage_ctc) / 100) * ctc / 12);
//       console.log(`Bonus ID ${bonus.id}: Applying percentage_ctc=₹${amount}`);
//     } else if (bonus.percentage_monthly_salary && monthlyCtc && !isNaN(parseFloat(bonus.percentage_monthly_salary))) {
//       amount = Math.round((parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc);
//       console.log(`Bonus ID ${bonus.id}: Applying percentage_monthly_salary=₹${amount}`);
//     }
//     return total + amount;
//   }, 0);
//   console.log(`Total bonusPay for employee ${employeeId}: ₹${bonusPay}`);

//   if (planData?.isPFApplicable && planData.pfType === "percentage" && planData.pfPercentage) {
//     employeePF = Math.round(basicSalary * (parseFloat(planData.pfPercentage) / 100));
//   } else if (planData?.pfAmount) {
//     employeePF = Math.round(parseFloat(planData.pfAmount) / 12);
//   } else {
//     employeePF = Math.round(basicSalary * 0.12);
//   }
//   console.log(`Employee PF (monthly): ₹${employeePF}`);

//   if (planData?.isPfEmployer && planData.pfEmployerType === "percentage" && planData.pfEmployerCeilingPercentage && planData.isPFEmployerCeiling) {
//     employerPF = Math.min(Math.round(basicSalary * (parseFloat(planData.pfEmployerCeilingPercentage) / 100)), 1800);
//   } else if (planData?.pfEmployerAmount) {
//     employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
//   } else {
//     employerPF = employeePF;
//   }
//   console.log(`Employer PF (monthly): ₹${employerPF}`);

//   if (planData?.isESICApplicable && planData.esicType === "percentage" && planData.esicPercentage) {
//     esic = Math.round(monthlyCtc * (parseFloat(planData.esicPercentage) / 100));
//   } else if (planData?.esicAmount) {
//     esic = Math.round(parseFloat(planData.esicAmount) / 12);
//   } else {
//     esic = 0;
//   }
//   console.log(`ESIC (monthly): ₹${esic}`);

//   if (planData?.isGratuityApplicable && planData.gratuityType === "percentage" && planData.gratuityPercentage) {
//     gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
//   } else if (planData?.gratuityAmount) {
//     gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
//   } else {
//     gratuity = Math.round(basicSalary * 0.0481);
//   }
//   console.log(`Gratuity (monthly): ₹${gratuity}`);

//   if (planData?.isProfessionalTax && planData.professionalTaxType === "percentage" && planData.professionalTax) {
//     professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
//   } else if (planData?.professionalTaxAmount) {
//     professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
//   } else {
//     professionalTax = monthlyCtc <= 15000 ? 0 : 200;
//   }
//   console.log(`Professional Tax (monthly): ₹${professionalTax}`);

//   if (planData?.isOtherAllowance && planData.otherAllowanceType === "amount" && planData.otherAllowanceAmount) {
//     otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
//   } else {
//     otherAllowances = Math.max(0, monthlyCtc - basicSalary - hra - ltaAllowance - incentives - overtimePay - bonusPay - employerPF - gratuity - esic);
//   }
//   console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

//   const employeeAdvances = safeAdvances.filter((adv) => {
//     if (!adv.applicable_months || !adv.recovery_months) return false;
//     const advDate = parseApplicableMonth(adv.applicable_months);
//     if (!advDate) return false;
//     const advYear = advDate.getFullYear();
//     const advMonth = advDate.getMonth() + 1;
//     const recoveryMonths = parseInt(adv.recovery_months);
//     const startMonth = advMonth;
//     const startYear = advYear;
//     let endYear = startYear;
//     let endMonth = startMonth + recoveryMonths - 1;
//     if (endMonth > 12) {
//       endYear += Math.floor((endMonth - 1) / 12);
//       endMonth = ((endMonth - 1) % 12) + 1;
//     }
//     const currentDate = new Date(currentYear, parseInt(currentMonth) - 1);
//     const startDate = new Date(startYear, startMonth - 1);
//     const endDate = new Date(endYear, endMonth - 1);
//     const isValid = (
//       adv.employee_id === employeeId &&
//       currentDate >= startDate &&
//       currentDate <= endDate
//     );
//     console.log(`Advance check: employeeId=${adv.employee_id}, applicable_months=${adv.applicable_months}, recovery_months=${adv.recovery_months}, isValid=${isValid}`);
//     return isValid;
//   });

//   advanceRecovery = employeeAdvances.reduce((total, adv) => {
//     const amount = parseFloat(adv.advance_amount);
//     const months = parseInt(adv.recovery_months);
//     const recovery = months > 0 ? amount / months : 0;
//     console.log(`Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`);
//     return total + recovery;
//   }, 0);
//   console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

//   const employeeLop = safeLopDetails.find((lop) => lop.employee_id === employeeId);
//   if (employeeLop && employeeLop.lop_days) {
//     const workingDaysInMonth = 30;
//     const dailySalary = monthlyCtc / workingDaysInMonth;
//     lopDeduction = Math.round(parseFloat(employeeLop.lop_days) * dailySalary);
//     console.log(`LOP Deduction for ${employeeId}: ${employeeLop.lop_days} days * ₹${dailySalary} = ₹${lopDeduction}`);
//   }
//   console.log(`LOP Deduction (monthly): ₹${lopDeduction}`);

//   if (planData?.isInsuranceApplicable && planData.insuranceType === "percentage" && planData.insurancePercentage) {
//     insurance = Math.round(monthlyCtc * (parseFloat(planData.insurancePercentage) / 100));
//   } else if (planData?.insuranceAmount) {
//     insurance = Math.round(parseFloat(planData.insuranceAmount) / 12);
//   } else {
//     insurance = 0;
//   }
//   console.log(`Insurance (monthly): ₹${insurance}`);

//   const taxableIncome = basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances - employeePF - esic - insurance;
//   const incomeTax = taxableIncome > 1200000 / 12 ? Math.round((taxableIncome - 1200000 / 12) * 0.05) : 0;
//   console.log(`Taxable Income (monthly): ₹${taxableIncome}, Income Tax (monthly): ₹${incomeTax}`);

//   const grossSalary = basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances;
//   const netSalary = grossSalary - employeePF - professionalTax - incomeTax - esic - advanceRecovery - insurance - lopDeduction;

//   const salaryDetails = {
//     basicSalary: Math.round(basicSalary),
//     hra: Math.round(hra),
//     ltaAllowance: Math.round(ltaAllowance),
//     incentives: Math.round(incentives),
//     overtimePay: Math.round(overtimePay),
//     bonusPay: Math.round(bonusPay),
//     employeePF: Math.round(employeePF),
//     employerPF: Math.round(employerPF),
//     esic: Math.round(esic),
//     gratuity: Math.round(gratuity),
//     professionalTax: Math.round(professionalTax),
//     otherAllowances: Math.round(otherAllowances),
//     incomeTax: Math.round(incomeTax),
//     advanceRecovery: Math.round(advanceRecovery),
//     insurance: Math.round(insurance),
//     lopDeduction: Math.round(lopDeduction),
//     grossSalary: Math.round(grossSalary),
//     netSalary: Math.round(netSalary),
//   };

//   console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));

//   return salaryDetails;
// };

// // Calculate totals across all employees
// export const calculateTotals = (
//   employees,
//   overtimeRecords = [],
//   bonusRecords = [],
//   advances = [],
//   lopDetails = []
// ) => {
//   const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
//   const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
//   const safeAdvances = Array.isArray(advances) ? advances : [];
//   const safeLopDetails = Array.isArray(lopDetails) ? lopDetails : [];

//   return employees.reduce(
//     (totals, emp) => {
//       const salaryDetails = calculateSalaryDetails(
//         emp.ctc,
//         emp.plan_data,
//         emp.employee_id,
//         safeOvertimeRecords,
//         safeBonusRecords,
//         safeAdvances,
//         safeLopDetails
//       );
//       if (!salaryDetails) {
//         return totals;
//       }
//       return {
//         totalTDS: totals.totalTDS + salaryDetails.incomeTax,
//         totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
//         totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
//         totalNetSalary: totals.totalNetSalary + salaryDetails.netSalary,
//         totalGross: totals.totalGross + salaryDetails.grossSalary,
//         totalPayable: totals.totalPayable + salaryDetails.netSalary,
//         totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
//         totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
//         totalBonus: totals.totalBonus + salaryDetails.bonusPay,
//         totalInsurance: totals.totalInsurance + salaryDetails.insurance,
//         totalLopDeduction: totals.totalLopDeduction + salaryDetails.lopDeduction,
//       };
//     },
//     {
//       totalTDS: 0,
//       totalEmployeePF: 0,
//       totalEmployerPF: 0,
//       totalNetSalary: 0,
//       totalGross: 0,
//       totalPayable: 0,
//       totalAdvance: 0,
//       totalOvertime: 0,
//       totalBonus: 0,
//       totalInsurance: 0,
//       totalLopDeduction: 0,
//     }
//   );
// };

// // Get monthly gross salary for an employee
// export const getMonthlySalary = (employeeId, employees) => {
//   if (!employeeId || !Array.isArray(employees)) {
//     console.log(`Invalid employeeId (${employeeId}) or employees array`);
//     return 0;
//   }
//   const employee = employees.find(emp => emp.employee_id === employeeId);
//   if (!employee || !employee.ctc || !employee.plan_data) {
//     console.log(`Employee not found or missing ctc/plan_data for employeeId: ${employeeId}`);
//     return 0;
//   }
//   const salaryDetails = calculateSalaryDetails(
//     employee.ctc,
//     employee.plan_data,
//     employeeId,
//     [], // Pass empty arrays to avoid fetching issues
//     [],
//     [],
//     []
//   );
//   return salaryDetails ? salaryDetails.grossSalary : 0;
// };

// // Calculate advance amount per iteration
// export const calculateAdvancePerIteration = (advanceModal) => {
//   const { advanceAmount, recoveryMonths } = advanceModal;
//   if (!advanceAmount || !recoveryMonths || parseFloat(recoveryMonths) <= 0) {
//     console.log(`Invalid advanceAmount (${advanceAmount}) or recoveryMonths (${recoveryMonths})`);
//     return 0;
//   }
//   const amount = parseFloat(advanceAmount);
//   const months = parseInt(recoveryMonths);
//   const perIteration = Math.round(amount / months);
//   console.log(`Advance per iteration: ₹${amount} / ${months} = ₹${perIteration}`);
//   return perIteration;
// };
export const parseApplicableMonth = (monthStr) => {
  if (!monthStr || typeof monthStr !== 'string') {
    console.log(`Invalid applicable_month format: ${monthStr}`);
    return null;
  }

  if (/^\d{4}-\d{2}$/.test(monthStr)) {
    const [year, month] = monthStr.split('-').map(Number);
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      console.log(`Invalid year or month in ${monthStr}`);
      return null;
    }
    return new Date(year, month - 1);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex = monthNames.findIndex(name => name.toLowerCase() === monthStr.toLowerCase());
  if (monthIndex !== -1) {
    return new Date(new Date().getFullYear(), monthIndex);
  }

  console.log(`Invalid applicable_month format: ${monthStr}`);
  return null;
};

// Utility function to parse work date string
// SalaryCalculations.js
export const parseWorkDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error(`Error parsing work date: ${dateStr}`, error);
    return null;
  }
};

// export const parseApplicableMonth = (monthStr) => {
//   try {
//     const date = new Date(monthStr);
//     return isNaN(date.getTime()) ? null : date;
//   } catch (error) {
//     console.error(`Error parsing applicable month: ${monthStr}`, error);
//     return null;
//   }
// };

export const getWorkingDaysInMonth = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      workingDays++;
    }
  }
  return workingDays;
};

export const calculateSalaryDetails = (
  ctc,
  planData,
  employeeId,
  overtimeRecords = [],
  bonusRecords = [],
  advances = [],
  lopDetails = []
) => {
  // Ensure input arrays are valid
  const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
  const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
  const safeAdvances = Array.isArray(advances) ? advances : [];
  const safeLopDetails = Array.isArray(lopDetails) ? lopDetails : [];

  // Log inputs for debugging
  console.log(`calculateSalaryDetails inputs: employeeId=${employeeId}, ctc=${ctc}, planData=`, JSON.stringify(planData, null, 2));
  console.log(`safeOvertimeRecords:`, JSON.stringify(safeOvertimeRecords, null, 2));

  // Validate employeeId
  if (!employeeId) {
    console.error(`Invalid employeeId (${employeeId})`);
    return null;
  }

  // Handle invalid or missing CTC
  if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
    console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
    ctc = 0;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const monthlyCtc = ctc ? Math.round(parseFloat(ctc) / 12) : 0;

  // Initialize components
  let basicSalary = 0,
      hra = 0,
      ltaAllowance = 0,
      incentives = 0,
      overtimePay = 0,
      bonusPay = 0,
      employeePF = 0,
      employerPF = 0,
      esic = 0,
      gratuity = 0,
      professionalTax = 0,
      otherAllowances = 0,
      advanceRecovery = 0,
      insurance = 0,
      lopDeduction = 0;

  // Validate planData
  if (!planData || typeof planData !== 'object') {
    console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
    planData = {};
  }

  // Basic Salary
  if (planData.isBasicSalary && planData.basicSalaryType === "percentage" && planData.basicSalary && !isNaN(parseFloat(planData.basicSalary))) {
    basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
  } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
    basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
  } else {
    basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
    console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
  }
  console.log(`Basic Salary (monthly): ₹${basicSalary}`);

  // HRA
  if (planData.isHouseRentAllowance && planData.houseRentAllowanceType === "percentage" && planData.houseRentAllowance && !isNaN(parseFloat(planData.houseRentAllowance))) {
    hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
  } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
    hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
  } else {
    hra = Math.round(basicSalary * 0.5);
    console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
  }
  console.log(`HRA (monthly): ₹${hra}`);

  // LTA Allowance
  if (planData.isLtaAllowance && planData.ltaAllowanceType === "percentage" && planData.ltaAllowance && !isNaN(parseFloat(planData.ltaAllowance))) {
    ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
  } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
    ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
  } else {
    ltaAllowance = 0;
    console.warn(`No LTA Allowance defined for employee ${employeeId}`);
  }
  console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

  // Overtime Pay
  console.log(`Filtering overtime records for employee ${employeeId}`);
  const employeeOvertime = safeOvertimeRecords.filter((ot) => {
    const otDate = parseWorkDate(ot.work_date);
    const isValid = (
      ot.employee_id === employeeId &&
      ot.status === "Approved" &&
      otDate &&
      otDate.getFullYear() === currentYear &&
      (otDate.getMonth() + 1).toString().padStart(2, '0') === currentMonth
    );
    console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
    return isValid;
  });

  overtimePay = employeeOvertime.reduce((total, ot) => {
    const hours = parseFloat(ot.extra_hours);
    let rate = parseFloat(ot.rate);
    console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

    if (!rate || isNaN(rate) || rate === 0) {
      if (planData?.isOvertimePay && planData.overtimePayAmount && !isNaN(parseFloat(planData.overtimePayAmount))) {
        rate = parseFloat(planData.overtimePayAmount);
        console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
      } else {
        rate = 0;
        console.log(`No valid rate or overtimePayAmount; using rate=0`);
      }
    }

    if (isNaN(hours) || hours <= 0) {
      console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
      return total;
    }

    const pay = hours * rate;
    console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
    return total + pay;
  }, 0);
  console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

  // Bonus Pay
  const employeeBonuses = safeBonusRecords.filter((bonus) => {
    const date = parseApplicableMonth(bonus.applicable_month);
    const isValid = date &&
                    date.getFullYear() === currentYear &&
                    (date.getMonth() + 1).toString().padStart(2, '0') === currentMonth;
    console.log(`Checking bonus ID ${bonus.id}: applicable_month=${bonus.applicable_month}, isValid=${isValid}`);
    return isValid;
  });

  bonusPay = employeeBonuses.reduce((total, bonus) => {
    let amount = 0;
    if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
      amount = parseFloat(bonus.fixed_amount);
      console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount}`);
    } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
      amount = Math.round((parseFloat(bonus.percentage_ctc) / 100) * ctc / 12);
      console.log(`Bonus ID ${bonus.id}: Applying percentage_ctc=₹${amount}`);
    } else if (bonus.percentage_monthly_salary && monthlyCtc && !isNaN(parseFloat(bonus.percentage_monthly_salary))) {
      amount = Math.round((parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc);
      console.log(`Bonus ID ${bonus.id}: Applying percentage_monthly_salary=₹${amount}`);
    }
    return total + amount;
  }, 0);
  console.log(`Total bonusPay for employee ${employeeId}: ₹${bonusPay}`);

  // Employee PF
  if (planData?.isPFApplicable && planData.pfType === "percentage" && planData.pfPercentage && !isNaN(parseFloat(planData.pfPercentage))) {
    employeePF = Math.round(basicSalary * (parseFloat(planData.pfPercentage) / 100));
  } else if (planData?.pfAmount && !isNaN(parseFloat(planData.pfAmount))) {
    employeePF = Math.round(parseFloat(planData.pfAmount) / 12);
  } else {
    employeePF = Math.round(basicSalary * 0.12);
    console.warn(`Using default employeePF (12% of basicSalary) for employee ${employeeId}`);
  }
  console.log(`Employee PF (monthly): ₹${employeePF}`);

  // Employer PF
  if (planData?.isPfEmployer && planData.pfEmployerType === "percentage" && planData.pfEmployerCeilingPercentage && !isNaN(parseFloat(planData.pfEmployerCeilingPercentage))) {
    employerPF = Math.min(Math.round(basicSalary * (parseFloat(planData.pfEmployerCeilingPercentage) / 100)), 1800);
  } else if (planData?.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
    employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
  } else {
    employerPF = employeePF;
    console.warn(`Using default employerPF (equal to employeePF) for employee ${employeeId}`);
  }
  console.log(`Employer PF (monthly): ₹${employerPF}`);

  // ESIC
  if (planData?.isESICApplicable && planData.esicType === "percentage" && planData.esicPercentage && !isNaN(parseFloat(planData.esicPercentage))) {
    esic = Math.round(monthlyCtc * (parseFloat(planData.esicPercentage) / 100));
  } else if (planData?.esicAmount && !isNaN(parseFloat(planData.esicAmount))) {
    esic = Math.round(parseFloat(planData.esicAmount) / 12);
  } else {
    esic = 0;
    console.warn(`No ESIC defined for employee ${employeeId}`);
  }
  console.log(`ESIC (monthly): ₹${esic}`);

  // Gratuity
  if (planData?.isGratuityApplicable && planData.gratuityType === "percentage" && planData.gratuityPercentage && !isNaN(parseFloat(planData.gratuityPercentage))) {
    gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
  } else if (planData?.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
    gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
  } else {
    gratuity = Math.round(basicSalary * 0.0481);
    console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
  }
  console.log(`Gratuity (monthly): ₹${gratuity}`);

  // Professional Tax
  if (planData?.isProfessionalTax && planData.professionalTaxType === "percentage" && planData.professionalTax && !isNaN(parseFloat(planData.professionalTax))) {
    professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
  } else if (planData?.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
    professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
  } else {
    professionalTax = monthlyCtc <= 15000 ? 0 : 200;
    console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
  }
  console.log(`Professional Tax (monthly): ₹${professionalTax}`);

  // Other Allowances
  if (planData?.isOtherAllowance && planData.otherAllowanceType === "percentage" && planData.otherAllowance && !isNaN(parseFloat(planData.otherAllowance))) {
    otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
  } else if (planData?.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
    otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
  } else {
    otherAllowances = Math.max(0, monthlyCtc - basicSalary - hra - ltaAllowance - incentives - overtimePay - bonusPay - employerPF - gratuity - esic);
    console.warn(`Using calculated otherAllowances for employee ${employeeId}`);
  }
  console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

  // Advance Recovery
  const employeeAdvances = safeAdvances.filter((adv) => {
    if (!adv.applicable_months || !adv.recovery_months) return false;
    const advDate = parseApplicableMonth(adv.applicable_months);
    if (!advDate) return false;
    const advYear = advDate.getFullYear();
    const advMonth = advDate.getMonth() + 1;
    const recoveryMonths = parseInt(adv.recovery_months);
    const startMonth = advMonth;
    const startYear = advYear;
    let endYear = startYear;
    let endMonth = startMonth + recoveryMonths - 1;
    if (endMonth > 12) {
      endYear += Math.floor((endMonth - 1) / 12);
      endMonth = ((endMonth - 1) % 12) + 1;
    }
    const currentDate = new Date(currentYear, parseInt(currentMonth) - 1);
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    const isValid = (
      adv.employee_id === employeeId &&
      currentDate >= startDate &&
      currentDate <= endDate
    );
    console.log(`Advance check: employeeId=${adv.employee_id}, applicable_months=${adv.applicable_months}, recovery_months=${adv.recovery_months}, isValid=${isValid}`);
    return isValid;
  });

  advanceRecovery = employeeAdvances.reduce((total, adv) => {
    const amount = parseFloat(adv.advance_amount);
    const months = parseInt(adv.recovery_months);
    const recovery = months > 0 ? amount / months : 0;
    console.log(`Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`);
    return total + recovery;
  }, 0);
  console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

  // LOP Deduction
  const employeeLopRecords = safeLopDetails.filter((lop) => lop.employee_id === employeeId);
  if (employeeLopRecords.length > 0) {
    const totalLopDays = employeeLopRecords.reduce((sum, lop) => {
      const lopDays = parseFloat(lop.emp_lop);
      return (lop.emp_lop !== null && !isNaN(lopDays) && lopDays >= 0) ? sum + lopDays : sum;
    }, 0);
    if (totalLopDays > 0) {
      const workingDaysInMonth = getWorkingDaysInMonth(parseInt(currentYear), parseInt(currentMonth));
      if (workingDaysInMonth === 0) {
        console.log(`No working days in ${currentYear}-${currentMonth}, setting lopDeduction to 0`);
        lopDeduction = 0;
      } else {
        const dailySalary = monthlyCtc / workingDaysInMonth;
        lopDeduction = Math.round(totalLopDays * dailySalary);
        console.log(`LOP Deduction for ${employeeId}: ${totalLopDays} days * ₹${dailySalary.toFixed(2)} = ₹${lopDeduction}`);
      }
    } else {
      console.log(`No valid LOP days found for employee ${employeeId}`);
    }
  } else {
    console.log(`No LOP records found for employee ${employeeId}`);
  }
  console.log(`LOP Deduction (monthly): ₹${lopDeduction}`);

  // Insurance
  if (planData?.isInsuranceApplicable && planData.insuranceType === "percentage" && planData.insurancePercentage && !isNaN(parseFloat(planData.insurancePercentage))) {
    insurance = Math.round(monthlyCtc * (parseFloat(planData.insurancePercentage) / 100));
  } else if (planData?.insuranceAmount && !isNaN(parseFloat(planData.insuranceAmount))) {
    insurance = Math.round(parseFloat(planData.insuranceAmount) / 12);
  } else {
    insurance = 0;
    console.warn(`No insurance defined for employee ${employeeId}`);
  }
  console.log(`Insurance (monthly): ₹${insurance}`);

  // Income Tax
  const taxableIncome = basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances - employeePF - esic - insurance;
  const incomeTax = taxableIncome > 1200000 / 12 ? Math.round((taxableIncome - 1200000 / 12) * 0.05) : 0;
  console.log(`Taxable Income (monthly): ₹${taxableIncome}, Income Tax (monthly): ₹${incomeTax}`);

  // Calculate Gross and Net Salary
  const grossSalary = basicSalary + hra + ltaAllowance + incentives + overtimePay + bonusPay + otherAllowances;
  const netSalary = grossSalary - employeePF - professionalTax - incomeTax - esic - advanceRecovery - insurance - lopDeduction;

  const salaryDetails = {
    basicSalary: Math.round(basicSalary),
    hra: Math.round(hra),
    ltaAllowance: Math.round(ltaAllowance),
    incentives: Math.round(incentives),
    overtimePay: Math.round(overtimePay),
    bonusPay: Math.round(bonusPay),
    employeePF: Math.round(employeePF),
    employerPF: Math.round(employerPF),
    esic: Math.round(esic),
    gratuity: Math.round(gratuity),
    professionalTax: Math.round(professionalTax),
    otherAllowances: Math.round(otherAllowances),
    incomeTax: Math.round(incomeTax),
    advanceRecovery: Math.round(advanceRecovery),
    insurance: Math.round(insurance),
    lopDeduction: Math.round(lopDeduction),
    grossSalary: Math.round(grossSalary),
    netSalary: Math.round(netSalary),
  };

  console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
  return salaryDetails;
};

export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, lopDetails) => {
  if (!Array.isArray(employees)) {
    console.error("Invalid employees array in calculateTotals");
    return {
      totalPayable: 0,
      totalGross: 0,
      totalTDS: 0,
      totalAdvance: 0,
      totalOvertime: 0,
      totalBonus: 0,
      totalEmployeePF: 0,
      totalEmployerPF: 0,
      totalInsurance: 0,
      totalLopDeduction: 0,
    };
  }

  return employees.reduce(
    (totals, emp) => {
      const salaryDetails = calculateSalaryDetails(
        emp.ctc,
        emp.plan_data,
        emp.employee_id,
        overtimeRecords,
        bonusRecords,
        advances,
        lopDetails
      );
      if (!salaryDetails) {
        console.warn(`No salary details for employee ${emp.employee_id}`);
        return totals;
      }

      return {
        totalPayable: totals.totalPayable + salaryDetails.netSalary,
        totalGross: totals.totalGross + salaryDetails.grossSalary,
        totalTDS: totals.totalTDS + salaryDetails.incomeTax,
        totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
        totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
        totalBonus: totals.totalBonus + salaryDetails.bonusPay,
        totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
        totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
        totalInsurance: totals.totalInsurance + salaryDetails.insurance,
        totalLopDeduction: totals.totalLopDeduction + salaryDetails.lopDeduction,
      };
    },
    {
      totalPayable: 0,
      totalGross: 0,
      totalTDS: 0,
      totalAdvance: 0,
      totalOvertime: 0,
      totalBonus: 0,
      totalEmployeePF: 0,
      totalEmployerPF: 0,
      totalInsurance: 0,
      totalLopDeduction: 0,
    }
  );
};

export const getMonthlySalary = (employeeId, employees) => {
  const employee = employees.find((emp) => emp.employee_id === employeeId);
  if (!employee || !employee.ctc) return 0;
  return Math.round(parseFloat(employee.ctc) / 12);
};

export const calculateAdvancePerIteration = (advanceModal) => {
  const { advanceAmount, recoveryMonths } = advanceModal;
  if (!advanceAmount || !recoveryMonths || parseInt(recoveryMonths) <= 0) return 0;
  return Math.round(parseFloat(advanceAmount) / parseInt(recoveryMonths));
};