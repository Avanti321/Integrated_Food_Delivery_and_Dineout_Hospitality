import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {

    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url, setCartItems } = useContext(StoreContext)
    const navigate = useNavigate()

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId })
            if (response.data.success) {
                setCartItems({}) // clear cart on success
                // ✅ FIX: redirect to live tracking page with orderId
                navigate(`/tracking?orderId=${orderId}`)
            } else {
                navigate("/")
            }
        } catch (error) {
            console.error("Verify error:", error)
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className='verify'>
            <div className='spinner'></div>
        </div>
    )
}

export default Verify