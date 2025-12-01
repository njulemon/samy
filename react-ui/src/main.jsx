import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./app/store.js";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
