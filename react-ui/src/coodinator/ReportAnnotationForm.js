import {Formik} from 'formik';
import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {PostCsrf} from "../api/Csrf";

const ReportAnnotationForm = ({reportPk, close}) => {

    const [formChoices, setFormChoices] = useState(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        axios.get(urlServer + '/api/area/', {withCredentials: true})
            .then(response => {
                setFormChoices(response.data.map(row => {
                    return {value: row.id, name: row.name}
                }));
            })
            .catch(error => console.error)
    }, [])

    return (
        <div>
            <Formik
                initialValues={{area: null}}
                validate={values => {
                    const errors = {};
                    if (values.area === "0") {
                        errors.area = 'Veuillez sélectionner une commune'
                    }

                    if (!values.area) {
                        errors.area = 'Veuillez sélectionner une commune'
                    }
                    return errors;
                }}
                onSubmit={(values, {setSubmitting}) => {
                    const data = {area: values.area, status: 2}
                    PostCsrf(urlServer + `/api/report/new-annotation/?pk_report=${reportPk}`, data)
                        .then(() => {
                            setDone(true)
                        })
                        .catch(error => {
                            setSubmitting(false)
                        })
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit} className="form-group">
                        <div className="row g-3">
                            <div className="col-8 col-lg-5">
                                <select
                                    className="form-control"
                                    name="area"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    disabled={done}>

                                    <option value="0">
                                        Inconnu
                                    </option>

                                    {formChoices && formChoices.map(choice => (
                                        <option key={choice.value} value={choice.value}>
                                            {choice.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback d-block">
                                    {errors.area && touched.area && errors.area}
                                </div>
                            </div>
                            <div className="col-4 col-lg-2">

                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {done ? "Enregistré" : "Valider"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default ReportAnnotationForm