import React from "react";
import InputField from "../shared/InputField";
import { caseTypeOptions } from "../../common/constants";
import { helper } from "../../common/helpers";
import { Growl } from "primereact/growl";
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import * as Constants from "../../common/constants";
import { repository } from "../../common/repository";
import PatientForm from "../patient/patient-form";

const controller = "opds";
export default class OpdForm extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }

  getInitialState = () => ({
    formFields: {
      opdDate: "",
      caseType: null,
      patientId: null,
      consultCharge: "",
      usgCharge: "",
      uptCharge: "",
      injectionCharge: "",
      otherCharge: "",
      totalCharge: ""
    },
    patientName: "",
    isValidationFired: false,
    validationErrors: {}
  });

  handleChange = (e, action) =>
  {
    this.messages.clear();
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    if (action)
      fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label } : null;
    else
      fields[e.target.name] = e.target.value;
    fields.consultCharge = fields.consultCharge ? fields.consultCharge : "";
    fields.usgCharge = fields.usgCharge ? fields.usgCharge : "";
    fields.uptCharge = fields.uptCharge ? fields.uptCharge : "";
    fields.injectionCharge = fields.injectionCharge ? fields.injectionCharge : "";
    fields.otherCharge = fields.otherCharge ? fields.otherCharge : "";

    let total = Number(fields.consultCharge) + Number(fields.usgCharge) + Number(fields.uptCharge) + Number(fields.injectionCharge) + Number(fields.otherCharge);
    fields.totalCharge = total > 0 ? total : "";
    this.setState({
      formFields: fields
    });
    console.log(fields)
    if (isValidationFired) this.handleValidation();
  };
  handleSubmit = e =>
  {
    const { opdDate, caseType, patientId, consultCharge, usgCharge, uptCharge, injectionCharge, otherCharge } = this.state.formFields;
    e.preventDefault();
    if (this.handleValidation()) {
      const opd = {
        date: this.helper.formatDate(opdDate),
        caseType: caseType,
        patientId: patientId.value,
        consultCharge: consultCharge,
        usgCharge: usgCharge,
        uptCharge: uptCharge,
        injectionCharge: injectionCharge,
        otherCharge: otherCharge
      };
      console.log(opd)
      this.repository.post(controller, opd, this.growl, this.messages).then(res =>
      {
        if (res)
          this.handleReset();
      })
    }
  };
  handleValidation = e =>
  {
    const { opdDate, caseType, patientId } = this.state.formFields;
    let errors = {};
    let isValid = true;

    if (!opdDate) {
      isValid = false;
      errors.opdDate = "Select Opd Date";
    }
    if (!caseType) {
      isValid = false;
      errors.caseType = "Select Case Type";
    }
    if (!patientId) {
      isValid = false;
      errors.patientId = "Select Patient";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true
    });
    return isValid;
  };

  handleReset = e =>
  {
    this.messages.clear();
    this.setState(this.getInitialState());
  };

  render()
  {
    const { opdDate, caseType, patientId, consultCharge, usgCharge, uptCharge, injectionCharge, otherCharge, totalCharge } = this.state.formFields;
    const { patientDialogVisible } = this.state;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <Growl ref={(el) => this.growl = el} />
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-4">
              <InputField name="opdDate" title="Opd Date" value={opdDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField name="caseType" title="Case Type" value={caseType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={caseTypeOptions} />
            </div>
            <div className="col-md-8">
              <InputField name="patientId" value={patientId} title="Patient" onChange={this.handleChange} {...this.state}
                onCreateOption={() => this.setState({ patientDialogVisible: true })} onInputChange={(e) => { e && this.setState({ patientName: e }) }}
                controlType="select2" loadOptions={(e, callback) => this.helper.PatientOptions(e, callback, this.messages)} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField name="consultCharge" title="Consulting Charges" value={consultCharge} onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
            </div>
            <div className="col-md-4">
              <InputField name="usgCharge" title="USG Charges" value={usgCharge} onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
            </div>
            <div className="col-md-4">
              <InputField name="uptCharge" title="UPT Charges" value={uptCharge} onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField name="injectionCharge" title="Injection Charges" value={injectionCharge} onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
            </div>
            <div className="col-md-4">
              <InputField name="otherCharge" title="Other Charges" value={otherCharge} onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
            </div>
            <div className="col-md-4">
              <InputField name="totalCharge" title="Total Charges" value={totalCharge} onChange={this.handleChange} {...this.state} readOnly="readOnly" controlType="input-group-addon" groupIcon="fa-inr" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="reset" className="btn btn-default">Reset</button>
            <button type="submit" className="btn btn-info">Save changes</button>
          </div>
        </form>
        <Dialog header={Constants.PATIENT_REGISTRATION_TITLE} visible={patientDialogVisible} onHide={() => this.setState({ patientDialogVisible: false })} baseZIndex={50}>
          <PatientForm onHidePatientDialog={() => this.setState({ patientDialogVisible: false })} {...this.state} />
        </Dialog>
      </>
    );
  }
}
