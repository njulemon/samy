import {Card, ListGroup} from "react-bootstrap";
import {useAppSelector} from "../app/hooks";
import avatar from '../images/avatar.png'

const Info = () => {

    const user = useAppSelector(state => state.states.user)

    return (
        <>
            <Card style={{width: '18rem'}}>
                <Card.Img src={avatar}/>
                <Card.Body>
                    <Card.Text>
                        {`${user?.first_name} ${user?.last_name}`} <br/>
                        <span className="fw-light">
                            {`Enregistré le ${(new Date(user?.date_joined)).toLocaleDateString()}`} <br/>
                        </span>

                    </Card.Text>
                </Card.Body>
                <Card.Body>
                    <div className="fw-bold pb-2">
                        Responsable
                    </div>
                    <ListGroup>
                        {user?.coordinator_area?.map(
                            row => (
                                <ListGroup.Item key={row}>
                                    {row}
                                </ListGroup.Item>
                            )
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </>
    )
}

export default Info