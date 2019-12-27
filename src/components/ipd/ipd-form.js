import React from "react";
import InputField from "../shared/InputField";
import { baseApiUrl, departmentTypeOptions, roomTypeOptions, deliveryDiganosisOptions, genderOptions } from "../../common/constants";
import { Panel } from 'primereact/panel';
import axios from 'axios';
import { Growl } from 'primereact/growl';

const title = "Ipd Entry";
export default class IpdForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => ({
        formFields: {
            id: "", patientId: null, roomType: "", departmentType: [], addmissionDate: "", dischargeDate: ""
            , deliveryDate: "", deliveryTime: "", typesOfDelivery: [], deliveryDiagnosis: "", babyGender: "", babyWeight: "",
            operationDate: "", operationDiagnosis: [], typesOfOperation: [],
            generalDiagnosis: []
        },
        validationErrors: {}
    })
    handleChange = e => {
        const { formFields, isValidationFired } = this.state;
        formFields[e.target.name] = e.target.value;
        this.setState({
            formFields: formFields
        });
        // let total = Number(fields.consultCharge) + Number(fields.usgCharge) + Number(fields.uptCharge) + Number(fields.injectionCharge) + Number(fields.otherCharge);
        // totalCharge = total > 0 ? total : "";

        if (isValidationFired) this.handleValidation();
    };
    handleSubmit = e => {
        const { departmentType, roomType, patientId, addmissionDate, dischargeDate } = this.state.formFields;
        e.preventDefault();
        if (this.handleValidation()) {
            const ipd = {
                type: departmentType.value,
                roomType: roomType,
                patientId: patientId,
                addmissionDate: addmissionDate,
                dischargeDate: dischargeDate
            };
            axios.post(`${baseApiUrl}/ipds`, ipd)
                .then(res => {
                    this.handleReset();
                    this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                })
                .catch(error => {
                    let errors = error.response.data.ValidationSummary;
                    console.log(errors);
                    // this.setState({
                    //     validationErrors: errors
                    // });
                });
        }
    };
    handleValidation = e => {
        const { patientId, roomType, departmentType, addmissionDate, dischargeDate, deliveryDate, deliveryTime, typesOfDelivery, deliveryDiagnosis, babyGender, babyWeight, operationDate, operationDiagnosis, typesOfOperation, generalDiagnosis } = this.state.formFields;
        let errors = {};
        let isValid = true;
        if (!patientId) {
            isValid = false;
            errors.patientId = "Select Patient";
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
        if (!departmentType.value) {
            isValid = false;
            errors.departmentType = "Select Department Type";
        }
        else {
            if (departmentType.label === "Delivery") {
                if (!deliveryDate) {
                    isValid = false;
                    errors.deliveryDate = "Delivery Date is required";
                }
                if (!deliveryTime) {
                    isValid = false;
                    errors.deliveryTime = "Delivery Time is required";
                }
                if (!typesOfDelivery.length) {
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
            if (departmentType.label === "Operation") {
                if (!operationDate) {
                    isValid = false;
                    errors.operationDate = "Operation Date is required";
                }
                if (!operationDiagnosis.length) {
                    isValid = false;
                    errors.operationDiagnosis = "Operation Diagnosis is required";
                }
                if (!typesOfOperation.length) {
                    isValid = false;
                    errors.typesOfOperation = "Types of Operation is required";
                }
            }
            if (departmentType.label === "General") {
                if (!generalDiagnosis.length) {
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

    bindPatients = e => {
        axios.get(`${baseApiUrl}/patients?fields=id,fullname`)
            .then(res => {
                let data = res.data.Result.data;
                let patients = data.map(function (item) {
                    return { value: item["id"], label: item["fullname"] };
                })
                this.setState({ patientNameOptions: patients })
            })
    }
    bindTypesofDelivery = e => {
        axios.get(`${baseApiUrl}/lookups`)
            .then(res => {
                let response = res.data.Result.data;
                let lookups = response.map(function (item) {
                    return { value: item["id"], label: item["name"], type: item["type"] };
                })

                let typesofDeliveryOptions = lookups.filter(l => l.type === 1);
                let operationDiagnosisOptions = lookups.filter(l => l.type === 3);
                let typesofOprationOptions = lookups.filter(l => l.type === 2);
                let generalDiagnosisOptions = lookups.filter(l => l.type === 4);

                this.setState({ typesofDeliveryOptions: typesofDeliveryOptions })
                this.setState({ operationDiagnosisOptions: operationDiagnosisOptions })
                this.setState({ typesofOprationOptions: typesofOprationOptions })
                this.setState({ generalDiagnosisOptions: generalDiagnosisOptions })
            })
    }
    componentDidMount = e => {
        this.bindPatients();
        this.bindTypesofDelivery();
    }

    render() {
        const { id, patientId, roomType, departmentType, addmissionDate, dischargeDate, deliveryDate, deliveryTime, typesOfDelivery, deliveryDiagnosis, babyGender, babyWeight, operationDate, operationDiagnosis, typesOfOperation, generalDiagnosis } = this.state.formFields;
        const { patientNameOptions, typesofDeliveryOptions, operationDiagnosisOptions, typesofOprationOptions, generalDiagnosisOptions } = this.state;
        return (
            <div className="col-md-8">
                <Growl ref={(el) => this.growl = el} />
                <div className="row">
                    <Panel header={title} toggleable={true}>
                        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                            <div className="row">
                                <div className="col-md-2">
                                    <InputField name="id" title="Invoice No." value={id} onChange={this.handleChange} {...this.state} />
                                </div>
                                <div className="col-md-6">
                                    <InputField name="patientId" title="Patient" value={patientId} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNameOptions} filter={true} filterPlaceholder="Select Car" filterBy="label,value" showClear={true} onFocus={this.handleChange} />
                                </div>
                                <div className="col-md-2">
                                    <InputField name="roomType" title="Room Type" value={roomType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={roomTypeOptions} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <InputField name="departmentType" title="Department Type" value={departmentType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={departmentTypeOptions} optionLabel="label" />
                                </div>
                                <div className="col-md-3">
                                    <InputField name="addmissionDate" title="Addmission Date" value={addmissionDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-3">
                                    <InputField name="dischargeDate" title="Discharge Date" value={dischargeDate} onChange={this.handleChange} {...this.state} controlType="datepicker" />
                                </div>
                            </div>
                            <div style={{ display: departmentType.label === "Delivery" ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <InputField name="deliveryDate" title="Delivery Date" value={deliveryDate} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-calendar" />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="deliveryTime" title="Delivery Time" value={deliveryTime} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-clock" timeOnly={true} hourFormat="12" />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="typesOfDelivery" title="Types Of Delivery" value={typesOfDelivery} onChange={this.handleChange} {...this.state} controlType="multiselect" options={typesofDeliveryOptions} filter={true} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <InputField name="deliveryDiagnosis" title="Delivery Diagnosis" value={deliveryDiagnosis} onChange={this.handleChange} {...this.state} controlType="dropdown" options={deliveryDiganosisOptions} />
                                    </div>
                                    <div className="col-md-2">
                                        <InputField name="babyGender" title="Baby Gender" value={babyGender} onChange={this.handleChange} {...this.state} controlType="dropdown" options={genderOptions} />
                                    </div>
                                    <div className="col-md-2">
                                        <InputField name="babyWeight" title="Baby Weight" value={babyWeight} onChange={this.handleChange} {...this.state} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: departmentType.label === "Operation" ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <InputField name="operationDate" title="Operation Date" value={operationDate} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-calendar" />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="operationDiagnosis" title="Opearation Diagnosis" value={operationDiagnosis} onChange={this.handleChange} {...this.state} controlType="multiselect" options={operationDiagnosisOptions} filter={true} />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="typesOfOperation" title="Types Of Operation" value={typesOfOperation} onChange={this.handleChange} {...this.state} controlType="multiselect" options={typesofOprationOptions} filter={true} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: departmentType.label === "General" ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <InputField name="generalDiagnosis" title="General Diagnosis" value={generalDiagnosis} onChange={this.handleChange} {...this.state} controlType="multiselect" options={generalDiagnosisOptions} filter={true} />
                                    </div>
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
        )
    }
}