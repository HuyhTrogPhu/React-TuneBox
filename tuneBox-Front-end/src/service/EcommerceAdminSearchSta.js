import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-statistical';

// statistical revenue  by day
export const getRevenueByDate = (date) => axios.get(`${REST_API_BASE_URL}/revenue-according-date/${date}`);

// statistical revenue between date
export const getRevenueBetweenDate = (startDate, endDate) => axios.get(`${REST_API_BASE_URL}/revenue-between-date/${startDate}/${endDate}`);

// statistical revenue by week
export const getRevenueByWeek = (date) => axios.get(`${REST_API_BASE_URL}/revenue-by-week/${date}`); 

// statistical revenue between week
export const getRevenueBetweenWeek = (startDate, endDate) => axios.get(`${REST_API_BASE_URL}/revenue-between-weeks/${startDate}/${endDate}`);

// statistical revenue by month
export const getRevenueByMonth = (year, month) => axios.get(`${REST_API_BASE_URL}/revenue-by-month/${year}/${month}`);

// statistical revenue between month
export const getRevenueBetweenMonth = (year, startMonth, endMonth) => axios.get(`${REST_API_BASE_URL}/revenue-between-months/${year}/${startMonth}/${endMonth}`);

// statistical revenue by year
export const getRevenueByYear = (year) => axios.get(`${REST_API_BASE_URL}/revenue-by-year/${year}`);

// statistical revenue between year
export const getRevenueBetweenYear = (startYear, endYear) => axios.get(`${REST_API_BASE_URL}/revenue-between-years/${startYear}/${endYear}`);