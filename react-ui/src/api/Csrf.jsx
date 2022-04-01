import axios from "axios";
import {uriCSRF, urlServer} from "../def/Definitions";


export function PostCsrf(url: string, data: { [name: string]: string }) {
    /*We need to protect post data against csrf attacks.
    * ---
    * The server side send a cookie with csrf token and at the same time a value
    * for the csrf token which is embedded directly in the get returned answer when using
    * the GET method.
    * Once, those TWO tokens are received (one is a cookie that we can not access to å[HTTPOnly],
    * we can make a secure POST request.
    * ---
    * */
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => axios.post(
                url,
                data,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': response.data.csrf_token
                    }
                }
            )
        )
        .then((response) => response.status === 200)
}

export function PatchCsrf(url: string, data: { [name: string]: string }) {
    /*We need to protect post data against csrf attacks.
    * ---
    * The server side send a cookie with csrf token and at the same time a value
    * for the csrf token which is embedded directly in the get returned answer when using
    * the GET method.
    * Once, those TWO tokens are received (one is a cookie that we can not access to å[HTTPOnly],
    * we can make a secure POST request.
    * ---
    * */
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => axios.patch(
                url,
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

export function deleteCsrf(url, data) {
    /*We need to protect post data against csrf attacks.
    * ---
    * The server side send a cookie with csrf token and at the same time a value
    * for the csrf token which is embedded directly in the get returned answer when using
    * the GET method.
    * Once, those TWO tokens are received (one is a cookie that we can not access to å[HTTPOnly],
    * we can make a secure POST request.
    * ---
    * */
    return axios.get(
        urlServer + uriCSRF,
        {
            withCredentials: true
        }
    )
        .then(
            (response) => axios.delete(
                url,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': response.data.csrf_token
                    }
                }
            )
        )
}