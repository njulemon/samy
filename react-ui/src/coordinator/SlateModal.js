import Modal from "react-bootstrap/Modal";
import SlateEditor from "./SlateEditor";
import useSlateState from "../hooks/useSlateState";
import React, {useEffect, useState} from "react";
import SlateAnnex from "./SlateAnnex";
import axios from "axios";
import {urlServer} from "../def/Definitions";

const SlateModal = ({show, setShow, id}) => {

    const slateState = useSlateState(id)
    const [reportIds, setReportsIds] = useState([])
    const [showAlertModifications, setShowAlertModifications] = useState(false)

    const onHide = () => {
        if (slateState.hasChanged) {
            setShowAlertModifications(true)
        } else {
            setShow(false)
        }
    }

    const leaveAndReset = () => {
        slateState.load()
        setShow(false)
    }

    const copyToClipBoard = () => {

        // clipboardItem not defined issue...
        const { ClipboardItem } = window;

        const content_editor = document.getElementById("selection-node-slate").innerHTML;
        const content_annex = document.getElementById("selection-node-annex").innerHTML;
        const blob = new Blob([content_editor, content_annex], {type: "text/html"});
        const richTextInput = new ClipboardItem({"text/html": blob});
        navigator.clipboard.write([richTextInput]);
    }

    useEffect(() => {
        if (!slateState.hasChanged) {
            setShowAlertModifications(false)
        }
    }, [slateState.hasChanged])

    useEffect(() => {
        axios.get(`${urlServer}/api/document/${id}/`, {withCredentials: true}).then(result => setReportsIds(result.data.reports.map(report => report.id)))
    }, [id])

    return (
        <Modal show={show}
               onHide={onHide}
               fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Édition du dossier</Modal.Title>
            </Modal.Header>
            <Modal.Body id="selection-node">
                {showAlertModifications ?
                    <div className="alert alert-danger" role="alert">
                        Vous avez des modifications non-enregistrées.
                        <br/>
                        <div className="col mt-2">
                            <div className="col-auto">
                                <button className="btn btn-outline-danger" onClick={leaveAndReset}>
                                    Quitter
                                </button>
                                <button className="btn btn-outline-success ms-3" onClick={() => {
                                    slateState.save()
                                    setShowAlertModifications(false)
                                }}>
                                    Enregistrer
                                </button>
                            </div>
                            <div className="col-auto">

                            </div>
                        </div>
                    </div>
                    :
                    null
                }

                <SlateEditor id={id} slateState={slateState} copyToClipBoard={copyToClipBoard}/>
                <SlateAnnex ids={reportIds}/>
            </Modal.Body>
        </Modal>
    )
}

export default SlateModal

