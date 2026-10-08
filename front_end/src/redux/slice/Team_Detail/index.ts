import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/TeamDetail/type';
import { Team_Field } from '@src/data_struct/team';

const initialState: state_props = {
    // team
    is_show_delete_team: false,
    selected_delete_team: undefined,
    deleted_team: undefined,
    is_show_edit_team: false,
    selected_edit_team: undefined,
    edited_team: undefined,
};

const Team_Detail_Slice = createSlice({
    name: 'Team_Detail_Slice',
    initialState,
    reducers: {
        // team
        set__is_show_delete_team: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_team = action.payload;
        },
        set__selected_delete_team: (state, action: PayloadAction<Team_Field>) => {
            state.selected_delete_team = action.payload;
        },
        set__deleted_team: (state, action: PayloadAction<Team_Field>) => {
            state.deleted_team = action.payload;
        },
        set__is_show_edit_team: (state, action: PayloadAction<boolean>) => {
            state.is_show_edit_team = action.payload;
        },
        set__selected_edit_team: (state, action: PayloadAction<Team_Field>) => {
            state.selected_edit_team = action.payload;
        },
        set__edited_team: (state, action: PayloadAction<Team_Field>) => {
            state.edited_team = action.payload;
        },
    },
});

export const {
    // team
    set__is_show_delete_team,
    set__selected_delete_team,
    set__deleted_team,
    set__is_show_edit_team,
    set__selected_edit_team,
    set__edited_team,
} = Team_Detail_Slice.actions;
export default Team_Detail_Slice.reducer;
