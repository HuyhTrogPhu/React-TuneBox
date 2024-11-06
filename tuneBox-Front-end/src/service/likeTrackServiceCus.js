import axios from "axios";

const API_URL = "http://localhost:8080/api/likes";

// hàm like
export const addLike = (userId, trackId, postId) => {
  return axios.post(`${API_URL}/add`, {
    userId: userId,
    trackId: trackId,
    postId: postId,
  });
};

// hàm like playlist
export const addLikePlaylist = (userId, playlistId) => {
  return axios.post(`${API_URL}/addPlaylist`, {
    userId: userId,
    playlistId: playlistId,
  });
};

// hàm like album
export const addLikeAlbums = (userId, albumId) => {
  return axios.post(`${API_URL}/addAlbums`, {
    userId: userId,
    albumId: albumId,
  });
};

// Hàm xóa Like
export const removeLike = (userId, trackId) => {
  return axios.delete(`${API_URL}/remove`, {
    params: {
      userId: userId,
      trackId: trackId,
    },
    withCredentials: true,
  });
};

// Hàm xóa Like playlist
export const removeLikePlaylist = (userId, playlistId) => {
  return axios.delete(`${API_URL}/removePlaylist`, {
    params: {
      userId: userId,
      playlistId: playlistId,
    },
  });
};

// Hàm xóa Like playlist
export const removeLikeAlbums = (userId, albumId) => {
  return axios.delete(`${API_URL}/removeAlbum`, {
    params: {
      userId: userId,
      albumId: albumId,
    },
  });
};

export const removeLikePost = (userId, postId) => {
  return axios.delete(`${API_URL}/remove`, {
    params: {
      userId: userId,
      postId: postId,
    },
    withCredentials: true,
  });
};

// Hàm kiểm tra người dùng đã like bài viết hoặc track hay chưa
export const checkUserLikeTrack = async (trackId, userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/track/${trackId}/user/${userId}`
    );
    return response; // Trả về response để xử lý ở nơi gọi
  } catch (error) {
    console.error(
      "Lỗi khi kiểm tra like cho track ${trackId} của user ${userId}:",
      error
    );
    throw error;
  }
};

// Hàm kiểm tra người dùng đã like playlist
export const checkUserLikePlaylist = async (playlistId, userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/playlist/${playlistId}/user/${userId}`
    );
    return response; // Trả về response để xử lý ở nơi gọi
  } catch (error) {
    console.error(
      "Lỗi khi kiểm tra like cho playlist ${playlistId} của user ${userId}:",
      error
    );
    throw error;
  }
};

// Hàm kiểm tra người dùng đã like album
export const checkUserLikeAlbums = async (albumId, userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/album/${albumId}/user/${userId}`
    );
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi kiểm tra like cho album ${albumId} của user ${userId}:",
      error
    );
    throw error;
  }
};

export const getAllLikedByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi
  }
};

export const getAllAlbumByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/allAlbums/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching like albums:", error);
    throw error;
  }
};

export const getAllPlaylistByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/allPlaylist/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching like albums:", error);
    throw error;
  }
};

// Lấy số lượng like cho track theo trackId
export const getLikesByTrackId = (trackId) =>
  axios.get(`${API_URL}/track/${trackId}`);

export const getLikesCountByTrackId = (trackId) =>
  axios.get(`${API_URL}/track/${trackId}/count`);

export const getLikesCountByPlaylistId = (playlistId) =>
  axios.get(`${API_URL}/playlist/${playlistId}/count`);

export const getLikesCountByAlbumsId = (albumId) =>
  axios.get(`${API_URL}/album/${albumId}/count`);
