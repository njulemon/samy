import Modal from "react-bootstrap/Modal";
import FormResetPassword from "./FormResetPassword";


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

