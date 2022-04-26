import useAnnotationHook from "./hooks/useAnnotationHook";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {uriReport, uriVotes, urlServer} from "./def/Definitions";
import {updateNotes} from "./app/States";
import {PatchCsrf, PostCsrf} from "./api/Csrf";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBiking, faWalking} from "@fortawesome/free-solid-svg-icons";
import {capitalize} from "./Tools/String";
import {Accordion, Card} from "react-bootstrap";
import {Rating} from "@mui/material";
import {urlify} from "./Tools/Urlify";
import FooterSamy from "./FooterSamy";

const ReportFullScreen = () => {

    const isLogged = useAppSelector((state) => state.states.isLogged)

    let paramsUrl = useParams();

    const [statesAnnotation, __, options, fetchAnnotation, addAnnotationComment, deleteAnnotationComment] = useAnnotationHook(paramsUrl.idReport)

    const [error, setError] = useState(null)
    const [starDisabled, setStarDisabled] = useState(false)

    const [reportDataDescription, setReportDataDescription] = useState(null)
    const [pictureLink, setPictureLink] = useState(null)

    // from redux store
    const translation = useAppSelector((state) => state.states.translation)
    const user = useAppSelector((state) => state.states.user)
    const dispatch = useAppDispatch()


    const note_mine = useAppSelector((state) => state.states.modales.note_mine)
    const notes_other = useAppSelector((state) => state.states.modales.notes_other)
    const n_votes = useAppSelector((state) => state.states.modales.n_votes)
    const note_mine_id = useAppSelector((state) => state.states.modales.note_mine_id)

    const navigate = useNavigate()

    useEffect(
        () => {
            if (paramsUrl.idReport) {
                fetchAnnotation()
                axios.get(urlServer + uriReport + paramsUrl.idReport.toString() + '/', {withCredentials: true})
                    .then((response) => {
                        setReportDataDescription(response.data)
                    })
                    .then(dispatch(updateNotes(paramsUrl.idReport)))
                    .catch((error) => setError(error.toString()))
            }
        },
        [paramsUrl.idReport, dispatch]
    )

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
            if (!isLogged) {
                navigate('/R/menu/login')
            }

        }
    )


    const handlerVoteGravity = function (new_score) {

        // disable stars (no multiple votes)
        setStarDisabled(true)

        // put (update)
        if (note_mine) {
            PatchCsrf(
                urlServer + uriVotes + note_mine_id + '/',
                {
                    pk: paramsUrl.idReport, gravity: new_score
                }
            )
                .then(() => dispatch(updateNotes(paramsUrl.idReport)))
                .then(() => setStarDisabled(false))
                .then(() => setError(null))
                .catch((error) => {
                    setError(error.toString())
                    setStarDisabled(false)
                })
        }

        // post (new)
        else {
            PostCsrf(
                urlServer + uriVotes,
                {
                    gravity: new_score,
                    user: user.id,
                    report: paramsUrl.idReport
                }
            )
                .then(() => dispatch(updateNotes(paramsUrl.idReport)))
                .then(() => setStarDisabled(false))
                .then(() => setError(null))
                .catch((error) => setError(error.toString()))
        }
    }

    return (
        <div className="container-fluid m-0 p-0 main-page-footer-header">
            {
                !reportDataDescription ?
                    null
                    :
                    (
                        <div className="container-fluid">
                            <div className="row justify-content-center mt-4">
                                <div className="col-sm-12 col-md-10 col-lg-6 col-xl-4">


                                    <Card>
                                        <Card.Header>

                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-auto">
                                                        {reportDataDescription.user_type === "PEDESTRIAN" ?
                                                            <FontAwesomeIcon icon={faWalking} transform="grow-5"/>
                                                            :
                                                            <FontAwesomeIcon icon={faBiking}/>}
                                                    </div>
                                                    <div className="col-auto">
                                                        {capitalize(translation[reportDataDescription.category_1])}
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
                                                            {capitalize(translation[reportDataDescription.category_2])}
                                                        </h5>
                                                        <p className="fw-lighter">
                                                            Signalé
                                                            le {(new Date(reportDataDescription.timestamp_creation)).toLocaleDateString()}
                                                            &nbsp;à {(new Date(reportDataDescription.timestamp_creation)).toLocaleTimeString()}
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
                                            <div className="container-fluid mb-2">
                                                <hr/>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="ms-1">Gravité du signalement</div>
                                                        <Rating
                                                            key={"rating-star-" + note_mine ? note_mine : "null"}
                                                            name="simple-controlled"
                                                            value={note_mine}
                                                            onChange={(event, newValue) => {
                                                                handlerVoteGravity(newValue);
                                                            }}
                                                            disabled={starDisabled}/>
                                                    </div>
                                                    <div className="col-6">
                                                        Nombre de votes : {n_votes} <br/>
                                                        {notes_other !== -1 ? "Gravité moyenne : " + notes_other : null}
                                                    </div>
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
                                                            <Accordion.Item eventKey={paramsUrl.idReport}>
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
            <FooterSamy/>
        </div>
    )
}

export default ReportFullScreen