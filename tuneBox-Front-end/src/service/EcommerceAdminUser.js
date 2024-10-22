import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8081/e-customer';

// list all user ecommerce admin
export const listEcommerceUsers = () => axios.get(`${REST_API_BASE_URL}/users`);

// get user detail ecommerce admin
export const getEcommerceUserDetails = (userId) => axios.get(`${REST_API_BASE_URL}/users/${userId}`);