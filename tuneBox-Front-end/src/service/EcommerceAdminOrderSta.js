import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-statistical';

// get list order unpaid
export const getOrdersByUnpaid = () => axios.get(`${REST_API_BASE_URL}/order-unpaid`);

// get list order paid
export const getOrdersByPaid = () => axios.get(`${REST_API_BASE_URL}/order-paid`);

// get list order confirmed
export const getOrdersByConfirmed = () => axios.get(`${REST_API_BASE_URL}/order-confirmed`);

// get list order delivered
export const getOrdersByDelivered = () => axios.get(`${REST_API_BASE_URL}/order-delivered`);

// get list order delivering
export const getOrdersByDelivering = () => axios.get(`${REST_API_BASE_URL}/order-delivering`);

// get list order canceled
export const getOrdersByCanceled = () => axios.get(`${REST_API_BASE_URL}/order-canceled`);

// get list order COD
export const getOrdersByCOD = () => axios.get(`${REST_API_BASE_URL}/order-cod`);

// get list order VNPAY
export const getOrdersByVNPAY = () => axios.get(`${REST_API_BASE_URL}/order-vnpay`);

// get list order normal
export const getOrdersByNormal = () => axios.get(`${REST_API_BASE_URL}/order-normal`);

// get list order fast
export const getOrdersByFast = () => axios.get(`${REST_API_BASE_URL}/order-fast`);