import Info from "./Info";
import MenuLeft from "./MenuLeft";
import FilterReport from "./FilterReport";

const ContainerMenuLeft = ({children, ...rest}) => {
    return (
        <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-auto pt-4">
                                            <div className="row pb-2">
                                                <div className="col">
                                                    <Info/>
                                                </div>
                                            </div>
                                            <div className="row pb-2">
                                                <div className="col">
                                                    <MenuLeft/>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <FilterReport reportFilterHook={rest.reportFilterHook}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col pt-4">
                                            {/*{here we set the main page on the right} */}
                                            {children}
                                        </div>
                                    </div>
                                </div>
    )
}

export default ContainerMenuLeft