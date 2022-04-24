import {Nav, Navbar, NavDropdown, Offcanvas} from "react-bootstrap";
import logo from './images/logo-samy.png'
import {Link, useNavigate} from "react-router-dom";

const NavbarSamy = ({setShowRegisterModal}) => {

    const navigate = useNavigate()

    return (
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <div className="container">
                <Navbar.Brand>
                    <h1 className="logo-samy-navbar fw-bolder">Samy</h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/R/menu/login')}>
                            Voir la carte
                        </Nav.Link>
                        <Nav.Link onClick={() => navigate("/R/menu/features")}>Fonctionnalités</Nav.Link>
                        <Nav.Link onClick={() => navigate("/R/menu/who")}>Qui sommes-nous ?</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => setShowRegisterModal(true)}>
                            S'enregistrer
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default NavbarSamy