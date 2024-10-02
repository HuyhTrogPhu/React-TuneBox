import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/instrument';

export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);
export const listInstruments = () => axios.get(`${REST_API_BASE_URL}/instruments`);

export const createInstrument = (instrument) => axios.post(REST_API_BASE_URL, instrument);

export const getInstrument = (instrumentId) => axios.get(`${REST_API_BASE_URL}/${instrumentId}`);

export const updateInstrument = (instrumentId, instrumentData) => {
    const formData = new FormData();

    // Thêm dữ liệu từ instrumentData vào formData
    formData.append('name', instrumentData.name);
    formData.append('costPrice', instrumentData.costPrice);
    formData.append('color', instrumentData.color);
    formData.append('quantity', instrumentData.quantity);
    formData.append('categoryId', instrumentData.categoryId);
    formData.append('brandId', instrumentData.brandId);
    formData.append('description', instrumentData.description);
    formData.append('status', instrumentData.status);

    // Thêm từng ảnh vào formData
    instrumentData.images.forEach((image, index) => {
        if (typeof image === 'object') { // Nếu ảnh là tệp mới được chọn từ máy tính
            formData.append(`image_${index}`, image);
        } else {
            formData.append(`existingImage_${index}`, image); // Ảnh hiện tại (base64 hoặc đường dẫn)
        }
    });

    return axios.put(`${REST_API_BASE_URL}/${instrumentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const deleteInstrument = (instrumentId) => axios.delete(`${REST_API_BASE_URL}/${instrumentId}`);
