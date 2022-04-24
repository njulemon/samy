import Wait from "../Wait";
import React from "react";
import MapWithMenu from "./MapWithMenu";
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