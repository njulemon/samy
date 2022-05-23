import {Col, Row} from "react-bootstrap";
import {useAppSelector} from "../app/hooks";
import avatar from "../images/avatar.png"
import {useUserStatHook} from "../hooks/useUserStatHook";

const Profile = () => {

    const user = useAppSelector(state => state.states.user)
    const userStatHook = useUserStatHook()

    return (
        <div className="border p-2">
            <Row>
                <Col>
                    <div className="vstack gap-3">
                        <div className="vstack gap-0">
                            <div className="fw-light">Nom</div>
                            <div>{user.first_name} {user.last_name}</div>
                        </div>
                        <div className="vstack gap-0">
                            <div className="fw-light">Pseudo</div>
                            <div>{user.alias}</div>
                        </div>
                        <div className="vstack gap-0">
                            <div className="fw-light">E-mail</div>
                            <div>{user.email}</div>
                        </div>
                        <div className="vstack gap-0">
                            <div className="fw-light">Signalements rapportés</div>
                            <div>{userStatHook.stat.n_reports}</div>
                        </div>
                        <div className="vstack gap-0">
                            <div className="fw-light">Dernier signalement</div>
                            <div>{new Date(userStatHook.stat.last_report_date).toLocaleDateString()}</div>
                        </div>
                        <div className="vstack gap-0">
                            <div className="fw-light">Votes</div>
                            <div>{userStatHook.stat.n_votes}</div>
                        </div>
                        <div className="fw-light">
                            Actif depuis
                            le {new Date(user.date_joined).toLocaleDateString()}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Profile