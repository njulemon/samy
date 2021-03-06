import {useAppDispatch} from "./app/hooks";
import {Formik, Form, Field} from "formik";
import {uriLogin, urlServer} from "./def/Definitions";
import {PostCsrf} from "./api/Csrf";
import {checkAccessAndGetUser, denyAccess} from "./app/States";
import {useEffect, useState} from "react";
import {logout} from "./api/Access";
import ModalResetPassword from "./register_password/ModalResetPassword";
import MenuNavAndFooter from "./MenuNavAndFooter";

function Login() {


    const dispatch = useAppDispatch()

    const [errorLogin, setErrorLogin] = useState('')

    const validateForm = (values) => {
        const errors = {};
        if (!values.username) {
            errors.username = 'Veuillez introduire votre adresse e-mail';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(values.username)) {
            errors.username = 'Adresse e-mail invalide';
        }

        if (!values.password) {
            errors.password = 'Veuillez indiquer votre mot de passe';
        }
        return errors;
    }

    const submitForm = (values) => {
        const data = {
            'username': values.username,
            'password': values.password
        }

        PostCsrf(urlServer + uriLogin, data)
            .then(
                (gotAccess) => {
                    if (gotAccess) {
                        setErrorLogin('')
                        dispatch(checkAccessAndGetUser())
                    } else {
                        setErrorLogin('Accès refusé')
                        logout().then(() => dispatch(denyAccess()))
                    }
                }
            )
            .catch((reason) => setErrorLogin('Accès refusé'))
    }

    // modal to register.
    // const [showRegisterModal, setShowRegisterModal] = useState(false)

    // modal to reset password.
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)

    useEffect(
        () => {
            dispatch(checkAccessAndGetUser())
        },
        [dispatch]
    )

    // @ts-ignore
    return (
        // <div className="container-fluid m-0 p-0">
        <MenuNavAndFooter>
            {/*<RegisterModal setShowModal={setShowRegisterModal} showModal={showRegisterModal}/>*/}

            <ModalResetPassword setShowModal={setShowResetPasswordModal} showModal={showResetPasswordModal}/>

            {/*<NavbarSamy setShowRegisterModal={setShowRegisterModal}/>*/}



            <div className="container-fluid container-login-scroll">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div className="card shadow-lg rounded-lg bg-transparent">
                            <div className="card-body bg-transparent">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col">
                                            <Formik
                                                initialValues={{
                                                    username: '',
                                                    password: '',
                                                }}
                                                onSubmit={(values, {setSubmitting}) => {
                                                    submitForm(values)
                                                }}
                                                validate={validateForm}>

                                                {(formik, isSubmitting) => (
                                                    <Form>
                                                        <div className="mb-3">
                                                            <div className="form-label">Adresse e-mail</div>
                                                            <Field
                                                                className={(formik.touched.username && formik.errors.username) ? 'form-control is-invalid' : 'form-control'}
                                                                name="username"
                                                                id="username"
                                                                type="text"
                                                                placeholder="Enter email"/>
                                                            {formik.touched.username && formik.errors.username ? (
                                                                <div
                                                                    className="invalid-feedback">{formik.errors.username}</div>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <div className="form-label">Mot de passe</div>
                                                            <Field
                                                                className={(formik.touched.password && formik.errors.password) ? 'form-control is-invalid' : 'form-control'}
                                                                name="password"
                                                                id="password"
                                                                type="password"
                                                                placeholder="Password"/>
                                                            {formik.touched.password && formik.errors.password ? (
                                                                <div
                                                                    className="invalid-feedback">{formik.errors.password}</div>
                                                            ) : null}
                                                        </div>
                                                        <button className="btn btn-primary form-button" type="submit"
                                                                disabled={isSubmitting}>
                                                            {isSubmitting ? "Merci de patienter..." : "Se connecter"}
                                                        </button>
                                                        {errorLogin !== '' ?
                                                            (<div className="mb-3">
                                                                <div className="form-label is-invalid"></div>
                                                                <div
                                                                    className="invalid-feedback is-invalid">{errorLogin}</div>
                                                            </div>)
                                                            :
                                                            null}

                                                    </Form>
                                                )}
                                            </Formik>
                                            <hr/>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className='col col-xs-6 text-left'>
                                            <a onClick={() => setShowResetPasswordModal(true)} href="#"> Mot de passe
                                                oublié ?</a>
                                        </div>
                                        <div className="col col-xs-6 text-right">
                                            {/*<a onClick={() => setShowRegisterModal(true)} href="#">S'enregistrer</a>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row p-4">
                </div>
            </div>
            {/*<FooterSamy/>*/}
        </MenuNavAndFooter>
    )
}

export default Login