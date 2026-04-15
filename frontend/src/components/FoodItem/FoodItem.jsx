import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ id, name, price, description, image }) => {

    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    const itemCount = cartItems[id] || 0;

    // ✅ image could be a URL string (from DB) or an imported file (from assets)
    const imageSrc = typeof image === 'string' && !image.startsWith('http') && !image.startsWith('/')
    ? `${url}/images/${image}`
    : image;
    
    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={imageSrc} alt={name} />

                {!itemCount ? (
                    <img
                        className='add'
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt='add'
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img
                            onClick={() => removeFromCart(id)}
                            src={assets.remove_icon_red}
                            alt='remove'
                        />
                        <p>{itemCount}</p>
                        <img
                            onClick={() => addToCart(id)}
                            src={assets.add_icon_green}
                            alt='add'
                        />
                    </div>
                )}
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_stars} alt='rating' /> {/* ✅ typo fixed */}
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem