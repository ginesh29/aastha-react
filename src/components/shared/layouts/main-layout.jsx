import { Outlet, Navigate } from "react-router-dom";
import React, { Component } from "react";
import LeftMenu from "../left-menu";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("aastha-auth-token");
var expiration_date = null;
if (token != null && token.length) {
  var decoded_token = jwtDecode(token);
  expiration_date = new Date(decoded_token.exp * 1000);
}
export default class MainLayout extends Component {
  logout = () => {
    this.setState({
      loading: true,
    });
    localStorage.clear();
    window.location.href = "/";
  };
  render() {
    const { loading } = this.state ?? {};
    return (
      <section id="container">
        <header className="header fixed-top clearfix">
          <div className="brand">
            <div className="sidebar-toggle-box">
              <div className="fa fa-bars"></div>
            </div>
          </div>
          <div className="top-nav clearfix">
            <ul className="nav pull-right top-menu">
              <li>
                <div>
                  <button className="btn btn-info" onClick={this.logout}>
                    Log Out
                    {loading && <i className="fa fa-spinner fa-spin ml-2"></i>}
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </header>
        <LeftMenu />
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-sm-12">
                <div id="messages"></div>
                {token != null &&
                token.length > 0 &&
                expiration_date > new Date() ? (
                  <Outlet />
                ) : (
                  <Navigate to="/login" />
                )}
              </div>
            </div>
          </section>
        </section>
      </section>
    );
  }
}
