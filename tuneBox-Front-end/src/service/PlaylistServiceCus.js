import axios from "axios";

const API_URL = "http://localhost:8080/customer/playlist"; // Đường dẫn base

// lấy info playlist theo id
export const getPlaylistById = async (playlistId) => {
  try {
    if (!playlistId) throw new Error("playlist ID not found"); // Kiem tra
    const response = await axios.get(`${API_URL}/${playlistId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error get info playlist by id:", error);
    throw error;
  }
};

// Lấy danh sách playlist theo userId
export const getPlaylistByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
};

// new Playlist
export const createPlaylist = async (playlistData) => {
  try {
    const response = await axios.post(API_URL, playlistData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo playlist:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// update or add track
export const updatePlaylist = async (playlistId, formData) => {
  try {
    // Log request data
    console.log("Updating playlist with ID:", playlistId);
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.put(`${API_URL}/${playlistId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating album:", error);
    console.error("Server response:", error.response?.data);
    throw error;
  }
};
