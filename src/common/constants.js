import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
export const BASE_API_URL = {
  development: "http://localhost:81/api",
  production: "http://aastha2.api/api",
};
export const ROWS = 10;
export const TODAY_DATE = new Date();
export const HUNDRED_YEAR_RANGE = `${TODAY_DATE.getFullYear() - 100}:${
  TODAY_DATE.getFullYear() + 10
}`;

export const FULLCALENDAR_OPTION = {
  firstDay: 1,
  eventLimit: 6,
  plugins: [dayGridPlugin, interactionPlugin],
  contentHeight: "auto",
};

//Title
export const PATIENT_REGISTRATION_TITLE = "Patient Registration";
export const ADD_CITY_TITLE = "Add City/Village";
export const ADD_OPD_TITLE = "Opd Entry";
export const ADD_IPD_TITLE = "Ipd Entry";

export const SELECT2_ACTION_CLEAR_TEXT = "clear";

export const caseTypeOptions = [
  { value: 1, label: "Old" },
  { value: 2, label: "New" },
];

export const roomTypeOptions = [
  { value: 1, label: "General" },
  { value: 2, label: "Special" },
  { value: 3, label: "Semi-Special" },
];
export const paymentModeOptions = [
  { value: 1, label: "Cash" },
  { value: 2, label: "Non-cash" },
];

export const childGenderOptions = [
  { value: 1, label: "Boy" },
  { value: 2, label: "Girl" },
];

export const adviceOptions = [
  { value: 1, label: "Plenty of liquids orally" },
  { value: 2, label: "USG Pelvis (SOS)" },
  { value: 3, label: "ANC Profile" },
  { value: 4, label: "Timed Intercourse on Date" },
  { value: 5, label: "Abstinece/Condom use for next 7 days" },
  { value: 6, label: "Infertility work-up" },
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

  { id: 13, label: "પેટ પર લગાવવું." },
  { id: 14, label: "કમર પર માલીશ કરવી" },

  { id: 15, label: "૧ ગોળી તાવ આવે ત્યારે જ લેવી." },
  { id: 16, label: "૧ ગોળી માથુ દુખે ત્યારે જ લેવી." },

  { id: 17, label: "૧ ગોળી પેટમાં દુખે ત્યારે જ લેવી." },
  { id: 18, label: "૧ ગોળી કમરમાં દુખે ત્યારે જ લેવી." },

  { id: 19, label: "૧ ગોળી જરૂર પડે ત્યારે જ લેવી." },
  { id: 20, label: "૧ ગોળી/ કેપસ્યુલ દર રવિવારે નાસ્તા પછી." },

  { id: 21, label: "૧ ગોળી રોજ રાત્રે સૂતા પહેલા માસિકના ભાગે મૂકવી" },
  { id: 22, label: "ટ્યુબ રોજ રાત્રે સૂતા પહેલા માસિકના અંદરના ભાગે લગાવવી" },
  { id: 23, label: "૨ ચમચી પાઉડર ૧ ગ્લાસ દુધમાં નાખીને દિવસમાં બેવાર પીવુ." },
  {
    id: 24,
    label: "૨ ચમચી પાઉડર ૧ ગ્લાસ પાણી/દુધમાં નાખીને દિવસમાં બેવાર પીવુ",
  },
  {
    id: 25,
    label: "૨ ચમચી પાઉડર ૧ ગ્લાસ પાણીમાં નાખીને દિવસમાં ત્રણ થી ચાર વાર પીવુ.",
  },
  {
    id: 26,
    label: "૨ ચમચી અડધા ગ્લાસ પાણીમાં નાખીને દિવસમાં ત્રણવાર જમ્યા પછી પીવુ",
  },
  {
    id: 27,
    label:
      "૩ ચમચી(15ml) અડધા ગ્લાસ પાણીમાં નાખીને દિવસમાં બે વાર જમ્યા પછી પીવુ.",
  },
];
export const FormFDiagnosisOptions = [
  { value: 1, label: "(1) To diagnose intra-uterine and/or ectopic pregnancy and confirm viability." },
  { value: 2, label: "(2) Estimation of gestational age(dating)." },
  { value: 3, label: "(3) Detection of number of foetuses and their chorionicity." },
  { value: 4, label: "(4) Suspected pregnancy with IUCD in-situ or suspected pregnancy following contraceptive failure/MTP failure." },
  { value: 5, label: "(5) Vaginal beeding/leaking." },
  { value: 6, label: "(6) Follow-up of cases of abortion." },
  { value: 7, label: "(7) Assessment of cervical canal and diameter of internal os." },
  { value: 8, label: "(8) Discrepancy between uterine size and period of amenorrhoea." },
  { value: 9, label: "(9) Any Suspected adenexal or utrine pathalogy/abnormality." },
  { value: 10, label: "(10) Detection of chromosomal abnormalities,foetal,structural defects and other abnormalities and their follow-.up" },
  { value: 11, label: "(11) To evaluate foetal presentation and position." },
  { value: 12, label: "(12) Assessment of liquor amnii." },
  { value: 13, label: "(13) Preterm labour/preterm premature repture of memberanes." },
  { value: 14, label: "(14) Evaluation of placental position,thickness grading and abnormalities(placentaPraevia,retroplacental Position,thickness grading and abnormalities(Placenta praevia,retroplacental haemorrhage,abnormal adherence,etc.)." },
  { value: 15, label: "(15) Evaluation of umbilical cord-presentation,insertion,nuchal encirclement,number of vessels and presence of true knot." },
  { value: 16, label: "(16) Evaluation of previous Caesarean Section scars." },
  { value: 17, label: "(17) Evaluation of foetal growth parameters ,foetal weight and foetal well being." },
  { value: 18, label: "(18) Colour flow mapping and duplex Doppler studies." },
  { value: 19, label: "(19) Ultrasound guided procedures such as medical termination of pregenancy ,external cephalic version,etc.,and their follow-up." },
  { value: 20, label: "(20) Adjunct to diagnostic and therapeutic invasive interventions such as chrionic villus sampling(CVS),amniocenteses,foetal blood sampling,foetal skin biopsy,amnio infusion,intrauterine infusion,placement of shunts,etc." },
  { value: 21, label: "(21) Observation of intra-partum events." },
  { value: 22, label: "(22) Medical/surgical conditions complicating pregnancy." },
  { value: 23, label: "(23) Research/scientific studies in recognised institutions." },
  { value: 24, label: "(24) Any other indication(Specify)" },
];