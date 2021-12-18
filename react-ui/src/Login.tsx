import {useAppDispatch, useAppSelector} from "./app/hooks";
import {Formik, Form, Field} from "formik";
import {urlServer} from "./def/Definitions";
import {PostCsrf} from "./api/Csrf";
import {denyAccess, giveAccess} from "./app/Login";
import * as Yup from 'yup';
import {useState} from "react";

function Login() {


    const dispatch = useAppDispatch()
    const isLogged = useAppSelector((state) => state.isLogged.value)

    const [errorLogin, setErrorLogin] = useState('')

    const url = urlServer + '/api/login/'

    const validateForm = (values: any) => {
        const errors: { [name: string]: string } = {};
        if (!values.username) {
            errors.username = 'Veuillez introduire votre adresse e-mail';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.username)) {
            errors.username = 'Adresse e-mail invalide';
        }

        if (!values.password) {
            errors.password = 'Veuillez indiquer votre mot de passe';
        }
        return errors;
    };

    // @ts-ignore
    return (
        <>
            <div className=" container-fluid fill-height">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div className="card">
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col">
                                            <Formik
                                                initialValues={{
                                                    username: '',
                                                    password: '',
                                                }}
                                                onSubmit={(values, {setSubmitting}) => {
                                                    const data = {
                                                        'username': values.username,
                                                        'password': values.password
                                                    }

                                                    PostCsrf(url, data)
                                                        .then(
                                                            (gotAccess) => {
                                                                if (gotAccess) {
                                                                    setErrorLogin('')
                                                                    dispatch(giveAccess())
                                                                } else {
                                                                    setErrorLogin('Accès refusé')
                                                                    dispatch(denyAccess())
                                                                }
                                                            }
                                                        )
                                                        .catch((reason) => setErrorLogin('Accès refusé'))
                                                }}
                                                validate={validateForm}>

                                                {(formik: any, isSubmitting: any) => (
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
                                                                <div className="invalid-feedback is-invalid">{errorLogin}</div>
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
                                            <a href="#"> Mot de passe oublié ?</a>
                                        </div>
                                        <div className="col col-xs-6 text-right">
                                            <a href='#'>S'enregistrer</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row"></div>
            </div>
        </>
    )
}

export default Login