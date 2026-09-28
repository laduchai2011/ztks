import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/ToolBar/type';

const initialState: state_props = {
    is_show: true,
    is_max_show: true,
};

const Tool_Bar_Slice = createSlice({
    name: 'Tool_Bar_Slice',
    initialState,
    reducers: {
        set__is_show: (state, action: PayloadAction<boolean>) => {
            state.is_show = action.payload;
        },
        set__is_max_show: (state, action: PayloadAction<boolean>) => {
            state.is_max_show = action.payload;
        },
    },
});

export const { set__is_show, set__is_max_show } = Tool_Bar_Slice.actions;
export default Tool_Bar_Slice.reducer;
