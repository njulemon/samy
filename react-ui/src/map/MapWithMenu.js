import L, {LatLng, Marker, Point} from 'leaflet';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCirclePlus, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useRef, useState} from "react";
import React from 'react';

import ModalNewReport from "./ModalNewReport";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {
    showNewReportModal,
    denyAccess,
    setCoordinatesNewReport,
    showReportDetailModal, setNewReportArea, showProfileModal
} from "../app/States";
import {getReports} from "../api/Report";
import {logout} from "../api/Access";
import ModalReportDetail from "./ModalReportDetail";
import {faStar} from "@fortawesome/free-regular-svg-icons/faStar";
import ModalRanking from "./ModalRanking";
import {faToolbox} from "@fortawesome/free-solid-svg-icons/faToolbox";
import {useNavigate} from "react-router-dom";
import ModalOutOfArea from "./ModalOutOfArea";
import ModalProfile from "../profile/ModalProfile";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";

let DefaultIcon = L.divIcon({className: 'circle', iconSize: [20, 20]});
let GreenIcon = L.divIcon({className: 'circle-green', iconSize: [20, 20]});
let BlueIcon = L.divIcon({className: 'circle-blue', iconSize: [20, 20]});
let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});
let HighlightDot = L.divIcon({className: 'highlight-dot', iconSize: [20, 20]});
const newMarkerIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: new Point(12, 41)})

L.Marker.prototype.options.icon = DefaultIcon;

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


