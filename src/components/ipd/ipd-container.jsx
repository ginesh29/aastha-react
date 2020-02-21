import React from "react";
import { Panel } from "primereact/panel";
import * as Constants from "../../common/constants";
import IpdForm from "./ipd-form";

export default class IpdContainer extends React.Component {
  render() {
    return (
      <div className="row col-md-8">
        <Panel header={Constants.ADD_IPD_TITLE} toggleable={true}>
          <IpdForm />
        </Panel>
      </div>
    );
  }
}
