import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-comAdmin/brand';

export const listBrands = () => axios.get(REST_API_BASE_URL);
export const createBrand = (brand) => axios.post(REST_API_BASE_URL, brand);
export const getBrand = (brandId) => axios.get(`${REST_API_BASE_URL}/${brandId}`);
export const updateBrand = (brand, brandId) => {
    // Tạo một đối tượng FormData để bao gói dữ liệu
    let formData = new FormData();
    formData.append('name', brand.name);
    formData.append('desc', brand.description);
    formData.append('status', brand.status);

    // Kiểm tra và thêm tệp tin hình ảnh nếu có
    if (brand.brandImage instanceof File) {
        formData.append('imageBrand', brand.brandImage);
    }

    return axios.put(`${REST_API_BASE_URL}/${brandId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
export const deleteBrand = (brandId) => axios.delete(`${REST_API_BASE_URL}/${brandId}`);