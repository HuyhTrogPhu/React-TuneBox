import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8080/customer/tracks';

export const getTrackByUserId = (userId) => axios.get(`${REST_API_BASE_URL}/user/${userId}`)

export const createTrack = (track) => axios.post(REST_API_BASE_URL, track, { 
    headers: {
                'Content-Type': 'multipart/form-data'
            }
 });

export const listGenre = () => axios.get(`${REST_API_BASE_URL}/getAllGenre`);

