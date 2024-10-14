import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/user';

export const listTalents = () => axios.get(`${REST_API_BASE_URL}/list-talent`);

export const listGenres = () => axios.get(`${REST_API_BASE_URL}/list-genre`);

export const listInspiredBys = () => axios.get(`${REST_API_BASE_URL}/list-inspired-by`);

export const register = (user, userInformation) => axios.post(
    REST_API_BASE_URL, user, userInformation
) 