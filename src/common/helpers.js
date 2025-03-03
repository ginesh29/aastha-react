import { repository } from "./repository";
import moment from "moment";
import "moment/locale/gu";
import "moment/locale/hi";
export class helper {
  constructor() {
    this.repository = new repository();
  }
  toSentenceCase = (e) => {
    let value = e && e.target ? e.target.value : e;
    let str = value;
    let result = "";
    if (str) {
      result =
        str &&
        str
          .split(" ")
          .map((w) => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(" ");
    }
    if (e && e.target) e.target.value = result;
    else e = result;
    return result;
  };

  enumToObject = function (enumValue) {
    const keys = Object.keys(enumValue);
    const result = keys.map((key) => {
      return enumValue[key];
    });
    return result;
  };

  PatientOptions = (inputValue, callback) => {
    let name = inputValue && inputValue.toLowerCase().split(" ");
    let filterCondition = [];
    name &&
      // eslint-disable-next-line
      name.map((item) => {
        filterCondition.push(
          `(firstname.contains({${item}}) or middlename.contains({${item}}) or fathername.contains({${item}}) or lastname.contains({${item}}))`
        );
      });
    let filter = filterCondition.join(" and ");
    filter = filter ? filter : "isdeleted-neq-{true}";
    this.repository
      .get("patients", `take=15&filter=${filter} and isdeleted-neq-{true}`)
      .then((res) => {
        let patients =
          res &&
          res.data.map(function (item) {
            return { value: item.id, label: item.fullname, age: item.age };
          });
        callback(patients);
      });
  };
  LookupOptions = (inputValue, callback, type, subtype) => {
    let filter = `type-eq-{${type}} and isdeleted-neq-{true}`;
    if (subtype) filter = `parentId-eq-{${subtype}} and ${filter}`;
    if (inputValue)
      filter = filter + ` and name.contains({${inputValue.toLowerCase()}})`;
    this.repository.get("lookups", `take=15&filter=${filter}`).then((res) => {
      let lookups =
        res &&
        res.data.map(function (item) {
          return { value: item.id, label: item.name };
        });
      callback(lookups);
    });
  };
  generateFilterString = (filters) => {
    let operatorCondition = [];
    let filterMatchMode = "";
    let filterValue = "";
    let filterData = Object.keys(filters);
    // eslint-disable-next-line
    filterData.map((field, index) => {
      filterMatchMode = filters[field].matchMode;
      filterValue = filters[field].value;
      if (filterMatchMode === "contains") {
        let name = filterValue.split(" ");
        if (field === "fullname") {
          // eslint-disable-next-line
          name.map((item) => {
            operatorCondition.push(
              `(firstname.${filterMatchMode}({${item}}) or middlename.${filterMatchMode}({${item}}) or fathername.${filterMatchMode}({${item}}) or lastname.${filterMatchMode}({${item}}))`
            );
          });
        } else if (field === "patient.fullname") {
          // eslint-disable-next-line
          name.map((item) => {
            operatorCondition.push(
              `(patient.firstname.${filterMatchMode}({${item}}) or patient.middlename.${filterMatchMode}({${item}}) or patient.fathername.${filterMatchMode}({${item}}) or patient.lastname.${filterMatchMode}({${item}}))`
            );
          });
        } else
          operatorCondition.push(
            `${field}.${filterMatchMode}({${filterValue}})`
          );
      } else if (filterMatchMode === "eq")
        if (field === "invoiceNo") {
          operatorCondition.push(`id-${filterMatchMode}-{${filterValue}}`);
        } else if (field === "date") {
          operatorCondition.push(
            `date.Date-${filterMatchMode}-{${this.formatDate(
              filterValue,
              "en-US"
            )}}`
          );
        } else if (field === "addmissionDate") {
          operatorCondition.push(
            `addmissionDate-${filterMatchMode}-{${this.formatDate(
              filterValue,
              "en-US"
            )}}`
          );
        } else if (field === "dischargeDate") {
          operatorCondition.push(
            `dischargeDate-${filterMatchMode}-{${this.formatDate(
              filterValue,
              "en-US"
            )}}`
          );
        } else
          operatorCondition.push(
            `${field}-${filterMatchMode}-{${filterValue}}`
          );
    });
    return operatorCondition.join(" and ");
  };
  generateSortString = (sortMeta) => {
    let sortField = "";
    let sortOrder = "";
    let operatorCondition = [];
    // eslint-disable-next-line
    sortMeta.map((item, index) => {
      sortField = item.field;
      sortOrder = item.order === 1 ? "asc" : "desc";
      if (sortField === "fullname") {
        operatorCondition.push(
          `firstname ${sortOrder},middlename ${sortOrder},fathername ${sortOrder},lastname ${sortOrder}`
        );
      } else if (sortField === "patient.fullname") {
        operatorCondition.push(
          `patient.firstname ${sortOrder},patient.middlename ${sortOrder},patient.fathername ${sortOrder},patient.lastname ${sortOrder}`
        );
      } else if (sortField === "invoiceNo") {
        operatorCondition.push(`id ${sortOrder}`);
      } else if (sortField === "formatedDate") {
        operatorCondition.push(`date ${sortOrder}`);
      } else if (sortField === "formatedAddmissionDate") {
        operatorCondition.push(`addmissionDate ${sortOrder}`);
      } else if (sortField === "formatedDischargeDate") {
        operatorCondition.push(`dischargeDate ${sortOrder}`);
      } else operatorCondition.push(`${sortField} ${sortOrder}`);
    });
    return operatorCondition.join(",");
  };
  formatDefaultDate = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d).locale("en").format("YYYY-MM-DD");
  };

  formatDefaultDateTime = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d).locale("en").toISOString();
  };

  formatDate = (date, format) => {
    let d = date ? new Date(date) : new Date();
    return format
      ? moment(d).locale("en").format("MM/DD/YYYY")
      : moment(d).locale("en").format("DD/MM/YYYY");
  };
  formatDateWithLanguage = (date, laguage, format) => {
    let d = date ? new Date(date) : new Date();
    return format
      ? moment(d).locale(laguage).format("MM/DD/YYYY")
      : moment(d).locale(laguage).format("DD/MM/YYYY");
  };
  formatDateTime = (date, format) => {
    let d = date ? new Date(date) : new Date();
    return format
      ? moment(d).locale("en").format("MM/DD/YYYY hh:mm A")
      : moment(d).locale("en").format("DD/MM/YYYY hh:mm A");
  };
  formatTime = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d, "HH:mm:ss").locale("en").format("HH:mm:ss");
  };
  getMonthFromDate = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d).locale("en").format("MM");
  };
  getYearFromDate = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d).locale("en").format("YYYY");
  };
  getDayFromDate = (date) => {
    let d = date ? new Date(date) : new Date();
    return moment(d).locale("en").format("DD");
  };
  formatCurrency = (number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(number);
  };
  formatAmount = (number) => {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(
      number
    );
  };
  formatStringToDate = (date) => {
    return this.formatDefaultDate(moment(date, "DD/MM/YYYY"));
  };
  onFilterChange = (event, dt) => {
    dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value });
  };
  stringShortning = (name, length) => {
    return name.length > length ? `${name.substr(0, length)}...` : name;
  };
  calculateAge = (birthdate) => {
    var currentDate = moment();
    var age = currentDate.diff(birthdate, "years");
    return age;
  };
  getWeeksBetweenDates = (startDate, endDate) => {
    const startMoment = moment(this.formatDate(startDate), "DD-MM-YYYY");
    const endMoment = moment(this.formatDate(endDate), "DD-MM-YYYY");
    const weeks = endMoment.diff(startMoment, "weeks");
    return weeks;
  };
}
