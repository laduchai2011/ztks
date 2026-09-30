import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Shop/type';
import { Shop_Field, Depot_Field } from '@src/data_struct/shop';

const initialState: state_props = {
    is_show_create_shop: false,
    selected_shop: undefined,
    shop_list: [],
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
        add__shop_list: (state, action: PayloadAction<Shop_Field[]>) => {
            state.shop_list = [...state.shop_list, ...action.payload];
        },
        set__selected_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.selected_shop = action.payload;
        },
        add__new_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.shop_list = [action.payload, ...state.shop_list];
        },
    },
});

export const { set__is_show_create_shop, add__shop_list, set__selected_shop, add__new_shop } = Shop_Slice.actions;
export default Shop_Slice.reducer;
