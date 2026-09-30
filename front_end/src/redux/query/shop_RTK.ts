import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Shop_Field,
    Cursor_Shop_Field,
    Depot_Field,
    Cursor_Depot_Field,
    Store_Field,
    Cursor_Store_Field,
} from '@src/data_struct/shop';
import {
    Get_My_Shops_Body_Field,
    Get_My_Depots_Body_Field,
    Get_My_Stores_Body_Field,
    // Get_Latest_Shop_Pay_With_Shop_Id_Body_Field,
    Create_Shop_Body_Field,
    Create_Depot_Body_Field,
    Create_Store_Body_Field,
    Edit_Shop_Body_Field,
    Edit_Depot_Body_Field,
    Edit_Store_Body_Field,
    Delete_Shop_Body_Field,
    Delete_Depot_Body_Field,
    Delete_Store_Body_Field,
} from '@src/data_struct/shop/body';
import { SHOP_API } from '@src/const/api/shop';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export const shop_RTK = createApi({
    reducerPath: 'shop_RTK',
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
        _get_My_Shops_: builder.query<My_Response_Field<Cursor_Shop_Field>, Get_My_Shops_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_SHOPS,
                method: 'POST',
                body,
            }),
        }),
        _get_My_Depots_: builder.query<My_Response_Field<Cursor_Depot_Field>, Get_My_Depots_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_DEPOTS,
                method: 'POST',
                body,
            }),
        }),
        _get_My_Stores_: builder.query<My_Response_Field<Cursor_Store_Field>, Get_My_Stores_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_STORES,
                method: 'POST',
                body,
            }),
        }),
        _create_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Create_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_SHOP,
                method: 'POST',
                body,
            }),
        }),
        _create_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Create_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_DEPOT,
                method: 'POST',
                body,
            }),
        }),
        _create_Store_: builder.mutation<My_Response_Field<Store_Field>, Create_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_STORE,
                method: 'POST',
                body,
            }),
        }),
        _edit_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Edit_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_SHOP,
                method: 'POST',
                body,
            }),
        }),
        _edit_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Edit_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_DEPOT,
                method: 'POST',
                body,
            }),
        }),
        _edit_Store_: builder.mutation<My_Response_Field<Store_Field>, Edit_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_STORE,
                method: 'POST',
                body,
            }),
        }),
        _delete_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Delete_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_SHOP,
                method: 'POST',
                body,
            }),
        }),
        _delete_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Delete_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_DEPOT,
                method: 'POST',
                body,
            }),
        }),
        _delete_Store_: builder.mutation<My_Response_Field<Store_Field>, Delete_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_STORE,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazy_get_My_Shops_Query,
    useLazy_get_My_Depots_Query,
    useLazy_get_My_Stores_Query,
    use_create_Shop_Mutation,
    use_create_Depot_Mutation,
    use_create_Store_Mutation,
    use_edit_Shop_Mutation,
    use_edit_Depot_Mutation,
    use_edit_Store_Mutation,
    use_delete_Shop_Mutation,
    use_delete_Depot_Mutation,
    use_delete_Store_Mutation,
} = shop_RTK;
