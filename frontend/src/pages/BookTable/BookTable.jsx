import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./BookTable.css";

const CITIES = ["Mumbai", "Pune", "Nashik", "Delhi", "Bangalore", "Hyderabad"];

const RESTAURANTS = [
    { id: 1,  city: "Mumbai",    name: "Trishna",               address: "Sai Baba Marg, Fort, Mumbai" },
    { id: 2,  city: "Mumbai",    name: "Khyber",                address: "Fort, Mumbai" },
    { id: 3,  city: "Mumbai",    name: "The Table",             address: "Colaba, Mumbai" },
    { id: 4,  city: "Mumbai",    name: "Bombay Canteen",        address: "Lower Parel, Mumbai" },
    { id: 5,  city: "Mumbai",    name: "Bade Miyan",            address: "Colaba, Mumbai" },
    { id: 6,  city: "Pune",      name: "Malaka Spice",          address: "Koregaon Park, Pune" },
    { id: 7,  city: "Pune",      name: "Vaishali",              address: "FC Road, Pune" },
    { id: 8,  city: "Pune",      name: "Cafe Goodluck",         address: "Deccan, Pune" },
    { id: 9,  city: "Pune",      name: "Shabree",               address: "Shivajinagar, Pune" },
    { id: 10, city: "Nashik",    name: "FoodRush - MG Road",    address: "MG Road, Nashik" },
    { id: 11, city: "Nashik",    name: "FoodRush - College Rd", address: "College Road, Nashik" },
    { id: 12, city: "Nashik",    name: "Tandoor Restaurant",    address: "Sharanpur Road, Nashik" },
    { id: 13, city: "Nashik",    name: "Rajmahal",              address: "Old Agra Road, Nashik" },
    { id: 14, city: "Nashik",    name: "Hotel Panchavati",      address: "Panchavati, Nashik" },
    { id: 15, city: "Delhi",     name: "Bukhara - ITC Maurya",  address: "Sardar Patel Marg, Delhi" },
    { id: 16, city: "Delhi",     name: "Indian Accent",         address: "Lodhi Road, New Delhi" },
    { id: 17, city: "Delhi",     name: "Karim's",               address: "Jama Masjid, Old Delhi" },
    { id: 18, city: "Delhi",     name: "Moti Mahal",            address: "Daryaganj, Delhi" },
    { id: 19, city: "Bangalore", name: "Toit Brewpub",          address: "Indiranagar, Bangalore" },
    { id: 20, city: "Bangalore", name: "MTR Restaurant",        address: "Lalbagh Road, Bangalore" },
    { id: 21, city: "Bangalore", name: "Vidyarthi Bhavan",      address: "Gandhi Bazaar, Bangalore" },
    { id: 22, city: "Hyderabad", name: "Paradise Biryani",      address: "SD Road, Secunderabad" },
    { id: 23, city: "Hyderabad", name: "Bawarchi",              address: "RTC X Roads, Hyderabad" },
    { id: 24, city: "Hyderabad", name: "Shah Ghouse Cafe",      address: "Tolichowki, Hyderabad" },
];

// ✅ Booking time window: 10:00 AM to 11:00 PM
const MIN_TIME = "10:00"; // 10:00 AM
const MAX_TIME = "23:00"; // 11:00 PM

