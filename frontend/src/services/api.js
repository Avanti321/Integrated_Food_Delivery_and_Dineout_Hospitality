import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

// 🔐 Get token
const getToken = () => {
  return localStorage.getItem("token");
};

// ================= AUTH =================
export const loginUser = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data);

export const registerUser = (data) =>
  axios.post(`${BASE_URL}/auth/register`, data);

// ================= FOOD =================
export const getFoods = () =>
  axios.get(`${BASE_URL}/food/list`);

// ================= CART =================
export const addToCart = (foodId) =>
  axios.post(
    `${BASE_URL}/cart/add`,
    { foodId },
    {
      headers: { token: getToken() }
    }
  );

// ================= BOOKING =================
export const createBooking = (data) =>
  axios.post(`${BASE_URL}/bookings`, data, {
    headers: { token: getToken() }
  });

export const getBookings = () =>
  axios.get(`${BASE_URL}/bookings`, {
    headers: { token: getToken() }
  });

// ================= PAYMENT =================
export const createOrder = (amount) =>
  axios.post(`${BASE_URL}/payment/create-order`, { amount });

// ================= ADMIN =================
export const getAdminStats = () =>
  axios.get(`${BASE_URL}/admin/stats`);

export default axios;