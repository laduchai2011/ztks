import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Profile/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    editInforDialog: {
        isShow: false,
    },
};

const ProfileSlice = createSlice({
    name: 'ProfileSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setIsShow_editInforDialog: (state, action: PayloadAction<boolean>) => {
            state.editInforDialog.isShow = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setIsShow_editInforDialog } = ProfileSlice.actions;
export default ProfileSlice.reducer;
