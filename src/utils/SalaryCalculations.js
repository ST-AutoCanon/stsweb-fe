
// // // // export const getCurrentYearMonth = () => {
// // // //   const year = new Date().getFullYear();
// // // //   const month = String(new Date().getMonth() + 1).padStart(2, "0");
// // // //   return `${year}-${month}`; // e.g. "2025-09"
// // // // };

// // // // export const parseApplicableMonth = (monthStr) => {
// // // //   if (!monthStr || typeof monthStr !== "string") {
// // // //     console.log(`Invalid applicable_month format: ${monthStr}`);
// // // //     return null;
// // // //   }

// // // //   if (/^\d{4}-\d{2}$/.test(monthStr)) {
// // // //     const [year, month] = monthStr.split("-").map(Number);
// // // //     if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
// // // //       console.log(`Invalid year or month in ${monthStr}`);
// // // //       return null;
// // // //     }
// // // //     return new Date(year, month - 1);
// // // //   }

// // // //   const monthNames = [
// // // //     "January", "February", "March", "April", "May", "June",
// // // //     "July", "August", "September", "October", "November", "December",
// // // //   ];
// // // //   const monthIndex = monthNames.findIndex(
// // // //     (name) => name.toLowerCase() === monthStr.toLowerCase()
// // // //   );
// // // //   if (monthIndex !== -1) {
// // // //     return new Date(new Date().getFullYear(), monthIndex);
// // // //   }

// // // //   console.log(`Invalid applicable_month format: ${monthStr}`);
// // // //   return null;
// // // // };

// // // // export const parseWorkDate = (dateStr) => {
// // // //   try {
// // // //     const date = new Date(dateStr);
// // // //     return isNaN(date.getTime()) ? null : date;
// // // //   } catch (error) {
// // // //     console.error(`Error parsing work date: ${dateStr}`, error);
// // // //     return null;
// // // //   }
// // // // };

// // // // export const getWorkingDaysInMonth = (year, month) => {
// // // //   const daysInMonth = new Date(year, month, 0).getDate();
// // // //   let workingDays = 0;
// // // //   for (let day = 1; day <= daysInMonth; day++) {
// // // //     const date = new Date(year, month - 1, day);
// // // //     if (date.getDay() !== 0 && date.getDay() !== 6) {
// // // //       workingDays++;
// // // //     }
// // // //   }
// // // //   return workingDays;
// // // // };

// // // // const formatCalculationBase = (base) => {
// // // //   return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
// // // // };

// // // // export const calculateSalaryDetails = (
// // // //   ctc,
// // // //   planData,
// // // //   employeeId,
// // // //   overtimeRecords = [],
// // // //   bonusRecords = [],
// // // //   advances = [],

// // // // ) => {
// // // //   // Log caller context
// // // //   console.log(
// // // //     `calculateSalaryDetails called for employeeId=${employeeId} at ${new Date().toISOString()}`,
// // // //     new Error().stack.split("\n")[2] // Logs the caller
// // // //   );

// // // //   // Ensure input arrays are valid
// // // //   const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
// // // //   const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
// // // //   const safeAdvances = Array.isArray(advances) ? advances : [];

// // // //   // Log input for debugging
// // // //   console.log(
// // // //     `calculateSalaryDetails inputs: employeeId=${employeeId}, ctc=${ctc}, planData=`,
// // // //     JSON.stringify(planData, null, 2)
// // // //   );

// // // //   console.log(`safeOvertimeRecords:`, JSON.stringify(safeOvertimeRecords, null, 2));
// // // //   console.log(`safeBonusRecords:`, JSON.stringify(safeBonusRecords, null, 2));
// // // //   console.log(`safeAdvances:`, JSON.stringify(safeAdvances, null, 2));

// // // //   // Validate employeeId
// // // //   if (!employeeId) {
// // // //     console.error(`Invalid employeeId (${employeeId})`);
// // // //     return null;
// // // //   }

// // // //   // Handle invalid or missing CTC
// // // //   if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
// // // //     console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
// // // //     ctc = 0;
// // // //   }

// // // //   const now = new Date();
// // // //   const currentYear = now.getFullYear();
// // // //   const currentMonthNum = now.getMonth() + 1;
// // // //   const currentMonth = currentMonthNum.toString().padStart(2, "0");
// // // //   const monthlyCtc = ctc ? Math.round(parseFloat(ctc) / 12) : 0;

// // // //   // Initialize components
// // // //   let basicSalary = 0,
// // // //     hra = 0,
// // // //     ltaAllowance = 0,

// // // //     overtimePay = 0,
// // // //     bonusPay = 0,
// // // //     employeePF = 0,
// // // //     employerPF = 0,
// // // //     esic = 0,
// // // //     gratuity = 0,
// // // //     professionalTax = 0,
// // // //     otherAllowances = 0,
// // // //     advanceRecovery = 0,
// // // //     insurance = 0,
// // // //     grossSalary = 0;

// // // //   // Validate planData
// // // //   if (!planData || typeof planData !== "object") {
// // // //     console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
// // // //     planData = {};
// // // //   }

// // // //   // Basic Salary
// // // //   if (
// // // //     planData.isBasicSalary &&
// // // //     planData.basicSalaryType === "percentage" &&
// // // //     planData.basicSalary &&
// // // //     !isNaN(parseFloat(planData.basicSalary))
// // // //   ) {
// // // //     basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
// // // //   } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
// // // //     basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
// // // //   } else {
// // // //     basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
// // // //     console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`Basic Salary (monthly): ₹${basicSalary}`);

// // // //   // HRA
// // // //   if (
// // // //     planData.isHouseRentAllowance &&
// // // //     planData.houseRentAllowanceType === "percentage" &&
// // // //     planData.houseRentAllowance &&
// // // //     !isNaN(parseFloat(planData.houseRentAllowance))
// // // //   ) {
// // // //     hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
// // // //   } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
// // // //     hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
// // // //   } else {
// // // //     hra = Math.round(basicSalary * 0.5);
// // // //     console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`HRA (monthly): ₹${hra}`);

// // // //   // LTA Allowance
// // // //   if (
// // // //     planData.isLtaAllowance &&
// // // //     planData.ltaAllowanceType === "percentage" &&
// // // //     planData.ltaAllowance &&
// // // //     !isNaN(parseFloat(planData.ltaAllowance))
// // // //   ) {
// // // //     ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
// // // //   } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
// // // //     ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
// // // //   } else {
// // // //     ltaAllowance = 0;
// // // //     console.warn(`No LTA Allowance defined for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

// // // //   // Other Allowances
// // // //   if (
// // // //     planData.isOtherAllowance &&
// // // //     planData.otherAllowanceType === "percentage" &&
// // // //     planData.otherAllowance &&
// // // //     !isNaN(parseFloat(planData.otherAllowance))
// // // //   ) {
// // // //     otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
// // // //   } else if (planData.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
// // // //     otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
// // // //   } else {
// // // //     otherAllowances = 0;
// // // //     console.warn(`Using default otherAllowances (0) for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`Other Allowances (monthly): ₹${otherAllowances}`);








// // // //   // Overtime Pay
// // // //   console.log(`Filtering overtime records for employee ${employeeId}`);
// // // //   const employeeOvertime = safeOvertimeRecords.filter((ot) => {
// // // //     const otDate = parseWorkDate(ot.work_date);
// // // //     const isValid =
// // // //       ot.employee_id === employeeId &&
// // // //       ot.status === "Approved" &&
// // // //       otDate &&
// // // //       otDate.getFullYear() === currentYear &&
// // // //       (otDate.getMonth() + 1).toString().padStart(2, "0") === currentMonth;
// // // //     console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
// // // //     return isValid;
// // // //   });

// // // //   overtimePay = employeeOvertime.reduce((total, ot) => {
// // // //     const hours = parseFloat(ot.extra_hours);
// // // //     let rate = parseFloat(ot.rate);
// // // //     console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

// // // //     if (!rate || isNaN(rate) || rate === 0) {
// // // //       if (
// // // //         planData.isOvertimePay &&
// // // //         planData.overtimePayAmount &&
// // // //         !isNaN(parseFloat(planData.overtimePayAmount))
// // // //       ) {
// // // //         rate = parseFloat(planData.overtimePayAmount);
// // // //         console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
// // // //       } else {
// // // //         rate = 0;
// // // //         console.log(`No valid rate or overtimePayAmount; using rate=0`);
// // // //       }
// // // //     }

// // // //     if (isNaN(hours) || hours <= 0) {
// // // //       console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
// // // //       return total;
// // // //     }

// // // //     const pay = hours * rate;
// // // //     console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
// // // //     return total + pay;
// // // //   }, 0);
// // // //   console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

// // // //   // Bonus Pay
// // // //   console.log(
// // // //     `Filtering bonus records for employee ${employeeId}, currentYear=${currentYear}, currentMonth=${currentMonth}`
// // // //   );
// // // //   const employeeBonuses = safeBonusRecords.filter((bonus) => {
// // // //     const date = parseApplicableMonth(bonus.applicable_month);
// // // //     const isValid =
// // // //       date &&
// // // //       date.getFullYear() === currentYear &&
// // // //       (date.getMonth() + 1).toString().padStart(2, "0") === currentMonth;
// // // //     console.log(
// // // //       `Checking bonus ID ${bonus.id}: employee_id=${
// // // //         bonus.employee_id
// // // //       }, applicable_month=${bonus.applicable_month}, parsedDate=${date ? date.toISOString() : "null"}, isValid=${isValid}`
// // // //     );
// // // //     return isValid;
// // // //   });

// // // //   bonusPay = employeeBonuses.reduce((total, bonus) => {
// // // //     let amount = 0;
// // // //     console.log(`Processing bonus ID ${bonus.id}:`, JSON.stringify(bonus));

// // // //     if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
// // // //       amount = parseFloat(bonus.fixed_amount);
// // // //       console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount}`);
// // // //     } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
// // // //       amount = Math.round((parseFloat(bonus.percentage_ctc) / 100) * ctc / 12);
// // // //       console.log(
// // // //         `Bonus ID ${bonus.id}: Applying percentage_ctc=${bonus.percentage_ctc}% of CTC → ₹${amount}`
// // // //       );
// // // //     } else if (
// // // //       bonus.percentage_monthly_salary &&
// // // //       monthlyCtc &&
// // // //       !isNaN(parseFloat(bonus.percentage_monthly_salary))
// // // //     ) {
// // // //       amount = Math.round((parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc);
// // // //       console.log(
// // // //         `Bonus ID ${bonus.id}: Applying percentage_monthly_salary=${bonus.percentage_monthly_salary}% of monthlyCtc → ₹${amount}`
// // // //       );
// // // //     } else {
// // // //       console.warn(`Bonus ID ${bonus.id}: No valid amount found (bonus data =`, bonus, `)`);
// // // //     }

// // // //     return total + amount;
// // // //   }, 0);

// // // //   console.log(`Subtotal bonusPay before statutory bonuses: ₹${bonusPay}`);

// // // //   if (
// // // //     planData.isStatutoryBonus &&
// // // //     planData.statutoryBonusPercentage &&
// // // //     !isNaN(parseFloat(planData.statutoryBonusPercentage))
// // // //   ) {
// // // //     const statutory = Math.round(monthlyCtc * (parseFloat(planData.statutoryBonusPercentage) / 100));
// // // //     bonusPay += statutory;
// // // //     console.log(
// // // //       `Applying statutory bonus (percentage): ${planData.statutoryBonusPercentage}% of monthlyCtc → ₹${statutory}`
// // // //     );
// // // //   } else if (
// // // //     planData.isStatutoryBonus &&
// // // //     planData.statutoryBonusAmount &&
// // // //     !isNaN(parseFloat(planData.statutoryBonusAmount))
// // // //   ) {
// // // //     const statutory = Math.round(parseFloat(planData.statutoryBonusAmount) / 12);
// // // //     bonusPay += statutory;
// // // //     console.log(
// // // //       `Applying statutory bonus (fixed annual /12): ${planData.statutoryBonusAmount} → ₹${statutory}`
// // // //     );
// // // //   } else {
// // // //     console.log(`No statutory bonus applied for employee ${employeeId}`);
// // // //   }

// // // //   console.log(`✅ Total bonusPay for employee ${employeeId}: ₹${bonusPay}`);

// // // //   // Calculate Gross Salary
// // // //   grossSalary = basicSalary + hra + ltaAllowance  + overtimePay + bonusPay + otherAllowances;
// // // //   console.log(`Gross Salary (monthly): ₹${grossSalary}`);

// // // //   // Employee PF
// // // //   const pfBase = planData.pfCalculationBase === "gross" ? grossSalary : basicSalary;
// // // //   if (
// // // //     planData.isPFApplicable &&
// // // //     planData.isPFEmployee &&
// // // //     planData.pfEmployeeType === "percentage" &&
// // // //     planData.pfEmployeePercentage &&
// // // //     !isNaN(parseFloat(planData.pfEmployeePercentage))
// // // //   ) {
// // // //     employeePF = Math.round(pfBase * (parseFloat(planData.pfEmployeePercentage) / 100));
// // // //     planData.pfEmployeeText = `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
// // // //       planData.pfCalculationBase
// // // //     )}`;
// // // //   } else if (planData.pfEmployeeAmount && !isNaN(parseFloat(planData.pfEmployeeAmount))) {
// // // //     employeePF = Math.round(parseFloat(planData.pfEmployeeAmount) / 12);
// // // //     planData.pfEmployeeText = `₹${planData.pfEmployeeAmount} (Fixed)`;
// // // //   } else {
// // // //     employeePF = 0;
// // // //     planData.pfEmployeeText = `Not Applicable`;
// // // //     console.warn(`No Employee PF defined for employee ${employeeId}`);
// // // //   }
// // // //   console.log(
// // // //     `Employee PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employeePF}`
// // // //   );

// // // //   // Employer PF
// // // //   if (
// // // //     planData.isPFApplicable &&
// // // //     planData.isPFEmployer &&
// // // //     planData.pfEmployerType === "percentage" &&
// // // //     planData.pfEmployerPercentage &&
// // // //     !isNaN(parseFloat(planData.pfEmployerPercentage))
// // // //   ) {
// // // //     employerPF = Math.round(pfBase * (parseFloat(planData.pfEmployerPercentage) / 100));
// // // //     planData.pfEmployerText = `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
// // // //       planData.pfCalculationBase
// // // //     )}`;
// // // //   } else if (planData.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
// // // //     employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
// // // //     planData.pfEmployerText = `₹${planData.pfEmployerAmount} (Fixed)`;
// // // //   } else {
// // // //     employerPF = 0;
// // // //     planData.pfEmployerText = `Not Applicable`;
// // // //     console.warn(`No Employer PF defined for employee ${employeeId}`);
// // // //   }
// // // //   console.log(
// // // //     `Employer PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employerPF}`
// // // //   );

// // // //   // Medical Allowances (ESIC and Insurance)
// // // //   const medicalBase = planData.medicalCalculationBase === "gross" ? grossSalary : basicSalary;

