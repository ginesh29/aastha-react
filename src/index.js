import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./constant/routes";

export default class App extends React.Component {
  render() {
    return (routes)
  }
}
ReactDOM.render(<App />, document.getElementById('root'));