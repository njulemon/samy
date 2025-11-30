import {capitalize} from "../Tools/String";
import {useAppSelector} from "../app/hooks";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import makeAnimated from 'react-select/animated';


function SelectReportField(
    {
        field_name,
        list_options,
        first_option,
        formik
    }) {

    const translation = useAppSelector((state) => state.states.translation)
    const [currentOptions, setCurrentOptions] = useState([])
    const animatedComponents = makeAnimated()

    useEffect(() => {
        setCurrentOptions(formik.values.category_2?.map(opt => {return {value: opt, name: capitalize(translation[opt])}}))
    }, [formik.values.category_2])

    return (
        <div className="mb-3">
            <Select
                                    id="locales"
                                    options={list_options?.map(opt => {
                                        return {value: opt, label: capitalize(translation[opt])}
                                    })}
                                    onChange={e => {
                                        formik.setFieldValue(field_name, e.map(item => item.value))
                                        setCurrentOptions(e.map(item => {return {value: item.value, name: item.label}}))
                                    }}
                                    value={currentOptions?.map(item => {
                                        return {value: item.value, label: item.name}
                                    })}
                                    components={animatedComponents}
                                    isMulti/>
            {/*<Field*/}
            {/*    className={(formik.touched[field_name] && formik.errors[field_name]) ? 'form-control is-invalid' : 'form-control'}*/}
            {/*    name={field_name}*/}
            {/*    id={field_name}*/}
            {/*    type="select"*/}
            {/*    as="select"*/}
            {/*    placeholder="Choisir usager">*/}
            {/*    {list_options.map((opt, i) => {*/}
            {/*        return (<option key={field_name + "-" + i} value={opt}>{capitalize(translation[opt])}</option>)})}*/}
            {/*</Field>*/}
            {formik.touched[field_name] && formik.errors[field_name] ? (
                <div
                    className="invalid-feedback">{formik.errors[field_name]}</div>
            ) : null}
        </div>
    )
}

export default SelectReportField