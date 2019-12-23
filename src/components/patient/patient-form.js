import React, { Component } from 'react';
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
        console.log(this.state);
    }
    render() {
        return (
            <div className="panel" data-collapsed="0">
                <div className="panel-heading">
                    <div className="panel-title">
                        Patient Registration
                        <span className="tools pull-right">
                            <a href="{}"><i className="fa fa-chevron-down" /></a>
                            <a href="{}"><i className="fa fa-cog" /></a>
                            <a href="{}"><i className="fa fa-times" /></a>
                        </span>
                    </div>
                </div>
                <div className="panel-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Firstname</label>
                                    <input name="firstname" className="form-control Capitalize" placeholder="Enter Firstname" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.firstname}</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Middlename</label>
                                    <input name="middlename" className="form-control Capitalize" placeholder="Enter Middlename" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.middlename}</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Lastname</label>
                                    <input name="lastname" className="form-control Capitalize" placeholder="Enter Lastname" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.lastname}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Age</label>
                                    <input name="age" className="form-control" placeholder="Enter Age" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.age}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Mobile</label>
                                    <input name="mobile" className="form-control" placeholder="Enter Mobile" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.mobile}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="field-3" className="control-label">Address</label>
                                    <input name="address" className="form-control typeahead Capitalize" placeholder="Enter Address" type="text" onChange={this.handleChange} />
                                    <span className="error">{this.state.validationError.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="reset" className="btn btn-default" onClick={this.handleReset}>Reset</button>
                            <button type="submit" className="btn btn-info">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}