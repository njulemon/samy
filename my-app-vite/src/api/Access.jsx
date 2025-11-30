import axios from "axios";
import {uriHasAccess, uriLogout, urlServer} from "../def/Definitions";

function hasAccess() {
    return axios.get(
        urlServer + uriHasAccess,
        {withCredentials: true}
    )
}

export function logout() {
    return axios.get(
        urlServer + uriLogout,
        {withCredentials: true}
    )
}

export default hasAccess;