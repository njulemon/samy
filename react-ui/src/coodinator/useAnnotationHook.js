import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {deleteCsrf, PostCsrf} from "../api/Csrf";

const useAnnotationHook = (reportPk) => {

    const [states, setStates] = useState(
        {
            reportPk: reportPk
        }
    )
    const [error, setError] = useState()
    const [options, setOptions] = useState()


    const getOptions = () => {
        // get the options
        axios.options(urlServer + '/api/report-annotation/', {withCredentials: true})
            .then(request_option => {setOptions(
            {
                'in_charge': request_option.data.actions.POST.in_charge.choices,
                'status': request_option.data.actions.POST.status.choices
            })})
    }

    const fetchAnnotation = () => {
        axios.get(urlServer + `/api/report/${states.reportPk}/`, {withCredentials: true})
            .then(result => {
                setStates({
                    reportPk: states.reportPk,
                    in_charge: result.data.annotation.in_charge,
                    status: result.data.annotation.status,
                    date_start: result.data.annotation.date_start,
                    date_modified: result.data.annotation.date_modified,
                    url: result.data.annotation.url,
                    comments: result.data.annotation.comments
                })
            })
            .catch(error => setError(error.toString()))
    }

    const addAnnotationComment = text => {
        PostCsrf(urlServer + `/api/report/new-annotation-comment/?pk_report=${states.reportPk}`, {comment: text})
            .then(() => {
                fetchAnnotation()
            })
    }

    const deleteAnnotationComment = (urlComment) => {
        deleteCsrf(urlComment)
            .then(() => {
                fetchAnnotation()
            })
            .catch(error => setError(error.toString()))
    }

    useEffect(() => fetchAnnotation(), [options])
    useEffect(() => getOptions(), [reportPk])

    return [states, error, options, fetchAnnotation, addAnnotationComment, deleteAnnotationComment]
}

export default useAnnotationHook