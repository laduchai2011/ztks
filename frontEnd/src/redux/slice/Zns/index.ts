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
    newZnsTemplate: undefined,
    newZnsTemplates: [],
    editZnsTemplateDialog: {
        isShow: false,
        znsTemplate: undefined,
        newZnsTemplate: undefined,
    },
    sendTemplateDialog: {
        isShow: false,
        znsTemplate: undefined,
    },
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
        set_newZnsTemplate: (state, action: PayloadAction<ZnsTemplateField | undefined>) => {
            state.newZnsTemplate = action.payload;
        },
        setData_addNewZnsTemplate: (state, action: PayloadAction<ZnsTemplateField>) => {
            state.newZnsTemplates = [...state.newZnsTemplates, action.payload];
        },
        clear_newZnsTemplates: (state) => {
            state.newZnsTemplates = [];
        },
        setIsShow_editZnsTemplateDialog: (state, action: PayloadAction<boolean>) => {
            state.editZnsTemplateDialog.isShow = action.payload;
        },
        setZnsTemplate_editZnsTemplateDialog: (state, action: PayloadAction<ZnsTemplateField | undefined>) => {
            state.editZnsTemplateDialog.znsTemplate = action.payload;
        },
        setNewZnsTemplate_editZnsTemplateDialog: (state, action: PayloadAction<ZnsTemplateField | undefined>) => {
            state.editZnsTemplateDialog.newZnsTemplate = action.payload;
        },
        setIsShow_sendTemplateDialog: (state, action: PayloadAction<boolean>) => {
            state.sendTemplateDialog.isShow = action.payload;
        },
        setZnsTemplate_sendTemplateDialog: (state, action: PayloadAction<ZnsTemplateField | undefined>) => {
            state.sendTemplateDialog.znsTemplate = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_selectedOa,
    set_newZnsTemplate,
    setData_addNewZnsTemplate,
    clear_newZnsTemplates,
    setIsShow_editZnsTemplateDialog,
    setZnsTemplate_editZnsTemplateDialog,
    setNewZnsTemplate_editZnsTemplateDialog,
    setIsShow_sendTemplateDialog,
    setZnsTemplate_sendTemplateDialog,
} = ZnsSlice.actions;
export default ZnsSlice.reducer;
