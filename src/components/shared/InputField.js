import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';

export default class InputField extends Component {
    render() {
        let props = this.props;
        let errorClass = props.validationError[props.name] ? "error" : "";
        if (props.controlType === 'input-group-addon') {
            return (
                <div className="form-group">
                    <label className="control-label">{props.title}</label>
                    <div className="p-col-12 p-md-4">
                        <div className="p-inputgroup">
                            <InputText name={props.name} value={props.value} className={errorClass} placeholder={"Enter " + props.title} onChange={props.onChange} readOnly={props.readOnly} keyfilter={props.keyfilter} maxLength={props.maxLength} />
                            <span className="p-inputgroup-addon"><i className={"fa " + props.groupIcon}></i></span>
                        </div>
                    </div>
                    <span className="error">{props.validationError[props.name]}</span>
                </div>
            );
        }
        else if (props.controlType === 'dropdown') {
            return (
                <div className="form-group">
                    <label className="control-label">{props.title}</label>
                    <Dropdown name={props.name} value={props.value} options={props.options} className={errorClass} panelClassName="error" placeholder={"Select " + props.title} optionLabel={props.optionLabel} onChange={props.onChange} filter={props.filter} filterPlaceholder={"Search " + props.title} filterBy={props.filterBy} showClear={props.showClear}/>
                    <span className="error">{props.validationError[props.name]}</span>
                </div>
            )
        }
        else if (props.controlType === 'datepicker') {
            return (
                <div className="form-group">
                    <label className="control-label">{props.title}</label>
                    <Calendar name={props.name} value={props.value} showIcon={true} inputClassName={errorClass} placeholder={"Enter " + props.title} onChange={props.onChange} dateFormat="dd/mm/yy" readOnlyInput={true} />
                    <span className="error">{props.validationError[props.name]}</span>
                </div>
            )
        }
        else if (props.controlType === 'autocomplete') {
            return (
                <div className="form-group">
                    <label className="control-label">{props.title}</label>
                    <AutoComplete name={props.name} value={props.value} inputClassName={errorClass} placeholder={"Enter " + props.title} onChange={props.onChange} suggestions={props.suggestions} completeMethod={props.completeMethod} />
                    <span className="error">{props.validationError[props.name]}</span>
                </div>
            )
        }
        return (
            <div className="form-group">
                <label className="control-label">{props.title}</label>
                <InputText name={props.name} value={props.value} className={errorClass} placeholder={"Enter " + props.title} onChange={props.onChange} disabled={props.disabled} keyfilter={props.keyfilter} maxLength={props.maxLength} />
                <span className="error">{props.validationError[props.name]}</span>
            </div>
        );
    }
}