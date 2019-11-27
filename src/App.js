import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'; 
// import logo from './logo.svg';
import './App.css';

// import LoginLayoutRoute from "./shared/layouts/LoginLayout";  
import MainLayoutRoute from "./shared/layouts/MainLayout";

import Dashboard from './Dashboard';
import Patients from './patient/patients';
import PatientForm from './patient/patient-form';

function App() {
    return (
        <Router>  
        <Switch>  
          <Route exact path="/">  
            <Redirect to="/dashboard"/>  
          </Route>  
          <MainLayoutRoute path="/dashboard" component={Dashboard} />
          <MainLayoutRoute path="/patients" component={Patients} />  
          <MainLayoutRoute path="/patient-form" component={PatientForm} />  
        </Switch>  
      </Router>  
    );
}
export default App;
