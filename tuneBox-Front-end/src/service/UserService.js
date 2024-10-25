import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/user';

// get all list talents
export const listTalents = () => axios.get(`${REST_API_BASE_URL}/list-talent`);

// get all list genres
export const listGenres = () => axios.get(`${REST_API_BASE_URL}/listNameGenre`);

// get all list inspired by
export const listInspiredBys = () => axios.get(`${REST_API_BASE_URL}/list-inspired-by`);



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
export const getUserProfileSetting = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/${userId}/settingProfile`, {
            withCredentials: true,
        });
        return response.data; // Trả về user setting
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};



// get user in account setting page
export const getUserAccountSetting = async (userId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/${userId}/accountSetting`, {
            withCredentials: true,
        });
        return response.data; // Trả về user info
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};


// // get follow count by userId 
// export const getFollowCountByUserId = async (userId) => {
//     try {
//         const response = await axios.get(`${REST_API_BASE_URL}/${userId}/followCount`, {
//             withCredentials: true,
//         });
//         return response.data; // Trả về số lượng follower và following
//     } catch (error) {
//         console.log("Error fetching follow count", error);
//         throw error;
//     }
// };

export const getFriendCount = async (userId) => {
    const response = await fetch(`http://localhost:8080/api/friends/count/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch friend count');
    }
    const count = await response.json();
    console.log('Fetched friend count:', count); // Log giá trị trước khi trả về
    return count;
};







// update userName by userId by user
export const updateUserName = async (userId, newUserName) => {
    try {
        const response = await axios.put(`${REST_API_BASE_URL}/${userId}/username`, newUserName, {
            headers: {
                'Content-Type': 'application/json',
              }
        });
        return response.data;
    } catch (error) {
        console.log("Error updating user name", error);
        throw error;
    }
}

// update email by userId by user
export const updateEmail = async (userId, newEmail) => {
    try {
        const response = await axios.put(`${REST_API_BASE_URL}/${userId}/email`, newEmail, {
            headers: {
                'Content-Type': 'application/json',
              }
        });
        return response.data;
    } catch (error) {
        console.log("Error updating user email", error);
        throw error;
    }
}

// update password by userId by user
export const updatePassword = async (userId, newPassword) => {
    try {
        const response = await axios.put(`${REST_API_BASE_URL}/${userId}/password`, newPassword, {
            headers: {
                'Content-Type': 'application/json',
              }
        });
        return response.data;
    } catch (error) {
        console.log("Error updating user password", error);
        throw error;
    }
}