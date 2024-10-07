import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/instrument';

export const listBrands = () => axios.get(`${REST_API_BASE_URL}/brands`);
export const listCategories = () => axios.get(`${REST_API_BASE_URL}/categories`);
export const listInstruments = () => axios.get(`${REST_API_BASE_URL}`);

export const createInstrument = (instrument) => axios.post(REST_API_BASE_URL, instrument, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

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
    formData.append('status', instrument.status);

    // Ghi hình ảnh vào formData
    instrument.image.forEach((file) => {
        if (file instanceof File) {
            formData.append('image', file); 
        } else {
            // Nếu bạn muốn gửi Base64, hãy chuyển đổi nó thành Blob
            const byteCharacters = atob(file); 
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Hoặc loại MIME phù hợp
            formData.append('image', blob);
        }
    });

    return axios.put(`${REST_API_BASE_URL}/${instrumentId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};




export const deleteInstrument = (instrumentId) => axios.delete(`${REST_API_BASE_URL}/${instrumentId}`);