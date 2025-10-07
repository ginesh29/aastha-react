import React, { Component } from "react";
import InputField from "./shared/input-field";
import { helper } from "../common/helpers";
import { repository } from "../common/repository";
import * as Constants from "../common/constants";
import { Panel } from "primereact/panel";
import FormFooterButton from "./shared/form-footer-button";
import { jwtDecode } from "jwt-decode";
import jquery from "jquery";

const controller = "users";
export default class ChangeFormFPassword extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = (formFUsername) => ({
    formFields: {
      formFUsername: formFUsername,
      formFOldPassword: "",
      formFPassword: "",
      formFConfirmPassword: "",
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
    const { id, formFUsername, formFOldPassword, formFPassword } =
      this.state.formFields ?? {};
    if (this.handleValidation()) {
      const user = {
        userId: id || 0,
        username: formFUsername,
        oldPassword: formFOldPassword,
        password: formFPassword,
      };
      this.setState({ loading: true });
      this.repository
        .post(`${controller}/ChangeFormFPassword`, user)
        .then((res) => {
          setTimeout(() => {
            this.setState({
              loading: false,
            });
          }, 1000);
        });
    }
  };
  handleValidation = (e) => {
    const { formFPassword, formFOldPassword, formFConfirmPassword } =
      this.state.formFields ?? {};
    let errors = {};
    let isValid = true;
    if (!formFOldPassword) {
      isValid = false;
      errors.formFOldPassword = "Form F Old Password is required";
    }
    if (!formFPassword) {
      isValid = false;
      errors.formFPassword = "Form F New Password is required";
    }
    if (!formFConfirmPassword) {
      isValid = false;
      errors.formFConfirmPassword = "Form F Confirm Password is required";
    }
    if (formFPassword !== formFConfirmPassword) {
      isValid = false;
      errors.formFConfirmPassword = "Form F Confirm Password mismatch";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };

  handleReset = (e) => {
    const { formFUsername } = this.state.formFields ?? {};
    this.setState(this.getInitialState(formFUsername));
  };

  componentDidMount = () => {
    jquery("#errors").remove();
    const token = localStorage.getItem("aastha-auth-token");
    if (token != null && token.length > 0) {
      var decoded_token = jwtDecode(token);
      var userId = Number(decoded_token.UserId);
      this.repository.get(`${controller}/${userId}`, "").then((res) => {
        this.setState({
          formFields: res,
        });
      });
    }
  };
  render() {
    const { formFUsername } = this.state.formFields ?? {};
    const { loading } = this.state;
    return (
      <>
        <div className="row col-md-4">
          <Panel header="Form F Change Password" toggleable={true}>
            <div id="validation-message"></div>
            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
              <InputField
                name="formFUsername"
                title="FormF Username"
                value={formFUsername || ""}
                readOnly="readOnly"
                className="p-readonly"
                onChange={this.handleChange}
                {...this.state}
              />
              <InputField
                name="formFOldPassword"
                title="Form F Old Password"
                type="password"
                onChange={this.handleChange}
                {...this.state}
              />
              <InputField
                name="formFPassword"
                title="Form F New Password"
                type="password"
                onChange={this.handleChange}
                {...this.state}
              />
              <InputField
                name="formFConfirmPassword"
                title="Form F Confirm Password"
                type="password"
                onChange={this.handleChange}
                {...this.state}
              />
              <FormFooterButton loading={loading} />
            </form>
          </Panel>
        </div>
      </>
    );
  }
}
