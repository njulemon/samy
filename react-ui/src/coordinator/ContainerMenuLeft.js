import Info from "./Info";
import MenuLeft from "./MenuLeft";
import FilterReport from "./FilterReport";
import {Card} from "react-bootstrap";


const ContainerMenuLeft = ({children, ...rest}) => {
    return (
        <div className="row">
            <div className="col-auto pt-4">

                <div className="col-auto text-break">

                    <h2>
                        Gestion des <br/> signalements
                    </h2>

                    <Card style={{width: '18rem'}}>
                        <Card.Body>
                            {/*<div className="d-flex">*/}
                                <div className="nav flex-column nav-pills nav-justified nav-fill" // id="v-pills-tab" role="tablist"
                                     // aria-orientation="vertical">
>
                                    <button className="nav-link active  mt-3" aria-selected="true"
                                            onClick={() => rest.setActiveTab("followup")}>
                                        Suivi des signalements
                                    </button>
                                    <button className="nav-link active  mt-3" aria-selected="true"
                                            onClick={() => rest.setActiveTab("dossiers")}>
                                        Dossiers
                                    </button>

                                    <button className="nav-link active  mt-3" aria-selected="true"
                                            onClick={() => rest.setActiveTab("unassigned")}>
                                        Attribution
                                    </button>

                                {/*</div>*/}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="row pb-2">
                    <div className="col">
                        <MenuLeft/>
                    </div>
                </div>

                {/*<div className="row pb-2">*/}
                {/*    <div className="col">*/}
                {/*        <Info/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {
                    !!rest.reportFilterHook
                        ?
                        <div className="row">
                            <div className="col">
                                <FilterReport reportFilterHook={rest.reportFilterHook}/>
                            </div>
                        </div>
                        :
                        null
                }


            </div>

            <div className="col pt-4">
                <div className="scroller-coordinator-container">
                    <div className="scroller-coordinator">
                        {/*{here we set the main page on the right} */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContainerMenuLeft