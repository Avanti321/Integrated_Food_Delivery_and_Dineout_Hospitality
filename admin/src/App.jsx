import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import DeliveryBoys from './pages/DeliveryBoys/DeliveryBoys'
import Menus from './pages/Menus/Menus'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
    const url = "http://localhost:4000"
    return (
        <div>
            <ToastContainer />
            <Navbar />
            <hr />
            <div className="app-content">
                <Sidebar />
                <Routes>
                    <Route path='/add'           element={<Add url={url} />} />
                    <Route path='/list'          element={<List url={url} />} />
                    <Route path='/orders'        element={<Orders url={url} />} />
                    <Route path='/delivery-boys' element={<DeliveryBoys url={url} />} />
                    <Route path='/menus'         element={<Menus url={url} />} />
                </Routes>
            </div>
        </div>
    )
}

export default App