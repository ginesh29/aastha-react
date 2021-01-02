import React from "react";
import { Route, Redirect } from "react-router-dom";
import LeftMenu from "../left-menu";

const MainLayout = ({ children }) => (
  <section id="container">
    <header className="header fixed-top clearfix">
      <div className="brand">
        <div className="sidebar-toggle-box">
          <div className="fa fa-bars"></div>
        </div>
      </div>
    </header>
    <LeftMenu />
    <section id="main-content">
      <section className="wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div id="toast"></div>
            <div id="messages"></div>
            {children}
          </div>
        </div>
      </section>
    </section>
  </section>
);
const MainLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <MainLayout>
          {true ? <Component {...matchProps} /> : <Redirect to="/login" />}
        </MainLayout>
      )}
    />
  );
};
export default MainLayoutRoute;
