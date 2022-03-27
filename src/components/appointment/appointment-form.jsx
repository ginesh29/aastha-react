import React, { Component } from "react";
import InputField from "../shared/input-field";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import * as Constants from "../../common/constants";
import jquery from "jquery";
import FormFooterButton from "../shared/form-footer-button";

export default class AppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      date: "",
      patientId: null,
      type: "",
    },
    appointments: [],
    controller: "appointments",
    isValidationFired: false,
    validationErrors: {},
    loading: false,
  });
  handleSubmit = (e) => {
    const { controller } = this.state;
    const { id, date, patientId, type } = this.state.formFields;
    const { includeProperties, hideEditDialog, saveAppointment } = this.props;
    e.preventDefault();
    if (this.handleValidation()) {
      const appointment = {
        id: id,
        date: this.helper.formatDate(date, "en-US"),
        patientId: patientId.value,
        type: type,
      };
      this.repository
        .post(
          `${controller}?includeProperties=${includeProperties}`,
          appointment
        )
        .then((res) => {
          if (res && !res.errors) {
            this.setState({ loading: true });
            setTimeout(() => {
              hideEditDialog && hideEditDialog();
              saveAppointment && saveAppointment(res, appointment.id);
              !hideEditDialog && this.handleReset();
            }, 1000);
          }
        });
    }
  };
  handleReset = (e) => {
    this.setState(this.getInitialState());
  };
  handleValidation = (e) => {
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
      isValidationFired: true,
    });
    return isValid;
  };
  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    if (action)
      fields[action.name] =
        action !== Constants.SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label }
          : null;
    else fields[e.target.name] = e.target.value;

    this.setState({
      formFields: fields,
    });
    if (isValidationFired) this.handleValidation();
  };
  componentDidMount = () => {
    jquery("#errors").remove();
    const { selectedAppointment } = this.props;
    if (selectedAppointment)
      this.setState({
        formFields: selectedAppointment,
      });
  };
  render() {
    const { id, date, patientId, type } = this.state.formFields;
    const { appointmentTypeOptions } = this.props;
    const { loading } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name="date"
            title="Appointment Date"
            value={date}
            onChange={this.handleChange}
            {...this.state}
            controlType="datepicker"
            groupIcon="fa-calendar"
          />
          <InputField
            name="patientId"
            value={patientId}
            title="Patient"
            onChange={this.handleChange}
            {...this.state}
            onCreateOption={() => this.setState({ patienteditDialog: true })}
            onInputChange={(e) => {
              e && this.setState({ patientName: e });
            }}
            controlType="select2"
            loadOptions={(e, callback) =>
              this.helper.PatientOptions(e, callback)
            }
          />
          <InputField
            name="type"
            value={type}
            title="Appointment Type"
            onChange={this.handleChange}
            {...this.state}
            controlType="dropdown"
            options={appointmentTypeOptions}
          />
          <FormFooterButton showReset={!id} loading={loading} />
        </form>
      </>
    );
  }
}
