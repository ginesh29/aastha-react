import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import InputField from "../shared/input-field";
import { Checkbox } from "primereact/checkbox";
import { Messages } from "primereact/messages";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      username: "",
      password: "",
    },
    loading: false,
    passwordHidden: true,
    rememberme: false,
    isValidationFired: false,
    validationErrors: {},
  });
  componentDidMount = () => {
    document.body.style.backgroundColor = "#32323A";
    localStorage.removeItem("aastha-auth-token");
  };
  handleChange = (e) => {
    const { isValidationFired, formFields } = this.state;
    let fields = formFields;
    fields[e.target.name] = e.target.value;
    this.setState({
      formFields: fields,
    });
    if (isValidationFired) this.handleValidation();
  };
  handleValidation = (e) => {
    const { username, password } = this.state.formFields;
    let errors = {};
    let isValid = true;
    if (!username) {
      isValid = false;
      errors.username = "Username is required";
    }
    if (!password) {
      isValid = false;
      errors.password = "Password is required";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state.formFields;
    if (this.handleValidation()) {
      this.setState({ loading: true });
      const patient = {
        username: username,
        password: password,
        rememberme: this.state.rememberme,
      };
      this.repository.post(`auth/generatetoken`, patient).then((res) => {
        this.messages.clear();
        if (res) {
          this.messages.show({
            severity: "success",
            summary: "Successfully logged in",
            sticky: true,
            closable: false,
          });
          localStorage.setItem("aastha-auth-token", res.token);
          window.location.href = "dashboard";
        } else {
          this.messages.show({
            severity: "error",
            detail: "Enter valid Username & Password",
            sticky: true,
          });
        }
        this.setState({ loading: false });
      });
    }
  };
  showPassword = (e) => {
    e.preventDefault();
    this.setState({ passwordHidden: !this.state.passwordHidden });
  };
  render() {
    return (
      <div className="container">
        <div id="messages"></div>
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h2 className="form-signin-heading">User Login</h2>
          <Messages ref={(el) => (this.messages = el)}></Messages>
          <div className="login-wrap">
            <div className="user-login-info">
              <div id="msg-container"></div>
              <InputField
                name="username"
                title="Username"
                onChange={this.handleChange}
                {...this.state}
              />
              <InputField
                name="password"
                title="Password"
                controlType="input-group-addon"
                groupIcon={`fa-eye${
                  !this.state.passwordHidden ? "-slash" : ""
                }`}
                type={this.state.passwordHidden ? "password" : "text"}
                onChange={this.handleChange}
                onInputButtonClick={this.showPassword}
                {...this.state}
              />
            </div>
            <label className="checkbox">
              <Checkbox
                inputId="rememberme"
                onChange={(e) => this.setState({ rememberme: e.checked })}
                checked={this.state.rememberme}
              ></Checkbox>
              <label htmlFor="rememberme" className="p-checkbox-label">
                Remember me
              </label>
            </label>
            <button
              className="btn btn-lg btn-login btn-block"
              disabled={this.state.loading}
            >
              {this.state.loading ? "Loading " : "Sign in"}
              <i
                className={`${
                  this.state.loading ? "fa fa-spinner fa-spin" : ""
                }`}
              ></i>
            </button>
          </div>
        </form>
      </div>
    );
  }
}
