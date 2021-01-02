import React, { Component } from "react";
export default class Login extends Component {
  state = {};
  componentDidMount = () => {
    document.body.style.backgroundColor = "#32323A";
  };
  render() {
    return (
      <div className="container">
        <form className="form-signin">
          <h2 className="form-signin-heading">User Login</h2>
          <div className="login-wrap">
            <div className="user-login-info">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                autoFocus
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
            <label className="checkbox">
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
            <button className="btn btn-lg btn-login btn-block" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
    );
  }
}
