import {getReport, getReportForm, postReport} from "./api/Report";
import {Form, Formik, Field} from "formik";
import {useEffect, useRef, useState} from "react";
import {
    clearNewReportForm,
    reload
} from "./app/States";
import FormReportField from "./FormReportField";
import {hideNewReportModal} from "./app/States";
import FieldImageAutoUpload from "./FieldImageAutoUpload";

function FormEditReport({pk_edit}) {

    // LOCAL STATES (user list choices)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pkPicture, setPkPicture] = useState(null)
    const [formOptions, setFormOptions] = useState({})
    const [data, setData] = useState({})
    const formRef = useRef();

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')

    // GET REPORT CHOICES FROM THE SERVER (translations + user type choices)
    useEffect(
        () => {
            getReportForm()
                .then((response) => {
                    setFormOptions(response)
                })
                .then(() => new Promise((res, rej) => {
                    res(getReport(pk_edit))
                    rej(() => 'Error')
                }))
                .then((data) => setData(data))
                .catch((error) => setErrorForm(error))
        },
        [pk_edit]
    )

const validateForm = (values) => {
    const errors = {};
    if (values.user_type.includes("NONE")) {
        errors.user_type = 'Veuillez indiquer votre statut d\'usager';
    }

    if (values.category_1.includes("NONE")) {
        errors.category_1 = 'Veuillez choisir une catégorie';
    }

    if (values.category_2.includes("NONE")) {
        errors.category_2 = 'Veuillez choisir une description du problème';
    }

    if (values.comment?.length > 2000) {
        errors.comment = 'Veuillez entrer moins de 2000 caractères';
    }

    return errors;
};

return (
    <>
        <Formik
            initialValues={{
                user_type: data.user_type,
                category_1: data.category_1,
                category_2: data.category_2,


            }}
            onSubmit={(values) => {

                setIsSubmitting(true)

                const data_patch = {
                    'user_type': values.user_type,
                    'category_1': values.category_1,
                    'category_2': values.category_2,
                    'latitude': formStore.values.latitude,
                    'longitude': formStore.values.longitude,
                    'image': pkPicture,
                    'comment': values.comment
                }
                console.log(data)

                postReport(data)
                    .then(
                        (response) => {
                            if (response.status === 200) {
                                setErrorForm('')
                                dispatch(hideNewReportModal())
                                dispatch(clearNewReportForm())
                                // navigate(0)
                                dispatch(reload())
                            } else {
                                setErrorForm('Le signalement n\'a pas pu être enregistré')
                            }
                        }
                    )
                    .catch((reason) => setErrorForm('Le signalement n\'a pas pu être enregistré'))
                    .finally(() => setIsSubmitting(false))
            }}
            validate={validateForm}
            innerRef={formRef}
        >


            {(formik) => (
                <Form>

                    <FormReportField key="report-form-field-user-type"
                                     formik={formik}
                                     field_name='user_type'
                                     list_options={formOptions[0]}
                                     first_option="Catégorie d'usager ?"/>


                    <FormReportField key="report-form-field-cat-1"
                                     formik={formik}
                                     field_name='category_1'
                                     list_options={formOptions[1][formik.values.user_type]}
                                     first_option="Catégorie de problème ?"/>


                    <FormReportField key="report-form-field-cat-2"
                                     formik={formik}
                                     field_name='category_2'
                                     list_options={formOptions[2][formik.values.user_type][formik.values.category_1]}
                                     first_option="Catégorie de problème ?"/>


                    <div className="mb-3">
                        <Field key="report-form-field-comment"
                               className={(formik.touched.comment && formik.errors.comment) ? 'form-control is-invalid' : 'form-control'}
                               as="textarea" rows="4"
                               placeholder="Commentaire (optionnel)"
                               name="comment"
                               id="comment"
                               formik={formik}/>
                        {formik.touched.comment && formik.errors.comment ? (
                            <div
                                className="invalid-feedback">{formik.errors.comment}</div>
                        ) : null}
                    </div>

                    <FieldImageAutoUpload pk={pkPicture} setPk={setPkPicture} setIsSubmitting={setIsSubmitting}/>

                    {errorForm !== '' ?
                        (<div className="mb-3">
                            <div className="form-label is-invalid"></div>
                            <div className="invalid-feedback is-invalid">{errorForm}</div>
                        </div>)
                        :
                        null}

                    <div className="mb-3">
                        <button className="btn btn-primary form-button" type="submit"
                                disabled={isSubmitting}>
                            Envoyer
                        </button>
                    </div>

                </Form>)}
        </Formik>

    </>
)
}

export default FormEditReport;