import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import AlertAutoHide from "./AlertAutoHide";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsRotate} from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import {useAppSelector} from "../app/hooks";
import ImageReport from "../ImageReport";
import ReportAnnotationForm from "./ReportAnnotationForm";

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

                                        <h5>
                                            <span
                                                className="text-capitalize fw-bold"> {_[row.category_1]}
                                            </span> : {_[row.category_2]} <br/>
                                        </h5>

                                        <p>
                                            {row.comment}
                                        </p>

                                        <ImageReport reportId={row.id}/>
                                        <ReportAnnotationForm reportPk={row.id}/>

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