import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Member/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    searched_account_id: '',
    new_member: undefined,
};

const Member_Slice = createSlice({
    name: 'Member_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__data__searched_account_id: (state, action: PayloadAction<string>) => {
            state.searched_account_id = action.payload;
        },
        set__data__new_member: (state, action: PayloadAction<Account_Field>) => {
            state.new_member = action.payload;
        },
    },
});

export const { set__is_loading, set__data__toast_message, set__data__searched_account_id, set__data__new_member } =
    Member_Slice.actions;
export default Member_Slice.reducer;
