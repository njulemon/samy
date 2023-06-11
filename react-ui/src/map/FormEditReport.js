import {getReport, getReportForm, patchReport} from "../api/Report";
import {Form, Formik, useFormikContext, Field} from "formik";
import {useEffect, useState} from "react";
import FormReportField from "./FormReportField";
import FieldImageAutoUpload from "./FieldImageAutoUpload";

import {useNavigate} from "react-router-dom";
import axios from "axios";
import SelectReportField from "./SelectReportField";

const FormStore = ({setOperationOptions, setCategory1Options, setCategory2Options, operation, category1, category2}) => {

    // needed for form validation
    const formik = useFormikContext();


    // GET REPORT CHOICES FROM THE SERVER (cat 1)
    useEffect(
        () => {
            if (!formik.values.operation.includes("NONE")) {
                getReportForm()
                    .then((response) => setCategory1Options(response.data[1][formik.values.operation]))
            }
        },
        [formik.values.operation]
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 2)
    useEffect(
        () => {
            if (!formik.values.operation.includes("NONE") && !formik.values.category_1.includes("NONE")) {
                getReportForm()
                    .then((response) =>
                        setCategory2Options(response.data[2][formik.values.operation][formik.values.category_1]))
            }
        },
        [formik.values.operation, formik.values.category_1]
    )

    return null;
};


function FormEditReport({pk, setEdit}) {

    // LOCAL STATES (user list choices)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [operationOptions, setOperationOptions] = useState(null)
    const [category1Options, setCategory1Options] = useState(null)
    const [category2Options, setCategory2Options] = useState(null)

    const [operation, setOperation] = useState(null)
    const [category1, setCategory1] = useState(null)
    const [category2, setCategory2] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(0)
    const [comment, setComment] = useState('')

    const [formContentNotLoaded, setFormContentNotLoaded] = useState(true)

    const [pkImage, setPkImage] = useState(null)

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')

    // init formStore
    useEffect(() => {
            axios.all([getReport(pk), getReportForm()])
                .then(
                    axios.spread((data, form) => {
                        setOperationOptions(form.data[0])
                        setCategory1Options(form.data[1][data.data.operation])
                        setCategory2Options(form.data[2][data.data.operation][data.data.category_1])

                        setOperation(data.data.operation)
                        setCategory1(data.data.category_1)
                        setCategory2(data.data.category_2)
                        setLatitude(data.data.latitude)
                        setLongitude(data.data.longitude)
                        setPkImage(data.data.image_pk)
                        setComment(data.data.comment ?? '')

                        setFormContentNotLoaded(false)


                    }))
        }, []
    )


    const validateForm = (values) => {
        const errors = {};
        if (values.operation.includes("NONE")) {
            errors.operation = 'Veuillez indiquer le destinataire du signalement';
        }

        if (values.category_1.includes("NONE")) {
            errors.category_1 = 'Veuillez choisir une catégorie';
        }

        if (values.category_2.length === 0) {
            errors.category_2 = 'Veuillez choisir une description du problème';
        }

        if (values.comment?.length > 2000) {
            errors.comment = 'Veuillez entrer moins de 2000 caractères';
        }

        return errors;
    };

    return (
        <>
            {formContentNotLoaded ? null :
                <Formik
                    initialValues={{
                        operation: operation,
                        category_1: category1,
                        category_2: category2,
                        comment: comment
                    }}
                    onSubmit={(values) => {

                        setIsSubmitting(true)
                        const data = {
                            'user_type': values.operation === 'PEDESTRIAN_ISSUES' ? 'PEDESTRIAN' : 'CYCLIST',
                            'operation': values.operation,
                            'category_1': values.category_1,
                            'category_2': values.category_2,
                            'comment': values.comment ? values.comment : null,
                            'latitude': parseFloat(latitude),
                            'longitude': parseFloat(longitude),
                            'image': parseInt(pkImage)
                        }
                        console.log(data)


                        patchReport(data, pk)
                            .then(
                                (response) => {
                                    if (response.status === 200) {
                                        setErrorForm('')
                                    } else {
                                        setErrorForm('Le signalement n\'a pas pu être modifié')
                                    }
                                }
                            )
                            .catch((reason) => setErrorForm('Le signalement n\'a pas pu être modifié'))
                            .finally(() => {
                                setIsSubmitting(false);
                                setEdit(false)
                            })
                    }}
                    validate={validateForm}>


                    {(formik) => (
                        <Form>
                            <FormStore setOperationOptions={setOperationOptions} setCategory1Options={setCategory1Options}
                                       setCategory2Options={setCategory2Options}/>

                            <FormReportField key="report-form-field-user-type"
                                             formik={formik}
                                             field_name='operation'
                                             list_options={operationOptions}
                                             first_option="Signaler à"/>

                            {formik.values.operation.includes("NONE") ? null :
                                <FormReportField key="report-form-field-cat-1"
                                                 formik={formik}
                                                 field_name='category_1'
                                                 list_options={category1Options}
                                                 first_option="Catégorie de problème ?"/>
                            }

                            {formik.values.operation.includes("NONE") || formik.values.category_1.includes("NONE") ? null :
                                <SelectReportField key="report-form-field-cat-2"
                                                 formik={formik}
                                                 field_name='category_2'
                                                 list_options={category2Options}/>
                            }

                            <div className="mb-3">
                                <Field key="report-form-field-comment"
                                       className={(formik.touched.comment && formik.errors.comment) ? 'form-control is-invalid' : 'form-control'}
                                       as="textarea" rows="4"
                                       placeholder="Commentaire (optionnel)"
                                       name="comment"
                                       id="comment"
                                       formik={formik}/>
                                {formik.touched.comment && formik.errors.comment ?
                                    (
                                        <div
                                            className="invalid-feedback">{formik.errors.comment}
                                        </div>
                                    )
                                    :
                                    null
                                }
                            </div>

                            <FieldImageAutoUpload pk={pkImage} setPk={setPkImage} setIsSubmitting={setIsSubmitting} initPk={pkImage}/>

                            {errorForm !== '' ?
                                (<div className="mb-3">
                                    <div className="form-label is-invalid"></div>
                                    <div className="invalid-feedback is-invalid">{errorForm}</div>
                                </div>)
                                :
                                null
                            }

                            <div className="mb-3">
                                <button className="btn btn-primary form-button" type="submit"
                                        disabled={isSubmitting}>
                                    Modifier
                                </button>
                            </div>

                        </Form>
                    )
                    }
                </Formik>
            }


        </>
    )
}

export default FormEditReport