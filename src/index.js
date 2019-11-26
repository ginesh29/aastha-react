import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Patients from './patient/patients'
import PatientForm from './patient/patient-form'

const routing = (
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/patients" component={Patients} />
        <Route path="/patient-from" component={PatientForm} />
      </div>
    </Router>
  ) 
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
