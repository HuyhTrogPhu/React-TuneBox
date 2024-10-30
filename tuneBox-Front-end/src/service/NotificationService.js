import axios from 'axios';

// Địa chỉ API của bạn
const API_URL = "http://localhost:8080/api"; // Thay đổi đường dẫn nếu cần

// Hàm lấy thông báo
export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      params: { userId }, // Gửi userId như tham số truy vấn
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Nếu bạn sử dụng token cho xác thực
      },
    });
    return response.data; // Giả sử API trả về danh sách thông báo dưới dạng JSON
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};
// Hàm đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Nếu bạn sử dụng token cho xác thực
      },
    });
    return response.data; // Trả về dữ liệu đã cập nhật (nếu cần)
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};


