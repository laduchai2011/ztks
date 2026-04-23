import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/RequireTakeMoney/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    filterBody: undefined,
};

const RequireTakeMoneySlice = createSlice({
    name: 'RequireTakeMoneySlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setData_filterBody: (state, action: PayloadAction<MemberZtksGetRequiresTakeMoneyBodyField | undefined>) => {
            state.filterBody = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setData_filterBody } = RequireTakeMoneySlice.actions;
export default RequireTakeMoneySlice.reducer;
