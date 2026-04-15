import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import io from "socket.io-client";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Tracking.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const bikeIcon = new L.Icon({
    iconUrl:     "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize:    [42, 42],
    iconAnchor:  [21, 42],
    popupAnchor: [0, -42],
});

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000");

const MapPanner = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, map.getZoom(), { animate: true, duration: 1 });
    }, [position]);
    return null;
};

// ✅ FIX: Status keys must exactly match what admin panel sends to the DB
// Admin sends: "Order Confirmed", "Food Processing", "Out for delivery", "Delivered"
const STATUS_STEPS = [
    { key: "Order Confirmed",  label: "Order Confirmed",  icon: "✅" },
    { key: "Food Processing",  label: "Preparing Food",   icon: "👨‍🍳" },
    { key: "Out for delivery", label: "Out for Delivery", icon: "🚴" },
    { key: "Delivered",        label: "Delivered",        icon: "🎉" },
];

const Tracking = () => {
    const [searchParams] = useSearchParams();
    const navigate       = useNavigate();
    const { url, token } = useContext(StoreContext);

    // ✅ FIX: orderId now correctly reads from URL because MyOrders.jsx was fixed
    const orderId = searchParams.get("orderId");

    const [position, setPosition]       = useState([19.9975, 73.7898]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [driverLive, setDriverLive]   = useState(false);
    const [order, setOrder]             = useState(null);

    // ✅ Fetch order details + auto-refresh every 10 seconds to reflect status changes
    useEffect(() => {
        if (!orderId || !token) return;

        const fetchOrder = async () => {
            try {
                const res = await axios.post(
                    url + "/api/order/userorders",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    const found = res.data.data.find(o => o._id === orderId);
                    if (found) setOrder(found);
                }
            } catch (e) { console.log(e); }
        };

        fetchOrder(); // fetch immediately on load

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [orderId, token]);

    // Socket for live driver location
    useEffect(() => {
        if (!orderId) return;
        socket.emit("joinOrderRoom", orderId);
        socket.on("connect",    () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));
        socket.on("receiveLocation", ({ lat, lng }) => {
            setPosition([lat, lng]);
            setLastUpdated(new Date().toLocaleTimeString());
            setDriverLive(true);
        });
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receiveLocation");
        };
    }, [orderId]);

    // If no orderId in URL (e.g. user navigated directly)
    if (!orderId) {
        return (
            <div className="tracking">
                <p className="tracking-error">
                    No order ID.{" "}
                    <span onClick={() => navigate("/myorders")} className="tracking-link">
                        Go to My Orders
                    </span>
                </p>
            </div>
        );
    }

    // Find which step is currently active based on order.status from DB
    const currentStep = order
        ? STATUS_STEPS.findIndex(s => s.key === order.status)
        : 0;

    return (
        <div className="tracking">

            {/* ── Header ── */}
            <div className="tracking-header">
                <h2>Order Tracking</h2>
                <p className="tracking-orderid">Order ID: {orderId}</p>
            </div>

            {/* ── Status timeline ── */}
            <div className="tracking-timeline">
                {STATUS_STEPS.map((step, i) => {
                    const done    = i <= currentStep;
                    const current = i === currentStep;
                    return (
                        <div key={step.key} className="tracking-step">
                            <div className={`tracking-step-icon ${done ? "done" : ""} ${current ? "current" : ""}`}>
                                {step.icon}
                            </div>
                            <div className={`tracking-step-label ${current ? "current-label" : ""}`}>
                                {step.label}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                                <div className={`tracking-step-line ${done ? "done" : ""}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Live indicator ── */}
            <div className="tracking-live-row">
                <span className={`tracking-dot ${isConnected ? "connected" : "disconnected"}`}>
                    ● {isConnected ? "Connected" : "Connecting..."}
                </span>
                {driverLive && lastUpdated && (
                    <span className="tracking-time">Driver live · Updated {lastUpdated}</span>
                )}
                {!driverLive && order?.status === "Out for delivery" && (
                    <span className="tracking-time">Waiting for driver GPS signal…</span>
                )}
            </div>

            {/* ── Leaflet Map ── */}
            <MapContainer
                center={position}
                zoom={15}
                className="tracking-map"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={bikeIcon}>
                    <Popup>
                        {driverLive ? "🚴 Your delivery partner is here!" : "📍 Default location"}
                    </Popup>
                </Marker>
                <MapPanner position={position} />
            </MapContainer>

            {/* ── Order summary ── */}
            {order && (
                <div className="tracking-summary">
                    <div className="tracking-summary-row">
                        <span>Items</span>
                        <span>{order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}</span>
                    </div>
                    <div className="tracking-summary-row">
                        <span>Total</span>
                        <span>₹{order.amount}</span>
                    </div>
                    <div className="tracking-summary-row">
                        <span>Payment</span>
                        <span className={order.payment ? "paid" : "unpaid"}>
                            {order.payment ? "✅ Paid" : "⏳ Pending"}
                        </span>
                    </div>
                    <div className="tracking-summary-row">
                        <span>Deliver to</span>
                        <span>{order.address?.street}, {order.address?.city}</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tracking;