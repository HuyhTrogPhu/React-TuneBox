import axios from 'axios';

export const fetchDataUser = async (userId) => {
    try {
        // Gọi API với userId và với cookies
        const response = await axios.get(`http://localhost:8080/user/get/${userId}`, { withCredentials: true });
        const data = response.data;


        // Kiểm tra xem có dữ liệu không
        if (!data) {
            throw new Error('No data returned');
        }

        return data; 
    } catch (error) {
        console.error('Error fetching user data:', error); // In lỗi nếu có
        return null; // Trả về null nếu có lỗi
    }
};
