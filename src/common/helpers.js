import { repository } from "./repository";
import { lookupTypeEnum } from "./enums";
export class helper {
  constructor() {
    this.repository = new repository();
  }
  toSentenceCase = e => {
    let value = e && e.target ? e.target.value : e;
    let str = value;
    let result = "";
    if (str) {
      result = str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
    if (e && e.target)
      e.target.value = result;
    else
      e = result;
    return result;
  };

  enumToObject = function (enumValue) {
    const keys = Object.keys(enumValue);
    const result = keys.map(key => {
      return enumValue[key];
    });
    return result;
  };

  PatientOptions = (inputValue, callback, MessageRef) => {
    this.repository.get("patients", `fields=id,fullname&take=15&filter=firstname.contains({${inputValue.toLowerCase()}}) or middlename.contains({${inputValue.toLowerCase()}}) or lastname.contains({${inputValue.toLowerCase()}})`, MessageRef)
      .then(res => {
        let patients = res && res.data.map(function (item) {
          return { value: item["id"], label: item["fullname"] };
        });
        callback(patients)
      })
  }

  AddressOptions = (inputValue, callback, MessageRef) => {
    let filter = `type-equals-{${lookupTypeEnum.ADDRESS.value}}`;
    if (inputValue)
      filter = filter + ` and name.contains({${inputValue.toLowerCase()}})`
    this.repository.get("lookups", `take=15&filter=${filter}`, MessageRef)
      .then(res => {
        let addresses = res && res.data.map(function (item) {
          return { value: item["id"], label: item["name"] };
        });
        callback(addresses)
      })
  }

  generateFilterString = (filters) => {
    let filterString = "";
    let operatorCondition = "";
    let filterMatchMode = "";
    let filterValue = "";
    let operator = "";
    let filterData = Object.keys(filters)
    // eslint-disable-next-line
    filterData.map((field, index) => {
      operator = index !== filterData.length - 1 ? " and" : "";
      filterMatchMode = filters[field].matchMode;
      filterValue = filters[field].value;
      if (filterMatchMode === "contains")
        if (field === "fullname") {
          operatorCondition = `firstname.${filterMatchMode}({${filterValue}}) or 
                              middlename.${filterMatchMode}({${filterValue}}) or 
                              lastname.${filterMatchMode}({${filterValue}})${operator} `;
        }
        else
          operatorCondition = `${field}.${filterMatchMode}({${filterValue}})${operator} `;
      else
        if (filterMatchMode === "equals")
          operatorCondition = `${field}-${filterMatchMode}-{${filterValue}}${operator} `;
      filterString = filterString + operatorCondition;
    })
    return filterString;
  }
  generateSortString = (sortMeta) => {
    let sortString = "";
    let sortField = "";
    let sortOrder = "";
    let operator = "";
    let operatorCondition = "";
    // eslint-disable-next-line
    sortMeta.map((item, index) => {
      operator = index !== sortMeta.length - 1 ? "," : "";
      sortField = item.field;
      sortOrder = item.order === 1 ? "asc" : "desc"
      if (sortField === "fullname") {
        operatorCondition = `firstname ${sortOrder}${operator}`;
      }
      else
        operatorCondition = `${sortField} ${sortOrder}${operator}`;
      sortString = sortString + operatorCondition;
    })
    return sortString;
  }
}