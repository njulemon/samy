import Modal from "react-bootstrap/Modal";
import React from "react";

const ModalOutOfArea = ({show, setShow}) => {


    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            size="sm">

            <Modal.Header closeButton>
                <Modal.Title>
                    Signalement hors zone couverte
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="container-fluid">
                    <div className="row mb-4">
                        Vous ne pouvez ajouter un signalement qu'à l'intérieur d'une commune pour laquelle un
                        coordinateur
                        est actif.
                    </div>
                    <div className="row mb-4">
                        Ces communes sont indiquées sur la carte par les zones bleues.
                    </div>
                    <div className="row">
                        Lorsque vous ajoutez le marqueur, celui-ci est placé au centre de l'écran. Si le centre de
                        l'écran
                        ne correspond pas à une zone bleue, vous ne serez pas autorisé à l'y ajouter.
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalOutOfArea