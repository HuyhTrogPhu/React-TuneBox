import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/user';

export const getUserById = (userId) => (`${REST_API_BASE_URL}/${userId}`)
