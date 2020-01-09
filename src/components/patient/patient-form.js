import React, { Component } from "react";
import InputField from "../shared/InputField";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import * as Constants from "../../common/constants";
import { lookupTypeEnum } from "../../common/enums";

const controller = "patients";
export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      age: "",
      addressId: null,
      mobile: "",
    },
    address: "",
    isValidationFired: false,
    validationErrors: {}
  })
  handleChange = (e, action) => {
    this.messages.clear();
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    if (action)
      fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label } : null;
    else
      fields[e.target.name] = e.target.value;

    this.setState({
      formFields: fields
    });
    if (isValidationFired)
      this.handleValidation();
  };

  handleSubmit = e => {
    const { id, firstname, middlename, lastname, age, addressId, mobile } = this.state.formFields;
    e.preventDefault();
    if (this.handleValidation()) {
      const patient = {
        id: id,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        age: age,
        mobile: mobile,
        addressId: addressId.value
      };

      this.repository.post(controller, patient, this.growl, this.messages)
        .then(res => {
          this.props.onHidePatientDialog && this.props.onHidePatientDialog();
          res && this.handleReset();
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

  saveAddress = () => {
    const { address } = this.state;
    let addressError = "";
    let isValid = true;
    if (!address) {
      isValid = false;
      addressError = "Address is required";
    }
    else
      isValid = true;

    this.setState({
      addressError: addressError
    });
    if (isValid) {
      const lookup = {
        name: address,
        type: lookupTypeEnum.ADDRESS.value
      };
      this.repository.post("lookups", lookup, this.growl, this.messages)
        .then(res => {
          this.setState({ address: "", addressDialogVisible: false });
        })
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.selectedPatient) {
  //     let selectedPatient = props.selectedPatient;
  //     return { formFields: selectedPatient }
  //   }
  //   else
  //     return null;
  // }
  render() {
    const { firstname, middlename, lastname, age, addressId, mobile } = this.state.formFields;
    const { addressDialogVisible, address, addressError } = this.state;
    let addressDialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
      <Button label="Reset" icon="pi pi-times" className="p-button-secondary" onClick={(e) => this.setState({ address: "", addressError: "" })} />
      <Button label="Save" icon="pi pi-check" onClick={this.saveAddress} />
    </div>;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <Growl ref={(el) => this.growl = el} />
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-4">
              <InputField name="firstname" title="Firstname" value={this.helper.toSentenceCase(firstname)} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            <div className="col-md-4">
              <InputField name="middlename" title="Middlename" value={this.helper.toSentenceCase(middlename)} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            <div className="col-md-4">
              <InputField name="lastname" title="Lastname" value={this.helper.toSentenceCase(lastname)} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
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
              <InputField name="addressId" title="Address" value={addressId} onChange={this.handleChange}
                onCreateOption={() => this.setState({ addressDialogVisible: true, address: address, addressError: "" })} {...this.state}
                controlType="select2" loadOptions={(e, callback) => this.helper.AddressOptions(e, callback, this.messages)} onInputChange={(e) => { e && this.setState({ address: e }) }} />
            </div>
          </div>
          <div className="modal-footer">
            <div className="row">
              <button type="reset" className="btn btn-default">Reset</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </form>
        <Dialog header={Constants.ADD_ADDRESS_TITLE} footer={addressDialogFooter} visible={addressDialogVisible} onHide={() => this.setState({ addressDialogVisible: false })} baseZIndex={0}>
          <div className="form-group">
            <div className="row">
              <div className="col-md-12">
                <InputText name="address" value={this.helper.toSentenceCase(address)} placeholder="Enter Address" onChange={(e) => this.setState({ address: e.target.value, addressError: "" })} className={addressError ? "error" : ""} />
                <span className="error">{addressError}</span>
              </div>
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}
