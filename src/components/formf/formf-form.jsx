import React from "react";
import InputField from "../shared/input-field";
import { helper } from "../../common/helpers";
import { Dialog } from "primereact/dialog";
import * as Constants from "../../common/constants";
import { repository } from "../../common/repository";
import PatientForm from "../patient/patient-form";
import jquery from "jquery";
import FormFooterButton from "../shared/form-footer-button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { genderEnum } from "../../common/enums";

const controller = "formfDetails";
export default class FormFForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }

  getInitialState = () => ({
    formFields: {
      id: null,
      date: "",
      lmpDate: "",
      patient: null,
      diagnosisProcedure: "",
      diagnosisResult: "",
      thumbImpression: false,
      relativeName: "",
      relativeAddress: "",
      relativeAge: "",
      relativeGender: 1,
      relativeMobile: "",
      relativeRelation: "",
    },
    loading: false,
    isValidationFired: false,
    checkExist: true,
    validationErrors: {},
    noOfMaleChild: "",
    noOfFemaleChild: "",
    children: null,
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
    else {
      if (e.target.type === "checkbox") {
        fields[e.target.name] = e.target.checked;
      } else fields[e.target.name] = e.target.value;
      if (e.target.name === "thumbImpression") {
        fields["relativeMobile"] = "";
        fields["relativeAddress"] = "";
        fields["relativeAge"] = "";
        fields["relativeName"] = "";
        fields["relativeGender"] = 1;
        fields["relativeRelation"] = "";
      }
    }
    this.setState({
      formFields: fields,
    });
    if (isValidationFired) this.handleValidation();
  };
  submitFormF = () => {
    const {
      id,
      date,
      lmpDate,
      patient,
      diagnosisProcedure,
      diagnosisResult,
      thumbImpression,
      relativeName,
      relativeAddress,
      relativeAge,
      relativeGender,
      relativeMobile,
      relativeRelation,
    } = this.state.formFields;
    const { hideEditDialog, saveFormF, includeProperties } = this.props;
    if (this.handleValidation()) {
      const formf = {
        id: id || 0,
        date: this.helper.formatDefaultDateTime(date),
        lmpDate: this.helper.formatDefaultDate(lmpDate),
        patientId: patient.value,
        children: this.state.children,
        diagnosisProcedure: diagnosisProcedure,
        diagnosisResult: diagnosisResult,
        thumbImpression: thumbImpression,
        relativeName: relativeName,
        relativeAddress: relativeAddress,
        relativeAge: relativeAge || 0,
        relativeGender: Number(relativeGender),
        relativeMobile: relativeMobile,
        relativeRelation: relativeRelation,
      };
      this.setState({ loading: true });
      this.repository
        .post(
          `${controller}?includeProperties=${
            includeProperties ? includeProperties : ""
          }`,
          formf
        )
        .then((res) => {
          if (res && !res.errors) {
            hideEditDialog && hideEditDialog();
            saveFormF && saveFormF(res, formf.id);
            !hideEditDialog && this.handleReset();
          } else this.setState({ loading: false });
        });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.submitFormF();
  };
  handleValidation = (e) => {
    const {
      date,
      lmpDate,
      patient,
      diagnosisProcedure,
      diagnosisResult,
      thumbImpression,
      relativeAddress,
      relativeAge,
      relativeMobile,
      relativeName,
      relativeRelation,
    } = this.state.formFields;
    const { noOfMaleChild, noOfFemaleChild, children } = this.state;
    let errors = {};
    let isValid = true;

    if (!date) {
      isValid = false;
      errors.date = "Select Ultrasound Date";
    }
    if (!lmpDate) {
      isValid = false;
      errors.lmpDate = "Select LMP Date";
    }
    if (!patient) {
      isValid = false;
      errors.patient = "Select Patient";
    }
    if (noOfMaleChild || noOfFemaleChild) {
      var totalChild = children.filter((m) => m.ageYr || m.ageMn);
      if (
        totalChild.length !==
        Number(noOfMaleChild || "") + Number(noOfFemaleChild || "")
      ) {
        isValid = false;
        errors.children = "Please enter child Age year/month for all child";
      }
    }
    if (!diagnosisProcedure) {
      isValid = false;
      errors.diagnosisProcedure = "Select Diagnosis Procedure is required";
    }
    if (!diagnosisResult) {
      isValid = false;
      errors.diagnosisResult = "Diagnosis Result is required";
    }
    if (thumbImpression) {
      if (!relativeAddress) {
        isValid = false;
        errors.relativeAddress = "Relative Address is required";
      }
      if (!relativeAge) {
        isValid = false;
        errors.relativeAge = "Relative Age is required";
      }
      if (!relativeMobile) {
        isValid = false;
        errors.relativeMobile = "Relative Mobile is required";
      }
      if (!relativeName) {
        isValid = false;
        errors.relativeName = "Relative Name is required";
      }
      if (!relativeRelation) {
        isValid = false;
        errors.relativeRelation = "Relative Relation is required";
      }
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
    const { selectedFormF } = this.props;
    this.getInitalPatientOptions();
    if (selectedFormF) {
      selectedFormF.date = selectedFormF.date && new Date(selectedFormF.date);
      selectedFormF.lmpDate =
        selectedFormF.lmpDate && new Date(selectedFormF.lmpDate);
      selectedFormF.relativeGender = selectedFormF.relativeGender
        ? selectedFormF.relativeGender
        : 1;
      this.setState({
        noOfMaleChild: selectedFormF.noOfMaleChild,
        noOfFemaleChild: selectedFormF.noOfFemaleChild,
        children: selectedFormF.children,
        formFields: selectedFormF,
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
  updateChildren = (noOfMaleChild, noOfFemaleChild) => {
    this.setState({
      noOfMaleChild: noOfMaleChild,
      noOfFemaleChild: noOfFemaleChild,
    });
    const children = [];
    for (let i = 0; i < noOfMaleChild; i++) {
      children.push({ no: i + 1, type: 1 });
    }
    for (let i = 0; i < noOfFemaleChild; i++) {
      children.push({
        no: i + Number(noOfMaleChild) + 1,
        type: 2,
      });
    }
    setTimeout(() => {
      this.setState({
        children: children,
      });
    }, 1000);
  };
  handleChangeChild = (e) => {
    let no = e.target.getAttribute("data-no");
    let type = e.target.getAttribute("data-type");
    const { isValidationFired, children } = this.state;

    children.map((item) => {
      if (item.no === Number(no)) item[type] = Number(e.target.value);
      return item;
    });
    this.setState({
      children: children,
    });
    if (isValidationFired) this.handleValidation();
  };
  render() {
    const genderOptions = this.helper.enumToObject(genderEnum);
    const {
      id,
      date,
      lmpDate,
      patient,
      diagnosisProcedure,
      diagnosisResult,
      thumbImpression,
      relativeName,
      relativeAge,
      relativeGender,
      relativeRelation,
      relativeAddress,
      relativeMobile,
    } = this.state.formFields;
    const {
      patientDialog,
      loading,
      initialPatientOptions,
      noOfMaleChild,
      noOfFemaleChild,
      children,
      validationErrors,
    } = this.state;
    return (
      <>
        <div id="validation-message"></div>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-6">
              <InputField
                name="date"
                title="Ultrasound Date"
                value={date || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
                showTime={true}
                hourFormat="12"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="lmpDate"
                title="LMP Date"
                value={lmpDate || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
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
            <div className="col-md-3">
              <InputField
                name="noOfMaleChild"
                title="No. of Male Child"
                value={noOfMaleChild || ""}
                onChange={(e) => {
                  this.updateChildren(e.target.value, noOfFemaleChild);
                }}
                {...this.state}
                keyfilter="pint"
                maxLength={1}
                className="text-right"
              />
            </div>
            <div className="col-md-3">
              <InputField
                name="noOfFemaleChild"
                title="No. of Female Child"
                value={noOfFemaleChild || ""}
                onChange={(e) => {
                  this.updateChildren(noOfMaleChild, e.target.value);
                }}
                {...this.state}
                keyfilter="pint"
                maxLength={1}
                className="text-right"
              />
            </div>
          </div>
          {children && (
            <>
              <table
                className="table table-sm mt-2 mb-0"
                style={{ width: "300px" }}
              >
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Gender</th>
                    <th>Age Year</th>
                    <th>Age Month</th>
                  </tr>
                </thead>
                <tbody>
                  {children &&
                    children.map((item) => {
                      return (
                        <tr key={`child_${item.no}`}>
                          <td>{item.no}</td>
                          <td>
                            {
                              Constants.childGenderOptions.filter(
                                (m) => m.value === item.type
                              )[0].label
                            }
                          </td>
                          <td>
                            <InputText
                              className="text-right"
                              value={item.ageYr || ""}
                              keyfilter="int"
                              onChange={(e) => {
                                this.handleChangeChild(e);
                              }}
                              data-no={item.no}
                              data-type="ageYr"
                            />
                          </td>
                          <td>
                            <InputText
                              className="text-right"
                              value={item.ageMn || ""}
                              keyfilter="int"
                              onChange={(e) => {
                                this.handleChangeChild(e);
                              }}
                              data-no={item.no}
                              data-type="ageMn"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {validationErrors.children && (
                <span className="error">
                  <i className="fa fa-info-circle mr-1"></i>
                  {validationErrors.children}
                </span>
              )}
            </>
          )}
          <InputField
            name="diagnosisProcedure"
            title="Indication/s for diagnosis procedure"
            value={diagnosisProcedure || null}
            onChange={this.handleChange}
            {...this.state}
            controlType="multiselect"
            options={Constants.FormFDiagnosisOptions}
            filter={true}
          />
          <InputField
            name="diagnosisResult"
            title=" Result of the non-invasive procedure Carried Out"
            value={diagnosisResult}
            onChange={this.handleChange}
            {...this.state}
            controlType="textarea"
          />
          <label className="checkbox">
            <Checkbox
              inputId="thumbImpression"
              name="thumbImpression"
              onChange={this.handleChange}
              checked={thumbImpression}
              tabIndex="3"
            ></Checkbox>
            <label htmlFor="thumbImpression" className="p-checkbox-label">
              Thumb Impression
            </label>
          </label>
          {thumbImpression && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <InputField
                    name="relativeName"
                    title="Relative Name"
                    value={relativeName || ""}
                    onChange={this.handleChange}
                    {...this.state}
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    name="relativeRelation"
                    title="Relative Relation"
                    value={relativeRelation || ""}
                    onChange={this.handleChange}
                    {...this.state}
                  />
                </div>
                <div className="col-md-3">
                  <InputField
                    name="relativeAge"
                    title="Relative Age"
                    value={relativeAge || ""}
                    onChange={this.handleChange}
                    {...this.state}
                    keyfilter="pint"
                    maxLength="2"
                    className="text-right"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <label>Gender</label>
                  <div className="d-flex">
                    {genderOptions.map((item, i) => {
                      return (
                        <div key={i} className="p-2">
                          <RadioButton
                            inputId={`gender${i}`}
                            name="relativeGender"
                            value={item.value}
                            onChange={this.handleChange}
                            checked={relativeGender === item.value}
                          />
                          <label
                            htmlFor={`gender${i}`}
                            className="p-radiobutton-label"
                          >
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-3">
                  <InputField
                    name="relativeMobile"
                    title="Relative Mobile"
                    value={relativeMobile || ""}
                    onChange={this.handleChange}
                    {...this.state}
                  />
                </div>
                <div className="col-md-6">
                  <InputField
                    name="relativeAddress"
                    title="Relative Address"
                    value={relativeAddress || ""}
                    onChange={this.handleChange}
                    {...this.state}
                  />
                </div>
              </div>
            </>
          )}
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
      </>
    );
  }
}
