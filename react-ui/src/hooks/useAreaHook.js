import {useEffect, useState} from "react";
import {urlServer} from "../def/Definitions";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {setCommunesGeoJson} from "../app/States";
import * as localforage from "localforage";

export const useAreaHook = () => {
    // cache + fetch communes from the DB.

    // based on redux states
    const dispatch = useAppDispatch()
    const communesGeoJson = useAppSelector((state) => state.states.communesGeoJson)

    const [communesGeoJsonRaw, setCommunesGeoJsonRaw] = useState(null)

    // once data is loaded into memory (from DB or from fetching and filter with active commune only).
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!communesGeoJson) {
            localforage.getItem('communesGeoJson', (err, value) => {
                if (value === null) {
                    fetchFeatureSelection()
                } else {
                    setCommunesGeoJsonRaw(value)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (!!communesGeoJson) {
            setIsLoaded(true)
        }
    }, [communesGeoJson])

    useEffect(() => {

        const addActive = async () => {
            // make a copy of geoJson
            const featuresCollectionCopy = JSON.parse(JSON.stringify(communesGeoJsonRaw))

            // fetch active communes (only the names)
            const activeRequest = await axios.get(urlServer + '/api/area/active/', {withCredentials: true})

            // transform result (communes name) to an array
            const listActive = activeRequest.data.map(row => row.name)

            console.log(listActive)

            let idx_negative = 0
            communesGeoJsonRaw.features?.forEach((row, idx) => {
                    const name = row["properties"]["name"]

                    // add active property to active commune
                    if (!!listActive.includes(name)) {
                        featuresCollectionCopy['features'][idx - idx_negative]["properties"]["active"] = true;
                    }

                    // delete inactive communes from geoJson
                    else {
                        featuresCollectionCopy['features'].splice(idx - idx_negative, 1)
                        idx_negative += 1
                    }
                }
            )

            // add geoJson filtered to Redux store
            dispatch(setCommunesGeoJson(featuresCollectionCopy))
        }

        if (!!communesGeoJsonRaw) {
            addActive()
        }

    }, [communesGeoJsonRaw])

    const isMarkerInsideActivePolygon = latLngCoordinates => {

        let ret = false
        communesGeoJson.features.forEach(commune => {

            commune.geometry.coordinates.forEach(subArea => {

                let polyPoints = subArea[0]
                if (isMarkerInsidePolygon(latLngCoordinates, polyPoints)) {
                    ret = true
                }
            })

        })
        return ret
    }

    const fetchFeatureSelection = () => {

        const request = urlServer + `/api/area/`

        axios.get(request, {withCredentials: true})
            .then(result => {
                const data = result.data
                const features = data.map(row => row.boundary)
                const featuresCollection = {"type": "FeatureCollection", "features": features}
                setCommunesGeoJsonRaw(featuresCollection)
                localforage.setItem('communesGeoJson', featuresCollection)
                setIsLoaded(true)
            })
    }

    return {communesGeoJson, fetchFeatureSelection, isMarkerInsideActivePolygon, isLoaded}
}


const isMarkerInsidePolygon = (latLngCoordinates, polyPoints) => {

    var x = latLngCoordinates.lat, y = latLngCoordinates.lng;

    var inside = false;
    for (var i = 0, j = 1; i < polyPoints.length - 1; i++) {
        j = i + 1
        var xi = Number(polyPoints[i][1]), yi = Number(polyPoints[i][0]);
        var xj = Number(polyPoints[j][1]), yj = Number(polyPoints[j][0]);
        // console.log((yi > y))

        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    console.log(inside)
    return inside;
};
