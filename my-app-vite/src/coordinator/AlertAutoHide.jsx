import {useEffect, useState} from "react";

const AlertAutoHide = ({children}) => {

    const [show, setShow] = useState(true)

    useEffect(() => setShow(true), [])

    return (
        <>
            {show &&
                (
                    <div className="alert alert-light alert-dismissible fade show w-100">
                        {children}
                        <button
                            type="button"
                            className="btn-close alert-button"
                            onClick={() => setShow(false)}
                            aria-label="Close">
                        </button>
                    </div>
                )
            }
        </>
    )
}

export default AlertAutoHide