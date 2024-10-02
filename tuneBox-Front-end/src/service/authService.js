import axios from "axios";
const API_URL = 'http://localhost:8080/api/auth/'; // Đường dẫn cơ sở cho API

// Hàm đăng ký người dùng
const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data; // Trả về dữ liệu phản hồi
};

const authService = {
  registerUser,
};

export default authService;