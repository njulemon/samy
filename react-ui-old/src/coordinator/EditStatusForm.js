import React, {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../app/hooks";
import {PatchCsrf} from "../api/Csrf";
import useAnnotationHook from "../hooks/useAnnotationHook";
import {Accordion} from "react-bootstrap";
import {MdDeleteForever} from "react-icons/md";
import {IconContext} from "react-icons";
import {urlify} from "../Tools/Urlify";
import {useForm} from "react-hook-form";

const EditStatusForm = ({reportPk}) => {

    const [editStatus, setEditStatus] = useState(false)
    const [saveEnabled, setSaveEnabled] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)

    const [
        statesAnnotation,
        error,
        options,
        fetchAnnotation,
        addAnnotationComment,
        deleteAnnotationComment,
        setReportStatus,
        setReportInCharge] = useAnnotationHook(reportPk)

    const [newTextComment, setNewTextComment] = useState("")

    // translation
    const _ = useAppSelector(state => state.states.translation)

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = data => {

        setSaveEnabled(false)

        let data_ = {}

        if (!!(data.status)){
            data_ = {...data_, status: Number(data.status)}
        }

        if (!!(data.in_charge)){
            data_ = {...data_, in_charge: Number(data.in_charge)}
        }

        PatchCsrf(statesAnnotation?.url, data_)
            .then(() => {
                setEditStatus(false)
                setSaveEnabled(true)
                setErrorMsg(null)
                fetchAnnotation()
            })
            .catch(error => {
                setEditStatus(true)
                setSaveEnabled(true)
                setErrorMsg(error.toString())
                fetchAnnotation()
            })
    }

    return (

        <div className="container-fluid p-0">
            <div className="row">
                <div className="col-12 mb-2">
                    <div className="invalid-feedback d-block">
                        {errorMsg}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">

                    <div className="col-3">
                        <select {...register("status")}
                                className="form-control form-select"
                                disabled={!editStatus}
                                onChange={event => setReportStatus(event.target.value)}
                                value={statesAnnotation?.status ? statesAnnotation.status : 0}>
                            {options &&
                                options.status.map(row =>
                                    <option key={row.value} value={row.value}>{_[row.display_name]}</option>)
                            }
                        </select>
                    </div>

                    <div className="col-3">
                        <select {...register("in_charge")}
                                className="form-control form-select"
                                disabled={!editStatus}
                                onChange={event => setReportInCharge(event.target.value)}
                                value={statesAnnotation?.in_charge ? statesAnnotation.in_charge : 0}>
                            {options &&
                                options.in_charge.map(row =>
                                    <option key={row.value} value={row.value}>{_[row.display_name]}</option>)
                            }
                        </select>
                    </div>

                    <div className="col-auto">
                        <button className="btn btn-primary me-4" onClick={() => setEditStatus(true)}
                                disabled={editStatus}>Éditer
                        </button>
                    </div>

                    <div className="col-auto">
                        <button className="btn btn-primary me-4"
                                type="submit"
                                hidden={!editStatus}
                                disabled={!saveEnabled}>
                            Sauver
                        </button>
                    </div>
                </div>
            </form>

            <div className="row mt-4">
                <div className="col-6">
                    <Accordion>
                        <Accordion.Item eventKey={reportPk}>
                            <Accordion.Header>
                                Annotations {statesAnnotation?.comments?.length !== 0 && `(${statesAnnotation?.comments?.length})`}
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
                    <textarea type="text" className="form-control mb-2" rows="4"
                              onChange={event => setNewTextComment(event.target.value)}
                              value={newTextComment}
                              placeholder={"Entrez ici une nouvelle annotation, puis -> ajouter"}/>
                    <button className="btn btn-primary" onClick={() => {
                        addAnnotationComment(newTextComment);
                        setNewTextComment("")
                    }}>Ajouter annotation
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditStatusForm