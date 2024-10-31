import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-statistical';

// revenue according by day
export const getRevenueByDay = (date) => axios.get(`${REST_API_BASE_URL}/revenue-according-day/${date}`);

// revenue according by week
export const getRevenueByWeek = (date) => axios.get(`${REST_API_BASE_URL}/revenue-according-week/${date}`);

// revenue according by month
export const getRevenueByMonth = (date) => axios.get(`${REST_API_BASE_URL}/revenue-according-month/${date}`);

// revenue according by year
export const getRevenueByYear = (date) => axios.get(`${REST_API_BASE_URL}/revenue-according-year/${date}`);
