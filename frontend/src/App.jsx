import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer.jsx'
import LoginPopup from './components/LoginPopup/LoginPopup.jsx'
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'
import Booking from './pages/Booking/Booking.jsx'
import BookTable from './pages/BookTable/BookTable.jsx'
import Tracking from './pages/Tracking/Tracking.jsx'
import Chat from './pages/Chat/Chat.jsx'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx'
import Restaurant from './pages/Restaurant/Restaurant.jsx'
import DeliveryDriver from './pages/DeliveryDriver/DeliveryDriver.jsx'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {/* ✅ FIX: was getShowLogin={setShowLogin} — wrong prop name
          LoginPopup uses setShowLogin internally, so prop must be setShowLogin */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/driver" element={<DeliveryDriver />} />
          <Route path="/restaurant" element={<Restaurant />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App