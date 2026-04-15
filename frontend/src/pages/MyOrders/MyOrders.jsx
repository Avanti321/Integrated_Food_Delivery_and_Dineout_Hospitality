import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const MyOrders = () => {

    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                url + "/api/order/userorders",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders(); // fetch immediately on load

            // ✅ FIX: Auto-refresh every 10 seconds to get latest status from DB
            const interval = setInterval(() => {
                fetchOrders();
            }, 10000);

            return () => clearInterval(interval); // cleanup on unmount
        }
    }, [token]);

    const handleTrackOrder = (orderId) => {
        // ✅ FIX: was `₹{orderId}` (broken) — now correctly uses ${orderId}
        navigate(`/tracking?orderId=${orderId}`);
    }

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {orders.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt='' />
                        <p>
                            {order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                } else {
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}
                        </p>
                        <p>₹{order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={() => handleTrackOrder(order._id)}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders