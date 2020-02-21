import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayout from "./components/shared/layouts/MainLayout";

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
import Users from "./components/users";
import MonthlyIpdReport from "./components/report/monthly-ipd-report";
import AppointmentCalendar from "./components/appointment-calendar";
import Statistics from "./components/statistics";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

const routes = (
  <BrowserRouter basename={baseUrl}>
    <MainLayout>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" component={Dashboard} />

      <Route path="/add-patient" component={PatientContainer} />
      <Route path="/patients" component={Patients} />
      <Route path="/archive-patients" component={Patients} />

      <Route path="/add-opd" component={OpdContainer} />
      <Route path="/opds" component={Opds} />
      <Route path="/archive-opds" component={Opds} />

      <Route path="/add-ipd" component={IpdContainer} />
      <Route path="/ipds" component={Ipds} />
      <Route path="/archive-ipds" component={Ipds} />

      <Route path="/users" component={Users} />
      <Route path="/archive-users" component={Users} />

      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/archive-admin-panel" component={AdminPanel} />

      <Route path="/prescription" component={Prescription} />
      <Route path="/appointment-calendar" component={AppointmentCalendar} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/opd-report" component={OpdReport} />
      <Route path="/ipd-report" component={IpdReport} />
      <Route path="/monthly-ipd-report" component={MonthlyIpdReport} />
    </MainLayout>
  </BrowserRouter>
);
export default routes;
