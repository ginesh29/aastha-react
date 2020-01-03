import React from 'react';
import { NavLink } from 'react-router-dom';

export default class LeftMenu extends React.Component {
    render() {
        return (
            <aside>
                <div id="sidebar" className="nav-collapse">
                    <div className="leftside-navigation">
                        <ul className="sidebar-menu" id="nav-accordion">
                            <li>
                                <NavLink to="/dashboard">
                                    <i className="fa fa-dashboard"></i>
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="sub-menu">
                                <a href="{}">
                                    <i className="fa fa-laptop"></i>
                                    <span>Add Data Entry</span>
                                </a>
                                <ul className="sub">
                                    <li><NavLink to="/add-patient">Patient Registration</NavLink></li>
                                    <li><NavLink to="/add-opd">Opd Entry</NavLink></li>
                                    <li><NavLink to="/add-ipd">Ipd Entry</NavLink></li>
                                </ul>
                            </li>
                            <li className="sub-menu">
                                <a href="{}">
                                    <i className="fa fa-book"></i>
                                    <span>Manage Entry</span>
                                </a>
                                <ul className="sub">
                                    <li><NavLink to="/patients">Manage Patient</NavLink></li>
                                    <li><a href="buttons.html">Manage Opd</a></li>
                                    <li><a href="typography.html">Manage Ipd</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="fontawesome.html">
                                    <i className="fa fa-bullhorn"></i>
                                    <span>Manage User</span>
                                </a>
                            </li>
                            <li className="sub-menu">
                                <a href="{}">
                                    <i className="fa fa-th"></i>
                                    <span>Admin Panel</span>
                                </a>
                                <ul className="sub">
                                    <li><a href="basic_table.html">Basic Table</a></li>
                                    <li><a href="responsive_table.html">Responsive Table</a></li>
                                    <li><a href="dynamic_table.html">Dynamic Table</a></li>
                                    <li><a href="editable_table.html">Editable Table</a></li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/prescription">
                                    <i className="fa fa-tasks"></i>
                                    <span>Prescription</span>
                                </NavLink>
                            </li>
                            <li>
                                <a href="{}">
                                    <i className="fa fa-tasks"></i>
                                    <span>Appointment Calender</span>
                                </a>
                            </li>
                            <li>
                                <a href="{}">
                                    <i className="fa fa-tasks"></i>
                                    <span>Statistics</span>
                                </a>
                            </li>
                            <li className="sub-menu">
                                <a href="{}">
                                    <i className="fa fa-envelope"></i>
                                    <span>Report</span>
                                </a>
                                <ul className="sub">
                                    <li><a href="mail.html">Opd Report</a></li>
                                    <li><a href="mail_compose.html">Ipd Report</a></li>
                                    <li><a href="mail_view.html">Monthly Ipd Report</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        );
    }
}