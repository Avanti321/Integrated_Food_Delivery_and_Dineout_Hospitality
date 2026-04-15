import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // ✅ Load token first
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    // ✅ Set axios header globally
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    const addToCart = async (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        try {
            await axios.post(url + "/api/cart/add", { itemId });
        } catch (error) {
            console.error("Add to cart failed:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems(prev => {
            const updated = { ...prev };
            if (!updated[itemId]) return prev;

            updated[itemId] -= 1;
            if (updated[itemId] === 0) delete updated[itemId];

            return updated;
        });

        try {
            await axios.post(url + "/api/cart/remove", { itemId });
        } catch (error) {
            console.error("Remove failed:", error);
        }
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            let itemInfo = food_list.find(p => p._id === item);
            if (itemInfo) {
                total += itemInfo.price * cartItems[item];
            }
        }
        return total;
    };

    const fetchFoodList = async () => {
        const res = await axios.get(url + "/api/food/list");
        if (res.data.success) {
            setFoodList(res.data.data);
        }
    };

    const loadCartData = async () => {
        try {
            const res = await axios.post(url + "/api/cart/get");

            if (res.data.success) {
                setCartItems(res.data.cartData);
            }

        } catch (error) {
            console.error("Cart load failed:", error);

            // ✅ Auto logout if token invalid
            setToken("");
        }
    };

    // ✅ First load food only
    useEffect(() => {
        fetchFoodList();
    }, []);

    // ✅ Load cart AFTER token is set
    useEffect(() => {
        if (token) {
            loadCartData();
        }
    }, [token]);

    return (
        <StoreContext.Provider value={{
            food_list,
            cartItems,
            addToCart,
            removeFromCart,
            getTotalCartAmount,
            url,
            token,
            setToken
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;