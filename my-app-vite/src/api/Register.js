import axios from "axios";
import {uriCSRF, uriNewUser, urlServer} from "../def/Definitions";

export function postRegister(data) {
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: false
        }
    )
        .then(
            (response) => axios.post(
                urlServer + uriNewUser,
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