import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Signup/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    otp_dialog: {
        is_show: false,
        input: '',
        token: '',
    },
};

const Signup_Slice = createSlice({
    name: 'Signup_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__is_show__otp_dialog: (state, action: PayloadAction<boolean>) => {
            state.otp_dialog.is_show = action.payload;
        },
        // setInput_otpDialog: (state, action: PayloadAction<string>) => {
        //     state.otpDialog.input = action.payload;
        // },
        set__token__otp_dialog: (state, action: PayloadAction<string>) => {
            state.otp_dialog.token = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__is_show__otp_dialog, set__token__otp_dialog } =
    Signup_Slice.actions;
export default Signup_Slice.reducer;
