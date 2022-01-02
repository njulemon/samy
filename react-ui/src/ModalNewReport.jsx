import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {hideReportModal, showReportModal} from "./app/States";
import FormReport from "./FormReport";

function ModalNewReport() {

    // show/hide modal
    const showNewReport = useAppSelector((state) => state.states.modales.modal_new_report)
    const dispatch = useAppDispatch()


    return (
        <Modal show={showNewReport} onHide={() => dispatch(hideReportModal())}>
            <Modal.Header closeButton>
                <Modal.Title>Nouveau signalement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormReport></FormReport>
            </Modal.Body>
        </Modal>
    )
}

export default ModalNewReport;