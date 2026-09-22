import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Post/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Register_Post_Field, Post_Field } from '@src/data_struct/post';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    selected_register_post: undefined,
    post_list: [],
    edit_post_dialog: {
        is_show: false,
        post: undefined,
        new_post: undefined,
    },
};

const Post_Slice = createSlice({
    name: 'Post_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__selected_register_post: (state, action: PayloadAction<Register_Post_Field | undefined>) => {
            state.selected_register_post = action.payload;
        },
        set__post_list: (state, action: PayloadAction<Post_Field[]>) => {
            state.post_list = action.payload;
        },
        add__post_list: (state, action: PayloadAction<Post_Field>) => {
            state.post_list = [action.payload, ...state.post_list];
        },
        set__is_show__edit_post_dialog: (state, action: PayloadAction<boolean>) => {
            state.edit_post_dialog.is_show = action.payload;
        },
        set__post__edit_post_dialog: (state, action: PayloadAction<Post_Field | undefined>) => {
            state.edit_post_dialog.post = action.payload;
        },
        set__new_post__edit_post_dialog: (state, action: PayloadAction<Post_Field | undefined>) => {
            state.edit_post_dialog.new_post = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__selected_register_post,
    set__post_list,
    add__post_list,
    set__is_show__edit_post_dialog,
    set__post__edit_post_dialog,
    set__new_post__edit_post_dialog,
} = Post_Slice.actions;
export default Post_Slice.reducer;
