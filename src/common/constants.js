export const BASE_API_URL = "http://localhost:61194/api";
export const ROWS = "10";


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

export const lookupTypesOptions = {
  DELIVERYTYPE: { value: 1, label: "DeliveryType" },
  OPERATIONTYPE: { value: 2, label: "OperationType" },
  OPERATIONDIAGNOSIS: { value: 3, label: "OperationDiagnosis" },
  GENERALDIAGNOSIS: { value: 4, label: "GeneralDiagnosis" },
  MEDICINTYPE: { value: 5, label: "MedicinType" },
  MEDICINE: { value: 6, label: "Medicine" },
  CHARGENAME: { value: 7, label: "ChargeName" },
  DELIVERYDIAGNOSIS: { value: 8, label: "DeliveryDiagnosis" }
};
