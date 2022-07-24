import Modal from "react-bootstrap/Modal";
import ReportCard from "../ReportCard";

const ModalReportSimple = ({show, setShow, idReport}) => {

     return (
        <Modal show={show}
               onHide={() => setShow(false)}
               fullscreen="sm-down">
            <Modal.Header closeButton>
                <Modal.Title>Détail Signalement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <ReportCard id={idReport} fullSize/>
            </Modal.Body>
        </Modal>
    )
}

export default ModalReportSimple