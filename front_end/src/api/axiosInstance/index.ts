import axios from 'axios';
import { BASE_URL } from '@src/const/api/baseUrl';
import { DeviceEnum } from '@src/device/type';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';
// const apiString = isProduct ? '' : '';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}${apiString}`,
    timeout: 0,
    headers: {
        'Content-Type': 'application/json',
        'x-device-type': DeviceEnum.WEB,
    },
    withCredentials: true,
});

export default axiosInstance;
