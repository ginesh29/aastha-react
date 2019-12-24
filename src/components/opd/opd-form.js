import React from 'react';
import InputField from '../shared/InputField';
const initialState = {
    formFields: {},
    validationError: {},
    isValidationFired: false
}
const caseTypes = [
    { id: 1, value: 'Old' },
    { id: 2, value: 'New' }
];
const patientNames = [
    { id: 1, value: 'Kamiya Vipul Patel' },
    { id: 2, value: 'New' }
];

let totalCharge;
export default class OpdForm extends React.Component {
    state = initialState
    handleChange = (e) => {
        let fields = this.state.formFields;
        fields[e.target.name] = e.target.value
        fields.consultingCharge = fields.consultingCharge ? fields.consultingCharge : 0;
        fields.usgCharge = fields.usgCharge ? fields.usgCharge : 0;
        fields.uptCharge = fields.uptCharge ? fields.uptCharge : 0;
        fields.injCharge = fields.injCharge ? fields.injCharge : 0;
        fields.otherCharge = fields.otherCharge ? fields.otherCharge : 0;
        this.setState({
            formFields: fields
        });
        let total = Number(fields.consultingCharge) + Number(fields.usgCharge) + Number(fields.uptCharge) + Number(fields.injCharge) + Number(fields.otherCharge);;
        totalCharge = total > 0 ? total : "";

        if (this.state.isValidationFired)
            this.handleValidation();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            e.target.reset();
            this.setState(initialState);
            alert("Form submitted");
        }
    }
    handleValidation = (e) => {
        let errors = {};
        let formFields = this.state.formFields;
        let isValid = true;

        if (!formFields.opdDate) {
            isValid = false;
            errors.opdDate = "Select Opd Date"
        }
        if (!formFields.caseType) {
            isValid = false;
            errors.caseType = "Select Case Type"
        }
        if (!formFields.patientName) {
            isValid = false;
            errors.patientName = "Select Patient Name"
        }
        if (!formFields.consultingCharge) {
            isValid = false;
            errors.consultingCharge = "Consulting Charge is required"
        }
        if (!formFields.usgCharge) {
            isValid = false;
            errors.usgCharge = "USG Charge is required"
        }
        if (!formFields.uptCharge) {
            isValid = false;
            errors.uptCharge = "UPT Charge is required"
        }
        if (!formFields.injCharge) {
            isValid = false;
            errors.injCharge = "Injection Charge is required"
        }
        if (!formFields.otherCharge) {
            isValid = false;
            errors.otherCharge = "Other Charge is required"
        }
        this.setState({
            validationError: errors,
            isValidationFired: true
        })
        return isValid;
    }
    handleReset = (e) => {
        this.setState(initialState);
    }
    render() {
        return (
            <div className="col-md-6">
                <div className="row">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="panel-title">
                                OPD Entry
                            </div>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                                <div className="row">
                                    <div className="col-md-4 selectContainer">
                                        <InputField name="opdDate" title="Opd Date" value={this.state.formFields.opdDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <InputField name="caseType" title="Case Type" value={this.state.formFields.caseType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={caseTypes} optionLabel="value" />
                                    </div>
                                    <div className="col-md-9">
                                        <InputField name="patientName" title="Patient Name" value={this.state.formFields.patientName} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNames} optionLabel="value" filter={true} filterBy="id,value" showClear={true} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="consultingCharge" title="Consulting Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="usgCharge" title="USG Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="uptCharge" title="UPT Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="injCharge" title="Injection Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="otherCharge" title="Other Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="totalCharge" title="Total Charges" onChange={this.handleChange} {...this.state} readOnly="readOnly" controlType="input-group-addon" groupIcon="fa-inr" value={totalCharge} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="reset" className="btn btn-default">Reset</button>
                                    <button type="submit" className="btn btn-info">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

