import { Team_Field, Team_Member_Field } from '@src/data_struct/team';
import {
    Shop_Field,
    Depot_Field,
    Store_Field,
    Team_Shop_Field,
    Team_Shop_Depot_Field,
    Team_Shop_Depot_Store_Field,
} from '@src/data_struct/shop';

export interface state_props {
    // common
    team_leader?: Team_Member_Field;

    // team
    is_show_delete_team: boolean;
    selected_delete_team?: Team_Field;
    deleted_team?: Team_Field;
    is_show_edit_team: boolean;
    selected_edit_team?: Team_Field;
    edited_team?: Team_Field;

    // team_member
    new_team_member?: Team_Member_Field;

    is_show_delete_team_member: boolean;
    selected_delete_team_member?: Team_Member_Field;
    deleted_team_member?: Team_Member_Field;

    // shop list dialog
    is_show_shop_list_dialog: boolean;
    selected_shop?: Shop_Field;

    // depot list dialog
    is_show_depot_list_dialog: boolean;
    selected_depot?: Depot_Field;

    // store list dialog
    is_show_store_list_dialog: boolean;
    selected_store?: Store_Field;

    // team_shop
    selected_team_shop?: Team_Shop_Field;

    // team_shop_depot
    selected_team_shop_depot?: Team_Shop_Depot_Field;

    // team_shop_depot_store
    selected_team_shop_depot_store?: Team_Shop_Depot_Store_Field;
}
