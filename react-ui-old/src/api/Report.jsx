import axios from "axios";
import {uriCSRF, uriReport, uriReportForm, uriReportMap, urlServer} from "../def/Definitions";

export function getReports() {
    return axios.get(
        urlServer + uriReport,
        {
            withCredentials: true
        }
    )
}

export function getReportsMap() {
    return axios.get(
        urlServer + uriReportMap,
        {
            withCredentials: true
        }
    )
}

export function getReport(pk) {
    return axios.get(
        urlServer + uriReport + pk.toString() + '/',
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


export function patchReport(data, pk) {
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => {
                axios.patch(
                    urlServer + uriReport + pk.toString() + '/',
                    data,
                    {
                        withCredentials: true,
                        headers: {
                            'X-CSRFToken': response.data.csrf_token
                        }
                    }
                )
            }
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

