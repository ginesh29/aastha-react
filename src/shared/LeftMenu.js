import React from 'react';

function LeftMenu() {
    return (
        <aside>
            <div id="sidebar" className="nav-collapse">
                <div className="leftside-navigation">
                    <ul className="sidebar-menu" id="nav-accordion">
                        <li>
                            <a href="index-2.html">
                                <i className="fa fa-dashboard"></i>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li class="sub-menu">
                            <a href="javascript:;">
                                <i class="fa fa-laptop"></i>
                                <span>Add Data Entry</span>
                            </a>
                            <ul class="sub">
                                <li><a href="boxed_page.html">Patient Registration</a></li>
                                <li><a href="horizontal_menu.html">Opd Entry</a></li>
                                <li><a href="language_switch.html">Ipd Entry</a></li>
                            </ul>
                        </li>
                        <li class="sub-menu">
                            <a href="javascript:;">
                                <i class="fa fa-book"></i>
                                <span>Manage Entry</span>
                            </a>
                            <ul class="sub">
                                <li><a href="general.html">Manage Patient</a></li>
                                <li><a href="buttons.html">Manage Opd</a></li>
                                <li><a href="typography.html">Manage Ipd</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="fontawesome.html">
                                <i class="fa fa-bullhorn"></i>
                                <span>Manage User</span>
                            </a>
                        </li>
                        <li class="sub-menu">
                            <a href="javascript:;">
                                <i class="fa fa-th"></i>
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
                            <a href="javascript:;">
                                <i class="fa fa-tasks"></i>
                                <span>Prescription</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <i class="fa fa-tasks"></i>
                                <span>Appointment Calender</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;">
                                <i class="fa fa-tasks"></i>
                                <span>Statistics</span>
                            </a>
                        </li>
                        <li class="sub-menu">
                            <a href="javascript:;">
                                <i class="fa fa-envelope"></i>
                                <span>Report</span>
                            </a>
                            <ul class="sub">
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
export default LeftMenu;