import React from "react";
import ReactDOM from "react-dom";
import routes from "./routes";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./index.css";

export default class App extends React.Component {
  render() {
    return routes;
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
