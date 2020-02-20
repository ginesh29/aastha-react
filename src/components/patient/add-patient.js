import React, { Component } from "react";
import { Panel } from "primereact/panel";
import PatientForm from "./patient-form";
import * as Constants from "../../common/constants";
export default class AddPatient extends Component
{
    render()
    {
        return (
            <div className="row col-lg-6 col-md-9">
                <Panel header={Constants.PATIENT_REGISTRATION_TITLE} toggleable={true}>
                    <PatientForm />
                </Panel>
            </div>
        )
    }
}