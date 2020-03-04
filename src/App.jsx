import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayout from "./components/shared/layouts/main-layout";

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

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        true ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
export default class App extends Component {
  render() {
    return (
      <MainLayout>
        <PrivateRoute exact path="/">
          <Redirect to="/dashboard" />
        </PrivateRoute>
        <PrivateRoute path="/dashboard" component={Dashboard} />

        <PrivateRoute path="/add-patient" component={PatientContainer} />
        <PrivateRoute path="/patients" component={Patients} />
        <PrivateRoute path="/archive-patients" component={Patients} />

        <PrivateRoute path="/add-opd" component={OpdContainer} />
        <PrivateRoute path="/opds" component={Opds} />
        <PrivateRoute path="/archive-opds" component={Opds} />

        <PrivateRoute path="/add-ipd" component={IpdContainer} />
        <PrivateRoute path="/ipds" component={Ipds} />
        <PrivateRoute path="/archive-ipds" component={Ipds} />

        <PrivateRoute path="/admin-panel" component={AdminPanel} />
        <PrivateRoute path="/archive-admin-panel" component={AdminPanel} />

        <PrivateRoute path="/prescription" component={Prescription} />
        <PrivateRoute path="/appointments" component={Appointments} />
        <PrivateRoute path="/statistics" component={Statistics} />
        <PrivateRoute path="/opd-report" component={OpdReport} />
        <PrivateRoute path="/ipd-report" component={IpdReport} />
        <PrivateRoute path="/monthly-ipd-report" component={MonthlyIpdReport} />
      </MainLayout>
    );
  }
}
