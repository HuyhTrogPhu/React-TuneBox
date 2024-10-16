import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/user';

export const listTalents = () => axios.get(`${REST_API_BASE_URL}/list-talent`);

export const listGenres = () => axios.get(`${REST_API_BASE_URL}/list-genre`);

export const listInspiredBys = () => axios.get(`${REST_API_BASE_URL}/list-inspired-by`);

export const register = async (formData) => {
  const response = await axios.post(`${REST_API_BASE_URL}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

// login
export const login = async (userDto) => {
  const response = await axios.post(`${REST_API_BASE_URL}/login`, userDto, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data;
};

// log-out 

// log-out 
export const logout = async () => {
  const response = await axios.get(`${REST_API_BASE_URL}/log-out`, {
    withCredentials: true
  });
  return response.data;
};
