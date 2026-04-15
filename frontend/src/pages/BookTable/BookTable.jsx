import { useContext, useState, useEffect } from "react";
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

const BookTable = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [selectedCity,       setSelectedCity]       = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); // full object
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

    // ✅ Fetch menus for selected restaurant from backend
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
        if (!token) { toast.error("Please login to book a table"); return; }
        if (!selectedRestaurant) { toast.error("Please select a restaurant"); return; }

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

                    {/* ✅ Restaurant Menu Preview */}
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
                                                <img src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image} alt={item.name} />
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

                    {/* Step 3: Details */}
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
                    <div className="bt-row">
                        <div className="bt-field">
                            <label>Date *</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} min={today} required />
                        </div>
                        <div className="bt-field">
                            <label>Time *</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
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