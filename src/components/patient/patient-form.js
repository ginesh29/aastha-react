import React, { Component } from "react";
import { Panel } from 'primereact/panel';
import InputField from "../shared/InputField";
import { initialState, baseApiUrl } from "../../common/constants";
import { toSentenceCase } from "../../common/helpers";
import axios from 'axios';
import { Growl } from 'primereact/growl';

const title = "Patient Registration";
export default class PatientForm extends Component {
  state = initialState;
  handleChange = e => {
    const { isValidationFired, formFields } = this.state;
    let currentObj = e.target;
    let fields = formFields;
    fields[currentObj.name] = currentObj.value;
    if (currentObj.className && currentObj.className.includes("SentenceCase"))
      toSentenceCase(e);
    this.setState({
      formFields: fields
    });
    if (isValidationFired)
      this.handleValidation();
  };
  handleSubmit = e => {
    const { formFields } = this.state;
    e.preventDefault();
    if (this.handleValidation()) {
      const patient = {
        firstname: formFields.Firstname,
        middlename: formFields.middlename,
        lastname: formFields.lastname,
        age: formFields.age,
        mobile: formFields.mobile,
        address: formFields.address
      };
      console.log(patient)
      let form = e.target;
      axios.post(`${baseApiUrl}/patients`, patient)
        .then(res => {
          form.reset();
          this.setState(initialState);
          this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
        })
        .catch(error => {
          this.setState({
            validationError: error.response.data.ValidationSummary
          });
        });
    }
  };
  handleValidation = e => {
    const { formFields } = this.state;
    let errors = {};
    let isValid = true;
    if (!formFields.firstname) {
      isValid = false;
      errors.firstname = "Firstname is required";
    }
    if (!formFields.middlename) {
      isValid = false;
      errors.middlename = "Middlename is required";
    }
    if (!formFields.lastname) {
      isValid = false;
      errors.lastname = "Lastname is required";
    }
    if (!formFields.age) {
      isValid = false;
      errors.age = "Age is required";
    }
    if (!formFields.mobile) {
      isValid = false;
      errors.mobile = "Mobile is required";
    }
    if (!formFields.address) {
      isValid = false;
      errors.address = "Address is required";
    }
    this.setState({
      validationError: errors,
      isValidationFired: true
    });
    return isValid;
  };
  handleReset = e => {
    this.setState(initialState);
  };
  suggestAddresses = e => {
    let query = e.query.toLowerCase();
    axios.get(`${baseApiUrl}/patients?filter=Address.startswith({${query}})&fields=Address`)
      .then(res => {
        let data = res.data.Result.data;
        let addresses = data.map(function (item) {
          return item.address;
        });
        this.addresses = addresses;
        let results = this.addresses.filter(address => {
          return address.toLowerCase().startsWith(query);
        });
        this.setState({ addressSuggestions: results });
      })
  };
  render() {
    const { validationErrors, formFields, addressSuggestions } = this.state;
    return (

      <div className="col-md-8">
        <Growl ref={(el) => this.growl = el} />
        <div className="row">
          <Panel header={title} toggleable={true}>
            <div className="alert alert-danger" role="alert" style={{ display: validationErrors ? "" : "none" }}>
              <ol>
                {validationErrors && Object.keys(validationErrors).map((keyName, i) => (
                  <li className="travelcompany-input" key={i}>
                    key: {i} Name: {validationErrors[keyName]}
                  </li>
                ))}
              </ol>
            </div>
            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
              <div className="row">
                <div className="col-md-4">
                  <InputField name="firstname" title="Firstname" className="SentenceCase" onChange={this.handleChange} {...this.state} />
                </div>
                <div className="col-md-4">
                  <InputField name="middlename" title="Middlename" className="SentenceCase" onChange={this.handleChange} {...this.state} />
                </div>
                <div className="col-md-4">
                  <InputField name="lastname" title="Lastname" className="SentenceCase" onChange={this.handleChange} {...this.state} />
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
                  <InputField name="address" title="Address" value={formFields.address} suggestions={addressSuggestions} completeMethod={this.suggestAddresses} onChange={this.handleChange} {...this.state} controlType="autocomplete" minLength="0" onFocus={this.handleFocus} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="reset" className="btn btn-default">
                  Reset
                  </button>
                <button type="submit" className="btn btn-info">
                  Save changes
                  </button>
              </div>
            </form>

          </Panel>
        </div>
      </div>
    );
  }
}
