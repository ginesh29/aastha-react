import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { BASE_API_URL } from "./constants";
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';
import $ from "jquery";

export class repository {
    get(controller, querystring) {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        return axios.get(`${BASE_API_URL}/${controller}?${querystring}`)
            .then(res => res.data.Result)
            .catch(error => this.handleError(error))
    }

    post(controller, model, config) {
        $("#errors").remove();
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        if (!model.id)
            return axios.post(`${BASE_API_URL}/${controller}`, model, config)
                .then(res => {
                    if (config && config.responseType === "blob") {
                        this.growl.show({ severity: 'success', summary: 'Success Message', detail: "Export file succssfully" });
                        return res.data;
                    }
                    else {
                        this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                        return res.data.Result;
                    }
                }).catch(error => this.handleError(error))
        else
            return axios.put(`${BASE_API_URL}/${controller}`, model)
                .then(res => {
                    this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                    return res.data.Result;
                }).catch(error => this.handleError(error))
    }

    delete(controller, querystring) {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        return axios.delete(`${BASE_API_URL}/${controller}/${querystring}`)
            .then(res => {
                this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                return res.data;
            }).catch(error => this.handleError(error));
    }

    handleError(error) {
        ReactDOM.render(<Messages ref={(el) => this.messages = el} />, document.getElementById("messages"));
        if (error.response) {
            if ($(".p-dialog-content:visible").length)
                $(".p-dialog-content").prepend('<div id="errors"></div>');
            else if ($(".p-panel-content").length)
                $(".p-panel-content").prepend('<div id="errors"></div>');
            ReactDOM.render(<Messages ref={(el) => this.errors = el} />, document.getElementById("errors"));

            let errorResult = error.response.data;
            let errors = errorResult.ValidationSummary;
            errors && Object.keys(errors).map((item, i) => (
                errors && this.errors.show({ severity: 'warn', summary: errorResult.Message, detail: errors[item], sticky: true })
            ))
        } else if (error.request) {
            if ($("#messages div").is(':empty'))
                this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
        } else {
            console.log('Error', error.message);
        }
    }
}
