import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import AlertAutoHide from "./AlertAutoHide";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsRotate} from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import {useAppSelector} from "../app/hooks";
import ImageReport from "../map/ImageReport";
import ReportAnnotationForm from "./ReportAnnotationForm";
import MiniMap from "./MiniMap";
import {capitalize} from "../Tools/String";

const Unassigned = () => {

    const [unassignedReport, setUnassignedReport] = useState(null)
    const [error, setError] = useState('')
    const [update, setUpdate] = useState(true)

    const _ = useAppSelector(state => state.states.translation)

    useEffect(() => {
        if (update) {
            axios.get(urlServer + '/api/report/', {withCredentials: true})
                .then(response => setUnassignedReport(
                    response.data
                        .filter(row => row.annotation === null)
                        .map(row => {
                            return {key: Math.random().toString(), ...row}
                        })
                ))
                .then(() => setUpdate(false))
                .catch(error => setError(error))
        }

    }, [update])

    return (
        <>
            {error}
            {
                <div className="container p-0 m-0 border rounded">
                    <div className="row pb-2 pt-2">
                        <div className="col">
                            <FontAwesomeIcon icon={faArrowsRotate} className="here-icon"
                                             onClick={() => setUpdate(true)}
                                             fixedWidth/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-start">
                            {unassignedReport?.map(
                                row => (
                                    <AlertAutoHide key={row.key}>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-12 col-lg-12 mt-2">
                                                    <h4 className="fw-bold">
                                                        {capitalize(_[row.category_1])} <span className="fw-normal">[{row.id}]</span>
                                                    </h4>
                                                    <h5 className="fw-light">
                                                        {capitalize(_[row.category_2])} <br/>
                                                    </h5>
                                                    <p className="fw-lighter">
                                                        Signalé le {(new Date(row?.timestamp_creation)).toLocaleDateString()}
                                                    </p>
                                                    <p>
                                                        {row.comment}
                                                    </p>
                                                </div>
                                            </div>

                                            <hr/>

                                            <div className="row">
                                                <div className="col-12 col-lg-6">
                                                    <MiniMap lat={row.latitude} lng={row.longitude} zoom={12}
                                                             id={row.id}/>
                                                </div>
                                                <div className="col-12 col-lg-6">
                                                    <ImageReport reportId={row.id}/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className="row">
                                                <div className="col-12 col-lg-6 mt-3">
                                                    <ReportAnnotationForm reportPk={row.id}/>
                                                </div>
                                            </div>
                                        </div>

                                    </AlertAutoHide>
                                )
                            )}
                        </div>
                    </div>
                </div>

            }
        </>
    )
}

export default Unassigned