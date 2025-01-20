import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button } from "primereact/button";
import { HUNDRED_YEAR_RANGE } from "../../common/constants";

export default class InputField extends Component {
  render() {
    const {
      type,
      icon,
      timeOnly,
      onFocus,
      title,
      name,
      value,
      onChange,
      onBlur,
      onInput,
      hourFormat,
      disabled,
      validationErrors,
      filterBy,
      controlType,
      options,
      optionLabel,
      filter,
      suggestions,
      completeMethod,
      keyfilter,
      maxLength,
      readOnly,
      groupIcon,
      className,
      minLength,
      dataKey,
      minDate,
      ref,
      loadOptions,
      onCreateOption,
      onInputChange,
      elRef,
      onInputButtonClick,
      tabIndex,
      autoFocus,
      onKeyDown,
      defaultOptions,
      showTime,
    } = this.props;
    let errorClass = validationErrors[name] ? "error" : "";
    let propClassName = className ? className : "";
    let finalClassName = `${propClassName} ${errorClass}`;
    return (
      <div>
        <label>{title}</label>
        {controlType === "input-group-addon" && (
          <div className="p-inputgroup">
            <InputText
              type={type}
              name={name}
              value={value}
              className={finalClassName}
              placeholder={!readOnly ? "Enter " + title : ""}
              onChange={onChange}
              readOnly={readOnly}
              keyfilter={keyfilter}
              maxLength={maxLength}
              ref={ref}
              tabIndex={tabIndex}
              autoFocus={autoFocus}
              onKeyDown={onKeyDown}
            />
            <Button
              icon={"fa " + groupIcon}
              className="p-button-outlined"
              onClick={onInputButtonClick}
              type="button"
            />
          </div>
        )}
        {controlType === "dropdown" && (
          <Dropdown
            name={name}
            value={value}
            options={options}
            className={finalClassName}
            placeholder={"Select " + title}
            optionLabel={optionLabel}
            onChange={onChange}
            filter={filter}
            filterPlaceholder={
              "Please enter 1 or more charactor to Search " + title
            }
            filterBy={filterBy}
            showClear={true}
            ref={elRef}
            tabIndex={tabIndex}
          />
        )}
        {controlType === "select2" && (
          <AsyncCreatableSelect
            defaultOptions={defaultOptions}
            name={name}
            value={value}
            onCreateOption={onCreateOption}
            createOptionPosition="first"
            loadOptions={loadOptions}
            className={`${finalClassName} p-select2`}
            isClearable={true}
            onChange={onChange}
            onInputChange={onInputChange}
            placeholder={"Select " + title}
            tabIndex={tabIndex}
          />
        )}
        {controlType === "datepicker" && (
          <div className="p-inputgroup">
            <Calendar
              name={name}
              value={value}
              showIcon={true}
              className={propClassName}
              inputClassName={errorClass}
              placeholder={"Enter " + title}
              onChange={onChange}
              onBlur={onBlur}
              dateFormat="dd/mm/yy"
              timeOnly={timeOnly}
              hourFormat={hourFormat}
              icon={icon}
              dataKey={dataKey}
              minDate={minDate}
              ref={ref}
              disabled={disabled}
              readOnly={readOnly}
              showButtonBar={true}
              tabIndex={tabIndex}
              dropdownMode="select"
              showTime={showTime}
              monthNavigator={true}
              yearNavigator={true}
              yearRange={HUNDRED_YEAR_RANGE}
              readOnlyInput={true}
            />
            <span className="p-inputgroup-addon">
              <i className={"fa " + groupIcon}></i>
            </span>
          </div>
        )}
        {controlType === "autocomplete" && (
          <AutoComplete
            name={name}
            value={value}
            className={finalClassName}
            inputClassName={errorClass}
            placeholder={"Enter " + title}
            onChange={onChange}
            suggestions={suggestions}
            completeMethod={completeMethod}
            onFocus={onFocus}
            minLength={minLength}
            ref={ref}
            tabIndex={tabIndex}
          />
        )}
        {controlType === "multiselect" && (
          <MultiSelect
            name={name}
            value={value}
            className={finalClassName}
            options={options}
            onChange={onChange}
            filter={filter}
            placeholder={"Select " + title}
            tabIndex={tabIndex}
          />
        )}
        {controlType === "textarea" && (
          <InputTextarea
            autoResize={true}
            name={name}
            value={value}
            className={finalClassName}
            placeholder={"Enter " + title}
            onChange={onChange}
            onInput={onInput}
            disabled={disabled}
            keyfilter={keyfilter}
            maxLength={maxLength}
            onFocus={this.onFocus}
            autoFocus={this.autoFocus}
            ref={ref}
            tabIndex={tabIndex}
          />
        )}
        {!controlType && (
          <InputText
            type={type}
            name={name}
            value={value}
            className={finalClassName}
            placeholder={"Enter " + title}
            onChange={onChange}
            onInput={onInput}
            disabled={disabled}
            keyfilter={keyfilter}
            maxLength={maxLength}
            onFocus={this.onFocus}
            autoFocus={autoFocus}
            ref={ref}
            autoComplete="off"
            tabIndex={tabIndex}
          />
        )}
        {validationErrors[name] && (
          <span className="error">
            <i className="fa fa-info-circle"></i> {validationErrors[name]}
          </span>
        )}
      </div>
    );
  }
}
