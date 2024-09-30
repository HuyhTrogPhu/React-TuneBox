import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/instrument';

export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);
export const listInstruments = () => axios.get(`${REST_API_BASE_URL}/instruments`);

export const createInstrument = (instrument) => axios.post(REST_API_BASE_URL, instrument);
export const getInstrument = (instrumentId) => axios.get(`${REST_API_BASE_URL}/${instrumentId}`);
export const updateInstrument = (instrumentId, instrument) => {
    const formData = new FormData();
    formData.append('name', instrument.name);
    formData.append('costPrice', instrument.costPrice);
    formData.append('color', instrument.color);
    formData.append('quantity', instrument.quantity);
    formData.append('categoryId', instrument.categoryId);
    formData.append('brandId', instrument.brandId);
    formData.append('description', instrument.description);
    
    if (instrument.image) {
        formData.append('image', instrument.image); // Hình ảnh
    }

    return axios.put(`${REST_API_BASE_URL}/${instrumentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteInstrument = (instrumentId) => axios.delete(`${REST_API_BASE_URL}/${instrumentId}`);
