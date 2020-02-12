import React, { Component } from "react";
import InputField from "../shared/InputField";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import * as Constants from "../../common/constants";
import { lookupTypeEnum } from "../../common/enums";
import $ from "jquery";

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
      id: null,
      firstname: "",
      middlename: "",
      fathername: null,
      lastname: "",
      age: "",
      address: null,
      mobile: "",
    },
    addressText: "",
    isValidationFired: false,
    validationErrors: {},
    isExist: false
  })
  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    $("#errors").remove();
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
    e.preventDefault();
    const { id, firstname, middlename, fathername, lastname, age, address, mobile } = this.state.formFields;
    const { hideEditDialog, savePatient, includeProperties } = this.props;
    if (this.handleValidation()) {
      const patient = {
        id: id,
        firstname: firstname,
        middlename: middlename,
        fathername: fathername,
        lastname: lastname,
        age: age,
        mobile: mobile,
        addressId: address.value
      };
      this.repository.post(`${controller}?includeProperties=${includeProperties}`, patient)
        .then(res => {
          if (res && !res.errors) {
            hideEditDialog && hideEditDialog();
            savePatient && savePatient(res, patient.id);
            !hideEditDialog && this.handleReset();
          }
          res.errors && this.setState({
            isExist: true
          })
        })
    }
  }
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
    this.setState(this.getInitialState());
  };

  saveAddress = () => {
    const { addressText } = this.state;
    let addressError = "";
    let isValid = true;
    if (!addressText) {
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
        name: addressText,
        type: lookupTypeEnum.ADDRESS.value
      };
      this.repository.post("lookups", lookup)
        .then(res => {
          res && this.setState({ addressText: "", addressDialogVisible: false });
        })
    }
  }
  componentDidMount = () => {
    $("#errors").remove();
    const { selectedPatient } = this.props;
    if (selectedPatient)
      this.setState({
        formFields: selectedPatient
      })
  }
  render() {
    const { id, firstname, middlename, fathername, lastname, age, address, mobile } = this.state.formFields;
    const { addressDialogVisible, addressText, addressError, isExist } = this.state;
    let addressDialogFooter = <div className="ui-dialog-buttonpane p-clearfix">
      <Button label="Close" icon="pi pi-times" className="p-button-secondary" onClick={(e) => this.setState({ addressDialogVisible: false })} />
      <Button label="Save" icon="pi pi-check" onClick={this.saveAddress} />
    </div>;
    return (
      <>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col">
              <InputField name="firstname" title="Firstname" value={this.helper.toSentenceCase(firstname) || ""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            <div className="col">
              <InputField name="middlename" title="Middlename" value={this.helper.toSentenceCase(middlename) || ""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
            {
              (isExist || id) &&
              <div className="col">
                <InputField name="fathername" title="Fathername" value={this.helper.toSentenceCase(fathername) || ""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
              </div>
            }

            <div className="col">
              <InputField name="lastname" title="Lastname" value={this.helper.toSentenceCase(lastname) || ""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <InputField name="age" title="Age" value={age || ""} onChange={this.handleChange} {...this.state} keyfilter="pint" maxLength="2" />
            </div>
            <div className="col-md-6">
              <InputField name="mobile" title="Mobile" value={mobile || ""} onChange={this.handleChange} {...this.state} keyfilter="pint" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <InputField name="address" title="Address" value={address || ""} onChange={this.handleChange}
                onCreateOption={() => this.setState({ addressDialogVisible: true, addressText: addressText, addressError: "" })} {...this.state}
                controlType="select2" loadOptions={(e, callback) => this.helper.AddressOptions(e, callback)} onInputChange={(e) => { e && this.setState({ addressText: e }) }} />
            </div>
          </div>
          <div className="modal-footer">
            {
              !id &&
              <button type="reset" className="btn btn-secondary">Reset</button>
            }
            <button type="submit" className="btn btn-info">Save changes</button>
          </div>
        </form>
        <Dialog header={Constants.ADD_ADDRESS_TITLE} footer={addressDialogFooter} visible={addressDialogVisible} onHide={() => this.setState({ addressDialogVisible: false })} baseZIndex={0}>
          {
            addressText &&
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <InputText name="addressText" value={this.helper.toSentenceCase(addressText)} placeholder="Enter Address" onChange={(e) => addressText && this.setState({ addressText: e.target.value, addressError: "" })} className={addressError ? "error" : ""} style={{ width: '100%' }} />
                  <span className="error">{addressError}</span>
                </div>
              </div>
            </div>
          }
        </Dialog>
      </>
    );
  }
}