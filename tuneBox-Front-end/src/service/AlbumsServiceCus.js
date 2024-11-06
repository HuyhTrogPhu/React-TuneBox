import axios from "axios";

const API_URL = "http://localhost:8080/customer/albums"; // Đường dẫn base
const URL = "http://localhost:8080/customer/tracks"; // get listgenre, listTrackByUserID

// Lấy danh sách album theo userId
export const getAlbumsByUserId = async (userId) => {
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

// lấy info album theo id
export const getAlbumById = async (albumId) => {
  try {
    if (!albumId) throw new Error("album ID not found"); // Kiem tra
    const response = await axios.get(`${API_URL}/${albumId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error get info album by id:", error);
    throw error;
  }
};

// Tạo album mới
export const createAlbum = async (albumData) => {
  try {
    const response = await axios.post(API_URL, albumData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create album error:", error);
    throw error;
  }
};

// Xóa album theo ID
export const deleteAlbum = async (albumId) => {
  try {
    await axios.delete(`${API_URL}/${albumId}`, { withCredentials: true });
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
};

// Cập nhật album theo ID
// export const updateAlbum = async (albumId, albumData) => {
//   try {
//     const response = await axios.put(`${API_URL}/${albumId}`, albumData, {
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating album:", error);
//     throw error;
//   }
// };
// AlbumsServiceCus.js
export const updateAlbum = async (albumId, formData) => {
  try {
    // Log request data
    console.log("Updating album with ID:", albumId);
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.put(`${API_URL}/${albumId}`, formData, {
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
