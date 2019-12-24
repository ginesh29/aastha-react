import React, { Component } from 'react';
import InputField from '../shared/InputField';
const initialState = {
    formFields: {},
    validationError: {},
    isValidationFired: false
}
export default class PatientForm extends Component {
    state = initialState
    handleChange = (e) => {
        let fields = this.state.formFields;
        fields[e.target.name] = e.target.value
        this.setState({
            formFields: fields
        });
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
        if (!formFields.firstname) {
            isValid = false;
            errors.firstname = "Firstname is required"
        }
        if (!formFields.middlename) {
            isValid = false;
            errors.middlename = "Middlename is required"
        }
        if (!formFields.lastname) {
            isValid = false;
            errors.lastname = "Lastname is required"
        }
        if (!formFields.age) {
            isValid = false;
            errors.age = "Age is required"
        }
        if (!formFields.mobile) {
            isValid = false;
            errors.mobile = "Mobile is required"
        }
        if (!formFields.address) {
            isValid = false;
            errors.address = "Address is required"
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
    suggestAddresses = (e) => {
        this.brands = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo'];
        let results = this.brands.filter((brand) => {
            return brand.toLowerCase().startsWith(e.query.toLowerCase());
        });

        this.setState({ addressSuggestions: results });
    }
    render() {
        return (
            <div className="col-md-6">
                <div className="row">
                    <div className="panel">
                        <div className="panel-heading">
                            <div className="panel-title">
                                Patient Registration
                            </div>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={this.handleSubmit} onReset={this.handleReset} autoComplete="disabled">
                                
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="firstname" title="Firstname" onChange={this.handleChange} {...this.state} />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="middlename" title="Middlename" onChange={this.handleChange} {...this.state} />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="lastname" title="Lastname" onChange={this.handleChange} {...this.state} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputField name="age" title="Age" onChange={this.handleChange} {...this.state} keyfilter="pint" maxLength="2" />
                                    </div>
                                    <div className="col-md-6">
                                        <InputField name="mobile" title="Mobile" onChange={this.handleChange} {...this.state} keyfilter="pint" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InputField name="address" title="Address" value={this.state.formFields.address} suggestions={this.state.addressSuggestions} completeMethod={this.suggestAddresses} onChange={this.handleChange} {...this.state} controlType="autocomplete" />
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
        );
    }
}