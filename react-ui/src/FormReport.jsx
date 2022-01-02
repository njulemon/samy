import {getReportForm, postReport} from "./api/Report";
import {Form, Formik, useFormikContext} from "formik";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {clear, setFields, setTouched} from "./app/States";
import FormReportField from "./FormReportField";
import {hideReportModal} from "./app/States";

const FormStore = () => {

    // Form store (store actual choice of the user - closing/reopening the modal)
    const dispatch = useAppDispatch()
    const formStore = useAppSelector((state) => state.states.form_report)

    // needed for form validation
    const formik = useFormikContext();

    // manage event from the form (choices saved in the store).
    useEffect(() => {
        dispatch(setFields(formik.values))
    }, [formik.values]);

    useEffect(() => {
            dispatch(setTouched(formik.touched))
        }, [formik.touched]
    );
    return null;
};


function FormReport() {

    // LOCAL STATES (user list choices)
    const [userOption, setUserOption] = useState(["CYCLIST"]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);

    // LOCAL STATE (error form)
    const [errorForm, setErrorForm] = useState('')

    // REDUX STORE
    const dispatch = useAppDispatch()
    const formStore = useAppSelector((state) => state.states.form_report)

    // GET REPORT CHOICES FROM THE SERVER (translations + user type choices)
    useEffect(
        () => {
            getReportForm()
                .then((response) => {
                    setUserOption(response.data[0])
                })
        },
        []
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 1)
    useEffect(
        () => {
            if (!formStore.values.user_type.includes("NONE")) {
                getReportForm()
                    .then((response) => setCat1(response.data[1][formStore.values.user_type]))
            }
        },
        [formStore.values.user_type]
    )

    // GET REPORT CHOICES FROM THE SERVER (cat 2)
    useEffect(
        () => {
            if (!formStore.values.user_type.includes("NONE") && !formStore.values.category_1.includes("NONE")) {
                getReportForm()
                    .then((response) =>
                        setCat2(response.data[2][formStore.values.user_type][formStore.values.category_1]))
            }
        },
        [formStore.values.user_type, formStore.values.category_1]
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

        return errors;
    };

    return (
        <Formik
            initialValues={{
                user_type: formStore.values.user_type,
                category_1: formStore.values.category_1,
                category_2: formStore.values.category_2
            }}
            onSubmit={(values, {setSubmitting}) => {
                const data = {
                    'user_type': values.user_type,
                    'category_1': values.category_1,
                    'category_2': values.category_2,
                    'latitude': formStore.values.latitude,
                    'longitude': formStore.values.longitude,
                }

                postReport(data)
                    .then(
                        (response) => {
                            if (response.status === 200) {
                                setErrorForm('')
                                dispatch(hideReportModal())
                                dispatch(clear())
                            } else {
                                setErrorForm('Le signalement n\'a pas pu être enregistré')
                            }
                        }
                    )
                    .catch((reason) => setErrorForm('Le signalement n\'a pas pu être enregistré'))
            }}
            validate={validateForm}
        >


            {(formik, isSubmitting) => (
                <Form>
                    <FormStore/>

                    <FormReportField key="report-form-field-user-type"
                                     formik={formik}
                                     field_name='user_type'
                                     list_options={userOption}
                                     first_option="Catégorie d'usager ?"/>

                    {formStore.values.user_type.includes("NONE") ? null :
                        <FormReportField key="report-form-field-cat-1"
                                         formik={formik}
                                         field_name='category_1'
                                         list_options={cat1}
                                         first_option="Catégorie de problème ?"/>
                    }

                    {formStore.values.user_type.includes("NONE") || formStore.values.category_1.includes("NONE") ? null :
                        <FormReportField key="report-form-field-cat-2"
                                         formik={formik}
                                         field_name='category_2'
                                         list_options={cat2}
                                         first_option="Catégorie de problème ?"/>
                    }

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

export default FormReport;