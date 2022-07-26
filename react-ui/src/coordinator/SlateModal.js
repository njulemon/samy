import Modal from "react-bootstrap/Modal";
import SlateEditor from "./SlateEditor";
import useSlateState from "../hooks/useSlateState";
import {useEffect, useState} from "react";

const SlateModal = ({show, setShow, id}) => {

    const slateState = useSlateState(id)
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

    useEffect(() => {
        if (!slateState.hasChanged) {
            setShowAlertModifications(false)
        }
    }, [slateState.hasChanged])

    return (
        <Modal show={show}
               onHide={onHide}
               fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>Édition du dossier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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

                <SlateEditor id={id} slateState={slateState}/>
            </Modal.Body>
        </Modal>
    )
}

export default SlateModal

