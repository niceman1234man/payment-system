import axios from 'axios';

const API = axios.create({
  baseURL: 'https://payment-system-hicv.onrender.com/api',
});

export default API;
