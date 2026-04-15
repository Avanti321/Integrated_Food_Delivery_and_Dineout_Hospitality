import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);

    const navigate = useNavigate();

    return (
        <div className='cart'>

            <div className="cart-items">

                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>

                <br />
                <hr />

                {food_list.map((item) => {

                    const quantity = cartItems[item._id] || 0;

                    if (quantity > 0) {
                        return (
                            <div key={item._id}>
                                <div className='cart-items-title cart-items-item'>
                                    <img src={url + "/images/" + item.image} alt='' />
                                    <p>{item.name}</p>
                                    <p>₹{item.price}</p>
                                    <p>{quantity}</p>
                                    <p>₹{item.price * quantity}</p>
                                    <p
                                        onClick={() => removeFromCart(item._id)}
                                        className='cross'
                                    >
                                        ❌
                                    </p>
                                </div>
                                <hr />
                            </div>
                        )
                    }

                    return null;
                })}

            </div>

            {/* Bottom Section */}
            <div className='cart-bottom'>
                <div className='cart-total'>
                    <h2>Cart Totals</h2>
                    <div>
                        <div className='cart-total-details'>
                            <p>Subtotal</p>
                            <p>₹{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <p>Delivery Charges</p>
                            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p> {/* ✅ Fixed: $ → ₹ */}
                        </div>
                        <hr />
                        <div className='cart-total-details'>
                            <b>Total</b>
                            <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>

                {/* Promo Code */}
                <div className="cart-promocode">
                    <p>If you have a promo code, enter it here</p>

                    <div className="cart-promocode-input">
                        <input type='text' placeholder='Promo code' />
                        <button>Submit</button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Cart