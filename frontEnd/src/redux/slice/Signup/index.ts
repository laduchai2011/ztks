import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Signup/type';
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

const SignupSlice = createSlice({
    name: 'SignupSlice',
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
        setInput_otpDialog: (state, action: PayloadAction<string>) => {
            state.otpDialog.input = action.payload;
        },
        setToken_otpDialog: (state, action: PayloadAction<string>) => {
            state.otpDialog.token = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setIsShow_otpDialog, setInput_otpDialog, setToken_otpDialog } =
    SignupSlice.actions;
export default SignupSlice.reducer;
