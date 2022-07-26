import {useAppSelector} from "../app/hooks";
import {useEffect, useState} from "react";
import {deleteCsrf, PatchCsrf, PostCsrf} from "../api/Csrf";
import {urlServer} from "../def/Definitions";
import axios from "axios";
import {initialValue} from "./useSlateState";

const urlListDossier = urlServer + '/api/document/'
const urlCurrentDossier = id => `${urlServer}/api/document/${id}/`
const urlAllReports = urlServer + '/api/report/'


const useDossierHook = () => {

    const [isSubmittingNewDossier, setIsSubmittingNewDossier] = useState(false)
    const [listDossiers, setListDossiers] = useState([])
    const [currentDossier, setCurrentDossier] = useState(null)
    const [allReports, setAllReports] = useState([])
    const [currentReports, setCurrentReports] = useState([])
    const [errorNew, setErrorNew] = useState(null)
    const [errorList, setErrorList] = useState(null)

    // array containing the IDs of the AREA (coordinator)
    const listAreas = useAppSelector((state) => state.states.user.coordinator_area)

    const valid = (areas) => areas.reduce((prev, current) => prev || listAreas.includes(current), false)

    const submitNewDossier = ({areas, name}) => {
        setErrorNew(null)

        const data = {
            "reports": [],
            "owner": areas,
            "name": name,
            "content": initialValue
        }

        if (valid(areas)) {

            setIsSubmittingNewDossier(true)
            PostCsrf(urlListDossier, data)
                .then(() => {
                    setIsSubmittingNewDossier(false)
                    setErrorNew(null)
                    fetchListDossier()
                })
                .catch(() => {
                    setIsSubmittingNewDossier(false)
                    setErrorNew('La nouvelle entrée n\'a pas pu être créée')
                })
        } else {
            setErrorNew('Vous devez entrer au moins une locale pour laquelle vous avez les droits d\'administration')
        }

    }

    const submitUpdateDossier = ({areas, name}) => {
        setErrorNew(null)

        const data = {
            "owner": areas,
            "name": name
        }

        if (valid(areas)) {

            setIsSubmittingNewDossier(true)
            PatchCsrf(urlCurrentDossier(currentDossier), data)
                .then(() => {
                    setIsSubmittingNewDossier(false)
                    setErrorNew(null)
                    fetchListDossier()
                })
                .catch(() => {
                    setIsSubmittingNewDossier(false)
                    setErrorNew('La nouvelle entrée n\'a pas pu être mise à jour')
                })
        } else {
            setErrorNew('Vous devez entrer au moins une locale pour laquelle vous avez les droits d\'administration')
        }

    }

    const fetchListDossier = () => {
        setErrorList(null)
        axios.get(urlListDossier, {withCredentials: true})
            .then(reponse => setListDossiers(reponse.data.filter(item => valid(item.owner))))
            .catch(() => setErrorList('La liste des dossiers n\'a pas pu être extraite'))
    }

    const fetchDossier = id => {
        setErrorList(null)
        axios.get(urlCurrentDossier(id), {withCredentials: true})
            .then(reponse => setCurrentReports(reponse.data.reports))
            .catch(() => setErrorList('La liste des rapports n\'a pas pu être extraite'))
    }

    const fetchAllReports = () => {
        setErrorList(null)
        axios.get(urlAllReports, {withCredentials: true})
            // just take the list of records that belongs to the actual user
            .then(reponse => setAllReports(reponse.data.filter(item => listAreas.includes(item.annotation.area.id))))
            .catch(() => setErrorList('La liste des rapports n\'a pas pu être extraite'))
    }

    const resetError = () => {
        setErrorList(null)
        setErrorNew(null)
    }

    const deleteCurrentDossier = () => {
        if (!!currentDossier) {
            deleteCsrf(urlCurrentDossier(currentDossier))
                .then(() => fetchListDossier())
                .catch(console.error)
        }
        setErrorNew(null)
    }

    const addReport = (id) => {
        const data = {"reports": [...(currentReports.map(item => item.id)), id]}
        console.log("Patch data :")
        console.log(data)
        PatchCsrf(urlCurrentDossier(currentDossier), data)
            .then(() => fetchDossier(currentDossier))
            .catch(console.error)
    }

    const deleteReport = (id) => {
        const data = {"reports": [...(currentReports.filter(item => item.id !== id).map(item => item.id))]}
        console.log("Patch data :")
        console.log(data)
        PatchCsrf(urlCurrentDossier(currentDossier), data)
            .then(() => fetchDossier(currentDossier))
            .catch(console.error)
    }

    useEffect(() => {
        fetchListDossier()
        fetchAllReports()
    }, [])

    useEffect(() => fetchDossier(currentDossier), [currentDossier])

    return {
        isSubmittingNewDossier,
        listDossiers,
        errorNew,
        errorList,
        resetError,
        submitNewDossier,
        submitUpdateDossier,
        deleteCurrentDossier,
        currentDossier,
        setCurrentDossier,
        currentReports,
        allReports,
        addReport,
        deleteReport
    }
}

export default useDossierHook