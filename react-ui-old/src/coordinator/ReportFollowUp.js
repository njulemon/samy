import MiniMap from "./MiniMap";
import ImageReport from "../map/ImageReport";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";
import {capitalize} from "../Tools/String";
import EditStatusForm from "./EditStatusForm";

const ReportFollowUp = ({reportPk}) => {

    const [report, setReport] = useState(null)

    const _ = useAppSelector(state => state.states.translation)

    useEffect(() => {
        axios.get(urlServer + `/api/report/${reportPk}/`, {withCredentials: true})
            .then(response => setReport(response.data))
            .catch(error => console.error)

    }, [reportPk])

    return (
        <>
            <h5>{capitalize(_[report?.category_1])} <span className="fw-normal">[{report?.id}]</span></h5>
            <h6>{report?.category_2.map(item => (<div key={item}>{capitalize(_[item])}<br/></div>))}</h6>

            <hr/>

            <div className="container p-3 shadow rounded">

                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className="col">
                                <div className="h-100">
                                    <div className="">
                                        <p className="text-justify">
                                            {report?.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <MiniMap lat={report?.latitude}
                                         lng={report?.longitude}
                                         zoom={16}
                                         id={report?.id}/>
                            </div>

                        </div>

                    </div>
                    <div className="col-6">
                        <ImageReport reportId={report?.id}/>
                    </div>
                </div>
            </div>

            <hr/>
            <h4>Suivi</h4>

            <p className="fw-light">
                Signalé {(new Date(report?.timestamp_creation)).toLocaleDateString()} <br/>
                Dernière modification suivi
                : {(new Date(report?.annotation.date_modified)).toLocaleDateString()} <br/>
                Localité : {report?.annotation.area.name}
            </p>

            <EditStatusForm
                // urlAnnotation={report?.annotation.url}
                reportPk={reportPk}
            />
        </>
    )
}

export default ReportFollowUp