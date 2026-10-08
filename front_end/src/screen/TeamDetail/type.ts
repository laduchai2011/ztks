import { Team_Field } from '@src/data_struct/team';

export interface state_props {
    // team
    is_show_delete_team: boolean;
    selected_delete_team?: Team_Field;
    deleted_team?: Team_Field;
    is_show_edit_team: boolean;
    selected_edit_team?: Team_Field;
    edited_team?: Team_Field;
}
