import Wait from "../Wait.jsx";
import React from "react";
import MapWithMenu from "./MapWithMenu.jsx";
import {useAreaHook} from "../hooks/useAreaHook";

const MapWaitSwitch = () => {

    const areaHook = useAreaHook()

    return (
        <>
            {areaHook.isLoaded ?
                <MapWithMenu areaHook={areaHook}/>
                :
                <Wait/>
            }
        </>
    )
}

export default MapWaitSwitch