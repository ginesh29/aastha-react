import axios from 'axios';
import { BASE_API_URL } from "./constants";


export class repository {
    get(controller, querystring, messageRef) {
        return axios.get(`${BASE_API_URL}/${controller}?${querystring}`)
            .then(res => res.data.Result)
            .catch(error => {

                messageRef && messageRef.clear();
                if (error.response) {
                    // debugger
                    // let errorResult = error.response.data;

                } else if (error.request) {
                    messageRef && messageRef.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            })
    }
    post(controller, model, growlRef, messageRef) {
        return axios.post(`${BASE_API_URL}/${controller}`, model)
            .then(res => {
                growlRef.show({ severity: 'success', summary: 'Success Message', detail: res.data.Message });
                return res.data;
            })
            .catch(error => {
                if (error.response) {
                    let errorResult = error.response.data;
                    let errors = errorResult.ValidationSummary;
                    messageRef.clear();
                    errors && Object.keys(errors).map((item, i) => (
                        messageRef.show({ severity: 'error', summary: errorResult.Message, detail: errors[item], sticky: true })
                    ))
                } else if (error.request) {
                    messageRef.show({ severity: 'error', summary: 'Server error', detail: "Please check internet connection", sticky: true })
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }
    put() {
        return axios.get('showcase/resources/demo/data/cars-large.json')
            .then(res => res.data.data);
    }
}
