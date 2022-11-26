import ReportFollowUp from "./ReportFollowUp";
import {Card} from "react-bootstrap";
import {useAppSelector} from "../app/hooks";

const FollowUp = ({reportFilterHook}) => {

    const user = useAppSelector(state => state.states.user)

    return (
        <>
            {reportFilterHook?.reports?.map(row => {
                return (
                    <Card className="mb-5" key={row.id}>
                        <Card.Body>
                            <ReportFollowUp reportPk={row.id} key={'child' + row.id}/>
                        </Card.Body>
                    </Card>
                )
            })
            }
        </>
    )
}

export default FollowUp