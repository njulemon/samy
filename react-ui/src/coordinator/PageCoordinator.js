import Info from "./Info";
import Unassigned from "./Unassigned";
import FollowUp from "./FollowUp";
import {useEffect, useState} from "react";
import {checkAccessAndGetUser} from "../app/States";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import MenuLeft from "./MenuLeft";
import ContainerMenuLeft from "./ContainerMenuLeft";
import {useReportFilter} from "../hooks/useReportFilter";
import QuillEditor from "./QuillEditor";


const PageCoordinator = () => {

    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState("followup")  // followup

    const user = useAppSelector(state => state.states.user)

    const reportFilterHook = useReportFilter(user.coordinator_area, [2, 3, 5])  // RS_CLASSIFIED, "RS_REPORTED_TO_AUTHORITIES, RS_REPORT_IN_PROGRESS

    useEffect(
        () => {
            dispatch(checkAccessAndGetUser())
        },
        [dispatch]
    )

    return (
        <div className="container-fluid vh-100 w-100 background-coordinator p-4">

            <div className="row">


                <div className="col">

                    {/*<div className="tab-content" id="v-pills-tabContent">*/}
                    {
                        {
                            "unassigned": (
                                <ContainerMenuLeft reportFilterHook={null} setActiveTab={setActiveTab}>
                                    <Unassigned/>
                                </ContainerMenuLeft>

                            ),
                            "followup": (
                                <ContainerMenuLeft reportFilterHook={reportFilterHook} setActiveTab={setActiveTab}>
                                    <FollowUp reportFilterHook={reportFilterHook}/>
                                </ContainerMenuLeft>

                            ),
                            "dossiers": (
                                <ContainerMenuLeft reportFilterHook={null} setActiveTab={setActiveTab}>
                                    <QuillEditor/>
                                </ContainerMenuLeft>

                            )
                        }[activeTab]
                    }
                </div>
            </div>
        </div>
    )
}

export default PageCoordinator