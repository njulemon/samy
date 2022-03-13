import Modal from "react-bootstrap/Modal";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {hideNewReportModal} from "./app/States";
import FormReport from "./FormReport";

function ModalNewReport() {

    // show/hide modal
    const showNewReport = useAppSelector((state) => state.states.modales.modal_new_report)
    const dispatch = useAppDispatch()


    return (
        <Modal show={showNewReport} onHide={() => dispatch(hideNewReportModal())}>
            <Modal.Header closeButton>
                <Modal.Title>Nouveau signalement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormReport />
            </Modal.Body>
        </Modal>
    )
}

export default ModalNewReport;