import {getReport, getReportForm, patchReport} from "./api/Report";
import {Form, Formik, useFormikContext, Field} from "formik";
import {useEffect, useState} from "react";
import FormReportField from "./FormReportField";
import FieldImageAutoUpload from "./FieldImageAutoUpload";

import {useNavigate} from "react-router-dom";
import axios from "axios";

const FormStore = ({setUserTypeOptions, setCategory1Options, setCategory2Options, userType, category1, category2}) => {

    // needed for form validation
    const formik = useFormikContext();

    // // manage event from the form (choices are saved in the store).
    // // GET REPORT CHOICES FROM THE SERVER (translations + user type choices)
    // useEffect(
    //     () => {
    //         getReportForm()
    //             .then((response) => {
    //                 setUserTypeOptions(response.data[0])
    //                 setCategory1Options(response.data[1][userType])
    //                 setCategory2Options(response.data[2][category1])
    //             })
    //     },
    //     []
    // )

    // GET REPORT CHOICES FROM THE SERVER (cat 1)
    useEffect(
        () => {
            if (!formik.values.user_type.includes("NONE")) {
                getReportForm()
                    .then((response) => setCategory1Options(response.data[1][formik.values.user_type]))
            }
        },
        [formik.values.user_type]
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 2)
    useEffect(
        () => {
            if (!formik.values.user_type.includes("NONE") && !formik.values.category_1.includes("NONE")) {
                getReportForm()
                    .then((response) =>
                        setCategory2Options(response.data[2][formik.values.user_type][formik.values.category_1]))
            }
        },
        [formik.values.user_type, formik.values.category_1]
    )

    return null;
};


function FormEditReport({pk, setEdit}) {

    // LOCAL STATES (user list choices)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [userTypeOptions, setUserTypeOptions] = useState(null)
    const [category1Options, setCategory1Options] = useState(null)
    const [category2Options, setCategory2Options] = useState(null)

    const [userType, setUserType] = useState(null)
    const [category1, setCategory1] = useState(null)
    const [category2, setCategory2] = useState(null)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(0)
    const [comment, setComment] = useState('')

    const [formContentNotLoaded, setFormContentNotLoaded] = useState(true)

    const [pkImage, setPkImage] = useState(null)

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')

    // reload page
    const navigate = useNavigate()

    // init formStore
    useEffect(() => {
            axios.all([getReport(pk), getReportForm()])
                .then(
                    axios.spread((data, form) => {
                        setUserTypeOptions(form.data[0])
                        setCategory1Options(form.data[1][data.data.user_type])
                        setCategory2Options(form.data[2][data.data.user_type][data.data.category_1])

                        setUserType(data.data.user_type)
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
            {formContentNotLoaded ? null :
                <Formik
                    initialValues={{
                        user_type: userType,
                        category_1: category1,
                        category_2: category2,
                        comment: comment
                    }}
                    onSubmit={(values) => {

                        setIsSubmitting(true)
                        const data = {
                            'user_type': values.user_type,
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
                            <FormStore setUserTypeOptions={setUserTypeOptions} setCategory1Options={setCategory1Options}
                                       setCategory2Options={setCategory2Options}/>

                            <FormReportField key="report-form-field-user-type"
                                             formik={formik}
                                             field_name='user_type'
                                             list_options={userTypeOptions}
                                             first_option="Catégorie d'usager ?"/>

                            {formik.values.user_type.includes("NONE") ? null :
                                <FormReportField key="report-form-field-cat-1"
                                                 formik={formik}
                                                 field_name='category_1'
                                                 list_options={category1Options}
                                                 first_option="Catégorie de problème ?"/>
                            }

                            {formik.values.user_type.includes("NONE") || formik.values.category_1.includes("NONE") ? null :
                                <FormReportField key="report-form-field-cat-2"
                                                 formik={formik}
                                                 field_name='category_2'
                                                 list_options={category2Options}
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