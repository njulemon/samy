import {useEffect} from "react";
import {useAppDispatch} from "../app/hooks";
import {setReloadIsDone} from "../app/States";
import {useNavigate} from "react-router-dom";

function ConfirmReportSaved() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(
        () => {
            setTimeout(() => {
                dispatch(setReloadIsDone())
            }, 3000)
        },
        [dispatch]
    )
    return (
        <>
            <div className=" container-fluid fill-height">
                <div className="row login-vertical-center">
                    <div className="col"></div>
                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-10">
                        <div className="card shadow rounded-lg bg-transparent">
                            <div className="card-body bg-light">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col text-white">
                                            <h2>Merci !</h2>
                                            <p>
                                                Le signalement a bien été enregistré.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>

        </>
    )
}

export default ConfirmReportSaved