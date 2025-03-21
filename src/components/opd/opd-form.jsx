import React from "react";
import InputField from "../shared/input-field";
import { caseTypeOptions } from "../../common/constants";
import { helper } from "../../common/helpers";
import { Dialog } from "primereact/dialog";
import * as Constants from "../../common/constants";
import { repository } from "../../common/repository";
import PatientForm from "../patient/patient-form";
import jquery from "jquery";
import FormFooterButton from "../shared/form-footer-button";
import { Button } from "primereact/button";

const controller = "opds";
export default class OpdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }

  getInitialState = () => ({
    formFields: {
      id: null,
      opdDate: "",
      caseType: null,
      patient: null,
      consultCharge: 0,
      usgCharge: 0,
      uptCharge: 0,
      injectionCharge: 0,
      otherCharge: 0,
      totalCharge: "",
    },
    loading: false,
    fromPrescription: false,
    patientName: "",
    isValidationFired: false,
    checkExist: true,
    confirmDialog: false,
    validationErrors: {},
  });

  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    jquery("#errors").remove();
    let fields = formFields;
    if (action)
      fields[action.name] =
        action !== Constants.SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label }
          : null;
    else fields[e.target.name] = e.target.value;
    fields.consultCharge = fields.consultCharge ? fields.consultCharge : 0;
    fields.usgCharge = fields.usgCharge ? fields.usgCharge : 0;
    fields.uptCharge = fields.uptCharge ? fields.uptCharge : 0;
    fields.injectionCharge = fields.injectionCharge
      ? fields.injectionCharge
      : 0;
    fields.otherCharge = fields.otherCharge ? fields.otherCharge : 0;

    let total =
      Number(fields.consultCharge) +
      Number(fields.usgCharge) +
      Number(fields.uptCharge) +
      Number(fields.injectionCharge) +
      Number(fields.otherCharge);
    fields.totalCharge = total > 0 ? total : "";
    this.setState({
      formFields: fields,
    });
    if (isValidationFired) this.handleValidation();
  };
  submitOpd = () => {
    const {
      id,
      opdDate,
      caseType,
      patient,
      consultCharge,
      usgCharge,
      uptCharge,
      injectionCharge,
      otherCharge,
    } = this.state.formFields;
    const { hideEditDialog, saveOpd, includeProperties } = this.props;
    if (this.handleValidation()) {
      const opd = {
        id: id || 0,
        date: this.helper.formatDefaultDate(opdDate),
        caseType: caseType,
        patientId: patient.value,
        consultCharge: consultCharge,
        usgCharge: usgCharge,
        uptCharge: uptCharge,
        injectionCharge: injectionCharge,
        otherCharge: otherCharge,
        checkExist: this.state.checkExist,
      };
      this.setState({ loading: true });
      this.repository
        .post(
          `${controller}?includeProperties=${
            includeProperties ? includeProperties : ""
          }`,
          opd
        )
        .then((res) => {
          setTimeout(() => {
            if (res && !res.errors) {
              hideEditDialog && hideEditDialog();
              if (this.state.fromPrescription)
                window.location.href = "/add-opd";
              saveOpd && saveOpd(res, opd.id);
              !hideEditDialog && this.handleReset();
            } else this.setState({ loading: false });
            if (
              res &&
              res.errors &&
              res.errors[""] &&
              res.errors[""].toString().includes("exist")
            )
              this.setState({ confirmDialog: true });
          }, 1000);
        });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.submitOpd();
  };
  submitForcefully = (e) => {
    this.setState({ checkExist: false });
    setTimeout(() => {
      this.submitOpd();
    }, 0);
  };
  handleValidation = (e) => {
    const { opdDate, caseType, patient } = this.state.formFields;
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
    if (!patient) {
      isValid = false;
      errors.patient = "Select Patient";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };
  handleReset = (e) => {
    this.setState(this.getInitialState());
  };
  componentDidMount = () => {
    jquery("#errors").remove();
    const { selectedOpd } = this.props;
    const query = new URLSearchParams(window.location.search);
    const patientId = query.get("patientId");
    const patientName = query.get("patientName");
    const date = query.get("date");
    this.getInitalPatientOptions();
    if (patientId) {
      this.setState({
        fromPrescription: true,
        formFields: {
          patient: { value: patientId, label: patientName },
          opdDate: new Date(date),
        },
      });
    }
    if (selectedOpd) {
      selectedOpd.opdDate = selectedOpd.date && new Date(selectedOpd.date);
      this.setState({
        formFields: selectedOpd,
      });
    }
  };
  getInitalPatientOptions = () => {
    this.repository
      .get("patients", `take=15&filter=isdeleted-neq-{true}`)
      .then((res) => {
        let patients =
          res &&
          res.data.map(function (item) {
            return { value: item.id, label: item.fullname, age: item.age };
          });
        this.setState({
          initialPatientOptions: patients,
        });
      });
  };
  render() {
    const {
      id,
      opdDate,
      caseType,
      patient,
      consultCharge,
      usgCharge,
      uptCharge,
      injectionCharge,
      otherCharge,
      totalCharge,
    } = this.state.formFields;
    const { patientDialog, loading, confirmDialog, initialPatientOptions } =
      this.state;
    const defaultCharge = "";
    const confirmDialogFooter = (
      <div>
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={this.submitForcefully}
        />
        <Button
          label="No"
          icon="pi pi-trash"
          onClick={() => this.setState({ confirmDialog: false })}
          className="p-button-secondary"
        />
      </div>
    );
    return (
      <>
        <div id="validation-message"></div>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="opdDate"
                title="Opd Date"
                value={opdDate || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="caseType"
                title="Case Type"
                value={caseType || null}
                onChange={this.handleChange}
                {...this.state}
                controlType="dropdown"
                options={caseTypeOptions}
              />
            </div>
            <div className="col-md-8">
              <InputField
                name="patient"
                value={patient || ""}
                title="Patient"
                onChange={this.handleChange}
                {...this.state}
                onCreateOption={() => this.setState({ patientDialog: true })}
                onInputChange={(e) => {
                  e && this.setState({ patientName: e });
                }}
                controlType="select2"
                defaultOptions={initialPatientOptions}
                loadOptions={(e, callback) =>
                  this.helper.PatientOptions(e, callback)
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <InputField
                name="consultCharge"
                title="Consulting Charges"
                value={consultCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
            <div className="col">
              <InputField
                name="usgCharge"
                title="USG Charges"
                value={usgCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
            <div className="col">
              <InputField
                name="uptCharge"
                title="UPT Charges"
                value={uptCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <InputField
                name="injectionCharge"
                title="Injection Charges"
                value={injectionCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
            <div className="col">
              <InputField
                name="otherCharge"
                title="Other Charges"
                value={otherCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
            <div className="col">
              <InputField
                name="totalCharge"
                title="Total Charges"
                value={totalCharge || defaultCharge}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                readOnly="readOnly"
                className="p-readonly text-right"
              />
            </div>
          </div>
          <FormFooterButton showReset={!id} loading={loading} />
        </form>
        <Dialog
          header={Constants.PATIENT_REGISTRATION_TITLE}
          visible={patientDialog}
          onHide={() => this.setState({ patientDialog: false })}
          baseZIndex={500}
          dismissableMask={true}
        >
          {patientDialog && (
            <PatientForm
              onHidePatientDialog={() =>
                this.setState({ patientDialog: false })
              }
              {...this.state}
            />
          )}
        </Dialog>

        <Dialog
          header="Confirmation"
          visible={confirmDialog}
          footer={confirmDialogFooter}
          onHide={() => this.setState({ confirmDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to Save again this item?
        </Dialog>
      </>
    );
  }
}
