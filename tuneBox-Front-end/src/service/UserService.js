import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/user";

// get all list talents
export const listTalents = () => axios.get(`${REST_API_BASE_URL}/list-talent`);

// get all list genres
export const listGenres = () => axios.get(`${REST_API_BASE_URL}/listNameGenre`);

// get all list inspired by
export const listInspiredBys = () =>
  axios.get(`${REST_API_BASE_URL}/list-inspired-by`);

// get avatar user in feed page
export const getAvatarUser = async (userId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${userId}/avatar`, {
      withCredentials: true,
    });
    return response.data; // Trả về avatar
  } catch (error) {
    console.error("Error fetching avatar:", error);
    throw error;
  }
};

// get user info in profile page
export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/${userId}/profile`, {
      withCredentials: true,
    });
    return response.data; // Trả về user info
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

// get user in profile setting page
export const getUserProfileSetting = async (userId) => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/${userId}/settingProfile`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Trả về user setting
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const updateUserEmail = async (userId, newEmail) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/email`,
      { newEmail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Trả về dữ liệu phản hồi
  } catch (error) {
    console.error("Error updating email:", error);
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi khác nếu cần
  }
};

// get user in account setting page
export const getUserAccountSetting = async (userId) => {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/${userId}/accountSetting`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Trả về user info
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getFriendCount = async (userId) => {
  const response = await fetch(
    `http://localhost:8080/api/friends/count/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch friend count");
  }
  const count = await response.json();
  return count;
};

// update userName by userId by user
export const updateUserName = async (userId, newUserName) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/username`,
      newUserName,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error updating user name", error);
    throw error;
  }
};

// update password by userId by user
export const updatePassword = async (userId, newPassword) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/password`,
      newPassword,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error updating user password", error);
    throw error;
  }
};
export const updateUserBirthday = async (userId, newBirthday) => {
  try {
    // Kiểm tra định dạng ngày sinh trước khi gửi
    if (!isValidBirthday(newBirthday)) {
      throw new Error("Ngày sinh không hợp lệ");
    }

    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/birthday`,
      JSON.stringify(newBirthday),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating birthday:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi
  }
};

// Hàm kiểm tra định dạng ngày sinh
const isValidBirthday = (birthday) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(birthday);
};

export const updateUserGender = async (userId, newGender) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/gender`,
      newGender,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating gender:", error);
    throw error;
  }
};
export const updateUserInfo = async (userId, updatedInfo) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL}/${userId}/update`,
      updatedInfo,
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo Content-Type là application/json
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

// Hàm tìm kiếm
export const search = async (keyword) => {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

export const updateBackground = async (userId, formData) => {
  const response = await axios.post(`${REST_API_BASE_URL}/users/${userId}/background`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    },
  });
  
  return response.data; // Hoặc xử lý phản hồi theo cách bạn cần
};