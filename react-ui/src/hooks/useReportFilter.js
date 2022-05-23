import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";

const getReportFilteredUrl = (status, date_from, date_to, area) => {

    const initialUrl = urlServer + `/api/report/` +
        `?timestamp_creation__gte=${date_from.toISOString()}` +
        `&timestamp_creation__lte=${date_to.toISOString()}`

    // add multiple status
    const temp = status.reduce((str, item) => str + `&status=${item.toString()}`, initialUrl)

    // add multiple area
    return area.reduce((str, item) => str + `&area=${item}`, temp)
}

export const useReportFilter = (area) => {

    // contains the criterion of the filter
    // - status
    // - date
    // - locality


    // array with items =
    // {
    //   "value": 0,
    //   "display_name": "RS_STATUS_NONE"
    // }
    const [optionsStatus, setOptionsStatus] = useState()  // array with options

    // list of reports
    const [reports, setReports] = useState()


    // options selected by the user
    const [filter, setFilter] = useState(
        {
            status: [],  // list of ids
            dates: {
                from: new Date(2022, 1, 1),
                to: new Date()
            },
            area: !!area ? area : []   // list of ids
        }
    )

    const getOptions = () => {
        // get the options
        axios.options(urlServer + '/api/report-annotation/', {withCredentials: true})
            .then(request_option => {
                setOptionsStatus(request_option.data.actions.POST.status.choices)
                return new Promise((res, fail) => res(request_option.data.actions.POST.status.choices))
            })
            .then((options) => {
                    setFilter({...filter, status: options.filter(option => option.value !== 0).map(option => option.value)})
                }
            )
    }

    const fetchReports = () => {
        console.log(filter.status)
        axios.get(getReportFilteredUrl(filter.status, filter.dates.from, filter.dates.to, filter.area), {withCredentials: true})
            .then(response => setReports(response.data))
    }

    // list of ids of the areas.
    const setArea = (area) => {
        setFilter({...filter, area: area})
    }

    // toggle the status
    const toggleStatus = status => {
        // return a new array without the value
        const newStatus = filter.status.filter(item => item !== status)

        // if we did not remove anything we add the element.
        if (filter.status.length === newStatus.length) {
            newStatus.push(status)
        }

        setFilter({...filter, status: newStatus})
    }

    const setDateFrom = (date) => {
        if (!!date) {
            setFilter({...filter, dates: {...filter.dates, from: date}})
        }
        else {
            setFilter({...filter, dates: {...filter.dates, from: new Date(2022, 1, 1)}})
        }

    }

    const setDateTo = (date) => {
        if (!!date) {
            setFilter({...filter, dates: {...filter.dates, to: date}})
        }
        else {
            setFilter({...filter, dates: {...filter.dates, to: new Date()}})
        }
    }

    useEffect(() => {
        getOptions()
    }, [])


    useEffect(() => {
        fetchReports()
    }, [filter])

    return {reports, optionsStatus, filter, setArea, toggleStatus, setDateFrom, setDateTo}
}