import "./custom.scss"
import 'leaflet/dist/leaflet.css';
import MapWithMenu from "./MapWithMenu";

import Login from "./Login";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useEffect} from "react";
import axios from "axios";
import {uriTranslationFr, urlServer} from "./def/Definitions";
import {setNewReportFormTranslation} from "./app/States";
import ConfirmReportSaved from "./ConfirmReportSaved";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import ResetPassword from "./ResetPassword";
import PageCoordinator from "./coodinator/PageCoordinator";
import * as localforage from "localforage";

require('dotenv').config()

function App() {

    const isLogged = useAppSelector((state) => state.states.isLogged)
    const translation = useAppSelector((state) => state.states.translation)
    const reload = useAppSelector((state) => state.states.reload)
    const dispatch = useAppDispatch()

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(
        () => {
            axios.get(
                urlServer + uriTranslationFr
            ).then((response) => dispatch(setNewReportFormTranslation(response.data)))

            localforage.config({
                driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
                name: 'samy',
                version: 1.0,
                size: 4980736, // Size of database, in bytes. WebSQL-only for now.
                storeName: 'samy', // Should be alphanumeric, with underscores.
                description: 'storing geojson'
            });
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(
        () => {
            if (!location.pathname.includes('no-redirection'))
                translation === {} ?
                    navigate('/R/wait') :
                    isLogged ?
                        reload ? navigate('/R/reload') : navigate('/R/map') :
                        navigate('/R/login')
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [translation, isLogged, reload]
    )

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/R/login" element={<Login/>}/>
                <Route path="/R/reload" element={<ConfirmReportSaved/>}/>
                <Route path="/R/map" element={<MapWithMenu/>}/>
                <Route path="/R/no-redirection/reset-password/:pk/:key" element={<ResetPassword/>}/>
                <Route path="/R/wait" element={null}/>
                <Route path="/R/coordinator" element={<PageCoordinator/>}/>
            </Routes>
        </div>
    );
}

export default App;
