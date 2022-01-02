import "./custom.scss"
import 'leaflet/dist/leaflet.css';
import MapWithMenu from "./MapWithMenu";

import Login from "./Login";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {useEffect} from "react";
import axios from "axios";
import {uriGetUser, uriTranslationFr, urlServer} from "./def/Definitions";
import {setTranslation} from "./app/States";


function App() {

    const isLogged = useAppSelector((state) => state.states.isLogged)
    const translation = useAppSelector((state) => state.states.translation)
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
            isLogged ? <MapWithMenu/> : <Login/>}
        </div>
    );
}

export default App;
