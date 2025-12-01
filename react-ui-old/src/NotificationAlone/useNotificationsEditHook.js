import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {PatchCsrf} from "../api/Csrf";
import {checkAccessAndGetUser, setUser} from "../app/States";
import {useParams} from "react-router-dom";

export const useNotificationsEditHook = () => {

    const [idName, setIdNames] = useState({})
    const [user, setUser] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    let paramsUrl = useParams();
    let token = paramsUrl.token

    const fetchNames = () => {
        axios.get(urlServer + '/api/notifications/',)
            .then(result => setIdNames(result.data.reduce(
                (dic, item) => {
                    return {...dic, [item.id]: {name: item.name, active: user.notifications.includes(item.id)}}
                }, {})))
    }

    const fetchUser = () => {
        axios.get(urlServer + '/api/get-user/?token=' + token,)
            .then(result => setUser(result.data))
            .catch(error => setErrorMsg(error.response.data.detail))
    }

    const toggleKey = (id) => {

        let id_n = Number(id)

        // delete key if in notifications
        let notificationsCopy = user.notifications.filter(key => key !== id_n)

        // add key if in notifications
        if (notificationsCopy.length === user.notifications.length) {
            notificationsCopy.push(id_n)
        }

        const data = {notifications: notificationsCopy}

        // update user profile & fetch user data again (redux)
        PatchCsrf(urlServer + `/api/patch-user/${user.id}/?token=` + token, data)
            .then(() => fetchUser())
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        if (!!user && idName !== {}) {
            fetchNames()
        }
    }, [user])

    useEffect(() => {
        if (idName !== {} && !!user) {
            const newIdName = Object.keys(idName).reduce((dic, key) => {
                    return {
                        ...dic,
                        [key]: {name: idName[key].name, active: user.notifications.includes(key)}
                    }
                },
                {}
            )
            setIdNames(newIdName)
        }
    }, [user])

    useEffect(() => console.log(idName), [idName])

    return {idName, toggleKey, errorMsg}
}