// // // //   // ESIC
// // // //   if (
// // // //     planData.isESICEmployee &&
// // // //     planData.esicEmployeeType === "percentage" &&
// // // //     planData.esicEmployeePercentage &&
// // // //     !isNaN(parseFloat(planData.esicEmployeePercentage))
// // // //   ) {
// // // //     esic = Math.round(medicalBase * (parseFloat(planData.esicEmployeePercentage) / 100));
// // // //     planData.esicEmployeeText = `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
// // // //       planData.medicalCalculationBase
// // // //     )}`;
// // // //   } else if (planData.esicEmployeeAmount && !isNaN(parseFloat(planData.esicEmployeeAmount))) {
// // // //     esic = Math.round(parseFloat(planData.esicEmployeeAmount) / 12);
// // // //     planData.esicEmployeeText = `₹${planData.esicEmployeeAmount} (Fixed)`;
// // // //   } else {
// // // //     esic = 0;
// // // //     planData.esicEmployeeText = `Not Applicable`;
// // // //     console.warn(`No ESIC defined for employee ${employeeId}`);
// // // //   }
// // // //   console.log(
// // // //     `ESIC (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${esic}`
// // // //   );

// // // //   // Insurance
// // // //   if (
// // // //     planData.isInsuranceEmployee &&
// // // //     planData.insuranceEmployeeType === "percentage" &&
// // // //     planData.insuranceEmployeePercentage &&
// // // //     !isNaN(parseFloat(planData.insuranceEmployeePercentage))
// // // //   ) {
// // // //     insurance = Math.round(medicalBase * (parseFloat(planData.insuranceEmployeePercentage) / 100));
// // // //     planData.insuranceEmployeeText = `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(
// // // //       planData.medicalCalculationBase
// // // //     )}`;
// // // //   } else if (planData.insuranceEmployeeAmount && !isNaN(parseFloat(planData.insuranceEmployeeAmount))) {
// // // //     insurance = Math.round(parseFloat(planData.insuranceEmployeeAmount) / 12);
// // // //     planData.insuranceEmployeeText = `₹${planData.insuranceEmployeeAmount} (Fixed)`;
// // // //   } else {
// // // //     insurance = 0;
// // // //     planData.insuranceEmployeeText = `Not Applicable`;
// // // //     console.warn(`No insurance defined for employee ${employeeId}`);
// // // //   }
// // // //   console.log(
// // // //     `Insurance (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${insurance}`
// // // //   );

// // // //   // Gratuity
// // // //   if (
// // // //     planData.isGratuityApplicable &&
// // // //     planData.gratuityType === "percentage" &&
// // // //     planData.gratuityPercentage &&
// // // //     !isNaN(parseFloat(planData.gratuityPercentage))
// // // //   ) {
// // // //     gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
// // // //   } else if (planData.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
// // // //     gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
// // // //   } else {
// // // //     gratuity = Math.round(basicSalary * 0.0481);
// // // //     console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`Gratuity (monthly): ₹${gratuity}`);

// // // //   // Professional Tax
// // // //   if (
// // // //     planData.isProfessionalTax &&
// // // //     planData.professionalTaxType === "percentage" &&
// // // //     planData.professionalTax &&
// // // //     !isNaN(parseFloat(planData.professionalTax))
// // // //   ) {
// // // //     professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
// // // //   } else if (planData.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
// // // //     professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
// // // //   } else {
// // // //     professionalTax = monthlyCtc <= 15000 ? 0 : 200;
// // // //     console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
// // // //   }
// // // //   console.log(`Professional Tax (monthly): ₹${professionalTax}`);

// // // //   // Advance Recovery
// // // //   const employeeAdvances = safeAdvances.filter((adv) => {
// // // //     if (!adv.applicable_months || !adv.recovery_months) return false;
// // // //     const advDate = parseApplicableMonth(adv.applicable_months);
// // // //     if (!advDate) return false;
// // // //     const advYear = advDate.getFullYear();
// // // //     const advMonth = advDate.getMonth() + 1;
// // // //     const recoveryMonths = parseInt(adv.recovery_months);
// // // //     const startMonth = advMonth;
// // // //     const startYear = advYear;
// // // //     let endYear = startYear;
// // // //     let endMonth = startMonth + recoveryMonths - 1;
// // // //     if (endMonth > 12) {
// // // //       endYear += Math.floor((endMonth - 1) / 12);
// // // //       endMonth = ((endMonth - 1) % 12) + 1;
// // // //     }
// // // //     const currentDate = new Date(currentYear, parseInt(currentMonth) - 1);
// // // //     const startDate = new Date(startYear, startMonth - 1);
// // // //     const endDate = new Date(endYear, endMonth - 1);
// // // //     const isValid =
// // // //       adv.employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
// // // //     console.log(
// // // //       `Advance check: employeeId=${adv.employee_id}, applicable_months=${
// // // //         adv.applicable_months
// // // //       }, recovery_months=${adv.recovery_months}, isValid=${isValid}`
// // // //     );
// // // //     return isValid;
// // // //   });

// // // //   advanceRecovery = employeeAdvances.reduce((total, adv) => {
// // // //     const amount = parseFloat(adv.advance_amount);
// // // //     const months = parseInt(adv.recovery_months);
// // // //     const recovery = months > 0 ? amount / months : 0;
// // // //     console.log(
// // // //       `Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`
// // // //     );
// // // //     return total + recovery;
// // // //   }, 0);
// // // //   console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

// // // //   // Taxable Income
// // // //   const taxableIncome = grossSalary - employeePF - esic - insurance;
// // // //   console.log(`Taxable Income (monthly): ₹${taxableIncome}`);

// // // //   // TDS
// // // //   let tds = 0;
// // // //   if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
// // // //     const annualCtc = parseFloat(ctc);
// // // //     const annualTaxable = taxableIncome * 12;
// // // //     const sortedSlabs = [...planData.tdsSlabs].sort((a, b) => parseInt(a.from) - parseInt(b.from));

// // // //     for (const slab of sortedSlabs) {
// // // //       const lower = parseInt(slab.from) || 0;
// // // //       const upper = parseInt(slab.to) || Infinity;
// // // //       const rate = parseFloat(slab.percentage) / 100 || 0;

// // // //       if (annualTaxable >= lower && (upper === Infinity || annualTaxable <= upper) && rate > 0) {
// // // //         tds = Math.round(annualTaxable * rate / 12);
// // // //         console.log(
// // // //           `TDS calculated for taxable income ₹${annualTaxable}: slab [${lower}-${upper}], rate=${
// // // //             rate * 100
// // // //           }%, monthly TDS=₹${tds}`
// // // //         );
// // // //         break;
// // // //       }
// // // //     }
// // // //   } else {
// // // //     console.log(`No valid TDS slabs or TDS not applicable for employee ${employeeId}, setting TDS to 0`);
// // // //     tds = 0;
// // // //   }

// // // //   // Calculate Net Salary
// // // //   const netSalary = grossSalary - employeePF - professionalTax - tds - esic - advanceRecovery - insurance;

// // // //   const salaryDetails = {
// // // //     basicSalary: Math.round(basicSalary),
// // // //     hra: Math.round(hra),
// // // //     ltaAllowance: Math.round(ltaAllowance),
// // // //     overtimePay: Math.round(overtimePay),
// // // //     bonusPay: Math.round(bonusPay),
// // // //     employeePF: Math.round(employeePF),
// // // //     employerPF: Math.round(employerPF),
// // // //     esic: Math.round(esic),
// // // //     gratuity: Math.round(gratuity),
// // // //     professionalTax: Math.round(professionalTax),
// // // //     otherAllowances: Math.round(otherAllowances),
// // // //     tds: Math.round(tds),
// // // //     advanceRecovery: Math.round(advanceRecovery),
// // // //     insurance: Math.round(insurance),
// // // //     grossSalary: Math.round(grossSalary),
// // // //     netSalary: Math.round(netSalary),
// // // //   };

// // // //   console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
// // // //   return salaryDetails;
// // // // };




// // // // export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, incentivesData) => {
// // // //   if (!Array.isArray(employees)) {
// // // //     console.error("Invalid employees array in calculateTotals");
// // // //     return {
// // // //       totalPayable: 0,
// // // //       totalGross: 0,
// // // //       totalTDS: 0,
// // // //       totalAdvance: 0,
// // // //       totalOvertime: 0,
// // // //       totalBonus: 0,
// // // //       totalEmployeePF: 0,
// // // //       totalEmployerPF: 0,
// // // //       totalInsurance: 0,
// // // //       totalIncentives: 0,
// // // //     };
// // // //   }

// // // //   return employees.reduce(
// // // //     (totals, emp) => {
// // // //       const salaryDetails = calculateSalaryDetails(
// // // //         emp.ctc,
// // // //         emp.plan_data,
// // // //         emp.employee_id,
// // // //         overtimeRecords,
// // // //         bonusRecords,
// // // //         advances,
// // // //         incentivesData
// // // //       );
// // // //       if (!salaryDetails) {
// // // //         console.warn(`No salary details for employee ${emp.employee_id}`);
// // // //         return totals;
// // // //       }

// // // //       return {
// // // //         totalPayable: totals.totalPayable + salaryDetails.netSalary,
// // // //         totalGross: totals.totalGross + salaryDetails.grossSalary,
// // // //         totalTDS: totals.totalTDS + salaryDetails.tds,
// // // //         totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
// // // //         totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
// // // //         totalBonus: totals.totalBonus + salaryDetails.bonusPay,
// // // //         totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
// // // //         totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
// // // //         totalInsurance: totals.totalInsurance + salaryDetails.insurance,
// // // //         totalIncentives: totals.totalIncentives + salaryDetails.incentivePay,
// // // //       };
// // // //     },
// // // //     {
// // // //       totalPayable: 0,
// // // //       totalGross: 0,
// // // //       totalTDS: 0,
// // // //       totalAdvance: 0,
// // // //       totalOvertime: 0,
// // // //       totalBonus: 0,
// // // //       totalEmployeePF: 0,
// // // //       totalEmployerPF: 0,
// // // //       totalInsurance: 0,
// // // //       totalIncentives: 0,
// // // //     }
// // // //   );
// // // // };



// // // // export const getMonthlySalary = (employeeId, employees) => {
// // // //   const employee = employees.find((emp) => emp.employee_id === employeeId);
// // // //   if (!employee || !employee.ctc) return 0;
// // // //   return Math.round(parseFloat(employee.ctc) / 12);
// // // // };

// // // export const getCurrentYearMonth = () => {
// // //   const year = new Date().getFullYear();
// // //   const month = String(new Date().getMonth() + 1).padStart(2, "0");
// // //   return `${year}-${month}`; // e.g. "2025-09"
// // // };

// // // export const parseApplicableMonth = (monthStr) => {
// // //   if (!monthStr || typeof monthStr !== "string") {
// // //     console.log(`Invalid applicable_month format: ${monthStr}`);
// // //     return null;
// // //   }

// // //   if (/^\d{4}-\d{2}$/.test(monthStr)) {
// // //     const [year, month] = monthStr.split("-").map(Number);
// // //     if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
// // //       console.log(`Invalid year or month in ${monthStr}`);
// // //       return null;
// // //     }
// // //     return new Date(year, month - 1);
// // //   }

// // //   const monthNames = [
// // //     "January", "February", "March", "April", "May", "June",
// // //     "July", "August", "September", "October", "November", "December",
// // //   ];
// // //   const monthIndex = monthNames.findIndex(
// // //     (name) => name.toLowerCase() === monthStr.toLowerCase()
// // //   );
// // //   if (monthIndex !== -1) {
// // //     return new Date(new Date().getFullYear(), monthIndex);
// // //   }

// // //   console.log(`Invalid applicable_month format: ${monthStr}`);
// // //   return null;
// // // };

// // // export const parseWorkDate = (dateStr) => {
// // //   try {
// // //     const date = new Date(dateStr);
// // //     return isNaN(date.getTime()) ? null : date;
// // //   } catch (error) {
// // //     console.error(`Error parsing work date: ${dateStr}`, error);
// // //     return null;
// // //   }
// // // };

// // // export const getWorkingDaysInMonth = (year, month) => {
// // //   const daysInMonth = new Date(year, month, 0).getDate();
// // //   let workingDays = 0;
// // //   for (let day = 1; day <= daysInMonth; day++) {
// // //     const date = new Date(year, month - 1, day);
// // //     if (date.getDay() !== 0 && date.getDay() !== 6) {
// // //       workingDays++;
// // //     }
// // //   }
// // //   return workingDays;
// // // };

// // // const formatCalculationBase = (base) => {
// // //   return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
// // // };

// // // export const calculateSalaryDetails = (
// // //   ctc,
// // //   planData,
// // //   employeeId,
// // //   overtimeRecords = [],
// // //   bonusRecords = [],
// // //   advances = [],
// // //   employeeIncentiveData = {} // Added for incentives
// // // ) => {
// // //   console.log(
// // //     `calculateSalaryDetails called for employeeId=${employeeId} at ${new Date().toISOString()}`
// // //   );

// // //   const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
// // //   const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
// // //   const safeAdvances = Array.isArray(advances) ? advances : [];

// // //   if (!employeeId) {
// // //     console.error(`Invalid employeeId (${employeeId})`);
// // //     return null;
// // //   }

// // //   if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
// // //     console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
// // //     ctc = 0;
// // //   }

// // //   const now = new Date();
// // //   const currentYear = now.getFullYear();
// // //   const currentMonth = now.getMonth() + 1;
// // //   const currentMonthStr = currentMonth.toString().padStart(2, "0");
// // //   const monthlyCtc = ctc ? parseFloat(ctc) / 12 : 0;

// // //   let basicSalary = 0,
// // //     hra = 0,
// // //     ltaAllowance = 0,
// // //     overtimePay = 0,
// // //     recordBonusPay = 0,
// // //     recordBonusPayYearly = 0, // New
// // //     statutoryBonus = 0,
// // //     statutoryBonusYearly = 0, // New
// // //     employeePF = 0,
// // //     employerPF = 0,
// // //     esic = 0,
// // //     gratuity = 0,
// // //     professionalTax = 0,
// // //     otherAllowances = 0,
// // //     advanceRecovery = 0,
// // //     insurance = 0,
// // //     grossSalary = 0,
// // //     incentivePay = 0; // Added for incentives

// // //   if (!planData || typeof planData !== "object") {
// // //     console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
// // //     planData = {};
// // //   }

// // //   // Basic Salary
// // //   if (
// // //     planData.isBasicSalary &&
// // //     planData.basicSalaryType === "percentage" &&
// // //     planData.basicSalary &&
// // //     !isNaN(parseFloat(planData.basicSalary))
// // //   ) {
// // //     basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
// // //   } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
// // //     basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
// // //   } else {
// // //     basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
// // //     console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
// // //   }
// // //   console.log(`Basic Salary (monthly): ₹${basicSalary}`);

// // //   // HRA
// // //   if (
// // //     planData.isHouseRentAllowance &&
// // //     planData.houseRentAllowanceType === "percentage" &&
// // //     planData.houseRentAllowance &&
// // //     !isNaN(parseFloat(planData.houseRentAllowance))
// // //   ) {
// // //     hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
// // //   } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
// // //     hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
// // //   } else {
// // //     hra = Math.round(basicSalary * 0.5);
// // //     console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
// // //   }
// // //   console.log(`HRA (monthly): ₹${hra}`);

