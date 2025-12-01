import axios from "axios";
import {uriCSRF, uriRequestNewPassword, urlServer} from "../def/Definitions";

export function postRequestNewPassword(data) {
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: false
        }
    )
        .then(
            (response) => axios.post(
                urlServer + uriRequestNewPassword,
                data,
                {
                    withCredentials: false,
                    headers: {
                        'X-CSRFToken': response.data.csrf_token
                    }
                }
            )
        )
}