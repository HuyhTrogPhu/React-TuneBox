import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/categoryIns';

export const listCateIns = () => axios.get(REST_API_BASE_URL);
export const createCategory = (category) => axios.post(REST_API_BASE_URL, category);
export const getCategory = (categoryId) => axios.get(`${REST_API_BASE_URL}/${categoryId}`);
export const updateCateIns = (categoryId, category) => {
    return axios.put(`${REST_API_BASE_URL}/${categoryId}`, category);
  };
export const deleteCateIns = (categoryId) => axios.delete(`${REST_API_BASE_URL}/${categoryId}`);
