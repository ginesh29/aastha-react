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
import { Button } from 'primereact/button';
import AppointmentTypeIndicator from './shared/appointment-indicator';

const title = "Appointment";
export default class AppointmentCalendar extends Component
{
    constructor(props)
    {
        super(props);
        this.state = this.getInitialState();
        this.repository = new repository();
        this.helper = new helper();

        this.options = FULLCALENDAR_OPTION;
        this.options.datesRender = (info) =>
        {
            const startDate = this.helper.formatFullcalendarDate(info.view.currentStart);
            const endDate = this.helper.formatFullcalendarDate(info.view.currentEnd);
            const filter = `Date-gte-{${ startDate }} and Date-lte-{${ endDate }}`
            this.setState({ filterString: filter }, () =>
            {
                this.getAppointments()
            });
        }
        this.options.dateClick = (dateClickInfo) =>
        {
            let formFields = {
                id: null,
                date: dateClickInfo.date,
                patientId: null,
                type: null
            }
            this.setState({
                editDialog: true,
                formFields: formFields,
                validationErrors: {}
            });
        }
        this.options.eventClick = (eventClickInfo) =>
        {
            const { controller } = this.state;
            let event = eventClickInfo.event;
            let hasDeleteClass = eventClickInfo.jsEvent.target.classList.contains("pi-times")
            if (!hasDeleteClass) {
                let formFields = {
                    id: event.id,
                    patientId: { value: event.extendedProps.patientId, label: event.title },
                    date: event.start,
                    type: event.extendedProps.type
                }
                this.setState({
                    editDialog: true,
                    formFields: formFields,
                    validationErrors: {}
                })
            }
            else {
                this.setState({
                    deleteDialog: true,
                    deleteCallback: () =>
                    {
                        let flag = true;
                        this.repository.delete(controller, `${ event.id }?isDeleted=${ flag }`)
                            .then(res =>
                            {
                                event.remove();
                                this.setState({ deleteDialog: false })
                            })
                    }
                })
            }
        }
        this.options.eventRender = (info) =>
        {
            const content = <div className="fc-content">
                <span className="fc-title">{info.event.title}</span>
                <div className="pull-right">
                    <button className="icon-button" ><i className="pi pi-pencil" /></button>
                    <button className="icon-button" ><i className="pi pi-times" /></button>
                </div>
            </div>
            ReactDOM.render(content, info.el);
        }
    }
    getInitialState = () => ({
        editDialog: false,
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

    getAppointments = () =>
    {
        const { controller, includeProperties, filterString } = this.state;
        this.repository.get(controller, `filter=${ filterString } and isDeleted-neq-{${ true }}&includeProperties=${ includeProperties }`)
            .then(res =>
            {
                res && res.data.map(item =>
                {
                    item.title = item.patient.fullname;
                    item.start = this.helper.formatFullcalendarDate(item.date);
                    item.color = appointmentTypeEnum[item.appointmentType.toUpperCase()].color;
                    item.extendedProps = {
                        patientId: item.patientId,
                        type: item.type
                    };
                    return item;
                });
                this.setState({ appointments: res && res.data })
            });
    }
    handleSubmit = (e) =>
    {
        const { controller, includeProperties, appointmentTypeOptions } = this.state;
        const { id, date, patientId, type } = this.state.formFields;
        e.preventDefault();
        if (this.handleValidation()) {
            const appointment = {
                id: id,
                date: this.helper.formatDate(date, "en-US"),
                patientId: patientId.value,
                type: type
            };
            this.repository.post(`${ controller }?includeProperties=${ includeProperties }`, appointment)
                .then(res =>
                {
                    if (res) {
                        let event = {
                            id: res.id,
                            title: res.patient.fullname,
                            start: this.helper.formatFullcalendarDate(res.date),
                            color: appointmentTypeOptions.filter(m => m.value === res.type)[0].color,
                            extendedProps: {
                                patientId: res.patientId,
                                type: res.type
                            }
                        }

                        if (appointment.id > 0) {
                            let newEvent = this.fullcalendar.calendar.getEventById(event.id);
                            newEvent.setProp('title', event.title);
                            newEvent.setProp('color', event.color);
                            newEvent.setExtendedProp('patientId', event.extendedProps.patientId);
                            newEvent.setExtendedProp('type', event.extendedProps.type);
                        }
                        else
                            this.fullcalendar.calendar.addEvent(event)

                        this.setState({ editDialog: false })
                    }
                })
        }
    };
    handleReset = e =>
    {
        this.setState(this.getInitialState());
    };
    handleValidation = e =>
    {
        const { patientId, type } = this.state.formFields;
        let errors = {};
        let isValid = true;
        if (!patientId) {
            isValid = false;
            errors.patientId = "Patient is required";
        }
        if (!type) {
            isValid = false;
            errors.type = "Appointment Type is required";
        }
        this.setState({
            validationErrors: errors,
            isValidationFired: true
        });
        return isValid;
    };
    handleChange = (e, action) =>
    {
        const { isValidationFired, formFields } = this.state;
        let fields = formFields;
        if (action)
            fields[action.name] = action !== Constants.SELECT2_ACTION_CLEAR_TEXT ? e && { value: e.value, label: e.label } : null;
        else
            fields[e.target.name] = e.target.value;

        this.setState({
            formFields: fields
        });
        if (isValidationFired)
            this.handleValidation();
    };
    render()
    {
        const { appointments, editDialog, deleteDialog, deleteCallback } = this.state;
        const { id, date, patientId, type } = this.state.formFields
        const appointmentTypeOptions = this.helper.enumToObject(appointmentTypeEnum);
        const deleteDialogFooter = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={() => deleteCallback()} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialog: false })} className="p-button-secondary" />
            </div>
        );
        return (
            <>
                <Panel header="Appoinment Calendar" toggleable={true}>
                    <div className="row">
                        <div className="col-md-12">
                            <AppointmentTypeIndicator options={appointmentTypeOptions} />
                            <FullCalendar options={this.options} events={appointments} ref={(el) => this.fullcalendar = el} />
                        </div>
                    </div>
                </Panel>

                <Dialog header={`${ id > 0 ? "Edit" : "Add" } ${ title }`} visible={editDialog} onHide={() => this.setState({ editDialog: false })}>
                    {
                        editDialog &&
                        <form onSubmit={this.handleSubmit}>
                            <InputField name="date" title="Appointment Date" value={date} onChange={this.handleChange} {...this.state} controlType="datepicker" groupIcon="fa-calendar" />
                            <InputField name="patientId" value={patientId} title="Patient" onChange={this.handleChange} {...this.state}
                                onCreateOption={() => this.setState({ patienteditDialogVisible: true })} onInputChange={(e) => { e && this.setState({ patientName: e }) }}
                                controlType="select2" loadOptions={(e, callback) => this.helper.PatientOptions(e, callback)} />
                            <InputField name="type" value={type} title="Appointment Type" onChange={this.handleChange} {...this.state} controlType="dropdown" options={appointmentTypeOptions} />
                            <div className="modal-footer">
                                <div className="row">
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    }
                </Dialog>
                <Dialog header="Confirmation" visible={deleteDialog} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialog: false })}>
                    Are you sure you want to delete this item?
                </Dialog>
            </>
        );
    }
}