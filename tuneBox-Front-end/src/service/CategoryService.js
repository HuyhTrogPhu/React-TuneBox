import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/categoryIns';

export const listCateIns = () => axios.get(REST_API_BASE_URL);
export const createCategory = (category) => axios.post(REST_API_BASE_URL, category, { withCredentials: true });
export const getCategory = (categoryId) => axios.get(`${REST_API_BASE_URL}/${categoryId}`);
export const updateCateIns = (categoryId, category) => {

    let formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('status', category.status);

    if(category.image instanceof File) {
        formData.append('image', category.image);
    }


    return axios.put(`${REST_API_BASE_URL}/${categoryId}`, category, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};
export const deleteCateIns = (categoryId) => axios.delete(`${REST_API_BASE_URL}/${categoryId}`);
