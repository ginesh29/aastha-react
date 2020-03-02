import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
export const BASE_API_URL = {
  development: "http://localhost:61194/api",
  production: "http://localhost:8082/api"
};
export const ROWS = 10;
export const TODAY_DATE = new Date();
// TODAY_DATE.setFullYear(TODAY_DATE.getFullYear() - 1);
export const TEN_YEAR_RANGE = `${TODAY_DATE.getFullYear() - 10}:${TODAY_DATE.getFullYear() + 10}`;

export const FULLCALENDAR_OPTION = {
  firstDay: 1,
  eventLimit: 6,
  hiddenDays: [0],
  plugins: [dayGridPlugin, interactionPlugin]
};

//Title
export const PATIENT_REGISTRATION_TITLE = "Patient Registration";
export const ADD_ADDRESS_TITLE = "Add Address";
export const ADD_OPD_TITLE = "Opd Entry";
export const ADD_IPD_TITLE = "Ipd Entry";

export const SELECT2_ACTION_CLEAR_TEXT = "clear";

export const caseTypeOptions = [
  { value: 1, label: "Old" },
  { value: 2, label: "New" }
];

export const roomTypeOptions = [
  { value: 1, label: "General" },
  { value: 2, label: "Special" },
  { value: 3, label: "Semi-Special" }
];

export const genderOptions = [
  { value: 1, label: "Boy" },
  { value: 2, label: "Girl" }
];

export const adviceOptions = [
  { value: 1, label: "Plenty of liquids orally" },
  { value: 2, label: "USG Pelvis (SOS)" },
  { value: 3, label: "ANC Profile" },
  { value: 4, label: "Timed Intercourse on Date" },
  { value: 5, label: "Abstinece/Condom use for next 7 days" },
  { value: 6, label: "Infertility work-up" }
];

export const medicineInstructionOptions = [
  { id: 1, label: "૧ સવારે", value: 1 },
  { id: 2, label: "૧ બપોરે", value: 1 },
  { id: 3, label: "૧ સાંજે", value: 1 },
  { id: 4, label: "૧ રાત્રે", value: 1 },

  { id: 5, label: "૨ સવારે", value: 2 },
  { id: 6, label: "૨ બપોરે", value: 2 },
  { id: 7, label: "૨ સાંજે", value: 2 },
  { id: 8, label: "૨ રાત્રે", value: 2 },

  { id: 9, label: "જમ્યા પહેલા" },
  { id: 10, label: "જમ્યા પછી" },
  { id: 11, label: "નાસ્તા પહેલા" },
  { id: 12, label: "નાસ્તા પછી" },

  { id: 13, label: "૧ ગોળી તાવ આવે ત્યારે જ લેવી." },
  { id: 14, label: "૧ ગોળી માથુ દુખે ત્યારે જ લેવી." },
  { id: 15, label: "૧ ગોળી પેટમાં દુખે ત્યારે જ લેવી." },

  { id: 16, label: "૧ ગોળી રોજ રાત્રે સૂતા પહેલા માસિકના ભાગે મૂકવી" },
  { id: 17, label: "ટ્યુબ રોજ રાત્રે સૂતા પહેલા માસિકના અંદરના ભાગે લગાવવી" },
  { id: 18, label: "૨ ચમચી અડધા ગ્લાસ પાણીમાં નાખીને દિવસમાં ત્રણવાર જમ્યા પછી પીવુ" },
  { id: 19, label: "૨ ચમચી પાઉડર ૧ ગ્લાસ પાણી/દુધમાં નાખીને દિવસમાં બેવાર પીવુ" }
];
