import React, { Component } from 'react';
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { FullCalendar } from 'primereact/fullcalendar';
import '@fullcalendar/core/main.css';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { appointmentTypeEnum } from "../common/enums";
import { FULLCALENDAR_OPTION } from "../common/constants";
import InputField from "./shared/InputField";
import * as Constants from "../common/constants";
import ReactDOM from 'react-dom';

const title = "Appointment";
let operation = "";
export default class AppointmentCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.repository = new repository();
        this.helper = new helper();

        this.options = FULLCALENDAR_OPTION;
        this.options.datesRender = (info) => {
            const startDate = this.helper.formatFullcalendarDate(info.view.currentStart);
            const endDate = this.helper.formatFullcalendarDate(info.view.currentEnd);
            const filter = `Date-gte-{${startDate}} and Date-lte-{${endDate}}`
            this.setState({ filterString: filter }, () => {
                this.getAppointments()
            });
        }
        this.options.dateClick = (dateClickInfo) => {
            operation = "Add";
            let formFields = {
                date: dateClickInfo.date,
                patientId: null,
                type: null
            }
            this.setState({
                dialog: true,
                formFields: formFields
            });
        }
        this.options.eventClick = (eventClickInfo) => {
            operation = "Edit";
            let event = eventClickInfo.event;
            let formFields = {
                patientId: { value: event.extendedProps.patientId, label: event.title },
                date: event.start,
                type: event.extendedProps.type
            }
            this.setState({
                dialog: true,
                formFields: formFields
            })
        }
        this.options.eventRender = (info) => {
            // const content = <div>{info.event.title}<div>{info.event.description}</div></div>;
            // ReactDOM.render(content, info.el);
        }
    }
    getInitialState = () => ({
        dialog: false,
        appointments: [],
        loading: true,
        filterString: "",
        controller: "appointments",
        includeProperties: "Patient",
        isValidationFired: false,
        validationErrors: {},
        formFields: {
            date: "",
            patientId: null,
            type: ""
        }
    });
    componentDidMount = () => {
        this.setState({ appointmentTypeOptions: this.helper.enumToObject(appointmentTypeEnum) });
    }

    getAppointments = () => {
        const { controller, includeProperties, filterString } = this.state;
        this.repository.get(controller, `filter=${filterString}&includeProperties=${includeProperties}`, this.messages)
            .then(res => {
                res && res.data.map(item => {
                    item.title = item.patient.fullname;
                    item.start = this.helper.formatFullcalendarDate(item.date);
                    item.color = appointmentTypeEnum[item.appointmentType.toUpperCase()].color;
                    item.extendedProps = {
                        patientId: item.patientId,
                        type: item.type
                    };
                    return item;
                });
                this.setState({ appointments: res.data })
            });
    }
    handleChange = (e, action) => {
        // this.messages.clear();
        const { isValidationFired, formFields } = this.state;
        let fields = formFields;
        if (action)
            fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label } : null;
        else
            fields[e.target.name] = e.target.value;

        this.setState({
            formFields: fields
        });
        console.log(formFields)
        if (isValidationFired)
            this.handleValidation();
    };
    render() {
        const { appointments, dialog, appointmentTypeOptions } = this.state;
        const { date, patientId, type } = this.state.formFields
        return (
            <>
                <Panel header="Appointment Calendar">
                    <div className="row">
                        <div className="col-md-12">
                            <FullCalendar options={this.options} events={appointments} />
                        </div>
                    </div>
                </Panel>

                <Dialog header={`${operation} ${title}`} visible={dialog} onHide={() => this.setState({ dialog: false })}>
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                        <InputField name="date" title="Appointment Date" value={date} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                        <InputField name="patientId" value={patientId} title="Patient" onChange={this.handleChange} {...this.state}
                            onCreateOption={() => this.setState({ patientDialogVisible: true })} onInputChange={(e) => { e && this.setState({ patientName: e }) }}
                            controlType="select2" loadOptions={(e, callback) => this.helper.PatientOptions(e, callback, this.messages)} />
                        <InputField name="type" value={type} title="Appointment Type" onChange={this.handleChange} {...this.state} controlType="dropdown" options={appointmentTypeOptions} />
                        <div className="modal-footer">
                            <div className="row">
                                <button type="reset" className="btn btn-default">Reset</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </>
        );
    }
}