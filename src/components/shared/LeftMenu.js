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
                                    <li><NavLink to="/opds">Manage Opd</NavLink></li>
                                    <li><NavLink to="/ipds">Manage Ipd</NavLink></li>
                                </ul>
                            </li>
                            <li>
                                <a href="fontawesome.html">
                                    <i className="fa fa-bullhorn"></i>
                                    <span>Manage User</span>
                                </a>
                            </li>
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
                                    <li><NavLink to="/opd-report">Opd Report</NavLink></li>
                                    <li><NavLink to="/ipd-report">Ipd Report</NavLink></li>
                                    <li><NavLink to="/monthly-ipd-report">Monthly Ipd Report</NavLink></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        );
    }
}