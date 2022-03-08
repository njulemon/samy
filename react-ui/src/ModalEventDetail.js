import {useAppDispatch, useAppSelector} from "./app/hooks";
import {hideEventModal, updateNotes} from "./app/States";
import Modal from "react-bootstrap/Modal";
import {useEffect, useState} from "react";
import axios from "axios";
import {uriVotes, uriReport, urlServer, urlMedia, uriPicture} from "./def/Definitions";
import {faBiking, faWalking} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {capitalize} from "./Tools/String";
import ReactStars from "react-rating-stars-component";
import {PatchCsrf, PostCsrf} from "./api/Csrf";
import {Rating} from "@mui/material";
import {config} from "@fortawesome/fontawesome-svg-core";

function ModalEventDetail({id_report}) {

    const showEventDetail = useAppSelector((state) => state.states.modales.modal_event_detail)
    const [error, setError] = useState(null)
    const [starDisabled, setStarDisabled] = useState(true)

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

    useEffect(
        () => {
            if (id_report) {
                axios.get(urlServer + uriReport + id_report, {withCredentials: true})
                    .then((response) => {
                        setReportDataDescription(response.data)
                    })
                    .then(dispatch(updateNotes(id_report)))
                    .catch((error) => setError(error.toString()))
            }
        },
        [id_report]
    )

    useEffect(
        () => {
            if (reportDataDescription?.image) {
                axios.get(urlServer + uriPicture + reportDataDescription.image)
                    .then((result) => setPictureLink(result?.data?.image))
            }

        },
        [reportDataDescription]
    )

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
                .catch((error) => setError(error.toString()))
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
                !reportDataDescription ? null :
                    <>
                        <Modal show={showEventDetail} onHide={() => dispatch(hideEventModal())}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col">
                                                {reportDataDescription.user_type === "PEDESTRIAN" ?
                                                    <FontAwesomeIcon icon={faWalking} transform="grow-5"/>
                                                    :
                                                    <FontAwesomeIcon icon={faBiking}/>}
                                            </div>
                                            {capitalize(translation[reportDataDescription.category_1])}
                                        </div>
                                    </div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>{error}</div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col">
                                            {capitalize(translation[reportDataDescription.category_2])}
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            {pictureLink ?
                                                <div className="mb-3 mt-3">
                                                    <img src={pictureLink} alt="picture" className="image-report"/>
                                                </div>
                                                : null}
                                        </div>

                                    </div>
                                </div>
                                <div className="container-fluid">
                                    <hr/>
                                    <div className="row">
                                        <div className="col">
                                            Gravité :
                                            <Rating key={"rating-star-" + note_mine ? note_mine : "null"}
                                                    name="simple-controlled"
                                                    value={note_mine}
                                                    onChange={(event, newValue) => {
                                                        handlerVoteGravity(newValue);
                                                    }}
                                                    diabled={starDisabled}
                                            />
                                        </div>
                                        <div className="col">
                                            <h6>Moyenne des votes ({n_votes})</h6>
                                            {notes_other !== -1 ? "Gravité : " + notes_other : null}
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
            }
        </>
    )
}

export default ModalEventDetail