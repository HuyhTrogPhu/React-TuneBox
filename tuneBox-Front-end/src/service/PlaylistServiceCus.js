import axios from "axios";

const API_URL = "http://localhost:8080/customer/playlist"; // Đường dẫn base
const URL = "http://localhost:8080/customer/tracks"; // get listgenre, listTrackByUserID

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
    console.error("Error fetching albums:", error);
    throw error;
  }
};

//  Lấy danh sách Track theo người dùng
export const listTrackByUserId = async (userId) => {
  try {
    if (!userId) throw new Error("User ID not found in create album"); // Kiem tra userId
    const response = await axios.get(`${URL}/user/${userId}`, {
      withCredentials: true,
    });
    const sortedTrack = response.data.sort(
      (a, b) => new Date(b.createDate) - new Date(a.createDate)
    ); // Sap xep track

    return sortedTrack; // trả về mảng track đã sắp xếp
  } catch (error) {
    console.error("Error fetching Track in creat album:", error);
    throw error;
  }
};

// Lấy danh sách thể loại (genre)
export const listGenre = async () => {
  try {
    const response = await axios.get(`${URL}/getAllGenre`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

// Lấy danh sách album styles
export const listAlbumStyle = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllAlbumStyle`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching album styles:", error);
    throw error;
  }
};
