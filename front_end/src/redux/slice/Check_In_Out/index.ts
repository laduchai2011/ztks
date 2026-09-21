import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/CheckInOut/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Check_In_Out_Field } from '@src/data_struct/check_in_out';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    check_in_outs: [],
};

const Check_In_Out_Slice = createSlice({
    name: 'Check_In_Out_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__add_data__check_in_outs: (state, action: PayloadAction<Check_In_Out_Field>) => {
            state.check_in_outs = [...state.check_in_outs, action.payload];
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__add_data__check_in_outs } = Check_In_Out_Slice.actions;
export default Check_In_Out_Slice.reducer;
