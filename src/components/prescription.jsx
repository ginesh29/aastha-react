import React from "react";
import { Panel } from "primereact/panel";
import InputField from "./shared/input-field";
import { helper } from "./../common/helpers";
import { repository } from "./../common/repository";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { appointmentTypeEnum, lookupTypeEnum } from "./../common/enums";
import {
  medicineInstructionOptions,
  SELECT2_ACTION_CLEAR_TEXT,
  FULLCALENDAR_OPTION,
} from "./../common/constants";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { FullCalendar } from "primereact/fullcalendar";
import "@fullcalendar/core/main.css";
import AppointmentTypeIndicator from "./appointment/appointment-indicator";
import _ from "lodash";
import jquery from "jquery";
import * as Constants from "./../common/constants";
import PatientForm from "./patient/patient-form";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import InvoiceHeader from "./shared/invoice-header";
window.$ = window.jQuery = jquery;
require("jQuery.print/jQuery.print");

const title = "Prescription";
let cnt = 0;
export default class Prescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
    this.options = FULLCALENDAR_OPTION;
  }
  getInitialState = () => ({
    formFields: {
      patient: null,
      date: "",
      clinicDetail: "",
      followup: 0,
      followupDate: "",
      advices: [],
      followupInstruction: "",
    },
    medicineFormFields: {
      id: "",
      medicineType: null,
      medicineName: null,
      days: "",
      qty: "",
      medicineInstructions: [],
      medicineInstructionsValue: [],
    },
    controller: "appointments",
    includeProperties: "Patient",
    medicineData: [],
    validationErrors: {},
    submitted: false,
  });
  getAppointments = () => {
    const { controller, includeProperties, filterString } = this.state;
    this.repository
      .get(
        controller,
        `filter=${filterString} and isDeleted-neq-{${true}}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        res &&
          res.data &&
          res.data.map((item) => {
            item.title = item.patient.fullname;
            item.start = this.helper.formatDefaultDate(item.date);
            item.color =
              appointmentTypeEnum[item.appointmentType.toUpperCase()].color;
            item.extendedProps = {
              patientId: item.patientId,
              type: item.type,
            };
            return item;
          });
        this.setState({ appointments: res && res.data });
      });
  };
  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    const { advices } = this.state.formFields;
    let fields = formFields;
    let followup = "";
    if (action)
      fields[action.name] =
        action !== SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label, age: e.age }
          : null;
    else {
      fields[e.target.name] = e.target.value;
      if (e.target.name === "advices") {
        let selectedAdvices = [...advices];
        if (e.checked) selectedAdvices.push(e.value);
        else selectedAdvices.splice(selectedAdvices.indexOf(e.value), 1);
        fields[e.target.name] = selectedAdvices;
      } else if (e.target.name === "followup") {
        fields.followupDate = "";
        if (e.target.value === 1)
          followup = `ફરી ......... ના રોજ બતાવવા આવવું`;
        else if (e.target.value <= 4 && e.target.value !== 0)
          followup = `ફરી ......... ના રોજ સોનોગ્રાફી માટે આવવું`;
        else if (e.target.value === 5)
          followup = `માસિકના બીજા/ત્રીજા/પાંચમા દિવસે બતાવવા આવવું`;
        else followup = "";
        fields.followupInstruction = followup;
      }
    }

    this.setState({
      formFields: fields,
      submitted: false,
    });
    if (isValidationFired) this.handleValidation();
  };

  handleMedicineChange = (e, weight) => {
    const { isValidationFired, medicineFormFields, medicineData } = this.state;
    const { medicineInstructions, medicineInstructionsValue } =
      this.state.medicineFormFields;
    let fields = medicineFormFields;
    fields[e.target.name] = e.target.value;
    if (e.target.name === "medicineType") {
      e.target.value && this.bindMedicineName(e.target.value);
    } else if (e.target.name === "medicineInstructions") {
      let selectedInstructions = [];
      selectedInstructions = selectedInstructions && [...medicineInstructions];
      let selectedInstructionsValue = medicineInstructionsValue && [
        ...medicineInstructionsValue,
      ];
      if (e.checked) {
        selectedInstructions.push(e.value);
        weight &&
          selectedInstructionsValue &&
          selectedInstructionsValue.push(weight);
      } else {
        selectedInstructions &&
          selectedInstructions.splice(selectedInstructions.indexOf(e.value), 1);
        selectedInstructionsValue.splice(
          selectedInstructionsValue.indexOf(weight),
          1
        );
      }
      fields[e.target.name] = selectedInstructions;
      fields.medicineInstructionsValue = selectedInstructionsValue;
    } else if (e.target.name === "qty") {
      medicineData
        .filter((m) => m.id === Number(e.target.id))
        .map((item) => {
          item.qty = e.target.value;
          return item;
        });
    }
    this.setState({
      medicineFormFields: fields,
    });
    this.medicineTypeDrp.resetFilter();
    this.medicineNameDrp.resetFilter();
    if (isValidationFired) this.handleValidation();
  };

  componentDidMount = () => {
    this.getInitalPatientOptions();
    this.bindLookups();
  };
  bindLookups = (e) => {
    this.repository
      .get(
        "lookups",
        `filter=(type-eq-{${lookupTypeEnum.MEDICINETYPE.code}} or type-eq-{${
          lookupTypeEnum.ADVICE.code
        }}) and isDeleted-neq-${true}`
      )
      .then((res) => {
        let lookups =
          res &&
          res.data.map(function (item) {
            return { code: item.id, label: item.name, type: item.type };
          });
        if (res) {
          let medicineTypeOptions = lookups.filter(
            (l) => l.type === lookupTypeEnum.MEDICINETYPE.code
          );
          let adviceOptions = lookups.filter(
            (l) => l.type === lookupTypeEnum.ADVICE.code
          );

          this.setState({
            medicineTypeOptions: medicineTypeOptions,
            adviceOptions: adviceOptions,
          });
        }
      });
  };
  bindMedicineName = (medicineType) => {
    medicineType = medicineType ? medicineType : 0;
    this.repository
      .get("lookups", `filter=parentId-eq-{${medicineType.code}}`)
      .then((res) => {
        let medicineNames =
          res &&
          res.data.map(function (item) {
            return { code: item.id, label: item.name };
          });
        medicineNames = _.uniqBy(medicineNames, "label");
        this.setState({
          medicineName: null,
          medicineNameOptions: medicineNames,
        });
      });
  };
  handleValidation = (e) => {
    const { date, patient, followup, followupDate } = this.state.formFields;
    const { validationErrors } = this.state;
    let errors = {};
    let isValid = true;

    if (!date) {
      isValid = false;
      errors.date = "Select Date";
    }
    if (!patient) {
      isValid = false;
      errors.patient = "Select Patient";
    }
    if (followup <= 4 && followup !== 0 && !followupDate) {
      isValid = false;
      errors.followupDate = "Select followup Date";
      validationErrors.followupDate = validationErrors.followupDate
        ? "error"
        : "";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };
  handleMedicineValidation = (e) => {
    const { medicineType, medicineName, days } = this.state.medicineFormFields;
    let errors = {};
    let isValid = true;

    if (!medicineType) {
      isValid = false;
      errors.medicineType = "Select Medicine Type";
    }
    if (!medicineName) {
      isValid = false;
      errors.medicineName = "Select Medicine Name";
    }
    if (!days) {
      isValid = false;
      errors.days = "Days is Required";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };
  addMedicine = (e) => {
    e.preventDefault();
    if (this.handleMedicineValidation()) {
      const {
        id,
        medicineType,
        medicineName,
        days,
        medicineInstructions,
        medicineInstructionsValue,
      } = this.state.medicineFormFields;
      const { medicineData } = this.state;
      cnt++;
      let qty = _.sum(medicineInstructionsValue) * days;
      const newMedicineData = {
        id: id ? id : cnt,
        medicineType: medicineType,
        medicineName: medicineName,
        days: days,
        qty: qty,
        medicineInstructions: medicineInstructions,
        medicineInstructionsValue: medicineInstructionsValue,
      };
      if (!id)
        this.setState((prevState) => ({
          medicineFormFields: {
            id: "",
            medicineType: null,
            medicineName: null,
            days: "",
            qty: "",
            medicineInstructions: [],
            medicineInstructionsValue: [],
          },
          medicineData: [...prevState.medicineData, newMedicineData],
        }));
      else {
        medicineData
          .filter((m) => m.id === id)
          .map((item) => {
            item.medicineType = medicineType ? medicineType : item.medicineType;
            item.medicineName = medicineName ? medicineName : item.medicineName;
            item.days = days ? days : item.days;
            item.qty = qty ? qty : item.qty;
            item.medicineInstructions = medicineInstructions
              ? medicineInstructions
              : item.medicineInstructions;
            item.medicineInstructionsValue = medicineInstructionsValue
              ? medicineInstructionsValue
              : item.medicineInstructionsValue;
            return item;
          });
        this.setState({
          medicineFormFields: {
            id: "",
            medicineType: null,
            medicineName: null,
            days: "",
            qty: "",
            medicineInstructions: [],
            medicineInstructionsValue: [],
          },
        });
      }
      //jquery(".p-dialog-content .p-dropdown-filter").val("");
    }
  };
  removeMedicine = (id) => {
    const { medicineData } = this.state;
    let data = medicineData.filter((m) => m.id !== id);
    this.setState({
      medicineFormFields: {
        medicineType: null,
        medicineName: null,
        days: "",
        qty: "",
        medicineInstructions: [],
      },
      medicineData: data,
      validationErrors: {},
    });
  };
  editMedicine = (id) => {
    const { medicineData } = this.state;
    let data = medicineData.filter((m) => m.id === id)[0];
    this.bindMedicineName(data.medicineType);
    this.setState({
      medicineFormFields: {
        id: data.id,
        medicineType: data.medicineType,
        medicineName: data.medicineName,
        days: data.days,
        qty: data.qty,
        medicineInstructions: data.medicineInstructions,
        medicineInstructionsValue: data.medicineInstructionsValue,
      },
      validationErrors: {},
    });
  };
  savePrescription = () => {
    const { id, followupDate, patient, followup, date, clinicDetail, advices } =
      this.state.formFields;
    var prescriptionMedicines = [];
    // eslint-disable-next-line
    this.state.medicineData.map((item) => {
      prescriptionMedicines.push({
        days: item.days,
        qty: item.qty,
        medicineType: item.medicineType.label,
        medicineName: item.medicineName.label,
        medicineInstruction: item.medicineInstructions.join(" --- "),
      });
    });
    var prescription = {
      id: id || 0,
      date: this.helper.formatDefaultDate(date),
      patientId: patient.value,
      clinicalDetail: clinicDetail,
      followupType: followup,
      followupDate: followupDate
        ? this.helper.formatStringToDate(followupDate)
        : null,
      advices: advices.toString(),
      prescriptionMedicines: prescriptionMedicines,
    };
    this.repository.post(`prescriptions`, prescription).then((res) => {
      let fields = this.state.formFields;
      fields.id = res.id;
      this.setState({ formFields: fields });
    });
  };
  saveAppointment = () => {
    const { followupDate, patient, followup } = this.state.formFields;
    const { submitted } = this.state;

    if (this.handleValidation()) {
      this.savePrescription();
      jquery("#print-div").print();

      if (!submitted && followupDate && this.handleValidation()) {
        const appointment = {
          date: this.helper.formatStringToDate(followupDate),
          patientId: patient.value,
          type: followup,
        };
        this.repository.post(`appointments`, appointment);
        this.setState({ submitted: true });
      }
    }
  };
  gotoOpdEntry = () => {
    const { date, patient } = this.state.formFields;
    if (this.handleValidation()) {
      window.open(
        `add-opd?patientId=${patient.value}&patientName=${
          patient.label
        }&date=${this.helper.formatDate(date, "en-US")}`,
        "_blank"
      );
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
    const { patientDialog } = this.state;
    const {
      patient,
      date,
      clinicDetail,
      followup,
      advices,
      followupInstruction,
      followupDate,
    } = this.state.formFields;
    const { id, medicineType, days, medicineName, medicineInstructions } =
      this.state.medicineFormFields;
    const {
      medicineTypeOptions,
      medicineNameOptions,
      medicineData,
      validationErrors,
      editDialog,
      adviceOptions,
      appointmentCalendarDialog,
      appointments,
      initialPatientOptions,
    } = this.state;
    const followupOptions = this.helper.enumToObject(appointmentTypeEnum);
    const appointmentTypeOptions =
      this.helper.enumToObject(appointmentTypeEnum);

    const header = (
      <>
        <span className="p-panel-title">{`${title} Preview`}</span>
        <div className="float-right">
          <Button
            icon="pi pi-print"
            tooltip="Save & Print"
            tooltipOptions={{ position: "bottom" }}
            onClick={this.saveAppointment}
          />
          <Button
            icon="fa fa-mail-forward"
            tooltipOptions={{ position: "bottom" }}
            onClick={this.gotoOpdEntry}
            className="ml-2"
          />
        </div>
      </>
    );
    this.options.eventMouseEnter = (info) => {
      tippy(info.el, {
        content: info.event.title,
      });
    };
    this.options.datesRender = (info) => {
      const startDate = this.helper.formatDefaultDate(info.view.activeStart);
      const endDate = this.helper.formatDefaultDate(info.view.activeEnd);
      const filter = `Date-gte-{${startDate}} and Date-lte-{${endDate}}`;
      this.setState({ filterString: filter }, () => {
        this.getAppointments();
        window.dispatchEvent(new Event("resize"));
      });
    };
    this.options.dateClick = (dateClickInfo) => {
      const { formFields } = this.state;
      let followupDate = this.helper.formatDate(dateClickInfo.date);

      this.setState({
        appointmentCalendarDialog: false,
        formFields: {
          ...formFields,
          followupInstruction:
            followup === 1
              ? `ફરી ${followupDate} ના રોજ બતાવવા આવવું`
              : `ફરી ${followupDate} ના રોજ સોનોગ્રાફી માટે આવવું`,
          followupDate: followupDate,
        },
      });
    };
    return (
      <>
        <div className="row">
          <div className="col-md-6">
            <Panel header={title} toggleable={true}>
              <div id="validation-message"></div>
              <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <div className="row">
                  <div className="col-md-6">
                    <InputField
                      name="patient"
                      value={patient}
                      title="Patient"
                      onChange={this.handleChange}
                      {...this.state}
                      onCreateOption={() =>
                        this.setState({ patientDialog: true })
                      }
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
                  <div className="col-md-6">
                    <InputField
                      name="date"
                      title="Date"
                      value={date}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="datepicker"
                      groupIcon="fa-calendar"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <InputField
                      name="clinicDetail"
                      title="Clinical Detail"
                      value={clinicDetail}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="textarea"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <button
                        className="btn btn-sm btn-secondary"
                        type="button"
                        onClick={(e) =>
                          this.handleValidation() &&
                          this.setState({ editDialog: true })
                        }
                      >
                        <i className="fa fa-plus"></i> Add Medicine
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <span className="font-weight-semi-bold"> Advice : </span>
                  </div>
                  <div className="col-md-10">
                    {adviceOptions &&
                      adviceOptions.map((item, i) => {
                        return (
                          <div className="followup-check" key={i + 1}>
                            <Checkbox
                              inputId={`advice${i}`}
                              name="advices"
                              value={item.label}
                              checked={advices.includes(item.label)}
                              onChange={this.handleChange}
                            />
                            <label
                              htmlFor={`advice${i}`}
                              className="p-radiobutton-label"
                            >
                              {item.label}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-2">
                    <span className="font-weight-semi-bold">
                      Follow&nbsp;up&nbsp;:
                    </span>
                  </div>
                  <div className="col-md-10">
                    <div className="followup-check">
                      {followupOptions.map((item, i) => {
                        return (
                          <div className="d-flex" key={i + 1}>
                            <div className="mr-2">
                              <RadioButton
                                inputId={`followup${i + 1}`}
                                name="followup"
                                value={item.value}
                                checked={followup === item.value}
                                onChange={(e) => {
                                  this.handleChange(e);
                                  this.setState({
                                    validationErrors: {
                                      ...validationErrors,
                                      followupDate: "",
                                    },
                                  });
                                }}
                              />
                              <label
                                htmlFor={`followup${i + 1}`}
                                className="p-radiobutton-label"
                              >
                                {item.label}
                              </label>
                            </div>
                            {item.value <= 4 && followup === item.value && (
                              <>
                                <div className="mr-2">
                                  <InputText
                                    className={`p-inputtext-sm ${
                                      validationErrors.followupDate
                                        ? "error"
                                        : ""
                                    }`}
                                    value={followupDate && followupDate}
                                    onChange={this.handleChange}
                                    name="followupDate"
                                    onFocus={() => {
                                      this.setState({
                                        appointmentCalendarDialog: true,
                                      });
                                    }}
                                  />
                                </div>
                                {validationErrors.followupDate && (
                                  <div className="mr-2">
                                    <span className="error">
                                      Followup Date is required
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                      <div className="form-group" key={0}>
                        <RadioButton
                          inputId={`followup${0}`}
                          name="followup"
                          value={0}
                          checked={followup === 0}
                          onChange={this.handleChange}
                        />
                        <label
                          htmlFor={`followup${0}`}
                          className="p-radiobutton-label"
                        >
                          None
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-6">
            <Panel header={header} className="">
              <div id="print-div" className="A5">
                <InvoiceHeader removeLogoButton={true} />
                <div className="invoice-detail">
                  <div className="d-flex justify-content-between">
                    <div>
                      <label>Patient Name : </label> {patient && patient.label}
                    </div>
                    <div>
                      <label>Date : </label>{" "}
                      {date && this.helper.formatDate(date)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <label>Patient Id : </label> {patient && patient.value}
                    </div>
                    <div>
                      <label>Age : </label> {patient && patient.age}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex prescription-detail mb-2">
                  <div>
                    <label className="m-0">
                      Clinic&nbsp;Detail&nbsp;:&nbsp;
                    </label>
                  </div>
                  <div>
                    <span className="display-linebreak"> {clinicDetail}</span>
                  </div>
                </div>
                <hr />
                <h4>Rx</h4>
                <div>
                  <table className="table table-borderless table-sm medicine-table">
                    <thead>
                      <tr>
                        <th width="100px"></th>
                        <th></th>
                        <th width="50px" className="text-right">
                          Days
                        </th>
                        <th width="50px" className="text-right">
                          Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineData &&
                        medicineData.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td className="align-top">
                                {item.medicineType.label}
                              </td>
                              <td className="text-left">
                                {item.medicineName.label}
                                <br />
                                <span className="gujarati-text">
                                  {item.medicineInstructions.join(" --- ")}
                                </span>
                              </td>
                              <td className="text-right">{item.days}</td>
                              <td className="text-right">{item.qty}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div className="d-flex prescription-detail">
                    <div>
                      <label className="m-0">Advice&nbsp;:</label>
                    </div>
                    <div>
                      <ul>
                        {advices.map((item, i) => {
                          return <li key={i + 1}>{item}</li>;
                        })}
                      </ul>
                    </div>
                  </div>
                  {followupInstruction && (
                    <>
                      <hr />
                      <div className="d-flex">
                        <div className="prescription-detail">
                          <label className="m-0">
                            Follow&nbsp;up&nbsp;:&nbsp;
                          </label>
                        </div>
                        <div
                          className="gujarati-text"
                          style={{ paddingTop: "4px" }}
                        >
                          {followupInstruction}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="text-right invoice-foot"
                  style={{ marginTop: "50px" }}
                >
                  <label>Dr. Bhaumik Tandel</label>
                </div>
              </div>
            </Panel>
          </div>
        </div>
        <Dialog
          header="Add Medicine"
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          className="p-scroll-dialog w-75"
          dismissableMask={true}
        >
          {editDialog && (
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      <InputField
                        name="medicineType"
                        title="Medicine Type"
                        value={medicineType}
                        onChange={this.handleMedicineChange}
                        {...this.state}
                        controlType="dropdown"
                        options={medicineTypeOptions}
                        filter={true}
                        optionLabel="label"
                        elRef={(el) => (this.medicineTypeDrp = el)}
                      />
                    </div>
                    <div className="col-md-4">
                      <InputField
                        name="medicineName"
                        title="Medicine Name"
                        value={medicineName}
                        onChange={this.handleMedicineChange}
                        {...this.state}
                        controlType="dropdown"
                        options={medicineNameOptions}
                        filter={true}
                        optionLabel="label"
                        elRef={(el) => (this.medicineNameDrp = el)}
                      />
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex">
                        <div className="mr-2">
                          <InputField
                            name="days"
                            title="Days"
                            value={days}
                            onChange={this.handleMedicineChange}
                            {...this.state}
                            keyfilter="pint"
                            className="text-right"
                          />
                        </div>
                        <div>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={this.addMedicine}
                            style={{ marginTop: "30px" }}
                          >
                            <i
                              className={`fa ${id ? "fa-save" : "fa-plus"}`}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row gujarati-text mt-3">
                    {medicineInstructionOptions.map((item, i) => {
                      return (
                        <div
                          className={`instruction-check col-md-${
                            item.label.length < 15
                              ? "3"
                              : item.label.length <= 40
                              ? "6"
                              : "12"
                          } mb-1`}
                          key={i + 1}
                        >
                          <Checkbox
                            inputId={`instruction${i}`}
                            name="medicineInstructions"
                            value={item.label}
                            checked={medicineInstructions.includes(item.label)}
                            onChange={(e) =>
                              this.handleMedicineValidation() &&
                              this.handleMedicineChange(
                                e,
                                item.value && item.value
                              )
                            }
                          />
                          <label
                            htmlFor={`instruction${i}`}
                            className="p-radiobutton-label"
                          >
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-md-6">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th width="10px"></th>
                        <th></th>
                        <th width="30px" className="text-right">
                          Days
                        </th>
                        <th width="55px" className="text-right">
                          Qty
                        </th>
                        <th width="50px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineData &&
                        medicineData.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td className="align-top">
                                {item.medicineType.label}
                              </td>
                              <td className="text-left">
                                {item.medicineName.label}
                                <br />
                                <span className="gujarati-text">
                                  {item.medicineInstructions.join(" --- ")}
                                </span>
                              </td>
                              <td className="text-right">{item.days}</td>
                              <td className="text-right">
                                <InputText
                                  id={item.id}
                                  name="qty"
                                  type="text"
                                  keyfilter="pint"
                                  value={item.qty}
                                  onChange={this.handleMedicineChange}
                                  className="p-inputtext-sm"
                                  style={{
                                    textAlign: "right",
                                    marginTop: "-6px",
                                  }}
                                />
                              </td>
                              <td width="100px" className="no-print">
                                <button
                                  className="btn btn-secondary btn-grid mr-2"
                                  type="button"
                                  onClick={() => this.editMedicine(item.id)}
                                >
                                  <i className="fa fa-pencil" />
                                </button>
                                <button
                                  className="btn btn-danger btn-grid mr-2"
                                  type="button"
                                  onClick={() => this.removeMedicine(item.id)}
                                >
                                  <i className="fa fa-times" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          )}
        </Dialog>
        <Dialog
          header="Appointment Calendar"
          visible={appointmentCalendarDialog}
          className="p-scroll-dialog w-75"
          onHide={() => this.setState({ appointmentCalendarDialog: false })}
          dismissableMask={true}
        >
          {appointmentCalendarDialog && (
            <>
              <AppointmentTypeIndicator options={appointmentTypeOptions} />
              <FullCalendar
                options={this.options}
                events={appointments}
                ref={(el) => (this.fullcalendar = el)}
              />
            </>
          )}
        </Dialog>
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
