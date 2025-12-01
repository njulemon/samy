import {useEffect, useState} from "react";
import {PatchCsrf} from "../api/Csrf";
import {urlServer} from "../def/Definitions";
import axios from "axios";


const urlDocument = id => `${urlServer}/api/document/${id}/`

export const initialValue = [
    {
        type: 'paragraph',
        children: [
            {text: ''}
        ],
    }
]

const useSlateState = id => {


    const [hasChanged, setHasChanged] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [content, setContent_] = useState(initialValue)

    const setContent = content => {
        setHasChanged(true)
        setContent_(content)
    }

    const save = () => {
        setIsSaving(true)
        const data = {content: content}
        PatchCsrf(urlDocument(id), data)
            .then(() => {
                load()
                setHasChanged(false)
            })
            .then(() => setIsSaving(false))
            .catch(() => setIsSaving(false))
    }

    const load = () => {
        axios.get(urlDocument(id), {withCredentials: true})
            .then(
                response => {
                    console.log(response.data.content.length)
                    setContent_(response.data.content)
                    setHasChanged(false)
                })
            .catch(console.error)
    }

    useEffect(() => load(), [id])

    return {hasChanged, content: content, save, isSaving, load, setContent}
}

export default useSlateState