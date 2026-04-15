import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import toast from "react-hot-toast";
import "./Booking.css";

const Booking = () => {
    const { url, token } = useContext(StoreContext);
    const [bookings, setBookings]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [cancelling, setCancelling] = useState(null);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get(url + "/api/bookings/my-bookings", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setBookings(data.bookings);
        } catch (err) { console.log(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchBookings(); }, [token]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Cancel this booking?")) return;
        setCancelling(bookingId);
        try {
            const { data } = await axios.put(
                url + `/api/bookings/cancel/${bookingId}`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success("Booking cancelled");
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "Cancelled" } : b));
            } else { toast.error(data.message); }
        } catch { toast.error("Something went wrong"); }
        finally { setCancelling(null); }
    };

    const badgeClass = (s) => ({
        "Pending":   "bs-pending",
        "Approved":  "bs-approved",
        "Cancelled": "bs-cancelled",
        "Completed": "bs-completed",
    }[s] || "bs-pending");

    return (
        <div className="mybooking-page">
            <div className="mybooking-header">
                <h2>My Bookings</h2>
                <p>All your restaurant table reservations</p>
            </div>

            {loading ? (
                <div className="mybooking-empty">Loading…</div>
            ) : bookings.length === 0 ? (
                <div className="mybooking-empty">
                    <p>No bookings yet.</p>
                    <p className="mybooking-hint">Use Book Table in the menu to reserve a table.</p>
                </div>
            ) : (
                <div className="mybooking-list">
                    {bookings.map(b => (
                        <div key={b._id} className={`mybooking-card ${b.status === "Cancelled" ? "card-cancelled" : ""} ${b.status === "Completed" ? "card-completed" : ""}`}>
                            <div className="mybooking-top">
                                <div className="mybooking-restaurant">🍽️ {b.restaurant || "FoodRush Restaurant"}</div>
                                <span className={`mybooking-badge ${badgeClass(b.status)}`}>{b.status}</span>
                            </div>
                            <div className="mybooking-grid">
                                <div className="mybooking-field"><span className="mf-label">Name</span><span>{b.name}</span></div>
                                <div className="mybooking-field"><span className="mf-label">Phone</span><span>{b.phone}</span></div>
                                <div className="mybooking-field"><span className="mf-label">Date</span>
                                    <span>{new Date(b.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                </div>
                                <div className="mybooking-field"><span className="mf-label">Time</span><span>{b.time}</span></div>
                                <div className="mybooking-field"><span className="mf-label">Guests</span><span>{b.numberOfPeople} people</span></div>
                                <div className="mybooking-field"><span className="mf-label">Booked on</span>
                                    <span>{new Date(b.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                            {b.note && <div className="mybooking-note">📝 {b.note}</div>}
                            {b.status === "Completed" && (
                                <div className="mybooking-completed-msg">Your reservation time has passed. We hope you enjoyed your visit! 🎉</div>
                            )}
                            {(b.status === "Pending" || b.status === "Approved") && (
                                <button className="mybooking-cancel-btn" onClick={() => handleCancel(b._id)} disabled={cancelling === b._id}>
                                    {cancelling === b._id ? "Cancelling…" : "Cancel Booking"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Booking;