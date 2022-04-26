import {Card} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../app/hooks";

const FilterReport = ({reportFilterHook}) => {

    const _ = useAppSelector(state => state.states.translation)

    return (
        <>
            <Card style={{width: '18rem'}}>
                <Card.Header>
                    Filtres
                </Card.Header>
                <Card.Body>
                    <div className="container">
                        {reportFilterHook?.optionsStatus?.map(
                            option => (
                                <div className="row" key={option.value}>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={reportFilterHook?.status?.includes(option.value)}
                                               defaultChecked={true}
                                               id={"flexCheckDefault"+option.value} onChange={() => reportFilterHook.toggleStatus(option.value)}/>
                                        <label className="form-check-label" htmlFor={"flexCheckDefault"+option.value}>
                                            {_[option.display_name]}
                                        </label>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default FilterReport