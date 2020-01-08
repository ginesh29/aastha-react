export const BASE_API_URL = "http://localhost:61194/api";
export const ROWS = 10;


export const caseTypeOptions = [
  { value: 1, label: "Old" },
  { value: 2, label: "New" }
];

export const roomTypeOptions = [
  { value: 1, label: "General" },
  { value: 2, label: "Special" },
  { value: 3, label: "Semi-Special" }
];

export const departmentTypeEnum = {
  DELIVERY: { value: 1, label: "Delivery" },
  OPERATION: { value: 2, label: "Operation" },
  GENERAL: { value: 3, label: "General" }
};

export const genderOptions = [
  { value: 1, label: "Boy" },
  { value: 2, label: "Girl" }
];

export const lookupTypesOptionsEnum = {
  DELIVERYTYPE: { value: 1, label: "Delivery Type" },
  OPERATIONTYPE: { value: 2, label: "Operation Type" },
  OPERATIONDIAGNOSIS: { value: 3, label: "Operation Diagnosis" },
  GENERALDIAGNOSIS: { value: 4, label: "General Diagnosis" },
  MEDICINTYPE: { value: 5, label: "Medicine Type" },
  MEDICINE: { value: 6, label: "Medicine" },
  CHARGENAME: { value: 7, label: "ChargeName" },
  DELIVERYDIAGNOSIS: { value: 8, label: "DeliveryDiagnosis" },
  ADDRESS: { value: 9, label: "Address" }
};
