import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";
import {PatchCsrf} from "../api/Csrf";

const EditStatusForm = ({urlAnnotation}) => {

    const [annotationOptions, setannotationOptions] = useState(null)
    const [editStatus, setEditStatus] = useState(false)
    const [saveEnabled, setSaveEnabled] = useState(true)
    const [errorMsg, setErrorMsg] = useState(null)

    const status = useRef(null)
    const in_charge = useRef(null)

    // translation
    const _ = useAppSelector(state => state.states.translation)

    const saveStatus = () => {

        setSaveEnabled(false)

        const data = {
            status: Number(in_charge.current.value),
            in_charge: Number(status.current.value)
        }

        PatchCsrf(urlAnnotation, data)
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

    const getData = async () => {

        if (!!urlAnnotation) {
            // get the options
            const request_option = await axios.options(urlServer + '/api/report-annotation/', {withCredentials: true})
            setannotationOptions(
                {
                    'in_charge': request_option.data.actions.POST.in_charge.choices,
                    'status': request_option.data.actions.POST.status.choices
                })

            // get the actual option
            const request_current = await axios.get(urlAnnotation, {withCredentials: true})
            status.current.value = request_current.data.status
            in_charge.current.value = request_current.data.in_charge
        }
    }

    useEffect(() => {
        getData().catch(error => setErrorMsg(error.toString()))
    }, [urlAnnotation])

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
                        {annotationOptions &&
                        annotationOptions.in_charge.map(row =>
                            <option key={row.value} value={row.value}>{_[row.display_name]}</option>)
                        }
                    </select>
                </div>
                <div className="col-3">
                    <select
                        className="form-control form-select"
                        disabled={!editStatus}
                        ref={in_charge}>
                        {annotationOptions &&
                        annotationOptions.status.map(row =>
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
        </div>

    )
}

export default EditStatusForm