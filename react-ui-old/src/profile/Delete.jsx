import React, {useState} from "react";
import {Alert} from "react-bootstrap";
import {deleteCsrf} from "../api/Csrf";
import {useNavigate} from "react-router-dom";

const Delete = () => {

    const [confirmation, setConfirmation] = useState(false)

    const navigate = useNavigate()

    const handleDelete = () => {
        deleteCsrf('http://localhost:8000/api/user-del/1/').then(navigate('/'))
    }

    return (
        <>
            {!confirmation ?
                <button className="btn btn-danger me-2" onClick={() => setConfirmation(true)}>
                    Supprimer mon compte
                </button>

                :
                <>
                    <Alert variant="danger" onClose={() => setConfirmation(false)}
                           dismissible>
                        <Alert.Heading>
                            Suppression de votre compte
                        </Alert.Heading>
                        <p>
                            Voulez-vous vraiment supprimer votre compte ? Cette action est
                            irréversible. Vos signalements seront conservés. Mais vous
                            n'aurez plus la possibilité de les modifier, n'y d'en ajouter de
                            nouveaux.
                        </p>
                        <button className="btn btn-danger me-2"
                                onClick={() => handleDelete()}>Supprimer
                        </button>
                        <button className="btn btn-primary me-2"
                                onClick={() => setConfirmation(false)}>Annuler
                        </button>
                    </Alert>
                </>
            }

        </>
    )
}

export default Delete