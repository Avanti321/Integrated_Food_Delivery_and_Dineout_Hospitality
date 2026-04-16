import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

// ✅ Receives onLogout from App.jsx
const Navbar = ({ onLogout }) => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt='FoodRush' />
        <div className='navbar-right'>
            <img className='profile' src={assets.profile_image} alt='Admin' />
            {/* ✅ Logout button clears token and returns to login screen */}
            <button className='logout-btn' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default Navbar