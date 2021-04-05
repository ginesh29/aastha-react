import React, { Component } from "react";
import { Panel } from "primereact/panel";
class DueDateCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <Panel header="Due Date Calculator"></Panel>
        </div>
      </div>
    );
  }
}

export default DueDateCalculator;
