import axios from 'axios';

const API_URL = 'http://localhost:8080/api/likes';

export const addLike = async (userId, postId) => {
  
  try {
    const response = await axios.post(`${API_URL}/add`, null, {
      params: {
        userId,
        postId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

export const removeLike = async (userId, postId) => {
  try {
    await axios.delete(`${API_URL}/remove`, {
      params: {
        userId,
        postId,
      },
    });
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};

export const getLikesByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

export const checkUserLike = async (postId,userId) => {
  try{
  const response = await axios.get(`${API_URL}/post/${postId}/user/${userId}`);
  return response.data;
} catch (error) {
  console.error("Error ",error);
  throw error;
}
};