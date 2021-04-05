import React, { Component } from "react";
import { Redirect, Switch, BrowserRouter, Route } from "react-router-dom";

import MainLayoutRoute from "./components/shared/layouts/main-layout";

import Dashboard from "./components/dashboard";
import Patients from "./components/patient/patients";
import PatientContainer from "./components/patient/patient-container";
import Prescription from "./components/prescription";
import AdminPanel from "./components/admin-panel";
import OpdContainer from "./components/opd/opd-container";
import IpdContainer from "./components/ipd/ipd-container";
import Opds from "./components/opd/opds";
import Ipds from "./components/ipd/ipds";
import OpdReport from "./components/report/opd-report";
import IpdReport from "./components/report/ipd-report";
import MonthlyIpdReport from "./components/report/monthly-ipd-report";
import Appointments from "./components/appointment/appointments";
import Statistics from "./components/statistics";
import Login from "./components/account/login";
import DueDateCalculator from "./components/due-date-calculator";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <MainLayoutRoute exact path="/">
            <Redirect to="/dashboard" />
          </MainLayoutRoute>
          <MainLayoutRoute path="/dashboard" component={Dashboard} />

          <MainLayoutRoute path="/add-patient" component={PatientContainer} />
          <MainLayoutRoute path="/add-opd" component={OpdContainer} />
          <MainLayoutRoute path="/add-ipd" component={IpdContainer} />

          <MainLayoutRoute path="/patients" component={Patients} />
          <MainLayoutRoute path="/archive-patients" component={Patients} />

          <MainLayoutRoute path="/opds" component={Opds} />
          <MainLayoutRoute path="/archive-opds" component={Opds} />

          <MainLayoutRoute path="/ipds" component={Ipds} />
          <MainLayoutRoute path="/archive-ipds" component={Ipds} />
          <MainLayoutRoute path="/admin-panel" component={AdminPanel} />
          <MainLayoutRoute path="/archive-admin-panel" component={AdminPanel} />
          <MainLayoutRoute path="/prescription" component={Prescription} />
          <MainLayoutRoute path="/appointments" component={Appointments} />
          <MainLayoutRoute path="/statistics" component={Statistics} />
          <MainLayoutRoute path="/opd-report" component={OpdReport} />
          <MainLayoutRoute path="/ipd-report" component={IpdReport} />
          <MainLayoutRoute
            path="/due-date-calculator"
            component={DueDateCalculator}
          />
          <MainLayoutRoute
            path="/monthly-ipd-report"
            component={MonthlyIpdReport}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
