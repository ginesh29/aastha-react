import React, { Component } from "react";
import { Panel } from "primereact/panel";
import PatientForm from "./patient-form";
const title = "Patient Registration";
export default class AddPatient extends Component {
    render() {
        return (
            <div className="col-md-8">
                <div className="row">
                    <Panel header={title} toggleable={true}>
                        <PatientForm />
                    </Panel>
                </div>
            </div>
        )
    }
}