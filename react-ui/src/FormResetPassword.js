import {Field, Form, Formik} from "formik";
import {useState} from "react";
import {postRequestNewPassword} from "./api/RequestNewPassword";

function FormResetPassword() {

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')
    const [resetDone, setResetDone] = useState(false)

    const validateForm = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Requis';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Adresse e-mail invalide';
        }

        return errors;
    };

    return (
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={(values, {setSubmitting, setFieldError}) => {
                const data = {
                    'email': values.email
                }

                setSubmitting(true)
                postRequestNewPassword(data)
                    .then(
                        (response) => {
                            if (response.status === 200 || response.status === 201) {
                                setErrorForm('')
                                setResetDone(true)
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
                resetDone ? <div> Veuillez consulter votre boite mail pour réinitialiser votre mot de passe. </div> :
                <Form>
                    <div className="mb-3">

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
                    </div>

                    <button className="btn btn-primary form-button" type="submit"
                            disabled={isSubmitting}>
                        {isSubmitting ? "Merci de patienter..." : "Envoyer"}
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

export default FormResetPassword