import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BASE_API_URL } from "./constants";
import { Growl } from "primereact/growl";
import { Messages } from "primereact/messages";
import jquery from "jquery";

const env = process.env.NODE_ENV;
export class repository {
  get(controller, querystring) {
    ReactDOM.render(
      <Growl ref={(el) => (this.growl = el)} />,
      document.getElementById("toast")
    );
    return axios
      .get(`${BASE_API_URL[env]}/${controller}?${querystring}`)
      .then((res) => res.data.Result)
      .catch((error) => this.handleError(error));
  }

  post(controller, model, config) {
    jquery("#errors").remove();
    ReactDOM.render(
      <Growl ref={(el) => (this.growl = el)} />,
      document.getElementById("toast")
    );
    if (!model.id)
      return axios
        .post(`${BASE_API_URL[env]}/${controller}`, model, config)
        .then((res) => {
          if (config && config.responseType === "blob") {
            this.growl.show({
              severity: "success",
              summary: "Success Message",
              detail: "Export file succssfully",
            });
            return res.data;
          } else {
            this.growl.show({
              severity: "success",
              summary: "Success Message",
              detail: res.data.Message,
            });
            return res.data.Result;
          }
        })
        .catch((error) => this.handleError(error));
    else
      return axios
        .put(`${BASE_API_URL[env]}/${controller}`, model, config)
        .then((res) => {
          this.growl.show({
            severity: "success",
            summary: "Success Message",
            detail: res.data.Message,
          });
          return res.data.Result;
        })
        .catch((error) => this.handleError(error));
  }

  delete(controller, querystring) {
    ReactDOM.render(
      <Growl ref={(el) => (this.growl = el)} />,
      document.getElementById("toast")
    );
    return axios
      .delete(`${BASE_API_URL[env]}/${controller}/${querystring}`)
      .then((res) => {
        this.growl.show({
          severity: "success",
          summary: "Success Message",
          detail: res.data.Message,
        });
        return res.data;
      })
      .catch((error) => this.handleError(error));
  }

  handleError(error) {
    ReactDOM.render(
      <Messages ref={(el) => (this.messages = el)} />,
      document.getElementById("messages")
    );
    if (error.response) {
      jquery("#errors").remove();
      if (jquery(".p-dialog-content:visible").length)
        jquery(".p-dialog-content:visible").prepend('<div id="errors"></div>');
      else if (jquery(".p-panel-content:visible").length)
        jquery(".p-panel-content:visible").prepend('<div id="errors"></div>');
      else if (jquery(".card").length)
        jquery(".card").prepend('<div id="errors"></div>');
      ReactDOM.render(
        <Messages ref={(el) => (this.errors = el)} />,
        document.getElementById("errors")
      );
      if (error.response.data) {
        let errorResult = error.response.data;
        let errors = errorResult.ValidationSummary;
        errors &&
          Object.keys(errors).map(
            (item, i) =>
              errors &&
              this.errors.show({
                severity: "warn",
                summary: errorResult.Message,
                detail: errors[item],
                sticky: true,
              })
          );
        return { errors: errors };
      } else {
        if (error.response.status === 401) {
          const returnUrl = window.location.pathname.replace("/", "");
          window.location.href = `/login?returnUrl=${returnUrl}`;
          this.messages.show({
            severity: "error",
            summary: "Authorization error",
            detail: "Please Login again",
            sticky: true,
          });
        }
      }
    } else if (error.request) {
      if (jquery("#messages div").is(":empty"))
        this.messages.show({
          severity: "error",
          summary: "Server error",
          detail: "Please check internet connection",
          sticky: true,
        });
    }
  }
}
