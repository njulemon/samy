import "./custom.scss"
import 'leaflet/dist/leaflet.css';
import 'quill/dist/quill.snow.css';


import Login from "./Login";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useEffect} from "react";
import axios from "axios";
import {uriTranslationFr, urlServer} from "./def/Definitions";
import {setNewReportFormTranslation} from "./app/States";
import ConfirmReportSaved from "./map/ConfirmReportSaved.jsx";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import ResetPassword from "./register_password/ResetPassword.jsx";
import PageCoordinator from "./coordinator/PageCoordinator.jsx";

// import * as localforage from "localforage";
import localforage from 'localforage';

import Wait from "./Wait.jsx";
import MapWaitSwitch from "./map/MapWaitSwitch.jsx";
import Who from "./Who.jsx";
import Features from "./Features.jsx";
import ReportFullScreen from "./ReportFullScreen.jsx";
import NotificationsPreferencesFullScreen from "./NotificationAlone/NotificationPreferencesFullScreen.jsx";

function App() {

    const isLogged = useAppSelector((state) => state.states.isLogged)
    const translation = useAppSelector((state) => state.states.translation)
    const reload = useAppSelector((state) => state.states.reload)
    const dispatch = useAppDispatch()

    const navigate = useNavigate();
    const location = useLocation();

    localforage.config({
        driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
        name: 'samy',
        version: 1.0,
        size: 20_000_000, // Size of database, in bytes. WebSQL-only for now.
        storeName: 'samy', // Should be alphanumeric, with underscores.
        description: 'storing geojson'
    })

    useEffect(
        () => {
            axios.get(
                urlServer + uriTranslationFr
            ).then((response) => dispatch(setNewReportFormTranslation(response.data)))
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    useEffect(
        () => {
            if (!location.pathname.includes('no-redirection'))

                Object.keys(translation || {}).length ?
                    navigate('/R/wait')
                    :
                    isLogged ?
                        reload ?
                            navigate('/R/reload')
                            :
                            navigate('/R/map')
                        :
                        navigate('/R/menu/login')
        },
        [translation, isLogged, reload]
    )

    return (
        <div className="App">
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/R/menu/login" element={<Login/>}/>
                    <Route path="/R/menu/who" element={<Who/>}/>
                    <Route path="/R/menu/features" element={<Features/>}/>
                    <Route path="/R/reload" element={<ConfirmReportSaved/>}/>
                    <Route path="/R/map" element={<MapWaitSwitch/>}/>
                    <Route path="/R/no-redirection/reset-password/:pk/:key" element={<ResetPassword/>}/>
                    <Route path="/R/wait" element={<Wait/>}/>
                    <Route path="/R/coordinator" element={<PageCoordinator/>}/>
                    <Route path="/R/no-redirection/report/:idReport" element={<ReportFullScreen/>}/>
                    <Route path="/R/no-redirection/notifications-preferences/:token" element={<NotificationsPreferencesFullScreen/>}/>
                </Routes>
        </div>
);
}

export default App;
