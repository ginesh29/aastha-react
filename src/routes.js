import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayout from "./components/shared/layouts/MainLayout";

import Dashboard from "./components/dashboard";
import Patients from "./components/patient/patients";
import PatientForm from "./components/patient/patient-form";
import OpdForm from "./components/opd/opd-form";
import IpdForm from "./components/ipd/ipd-form";
import Prescription from "./components/prescription";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

const routes = (
  <BrowserRouter basename={baseUrl}>
    <MainLayout>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" component={Dashboard} />

      <Route path="/add-patient" component={PatientForm} />
      <Route path="/patients" component={Patients} />
      <Route path="/archive-patients" component={Patients} />

      <Route path="/add-opd" component={OpdForm} />

      <Route path="/add-ipd" component={IpdForm} />

      <Route path="/prescription" component={Prescription} />
    </MainLayout>
  </BrowserRouter>
);
export default routes;
