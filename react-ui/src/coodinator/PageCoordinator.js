import {Tab, Nav} from "react-bootstrap";
import Info from "./Info";
import Unassigned from "./Unassigned";
import FollowUp from "./FollowUp";
import {useEffect, useState} from "react";
import {checkAccessAndGetUser} from "../app/States";
import {useAppDispatch, useAppSelector} from "../app/hooks";


const PageCoordinator = () => {

    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState("unassigned")  // followup

    useEffect(
        () => {
            dispatch(checkAccessAndGetUser())
        },
        [dispatch]
    )

    return (
        <div className="container-fluid min-vh-100 w-100 background-coordinator p-4">
            <h2>
                Gestion des signalements
            </h2>

            <div className="row">
                <div className="col-12">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => setActiveTab("unassigned")}>
                                Attribution
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => setActiveTab("followup")}>
                                Suivi des signalements
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-12">

                    {
                        {
                            "unassigned": (
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-auto pt-4">
                                            <Info />
                                        </div>
                                        <div className="col pt-4">
                                            <Unassigned />
                                        </div>
                                    </div>
                                </div>
                            ),
                            "followup": (
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-auto pt-4">
                                            <Info/>
                                        </div>
                                        <div className="col pt-4">
                                            <FollowUp />
                                        </div>
                                    </div>
                                </div>
                            )

                        }[activeTab]
                    }
                </div>
            </div>
        </div>
    )
}

export default PageCoordinator