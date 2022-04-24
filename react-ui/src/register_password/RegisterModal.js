import Modal from "react-bootstrap/Modal";
import RegisterForm from "./RegisterForm";


function RegisterModal({showModal, setShowModal}) {

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Enregistrement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RegisterForm/>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterModal