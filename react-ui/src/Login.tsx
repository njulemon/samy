import {Container, Row, Col, Button} from "react-bootstrap";
import {useAppDispatch} from "./app/hooks";
import {giveAccess} from "./app/Login";

function Login() {

    const dispatch = useAppDispatch()

    return (
        <>
            <Container>
                <Row>
                    <Col> </Col>
                    <Col>
                        <Button variant="primary" onClick={() => {dispatch(giveAccess())}}>Login</Button>{' '}
                    </Col>
                    <Col> </Col>
                </Row>
            </Container>
        </>
    )
}

export default Login