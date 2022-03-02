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

require('dotenv').config()

function App() {

    const isLogged = useAppSelector((state) => state.states.isLogged)
    const translation = useAppSelector((state) => state.states.translation)
    const reload = useAppSelector((state) => state.states.reload)
    const dispatch = useAppDispatch()

    useEffect(
        () => {
            axios.get(
                urlServer + uriTranslationFr
            ).then((response) => dispatch(setTranslation(response.data)))
        },
        []
    )

    return (
        <div className="App">
            {translation === {} ? null :
            isLogged ? reload ? <Reload /> : <MapWithMenu/> : <Login/>}
        </div>
    );
}

export default App;
