import {useEffect, useState} from "react";
import {urlServer} from "../def/Definitions";
import axios from "axios";

export const useUserStatHook = () => {
    const [stat, setStat] = useState(
        {n_reports: 0, n_votes: 0, last_report_date: new Date()}
    )

    const fetchData = () => {
        axios.get(urlServer + '/api/get-user-stat/', {withCredentials: true})
            .then(response =>  setStat(response.data))
    }

    useEffect(() => fetchData(), [])

    return {stat}
}