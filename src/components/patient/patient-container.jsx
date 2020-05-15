import React, { Component } from "react";
import { Panel } from "primereact/panel";
import PatientForm from "./patient-form";
import * as Constants from "../../common/constants";
export default class PatientContainer extends Component {
	render() {
		return (
			<div className="row col-md-9">
				<Panel header={Constants.PATIENT_REGISTRATION_TITLE} toggleable={true}>
					<PatientForm />
				</Panel>
			</div>
		);
	}
}
