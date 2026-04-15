import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./MenuPage.css";

const MenuPage = () => {
    const { url, addToCart } = useContext(StoreContext);

    const [menus, setMenus]           = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("All");
    const [selectedCategory, setSelectedCategory]     = useState("All");
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const res = await axios.get(url + "/api/menu/list");
            if (res.data.success) {
                const data = res.data.data;
                setMenus(data);

                // Build unique restaurant list
                const uniqueRestaurants = [...new Set(data.map(m => m.restaurantName))];
                setRestaurants(uniqueRestaurants);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter by restaurant and category
    const filtered = menus.filter(item => {
        const byRestaurant = selectedRestaurant === "All" || item.restaurantName === selectedRestaurant;
        const byCategory   = selectedCategory   === "All" || item.category      === selectedCategory;
        return byRestaurant && byCategory;
    });

    const categories = ["All", ...new Set(menus.map(m => m.category))];

    return (
        <div className="menupage">
            <div className="menupage-hero">
                <h1>🍽️ Restaurant Menus</h1>
                <p>Browse dishes from your favourite restaurants</p>
            </div>

            {/* Filters */}
            <div className="menupage-filters">
                <div className="menupage-filter-group">
                    <label>Restaurant</label>
                    <select
                        value={selectedRestaurant}
                        onChange={e => { setSelectedRestaurant(e.target.value); setSelectedCategory("All"); }}
                    >
                        <option value="All">All Restaurants</option>
                        {restaurants.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="menupage-filter-group">
                    <label>Category</label>
                    <div className="menupage-category-pills">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`menupage-pill ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu items */}
            {loading ? (
                <div className="menupage-loading">Loading menus…</div>
            ) : filtered.length === 0 ? (
                <div className="menupage-empty">
                    <p>No menu items found.</p>
                    <p className="menupage-empty-hint">Admin can add menu items from the admin panel.</p>
                </div>
            ) : (
                <div className="menupage-grid">
                    {filtered.map(item => (
                        <div key={item._id} className="menupage-card">
                            {item.image && (
                                <img
                                    src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image}
                                    alt={item.name}
                                    className="menupage-card-img"
                                />
                            )}
                            <div className="menupage-card-body">
                                <span className="menupage-card-cat">{item.category}</span>
                                <h3 className="menupage-card-name">{item.name}</h3>
                                {item.description && (
                                    <p className="menupage-card-desc">{item.description}</p>
                                )}
                                <div className="menupage-card-footer">
                                    <span className="menupage-card-price">₹{item.price}</span>
                                    <button
                                        className="menupage-card-btn"
                                        onClick={() => addToCart(item._id)}
                                        disabled={!item.available}
                                    >
                                        {item.available ? "Add to Cart" : "Unavailable"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;