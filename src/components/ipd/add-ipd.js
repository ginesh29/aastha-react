import React from "react";
import { Panel } from "primereact/panel";
import * as Constants from "../../common/constants";
import IpdForm from "./ipd-form";

export default class AddIpd extends React.Component {
    render() {
        return (
            <div className="col-md-12">
                <div className="row">
                    <Panel header={Constants.ADD_IPD_TITLE} toggleable={true}>
                        <IpdForm />
                    </Panel>
                </div>
            </div>
        );
    }
}