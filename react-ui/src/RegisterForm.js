import {Field, Form, Formik} from "formik";
import {useState} from "react";
import {postRegister} from "./api/Register";

function RegisterForm() {

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')
    const [registeredDone, setRegisteredDone] = useState(false)

    const validateForm = (values) => {
        const errors = {};
        if (!values.first_name) {
            errors.first_name = 'Veuillez indiquer votre prénom';
        }

        if (!values.last_name) {
            errors.last_name = 'Veuillez indiquer votre nom';
        }

        if (!values.email) {
            errors.email = 'Requis';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Adresse e-mail invalide';
        }

        if (!values.password) {
            errors.password = 'Requis';
        } else if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(values.password)) {
            errors.password = 'Le mot de passe doit contenir au moins 8 caractères, au moins un chiffre et au moins une lettre.';
        }

        if (!values.password_validation) {
            errors.password_validation = 'Requis'
        } else if (values.password.localeCompare(values.password_validation) !== 0) {
            errors.password_validation = 'Les mots de passe ne correspondent pas'
        }

        return errors;
    };

    return (
        <Formik
            initialValues={{
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                password_validation: ''
            }}
            onSubmit={(values, {setSubmitting, setFieldError}) => {
                const data = {
                    'first_name': values.first_name,
                    'last_name': values.last_name,
                    'email': values.email,
                    'password': values.password
                }


                setSubmitting(true)
                postRegister(data)
                    .then(
                        (response) => {
                            if (response.status === 200 || response.status === 201) {
                                setErrorForm('')
                                setRegisteredDone(true)
                            } else {
                                for (let key in response) {
                                    setFieldError(key, response[key][0])
                                }
                            }
                        }
                    )
                    .catch((reason) => {
                        setErrorForm(reason?.response?.data?.error ?? 'Une erreur s\'est produite')
                        console.log(reason.toJSON());
                        for (let key in reason) {
                                    setFieldError(key, reason[key][0])
                                }

                    })
                    .finally(() => {
                        setSubmitting(false)
                    })
            }}
            validate={validateForm}
        >


            {(formik) => (
                registeredDone ? <div> Votre compte a bien été créé. Veuillez valider votre adresse e-mail en cliquant sur le lien inclu dans l'e-mail que vous avez reçu. </div> :
                <Form>
                    <div className="mb-3">

                        <div className="mb-1">
                            <label htmlFor="first_name">Prénom</label>
                            <Field
                                className={(formik.touched["first_name"] && formik.errors["first_name"]) ? 'form-control is-invalid' : 'form-control'}
                                name="first_name"
                                id="first_name">
                            </Field>
                            {formik.touched["first_name"] && formik.errors["first_name"] ? (
                                <div
                                    className="invalid-feedback">{formik.errors["first_name"]}</div>
                            ) : null}
                        </div>

                        <div className="mb-1">
                            <label htmlFor="last_name">Nom</label>
                            <Field
                                className={(formik.touched["last_name"] && formik.errors["last_name"]) ? 'form-control is-invalid' : 'form-control'}
                                name="last_name"
                                id="last_name">
                            </Field>
                            {formik.touched["last_name"] && formik.errors["last_name"] ? (
                                <div
                                    className="invalid-feedback">{formik.errors["last_name"]}</div>
                            ) : null}
                        </div>

                        <div className="mb-1">
                            <label htmlFor="email">Adresse e-mail</label>
                            <Field
                                className={(formik.touched["email"] && formik.errors["email"]) ? 'form-control is-invalid' : 'form-control'}
                                name="email"
                                id="email">
                            </Field>
                            {formik.touched["email"] && formik.errors["email"] ? (
                                <div
                                    className="invalid-feedback">{formik.errors["email"]}</div>
                            ) : null}
                        </div>

                        <div className="mb-1">
                            <label htmlFor="password">Mot de passe</label>
                            <Field
                                className={(formik.touched["password"] && formik.errors["password"]) ? 'form-control is-invalid' : 'form-control'}
                                name="password"
                                id="password"
                                type="password"
                            >
                            </Field>
                            {formik.touched["password"] && formik.errors["password"] ? (
                                <div
                                    className="invalid-feedback">{formik.errors["password"]}</div>
                            ) : null}
                        </div>


                        <div className="mb-1">
                            <label htmlFor="password_validation">Confirmation de mot passe</label>
                            <Field
                                className={(formik.touched["password_validation"] && formik.errors["password_validation"]) ? 'form-control is-invalid' : 'form-control'}
                                name="password_validation"
                                id="password_validation"
                                type="password"
                            >
                            </Field>
                            {formik.touched["password_validation"] && formik.errors["password_validation"] ? (
                                <div
                                    className="invalid-feedback">{formik.errors["password_validation"]}</div>
                            ) : null}
                        </div>
                    </div>

                    <button className="btn btn-primary form-button" type="submit"
                            disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Merci de patienter..." : "Envoyer"}
                    </button>
                    {errorForm !== '' ?
                        (<div className="mb-3">
                            <div className="form-label is-invalid"></div>
                            <div className="invalid-feedback is-invalid">{errorForm}</div>
                        </div>)
                        :
                        null}

                </Form>)}
        </Formik>
    )
}

export default RegisterForm