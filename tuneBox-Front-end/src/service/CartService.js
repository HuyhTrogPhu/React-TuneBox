import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/cart';

export const addToCart = (instrumentId, quantity) => {
  const requestBody = {
    instrumentId: instrumentId,
    quantity: quantity
  };
  
  return axios.post(`${REST_API_BASE_URL}/addToCart`, requestBody, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getCart = () => axios.get(`${REST_API_BASE_URL}/items`);
