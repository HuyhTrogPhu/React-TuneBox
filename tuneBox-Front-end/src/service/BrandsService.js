import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/brand';

export const listBrands = () => axios.get(REST_API_BASE_URL);
export const createBrand = (brand) => axios.post(REST_API_BASE_URL, brand);
export const getBrand = (brandId) => axios.get(`${REST_API_BASE_URL}/${brandId}`);
export const updateBrand = (brand, brandId) => {
    return axios.put(`${REST_API_BASE_URL}/${brandId}`, brand);
}
export const deleteBrand = (brandId) => axios.delete(`${REST_API_BASE_URL}/${brandId}`);