import {Field, Form, Formik} from "formik";
import {useState} from "react";
import {useUserDataEditHook} from "../hooks/useUserDataEditHook";
import {Col, Row} from "react-bootstrap";

const EditProfile = () => {

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')
    const userDataHook = useUserDataEditHook()

    const validateForm = (values) => {
        const errors = {};
        if (!values.first_name) {
            errors.first_name = 'Veuillez indiquer votre prénom';
        }

        if (!values.last_name) {
            errors.last_name = 'Veuillez indiquer votre nom';
        }

        if (!values.alias) {
            errors.alias = 'Veuillez indiquer un alias. L\'alias par défaut est Anonymous'
        }

        return errors;
    };

    return (
        <Formik
            initialValues={userDataHook.userData}
            enableReinitialize={true}
            onSubmit={(values, {setSubmitting, setFieldError}) => {


                setSubmitting(true)
                userDataHook.patch(values.first_name, values.last_name, values.alias)
                    .then(
                        (response) => {
                            setErrorForm('')
                        }
                    )
                    .catch((reason) => {
                        setErrorForm(reason?.response?.data?.error ?? 'Une erreur s\'est produite')
                        console.log(reason.toString());
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
                <div className="border p-2">
                    <Row>
                        <Col sm={0} lg={2}></Col>
                        <Col sm={12} lg={8}>
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
                                        <label htmlFor="alias">Pseudo</label>
                                        <Field
                                            className={(formik.touched["alias"] && formik.errors["alias"]) ? 'form-control is-invalid' : 'form-control'}
                                            name="alias"
                                            id="alias"
                                        >
                                        </Field>
                                        {formik.touched["alias"] && formik.errors["alias"] ? (
                                            <div
                                                className="invalid-feedback">{formik.errors["alias"]}</div>
                                        ) : null}
                                    </div>

                                </div>

                                <button className="btn btn-primary form-button" type="submit"
                                        disabled={formik.isSubmitting}>
                                    {formik.isSubmitting ? "Merci de patienter..." : "Modifier"}
                                </button>
                                {errorForm !== '' ?
                                    (<div className="mb-3">
                                        <div className="form-label is-invalid"></div>
                                        <div className="invalid-feedback is-invalid">{errorForm}</div>
                                    </div>)
                                    :
                                    null}

                            </Form>
                        </Col>
                    </Row>
                    <Col sm={0} lg={2}></Col>
                </div>
            )}
        </Formik>
    )
}

export default EditProfile