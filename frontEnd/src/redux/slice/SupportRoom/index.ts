import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/SupportRoom/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField } from '@src/dataStruct/zalo';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
};

const SupportRoomSlice = createSlice({
    name: 'SupportRoomSlice',
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
    },
});

export const { set_isLoading, setData_toastMessage, set_selectedOa } = SupportRoomSlice.actions;
export default SupportRoomSlice.reducer;
