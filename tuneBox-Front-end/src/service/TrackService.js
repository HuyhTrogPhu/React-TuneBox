import axios from "axios";

const REST_API_BASE_ULR ="http://localhost:8081/profileUser/track/getAll";

export const listTrack = () => axios.get(REST_API_BASE_ULR);
