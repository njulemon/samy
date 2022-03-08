import Modal from "react-bootstrap/Modal";
import {hideReportModal} from "./app/States";
import FormReport from "./FormReport";
import FormResetPassword from "./FormResetPassword";
import RegisterForm from "./RegisterForm";


function ModalResetPassword({showModal, setShowModal}) {

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormResetPassword/>
            </Modal.Body>
        </Modal>
    )
}

export default ModalResetPassword

