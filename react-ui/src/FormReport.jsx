import {getReportForm, postReport} from "./api/Report";
import {Form, Formik, useFormikContext, Field} from "formik";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {
    clearNewReportForm,
    reload,
    setNewReportComment,
    setNewReportFields,
    setNewReportFormTouched
} from "./app/States";
import FormReportField from "./FormReportField";
import {hideNewReportModal} from "./app/States";
import FieldImageAutoUpload from "./FieldImageAutoUpload";

import {useNavigate} from "react-router-dom";

const FormStore = () => {

    // Form store (store actual choice of the user - closing/reopening the modal)
    const dispatch = useAppDispatch()

    // needed for form validation
    const formik = useFormikContext();

    // manage event from the form (choices are saved in the store).
    useEffect(() => {
        dispatch(setNewReportFields(formik.values))
    }, [formik.values, dispatch])

    useEffect(() => {
            dispatch(setNewReportFormTouched(formik.touched))
        }, [formik.touched, dispatch]
    )

    useEffect(() => {
            dispatch(setNewReportComment(formik.values))
        },
        [formik.values.comment, dispatch]
    )

    return null;
};


function FormReport() {

    // LOCAL STATES
    const [operationOption, setOperationOption] = useState(["CYCLIST"]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [pk_picture, set_pk_picture] = useState(null)

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')

    // REDUX STORE
    const dispatch = useAppDispatch()
    const formStore = useAppSelector((state) => state.states.form_report)

    // GET REPORT CHOICES FROM THE SERVER (translations +  choices)
    useEffect(
        () => {
            getReportForm()
                .then((response) => {
                    setOperationOption(response.data[0])
                })
        },
        []
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 1)
    useEffect(
        () => {
            if (!formStore.values.operation.includes("NONE")) {
                getReportForm()
                    .then((response) => setCat1(response.data[1][formStore.values.operation]))
            }
        },
        [formStore.values.operation]
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 2)
    useEffect(
        () => {
            if (!formStore.values.operation.includes("NONE") && !formStore.values.category_1.includes("NONE")) {
                getReportForm()
                    .then((response) =>
                        setCat2(response.data[2][formStore.values.operation][formStore.values.category_1]))
            }
        },
        [formStore.values.operation, formStore.values.category_1]
    )

    const validateForm = (values) => {
        const errors = {};
        if (values.operation.includes("NONE")) {
            errors.operation = 'Veuillez indiquer le destinataire du signalement';
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
                    operation: formStore.values.operation,
                    category_1: formStore.values.category_1,
                    category_2: formStore.values.category_2
                }}
                onSubmit={(values) => {

                    setIsSubmitting(true)

                    const data = {
                        'user_type': 'CYCLIST',
                        'operation': values.operation,
                        'category_1': values.category_1,
                        'category_2': values.category_2,
                        'latitude': formStore.values.latitude,
                        'longitude': formStore.values.longitude,
                        'image': pk_picture,
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
                        .catch((reason) => {
                            setErrorForm('Désolé. Le signalement n\'a pas pu être enregistré. Veuillez réessayer plus tard. ')
                            setIsSubmitting(false)
                        })
                        .finally(() => setIsSubmitting(false))
                }}
                validate={validateForm}
            >


                {(formik) => (
                    <Form>
                        <FormStore/>

                        <FormReportField key="report-form-field-operation-type"
                                         formik={formik}
                                         field_name='operation'
                                         list_options={operationOption}
                                         first_option="Catégorie d'usager ?"/>

                        {formStore.values.operation.includes("NONE") ? null :
                            <FormReportField key="report-form-field-cat-1"
                                             formik={formik}
                                             field_name='category_1'
                                             list_options={cat1}
                                             first_option="Catégorie de problème ?"/>
                        }

                        {formStore.values.operation.includes("NONE") || formStore.values.category_1.includes("NONE") ? null :
                            <FormReportField key="report-form-field-cat-2"
                                             formik={formik}
                                             field_name='category_2'
                                             list_options={cat2}
                                             first_option="Catégorie de problème ?"/>
                        }

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

                        <FieldImageAutoUpload pk={pk_picture} setPk={set_pk_picture} setIsSubmitting={setIsSubmitting}/>

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

export default FormReport;