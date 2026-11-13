import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product_Code_Field } from '@src/data_struct/product';
import { Create_Product_Code_Body_Field } from '@src/data_struct/product/body';
import { PRODUCT_API } from '@src/const/api/product';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const product_RTK = createApi({
    reducerPath: 'product_RTK',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        credentials: 'include',
        prepareHeaders: async (headers) => {
            headers.set('x-device-type', DeviceEnum.WEB);
            return headers;
        },
    }),
    tagTypes: [],
    endpoints: (builder) => ({
        _create_Product_Code_: builder.mutation<My_Response_Field<Product_Code_Field>, Create_Product_Code_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.CREATE_PRODUCT_CODE,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { use_create_Product_Code_Mutation } = product_RTK;