function MapWithMenu({areaHook}) {

    const user = useAppSelector((state) => state.states.user)
    const showEventDetail = useAppSelector((state) => state.states.modales.modal_event_detail)

    // initial map parameters
    const map = useRef(null);
    const size_x_meter = useRef(100000);
    const size_y_meter = useRef(100000);

    const dotHighlight = useRef(new Marker(new LatLng(0, 0)))

    const [mapCreated, setMapCreated] = useState(false)

    const [idReportDetail, setIdReportDetail] = useState(null)
    const [showModalRanking, setShowModalRanking] = useState(false)

    const [showModalOutOfArea, setShowModalOutOfArea] = useState(false)

    // allow access to global states (eg 'isLogged')
    const dispatch = useAppDispatch()

    // coordinates of the reports and content (for tooltip)
    const listReportCoordinates = useRef([])
    const listReports = useRef([])

    // marker for new reports
    const new_report_marker = useRef(null)
    const lastRerportMarkerCoordinates = useRef(null)

    // list of the marker to keep in memory to delete -> update the map.
    const listLayers = useRef([]);

    // layer control
    const layerControl = useRef(null)

    // dot showing current location
    const you_are_here_dot = useRef(new Marker(new LatLng(0, 0)));

    // boundary communes
    const layerCommune = useRef()

    const navigate = useNavigate();

    function onMapZoom() {
        // updateMarkers();

        // record location
        const zoom = map.current.getZoom()
        const bounds = map.current.getBounds()
        localStorage.setItem("map-zoom", zoom.toString())
        localStorage.setItem("map-center-lat", bounds.getCenter().lat)
        localStorage.setItem("map-center-lng", bounds.getCenter().lng)
    }

    // this method is called each time we change the area displayed.
    function updateMarkers() {

        console.log('updateMarkers')
        setIdReportDetail(null)

        if (map.current) {
            // update size of the map variables each time user redefine the map size.
            size_x_meter.current = map.current.distance(map.current.getBounds().getNorthEast(), map.current.getBounds().getNorthWest());
            size_y_meter.current = map.current.distance(map.current.getBounds().getNorthEast(), map.current.getBounds().getSouthEast());

            // remove old markers.
            listLayers.current.forEach(
                (layer) => {
                    map.current?.removeLayer(layer);
                }
            )

            // create new ones.
            if (map.current) {
                // layers (local variables)
                let layer_red = L.layerGroup([]).addTo(map.current)
                let layer_green = L.layerGroup([]).addTo(map.current)
                let layer_orange = L.layerGroup([]).addTo(map.current)

                listReportCoordinates.current.forEach(
                    (coord, index) => {
                        if ([0, 1, 2].includes(listReports.current[index].annotation.status)) {

                            // @ts-ignore
                            let marker = L.marker(coord).on('click', () => {
                                setIdReportDetail(listReports.current[index].id)
                                dispatch(showReportDetailModal())
                            })
                            layer_red.addLayer(marker)
                        } else if ([4, 6].includes(listReports.current[index].annotation.status)) {
                            // @ts-ignore
                            let marker = L.marker(coord, {icon: GreenIcon}).on('click', () => {
                                setIdReportDetail(listReports.current[index].id)
                                dispatch(showReportDetailModal())
                            })
                            layer_green.addLayer(marker)
                        } else if ([3, 5].includes(listReports.current[index].annotation.status)) {
                            // @ts-ignore
                            let marker = L.marker(coord, {icon: BlueIcon}).on('click', () => {
                                setIdReportDetail(listReports.current[index].id)
                                dispatch(showReportDetailModal())
                            })
                            layer_orange.addLayer(marker)
                        }
                    }
                );

                layerControl.current = L.control.layers({},{'Nouveaux': layer_red, 'En cours': layer_orange, 'Fini': layer_green},{position: 'topleft'}).addTo(map.current)

                // store the layers
                listLayers.current.push(layer_red)
                listLayers.current.push(layer_green)
                listLayers.current.push(layer_orange)
            }
        }
    }

    // Update location of the user when clicking on the find me icon.
    function updateLocation() {

        if ("geolocation" in navigator) {
            /* geolocation is available */

            /* delete previous marker */
            map.current?.removeLayer(you_are_here_dot.current)

            /* add new marker */
            navigator.geolocation.getCurrentPosition(function (position) {
                you_are_here_dot.current = L.marker(
                    new LatLng(position.coords.latitude, position.coords.longitude),
                    {icon: HereDot}
                )
                    .addTo(map.current);
            });

            map.current?.locate({setView: true, maxZoom: 18});
        } else {
            /* geolocation is NOT available */
            alert('Not able to geolocate you.')
        }
    }

    // add new marker
    function addNewReportMarker() {

        console.log("addNewMarker")
        if (map.current) {

            let center = map.current.getCenter()


            if (areaHook.isMarkerInsideActivePolygon(center)) {

                // delete current marker
                if (new_report_marker.current) {
                    map.current?.removeLayer(new_report_marker.current)
                }

                // add it
                new_report_marker.current = L.marker(center, {icon: newMarkerIcon, draggable: true}).addTo(map.current)

                // set callback click
                new_report_marker.current.on('click', () => {
                    dispatch(showNewReportModal())
                    dispatch(setCoordinatesNewReport(
                        {
                            latitude: new_report_marker.current?.getLatLng().lat,
                            longitude: new_report_marker.current?.getLatLng().lng
                        }
                    ))
                    dispatch(setNewReportArea(
                        {
                            area_id: areaHook.getArea(
                                new LatLng(
                                    new_report_marker.current?.getLatLng().lat,
                                    new_report_marker.current?.getLatLng().lng
                                )
                            )
                        }
                    ))
                })

                new_report_marker.current.on('dragstart', () => {
                    lastRerportMarkerCoordinates.current = {
                        latitude: new_report_marker.current?.getLatLng().lat,
                        longitude: new_report_marker.current?.getLatLng().lng
                    }
                })

                new_report_marker.current.on('dragend', () => {
                    if (!areaHook.isMarkerInsideActivePolygon(new_report_marker.current.getLatLng())) {
                        new_report_marker.current.setLatLng(
                            new LatLng(lastRerportMarkerCoordinates.current.latitude,
                                lastRerportMarkerCoordinates.current.longitude)
                        )
                        setShowModalOutOfArea(true)
                    }
                })
            } else {
                setShowModalOutOfArea(true)
            }

        }
    }

    // move to the right dot on the map and highlight it.
    function highlightReport(lat, lng) {
        try {
            map.current?.removeLayer(dotHighlight.current)
        } catch {
        }
        map.current?.setView(new LatLng(lat, lng), 15, {animate: true, duration: 1})
        dotHighlight.current = L.marker(
            new LatLng(lat, lng),
            {icon: HighlightDot}
        )
            .addTo(map.current);

        setTimeout(() => {
            map.current?.removeLayer(dotHighlight.current)
        }, 2_000)

    }

    // init
    useEffect(
        () => {


            map.current = L.map('map', {attributionControl: false, zoomControl: false})

            // check if local storage already containts info on the map.
            if (localStorage.getItem('map-zoom')) {

                const zoom = parseInt(localStorage.getItem("map-zoom"))
                const center_lat = parseFloat(localStorage.getItem("map-center-lat"))
                const center_lng = parseFloat(localStorage.getItem("map-center-lng"))

                map.current.setView([center_lat, center_lng], zoom);
            } else {
                map.current.setView([50.85, 4.348], 13);
            }


            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Samy v-1.4.4.t'
            }).addTo(map.current);

            L.control.attribution({position: 'bottomleft'}).addTo(map.current);

            // update of stored coordinates & zoom each time user navigate though map
            map.current.on('zoomend', onMapZoom)
            map.current.on('moveend', onMapZoom)

            // we trigger the fact that map has been created.
            setMapCreated(true)

            return () => {
                const zoom = map.current.getZoom()
                const bounds = map.current.getBounds()
                localStorage.setItem("map-zoom", zoom.toString())
                localStorage.setItem("map-center-lat", bounds.getCenter().lat)
                localStorage.setItem("map-center-lng", bounds.getCenter().lng)
                map.current?.remove();
                // setMapCreated(false)
            }
        },
        []
    );

    useEffect(
        () => {

            // download all the reports and keep them in memory.
            const downloadReportAndDisplay = () => {
                getReports()
                    .then(
                        (response) => {
                            if (response.status === 200) {
                                listReportCoordinates.current.splice(0, listReportCoordinates.current.length)
                                listReports.current.splice(0, listReports.current.length)
                                response.data.forEach(
                                    (report) => listReportCoordinates.current.push(
                                        new LatLng(report.latitude, report.longitude
                                        ))
                                )
                                response.data.forEach(
                                    (report) => {
                                        listReports.current.push(report)
                                    }
                                )
                                try {
                                    updateMarkers()
                                } catch (e) {
                                    console.log(e)
                                }

                            }
                        }
                    )
                    .catch()
            }

            if (mapCreated) {
                downloadReportAndDisplay()
            }

        }, [mapCreated]
    )

    useEffect(() => {
        if (mapCreated && !!areaHook.isLoaded) {
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

    }, [areaHook.isLoaded, mapCreated, areaHook.communesGeoJson])

    return (

        <div className="container-map">

            {idReportDetail ?
                (<ModalReportDetail id_report={idReportDetail} key={"modal-event-detail-" + idReportDetail}/>)
                :
                null
            }

            <ModalNewReport/>

            <ModalOutOfArea
                show={showModalOutOfArea}
                setShow={setShowModalOutOfArea}
            />

            <ModalRanking
                show={showModalRanking}
                setShow={setShowModalRanking}
                listReports={listReports}
                setHighlightReport={highlightReport}
            />

            <ModalProfile/>

            <div id='map'>
                <div className="leaflet-top leaflet-right">
                    <div className="background-leaflet-buttons">
                        <div className="container-fluid m-0 p-0">
                            <div className="row m-0 p-0">
                                <FontAwesomeIcon icon={faSignOutAlt} className="logout-button pointer"
                                                 onClick={() => {
                                                     logout().then(() => dispatch(denyAccess()))
                                                 }} fixedWidth/>

                            </div>

                            <hr className="m-0 p-0"/>

                            <div className="row m-0 p-0">
                                <FontAwesomeIcon icon={faStar} className="new-icon mt-1 pointer"
                                                 onClick={() => setShowModalRanking(true)}
                                                 fixedWidth/>
                            </div>

                            <hr className="m-0 p-0"/>

                            <div className="row m-0 p-0">
                                <FontAwesomeIcon icon={faUser} className="new-icon mt-1 pointer"
                                                 onClick={() => dispatch(showProfileModal())}
                                                 fixedWidth/>
                            </div>

                            {user?.is_coordinator ?
                                (
                                    <>
                                        <hr className="m-0 p-0"/>
                                        <div className="row m-0 p-0">
                                            <FontAwesomeIcon icon={faToolbox}
                                                             className="new-icon mt-1 d-none d-lg-block pointer"
                                                             onClick={() => navigate('/R/coordinator')}
                                                             fixedWidth/>
                                        </div>
                                    </>
                                )
                                : null}

                        </div>
                    </div>
                </div>

                <div className="leaflet-bottom leaflet-right">
                    <div className="background-leaflet-buttons">
                        <div className="container-fluid m-0 p-0">
                            <div className="row m-0 p-0">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="here-icon pointer"
                                                 onClick={updateLocation}
                                                 fixedWidth/>
                            </div>
                            <div className="row m-0 p-0">
                                <FontAwesomeIcon icon={faCirclePlus} className="new-icon pointer"
                                                 onClick={addNewReportMarker}
                                                 fixedWidth/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MapWithMenu;