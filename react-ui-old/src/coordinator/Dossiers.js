import {Card, Toast} from "react-bootstrap";
import MultiMap from "./MultiMap";
import ModalNewDossier from "./ModalNewDossier";
import React, {useEffect, useState} from "react";
import useDossierHook from "../hooks/useDossierHook";
import SlateModal from "./SlateModal";
import ModalUpdateDossier from "./ModalUpdateDossier";

const Dossiers = () => {

    const [showModalNew, setShowModalNew] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalQuill, setShowModalQuill] = useState(false)
    const [showWarningSelection, setShowWarningSelection] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [currentReportToAdd, setCurrentReportToAdd] = useState(null)
    const [currentReportToDelete, setCurrentReportToDelete] = useState(null)
    const [lastReportClicked, setLastReportClicked] = useState(null)
    // const [newContent, setNewContent] = useState(null)
    // const [images, setImages] = useState({})
    const [updateToggle, setUpdateToggle] = useState(false)

    const dossierHook = useDossierHook()

    // when a new document is fetched, we show off the modal
    useEffect(() => setShowModalNew(false), [dossierHook.listDossiers])
    useEffect(() => setShowModalUpdate(false), [dossierHook.listDossiers])

    // memorize in "lastReportClicked" the last report clicked in both list (add report and delete report lists).
    useEffect(() => setLastReportClicked(currentReportToAdd), [currentReportToAdd])
    useEffect(() => setLastReportClicked(currentReportToDelete), [currentReportToDelete])

    const forceUpdate = () => {
        setUpdateToggle(!updateToggle)
    }

    return (
        <>
            <SlateModal show={showModalQuill} setShow={setShowModalQuill} id={parseInt(dossierHook.currentDossier)} forceUpdate={forceUpdate}/>
            <ModalNewDossier show={showModalNew} setShow={setShowModalNew} dossierHook={dossierHook}/>
            <ModalUpdateDossier show={showModalUpdate} setShow={setShowModalUpdate} dossierHook={dossierHook}/>
            <Card>
                <Card.Header>
                    Gestion des dossiers
                </Card.Header>
                <Card.Body>

                    <div className="row">
                        <div className="col-auto">
                            <Toast
                                onClose={() => setShowWarningSelection(false)}
                                show={showWarningSelection}
                                animation={true}
                                bg='info'>
                                <Toast.Header>
                                    <strong className="me-auto">Info</strong>
                                </Toast.Header>
                                <Toast.Body>Il faut d'abord sélectionner un dossier pour pouvoir l'éditer</Toast.Body>
                            </Toast>
                        </div>
                    </div>

                    <div className="row mt-1 mb-1">
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-primary mt-2 mb-2"
                                onClick={() => {
                                    if (!!dossierHook.currentDossier) {
                                        setShowModalQuill(true)
                                    } else {
                                        setShowWarningSelection(true)
                                    }
                                }}>
                                Éditer le rapport
                            </button>
                        </div>
                        <div className="col-auto">
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-outline-primary mt-2 mb-2"
                                    onClick={() => {
                                        setShowModalNew(true)
                                    }}>
                                Nouveau
                            </button>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-outline-primary mt-2 mb-2" onClick={() => {
                                setShowModalUpdate(true)
                            }}>
                                Éditer paramètres
                            </button>
                        </div>

                        <div className="col-auto">
                            {!deleteMode ?

                                <button
                                    className="btn btn-outline-danger mt-2 mb-2"
                                    onClick={() => setDeleteMode(true)}>
                                    Supprimer
                                </button>
                                :
                                <div className="row border border-danger rounded">
                                    <div className="col-auto">
                                        <button className="btn btn-success mt-2 mb-2"
                                                onClick={() => setDeleteMode(false)}>
                                            Annuler
                                        </button>
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-danger mt-2 mb-2"
                                                onClick={() => {
                                                    dossierHook.deleteCurrentDossier()
                                                    setDeleteMode(false)
                                                }}>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="col">
                        </div>
                    </div>
                    <hr/>
                    <div className="row">

                        <div className="col-6">
                            <label htmlFor="listDossiers" className="form-label">Liste des dossiers</label>
                            <select className="form-select" id="listDossiers" size={12}>
                                {
                                    dossierHook.listDossiers.map(
                                        item => (<option key={item.id} value={item.id}
                                                         onClick={(event) => dossierHook.setCurrentDossier(event.target.value)}>{item.name}
                                            </option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-6">
                            <MultiMap
                                lat_lng={
                                    dossierHook.allReports.map(item => {
                                        return {latitude: item.latitude, longitude: item.longitude, id: item.id}
                                    })
                                }
                                idMap={3}
                                idsCurrent={dossierHook.currentReports.map(item => item.id)}/>
                        </div>
                    </div>

                    <hr/>
                    <div className="row">
                        <h3>Dossier {dossierHook.currentDossier ? `${dossierHook.currentDossier} :` : null} {dossierHook.listDossiers.find(item => item.id === parseInt(dossierHook.currentDossier))?.name}</h3>
                    </div>
                    <div className="row">

                        <div className="col-4">
                            <label htmlFor="listReports" className="form-label">Liste des signalements</label>

                            <select className="form-select" size={12} id="listReports"
                                    onChange={event => setCurrentReportToAdd(parseInt(event.target.value))}>
                                {dossierHook.allReports.map(item => <option key={item.id}
                                                                            value={item.id}>Report {item.id}</option>)}
                            </select>

                            <button
                                className="btn btn-outline-primary mt-2 mb-3"
                                onClick={() => dossierHook.addReport(currentReportToAdd)}>
                                &#62;&#62;&#62;
                            </button>
                        </div>

                        <div className="col-4">
                            <label htmlFor="listReportsLinked" className="form-label">Liste des signalements
                                associés</label>
                            <select className="form-select" size={12}
                                    onChange={event => setCurrentReportToDelete(parseInt(event.target.value))}>
                                {dossierHook.allReports.filter(item => dossierHook.currentReports.map(rep => rep.id).includes(item.id)).map(item => {
                                    return (<option key={item.id} value={item.id}>Report {item.id}</option>)
                                })}
                            </select>
                            <button className="btn btn-outline-danger mt-2 mb-3"
                                    onClick={() => dossierHook.deleteReport(currentReportToDelete)}>X
                            </button>
                        </div>

                        <div className="col-4">
                            <MultiMap
                                lat_lng={
                                    dossierHook.allReports.map(item => {
                                        return {latitude: item.latitude, longitude: item.longitude, id: item.id}
                                    })}
                                idMap={4}
                                idsCurrent={[lastReportClicked]}/>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default Dossiers