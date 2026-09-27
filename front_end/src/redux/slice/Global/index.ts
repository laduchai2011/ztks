import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { global_state_props } from '@src/Global/global_state';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const initialState: global_state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
};

const Global_Slice = createSlice({
    name: 'Global_Slice',
    initialState,
    reducers: {
        global_set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        global_set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
    },
});

export const { global_set__is_loading, global_set__data__toast_message } = Global_Slice.actions;
export default Global_Slice.reducer;
