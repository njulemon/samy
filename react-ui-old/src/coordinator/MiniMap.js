import {useEffect, useRef, useState} from "react";
import L, {LatLng} from "leaflet";
import {useAreaHook} from "../hooks/useAreaHook";

let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});

const styleCommmunes = (feature) => {

    switch (feature.properties.active) {
        case true:
            return {
                stroke: true,
                color: '#376eee',
                weight: 2,
                fillOpacity: 0.1,
                fill: true,
                fillColor: '#3b66e8',
                smoothFactor: 1.0,
                lineJoin: 'round'
            }
        case false:
            return {
                stroke: false,
                color: '#32cd3a',
                fillOpacity: 0.15,
                fill: true,
                fillColor: '#d20c68',
                smoothFactor: 1.0,
                lineJoin: 'round'
            }
    }
}

const filterCommuneNotActive = geoJsonFeature => {
    return geoJsonFeature.properties.active
}


const MiniMap = ({lat, lng, zoom, id}) => {

    const map = useRef(null);
    const [mapInitiated, setMapInitiated] = useState(false)
    const areaHook = useAreaHook()
    const layerCommune = useRef()

    // init
    useEffect(
        () => {

            if (!!id) {
                map.current = L.map('mini-map' + id, {attributionControl: false, zoomControl: true})

                map.current.setView([lat, lng], zoom);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map.current);

                L.marker(
                    new LatLng(lat, lng),
                    {icon: HereDot}
                )
                    .addTo(map.current);

                setMapInitiated(true)
            }


            return () => {
                map.current?.remove();
            }
        },
        [lat, lng, zoom, id]
    )

    useEffect(() => {
        if (mapInitiated && !!areaHook.communesGeoJson) {
            layerCommune.current = L.geoJSON(
                areaHook.communesGeoJson,
                {
                    style: styleCommmunes,
                    filter: filterCommuneNotActive,
                    interactive: false,
                    bubblingMouseEvents: false
                })
                .addTo(map.current)
        }

    }, [areaHook.communesGeoJson, mapInitiated])

    return (
        <div className="mini-map-container">
            <div id={'mini-map' + id} className="mini-map">
            </div>
        </div>
    )
}

export default MiniMap