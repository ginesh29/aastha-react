import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

//import LoginLayoutRoute from "./components/shared/layouts/LoginLayout";
import MainLayoutRoute from "./components/shared/layouts/MainLayout";

import Dashboard from './components/Dashboard';
import Patients from './components/patient/patients';
import PatientForm from './components/patient/patient-form';

const routes = (
    <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <MainLayoutRoute path="/dashboard" component={Dashboard} />
      <MainLayoutRoute path="/patients" component={Patients} />
      <MainLayoutRoute path="/patient-form" component={PatientForm} />
    </Switch>
  </BrowserRouter>
);

export default routes;