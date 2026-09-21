import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/CheckInOutManager/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
};

const Check_In_Out_Manager_Slice = createSlice({
    name: 'CheckInOutManagerSlice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message } = Check_In_Out_Manager_Slice.actions;
export default Check_In_Out_Manager_Slice.reducer;
