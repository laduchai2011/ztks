import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Post/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RegisterPostField, PostField } from '@src/dataStruct/post';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    selectedRegisterPost: undefined,
    postList: [],
    editPostDialog: {
        isShow: true,
        post: undefined,
        newPost: undefined,
    },
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
        set_postList: (state, action: PayloadAction<PostField[]>) => {
            state.postList = action.payload;
        },
        add_postList: (state, action: PayloadAction<PostField>) => {
            state.postList = [action.payload, ...state.postList];
        },
        setIsShow_editPostDialog: (state, action: PayloadAction<boolean>) => {
            state.editPostDialog.isShow = action.payload;
        },
        setPost_editPostDialog: (state, action: PayloadAction<PostField | undefined>) => {
            state.editPostDialog.post = action.payload;
        },
        setNewPost_editPostDialog: (state, action: PayloadAction<PostField | undefined>) => {
            state.editPostDialog.newPost = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_selectedRegisterPost,
    set_postList,
    add_postList,
    setIsShow_editPostDialog,
    setPost_editPostDialog,
    setNewPost_editPostDialog,
} = PostSlice.actions;
export default PostSlice.reducer;
