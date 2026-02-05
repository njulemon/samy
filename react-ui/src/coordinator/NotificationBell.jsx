import { useState, useRef, useEffect } from "react";
import AlertList from "./AlertList.jsx";

const NotificationBell = ({ alerts, unreadCount, markAsRead }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Fermer le modal au clic extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                className="btn btn-link position-relative"
                onClick={() => setOpen(!open)}
                aria-label="Notifications"
            >
                <i className="bi bi-bell" style={{ fontSize: "1.4rem" }}></i>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="card shadow"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        width: "380px",
                        maxHeight: "480px",
                        overflowY: "auto",
                        zIndex: 1050,
                    }}
                >
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>Notifications</strong>
                        {unreadCount > 0 && (
                            <span className="badge bg-primary">{unreadCount} non lue(s)</span>
                        )}
                    </div>
                    <div className="card-body p-0">
                        <AlertList alerts={alerts} markAsRead={markAsRead} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;