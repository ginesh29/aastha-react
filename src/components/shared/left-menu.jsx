import React from "react";
import { NavLink } from "react-router-dom";
// import { PanelMenu } from "primereact/panelmenu";

export default class LeftMenu extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     items: [
  //       {
  //         label: "File",
  //         icon: "pi pi-fw pi-file",
  //         items: [
  //           {
  //             label: "New",
  //             icon: "pi pi-fw pi-plus",
  //             items: [
  //               {
  //                 label: "Bookmark",
  //                 icon: "pi pi-fw pi-bookmark"
  //               },
  //               {
  //                 label: "Video",
  //                 icon: "pi pi-fw pi-video"
  //               }
  //             ]
  //           },
  //           {
  //             label: "Delete",
  //             icon: "pi pi-fw pi-trash"
  //           },
  //           {
  //             label: "Export",
  //             icon: "pi pi-fw pi-external-link"
  //           }
  //         ]
  //       },
  //       {
  //         label: "Edit",
  //         icon: "pi pi-fw pi-pencil",
  //         items: [
  //           {
  //             label: "Left",
  //             icon: "pi pi-fw pi-align-left"
  //           },
  //           {
  //             label: "Right",
  //             icon: "pi pi-fw pi-align-right"
  //           },
  //           {
  //             label: "Center",
  //             icon: "pi pi-fw pi-align-center"
  //           },
  //           {
  //             label: "Justify",
  //             icon: "pi pi-fw pi-align-justify"
  //           }
  //         ]
  //       },
  //       {
  //         label: "Users",
  //         icon: "pi pi-fw pi-user",
  //         items: [
  //           {
  //             label: "New",
  //             icon: "pi pi-fw pi-user-plus"
  //           },
  //           {
  //             label: "Delete",
  //             icon: "pi pi-fw pi-user-minus"
  //           },
  //           {
  //             label: "Search",
  //             icon: "pi pi-fw pi-users",
  //             items: [
  //               {
  //                 label: "Filter",
  //                 icon: "pi pi-fw pi-filter",
  //                 items: [
  //                   {
  //                     label: "Print",
  //                     icon: "pi pi-fw pi-print"
  //                   }
  //                 ]
  //               },
  //               {
  //                 icon: "pi pi-fw pi-bars",
  //                 label: "List"
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         label: "Events",
  //         icon: "pi pi-fw pi-calendar",
  //         items: [
  //           {
  //             label: "Edit",
  //             icon: "pi pi-fw pi-pencil",
  //             items: [
  //               {
  //                 label: "Save",
  //                 icon: "pi pi-fw pi-calendar-plus"
  //               },
  //               {
  //                 label: "Delete",
  //                 icon: "pi pi-fw pi-calendar-minus"
  //               }
  //             ]
  //           },
  //           {
  //             label: "Archieve",
  //             icon: "pi pi-fw pi-calendar-times",
  //             items: [
  //               {
  //                 label: "Remove",
  //                 icon: "pi pi-fw pi-calendar-minus"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }
  render() {
    // const { items } = this.state;
    return (
      <aside>
        <div id="sidebar" className="nav-collapse">
          <div className="leftside-navigation">
            {/* <PanelMenu model={items} /> */}
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
              <li>
                <NavLink to="/users">
                  <i className="fa fa-bullhorn"></i>
                  <span>Manage User</span>
                </NavLink>
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
                <NavLink to="/appointments">
                  <i className="fa fa-tasks"></i>
                  <span>Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/statistics">
                  <i className="fa fa-tasks"></i>
                  <span>Statistics</span>
                </NavLink>
              </li>
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
                  <li>
                    <NavLink to="/monthly-ipd-report">
                      Monthly Ipd Report
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    );
  }
}
