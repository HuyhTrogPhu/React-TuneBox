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