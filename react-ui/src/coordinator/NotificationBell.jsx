import { useState, useRef, useEffect } from "react";
import AlertList from "./AlertList.jsx";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationBell = ({ alerts, unreadCount, markAsRead }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

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


        <IconButton onClick={() => setOpen(!open)} aria-label="Notifications">
            <Badge badgeContent={unreadCount} color="error" max={99}>
                <NotificationsIcon />
            </Badge>
        </IconButton>

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