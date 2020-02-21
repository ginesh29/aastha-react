import React from "react";
import { Route } from "react-router-dom";
import { render } from "react-dom";

export default class LoginLayout extends React.Component {
  render() {
    return (
      <div>
        <p>This is the First Layout</p>
        {this.props.children}
      </div>
    );
  }
}
