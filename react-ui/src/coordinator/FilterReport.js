import {Card} from "react-bootstrap";
import React from "react";
import {useAppSelector} from "../app/hooks";
import DatePicker from 'react-date-picker'


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
                        <div className="mb-1">
                                Status
                            </div>
                        {reportFilterHook?.optionsStatus?.map(
                            option => (
                                <div className="row" key={option.value}>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                               value={reportFilterHook?.status?.includes(option.value)}
                                               defaultChecked={true}
                                               id={"flexCheckDefault" + option.value}
                                               onChange={() => reportFilterHook.toggleStatus(option.value)}/>
                                        <label className="form-check-label" htmlFor={"flexCheckDefault" + option.value}>
                                            {_[option.display_name]}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        <hr/>
                        <div className="row">

                            <div className="mb-1">
                                Signalement de :
                            </div>
                            <div className="mb-2">
                                <DatePicker required={true} onChange={reportFilterHook.setDateFrom}
                                            value={reportFilterHook.filter.dates.from}/>
                            </div>
                            <div className="mb-1">
                                au :
                            </div>
                            <div className="mb-2">
                                <DatePicker required={true} onChange={reportFilterHook.setDateTo}
                                            value={reportFilterHook.filter.dates.to}/>
                            </div>
                        </div>
                    </div>

                </Card.Body>
            </Card>
        </>
    )
}

export default FilterReport