import React, { Component } from 'react';
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { FullCalendar } from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@fullcalendar/core/main.css';
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from 'primereact/dialog';

export default class AppointmentCalendar extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            dialog: false,
            appointments: [],
            loading: true,
            filterString: "",
            controller: "appointments",
            includeProperties: "Patient",
            events: []
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    onClick = () =>
    {
        this.setState({ dialog: true });
    }

    onHide = () =>
    {
        this.setState({ dialog: false });
    }

    render()
    {
        const options = {
            firstDay: 1,
            eventLimit: 6,
            hiddenDays: [0],
            height: 900,
            plugins: [dayGridPlugin, interactionPlugin],
            dateClick: (arg) =>
            {
                //console.log(arg.jsEvent)
                arg.jsEvent.preventDefault();
                this.setState({ dialog: true });
            },
            // eventClick: function (calEvent, jsEvent, view)
            // {
            //     var title = prompt('Event Title:', calEvent.title, 'Event Title:', calEvent.title, { buttons: { Ok: true, Cancel: false } });

            //     // if (title) {
            //     //     calEvent.title = title;
            //     //     calendar.fullCalendar('updateEvent', calEvent);
            //     // }
            // }
            // eventClick: (info) =>
            // {
            //     info.jsEvent.preventDefault(); // don't let the browser navigate

            //     this.setState({ dialog: true });
            // }
        }
        return (
            <>
                <h3 className="report-header">Appointment Calendar</h3>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <FullCalendar options={options}
                            events={
                                (fetchInfo, successCallback) => this.helper.getAppointments(fetchInfo, successCallback)
                            } />
                    </div>
                </div >
                <Dialog header="Godfather I" visible={this.state.dialog} onHide={this.onHide} >
                    The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding.
                    His beloved son Michael has just come home from the war, but does not intend to become part of his father's business.
                    Through Michael's life the nature of the family business becomes clear. The business of the family is just like the head of the family,
                    kind and benevolent to those who give respect, but given to ruthless violence whenever anything stands against the good of the family.
                    </Dialog>
            </>
        );
    }
}