import axios from 'axios';
import { BASE_URL } from '@src/const/api/baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';
// const apiString = isProduct ? '' : '';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}${apiString}`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosInstance;
