import Login from "./Login";
import Who from "./Who";
import {Route, Routes} from "react-router-dom";
import RegisterModal from "./register_password/RegisterModal";
import NavbarSamy from "./NavbarSamy";
import {useAppDispatch} from "./app/hooks";
import {useState} from "react";
import FooterSamy from "./FooterSamy";

const MenuNavAndFooter = ({children}) => {

    const dispatch = useAppDispatch()

    // modal to register.
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    return (
        <div className="container-fluid m-0 p-0 main-page-footer-header">

            <RegisterModal setShowModal={setShowRegisterModal} showModal={showRegisterModal}/>

            <NavbarSamy setShowRegisterModal={setShowRegisterModal}/>

            {children}

            <FooterSamy/>

        </div>
    )
}

export default MenuNavAndFooter