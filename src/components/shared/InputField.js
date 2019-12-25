import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";

export default class InputField extends Component {
  render() {
    const { title, name, value, onChange, onInput, disabled, validationError, showClear, filterBy, controlType, options, optionLabel, filter, suggestions, completeMethod, keyfilter, maxLength, readOnly, groupIcon, className } = this.props;
    let errorClass = validationError[name] ? "error" : "";

    if (controlType === "input-group-addon") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <div className="p-col-12 p-md-4">
            <div className="p-inputgroup">
              <InputText name={name} value={value} className={className + " " + errorClass} placeholder={"Enter " + title} onChange={onChange} readOnly={readOnly} keyfilter={keyfilter} maxLength={maxLength} />
              <span className="p-inputgroup-addon">
                <i className={"fa " + groupIcon}></i>
              </span>
            </div>
          </div>
          <span className="error">{validationError[name]}</span>
        </div>
      );
    } else if (controlType === "dropdown") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <Dropdown name={name} value={value} options={options} className={className + " " + errorClass} panelClassName="error" placeholder={"Select " + title} optionLabel={optionLabel} onChange={onChange} filter={filter} filterPlaceholder={"Search " + title} filterBy={filterBy} showClear={showClear} />
          <span className="error">{validationError[name]}</span>
        </div>
      );
    } else if (controlType === "datepicker") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <Calendar name={name} value={value} showIcon={true} className={className} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} dateFormat="dd/mm/yy" readOnlyInput={true} />
          <span className="error">{validationError[name]}</span>
        </div>
      );
    } else if (controlType === "autocomplete") {
      return (
        <div className="form-group">
          <label className="control-label">{title}</label>
          <AutoComplete name={name} value={value} className={className + " " + errorClass} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} suggestions={suggestions} completeMethod={completeMethod} />
          <span className="error">{validationError[name]}</span>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label className="control-label">{title}</label>
        <InputText name={name} value={value} className={className + " " + errorClass} placeholder={"Enter " + title} onChange={onChange} onInput={onInput} disabled={disabled} keyfilter={keyfilter} maxLength={maxLength} />
        <span className="error">{validationError[name]}</span>
      </div>
    );
  }
}