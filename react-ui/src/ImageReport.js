import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {urlServer} from "./def/Definitions";

const ImageReport = ({reportId}) => {

    const [urlImage, setUrlImage] = useState(null)

    const setUrlImageRequest = useCallback(async () => {

        if (!!reportId) {
            const responseReport = await axios.get(urlServer + `/api/report/${reportId}/`, {withCredentials: true})
                .catch(error => console.error)

            if (!!responseReport?.data?.image) {
                // debugger

                const responseUriImage = await axios.get(responseReport.data.image, {withCredentials: true})
                setUrlImage(responseUriImage.data.image)
            }
        }


    }, [reportId])

    useEffect(() => {
        setUrlImageRequest()
    }, [setUrlImageRequest])

    return (
        urlImage &&
        <div className="text-center">
            <img className="image-report" src={urlImage} alt="Uploaded"/>
        </div>
    )
}

export default ImageReport