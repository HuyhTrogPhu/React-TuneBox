import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/checkout';

export const getUserById = (userId) => axios.get(`${REST_API_BASE_URL}/getUserById/${userId}`);