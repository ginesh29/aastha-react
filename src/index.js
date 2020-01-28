import React from "react";
import ReactDOM from "react-dom";
import routes from "./routes";
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./assets/styles/style.css";
import "./assets/styles/index.css";

import 'jquery/src/jquery';
import 'bootstrap/dist/js/bootstrap.js';
// import 'jquery.scrollto/jquery.scrollTo.min.js';
// import "dcjqaccordion/jquery.dcjqaccordion.2.7.min.js"
// import "dcjqaccordion"
// import "dcjqaccordion"
//import './assets/scripts/jquery.dcjqaccordion.2.7.js'
// import './assets/scripts/jquery.scrollTo.min.js'
// import '.assets/scripts/jquery.slimscroll.js'
// import './assets/scripts/scripts.js'

// <!--common script init for all pages-->
// <script src="assets/scripts/scripts.js"></script>

export default class App extends React.Component
{
  render()
  {
    return routes;
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
