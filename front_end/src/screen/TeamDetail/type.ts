import { Team_Field, Team_Member_Field } from '@src/data_struct/team';

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
}
