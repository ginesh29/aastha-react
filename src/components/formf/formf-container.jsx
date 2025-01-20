import React from "react";
import { Panel } from "primereact/panel";
import FormFForm from "./formf-form";

export default class FormFContainer extends React.Component {
  render() {
    return (
      <div className="row col-md-8">
        <Panel header="Add Form F Entry" toggleable={true}>
          <FormFForm />
        </Panel>
      </div>
    );
  }
}
