import {useNotificationsEditHook} from "./useNotificationsEditHook";
import React from "react";
import {useAppSelector} from "../app/hooks";
import {useParams} from "react-router-dom";

const Notifications = ({notificationHook}) => {

    const _ = useAppSelector(state => state.states.translation)

    return (
        <>
            {Object.keys(notificationHook?.idName).map(key =>
                (
                    <div className="row" key={key}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                   value={notificationHook.idName[key].active}
                                   defaultChecked={notificationHook.idName[key].active}
                                   id={"flexCheckDefault" + key}
                                   onChange={() => notificationHook.toggleKey(key)}/>
                            <label className="form-check-label" htmlFor={"flexCheckDefault" + key}>
                                {_[notificationHook.idName[key].name]}
                            </label>
                        </div>
                    </div>
                )
            )}
        </>
    )
}

export default Notifications