import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from 'primereact/multiselect';

export default class InputField extends Component {
  render() {
    const { icon, timeOnly, onFocus, title, name, value, onChange, onInput, hourFormat, disabled, validationErrors, filterBy, controlType, options, optionLabel, filter, suggestions, completeMethod, keyfilter, maxLength, readOnly, groupIcon, className, minLength, dataKey, minDate } = this.props;
    let errorClass = validationErrors[name] ? "error" : "";
    let preClassName = className ? className : "";
    if (controlType === "input-group-addon") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <div className="p-inputgroup">
            <InputText name={name} value={value} className={preClassName + " " + errorClass} placeholder={"Enter " + title} onChange={onChange} readOnly={readOnly} keyfilter={keyfilter} maxLength={maxLength} />
            <span className="p-inputgroup-addon">
              <i className={"fa " + groupIcon}></i>
            </span>
          </div>
          <span className="error">{validationErrors[name]}</span>
        </div>
      );
    }
    else if (controlType === "dropdown") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <Dropdown name={name} value={value} options={options} className={preClassName + " " + errorClass} placeholder={"Select " + title} optionLabel={optionLabel} onChange={onChange} filter={filter} filterPlaceholder={"Please enter 1 or more charactor to Search " + title} filterBy={filterBy} showClear={true} />
          <span className="error">{validationErrors[name]}</span>
        </div>
      );
    }
    else if (controlType === "datepicker") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <div className="p-inputgroup">
            <Calendar name={name} value={value} showIcon={true} className={preClassName} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} dateFormat="dd/mm/yy" readOnlyInput={true} timeOnly={timeOnly} hourFormat={hourFormat} icon={icon} dataKey={dataKey} minDate={minDate} />
            <span className="p-inputgroup-addon">
              <i className={"fa " + groupIcon}></i>
            </span>
          </div>
          <span className="error">{validationErrors[name]}</span>
        </div>
      );
    }
    else if (controlType === "autocomplete") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <AutoComplete name={name} value={value} className={preClassName + " " + errorClass} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} suggestions={suggestions} completeMethod={completeMethod} onFocus={onFocus} minLength={minLength} />
          <span className="error">{validationErrors[name]}</span>
        </div>
      );
    }
    else if (controlType === "multiselect") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <MultiSelect name={name} value={value} className={preClassName + " " + errorClass} options={options} onChange={onChange} filter={filter} placeholder={"Select " + title} />
          <span className="error">{validationErrors[name]}</span>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label className="control-label">{title}</label>
        <InputText name={name} value={value} className={preClassName + " " + errorClass} placeholder={"Enter " + title} onChange={onChange} onInput={onInput} disabled={disabled} keyfilter={keyfilter} maxLength={maxLength} onFocus={this.onFocus} autoFocus={this.autoFocus} />
        <span className="error">{validationErrors[name]}</span>
      </div>
    );
  }
}
