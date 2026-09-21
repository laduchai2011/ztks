import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/CheckInOut/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { CheckInOutField } from '@src/dataStruct/checkInOut';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    checkInOuts: [],
};

const CheckInOutSlice = createSlice({
    name: 'CheckInOutSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setAddData_checkInOuts: (state, action: PayloadAction<CheckInOutField>) => {
            state.checkInOuts = [...state.checkInOuts, action.payload];
        },
    },
});

export const { set_isLoading, setData_toastMessage, setAddData_checkInOuts } = CheckInOutSlice.actions;
export default CheckInOutSlice.reducer;
