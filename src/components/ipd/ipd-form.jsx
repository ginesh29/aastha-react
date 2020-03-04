import React from "react";
import InputField from "../shared/input-field";
import { roomTypeOptions, genderOptions } from "../../common/constants";
import { departmentTypeEnum, lookupTypeEnum } from "../../common/enums";
import { Dialog } from "primereact/dialog";
import { helper } from "../../common/helpers";
import { InputText } from "primereact/inputtext";
import { repository } from "../../common/repository";
import * as Constants from "../../common/constants";
import PatientForm from "../patient/patient-form";
import $ from "jquery";
import FormFooterButton from "../shared/form-footer-button";

const controller = "ipds";
export default class IpdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      id: null,
      uniqueId: "",
      patient: null,
      roomType: null,
      departmentType: null,
      addmissionDate: "",
      dischargeDate: "",
      deliveryDate: "",
      deliveryTime: "",
      typesOfDelivery: [],
      deliveryDiagnosis: null,
      babyGender: null,
      babyWeight: "",
      operationDate: "",
      operationDiagnosis: [],
      typesOfOperation: [],
      generalDiagnosis: [],
      discount: ""
    },
    patientName: "",
    patientInput: "",
    isValidationFired: false,
    grandTotal: "",
    amountPaid: "",
    chargeFormFields: [],
    validationErrors: {}
  });
  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    $("#errors").remove();
    let fields = formFields;
    if (action)
      fields[action.name] =
        action !== Constants.SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label }
          : null;
    else fields[e.target.name] = e.target.value;
    if (e && e.target && e.target.name === "departmentType") {
      formFields.deliveryDate = "";
      formFields.deliveryTime = "";
      formFields.typesOfDelivery = null;
      formFields.deliveryDiagnosis = null;
      formFields.babyGender = null;
      formFields.babyWeight = "";
      formFields.operationDate = "";
      formFields.operationDiagnosis = null;
      formFields.typesOfOperation = null;
      formFields.generalDiagnosis = null;
    }
    this.setState({ formFields: formFields });
    if (isValidationFired) this.handleValidation();
  };

  handleChargeChange = e => {
    const { chargeFormFields, formFields } = this.state;
    const name = e.target.name;
    const lookupId = Number(
      e.target.name.replace("rate-", "").replace("days-", "")
    );
    let rate = "";
    let days = "";
    if (name.includes("rate")) rate = e.target.value;
    else if (name.includes("days")) days = e.target.value;
    else formFields[e.target.name] = e.target.value;
    let chargeObj = chargeFormFields
      ? chargeFormFields.filter(m => m.lookupId === lookupId)
      : [];
    let charges = chargeFormFields ? chargeFormFields : [];
    if (lookupId) {
      if (chargeObj.length) {
        chargeObj.map(item => {
          item.rate = rate ? rate : item.rate;
          item.days = days ? days : item.days;
          item.amount = item.rate && item.days ? item.rate * item.days : "";
          return item;
        });
      } else charges.push({ lookupId: lookupId, rate: rate, days: days });
    }
    const grandTotal =
      chargeFormFields &&
      chargeFormFields.reduce(
        (total, item) => (total + item.amount ? Number(item.amount) : 0),
        0
      );
    const amountPaid = grandTotal - formFields.discount;
    this.setState({
      chargeFormFields: charges,
      grandTotal: grandTotal ? grandTotal : "",
      amountPaid: amountPaid ? amountPaid : ""
    });
  };

  handleSubmit = e => {
    const {
      id,
      uniqueId,
      departmentType,
      roomType,
      patient,
      addmissionDate,
      dischargeDate,
      deliveryDate,
      deliveryTime,
      babyGender,
      babyWeight,
      typesOfDelivery,
      operationDiagnosis,
      typesOfOperation,
      generalDiagnosis,
      operationDate,
      deliveryDiagnosis,
      discount,
      deliveryId,
      operationId,
      ipdLookups
    } = this.state.formFields;
    const { chargeFormFields } = this.state;
    const { hideEditDialog, includeProperties, saveIpd } = this.props;
    e.preventDefault();
    if (this.handleValidation()) {
      let lookupArray = null;
      if (departmentType.value === departmentTypeEnum.DELIVERY.value) {
        lookupArray = [...typesOfDelivery, deliveryDiagnosis];
      } else if (departmentType.value === departmentTypeEnum.OPERATION.value) {
        lookupArray = [...operationDiagnosis, ...typesOfOperation];
      } else {
        lookupArray = [...generalDiagnosis];
      }
      const ipdLookupArray = lookupArray.map(item => {
        if (ipdLookups) {
          let lookup = ipdLookups.filter(m => m.lookupId === item)[0];
          return {
            id: lookup && lookup.id,
            ipdId: lookup && lookup.ipdId,
            lookupId: item
          };
        } else return { lookupId: item };
      });
      const deliveryDetail = {
        id: deliveryId ? deliveryId : "",
        ipdId: id,
        date: this.helper.formatDate(deliveryDate, "en-US"),
        time: this.helper.formatTime(deliveryTime),
        gender: babyGender,
        babyWeight: babyWeight
      };

      const operationDetail = {
        id: operationId ? operationId : "",
        ipdId: id,
        date: this.helper.formatDate(operationDate, "en-US")
      };
      const charges =
        chargeFormFields &&
        chargeFormFields.filter(item => item.rate !== "" && item.day !== "");
      const ipd = {
        id: id,
        uniqueId: uniqueId,
        type: departmentType.value,
        roomType: roomType,
        patientId: patient.value,
        addmissionDate: this.helper.formatDate(addmissionDate, "en-US"),
        dischargeDate: this.helper.formatDate(dischargeDate, "en-US"),
        deliveryDetail:
          departmentType.value === departmentTypeEnum.DELIVERY.value
            ? deliveryDetail
            : null,
        operationDetail:
          departmentType.value === departmentTypeEnum.OPERATION.value
            ? operationDetail
            : null,
        ipdLookups: ipdLookupArray,
        charges: charges,
        discount: discount
      };

      this.repository
        .post(
          `${controller}?includeProperties=${
            includeProperties ? includeProperties : ""
          }`,
          ipd
        )
        .then(res => {
          if (res && !res.errors) {
            hideEditDialog && hideEditDialog();
            saveIpd && saveIpd(res, ipd.id);
            !hideEditDialog && this.handleReset();
          }
        });
    }
  };
  handleValidation = e => {
    const {
      uniqueId,
      patient,
      roomType,
      departmentType,
      addmissionDate,
      dischargeDate,
      deliveryDate,
      deliveryTime,
      typesOfDelivery,
      deliveryDiagnosis,
      babyGender,
      babyWeight,
      operationDate,
      operationDiagnosis,
      typesOfOperation,
      generalDiagnosis
    } = this.state.formFields;

    let errors = {};
    let isValid = true;
    if (!uniqueId) {
      isValid = false;
      errors.uniqueId = "Invoice No is required";
    }
    if (!patient) {
      isValid = false;
      errors.patient = "Select Patient";
    }
    if (!roomType) {
      isValid = false;
      errors.roomType = "Select Room Type";
    }
    if (!addmissionDate) {
      isValid = false;
      errors.addmissionDate = "Addmission Date is required";
    }
    if (!dischargeDate) {
      isValid = false;
      errors.dischargeDate = "Dishcharge Date is required";
    }
    if (!departmentType) {
      isValid = false;
      errors.departmentType = "Select Department Type";
    } else {
      if (
        departmentType &&
        departmentType.label === departmentTypeEnum.DELIVERY.label
      ) {
        if (!deliveryDate) {
          isValid = false;
          errors.deliveryDate = "Delivery Date is required";
        }
        if (!deliveryTime) {
          isValid = false;
          errors.deliveryTime = "Delivery Time is required";
        }
        if (!typesOfDelivery) {
          isValid = false;
          errors.typesOfDelivery = "Types of Delivery is required";
        }
        if (!deliveryDiagnosis) {
          isValid = false;
          errors.deliveryDiagnosis = "Delivery Diagnosis is required";
        }
        if (!babyGender) {
          isValid = false;
          errors.babyGender = "Baby Gender is required";
        }
        if (!babyWeight) {
          isValid = false;
          errors.babyWeight = "Baby Weight is required";
        }
      }
      if (
        departmentType &&
        departmentType.label === departmentTypeEnum.OPERATION.label
      ) {
        if (!operationDate) {
          isValid = false;
          errors.operationDate = "Operation Date is required";
        }
        if (!operationDiagnosis) {
          isValid = false;
          errors.operationDiagnosis = "Operation Diagnosis is required";
        }
        if (!typesOfOperation) {
          isValid = false;
          errors.typesOfOperation = "Types of Operation is required";
        }
      }
      if (
        departmentType &&
        departmentType.label === departmentTypeEnum.GENERAL.label
      ) {
        if (!generalDiagnosis) {
          isValid = false;
          errors.generalDiagnosis = "General Diagnosis is required";
        }
      }
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true
    });
    return isValid;
  };

  bindLookups = e => {
    this.repository
      .get("lookups", `filter=type-neq-{0} and isDeleted-neq-${true}`)
      .then(res => {
        let lookups =
          res &&
          res.data.map(function(item) {
            return { value: item.id, label: item.name, type: item.type };
          });
        if (res) {
          let typesofDeliveryOptions = lookups.filter(
            l => l.type === lookupTypeEnum.DELIVERYTYPE.value
          );
          let deliveryDiganosisOptions = lookups.filter(
            l => l.type === lookupTypeEnum.DELIVERYDIAGNOSIS.value
          );
          let operationDiagnosisOptions = lookups.filter(
            l => l.type === lookupTypeEnum.OPERATIONDIAGNOSIS.value
          );
          let typesofOprationOptions = lookups.filter(
            l => l.type === lookupTypeEnum.OPERATIONTYPE.value
          );
          let generalDiagnosisOptions = lookups.filter(
            l => l.type === lookupTypeEnum.GENERALDIAGNOSIS.value
          );
          let chargeNames = lookups.filter(
            l => l.type === lookupTypeEnum.CHARGENAME.value
          );

          this.setState({
            typesofDeliveryOptions: typesofDeliveryOptions,
            deliveryDiganosisOptions: deliveryDiganosisOptions,
            operationDiagnosisOptions: operationDiagnosisOptions,
            typesofOprationOptions: typesofOprationOptions,
            generalDiagnosisOptions: generalDiagnosisOptions,
            chargeNames: chargeNames
          });
        }
      });
  };

  handleReset = e => {
    this.setState(this.getInitialState());
  };
  componentDidMount = () => {
    $("#errors").remove();
    const { selectedIpd } = this.props;
    if (selectedIpd && selectedIpd.id) {
      selectedIpd.addmissionDate =
        selectedIpd.addmissionDate && new Date(selectedIpd.addmissionDate);
      selectedIpd.dischargeDate =
        selectedIpd.dischargeDate && new Date(selectedIpd.dischargeDate);
      selectedIpd.departmentType = {
        label: selectedIpd.ipdType,
        value: selectedIpd.type
      };
      const delivery = selectedIpd.deliveryDetail;
      const operation = selectedIpd.operationDetail;
      if (delivery) {
        selectedIpd.deliveryId = delivery.id;
        selectedIpd.deliveryDate = new Date(delivery.date);
        selectedIpd.deliveryTime = new Date(delivery.dateTime);
        selectedIpd.babyGender = delivery.gender;
        selectedIpd.babyWeight = delivery.babyWeight;
      }
      if (operation) {
        selectedIpd.operationId = operation.id;
        selectedIpd.operationDate = new Date(operation.date);
      }
      let deliveryDiagnosis = null;
      let typesOfDelivery = [];
      let typesOfOperation = [];
      let operationDiagnosis = [];
      let generalDiagnosis = [];

      if (selectedIpd.ipdLookups) {
        // eslint-disable-next-line
        selectedIpd.ipdLookups.map(item => {
          let obj = item.lookupId;
          if (item.lookup.type === lookupTypeEnum.DELIVERYDIAGNOSIS.value)
            deliveryDiagnosis = obj;
          else if (item.lookup.type === lookupTypeEnum.DELIVERYTYPE.value)
            typesOfDelivery = typesOfDelivery.concat(obj);
          else if (item.lookup.type === lookupTypeEnum.OPERATIONDIAGNOSIS.value)
            operationDiagnosis = operationDiagnosis.concat(obj);
          else if (item.lookup.type === lookupTypeEnum.OPERATIONTYPE.value)
            typesOfOperation = typesOfOperation.concat(obj);
          else if (item.lookup.type === lookupTypeEnum.GENERALDIAGNOSIS.value)
            generalDiagnosis = generalDiagnosis.concat(obj);
        });
        selectedIpd.deliveryDiagnosis = deliveryDiagnosis;
      }
      setTimeout(() => {
        selectedIpd.typesOfDelivery = typesOfDelivery;
        selectedIpd.operationDiagnosis = operationDiagnosis;
        selectedIpd.typesOfOperation = typesOfOperation;
        selectedIpd.generalDiagnosis = generalDiagnosis;
        this.setState({
          formFields: selectedIpd,
          chargeFormFields: selectedIpd.charges,
          grandTotal: selectedIpd.bill,
          amountPaid: selectedIpd.amount
        });
      }, 1000);
    }
    this.bindLookups();
  };

  render() {
    const departmentTypeOptions = this.helper.enumToObject(departmentTypeEnum);
    const {
      id,
      uniqueId,
      patient,
      roomType,
      departmentType,
      addmissionDate,
      dischargeDate,
      deliveryDate,
      deliveryTime,
      typesOfDelivery,
      deliveryDiagnosis,
      babyGender,
      babyWeight,
      operationDate,
      operationDiagnosis,
      typesOfOperation,
      generalDiagnosis,
      discount
    } = this.state.formFields;
    const {
      typesofDeliveryOptions,
      operationDiagnosisOptions,
      typesofOprationOptions,
      generalDiagnosisOptions,
      deliveryDiganosisOptions,
      chargeNames,
      grandTotal,
      amountPaid,
      chargeFormFields,
      patientInput,
      patientDialog,
      patientName
    } = this.state;
    const defaultCharge = id ? 0 : "";
    return (
      <>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="uniqueId"
                title="Indoor No."
                value={uniqueId || ""}
                onChange={this.handleChange}
                {...this.state}
                keyfilter="pint"
                className={id ? `p-readonly` : ""}
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="patient"
                value={patient || null}
                title="Patient"
                onChange={this.handleChange}
                {...this.state}
                className="p-select2"
                onCreateOption={() =>
                  this.setState({
                    patientDialog: true,
                    patientName: patientInput
                  })
                }
                onInputChange={e => {
                  this.setState({ patientInput: e });
                }}
                controlType="select2"
                loadOptions={(e, callback) =>
                  this.helper.PatientOptions(e, callback)
                }
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="roomType"
                title="Room Type"
                value={roomType || null}
                onChange={this.handleChange}
                {...this.state}
                controlType="dropdown"
                options={roomTypeOptions}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="departmentType"
                title="Department Type"
                value={departmentType || null}
                onChange={this.handleChange}
                {...this.state}
                controlType="dropdown"
                options={departmentTypeOptions}
                optionLabel="label"
                className={id ? `p-readonly` : ""}
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="addmissionDate"
                title="Addmission Date"
                value={addmissionDate || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="dischargeDate"
                title="Discharge Date"
                value={dischargeDate || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                minDate={addmissionDate}
              />
            </div>
          </div>
          {departmentType &&
            departmentType.label === departmentTypeEnum.DELIVERY.label && (
              <>
                <div className="row">
                  <div className="col-md-4">
                    <InputField
                      name="deliveryDate"
                      title="Delivery Date"
                      value={deliveryDate || ""}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="datepicker"
                      icon="pi pi-calendar"
                    />
                  </div>

                  <div className="col-md-4">
                    <InputField
                      name="deliveryTime"
                      title="Delivery Time"
                      value={deliveryTime || ""}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="datepicker"
                      icon="pi pi-clock"
                      timeOnly={true}
                      hourFormat="12"
                    />
                  </div>
                  <div className="col-md-4">
                    <InputField
                      name="typesOfDelivery"
                      title="Types Of Delivery"
                      value={typesOfDelivery || null}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="multiselect"
                      options={typesofDeliveryOptions}
                      filter={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <InputField
                      name="deliveryDiagnosis"
                      title="Delivery Diagnosis"
                      value={deliveryDiagnosis || null}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="dropdown"
                      options={deliveryDiganosisOptions}
                    />
                  </div>
                  <div className="col-md-4">
                    <InputField
                      name="babyGender"
                      title="Baby Gender"
                      value={babyGender || null}
                      onChange={this.handleChange}
                      {...this.state}
                      controlType="dropdown"
                      options={genderOptions}
                    />
                  </div>
                  <div className="col-md-4">
                    <InputField
                      name="babyWeight"
                      title="Baby Weight"
                      value={babyWeight || ""}
                      onChange={this.handleChange}
                      {...this.state}
                      keyfilter="pnum"
                    />
                  </div>
                </div>
              </>
            )}
          {departmentType &&
            departmentType.label === departmentTypeEnum.OPERATION.label && (
              <div className="row">
                <div className="col-md-4">
                  <InputField
                    name="operationDate"
                    title="Operation Date"
                    value={operationDate || ""}
                    onChange={this.handleChange}
                    {...this.state}
                    controlType="datepicker"
                    icon="pi pi-calendar"
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    name="operationDiagnosis"
                    title="Operation Diagnosis"
                    value={operationDiagnosis || null}
                    onChange={this.handleChange}
                    {...this.state}
                    controlType="multiselect"
                    options={operationDiagnosisOptions}
                    filter={true}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    name="typesOfOperation"
                    title="Types Of Operation"
                    value={typesOfOperation || null}
                    onChange={this.handleChange}
                    {...this.state}
                    controlType="multiselect"
                    options={typesofOprationOptions}
                    filter={true}
                  />
                </div>
              </div>
            )}
          {departmentType &&
            departmentType.label === departmentTypeEnum.GENERAL.label && (
              <div className="row">
                <div className="col-md-4">
                  <InputField
                    name="generalDiagnosis"
                    title="General Diagnosis"
                    value={generalDiagnosis || null}
                    onChange={this.handleChange}
                    {...this.state}
                    controlType="multiselect"
                    options={generalDiagnosisOptions}
                    filter={true}
                  />
                </div>
              </div>
            )}
          <table className="table table-bordered charge-table mt-4">
            <thead>
              <tr>
                <th width="50px">#</th>
                <th>Charge Title</th>
                <th width="100px">Rate</th>
                <th width="100px">Day</th>
                <th width="100px">Amount</th>
              </tr>
            </thead>
            <tbody>
              {chargeNames &&
                chargeNames.map((item, index) => {
                  let rate = "";
                  let days = "";
                  let amount = "";
                  if (chargeFormFields) {
                    const chargeObj = chargeFormFields.filter(
                      c => c.lookupId === item.value
                    )[0];
                    rate = chargeObj ? chargeObj.rate : defaultCharge;
                    days = chargeObj ? chargeObj.days : defaultCharge;
                    amount = chargeObj ? chargeObj.amount : defaultCharge;
                  }
                  return (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{item.label}</td>
                      <td>
                        <InputText
                          type="text"
                          value={rate}
                          className="input-sm"
                          keyfilter="pint"
                          name={`rate-${item.value}`}
                          onChange={this.handleChargeChange}
                        />
                      </td>
                      <td>
                        <InputText
                          type="text"
                          value={days}
                          className="input-sm"
                          keyfilter="pint"
                          name={`days-${item.value}`}
                          onChange={this.handleChargeChange}
                        />
                      </td>
                      <td>{amount}</td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Grand Total</td>
                <td colSpan="3">
                  <div className="d-flex flex-row bd-highlight">
                    <div className="mr-2">
                      <InputText
                        type="text"
                        className="input-sm"
                        keyfilter="pint"
                        value={grandTotal || ""}
                        readOnly
                      />
                    </div>
                    <div className="mr-2 mt-1">
                      <i className="fa fa-minus"></i>
                    </div>
                    <div>
                      <InputText
                        name="discount"
                        className="input-sm"
                        type="text"
                        keyfilter="pint"
                        value={discount || ""}
                        onChange={this.handleChargeChange}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">Amount Paid</td>
                <td colSpan="3">{amountPaid}</td>
              </tr>
            </tfoot>
          </table>
          <FormFooterButton showReset={!id} />
        </form>
        <Dialog
          header={Constants.PATIENT_REGISTRATION_TITLE}
          visible={patientDialog}
          onHide={() => this.setState({ patientDialog: false })}
          baseZIndex={50}
        >
          {patientDialog && (
            <PatientForm
              onHidePatientDialog={() =>
                this.setState({ patientDialog: false })
              }
              patientName={patientName}
            />
          )}
        </Dialog>
      </>
    );
  }
}
