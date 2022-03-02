import L, {LatLng, LatLngBounds, Marker, Point} from 'leaflet';
import './App.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCirclePlus, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useRef, useState} from "react";
import React from 'react';
import {joinDots} from "./DotsGrouping";

import ModalNewReport from "./ModalNewReport";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {showReportModal, denyAccess, giveAccess, setCoordinates, showEventModal} from "./app/States";
import {getReport} from "./api/Report";
import {logout} from "./api/Access";
import ModalEventDetail from "./ModalEventDetail";

let DefaultIcon = L.divIcon({className: 'circle', iconSize: [50, 50]});
let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});
const newMarkerIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: new Point(12, 41)})

L.Marker.prototype.options.icon = DefaultIcon;

function MapWithMenu() {

    // initial map parameters
    const map = useRef(null);
    const size_x_meter = useRef(100000);
    const size_y_meter = useRef(100000);

    const [idEvent, setIdEvent] = useState(null)

    // report dots display rule
    const max_dots = 500

    // coordinates of the reports and content (for tooltip)
    const list_init_markers_coord = useRef([])
    const list_init_report_content = useRef([])

    // marker for new reports
    const new_report_marker = useRef(null)

    // report markers reduced (to not have high density of dots).
    const list_markers_coord = useRef(list_init_markers_coord.current);

    // list of the marker to keep in memory to delete -> update the map.
    const list_markers = useRef([]);
    const n_events_by_marker = useRef([]);

    // dot showing current location
    const you_are_here_dot = useRef(new Marker(new LatLng(0, 0)));

    // allow access to global states (eg 'isLogged')
    const dispatch = useAppDispatch()

    //modal event is displayed ?
    const eventModal = useAppSelector((state) => state.states.modales.modal_event_detail)

    // download all the reports and keep them in memory.
    function downloadReportAndDisplay() {
        getReport()
            .then(
                (response) => {
                    if (response.status === 200) {
                        list_init_markers_coord.current.splice(0, list_init_markers_coord.current.length)
                        list_init_report_content.current.splice(0, list_init_report_content.current.length)
                        response.data.forEach(
                            (report) => list_init_markers_coord.current.push(
                                new LatLng(report.latitude, report.longitude
                                ))
                        )
                        response.data.forEach(
                            (report) => {
                                list_init_report_content.current.push(report)
                            }
                        )
                        updateMarkers()
                    }
                }
            )
            .catch()
    }

    function onMapClick(e) {

        if (map.current) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent('dist h : ' + size_x_meter.current + ' dist v = ' + size_y_meter.current)
                .openOn(map.current);
        }
    }

    function onMapZoom() {
        updateMarkers();
    }

    // this method is called each time we change the area displayed.
    function updateMarkers() {

        if (map.current) {
            // update size of the map variables each time user redefine the map size.
            size_x_meter.current = map.current.distance(map.current.getBounds().getNorthEast(), map.current.getBounds().getNorthWest());
            size_y_meter.current = map.current.distance(map.current.getBounds().getNorthEast(), map.current.getBounds().getSouthEast());

            [list_markers_coord.current, n_events_by_marker.current] = joinDots(list_init_markers_coord.current, map.current?.getBounds(), max_dots);

            // remove old markers.
            list_markers.current.forEach(
                (marker) => {
                    map.current?.removeLayer(marker);
                }
            )

            // create new one.
            if (map.current) {
                list_markers_coord.current.forEach(
                    (coord, index) => {

                        const tooltip_text = n_events_by_marker.current[index] === 1 ?
                            list_init_report_content.current[index]
                            : n_events_by_marker.current[index].toString() + ' évènements'

                        list_markers.current.push(
                            // @ts-ignore
                            L.marker(coord).addTo(map.current).on('click', () => {setIdEvent(list_init_report_content.current[index].id)}))
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
                console.log('lat: ' + position.coords.latitude + ' long : ' + position.coords.longitude)
                you_are_here_dot.current = L.marker(
                    new LatLng(position.coords.latitude, position.coords.longitude),
                    {icon: HereDot})
                    // @ts-ignore
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
                dispatch(showReportModal())
                dispatch(setCoordinates(
                    {
                        latitude: new_report_marker.current?.getLatLng().lat,
                        longitude: new_report_marker.current?.getLatLng().lng
                    }
                ))
            })
        }
    }

    // init
    useEffect(
        () => {

            map.current = L.map('map', {attributionControl: false})

            // check if local storage already containts info on the map.
            if(localStorage.getItem('map-zoom')){

                const zoom = parseInt(localStorage.getItem("map-zoom"))
                const center_lat = parseFloat(localStorage.getItem("map-center-lat"))
                const center_lng = parseFloat(localStorage.getItem("map-center-lng"))

                const bounds = L.LatLngBounds()
                map.current.setView([center_lat, center_lng], zoom);
            }else{
                map.current.setView([50.85, 4.348], 13);
            }



            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | by N. Julémont'
            }).addTo(map.current);

            L.control.attribution({position: 'bottomleft'}).addTo(map.current);

            downloadReportAndDisplay()

            map.current.on('zoom', onMapZoom);
            map.current.on('move', onMapZoom)

            return function () {
                const zoom = map.current.getZoom()
                const bounds = map.current.getBounds()
                localStorage.setItem("map-zoom", zoom.toString())
                localStorage.setItem("map-center-lat", bounds.getCenter().lat)
                localStorage.setItem("map-center-lng", bounds.getCenter().lng)
                map.current?.remove();
            }
        },
        []
    );

    // when id of event is changed (clicked)
    useEffect(
        () => {
            if (idEvent){
                dispatch(showEventModal())
            }
        },
        [idEvent]
    )

    // reset id if modal is closed
    useEffect(
        () => {
            if (!eventModal){
                setIdEvent(null)
            }

        },
        [eventModal]
    )

    return (
        <>
            <ModalEventDetail id_report={idEvent} key={"modal-event-detail-" + idEvent} />
            <ModalNewReport />
            <div>
                <div id='map'>
                    <div className="leaflet-top leaflet-right">
                        <FontAwesomeIcon icon={faSignOutAlt} className="logout-button"
                                         onClick={() => {
                                             logout().then(() => dispatch(denyAccess()))
                                         }} fixedWidth />
                    </div>
                    <div className="leaflet-bottom leaflet-right">
                        <div className="background-leaflet-buttons">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="here-icon" onClick={updateLocation}
                                             fixedWidth/>
                            <br/>
                            <FontAwesomeIcon icon={faCirclePlus} className="new-icon" onClick={addNewReportMarker}
                                             fixedWidth />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MapWithMenu;