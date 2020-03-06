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
			result =
				str &&
				str
					.split(" ")
					.map(w => w[0] && w[0].toUpperCase() + w.substr(1).toLowerCase())
					.join(" ");
		}
		if (e && e.target) e.target.value = result;
		else e = result;
		return result;
	};

	enumToObject = function(enumValue) {
		const keys = Object.keys(enumValue);
		const result = keys.map(key => {
			return enumValue[key];
		});
		return result;
	};

	PatientOptions = (inputValue, callback) => {
		let name = inputValue && inputValue.toLowerCase().split(" ");
		let filter = `firstname.contains({${name[0] ? name[0] : ""}}) and middlename.contains({${name[1] ? name[1] : ""}}) and lastname.contains({${name[2] ? name[2] : ""}})`;
		this.repository.get("patients", `take=15&filter=${filter}`).then(res => {
			let patients =
				res &&
				res.data.map(function(item) {
					return { value: item.id, label: item.fullname, age: item.age };
				});
			callback(patients);
		});
	};
	AddressOptions = (inputValue, callback) => {
		let filter = `type-eq-{${lookupTypeEnum.ADDRESS.value}}`;
		if (inputValue) filter = filter + ` and name.contains({${inputValue.toLowerCase()}})`;
		this.repository.get("lookups", `take=15&filter=${filter}`).then(res => {
			let addresses =
				res &&
				res.data.map(function(item) {
					return { value: item.id, label: item.name };
				});
			callback(addresses);
		});
	};

	generateFilterString = filters => {
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
					name.map(item => {
						operatorCondition.push(`(firstname.${filterMatchMode}({${item}}) or middlename.${filterMatchMode}({${item}}) or lastname.${filterMatchMode}({${item}}))`);
					});
				} else if (field === "patient.fullname") {
					// eslint-disable-next-line
					name.map(item => {
						operatorCondition.push(`(patient.firstname.${filterMatchMode}({${item}}) or patient.middlename.${filterMatchMode}({${item}}) or patient.lastname.${filterMatchMode}({${item}}))`);
					});
				} else operatorCondition.push(`${field}.${filterMatchMode}({${filterValue}})`);
			} else if (filterMatchMode === "eq")
				if (field === "invoiceNo") {
					operatorCondition.push(`id-${filterMatchMode}-{${filterValue}}`);
				} else if (field === "date") {
					operatorCondition.push(`date-${filterMatchMode}-{${this.formatDate(filterValue, "en-US")}}`);
				} else if (field === "addmissionDate") {
					operatorCondition.push(`addmissionDate-${filterMatchMode}-{${this.formatDate(filterValue, "en-US")}}`);
				} else if (field === "dischargeDate") {
					operatorCondition.push(`dischargeDate-${filterMatchMode}-{${this.formatDate(filterValue, "en-US")}}`);
				} else operatorCondition.push(`${field}-${filterMatchMode}-{${filterValue}}`);
		});
		return operatorCondition.join(" and ");
	};
	generateSortString = sortMeta => {
		let sortField = "";
		let sortOrder = "";
		let operatorCondition = [];
		// eslint-disable-next-line
		sortMeta.map((item, index) => {
			sortField = item.field;
			sortOrder = item.order === 1 ? "asc" : "desc";
			if (sortField === "fullname") {
				operatorCondition.push(`firstname ${sortOrder},middlename ${sortOrder},fathername ${sortOrder},lastname ${sortOrder}`);
			} else if (sortField === "patient.fullname") {
				operatorCondition.push(`patient.firstname ${sortOrder},patient.middlename ${sortOrder},patient.fathername ${sortOrder},patient.lastname ${sortOrder}`);
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
	formatFullcalendarDate = date => {
		let d = date ? new Date(date) : new Date();
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var year = d.getFullYear();
		return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
	};
	formatDate = (date, format) => {
		return new Date(date).toLocaleDateString(format ? format : "en-GB", { year: "numeric", month: "numeric", day: "numeric" });
	};
	formatTime = date => {
		let d = date ? new Date(date) : new Date();
		var hour = d.getHours();
		var minute = d.getMinutes();
		return `${hour}:${minute}`;
	};
	getMonthFromDate = date => {
		let d = date ? new Date(date) : new Date();
		let month = d.getMonth() + 1;
		return month < 10 ? `0${month}` : month;
	};
	getYearFromDate = date => {
		let d = date ? new Date(date) : new Date();
		return d.getFullYear();
	};
	getDayFromDate = date => {
		let d = date ? new Date(date) : new Date();
		return d.getDate();
	};
	formatCurrency = number => {
		return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(number);
	};
	formatAmount = number => {
		return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(number);
	};
	formatStringToDate = date => {
		var parts = date.split("/");
		var newDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
		return this.formatDate(newDate, "en-US");
	};
	onFilterChange = (event, dt) => {
		dt.filter(event.value, event.target.name, "eq");
		this.setState({ [event.target.id]: event.value });
	};
	stringShortning = (name, length) => {
		return name.length > length ? `${name.substr(0, length)}...` : name;
	};
}
