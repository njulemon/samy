import {useEffect, useRef} from "react";
import L, {LatLng} from "leaflet";

let HereDot = L.divIcon({className: 'circle-here', iconSize: [20, 20]});

const MiniMap = ({lat, lng, zoom, id}) => {

    const map = useRef(null);

    // init
    useEffect(
        () => {

            if (!!id) {
                map.current = L.map('mini-map' + id, {attributionControl: false, zoomControl: false})


                map.current.setView([lat, lng], zoom);


                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map.current);

                L.marker(
                    new LatLng(lat, lng),
                    {icon: HereDot}
                )
                    .addTo(map.current);

            }


            return () => {
                map.current?.remove();
            }
        },
        [lat, lng, zoom, id]
    );

    return (
        <div className="mini-map-container">
            <div id={'mini-map' + id} className="mini-map">
            </div>
        </div>
    )
}

export default MiniMap