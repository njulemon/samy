import {useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import ReportFollowUp from "./ReportFollowUp";
import {Card} from "react-bootstrap";
import {useAppSelector} from "../app/hooks";

const FollowUp = ({areas}) => {

    const [reports, setReports] = useState(null)
    const user = useAppSelector(state => state.states.user)

    useEffect(() => {
        axios.get(urlServer + '/api/report/', {withCredentials: true})
            .then((response) => setReports(
                response.data.filter(row => user.coordinator_area.includes(row.annotation.area.name))
            ))
    }, [])

    return (
        <>
            {reports?.map(row => {
                return (
                    <Card className="mb-5" key={row.id}>
                        <Card.Body>
                            <ReportFollowUp reportPk={row.id} key={row.id}/>
                        </Card.Body>
                    </Card>
                )
            })
            }
        </>
    )
}

export default FollowUp