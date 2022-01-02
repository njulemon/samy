import {Field} from "formik";
import {capitalize} from "./Tools/String";
import {useAppSelector} from "./app/hooks";


function FormReportField(
    {
        field_name,
        list_options,
        first_option,
        formik
    }) {

    const translation = useAppSelector((state) => state.states.translation)

    return (
        <div className="mb-3">
            <Field
                className={(formik.touched[field_name] && formik.errors[field_name]) ? 'form-control is-invalid' : 'form-control'}
                name={field_name}
                id={field_name}
                type="select"
                as="select"
                placeholder="Choisir usager">
                {list_options.map((opt, i) => {
                    return (<option key={field_name + "-" + i} value={opt}>{capitalize(translation[opt])}</option>)})}
            </Field>
            {formik.touched[field_name] && formik.errors[field_name] ? (
                <div
                    className="invalid-feedback">{formik.errors[field_name]}</div>
            ) : null}
        </div>
    )
}

export default FormReportField