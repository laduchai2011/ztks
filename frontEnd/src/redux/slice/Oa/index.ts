import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Oa/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    takeTokenDialog: {
        isShow: false,
        zaloOa: undefined,
    },
};

const OaSlice = createSlice({
    name: 'OaSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setIsShow_takeTokenDialog: (state, action: PayloadAction<boolean>) => {
            state.takeTokenDialog.isShow = action.payload;
        },
        setZaloOa_takeTokenDialog: (state, action: PayloadAction<ZaloOaField | undefined>) => {
            state.takeTokenDialog.zaloOa = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setIsShow_takeTokenDialog, setZaloOa_takeTokenDialog } =
    OaSlice.actions;
export default OaSlice.reducer;
