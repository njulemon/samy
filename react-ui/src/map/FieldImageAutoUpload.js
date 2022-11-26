import {useEffect, useState} from "react";
import {deleteImage, getImage, postImage} from "../api/PostImage";
import {makeid} from "../Tools/KeyGenerator";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from "@fortawesome/free-solid-svg-icons";


function FieldImageAutoUpload({pk, setPk, setIsSubmitting, initPk=null}) {

    const [errorForm, setErrorForm] = useState('')
    const [imageName, setImageName] = useState(null)

    useEffect(() => {
        if (initPk) {
            getImage(initPk)
                .then((response => {
                    setPk(initPk)
                    setImageName(response.data.image)
                }))
        }
    }, [])

    const handleFileUpload = async (event) => {

        setIsSubmitting(true)

        let file = event.target.files[0];

        // Update the formData object
        const file_name = makeid(20) + '.jpg'

        let formData = new FormData();

        // resize image [Blob]
        const imageResized = await resizeImage(file, 720)

        formData.set('image', imageResized, file_name);

        console.log(formData.get('image'))

        postImage(formData)
            .then((response) => {
                setPk(response.data.id)
                console.log(response.data)
                setImageName(response.data.image)

            })
            .catch((error => {
                setErrorForm(error.data)
                setIsSubmitting(false)
            }))
            .finally(
                () => setIsSubmitting(false)
            )
    }

    const handleFileDelete = (event) => {

        deleteImage(pk)
            .then((response) => {
                setPk(null)
                setImageName('')
            })
            .catch((error => {
                setErrorForm(error.data)
            }))
    }

    const resizeImage = async (imageFile, max_px) => {

        return await createImageBitmap(imageFile)
            .then((img) => {  //img: [ImageBitmap] can be drawn on canvas
                const canvas_offscreen = document.createElement("canvas");
                // const canvas_offscreen = document.getElementById("off-screen-canvas");

                const originalWidth = img.width;
                const originalHeight = img.height;

                const maxLength = Math.max(originalWidth, originalHeight)

                const resizingFactor = max_px / maxLength

                const canvasWidth = originalWidth * resizingFactor
                const canvasHeight = originalHeight * resizingFactor

                canvas_offscreen.width = canvasWidth;
                canvas_offscreen.height = canvasHeight;

                const context = canvas_offscreen.getContext("2d");

                context.drawImage(
                    img,
                    0,
                    0,
                    originalWidth * resizingFactor,
                    originalHeight * resizingFactor
                )

                return new Promise(
                    (res, rej) => canvas_offscreen.toBlob(
                        (blob) => {
                            blob ? res(blob) : rej("error while converting canvas to Blob")
                        },
                        'image/jpeg',
                        0.7
                    )
                );

            })
    }

    return (
        <>
            {pk !== null ?
                <div className="mb-3 image-report-cross-absolute">
                    <img className="image-uploaded" src={imageName} alt="Uploaded"/>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="image-report-cross"
                        onClick={(event) => {
                            handleFileDelete(event)
                        }} fixedWidth/>
                </div>
                :
                <>
                    <div className="mb-3">
                        <input
                            id="image"
                            name="image"
                            onChange={(event) => {
                                handleFileUpload(event)
                            }}
                            className='form-control'
                            type="file"
                            placeholder="Uploader une photo"
                            accept="image/*"
                        />
                    </div>

                    {errorForm !== '' ?
                        (<div className="mb-3">
                            <div className="form-label is-invalid"></div>
                            <div className="invalid-feedback is-invalid">{errorForm}</div>
                        </div>)
                        :
                        null}
                </>
            }
        </>
    )
}

export default FieldImageAutoUpload