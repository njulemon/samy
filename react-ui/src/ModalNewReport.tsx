import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {hide, show} from "./app/Report";

function ModalNewReport() {

    // show/hide modal
    const showNewReport = useAppSelector((state) => state.showNewReport.value)
    const dispatch = useAppDispatch()

    return (
        <Modal show={showNewReport} onHide={() => dispatch(hide())}>
            <Modal.Header closeButton>
                <Modal.Title>Nouveau signalement</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(hide())}>
                    Fermer
                </Button>
                <Button variant="primary" onClick={() => dispatch(show())}>
                    Signaler
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalNewReport;