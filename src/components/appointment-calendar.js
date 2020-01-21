import React, { Component } from 'react';
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { appointmentTypeEnum } from "../common/enums";
import { FullCalendar } from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@fullcalendar/core/main.css';
import interactionPlugin from "@fullcalendar/interaction";

export default class AppointmentCalendar extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            appointments: [],
            loading: true,
            filterString: "",
            sortString: "id asc",
            controller: "appointments",
            includeProperties: "Patient",
            events: []
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getAppointments = () =>
    {
        const { filterString, sortString, includeProperties, controller } = this.state;
        return this.repository.get(controller, `filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`, this.messages)
            .then(res =>
            {
                res && res.data.map(item =>
                {
                    item.title = item.patient.firstname;
                    item.description = item.patient.fullname;
                    item.start = this.helper.formatFullcalendarDate(item.date);
                    item.color = appointmentTypeEnum[item.appointmentType.toUpperCase()].color;
                    return item;
                });
                this.setState({
                    appointments: res && res.data,
                    loading: false
                });
            })
    }
    componentDidMount()
    {
        const month = this.helper.getMonthFromDate();
        const year = this.helper.getYearFromDate();
        const filter = `Date.Month-eq-{${ month }} and Date.Year-eq-{${ year }}`;
        this.setState({ filterString: filter }, () =>
        {
            this.getAppointments();
        });
    }
    render()
    {
        const { appointments } = this.state;
        const options = {
            height: 750,
            plugins: [dayGridPlugin, interactionPlugin],
            defaultDate: '2020-01-01',//this.helper.formatFullcalendarDate(),//new Date(),
            editable: true,
            dateClick: function ()
            {
                alert()
            }
            // eventRender: function (event, element)
            // {
            //     // element.popover({
            //     //     animation: true,
            //     //     delay: 300,
            //     //     content: '<b>Inicio</b>:' + event.start + "<b>Fin</b>:" + event.end,
            //     //     trigger: 'hover'
            //     // });
            //     // var tooltip = new Tooltip(info.el, {
            //     //     title: info.event.extendedProps.description,
            //     //     placement: 'top',
            //     //     trigger: 'hover',
            //     //     container: 'body'
            //     // });
            // }
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <FullCalendar options={options} events={appointments} />
                </div>
            </div>
        );
    }
}