import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";
import {PatchCsrf} from "../api/Csrf";
import useAnnotationHook from "./useAnnotationHook";
import {Accordion} from "react-bootstrap";
import {MdDeleteForever} from "react-icons/md";
import {IconContext} from "react-icons";
import {urlify} from "../Tools/Urlify";

const EditStatusForm = ({reportPk}) => {

    const [editStatus, setEditStatus] = useState(false)
    const [saveEnabled, setSaveEnabled] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)

    const [statesAnnotation, error, options, fetchAnnotation, addAnnotationComment, deleteAnnotationComment] = useAnnotationHook(reportPk)

    const status = useRef(null)
    const in_charge = useRef(null)
    const new_text_comment = useRef(null)

    // translation
    const _ = useAppSelector(state => state.states.translation)

    const saveStatus = () => {

        setSaveEnabled(false)

        const data = {
            status: Number(status.current.value),
            in_charge: Number(in_charge.current.value)
        }

        PatchCsrf(statesAnnotation?.url, data)
            .then(() => {
                setEditStatus(false)
                setSaveEnabled(true)
                setErrorMsg(null)
            })
            .catch(error => {
                setEditStatus(true)
                setSaveEnabled(true)
                setErrorMsg(error.toString())
            })

    }

    useEffect(() => {
        // fetchAnnotation()
    }, [])

    useEffect(() => {
        in_charge.current.value = statesAnnotation.in_charge
        status.current.value = statesAnnotation.status
    }, [statesAnnotation.status, statesAnnotation.in_charge])

    return (

        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12 mb-2">
                    <div className="invalid-feedback d-block">
                        {errorMsg}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <select className="form-control form-select"
                            disabled={!editStatus}
                            ref={status}>
                        {options &&
                        options.status.map(row =>
                            <option key={row.value} value={row.value}>{_[row.display_name]}</option>)
                        }
                    </select>
                </div>
                <div className="col-3">
                    <select
                        className="form-control form-select"
                        disabled={!editStatus}
                        ref={in_charge}>
                        {options &&
                        options.in_charge.map(row =>
                            <option key={row.value} value={row.value}>{_[row.display_name]}</option>)
                        }
                    </select>
                </div>
                <div className="col">
                    <button className="btn btn-primary me-4" onClick={() => setEditStatus(true)}
                            disabled={editStatus}>Éditer
                    </button>
                    <button className="btn btn-primary me-4"
                            onClick={() => saveStatus()}
                            hidden={!editStatus}
                            disabled={!saveEnabled}>
                        Sauver
                    </button>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-6">
                    <Accordion>
                        <Accordion.Item eventKey={reportPk}>
                            <Accordion.Header>
                                Annotations
                            </Accordion.Header>
                            <Accordion.Body>
                                {statesAnnotation?.comments?.map(row =>
                                    <div className="row" key={"comment" + row.id}>
                                        <div className="col-10">
                                            <div className="fw-light">
                                                {(new Date(row.date_modified)).toLocaleDateString() + " " + (new Date(row.date_modified)).toLocaleTimeString()}
                                            </div>
                                            <p className="text-justify">
                                                {urlify(row.comment)}
                                            </p>
                                        </div>
                                        <div className="col-auto">
                                            <IconContext.Provider
                                                value={{size: "1.5em", className: "delete-icon delete-icon-shadow"}}>
                                                <MdDeleteForever
                                                    onClick={() => deleteAnnotationComment(row.url)}/>
                                            </IconContext.Provider>
                                        </div>
                                        <hr/>
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className="col-6">
                    <textarea type="text" className="form-control mb-2" rows="4" ref={new_text_comment} placeholder={"Entrez ici une nouvelle annotation, puis -> ajouter"}/>
                    <button className="btn btn-primary" onClick={() => {addAnnotationComment(new_text_comment.current.value); new_text_comment.current.value = ""}}>Ajouter annotation</button>
                </div>
            </div>
        </div>
    )
}

export default EditStatusForm