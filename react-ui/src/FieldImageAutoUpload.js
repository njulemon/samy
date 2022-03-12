import {useState} from "react";
import {deleteImage, postImage} from "./api/PostImage";
import {makeid} from "./Tools/KeyGenerator";
import {urlMedia} from "./def/Definitions";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from "@fortawesome/free-solid-svg-icons";


function FieldImageAutoUpload({pk, setPk}) {

    const [errorForm, setErrorForm] = useState('')
    const [imageName, setImageName] = useState(null)

    const handleFileUpload = (event) => {

        let file = event.target.files[0];

        // Update the formData object
        const file_name = makeid(20) + '.' + file.name.split('.')[(file.name.split('.')).length - 1]

        let formData = new FormData();
        formData.set('image', file, file_name);

        console.log(formData.get('image'))

        postImage(formData)
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    setPk(response.data.id)
                    console.log(response.data)
                    setImageName(file_name)
                }
            })
            .catch((error => {
                setErrorForm(error.data)
            }))
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

    return (
        <>
            {pk !== null ?
                <div className="mb-3 image-report-cross-absolute">
                    <img className="image-uploaded" src={urlMedia + imageName} alt="Uploaded"/>
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