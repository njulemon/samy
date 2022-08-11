import React, {useEffect, useRef, useState} from "react";
import L, {LatLng} from "leaflet";
import leafletImage from "../Tools/LeafletIageFixed";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";
import LoadingAnnex from "./LoadingAnnex";
import markerIcon from "../images/blue-dot.png"

const HereDot = L.icon({iconUrl: markerIcon, iconSize: new L.Point(20, 20)});

L.GridLayer.include({
    whenReady: function (callback, context) {
        if (!this._loading) {
            callback.call(context || this, {target: this});
        } else {
            this.on('load', callback, context);
        }
        return this;
    },
});

const SlateAnnex = ({ids}) => {

    // const HereDot = L.icon({
    //     iconUrl: marker_icon,
    //     iconSize: new L.point(20, 20)
    // });

    const map = useRef(null);
    const tileLayer = useRef(null);
    const [images, setImages] = useState({})  // temp images
    // const [report, setReport] = useState({})
    const [images_, setImages_] = useState({})  // final images
    const [counter, setCounter] = useState(0)
    const [mapInit, setMapInit] = useState(false)
    const [reports, setReports] = useState({})
    const [done, setDone] = useState(false)
    const marker = useRef(null)

    const _ = useAppSelector((state) => state.states.translation)


    const fetchRecords = () => {
        const axiosRequests = ids.map(id => axios.get(`${urlServer}/api/report/${id}/`, {withCredentials: true}))
        axios.all(axiosRequests).then(responses => {
            let results = {}
            responses.forEach(item => {
                results = {...results, [item.data.id]: item.data}
            })
            return new Promise((res, rej) => res(results))
        })
            .then(results => setReports(results))
    }


    useEffect(() => {

        map.current = L.map('map-hidden', {
            center: [50.849727, 4.359414],
            zoom: 17
        })

        tileLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.current);

        tileLayer.current.once('load', () => {
            setMapInit(true)
        })

        fetchRecords()

        return () => {
            map.current?.remove();
        }
    }, [])

    useEffect(() => {
        if (Object.keys(images).length === ids.length) {
            setImages_(images)
            setDone(true)
            // setProgress(0)
        }
    }, [images])


    useEffect(() => console.log(Object.keys(images_).length), [images_])

    useEffect(() => {

            const process = async () => {

                const response = await axios.get(`http://localhost:8000/api/report/${ids[counter]}/`, {withCredentials: true})
                map.current.setView([response.data.latitude, response.data.longitude], 17, {animate: false})
                if (!!marker.current) {
                    map.current.removeLayer(marker.current)
                    marker.current = null
                }

                marker.current = L.marker(new LatLng(response.data.latitude, response.data.longitude), {icon: HereDot}).addTo(map.current);
                await sleep(300)

                tileLayer.current.whenReady(() => {

                        tileLayer.current.off()

                        leafletImage(map.current, function (err, canvas) {

                            console.log(`counter = ${counter}`)

                            if (counter <= ids.length - 1) {
                                setImages({...images, [ids[counter]]: canvas.toDataURL()})
                            }

                            if (counter < ids.length) {
                                setCounter(counter + 1)
                            }
                        })

                    }
                )
            }


            if (mapInit && counter < ids.length && Object.keys(reports).length > 0) {
                process()
            }


        },
        [counter, mapInit, images, ids, reports]
    )

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

// useEffect(() => {
//     setDone(false)
//     setImages({})
//     setImages_({})
// }, [ids])

    return (
        <div className="row">
            {done ?
                (<div className="row">
                    <div className="col" id="selection-node-annex">
                        <hr />
                        <h3>
                            {Object.keys(images_).length !== 0 && 'Annexes'}
                        </h3>
                        {Object.keys(images_)?.map(key => (
                            <div key={key}>
                                <h4>
                                    Signalement {Object.keys(reports).length !== 0 && reports[key]?.id}
                                </h4>
                                <ul>
                                    <li key={reports[key]?.timestamp_creation}>
                                        Signalé le {(new Date(reports[key]?.timestamp_creation)).toLocaleDateString()} à
                                        &nbsp;à {(new Date(reports[key]?.timestamp_creation)).toLocaleTimeString()}
                                    </li>
                                    <li key={reports[key]?.latitude}>[{reports[key]?.latitude.toFixed(6)}, {reports[key]?.longitude.toFixed(6)}]</li>
                                    <li>
                                        Liste des problèmes rencontrés :
                                        <ul>
                                            {Object.keys(reports).length !== 0 && reports[key]?.category_2.map(cat => (
                                                <li key={cat}>{_[cat]}</li>))}
                                        </ul>
                                    </li>
                                </ul>

                                <img src={images_[key]}/>
                                <br/>
                                <br/>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>)
                :
                <LoadingAnnex progress={100 * Object.keys(images).length / Object.keys(ids).length}/>
            }
            <div className="row">
                <div className="col">
                    <div className="hidden-map-container">
                        <div id={"map-hidden"} className="hidden-map"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SlateAnnex

