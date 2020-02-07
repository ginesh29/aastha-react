import { repository } from "./repository";
import { lookupTypeEnum } from "./enums";
export class helper
{
  constructor()
  {
    this.repository = new repository();
  }
  toSentenceCase = e =>
  {
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

  enumToObject = function (enumValue)
  {
    const keys = Object.keys(enumValue);
    const result = keys.map(key =>
    {
      return enumValue[key];
    });
    return result;
  };

  PatientOptions = (inputValue, callback) =>
  {
    let filter = inputValue && `firstname.contains({${ inputValue.toLowerCase() }}) or middlename.contains({${ inputValue.toLowerCase() }}) or lastname.contains({${ inputValue.toLowerCase() }})`;
    this.repository.get("patients", `fields=id,fullname,age&take=15&filter=${ filter }`)
      .then(res =>
      {
        let patients = res && res.data.map(function (item)
        {
          return { value: item.id, label: item.fullname, age: item.age };
        });
        callback(patients)
      })
  }
  MedicineTypeOptions = (inputValue, callback) =>
  {
    let filter = `type-eq-{${ lookupTypeEnum.MEDICINETYPE.value }} and name.contains({${ inputValue.toLowerCase() }})`;
    this.repository.get("lookups", `fields=id,name&take=15&filter=${ filter }`)
      .then(res =>
      {
        let medicineTypes = res && res.data.map(function (item)
        {
          return { value: item.id, label: item.name };
        });
        callback(medicineTypes)
      })
  }
  MedicineNameOptions = (inputValue, callback, medicineType) =>
  {
    console.log(medicineType)
    let filter = `type-eq-{${ lookupTypeEnum.MEDICINENAME.value }} and parentId-eq-{${ 401 }} and name.contains({${ inputValue.toLowerCase() }})`;
    this.repository.get("lookups", `fields=id,name&take=15&filter=${ filter }`)
      .then(res =>
      {
        let medicineTypes = res && res.data.map(function (item)
        {
          return { value: item.id, label: item.name };
        });
        callback(medicineTypes)
      })
  }
  AddressOptions = (inputValue, callback) =>
  {
    let filter = `type-eq-{${ lookupTypeEnum.ADDRESS.value }}`;
    if (inputValue)
      filter = filter + ` and name.contains({${ inputValue.toLowerCase() }})`
    this.repository.get("lookups", `take=15&filter=${ filter }`)
      .then(res =>
      {
        let addresses = res && res.data.map(function (item)
        {
          return { value: item.id, label: item.name };
        });
        callback(addresses)
      })
  }

  generateFilterString = (filters) =>
  {
    let filterString = "";
    let operatorCondition = "";
    let filterMatchMode = "";
    let filterValue = "";
    let operator = "";
    let filterData = Object.keys(filters)
    return filterData.map((field, index) =>
    {
      operator = index !== filterData.length - 1 ? " and" : "";
      filterMatchMode = filters[field].matchMode;
      filterValue = filters[field].value;
      if (filterMatchMode === "contains")
        if (field === "fullname") {
          operatorCondition = `firstname.${ filterMatchMode }({${ filterValue }}) or 
                              middlename.${filterMatchMode }({${ filterValue }}) or 
                              lastname.${filterMatchMode }({${ filterValue }})${ operator } `;
        }
        else
          operatorCondition = `${ field }.${ filterMatchMode }({${ filterValue }})${ operator } `;
      else
        if (filterMatchMode === "eq")
          operatorCondition = `${ field }-${ filterMatchMode }-{${ filterValue }}${ operator } `;
      filterString = filterString + operatorCondition;
      return filterString;
    })
  }
  generateSortString = (sortMeta) =>
  {
    let sortString = "";
    let sortField = "";
    let sortOrder = "";
    let operator = "";
    let operatorCondition = "";
    return sortMeta.map((item, index) =>
    {
      operator = index !== sortMeta.length - 1 ? "," : "";
      sortField = item.field;
      sortOrder = item.order === 1 ? "asc" : "desc"
      if (sortField === "fullname") {
        operatorCondition = `firstname ${ sortOrder }${ operator }`;
      }
      else
        operatorCondition = `${ sortField } ${ sortOrder }${ operator }`;
      sortString = sortString + operatorCondition;
      return sortString;
    })
  }
  formatFullcalendarDate = (date) =>
  {
    let d = date ? new Date(date) : new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    return year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day);
  }
  formatDate = (date, format) =>
  {
    return (new Date(date)).toLocaleDateString(format ? format : 'en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' });
  }
  formatTime = (date) =>
  {
    let d = date ? new Date(date) : new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    return `${ hour }:${ minute }`;
  }
  getMonthFromDate = (date) =>
  {
    let d = date ? new Date(date) : new Date();
    let month = d.getMonth() + 1;
    return month < 10 ? `0${ month }` : month;
  }
  getYearFromDate = (date) =>
  {
    let d = date ? new Date(date) : new Date();
    return d.getFullYear();
  }
  getDayFromDate = (date) =>
  {
    let d = date ? new Date(date) : new Date();
    return d.getDate();
  }
  formatCurrency = (number) =>
  {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(number);
  }
}