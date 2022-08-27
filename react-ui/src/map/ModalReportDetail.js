import {useAppDispatch, useAppSelector} from "../app/hooks";
import {hideReportDetailModal, updateNotes} from "../app/States";
import Modal from "react-bootstrap/Modal";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {uriVotes, uriReport, urlServer} from "../def/Definitions";
import {faBiking, faWalking} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {capitalize} from "../Tools/String";
import {deleteCsrf, PatchCsrf, PostCsrf} from "../api/Csrf";
import {Rating} from "@mui/material";
import {MdModeEditOutline, MdDeleteForever, MdLink} from 'react-icons/md';
import {FaStreetView} from 'react-icons/fa'

import {IconContext} from 'react-icons'
import FormEditReport from "./FormEditReport";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Accordion, Alert} from "react-bootstrap";
import useAnnotationHook from "../hooks/useAnnotationHook";
import {urlify} from "../Tools/Urlify";

function ModalReportDetail({id_report}) {

    const [statesAnnotation, __, options, fetchAnnotation, addAnnotationComment, deleteAnnotationComment] = useAnnotationHook(id_report)

    const showEventDetail = useAppSelector((state) => state.states.modales.modal_event_detail)
    const [error, setError] = useState(null)
    const [starDisabled, setStarDisabled] = useState(false)

    const [reportDataDescription, setReportDataDescription] = useState(null)
    const [pictureLink, setPictureLink] = useState(null)

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // from redux store
    const translation = useAppSelector((state) => state.states.translation)
    const user = useAppSelector((state) => state.states.user)
    const dispatch = useAppDispatch()

    // edition mode
    const [edit, setEdit] = useState(false)

    const note_mine = useAppSelector((state) => state.states.modales.note_mine)
    const notes_other = useAppSelector((state) => state.states.modales.notes_other)
    const n_votes = useAppSelector((state) => state.states.modales.n_votes)
    const note_mine_id = useAppSelector((state) => state.states.modales.note_mine_id)

    const navigate = useNavigate()

    useEffect(
        () => {
            if (id_report) {
                fetchAnnotation()
                axios.get(urlServer + uriReport + id_report.toString() + '/', {withCredentials: true})
                    .then((response) => {
                        setReportDataDescription(response.data)
                    })
                    .then(dispatch(updateNotes(id_report)))
                    .catch((error) => setError(error.toString()))
            }
        },
        [id_report, dispatch, edit]
    )

    useEffect(
        () => {
            if (reportDataDescription?.image) {
                axios.get(reportDataDescription.image, {withCredentials: true})
                    .then((result) => setPictureLink(result?.data?.image))
            }

        },
        [reportDataDescription, edit]
    )

    const handlerEdit = () => {
        setEdit(!edit)
    }

    const handleDelete = () => {
        deleteCsrf(urlServer + '/api/report/' + id_report + '/')
            .then(() => dispatch(hideReportDetailModal()))
            .then(() => navigate(0))
            .catch((error) => setError(error.toString()))
    }

    const handlerVoteGravity = function (new_score) {

        // disable stars (no multiple votes)
        setStarDisabled(true)

        // put (update)
        if (note_mine) {
            PatchCsrf(
                urlServer + uriVotes + note_mine_id + '/',
                {
                    pk: id_report, gravity: new_score
                }
            )
                .then(() => dispatch(updateNotes(id_report)))
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
                    report: id_report
                }
            )
                .then(() => dispatch(updateNotes(id_report)))
                .then(() => setStarDisabled(false))
                .then(() => setError(null))
                .catch((error) => setError(error.toString()))
        }
    }

    return (
        <>
            {
                !reportDataDescription ?
                    null
                    :
                    (<>
                            <Modal
                                show={showEventDetail}
                                onHide={() => dispatch(hideReportDetailModal())}
                                fullscreen="sm-down">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-auto">
                                                    {reportDataDescription.user_type === "PEDESTRIAN" ?
                                                        <FontAwesomeIcon icon={faWalking} transform="grow-5"/>
                                                        :
                                                        <FontAwesomeIcon icon={faBiking}/>}
                                                </div>
                                                <div className="col ps-1 pe-4">
                                                    {capitalize(translation[reportDataDescription.category_1])}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="row">
                                                        {(reportDataDescription?.owner === user?.id || user?.is_staff) ?
                                                            <>
                                                                <div className="col-3 align-react-icon">
                                                                    <IconContext.Provider
                                                                        value={{className: "edit-icon edit-icon-shadow"}}>
                                                                        <MdModeEditOutline
                                                                            onClick={() => handlerEdit()}/>
                                                                    </IconContext.Provider>
                                                                </div>
                                                                <div className="col-3">
                                                                    <IconContext.Provider
                                                                        value={{className: "delete-icon delete-icon-shadow"}}>
                                                                        <MdDeleteForever
                                                                            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}/>
                                                                    </IconContext.Provider>
                                                                </div>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        <div className="col-3">
                                                            <Link to={"/R/no-redirection/report/" + id_report}>
                                                                <IconContext.Provider
                                                                    value={{className: "link-icon link-icon-shadow"}}>
                                                                    <MdLink/>
                                                                </IconContext.Provider>
                                                            </Link>
                                                        </div>
                                                        <div className="col-3">
                                                            <a href={`https://maps.google.com/maps?q=&layer=c&cbll=${reportDataDescription.latitude},${reportDataDescription.longitude}`}
                                                                target="_blank">
                                                                <IconContext.Provider
                                                                    value={{className: "link-icon link-icon-shadow"}}>
                                                                    <FaStreetView/>
                                                                </IconContext.Provider>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Title>
                                </Modal.Header>
                                {
                                    showDeleteConfirm ?
                                        <Alert variant="danger" onClose={() => setShowDeleteConfirm(false)}
                                               dismissible>
                                            <Alert.Heading>
                                                Suppression
                                            </Alert.Heading>
                                            <p>
                                                Voulez-vous vraiment supprimer ce signalement ? Cette action est
                                                irréversible.
                                            </p>
                                            <button className="btn btn-danger me-2"
                                                    onClick={() => handleDelete()}>Supprimer
                                            </button>
                                            <button className="btn btn-primary me-2"
                                                    onClick={() => setShowDeleteConfirm(false)}>Annuler
                                            </button>
                                        </Alert>
                                        : null
                                }
                                <Modal.Body>

                                    {edit ?
                                        <FormEditReport pk={id_report} setEdit={setEdit}/>
                                        :
                                        (<>
                                                <div>{error}</div>
                                                <div className="container-fluid">
                                                    <div className="row">
                                                        <div className="col">
                                                            <h5>
                                                                {/*{capitalize(translation[reportDataDescription.category_2])}*/}
                                                                {reportDataDescription.category_2.map(item => (
                                                                    <div key={item}>{capitalize(translation[item])}<br/>
                                                                    </div>))}
                                                            </h5>
                                                            <p className="fw-lighter">
                                                                Signalé
                                                                le {(new Date(reportDataDescription.timestamp_creation)).toLocaleDateString()}
                                                                &nbsp;à {(new Date(reportDataDescription.timestamp_creation)).toLocaleTimeString()}
                                                                &nbsp;par @{reportDataDescription.owner_alias}
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
                                                {!!statesAnnotation?.status &&
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
                                                                <Accordion.Item eventKey={id_report}>
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

                                            </>
                                        )
                                    }
                                </Modal.Body>
                            </Modal>
                        </>
                    )
            }
        </>
    )
}

export default ModalReportDetail