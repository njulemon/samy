import {useLocation} from "react-router-dom";
import FormResetPassword from "./FormResetPassword";
import FormNewPassword from "./FormNewPassword";

function ResetPassword() {

    let location = useLocation()

    return (
        <>
            <FormNewPassword pk={location.pathname.split('/')[4].toString()} key_reset={location.pathname.split('/')[5].toString()}/>
        </>
    )
}

export default ResetPassword