import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/TeamDetail/type';
import { Team_Field, Team_Member_Field } from '@src/data_struct/team';
import {
    Shop_Field,
    Depot_Field,
    Store_Field,
    Team_Shop_Field,
    Team_Shop_Depot_Field,
    Team_Shop_Depot_Store_Field,
} from '@src/data_struct/shop';

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

    // shop list dialog
    is_show_shop_list_dialog: false,
    selected_shop: undefined,

    // depot list dialog
    is_show_depot_list_dialog: false,
    selected_depot: undefined,

    // store list dialog
    is_show_store_list_dialog: false,
    selected_store: undefined,

    // team_shop
    selected_team_shop: undefined,

    // team_shop_depot
    selected_team_shop_depot: undefined,

    // team_shop_depot_store
    selected_team_shop_depot_store: undefined,
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

        // shop list dialog
        set__is_show_shop_list_dialog: (state, action: PayloadAction<boolean>) => {
            state.is_show_shop_list_dialog = action.payload;
        },
        set__selected_shop: (state, action: PayloadAction<Shop_Field>) => {
            state.selected_shop = action.payload;
        },

        // depot list dialog
        set__is_show_depot_list_dialog: (state, action: PayloadAction<boolean>) => {
            state.is_show_depot_list_dialog = action.payload;
        },
        set__selected_depot: (state, action: PayloadAction<Depot_Field>) => {
            state.selected_depot = action.payload;
        },

        // store list dialog
        set__is_show_store_list_dialog: (state, action: PayloadAction<boolean>) => {
            state.is_show_store_list_dialog = action.payload;
        },
        set__selected_store: (state, action: PayloadAction<Store_Field>) => {
            state.selected_store = action.payload;
        },

        // team_shop
        set__selected_team_shop: (state, action: PayloadAction<Team_Shop_Field>) => {
            state.selected_team_shop = action.payload;
        },

        // team_shop_depot
        set__selected_team_shop_depot: (state, action: PayloadAction<Team_Shop_Depot_Field>) => {
            state.selected_team_shop_depot = action.payload;
        },

        // team_shop_depot_store
        set__selected_team_shop_depot_store: (state, action: PayloadAction<Team_Shop_Depot_Store_Field>) => {
            state.selected_team_shop_depot_store = action.payload;
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

    // team_member
    set__new_team_member,

    set__is_show_delete_team_member,
    set__selected_delete_team_member,
    set__deleted_team_member,

    // shop list dialog
    set__is_show_shop_list_dialog,
    set__selected_shop,

    // depot list dialog
    set__is_show_depot_list_dialog,
    set__selected_depot,

    // store list dialog
    set__is_show_store_list_dialog,
    set__selected_store,

    // team_shop
    set__selected_team_shop,

    // team_shop_depot
    set__selected_team_shop_depot,

    // team_shop_depot_store
    set__selected_team_shop_depot_store,
} = Team_Detail_Slice.actions;
export default Team_Detail_Slice.reducer;
