import axios from "axios";
import {uriCSRF, uriReport, uriReportForm, urlServer} from "../def/Definitions";

export function getReport() {
    return axios.get(
        urlServer + uriReport,
        {
            withCredentials: true
        }
    )
}

export function postReport(data) {
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => axios.post(
                urlServer + uriReport,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': response.data.csrf_token
                    }
                }
            )
        )
}

export function getReportForm() {
    return axios.get(
        urlServer + uriReportForm,
        {
            withCredentials: true
        }
    )
}
