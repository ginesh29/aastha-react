import React from 'react';
import { Panel } from 'primereact/panel';
import InputField from "./shared/InputField";
import { helper } from "./../common/helpers";
import { repository } from "./../common/repository";
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { appointmentTypeEnum, lookupTypeEnum } from "./../common/enums";
import { medicineInstructionOptions, SELECT2_ACTION_CLEAR_TEXT, adviceOptions } from "./../common/constants";
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
import jquery from 'jquery';
window.jQuery = jquery;
require('jQuery.print');

const title = "Prescription";
let cnt = 0;
export default class Prescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.repository = new repository();
        this.helper = new helper();
    }
    getInitialState = () => ({
        formFields: {
            patient: null,
            date: "",
            clinicDetail: "",
            followup: 0,
            followupDate: "",
            advices: [],
            followupInstruction: ""
        },
        medicineFormFields: {
            id: "",
            medicineType: null,
            medicineName: null,
            days: "",
            qty: "",
            medicineInstructions: [],
            medicineInstructionsValue: []
        },
        medicineData: [],
        validationErrors: {},
        submitted: false
    })
    handleChange = (e, action) => {
        const { isValidationFired, formFields } = this.state;
        const { advices } = this.state.formFields
        let fields = formFields;
        let followup = "";
        if (action)
            fields[action.name] = action !== SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label, age: e.age } : null;
        else {
            fields[e.target.name] = e.target.value;
            if (e.target.name === "advices") {
                let selectedAdvices = [...advices];
                if (e.checked)
                    selectedAdvices.push(e.value);
                else
                    selectedAdvices.splice(selectedAdvices.indexOf(e.value), 1);
                fields[e.target.name] = selectedAdvices;
            }
            else if (e.target.name === "followup") {
                fields.followupDate = "";
                if (e.target.value <= 4 && e.target.value !== 0)
                    followup = `ફરી ......... ના રોજ બતાવવા આવવું`;
                else if (e.target.value === 5)
                    followup = `માસિકના બીજા/ત્રીજા/પાંચમા દિવસે બતાવવા આવવું`;
                else
                    followup = "";
                fields.followupInstruction = followup;
            }
            else if (e.target.name === "followupDate") {
                let followupDate = this.helper.formatDate(e.target.value);
                fields.followupInstruction = `ફરી ${followupDate} ના રોજ બતાવવા આવવું`;
            }
        }

        this.setState({
            formFields: fields,
            submitted: false
        });
        if (isValidationFired)
            this.handleValidation();
    };

    handleMedicineChange = (e, weight) => {
        const { isValidationFired, medicineFormFields } = this.state;
        const { medicineInstructions, medicineInstructionsValue, } = this.state.medicineFormFields;
        let fields = medicineFormFields;
        fields[e.target.name] = e.target.value;
        if (e.target.name === "medicineType") {
            this.bindMedicineName(e.target.value.value)
        }
        else if (e.target.name === "medicineInstructions") {
            let selectedInstructions = [...medicineInstructions];
            let selectedInstructionsValue = [...medicineInstructionsValue];
            if (e.checked) {
                selectedInstructions.push(e.value);
                weight && selectedInstructionsValue.push(weight);
            }
            else {
                selectedInstructions.splice(selectedInstructions.indexOf(e.value), 1);
                selectedInstructionsValue.splice(selectedInstructionsValue.indexOf(weight), 1);
            }
            fields[e.target.name] = selectedInstructions;
            fields.medicineInstructionsValue = selectedInstructionsValue;
        }
        this.setState({
            medicineFormFields: fields
        });

        if (isValidationFired)
            this.handleValidation();
    };

    componentDidMount = () => {
        this.bindMedicineType();
    }
    bindMedicineType = e => {
        this.repository.get("lookups", `filter=type-eq-{${lookupTypeEnum.MEDICINETYPE.value}}`).then(res => {
            let medicineTypes = res && res.data.map(function (item) {
                return { value: item.id, label: item.name };
            });
            this.setState({ medicineTypeOptions: medicineTypes })
        })
    };
    bindMedicineName = (medicineType) => {
        medicineType = medicineType ? medicineType : 0;
        this.repository.get("lookups", `filter=parentId-eq-{${medicineType}}`).then(res => {
            let medicineNames = res && res.data.map(function (item) {
                return { value: item.id, label: item.name };
            });
            medicineNames = _.uniqBy(medicineNames, 'label')
            this.setState({ medicineName: null, medicineNameOptions: medicineNames })
        })
    };
    handleValidation = e => {
        const { date, patient, followup, followupDate } = this.state.formFields
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
            validationErrors.followupDate = validationErrors.followupDate ? "error" : "";
        }
        this.setState({
            validationErrors: errors,
            isValidationFired: true
        });
        return isValid;
    };
    handleMedicineValidation = e => {
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
            isValidationFired: true
        });
        return isValid;
    };
    addMedicine = (e) => {
        e.preventDefault();
        if (this.handleMedicineValidation()) {
            const { id, medicineType, medicineName, days, medicineInstructions, medicineInstructionsValue } = this.state.medicineFormFields;
            const { medicineData } = this.state;
            cnt++;
            let qty = _.sum(medicineInstructionsValue) * days;
            const newMedicineData = { id: id ? id : cnt, medicineType: medicineType, medicineName: medicineName, days: days, qty: qty, medicineInstructions: medicineInstructions, medicineInstructionsValue: medicineInstructionsValue };
            if (!id)
                this.setState(prevState => (
                    {
                        medicineFormFields: { id: "", medicineType: null, medicineName: null, days: "", qty: "", medicineInstructions: [], medicineInstructionsValue: [] },
                        medicineData: [...prevState.medicineData, newMedicineData]
                    }));
            else {
                medicineData.filter(m => m.id === id).map(item => {
                    item.medicineType = medicineType ? medicineType : item.medicineType;
                    item.medicineName = medicineName ? medicineName : item.medicineName;
                    item.days = days ? days : item.days;
                    item.qty = qty ? qty : item.qty;
                    item.medicineInstructions = medicineInstructions ? medicineInstructions : item.medicineInstructions;
                    item.medicineInstructionsValue = medicineInstructionsValue ? medicineInstructionsValue : item.medicineInstructionsValue;
                    return item;
                })
                this.setState(
                    {
                        medicineFormFields: { id: "", medicineType: null, medicineName: null, days: "", qty: "", medicineInstructions: [], medicineInstructionsValue: [] },
                    });
            }
        }
    }
    removeMedicine = (id) => {
        const { medicineData } = this.state;
        let data = medicineData.filter(m => m.id !== id)
        this.setState({
            medicineFormFields: { medicineType: null, medicineName: null, days: "", qty: "", medicineInstructions: [], },
            medicineData: data,
            validationErrors: {}
        })
    }
    editMedicine = (id) => {
        const { medicineData } = this.state;
        let data = medicineData.filter(m => m.id === id)[0]
        this.bindMedicineName(data.medicineType.value)
        this.setState({
            medicineFormFields: {
                id: data.id,
                medicineType: data.medicineType,
                medicineName: data.medicineName,
                days: data.days,
                qty: data.qty,
                medicineInstructions: data.medicineInstructions,
                medicineInstructionsValue: data.medicineInstructionsValue
            },
            validationErrors: {}
        })
    }
    saveAppointment = () => {
        const { followupDate, patient, followup } = this.state.formFields
        const { submitted } = this.state;
        if (this.handleValidation()) {
            const appointment = {
                date: this.helper.formatDate(followupDate, "en-US"),
                patient: patient.value,
                type: followup
            };
            if (!submitted && followupDate && this.handleValidation()) {
                this.repository.post(`appointments`, appointment)
                this.setState({ submitted: true })
            }
            jquery("#print-div").print()
        }
    }
    render() {
        const { patient, date, clinicDetail, followup, advices, followupInstruction, followupDate } = this.state.formFields
        const { id, medicineType, days, medicineName, medicineInstructions } = this.state.medicineFormFields;
        const { Dialog, medicineTypeOptions, medicineNameOptions, medicineData, validationErrors } = this.state;
        const followupOptions = this.helper.enumToObject(appointmentTypeEnum);
        const header =
            <>
                <span className="p-panel-title">{`${title} Preview`}</span>
                <div className="float-right">
                    <Button icon="pi pi-print" tooltip="Save & Print" tooltipOptions={{ position: 'bottom' }} onClick={this.saveAppointment} />
                </div>
            </>
        console.log(id)
        return (
            <>
                <div className="row">
                    <div className="col-md-6">
                        <Panel header={title} toggleable={true}  >
                            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputField name="patient" value={patient} title="Patient" onChange={this.handleChange} {...this.state}
                                            onCreateOption={() => this.setState({ patientDialog: true })} onInputChange={(e) => { e && this.setState({ patientName: e }) }}
                                            controlType="select2" loadOptions={(e, callback) => this.helper.PatientOptions(e, callback)} />
                                    </div>
                                    <div className="col-md-6">
                                        <InputField name="date" title="Date" value={date} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InputField name="clinicDetail" title="Clinical Detail" value={clinicDetail} onChange={this.handleChange}  {...this.state} controlType="textarea" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <button className="btn btn-sm btn-secondary" type="button" onClick={(e) => this.handleValidation() && this.setState({ Dialog: true })}> <i className="fa fa-plus"></i> Add Medicine</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2"><label> Advice : </label></div>
                                    <div className="col-md-10">
                                        {
                                            adviceOptions.map((item, i) => {
                                                return (
                                                    <div className="followup-check" key={i + 1}>
                                                        <Checkbox inputId={`advice${i}`} name="advices" value={item.label} checked={advices.includes(item.label)} onChange={this.handleChange} />
                                                        <label htmlFor={`advice${i}`} className="p-radiobutton-label">{item.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-2"><label>Follow&nbsp;up&nbsp;:</label></div>
                                    <div className="col-md-10">
                                        <div className="followup-check">
                                            {
                                                followupOptions.map((item, i) => {
                                                    return (
                                                        <div className="d-flex" key={i + 1}>
                                                            <div className="mr-2">
                                                                <RadioButton inputId={`followup${i + 1}`} name="followup" value={item.value} checked={followup === item.value} onChange={(e) => { this.handleChange(e); this.setState({ validationErrors: { ...validationErrors, followupDate: "" } }) }} />
                                                                <label htmlFor={`followup${i + 1}`} className="p-radiobutton-label">{item.label}</label>
                                                            </div>

                                                            {
                                                                item.value <= 4 && followup === item.value && (
                                                                    <>
                                                                        <div className="mr-2">
                                                                            <Calendar inputClassName={`input-sm ${validationErrors.followupDate ? "error" : ""}`} value={followupDate && followupDate} onChange={this.handleChange} name="followupDate" />
                                                                        </div>
                                                                        {
                                                                            validationErrors.followupDate &&
                                                                            <div className="mr-2">
                                                                                <span className="error">Followup Date is required</span>
                                                                            </div>
                                                                        }
                                                                    </>
                                                                )
                                                            }

                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="form-group" key={0}>
                                                <RadioButton inputId={`followup${0}`} name="followup" value={0} checked={followup === 0} onChange={this.handleChange} />
                                                <label htmlFor={`followup${0}`} className="p-radiobutton-label">None</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </Panel>
                    </div>
                    <div className="col-md-6">
                        <Panel header={header} className="prescription-preview">
                            <div id="print-div">
                                <div className="row">
                                    <div className="col-md">
                                        <label>Patient Name : </label> {patient && patient.label}
                                    </div>
                                    <div className="col-md-4">
                                        <label>Date : </label> {date && this.helper.formatDate(date)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md">
                                        <label>Patient Id : </label> {patient && patient.value}
                                    </div>
                                    <div className="col-md-4">
                                        <label>Age : </label> {patient && patient.age}
                                    </div>
                                </div>
                                <hr />
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className="align-top" width="80px">Clinic&nbsp;Detail&nbsp;:&nbsp;</th>
                                            <td className="align-top"><span className="display-linebreak"> {clinicDetail}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h4>Rx</h4>
                                <div>
                                    <table className="table medicine-table">
                                        <thead>
                                            <tr>
                                                <th width="10px"></th>
                                                <th></th>
                                                <th width="30px" className="text-right">Days</th>
                                                <th width="30px" className="text-right">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                medicineData && medicineData.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="align-top">{item.medicineType.label}</td>
                                                            <td>{item.medicineName.label}<br />
                                                                <span className="gujarati-text">
                                                                    {item.medicineInstructions.join(" --- ")}
                                                                </span>
                                                            </td>
                                                            <td className="text-right">{item.days}</td>
                                                            <td className="text-right">{item.qty}</td>
                                                            <td width="1%" className="hidden-print">
                                                            </td>
                                                        </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th width="80px" className="align-top">Advice&nbsp;:</th>
                                                <td>
                                                    <ul style={{ paddingLeft: '20px' }}>
                                                        {
                                                            advices.map((item, i) => {
                                                                return (
                                                                    <li key={i + 1}>{item}</li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {
                                        followupInstruction && (
                                            <table>
                                                <tr>
                                                    <th width="80px">Follow up&nbsp;:&nbsp;</th>
                                                    <td className="gujarati-text align-bottom">{followupInstruction}</td>
                                                </tr>
                                            </table>
                                        )
                                    }
                                </div>
                                <div className="text-right" style={{ marginTop: "50px" }}>
                                    <label>Dr. Bhaumik Tandel</label>
                                </div>
                            </div>
                        </Panel>
                    </div>
                </div>
                <Dialog header="Add Medicine" visible={Dialog} onHide={() => this.setState({ Dialog: false })} style={{ width: '1200px' }} responsive="true">
                    {
                        Dialog &&
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <InputField name="medicineType" title="Medicine Type" value={medicineType} onChange={this.handleMedicineChange} {...this.state} controlType="dropdown" options={medicineTypeOptions} filter={true} optionLabel="label" />
                                        </div>
                                        <div className="col-md-4">
                                            <InputField name="medicineName" title="Medicine Name" value={medicineName} onChange={this.handleMedicineChange} {...this.state} controlType="dropdown" options={medicineNameOptions} filter={true} optionLabel="label" />
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex">
                                                <div className="mr-2">
                                                    <InputField name="days" title="Days" value={days} onChange={this.handleMedicineChange} {...this.state} keyfilter="pint" />
                                                </div>
                                                <div>
                                                    <button className="btn btn-sm btn-secondary" type="button" onClick={this.addMedicine} style={{ marginTop: '30px' }}> <i className="fa fa-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row gujarati-text">
                                        {
                                            medicineInstructionOptions.map((item, i) => {
                                                return (
                                                    <div className={`instruction-check col-md-${item.label.length < 15 ? "3" : item.label.length <= 35 ? "6" : "12"}`} key={i + 1}>
                                                        <Checkbox inputId={`instruction${i}`} name="medicineInstructions" value={item.label} checked={medicineInstructions.includes(item.label)} onChange={(e) => this.handleMedicineValidation() && this.handleMedicineChange(e, item.value)} />
                                                        <label htmlFor={`instruction${i}`} className="p-radiobutton-label">{item.label}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="10px"></th>
                                                <th></th>
                                                <th width="30px" className="text-right">Days</th>
                                                <th width="55px" className="text-right">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                medicineData && medicineData.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className="align-top">{item.medicineType.label}</td>
                                                            <td>{item.medicineName.label}<br />
                                                                <span className="gujarati-text">
                                                                    {item.medicineInstructions.join(" --- ")}
                                                                </span>
                                                            </td>
                                                            <td className="text-right">{item.days}</td>
                                                            <td className="text-right">
                                                                <InputText name="qty" type="text" keyfilter="pint" value={item.qty} onChange={this.handleMedicineChange} className="input-sm" style={{ textAlign: 'right', marginTop: '-6px' }} />
                                                            </td>
                                                            <td width="55px" className="no-print">
                                                                <button className="icon-button" type="button" onClick={() => this.editMedicine(item.id)}><i className="pi pi-pencil" /></button>
                                                                <button className="icon-button" type="button" onClick={() => this.removeMedicine(item.id)}><i className="pi pi-times" /></button>
                                                            </td>
                                                        </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </form>
                    }
                </Dialog>
            </>
        )
    }
}