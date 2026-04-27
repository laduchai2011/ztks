import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Home/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    registerPostId: undefined,
    zaloOa: undefined,
};

const HomeSlice = createSlice({
    name: 'HomeSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_registerPostId: (state, action: PayloadAction<number | undefined>) => {
            state.registerPostId = action.payload;
        },
        set_zaloOa: (state, action: PayloadAction<ZaloOaField | undefined>) => {
            state.zaloOa = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_registerPostId, set_zaloOa } = HomeSlice.actions;
export default HomeSlice.reducer;
