import L, {LatLng, Marker, Point} from 'leaflet';
import './App.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCirclePlus, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useRef, useState} from "react";
import React from 'react';

import ModalNewReport from "./ModalNewReport";
import {useAppDispatch} from "./app/hooks";
import {
    showNewReportModal,
    denyAccess,
    setCoordinatesNewReport,
    showReportDetailModal
} from "./app/States";
import {getReports} from "./api/Report";
import {logout} from "./api/Access";
import ModalReportDetail from "./ModalReportDetail";
import {faStar} from "@fortawesome/free-regular-svg-icons/faStar";
import ModalRanking from "./ModalRanking";
import {waitFor} from "@testing-library/react";

let DefaultIcon = L.divIcon({className: 'circle', iconSize: [20, 20]});
let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});
let HighlightDot = L.divIcon({className: 'highlight-dot', iconSize: [20, 20]});
const newMarkerIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: new Point(12, 41)})

L.Marker.prototype.options.icon = DefaultIcon;

function MapWithMenu() {

    // initial map parameters
    const map = useRef(null);
    const size_x_meter = useRef(100000);
    const size_y_meter = useRef(100000);

    const dotHighlight = useRef(new Marker(new LatLng(0, 0)))

    const [mapCreated, setMapCreated] = useState(false)

    const [idReportDetail, setIdReportDetail] = useState(null)
    const [showModalRanking, setShowModalRanking] = useState(false)

    // allow access to global states (eg 'isLogged')
    const dispatch = useAppDispatch()

    // coordinates of the reports and content (for tooltip)
    const listReportCoordinates = useRef([])
    const listReports = useRef([])

    // marker for new reports
    const new_report_marker = useRef(null)

    // list of the marker to keep in memory to delete -> update the map.
    const listMarkers = useRef([]);

    // dot showing current location
    const you_are_here_dot = useRef(new Marker(new LatLng(0, 0)));

    function onMapZoom() {
        updateMarkers();

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
            listMarkers.current.forEach(
                (marker) => {
                    map.current?.removeLayer(marker);
                }
            )

            // create new one.
            if (map.current) {
                listReportCoordinates.current.forEach(
                    (coord, index) => {

                        listMarkers.current.push(
                            // @ts-ignore
                            L.marker(coord).addTo(map.current).on('click', () => {
                                setIdReportDetail(null)  // we need to force change if we click again on the same record.
                                setIdReportDetail(listReports.current[index].id)
                            }))
                    }
                );
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

    function addNewReportMarker() {

        console.log("addNewMarker")
        if (map.current) {
            let center = map.current.getCenter()
            if (new_report_marker.current) {
                map.current?.removeLayer(new_report_marker.current)
            }
            new_report_marker.current = L.marker(center, {icon: newMarkerIcon, draggable: true}).addTo(map.current)
            new_report_marker.current.on('click', () => {
                dispatch(showNewReportModal())
                dispatch(setCoordinatesNewReport(
                    {
                        latitude: new_report_marker.current?.getLatLng().lat,
                        longitude: new_report_marker.current?.getLatLng().lng
                    }
                ))
            })
        }
    }

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

    const showRanking = () => {
        setShowModalRanking(true)
    }

    // init
    useEffect(
        () => {


            map.current = L.map('map', {attributionControl: false})

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
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | by N. Julémont | v-1.1.3'
            }).addTo(map.current);

            L.control.attribution({position: 'bottomleft'}).addTo(map.current);

            map.current.on('zoomend', onMapZoom);
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
                setMapCreated(false)
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

    // when id of event is changed (clicked)
    useEffect(
        () => {
            if (idReportDetail) {
                dispatch(showReportDetailModal())
            }
        },
        [idReportDetail, dispatch]
    )

    return (
        <>
            {idReportDetail ?
                (<ModalReportDetail id_report={idReportDetail} key={"modal-event-detail-" + idReportDetail}/>)
                :
                null
            }
            <ModalNewReport/>
            <ModalRanking
                show={showModalRanking}
                setShow={setShowModalRanking}
                listReports={listReports}
                setHighlightReport={highlightReport}
            />
            <div>
                <div id='map'>
                    <div className="leaflet-top leaflet-right">
                        <div className="background-leaflet-buttons">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col">
                                        <FontAwesomeIcon icon={faSignOutAlt} className="logout-button"
                                                         onClick={() => {
                                                             logout().then(() => dispatch(denyAccess()))
                                                         }} fixedWidth/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="here-icon"
                                                         onClick={updateLocation}
                                                         fixedWidth/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <FontAwesomeIcon icon={faCirclePlus} className="new-icon"
                                                         onClick={addNewReportMarker}
                                                         fixedWidth/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <FontAwesomeIcon icon={faStar} className="new-icon mb-2"
                                                         onClick={showRanking}
                                                         fixedWidth/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MapWithMenu;