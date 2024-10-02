import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/instrument';

export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);
export const listInstruments = () => axios.get(`${REST_API_BASE_URL}`);
export const getInstrument = (instrumentId) => axios.get(`${REST_API_BASE_URL}/${instrumentId}`);
export const listInstrumentsByBrand = (brandId) => {
    return axios.get(`${REST_API_BASE_URL}/brand/${brandId}`);
};