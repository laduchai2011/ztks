import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ForgetPassword/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    otpDialog: {
        isShow: false,
        input: '',
        token: '',
    },
};

const ForgetPasswordSlice = createSlice({
    name: 'ForgetPasswordSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setIsShow_otpDialog: (state, action: PayloadAction<boolean>) => {
            state.otpDialog.isShow = action.payload;
        },
        setToken_otpDialog: (state, action: PayloadAction<string>) => {
            state.otpDialog.token = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setIsShow_otpDialog, setToken_otpDialog } =
    ForgetPasswordSlice.actions;
export default ForgetPasswordSlice.reducer;
