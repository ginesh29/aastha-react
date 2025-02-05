import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import Login from "./components/account/login";
import DueDateCalculator from "./components/due-date-calculator";
import PatientsHistoryReport from "./components/report/patients-history-report";
import FormFContainer from "./components/formf/formf-container";
import FormFs from "./components/formf/formfs";
import ChangeFormFPassword from "./components/change-formF-password";

export default class App extends Component {
  render() {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route exact path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/change-password" element={<ChangeFormFPassword />} />

          <Route path="/add-patient" element={<PatientContainer />} />
          <Route path="/add-opd" element={<OpdContainer />} />
          <Route path="/add-ipd" element={<IpdContainer />} />
          <Route path="/add-formf" element={<FormFContainer />} />

          <Route path="/patients" element={<Patients />} />
          <Route path="/opds" element={<Opds />} />
          <Route path="/ipds" element={<Ipds />} />
          <Route path="/formfs" element={<FormFs />} />

          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route
            path="/patients-history-report"
            element={<PatientsHistoryReport />}
          />
          <Route path="/opd-report" element={<OpdReport />} />
          <Route path="/ipd-report" element={<IpdReport />} />
          <Route path="/due-date-calculator" element={<DueDateCalculator />} />
          <Route path="/monthly-ipd-report" element={<MonthlyIpdReport />} />
        </Route>
      </Routes>
    );
  }
}
