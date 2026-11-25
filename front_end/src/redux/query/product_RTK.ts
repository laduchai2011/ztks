import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Cursor_Product_Field,
    Product_Field,
    Product_Code_Field,
    Product_Code_Hit_Field,
    Product_Hit_Field,
    Product_Code_Total_Field,
    Product_Total_Field,
} from '@src/data_struct/product';
import {
    Get_Random_Products_Body_Field,
    Get_Product_Code_Total_Body_Field,
    Get_Product_Total_Body_Field,
    Get_Product_Code_By_Id_Body_Field,
    Get_Product_By_Id_Body_Field,
    Product_Code_Search_Body_Field,
    Product_Search_Body_Field,
    Create_Product_Code_Body_Field,
    Create_Product_Body_Field,
    Edit_Product_Body_Field,
    Delete_Product_Body_Field,
    Re_Delete_Product_Body_Field,
} from '@src/data_struct/product/body';
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
    tagTypes: ['Product_Code', 'Product'],
    endpoints: (builder) => ({
        _get_Random_Products_: builder.query<My_Response_Field<Cursor_Product_Field>, Get_Random_Products_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.GET_RANDOM_PRODUCTS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Product', id: 'LIST' },

                ...(result?.data?.items ?? []).map((shop) => ({
                    type: 'Product' as const,
                    id: shop.id,
                })),
            ],
        }),
        _get_Product_Code_By_Id_: builder.query<
            My_Response_Field<Product_Code_Field>,
            Get_Product_Code_By_Id_Body_Field
        >({
            query: (body) => ({
                url: PRODUCT_API.GET_PRODUCT_CODE_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Product_Code', id: 'LIST' },
                ...(result?.data ? [{ type: 'Product_Code' as const, id: result.data.id }] : []),
            ],
        }),
        _get_Product_By_Id_: builder.query<My_Response_Field<Product_Field>, Get_Product_By_Id_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.GET_PRODUCT_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Product', id: 'LIST' },
                ...(result?.data ? [{ type: 'Product' as const, id: result.data.id }] : []),
            ],
        }),
        _get_Product_Code_Total_: builder.query<
            My_Response_Field<Product_Code_Total_Field>,
            Get_Product_Code_Total_Body_Field
        >({
            query: (body) => ({
                url: PRODUCT_API.GET_PRODUCT_CODE_TOTAL,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'Product_Code', id: 'LIST' }],
        }),
        _get_Product_Total_: builder.query<My_Response_Field<Product_Total_Field>, Get_Product_Total_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.GET_PRODUCT_TOTAL,
                method: 'POST',
                body,
            }),
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        _product_Code_Search_: builder.query<My_Response_Field<Product_Code_Hit_Field>, Product_Code_Search_Body_Field>(
            {
                query: (body) => ({
                    url: PRODUCT_API.PRODUCT_CODE_SEARCH,
                    method: 'POST',
                    body,
                }),
            }
        ),
        _product_Search_: builder.query<My_Response_Field<Product_Hit_Field>, Product_Search_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.PRODUCT_SEARCH,
                method: 'POST',
                body,
            }),
        }),
        _create_Product_Code_: builder.mutation<My_Response_Field<Product_Code_Field>, Create_Product_Code_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.CREATE_PRODUCT_CODE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product_Code', id: 'LIST' }],
        }),
        _create_Product_: builder.mutation<My_Response_Field<Product_Field>, Create_Product_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.CREATE_PRODUCT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        _edit_Product_: builder.mutation<My_Response_Field<Product_Field>, Edit_Product_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.EDIT_PRODUCT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Product', id: body.id }],
        }),
        _delete_Product_: builder.mutation<My_Response_Field<Product_Field>, Delete_Product_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.DELETE_PRODUCT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        _re_Delete_Product_: builder.mutation<My_Response_Field<Product_Field>, Re_Delete_Product_Body_Field>({
            query: (body) => ({
                url: PRODUCT_API.RE_DELETE_PRODUCT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
});

export const {
    useLazy_get_Random_Products_Query,
    useLazy_get_Product_Code_By_Id_Query,
    useLazy_get_Product_By_Id_Query,
    useLazy_get_Product_Code_Total_Query,
    useLazy_get_Product_Total_Query,
    useLazy_product_Code_Search_Query,
    useLazy_product_Search_Query,
    use_create_Product_Code_Mutation,
    use_create_Product_Mutation,
    use_edit_Product_Mutation,
    use_delete_Product_Mutation,
    use_re_Delete_Product_Mutation,
} = product_RTK;