// // //   // LTA Allowance
// // //   if (
// // //     planData.isLtaAllowance &&
// // //     planData.ltaAllowanceType === "percentage" &&
// // //     planData.ltaAllowance &&
// // //     !isNaN(parseFloat(planData.ltaAllowance))
// // //   ) {
// // //     ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
// // //   } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
// // //     ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
// // //   } else {
// // //     ltaAllowance = 0;
// // //     console.warn(`No LTA Allowance defined for employee ${employeeId}`);
// // //   }
// // //   console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

// // //   // Other Allowances
// // //   if (
// // //     planData.isOtherAllowance &&
// // //     planData.otherAllowanceType === "percentage" &&
// // //     planData.otherAllowance &&
// // //     !isNaN(parseFloat(planData.otherAllowance))
// // //   ) {
// // //     otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
// // //   } else if (planData.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
// // //     otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
// // //   } else {
// // //     otherAllowances = 0;
// // //     console.warn(`Using default otherAllowances (0) for employee ${employeeId}`);
// // //   }
// // //   console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

// // //   // Overtime Pay
// // //   console.log(`Filtering overtime records for employee ${employeeId}`);
// // //   const employeeOvertime = safeOvertimeRecords.filter((ot) => {
// // //     const otDate = parseWorkDate(ot.work_date);
// // //     const isValid =
// // //       ot.employee_id === employeeId &&
// // //       ot.status === "Approved" &&
// // //       otDate &&
// // //       otDate.getFullYear() === currentYear &&
// // //       (otDate.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
// // //     console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
// // //     return isValid;
// // //   });

// // //   overtimePay = employeeOvertime.reduce((total, ot) => {
// // //     const hours = parseFloat(ot.extra_hours);
// // //     let rate = parseFloat(ot.rate);
// // //     console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

// // //     if (!rate || isNaN(rate) || rate === 0) {
// // //       if (
// // //         planData.isOvertimePay &&
// // //         planData.overtimePayAmount &&
// // //         !isNaN(parseFloat(planData.overtimePayAmount))
// // //       ) {
// // //         rate = parseFloat(planData.overtimePayAmount);
// // //         console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
// // //       } else {
// // //         rate = 0;
// // //         console.log(`No valid rate or overtimePayAmount; using rate=0`);
// // //       }
// // //     }

// // //     if (isNaN(hours) || hours <= 0) {
// // //       console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
// // //       return total;
// // //     }

// // //     const pay = hours * rate;
// // //     console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
// // //     return total + pay;
// // //   }, 0);
// // //   console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

// // //   // Bonus Pay from Records
// // //   console.log(
// // //     `Filtering bonus records for employee ${employeeId}, currentYear=${currentYear}, currentMonth=${currentMonthStr}`
// // //   );
// // //   const employeeBonuses = safeBonusRecords.filter((bonus) => {
// // //     const date = parseApplicableMonth(bonus.applicable_month);
// // //     const isValid =
// // //       date &&
// // //       date.getFullYear() === currentYear &&
// // //       (date.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
// // //     console.log(
// // //       `Checking bonus ID ${bonus.id}: employee_id=${
// // //         bonus.employee_id
// // //       }, applicable_month=${bonus.applicable_month}, parsedDate=${date ? date.toISOString() : "null"}, isValid=${isValid}`
// // //     );
// // //     return isValid;
// // //   });

// // //   recordBonusPayYearly = employeeBonuses.reduce((total, bonus) => {
// // //     let amount = 0;
// // //     console.log(`Processing bonus ID ${bonus.id}:`, JSON.stringify(bonus));

// // //     if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
// // //       amount = parseFloat(bonus.fixed_amount) * 12; // Yearly amount
// // //       console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount} (yearly)`);
// // //     } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
// // //       amount = (parseFloat(bonus.percentage_ctc) / 100) * ctc; // Yearly amount
// // //       console.log(
// // //         `Bonus ID ${bonus.id}: Applying percentage_ctc=${bonus.percentage_ctc}% of CTC → ₹${amount} (yearly)`
// // //       );
// // //     } else if (
// // //       bonus.percentage_monthly_salary &&
// // //       monthlyCtc &&
// // //       !isNaN(parseFloat(bonus.percentage_monthly_salary))
// // //     ) {
// // //       amount = (parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc * 12; // Yearly amount
// // //       console.log(
// // //         `Bonus ID ${bonus.id}: Applying percentage_monthly_salary=${bonus.percentage_monthly_salary}% of monthlyCtc → ₹${amount} (yearly)`
// // //       );
// // //     } else {
// // //       console.warn(`Bonus ID ${bonus.id}: No valid amount found (bonus data =`, bonus, `)`);
// // //     }

// // //     return total + amount;
// // //   }, 0);

// // //   recordBonusPay = Math.round(recordBonusPayYearly / 12); // Monthly, rounded for consistency
// // //   console.log(`recordBonusPayYearly for employee ${employeeId}: ₹${recordBonusPayYearly}`);
// // //   console.log(`recordBonusPay (monthly) for employee ${employeeId}: ₹${recordBonusPay}`);

// // //   // Statutory Bonus
// // //   statutoryBonusYearly = 0;
// // //   if (
// // //     planData.isStatutoryBonus &&
// // //     planData.statutoryBonusPercentage &&
// // //     !isNaN(parseFloat(planData.statutoryBonusPercentage))
// // //   ) {
// // //     statutoryBonusYearly = (parseFloat(planData.statutoryBonusPercentage) / 100) * ctc;
// // //     console.log(
// // //       `Applying statutory bonus (percentage): ${planData.statutoryBonusPercentage}% of CTC → ₹${statutoryBonusYearly} (yearly)`
// // //     );
// // //   } else if (
// // //     planData.isStatutoryBonus &&
// // //     planData.statutoryBonusAmount &&
// // //     !isNaN(parseFloat(planData.statutoryBonusAmount))
// // //   ) {
// // //     statutoryBonusYearly = parseFloat(planData.statutoryBonusAmount);
// // //     console.log(
// // //       `Applying statutory bonus (fixed annual): ${planData.statutoryBonusAmount} → ₹${statutoryBonusYearly} (yearly)`
// // //     );
// // //   } else {
// // //     console.log(`No statutory bonus applied for employee ${employeeId}`);
// // //   }

// // //   statutoryBonus = Math.round(statutoryBonusYearly / 12); // Monthly, rounded for consistency
// // //   console.log(`statutoryBonusYearly for employee ${employeeId}: ₹${statutoryBonusYearly}`);
// // //   console.log(`statutoryBonus (monthly) for employee ${employeeId}: ₹${statutoryBonus}`);

// // //   // Total Bonus Pay (for backward compatibility)
// // //   const bonusPay = recordBonusPay + statutoryBonus;
// // //   console.log(`✅ Total bonusPay (monthly) for employee ${employeeId}: ₹${bonusPay}`);

// // //   // Incentive Pay
// // //   const empId = String(employeeId).toUpperCase();
// // //   const matchedKey = Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId);
// // //   incentivePay = matchedKey && employeeIncentiveData[matchedKey]?.totalIncentive
// // //     ? parseFloat(employeeIncentiveData[matchedKey].totalIncentive.value) || 0
// // //     : 0;
// // //   console.log(`Incentive Pay (monthly) for employee ${employeeId}: ₹${incentivePay}`);

// // //   // Calculate Gross Salary
// // //   grossSalary = basicSalary + hra + ltaAllowance + overtimePay + bonusPay + otherAllowances + incentivePay;
// // //   console.log(`Gross Salary (monthly): ₹${grossSalary}`);

// // //   // Employee PF
// // //   const pfBase = planData.pfCalculationBase === "gross" ? grossSalary : basicSalary;
// // //   if (
// // //     planData.isPFApplicable &&
// // //     planData.isPFEmployee &&
// // //     planData.pfEmployeeType === "percentage" &&
// // //     planData.pfEmployeePercentage &&
// // //     !isNaN(parseFloat(planData.pfEmployeePercentage))
// // //   ) {
// // //     employeePF = Math.round(pfBase * (parseFloat(planData.pfEmployeePercentage) / 100));
// // //     planData.pfEmployeeText = `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
// // //       planData.pfCalculationBase
// // //     )}`;
// // //   } else if (planData.pfEmployeeAmount && !isNaN(parseFloat(planData.pfEmployeeAmount))) {
// // //     employeePF = Math.round(parseFloat(planData.pfEmployeeAmount) / 12);
// // //     planData.pfEmployeeText = `₹${planData.pfEmployeeAmount} (Fixed)`;
// // //   } else {
// // //     employeePF = 0;
// // //     planData.pfEmployeeText = `Not Applicable`;
// // //     console.warn(`No Employee PF defined for employee ${employeeId}`);
// // //   }
// // //   console.log(
// // //     `Employee PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employeePF}`
// // //   );

// // //   // Employer PF
// // //   if (
// // //     planData.isPFApplicable &&
// // //     planData.isPFEmployer &&
// // //     planData.pfEmployerType === "percentage" &&
// // //     planData.pfEmployerPercentage &&
// // //     !isNaN(parseFloat(planData.pfEmployerPercentage))
// // //   ) {
// // //     employerPF = Math.round(pfBase * (parseFloat(planData.pfEmployerPercentage) / 100));
// // //     planData.pfEmployerText = `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
// // //       planData.pfCalculationBase
// // //     )}`;
// // //   } else if (planData.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
// // //     employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
// // //     planData.pfEmployerText = `₹${planData.pfEmployerAmount} (Fixed)`;
// // //   } else {
// // //     employerPF = 0;
// // //     planData.pfEmployerText = `Not Applicable`;
// // //     console.warn(`No Employer PF defined for employee ${employeeId}`);
// // //   }
// // //   console.log(
// // //     `Employer PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employerPF}`
// // //   );

// // //   // Medical Allowances (ESIC and Insurance)
// // //   const medicalBase = planData.medicalCalculationBase === "gross" ? grossSalary : basicSalary;

// // //   // ESIC
// // //   if (
// // //     planData.isMedicalApplicable &&
// // //     planData.isESICEmployee &&
// // //     planData.esicEmployeeType === "percentage" &&
// // //     planData.esicEmployeePercentage &&
// // //     !isNaN(parseFloat(planData.esicEmployeePercentage))
// // //   ) {
// // //     esic = Math.round(medicalBase * (parseFloat(planData.esicEmployeePercentage) / 100));
// // //     planData.esicEmployeeText = `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
// // //       planData.medicalCalculationBase
// // //     )}`;
// // //   } else if (planData.esicEmployeeAmount && !isNaN(parseFloat(planData.esicEmployeeAmount))) {
// // //     esic = Math.round(parseFloat(planData.esicEmployeeAmount) / 12);
// // //     planData.esicEmployeeText = `₹${planData.esicEmployeeAmount} (Fixed)`;
// // //   } else {
// // //     esic = 0;
// // //     planData.esicEmployeeText = `Not Applicable`;
// // //     console.warn(`No ESIC defined for employee ${employeeId}`);
// // //   }
// // //   console.log(
// // //     `ESIC (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${esic}`
// // //   );

// // //   // Insurance
// // //   if (
// // //     planData.isMedicalApplicable &&
// // //     planData.isInsuranceEmployee &&
// // //     planData.insuranceEmployeeType === "percentage" &&
// // //     planData.insuranceEmployeePercentage &&
// // //     !isNaN(parseFloat(planData.insuranceEmployeePercentage))
// // //   ) {
// // //     insurance = Math.round(medicalBase * (parseFloat(planData.insuranceEmployeePercentage) / 100));
// // //     planData.insuranceEmployeeText = `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(
// // //       planData.medicalCalculationBase
// // //     )}`;
// // //   } else if (planData.insuranceEmployeeAmount && !isNaN(parseFloat(planData.insuranceEmployeeAmount))) {
// // //     insurance = Math.round(parseFloat(planData.insuranceEmployeeAmount) / 12);
// // //     planData.insuranceEmployeeText = `₹${planData.insuranceEmployeeAmount} (Fixed)`;
// // //   } else {
// // //     insurance = 0;
// // //     planData.insuranceEmployeeText = `Not Applicable`;
// // //     console.warn(`No insurance defined for employee ${employeeId}`);
// // //   }
// // //   console.log(
// // //     `Insurance (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${insurance}`
// // //   );

// // //   // Gratuity
// // //   if (
// // //     planData.isGratuityApplicable &&
// // //     planData.gratuityType === "percentage" &&
// // //     planData.gratuityPercentage &&
// // //     !isNaN(parseFloat(planData.gratuityPercentage))
// // //   ) {
// // //     gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
// // //   } else if (planData.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
// // //     gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
// // //   } else {
// // //     gratuity = Math.round(basicSalary * 0.0481);
// // //     console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
// // //   }
// // //   console.log(`Gratuity (monthly): ₹${gratuity}`);

// // //   // Professional Tax
// // //   if (
// // //     planData.isProfessionalTax &&
// // //     planData.professionalTaxType === "percentage" &&
// // //     planData.professionalTax &&
// // //     !isNaN(parseFloat(planData.professionalTax))
// // //   ) {
// // //     professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
// // //   } else if (planData.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
// // //     professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
// // //   } else {
// // //     professionalTax = monthlyCtc <= 15000 ? 0 : 200;
// // //     console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
// // //   }
// // //   console.log(`Professional Tax (monthly): ₹${professionalTax}`);

// // //   // Advance Recovery
// // //   const employeeAdvances = safeAdvances.filter((adv) => {
// // //     if (!adv.applicable_months || !adv.recovery_months) return false;
// // //     const advDate = parseApplicableMonth(adv.applicable_months);
// // //     if (!advDate) return false;
// // //     const advYear = advDate.getFullYear();
// // //     const advMonth = advDate.getMonth() + 1;
// // //     const recoveryMonths = parseInt(adv.recovery_months);
// // //     const startMonth = advMonth;
// // //     const startYear = advYear;
// // //     let endYear = startYear;
// // //     let endMonth = startMonth + recoveryMonths - 1;
// // //     if (endMonth > 12) {
// // //       endYear += Math.floor((endMonth - 1) / 12);
// // //       endMonth = ((endMonth - 1) % 12) + 1;
// // //     }
// // //     const currentDate = new Date(currentYear, parseInt(currentMonthStr) - 1);
// // //     const startDate = new Date(startYear, startMonth - 1);
// // //     const endDate = new Date(endYear, endMonth - 1);
// // //     const isValid =
// // //       adv.employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
// // //     console.log(
// // //       `Advance check: employeeId=${adv.employee_id}, applicable_months=${
// // //         adv.applicable_months
// // //       }, recovery_months=${adv.recovery_months}, isValid=${isValid}`
// // //     );
// // //     return isValid;
// // //   });

// // //   advanceRecovery = employeeAdvances.reduce((total, adv) => {
// // //     const amount = parseFloat(adv.advance_amount);
// // //     const months = parseInt(adv.recovery_months);
// // //     const recovery = months > 0 ? amount / months : 0;
// // //     console.log(
// // //       `Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`
// // //     );
// // //     return total + recovery;
// // //   }, 0);
// // //   console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

