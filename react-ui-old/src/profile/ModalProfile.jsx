import Modal from "react-bootstrap/Modal";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import {hideProfileModal} from "../app/States";
import Notifications from "./Notifications";
import Delete from "./Delete";

const ModalProfile = () => {

    const dispatch = useAppDispatch()
    const showProfile = useAppSelector((state) => state.states.modales.modal_profile)

    return (
        <Modal show={showProfile}
               onHide={() => {
                   dispatch(hideProfileModal())
               }}
               size="lg"
               backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Mon profil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container id="profile-tabs" defaultActiveKey="profile">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item className="pointer">
                                    <Nav.Link eventKey="profile">Voir le profil</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="pointer">
                                    <Nav.Link eventKey="edit_profile">Éditer le profil</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="pointer">
                                    <Nav.Link eventKey="notifications">Gérer les notifications</Nav.Link>
                                </Nav.Item>
                                {/*<Nav.Item>*/}
                                {/*    <Nav.Link eventKey="reports">Mes signalements</Nav.Link>*/}
                                {/*</Nav.Item>*/}
                                <Nav.Item className="pointer">
                                    <Nav.Link eventKey="delete">Supprimer mon compte</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="profile">
                                    <Profile />
                                </Tab.Pane>
                                <Tab.Pane eventKey="edit_profile">
                                    <EditProfile />
                                </Tab.Pane>
                                <Tab.Pane eventKey="notifications">
                                    <Notifications />
                                </Tab.Pane>
                                {/*<Tab.Pane eventKey="reports">*/}
                                {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ipsum nisl,*/}
                                {/*    eleifend eu tristique ac, pellentesque ut justo. In elementum convallis lectus non*/}
                                {/*    pharetra. Aenean in arcu ac felis semper rutrum. Curabitur et nunc ac est blandit*/}
                                {/*    finibus. Quisque sagittis, sem in tincidunt condimentum, magna neque blandit erat,*/}
                                {/*    et dapibus magna tortor eget purus. Sed faucibus nisl sed felis volutpat suscipit.*/}
                                {/*    Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus*/}
                                {/*    mus. Nam mauris orci, pretium et malesuada imperdiet, varius in massa. Donec turpis*/}
                                {/*    ligula, ullamcorper et arcu ac, consequat volutpat ligula.*/}

                                {/*    Pellentesque non rhoncus velit, eu viverra elit. Quisque vitae velit a lectus*/}
                                {/*    ullamcorper cursus ut et nisi. Mauris a dui quis est volutpat placerat tempus eu*/}
                                {/*    nisi. Pellentesque ornare neque at sagittis iaculis. Nunc accumsan tempus rutrum.*/}
                                {/*    Morbi maximus sem nec urna eleifend, nec varius ipsum blandit. Aenean malesuada*/}
                                {/*    vitae felis eget rhoncus. Vestibulum pharetra leo purus, vel gravida massa mollis*/}
                                {/*    eu. Etiam ut auctor turpis. Nunc a velit ac eros elementum lacinia. Donec dapibus*/}
                                {/*    justo id libero tincidunt vehicula.*/}
                                {/*</Tab.Pane>*/}
                                <Tab.Pane eventKey="delete">
                                    <Delete />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    )
}

export default ModalProfile