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
  ADDRESS: { code: 9, label: "Address" },
  ADVICE: { code: 10, label: "Advice" },
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
  CYCLE: { value: 5, label: "Cycle Day" },
};

export const roleEnum = {
  ADMIN: { value: 1, label: "Admin" },
  ASSISTANT: { value: 2, label: "Assistant" },
};
