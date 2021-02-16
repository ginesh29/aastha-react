import React from "react";
import { Route, Redirect } from "react-router-dom";
import LeftMenu from "../left-menu";
import jwt_decode from "jwt-decode";

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
            <div id="messages"></div>
            {children}
          </div>
        </div>
      </section>
    </section>
  </section>
);
const MainLayoutRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("aastha-auth-token");
  var expiration_date = null;
  if (token != null && token.length > 0) {
    var decoded_token = jwt_decode(token);
    expiration_date = new Date(decoded_token.exp * 1000);
  }
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <MainLayout>
          {token != null && token.length > 0 && expiration_date > new Date() ? (
            <Component {...matchProps} />
          ) : (
            <Redirect to="/login" />
          )}
        </MainLayout>
      )}
    />
  );
};
export default MainLayoutRoute;
