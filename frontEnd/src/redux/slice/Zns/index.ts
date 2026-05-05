import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Zns/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { ZaloOaField, ZnsTemplateField } from '@src/dataStruct/zalo';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedOa: undefined,
    newZnsTemplates: [],
};

const ZnsSlice = createSlice({
    name: 'ZnsSlice',
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
        setData_addNewZnsTemplate: (state, action: PayloadAction<ZnsTemplateField>) => {
            state.newZnsTemplates = [...state.newZnsTemplates, action.payload];
        },
        clear_newZnsTemplates: (state) => {
            state.newZnsTemplates = [];
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_selectedOa, setData_addNewZnsTemplate, clear_newZnsTemplates } =
    ZnsSlice.actions;
export default ZnsSlice.reducer;
