import axios from "axios";
import {uriCSRF, uriPicture, urlServer} from "../def/Definitions";

export function postImage(data) {
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => axios.post(
                urlServer + uriPicture,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': response.data.csrf_token,
                        'Content-Type': 'application/x-www-form-urlencoded'//'multipart/form-data'
                    }
                }
            )
        )
}