// // //   // Taxable Income
// // //   const taxableIncome = grossSalary - employeePF - esic - insurance;
// // //   console.log(`Taxable Income (monthly): ₹${taxableIncome}`);

// // //   // TDS
// // //   let tds = 0;
// // //   if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
// // //     const annualTaxable = taxableIncome * 12;
// // //     const sortedSlabs = [...planData.tdsSlabs].sort((a, b) => parseInt(a.from) - parseInt(b.from));

// // //     for (const slab of sortedSlabs) {
// // //       const lower = parseInt(slab.from) || 0;
// // //       const upper = parseInt(slab.to) || Infinity;
// // //       const rate = parseFloat(slab.percentage) / 100 || 0;

// // //       if (annualTaxable >= lower && (upper === Infinity || annualTaxable <= upper) && rate > 0) {
// // //         tds = Math.round(annualTaxable * rate / 12);
// // //         console.log(
// // //           `TDS calculated for taxable income ₹${annualTaxable}: slab [${lower}-${upper}], rate=${
// // //             rate * 100
// // //           }%, monthly TDS=₹${tds}`
// // //         );
// // //         break;
// // //       }
// // //     }
// // //   } else {
// // //     console.log(`No valid TDS slabs or TDS not applicable for employee ${employeeId}, setting TDS to 0`);
// // //     tds = 0;
// // //   }

// // //   // Calculate Net Salary
// // //   const netSalary = grossSalary - employeePF - professionalTax - tds - esic - advanceRecovery - insurance;

// // //   const salaryDetails = {
// // //     basicSalary: Math.round(basicSalary),
// // //     hra: Math.round(hra),
// // //     ltaAllowance: Math.round(ltaAllowance),
// // //     overtimePay: Math.round(overtimePay),
// // //     recordBonusPay: Math.round(recordBonusPay),
// // //     recordBonusPayYearly: Math.round(recordBonusPayYearly), // New
// // //     statutoryBonus: Math.round(statutoryBonus),
// // //     statutoryBonusYearly: Math.round(statutoryBonusYearly), // New
// // //     bonusPay: Math.round(bonusPay),
// // //     employeePF: Math.round(employeePF),
// // //     employerPF: Math.round(employerPF),
// // //     esic: Math.round(esic),
// // //     gratuity: Math.round(gratuity),
// // //     professionalTax: Math.round(professionalTax),
// // //     otherAllowances: Math.round(otherAllowances),
// // //     tds: Math.round(tds),
// // //     advanceRecovery: Math.round(advanceRecovery),
// // //     insurance: Math.round(insurance),
// // //     grossSalary: Math.round(grossSalary),
// // //     netSalary: Math.round(netSalary),
// // //     incentivePay: Math.round(incentivePay),
// // //   };

// // //   console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
// // //   return salaryDetails;
// // // };

// // // export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, incentivesData) => {
// // //   if (!Array.isArray(employees)) {
// // //     console.error("Invalid employees array in calculateTotals");
// // //     return {
// // //       totalPayable: 0,
// // //       totalGross: 0,
// // //       totalTDS: 0,
// // //       totalAdvance: 0,
// // //       totalOvertime: 0,
// // //       totalBonus: 0,
// // //       totalEmployeePF: 0,
// // //       totalEmployerPF: 0,
// // //       totalInsurance: 0,
// // //       totalIncentives: 0,
// // //     };
// // //   }

// // //   return employees.reduce(
// // //     (totals, emp) => {
// // //       const salaryDetails = calculateSalaryDetails(
// // //         emp.ctc,
// // //         emp.plan_data,
// // //         emp.employee_id,
// // //         overtimeRecords,
// // //         bonusRecords,
// // //         advances,
// // //         incentivesData
// // //       );
// // //       if (!salaryDetails) {
// // //         console.warn(`No salary details for employee ${emp.employee_id}`);
// // //         return totals;
// // //       }

// // //       return {
// // //         totalPayable: totals.totalPayable + salaryDetails.netSalary,
// // //         totalGross: totals.totalGross + salaryDetails.grossSalary,
// // //         totalTDS: totals.totalTDS + salaryDetails.tds,
// // //         totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
// // //         totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
// // //         totalBonus: totals.totalBonus + salaryDetails.bonusPay, // Uses total bonusPay
// // //         totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
// // //         totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
// // //         totalInsurance: totals.totalInsurance + salaryDetails.insurance,
// // //         totalIncentives: totals.totalIncentives + salaryDetails.incentivePay,
// // //       };
// // //     },
// // //     {
// // //       totalPayable: 0,
// // //       totalGross: 0,
// // //       totalTDS: 0,
// // //       totalAdvance: 0,
// // //       totalOvertime: 0,
// // //       totalBonus: 0,
// // //       totalEmployeePF: 0,
// // //       totalEmployerPF: 0,
// // //       totalInsurance: 0,
// // //       totalIncentives: 0,
// // //     }
// // //   );
// // // };

// // // export const getMonthlySalary = (employeeId, employees) => {
// // //   const employee = employees.find((emp) => emp.employee_id === employeeId);
// // //   if (!employee || !employee.ctc) return 0;
// // //   return Math.round(parseFloat(employee.ctc) / 12);
// // // };

// // export const getCurrentYearMonth = () => {
// //   const year = new Date().getFullYear();
// //   const month = String(new Date().getMonth() + 1).padStart(2, "0");
// //   return `${year}-${month}`; // e.g. "2025-09"
// // };

// // export const parseApplicableMonth = (monthStr) => {
// //   if (!monthStr || typeof monthStr !== "string") {
// //     console.log(`Invalid applicable_month format: ${monthStr}`);
// //     return null;
// //   }

// //   if (/^\d{4}-\d{2}$/.test(monthStr)) {
// //     const [year, month] = monthStr.split("-").map(Number);
// //     if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
// //       console.log(`Invalid year or month in ${monthStr}`);
// //       return null;
// //     }
// //     return new Date(year, month - 1);
// //   }

// //   const monthNames = [
// //     "January", "February", "March", "April", "May", "June",
// //     "July", "August", "September", "October", "November", "December",
// //   ];
// //   const monthIndex = monthNames.findIndex(
// //     (name) => name.toLowerCase() === monthStr.toLowerCase()
// //   );
// //   if (monthIndex !== -1) {
// //     return new Date(new Date().getFullYear(), monthIndex);
// //   }

// //   console.log(`Invalid applicable_month format: ${monthStr}`);
// //   return null;
// // };

// // export const parseWorkDate = (dateStr) => {
// //   try {
// //     const date = new Date(dateStr);
// //     return isNaN(date.getTime()) ? null : date;
// //   } catch (error) {
// //     console.error(`Error parsing work date: ${dateStr}`, error);
// //     return null;
// //   }
// // };

// // export const getWorkingDaysInMonth = (year, month) => {
// //   const daysInMonth = new Date(year, month, 0).getDate();
// //   let workingDays = 0;
// //   for (let day = 1; day <= daysInMonth; day++) {
// //     const date = new Date(year, month - 1, day);
// //     if (date.getDay() !== 0 && date.getDay() !== 6) {
// //       workingDays++;
// //     }
// //   }
// //   return workingDays;
// // };

// // const formatCalculationBase = (base) => {
// //   return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
// // };

// // export const calculateSalaryDetails = (
// //   ctc,
// //   planData,
// //   employeeId,
// //   overtimeRecords = [],
// //   bonusRecords = [],
// //   advances = [],
// //   employeeIncentiveData = {} // Added for incentives
// // ) => {
// //   console.log(
// //     `calculateSalaryDetails called for employeeId=${employeeId} at ${new Date().toISOString()}`
// //   );

// //   const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
// //   const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
// //   const safeAdvances = Array.isArray(advances) ? advances : [];

// //   if (!employeeId) {
// //     console.error(`Invalid employeeId (${employeeId})`);
// //     return null;
// //   }

// //   if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
// //     console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
// //     ctc = 0;
// //   }

// //   const now = new Date();
// //   const currentYear = now.getFullYear();
// //   const currentMonth = now.getMonth() + 1;
// //   const currentMonthStr = currentMonth.toString().padStart(2, "0");
// //   const monthlyCtc = ctc ? parseFloat(ctc) / 12 : 0;

// //   let basicSalary = 0,
// //     hra = 0,
// //     ltaAllowance = 0,
// //     overtimePay = 0,
// //     recordBonusPay = 0,
// //     recordBonusPayYearly = 0, // New
// //     statutoryBonus = 0,
// //     statutoryBonusYearly = 0, // New
// //     employeePF = 0,
// //     employerPF = 0,
// //     esic = 0,
// //     gratuity = 0,
// //     professionalTax = 0,
// //     otherAllowances = 0,
// //     advanceRecovery = 0,
// //     insurance = 0,
// //     grossSalary = 0,
// //     incentivePay = 0; // Added for incentives

// //   if (!planData || typeof planData !== "object") {
// //     console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
// //     planData = {};
// //   }

// //   // Basic Salary
// //   if (
// //     planData.isBasicSalary &&
// //     planData.basicSalaryType === "percentage" &&
// //     planData.basicSalary &&
// //     !isNaN(parseFloat(planData.basicSalary))
// //   ) {
// //     basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
// //   } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
// //     basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
// //   } else {
// //     basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
// //     console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
// //   }
// //   console.log(`Basic Salary (monthly): ₹${basicSalary}`);

// //   // HRA
// //   if (
// //     planData.isHouseRentAllowance &&
// //     planData.houseRentAllowanceType === "percentage" &&
// //     planData.houseRentAllowance &&
// //     !isNaN(parseFloat(planData.houseRentAllowance))
// //   ) {
// //     hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
// //   } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
// //     hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
// //   } else {
// //     hra = Math.round(basicSalary * 0.5);
// //     console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
// //   }
// //   console.log(`HRA (monthly): ₹${hra}`);

// //   // LTA Allowance
// //   if (
// //     planData.isLtaAllowance &&
// //     planData.ltaAllowanceType === "percentage" &&
// //     planData.ltaAllowance &&
// //     !isNaN(parseFloat(planData.ltaAllowance))
// //   ) {
// //     ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
// //   } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
// //     ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
// //   } else {
// //     ltaAllowance = 0;
// //     console.warn(`No LTA Allowance defined for employee ${employeeId}`);
// //   }
// //   console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

// //   // Other Allowances
// //   if (
// //     planData.isOtherAllowance &&
// //     planData.otherAllowanceType === "percentage" &&
// //     planData.otherAllowance &&
// //     !isNaN(parseFloat(planData.otherAllowance))
// //   ) {
// //     otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
// //   } else if (planData.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
// //     otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
// //   } else {
// //     otherAllowances = 0;
// //     console.warn(`Using default otherAllowances (0) for employee ${employeeId}`);
// //   }
// //   console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

// //   // Overtime Pay
// //   console.log(`Filtering overtime records for employee ${employeeId}`);
// //   const employeeOvertime = safeOvertimeRecords.filter((ot) => {
// //     const otDate = parseWorkDate(ot.work_date);
// //     const isValid =
// //       ot.employee_id === employeeId &&
// //       ot.status === "Approved" &&
// //       otDate &&
// //       otDate.getFullYear() === currentYear &&
// //       (otDate.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
// //     console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
// //     return isValid;
// //   });

// //   overtimePay = employeeOvertime.reduce((total, ot) => {
// //     const hours = parseFloat(ot.extra_hours);
// //     let rate = parseFloat(ot.rate);
// //     console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

// //     if (!rate || isNaN(rate) || rate === 0) {
// //       if (
// //         planData.isOvertimePay &&
// //         planData.overtimePayAmount &&
// //         !isNaN(parseFloat(planData.overtimePayAmount))
// //       ) {
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

// //   // Bonus Pay from Records
// //   console.log(
// //     `Filtering bonus records for employee ${employeeId}, currentYear=${currentYear}, currentMonth=${currentMonthStr}`
// //   );
// //   const employeeBonuses = safeBonusRecords.filter((bonus) => {
// //     const date = parseApplicableMonth(bonus.applicable_month);
// //     const isValid =
// //       date &&
// //       date.getFullYear() === currentYear &&
// //       (date.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
// //     console.log(
// //       `Checking bonus ID ${bonus.id}: employee_id=${
// //         bonus.employee_id
// //       }, applicable_month=${bonus.applicable_month}, parsedDate=${date ? date.toISOString() : "null"}, isValid=${isValid}`
// //     );
// //     return isValid;
// //   });

// //   recordBonusPayYearly = employeeBonuses.reduce((total, bonus) => {
// //     let amount = 0;
// //     console.log(`Processing bonus ID ${bonus.id}:`, JSON.stringify(bonus));

// //     if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
// //       amount = parseFloat(bonus.fixed_amount) * 12; // Yearly amount
// //       console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount} (yearly)`);
// //     } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
// //       amount = (parseFloat(bonus.percentage_ctc) / 100) * ctc; // Yearly amount
// //       console.log(
// //         `Bonus ID ${bonus.id}: Applying percentage_ctc=${bonus.percentage_ctc}% of CTC → ₹${amount} (yearly)`
// //       );
// //     } else if (
// //       bonus.percentage_monthly_salary &&
// //       monthlyCtc &&
// //       !isNaN(parseFloat(bonus.percentage_monthly_salary))
// //     ) {
// //       amount = (parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc * 12; // Yearly amount
// //       console.log(
// //         `Bonus ID ${bonus.id}: Applying percentage_monthly_salary=${bonus.percentage_monthly_salary}% of monthlyCtc → ₹${amount} (yearly)`
// //       );
// //     } else {
// //       console.warn(`Bonus ID ${bonus.id}: No valid amount found (bonus data =`, bonus, `)`);
// //     }

// //     return total + amount;
// //   }, 0);

// //   recordBonusPay = Math.round(recordBonusPayYearly / 12); // Monthly, rounded for consistency
// //   console.log(`recordBonusPayYearly for employee ${employeeId}: ₹${recordBonusPayYearly}`);
// //   console.log(`recordBonusPay (monthly) for employee ${employeeId}: ₹${recordBonusPay}`);

// //   // Statutory Bonus
// //   statutoryBonusYearly = 0;
// //   if (
// //     planData.isStatutoryBonus &&
// //     planData.statutoryBonusPercentage &&
// //     !isNaN(parseFloat(planData.statutoryBonusPercentage))
// //   ) {
// //     statutoryBonusYearly = (parseFloat(planData.statutoryBonusPercentage) / 100) * ctc;
// //     console.log(
// //       `Applying statutory bonus (percentage): ${planData.statutoryBonusPercentage}% of CTC → ₹${statutoryBonusYearly} (yearly)`
// //     );
// //   } else if (
// //     planData.isStatutoryBonus &&
// //     planData.statutoryBonusAmount &&
// //     !isNaN(parseFloat(planData.statutoryBonusAmount))
// //   ) {
// //     statutoryBonusYearly = parseFloat(planData.statutoryBonusAmount);
// //     console.log(
// //       `Applying statutory bonus (fixed annual): ${planData.statutoryBonusAmount} → ₹${statutoryBonusYearly} (yearly)`
// //     );
// //   } else {
// //     console.log(`No statutory bonus applied for employee ${employeeId}`);
// //   }

