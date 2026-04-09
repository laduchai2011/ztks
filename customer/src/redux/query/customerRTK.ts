import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CustomerField } from '@src/dataStruct/customer';
import {
    CreateCustomerBodyField,
    SigninCustomerBodyField,
    CustomerForgetPasswordBodyField,
} from '@src/dataStruct/customer/body';
import { CUSTOMER_API } from '@src/const/api/customer';
import { MyResponse } from '@src/dataStruct/response';

export const customerRTK = createApi({
    reducerPath: 'customerRTK',
    baseQuery: fetchBaseQuery({ baseUrl: '', credentials: 'include' }),
    tagTypes: [],
    endpoints: (builder) => ({
        signin: builder.mutation<MyResponse<CustomerField>, SigninCustomerBodyField>({
            query: (body) => ({
                url: CUSTOMER_API.SIGNIN,
                method: 'POST',
                body,
            }),
        }),
        createCustomer: builder.mutation<MyResponse<CustomerField>, { body: CreateCustomerBodyField; token: string }>({
            query: ({ body, token }) => ({
                url: CUSTOMER_API.CREATE_CUSTOMER,
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        customerForgetPassword: builder.mutation<
            MyResponse<CustomerField>,
            { body: CustomerForgetPasswordBodyField; token: string }
        >({
            query: ({ body, token }) => ({
                url: CUSTOMER_API.CUSTOMER_FORGET_PASSWORD,
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});

export const { useSigninMutation, useCreateCustomerMutation, useCustomerForgetPasswordMutation } = customerRTK;
