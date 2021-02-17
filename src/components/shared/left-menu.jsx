import React from "react";
import { NavLink } from "react-router-dom";
import jquery from "jquery";
import { roleEnum } from "../../common/enums";
import jwt_decode from "jwt-decode";

export default class LeftMenu extends React.Component {
  componentDidMount = () => {
    const currentLink = jquery("ul.sidebar-menu a.active")
      .filter(function () {
        // eslint-disable-next-line
        return (
          this.href === window.location ||
          window.location.href.includes(this.href)
        );
      })
      .closest(".sub");
    currentLink.css("display", "block");
    currentLink.siblings().addClass("active");
  };
  render() {
    const token = localStorage.getItem("aastha-auth-token");
    if (token != null && token.length > 0) {
      var decoded_token = jwt_decode(token);
      var role = Number(decoded_token.Role);
    }
    return (
      <aside>
        <div id="sidebar">
          <div className="leftside-navigation">
            <ul className="sidebar-menu" id="nav-accordion">
              {role === roleEnum["ADMIN"].value && (
                <li>
                  <NavLink to="/dashboard">
                    <i className="fa fa-dashboard"></i>
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              )}
              <li className="sub-menu">
                <a href="{}">
                  <i className="fa fa-laptop"></i>
                  <span>Add Data Entry</span>
                </a>
                <ul className="sub">
                  <li>
                    <NavLink to="/add-patient">Patient Registration</NavLink>
                  </li>
                  <li>
                    <NavLink to="/add-opd">Opd Entry</NavLink>
                  </li>
                  <li>
                    <NavLink to="/add-ipd">Ipd Entry</NavLink>
                  </li>
                </ul>
              </li>
              <li className="sub-menu">
                <a href="{}">
                  <i className="fa fa-book"></i>
                  <span>Manage Entry</span>
                </a>
                <ul className="sub">
                  <li>
                    <NavLink to="/patients">Manage Patient</NavLink>
                  </li>
                  <li>
                    <NavLink to="/opds">Manage Opd</NavLink>
                  </li>
                  <li>
                    <NavLink to="/ipds">Manage Ipd</NavLink>
                  </li>
                </ul>
              </li>
              {role === roleEnum["ADMIN"].value && (
                <>
                  {/* <li>
                    <NavLink to="users">
                      <i className="fa fa-bullhorn"></i>
                      <span>Manage User</span>
                    </NavLink>
                  </li> */}
                  <li className="sub-menu">
                    <NavLink to="/admin-panel">
                      <i className="fa fa-th"></i>
                      <span>Admin Panel</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/prescription">
                      <i className="fa fa-tasks"></i>
                      <span>Prescription</span>
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink to="/appointments">
                  <i className="fa fa-tasks"></i>
                  <span>Appointments</span>
                </NavLink>
              </li>
              {role === roleEnum["ADMIN"].value && (
                <li>
                  <NavLink to="/statistics">
                    <i className="fa fa-tasks"></i>
                    <span>Statistics</span>
                  </NavLink>
                </li>
              )}
              <li className="sub-menu">
                <a href="{}">
                  <i className="fa fa-envelope"></i>
                  <span>Report</span>
                </a>
                <ul className="sub">
                  <li>
                    <NavLink to="/opd-report">Opd Report</NavLink>
                  </li>
                  <li>
                    <NavLink to="/ipd-report">Ipd Report</NavLink>
                  </li>
                  {role === roleEnum["ADMIN"].value && (
                    <li>
                      <NavLink to="/monthly-ipd-report">
                        Monthly Ipd Report
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
