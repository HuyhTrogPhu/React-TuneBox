import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8081/e-statistical';

// get user sell the most
export const getUserSellTheMost = () => axios.get(`${REST_API_BASE_URL}/user-sell-most`);

// get user revenue sell the most
export const getTop1UserSellTheMost = () => axios.get(`${REST_API_BASE_URL}/top1-user-sell-most`);

// get user sell the least 
export const getUserSellTheLeast = () => axios.get(`${REST_API_BASE_URL}/user-sell-least`);

// get top 1 user sell the least
export const getTop1UserSellTheLeast = () => axios.get(`${REST_API_BASE_URL}/top1-user-sell-least`);

// get user not sell 
export const getUserNotSell = () => axios.get(`${REST_API_BASE_URL}/user-not-sell`);

// get revenue of day, week, month, year
export const getRevenueCurrently = () => axios.get(`${REST_API_BASE_URL}/revenue-currently`);

// get revenue before of day, week, month, year
export const getRevenueBeforeCurrently = () => axios.get(`${REST_API_BASE_URL}/revenue-before-currently`);

// get statistical of day, week, month, year by instrument
export const getStatisticalOfTimeInstrument = () => axios.get(`${REST_API_BASE_URL}/instrument`);

// get name and id instrument for statistical 
export const getNameAndIdInstrument = () => axios.get(`${REST_API_BASE_URL}/instrumentForSta`);

// get revenue instrument by instrument id
export const getRevenueInstrumentByInstrumentId = (instrumentId) => axios.get(`${REST_API_BASE_URL}/revenue-instrument/${instrumentId}`);

// get statistical of day, week, month, year by category
export const getStatisticalOfTimeCategory = () => axios.get(`${REST_API_BASE_URL}/category`);

// get name and id category for statistical
export const getNameAndIdCategory = () => axios.get(`${REST_API_BASE_URL}/categoryForSta`);

// get revenue category by category id
export const getRevenueCategoryByCategoryId = (categoryId) => axios.get(`${REST_API_BASE_URL}/revenue-category/${categoryId}`);

// get statistical of day, week, month, year by brand 
export const getStatisticalOfTimeBrand = () => axios.get(`${REST_API_BASE_URL}/brand`);

// get name and id brand for statistical
export const getNameAndIdBrand = () => axios.get(`${REST_API_BASE_URL}/brandForSta`);

// get revenue brand by brand id
export const getRevenueBrandByBrandId = (brandId) => axios.get(`${REST_API_BASE_URL}/revenue-brand/${brandId}`);