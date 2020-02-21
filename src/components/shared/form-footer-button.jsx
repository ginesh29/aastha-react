import React, { Component } from "react";
export default class FormFooterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { showReset } = this.props;
    return (
      <div className="modal-footer">
        {showReset && (
          <button type="reset" className="btn btn-secondary">
            Reset
          </button>
        )}
        <button type="submit" className="btn btn-info">
          Save
        </button>
      </div>
    );
  }
}
