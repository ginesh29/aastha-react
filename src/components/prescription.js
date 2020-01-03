import React from 'react';
import { Panel } from 'primereact/panel';
import InputField from "./shared/InputField";
import { helper } from "./../common/helpers";
import { repository } from "./../common/repository";
import { RadioButton } from 'primereact/radiobutton';
const title = "Prescription";
export default class Prescription extends React.Component {
    constructor(props) {
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
        },
        validationErrors: {}
    })
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <Panel header={title} toggleable={true}  >
                        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                            <div className="row">
                                <div className="col-md-6">
                                    <InputField name="firstname" title="Firstname" value={""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
                                </div>
                                <div className="col-md-6">
                                    <InputField name="opdDate" title="Opd Date" value={""} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <InputField name="lastname" title="Lastname" value={""} onChange={this.handleChange} onInput={this.helper.toSentenceCase} {...this.state} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <button className="btn btn-primary" id="btn-add" type="button"> <i className="entypo-plus"></i> Add Medicine</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-2">Advice: </div>
                                <div className="col-md-10">
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb1" name="city" value="New York" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'New York'} />
                                        <label htmlFor="rb1" className="p-radiobutton-label">New York</label>
                                    </div>
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb2" name="city" value="San Francisco" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'San Francisco'} />
                                        <label htmlFor="rb2" className="p-radiobutton-label">San Francisco</label>
                                    </div>
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb3" name="city" value="Los Angeles" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'Los Angeles'} />
                                        <label htmlFor="rb3" className="p-radiobutton-label">Los Angeles</label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-md-2">Follow up :</div>
                                <div className="col-md-10">
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb1" name="city" value="New York" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'New York'} />
                                        <label htmlFor="rb1" className="p-radiobutton-label">New York</label>
                                    </div>
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb2" name="city" value="San Francisco" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'San Francisco'} />
                                        <label htmlFor="rb2" className="p-radiobutton-label">San Francisco</label>
                                    </div>
                                    <div className="col-md-12">
                                        <RadioButton inputId="rb3" name="city" value="Los Angeles" onChange={(e) => this.setState({ city: e.value })} checked={this.state.city === 'Los Angeles'} />
                                        <label htmlFor="rb3" className="p-radiobutton-label">Los Angeles</label>
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
                <div className="col-md-6">
                    <Panel header={`${title} Preview`} toggleable={true} id="prescription">
                        <br />
                        <div className="note printable">
                            <div className="row">
                                <div className="col-xs-8">
                                    <label>Patient Name : </label> <span id="PatientName"></span>
                                </div>
                                <div className="col-xs-4">
                                    <label>Date : </label> <span id="OpdDate"></span>
                                </div>
                                <div className="col-xs-8">
                                    <label>Patient Id : </label> <span id="Invoice_Id"></span>
                                </div>

                                <div className="col-xs-4">
                                    <label>Age : </label> <span id="Age"></span>
                                </div>
                            </div>
                            <hr />
                            <table>
                                <tbody><tr>
                                    <td valign="top" style={{ width: "85px" }}><label>Clinical Detail :</label></td>
                                    <td style={{ textAlign: "justify" }}><label><span id="complaints"></span></label></td>
                                </tr>
                                </tbody>
                            </table>
                            <h4>Rx</h4>
                            <div id="bottom_div">
                                <table className="table" id="medicine_Table">
                                    <thead>
                                        <tr>
                                            <th width="50px">
                                            </th>
                                            <th>
                                            </th>
                                            <th width="30px" style={{ textAlign: "right" }}>
                                                Days
                                    </th>
                                            <th width="30px" style={{ textAlign: "right" }}>
                                                Qty
                                    </th>
                                        </tr>
                                    </thead>

                                    <tbody></tbody>
                                </table>

                                <table className="table tablenew">
                                    <tbody><tr id="advice_div" hidden="" >
                                        <td style={{ verticalAlign: "top" }}> Advice&nbsp;: </td>
                                        <td className="justList"><ul></ul></td>
                                    </tr>
                                        <tr id="followup_div" hidden="" style={{ display: "table-row" }}>
                                            <td> Follow&nbsp;up&nbsp;:&nbsp;</td>
                                            <td style={{ verticalAlign: "bottom" }}> <span id="follow_instruction"> ફરી .........  ના રોજ બતાવવા આવવું</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="row">
                                <div className="col-xs-5 pull-right" id="drname" style={{ marginTop: "50px", textAlign: "right" }}>
                                    <strong>Dr. Bhaumik Tandel</strong>
                                </div>
                            </div>
                        </div>
                        <br />
                    </Panel>
                </div>
            </div >

        )
    }
}