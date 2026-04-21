import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Wallet/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { WalletField, RequireTakeMoneyField } from '@src/dataStruct/wallet';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    takeMoneyDialog: {
        isShow: false,
        wallet: undefined,
        requiredTakeMoney: undefined,
        newRequiredTakeMoney: undefined,
    },
};

const WalletSlice = createSlice({
    name: 'WalletSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setIsShow_takeMoneyDialog: (state, action: PayloadAction<boolean>) => {
            state.takeMoneyDialog.isShow = action.payload;
        },
        setWallet_takeMoneyDialog: (state, action: PayloadAction<WalletField | undefined>) => {
            state.takeMoneyDialog.wallet = action.payload;
        },
        setRequiredTakeMoney_takeMoneyDialog: (state, action: PayloadAction<RequireTakeMoneyField | undefined>) => {
            state.takeMoneyDialog.requiredTakeMoney = action.payload;
        },
        setNewRequiredTakeMoney_takeMoneyDialog: (state, action: PayloadAction<RequireTakeMoneyField | undefined>) => {
            state.takeMoneyDialog.newRequiredTakeMoney = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    setIsShow_takeMoneyDialog,
    setWallet_takeMoneyDialog,
    setRequiredTakeMoney_takeMoneyDialog,
    setNewRequiredTakeMoney_takeMoneyDialog,
} = WalletSlice.actions;
export default WalletSlice.reducer;
