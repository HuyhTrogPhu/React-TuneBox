import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/brand';

export const listBrands = () => axios.get(REST_API_BASE_URL);
export const getBrand = (brandId) => axios.get(`${REST_API_BASE_URL}/${brandId}`);