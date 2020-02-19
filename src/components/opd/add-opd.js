import React from "react";
import { Panel } from "primereact/panel";
import * as Constants from "../../common/constants";
import OpdForm from "./opd-form";

export default class AddOpd extends React.Component
{
  render()
  {
    return (
      <div className="w-75">
        <Panel header={Constants.ADD_OPD_TITLE} toggleable={true}>
          <OpdForm />
        </Panel>
      </div>
    );
  }
}