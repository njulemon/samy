import axios from "axios";
import {uriCSRF, uriNewPassword, urlServer} from "../def/Definitions";

export function patchNewPassword(data) {
    console.log(data)
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: false
        }
    )
        .then(
            (response) => axios.patch(
                urlServer + uriNewPassword + data.pk_user + '/',
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