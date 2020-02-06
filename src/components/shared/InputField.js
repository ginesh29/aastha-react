import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import AsyncCreatableSelect from 'react-select/async-creatable';

export default class InputField extends Component {
  render() {
    const { icon, timeOnly, onFocus, title, name, value, onChange, onInput, hourFormat, disabled, validationErrors, filterBy, controlType, options, optionLabel, filter, suggestions, completeMethod, keyfilter, maxLength, readOnly, groupIcon, className, minLength, dataKey, minDate, ref, loadOptions, onCreateOption, onInputChange } = this.props;
    let errorClass = validationErrors[name] ? "error" : "";
    let propClassName = className ? className : "";
    let finalClassName = `${propClassName} ${errorClass}`;
    return (
      <>
        <label>{title}</label>
        {
          controlType === "input-group-addon" &&
          <div className="p-inputgroup">
            <InputText name={name} value={value} className={finalClassName} placeholder={!readOnly ? "Enter " + title : ""} onChange={onChange} readOnly={readOnly} keyfilter={keyfilter} maxLength={maxLength} ref={ref} />
            <span className="p-inputgroup-addon">
              <i className={"fa " + groupIcon}></i>
            </span>
          </div>
        }
        {
          controlType === "dropdown" &&
          <Dropdown name={name} value={value} options={options} className={finalClassName} placeholder={"Select " + title} optionLabel={optionLabel} onChange={onChange} filter={filter} filterPlaceholder={"Please enter 1 or more charactor to Search " + title} filterBy={filterBy} showClear={true} ref={ref} />
        }
        {
          controlType === "select2" &&
          <AsyncCreatableSelect defaultOptions name={name} value={value} onCreateOption={onCreateOption} createOptionPosition="first" loadOptions={loadOptions} className={finalClassName} isClearable={true} isLoading={true} onChange={onChange} onInputChange={onInputChange} />
        }
        {
          controlType === "datepicker" &&
          <div className="p-inputgroup">
            <Calendar name={name} value={value} showIcon={true} className={propClassName} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} dateFormat="dd/mm/yy" readOnlyInput={true} timeOnly={timeOnly} hourFormat={hourFormat} icon={icon} dataKey={dataKey} minDate={minDate} ref={ref} disabled={disabled} readOnly={readOnly} />
            <span className="p-inputgroup-addon">
              <i className={"fa " + groupIcon}></i>
            </span>
          </div>
        }
        {
          controlType === "autocomplete" &&
          <AutoComplete name={name} value={value} className={finalClassName} inputClassName={errorClass} placeholder={"Enter " + title} onChange={onChange} suggestions={suggestions} completeMethod={completeMethod} onFocus={onFocus} minLength={minLength} ref={ref} />
        }
        {
          controlType === "multiselect" &&
          <MultiSelect name={name} value={value} className={finalClassName} options={options} onChange={onChange} filter={filter} placeholder={"Select " + title} />
        }
        {
          controlType === "textarea" &&
          <InputTextarea autoResize={true} name={name} value={value} className={finalClassName} placeholder={"Enter " + title} onChange={onChange} onInput={onInput} disabled={disabled} keyfilter={keyfilter} maxLength={maxLength} onFocus={this.onFocus} autoFocus={this.autoFocus} ref={ref} />
        }
        {
          !controlType &&
          <InputText name={name} value={value} className={finalClassName} placeholder={"Enter " + title} onChange={onChange} onInput={onInput} disabled={disabled} keyfilter={keyfilter} maxLength={maxLength} onFocus={this.onFocus} autoFocus={this.autoFocus} ref={ref} />
        }
        <span className="error">{validationErrors[name]}</span>
      </>
    )
  }
}
