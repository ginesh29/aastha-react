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
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import _ from 'lodash';
const title = "Prescription";
let cnt = 0;
export default class Prescription extends React.Component
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
            patientId: "",
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
            qty: 5,
            medicineInstructions: [],
            medicineInstructionsValue: []
        },
        medicineData: [],
        validationErrors: {}
    })
    handleChange = (e, action) =>
    {
        const { isValidationFired, formFields } = this.state;
        const { advices, followupDate } = this.state.formFields;
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
                if (e.target.value <= 4 && e.target.value !== 0)
                    followup = `ફરી ${ followupDate ? followupDate : "........." } ના રોજ બતાવવા આવવું`;
                else if (e.target.value === 5)
                    followup = `માસિકના બીજા/ત્રીજા/પાંચમા દિવસે બતાવવા આવવું`;
                else
                    followup = "";
                fields.followupInstruction = followup;
                fields.followupDate = "";
            }
            else if (e.target.name === "followupDate") {
                let followupDate = this.helper.formatDate(e.target.value);
                fields.followupInstruction = `ફરી ${ followupDate } ના રોજ બતાવવા આવવું`;
            }
        }

        this.setState({
            formFields: fields
        });
        if (isValidationFired)
            this.handleValidation();
    };

    handleMedicineChange = (e, weight) =>
    {
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
                selectedInstructionsValue.push(weight);
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

    componentDidMount = () =>
    {
        this.bindMedicineType();
    }
    bindMedicineType = e =>
    {
        this.repository.get("lookups", `filter=type-eq-{${ lookupTypeEnum.MEDICINETYPE.value }}`).then(res =>
        {
            let medicineTypes = res && res.data.map(function (item)
            {
                return { value: item.id, label: item.name };
            });
            this.setState({ medicineTypeOptions: medicineTypes })
        })
    };
    bindMedicineName = (medicineType) =>
    {
        medicineType = medicineType ? medicineType : 0;
        this.repository.get("lookups", `filter=parentId-eq-{${ medicineType }}`).then(res =>
        {
            let medicineNames = res && res.data.map(function (item)
            {
                return { value: item.id, label: item.name };
            });
            medicineNames = _.uniqBy(medicineNames, 'label')
            this.setState({ medicineName: null, medicineNameOptions: medicineNames })
        })
    };
    handleValidation = e =>
    {
        const { date, patientId } = this.state.formFields;
        let errors = {};
        let isValid = true;

        if (!date) {
            isValid = false;
            errors.date = "Select Date";
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
    handleMedicineValidation = e =>
    {
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
    addMedicine = (e) =>
    {
        e.preventDefault();
        if (this.handleMedicineValidation()) {
            const { id, medicineType, medicineName, days, medicineInstructions, medicineInstructionsValue } = this.state.medicineFormFields;
            cnt++;
            let qty = _.sum(medicineInstructionsValue);
            const newMedicineData = { id: id ? id : cnt, medicineType: medicineType, medicineName: medicineName, days: days, qty: days * qty, medicineInstructions: medicineInstructions, medicineInstructionsValue: medicineInstructionsValue };
            this.setState(prevState => (
                {
                    medicineFormFields: { id: "", medicineType: null, medicineName: null, days: "", qty: "", medicineInstructions: [], medicineInstructionsValue: [] },
                    medicineData: [...prevState.medicineData.filter(m => m.id !== id), newMedicineData]
                }));
        }
    }
    removeMedicine = (id) =>
    {
        const { medicineData } = this.state;
        let data = medicineData.filter(m => m.id !== id)
        this.setState({
            medicineFormFields: { medicineType: null, medicineName: null, days: "", qty: "", medicineInstructions: [], },
            medicineData: data
        })
    }
    editMedicine = (id) =>
    {
        const { medicineData } = this.state;
        let data = medicineData.filter(m => m.id === id)[0]
        console.log(data)
        this.setState({
            medicineFormFields: {
                id: data.id,
                medicineType: data.medicineType,
                medicineName: data.medicineName,
                days: data.days,
                qty: data.qty,
                medicineInstructions: data.medicineInstructions,
                medicineInstructionsValue: data.medicineInstructionsValue
            }
        })
    }
    render()
    {
        const { patientId, date, clinicDetail, followup, advices, followupInstruction, followupDate } = this.state.formFields;
        const { medicineType, days, medicineName, medicineInstructions } = this.state.medicineFormFields;
        const { dialogVisible, medicineTypeOptions, medicineNameOptions, medicineData } = this.state;
        const followupOptions = this.helper.enumToObject(appointmentTypeEnum);
        return (
            <>
                <div className="row">
                    <div className="col-md-6">
                        <Panel header={title} toggleable={true}  >
                            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <InputField name="patientId" value={patientId} title="Patient" onChange={this.handleChange} {...this.state}
                                            onCreateOption={() => this.setState({ patientDialogVisible: true })} onInputChange={(e) => { e && this.setState({ patientName: e }) }}
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
                                    <div className="col-lg-3">
                                        <div className="form-group">
                                            <button className="btn btn-primary" type="button" onClick={(e) => this.handleValidation() && this.setState({ dialogVisible: true })}> <i className="entypo-plus"></i> Add Medicine</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2"><label> Advice : </label></div>
                                    <div className="col-md-10">
                                        {
                                            adviceOptions.map((item, i) =>
                                            {
                                                return (
                                                    <div className="followup-check" key={i + 1}>
                                                        <Checkbox inputId={`advice${ i }`} name="advices" value={item.label} checked={advices.includes(item.label)} onChange={this.handleChange} />
                                                        <label htmlFor={`advice${ i }`} className="p-radiobutton-label">{item.label}</label>
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
                                        {
                                            followupOptions.map((item, i) =>
                                            {
                                                return (
                                                    <div className="followup-check" key={i + 1}>
                                                        <RadioButton inputId={`followup${ i + 1 }`} name="followup" value={item.value} checked={followup === item.value} onChange={this.handleChange} />
                                                        <label htmlFor={`followup${ i + 1 }`} className="p-radiobutton-label">{item.label}
                                                            {
                                                                item.value <= 4 && followup === item.value && (
                                                                    <Calendar value={followupDate && followupDate} onChange={this.handleChange} name="followupDate" />
                                                                )
                                                            }
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="form-group" key={0}>
                                            <RadioButton inputId={`followup${ 0 }`} name="followup" value={0} checked={followup === 0} onChange={this.handleChange} />
                                            <label htmlFor={`followup${ 0 }`} className="p-radiobutton-label">None</label>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </Panel>
                    </div>
                    <div className="col-md-6">
                        <Panel header={`${ title } Preview`} toggleable={true} className="prescription-preview">
                            <div id="print-div" style={{ marginTop: "20px", marginBottom: "20px" }} >
                                <div className="row">
                                    <div className="col-xs-8">
                                        <label>Patient Name : </label> {patientId && patientId.label}
                                    </div>
                                    <div className="col-xs-4">
                                        <label>Date : </label> {date && this.helper.formatDate(date)}
                                    </div>
                                    <div className="col-xs-8">
                                        <label>Patient Id : </label> {patientId.value}
                                    </div>
                                    <div className="col-xs-4">
                                        <label>Age : </label> {patientId.age}
                                    </div>
                                </div>
                                <hr />
                                <table>
                                    <tbody>
                                        <tr>
                                            <th style={{ verticalAlign: 'top' }} width="80px">Clinic&nbsp;Detail&nbsp;:&nbsp;</th>
                                            <td style={{ verticalAlign: 'top' }}><span className="display-linebreak"> {clinicDetail}</span></td>
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
                                                medicineData && medicineData.map((item, i) =>
                                                {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{ verticalAlign: 'top' }}>{item.medicineType.label}</td>
                                                            <td>{item.medicineName.label}<br />
                                                                <label>{item.medicineInstructions.join(" --- ")}</label>
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
                                                <th width="80px" style={{ verticalAlign: 'top' }}>Advice&nbsp;:</th>
                                                <td>
                                                    <ul style={{ paddingLeft: '20px' }}>
                                                        {
                                                            advices.map((item, i) =>
                                                            {
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
                                                    <td>{followupInstruction}</td>
                                                </tr>
                                            </table>
                                        )
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-xs-5 pull-right" style={{ marginTop: "50px", textAlign: "right" }}>
                                        <label>Dr. Bhaumik Tandel</label>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </div>
                </div>
                <Dialog header="Add Medicine" visible={dialogVisible} onHide={() => this.setState({ dialogVisible: false })} style={{ width: '1200px' }} responsive="true">
                    {
                        dialogVisible &&
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
                                        <div className="col-md-3">
                                            <InputField name="days" title="Days" value={days} onChange={this.handleMedicineChange} {...this.state} keyfilter="pint" />
                                            <Button icon="pi pi-plus" className="p-button-primary" onClick={this.addMedicine} />
                                        </div>

                                    </div>
                                    <div className="row">
                                        {
                                            medicineInstructionOptions.map((item, i) =>
                                            {
                                                return (
                                                    <div className={`instruction-check col-md-${ item.label.length < 15 ? "3" : item.label.length <= 35 ? "6" : "12" }`} key={i + 1}>
                                                        <Checkbox inputId={`instruction${ i }`} name="medicineInstructions" value={item.label} checked={medicineInstructions.includes(item.label)} onChange={(e) => this.handleMedicineChange(e, item.value)} />
                                                        <label htmlFor={`instruction${ i }`} className="p-radiobutton-label">{item.label}</label>
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
                                                medicineData && medicineData.map((item, i) =>
                                                {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{ verticalAlign: 'top' }}>{item.medicineType.label}</td>
                                                            <td>{item.medicineName.label}<br />
                                                                <label>{item.medicineInstructions.join(" --- ")}</label>
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