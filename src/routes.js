import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayoutRoute from "./components/shared/layouts/MainLayout";

import Dashboard from './components/dashboard';
import Patients from './components/patient/patients';
import PatientForm from './components/patient/patient-form';
import OpdForm from './components/opd/opd-form';
import IpdForm from './components/ipd/ipd-form';

const routes = (
    <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <MainLayoutRoute path="/dashboard" component={Dashboard} />

      <MainLayoutRoute path="/patients" component={Patients} />
      <MainLayoutRoute path="/add-patient" component={PatientForm} />

      <MainLayoutRoute path="/add-opd" component={OpdForm} />
      <MainLayoutRoute path="/add-ipd" component={IpdForm} />
    </Switch>
  </BrowserRouter>
);

export default routes;