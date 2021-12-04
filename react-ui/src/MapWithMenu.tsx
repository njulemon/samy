import L, {circle, LatLng, Marker} from 'leaflet';
import './App.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCirclePlus} from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
import crossLocation from './crosshair-svgrepo-com.svg'
import {Ref, useEffect, useRef, useState} from "react";
import React from 'react';
import {joinDots} from "./DotsGrouping";

import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import ReactDom from "react-dom";
import ModalNew from "./ModalNew";
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "./app/hooks";
import {show} from "./app/Report";

let DefaultIcon = L.divIcon({className: 'circle', iconSize: [50, 50]});
let HereDot = L.divIcon({className: 'circle-here', iconSize: [15, 15]});

L.Marker.prototype.options.icon = DefaultIcon;

function MapWithMenu() {

    const map = useRef<L.Map | null>(null);
    const size_x_meter = useRef<number>(100000);
    const size_y_meter = useRef<number>(100000);

    const max_dots: number = 3;


    // all the points extracted from the API.
    const list_init_markers_coord = useRef(
        [
            new LatLng(50.85, 4.348),
            new LatLng(50.87, 4.348),
            new LatLng(50.87, 4.349),
            new LatLng(50.87, 4.350),
            new LatLng(50.87, 4.370)
        ]);

    // current marker we want to display
    const list_markers_coord = useRef(list_init_markers_coord.current);

    // list of the marker to keep in memory to delete -> update the map.
    const list_markers = useRef([]);

    const n_events_by_marker = useRef([1, 1, 1, 1, 1]);

    const you_are_here_dot = useRef(new Marker(new LatLng(0, 0)));

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

        if ("geolocation" in navigator) {
            /* geolocation is available */

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

    useEffect(
        () => {

            map.current = L.map('map').setView([50.85, 4.348], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map.current);

            updateMarkers();

            //map.current.on('click', onMapClick);
            map.current.on('zoom', onMapZoom);
            map.current.on('move', onMapZoom)

            return function () {
                map.current?.remove();
            }
        },
        []
    );

    useEffect(
        () => {

        }
    )

    const dispatch = useAppDispatch()

    return (
        <>

            <ModalNew />

            <div id='map'>
                <div className="leaflet-bottom leaflet-left">
                    <div className="background-leaflet-buttons">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="here-icon" onClick={updateLocation}
                                         fixedWidth/>
                        <br/>
                        <FontAwesomeIcon icon={faCirclePlus} className="new-icon" onClick={() => {dispatch(show())}} fixedWidth/>
                    </div>
                </div>
            </div>
        </>
    );
}


export default MapWithMenu;