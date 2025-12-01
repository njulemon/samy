import {useEffect, useState} from "react";
import {PatchCsrf} from "../api/Csrf";
import {urlServer} from "../def/Definitions";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {checkAccessAndGetUser} from "../app/States";

export const useUserDataEditHook = () => {

    const [userData, setUserData] = useState(
        {
            first_name: '',
            last_name: '',
            alias: ''
        }
    )

    const user = useAppSelector(state => state.states.user)
    const dispatch = useAppDispatch()

    const patch = (first_name, last_name, alias) => {
        const data = {first_name, last_name, alias}
        return PatchCsrf(urlServer + `/api/patch-user/${user.id}/`, data)
            .then(() => new Promise((res, rej) => {
                setUserData(data)
                dispatch(checkAccessAndGetUser())
                res(data)
            }))
    }

    const fetchInitialData = () => {
        axios.get(urlServer + '/api/get-user/', {withCredentials: true})
            .then(response => setUserData(
                {
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    alias: response.data.alias
                }
            ))
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    return {userData, patch}
}
