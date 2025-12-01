import Modal from "react-bootstrap/Modal";
import NewDossierForm from "./NewDossierForm";
import {type} from "./NewDossierForm"

const ModalUpdateDossier = ({show, setShow, dossierHook}) => {

     return (
        <Modal show={show}
               onHide={() => setShow(false)}
               fullscreen="sm-down">
            <Modal.Header closeButton>
                <Modal.Title>Éditer dossier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NewDossierForm dossierHook={dossierHook} type_={type.update}/>
            </Modal.Body>
        </Modal>
    )
}

export default ModalUpdateDossier