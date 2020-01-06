import React, { Component } from "react";
import { Panel } from 'primereact/panel';
import InputField from "../shared/InputField";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';

const title = "Patient Registration";

export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      firstname: "",
      middlename: "",
      lastname: "",
      age: "",
      address: "",
      mobile: ""
    },
    validationErrors: {}
  })
  handleChange = e => {
    this.messages.clear();
    const { isValidationFired, formFields } = this.state;
    let currentObj = e.target;
    let fields = formFields;
    fields[currentObj.name] = currentObj.value;
    this.setState({
      formFields: fields
    });
    if (isValidationFired)
      this.handleValidation();
  };

  handleSubmit = e => {
    const { firstname, middlename, lastname, age, address, mobile } = this.state.formFields;
    e.preventDefault();
    if (this.handleValidation()) {
      const patient = {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        age: age,
        mobile: mobile,
        address: address
      };

      this.repository.post("patients", patient, this.growl, this.messages)
        .then(res => {
          if (res)
            this.handleReset();
        })
    }
  };

  handleValidation = e => {
    const { firstname, middlename, lastname, age, address } = this.state.formFields;
    let errors = {};
    let isValid = true;
    if (!firstname) {
      isValid = false;
      errors.firstname = "Firstname is required";
    }
    if (!middlename) {
      isValid = false;
      errors.middlename = "Middlename is required";
    }
    if (!lastname) {
      isValid = false;
      errors.lastname = "Lastname is required";
    }
    if (!age) {
      isValid = false;
      errors.age = "Age is required";
    }
    if (!address) {
      isValid = false;
      errors.address = "Address is required";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true
    });
    return isValid;
  };

  handleReset = e => {
    this.messages.clear();
    this.setState(this.getInitialState());
  };

  suggestAddresses = e => {
    let query = e ? e.query.toLowerCase() : "";
    this.repository.get("patients", `filter=address.startswith({${query}})&fields=address`, this.messages)
      .then(res => {
        this.setState({ addressSuggestions: res && res.data.map(item => item.address) });
      })
  };

  render() {
    const { addressSuggestions } = this.state;
    const { firstname, middlename, lastname, age, address, mobile } = this.state.formFields;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <Growl ref={(el) => this.growl = el} />
        {/* // <div className="col-md-8">
      //  
      //   <div className="row">
      //     <Panel header={title} toggleable={true}>
      //        */}
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-4">
              <InputField name="firstname" title="Firstname" value={firstname} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            <div className="col-md-4">
              <InputField name="middlename" title="Middlename" value={middlename} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            <div className="col-md-4">
              <InputField name="lastname" title="Lastname" value={lastname} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <InputField name="age" title="Age" value={age} onChange={this.handleChange} {...this.state} keyfilter="pint" maxLength="2" />
            </div>
            <div className="col-md-6">
              <InputField name="mobile" title="Mobile" value={mobile} onChange={this.handleChange} {...this.state} keyfilter="pint" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <InputField name="address" title="Address" value={address} suggestions={addressSuggestions} completeMethod={this.suggestAddresses} onChange={this.handleChange} {...this.state} controlType="autocomplete" />
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
      </>
      //     </Panel>
      //   </div>
      // </div>
    );
  }
}
