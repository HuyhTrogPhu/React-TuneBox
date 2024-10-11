import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/cart';

export const addToCart = (instrumentId, quantity) => {
  return axios.post(`${REST_API_BASE_URL}/addToCart?instrumentId=${instrumentId}&quantity=${quantity}`, {}, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true  // Gửi kèm cookie session
  });
};


export const getCart = () => axios.get(`${REST_API_BASE_URL}/viewCart`, {
  withCredentials: true  // Gửi kèm cookie session
});
