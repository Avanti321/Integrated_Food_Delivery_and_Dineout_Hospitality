import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./DeliveryDriver.css";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000");

const DeliveryDriver = () => {
    const orderId = new URLSearchParams(window.location.search).get("orderId");

    const [status, setStatus]   = useState("Starting...");
    const [tracking, setTracking] = useState(false);
    const [coords, setCoords]   = useState(null);
    const [error, setError]     = useState("");
    const watchIdRef            = useRef(null);

    // ✅ AUTO-START: immediately begins sharing location when page loads
    // Driver just opens the link — no button tap needed
    useEffect(() => {
        if (!orderId) {
            setError("No Order ID in URL. Please open the link sent by admin.");
            return;
        }

        if (!navigator.geolocation) {
            setError("Your browser does not support GPS location.");
            return;
        }

        setStatus("Getting your location...");

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude: lat, longitude: lng, accuracy } = position.coords;

                // Send live location to customer's tracking page via socket
                socket.emit("sendLocation", { orderId, lat, lng });

                setCoords({ lat, lng, accuracy: Math.round(accuracy) });
                setTracking(true);
                setStatus("✅ Sharing location live");
            },
            (err) => {
                setError(`GPS error: ${err.message}. Please allow location access.`);
                setTracking(false);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 3000,
                timeout: 10000
            }
        );

        // Stop sharing when driver closes/leaves the page
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [orderId]);

    return (
        <div className="driver-page">
            <div className="driver-card">

                <div className="driver-icon">🚴</div>
                <h2>Delivery Driver</h2>

                {/* Order ID */}
                <div className="driver-order-box">
                    <span className="driver-order-label">Order ID</span>
                    <span className="driver-order-id">{orderId || "Not set"}</span>
                </div>

                {/* Status */}
                {!error ? (
                    <div className={`driver-status-box ${tracking ? "active" : "waiting"}`}>
                        <div className={`driver-status-dot ${tracking ? "green" : "orange"}`}></div>
                        <span>{status}</span>
                    </div>
                ) : (
                    <div className="driver-error-box">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Live coordinates */}
                {coords && (
                    <div className="driver-coords">
                        <div className="driver-coord-row">
                            <span>Latitude</span>
                            <strong>{coords.lat.toFixed(6)}</strong>
                        </div>
                        <div className="driver-coord-row">
                            <span>Longitude</span>
                            <strong>{coords.lng.toFixed(6)}</strong>
                        </div>
                        <div className="driver-coord-row">
                            <span>Accuracy</span>
                            <strong>±{coords.accuracy}m</strong>
                        </div>
                    </div>
                )}

                {/* Instruction */}
                {tracking && (
                    <p className="driver-instruction">
                        Keep this page open while delivering. Your location is updating automatically on the customer's map.
                    </p>
                )}

                {!orderId && (
                    <p className="driver-instruction error-text">
                        Ask admin to resend the WhatsApp delivery link with your Order ID.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DeliveryDriver;