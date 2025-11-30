import React from "react";

import Notifications from "./Notifications.jsx"
import FooterSamy from "../FooterSamy.jsx";
import {Accordion, Card} from "react-bootstrap";
import {useNotificationsEditHook} from "./useNotificationsEditHook.jsx";


const NotificationsPreferencesFullScreen = () => {

    const notificationHook = useNotificationsEditHook()

    return (

        <div className="container-fluid m-0 p-0 main-page-footer-header">
            <div className="container-fluid">
                <div className="row justify-content-center mt-4">
                    <div className={"col-sm-12 col-md-10 col-lg-6 col-xl-4"}>
                        <Card>
                            <Card.Header>

                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-auto">
                                            Préférences de notification par email
                                        </div>

                                        <div className="col">
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>

                                <div>{!!notificationHook?.errorMsg ? "Error: " + notificationHook.errorMsg : null}</div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col">
                                            <h5>
                                                <Notifications notificationHook={notificationHook}/>
                                            </h5>
                                        </div>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
            <FooterSamy/>
        </div>
    )
}

export default NotificationsPreferencesFullScreen