import {Spinner} from "react-bootstrap";

const Wait = () => {
    return (
        <div className="container-fluid m-0 p-0 container-wait">
            <div className="row justify-content-md-center align-items-center h-100">
                <div className="col text-center m-3">

                    <div className="text-white mb-5">
                        <h3>
                            Merci de patienter lors du chargement des données.
                        </h3>

                        <h3>
                            Il peut être plus ou moins long lors de votre première visite car les données
                            liées aux communes représentent 15Mo.
                        </h3>

                        <h3>
                            Elles sont sauvegardées dans la mémoire de votre appareil.
                        </h3>
                    </div>

                    <Spinner animation="grow" variant="primary"/>
                    <Spinner animation="grow" variant="primary"/>
                    <Spinner animation="grow" variant="primary"/>
                    <br/>

                </div>
            </div>
        </div>
    )
}

export default Wait