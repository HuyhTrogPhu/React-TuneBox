import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/checkout';

export const getUserById = (userId) => axios.get(`${REST_API_BASE_URL}/getUserById/${userId}`);

export const updateOrderStatus = (orderId, newStatus, deliveryDate, paymentStatus) => { 
    return axios.put(`${REST_API_BASE_URL}/order/${orderId}/status`, {
      status: newStatus,
      deliveryDate: deliveryDate,
      paymentStatus: paymentStatus
    });
  };
  
// get order by user id
export const getOrdersByUserId = async (userId) => axios.get(`${REST_API_BASE_URL}/orders/${userId}`);