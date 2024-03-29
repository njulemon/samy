import Modal from "react-bootstrap/Modal";
import {useAppSelector} from "../app/hooks";
import {capitalize} from "../Tools/String";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {Rating} from "@mui/material";
import {DropdownButton, Dropdown} from "react-bootstrap";
import {IconContext} from 'react-icons'
import {GrMapLocation} from 'react-icons/gr';
import {useAreaListHook} from "../hooks/useAreaListHook";

const ModalRanking = ({show, setShow, listReports, setHighlightReport}) => {

    const translation = useAppSelector((state) => state.states.translation)
    const [votes, setVotes] = useState([])
    const [reports, setReports] = useState([])
    const [commune, setCommune] = useState(-1)
    const [errorMsg, setErrorMsg] = useState(null)

    const areaListHook = useAreaListHook()

    const orderBy = (criterion, votes) => {

        // if any change happen
        const converter = (input) => {
            if (criterion === 'date_time') {
                return input.getTime()
            }
            if (criterion === 'votes_n' || criterion === 'votes_avg') {
                return input == null ? 0 : Number(input)
            }
        }

        const votesSorted = []
            .concat(votes)
            .sort((a, b) => {
                if (converter(a[criterion]) > converter(b[criterion])) {
                    return (criterion === 'date_time' ? -1 : -1)
                } else if (converter(a[criterion]) === converter(b[criterion])) {
                    return 0
                } else {
                    return (criterion === 'date_time' ? 1 : 1)
                }
            })

        return votesSorted
    }

    const showReportOnMap = (lat, lng) => {
        setShow(false)
        setHighlightReport(lat, lng)
    }

    const handleChangeCommune = (value) => {
        setCommune(value.target.value)
    }


    useEffect(() => {
        if (show) {
            axios.get(urlServer + '/api/report/', {withCredentials: true})
                .then(response => setReports(response.data))
                .catch(error => setErrorMsg(error.toString()))
        }
    }, [show])


    useEffect(() => {
        axios.get(urlServer + '/api/votes/stat/', {withCredentials: true})
            .then(response => {
                setVotes(orderBy('date_time', reports
                    .filter(row => ((
                        row.operation === "LOCALE")
                        && (!!row.annotation)
                        && (row.annotation?.area.id === Number(commune))))
                    .map(row => {
                        return {
                            category_1: capitalize(translation[row.category_1]),
                            category_2: row.category_2.map(item => (<div key={item}>{capitalize(translation[item])}<br /></div>)),
                            image: row.image,
                            comment: capitalize(row.comment),
                            date: (new Date(row.timestamp_creation).toLocaleDateString()),
                            time: (new Date(row.timestamp_creation).toLocaleTimeString()),
                            date_time: new Date(row.timestamp_creation),
                            votes_n: response.data["n"][row.id],
                            votes_avg: response.data["avg"][row.id],
                            id: row.id,
                            latitude: row.latitude,
                            longitude: row.longitude
                        }
                    })
                ))
            })
    }, [reports, translation, commune])


    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            fullscreen="sm-down"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Signalements
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-auto">
                            <div className="text-start mb-3">
                                <select
                                    className="form-control"
                                    name="area"
                                    onChange={handleChangeCommune}
                                    value={commune}>

                                    <option value="-1">
                                        Choix commune
                                    </option>

                                    {areaListHook?.listAreas && areaListHook.listAreas.map(choice => (
                                        <option key={choice.value} value={choice.value}>
                                            {choice.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-auto">
                            <div className="text-start mb-3">
                                <DropdownButton id="dropdown-basic-button" variant="primary" title="Trier par">
                                    <Dropdown.Item
                                        onClick={() => setVotes(orderBy('date_time', votes))}>Date</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setVotes(orderBy('votes_n', votes))}>Nombre de
                                        votes</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setVotes(orderBy('votes_avg', votes))}>Moyenne des
                                        votes</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>

                    </div>

                    {votes?.map(
                        row => (
                            <div key={row.id}>
                                <hr/>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="fs-6">
                                                            <div className="text-uppercase fw-bold"
                                                                 key={"cat1-" + row.id.toString()}>
                                                                {row.category_1}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-auto">
                                                            <div className="fs-6">
                                                                <div className="">{row.category_2}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <div className="fw-lighter text-end">
                                                    {row.date} <br/>
                                                    {row.time} <br/>
                                                    <IconContext.Provider
                                                        value={{
                                                            style: {
                                                                verticalAlign: 'baseline',
                                                                color: "green",
                                                            }
                                                        }}>
                                                        <GrMapLocation
                                                            size={25}
                                                            onClick={() => showReportOnMap(row.latitude, row.longitude)}/>
                                                    </IconContext.Provider>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-justify fw-light mb-2">
                                        {row.comment ? capitalize(row.comment) : null}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-auto">
                                        <Rating
                                            name="simple-controlled"
                                            value={row.votes_avg}
                                            disabled={true}/>
                                    </div>
                                    <div className="col">
                                        {row.votes_n ? row.votes_n : "0"} votes
                                    </div>
                                </div>
                            </div>
                        )
                    )}

                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalRanking