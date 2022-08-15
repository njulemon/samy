import {Accordion, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBiking, faWalking} from "@fortawesome/free-solid-svg-icons";
import {capitalize} from "./Tools/String";
import {urlify} from "./Tools/Urlify";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import useAnnotationHook from "./hooks/useAnnotationHook";
import axios from "axios";
import {useParams} from "react-router-dom";
import {uriReport, urlServer} from "./def/Definitions";

const ReportCard = ({id, fullSize=false}) => {

    let paramsUrl = useParams();
    let idReport = paramsUrl.idReport
    // in the address bar
    if (!!id) {
        idReport = id
    }


    const translation = useAppSelector((state) => state.states.translation)
    const [statesAnnotation, __, options, fetchAnnotation, addAnnotationComment, deleteAnnotationComment] = useAnnotationHook(idReport)
    const [pictureLink, setPictureLink] = useState(null)
    const [error, setError] = useState(null)
    const [reportDataDescription, setReportDataDescription] = useState(null)

    // from redux store
    const dispatch = useAppDispatch()

    useEffect(
        () => {
            if (reportDataDescription?.image) {
                axios.get(reportDataDescription.image, {withCredentials: true})
                    .then((result) => setPictureLink(result?.data?.image))
            }

        },
        [reportDataDescription]
    )


    useEffect(
        () => {
            if (idReport) {
                fetchAnnotation()
                axios.get(urlServer + uriReport + idReport.toString() + '/', {withCredentials: true})
                    .then((response) => {
                        setReportDataDescription(response.data)
                    })
                    .catch((error) => setError(error.toString()))
            }
        },
        [idReport, dispatch]
    )

    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-4">
                <div className={fullSize ? "col-12": "col-sm-12 col-md-10 col-lg-6 col-xl-4"}>


                    <Card>
                        <Card.Header>

                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-auto">
                                        [{reportDataDescription?.id}]
                                    </div>
                                    <div className="col-auto">
                                        {reportDataDescription?.user_type === "PEDESTRIAN" ?
                                            <FontAwesomeIcon icon={faWalking} transform="grow-5"/>
                                            :
                                            <FontAwesomeIcon icon={faBiking}/>}
                                    </div>
                                    <div className="col-auto">
                                        {capitalize(translation[reportDataDescription?.category_1])}
                                    </div>
                                    <div className="col">
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>

                            <div>{error}</div>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col">
                                        <h5>
                                            {reportDataDescription?.category_2.map(item => (<div key={item}>{capitalize(translation[item])}<br/></div>))}
                                        </h5>
                                        <p className="fw-lighter">
                                            Signalé
                                            le {(new Date(reportDataDescription?.timestamp_creation)).toLocaleDateString()}
                                            &nbsp;à {(new Date(reportDataDescription?.timestamp_creation)).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="row">
                                    {pictureLink ?
                                        <div className="col-md-12 col-sm-12 mb-3">
                                            <div className="">
                                                <img src={pictureLink} alt="Report"
                                                     className="image-report shadow-sm"/>
                                            </div>
                                        </div>
                                        : null}
                                    {reportDataDescription?.comment ?
                                        <div className="col-md-12 col-sm-12">

                                            <div className="">
                                                <div className="shadow-sm h-100 rounded">
                                                    <div className="ps-2 pe-2">
                                                        <p className="text-justify">
                                                            {reportDataDescription?.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        : null
                                    }
                                </div>
                            </div>


                            {!!statesAnnotation?.in_charge &&
                            <div className="container-fluid mb-2">
                                <hr/>
                                <div className="row mt-2 mb-2">
                                    <div className="col">
                                        Status
                                        : {options && translation[options.status[statesAnnotation.status].display_name]}
                                        <br/>
                                        Resp.
                                        : {options && translation[options.in_charge[statesAnnotation.in_charge].display_name]}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Accordion>
                                            <Accordion.Item eventKey={idReport}>
                                                <Accordion.Header>
                                                    Annotations {statesAnnotation?.comments?.length !== 0 && `(${statesAnnotation?.comments?.length})`}
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {statesAnnotation?.comments?.map(row =>
                                                        <div className="row"
                                                             key={"comment" + row.id}>
                                                            <div className="col-10">
                                                                <div className="fw-light">
                                                                    {(new Date(row.date_modified)).toLocaleDateString() + " " + (new Date(row.date_modified)).toLocaleTimeString()}
                                                                </div>
                                                                <p className="text-justify">
                                                                    {urlify(row.comment)}
                                                                </p>
                                                            </div>
                                                            <hr/>
                                                        </div>
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                            }
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ReportCard