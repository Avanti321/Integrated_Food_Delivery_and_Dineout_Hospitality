import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext);

    return (
        <div className='food-display' id='food-delivery'>
            <h2>Top dishes near you</h2>
            <div className='food-display-list'>
                {food_list && food_list.map((item) => {   // ✅ null guard added
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        )
                    }
                    return null; // ✅ always return something from map
                })}
            </div>
        </div>
    )
}

export default FoodDisplay