// //   statutoryBonus = Math.round(statutoryBonusYearly / 12); // Monthly, rounded for consistency
// //   console.log(`statutoryBonusYearly for employee ${employeeId}: ₹${statutoryBonusYearly}`);
// //   console.log(`statutoryBonus (monthly) for employee ${employeeId}: ₹${statutoryBonus}`);

// //   // Total Bonus Pay (for backward compatibility)
// //   const bonusPay = recordBonusPay + statutoryBonus;
// //   console.log(`✅ Total bonusPay (monthly) for employee ${employeeId}: ₹${bonusPay}`);

// //   // Incentive Pay
// //   const empId = String(employeeId).toUpperCase();
// //   const matchedKey = Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId);
// //   incentivePay = matchedKey && employeeIncentiveData[matchedKey]?.totalIncentive
// //     ? parseFloat(employeeIncentiveData[matchedKey].totalIncentive.value) || 0
// //     : 0;
// //   console.log(`Incentive Pay (monthly) for employee ${employeeId}: ₹${incentivePay}`);

// //   // Calculate Gross Salary
// //   grossSalary = basicSalary + hra + ltaAllowance + overtimePay + bonusPay + otherAllowances + incentivePay;
// //   console.log(`Gross Salary (monthly): ₹${grossSalary}`);

// //   // Employee PF
// //   const pfBase = planData.pfCalculationBase === "gross" ? grossSalary : basicSalary;
// //   if (
// //     planData.isPFApplicable &&
// //     planData.isPFEmployee &&
// //     planData.pfEmployeeType === "percentage" &&
// //     planData.pfEmployeePercentage &&
// //     !isNaN(parseFloat(planData.pfEmployeePercentage))
// //   ) {
// //     employeePF = Math.round(pfBase * (parseFloat(planData.pfEmployeePercentage) / 100));
// //     planData.pfEmployeeText = `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
// //       planData.pfCalculationBase
// //     )}`;
// //   } else if (planData.pfEmployeeAmount && !isNaN(parseFloat(planData.pfEmployeeAmount))) {
// //     employeePF = Math.round(parseFloat(planData.pfEmployeeAmount) / 12);
// //     planData.pfEmployeeText = `₹${planData.pfEmployeeAmount} (Fixed)`;
// //   } else {
// //     employeePF = 0;
// //     planData.pfEmployeeText = `Not Applicable`;
// //     console.warn(`No Employee PF defined for employee ${employeeId}`);
// //   }
// //   console.log(
// //     `Employee PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employeePF}`
// //   );

// //   // Employer PF
// //   if (
// //     planData.isPFApplicable &&
// //     planData.isPFEmployer &&
// //     planData.pfEmployerType === "percentage" &&
// //     planData.pfEmployerPercentage &&
// //     !isNaN(parseFloat(planData.pfEmployerPercentage))
// //   ) {
// //     employerPF = Math.round(pfBase * (parseFloat(planData.pfEmployerPercentage) / 100));
// //     planData.pfEmployerText = `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
// //       planData.pfCalculationBase
// //     )}`;
// //   } else if (planData.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
// //     employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
// //     planData.pfEmployerText = `₹${planData.pfEmployerAmount} (Fixed)`;
// //   } else {
// //     employerPF = 0;
// //     planData.pfEmployerText = `Not Applicable`;
// //     console.warn(`No Employer PF defined for employee ${employeeId}`);
// //   }
// //   console.log(
// //     `Employer PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employerPF}`
// //   );

// //   // Medical Allowances (ESIC and Insurance)
// //   const medicalBase = planData.medicalCalculationBase === "gross" ? grossSalary : basicSalary;

// //   // ESIC
// //   if (
// //     planData.isMedicalApplicable &&
// //     planData.isESICEmployee &&
// //     planData.esicEmployeeType === "percentage" &&
// //     planData.esicEmployeePercentage &&
// //     !isNaN(parseFloat(planData.esicEmployeePercentage))
// //   ) {
// //     esic = Math.round(medicalBase * (parseFloat(planData.esicEmployeePercentage) / 100));
// //     planData.esicEmployeeText = `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
// //       planData.medicalCalculationBase
// //     )}`;
// //   } else if (planData.esicEmployeeAmount && !isNaN(parseFloat(planData.esicEmployeeAmount))) {
// //     esic = Math.round(parseFloat(planData.esicEmployeeAmount) / 12);
// //     planData.esicEmployeeText = `₹${planData.esicEmployeeAmount} (Fixed)`;
// //   } else {
// //     esic = 0;
// //     planData.esicEmployeeText = `Not Applicable`;
// //     console.warn(`No ESIC defined for employee ${employeeId}`);
// //   }
// //   console.log(
// //     `ESIC (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${esic}`
// //   );

// //   // Insurance
// //   if (
// //     planData.isMedicalApplicable &&
// //     planData.isInsuranceEmployee &&
// //     planData.insuranceEmployeeType === "percentage" &&
// //     planData.insuranceEmployeePercentage &&
// //     !isNaN(parseFloat(planData.insuranceEmployeePercentage))
// //   ) {
// //     insurance = Math.round(medicalBase * (parseFloat(planData.insuranceEmployeePercentage) / 100));
// //     planData.insuranceEmployeeText = `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(
// //       planData.medicalCalculationBase
// //     )}`;
// //   } else if (planData.insuranceEmployeeAmount && !isNaN(parseFloat(planData.insuranceEmployeeAmount))) {
// //     insurance = Math.round(parseFloat(planData.insuranceEmployeeAmount) / 12);
// //     planData.insuranceEmployeeText = `₹${planData.insuranceEmployeeAmount} (Fixed)`;
// //   } else {
// //     insurance = 0;
// //     planData.insuranceEmployeeText = `Not Applicable`;
// //     console.warn(`No insurance defined for employee ${employeeId}`);
// //   }
// //   console.log(
// //     `Insurance (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${insurance}`
// //   );

// //   // Gratuity
// //   if (
// //     planData.isGratuityApplicable &&
// //     planData.gratuityType === "percentage" &&
// //     planData.gratuityPercentage &&
// //     !isNaN(parseFloat(planData.gratuityPercentage))
// //   ) {
// //     gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
// //   } else if (planData.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
// //     gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
// //   } else {
// //     gratuity = Math.round(basicSalary * 0.0481);
// //     console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
// //   }
// //   console.log(`Gratuity (monthly): ₹${gratuity}`);

// //   // Professional Tax
// //   if (
// //     planData.isProfessionalTax &&
// //     planData.professionalTaxType === "percentage" &&
// //     planData.professionalTax &&
// //     !isNaN(parseFloat(planData.professionalTax))
// //   ) {
// //     professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
// //   } else if (planData.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
// //     professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
// //   } else {
// //     professionalTax = monthlyCtc <= 15000 ? 0 : 200;
// //     console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
// //   }
// //   console.log(`Professional Tax (monthly): ₹${professionalTax}`);

// //   // Advance Recovery
// //   const employeeAdvances = safeAdvances.filter((adv) => {
// //     if (!adv.applicable_months || !adv.recovery_months) return false;
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
// //     const currentDate = new Date(currentYear, parseInt(currentMonthStr) - 1);
// //     const startDate = new Date(startYear, startMonth - 1);
// //     const endDate = new Date(endYear, endMonth - 1);
// //     const isValid =
// //       adv.employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
// //     console.log(
// //       `Advance check: employeeId=${adv.employee_id}, applicable_months=${
// //         adv.applicable_months
// //       }, recovery_months=${adv.recovery_months}, isValid=${isValid}`
// //     );
// //     return isValid;
// //   });

// //   advanceRecovery = employeeAdvances.reduce((total, adv) => {
// //     const amount = parseFloat(adv.advance_amount);
// //     const months = parseInt(adv.recovery_months);
// //     const recovery = months > 0 ? amount / months : 0;
// //     console.log(
// //       `Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`
// //     );
// //     return total + recovery;
// //   }, 0);
// //   console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

// //   // TDS (Modified to use CTC directly)
// //   let tds = 0;
// //   if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
// //     const annualCtc = parseFloat(ctc);
// //     const sortedSlabs = [...planData.tdsSlabs].sort((a, b) => parseInt(a.from) - parseInt(b.from));

// //     for (const slab of sortedSlabs) {
// //       const lower = parseInt(slab.from) || 0;
// //       const upper = parseInt(slab.to) || Infinity;
// //       const rate = parseFloat(slab.percentage) / 100 || 0;

// //       if (annualCtc >= lower && (upper === Infinity || annualCtc <= upper) && rate > 0) {
// //         tds = Math.round(annualCtc * rate / 12);
// //         console.log(
// //           `TDS calculated for CTC ₹${annualCtc}: slab [${lower}-${upper}], rate=${
// //             rate * 100
// //           }%, monthly TDS=₹${tds}`
// //         );
// //         break;
// //       }
// //     }
// //   } else {
// //     console.log(`No valid TDS slabs or TDS not applicable for employee ${employeeId}, setting TDS to 0`);
// //     tds = 0;
// //   }

// //   // Calculate Net Salary
// //   const netSalary = grossSalary - employeePF - professionalTax - tds - esic - advanceRecovery - insurance;

// //   const salaryDetails = {
// //     basicSalary: Math.round(basicSalary),
// //     hra: Math.round(hra),
// //     ltaAllowance: Math.round(ltaAllowance),
// //     overtimePay: Math.round(overtimePay),
// //     recordBonusPay: Math.round(recordBonusPay),
// //     recordBonusPayYearly: Math.round(recordBonusPayYearly), // New
// //     statutoryBonus: Math.round(statutoryBonus),
// //     statutoryBonusYearly: Math.round(statutoryBonusYearly), // New
// //     bonusPay: Math.round(bonusPay),
// //     employeePF: Math.round(employeePF),
// //     employerPF: Math.round(employerPF),
// //     esic: Math.round(esic),
// //     gratuity: Math.round(gratuity),
// //     professionalTax: Math.round(professionalTax),
// //     otherAllowances: Math.round(otherAllowances),
// //     tds: Math.round(tds),
// //     advanceRecovery: Math.round(advanceRecovery),
// //     insurance: Math.round(insurance),
// //     grossSalary: Math.round(grossSalary),
// //     netSalary: Math.round(netSalary),
// //     incentivePay: Math.round(incentivePay),
// //   };

// //   console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
// //   return salaryDetails;
// // };

// // export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, incentivesData) => {
// //   if (!Array.isArray(employees)) {
// //     console.error("Invalid employees array in calculateTotals");
// //     return {
// //       totalPayable: 0,
// //       totalGross: 0,
// //       totalTDS: 0,
// //       totalAdvance: 0,
// //       totalOvertime: 0,
// //       totalBonus: 0,
// //       totalEmployeePF: 0,
// //       totalEmployerPF: 0,
// //       totalInsurance: 0,
// //       totalIncentives: 0,
// //     };
// //   }

// //   return employees.reduce(
// //     (totals, emp) => {
// //       const salaryDetails = calculateSalaryDetails(
// //         emp.ctc,
// //         emp.plan_data,
// //         emp.employee_id,
// //         overtimeRecords,
// //         bonusRecords,
// //         advances,
// //         incentivesData
// //       );
// //       if (!salaryDetails) {
// //         console.warn(`No salary details for employee ${emp.employee_id}`);
// //         return totals;
// //       }

// //       return {
// //         totalPayable: totals.totalPayable + salaryDetails.netSalary,
// //         totalGross: totals.totalGross + salaryDetails.grossSalary,
// //         totalTDS: totals.totalTDS + salaryDetails.tds,
// //         totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
// //         totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
// //         totalBonus: totals.totalBonus + salaryDetails.bonusPay, // Uses total bonusPay
// //         totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
// //         totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
// //         totalInsurance: totals.totalInsurance + salaryDetails.insurance,
// //         totalIncentives: totals.totalIncentives + salaryDetails.incentivePay,
// //       };
// //     },
// //     {
// //       totalPayable: 0,
// //       totalGross: 0,
// //       totalTDS: 0,
// //       totalAdvance: 0,
// //       totalOvertime: 0,
// //       totalBonus: 0,
// //       totalEmployeePF: 0,
// //       totalEmployerPF: 0,
// //       totalInsurance: 0,
// //       totalIncentives: 0,
// //     }
// //   );
// // };

// // export const getMonthlySalary = (employeeId, employees) => {
// //   const employee = employees.find((emp) => emp.employee_id === employeeId);
// //   if (!employee || !employee.ctc) return 0;
// //   return Math.round(parseFloat(employee.ctc) / 12);
// // };

// ////above working code ///////////---/////////////--////



// export const getCurrentYearMonth = () => {
//      const year = new Date().getFullYear();
//      const month = String(new Date().getMonth() + 1).padStart(2, "0");
//      return `${year}-${month}`; // e.g. "2025-09"
//    };

//    export const parseApplicableMonth = (monthStr) => {
//      if (!monthStr || typeof monthStr !== "string") {
//        console.log(`Invalid applicable_month format: ${monthStr}`);
//        return null;
//      }

//      if (/^\d{4}-\d{2}$/.test(monthStr)) {
//        const [year, month] = monthStr.split("-").map(Number);
//        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
//          console.log(`Invalid year or month in ${monthStr}`);
//          return null;
//        }
//        return new Date(year, month - 1);
//      }

//      const monthNames = [
//        "January", "February", "March", "April", "May", "June",
//        "July", "August", "September", "October", "November", "December",
//      ];
//      const monthIndex = monthNames.findIndex(
//        (name) => name.toLowerCase() === monthStr.toLowerCase()
//      );
//      if (monthIndex !== -1) {
//        return new Date(new Date().getFullYear(), monthIndex);
//      }

//      console.log(`Invalid applicable_month format: ${monthStr}`);
//      return null;
//    };

//    export const parseWorkDate = (dateStr) => {
//      try {
//        const date = new Date(dateStr);
//        return isNaN(date.getTime()) ? null : date;
//      } catch (error) {
//        console.error(`Error parsing work date: ${dateStr}`, error);
//        return null;
//      }
//    };

//    export const getWorkingDaysInMonth = (year, month) => {
//      const daysInMonth = new Date(year, month, 0).getDate();
//      let workingDays = 0;
//      for (let day = 1; day <= daysInMonth; day++) {
//        const date = new Date(year, month - 1, day);
//        if (date.getDay() !== 0 && date.getDay() !== 6) {
//          workingDays++;
//        }
//      }
//      return workingDays;
//    };

//    const formatCalculationBase = (base) => {
//      return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
//    };

//    export const calculateSalaryDetails = (
//      ctc,
//      planData,
//      employeeId,
//      overtimeRecords = [],
//      bonusRecords = [],
//      advances = [],
//      employeeIncentiveData = {},
//      employeeLopData = {} // Added for LOP
//    ) => {
//      console.log(
//        `calculateSalaryDetails called for employeeId=${employeeId} at ${new Date().toISOString()}`
//      );

//      const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
//      const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
//      const safeAdvances = Array.isArray(advances) ? advances : [];

//      if (!employeeId) {
//        console.error(`Invalid employeeId (${employeeId})`);
//        return null;
//      }

//      if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
//        console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
//        ctc = 0;
//      }

//      const now = new Date();
//      const currentYear = now.getFullYear();
//      const currentMonth = now.getMonth() + 1;
//      const currentMonthStr = currentMonth.toString().padStart(2, "0");
//      const monthlyCtc = ctc ? parseFloat(ctc) / 12 : 0;

//      let basicSalary = 0,
//        hra = 0,
//        ltaAllowance = 0,
//        overtimePay = 0,
//        recordBonusPay = 0,
//        recordBonusPayYearly = 0,
//        statutoryBonus = 0,
//        statutoryBonusYearly = 0,
//        employeePF = 0,
//        employerPF = 0,
//        esic = 0,
//        gratuity = 0,
//        professionalTax = 0,
//        otherAllowances = 0,
//        advanceRecovery = 0,
//        insurance = 0,
//        grossSalary = 0,
//        incentivePay = 0,
//        lopDeduction = 0; // Added for LOP

//      if (!planData || typeof planData !== "object") {
//        console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
//        planData = {};
//      }

//      // Basic Salary
//      if (
//        planData.isBasicSalary &&
//        planData.basicSalaryType === "percentage" &&
//        planData.basicSalary &&
//        !isNaN(parseFloat(planData.basicSalary))
//      ) {
//        basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
//      } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
//        basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
//      } else {
//        basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
//        console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
//      }
//      console.log(`Basic Salary (monthly): ₹${basicSalary}`);

//      // HRA
//      if (
//        planData.isHouseRentAllowance &&
//        planData.houseRentAllowanceType === "percentage" &&
//        planData.houseRentAllowance &&
//        !isNaN(parseFloat(planData.houseRentAllowance))
//      ) {
//        hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
//      } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
//        hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
//      } else {
//        hra = Math.round(basicSalary * 0.5);
//        console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
//      }
//      console.log(`HRA (monthly): ₹${hra}`);

//      // LTA Allowance
//      if (
//        planData.isLtaAllowance &&
//        planData.ltaAllowanceType === "percentage" &&
//        planData.ltaAllowance &&
//        !isNaN(parseFloat(planData.ltaAllowance))
//      ) {
//        ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
//      } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
//        ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
//      } else {
//        ltaAllowance = 0;
//        console.warn(`No LTA Allowance defined for employee ${employeeId}`);
//      }
//      console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

//      // Other Allowances
//      if (
//        planData.isOtherAllowance &&
//        planData.otherAllowanceType === "percentage" &&
//        planData.otherAllowance &&
//        !isNaN(parseFloat(planData.otherAllowance))
//      ) {
//        otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
//      } else if (planData.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
//        otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
//      } else {
//        otherAllowances = 0;
//        console.warn(`Using default otherAllowances (0) for employee ${employeeId}`);
//      }
//      console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

//      // Overtime Pay
//      console.log(`Filtering overtime records for employee ${employeeId}`);
//      const employeeOvertime = safeOvertimeRecords.filter((ot) => {
//        const otDate = parseWorkDate(ot.work_date);
//        const isValid =
//          ot.employee_id === employeeId &&
//          ot.status === "Approved" &&
//          otDate &&
//          otDate.getFullYear() === currentYear &&
//          (otDate.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
//        console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
//        return isValid;
//      });

//      overtimePay = employeeOvertime.reduce((total, ot) => {
//        const hours = parseFloat(ot.extra_hours);
//        let rate = parseFloat(ot.rate);
//        console.log(`Processing overtime: hours=${hours}, rate=${rate}`);

//        if (!rate || isNaN(rate) || rate === 0) {
//          if (
//            planData.isOvertimePay &&
//            planData.overtimePayAmount &&
//            !isNaN(parseFloat(planData.overtimePayAmount))
//          ) {
//            rate = parseFloat(planData.overtimePayAmount);
//            console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
//          } else {
//            rate = 0;
//            console.log(`No valid rate or overtimePayAmount; using rate=0`);
//          }
//        }

//        if (isNaN(hours) || hours <= 0) {
//          console.log(`Invalid hours for overtime record: ${ot.punch_id}, hours=${ot.extra_hours}`);
//          return total;
//        }

//        const pay = hours * rate;
//        console.log(`Overtime pay for punch_id ${ot.punch_id}: ${hours} hours * ₹${rate}/hour = ₹${pay}`);
//        return total + pay;
//      }, 0);
//      console.log(`Total overtimePay for employee ${employeeId}: ₹${overtimePay}`);

//      // Bonus Pay from Records
//      console.log(
//        `Filtering bonus records for employee ${employeeId}, currentYear=${currentYear}, currentMonth=${currentMonthStr}`
//      );
//      const employeeBonuses = safeBonusRecords.filter((bonus) => {
//        const date = parseApplicableMonth(bonus.applicable_month);
//        const isValid =
//          date &&
//          date.getFullYear() === currentYear &&
//          (date.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
//        console.log(
//          `Checking bonus ID ${bonus.id}: employee_id=${
//            bonus.employee_id
//          }, applicable_month=${bonus.applicable_month}, parsedDate=${date ? date.toISOString() : "null"}, isValid=${isValid}`
//        );
//        return isValid;
//      });

//      recordBonusPayYearly = employeeBonuses.reduce((total, bonus) => {
//        let amount = 0;
//        console.log(`Processing bonus ID ${bonus.id}:`, JSON.stringify(bonus));

//        if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
//          amount = parseFloat(bonus.fixed_amount) * 12; // Yearly amount
//          console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount} (yearly)`);
//        } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
//          amount = (parseFloat(bonus.percentage_ctc) / 100) * ctc; // Yearly amount
//          console.log(
//            `Bonus ID ${bonus.id}: Applying percentage_ctc=${bonus.percentage_ctc}% of CTC → ₹${amount} (yearly)`
//          );
//        } else if (
//          bonus.percentage_monthly_salary &&
//          monthlyCtc &&
//          !isNaN(parseFloat(bonus.percentage_monthly_salary))
//        ) {
//          amount = (parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc * 12; // Yearly amount
//          console.log(
//            `Bonus ID ${bonus.id}: Applying percentage_monthly_salary=${bonus.percentage_monthly_salary}% of monthlyCtc → ₹${amount} (yearly)`
//          );
//        } else {
//          console.warn(`Bonus ID ${bonus.id}: No valid amount found (bonus data =`, bonus, `)`);
//        }

//        return total + amount;
//      }, 0);

//      recordBonusPay = Math.round(recordBonusPayYearly / 12); // Monthly, rounded for consistency
//      console.log(`recordBonusPayYearly for employee ${employeeId}: ₹${recordBonusPayYearly}`);
//      console.log(`recordBonusPay (monthly) for employee ${employeeId}: ₹${recordBonusPay}`);

//      // Statutory Bonus
//      statutoryBonusYearly = 0;
//      if (
//        planData.isStatutoryBonus &&
//        planData.statutoryBonusPercentage &&
//        !isNaN(parseFloat(planData.statutoryBonusPercentage))
//      ) {
//        statutoryBonusYearly = (parseFloat(planData.statutoryBonusPercentage) / 100) * ctc;
//        console.log(
//          `Applying statutory bonus (percentage): ${planData.statutoryBonusPercentage}% of CTC → ₹${statutoryBonusYearly} (yearly)`
//        );
//      } else if (
//        planData.isStatutoryBonus &&
//        planData.statutoryBonusAmount &&
//        !isNaN(parseFloat(planData.statutoryBonusAmount))
//      ) {
//        statutoryBonusYearly = parseFloat(planData.statutoryBonusAmount);
//        console.log(
//          `Applying statutory bonus (fixed annual): ${planData.statutoryBonusAmount} → ₹${statutoryBonusYearly} (yearly)`
//        );
//      } else {
//        console.log(`No statutory bonus applied for employee ${employeeId}`);
//      }

//      statutoryBonus = Math.round(statutoryBonusYearly / 12); // Monthly, rounded for consistency
//      console.log(`statutoryBonusYearly for employee ${employeeId}: ₹${statutoryBonusYearly}`);
//      console.log(`statutoryBonus (monthly) for employee ${employeeId}: ₹${statutoryBonus}`);

//      // Total Bonus Pay
//      const bonusPay = recordBonusPay + statutoryBonus;
//      console.log(`✅ Total bonusPay (monthly) for employee ${employeeId}: ₹${bonusPay}`);

//      // Incentive Pay
//      const empId = String(employeeId).toUpperCase();
//      const matchedKey = Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId);
//      incentivePay = matchedKey && employeeIncentiveData[matchedKey]?.totalIncentive
//        ? parseFloat(employeeIncentiveData[matchedKey].totalIncentive.value) || 0
//        : 0;
//      console.log(`Incentive Pay (monthly) for employee ${employeeId}: ₹${incentivePay}`);

//      // Calculate Gross Salary
//      grossSalary = basicSalary + hra + ltaAllowance + overtimePay + bonusPay + otherAllowances + incentivePay;
//      console.log(`Gross Salary (monthly): ₹${grossSalary}`);

//      // Employee PF
//      const pfBase = planData.pfCalculationBase === "gross" ? grossSalary : basicSalary;
//      if (
//        planData.isPFApplicable &&
//        planData.isPFEmployee &&
//        planData.pfEmployeeType === "percentage" &&
//        planData.pfEmployeePercentage &&
//        !isNaN(parseFloat(planData.pfEmployeePercentage))
//      ) {
//        employeePF = Math.round(pfBase * (parseFloat(planData.pfEmployeePercentage) / 100));
//        planData.pfEmployeeText = `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
//          planData.pfCalculationBase
//        )}`;
//      } else if (planData.pfEmployeeAmount && !isNaN(parseFloat(planData.pfEmployeeAmount))) {
//        employeePF = Math.round(parseFloat(planData.pfEmployeeAmount) / 12);
//        planData.pfEmployeeText = `₹${planData.pfEmployeeAmount} (Fixed)`;
//      } else {
//        employeePF = 0;
//        planData.pfEmployeeText = `Not Applicable`;
//        console.warn(`No Employee PF defined for employee ${employeeId}`);
//      }
//      console.log(
//        `Employee PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employeePF}`
//      );

//      // Employer PF
//      if (
//        planData.isPFApplicable &&
//        planData.isPFEmployer &&
//        planData.pfEmployerType === "percentage" &&
//        planData.pfEmployerPercentage &&
//        !isNaN(parseFloat(planData.pfEmployerPercentage))
//      ) {
//        employerPF = Math.round(pfBase * (parseFloat(planData.pfEmployerPercentage) / 100));
//        planData.pfEmployerText = `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
//          planData.pfCalculationBase
//        )}`;
//      } else if (planData.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
//        employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
//        planData.pfEmployerText = `₹${planData.pfEmployerAmount} (Fixed)`;
//      } else {
//        employerPF = 0;
//        planData.pfEmployerText = `Not Applicable`;
//        console.warn(`No Employer PF defined for employee ${employeeId}`);
//      }
//      console.log(
//        `Employer PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employerPF}`
//      );

//      // Medical Allowances (ESIC and Insurance)
//      const medicalBase = planData.medicalCalculationBase === "gross" ? grossSalary : basicSalary;

//      // ESIC
//      if (
//        planData.isMedicalApplicable &&
//        planData.isESICEmployee &&
//        planData.esicEmployeeType === "percentage" &&
//        planData.esicEmployeePercentage &&
//        !isNaN(parseFloat(planData.esicEmployeePercentage))
//      ) {
//        esic = Math.round(medicalBase * (parseFloat(planData.esicEmployeePercentage) / 100));
//        planData.esicEmployeeText = `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
//          planData.medicalCalculationBase
//        )}`;
//      } else if (planData.esicEmployeeAmount && !isNaN(parseFloat(planData.esicEmployeeAmount))) {
//        esic = Math.round(parseFloat(planData.esicEmployeeAmount) / 12);
//        planData.esicEmployeeText = `₹${planData.esicEmployeeAmount} (Fixed)`;
//      } else {
//        esic = 0;
//        planData.esicEmployeeText = `Not Applicable`;
//        console.warn(`No ESIC defined for employee ${employeeId}`);
//      }
//      console.log(
//        `ESIC (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${esic}`
//      );

//      // Insurance
//      if (
//        planData.isMedicalApplicable &&
//        planData.isInsuranceEmployee &&
//        planData.insuranceEmployeeType === "percentage" &&
//        planData.insuranceEmployeePercentage &&
//        !isNaN(parseFloat(planData.insuranceEmployeePercentage))
//      ) {
//        insurance = Math.round(medicalBase * (parseFloat(planData.insuranceEmployeePercentage) / 100));
//        planData.insuranceEmployeeText = `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(
//          planData.medicalCalculationBase
//        )}`;
//      } else if (planData.insuranceEmployeeAmount && !isNaN(parseFloat(planData.insuranceEmployeeAmount))) {
//        insurance = Math.round(parseFloat(planData.insuranceEmployeeAmount) / 12);
//        planData.insuranceEmployeeText = `₹${planData.insuranceEmployeeAmount} (Fixed)`;
//      } else {
//        insurance = 0;
//        planData.insuranceEmployeeText = `Not Applicable`;
//        console.warn(`No insurance defined for employee ${employeeId}`);
//      }
//      console.log(
//        `Insurance (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${insurance}`
//      );

//      // Gratuity
//      if (
//        planData.isGratuityApplicable &&
//        planData.gratuityType === "percentage" &&
//        planData.gratuityPercentage &&
//        !isNaN(parseFloat(planData.gratuityPercentage))
//      ) {
//        gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
//      } else if (planData.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
//        gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
//      } else {
//        gratuity = Math.round(basicSalary * 0.0481);
//        console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
//      }
//      console.log(`Gratuity (monthly): ₹${gratuity}`);

//      // Professional Tax
//      if (
//        planData.isProfessionalTax &&
//        planData.professionalTaxType === "percentage" &&
//        planData.professionalTax &&
//        !isNaN(parseFloat(planData.professionalTax))
//      ) {
//        professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
//      } else if (planData.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
//        professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
//      } else {
//        professionalTax = monthlyCtc <= 15000 ? 0 : 200;
//        console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
//      }
//      console.log(`Professional Tax (monthly): ₹${professionalTax}`);

//      // Advance Recovery
//      const employeeAdvances = safeAdvances.filter((adv) => {
//        if (!adv.applicable_months || !adv.recovery_months) return false;
//        const advDate = parseApplicableMonth(adv.applicable_months);
//        if (!advDate) return false;
//        const advYear = advDate.getFullYear();
//        const advMonth = advDate.getMonth() + 1;
//        const recoveryMonths = parseInt(adv.recovery_months);
//        const startMonth = advMonth;
//        const startYear = advYear;
//        let endYear = startYear;
//        let endMonth = startMonth + recoveryMonths - 1;
//        if (endMonth > 12) {
//          endYear += Math.floor((endMonth - 1) / 12);
//          endMonth = ((endMonth - 1) % 12) + 1;
//        }
//        const currentDate = new Date(currentYear, parseInt(currentMonthStr) - 1);
//        const startDate = new Date(startYear, startMonth - 1);
//        const endDate = new Date(endYear, endMonth - 1);
//        const isValid =
//          adv.employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
//        console.log(
//          `Advance check: employeeId=${adv.employee_id}, applicable_months=${
//            adv.applicable_months
//          }, recovery_months=${adv.recovery_months}, isValid=${isValid}`
//        );
//        return isValid;
//      });

//      advanceRecovery = employeeAdvances.reduce((total, adv) => {
//        const amount = parseFloat(adv.advance_amount);
//        const months = parseInt(adv.recovery_months);
//        const recovery = months > 0 ? amount / months : 0;
//        console.log(
//          `Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`
//        );
//        return total + recovery;
//      }, 0);
//      console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

//      // TDS
//      let tds = 0;
//      if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
//        const annualCtc = parseFloat(ctc);
//        const sortedSlabs = [...planData.tdsSlabs].sort((a, b) => parseInt(a.from) - parseInt(b.from));

//        for (const slab of sortedSlabs) {
//          const lower = parseInt(slab.from) || 0;
//          const upper = parseInt(slab.to) || Infinity;
//          const rate = parseFloat(slab.percentage) / 100 || 0;

//          if (annualCtc >= lower && (upper === Infinity || annualCtc <= upper) && rate > 0) {
//            tds = Math.round(annualCtc * rate / 12);
//            console.log(
//              `TDS calculated for CTC ₹${annualCtc}: slab [${lower}-${upper}], rate=${
//                rate * 100
//              }%, monthly TDS=₹${tds}`
//            );
//            break;
//          }
//        }
//      } else {
//        console.log(`No valid TDS slabs or TDS not applicable for employee ${employeeId}, setting TDS to 0`);
//        tds = 0;
//      }

//      // LOP Deduction
//      lopDeduction = parseFloat(employeeLopData[employeeId]?.currentMonth?.value || 0);
//      if (lopDeduction > 0) {
//        console.log(`LOP Deduction (monthly): ₹${lopDeduction} based on ${employeeLopData[employeeId]?.currentMonth?.days || 0} unpaid days`);
//      } else {
//        console.log(`No LOP deduction applied for employee ${employeeId}`);
//      }

//      // Calculate Net Salary
//      const netSalary = grossSalary - employeePF - professionalTax - tds - esic - advanceRecovery - insurance - lopDeduction;

//      const salaryDetails = {
//        basicSalary: Math.round(basicSalary),
//        hra: Math.round(hra),
//        ltaAllowance: Math.round(ltaAllowance),
//        overtimePay: Math.round(overtimePay),
//        recordBonusPay: Math.round(recordBonusPay),
//        recordBonusPayYearly: Math.round(recordBonusPayYearly),
//        statutoryBonus: Math.round(statutoryBonus),
//        statutoryBonusYearly: Math.round(statutoryBonusYearly),
//        bonusPay: Math.round(bonusPay),
//        employeePF: Math.round(employeePF),
//        employerPF: Math.round(employerPF),
//        esic: Math.round(esic),
//        gratuity: Math.round(gratuity),
//        professionalTax: Math.round(professionalTax),
//        otherAllowances: Math.round(otherAllowances),
//        tds: Math.round(tds),
//        advanceRecovery: Math.round(advanceRecovery),
//        insurance: Math.round(insurance),
//        grossSalary: Math.round(grossSalary),
//        netSalary: Math.round(netSalary),
//        incentivePay: Math.round(incentivePay),
//        lopDeduction: Math.round(lopDeduction), // Added for LOP
//      };

//      console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
//      return salaryDetails;
//    };

//    export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, incentivesData, employeeLopData) => {
//      if (!Array.isArray(employees)) {
//        console.error("Invalid employees array in calculateTotals");
//        return {
//          totalPayable: 0,
//          totalGross: 0,
//          totalTDS: 0,
//          totalAdvance: 0,
//          totalOvertime: 0,
//          totalBonus: 0,
//          totalEmployeePF: 0,
//          totalEmployerPF: 0,
//          totalInsurance: 0,
//          totalIncentives: 0,
//          totalLopDeduction: 0, // Added for LOP
//        };
//      }

//      return employees.reduce(
//        (totals, emp) => {
//          const salaryDetails = calculateSalaryDetails(
//            emp.ctc,
//            emp.plan_data,
//            emp.employee_id,
//            overtimeRecords,
//            bonusRecords,
//            advances,
//            incentivesData,
//            employeeLopData // Pass LOP data
//          );
//          if (!salaryDetails) {
//            console.warn(`No salary details for employee ${emp.employee_id}`);
//            return totals;
//          }

//          return {
//            totalPayable: totals.totalPayable + salaryDetails.netSalary,
//            totalGross: totals.totalGross + salaryDetails.grossSalary,
//            totalTDS: totals.totalTDS + salaryDetails.tds,
//            totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
//            totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
//            totalBonus: totals.totalBonus + salaryDetails.bonusPay,
//            totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
//            totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
//            totalInsurance: totals.totalInsurance + salaryDetails.insurance,
//            totalIncentives: totals.totalIncentives + salaryDetails.incentivePay,
//            totalLopDeduction: totals.totalLopDeduction + salaryDetails.lopDeduction, // Added for LOP
//          };
//        },
//        {
//          totalPayable: 0,
//          totalGross: 0,
//          totalTDS: 0,
//          totalAdvance: 0,
//          totalOvertime: 0,
//          totalBonus: 0,
//          totalEmployeePF: 0,
//          totalEmployerPF: 0,
//          totalInsurance: 0,
//          totalIncentives: 0,
//          totalLopDeduction: 0, // Added for LOP
//        }
//      );
//    };

//    export const getMonthlySalary = (employeeId, employees) => {
//      const employee = employees.find((emp) => emp.employee_id === employeeId);
//      if (!employee || !employee.ctc) return 0;
//      return Math.round(parseFloat(employee.ctc) / 12);
//    };

////working code above ////--------for lop details----


export const getCurrentYearMonth = () => {
     const year = new Date().getFullYear();
     const month = String(new Date().getMonth() + 1).padStart(2, "0");
     return `${year}-${month}`; // e.g. "2025-09"
   };

   export const parseApplicableMonth = (monthStr) => {
     if (!monthStr || typeof monthStr !== "string") {
       console.log(`Invalid applicable_month format: ${monthStr}`);
       return null;
     }

     if (/^\d{4}-\d{2}$/.test(monthStr)) {
       const [year, month] = monthStr.split("-").map(Number);
       if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
         console.log(`Invalid year or month in ${monthStr}`);
         return null;
       }
       return new Date(year, month - 1);
     }

     const monthNames = [
       "January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December",
     ];
     const monthIndex = monthNames.findIndex(
       (name) => name.toLowerCase() === monthStr.toLowerCase()
     );
     if (monthIndex !== -1) {
       return new Date(new Date().getFullYear(), monthIndex);
     }

     console.log(`Invalid applicable_month format: ${monthStr}`);
     return null;
   };

   export const parseWorkDate = (dateStr) => {
     try {
       const date = new Date(dateStr);
       return isNaN(date.getTime()) ? null : date;
     } catch (error) {
       console.error(`Error parsing work date: ${dateStr}`, error);
       return null;
     }
   };

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

   const formatCalculationBase = (base) => {
     return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Basic";
   };

   export const calculateSalaryDetails = (
     ctc,
     planData,
     employeeId,
     overtimeRecords = [],
     bonusRecords = [],
     advances = [],
     employeeIncentiveData = {},
     employeeLopData = {} // Added for LOP
   ) => {
     console.log(
       `calculateSalaryDetails called for employeeId=${employeeId} at ${new Date().toISOString()}`
     );

     const safeOvertimeRecords = Array.isArray(overtimeRecords) ? overtimeRecords : [];
     const safeBonusRecords = Array.isArray(bonusRecords) ? bonusRecords : [];
     const safeAdvances = Array.isArray(advances) ? advances : [];

     if (!employeeId) {
       console.error(`Invalid employeeId (${employeeId})`);
       return null;
     }

     if (!ctc || ctc <= 0 || isNaN(parseFloat(ctc))) {
       console.warn(`Invalid or missing CTC (${ctc}) for employee ${employeeId}. Using default CTC of 0.`);
       ctc = 0;
     }

     const now = new Date();
     const currentYear = now.getFullYear();
     const currentMonth = now.getMonth() + 1;
     const currentMonthStr = currentMonth.toString().padStart(2, "0");
     const monthlyCtc = ctc ? parseFloat(ctc) / 12 : 0;

     let basicSalary = 0,
       hra = 0,
       ltaAllowance = 0,
       overtimePay = 0,
       recordBonusPay = 0,
       recordBonusPayYearly = 0,
       statutoryBonus = 0,
       statutoryBonusYearly = 0,
       employeePF = 0,
       employerPF = 0,
       esic = 0,
       gratuity = 0,
       professionalTax = 0,
       otherAllowances = 0,
       advanceRecovery = 0,
       insurance = 0,
       grossSalary = 0,
       incentivePay = 0,
       lopDeduction = 0; // Added for LOP

     if (!planData || typeof planData !== "object") {
       console.warn(`Invalid or missing planData for employee ${employeeId}. Using default values.`);
       planData = {};
     }

     // Basic Salary
     if (
       planData.isBasicSalary &&
       planData.basicSalaryType === "percentage" &&
       planData.basicSalary &&
       !isNaN(parseFloat(planData.basicSalary))
     ) {
       basicSalary = Math.round(monthlyCtc * (parseFloat(planData.basicSalary) / 100));
     } else if (planData.basicSalaryAmount && !isNaN(parseFloat(planData.basicSalaryAmount))) {
       basicSalary = Math.round(parseFloat(planData.basicSalaryAmount) / 12);
     } else {
       basicSalary = monthlyCtc ? Math.round(monthlyCtc * 0.4) : 0;
       console.warn(`Using default basicSalary (40% of CTC) for employee ${employeeId}`);
     }
     console.log(`Basic Salary (monthly): ₹${basicSalary}`);

     // HRA
     if (
       planData.isHouseRentAllowance &&
       planData.houseRentAllowanceType === "percentage" &&
       planData.houseRentAllowance &&
       !isNaN(parseFloat(planData.houseRentAllowance))
     ) {
       hra = Math.round(basicSalary * (parseFloat(planData.houseRentAllowance) / 100));
     } else if (planData.houseRentAllowanceAmount && !isNaN(parseFloat(planData.houseRentAllowanceAmount))) {
       hra = Math.round(parseFloat(planData.houseRentAllowanceAmount) / 12);
     } else {
       hra = Math.round(basicSalary * 0.5);
       console.warn(`Using default HRA (50% of basicSalary) for employee ${employeeId}`);
     }
     console.log(`HRA (monthly): ₹${hra}`);

     // LTA Allowance
     if (
       planData.isLtaAllowance &&
       planData.ltaAllowanceType === "percentage" &&
       planData.ltaAllowance &&
       !isNaN(parseFloat(planData.ltaAllowance))
     ) {
       ltaAllowance = Math.round(monthlyCtc * (parseFloat(planData.ltaAllowance) / 100));
     } else if (planData.ltaAllowanceAmount && !isNaN(parseFloat(planData.ltaAllowanceAmount))) {
       ltaAllowance = Math.round(parseFloat(planData.ltaAllowanceAmount) / 12);
     } else {
       ltaAllowance = 0;
       console.warn(`No LTA Allowance defined for employee ${employeeId}`);
     }
     console.log(`LTA Allowance (monthly): ₹${ltaAllowance}`);

     // Other Allowances
     if (
       planData.isOtherAllowance &&
       planData.otherAllowanceType === "percentage" &&
       planData.otherAllowance &&
       !isNaN(parseFloat(planData.otherAllowance))
     ) {
       otherAllowances = Math.round(monthlyCtc * (parseFloat(planData.otherAllowance) / 100));
     } else if (planData.otherAllowanceAmount && !isNaN(parseFloat(planData.otherAllowanceAmount))) {
       otherAllowances = Math.round(parseFloat(planData.otherAllowanceAmount) / 12);
     } else {
       otherAllowances = 0;
       console.warn(`Using default otherAllowances (0) for employee ${employeeId}`);
     }
     console.log(`Other Allowances (monthly): ₹${otherAllowances}`);

     // Overtime Pay
     // Overtime Pay
  console.log(`Filtering overtime records for employee ${employeeId}, year=${currentYear}, month=${currentMonthStr}`);
  const employeeOvertime = safeOvertimeRecords.filter((ot) => {
    const otDate = parseWorkDate(ot.work_date);
    const isValid =
      ot.employee_id === employeeId &&
      ot.status === "Approved" &&
      otDate &&
      otDate.getFullYear() === currentYear &&
      (otDate.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
    console.log(`Overtime record:`, JSON.stringify(ot), `isValid: ${isValid}`);
    return isValid;
  });

  if (employeeOvertime.length === 0) {
    console.log(`No approved overtime records found for employee ${employeeId} in ${currentYear}-${currentMonthStr}`);
  } else {
    console.log(`Found ${employeeOvertime.length} overtime records for employee ${employeeId}`);
  }

  overtimePay = employeeOvertime.reduce((total, ot) => {
    const hours = parseFloat(ot.extra_hours);
    let rate = parseFloat(ot.rate);
    console.log(`Processing overtime: punch_id=${ot.punch_id}, hours=${hours}, rate=${rate}`);

    if (!rate || isNaN(rate) || rate === 0) {
      if (
        planData.isOvertimePay &&
        planData.overtimePayAmount &&
        !isNaN(parseFloat(planData.overtimePayAmount))
      ) {
        rate = parseFloat(planData.overtimePayAmount);
        console.log(`Using planData.overtimePayAmount: ₹${rate}/hour`);
      } else {
        rate = 500; // Fallback default rate (₹500/hour)
        console.warn(`No valid rate or overtimePayAmount for employee ${employeeId}; using default rate=₹${rate}/hour`);
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

     // Bonus Pay from Records
     console.log(
       `Filtering bonus records for employee ${employeeId}, currentYear=${currentYear}, currentMonth=${currentMonthStr}`
     );
     const employeeBonuses = safeBonusRecords.filter((bonus) => {
       const date = parseApplicableMonth(bonus.applicable_month);
       const isValid =
         date &&
         date.getFullYear() === currentYear &&
         (date.getMonth() + 1).toString().padStart(2, "0") === currentMonthStr;
       console.log(
         `Checking bonus ID ${bonus.id}: employee_id=${
           bonus.employee_id
         }, applicable_month=${bonus.applicable_month}, parsedDate=${date ? date.toISOString() : "null"}, isValid=${isValid}`
       );
       return isValid;
     });

     recordBonusPayYearly = employeeBonuses.reduce((total, bonus) => {
       let amount = 0;
       console.log(`Processing bonus ID ${bonus.id}:`, JSON.stringify(bonus));

       if (bonus.fixed_amount && !isNaN(parseFloat(bonus.fixed_amount))) {
         amount = parseFloat(bonus.fixed_amount) * 12; // Yearly amount
         console.log(`Bonus ID ${bonus.id}: Applying fixed_amount=₹${amount} (yearly)`);
       } else if (bonus.percentage_ctc && ctc && !isNaN(parseFloat(bonus.percentage_ctc))) {
         amount = (parseFloat(bonus.percentage_ctc) / 100) * ctc; // Yearly amount
         console.log(
           `Bonus ID ${bonus.id}: Applying percentage_ctc=${bonus.percentage_ctc}% of CTC → ₹${amount} (yearly)`
         );
       } else if (
         bonus.percentage_monthly_salary &&
         monthlyCtc &&
         !isNaN(parseFloat(bonus.percentage_monthly_salary))
       ) {
         amount = (parseFloat(bonus.percentage_monthly_salary) / 100) * monthlyCtc * 12; // Yearly amount
         console.log(
           `Bonus ID ${bonus.id}: Applying percentage_monthly_salary=${bonus.percentage_monthly_salary}% of monthlyCtc → ₹${amount} (yearly)`
         );
       } else {
         console.warn(`Bonus ID ${bonus.id}: No valid amount found (bonus data =`, bonus, `)`);
       }

       return total + amount;
     }, 0);

     recordBonusPay = Math.round(recordBonusPayYearly / 12); // Monthly, rounded for consistency
     console.log(`recordBonusPayYearly for employee ${employeeId}: ₹${recordBonusPayYearly}`);
     console.log(`recordBonusPay (monthly) for employee ${employeeId}: ₹${recordBonusPay}`);

     // Statutory Bonus
     statutoryBonusYearly = 0;
     if (
       planData.isStatutoryBonus &&
       planData.statutoryBonusPercentage &&
       !isNaN(parseFloat(planData.statutoryBonusPercentage))
     ) {
       statutoryBonusYearly = (parseFloat(planData.statutoryBonusPercentage) / 100) * ctc;
       console.log(
         `Applying statutory bonus (percentage): ${planData.statutoryBonusPercentage}% of CTC → ₹${statutoryBonusYearly} (yearly)`
       );
     } else if (
       planData.isStatutoryBonus &&
       planData.statutoryBonusAmount &&
       !isNaN(parseFloat(planData.statutoryBonusAmount))
     ) {
       statutoryBonusYearly = parseFloat(planData.statutoryBonusAmount);
       console.log(
         `Applying statutory bonus (fixed annual): ${planData.statutoryBonusAmount} → ₹${statutoryBonusYearly} (yearly)`
       );
     } else {
       console.log(`No statutory bonus applied for employee ${employeeId}`);
     }

     statutoryBonus = Math.round(statutoryBonusYearly / 12); // Monthly, rounded for consistency
     console.log(`statutoryBonusYearly for employee ${employeeId}: ₹${statutoryBonusYearly}`);
     console.log(`statutoryBonus (monthly) for employee ${employeeId}: ₹${statutoryBonus}`);

     // Total Bonus Pay
     const bonusPay = recordBonusPay + statutoryBonus;
     console.log(`✅ Total bonusPay (monthly) for employee ${employeeId}: ₹${bonusPay}`);

     // Incentive Pay
     const empId = String(employeeId).toUpperCase();
     const matchedKey = Object.keys(employeeIncentiveData).find(key => String(key).toUpperCase() === empId);
     incentivePay = matchedKey && employeeIncentiveData[matchedKey]?.totalIncentive
       ? parseFloat(employeeIncentiveData[matchedKey].totalIncentive.value) || 0
       : 0;
     console.log(`Incentive Pay (monthly) for employee ${employeeId}: ₹${incentivePay}`);

     // Calculate Gross Salary
     grossSalary = basicSalary + hra + ltaAllowance + overtimePay + bonusPay + otherAllowances + incentivePay;
     console.log(`Gross Salary (monthly): ₹${grossSalary}`);

     // Employee PF
     const pfBase = planData.pfCalculationBase === "gross" ? grossSalary : basicSalary;
     if (
       planData.isPFApplicable &&
       planData.isPFEmployee &&
       planData.pfEmployeeType === "percentage" &&
       planData.pfEmployeePercentage &&
       !isNaN(parseFloat(planData.pfEmployeePercentage))
     ) {
       employeePF = Math.round(pfBase * (parseFloat(planData.pfEmployeePercentage) / 100));
       planData.pfEmployeeText = `${planData.pfEmployeePercentage}% of ${formatCalculationBase(
         planData.pfCalculationBase
       )}`;
     } else if (planData.pfEmployeeAmount && !isNaN(parseFloat(planData.pfEmployeeAmount))) {
       employeePF = Math.round(parseFloat(planData.pfEmployeeAmount) / 12);
       planData.pfEmployeeText = `₹${planData.pfEmployeeAmount} (Fixed)`;
     } else {
       employeePF = 0;
       planData.pfEmployeeText = `Not Applicable`;
       console.warn(`No Employee PF defined for employee ${employeeId}`);
     }
     console.log(
       `Employee PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employeePF}`
     );

     // Employer PF
     if (
       planData.isPFApplicable &&
       planData.isPFEmployer &&
       planData.pfEmployerType === "percentage" &&
       planData.pfEmployerPercentage &&
       !isNaN(parseFloat(planData.pfEmployerPercentage))
     ) {
       employerPF = Math.round(pfBase * (parseFloat(planData.pfEmployerPercentage) / 100));
       planData.pfEmployerText = `${planData.pfEmployerPercentage}% of ${formatCalculationBase(
         planData.pfCalculationBase
       )}`;
     } else if (planData.pfEmployerAmount && !isNaN(parseFloat(planData.pfEmployerAmount))) {
       employerPF = Math.round(parseFloat(planData.pfEmployerAmount) / 12);
       planData.pfEmployerText = `₹${planData.pfEmployerAmount} (Fixed)`;
     } else {
       employerPF = 0;
       planData.pfEmployerText = `Not Applicable`;
       console.warn(`No Employer PF defined for employee ${employeeId}`);
     }
     console.log(
       `Employer PF (monthly, based on ${formatCalculationBase(planData.pfCalculationBase)}): ₹${employerPF}`
     );

     // Medical Allowances (ESIC and Insurance)
     const medicalBase = planData.medicalCalculationBase === "gross" ? grossSalary : basicSalary;

     // ESIC
     if (
       planData.isMedicalApplicable &&
       planData.isESICEmployee &&
       planData.esicEmployeeType === "percentage" &&
       planData.esicEmployeePercentage &&
       !isNaN(parseFloat(planData.esicEmployeePercentage))
     ) {
       esic = Math.round(medicalBase * (parseFloat(planData.esicEmployeePercentage) / 100));
       planData.esicEmployeeText = `${planData.esicEmployeePercentage}% of ${formatCalculationBase(
         planData.medicalCalculationBase
       )}`;
     } else if (planData.esicEmployeeAmount && !isNaN(parseFloat(planData.esicEmployeeAmount))) {
       esic = Math.round(parseFloat(planData.esicEmployeeAmount) / 12);
       planData.esicEmployeeText = `₹${planData.esicEmployeeAmount} (Fixed)`;
     } else {
       esic = 0;
       planData.esicEmployeeText = `Not Applicable`;
       console.warn(`No ESIC defined for employee ${employeeId}`);
     }
     console.log(
       `ESIC (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${esic}`
     );

     // Insurance
     if (
       planData.isMedicalApplicable &&
       planData.isInsuranceEmployee &&
       planData.insuranceEmployeeType === "percentage" &&
       planData.insuranceEmployeePercentage &&
       !isNaN(parseFloat(planData.insuranceEmployeePercentage))
     ) {
       insurance = Math.round(medicalBase * (parseFloat(planData.insuranceEmployeePercentage) / 100));
       planData.insuranceEmployeeText = `${planData.insuranceEmployeePercentage}% of ${formatCalculationBase(
         planData.medicalCalculationBase
       )}`;
     } else if (planData.insuranceEmployeeAmount && !isNaN(parseFloat(planData.insuranceEmployeeAmount))) {
       insurance = Math.round(parseFloat(planData.insuranceEmployeeAmount) / 12);
       planData.insuranceEmployeeText = `₹${planData.insuranceEmployeeAmount} (Fixed)`;
     } else {
       insurance = 0;
       planData.insuranceEmployeeText = `Not Applicable`;
       console.warn(`No insurance defined for employee ${employeeId}`);
     }
     console.log(
       `Insurance (monthly, based on ${formatCalculationBase(planData.medicalCalculationBase)}): ₹${insurance}`
     );

     // Gratuity
     if (
       planData.isGratuityApplicable &&
       planData.gratuityType === "percentage" &&
       planData.gratuityPercentage &&
       !isNaN(parseFloat(planData.gratuityPercentage))
     ) {
       gratuity = Math.round(basicSalary * (parseFloat(planData.gratuityPercentage) / 100));
     } else if (planData.gratuityAmount && !isNaN(parseFloat(planData.gratuityAmount))) {
       gratuity = Math.round(parseFloat(planData.gratuityAmount) / 12);
     } else {
       gratuity = Math.round(basicSalary * 0.0481);
       console.warn(`Using default gratuity (4.81% of basicSalary) for employee ${employeeId}`);
     }
     console.log(`Gratuity (monthly): ₹${gratuity}`);

     // Professional Tax
     if (
       planData.isProfessionalTax &&
       planData.professionalTaxType === "percentage" &&
       planData.professionalTax &&
       !isNaN(parseFloat(planData.professionalTax))
     ) {
       professionalTax = Math.round(monthlyCtc * (parseFloat(planData.professionalTax) / 100));
     } else if (planData.professionalTaxAmount && !isNaN(parseFloat(planData.professionalTaxAmount))) {
       professionalTax = Math.round(parseFloat(planData.professionalTaxAmount) / 12);
     } else {
       professionalTax = monthlyCtc <= 15000 ? 0 : 200;
       console.warn(`Using default professionalTax (₹200 or 0) for employee ${employeeId}`);
     }
     console.log(`Professional Tax (monthly): ₹${professionalTax}`);

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
       const currentDate = new Date(currentYear, parseInt(currentMonthStr) - 1);
       const startDate = new Date(startYear, startMonth - 1);
       const endDate = new Date(endYear, endMonth - 1);
       const isValid =
         adv.employee_id === employeeId && currentDate >= startDate && currentDate <= endDate;
       console.log(
         `Advance check: employeeId=${adv.employee_id}, applicable_months=${
           adv.applicable_months
         }, recovery_months=${adv.recovery_months}, isValid=${isValid}`
       );
       return isValid;
     });

     advanceRecovery = employeeAdvances.reduce((total, adv) => {
       const amount = parseFloat(adv.advance_amount);
       const months = parseInt(adv.recovery_months);
       const recovery = months > 0 ? amount / months : 0;
       console.log(
         `Advance recovery: amount=₹${amount}, months=${months}, recovery=₹${recovery}`
       );
       return total + recovery;
     }, 0);
     console.log(`Total Advance Recovery (monthly): ₹${advanceRecovery}`);

     // TDS
     let tds = 0;
     if (planData.isTDSApplicable && Array.isArray(planData.tdsSlabs) && planData.tdsSlabs.length > 0) {
       const annualCtc = parseFloat(ctc);
       const sortedSlabs = [...planData.tdsSlabs].sort((a, b) => parseInt(a.from) - parseInt(b.from));

       for (const slab of sortedSlabs) {
         const lower = parseInt(slab.from) || 0;
         const upper = parseInt(slab.to) || Infinity;
         const rate = parseFloat(slab.percentage) / 100 || 0;

         if (annualCtc >= lower && (upper === Infinity || annualCtc <= upper) && rate > 0) {
           tds = Math.round(annualCtc * rate / 12);
           console.log(
             `TDS calculated for CTC ₹${annualCtc}: slab [${lower}-${upper}], rate=${
               rate * 100
             }%, monthly TDS=₹${tds}`
           );
           break;
         }
       }
     } else {
       console.log(`No valid TDS slabs or TDS not applicable for employee ${employeeId}, setting TDS to 0`);
       tds = 0;
     }

     // LOP Deduction
     lopDeduction = parseFloat(employeeLopData[employeeId]?.currentMonth?.value || 0);
     if (lopDeduction > 0) {
       console.log(`LOP Deduction (monthly): ₹${lopDeduction} based on ${employeeLopData[employeeId]?.currentMonth?.days || 0} unpaid days`);
     } else {
       console.log(`No LOP deduction applied for employee ${employeeId}`);
     }

     // Calculate Net Salary
     const netSalary = grossSalary - employeePF - professionalTax - tds - esic - advanceRecovery - insurance - lopDeduction;

     const salaryDetails = {
       basicSalary: Math.round(basicSalary),
       hra: Math.round(hra),
       ltaAllowance: Math.round(ltaAllowance),
       overtimePay: Math.round(overtimePay),
       recordBonusPay: Math.round(recordBonusPay),
       recordBonusPayYearly: Math.round(recordBonusPayYearly),
       statutoryBonus: Math.round(statutoryBonus),
       statutoryBonusYearly: Math.round(statutoryBonusYearly),
       bonusPay: Math.round(bonusPay),
       employeePF: Math.round(employeePF),
       employerPF: Math.round(employerPF),
       esic: Math.round(esic),
       gratuity: Math.round(gratuity),
       professionalTax: Math.round(professionalTax),
       otherAllowances: Math.round(otherAllowances),
       tds: Math.round(tds),
       advanceRecovery: Math.round(advanceRecovery),
       insurance: Math.round(insurance),
       grossSalary: Math.round(grossSalary),
       netSalary: Math.round(netSalary),
       incentivePay: Math.round(incentivePay),
       lopDeduction: Math.round(lopDeduction), // Added for LOP
     };

     console.log(`Final salary details for employee ${employeeId}:`, JSON.stringify(salaryDetails, null, 2));
     return salaryDetails;
   };

   export const calculateTotals = (employees, overtimeRecords, bonusRecords, advances, incentivesData, employeeLopData) => {
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
         totalIncentives: 0,
         totalLopDeduction: 0, // Added for LOP
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
           incentivesData,
           employeeLopData // Pass LOP data
         );
         if (!salaryDetails) {
           console.warn(`No salary details for employee ${emp.employee_id}`);
           return totals;
         }

         return {
           totalPayable: totals.totalPayable + salaryDetails.netSalary,
           totalGross: totals.totalGross + salaryDetails.grossSalary,
           totalTDS: totals.totalTDS + salaryDetails.tds,
           totalAdvance: totals.totalAdvance + salaryDetails.advanceRecovery,
           totalOvertime: totals.totalOvertime + salaryDetails.overtimePay,
           totalBonus: totals.totalBonus + salaryDetails.bonusPay,
           totalEmployeePF: totals.totalEmployeePF + salaryDetails.employeePF,
           totalEmployerPF: totals.totalEmployerPF + salaryDetails.employerPF,
           totalInsurance: totals.totalInsurance + salaryDetails.insurance,
           totalIncentives: totals.totalIncentives + salaryDetails.incentivePay,
           totalLopDeduction: totals.totalLopDeduction + salaryDetails.lopDeduction, // Added for LOP
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
         totalIncentives: 0,
         totalLopDeduction: 0, // Added for LOP
       }
     );
   };

   export const getMonthlySalary = (employeeId, employees) => {
     const employee = employees.find((emp) => emp.employee_id === employeeId);
     if (!employee || !employee.ctc) return 0;
     return Math.round(parseFloat(employee.ctc) / 12);
   };