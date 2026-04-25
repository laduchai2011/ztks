import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/RegisterPost/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    getRegisterPostsBody: undefined,
};

const RegisterPostSlice = createSlice({
    name: 'RegisterPostSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_getRegisterPostsBody: (state, action: PayloadAction<GetRegisterPostsBodyField>) => {
            state.getRegisterPostsBody = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_getRegisterPostsBody } = RegisterPostSlice.actions;
export default RegisterPostSlice.reducer;
