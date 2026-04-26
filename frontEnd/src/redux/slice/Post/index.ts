import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Post/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RegisterPostField } from '@src/dataStruct/post';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedRegisterPost: undefined,
};

const PostSlice = createSlice({
    name: 'PostSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_selectedRegisterPost: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.selectedRegisterPost = action.payload;
        },
    },
});

export const { set_isLoading, setData_toastMessage, set_selectedRegisterPost } = PostSlice.actions;
export default PostSlice.reducer;
