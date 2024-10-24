import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8081/e-order';

// get order by userId
export const getOrderByUserId = (userId) => axios.get(`${REST_API_BASE_URL}/orders/${userId}`);


// get all orders
export const getAllOrders = () => axios.get(`${REST_API_BASE_URL}/orders`);

// get orderDetail by orderId
export const getOrderByOrderId = (orderId) => axios.get(`${REST_API_BASE_URL}/orders/${orderId}`);