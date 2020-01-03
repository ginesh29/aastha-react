import { repository } from "./repository";
export class helper {
  constructor() {
    this.repository = new repository();
  }
  toSentenceCase = e => {
    let str = e.target.value;
    let result = "";
    if (str) {
      result = str[0].toUpperCase() + str.slice(1);
    }
    e.target.value = result;
  };

  enumToObject = function (enumValue) {
    const keys = Object.keys(enumValue);
    const result = keys.map(key => {
      return enumValue[key];
    });
    return result;
  };

  PatientOptions = (inputValue, callback) => {
    this.repository.get("patients", `fields=id,fullname&take=15&filter=firstname.contains({${inputValue.toLowerCase()}}) or middlename.contains({${inputValue.toLowerCase()}}) or lastname.contains({${inputValue.toLowerCase()}})`)
      .then(res => {
        let patients = res && res.data.map(function (item) {
          return { value: item["id"], label: item["fullname"] };
        });
        callback(patients)
      })
  }
}
