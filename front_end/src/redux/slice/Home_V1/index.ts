import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Home_V1/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    selected_oa: undefined,
};

const Home_V1_Slice = createSlice({
    name: 'Home_V1_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__selected_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.selected_oa = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__selected_oa } = Home_V1_Slice.actions;
export default Home_V1_Slice.reducer;
