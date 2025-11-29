import { API_BASE_URL } from '@/constant/url';
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
