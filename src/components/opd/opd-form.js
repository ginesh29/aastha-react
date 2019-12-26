import React from "react";
import InputField from "../shared/InputField";
import { initialState, baseApiUrl, caseTypes } from "../../common/constants";
import { Panel } from 'primereact/panel';
import axios from 'axios';
import { Growl } from 'primereact/growl';
let totalCharge = "";
const title = "Opd Entry";

export default class OpdForm extends React.Component {
  state = initialState;
  handleChange = e => {
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    fields[e.target.name] = e.target.value;
    fields.consultCharge = fields.consultCharge ? fields.consultCharge : 0;
    fields.usgCharge = fields.usgCharge ? fields.usgCharge : 0;
    fields.uptCharge = fields.uptCharge ? fields.uptCharge : 0;
    fields.injectionCharge = fields.injectionCharge ? fields.injectionCharge : 0;
    fields.otherCharge = fields.otherCharge ? fields.otherCharge : 0;
    this.setState({
      formFields: fields
    });
    let total = Number(fields.consultCharge) + Number(fields.usgCharge) + Number(fields.uptCharge) + Number(fields.injectionCharge) + Number(fields.otherCharge);
    totalCharge = total > 0 ? total : "";

    if (isValidationFired) this.handleValidation();
  };
  handleSubmit = e => {
    const { formFields } = this.state;
    e.preventDefault();
    if (this.handleValidation()) {
      const opd = {
        date: formFields.opdDate,
        caseType: formFields.caseType,
        patientId: formFields.patientId,
        consultCharge: formFields.consultCharge,
        usgCharge: formFields.usgCharge,
        uptCharge: formFields.uptCharge,
        injectionCharge: formFields.injectionCharge,
        otherCharge: formFields.otherCharge,
      };
      let form = e.target;
      axios.post(`${baseApiUrl}/opds`, opd)
        .then(res => {
          form.reset();
          this.setState(initialState);
          this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
        })
    }
  };
  handleValidation = e => {
    const { formFields } = this.state;
    let errors = {};
    let isValid = true;

    if (!formFields.opdDate) {
      isValid = false;
      errors.opdDate = "Select Opd Date";
    }
    if (!formFields.caseType) {
      isValid = false;
      errors.caseType = "Select Case Type";
    }
    if (!formFields.patientId) {
      isValid = false;
      errors.patientId = "Select Patient";
    }
    if (!formFields.consultCharge) {
      isValid = false;
      errors.consultCharge = "Consulting Charge is required";
    }
    if (!formFields.usgCharge) {
      isValid = false;
      errors.usgCharge = "USG Charge is required";
    }
    if (!formFields.uptCharge) {
      isValid = false;
      errors.uptCharge = "UPT Charge is required";
    }
    if (!formFields.injectionCharge) {
      isValid = false;
      errors.injectionCharge = "Injection Charge is required";
    }
    if (!formFields.otherCharge) {
      isValid = false;
      errors.otherCharge = "Other Charge is required";
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
  componentDidMount() {
    this.setState({ caseTypes: caseTypes });
    axios.get(`${baseApiUrl}/patients?fields=id,fullname`)
      .then(res => {
        let patientsRes = res.data.Result.data;
        let patients = patientsRes.map(function (item) {
          return { value: item["id"], label: item["fullname"] };
        })
        this.setState({ patientNames: patients })
      })
  }
  render() {
    const { formFields, patientNames } = this.state;
    return (
      <div className="col-md-8">
        <Growl ref={(el) => this.growl = el} />
        <div className="row">
          <Panel header={title} toggleable={true}>
            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
              <div className="row">
                <div className="col-md-4">
                  <InputField name="opdDate" title="Opd Date" value={formFields.opdDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <InputField name="caseType" title="Case Type" value={formFields.caseType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={caseTypes} />
                </div>
                <div className="col-md-9">
                  <InputField name="patientId" title="Patient" value={formFields.patientId} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNames} filter={true} filterPlaceholder="Select Car" filterBy="label,value" showClear={true} onFocus={this.handleChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <InputField name="consultCharge" title="Consulting Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
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
                  <InputField name="injectionCharge" title="Injection Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                </div>
                <div className="col-md-4">
                  <InputField name="otherCharge" title="Other Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                </div>
                <div className="col-md-4">
                  <InputField name="totalCharge" title="Total Charges" onChange={this.handleChange} {...this.state} readOnly="readOnly" controlType="input-group-addon" groupIcon="fa-inr" value={totalCharge} />
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
