import React from "react";
import InputField from "../shared/InputField";
import { initialState, baseApiUrl, roomTypes, departmentTypes } from "../../common/constants";
import { Panel } from 'primereact/panel';
import axios from 'axios';
import { Growl } from 'primereact/growl';
const title = "Ipd Entry";
export default class IpdForm extends React.Component {
    state = initialState;
    handleChange = e => {
        const { formFields, isValidationFired } = this.state;
        formFields[e.target.name] = e.target.value;
        // fields.consultCharge = fields.consultCharge ? fields.consultCharge : 0;
        // fields.usgCharge = fields.usgCharge ? fields.usgCharge : 0;
        // fields.uptCharge = fields.uptCharge ? fields.uptCharge : 0;
        // fields.injectionCharge = fields.injectionCharge ? fields.injectionCharge : 0;
        // fields.otherCharge = fields.otherCharge ? fields.otherCharge : 0;
        this.setState({
            formFields: formFields
        });
        console.log(formFields.departmentType)
        // let total = Number(fields.consultCharge) + Number(fields.usgCharge) + Number(fields.uptCharge) + Number(fields.injectionCharge) + Number(fields.otherCharge);
        // totalCharge = total > 0 ? total : "";

        if (isValidationFired) this.handleValidation();
    };
    componentDidMount() {
        axios.get(`${baseApiUrl}/patients?fields=id,fullname`)
            .then(res => {
                let patientsRes = res.data.Result.data;
                let patients = patientsRes.map(function (item) {
                    return { value: item["id"], label: item["fullname"] };
                })
                this.setState({ patientNames: patients })
            })
    }
    render() {
        const { formFields, patientNames } = this.state;
        return (
            <div className="col-md-12">
                <Growl ref={(el) => this.growl = el} />
                <div className="row">
                    <Panel header={title} toggleable={true}>
                        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                            <div className="row">
                                <div className="col-md-2">
                                    <InputField name="id" title="Invoice No." value={formFields.id} onChange={this.handleChange} {...this.state} />
                                </div>
                                <div className="col-md-6">
                                    <InputField name="patientId" title="Patient" value={formFields.patientId} onChange={this.handleChange} {...this.state} controlType="dropdown" options={patientNames} filter={true} filterPlaceholder="Select Car" filterBy="label,value" showClear={true} onFocus={this.handleChange} />
                                </div>
                                <div className="col-md-2">
                                    <InputField name="roomType" title="Room Type" value={formFields.roomType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={roomTypes} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <InputField name="departmentType" title="Department Type" value={formFields.departmentType} onChange={this.handleChange} {...this.state} controlType="dropdown" options={departmentTypes} />
                                </div>
                                <div className="col-md-3">
                                    <InputField name="addmissionDate" title="Addmission Date" value={formFields.ipdDate} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-3">
                                    <InputField name="dischargeDate" title="Discharge Date" value={formFields.ipdDate} onChange={this.handleChange} {...this.state} controlType="datepicker" />
                                </div>
                            </div>
                            <div style={{ display: formFields.departmentType === 1 ? "" : "none" }}>
                                <div className="row">
                                    <div className="col-md-3">
                                        <InputField name="deliveryDate" title="Delivery Date" value={formFields.deliveryDate} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-calendar" />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="deliveryTime" title="Delivery Time" value={formFields.deliveryTime} onChange={this.handleChange} {...this.state} controlType="datepicker" icon="pi pi-clock" timeOnly={true} />
                                    </div>
                                    <div className="col-md-1"></div>
                                    <div className="col-md-3">
                                        <InputField name="typesOfDelivery" title="Types Of Delivery" onChange={this.handleChange} {...this.state} controlType="multiselect" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: formFields.departmentType === 2 ? "" : "none" }}>
                                Operation
                            </div>
                            <div style={{ display: formFields.departmentType === 3 ? "" : "none" }}>
                                General
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField name="consultCharge" title="Consulting Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="usgCharge" title="USG Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="uptCharge" title="UPT Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField name="injectionCharge" title="Injection Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                </div>
                                <div className="col-md-4">
                                    <InputField name="otherCharge" title="Other Charges" onChange={this.handleChange} {...this.state} controlType="input-group-addon" groupIcon="fa-inr" keyfilter="pint" />
                                </div>
                                <div className="col-md-4">
                                    {/* <InputField name="totalCharge" title="Total Charges" onChange={this.handleChange} {...this.state} readOnly="readOnly" controlType="input-group-addon" groupIcon="fa-inr" value={totalCharge} /> */}
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