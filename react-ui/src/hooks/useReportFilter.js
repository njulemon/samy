import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";

const getReportFilteredUrl = (status, date_from, date_to, area) => {

    const initialUrl = urlServer + `/api/report/` +
        `?timestamp_creation__gte=${date_from.toISOString()}` +
        `&timestamp_creation__lte=${date_to.toISOString()}`

    // add multiple status
    const temp = status.reduce((str, item) => str + `&status=${item.toString()}`, initialUrl)

    // add multiple area
    return area.reduce((str, item) => str + `&area=${item}`, temp)
}

export const useReportFilter = (areas, initOptions) => {

    const _ = useAppSelector(state => state.states.translation)

    const [optionsStatus, setOptionsStatus] = useState([])  // array with options

    // list of reports
    const [reports, setReports] = useState()

    const [area, setArea] = useState(areas)  // ids

    const [dates, setDates] = useState(
        {
            from: new Date(2022, 1, 1),
            to: new Date()
        })


    // options selected by the user
    const [filter, setFilter] = useState(
        []  // [{value : ..., label: ...}, ...]
    )

    const getOptions = () => {
        // get the options
        axios.options(urlServer + '/api/report-annotation/', {withCredentials: true})
            .then(request_option => {
                setOptionsStatus(request_option.data.actions.POST.status.choices.map(item => {return {value: item.value, label: _[item.display_name]}}))
                return new Promise((res, fail) => res(request_option.data.actions.POST.status.choices))
            })
            .then((options) => {
                    setFilter(options.filter(option => initOptions.includes(option.value)).map(option => {return {value: option.value, label: _[option.display_name]}}))
                }
            )
    }

    const fetchReports = () => {
        if (filter.length !== 0) {
            axios.get(getReportFilteredUrl(filter.map(item => item.value), dates.from, dates.to, area), {withCredentials: true})
            .then(response => setReports(response.data))
        }
        else {
            setReports(null)
        }

    }

    // toggle the status
    const toggleStatus = value => {
        setFilter(value)
    }

    const setDateFrom = (new_date) => {
        if (!!new_date) {
            setDates({...dates, from: new_date})
        } else {
            setDates({...dates, from: new Date(2022, 1, 1)})
        }

    }

    const setDateTo = (new_date) => {
        if (!!new_date) {
            setDates({...dates, to: new_date})
        } else {
            setDates({...dates, to: new Date()})
        }
    }

    useEffect(() => {
        getOptions()
    }, [])


    useEffect(() => {
        fetchReports()
    }, [filter])

     useEffect(() => {
        fetchReports()
    }, [dates])

    return {reports, optionsStatus, filter, setArea, toggleStatus, setDateFrom, setDateTo, dates, setReports}
}