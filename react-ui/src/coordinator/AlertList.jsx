const AlertList = ({ alerts, markAsRead }) => {
    if (!alerts.length) {
        return <p className="text-muted">Aucune alerte.</p>;
    }

    return (
        <div className="list-group">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`list-group-item d-flex justify-content-between align-items-center 
                        ${!alert.is_read ? 'list-group-item-warning' : ''}`}
                >
                    <div>
                        <p className="mb-1">{alert.message}</p>
                        <small className="text-muted">
                            {new Date(alert.created_at).toLocaleString()}
                        </small>
                    </div>
                    {!alert.is_read && (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => markAsRead(alert.id)}
                        >
                            Marquer comme lu
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AlertList;