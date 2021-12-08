import L, {LatLng, Marker, Point} from 'leaflet';
import './App.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCirclePlus, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useRef} from "react";
import React from 'react';
import {joinDots} from "./DotsGrouping";

import ModalNewReport from "./ModalNewReport";
import {useAppDispatch} from "./app/hooks";
import {show} from "./app/Report";
import {denyAccess, giveAccess} from "./app/Login";

let DefaultIcon = L.divIcon({className: 'circle', iconSize: [50, 50]});
let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});
const newMarkerIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow, iconAnchor: new Point(12, 41)})

L.Marker.prototype.options.icon = DefaultIcon;

function MapWithMenu() {

    const map = useRef<L.Map | null>(null);
    const size_x_meter = useRef<number>(100000);
    const size_y_meter = useRef<number>(100000);

    const max_dots: number = 3

    // all the points extracted from the API.
    const list_init_markers_coord = useRef(
        [
            new LatLng(50.85, 4.348),
            new LatLng(50.87, 4.348),
            new LatLng(50.87, 4.349),
            new LatLng(50.87, 4.350),
            new LatLng(50.87, 4.370)
        ])

    const new_marker = useRef<Marker | null>(null)

    // current marker we want to display
    const list_markers_coord = useRef(list_init_markers_coord.current);

    // list of the marker to keep in memory to delete -> update the map.
    const list_markers = useRef([]);

    const n_events_by_marker = useRef([1, 1, 1, 1, 1]);

    const you_are_here_dot = useRef(new Marker(new LatLng(0, 0)));

    const dispatch = useAppDispatch()

    function onMapClick(e: { latlng: L.LatLngExpression; }) {

        if (map.current) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent('dist h : ' + size_x_meter.current + ' dist v = ' + size_y_meter.current)
                .openOn(map.current);
            //alert("You clicked the map at " + e.latlng);
        }

    }

    function onMapZoom() {
        updateMarkers();
    }

    function updateMarkers() {

        console.log("updateMarkers")

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
                    (coord: LatLng, index: number) => {
                        list_markers.current.push(
                            // @ts-ignore
                            L.marker(coord).addTo(map.current)
                                //.bindPopup(list_explanations.current[index])
                                .bindTooltip(n_events_by_marker.current[index].toString())
                        );
                    }
                );
            }

            console.log(list_markers_coord.current.length)

        }


    }

    function updateLocation() {
        // Update location of the user when clicking on the find me icon.

        console.log("updateLocation")

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

    function addNewMarker() {

        console.log("addNewMarker")
        if (map.current) {
            let center = map.current.getCenter()
            if (new_marker.current) {
                map.current?.removeLayer(new_marker.current)
            }
            new_marker.current = L.marker(center, {icon: newMarkerIcon, draggable: true}).addTo(map.current)
            new_marker.current.on('click', () => {
                dispatch(show())
            })
        }
    }

    useEffect(
        () => {
            console.log("useEffect []")
            map.current = L.map('map', {attributionControl: false}).setView([50.85, 4.348], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | made by N. Julémont'
            }).addTo(map.current);

            L.control.attribution({position: 'bottomleft'}).addTo(map.current);

            updateMarkers();

            map.current.on('zoom', onMapZoom);
            map.current.on('move', onMapZoom)

            return function () {
                map.current?.remove();
            }
        },
        []
    );

    return (
        <>
            <ModalNewReport/>
            <div>
                <div id='map'>
                    <div className="leaflet-top leaflet-right">
                        <FontAwesomeIcon icon={faSignOutAlt} className="logout-button"
                                         onClick={() => {
                                             dispatch(denyAccess())
                                         }} fixedWidth/>
                    </div>
                    <div className="leaflet-bottom leaflet-right">
                        <div className="background-leaflet-buttons">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="here-icon" onClick={updateLocation}
                                             fixedWidth/>
                            <br/>
                            <FontAwesomeIcon icon={faCirclePlus} className="new-icon" onClick={addNewMarker}
                                             fixedWidth/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default MapWithMenu;