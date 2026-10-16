import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Shop_Field,
    Cursor_Shop_Field,
    Depot_Field,
    Cursor_Depot_Field,
    Store_Field,
    Cursor_Store_Field,
    Shop_Role_Field,
    Shop_Role_Statistics_Field,
    Depot_Role_Field,
    Depot_Role_Statistics_Field,
    Team_Shop_Field,
    Team_Shop_Depot_Field,
    Team_Shop_Depot_Store_Field,
    Cursor_Team_Shop_Field,
    Cursor_Team_Shop_Depot_Field,
    Cursor_Team_Shop_Depot_Store_Field,
} from '@src/data_struct/shop';
import {
    Get_Shop_By_Id_Body_Field,
    Get_Depot_By_Id_Body_Field,
    Get_Store_By_Id_Body_Field,
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
    Get_Shop_Role_Statistics_For_One_Team_Body_Field,
    Get_Shop_Role_For_One_Account_Body_Field,
    Admin_Set_Shop_Role_For_One_Account_Body_Field,
    Admin_Set_Shop_Role_For_One_Team_Body_Field,
    Leader_Set_Shop_Role_For_One_Account_Body_Field,
    Leader_Set_Shop_Role_For_One_Team_Body_Field,
    Get_Depot_Role_Statistics_For_One_Team_Body_Field,
    Get_Depot_Role_For_One_Account_Body_Field,
    Admin_Set_Depot_Role_For_One_Account_Body_Field,
    Admin_Set_Depot_Role_For_One_Team_Body_Field,
    Leader_Set_Depot_Role_For_One_Account_Body_Field,
    Leader_Set_Depot_Role_For_One_Team_Body_Field,
    Get_Team_Shops_Body_Field,
    Get_Team_Shop_Depots_Body_Field,
    Get_Team_Shop_Depot_Stores_Body_Field,
    Add_Team_Shop_Body_Field,
    Add_Team_Shop_Depot_Body_Field,
    Add_Team_Shop_Depot_Store_Body_Field,
    Lock_Team_Shop_Body_Field,
    Lock_Team_Shop_Depot_Body_Field,
    Lock_Team_Shop_Depot_Store_Body_Field,
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
    tagTypes: [
        'Shop',
        'Depot',
        'Store',
        'Shop_Role_Statistics',
        'Shop_Role',
        'Depot_Role_Statistics',
        'Depot_Role',
        'Team_Shop',
        'Team_Shop_Depot',
        'Team_Shop_Depot_Store',
    ],
    endpoints: (builder) => ({
        _get_Shop_By_Id_: builder.query<My_Response_Field<Shop_Field>, Get_Shop_By_Id_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_SHOP_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Shop', id: 'LIST' },
                ...(result?.data ? [{ type: 'Shop' as const, id: result.data.id }] : []),
            ],
        }),
        _get_Depot_By_Id_: builder.query<My_Response_Field<Depot_Field>, Get_Depot_By_Id_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_DEPOT_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Depot', id: 'LIST' },
                ...(result?.data ? [{ type: 'Depot' as const, id: result.data.id }] : []),
            ],
        }),
        _get_Store_By_Id_: builder.query<My_Response_Field<Store_Field>, Get_Store_By_Id_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_STORE_BY_ID,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Store', id: 'LIST' },
                ...(result?.data ? [{ type: 'Store' as const, id: result.data.id }] : []),
            ],
        }),
        _get_My_Shops_: builder.query<My_Response_Field<Cursor_Shop_Field>, Get_My_Shops_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_SHOPS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Shop', id: 'LIST' },

                ...(result?.data?.items ?? []).map((shop) => ({
                    type: 'Shop' as const,
                    id: shop.id,
                })),
            ],
        }),
        _get_My_Depots_: builder.query<My_Response_Field<Cursor_Depot_Field>, Get_My_Depots_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_DEPOTS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Depot', id: 'LIST' },

                ...(result?.data?.items ?? []).map((depot) => ({
                    type: 'Depot' as const,
                    id: depot.id,
                })),
            ],
        }),
        _get_My_Stores_: builder.query<My_Response_Field<Cursor_Store_Field>, Get_My_Stores_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_MY_STORES,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Store', id: 'LIST' },

                ...(result?.data?.items ?? []).map((store) => ({
                    type: 'Store' as const,
                    id: store.id,
                })),
            ],
        }),
        _get_Team_Shops_: builder.query<My_Response_Field<Cursor_Team_Shop_Field>, Get_Team_Shops_Body_Field>({
            query: (body) => ({
                url: SHOP_API.GET_TEAM_SHOPS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team_Shop', id: 'LIST' },

                ...(result?.data?.items ?? []).map((team_shop) => ({
                    type: 'Team_Shop' as const,
                    id: team_shop.id,
                })),
            ],
        }),
        _get_Team_Shop_Depots_: builder.query<
            My_Response_Field<Cursor_Team_Shop_Depot_Field>,
            Get_Team_Shop_Depots_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_TEAM_SHOP_DEPOTS,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team_Shop_Depot', id: 'LIST' },

                ...(result?.data?.items ?? []).map((team_shop_depot) => ({
                    type: 'Team_Shop_Depot' as const,
                    id: team_shop_depot.id,
                })),
            ],
        }),
        _get_Team_Shop_Depot_Stores_: builder.query<
            My_Response_Field<Cursor_Team_Shop_Depot_Store_Field>,
            Get_Team_Shop_Depot_Stores_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_TEAM_SHOP_DEPOT_STORES,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [
                { type: 'Team_Shop_Depot_Store', id: 'LIST' },

                ...(result?.data?.items ?? []).map((team_shop_depot_store) => ({
                    type: 'Team_Shop_Depot_Store' as const,
                    id: team_shop_depot_store.id,
                })),
            ],
        }),
        _get_Shop_Role_Statistics_For_One_Team_: builder.query<
            My_Response_Field<Shop_Role_Statistics_Field>,
            Get_Shop_Role_Statistics_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_SHOP_ROLE_STATISTICS_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            providesTags: ['Shop_Role_Statistics'],
        }),
        _get_Shop_Role_For_One_Account_: builder.query<
            My_Response_Field<Shop_Role_Field>,
            Get_Shop_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_SHOP_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [{ type: 'Shop_Role', id: result?.data?.id }],
        }),
        _get_Depot_Role_Statistics_For_One_Team_: builder.query<
            My_Response_Field<Depot_Role_Statistics_Field>,
            Get_Depot_Role_Statistics_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_DEPOT_ROLE_STATISTICS_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            providesTags: ['Depot_Role_Statistics'],
        }),
        _get_Depot_Role_For_One_Account_: builder.query<
            My_Response_Field<Depot_Role_Field>,
            Get_Depot_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.GET_DEPOT_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            providesTags: (result) => [{ type: 'Depot_Role', id: result?.data?.id }],
        }),
        _create_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Create_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_SHOP,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Shop', id: 'LIST' }],
        }),
        _create_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Create_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_DEPOT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Depot', id: 'LIST' }],
        }),
        _create_Store_: builder.mutation<My_Response_Field<Store_Field>, Create_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.CREATE_STORE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Store', id: 'LIST' }],
        }),
        _edit_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Edit_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_SHOP,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Shop', id: body.id }],
        }),
        _edit_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Edit_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_DEPOT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Depot', id: body.id }],
        }),
        _edit_Store_: builder.mutation<My_Response_Field<Store_Field>, Edit_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.EDIT_STORE,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Store', id: body.id }],
        }),
        _delete_Shop_: builder.mutation<My_Response_Field<Shop_Field>, Delete_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_SHOP,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Shop', id: 'LIST' }],
        }),
        _delete_Depot_: builder.mutation<My_Response_Field<Depot_Field>, Delete_Depot_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_DEPOT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Depot', id: 'LIST' }],
        }),
        _delete_Store_: builder.mutation<My_Response_Field<Store_Field>, Delete_Store_Body_Field>({
            query: (body) => ({
                url: SHOP_API.DELETE_STORE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Store', id: 'LIST' }],
        }),
        _admin_Set_Shop_Role_For_One_Account_: builder.mutation<
            My_Response_Field<Shop_Role_Field>,
            Admin_Set_Shop_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADMIN_SET_SHOP_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result) => [{ type: 'Shop_Role', id: _result?.data?.id }],
        }),
        _admin_Set_Shop_Role_For_One_Team_: builder.mutation<
            My_Response_Field<Shop_Role_Field[]>,
            Admin_Set_Shop_Role_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADMIN_SET_SHOP_ROLE_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Shop_Role', id: 'LIST' }],
        }),
        _leader_Set_Shop_Role_For_One_Account_: builder.mutation<
            My_Response_Field<Shop_Role_Field>,
            Leader_Set_Shop_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LEADER_SET_SHOP_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result) => [{ type: 'Shop_Role', id: _result?.data?.id }],
        }),
        _leader_Set_Shop_Role_For_One_Team_: builder.mutation<
            My_Response_Field<Shop_Role_Field[]>,
            Leader_Set_Shop_Role_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LEADER_SET_SHOP_ROLE_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Shop_Role', id: 'LIST' }],
        }),
        _admin_Set_Depot_Role_For_One_Account_: builder.mutation<
            My_Response_Field<Depot_Role_Field>,
            Admin_Set_Depot_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADMIN_SET_DEPOT_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result) => [{ type: 'Depot_Role', id: _result?.data?.id }],
        }),
        _admin_Set_Depot_Role_For_One_Team_: builder.mutation<
            My_Response_Field<Depot_Role_Field[]>,
            Admin_Set_Depot_Role_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADMIN_SET_DEPOT_ROLE_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Depot_Role', id: 'LIST' }],
        }),
        _leader_Set_Depot_Role_For_One_Account_: builder.mutation<
            My_Response_Field<Depot_Role_Field>,
            Leader_Set_Depot_Role_For_One_Account_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LEADER_SET_DEPOT_ROLE_FOR_ONE_ACCOUNT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result) => [{ type: 'Depot_Role', id: _result?.data?.id }],
        }),
        _leader_Set_Depot_Role_For_One_Team_: builder.mutation<
            My_Response_Field<Depot_Role_Field[]>,
            Leader_Set_Depot_Role_For_One_Team_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LEADER_SET_DEPOT_ROLE_FOR_ONE_TEAM,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Depot_Role', id: 'LIST' }],
        }),
        _add_Team_Shop_: builder.mutation<My_Response_Field<Team_Shop_Field>, Add_Team_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.ADD_TEAM_SHOP,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team_Shop', id: 'LIST' }],
        }),
        _add_Team_Shop_Depot_: builder.mutation<
            My_Response_Field<Team_Shop_Depot_Field>,
            Add_Team_Shop_Depot_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADD_TEAM_SHOP_DEPOT,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team_Shop_Depot', id: 'LIST' }],
        }),
        _add_Team_Shop_Depot_Store_: builder.mutation<
            My_Response_Field<Team_Shop_Depot_Store_Field>,
            Add_Team_Shop_Depot_Store_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.ADD_TEAM_SHOP_DEPOT_STORE,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Team_Shop_Depot_Store', id: 'LIST' }],
        }),
        _lock_Team_Shop_: builder.mutation<My_Response_Field<Team_Shop_Field>, Lock_Team_Shop_Body_Field>({
            query: (body) => ({
                url: SHOP_API.LOCK_TEAM_SHOP,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Team_Shop', id: body.id }],
        }),
        _lock_Team_Shop_Depot_: builder.mutation<
            My_Response_Field<Team_Shop_Depot_Field>,
            Lock_Team_Shop_Depot_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LOCK_TEAM_SHOP_DEPOT,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Team_Shop_Depot', id: body.id }],
        }),
        _lock_Team_Shop_Depot_Store_: builder.mutation<
            My_Response_Field<Team_Shop_Depot_Store_Field>,
            Lock_Team_Shop_Depot_Store_Body_Field
        >({
            query: (body) => ({
                url: SHOP_API.LOCK_TEAM_SHOP_DEPOT_STORE,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: 'Team_Shop_Depot_Store', id: body.id }],
        }),
    }),
});

