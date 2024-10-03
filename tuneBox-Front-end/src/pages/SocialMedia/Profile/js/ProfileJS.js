import axios from 'axios';

export const fetchDataUser = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/user/get/${userId}`, { withCredentials: true });
        const data = response.data;
        console.log('User data fetched from API:', data);
        return data; 
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};