import React, {Suspense} from 'react';
import './App.css';
import MapWithMenu from "./MapWithMenu";

import logo from './logo.svg';
import Login from "./Login";
import {useAppSelector} from "./app/hooks";


// loading component for suspense fallback
const Loader = () => (
    <div className="App">
        <img src={logo} className="App-logo" alt="logo"/>
        <div>loading...</div>
    </div>
);

function App() {

    const selector = useAppSelector((state) => state.isLogged.value)

    return (
        <div className="App">
            {selector ? <MapWithMenu/> : <Login/>}
        </div>
    );
}

export default App;
