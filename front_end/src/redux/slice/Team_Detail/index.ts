import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/TeamDetail/type';
import { Team_Field, Team_Member_Field } from '@src/data_struct/team';

const initialState: state_props = {
    //common
    team_leader: undefined,

    // team
    is_show_delete_team: false,
    selected_delete_team: undefined,
    deleted_team: undefined,
    is_show_edit_team: false,
    selected_edit_team: undefined,
    edited_team: undefined,

    // team_member
    new_team_member: undefined,

    is_show_delete_team_member: false,
    selected_delete_team_member: undefined,
    deleted_team_member: undefined,
};

const Team_Detail_Slice = createSlice({
    name: 'Team_Detail_Slice',
    initialState,
    reducers: {
        //common
        set__team_leader: (state, action: PayloadAction<Team_Member_Field>) => {
            state.team_leader = action.payload;
        },

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

        // team_member
        set__new_team_member: (state, action: PayloadAction<Team_Member_Field>) => {
            state.new_team_member = action.payload;
        },

        set__is_show_delete_team_member: (state, action: PayloadAction<boolean>) => {
            state.is_show_delete_team_member = action.payload;
        },
        set__selected_delete_team_member: (state, action: PayloadAction<Team_Member_Field>) => {
            state.selected_delete_team_member = action.payload;
        },
        set__deleted_team_member: (state, action: PayloadAction<Team_Member_Field>) => {
            state.deleted_team_member = action.payload;
        },
    },
});

export const {
    //common
    set__team_leader,

    // team
    set__is_show_delete_team,
    set__selected_delete_team,
    set__deleted_team,
    set__is_show_edit_team,
    set__selected_edit_team,
    set__edited_team,

    //team_member
    set__new_team_member,

    set__is_show_delete_team_member,
    set__selected_delete_team_member,
    set__deleted_team_member,
} = Team_Detail_Slice.actions;
export default Team_Detail_Slice.reducer;
