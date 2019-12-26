export const initialState = {
  formFields: {},
  validationError: {},
  isValidationFired: false
};
export const baseApiUrl = "http://localhost:61194/api"
export const caseTypes = [
  { value: 1, label: "Old" },
  { value: 2, label: "New" }
];
export const roomTypes = [
  { value: 1, label: "General" },
  { value: 2, label: "Special" },
  { value: 3, label: "Semi-Special" }
];
export const departmentTypes = [
  { value: 1, label: "Delivery" },
  { value: 2, label: "Operation" },
  { value: 3, label: "General" }
];
