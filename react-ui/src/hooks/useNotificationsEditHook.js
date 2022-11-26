import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {PatchCsrf} from "../api/Csrf";
import {checkAccessAndGetUser} from "../app/States";

export const useNotificationsEditHook = () => {

    const [idName, setIdNames] = useState({})
    const [loading, setIsLoading] = useState(false)
    const notifications = useAppSelector(state => state.states.user.notifications)
    const user = useAppSelector(state => state.states.user)
    const dispatch = useAppDispatch()

    const fetchNames = () => {
        setIsLoading(true)
        axios.get(urlServer + '/api/notifications/', {withCredentials: true})
            .then(result => setIdNames(result.data.reduce(
                (dic, item) => {
                    return {...dic, [item.id]: {name: item.name, active: notifications.includes(item.id)}}
                }, {})))
            .then(() => setIsLoading(false))
    }

    const toggleKey = (id) => {

        setIsLoading(true)

        let id_n = Number(id)

        // delete key if in notifications
        let notificationsCopy = notifications.filter(key => key !== id_n)

        // add key if in notifications
        if (notificationsCopy.length === notifications.length) {
            notificationsCopy.push(id_n)
        }

        const data = {notifications: notificationsCopy}

        // update user profile & fetch user data again (redux)
        PatchCsrf(urlServer + `/api/patch-user/${user.id}/`, data)
            .then(() => dispatch(checkAccessAndGetUser()))
            .then(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchNames()
    }, [])

    useEffect(() => {
        if (idName !== {}) {
            const newIdName = Object.keys(idName).reduce((dic, key) => {
                    return {
                        ...dic,
                        [key]: {name: idName[key].name, active: notifications.includes(key)}
                    }
                },
                {}
            )
            setIdNames(newIdName)
        }
    }, [notifications])

    useEffect(() => console.log(idName), [idName])

    return {idName, toggleKey}
}
