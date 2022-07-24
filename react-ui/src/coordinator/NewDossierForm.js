import {Formik} from 'formik';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {PostCsrf} from "../api/Csrf";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export class type {
    static new = new type("new")
    static update = new type("update")

    constructor(name) {
        this.name = name
    }
}

const NewDossierForm = ({dossierHook, type_}) => {

    const [formChoices, setFormChoices] = useState(null)
    const [currentArea, setCurrentArea] = useState(null)
    const [currentName, setCurrentName] = useState("")

    const animatedComponents = makeAnimated();

    useEffect(() => {

        axios.get(urlServer + '/api/area/active/', {withCredentials: true})
            .then(response => {
                const choices = response.data.map(row => {
                    return {value: row.id, name: row.name}
                })
                setFormChoices(choices)
                return choices //new Promise((res, rej) => res(choices))
            })
            .then(choices => {
                    if (type_ === type.update && !!dossierHook.currentDossier) {
                        axios.get(urlServer + '/api/document/' + dossierHook.currentDossier + '/', {withCredentials: true})
                            .then(response => {
                                setCurrentArea(choices.filter(choice => response.data.owner.includes(choice.value)))
                                setCurrentName(response.data.name)
                            })
                            .catch(error => console.error)
                    }
                }
            )
            .catch(error => console.error)
    }, [])

    return (
        <div>


            <Formik
                initialValues={{areas: null, name: currentName}}
                enableReinitialize
                onSubmit={(values) => {

                    if (type_ === type.new) {
                        const data = {areas: currentArea.map(item => item.value), name: values.name}
                        dossierHook.submitNewDossier(data)
                    } else {
                        const data = {areas: currentArea.map(item => item.value), name: values.name}
                        dossierHook.submitUpdateDossier(data)
                    }

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
                      setFieldValue
                      /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit} className="form-group">

                        <div className="row g-3">
                            <div className="col-12">
                                <label htmlFor="locales">Locales concernées</label>
                                <Select
                                    id="locales"
                                    options={formChoices?.map(item => {
                                        return {value: item.value, label: item.name}
                                    })}
                                    onChange={e => {
                                        setFieldValue('area', e.map(item => item.value))
                                        setCurrentArea(e.map(item => {return {value: item.value, name: item.label}}))
                                    }}
                                    value={currentArea?.map(item => {
                                        return {value: item.value, label: item.name}
                                    })}
                                    components={animatedComponents}
                                    isMulti/>

                            </div>
                            <div className="col-12">
                                <label htmlFor="name">Nom du dossier</label>
                                <input type="text"
                                       className="form-control" id="name"
                                       placeholder="Entrez un nom"
                                       onChange={e => setFieldValue('name', e.target.value)}
                                       value={values.name}
                                />
                            </div>
                            <div className="col-12">
                                <div className="invalid-feedback d-block">
                                    {dossierHook.errorNew}
                                </div>
                                <button
                                    className="btn btn-primary mt-2"
                                    type="submit"
                                    disabled={dossierHook?.isSubmittingNewDossier}>
                                    {type_ === type.new ?
                                        (dossierHook?.isSubmittingNewDossier ? "Enregistrement" : "Valider")
                                        :
                                        (dossierHook?.isSubmittingNewDossier ? "Enregistrement" : "Mise à jour")
                                    }
                                </button>
                            </div>
                        </div>

                    </form>
                )}
            </Formik>
        </div>
    )
}

export default NewDossierForm