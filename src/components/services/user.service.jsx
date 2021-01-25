import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://productsjwt.azurewebsites.net/';

const getUserBoard = () => axios.get(`${API_URL}productsbyuser/`, { headers: authHeader() });

const postData = (info) => axios.post(`${API_URL}productsbyuser/`, { headers: authHeader(), info });

/*
const getModeratorBoard = () => axios.get(`${API_URL}mod`, { headers: authHeader() });

const getAdminBoard = () => axios.get(`${API_URL}admin`, { headers: authHeader() });

const getPublicContent = () => axios.get(`${API_URL}all`); */

export default {
  getUserBoard,
  postData,
  API_URL,
  /*
  getPublicContent,
  getModeratorBoard,
  getAdminBoard,
  */
};
