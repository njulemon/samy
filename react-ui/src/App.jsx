import "./custom.scss"
import 'leaflet/dist/leaflet.css';
import MapWithMenu from "./MapWithMenu";

import Login from "./Login";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useEffect} from "react";
import axios from "axios";
import {uriTranslationFr, urlServer} from "./def/Definitions";
import {setTranslation} from "./app/States";
import Reload from "./Reload";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import ResetPassword from "./ResetPassword";

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
            ).then((response) => dispatch(setTranslation(response.data)))
        },
        []
    )

    useEffect(
        () => {
            if (! location.pathname.includes('no-redirection'))
                translation === {} ? navigate('/R/wait') : isLogged ? reload ? navigate('/R/reload') : navigate('/R/map') : navigate('/R/login')
        },
        [translation, isLogged, reload]
    )

    return (
        <div className="App">

            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/R/login" element={<Login/>}/>
                <Route path="/R/reload" element={<Reload/>}/>
                <Route path="/R/map" element={<MapWithMenu/>}/>
                <Route path="/R/no-redirection/reset-password/:pk/:key" element={<ResetPassword />} />
                <Route path="/R/wait" element={null}/>
            </Routes>
        </div>
    );
}

export default App;