const BookTable = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [selectedCity,       setSelectedCity]       = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurantMenus,    setRestaurantMenus]    = useState([]);
    const [loadingMenus,       setLoadingMenus]       = useState(false);

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "",
        numberOfPeople: "", date: "", time: "", note: "",
    });

    const today = new Date().toISOString().split("T")[0];

    const filteredRestaurants = selectedCity
        ? RESTAURANTS.filter(r => r.city === selectedCity)
        : RESTAURANTS;

    const fetchRestaurantMenus = async (restaurantName) => {
        setLoadingMenus(true);
        try {
            const res = await axios.get(url + `/api/menu/list?restaurant=${encodeURIComponent(restaurantName)}`);
            if (res.data.success) setRestaurantMenus(res.data.data);
            else setRestaurantMenus([]);
        } catch {
            setRestaurantMenus([]);
        } finally {
            setLoadingMenus(false);
        }
    };

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setRestaurantMenus([]);
        fetchRestaurantMenus(restaurant.name);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ CHECK 1: Must be logged in
        if (!token) {
            toast.error("Please login first to book a table!", {
                duration: 3000,
                icon: "🔒",
            });
            return;
        }

        // ✅ CHECK 2: Must select a restaurant
        if (!selectedRestaurant) {
            toast.error("Please select a restaurant");
            return;
        }

        // ✅ CHECK 3: Time must be between 10:00 AM and 11:00 PM
        if (formData.time) {
            const [hours, minutes] = formData.time.split(":").map(Number);
            const totalMinutes = hours * 60 + minutes;
            const minMinutes = 10 * 60;       // 10:00 AM = 600 mins
            const maxMinutes = 23 * 60;       // 11:00 PM = 1380 mins

            if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
                toast.error("Booking time must be between 10:00 AM and 11:00 PM", {
                    duration: 4000,
                    icon: "⏰",
                });
                return;
            }
        }

        try {
            const { data } = await axios.post(
                url + "/api/bookings/create",
                { ...formData, restaurant: selectedRestaurant.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success("🎉 Table booked successfully!");
                navigate("/booking");
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="booktable-page">
            <div className="booktable-container">
                <div className="booktable-header">
                    <h2>🍽️ Book a Table</h2>
                    <p>Choose a restaurant and reserve your table instantly.</p>
                </div>

                <div className="booktable-form">

                    {/* ✅ NEW: Login warning banner shown when user is not logged in */}
                    {!token && (
                        <div className="bt-login-warning">
                            🔒 You must be <strong>signed in</strong> to book a table. Please login first.
                        </div>
                    )}

                    {/* Step 1: City */}
                    <p className="bt-section">Step 1 — Select City</p>
                    <select
                        value={selectedCity}
                        onChange={e => { setSelectedCity(e.target.value); setSelectedRestaurant(null); setRestaurantMenus([]); }}
                        className="bt-select"
                    >
                        <option value="">All Cities</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* Step 2: Restaurant */}
                    <p className="bt-section">Step 2 — Select Restaurant</p>
                    <select
                        size={5}
                        className="bt-select bt-select-list"
                        onChange={e => {
                            const r = RESTAURANTS.find(r => r.id === parseInt(e.target.value));
                            if (r) handleRestaurantSelect(r);
                        }}
                        value={selectedRestaurant?.id || ""}
                    >
                        {filteredRestaurants.map(r => (
                            <option key={r.id} value={r.id}>{r.name} — {r.city}</option>
                        ))}
                    </select>

                    {/* Selected restaurant confirmation */}
                    {selectedRestaurant && (
                        <div className="bt-selected">
                            <span className="bt-selected-tick">✅</span>
                            <div>
                                <strong>{selectedRestaurant.name}</strong>
                                <p>📍 {selectedRestaurant.address}</p>
                            </div>
                        </div>
                    )}

                    {/* Restaurant Menu Preview */}
                    {selectedRestaurant && (
                        <div className="bt-menu-section">
                            <p className="bt-section">Menu at {selectedRestaurant.name}</p>
                            {loadingMenus ? (
                                <p className="bt-menu-loading">Loading menu…</p>
                            ) : restaurantMenus.length === 0 ? (
                                <p className="bt-menu-empty">No menu items added yet for this restaurant.</p>
                            ) : (
                                <div className="bt-menu-grid">
                                    {restaurantMenus.map(item => (
                                        <div key={item._id} className="bt-menu-card">
                                            {item.image && (
                                                <img
                                                    src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image}
                                                    alt={item.name}
                                                />
                                            )}
                                            <div className="bt-menu-info">
                                                <span className="bt-menu-cat">{item.category}</span>
                                                <p className="bt-menu-name">{item.name}</p>
                                                <p className="bt-menu-price">₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Personal Details */}
                    <p className="bt-section">Step 3 — Your Details</p>
                    <div className="bt-row">
                        <div className="bt-field">
                            <label>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                        </div>
                        <div className="bt-field">
                            <label>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                        </div>
                    </div>
                    <div className="bt-row">
                        <div className="bt-field">
                            <label>Phone *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                        </div>
                        <div className="bt-field">
                            <label>Number of Guests *</label>
                            <input type="number" name="numberOfPeople" value={formData.numberOfPeople} onChange={handleChange} placeholder="e.g. 4" min="1" max="20" required />
                        </div>
                    </div>

                    {/* Step 4: Date & Time */}
                    <p className="bt-section">Step 4 — Date &amp; Time</p>

                    {/* ✅ NEW: Timing info banner */}
                    <div className="bt-time-info">
                        ⏰ Bookings are only available between <strong>10:00 AM</strong> and <strong>11:00 PM</strong>
                    </div>

                    <div className="bt-row">
                        <div className="bt-field">
                            <label>Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>
                        <div className="bt-field">
                            {/* ✅ Time input restricted to 10:00 AM – 11:00 PM */}
                            <label>Time * <span className="bt-opt">(10:00 AM – 11:00 PM)</span></label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                min={MIN_TIME}
                                max={MAX_TIME}
                                required
                            />
                        </div>
                    </div>

                    <div className="bt-field">
                        <label>Special Requests <span className="bt-opt">(optional)</span></label>
                        <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Anniversary, allergies, high chair…" rows="3" />
                    </div>

                    <button type="button" onClick={handleSubmit} className="bt-btn">Confirm Booking</button>
                </div>
            </div>
        </div>
    );
};

export default BookTable;