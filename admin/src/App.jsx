import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import DeliveryBoys from './pages/DeliveryBoys/DeliveryBoys'
import Menus from './pages/Menus/Menus'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
    const url = "http://localhost:4000"

    // ✅ Check if admin token already exists (so refresh doesn't log you out)
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

    const handleLogin = (newToken) => {
        setToken(newToken)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        setToken('')
    }

    // ✅ If no token, show Login page — the entire admin panel is gated
    if (!token) {
        return (
            <>
                <ToastContainer />
                <Login url={url} onLogin={handleLogin} />
            </>
        )
    }

    return (
        <div>
            <ToastContainer />
            {/* ✅ Pass token + logout handler to Navbar */}
            <Navbar onLogout={handleLogout} />
            <hr />
            <div className="app-content">
                <Sidebar />
                <Routes>
                    <Route path='/add'           element={<Add url={url} token={token} />} />
                    <Route path='/list'          element={<List url={url} token={token} />} />
                    <Route path='/orders'        element={<Orders url={url} token={token} />} />
                    <Route path='/delivery-boys' element={<DeliveryBoys url={url} token={token} />} />
                    <Route path='/menus'         element={<Menus url={url} token={token} />} />
                    {/* Default redirect */}
                    <Route path='*' element={<Navigate to='/orders' />} />
                </Routes>
            </div>
        </div>
    )
}

export default App