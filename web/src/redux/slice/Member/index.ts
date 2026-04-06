import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Member/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    searchedAccountId: '',
    newMember: undefined,
};

const MemberSlice = createSlice({
    name: 'MemberSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        setData_searchedAccountId: (state, action: PayloadAction<string>) => {
            state.searchedAccountId = action.payload;
        },
        setData_newMember: (state, action: PayloadAction<AccountField>) => {
            state.newMember = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, setData_searchedAccountId, setData_newMember } =
    MemberSlice.actions;
export default MemberSlice.reducer;
