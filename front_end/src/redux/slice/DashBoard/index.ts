import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/DashBoard/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { StatisticsOaField } from '@src/dataStruct/statistics';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
    statisticsOaArray: [],
};

const DashBoardSlice = createSlice({
    name: 'DashBoardSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_selectedOa: (state, action: PayloadAction<ZaloOaField>) => {
            state.selectedOa = action.payload;
        },
        set_statisticsOaArray: (state, action: PayloadAction<StatisticsOaField[]>) => {
            state.statisticsOaArray = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_selectedOa, set_statisticsOaArray } = DashBoardSlice.actions;
export default DashBoardSlice.reducer;
