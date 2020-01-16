import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayout from "./components/shared/layouts/MainLayout";

import Dashboard from "./components/dashboard";
import Patients from "./components/patient/patients";
import AddPatient from "./components/patient/add-patient";
import Prescription from "./components/prescription";
import AdminPanel from "./components/admin-panel";
import AddOpd from "./components/opd/add-opd";
import AddIpd from "./components/ipd/add-ipd";
import Opds from "./components/opd/opds";
import Ipds from "./components/ipd/ipds";
import OpdReport from "./components/report/opd-report";
import IpdReport from "./components/report/ipd-report";
import MonthlyIpdReport from "./components/report/monthly-ipd-report";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

const routes = (
  <BrowserRouter basename={baseUrl}>
    <MainLayout>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" component={Dashboard} />

      <Route path="/add-patient" component={AddPatient} />
      <Route path="/patients" component={Patients} />
      <Route path="/archive-patients" component={Patients} />

      <Route path="/add-opd" component={AddOpd} />
      <Route path="/opds" component={Opds} />

      <Route path="/add-ipd" component={AddIpd} />
      <Route path="/ipds" component={Ipds} />

      <Route path="/admin-panel" component={AdminPanel} />

      <Route path="/prescription" component={Prescription} />

      <Route path="/opd-report" component={OpdReport} />
      <Route path="/ipd-report" component={IpdReport} />
      <Route path="/monthly-ipd-report" component={MonthlyIpdReport} />
    </MainLayout>
  </BrowserRouter>
);
export default routes;
