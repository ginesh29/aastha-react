import React from 'react';
import { Panel } from 'primereact/panel';
import InputField from "./shared/InputField";
import { helper } from "./../common/helpers";
import { repository } from "./../common/repository";
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { appointmentTypeEnum } from "./../common/enums";
import * as Constants from "./../common/constants";
import { Calendar } from 'primereact/calendar';
const title = "Prescription";
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
        validationErrors: {}
    })
    handleChange = (e, action) =>
    {
        const { isValidationFired, formFields } = this.state;
        const { advices, followupDate } = this.state.formFields;
        let fields = formFields;
        let followup = "";
        if (action)
            fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label, age: e.age } : null;
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
                    followup = `ફરી ${ followupDate ? followupDate : "........." } ના રોજ બતાવવા આવવું`;
                else if (e.target.value === 5)
                    followup = `માસિકના બીજા/ત્રીજા/પાંચમા દિવસે બતાવવા આવવું`;
                else
                    followup = "";
                fields.followupInstruction = followup;
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
    render()
    {
        const { patientId, date, clinicDetail, followup, advices, followupInstruction, followupDate } = this.state.formFields;
        const followupOptions = this.helper.enumToObject(appointmentTypeEnum);
        return (
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
                                        <button className="btn btn-primary" type="button"> <i className="entypo-plus"></i> Add Medicine</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2"><label> Advice : </label></div>
                                <div className="col-md-10">
                                    {
                                        Constants.adviceOptions.map((item, i) =>
                                        {
                                            return (
                                                <div className="form-group" key={i + 1}>
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
                                <div className="col-md-2"><label>Follow up :</label></div>
                                <div className="col-md-10">
                                    {
                                        followupOptions.map((item, i) =>
                                        {
                                            return (
                                                <div className="form-group" key={i + 1}>
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
                                    <label>Patient Name : </label> {patientId.label}
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
                            <div className="row">
                                <div className="col-xs-2">
                                    <label>Clinical Detail : </label>
                                </div>
                                <div className="col-xs-10">
                                    <span className="display-linebreak">{clinicDetail}</span>
                                </div>
                            </div>
                            <h4>Rx</h4>
                            <div id="bottom_div">
                                <table className="table" id="medicine_Table">
                                    <thead>
                                        <tr>
                                            <th width="50px"></th>
                                            <th></th>
                                            <th width="30px" className="text-right">Days</th>
                                            <th width="30px" className="text-right">Qty</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className="row">
                                    <div className="col-md-2"><label> Advice : </label></div>
                                    <div className="col-md-10">
                                        <ul>
                                            {
                                                advices.map((item, i) =>
                                                {
                                                    return (
                                                        <li>{item}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                {
                                    followupInstruction && (
                                        <>
                                            <hr />
                                            <div className="row">
                                                <div className="col-md-2"><label>Follow up : </label></div>
                                                <div className="col-md-10">
                                                    <span>{followupInstruction}</span>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    )
                                }
                            </div>
                            <div className="row">
                                <div className="col-xs-5 pull-right" style={{ marginTop: "50px", textAlign: "right" }}>
                                    <strong>Dr. Bhaumik Tandel</strong>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

        )
    }
}