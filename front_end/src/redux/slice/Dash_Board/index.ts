import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/DashBoard/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Statistics_Oa_Field } from '@src/data_struct/statistics';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    selected_oa: undefined,
    statistics_oa_array: [],
};

const Dash_Board_Slice = createSlice({
    name: 'Dash_Board_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__selected_oa: (state, action: PayloadAction<Zalo_Oa_Field>) => {
            state.selected_oa = action.payload;
        },
        set__statistics_oa_array: (state, action: PayloadAction<Statistics_Oa_Field[]>) => {
            state.statistics_oa_array = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__selected_oa, set__statistics_oa_array } =
    Dash_Board_Slice.actions;
export default Dash_Board_Slice.reducer;
