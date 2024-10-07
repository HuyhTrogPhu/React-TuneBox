import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/category';

// Get all categories
export const listCategories = () => axios.get(REST_API_BASE_URL);

// Get category by ID
export const getCategory = (categoryId) => axios.get(`${REST_API_BASE_URL}/${categoryId}`);
