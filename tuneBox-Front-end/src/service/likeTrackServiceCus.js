import axios from "axios";


const API_URL = "http://localhost:8080/api/likes";

// hàm like
export const addLike = (userId, trackId) => {
    return axios.post(`${API_URL}/add`, null, {
      params: {
        userId: userId,
        trackId: trackId
      },
    });
  };

  // Hàm xóa Like
export const removeLike = (userId, trackId) => {
    return axios.delete(`${API_URL}/remove`, {
      params: {
        userId: userId,
        trackId: trackId
      },
      withCredentials: true,
    });
  };

  // Hàm kiểm tra người dùng đã like bài viết hoặc track hay chưa
  export const checkUserLikeTrack = async (trackId, userId) => {
    try {
      const response = await axios.get(`${API_URL}/track/${trackId}/user/${userId}`);
      return response; // Trả về response để xử lý ở nơi gọi
    } catch (error) {
      console.error("Lỗi khi kiểm tra like:", error);
      throw error; // Ném lỗi ra ngoài để xử lý
    }
  };

  // Lấy số lượng like cho track theo trackId
export const getLikesByTrackId = (trackId) => axios.get(`${API_URL}/track/${trackId}`)