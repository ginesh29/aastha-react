import React from "react";
import InputField from "../shared/InputField";
import { baseApiUrl, caseTypeOptions } from "../../common/constants";
import { Panel } from "primereact/panel";
import axios from "axios";
import { Growl } from "primereact/growl";
import { Messages } from 'primereact/messages';

const title = "Opd Entry";

export default class OpdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    formFields: { opdDate: "", caseType: "", patientId: null, consultCharge: "", usgCharge: "", uptCharge: "", injectionCharge: "", otherCharge: "", totalCharge: "" },
    validationErrors: {}
  });

  handleChange = e => {
    this.messages.clear();
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
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
    if (isValidationFired) this.handleValidation();
  };
  handleSubmit = e => {
    const { opdDate, caseType, patientId, consultCharge, usgCharge, uptCharge, injectionCharge, otherCharge } = this.state.formFields;
    e.preventDefault();
    if (this.handleValidation()) {
      const opd = {
        date: opdDate,
        caseType: caseType,
        patientId: patientId,
        consultCharge: consultCharge,
        usgCharge: usgCharge,
        uptCharge: uptCharge,
        injectionCharge: injectionCharge,
        otherCharge: otherCharge
      };
      axios
        .post(`${baseApiUrl}/opds`, opd)
        .then(res => {
          this.handleReset();
          this.growl.show({ severity: "success", summary: "Success Message", detail: res.data.Message });
        })
        .catch(error => {
          let errors = error.response.data.ValidationSummary;
          this.setState({
            validationErrors: errors
          });
          this.messages.clear();
          Object.keys(errors).map((item, i) => (
            this.messages.show({ severity: 'error', summary: 'Validation Message', detail: errors[item], sticky: true })
          ))
        });
    }
  };
  handleValidation = e => {
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

  handleReset = e => {
    this.messages.clear();
    this.setState(this.getInitialState());
  };

  getPatients = e => {
    return axios.get(`${baseApiUrl}/patients?fields=id,fullname&take=100`).then(res => res.data.Result.data);
  };

  componentDidMount() {
    this.getPatients().then(data => {
      let patients = data.map(function (item) {
        return { value: item["id"], label: item["fullname"] };
      });
      this.setState({ patientNames: patients });
    });
  }
  render() {
    const { opdDate, caseType, patientId, consultCharge, usgCharge, uptCharge, injectionCharge, otherCharge, totalCharge } = this.state.formFields;
    const { patientNames } = this.state;
    return (
      <div className="col-md-8">
        <Growl ref={el => (this.growl = el)} />
        <div className="row">
          <Panel header={title} toggleable={true}>
            <Messages ref={(el) => this.messages = el} />
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
                  <InputField name="patientId" title="Patient" value={patientId} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNames} filter={true} filterPlaceholder="Select Car" filterBy="label,value" showClear={true} onFocus={this.handleChange} />
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
