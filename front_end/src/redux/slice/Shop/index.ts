import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Shop/type';
import { Shop_Field, Depot_Field, Store_Field } from '@src/data_struct/shop';

const initialState: state_props = {
    // shop
    is_show_create_shop: false,
    is_show_edit_shop: false,
    is_show_delete_shop: false,
    selected_shop: undefined,
    new_shop: undefined,
    selected_edit_shop: undefined,
    edited_shop: undefined,
    selected_delete_shop: undefined,
    deleted_shop: undefined,

    // depot
    is_show_create_depot: false,
    is_show_edit_depot: false,
    is_show_delete_depot: false,
    selected_depot: undefined,
    new_depot: undefined,
    selected_edit_depot: undefined,
    edited_depot: undefined,
    selected_delete_depot: undefined,
    deleted_depot: undefined,

    // store
    is_show_create_store: false,
    is_show_edit_store: false,
    is_show_delete_store: false,
    selected_store: undefined,
    new_store: undefined,
    selected_edit_store: undefined,
    edited_store: undefined,
    selected_delete_store: undefined,
    deleted_store: undefined,
};

const Shop_Slice = createSlice({
    name: 'Shop_Slice',
    initialState,
    reducers: {
        // shop
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

        // depot
        set__is_show_create_depot: (state, action: PayloadAction<boolean>) => {
            state.is_show_create_depot = action.payload;
        },
        set__is_show_edit_depot: (state, action: PayloadAction<boolean>) => {
            state.is_show_edit_depot = action.payload;
        },
        set__is_show_delete_depot: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_depot = action.payload;
        },
        set__selected_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.selected_depot = action.payload;
        },
        set__new_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.new_depot = action.payload;
        },
        set__selected_edit_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.selected_edit_depot = action.payload;
        },
        set__edited_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.edited_depot = action.payload;
        },
        set__selected_delete_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.selected_delete_depot = action.payload;
        },
        set__deleted_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.deleted_depot = action.payload;
        },

        // store
        set__is_show_create_store: (state, action: PayloadAction<boolean>) => {
            state.is_show_create_store = action.payload;
        },
        set__is_show_edit_store: (state, action: PayloadAction<boolean>) => {
            state.is_show_edit_store = action.payload;
        },
        set__is_show_delete_store: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_store = action.payload;
        },
        set__selected_store: (state, action: PayloadAction<Store_Field>) => {
            state.selected_store = action.payload;
        },
        set__new_store: (state, action: PayloadAction<Store_Field>) => {
            state.new_store = action.payload;
        },
        set__selected_edit_store: (state, action: PayloadAction<Store_Field>) => {
            state.selected_edit_store = action.payload;
        },
        set__edited_store: (state, action: PayloadAction<Store_Field>) => {
            state.edited_store = action.payload;
        },
        set__selected_delete_store: (state, action: PayloadAction<Store_Field>) => {
            state.selected_delete_store = action.payload;
        },
        set__deleted_store: (state, action: PayloadAction<Store_Field>) => {
            state.deleted_store = action.payload;
        },
    },
});

export const {
    // shop
    set__is_show_create_shop,
    set__is_show_edit_shop,
    set__is_show_delete_shop,
    set__selected_shop,
    set__new_shop,
    set__selected_edit_shop,
    set__edited_shop,
    set__selected_delete_shop,
    set__deleted_shop,

    // depot
    set__is_show_create_depot,
    set__is_show_edit_depot,
    set__is_show_delete_depot,
    set__selected_depot,
    set__new_depot,
    set__selected_edit_depot,
    set__edited_depot,
    set__selected_delete_depot,
    set__deleted_depot,

    // store
    set__is_show_create_store,
    set__is_show_edit_store,
    set__is_show_delete_store,
    set__selected_store,
    set__new_store,
    set__selected_edit_store,
    set__edited_store,
    set__selected_delete_store,
    set__deleted_store,
} = Shop_Slice.actions;
export default Shop_Slice.reducer;
