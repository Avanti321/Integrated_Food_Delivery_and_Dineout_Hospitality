import React, { useState, useEffect } from 'react'
import './Orders.css'
import { toast } from 'react-toastify'
import axios from "axios"
import { assets } from '../../assets/assets'

const FRONTEND_URL = "http://localhost:5174"

const Orders = ({ url }) => {

    const [orders, setOrders]           = useState([])
    const [deliveryBoys, setDeliveryBoys] = useState([])

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get(url + "/api/order/list")
            if (res.data.success) setOrders(res.data.data)
            else toast.error("Error fetching orders")
        } catch { toast.error("Server error") }
    }

    const fetchDeliveryBoys = async () => {
        try {
            const res = await axios.get(url + "/api/deliveryboy/list")
            if (res.data.success) setDeliveryBoys(res.data.data)
        } catch { console.log("Could not fetch delivery boys") }
    }

    useEffect(() => {
        fetchAllOrders()
        fetchDeliveryBoys()
    }, [])

    // ── Assign delivery boy to order ──────────────────────────────────────────
    // This auto-opens WhatsApp with the driver link — no waiting, no manual steps
    const handleAssign = async (orderId, deliveryBoyId) => {
        if (!deliveryBoyId) return

        try {
            const res = await axios.post(url + "/api/deliveryboy/assign", {
                orderId,
                deliveryBoyId
            })

            if (res.data.success) {
                const boy       = deliveryBoys.find(b => b._id === deliveryBoyId)
                const order     = orders.find(o => o._id === orderId)
                const driverUrl = `${FRONTEND_URL}/driver?orderId=${orderId}`

                const customerName  = order?.address
                    ? `${order.address.firstName || ""} ${order.address.lastName || ""}`.trim()
                    : "Customer"
                const itemsSummary  = order?.items?.map(i => `${i.name} x${i.quantity}`).join(", ") || ""

                // ✅ Auto open WhatsApp — driver just opens the link, location starts instantly
                const message = encodeURIComponent(
                    `🚴 *Delivery Assigned to You!*\n\n` +
                    `📦 Order ID: ${orderId}\n` +
                    `👤 Customer: ${customerName}\n` +
                    `📍 Address: ${order?.address?.street || ""}, ${order?.address?.city || ""}\n` +
                    `🛒 Items: ${itemsSummary}\n` +
                    `💰 Amount: ₹${order?.amount}\n\n` +
                    `👇 Open this link — your location will start sharing automatically:\n` +
                    `${driverUrl}`
                )

                window.open(`https://wa.me/?text=${message}`, "_blank")

                toast.success(`✅ ${boy?.name} assigned! WhatsApp opened — send to driver.`)
                await fetchAllOrders()
                await fetchDeliveryBoys()
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error("Assignment failed")
        }
    }

    // ── Normal status update ──────────────────────────────────────────────────
    const statusHandler = async (event, orderId) => {
        const res = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        })
        if (res.data.success) await fetchAllOrders()
    }

    return (
        <div className='order-add'>
            <h3>Order Management</h3>
            <div className='order-list'>
                {orders.map((order, index) => (
                    <div key={index} className='order-item'>

                        <img src={assets.parcel_icon} alt="" />

                        {/* Order details */}
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, i) =>
                                    i === order.items.length - 1
                                        ? `${item.name} x${item.quantity}`
                                        : `${item.name} x${item.quantity}, `
                                )}
                            </p>
                            <p className='order-item-name'>
                                {order.address?.firstName} {order.address?.lastName}
                            </p>
                            <div className="order-item-address">
                                <span>{order.address?.street}, </span>
                                <span>{order.address?.city}, {order.address?.state}</span>
                            </div>
                            <p className='order-item-phone'>{order.address?.phone}</p>
                        </div>

                        {/* Amount + payment */}
                        <div className="order-meta">
                            <p>₹{order.amount}</p>
                            <span className={`pay-badge ${order.payment ? "paid" : "unpaid"}`}>
                                {order.payment ? "✅ Paid" : "⏳ Unpaid"}
                            </span>
                            <p className="order-items-count">Items: {order.items.length}</p>
                        </div>

                        {/* Status dropdown */}
                        <select
                            onChange={(e) => statusHandler(e, order._id)}
                            value={order.status}
                            className="order-status-select"
                        >
                            <option value="Food Processing">Food Processing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>

                        {/* ✅ Delivery boy assignment */}
                        <div className="assign-section">
                            {order.deliveryBoy ? (
                                <div className="assigned-badge">
                                    🚴 {deliveryBoys.find(b => b._id === order.deliveryBoy)?.name || "Assigned"}
                                </div>
                            ) : (
                                <div className="assign-row">
                                    <select
                                        className="assign-select"
                                        defaultValue=""
                                        onChange={(e) => handleAssign(order._id, e.target.value)}
                                    >
                                        <option value="" disabled>Assign driver</option>
                                        {deliveryBoys
                                            .filter(b => b.isAvailable && b.isActive)
                                            .map(b => (
                                                <option key={b._id} value={b._id}>
                                                    {b.name} — {b.phone}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders