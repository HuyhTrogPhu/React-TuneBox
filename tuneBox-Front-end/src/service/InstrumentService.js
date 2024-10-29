import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/instrument';

export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);
export const listInstruments = () => axios.get(REST_API_BASE_URL);

export const createInstrument = (instrument) => axios.post(REST_API_BASE_URL, instrument);
export const getInstrument = (instrumentId) => axios.get(`${REST_API_BASE_URL}/${instrumentId}`);
export const updateInstrument = (instrument, instrumentId) => {
    return axios.put(`${REST_API_BASE_URL}/${instrumentId}`, instrument);
}
export const deleteInstrument = (instrumentId) => axios.delete(`${REST_API_BASE_URL}/${instrumentId}`);
