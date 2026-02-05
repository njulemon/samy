import { useEffect, useState } from "react";
import axios from "axios";
import { urlServer } from "../def/Definitions.js";
import { PatchCsrf } from "../api/csrf.js";  // ← adapte le chemin selon ton projet

export const useAlerts = ({ mode = "startup", interval = 30 } = {}) => {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchAlerts = () => {
        axios.get(urlServer + '/api/alerts/', {
            withCredentials: true
        })
            .then(response => {
                setAlerts(response.data);
                setUnreadCount(response.data.filter(a => !a.is_read).length);
            })
            .catch(error => console.log(error));
    };

    const markAsRead = (alertId) => {
        PatchCsrf(urlServer + `/api/alerts/${alertId}/`, { is_read: true })
            .then(() => fetchAlerts())
            .catch(error => console.log(error));
    };

    useEffect(() => {
        fetchAlerts();

        if (mode === "polling") {
            const id = setInterval(fetchAlerts, interval * 1000);
            return () => clearInterval(id);
        }
    }, [mode, interval]);

    return { alerts, unreadCount, markAsRead, fetchAlerts };
};