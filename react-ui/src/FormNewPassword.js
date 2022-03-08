import {Field, Form, Formik} from "formik";
import {postReport} from "./api/Report";
import {clear, hideReportModal, reload} from "./app/States";
import FormReportField from "./FormReportField";
import {useState} from "react";
import {capitalize} from "./Tools/String";
import {postRegister} from "./api/Register";
import {patchNewPassword} from "./api/NewPassword";

function FormNewPassword({pk, key_reset}) {

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')
    const [registeredDone, setRegisteredDone] = useState(false)

    const validateForm = (values) => {
        const errors = {};

        if (!values.password) {
            errors.password = 'Requis';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(values.password)) {
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
        <div className=" container-fluid fill-height">
            <div className="row login-vertical-center">
                <div className="col"></div>
                <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                    <div className="card shadow-lg rounded-lg bg-transparent">
                        <div className="card-body bg-transparent">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col">

                                        <Formik
                                            initialValues={{
                                                pk_user: pk,
                                                key: key_reset,
                                                password: '',
                                                password_validation: ''
                                            }}
                                            onSubmit={(values, {setSubmitting, setFieldError}) => {
                                                const data = {
                                                    'pk_user': values.pk_user,
                                                    'key': values.key,
                                                    'password': values.password,
                                                    'password_validation': values.password_validation
                                                }

                                                setSubmitting(true)
                                                patchNewPassword(data)
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
                                                        setErrorForm('Une erreur s\'est produite')
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


                                            {(formik, isSubmitting) => (
                                                registeredDone ? <div> Votre mot de passe a été modifié. </div> :
                                                    <Form>
                                                        <div className="mb-3">

                                                            <div className="mb-1">
                                                                <Field
                                                                    type="hidden"
                                                                    className={'form-control'}
                                                                    name="pk_user"
                                                                    id="pk_user">
                                                                </Field>
                                                            </div>

                                                            <div className="mb-1">
                                                                <Field
                                                                    type="hidden"
                                                                    className={'form-control'}
                                                                    name="key"
                                                                    id="key">
                                                                </Field>
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
                                                                <label htmlFor="password_validation">Confirmation du mot passe</label>
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
                                                                disabled={isSubmitting}>
                                                            {isSubmitting ? "Merci de patienter..." : "Envoyer"}
                                                        </button>
                                                        {errorForm !== '' ?
                                                            (<div className="mb-3">
                                                                <div className="form-label is-invalid"></div>
                                                                <div
                                                                    className="invalid-feedback is-invalid">{errorForm}</div>
                                                            </div>)
                                                            :
                                                            null}

                                                    </Form>)}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}

export default FormNewPassword