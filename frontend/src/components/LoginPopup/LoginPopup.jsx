import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContext)
    const navigate = useNavigate()

    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({ name: "", email: "", password: "" })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()

        let newUrl = url
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data)

        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            setShowLogin(false)           // ✅ close the popup
            navigate("/")                 // ✅ redirect to home page
        } else {
            alert(response.data.message)
        }
    }

    // ✅ FIX: X button calls setShowLogin(false) — works because App.jsx
    // now correctly passes setShowLogin (not getShowLogin) as the prop
    const handleClose = () => {
        setShowLogin(false)
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    {/* ✅ X button now correctly closes the popup */}
                    <img
                        onClick={handleClose}
                        src={assets.cross_icon}
                        alt='close'
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="login-popup-inputs">
                    {currState === "Login"
                        ? null
                        : <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your name' required />
                    }
                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required />
                </div>

                <button type='submit'>
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>

                <div className='login-popup-condition'>
                    <input type='checkbox' required />
                    <p>By continuing, I agree to the terms of use &amp; privacy policy.</p>
                </div>

                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup