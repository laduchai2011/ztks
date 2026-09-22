import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/RegisterPost/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Posts_Body_Field } from '@src/data_struct/post/body';

const initialState: state_props = {
    is_loading: false,
    toast_message: {
        data: { type: undefined, message: '' },
    },
    get_register_posts_body: undefined,
    new_register_post_of_create: undefined,
    edit_register_post_dialog: {
        is_show: false,
        register_post: undefined,
        new_register_post: undefined,
    },
    delete_register_post_dialog: {
        is_show: false,
        register_post: undefined,
        new_register_post: undefined,
    },
};

const Register_Post_Slice = createSlice({
    name: 'Register_Post_Slice',
    initialState,
    reducers: {
        set__is_loading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        },
        set__data__toast_message: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toast_message.data = action.payload;
        },
        set__get_register_posts_body: (state, action: PayloadAction<Get_Register_Posts_Body_Field>) => {
            state.get_register_posts_body = action.payload;
        },
        set__new_register_post_of_create: (state, action: PayloadAction<Register_Post_Field | undefined>) => {
            state.new_register_post_of_create = action.payload;
        },
        set__is_show__edit_register_post_dialog: (state, action: PayloadAction<boolean>) => {
            state.edit_register_post_dialog.is_show = action.payload;
        },
        set__register_post__edit_register_post_dialog: (
            state,
            action: PayloadAction<Register_Post_Field | undefined>
        ) => {
            state.edit_register_post_dialog.register_post = action.payload;
        },
        set__new_register_post__edit_register_post_dialog: (
            state,
            action: PayloadAction<Register_Post_Field | undefined>
        ) => {
            state.edit_register_post_dialog.new_register_post = action.payload;
        },
        set__is_show__delete_register_post_dialog: (state, action: PayloadAction<boolean>) => {
            state.delete_register_post_dialog.is_show = action.payload;
        },
        set__register_post__delete_register_post_dialog: (
            state,
            action: PayloadAction<Register_Post_Field | undefined>
        ) => {
            state.delete_register_post_dialog.register_post = action.payload;
        },
        set__new_register_post__delete_register_post_dialog: (
            state,
            action: PayloadAction<Register_Post_Field | undefined>
        ) => {
            state.delete_register_post_dialog.new_register_post = action.payload;
        },
    },
});

export const {
    set__is_loading,
    set__data__toast_message,
    set__get_register_posts_body,
    set__new_register_post_of_create,
    set__is_show__edit_register_post_dialog,
    set__register_post__edit_register_post_dialog,
    set__new_register_post__edit_register_post_dialog,
    set__is_show__delete_register_post_dialog,
    set__register_post__delete_register_post_dialog,
    set__new_register_post__delete_register_post_dialog,
} = Register_Post_Slice.actions;
export default Register_Post_Slice.reducer;
