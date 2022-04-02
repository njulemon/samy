import Modal from "react-bootstrap/Modal";

const ModalRanking = ({show, setShow}) => {
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            fullscreen="sm-down"
        >
            <Modal.Header closeButton>
                <Modal.Title>Signalements</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal>
    )
}

export default ModalRanking