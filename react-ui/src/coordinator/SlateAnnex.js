import React, {useEffect, useRef, useState} from "react";
import L from "leaflet";
import leafletImage from "node-leaflet-image";
import axios from "axios";
import {urlServer} from "../def/Definitions";
import {useAppSelector} from "../app/hooks";
import LoadingAnnex from "./LoadingAnnex";

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

    const map = useRef(null);
    const tileLayer = useRef(null);
    const [images, setImages] = useState({})  // temp images
    // const [report, setReport] = useState({})
    const [images_, setImages_] = useState({})  // final images
    const [counter, setCounter] = useState(0)
    const [mapInit, setMapInit] = useState(false)
    const [reports, setReports] = useState({})
    const [done, setDone] = useState(false)
    // const [progress, setProgress] = useState(0)

    const _ = useAppSelector((state) => state.states.translation)


    const fetchRecords = () => {
        const axiosRequests = ids.map(id => axios.get(`${urlServer}/api/report/${id}/`, {withCredentials: true}))
        axios.all(axiosRequests).then(responses => {
            let results = {}
            responses.forEach(item => {
                results = {...results, [item.data.id]: item.data }
            })
            return new Promise((res, rej) => res(results))
        })
            .then(results => setReports(results))
    }


    useEffect(() => {
        map.current = L.map('map-hidden', {
            center: [50.849727, 4.359414],
            zoom: 16,
            // preferCanvas: true
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

    useEffect(() => console.log(images_), [images_])

    useEffect(() => {
        if (Object.keys(images).length === ids.length) {
            setImages_(images)
            setDone(true)
            // setProgress(0)
        }
    }, [images])


    // useEffect(() => setProgress(Object.keys(images_).length / Object.keys(ids).length), [ids, images_])

    useEffect(() => {

        const process = async () => {


            // tileLayer.current.on('load', () => {
            //     leafletImage(map.current, function (err, canvas) {
            //         // now you have canvas
            //         // example thing to do with that canvas:
            //         // let img = document.createElement('img');
            //         // let dimensions = map.current.getSize();
            //         // img.width = dimensions.x;
            //         // img.height = dimensions.y;
            //         // console.log(dimensions)
            //
            //         // console.log(canvas.toDataURL())
            //         images.current = {...images.current, [ids[counter]]: canvas.toDataURL()}
            //
            //         if (counter < ids.length) {
            //             setCounter(counter + 1)
            //         }
            //
            //         tileLayer.current.off()
            //         map.current.off()
            //     })
            // })

            // sleep(1000).then(() => console.log('waiting 100'))

            const response = await axios.get(`http://localhost:8000/api/report/${ids[counter]}/`, {withCredentials: true})
            map.current.setView([response.data.latitude, response.data.longitude], 16)
            await sleep(1000)

            // map.current.once('moveend', () => {
                //     map.current.off()
                tileLayer.current.whenReady(() => {
                    // while (tileLayer.current.isLoading()) {
                    //     sleep(10).then(() => console.log('waiting'))
                    // }
                    //
                    // if (counter === 0) {
                    //     sleep(1000).then(() => console.log('waiting 1000'))
                    // }

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

                })
            // })
            // const response = await axios.get(`http://localhost:8000/api/report/${ids[counter]}/`, {withCredentials: true})
            // map.current.setView([response.data.latitude, response.data.longitude], 16)
            // sleep(1000)
        }


        if (mapInit && counter < ids.length && Object.keys(reports).length > 0) {
            process()
        }


    }, [counter, mapInit, images, ids, reports])

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
                        <h3>
                            {Object.keys(images_).length !== 0 && 'Annexes'}
                        </h3>
                        {Object.keys(images_)?.map(key => (
                            <div key={key}>
                                <h4>
                                    Signalement {Object.keys(reports).length !== 0 && reports[key]?.id}
                                </h4>
                                <ul>
                                    {Object.keys(reports).length !== 0 && reports[key]?.category_2.map(cat => (
                                        <li key={cat}>{_[cat]}</li>))}
                                </ul>

                                <img src={images_[key]}/>
                                <br/>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>)
                :
                <LoadingAnnex progress={100 * Object.keys(images).length / Object.keys(ids).length} />
            }
            <div className="row">
                <div className="col">
                    <div className={"hidden-map-container"}>
                        <div id={"map-hidden"} className="hidden-map"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SlateAnnex

