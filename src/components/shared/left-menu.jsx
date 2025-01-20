import React from "react";
import { Link } from "react-router-dom";
import jquery from "jquery";
import { roleEnum } from "../../common/enums";
import { jwtDecode } from "jwt-decode";

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
      var decoded_token = jwtDecode(token);
      var role = Number(decoded_token.Role);
    }
    return (
      <aside>
        <div id="sidebar">
          <div className="leftside-navigation">
            <ul className="sidebar-menu" id="nav-accordion">
              {role === roleEnum["ADMIN"].value && (
                <li>
                  <Link to="/dashboard">
                    <i className="fa fa-dashboard"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}
              <li className="sub-menu">
                <a href="{}">
                  <i className="fa fa-laptop"></i>
                  <span>Add Data Entry</span>
                </a>
                <ul className="sub">
                  <li>
                    <Link to="/add-patient">Patient Registration</Link>
                  </li>
                  <li>
                    <Link to="/add-opd">Opd Entry</Link>
                  </li>
                  <li>
                    <Link to="/add-ipd">Ipd Entry</Link>
                  </li>
                  <li>
                    <Link to="/add-formf">Form F Entry</Link>
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
                    <Link to="/patients">Manage Patient</Link>
                  </li>
                  <li>
                    <Link to="/opds">Manage Opd</Link>
                  </li>
                  <li>
                    <Link to="/ipds">Manage Ipd</Link>
                  </li>
                  <li>
                    <Link to="/formfs">Manage Form F</Link>
                  </li>
                </ul>
              </li>
              {role === roleEnum["ADMIN"].value && (
                <>
                  {/* <li>
                    <Link to="users">
                      <i className="fa fa-bullhorn"></i>
                      <span>Manage User</span>
                    </Link>
                  </li> */}
                  <li className="sub-menu">
                    <Link to="/admin-panel">
                      <i className="fa fa-th"></i>
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/prescription">
                      <i className="fa fa-tasks"></i>
                      <span>Prescription</span>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/appointments">
                  <i className="fa fa-tasks"></i>
                  <span>Appointments</span>
                </Link>
              </li>
              {role === roleEnum["ADMIN"].value && (
                <>
                  {/* <li>
                    <Link to="/due-date-calculator">
                      <i className="fa fa-tasks"></i>
                      <span>Due Date Calculator</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/statistics">
                      <i className="fa fa-tasks"></i>
                      <span>Statistics</span>
                    </Link>
                  </li>
                </>
              )}
              <li className="sub-menu">
                <a href="{}">
                  <i className="fa fa-envelope"></i>
                  <span>Report</span>
                </a>
                <ul className="sub">
                  <li>
                    <Link to="/patients-history-report">
                      Patient History Report
                    </Link>
                  </li>
                  <li>
                    <Link to="/opd-report">Opd Report</Link>
                  </li>
                  <li>
                    <Link to="/ipd-report">Ipd Report</Link>
                  </li>
                  {role === roleEnum["ADMIN"].value && (
                    <li>
                      <Link to="/monthly-ipd-report">Monthly Ipd Report</Link>
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