export const {
    useLazy_get_Shop_By_Id_Query,
    useLazy_get_Depot_By_Id_Query,
    useLazy_get_Store_By_Id_Query,
    useLazy_get_My_Shops_Query,
    useLazy_get_My_Depots_Query,
    useLazy_get_My_Stores_Query,
    useLazy_get_Team_Shops_Query,
    useLazy_get_Team_Shop_Depots_Query,
    useLazy_get_Team_Shop_Depot_Stores_Query,
    useLazy_get_Shop_Role_Statistics_For_One_Team_Query,
    useLazy_get_Shop_Role_For_One_Account_Query,
    useLazy_get_Depot_Role_Statistics_For_One_Team_Query,
    useLazy_get_Depot_Role_For_One_Account_Query,
    use_create_Shop_Mutation,
    use_create_Depot_Mutation,
    use_create_Store_Mutation,
    use_edit_Shop_Mutation,
    use_edit_Depot_Mutation,
    use_edit_Store_Mutation,
    use_delete_Shop_Mutation,
    use_delete_Depot_Mutation,
    use_delete_Store_Mutation,
    use_admin_Set_Shop_Role_For_One_Account_Mutation,
    use_admin_Set_Shop_Role_For_One_Team_Mutation,
    use_leader_Set_Shop_Role_For_One_Account_Mutation,
    use_leader_Set_Shop_Role_For_One_Team_Mutation,
    use_admin_Set_Depot_Role_For_One_Account_Mutation,
    use_admin_Set_Depot_Role_For_One_Team_Mutation,
    use_leader_Set_Depot_Role_For_One_Account_Mutation,
    use_leader_Set_Depot_Role_For_One_Team_Mutation,
    use_add_Team_Shop_Mutation,
    use_add_Team_Shop_Depot_Mutation,
    use_add_Team_Shop_Depot_Store_Mutation,
    use_lock_Team_Shop_Mutation,
    use_lock_Team_Shop_Depot_Mutation,
    use_lock_Team_Shop_Depot_Store_Mutation,
} = shop_RTK;
