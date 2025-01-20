import React, { Component } from "react";
import InputField from "../shared/input-field";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import * as Constants from "../../common/constants";
import jquery from "jquery";
import FormFooterButton from "../shared/form-footer-button";
import { departmentEnum } from "../../common/enums";

const controller = "payments";
export default class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      id: "",
      paymentDate: "",
      paymentMode: "",
      amount: null,
    },
    isValidationFired: false,
    validationErrors: {},
    loading: false,
  });
  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    jquery("#errors").remove();

    let fields = formFields ?? {};
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
  handleSubmit = (e) => {
    e.preventDefault();
    const { id, paymentDate, paymentMode, amount } =
      this.state.formFields ?? {};
    const { hideEditDialog, getPayments, type } = this.props;
    if (this.handleValidation()) {
      const payment = {
        id: id || 0,
        opdId: type === departmentEnum.OPD ? this.props.id : null,
        ipdId: type === departmentEnum.IPD ? this.props.id : null,
        dept:
          type === departmentEnum.OPD
            ? departmentEnum.OPD.value
            : departmentEnum.IPD.value,
        paymentDate: this.helper.formatDefaultDate(paymentDate),
        paymentMode: paymentMode,
        amount: amount,
      };
      this.setState({ loading: true });
      this.repository.post(`${controller}`, payment).then((res) => {
        if (res && !res.errors) {
          setTimeout(() => {
            hideEditDialog && hideEditDialog();
            getPayments && getPayments(this.props.id, type);
            !hideEditDialog && this.handleReset();
          }, 1000);
        } else this.setState({ loading: false });
      });
    }
  };
  handleValidation = (e) => {
    const { paymentDate, paymentMode, amount } = this.state.formFields ?? {};
    let errors = {};
    let isValid = true;
    if (!paymentDate) {
      isValid = false;
      errors.paymentDate = "Date is required";
    }
    if (!paymentMode) {
      isValid = false;
      errors.paymentMode = "Mode is required";
    }
    if (!amount) {
      isValid = false;
      errors.amount = "Amount is required";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };

  handleReset = (e) => {
    this.setState(this.getInitialState());
  };

  componentDidMount = () => {
    jquery("#errors").remove();

    const { selectedPayment } = this.props;
    if (selectedPayment) {
      selectedPayment.date =
        selectedPayment.paymentDate && new Date(selectedPayment.paymentDate);
      this.setState({
        formFields: selectedPayment,
      });
    }
  };
  render() {
    const { id, date, paymentMode, amount } = this.state.formFields ?? {};
    const { loading } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div id="validation-message"></div>
          <div className="row">
            <div className="col">
              <InputField
                name="paymentDate"
                title="Date"
                value={date || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
              />
            </div>
            <div className="col">
              <InputField
                name="paymentMode"
                title="Mode"
                value={paymentMode || null}
                onChange={this.handleChange}
                {...this.state}
                controlType="dropdown"
                options={Constants.paymentModeOptions}
              />
            </div>
            <div className="col">
              <InputField
                name="amount"
                title="Amount"
                value={amount || ""}
                onChange={this.handleChange}
                {...this.state}
                controlType="input-group-addon"
                groupIcon="fa-inr"
                keyfilter="pint"
                className="text-right"
              />
            </div>
          </div>
          <FormFooterButton showReset={!id} loading={loading} />
        </form>
      </>
    );
  }
}
