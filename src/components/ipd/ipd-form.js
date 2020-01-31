import React from "react";
import InputField from "../shared/InputField";
import { roomTypeOptions, genderOptions } from "../../common/constants";
import { departmentTypeEnum, lookupTypeEnum } from "../../common/enums";
import { Dialog } from 'primereact/dialog';
import { helper } from "../../common/helpers";
import moment from 'moment';
import { InputText } from 'primereact/inputtext';
import { repository } from "../../common/repository";
import * as Constants from "../../common/constants";
import PatientForm from "../patient/patient-form";

const controller = "ipds";
export default class IpdForm extends React.Component
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
            uniqueId: "",
            patientId: null,
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
            discountAmount: ""
        },
        patientName: "",
        patientInput: "",
        isValidationFired: false,
        grandTotal: "",
        amountPaid: "",
        chargeFormFields: [],
        validationErrors: {}
    });
    handleChange = (e, action) =>
    {
        const { isValidationFired, formFields } = this.state;
        let fields = formFields;
        if (action)
            fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label } : null;
        else
            fields[e.target.name] = e.target.value;

        if (e.target && e.target.name === "departmentType") {
            formFields.deliveryDate = "";
            formFields.deliveryTime = "";
            formFields.typesOfDelivery = [];
            formFields.deliveryDiagnosis = null;
            formFields.babyGender = null;
            formFields.babyWeight = "";
            formFields.operationDate = "";
            formFields.operationDiagnosis = [];
            formFields.typesOfOperation = [];
            formFields.generalDiagnosis = [];
        }
        this.setState({ formFields: formFields });
        if (isValidationFired)
            this.handleValidation();
    };

    handleChargeChange = e =>
    {
        const { chargeFormFields, formFields } = this.state;
        const name = e.target.name;
        const lookupId = e.target.name.replace("rate-", "").replace("days-", "");
        let rate = "";
        let days = "";

        if (name.includes("rate"))
            rate = e.target.value;
        else if (name.includes("days"))
            days = e.target.value;
        else
            formFields[e.target.name] = e.target.value;

        chargeFormFields.filter(obj =>
        {
            return obj.lookupId === Number(lookupId);
        }).map(item =>
        {
            item.rate = rate ? rate : item.rate;
            item.days = days ? days : item.days;
            item.amount = item.rate && item.days ? item.rate * item.days : "";
            return item;
        });

        const grandTotal = chargeFormFields.reduce((total, item) => total + Number(item.amount), 0);
        const amountPaid = grandTotal - formFields.discountAmount;
        this.setState({
            grandTotal: grandTotal ? grandTotal : "",
            amountPaid: amountPaid ? amountPaid : ""
        });
    }

    handleSubmit = e =>
    {
        const { uniqueId, departmentType, roomType, patientId, addmissionDate, dischargeDate,
            deliveryDate, deliveryTime, babyGender, babyWeight, typesOfDelivery, operationDiagnosis,
            typesOfOperation, generalDiagnosis, operationDate, deliveryDiagnosis, discountAmount } = this.state.formFields;
        const { chargeFormFields } = this.state;
        e.preventDefault();
        if (this.handleValidation()) {
            let lookupArray = [...typesOfDelivery, ...operationDiagnosis, ...typesOfOperation, ...generalDiagnosis];

            lookupArray = departmentType === departmentTypeEnum.DELIVERY.value ? lookupArray.concat(deliveryDiagnosis) : lookupArray;
            const ipdLookups = lookupArray.map(item =>
            {
                return { lookupId: item };
            });
            const deliveryDetail = {
                date: this.helper.formatDate(deliveryDate, "en-US"),
                time: moment(deliveryTime).format("HH:mm"),
                gender: babyGender,
                babyWeight: babyWeight
            }
            const operationDetail = {
                date: this.helper.formatDate(operationDate, "en-US")
            }
            const charges = chargeFormFields.filter(item => item.rate !== "" && item.day !== "")
            const ipd = {
                uniqueId: uniqueId,
                type: departmentType.value,
                roomType: roomType,
                patientId: patientId.value,
                addmissionDate: this.helper.formatDate(addmissionDate, "en-US"),
                dischargeDate: this.helper.formatDate(dischargeDate, "en-US"),
                deliveryDetail: departmentType === departmentTypeEnum.DELIVERY ? deliveryDetail : null,
                operationDetail: departmentType === departmentTypeEnum.OPERATION ? operationDetail : null,
                ipdLookups: ipdLookups,
                charges: charges,
                discount: discountAmount
            };
            this.repository.post(controller, ipd).then(res =>
            {
                if (res)
                    this.handleReset();
            })
        }
    };
    handleValidation = e =>
    {
        const { uniqueId, patientId, roomType, departmentType, addmissionDate, dischargeDate, deliveryDate, deliveryTime, typesOfDelivery, deliveryDiagnosis, babyGender, babyWeight, operationDate, operationDiagnosis, typesOfOperation, generalDiagnosis } = this.state.formFields;

        let errors = {};
        let isValid = true;
        if (!uniqueId) {
            isValid = false;
            errors.uniqueId = "Invoice No is required";
        }
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
        if (!departmentType) {
            isValid = false;
            errors.departmentType = "Select Department Type";
        } else {
            if (departmentType && departmentType.label === departmentTypeEnum.DELIVERY.label) {
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
            if (departmentType && departmentType.label === departmentTypeEnum.OPERATION.label) {
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
            if (departmentType && departmentType.label === departmentTypeEnum.GENERAL.label) {
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

    bindLookups = e =>
    {
        this.repository.get("lookups", "filter=type-neq-{0}").then(res =>
        {
            let lookups = res && res.data.map(function (item)
            {
                return { value: item.id, label: item.name, type: item.type };
            });
            if (res) {
                let typesofDeliveryOptions = lookups.filter(l => l.type === lookupTypeEnum.DELIVERYTYPE.value);
                let deliveryDiganosisOptions = lookups.filter(l => l.type === lookupTypeEnum.DELIVERYDIAGNOSIS.value);
                let operationDiagnosisOptions = lookups.filter(l => l.type === lookupTypeEnum.OPERATIONDIAGNOSIS.value);
                let typesofOprationOptions = lookups.filter(l => l.type === lookupTypeEnum.OPERATIONTYPE.value);
                let generalDiagnosisOptions = lookups.filter(l => l.type === lookupTypeEnum.GENERALDIAGNOSIS.value);
                let chargeNames = lookups.filter(l => l.type === lookupTypeEnum.CHARGENAME.value);
                this.setState({ typesofDeliveryOptions: typesofDeliveryOptions });
                this.setState({ deliveryDiganosisOptions: deliveryDiganosisOptions });
                this.setState({ operationDiagnosisOptions: operationDiagnosisOptions });
                this.setState({ typesofOprationOptions: typesofOprationOptions });
                this.setState({ generalDiagnosisOptions: generalDiagnosisOptions });
                this.setState({ chargeNames: chargeNames });
                let charges = chargeNames.map(item =>
                {
                    return { lookupId: item.value, rate: "", days: "", amount: "" }
                })
                this.setState({ chargeFormFields: charges });
            }
        })
    };

    handleReset = e =>
    {
        const { chargeNames } = this.state;
        this.setState(this.getInitialState());
        let charges = chargeNames.map(item =>
        {
            return { lookupId: item.value, rate: "", days: "", amount: "" }
        })
        this.setState({ chargeFormFields: charges });
    };
    componentDidMount = e =>
    {
        this.bindLookups();
    };

    render()
    {
        const departmentTypeOptions = this.helper.enumToObject(departmentTypeEnum)
        const { uniqueId, patientId, roomType, departmentType, addmissionDate, dischargeDate, deliveryDate, deliveryTime, typesOfDelivery, deliveryDiagnosis, babyGender, babyWeight, operationDate, operationDiagnosis, typesOfOperation, generalDiagnosis, discountAmount } = this.state.formFields;
        const { typesofDeliveryOptions, operationDiagnosisOptions, typesofOprationOptions, generalDiagnosisOptions, deliveryDiganosisOptions, chargeNames, grandTotal, amountPaid, chargeFormFields, patientInput, patientDialogVisible, patientName } = this.state;
        return (
            <>
                <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                    <div className="row">
                        <div className="col-md-4">
                            <InputField name="uniqueId" title="Invoice No." value={uniqueId} onChange={this.handleChange} {...this.state} keyfilter="pint" />
                        </div>
                        <div className="col-md-4">
                            <InputField name="patientId" value={patientId} title="Patient" onChange={this.handleChange} {...this.state}
                                onCreateOption={() => this.setState({ patientDialogVisible: true, patientName: patientInput })} onInputChange={(e) => { this.setState({ patientInput: e }) }}
                                controlType="select2" loadOptions={(e, callback) => this.helper.PatientOptions(e, callback)} />
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
                            <InputField name="dischargeDate" title="Discharge Date" value={dischargeDate} onChange={this.handleChange} {...this.state} controlType="datepicker" minDate={addmissionDate} />
                        </div>
                    </div>
                    <div style={{ display: departmentType && departmentType.label === departmentTypeEnum.DELIVERY.label ? "" : "none" }}>
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
                                <InputField name="babyWeight" title="Baby Weight" value={babyWeight} onChange={this.handleChange} {...this.state} keyfilter="pnum" />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: departmentType && departmentType.label === departmentTypeEnum.OPERATION.label ? "" : "none" }}>
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
                    <div style={{ display: departmentType && departmentType.label === departmentTypeEnum.GENERAL.label ? "" : "none" }}>
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
                            {chargeNames && chargeNames.map((item, index) =>
                            {
                                const chargeObj = chargeFormFields.filter(c => c.lookupId === item.value);
                                let rate = chargeObj.map(m => m.rate);
                                let days = chargeObj.map(m => m.days);
                                let amount = chargeObj.map(m => m.amount);
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{item.label}</td>
                                        <td><InputText type="text" value={rate} className="input-sm" keyfilter="pint" name={`rate-${ item.value }`} onChange={this.handleChargeChange} /></td>
                                        <td><InputText type="text" value={days} className="input-sm" keyfilter="pint" name={`days-${ item.value }`} onChange={this.handleChargeChange} /></td>
                                        <td>{amount}</td>
                                    </tr>)
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">Grand Total</td>
                                <td colSpan="3">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <InputText type="text" className="input-sm" keyfilter="pint" value={grandTotal} readOnly />
                                        </div>
                                        <div className="col-md-2">
                                            <i className="fa fa-minus"></i>
                                        </div>
                                        <div className="col-md-5">
                                            <InputText name="discountAmount" className="input-sm" type="text" keyfilter="pint" value={discountAmount} onChange={this.handleChargeChange} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Amount Paid</td>
                                <td colSpan="3">
                                    {amountPaid}
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
                <Dialog header={Constants.PATIENT_REGISTRATION_TITLE} visible={patientDialogVisible} onHide={() => this.setState({ patientDialogVisible: false })} baseZIndex={50}>
                    {
                        patientDialogVisible &&
                        <PatientForm onHidePatientDialog={() => this.setState({ patientDialogVisible: false })} patientName={patientName} />
                    }
                </Dialog>
            </>
        );
    }
}
