import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Shop/type';
import { Shop_Field, Depot_Field } from '@src/data_struct/shop';

const initialState: state_props = {
    is_show_create_shop: false,
    is_show_edit_shop: false,
    is_show_delete_shop: false,
    selected_shop: undefined,
    new_shop: undefined,
    selected_edit_shop: undefined,
    edited_shop: undefined,
    selected_delete_shop: undefined,
    deleted_shop: undefined,

    is_show_create_depot: false,
    selected_depot: undefined,
    depot_list: [],
};

const Shop_Slice = createSlice({
    name: 'Shop_Slice',
    initialState,
    reducers: {
        set__is_show_create_shop: (state, action: PayloadAction<boolean>) => {
            state.is_show_create_shop = action.payload;
        },
        set__is_show_edit_shop: (state, action: PayloadAction<boolean>) => {
            state.is_show_edit_shop = action.payload;
        },
        set__is_show_delete_shop: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_shop = action.payload;
        },
        set__selected_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.selected_shop = action.payload;
        },
        set__new_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.new_shop = action.payload;
        },
        set__selected_edit_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.selected_edit_shop = action.payload;
        },
        set__edited_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.edited_shop = action.payload;
        },
        set__selected_delete_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.selected_delete_shop = action.payload;
        },
        set__deleted_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.deleted_shop = action.payload;
        },
    },
});

export const {
    set__is_show_create_shop,
    set__is_show_edit_shop,
    set__is_show_delete_shop,
    set__selected_shop,
    set__new_shop,
    set__selected_edit_shop,
    set__edited_shop,
    set__selected_delete_shop,
    set__deleted_shop,
} = Shop_Slice.actions;
export default Shop_Slice.reducer;
