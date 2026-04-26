import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/RegisterPost/type';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';

const initialState: state_props = {
    isLoading: false,
    toastMessage: {
        data: { type: undefined, message: '' },
    },
    getRegisterPostsBody: undefined,
    newRegisterPostOfCreate: undefined,
    editRegisterPostDialog: {
        isShow: false,
        registerPost: undefined,
        newRegisterPost: undefined,
    },
    deleteRegisterPostDialog: {
        isShow: false,
        registerPost: undefined,
        newRegisterPost: undefined,
    },
};

const RegisterPostSlice = createSlice({
    name: 'RegisterPostSlice',
    initialState,
    reducers: {
        set_isLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData_toastMessage: (state, action: PayloadAction<ToastMessage_Data_Props>) => {
            state.toastMessage.data = action.payload;
        },
        set_getRegisterPostsBody: (state, action: PayloadAction<GetRegisterPostsBodyField>) => {
            state.getRegisterPostsBody = action.payload;
        },
        set_newRegisterPostOfCreate: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.newRegisterPostOfCreate = action.payload;
        },
        setIsShow_editRegisterPostDialog: (state, action: PayloadAction<boolean>) => {
            state.editRegisterPostDialog.isShow = action.payload;
        },
        setRegisterPost_editRegisterPostDialog: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.editRegisterPostDialog.registerPost = action.payload;
        },
        setNewRegisterPost_editRegisterPostDialog: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.editRegisterPostDialog.newRegisterPost = action.payload;
        },
        setIsShow_deleteRegisterPostDialog: (state, action: PayloadAction<boolean>) => {
            state.deleteRegisterPostDialog.isShow = action.payload;
        },
        setRegisterPost_deleteRegisterPostDialog: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.deleteRegisterPostDialog.registerPost = action.payload;
        },
        setNewRegisterPost_deleteRegisterPostDialog: (state, action: PayloadAction<RegisterPostField | undefined>) => {
            state.deleteRegisterPostDialog.newRegisterPost = action.payload;
        },
    },
});

export const {
    set_isLoading,
    setData_toastMessage,
    set_getRegisterPostsBody,
    set_newRegisterPostOfCreate,
    setIsShow_editRegisterPostDialog,
    setRegisterPost_editRegisterPostDialog,
    setNewRegisterPost_editRegisterPostDialog,
    setIsShow_deleteRegisterPostDialog,
    setRegisterPost_deleteRegisterPostDialog,
    setNewRegisterPost_deleteRegisterPostDialog,
} = RegisterPostSlice.actions;
export default RegisterPostSlice.reducer;
