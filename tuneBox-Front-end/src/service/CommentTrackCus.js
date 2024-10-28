import axios from "axios";

const API_URL = "http://localhost:8080/api/comments";
const API_URL_REPLY = "http://localhost:8080/api/replies";

// Thêm comment vào track
export const addCommentTrack = async (
  trackId,
  userId,
  commentDTO,
  createdAt
) => {
  try {
    const response = await axios.post(
      `${API_URL}/track/${trackId}/user/${userId}`,
      commentDTO,
      {
        params: { createdAt: createdAt },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment", error);
    throw error;
  }
};

// Xóa comment theo commentId
export const deleteCommentTrack = async (commentId) => {
  try {
    await axios.delete(`${API_URL}/track/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment", error);
    throw error;
  }
};

// Cập nhật comment
export const updateCommentTrack = async (commentId, commentDTO) => {
  try {
    const response = await axios.put(
      `${API_URL}/track/${commentId}`,
      commentDTO
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment", error);
    throw error;
  }
};

// Lấy tất cả comment của một track
export const getCommentsByTrack = async (trackId) => {
  try {
    const response = await axios.get(`${API_URL}/track/${trackId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments", error);
    throw error;
  }
};

// REPLY
// Hàm thêm reply cho comment
export const addReply = async (
  commentId,
  userId,
  replyData,
  parentReplyId = null
) => {
  try {
    const response = await axios.post(
      `${API_URL_REPLY}/comment/${commentId}/user/${userId}`,
      replyData,
      { params: { parentReplyId } }
    );
    return response.data; // Trả về dữ liệu reply mới
  } catch (error) {
    throw new Error(error.response.data.message || "Error adding reply");
  }
};

// Hàm lấy danh sách replies theo commentId
export const getRepliesByComment = async (commentId) => {
  try {
    const response = await axios.get(`${API_URL_REPLY}/comment/${commentId}`);
    return response.data; // Trả về danh sách replies
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching replies");
  }
};

// Hàm xóa reply
export const deleteReply = async (replyId, userId) => {
  try {
    await axios.delete(`${API_URL_REPLY}/reply/${replyId}/user/${userId}`);
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting reply");
  }
};

// Hàm thêm reply cho reply (nested reply)
export const addReplyToReply = async (parentReplyId, userId, replyData) => {
  try {
    const response = await axios.post(
      `${API_URL_REPLY}/reply/${parentReplyId}/user/${userId}`,
      replyData
    );
    return response.data; // Trả về dữ liệu reply mới
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error adding reply to reply"
    );
  }
};

// Hàm cập nhật reply theo replyId và userId
export const updateReply = async (replyId, userId, replyData) => {
  try {
    // Gửi yêu cầu cập nhật reply bằng phương thức PUT
    const response = await axios.put(
      `${API_URL_REPLY}/reply/${replyId}/user/${userId}`,
      replyData
    );
    return response.data; // Trả về reply đã cập nhật
  } catch (error) {
    // Bắt lỗi nếu có và trả về message lỗi
    throw new Error(error.response.data.message || "Error updating reply");
  }
};
