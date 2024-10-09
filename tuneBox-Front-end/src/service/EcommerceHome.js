import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/shop';

// List brand
export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);

// List category
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);

// List instrument
export const listInstruments = () => axios.get(`${REST_API_BASE_URL}/instruments`)