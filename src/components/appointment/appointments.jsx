import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { FullCalendar } from "primereact/fullcalendar";
import "@fullcalendar/core/main.css";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { appointmentTypeEnum } from "../../common/enums";
import { FULLCALENDAR_OPTION } from "../../common/constants";
import { Button } from "primereact/button";
import AppointmentTypeIndicator from "./appointment-indicator";
import AppointmentForm from "./appointment-form";
import ReactDOM from "react-dom";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const title = "Appointment";
export default class AppointmentCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      loading: false,
      selectedAppointment: null,
      controller: "appointments",
      includeProperties: "Patient",
    };
    this.repository = new repository();
    this.helper = new helper();
    this.options = FULLCALENDAR_OPTION;
  }
  getAppointments = () => {
    const { controller, includeProperties, filterString } = this.state;
    this.setState({ loading: true });
    this.repository
      .get(
        controller,
        `filter=${filterString} and isDeleted-neq-{${true}}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        res &&
          res.data &&
          res.data.map((item) => {
            item.title = item.patient.fullname;
            item.start = this.helper.formatDefaultDate(item.date);
            item.color =
              appointmentTypeEnum[item.appointmentType.toUpperCase()].color;
            item.extendedProps = {
              patientId: item.patientId,
              type: item.type,
            };
            return item;
          });
        this.setState({ appointments: res && res.data, loading: false });
        window.dispatchEvent(new Event("resize"));
      });
  };
  componentDidMount = () => {
    const appointmentTypeOptions =
      this.helper.enumToObject(appointmentTypeEnum);
    this.setState({ appointmentTypeOptions: appointmentTypeOptions });
  };
  saveAppointment = (updatedAppointment, id) => {
    const { appointmentTypeOptions } = this.state;
    let event = {
      id: updatedAppointment.id,
      title: updatedAppointment.patient.fullname,
      start: this.helper.formatDefaultDate(updatedAppointment.date),
      color: appointmentTypeOptions.filter(
        (m) => m.value === updatedAppointment.type
      )[0].color,
      extendedProps: {
        patientId: updatedAppointment.patientId,
        type: updatedAppointment.type,
      },
    };
    if (id) {
      let newEvent = this.fullcalendar.calendar.getEventById(event.id);
      newEvent.setProp("title", event.title);
      newEvent.setProp("color", event.color);
      newEvent.setExtendedProp("patientId", event.extendedProps.patientId);
      newEvent.setExtendedProp("type", event.extendedProps.type);
    } else this.fullcalendar.calendar.addEvent(event);
    this.setState({ editDialog: false });
  };
  eventEdit = (id) => {
    let event = this.fullcalendar.calendar.getEventById(id);
    let selectedAppointment = {
      id: event.id,
      patientId: {
        value: event.extendedProps.patientId,
        label: event.title,
      },
      date: event.start,
      type: event.extendedProps.type,
    };
    this.setState({
      editDialog: true,
      selectedAppointment: selectedAppointment,
      validationErrors: {},
    });
  };
  eventDelete = (id) => {
    const { controller } = this.state;
    let event = this.fullcalendar.calendar.getEventById(id);
    this.setState({
      deleteDialog: true,
      deleteCallback: () => {
        let flag = true;
        this.repository
          .delete(controller, `${event.id}?isDeleted=${flag}`)
          .then((res) => {
            event.remove();
            this.setState({ deleteDialog: false });
          });
      },
    });
  };
  render() {
    this.options.eventMouseEnter = (info) => {
      tippy(info.el, {
        content: info.event.title,
      });
      const content = (
        <div className="fc-content">
          <span className="fc-title">{info.event.title}</span>
          <div className="float-right" style={{ marginTop: "2px" }}>
            <button
              className="icon-button"
              onClick={() => this.eventEdit(info.event.id)}
            >
              <i className="pi pi-pencil" />
            </button>
            <button
              className="icon-button"
              onClick={() => this.eventDelete(info.event.id)}
            >
              <i className="pi pi-trash" />
            </button>
          </div>
        </div>
      );
      ReactDOM.render(content, info.el);
    };

    this.options.eventMouseLeave = (info) => {
      const content = (
        <div className="fc-content">
          <span className="fc-title">{info.event.title}</span>
        </div>
      );
      ReactDOM.render(content, info.el);
    };

    const {
      appointments,
      editDialog,
      deleteDialog,
      deleteCallback,
      appointmentTypeOptions,
      selectedAppointment,
      includeProperties,
      loading,
    } = this.state;
    const deleteDialogFooter = (
      <div>
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => deleteCallback()}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.setState({ deleteDialog: false })}
          className="p-button-secondary"
        />
      </div>
    );
    this.options.datesRender = (info) => {
      const startDate = this.helper.formatDefaultDate(info.view.activeStart);
      const endDate = this.helper.formatDefaultDate(info.view.activeEnd);
      const filter = `Date-gte-{${startDate}} and Date-lte-{${endDate}}`;
      this.setState({ filterString: filter }, () => {
        this.getAppointments();
      });
    };
    this.options.dateClick = (dateClickInfo) => {
      let selectedAppointment = {
        id: null,
        date: dateClickInfo.date,
        patientId: null,
        type: null,
      };
      this.setState({
        editDialog: true,
        selectedAppointment: selectedAppointment,
        validationErrors: {},
      });
    };
    return (
      <>
        <Panel
          header={
            <div className="p-panel-title">
              Appoinment Calendar
              {loading && <i className="fa fa-spinner fa-spin ml-2"></i>}
            </div>
          }
        >
          <div className="row">
            <div className="col-md-12">
              <AppointmentTypeIndicator options={appointmentTypeOptions} />
              <FullCalendar
                options={this.options}
                events={appointments}
                eventPositioned={this.handleEventPositioned}
                ref={(el) => (this.fullcalendar = el)}
              />
            </div>
          </div>
        </Panel>

        <Dialog
          header={`Edit ${title}`}
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          className="w-25"
          dismissableMask={false}
        >
          {editDialog && (
            <AppointmentForm
              selectedAppointment={selectedAppointment}
              hideEditDialog={() => this.setState({ editDialog: false })}
              saveAppointment={this.saveAppointment}
              includeProperties={includeProperties}
              appointmentTypeOptions={appointmentTypeOptions}
            />
          )}
        </Dialog>
        <Dialog
          header="Confirmation"
          visible={deleteDialog}
          footer={deleteDialogFooter}
          onHide={() => this.setState({ deleteDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to delete this item?
        </Dialog>
      </>
    );
  }
}
