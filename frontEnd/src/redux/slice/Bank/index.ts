import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Bank/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { BankField } from '@src/dataStruct/bank';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    addBank: {
        newBank: undefined,
    },
    editBankDialog: {
        isShow: false,
        bank: undefined,
        newBank: undefined,
    },
    deleteBankDialog: {
        isShow: false,
        bank: undefined,
        deletedBank: undefined,
    },
};

const BankSlice = createSlice({
    name: 'BankSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setNewBank_addBank: (state, action: PayloadAction<BankField | undefined>) => {
            state.addBank.newBank = action.payload;
        },
        setIsShow_editBankDialog: (state, action: PayloadAction<boolean>) => {
            state.editBankDialog.isShow = action.payload;
        },
        setBank_editBankDialog: (state, action: PayloadAction<BankField | undefined>) => {
            state.editBankDialog.bank = action.payload;
        },
        setNewBank_editBankDialog: (state, action: PayloadAction<BankField | undefined>) => {
            state.editBankDialog.newBank = action.payload;
        },
        setIsShow_deleteBankDialog: (state, action: PayloadAction<boolean>) => {
            state.deleteBankDialog.isShow = action.payload;
        },
        setBank_deleteBankDialog: (state, action: PayloadAction<BankField | undefined>) => {
            state.deleteBankDialog.bank = action.payload;
        },
        setDeletedBank_deleteBankDialog: (state, action: PayloadAction<BankField | undefined>) => {
            state.deleteBankDialog.deletedBank = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    setNewBank_addBank,
    setIsShow_editBankDialog,
    setBank_editBankDialog,
    setNewBank_editBankDialog,
    setIsShow_deleteBankDialog,
    setBank_deleteBankDialog,
    setDeletedBank_deleteBankDialog,
} = BankSlice.actions;
export default BankSlice.reducer;
