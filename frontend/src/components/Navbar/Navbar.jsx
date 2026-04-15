import React, { useState, useContext } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home");
    const [showDropdown, setShowDropdown] = useState(false);

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
        setShowDropdown(false);
    }

    return (
        <div className='navbar'>
            <Link to='/'>
                <img src={assets.logo} alt="" className='logo'/>
            </Link>

            <ul className='navbar-menu'>
                <li className={menu === "home" ? "active" : ""}>
                    <Link to='/' onClick={() => setMenu("home")}>Home</Link>
                </li>
                <li className={menu === "menu" ? "active" : ""}>
                    <a href='#explore-menu' onClick={() => setMenu("menu")}>Menu</a>
                </li>
                {/* ✅ NEW: Book Table link in navbar */}
                <li className={menu === "book-table" ? "active" : ""}>
                    <Link to='/book-table' onClick={() => setMenu("book-table")}>Book Table</Link>
                </li>
                <li className={menu === "mobile-app" ? "active" : ""}>
                    <a href='#app-download' onClick={() => setMenu("mobile-app")}>Mobile App</a>
                </li>
                <li className={menu === "contact-us" ? "active" : ""}>
                    <a href='#footer' onClick={() => setMenu("contact-us")}>Contact Us</a>
                </li>
            </ul>

            <div className="navbar-right">
                <img src={assets.search_icon} alt=""/>

                <div className="navbar-search-icon">
                    <Link to='/cart'>
                        <img src={assets.basket_icon} alt="" />
                    </Link>
                    {getTotalCartAmount() > 0 && <div className="dot"></div>}
                </div>

                {!token
                    ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                    : <div className='navbar-profile'>
                        <img
                            src={assets.profile_icon}
                            alt=""
                            onClick={() => setShowDropdown(prev => !prev)}
                        />
                        {showDropdown && (
                            <ul className='nav-profile-dropdown'>
                                <li onClick={() => { navigate('/myorders'); setShowDropdown(false); }}>
                                    <img src={assets.bag_icon} alt="" />
                                    <p>Orders</p>
                                </li>
                                <hr />
                                {/* ✅ NEW: My Bookings in profile dropdown */}
                                <li onClick={() => { navigate('/booking'); setShowDropdown(false); }}>
                                    <img src={assets.bag_icon} alt="" />
                                    <p>My Bookings</p>
                                </li>
                                <hr />
                                <li onClick={handleLogout}>
                                    <img src={assets.logout_icon} alt="" />
                                    <p>Logout</p>
                                </li>
                            </ul>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar