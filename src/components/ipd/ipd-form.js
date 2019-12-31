import React from "react";
import InputField from "../shared/InputField";
import { baseApiUrl, roomTypeOptions, departmentTypeEnum, genderOptions, lookupTypesOptions } from "../../common/constants";
import { Panel } from "primereact/panel";
import axios from "axios";
import { Growl } from "primereact/growl";
import { enumToObject } from "../../common/helpers";
import moment from 'moment';

const title = "Ipd Entry";
export default class IpdForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => ({
        formFields: {
            id: "",
            patientId: null,
            roomType: "",
            departmentType: [],
            addmissionDate: "",
            dischargeDate: "",
            deliveryDate: "",
            deliveryTime: "",
            typesOfDelivery: [],
            deliveryDiagnosis: "",
            babyGender: "",
            babyWeight: "",
            operationDate: "",
            operationDiagnosis: [],
            typesOfOperation: [],
            generalDiagnosis: [],
        },
        chargeFormFields: [],
        validationErrors: {}
    });
    handleChange = e => {
        const { isValidationFired, formFields } = this.state;
        formFields[e.target.name] = e.target.value;
        if (e.target.name === "departmentType") {
            formFields.deliveryDate = "";
            formFields.deliveryTime = "";
            formFields.typesOfDelivery = [];
            formFields.deliveryDiagnosis = "";
            formFields.babyGender = "";
            formFields.babyWeight = "";
            formFields.operationDate = "";
            formFields.operationDiagnosis = [];
            formFields.typesOfOperation = [];
            formFields.generalDiagnosis = [];
        }
        this.setState({
            formFields: formFields
        });
        if (isValidationFired)
            this.handleValidation();
    };

    handleChargeChange = e => {
        const { chargeFormFields } = this.state;
        const name = e.target.name;
        const lookupId = e.target.name.replace("rate-", "").replace("days-", "");
        let rate = "";
        let days = "";
        if (name.includes("rate"))
            rate = e.target.value;
        else if (name.includes("days"))
            days = e.target.value;

        chargeFormFields.filter(obj => {
            return obj.lookupId.toString() === lookupId;
        }).map(item => {
            item.rate = rate ? rate : item.rate;
            item.days = days ? days : item.days;
            let amount = item.rate * item.days;
            this.setState({ [`${item.lookupId}Amount`]: amount ? amount : "" });
            return item;
        });

    }
    handleSubmit = e => {
        const { departmentType, roomType, patientId, addmissionDate, dischargeDate,
            deliveryDate, deliveryTime, babyGender, babyWeight, typesOfDelivery, operationDiagnosis,
            typesOfOperation, generalDiagnosis, operationDate, deliveryDiagnosis } = this.state.formFields;
        const { chargeFormFields } = this.state;
        e.preventDefault();
        if (this.handleValidation()) {
            let lookupArray = [...typesOfDelivery, ...operationDiagnosis, ...typesOfOperation, ...generalDiagnosis];

            lookupArray = departmentType === departmentTypeEnum.DELIVERY.value ? lookupArray.concat(deliveryDiagnosis) : lookupArray;
            const ipdLookups = lookupArray.map(item => {
                return { lookupId: item };
            });
            const deliveryDetail = {
                date: deliveryDate,
                time: moment(deliveryTime).format("HH:mm"),
                gender: babyGender,
                babyWeight: babyWeight
            }
            const operationDetail = {
                date: operationDate
            }
            const charges = chargeFormFields.filter(item => item.rate > 0 && item.day > 0)
            const ipd = {
                type: departmentType.value,
                roomType: roomType,
                patientId: patientId,
                addmissionDate: addmissionDate,
                dischargeDate: dischargeDate,
                deliveryDetail: departmentType === departmentTypeEnum.DELIVERY ? deliveryDetail : null,
                operationDetail: departmentType === departmentTypeEnum.OPERATION ? operationDetail : null,
                ipdLookups: ipdLookups,
                charges: charges
            };
            axios.post(`${baseApiUrl}/ipds`, ipd)
                .then(res => {
                    this.handleReset();
                    this.growl.show({ severity: "success", summary: "Success Message", detail: res.data.Message });
                })
                .catch(error => {
                    let errors = error.response.data.ValidationSummary;
                    this.setState({
                        validationErrors: errors
                    });
                    console.log(errors);
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
        } else {
            if (departmentType.label === departmentTypeEnum.DELIVERY.label) {
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
            if (departmentType.label === departmentTypeEnum.OPERATION.label) {
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
            if (departmentType.label === departmentTypeEnum.GENERAL.label) {
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
    // getGrandTotal = e => {

    // }
    getPatients = e => {
        return axios.get(`${baseApiUrl}/patients?fields=id,fullname&take=100`).then(res => res.data.Result.data);
    };

    bindLookups = e => {
        axios.get(`${baseApiUrl}/lookups`).then(res => {
            let response = res.data.Result.data;
            let lookups = response.map(function (item) {
                return { value: item["id"], label: item["name"], type: item["type"] };
            });

            let typesofDeliveryOptions = lookups.filter(l => l.type === lookupTypesOptions.DELIVERYTYPE.value);
            let deliveryDiganosisOptions = lookups.filter(l => l.type === lookupTypesOptions.DELIVERYDIAGNOSIS.value);
            let operationDiagnosisOptions = lookups.filter(l => l.type === lookupTypesOptions.OPERATIONDIAGNOSIS.value);
            let typesofOprationOptions = lookups.filter(l => l.type === lookupTypesOptions.OPERATIONTYPE.value);
            let generalDiagnosisOptions = lookups.filter(l => l.type === lookupTypesOptions.GENERALDIAGNOSIS.value);
            let chargeNames = lookups.filter(l => l.type === lookupTypesOptions.CHARGENAME.value);

            this.setState({ typesofDeliveryOptions: typesofDeliveryOptions });
            this.setState({ deliveryDiganosisOptions: deliveryDiganosisOptions });
            this.setState({ operationDiagnosisOptions: operationDiagnosisOptions });
            this.setState({ typesofOprationOptions: typesofOprationOptions });
            this.setState({ generalDiagnosisOptions: generalDiagnosisOptions });
            this.setState({ chargeNames: chargeNames });
            this.setState({ departmentTypeOptions: enumToObject(departmentTypeEnum) });

            let charges = chargeNames.map(item => {
                return { lookupId: item.value, rate: "", days: "" }
            })
            this.setState({ chargeFormFields: charges });
        });
    };
    handleReset = e => {
        this.setState(this.getInitialState());
    };
    componentDidMount = e => {
        this.getPatients().then(data => {
            let patients = data.map(function (item) {
                return { value: item["id"], label: item["fullname"] };
            });
            this.setState({ patientNameOptions: patients });
        });
        this.bindLookups();
    };

    render() {
        const { id, patientId, roomType, departmentType, addmissionDate, dischargeDate, deliveryDate, deliveryTime, typesOfDelivery, deliveryDiagnosis, babyGender, babyWeight, operationDate, operationDiagnosis, typesOfOperation, generalDiagnosis } = this.state.formFields;
        const { patientNameOptions, departmentTypeOptions, typesofDeliveryOptions, operationDiagnosisOptions, typesofOprationOptions, generalDiagnosisOptions, deliveryDiganosisOptions, chargeNames, grandTotal } = this.state;
        return (
            <div className="col-md-8" >
                <Growl ref={el => (this.growl = el)} />
                <div className="row">
                    <Panel header={title} toggleable={true}>
                        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField name="id" title="Invoice No." value={id} onChange={this.handleChange} {...this.state} />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="patientId" title="Patient" value={patientId} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNameOptions} filter={true} filterPlaceholder="Select Car" filterBy="label,value" showClear={true} onFocus={this.handleChange} dataKey={patientId} />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="roomType" title="Room Type" value={roomType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={roomTypeOptions} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField name="departmentType" title="Department Type" value={departmentType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={departmentTypeOptions} optionLabel="label" />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="addmissionDate" title="Addmission Date" value={addmissionDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="dischargeDate" title="Discharge Date" value={dischargeDate} onChange={this.handleChange} {...this.state} controlType="datepicker" />
                                </div>
                            </div>
                            <label>dew</label>
                            <div style={{ display: departmentType.label === departmentTypeEnum.DELIVERY.label ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="deliveryDate" title="Delivery Date" value={deliveryDate} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-calendar" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="deliveryTime" title="Delivery Time" value={deliveryTime} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-clock" timeOnly={true} hourFormat="12" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="typesOfDelivery" title="Types Of Delivery" value={typesOfDelivery} onChange={this.handleChange} {...this.state} controlType="multiselect" options={typesofDeliveryOptions} filter={true} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="deliveryDiagnosis" title="Delivery Diagnosis" value={deliveryDiagnosis} onChange={this.handleChange} {...this.state} controlType="dropdown" options={deliveryDiganosisOptions} />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="babyGender" title="Baby Gender" value={babyGender} onChange={this.handleChange} {...this.state} controlType="dropdown" options={genderOptions} />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="babyWeight" title="Baby Weight" value={babyWeight} onChange={this.handleChange} {...this.state} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: departmentType.label === departmentTypeEnum.OPERATION.label ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="operationDate" title="Operation Date" value={operationDate} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-calendar" />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="operationDiagnosis" title="Operation Diagnosis" value={operationDiagnosis} onChange={this.handleChange} {...this.state} controlType="multiselect" options={operationDiagnosisOptions} filter={true} />
                                    </div>
                                    <div className="col-md-4">
                                        <InputField name="typesOfOperation" title="Types Of Operation" value={typesOfOperation} onChange={this.handleChange} {...this.state} controlType="multiselect" options={typesofOprationOptions} filter={true} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: departmentType.label === departmentTypeEnum.GENERAL.label ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <InputField name="generalDiagnosis" title="General Diagnosis" value={generalDiagnosis} onChange={this.handleChange} {...this.state} controlType="multiselect" options={generalDiagnosisOptions} filter={true} />
                                    </div>
                                </div>
                            </div>
                            <table className="table table-bordered">
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
                                    {chargeNames && chargeNames.map((item, index) => {
                                        return (
                                            <tr key={index} >
                                                <th>{index + 1}</th>
                                                <td>{item.label}</td>
                                                <td><input className="form-control input-sm" name={`rate-${item.value}`} onChange={this.handleChargeChange} /></td>
                                                <td><input className="form-control input-sm" name={`days-${item.value}`} onChange={this.handleChargeChange} /></td>
                                                <td>{this.state[`${item.value}Amount`]}</td>
                                            </tr>)
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2">Grand Total</td>
                                        <td>{grandTotal}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2">Amount Paid</td>
                                        <td colSpan="3">
                                            54
                    </td>
                                    </tr>
                                </tfoot>
                            </table>

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
            </div >
        );
    }
}
