import React, { Component } from "react";
import InputField from "../shared/InputField";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';

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
      addressId: null,
      mobile: ""
    },
    isValidationFired: false,
    validationErrors: {}
  })
  handleChange = (e, action) => {
    this.messages.clear();
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    if (action)
      fields[action.name] = action !== "clear" ? e && e.value : null;
    else
      fields[e.target.name] = e.target.value;

    this.setState({
      formFields: fields
    });
    if (isValidationFired)
      this.handleValidation();
  };

  handleSubmit = e => {
    const { firstname, middlename, lastname, age, addressId, mobile } = this.state.formFields;
    e.preventDefault();
    if (this.handleValidation()) {
      const patient = {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        age: age,
        mobile: mobile,
        addressId: addressId
      };

      this.repository.post("patients", patient, this.growl, this.messages)
        .then(res => {
          if (res)
            this.handleReset();
        })
    }
  };

  handleValidation = e => {
    const { firstname, middlename, lastname, age, addressId } = this.state.formFields;
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
    if (!addressId) {
      isValid = false;
      errors.addressId = "Address is required";
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

  onCreateAddress = () => {
    this.setState({ editDialogVisible: true })
  }
  render() {
    const { firstname, middlename, lastname, age, addressId, mobile } = this.state.formFields;
    const { editDialogVisible } = this.state;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <Growl ref={(el) => this.growl = el} />
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
              <InputField name="addressId" title="Address" value={addressId} onChange={this.handleChange} onCreateOption={this.onCreateAddress} {...this.state} controlType="select2" loadOptions={(e, callback) => this.helper.AddressOptions(e, callback, this.messages)} />
            </div>
          </div>
          <div className="modal-footer">
            <div className="row">
              <button type="reset" className="btn btn-default">Reset</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </form>
        <Dialog header="Add Address" visible={editDialogVisible} onHide={() => this.setState({ editDialogVisible: false })}>
          The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding.
          His beloved son Michael has just come home from the war, but does not intend to become part of his father's business.
          Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family,
          kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.
        </Dialog>
      </>
    );
  }
}
