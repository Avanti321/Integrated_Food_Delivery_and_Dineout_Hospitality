import React, { useEffect, useState } from "react";
import "./Restaurant.css";
import { getFoods, addToCart } from "../../services/api.js";

const Restaurant = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (foodId) => {
    try {
      await addToCart(foodId);
      alert("Added to cart ✅");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="restaurant">
      <h2>🍴 Explore Foods</h2>

      <div className="food-list">
        {foods.map((food) => (
          <div className="food-card" key={food._id}>
            <img
              src={`http://localhost:4000/images/${food.image}`}
              alt={food.name}
            />
            <h3>{food.name}</h3>
            <p>₹{food.price}</p>
            <button onClick={() => handleAddToCart(food._id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;