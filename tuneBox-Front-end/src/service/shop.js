import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/customer/shop";


export const searchInstruments = async (instrumentName) => {
    const token = localStorage.getItem("jwtToken"); // Lấy token từ localStorage
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/instruments/search`, {
            params: { keyword: instrumentName },  // Thêm từ khóa vào query parameter
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào headers
                'Content-Type': 'application/json', // Đảm bảo content-type là JSON
            },
            withCredentials: true,  // Đảm bảo cookies được gửi đi nếu có
        });
        return response.data; // Trả về danh sách instrument tìm được
    } catch (error) {
        console.error("Error searching instruments:", error);
        throw error;
    }
};
