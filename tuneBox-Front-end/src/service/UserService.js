import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/user';

// get avatar user in feed page 
export const getAvatarUser = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/${userId}/avatar`, {
            withCredentials: true
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
export const getUserSetting = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/${userId}/settingProfile`, {
            withCredentials: true,
        });
        return response.data; // Trả về user info
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};


// get follow count by userId 
export const getFollowCountByUserId = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/${userId}/followCount`, {
            withCredentials: true,
        });
        return response.data; // Trả về số lượng follower và following
    } catch (error) {
        console.log("Error fetching follow count", error);
        throw error;
    }
};

export const getFriendCount = async (userId) => {
    const response = await fetch(`http://localhost:8080/api/friends/count/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch friend count');
    }
    const count = await response.json();
    console.log('Fetched friend count:', count); // Log giá trị trước khi trả về
    return count;
};




