import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {hide, show} from "./app/Report";


function ModalNew() {


    const showNewReport = useAppSelector((state) => state.showNewReport.value)
    const dispatch = useAppDispatch()

    return (
        <Modal show={showNewReport} onHide={() => dispatch(hide())}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => dispatch(hide())}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => dispatch(show())}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalNew;