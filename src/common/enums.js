export const departmentTypeEnum = {
  DELIVERY: { value: 1, label: "Delivery" },
  OPERATION: { value: 2, label: "Operation" },
  GENERAL: { value: 3, label: "General" },
};
export const lookupTypeEnum = {
  DELIVERYTYPE: { code: 1, label: "Delivery Type" },
  OPERATIONTYPE: { code: 2, label: "Operation Type" },
  OPERATIONDIAGNOSIS: { code: 3, label: "Operation Diagnosis" },
  GENERALDIAGNOSIS: { code: 4, label: "General Diagnosis" },
  MEDICINETYPE: { code: 5, label: "Medicine Type" },
  MEDICINENAME: { code: 6, label: "Medicine Name" },
  CHARGENAME: { code: 7, label: "Indoor Charge Name" },
  DELIVERYDIAGNOSIS: { code: 8, label: "Delivery Diagnosis" },
  CITY: { code: 9, label: "City/Village" },
  ADVICE: { code: 10, label: "Advice" },
  DIST: { code: 11, label: "District" },
  TALUKA: { code: 12, label: "Taluka" },
};

export const reportTypeEnum = {
  DAILY: { value: 1, label: "Daily" },
  DATERANGE: { value: 2, label: "Date Range" },
  MONTHLY: { value: 3, label: "Monthly" },
};

export const appointmentTypeEnum = {
  DATE: { value: 1, label: "Date", color: "#cc2424" },
  SONOGRAPHY: { value: 2, label: "Sonography", color: "#00a651" },
  ANOMALY: { value: 3, label: "Anomaly", color: "#FCB322" },
  OVULATION: { value: 4, label: "Ovulation", color: "#59ace2" },
  CYCLE: { value: 5, label: "Cycle Day" ,color:"#116fbf"},
};

export const roleEnum = {
  ADMIN: { value: 1, label: "Admin" },
  ASSISTANT: { value: 2, label: "Assistant" },
};

export const patientHistoryOptionsEnum = {
  OPD:{ value: 1, label: "Opd" },
  IPD:{ value: 2, label: "Ipd" },
  PRESCRIPTION:{ value: 3, label: "Prescription" },
}
export const genderEnum = {
  MALE:{ value: 1, label: "Male" },
  FEMALE:{ value: 2, label: "Female" },
};
export const languageEnum = {
  GUJARATI:{ value: 1, label: "Gujarati" },
  HINDI:{ value: 2, label: "Hindi" },
  ENGLISH: { value: 3, label: "English" },
};
export const paymentModeEnum = {
  CASH:{ value: 1, label: "Cash" },
  NONCASH:{ value: 2, label: "Non-cash" },
};
export const departmentEnum = {
  OPD:{ value: 1, label: "Opd" },
  IPD:{ value: 2, label: "Ipd" },
};