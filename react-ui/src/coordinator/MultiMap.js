import React, {useEffect, useRef, useState} from "react";
import L from "leaflet";
import {useAreaHook} from "../hooks/useAreaHook";
import ModalReportDetail from "../map/ModalReportDetail";
import ModalReportSimple from "./ModalReportSimple";

let HereDot = L.divIcon({className: 'circle-here-no-highlight', iconSize: [20, 20]});
let CurrentDot = L.divIcon({className: 'circle-current-no-highlight', iconSize: [20, 20]});

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


const MultiMap = ({lat_lng, idMap, idsCurrent, idGreen}) => {

    const map = useRef(null);
    const [mapInitiated, setMapInitiated] = useState(false)
    const areaHook = useAreaHook()
    const layerCommune = useRef()

    const [showReportModal, setShowReportModal] = useState(null)
    const [idReportDetail, setIdReportDetail] = useState(null)

    // init
    useEffect(
        () => {

            if (!!idMap) {
                map.current = L.map('multi-map' + idMap, {attributionControl: false, zoomControl: true})

                if (lat_lng.length !== 0) {
                    map.current.fitBounds(new L.latLngBounds(lat_lng.map(item => new L.LatLng(item.latitude, item.longitude))));
                }


                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map.current);

                lat_lng.forEach(
                    item => {
                        L.marker(
                            new L.LatLng(item.latitude, item.longitude),
                            {icon: idsCurrent.includes(item.id) ? CurrentDot : HereDot}
                        ).addTo(map.current).on('click', () => {
                                setIdReportDetail(null)  // we need to force change if we click again on the same record.
                                setIdReportDetail(item.id)
                                setShowReportModal(true)
                            })
                    })

                setMapInitiated(true)
            }


            return () => {
                map.current?.remove();
            }
        },
        [lat_lng, idMap]
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
        <>
            <ModalReportSimple idReport={idReportDetail} show={showReportModal} setShow={setShowReportModal}/>
            <div className="multi-map-container">
                <div id={'multi-map' + idMap} className="multi-map">
                </div>
            </div>
        </>
    )
}

export default MultiMap