import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const CUSTOMER_API = {
    CREATE_CUSTOMER: `${BASE_URL}${apiString}/service_customer/mutate/createCustomer`,
    CUSTOMER_SIGNIN: `${BASE_URL}${apiString}/service_customer/query/signinCustomer`,
    CUSTOMER_FORGET_PASSWORD: `${BASE_URL}${apiString}/service_customer/mutate/customerForgetPassword`,
    CUSTOMER_SIGNOUT: `${BASE_URL}${apiString}/service_customer/mutate/customerSignout`,
};
