import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

// Thêm comment vào track
export const addCommentTrack = async (trackId, userId, commentDTO, createdAt) => {
    try {
        const response = await axios.post(`${API_URL}/track/${trackId}/user/${userId}`, commentDTO, {
            params: { createdAt: createdAt }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding comment', error);
        throw error;
    }
};

// Xóa comment theo commentId
export const deleteCommentTrack = async (commentId) => {
    try {
        await axios.delete(`${API_URL}/track/${commentId}`);
    } catch (error) {
        console.error('Error deleting comment', error);
        throw error;
    }
};

// Cập nhật comment
export const updateCommentTrack = async (commentId, commentDTO) => {
    try {
        const response = await axios.put(`${API_URL}/track/${commentId}`, commentDTO);
        return response.data;
    } catch (error) {
        console.error('Error updating comment', error);
        throw error;
    }
};

// Lấy tất cả comment của một track
export const getCommentsByTrack = async (trackId) => {
    try {
        const response = await axios.get(`${API_URL}/track/${trackId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments', error);
        throw error;
    }
};