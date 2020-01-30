import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { BASE_API_URL } from "./constants";
import { Growl } from 'primereact/growl';
import { Messages } from 'primereact/messages';

export class repository
{
    get(controller, querystring)
    {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        ReactDOM.render(<Messages ref={(el) => this.messages = el} />, document.getElementById("messages"));
        ReactDOM.render(<Messages ref={(el) => this.errors = el} />, document.getElementById("errors"));
        return axios.get(`${ BASE_API_URL }/${ controller }?${ querystring }`)
            .then(res => res.data.Result)
            .catch(error =>
            {
                this.messages.clear();
                if (error.response) {
                    // debugger
                    // let errorResult = error.response.data;

                } else if (error.request) {
                    this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            })
    }
    post(controller, model)
    {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        ReactDOM.render(<Messages ref={(el) => this.messages = el} />, document.getElementById("messages"));
        ReactDOM.render(<Messages ref={(el) => this.errors = el} />, document.getElementById("errors"));
        if (!model.id)
            return axios.post(`${ BASE_API_URL }/${ controller }`, model)
                .then(res =>
                {
                    this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                    return res.data.Result;
                })
                .catch(error =>
                {
                    if (error.response) {
                        let errorResult = error.response.data;
                        let errors = errorResult.ValidationSummary;
                        this.errors.clear();
                        errors && Object.keys(errors).map((item, i) => (
                            this.errors.show({ severity: 'error', summary: errorResult.Message, detail: errors[item], sticky: true })
                        ))
                    } else if (error.request) {
                        this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                });
        else
            return axios.put(`${ BASE_API_URL }/${ controller }`, model)
                .then(res =>
                {
                    this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                    return res.data.Result;
                })
                .catch(error =>
                {
                    if (error.response) {
                        let errorResult = error.response.data;
                        let errors = errorResult.ValidationSummary;
                        this.errors.clear();
                        errors && Object.keys(errors).map((item, i) => (
                            this.errors.show({ severity: 'error', summary: errorResult.Message, detail: errors[item], sticky: true })
                        ))
                    } else if (error.request) {
                        this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                });
    }
    delete(controller, querystring)
    {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        ReactDOM.render(<Messages ref={(el) => this.messages = el}></Messages>, document.getElementById("messages"));
        ReactDOM.render(<Messages ref={(el) => this.errors = el} />, document.getElementById("errors"));
        return axios.delete(`${ BASE_API_URL }/${ controller }/${ querystring }`)
            .then(res =>
            {
                this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                return res.data;
            })
            .catch(error =>
            {
                if (error.response) {
                    let errorResult = error.response.data;
                    let errors = errorResult.ValidationSummary;
                    this.errors.clear();
                    errors && Object.keys(errors).map((item, i) => (
                        this.errors.show({ severity: 'error', summary: errorResult.Message, detail: errors[item], sticky: true })
                    ))
                } else if (error.request) {
                    this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }
    file(controller, model)
    {
        ReactDOM.render(<Growl ref={(el) => this.growl = el} />, document.getElementById("toast"));
        ReactDOM.render(<Messages ref={(el) => this.messages = el}></Messages>, document.getElementById("messages"));
        ReactDOM.render(<Messages ref={(el) => this.errors = el} />, document.getElementById("errors"));
        return axios.post(`${ BASE_API_URL }/${ controller }`, model, { responseType: 'blob' })
            .then(res =>
            {
                this.growl.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                return res.data;
            })
            .catch(error =>
            {
                if (error.response) {
                    let errorResult = error.response.data;
                    let errors = errorResult.ValidationSummary;
                    this.errors.clear();
                    errors && Object.keys(errors).map((item, i) => (
                        this.errors.show({ severity: 'error', summary: errorResult.Message, detail: errors[item], sticky: true })
                    ))
                } else if (error.request) {
                    this.messages.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }
}
