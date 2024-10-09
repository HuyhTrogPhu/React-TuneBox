import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/instrument';


export const listBrands = () =>
    axios.get(`${REST_API_BASE_URL}/brands`)
        .then(response => {
            console.log("Brands Data:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Error loading brands:", error);
        });

export const listCategories = () =>
    axios.get(`${REST_API_BASE_URL}/categories`)
        .then(response => {
            console.log("Categories Data:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Error loading categories:", error);
        });

export const listInstruments = () =>
    axios.get(`${REST_API_BASE_URL}`)
        .then(response => {
            console.log("Instruments Data:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Error loading instruments:", error);
        });





export const getInstrument = (instrumentId) => axios.get(`${REST_API_BASE_URL}/${instrumentId}`);

export const listInstrumentsByBrand = (brandId) => {
    return axios.get(`${REST_API_BASE_URL}/brand/${brandId}`);
};

export const listInstrumentsByCategory = (categoryId) => {
    return axios.get(`${REST_API_BASE_URL}/category/${categoryId}`);
};