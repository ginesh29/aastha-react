import React from "react";
import ReactDOM from "react-dom";
import routes from "./routes";
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// import "primeflex/primeflex.css"
import "./assets/styles/theme.css";
import "./assets/styles/prime-custom.css";
import "./assets/styles/index.css";

import 'jquery/src/jquery';
import 'bootstrap/dist/js/bootstrap.js';

export default class App extends React.Component {
  render() {
    return routes;
  }
}
ReactDOM.render(<App />, document.getElementById("root"));