import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";

export const useAreaListHook = () => {

    const [listAreas, setListAreas] = useState()

    useEffect(() => {
        axios.get(urlServer + '/api/area/active/', {withCredentials: true})
            .then(response => {
                setListAreas(response.data.map(row => {
                    return {value: row.id, name: row.name}
                }));
            })
            .catch(error => console.error)
    }, [])

    return {listAreas}
}